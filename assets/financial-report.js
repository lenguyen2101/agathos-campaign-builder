/* ============================================================================
   Agathos — financial report, version 2 (/financial-report).
   v1 (commit 62edf78) reworked after the team's feedback of 29/10/2026 and the
   Orders & Payouts ideas from Figma:
     #/project/transactions  #/project/payouts   Manage Project › Transactions & Payouts
     #/event/orders          #/event/payouts     Manage Event › Orders & Payouts (new tab)
     #/ipc/transactions      #/ipc/payouts       an IPC charity on AXS: AXS pays the charity,
                                                 Agathos invoices its love gifts
   Nav, breadcrumb, left menu, card, buttons and pills are rebuilt from production
   screenshots (1728px screen, 1216px content). Everything inside the card is new.
   Sample data: one payout a month, on the 20th of the next month. Today is 29 Oct 2026.
   ============================================================================ */
(function(){
'use strict';

var TODAY='2026-10-29';
var UPLOADED='2026-10-25';   /* last day covered by the payment data uploaded so far */
var BANK='DBS ••••4821';

var PROJECTS={
  erbil:   {id:'erbil',    name:'Special Needs Centre in Erbil',  kind:'project', psp:'stripe', ben:.05, tip:.6, n:12, from:'2025-11'},
  outreach:{id:'outreach', name:'Outreach @ displaced families',  kind:'project', psp:'stripe', ben:.05, tip:.5, n:7,  from:'2026-03'},
  concert: {id:'concert',  name:'Benefit concert for the unseen', kind:'event',   psp:'2c2p',   ben:.03, tip:0,  n:18, from:'2026-08'},
  sunny:   {id:'sunny',    name:'Sunny Days for Seniors',         kind:'project', psp:'axs', ipc:true, ben:.05, tip:.4, n:10, from:'2026-01'}
};
/* Antioch21 gets one bank transfer per payout date for all three; the IPC project belongs to another charity */
var ORG_IDS=['erbil','outreach','concert'];

var SCN={
  project:{pid:'erbil',   label:'Manage Project',    tabs:[['transactions','Transactions'],['payouts','Payouts']]},
  event:  {pid:'concert', label:'Manage Event',      tabs:[['orders','Orders'],['payouts','Payouts']]},
  ipc:    {pid:'sunny',   label:'IPC charity (AXS)', tabs:[['transactions','Transactions'],['payouts','Payouts']]}
};

var MONTHS=(function(){ var out=[], y=2025, m=11; while(y*100+m<=202610){ out.push(y+'-'+String(m).padStart(2,'0')); if(++m>12){ m=1; y++; } } return out; })();

/* ---------- helpers ---------- */
function h(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function c2(x){ return Math.round(x*100)/100; }
function fmt2(x){ return Math.abs(x).toLocaleString('en-SG',{minimumFractionDigits:2, maximumFractionDigits:2}); }
function money(x){ return (x<0?'−':'')+'S$'+fmt2(x); }
function num(x){ return (x<0?'−':'')+fmt2(x); }
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function d(iso){ var p=iso.slice(0,10).split('-'); return {y:+p[0], m:+p[1], d:+p[2]}; }
function fmtDate(iso){ var x=d(iso); return x.d+' '+MON[x.m-1]+' '+x.y; }
function fmtDT(iso){ return fmtDate(iso)+', '+iso.slice(11,16); }
function addDays(iso, n){ var x=d(iso), t=new Date(Date.UTC(x.y, x.m-1, x.d+n)); return t.toISOString().slice(0,10); }
function weekday(iso){ var x=d(iso); return new Date(Date.UTC(x.y, x.m-1, x.d)).getUTCDay(); }
function monthLabel(per){ var p=per.split('-'); return MON[+p[1]-1]+' '+p[0]; }
function monthDays(per){ var p=per.split('-'); return new Date(Date.UTC(+p[0], +p[1], 0)).getUTCDate(); }
function nextMonth(per){ var p=per.split('-'), y=+p[0], m=+p[1]+1; if(m>12){ m=1; y++; } return y+'-'+String(m).padStart(2,'0'); }
function monthRange(per){ return '1–'+monthDays(per)+' '+MON[+per.slice(5,7)-1]; }
/* the 20th of the next month; a Saturday or Sunday moves to the Monday (public holidays left out of the sample) */
function payoutDate(per){ var iso=nextMonth(per)+'-20', w=weekday(iso); return w===6 ? addDays(iso,2) : w===0 ? addDays(iso,1) : iso; }
/* AXS settles twice a month, 2 days after the 15th and after the month end (sample) */
function axsDate(day){ return d(day).d<=15 ? day.slice(0,8)+'17' : nextMonth(day.slice(0,7))+'-02'; }

function rng(seed){ return function(){ seed=seed+0x6D2B79F5|0; var t=Math.imul(seed^seed>>>15, 1|seed); t=t+Math.imul(t^t>>>7, 61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function hash(s){ var x=2166136261; for(var i=0;i<s.length;i++){ x^=s.charCodeAt(i); x=Math.imul(x,16777619); } return x>>>0; }
function pick(r, a){ return a[Math.floor(r()*a.length)]; }
function code(r, n, chars){ var s=''; for(var i=0;i<n;i++) s+=chars[Math.floor(r()*chars.length)]; return s; }

/* ---------- fee rules (sheet Intro) ----------
   procFee = what the owner is charged per transaction ("Agathos To Merchant Fee").
   IPC: AXS charges the charity directly; sample rates from "PSP To Agathos Fee". */
function procFee(psp, method, R){
  var card=method!=='PayNow';
  if(psp==='stripe') return c2(card ? .039*R+.5 : .013*R*1.09);
  return c2(card ? (.034*R+.2)*1.09 : .008*R*1.09);
}
function axsFee(method, intl, gross){ return c2((method==='PayNow' ? .004 : intl ? .028 : .012)*gross); }

var METHODS={stripe:['Card','Card','Card','PayNow','PayNow'], '2c2p':['Card','Card','Apple Pay','Google Pay','PayNow'], axs:['PayNow','PayNow','Card']};
var GIFTS=[20,30,50,50,80,100,100,150,200,250,300,500,1000];
var TICKETS=[35,35,60,60,120];
var ST={paid:'Paid out', await:'Awaiting next payout', proc:'Processing', axs:'Paid by AXS'};

function status(row){
  if(row.p.ipc) return axsDate(row.day)<=TODAY ? 'axs' : 'proc';
  if(payoutDate(row.per)<=TODAY) return 'paid';
  return row.day<=UPLOADED ? 'await' : 'proc';
}

function buildRows(p, per){
  var r=rng(hash(p.id+per)), full=monthDays(per), last=per===TODAY.slice(0,7) ? d(TODAY).d : full;
  var n=Math.max(3, Math.round((p.n+Math.floor(r()*7)-3)*last/full)), out=[];
  for(var i=0;i<n;i++){
    var day=per+'-'+String(1+Math.floor(r()*last)).padStart(2,'0');
    var t=String(7+Math.floor(r()*16)).padStart(2,'0')+':'+String(Math.floor(r()*60)).padStart(2,'0');
    var method=pick(r, METHODS[p.psp]), intl=method!=='PayNow' && r()<.15;
    var qty=p.kind==='event' ? pick(r,[1,1,2,2,4]) : 0;
    var R=p.kind==='event' ? pick(r,TICKETS)*qty : pick(r,GIFTS);
    var tip=p.tip && r()<p.tip ? c2(R*pick(r,[.05,.1,.12])) : 0;
    var ben=c2(R*p.ben), fee=p.ipc ? axsFee(method, intl, R+tip) : procFee(p.psp, method, R);
    var ref=p.psp==='stripe' ? 'ch_3Q'+code(r,14,'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789') : p.psp==='2c2p' ? code(r,16,'0123456789') : 'AXS'+code(r,12,'0123456789');
    var row={p:p, per:per, day:day, at:day+'T'+t, ref:ref, method:method, qty:qty, recv:R, tip:tip, ben:ben, fee:fee, net:c2(R-fee-ben)};
    if(p.ipc){ row.paidAxs=c2(R+tip-fee); row.lg=c2(ben+tip); }
    row.st=status(row);
    out.push(row);
  }
  return out;
}
function byNewest(a,b){ return a.at<b.at ? 1 : -1; }
var CACHE={};
function rowsOf(pid){
  if(CACHE[pid]) return CACHE[pid];
  var p=PROJECTS[pid], out=[];
  MONTHS.forEach(function(m){ if(m>=p.from) out=out.concat(buildRows(p, m)); });
  return (CACHE[pid]=out.sort(byNewest));
}
/* a period shows up once its payment data is uploaded; IPC rows sit in their sales month */
function inPeriod(r){ return r.p.ipc || r.st!=='proc'; }

/* totals in whole cents so the parts always add up to the whole */
function totals(list){
  var k=['recv','ben','fee','net','tip','paid','await','proc','paidAxs','lg'], c={}, t={n:list.length, qty:0};
  k.forEach(function(x){ c[x]=0; });
  list.forEach(function(r){
    ['recv','ben','fee','net','tip'].forEach(function(x){ c[x]+=Math.round(r[x]*100); });
    t.qty+=r.qty;
    if(r.p.ipc){ c.paidAxs+=Math.round(r.paidAxs*100); c.lg+=Math.round(r.lg*100); if(r.st==='proc') c.proc+=Math.round(r.paidAxs*100); }
    else c[r.st]+=Math.round(r.net*100);
  });
  k.forEach(function(x){ t[x]=c[x]/100; });
  return t;
}

/* ---------- state ---------- */
var S={scn:'project', tab:'transactions', year:'all', per:'all', hyear:'all', page:1};
function route(){
  var p=location.hash.replace(/^#\/?/,'').split('/'), scn=SCN[p[0]] ? p[0] : 'project';
  var tabs=SCN[scn].tabs.map(function(t){ return t[0]; });
  if(scn!==S.scn){ S.year='all'; S.per='all'; S.hyear='all'; S.page=1; }
  S.scn=scn; S.tab=tabs.indexOf(p[1])>=0 ? p[1] : tabs[0];
}
function cur(){ return PROJECTS[SCN[S.scn].pid]; }
function yearOk(per, y){ return y==='all' || per.slice(0,4)===y; }
function filtered(p){
  return rowsOf(p.id).filter(function(r){
    if(!yearOk(r.per, S.year)) return false;
    if(S.per==='all') return true;
    if(S.per==='none') return r.st==='proc';
    return r.per===S.per && inPeriod(r);
  });
}
function periodsOf(pid){ var seen={}; rowsOf(pid).forEach(function(r){ if(inPeriod(r)) seen[r.per]=1; }); return MONTHS.filter(function(m){ return seen[m]; }); }
function yearsOf(pid){ var y=[]; rowsOf(pid).forEach(function(r){ var x=r.per.slice(0,4); if(y.indexOf(x)<0) y.push(x); }); return y.sort(); }
function nextPayout(pid){ var u=rowsOf(pid).filter(function(r){ return r.st==='await' || r.st==='proc'; }).map(function(r){ return payoutDate(r.per); }).sort(); return u[0]||null; }

/* ---------- words that change between a project and an event ---------- */
function isEv(p){ return p.kind==='event'; }
function amountLabel(p){ return isEv(p) ? 'Ticket Sales Amount' : 'Funding Amount'; }
function agathosLabel(p){ return isEv(p) ? 'Agathos Platform fee' : 'Beneficiary Love Gift to Agathos'; }
function countLabel(p, t){ return isEv(p) ? t.qty+(t.qty===1?' ticket':' tickets')+' sold' : t.n+(t.n===1?' contribution':' contributions'); }
function rowsWord(p){ return isEv(p) ? 'Orders' : 'Transactions'; }
function others(ids, self){
  var o=ids.filter(function(id){ return id!==self; }).map(function(id){ return PROJECTS[id].kind; }), n=o.length;
  if(!n) return '';
  var kinds=o.indexOf('project')>=0 && o.indexOf('event')>=0 ? 'projects and events' : o[0]+(n>1?'s':'');
  return n+' other '+kinds;
}
function transfer(per){
  var ids=ORG_IDS.filter(function(id){ return rowsOf(id).some(function(r){ return r.per===per && inPeriod(r); }); });
  var total=totals([].concat.apply([], ids.map(function(id){ return rowsOf(id).filter(function(r){ return r.per===per && inPeriod(r); }); }))).net;
  return {ids:ids, total:total};
}

/* ---------- icons ---------- */
function svg(body, vb){ return '<svg viewBox="'+(vb||'0 0 24 24')+'" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+body+'</svg>'; }
var I={
  home:svg('<path d="M3.5 10.5L12 3.5l8.5 7"/><path d="M5.5 9v11h13V9"/><path d="M10 20v-5.5h4V20"/>'),
  crumb:svg('<path d="M1.5 1.5l4 4.5-4 4.5"/>','0 0 7 12'),
  chev:svg('<path d="M9 5.5l6.5 6.5L9 18.5"/>'),
  info:svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".6" fill="currentColor"/>'),
  giving:svg('<rect x="3" y="6" width="15" height="11" rx="2"/><path d="M18 9h2.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5H18"/><circle cx="10.5" cy="11.5" r="2.2"/>'),
  updates:svg('<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3h6v1.5"/>'),
  impact:svg('<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>'),
  people:svg('<circle cx="12" cy="8" r="2.8"/><circle cx="5.5" cy="9.5" r="2.2"/><circle cx="18.5" cy="9.5" r="2.2"/><path d="M7 19.5c0-3 2.2-5 5-5s5 2 5 5"/><path d="M2 18c0-2.3 1.5-3.8 3.5-3.8M22 18c0-2.3-1.5-3.8-3.5-3.8"/>'),
  items:svg('<rect x="4" y="3.5" width="16" height="7" rx="1.5"/><rect x="4" y="13.5" width="7" height="7" rx="1.5"/><rect x="14" y="13.5" width="6" height="7" rx="1.5"/>'),
  dollar:svg('<circle cx="12" cy="12" r="9"/><path d="M14.8 9.2c-.5-1-1.6-1.6-2.8-1.6-1.6 0-2.8.9-2.8 2.2 0 3 5.8 1.6 5.8 4.4 0 1.3-1.3 2.2-3 2.2-1.3 0-2.5-.6-3-1.6M12 6v1.6M12 16.4V18"/>'),
  tag:svg('<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.4 1.4 0 0 1 0 2l-6.5 6.5a1.4 1.4 0 0 1-2 0z"/><circle cx="8.3" cy="8.3" r="1.4"/>'),
  scan:svg('<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M4 12h16"/>'),
  card:svg('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h3M12 15h2"/>'),
  down:svg('<path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14"/>'),
  plusC:svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>'),
  doc:svg('<rect x="3.5" y="4" width="17" height="12.5" rx="1.5"/><path d="M12 16.5V20M8.5 20h7M7.5 8.5h5M7.5 12h8"/>'),
  caret:svg('<path d="M6.5 9.5l5.5 5.5 5.5-5.5"/>'),
  ticket:svg('<path d="M3 8.5V6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v2a2.5 2.5 0 0 0 0 5v2a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.5v-2a2.5 2.5 0 0 0 0-5z"/><path d="M14.5 5v12" stroke-dasharray="2 2"/>'),
  cal:svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'),
  check:svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>')
};
function infoTip(text){ return text ? '<button type="button" class="inf" data-tip="'+h(text)+'" aria-label="'+h(text)+'">i</button>' : ''; }

/* ---------- production chrome ---------- */
var MENU={
  project:[['info','Project Information'],['giving','Giving Settings'],['updates','Updates'],['impact','Impact Report'],['people','Human Resource'],['items','Items'],['dollar','Transactions & Payouts',1]],
  event:[['info','Event Information'],['tag','Tickets & Forms'],['people','Attendees Information'],['scan','Scan Ticket'],['card','Orders & Payouts',1]]
};
function page(p){
  var ev=isEv(p);
  var crumb=ev ? ['Events', p.name, 'Manage Event'] : ['Support a Cause', p.name, 'Manage Project'];
  var side='<aside class="mp-side"><h1>'+(ev?'Manage Event':'Manage Project')+'</h1><ul class="mp-menu">'+MENU[ev?'event':'project'].map(function(m){
    return '<li><a href="#"'+(m[2]?' class="on" aria-current="page"':' data-act="other"')+'>'+I[m[0]]+'<span>'+m[1]+'</span>'+I.chev+'</a></li>';
  }).join('')+'</ul><button class="mp-back" type="button" data-act="other">'+(ev?'Back to Event':'Back to Project page')+'</button></aside>';
  var head=ev
    ? '<div class="mp-head"><h2>Orders &amp; Payouts</h2><button class="mp-btn lg" type="button" data-act="csv">'+I.down+'Export Orders as .csv</button></div>'
    : '<h2 class="mp-title">Transactions &amp; Payouts</h2><div class="mp-btns">'+
        '<button class="mp-btn" type="button" data-act="csv">'+I.down+'Export as .csv</button>'+
        '<button class="mp-btn" type="button" data-act="offline">'+I.plusC+'Add Offline Transaction</button>'+
        '<button class="mp-btn" type="button" data-act="tax">'+I.doc+'Tax Deduction Report'+I.caret+'</button></div>';
  var pills='<nav class="mp-pills" aria-label="'+(ev?'Orders and payouts':'Transactions and payouts')+'">'+SCN[S.scn].tabs.map(function(t){
    return '<a href="#/'+S.scn+'/'+t[0]+'"'+(S.tab===t[0]?' class="on" aria-current="page"':'')+'>'+t[1]+'</a>';
  }).join('')+'</nav>';
  var body=S.tab==='payouts' ? (p.ipc ? viewPayoutsIpc(p) : viewPayouts(p)) : viewRows(p);
  return '<div class="mp'+(ev?' is-event':'')+'"><div class="mp-inner">'+
    '<nav class="mp-crumb" aria-label="Breadcrumb"><a href="#" aria-label="Home">'+I.home+'</a>'+crumb.map(function(c){ return I.crumb+'<a href="#">'+h(c)+'</a>'; }).join('')+'</nav>'+
    side+'<section class="mp-card">'+head+pills+body+'</section></div></div>';
}

/* ---------- summary card (Figma "Overview" card, with the team's labels) ---------- */
function overview(o){
  var cols=o.cols.map(function(c){
    return '<div class="ov-col">'+
      '<div class="l">'+(c.sw?'<i class="sw '+c.sw+'"></i>':'')+'<span>'+c.lbl+'</span>'+infoTip(c.tip)+'</div>'+
      '<div class="v">'+num(c.val)+'</div>'+
      (c.lines?'<dl>'+c.lines.map(function(l){ return '<div><dt>'+l[0]+'</dt><dd>'+money(l[1])+'</dd></div>'; }).join('')+'</dl>':'')+
      (c.sub?'<div class="s">'+c.sub+'</div>':'')+'</div>';
  });
  var bar='';
  if(o.bar){
    var all=o.bar.paid+o.bar.await || 1;
    bar='<div class="ov-net"><span>Net payout</span><b>'+money(o.net)+'</b></div>'+
      '<div class="ov-bar" role="img" aria-label="Paid out '+money(o.bar.paid)+', awaiting payout '+money(o.bar.await)+'">'+
      (o.bar.paid?'<i class="paid" style="width:'+(o.bar.paid/all*100).toFixed(2)+'%"></i>':'')+
      (o.bar.await?'<i class="await" style="width:'+(o.bar.await/all*100).toFixed(2)+'%"></i>':'')+'</div>';
  }
  return '<section class="ov">'+
    '<div class="ov-top"><div><div class="ov-lbl"><span>'+o.label+'</span>'+infoTip(o.tip)+'</div>'+
      '<div class="ov-big"><small>S$</small>'+fmt2(o.total)+'</div><span class="ov-count">'+I.ticket+o.count+'</span></div>'+
      '<span class="ov-pill">'+h(o.pill)+'</span></div>'+
    bar+
    '<div class="ov-cols n'+cols.length+(o.plus?' plus':'')+'">'+cols.join(o.plus?'<span class="ov-plus" aria-hidden="true">+</span>':'')+'</div>'+
    (o.foot?'<div class="ov-foot">'+o.foot+'</div>':'')+
  '</section>';
}
function deductedCol(p, t){
  return {lbl:'Deducted (S$)', val:c2(t.ben+t.fee), lines:[[agathosLabel(p), t.ben], ['Processing fees', t.fee]]};
}
function summary(p, list, pill){
  var t=totals(list), nx=nextPayout(p.id);
  var top={label:'Total '+amountLabel(p), tip:isEv(p)?'All ticket sales, before fees.':'All donations, before fees.', total:t.recv, count:countLabel(p, t), pill:pill};
  if(p.ipc){
    top.cols=[
      {lbl:'Paid to you by AXS (S$)', val:c2(t.paidAxs-t.proc), sw:'paid', sub:t.proc?money(t.proc)+' still processing':'Paid to you directly'},
      {lbl:'Love gifts to Agathos (S$)', val:t.lg, lines:[['Beneficiary love gift', t.ben], ['Donor love gifts', t.tip]], sub:'Invoiced by Agathos'},
      {lbl:'Processing fees (S$)', val:t.fee, sub:'Charged by AXS'}
    ];
    return overview(top);
  }
  top.plus=true;
  if(S.tab==='payouts' || S.per==='all'){
    var awaitAll=c2(t.await+t.proc), sub;
    if(t.await && t.proc) sub=money(t.await)+' in the '+fmtDate(nx).replace(/ \d{4}$/,'')+' payout · '+money(t.proc)+' processing';
    else if(awaitAll && nx) sub='Next payout: '+fmtDate(nx);
    else sub='Nothing waiting';
    top.net=t.net; top.bar={paid:t.paid, await:awaitAll};
    top.cols=[deductedCol(p, t),
      {lbl:'Paid out (S$)', val:t.paid, sw:'paid', tip:'Total amount you\'ve received so far, after fees', sub:t.paid?'To '+BANK:'Nothing paid yet'},
      {lbl:'Awaiting payout (S$)', val:awaitAll, sw:'await', tip:'After fees. Paid on the next payout date.', sub:sub}];
    return overview(top);
  }
  var line, foot='';
  if(S.per==='none') line='Joins a payout once the payment data is uploaded';
  else{
    var date=payoutDate(S.per);
    line=date<=TODAY ? '<span class="ok">'+I.check+'</span>Paid on '+fmtDate(date)+' to '+BANK : 'Not paid yet · Agathos pays on '+fmtDate(date);
    var tr=transfer(S.per);
    if(tr.ids.length>1) foot='Part of a '+money(tr.total)+' payout to '+BANK+', with '+others(tr.ids, p.id)+'. <a href="#/'+S.scn+'/payouts">See payouts</a>';
  }
  top.cols=[deductedCol(p, t), {lbl:'Net payout (S$)', val:t.net, sub:line}];
  top.foot=foot;
  return overview(top);
}

/* ---------- 1. Transactions / Orders ---------- */
function sel(label, key, opts, val){
  return '<div class="fr-sel"><label for="f-'+key+'">'+label+'</label><select id="f-'+key+'" data-f="'+key+'">'+opts.map(function(o){
    return '<option value="'+h(o[0])+'"'+(o[0]===val?' selected':'')+'>'+h(o[1])+'</option>';
  }).join('')+'</select></div>';
}
function yearOpts(pid){ return [['all','All years']].concat(yearsOf(pid).map(function(y){ return [y,y]; })); }
function viewRows(p){
  var pers=periodsOf(p.id).filter(function(m){ return yearOk(m, S.year); });
  var hasProc=rowsOf(p.id).some(function(r){ return r.st==='proc' && yearOk(r.per, S.year); });
  var opts=[['all', p.ipc?'All months':'All payouts']].concat(pers.map(function(m){ return [m, monthLabel(m)]; }));
  if(hasProc) opts.push(['none', p.ipc?'Not paid by AXS yet':'Not in a payout yet']);
  if(!opts.some(function(o){ return o[0]===S.per; })) S.per='all';
  var list=filtered(p);
  var pill=S.per==='all' ? (S.year==='all'?'Overview':S.year) : S.per==='none' ? opts[opts.length-1][1] : monthLabel(S.per);
  return '<div class="fr-filters">'+sel('Year','year',yearOpts(p.id),S.year)+sel(p.ipc?'Month':'Payout period','per',opts,S.per)+'</div>'+
    summary(p, list, pill)+stats(p, list)+table(p, list);
}

/* charts: amount collected and number of contributions (tickets for an event), one series each */
var CHARTS=[];
function stats(p, list){
  var byDay=S.per!=='all', keys=[], lab=[], amt={}, cnt={};
  if(byDay){
    var days=list.map(function(r){ return r.day; }).sort();
    if(!days.length) return '';
    var per=S.per==='none' ? days[0].slice(0,7) : S.per, first=S.per==='none' ? days[0] : per+'-01', last=per===TODAY.slice(0,7) ? (p.ipc || S.per==='none' ? TODAY : UPLOADED) : per+'-'+monthDays(per);
    for(var x=first; x<=last; x=addDays(x,1)){ keys.push(x); lab.push(fmtDate(x)); }
  } else {
    var ms=MONTHS.filter(function(m){ return yearOk(m, S.year) && list.some(function(r){ return r.per===m; }); });
    if(!ms.length) return '';
    MONTHS.forEach(function(m){ if(m>=ms[0] && m<=ms[ms.length-1]){ keys.push(m); lab.push(monthLabel(m)); } });
  }
  keys.forEach(function(k){ amt[k]=0; cnt[k]=0; });
  list.forEach(function(r){ var k=byDay?r.day:r.per; if(k in amt){ amt[k]+=r.recv; cnt[k]+=isEv(p)?r.qty:1; } });
  var a={pts:keys.map(function(k,i){ return {l:lab[i], v:c2(amt[k])}; }), money:true}, b={pts:keys.map(function(k,i){ return {l:lab[i], v:cnt[k]}; })};
  CHARTS=[a,b];
  var span=byDay ? 'Per day · '+(S.per==='none'?'Not in a payout yet':monthLabel(S.per)) : 'Per month · '+(S.year==='all'?'All payouts':S.year);
  return '<section class="fr-sec fr-stats"><div class="fr-sec-head"><h3>'+(isEv(p)?'Ticket sales':'Giving statistics')+'</h3><span class="sub">'+span+'</span></div><div class="fr-charts">'+
    '<figure class="ch"><figcaption>Amount collected (S$)</figcaption>'+chartSvg(0, a)+'</figure>'+
    '<figure class="ch"><figcaption>'+(isEv(p)?'Tickets sold':'Contributions')+'</figcaption>'+chartSvg(1, b)+'</figure></div></section>';
}
var CW=340, CH=150, CL=38, CR=10, CT=12, CB=24;
function niceMax(v){ if(v<=0) return 1; var e=Math.pow(10, Math.floor(Math.log10(v))), f=v/e; return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*e; }
function tick(v, isMoney){ if(!isMoney) return String(Math.round(v*10)/10); return v>=1000 ? (v/1000).toLocaleString('en-SG',{maximumFractionDigits:1})+'k' : String(Math.round(v)); }
function cx(i, n){ return CL+(n<2 ? (CW-CL-CR)/2 : i*(CW-CL-CR)/(n-1)); }
function chartSvg(idx, c){
  var n=c.pts.length, iw=CW-CL-CR, ih=CH-CT-CB, max=niceMax(Math.max.apply(null, c.pts.map(function(p){ return p.v; })));
  if(!c.money && max<4) max=4;
  c.max=max;
  function y(v){ return CT+ih-v/max*ih; }
  var grid=[0, max/2, max].map(function(v){ return '<line class="g" x1="'+CL+'" x2="'+(CW-CR)+'" y1="'+y(v)+'" y2="'+y(v)+'"/><text class="ax" x="'+(CL-6)+'" y="'+(y(v)+3.5)+'" text-anchor="end">'+tick(v, c.money)+'</text>'; }).join('');
  var xl=[0, Math.floor((n-1)/2), n-1].filter(function(v,i,a){ return a.indexOf(v)===i; }).map(function(i){
    var anchor=i===0?'start':i===n-1?'end':'middle';
    return '<text class="ax" x="'+cx(i,n)+'" y="'+(CH-6)+'" text-anchor="'+anchor+'">'+h(c.pts[i].l.replace(/ \d{4}$/,''))+'</text>';
  }).join('');
  var line=c.pts.map(function(p,i){ return (i?'L':'M')+cx(i,n).toFixed(1)+' '+y(p.v).toFixed(1); }).join(' ');
  var area=line+' L'+cx(n-1,n).toFixed(1)+' '+y(0)+' L'+cx(0,n).toFixed(1)+' '+y(0)+' Z';
  var label=c.pts.map(function(p){ return p.l+' '+(c.money?money(p.v):p.v); }).join(', ');
  return '<svg class="ch-svg" viewBox="0 0 '+CW+' '+CH+'" role="img" aria-label="'+h(label)+'">'+grid+xl+
    '<path class="area" d="'+area+'"/><path class="ln" d="'+line+'"/>'+
    '<line class="xh" x1="0" x2="0" y1="'+CT+'" y2="'+(CT+ih)+'"/><circle class="dot" r="4" cx="0" cy="0"/>'+
    '<rect class="hit" data-i="'+idx+'" x="'+(CL-6)+'" y="0" width="'+(iw+12)+'" height="'+CH+'"/></svg>';
}

var PER_PAGE=10;
function columns(p){
  if(p.ipc) return [
    ['Date & time','dt'], ['Payment method','method'], ['Currency','cur'], ['Funding Amount','recv','n'],
    ['Processing fees','fee','n','neg'], ['Paid to you','paidAxs','n','net'], ['Love gift to Agathos','lg','n'], ['Status','st']];
  return [
    ['Date & time','dt'], ['Payment method','method'], ['Currency','cur'], [amountLabel(p),'recv','n'],
    [agathosLabel(p),'ben','n','neg'], ['Processing fees','fee','n','neg'], ['Net payout','net','n','net'], ['Payout status','st']];
}
function stTag(st, text){ return '<span class="st st-'+st+'"><i></i>'+(text||ST[st])+'</span>'; }
function cell(c, r){
  if(c[1]==='dt') return '<b>'+fmtDT(r.at)+'</b><code title="'+h(r.ref)+'">'+h(r.ref)+'</code>';
  if(c[1]==='cur') return 'SGD';
  if(c[1]==='st') return stTag(r.st);
  if(c[2]==='n') return num(c[3]==='neg' ? -r[c[1]] : r[c[1]]);
  return h(r[c[1]]);
}
function table(p, list){
  var cols=columns(p), pages=Math.max(1, Math.ceil(list.length/PER_PAGE));
  if(S.page>pages) S.page=pages;
  var start=(S.page-1)*PER_PAGE, slice=list.slice(start, start+PER_PAGE);
  var head='<tr>'+cols.map(function(c){ return '<th'+(c[2]==='n'?' class="n"':'')+'>'+c[0]+'</th>'; }).join('')+'</tr>';
  var body=slice.map(function(r){ return '<tr>'+cols.map(function(c){ return '<td class="'+(c[2]==='n'?'n ':'')+(c[3]==='net'?'net ':'')+(c[1]==='dt'?'dt':'')+'">'+cell(c,r)+'</td>'; }).join('')+'</tr>'; }).join('');
  var netCol=cols.filter(function(c){ return c[3]==='net'; })[0];
  var cards=slice.map(function(r){
    return '<div class="fr-item"><div class="r1"><span>'+fmtDT(r.at)+'</span><b>SGD '+num(r.recv)+'</b></div>'+
      '<div class="r2">'+stTag(r.st)+'<span class="net">'+netCol[0]+' '+num(r[netCol[1]])+'</span></div>'+
      '<details><summary>Details</summary><dl>'+cols.map(function(c){ return '<div><dt>'+c[0]+'</dt><dd>'+cell(c,r)+'</dd></div>'; }).join('')+'</dl></details></div>';
  }).join('');
  var pager=list.length>PER_PAGE ? '<div class="fr-pager"><span>'+(start+1)+'–'+(start+slice.length)+' of '+list.length+'</span><div>'+
    '<button type="button" data-act="page" data-p="'+(S.page-1)+'"'+(S.page<=1?' disabled':'')+'>Previous</button>'+
    '<button type="button" data-act="page" data-p="'+(S.page+1)+'"'+(S.page>=pages?' disabled':'')+'>Next</button></div></div>' : '';
  return '<section class="fr-sec fr-list"><div class="fr-sec-head"><h3>'+rowsWord(p)+' <span class="n">'+list.length+'</span></h3></div>'+
    (list.length ? '<div class="fr-tw has-cards"><table class="fr-t"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div><div class="fr-cards">'+cards+'</div>'+pager
                 : '<div class="fr-empty">No '+rowsWord(p).toLowerCase()+' here.</div>')+'</section>';
}

/* ---------- 2. Payouts ---------- */
function nextBox(p){
  var nx=nextPayout(p.id);
  if(!nx) return '';
  return '<div class="nx">'+I.cal+'<div><b>Next payout: '+fmtDate(nx)+'</b><p>Payouts are processed on the 20th of each month for the previous month\'s sales.<br>If the 20th falls on a non-working day, the payout shifts to the next working day.</p></div></div>';
}
function viewPayouts(p){
  var all=rowsOf(p.id), years=yearsOf(p.id);
  var pers=periodsOf(p.id).filter(function(m){ return yearOk(m, S.hyear); });
  var rows=pers.map(function(per){
    var t=totals(all.filter(function(r){ return r.per===per && inPeriod(r); })), date=payoutDate(per), paid=date<=TODAY, tr=transfer(per);
    return '<tr><td class="dt"><b>'+fmtDate(date)+'</b>'+(paid?'':stTag('await','Not paid yet'))+'</td>'+
      '<td class="desc"><b>Monthly payout</b><span>'+monthRange(per)+' · '+countLabel(p, t)+'</span>'+(tr.ids.length>1?'<span class="part">Part of a '+money(tr.total)+' payout with '+others(tr.ids, p.id)+'</span>':'')+'</td>'+
      '<td class="n">'+num(t.recv)+'</td><td class="n">'+num(-t.ben)+'</td><td class="n">'+num(-t.fee)+'</td><td class="n net">'+num(t.net)+'</td>'+
      '<td>'+(paid?'<button type="button" class="lnk" data-act="invoice">Download Invoice</button>':'<span class="na">—</span>')+'</td></tr>';
  }).join('');
  var t=totals(all.filter(function(r){ return yearOk(r.per, S.hyear); }));
  var foot='<tr><td colspan="5">Paid out</td><td class="n">'+num(t.paid)+'</td><td></td></tr>'+
    '<tr><td colspan="5">Balance (not paid yet)</td><td class="n">'+num(c2(t.await+t.proc))+'</td><td></td></tr>';
  var head='<tr><th>Date</th><th>Description</th><th class="n">'+amountLabel(p)+'</th><th class="n">'+agathosLabel(p)+'</th><th class="n">Processing fees</th><th class="n">Net payout</th><th>Action</th></tr>';
  var cards=pers.map(function(per){
    var t=totals(all.filter(function(r){ return r.per===per && inPeriod(r); })), date=payoutDate(per), paid=date<=TODAY;
    return '<div class="fr-item"><div class="r1"><span>'+fmtDate(date)+' · '+monthLabel(per)+'</span><b>SGD '+num(t.net)+'</b></div><div class="r2">'+stTag(paid?'paid':'await', paid?'Paid out':'Not paid yet')+'<span class="net">'+amountLabel(p)+' '+num(t.recv)+'</span></div></div>';
  }).join('');
  return summary(p, all, 'Overview')+nextBox(p)+
    '<section class="fr-sec"><div class="fr-sec-head"><h3>Payout History</h3>'+(years.length>1?sel('Year','hyear',yearOpts(p.id),S.hyear):'')+'</div>'+
    '<div class="fr-tw has-cards"><table class="fr-t ph"><thead>'+head+'</thead><tbody>'+rows+'</tbody><tfoot>'+foot+'</tfoot></table></div><div class="fr-cards">'+cards+'</div></section>';
}

/* IPC: AXS pays the charity directly, Agathos invoices its love gifts (terms below are samples, to confirm) */
var INV_DAY='05', INV_DAYS=30;
function invoices(p){
  var all=rowsOf(p.id);
  return MONTHS.filter(function(m){ return m>=p.from && nextMonth(m)+'-'+INV_DAY<=TODAY; }).map(function(m, i){
    var t=totals(all.filter(function(r){ return r.per===m; })), issued=nextMonth(m)+'-'+INV_DAY, due=addDays(issued, INV_DAYS);
    return {no:'AG-'+m.replace('-','')+'-'+(101+i), per:m, ben:t.ben, tip:t.tip, total:c2(t.ben+t.tip), due:due, paid:due<TODAY};
  });
}
function viewPayoutsIpc(p){
  var all=rowsOf(p.id), years=yearsOf(p.id), groups={};
  all.forEach(function(r){ if(yearOk(r.per, S.hyear)){ var k=axsDate(r.day); (groups[k]=groups[k]||[]).push(r); } });
  var settle=Object.keys(groups).sort().map(function(k){
    var list=groups[k], t=totals(list), dd=list.map(function(r){ return r.day; }).sort(), from=d(dd[0]).d<=15?1:16, per=dd[0].slice(0,7);
    var range=from+'–'+(from===1?15:monthDays(per))+' '+MON[+per.slice(5,7)-1];
    return '<tr><td class="dt"><b>'+fmtDate(k)+'</b>'+(k<=TODAY?'':stTag('proc','Expected'))+'</td><td class="desc"><b>From AXS</b><span>'+range+' · '+countLabel(p, t)+'</span></td>'+
      '<td class="n">'+num(t.recv)+'</td><td class="n">'+num(t.tip)+'</td><td class="n">'+num(-t.fee)+'</td><td class="n net">'+num(t.paidAxs)+'</td></tr>';
  }).join('');
  var inv=invoices(p), nextInv=nextMonth(TODAY.slice(0,7))+'-'+INV_DAY;
  var invRows=inv.map(function(x){
    return '<tr><td><b>'+x.no+'</b></td><td>'+monthLabel(x.per)+'</td><td class="n">'+num(x.ben)+'</td><td class="n">'+num(x.tip)+'</td><td class="n net">'+num(x.total)+'</td>'+
      '<td>'+fmtDate(x.due)+'</td><td>'+stTag(x.paid?'paid':'await', x.paid?'Paid':'Due')+'</td><td><button type="button" class="lnk" data-act="invoice">Download Invoice</button></td></tr>';
  }).join('');
  var due=inv.filter(function(x){ return !x.paid; }).reduce(function(a,x){ return c2(a+x.total); }, 0);
  return summary(p, all, 'Overview')+
    '<div class="nx">'+I.cal+'<div><b>Next invoice: '+fmtDate(nextInv)+'</b><span class="tbc">To confirm</span><p>AXS pays donations to you directly. Agathos sends an invoice on the 5th of each month for the previous month\'s love gifts.<br>Payment is due within 30 days.'+(due?' You have '+money(due)+' due now.':'')+'</p></div></div>'+
    '<section class="fr-sec"><div class="fr-sec-head"><h3>Payouts from AXS</h3>'+(years.length>1?sel('Year','hyear',yearOpts(p.id),S.hyear):'')+'</div>'+
      '<div class="fr-tw"><table class="fr-t ph"><thead><tr><th>Date</th><th>Description</th><th class="n">Funding Amount</th><th class="n">Donor love gifts</th><th class="n">Processing fees</th><th class="n">Paid to you</th></tr></thead><tbody>'+settle+'</tbody></table></div></section>'+
    '<section class="fr-sec"><div class="fr-sec-head"><h3>Invoices from Agathos</h3></div>'+
      '<div class="fr-tw"><table class="fr-t ph"><thead><tr><th>Invoice</th><th>Month</th><th class="n">Beneficiary love gift</th><th class="n">Donor love gifts</th><th class="n">Amount</th><th>Due date</th><th>Status</th><th>Action</th></tr></thead><tbody>'+invRows+'</tbody></table></div></section>';
}

/* ---------- review notes: where this version differs from the comments on v1 ---------- */
var NOTES=[
  {t:'"Processing fees" without "(to Payment Service Provider)"',
   fb:['Change to: Processing fees (to Payment Service Provider)'],
   now:'The label is "Processing fees", with nothing after it.',
   why:'This amount is the fixed rate Agathos charges the owner, for example 3.9% + S$0.50 on a card. The payment provider\'s real fee is lower (3.4% + S$0.50 on a domestic card). The difference is the margin, which Agathos keeps for now. Saying the whole amount goes to the payment provider would not be accurate.',
   pros:['The label stays true whatever we decide about the margin.','Shorter, so it fits the table header and the summary.'],
   cons:['Owners don\'t see who the fee goes to.'],
   ask:'Does Agathos keep the margin (sheet Intro, item 1)? If the margin goes back to owners, "(to Payment Service Provider)" becomes accurate and can be added.'},
  {t:'"Net payout" in the summary too',
   fb:['Summary: "Total Net to you"','Table column: "Change to: Net payout"'],
   now:'"Net payout" in the summary, the transactions table, the payout history and the CSV.',
   why:'Both names point to the same number. One name means owners can match the summary to the table column.',
   pros:['No one wonders whether "Net to you" and "Net payout" are different amounts.','One term for support and finance to use.'],
   cons:['"Net to you" sounds warmer and more personal.']},
  {t:'The paid out / awaiting bar runs across the card',
   fb:['On the left side using a bar, show: Total paid out; Total awaiting pay out'],
   now:'The bar spans the card, under "Net payout". Paid out and Awaiting payout sit below it, each with a colour square that matches the bar. This follows the Overview layout from the Figma idea.',
   why:'The card reads top to bottom: total collected, then net payout split into paid and awaiting, then the three parts that add up (Deducted + Paid out + Awaiting payout = Total Funding Amount). A wide bar shows the split more clearly than a short one on one side.',
   pros:['One reading order, top to bottom.','Same layout on a phone, no rearranging.','The numbers under the bar show how the total adds up.'],
   cons:['Not the layout the comment describes.','The two amounts sit under the bar, not beside it.']},
  {t:'"Awaiting payout" includes payments still processing',
   fb:['Total awaiting pay out','Status column: New txn default --> \'Processing\'; After upload of data file (if included) --> \'Awaiting next payout\''],
   now:'Awaiting payout = everything not paid yet: "Awaiting next payout" plus "Processing". The line under it splits the two, for example "S$1,841.01 in the 20 Nov payout · S$226.75 processing".',
   why:'Paid out + Awaiting payout then equals Net payout, so the bar and the numbers add up. If processing payments were left out, that money would appear nowhere in the summary.',
   pros:['The numbers always add up.','Owners see all the money still to come.'],
   cons:['The big Awaiting number includes money not yet in a payout. The line under it is needed to explain this.'],
   ask:'Other option: three parts (Paid out, Awaiting next payout, Processing). That adds one number and one bar colour.'},
  {t:'Charts by month when all payouts are shown',
   fb:['Include a section that shows giving statistics within a period in a line graph: Amount collect per day; No. of donations per day'],
   now:'Per day when one payout period is chosen. Per month when "All payouts" or a whole year is shown.',
   why:'"All payouts" covers 12 months, about 365 points per line. At this size that is too dense to read, and many days have no donations.',
   pros:['Readable with every filter.','Shows the trend over the year at a glance.'],
   cons:['Daily figures only show after choosing a period.']},
  {t:'Reference shown under the date',
   fb:['No comment on this. Version 1 had a separate Reference column.'],
   now:'The reference sits under the date and time, shortened with "…". The full reference shows on hover and in the CSV.',
   why:'Adding Currency and Payout status made the table 9 columns. The Manage Project card is about 730px wide inside, so the table needed sideways scrolling.',
   pros:['The whole table fits without scrolling.'],
   cons:['Not requested.','Harder to read or copy a reference on screen; the full value only shows on hover or in the CSV.'],
   ask:'Other option: the reference back in its own column, with sideways scrolling.'},
  {t:'No separate "Payout summary" card',
   fb:['Add: text to indicate that this part of a larger payout. (when no. of projects + events = >1) Remove: mention of PSP'],
   now:'The "Payout summary" card is gone from Transactions. When one payout period is chosen, the summary ends with "Part of a S$X payout to DBS ••••4821, with 2 other projects and events" and a "See payouts" link. Payout History shows the same line for every payout. No payment provider is named anywhere.',
   why:'Payouts now sit in the same tab, one click away (the Payouts button next to Transactions), so a card linking to them repeats it. The timeline beside the card was removed as asked, which left the card alone in its row.',
   pros:['Less repetition.','The "part of a larger payout" text shows where it applies: on a single payout.'],
   cons:['Not requested.','With "All payouts" shown, the only way to payouts is the Payouts button.']}
];
function notesHtml(){
  var x=svg('<path d="M6 6l12 12M18 6L6 18"/>');
  return '<div class="fr-md" role="dialog" aria-modal="true" aria-labelledby="fr-md-t">'+
    '<div class="fr-md-head"><div><h2 id="fr-md-t">'+NOTES.length+' changes from the feedback</h2><p>Where this version differs from the comments on version 1, and why. Tell us which ones to switch back.</p></div>'+
    '<button class="fr-md-x" type="button" data-act="notesClose" aria-label="Close">'+x+'</button></div>'+
    '<ol class="fr-md-list">'+NOTES.map(function(n, i){
      return '<li class="fr-nt"><div class="fr-nt-h"><span class="no">'+(i+1)+'</span><h3>'+h(n.t)+'</h3></div>'+
        '<dl class="fr-nt-rows"><div><dt>Feedback</dt><dd>'+n.fb.map(function(q){ return '<q>'+h(q)+'</q>'; }).join('')+'</dd></div>'+
        '<div><dt>This version</dt><dd>'+h(n.now)+'</dd></div><div><dt>Why</dt><dd>'+h(n.why)+'</dd></div></dl>'+
        '<div class="fr-nt-pc"><div class="pro"><b>Pros</b><ul>'+n.pros.map(function(p){ return '<li>'+h(p)+'</li>'; }).join('')+'</ul></div>'+
        '<div class="con"><b>Cons</b><ul>'+n.cons.map(function(p){ return '<li>'+h(p)+'</li>'; }).join('')+'</ul></div></div>'+
        (n.ask?'<p class="fr-nt-ask">'+h(n.ask)+'</p>':'')+'</li>';
    }).join('')+'</ol></div>';
}
function notesOpen(){
  var m=document.getElementById('fr-modal');
  m.innerHTML=notesHtml(); m.hidden=false;
  document.documentElement.classList.add('fr-lock');
  m.querySelector('.fr-md-x').focus();
}
function notesClose(){
  var m=document.getElementById('fr-modal');
  if(m.hidden) return;
  m.hidden=true; m.innerHTML='';
  document.documentElement.classList.remove('fr-lock');
  var b=document.querySelector('.fr-notes'); if(b) b.focus();
}

/* ---------- page ---------- */
function renderReview(){
  document.getElementById('fr-review').innerHTML='<span class="t">Financial report</span><span class="ver">Version 2</span>'+
    '<nav class="fr-rtabs" aria-label="Scenarios">'+Object.keys(SCN).map(function(k){ return '<a href="#/'+k+'"'+(S.scn===k?' class="on"':'')+'>'+SCN[k].label+'</a>'; }).join('')+'</nav>'+
    '<span class="note">Sample data · today is '+fmtDate(TODAY)+'</span>'+
    '<button class="fr-notes" type="button" data-act="notes" aria-haspopup="dialog"><span class="c">'+NOTES.length+'</span>Changes from the feedback</button>';
}
function render(){
  route(); renderReview(); hideTip();
  document.getElementById('fr').innerHTML=page(cur());
}

var toastT;
function toast(msg){ var t=document.getElementById('fr-toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(function(){ t.classList.remove('show'); }, 2200); }

/* CSV: the summary first, then one line per transaction */
function downloadCSV(){
  var p=cur(), list=S.tab==='payouts' ? rowsOf(p.id) : filtered(p), t=totals(list);
  var esc=function(s){ s=String(s==null?'':s); return /[",\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; };
  var period=S.tab==='payouts' || S.per==='all' ? (S.year==='all'||S.tab==='payouts'?'All payouts':'All payouts in '+S.year) : S.per==='none' ? (p.ipc?'Not paid by AXS yet':'Not in a payout yet') : monthLabel(S.per);
  var sum=[[isEv(p)?'Event':'Project', p.name], [p.ipc?'Month':'Payout period', period], ['Currency','SGD'], ['Total '+amountLabel(p), t.recv.toFixed(2)]];
  var head, line;
  if(p.ipc){
    sum=sum.concat([['Total Processing fees', t.fee.toFixed(2)], ['Total Paid to you by AXS', t.paidAxs.toFixed(2)], ['Total Love gifts to Agathos', t.lg.toFixed(2)]]);
    head=['Date & time','Reference','Payment method','Currency','Funding Amount','Donor love gift','Processing fees','Paid to you','Love gift to Agathos','Status','AXS payout date'];
    line=function(r){ return [r.at.replace('T',' '), r.ref, r.method, 'SGD', r.recv.toFixed(2), r.tip.toFixed(2), r.fee.toFixed(2), r.paidAxs.toFixed(2), r.lg.toFixed(2), ST[r.st], axsDate(r.day)]; };
  } else {
    var nx=nextPayout(p.id);
    sum=sum.concat([['Total '+agathosLabel(p), t.ben.toFixed(2)], ['Total Processing fees', t.fee.toFixed(2)], ['Total Net payout', t.net.toFixed(2)], ['Paid out', t.paid.toFixed(2)], ['Awaiting payout', c2(t.await+t.proc).toFixed(2)], ['Next payout date', nx||'']]);
    head=['Date & time','Reference','Payment method','Currency',amountLabel(p),agathosLabel(p),'Processing fees','Net payout','Payout status','Payout date'];
    line=function(r){ return [r.at.replace('T',' '), r.ref, r.method, 'SGD', r.recv.toFixed(2), r.ben.toFixed(2), r.fee.toFixed(2), r.net.toFixed(2), ST[r.st], r.st==='proc'?'':payoutDate(r.per)]; };
  }
  var csv=sum.map(function(x){ return x.map(esc).join(','); }).concat(['', head.map(esc).join(',')], list.map(function(r){ return line(r).map(esc).join(','); })).join('\n');
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download=p.id+'-'+(S.per==='all'||S.tab==='payouts'?'all':S.per)+'.csv';
  document.body.appendChild(a); a.click(); a.remove();
  toast('CSV downloaded');
}

/* ---------- tooltips (info icons and charts) ---------- */
var tipEl=document.getElementById('fr-tip');
function showTip(x, y, strong, text){
  tipEl.textContent='';
  if(strong){ var b=document.createElement('b'); b.textContent=strong; tipEl.appendChild(b); }
  if(text){ var s=document.createElement('span'); s.textContent=text; tipEl.appendChild(s); }
  tipEl.classList.add('show');
  var w=tipEl.offsetWidth, left=Math.max(8, Math.min(window.innerWidth-w-8, x-w/2));
  tipEl.style.left=left+'px'; tipEl.style.top=(y-tipEl.offsetHeight-10)+'px';
}
function hideTip(){ tipEl.classList.remove('show'); }
function infoShow(el){ var r=el.getBoundingClientRect(); showTip(r.left+r.width/2, r.top, '', el.getAttribute('data-tip')); }
document.addEventListener('mouseover', function(ev){ var el=ev.target.closest('.inf'); if(el) infoShow(el); });
document.addEventListener('mouseout', function(ev){ if(ev.target.closest('.inf')) hideTip(); });
document.addEventListener('focusin', function(ev){ if(ev.target.classList && ev.target.classList.contains('inf')) infoShow(ev.target); });
document.addEventListener('focusout', function(ev){ if(ev.target.classList && ev.target.classList.contains('inf')) hideTip(); });
document.addEventListener('pointermove', function(ev){
  var hit=ev.target.closest && ev.target.closest('.hit');
  if(!hit) return;
  var svgEl=hit.ownerSVGElement, c=CHARTS[+hit.getAttribute('data-i')], n=c.pts.length, box=svgEl.getBoundingClientRect();
  var px=(ev.clientX-box.left)/box.width*CW, i=n<2 ? 0 : Math.max(0, Math.min(n-1, Math.round((px-CL)/(CW-CL-CR)*(n-1))));
  var x=cx(i,n), yv=CT+(CH-CT-CB)-c.pts[i].v/c.max*(CH-CT-CB);
  var xh=svgEl.querySelector('.xh'), dot=svgEl.querySelector('.dot');
  xh.setAttribute('x1',x); xh.setAttribute('x2',x); dot.setAttribute('cx',x); dot.setAttribute('cy',yv);
  svgEl.classList.add('on');
  showTip(box.left+x/CW*box.width, box.top+yv/CH*box.height, c.money?money(c.pts[i].v):String(c.pts[i].v), c.pts[i].l);
});
document.addEventListener('pointerout', function(ev){ var hit=ev.target.closest && ev.target.closest('.hit'); if(hit){ hit.ownerSVGElement.classList.remove('on'); hideTip(); } });

/* ---------- events ---------- */
var ACT={
  page:function(t){ S.page=+t.getAttribute('data-p'); render(); var l=document.querySelector('.fr-list'); if(l) l.scrollIntoView({block:'start'}); },
  csv:downloadCSV,
  offline:function(){ toast('Opens the Add Offline Transaction form, as today'); },
  tax:function(){ toast('Opens the Tax Deduction Report menu, as today'); },
  invoice:function(){ toast('Sample: no invoice file yet'); },
  other:function(){ toast('Not part of this prototype'); },
  notes:notesOpen,
  notesClose:notesClose
};
document.addEventListener('click', function(ev){
  if(ev.target.id==='fr-modal'){ notesClose(); return; }
  var t=ev.target.closest('[data-act]');
  if(t && ACT[t.getAttribute('data-act')]){ ev.preventDefault(); ACT[t.getAttribute('data-act')](t); return; }
  var a=ev.target.closest('.mp-crumb a'); if(a) ev.preventDefault();
});
document.addEventListener('change', function(ev){
  var el=ev.target;
  if(el.hasAttribute('data-f')){ S[el.getAttribute('data-f')]=el.value; S.page=1; render(); }
});
document.addEventListener('keydown', function(ev){ if(ev.key==='Escape') notesClose(); });
window.addEventListener('hashchange', function(){ S.page=1; render(); window.scrollTo(0,0); });

/* nav (same behaviour as the homepage) */
(function(){
  var nav=document.getElementById('nav');
  nav.addEventListener('click', function(ev){
    var b=ev.target.closest('.burger'); if(!b) return;
    var open=nav.classList.toggle('open'); b.setAttribute('aria-expanded', open?'true':'false');
  });
  nav.querySelectorAll('.hp-nav-menu a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); }); });
})();

render();
})();
