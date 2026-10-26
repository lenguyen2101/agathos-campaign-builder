/* ============================================================================
   Agathos — financial report (/financial-report).
   The two reports of the "Agathos Financial Reports" sheet in
   "Agathos Financial Report Reconcilation.xlsx":
     #/transactions  1. Transaction Report (all trx), one project/event, one payout period
     #/payouts       2. Summary Payout Report, one PSP settlement period, grouped by project/event
   Owner view (default): what a project/event owner sees. It leaves out what only
   Agathos should see: margin, Agathos income, other PSP charges, PSP ids and model.
   Agathos admin view (Demo panel): every column of the sheet.
   All figures are sample data built with the fee rules in the sheets Intro and DB Table.
   ============================================================================ */
(function(){
'use strict';

var TODAY='2026-10-26';
var ORG={name:'Antioch21', bank:'DBS ••••4821', user:'Josias Ding'};
var STORE='agathos.finreport.v1';

/* PSP lag = days from the end of a period to the PSP payout (sample) */
var PSP={
  stripe:{name:'Stripe', lag:3, mid:'—'},
  '2c2p':{name:'2c2p', lag:5, mid:'JT01-118204'},
  axs:{name:'AXS', lag:2, mid:'AXS-551870'}
};
var MODEL={master:'Master merchant', connect:'Connect (split)', direct:'Direct merchant'};

/* ben = benTip% configured on the project; tip = share of donors who add a love gift */
var PROJECTS=[
  {id:'erbil',    name:'Special Needs Centre in Erbil',         kind:'project', org:'Antioch21', psp:'stripe', model:'master',  ben:.05, tip:.6, n:9},
  {id:'outreach', name:'Outreach @ displaced families',          kind:'project', org:'Antioch21', psp:'stripe', model:'master',  ben:.05, tip:.5, n:6},
  {id:'concert',  name:'Benefit concert for the unseen',         kind:'event',   org:'Antioch21', psp:'2c2p',   model:'master',  ben:.03, tip:0,  n:12},
  {id:'bible',    name:'A Bible Movement in Every Language',     kind:'project', org:'Antioch21', psp:'axs',    model:'direct',  ben:.05, tip:.4, n:7},
  /* other organizations: only in the Agathos admin view */
  {id:'wells',    name:'Clean water wells · Mekong delta',       kind:'project', org:'Living Waters', psp:'stripe', model:'connect', ben:.05, tip:.5, n:8},
  {id:'clinics',  name:'Mobile clinics for remote villages',     kind:'project', org:'The Treasure Box Singapore', psp:'stripe', model:'master', ben:.04, tip:.5, n:7},
  {id:'run',      name:'Run for Hope 10K',                       kind:'event',   org:'The Treasure Box Singapore', psp:'2c2p', model:'master', ben:.03, tip:0, n:14},
  {id:'gala',     name:'Charity Gala Dinner 2026',               kind:'event',   org:'Living Waters', psp:'2c2p', model:'master', ben:.03, tip:0, n:6},
  {id:'widows',   name:'Support for widows · grief counselling', kind:'project', org:'The Treasure Box Singapore', psp:'axs', model:'direct', ben:.05, tip:.4, n:5}
];

var PERIODS=[
  {id:'2026-08a', from:'2026-08-01', to:'2026-08-15'},
  {id:'2026-08b', from:'2026-08-16', to:'2026-08-31'},
  {id:'2026-09a', from:'2026-09-01', to:'2026-09-15'},
  {id:'2026-09b', from:'2026-09-16', to:'2026-09-30'},
  {id:'2026-10a', from:'2026-10-01', to:'2026-10-15'}
];

/* ---------- helpers ---------- */
function h(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function c2(x){ return Math.round(x*100)/100; }
function sum(rows, k){ return c2(rows.reduce(function(a,r){ return a+r[k]; }, 0)); }
function money(x){ var v=Math.abs(x).toLocaleString('en-SG',{minimumFractionDigits:2, maximumFractionDigits:2}); return (x<0?'−':'')+'S$'+v; }
function num(x){ return (x<0?'−':'')+Math.abs(x).toLocaleString('en-SG',{minimumFractionDigits:2, maximumFractionDigits:2}); }
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function d(iso){ var p=iso.slice(0,10).split('-'); return {y:+p[0], m:+p[1], d:+p[2]}; }
function fmtDate(iso){ var x=d(iso); return x.d+' '+MON[x.m-1]+' '+x.y; }
function fmtShort(iso){ var x=d(iso); return x.d+' '+MON[x.m-1]; }
function fmtDT(iso){ return fmtDate(iso)+', '+iso.slice(11,16); }
function addDays(iso, n){ var x=d(iso), t=new Date(Date.UTC(x.y, x.m-1, x.d+n)); return t.toISOString().slice(0,10); }
function periodLabel(p){ var a=d(p.from), b=d(p.to); return a.d+'–'+b.d+' '+MON[b.m-1]+' '+b.y; }
function period(id){ return PERIODS.filter(function(p){ return p.id===id; })[0]; }
function project(id){ return PROJECTS.filter(function(p){ return p.id===id; })[0]; }
function pspPayout(psp, per){ return addDays(per.to, PSP[psp].lag); }
/* sample: one fixed date for every PSP (25th for the first half, 10th of next month for the second) */
function agathosPayout(per){ var b=d(per.to); return b.d<=15 ? per.to.slice(0,8)+'25' : addDays(per.to, 10); }

function rng(seed){ return function(){ seed=seed+0x6D2B79F5|0; var t=Math.imul(seed^seed>>>15, 1|seed); t=t+Math.imul(t^t>>>7, 61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function hash(s){ var x=2166136261; for(var i=0;i<s.length;i++){ x^=s.charCodeAt(i); x=Math.imul(x,16777619); } return x>>>0; }
function pick(r, a){ return a[Math.floor(r()*a.length)]; }
function code(r, n, chars){ var s=''; for(var i=0;i<n;i++) s+=chars[Math.floor(r()*chars.length)]; return s; }

/* ---------- fee rules (sheets Intro and DB Table) ----------
   mf    = fee Agathos charges the merchant (fixed rate)
   fee   = actual PSP fee on the whole charge, love gift included
   onTrx = actual PSP fee on the receiving amount only
   margin = mf - onTrx (extra card fee kept by Agathos) */
function fees(psp, method, intl, R, tip){
  var g=R+tip, card=method!=='PayNow', rate, mf, fee, onTrx;
  if(psp==='stripe'){
    if(card){ rate=intl?.039:.034; mf=.039*R+.5; fee=rate*g+.5; onTrx=rate*R+.5; }
    else { mf=.013*R*1.09; fee=.013*g*1.09; onTrx=mf; }
  } else if(psp==='2c2p'){
    if(card){ rate=intl?.034:.028; mf=(.034*R+.2)*1.09; fee=(rate*g+.2)*1.09; onTrx=(rate*R+.2)*1.09; }
    else { mf=.008*R*1.09; fee=.008*g*1.09; onTrx=mf; }
  } else {
    rate=card?(intl?.028:.012):.004; mf=.016*R+.2; fee=rate*g; onTrx=rate*R;
  }
  return {mf:c2(mf), fee:c2(fee), onTrx:c2(onTrx)};
}

var METHODS={stripe:['Card','Card','Card','PayNow','PayNow'], '2c2p':['Card','Card','Apple Pay','Google Pay','PayNow'], axs:['PayNow','PayNow','Card']};
var GIFTS=[20,30,50,50,80,100,100,150,200,250,300,500,1000];
var TICKETS=[35,35,60,60,120];

function buildRows(p, per){
  var r=rng(hash(p.id+per.id)), n=p.n+Math.floor(r()*5)-2, out=[];
  var span=d(per.to).d-d(per.from).d+1, pp=pspPayout(p.psp, per);
  for(var i=0;i<n;i++){
    var day=addDays(per.from, Math.floor(r()*span));
    var t=String(7+Math.floor(r()*16)).padStart(2,'0')+':'+String(Math.floor(r()*60)).padStart(2,'0');
    var method=pick(r, METHODS[p.psp]), intl=method!=='PayNow' && r()<.15;
    var R=p.kind==='event' ? pick(r,TICKETS)*pick(r,[1,1,2,2,4]) : pick(r,GIFTS);
    var tip=p.tip && r()<p.tip ? c2(R*pick(r,[.05,.1,.12])) : 0;
    var f=fees(p.psp, method, intl, R, tip), ben=c2(R*p.ben);
    /* 2c2p keeps the beneficiary love gift inside the finalized amount (DB Table: net_to_merchant) */
    var finRecv=p.psp==='2c2p' ? c2(R-f.mf) : c2(R-f.mf-ben);
    var netM=p.psp==='2c2p' ? c2(finRecv-ben) : finRecv;
    var ref=p.psp==='stripe' ? 'ch_3Q'+code(r,14,'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789') : p.psp==='2c2p' ? code(r,16,'0123456789') : 'AXS'+code(r,12,'0123456789');
    out.push({
      at:day+'T'+t, ref:ref, method:method, recv:R, ben:ben, finRecv:finRecv,
      tip:tip, finTip:p.psp==='2c2p' ? null : c2(tip-(f.fee-f.onTrx)),
      fee:f.fee, margin:c2(f.mf-f.onTrx), netM:netM, gross:c2(R+tip), netA:c2(R+tip-netM-f.fee),
      payFee:c2(R-netM-ben), pspDate:pp, agDate:p.model==='master' ? agathosPayout(per) : null, p:p
    });
  }
  return out.sort(function(a,b){ return a.at<b.at ? 1 : -1; });
}
var CACHE={};
function rows(pid, perId){ var k=pid+'|'+perId; return CACHE[k] || (CACHE[k]=buildRows(project(pid), period(perId))); }

/* Stripe bills these on the platform account (sheet Agathos Financial Reports, row 45); sample amounts */
function otherCharges(psp, perId){
  if(psp!=='stripe') return null;
  var con=PROJECTS.filter(function(p){ return p.psp==='stripe' && p.model==='connect'; });
  var vol=0, net=0;
  con.forEach(function(p){ var rs=rows(p.id, perId); vol+=sum(rs,'gross'); net+=sum(rs,'netM'); });
  var items=[['Account Volume Billing', c2(vol*.0025)], ['Active Account Billing', c2(2*con.length)], ['Payout Fee', c2(net*.0025+.25*con.length)]];
  return {items:items, total:c2(items.reduce(function(a,x){ return a+x[1]; }, 0))};
}

/* ---------- state ---------- */
var S={view:'owner', project:'erbil', period:'2026-10a', psp:'stripe', pperiod:'2026-10a', page:1};
try{ var saved=JSON.parse(localStorage.getItem(STORE)||'null'); if(saved && saved.view==='admin') S.view='admin'; }catch(e){}
function saveView(){ try{ localStorage.setItem(STORE, JSON.stringify({view:S.view})); }catch(e){} }
function admin(){ return S.view==='admin'; }
function visible(){ return PROJECTS.filter(function(p){ return admin() || p.org===ORG.name; }); }
function tab(){ return location.hash==='#/payouts' ? 'payouts' : 'transactions'; }

/* ---------- icons ---------- */
var I={
  check:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10.5l3.2 3L15 6.5"/></svg>',
  clock:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10" cy="10" r="7.5"/><path d="M10 6v4l2.5 2"/></svg>',
  arrow:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M11 5l5 5-5 5"/></svg>',
  down:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5v9M6 9l4 4 4-4M4 16.5h12"/></svg>',
  plus:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 4.5v11M4.5 10h11"/></svg>'
};

/* ---------- pieces ---------- */
function selectField(label, key, opts, val){
  return '<div class="ob-field"><label for="f-'+key+'">'+label+'</label><select class="ob-input" id="f-'+key+'" data-f="'+key+'">'+opts.map(function(o){
    if(o.group) return '<optgroup label="'+h(o.group)+'">'+o.items.map(function(x){ return '<option value="'+h(x[0])+'"'+(x[0]===val?' selected':'')+'>'+h(x[1])+'</option>'; }).join('')+'</optgroup>';
    return '<option value="'+h(o[0])+'"'+(o[0]===val?' selected':'')+'>'+h(o[1])+'</option>';
  }).join('')+'</select></div>';
}
function periodOpts(){ return PERIODS.slice().reverse().map(function(p){ return [p.id, periodLabel(p)]; }); }
function projectOpts(){
  var list=visible();
  if(admin()){
    var orgs=[]; list.forEach(function(p){ if(orgs.indexOf(p.org)<0) orgs.push(p.org); });
    return orgs.map(function(o){ return {group:o, items:list.filter(function(p){ return p.org===o; }).map(function(p){ return [p.id, p.name]; })}; });
  }
  return [{group:'Projects', items:list.filter(function(p){ return p.kind==='project'; }).map(function(p){ return [p.id, p.name]; })},
          {group:'Events', items:list.filter(function(p){ return p.kind==='event'; }).map(function(p){ return [p.id, p.name]; })}];
}

/* hero: the summary section, the first thing on each report */
function hero(o){
  var total=o.segs.reduce(function(a,s){ return a+Math.max(0,s[1]); }, 0) || 1;
  return '<section class="fr-hero">'+
    '<div class="fr-hero-main">'+
      '<div class="lbl">'+o.label+'</div>'+
      '<div class="big">'+money(o.value)+'</div>'+
      '<div class="sub">'+o.sub+'</div>'+
      '<div class="fr-bar" role="img" aria-label="'+h(o.segs.map(function(s){ return s[0]+' '+money(s[1]); }).join(', '))+'">'+o.segs.map(function(s){ return '<i class="'+s[2]+'" style="width:'+(Math.max(0,s[1])/total*100).toFixed(2)+'%"></i>'; }).join('')+'</div>'+
      '<ul class="fr-legend">'+o.segs.map(function(s){ return '<li><i class="'+s[2]+'"></i>'+s[0]+'</li>'; }).join('')+'</ul>'+
    '</div>'+
    '<dl class="fr-rows">'+o.rows.map(function(r){ return '<div class="'+(r[2]||'')+'"><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>'; }).join('')+'</dl>'+
  '</section>';
}
function payStatus(date, payer){
  var done=date<=TODAY;
  return '<span class="st '+(done?'ok':'up')+'">'+(done?I.check+'Paid':I.clock+'Upcoming')+'</span>'+h(payer)+(done?' paid ':' pays ')+h(ORG.bank)+' on '+fmtDate(date);
}

/* columns: [header, value(row), type] ; type n = money, d = date, dt = date & time, c = code */
var COLS_OWNER=[
  ['Date & time', function(r){ return r.at; }, 'dt'],
  ['Reference', function(r){ return r.ref; }, 'c'],
  ['Payment method', function(r){ return r.method; }],
  ['Amount', function(r){ return r.recv; }, 'n'],
  ['Agathos platform fee', function(r){ return -r.ben; }, 'n'],
  ['Payment fees', function(r){ return -r.payFee; }, 'n'],
  ['Net to you', function(r){ return r.netM; }, 'n', 'net']
];
var COLS_ADMIN=[
  ['Transaction Date & Time', function(r){ return r.at; }, 'dt'],
  ['Transaction Reference', function(r){ return r.ref; }, 'c'],
  ['Payment Method', function(r){ return r.method; }],
  ['Receiving Currency', function(){ return 'SGD'; }],
  ['Receiving Amount', function(r){ return r.recv; }, 'n'],
  ['Beneficiary Love Gift Amount', function(r){ return r.ben; }, 'n'],
  ['Finalized Receiving Amount', function(r){ return r.finRecv; }, 'n'],
  ['Donor Love Gift Amount', function(r){ return r.p.psp==='2c2p' ? null : r.tip; }, 'n'],
  ['Finalized Donor Love Gift Amount', function(r){ return r.finTip; }, 'n'],
  ['Fees (PSP charges)', function(r){ return r.fee; }, 'n'],
  ['Agathos Margin', function(r){ return r.margin; }, 'n'],
  ['Net to Agathos', function(r){ return r.netA; }, 'n'],
  ['Net to Merchant', function(r){ return r.netM; }, 'n', 'net'],
  ['PSP Payout Date', function(r){ return r.pspDate; }, 'd'],
  ['PSP name', function(r){ return PSP[r.p.psp].name; }],
  ['PSP merchant id', function(r){ return PSP[r.p.psp].mid; }],
  ['PSP model', function(r){ return MODEL[r.p.model]; }],
  ['Agathos Payout Date', function(r){ return r.agDate; }, 'd']
];
function cell(c, r){
  var v=c[1](r);
  if(v==null) return '—';
  if(c[2]==='n') return num(v);
  if(c[2]==='d') return fmtDate(v);
  if(c[2]==='dt') return fmtDT(v);
  if(c[2]==='c') return '<code>'+h(v)+'</code>';
  return h(v);
}
function plain(c, r){
  var v=c[1](r);
  if(v==null) return '';
  if(c[2]==='n') return v.toFixed(2);
  if(c[2]==='dt') return v.replace('T',' ');
  return String(v);
}

var PER_PAGE=10;
function table(cols, list, opt){
  var pages=Math.max(1, Math.ceil(list.length/PER_PAGE));
  if(S.page>pages) S.page=pages;
  var start=(S.page-1)*PER_PAGE, slice=list.slice(start, start+PER_PAGE);
  var head='<tr>'+cols.map(function(c){ return '<th'+(c[2]==='n'?' class="n"':'')+'>'+c[0]+'</th>'; }).join('')+'</tr>';
  var body=slice.map(function(r){ return '<tr>'+cols.map(function(c){ return '<td class="'+(c[2]==='n'?'n ':'')+(c[3]||'')+'">'+cell(c,r)+'</td>'; }).join('')+'</tr>'; }).join('');
  /* phone: one card per transaction, the rest of the columns behind "Details" */
  var main=cols.filter(function(c){ return c[3]==='net'; })[0];
  var cards=slice.map(function(r){
    return '<div class="fr-item"><div class="r1"><span>'+fmtDT(r.at)+'</span><b>'+money(r.recv)+'</b></div>'+
      '<div class="r2"><span>'+h(r.method)+'</span><span class="net">'+main[0]+' '+money(main[1](r))+'</span></div>'+
      '<details><summary>Details</summary><dl>'+cols.map(function(c){ return '<div><dt>'+c[0]+'</dt><dd>'+cell(c,r)+'</dd></div>'; }).join('')+'</dl></details></div>';
  }).join('');
  var pager=list.length>PER_PAGE ? '<div class="fr-pager"><span>'+(start+1)+'–'+(start+slice.length)+' of '+list.length+'</span><div>'+
    '<button type="button" data-act="page" data-p="'+(S.page-1)+'"'+(S.page<=1?' disabled':'')+'>Previous</button>'+
    '<button type="button" data-act="page" data-p="'+(S.page+1)+'"'+(S.page>=pages?' disabled':'')+'>Next</button></div></div>' : '';
  return '<section class="fr-card fr-list'+(opt.wide?' wide':'')+'">'+
    '<div class="fr-sec-head"><h3>Transactions <span class="n">'+list.length+'</span></h3><button class="ob-btn ghost sm" type="button" data-act="csv">'+I.down+'Download CSV</button></div>'+
    (list.length ? '<div class="fr-table-wrap"><table class="fr-table"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div><div class="fr-cards">'+cards+'</div>'+pager
                 : '<div class="fr-empty">No transactions in this period.</div>')+
  '</section>';
}

/* ---------- 1. Transactions ---------- */
function viewTransactions(){
  var p=project(S.project), per=period(S.period), list=rows(p.id, per.id), psp=PSP[p.psp];
  var filters='<div class="fr-filters">'+selectField('Project or event','project',projectOpts(),S.project)+selectField('Payout period','period',periodOpts(),S.period)+'</div>';
  var out=filters, segs, h1;
  if(admin()){
    var gross=sum(list,'gross'), fee=sum(list,'fee'), toA=sum(list,'netA'), toM=sum(list,'netM');
    out+=hero({
      label:'Total trx amount', value:gross,
      sub:psp.name+' · '+MODEL[p.model]+' · PSP payout '+fmtDate(pspPayout(p.psp, per)),
      segs:[['Payout to merchant',toM,'s-net'],['Payout to Agathos',toA,'s-plat'],['PSP fees',fee,'s-fee']],
      rows:[['Payout period',periodLabel(per)],['Total Trx Amt',money(gross)],['Total PSP Fees',money(fee)],['Total Payout to Agathos',money(toA)],['Total Payout to Merchant',money(toM),'total'],
            ['Agathos to Merchant payout date', p.model==='master' ? fmtDate(agathosPayout(per)) : '<span class="na">Master merchant only</span>']]
    });
  } else {
    var recv=sum(list,'recv'), ben=sum(list,'ben'), pay=sum(list,'payFee'), net=sum(list,'netM');
    var payDate=p.model==='master' ? agathosPayout(per) : pspPayout(p.psp, per);
    out+=hero({
      label:'Net to you', value:net,
      sub:payStatus(payDate, p.model==='master'?'Agathos':psp.name),
      segs:[['Net to you',net,'s-net'],['Agathos platform fee',ben,'s-plat'],['Payment fees',pay,'s-fee']],
      rows:[['Payout period',periodLabel(per)],['Received <small>'+list.length+' transactions</small>',money(recv)],['Agathos platform fee','−'+money(ben)],['Payment fees','−'+money(pay)],['Net to you',money(net),'total']]
    });
  }
  out+='<div class="fr-grid2">'+steps(p, per)+shortcut(p, per)+'</div>';
  out+=table(admin()?COLS_ADMIN:COLS_OWNER, list, {wide:admin()});
  return out;
}

/* how one payout travels: master merchant goes through Agathos, the others are paid by the PSP */
function steps(p, per){
  var psp=PSP[p.psp].name, s=[[periodLabel(per), p.kind==='event'?'Tickets are sold':'Donations come in', per.to]];
  if(p.model==='master'){ s.push([fmtDate(pspPayout(p.psp, per)), psp+' pays Agathos', pspPayout(p.psp, per)]); s.push([fmtDate(agathosPayout(per)), 'Agathos pays '+(admin()?'the merchant':ORG.bank), agathosPayout(per)]); }
  else s.push([fmtDate(pspPayout(p.psp, per)), psp+' pays '+(admin()?'the merchant':ORG.bank), pspPayout(p.psp, per)]);
  return '<section class="fr-card fr-steps-card"><h3>How this payout reaches '+(admin()?'the merchant':'you')+'</h3><ol class="fr-steps n'+s.length+'">'+s.map(function(x){
    return '<li class="'+(x[2]<=TODAY?'done':'')+'"><span class="dot">'+(x[2]<=TODAY?I.check:'')+'</span><b>'+x[0]+'</b><span>'+x[1]+'</span></li>';
  }).join('')+'</ol></section>';
}
function shortcut(p, per){
  var group=visible().filter(function(x){ return x.psp===p.psp; });
  var net=c2(group.reduce(function(a,x){ return a+sum(rows(x.id, per.id),'netM'); }, 0));
  var label=group.length===1 ? '1 '+group[0].kind : group.length+' projects and events';
  if(group.every(function(x){ return x.kind==='project'; })) label=group.length+(group.length===1?' project':' projects');
  return '<a class="fr-card fr-shortcut" href="#/payouts" data-act="toPayouts" data-psp="'+p.psp+'" data-per="'+per.id+'">'+
    '<div class="hp-kicker">Payout summary</div>'+
    '<b>'+PSP[p.psp].name+' · '+periodLabel(per)+'</b>'+
    '<p>'+label+' · '+money(net)+(admin()?' to merchants':' to you')+'</p>'+
    '<span class="go">See payout summary '+I.arrow+'</span></a>';
}

/* ---------- 2. Payouts ---------- */
function viewPayouts(){
  var mine=visible(), psps=Object.keys(PSP).filter(function(k){ return mine.some(function(p){ return p.psp===k; }); });
  if(psps.indexOf(S.psp)<0) S.psp=psps[0];
  var per=period(S.pperiod), group=mine.filter(function(p){ return p.psp===S.psp; });
  var data=group.map(function(p){ var rs=rows(p.id, per.id); return {p:p, n:rs.length, gross:sum(rs,'gross'), recv:sum(rs,'recv'), fee:sum(rs,'fee'), netA:sum(rs,'netA'), netM:sum(rs,'netM'), ben:sum(rs,'ben'), pay:sum(rs,'payFee')}; });
  function tot(k){ return c2(data.reduce(function(a,x){ return a+x[k]; }, 0)); }
  var hasMaster=group.some(function(p){ return p.model==='master'; });
  var out='<div class="fr-filters">'+selectField('Payment provider','psp',psps.map(function(k){ return [k, PSP[k].name]; }),S.psp)+selectField('Payout period','pperiod',periodOpts(),S.pperiod)+'</div>';
  var cols, foot;
  if(admin()){
    var oc=otherCharges(S.psp, per.id), other=oc?oc.total:0, toA=c2(tot('netA')-other);
    out+=hero({
      label:'Total trx amount', value:tot('gross'),
      sub:PSP[S.psp].name+' · PSP payout '+fmtDate(pspPayout(S.psp, per)),
      segs:[['Payout to merchants',tot('netM'),'s-net'],['Payout to Agathos',toA,'s-plat'],['PSP trx fees',tot('fee'),'s-fee'],['Other PSP charges',other,'s-other']],
      rows:[['Payout period',periodLabel(per)],['Total Trx Amt',money(tot('gross'))],['Total PSP trx Fees',money(tot('fee'))],
            ['Other PSP charges'+(oc?'<small>'+oc.items.map(function(x){ return x[0]+' '+money(x[1]); }).join(' · ')+'</small>':''), oc?money(other):'<span class="na">None</span>'],
            ['Total Payout to Agathos',money(toA)],['Total Payout to Merchant',money(tot('netM')),'total'],
            ['Agathos to Merchant payout date', hasMaster ? fmtDate(agathosPayout(per)) : '<span class="na">Master merchant only</span>']]
    });
    cols=[['Project/Event','p'],['Total Trx Amt','gross'],['Total PSP trx Fees','fee'],['Total Net to Agathos','netA'],['Total Net to Merchant','netM']];
  } else {
    var payDate=hasMaster ? agathosPayout(per) : pspPayout(S.psp, per);
    out+=hero({
      label:'Net to you', value:tot('netM'),
      sub:payStatus(payDate, hasMaster?'Agathos':PSP[S.psp].name),
      segs:[['Net to you',tot('netM'),'s-net'],['Agathos platform fee',tot('ben'),'s-plat'],['Payment fees',tot('pay'),'s-fee']],
      rows:[['Payout period',periodLabel(per)],['Received',money(tot('recv'))],['Agathos platform fee','−'+money(tot('ben'))],['Payment fees','−'+money(tot('pay'))],['Net to you',money(tot('netM')),'total']]
    });
    cols=[['Project/Event','p'],['Received','recv'],['Fees','fees'],['Net to you','netM']];
  }
  function val(x, k){ return k==='fees' ? -c2(x.ben+x.pay) : x[k]; }
  var body=data.map(function(x){
    return '<tr>'+cols.map(function(c){
      if(c[1]==='p') return '<td><a href="#/transactions" data-act="toTrx" data-id="'+x.p.id+'" data-per="'+per.id+'"><b>'+h(x.p.name)+'</b><span>'+(admin()?h(x.p.org)+' · ':'')+(x.p.kind==='event'?'Event':'Project')+' · '+x.n+' transactions</span></a></td>';
      return '<td class="n'+(c[1]==='netM'?' net':'')+'">'+num(val(x,c[1]))+'</td>';
    }).join('')+'</tr>';
  }).join('');
  foot='<tr>'+cols.map(function(c){ return c[1]==='p' ? '<td>Total</td>' : '<td class="n">'+num(c[1]==='fees' ? -c2(tot('ben')+tot('pay')) : tot(c[1]))+'</td>'; }).join('')+'</tr>';
  var cards=data.map(function(x){
    return '<a class="fr-item link" href="#/transactions" data-act="toTrx" data-id="'+x.p.id+'" data-per="'+per.id+'"><div class="r1"><span><b>'+h(x.p.name)+'</b></span>'+I.arrow+'</div>'+
      '<dl>'+cols.slice(1).map(function(c){ return '<div><dt>'+c[0]+'</dt><dd>'+num(val(x,c[1]))+'</dd></div>'; }).join('')+'</dl></a>';
  }).join('');
  out+='<section class="fr-card fr-list"><div class="fr-sec-head"><h3>By project and event <span class="n">'+data.length+'</span></h3></div>'+
    '<div class="fr-table-wrap"><table class="fr-table by"><thead><tr>'+cols.map(function(c){ return '<th'+(c[1]==='p'?'':' class="n"')+'>'+c[0]+'</th>'; }).join('')+'</tr></thead><tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table></div>'+
    '<div class="fr-cards">'+cards+'</div></section>';
  return out;
}

/* ---------- page ---------- */
function render(){
  var mine=visible();
  if(!mine.some(function(p){ return p.id===S.project; })) S.project=mine[0].id;
  var t=tab();
  var head='<div class="fr-head"><div class="top"><span class="hp-kicker">'+(admin()?'Agathos admin':h(ORG.name))+'</span><span class="fr-sample">Sample data</span></div>'+
    '<h1>Financial report</h1><p>'+(admin()?'Every transaction, reconciled with the payment provider\'s settlement file.':'What came in, what was charged, and when it reaches your bank.')+'</p></div>';
  var tabs='<nav class="fr-tabs" aria-label="Reports"><a href="#/transactions"'+(t==='transactions'?' class="on" aria-current="page"':'')+'>Transactions</a><a href="#/payouts"'+(t==='payouts'?' class="on" aria-current="page"':'')+'>Payouts</a></nav>';
  document.getElementById('fr').innerHTML='<div class="fr-wrap'+(admin()?' is-admin':'')+'">'+head+tabs+(t==='payouts'?viewPayouts():viewTransactions())+'</div>';
  renderNav(); renderDemo();
}

function renderNav(){
  var name=admin()?'Agathos Finance':ORG.user, av=admin()?'AF':'JD';
  document.getElementById('nav-auth').innerHTML='<a class="create" href="onboarding.html#/begin">'+I.plus+'Create</a>'+
    '<a class="user" href="onboarding.html#/dashboard"><span class="av">'+av+'</span><span class="nm">'+h(name)+'</span></a>'+
    '<button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-menu"><i></i><i></i><i></i></button>';
}

function renderDemo(){
  var el=document.getElementById('fr-demo'), open=el.classList.contains('open');
  function opt(v, t, s){ return '<label><input type="radio" name="fr-view" value="'+v+'"'+(S.view===v?' checked':'')+'><div>'+t+'<span>'+s+'</span></div></label>'; }
  el.innerHTML='<button type="button" data-act="demo"><i></i>Demo</button><div class="panel"><h4>View as</h4>'+
    opt('owner','Project/Event owner','Antioch21: 3 projects and 1 event')+
    opt('admin','Agathos admin','Every organization and every column of the report')+
    '<div class="try"><b>Sample data</b>Amounts follow the fee rules in the reconciliation spec. Payout dates are examples.</div></div>';
  el.classList.toggle('open', open);
}

var toastT;
function toast(msg){ var t=document.getElementById('fr-toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(function(){ t.classList.remove('show'); }, 2200); }

function downloadCSV(){
  var p=project(S.project), cols=admin()?COLS_ADMIN:COLS_OWNER, list=rows(p.id, S.period);
  var esc=function(s){ s=String(s); return /[",\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; };
  var csv=[cols.map(function(c){ return esc(c[0]); }).join(',')].concat(list.map(function(r){ return cols.map(function(c){ return esc(plain(c,r)); }).join(','); })).join('\n');
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download=p.id+'-'+S.period+'.csv';
  document.body.appendChild(a); a.click(); a.remove();
  toast('CSV downloaded');
}

/* ---------- events ---------- */
var ACT={
  demo:function(){ document.getElementById('fr-demo').classList.toggle('open'); },
  page:function(t){ S.page=+t.getAttribute('data-p'); render(); var l=document.querySelector('.fr-list'); if(l) l.scrollIntoView({block:'start'}); },
  csv:downloadCSV,
  toPayouts:function(t){ S.psp=t.getAttribute('data-psp'); S.pperiod=t.getAttribute('data-per'); go('#/payouts'); },
  toTrx:function(t){ S.project=t.getAttribute('data-id'); S.period=t.getAttribute('data-per'); S.page=1; go('#/transactions'); }
};
function go(hash){ if(location.hash===hash) render(); else location.hash=hash; window.scrollTo(0,0); }

document.addEventListener('click', function(ev){
  var t=ev.target.closest('[data-act]');
  if(t && ACT[t.getAttribute('data-act')]){ ev.preventDefault(); ACT[t.getAttribute('data-act')](t); return; }
  var demo=document.getElementById('fr-demo'); if(demo.classList.contains('open') && !demo.contains(ev.target)) demo.classList.remove('open');
});
document.addEventListener('change', function(ev){
  var el=ev.target;
  if(el.hasAttribute('data-f')){ S[el.getAttribute('data-f')]=el.value; S.page=1; render(); return; }
  if(el.name==='fr-view'){ S.view=el.value; S.page=1; saveView(); render(); toast(admin()?'Agathos admin view':'Owner view'); }
});
window.addEventListener('hashchange', function(){ S.page=1; render(); });

/* nav (same behaviour as the homepage) */
(function(){
  var nav=document.getElementById('nav');
  window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY>20); }, {passive:true});
  nav.addEventListener('click', function(ev){
    var b=ev.target.closest('.burger'); if(!b) return;
    var open=nav.classList.toggle('open'); b.setAttribute('aria-expanded', open?'true':'false');
  });
  nav.querySelectorAll('.hp-nav-menu a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); }); });
})();

render();
})();
