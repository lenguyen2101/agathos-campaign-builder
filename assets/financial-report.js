/* ============================================================================
   Agathos — financial report, version 2 (/financial-report).
   v1 (commit 62edf78) reworked to follow the team's comments of 29/10/2026 one by
   one (mapping in docs/financial-report-v2-plan.md, sections 13–14):
     #/pages/<entity>/projects|events|payouts   Manage Pages: Personal or one organisation;
                                                Payouts sit here, above the project level (F1)
     #/manage/<id>/transactions|payouts         Manage Project › Transactions & Payouts
     #/manage/<id>/orders|payouts               Manage Event › Orders & Payouts
     #/manage/<id>/transactions|invoices        an IPC charity on AXS: the charity receives the
                                                money, Agathos invoices its love gifts
   Manage Project / Manage Event show the data of that one project or event only.
   Production screens (nav, Manage Pages, Manage Project / Event) are rebuilt from
   screenshots (1728px screen, 1216px content).
   Sample data: one payout a month, on the 20th of the next month. Today is 29 Oct 2026.
   ============================================================================ */
(function(){
'use strict';

var TODAY='2026-10-29';
var UPLOADED='2026-10-25';   /* last day covered by the payment data uploaded so far */
var IMG='assets/img/home/';

var PROJECTS={
  erbil:   {id:'erbil',    ent:'antioch',  name:'Special Needs Centre in Erbil',    kind:'project', psp:'stripe', ben:.05, tip:.6, n:12, from:'2025-11', goal:60000, img:'project-storybook.jpg'},
  outreach:{id:'outreach', ent:'antioch',  name:'Outreach @ displaced families',    kind:'project', psp:'stripe', ben:.05, tip:.5, n:7,  from:'2026-03', goal:20000, img:'project-nepal.jpg'},
  concert: {id:'concert',  ent:'antioch',  name:'Benefit concert for the unseen',   kind:'event',   psp:'2c2p',   ben:.03, tip:0,  n:18, from:'2026-08', img:'project-carnival.jpg', when:['2026-11-15T19:00','2026-11-15T22:00']},
  care:    {id:'care',     ent:'personal', name:'Care packages for migrant workers', kind:'project', psp:'stripe', ben:.05, tip:.5, n:6,  from:'2026-05', goal:8000,  img:'hero-3.jpg'},
  sunny:   {id:'sunny',    ent:'sunshine', name:'Sunny Days for Seniors',           kind:'project', psp:'axs', ipc:true, ben:.05, tip:.4, n:10, from:'2026-01', goal:40000, img:'hero-2.jpg'}
};
/* Manage Pages: the account's own pages and the organisations it belongs to.
   Agathos pays each one with one transfer per payout date, to that one's bank account. */
var ENTITIES={
  personal:{id:'personal', label:'Personal',     name:'lenguyen2101',          avatar:'assets/img/task220/avatar-user.png', bank:'POSB ••••1093'},
  antioch: {id:'antioch',  label:'Organization', name:'Antioch 21',            role:'Owner', bank:'DBS ••••4821'},
  sunshine:{id:'sunshine', label:'Organization', name:'Sunshine Care Society', role:'Owner', ipc:true}
};
var ENT_ORDER=['personal','antioch','sunshine'];

var MONTHS=(function(){ var out=[], y=2025, m=11; while(y*100+m<=202610){ out.push(y+'-'+String(m).padStart(2,'0')); if(++m>12){ m=1; y++; } } return out; })();

/* ---------- helpers ---------- */
function h(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function c2(x){ return Math.round(x*100)/100; }
function cents(x){ return Math.round(x*100); }
function fmt2(x){ return Math.abs(x).toLocaleString('en-SG',{minimumFractionDigits:2, maximumFractionDigits:2}); }
function money(x){ return (x<0?'−':'')+'S$'+fmt2(x); }
function num(x){ return (x<0?'−':'')+fmt2(x); }
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function d(iso){ var p=iso.slice(0,10).split('-'); return {y:+p[0], m:+p[1], d:+p[2]}; }
function fmtDate(iso){ var x=d(iso); return x.d+' '+MON[x.m-1]+' '+x.y; }
function fmtDMY(iso){ var x=d(iso); return String(x.d).padStart(2,'0')+'/'+String(x.m).padStart(2,'0')+'/'+x.y; }
function addDays(iso, n){ var x=d(iso), t=new Date(Date.UTC(x.y, x.m-1, x.d+n)); return t.toISOString().slice(0,10); }
function weekday(iso){ var x=d(iso); return new Date(Date.UTC(x.y, x.m-1, x.d)).getUTCDay(); }
function monthLabel(per){ var p=per.split('-'); return MON[+p[1]-1]+' '+p[0]; }
function monthDays(per){ var p=per.split('-'); return new Date(Date.UTC(+p[0], +p[1], 0)).getUTCDate(); }
function nextMonth(per){ var p=per.split('-'), y=+p[0], m=+p[1]+1; if(m>12){ m=1; y++; } return y+'-'+String(m).padStart(2,'0'); }
function monthRange(per){ return '1–'+monthDays(per)+' '+monthLabel(per); }
/* the 20th of the next month; a Saturday or Sunday moves to the Monday */
function payoutDate(per){ var iso=nextMonth(per)+'-20', w=weekday(iso); return w===6 ? addDays(iso,2) : w===0 ? addDays(iso,1) : iso; }
function initials(s){ return s.split(/\s+/).filter(Boolean).slice(0,2).map(function(w){ return w[0]; }).join('').toUpperCase(); }

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
var ST={paid:'Paid out', await:'Awaiting next payout', proc:'Processing'};

/* team's three statuses: new = Processing; in an uploaded data file = Awaiting next payout; after the payout date = Paid out */
function status(row){
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
    else row.st=status(row);
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
/* a payout period shows up once its payment data is uploaded; IPC rows sit in their sales month */
function inPeriod(r){ return r.p.ipc || r.st!=='proc'; }

/* totals in whole cents so the parts always add up to the whole */
function totals(list){
  var k=['recv','ben','fee','net','tip','paid','await','proc','paidAxs','lg'], c={}, t={n:list.length, qty:0};
  k.forEach(function(x){ c[x]=0; });
  list.forEach(function(r){
    ['recv','ben','fee','net','tip'].forEach(function(x){ c[x]+=cents(r[x]); });
    t.qty+=r.qty;
    if(r.p.ipc){ c.paidAxs+=cents(r.paidAxs); c.lg+=cents(r.lg); }
    else c[r.st]+=cents(r.net);
  });
  k.forEach(function(x){ t[x]=c[x]/100; });
  return t;
}

/* ---------- state ---------- */
var S={view:'manage', key:'erbil', tab:'transactions', ctx:'', year:'all', per:'all', pyear:'all', pper:'all', page:1, open:{}, carry:null};
function pidsOf(eid){ return Object.keys(PROJECTS).filter(function(id){ return PROJECTS[id].ent===eid; }); }
function manageTabs(p){ return p.ipc ? [['transactions','Transactions'],['invoices','Invoices']] : isEv(p) ? [['orders','Orders'],['payouts','Payouts']] : [['transactions','Transactions'],['payouts','Payouts']]; }
function pageTabs(e){ return [['projects','Projects'],['events','Events'], e.ipc ? ['invoices','Invoices'] : ['payouts','Payouts']]; }
var ALIAS={project:'erbil', event:'concert', ipc:'sunny'};
function route(){
  var p=location.hash.replace(/^#\/?/,'').split('/'), view, key, tab, tabs;
  if(p[0]==='pages'){
    view='pages'; key=ENTITIES[p[1]] ? p[1] : 'antioch'; tabs=pageTabs(ENTITIES[key]); tab=p[2];
  } else {
    view='manage'; key=p[0]==='manage' ? (PROJECTS[p[1]] ? p[1] : 'erbil') : (ALIAS[p[0]] || 'erbil'); tabs=manageTabs(PROJECTS[key]); tab=p[0]==='manage' ? p[2] : p[1];
  }
  if(!tabs.some(function(t){ return t[0]===tab; })) tab=tabs[0][0];
  var ctx=view+':'+key;
  if(ctx!==S.ctx){ S.year='all'; S.per='all'; S.pyear='all'; S.pper='all'; S.page=1; S.open={}; }
  if(S.carry){ S.pper=S.carry; S.carry=null; }
  S.view=view; S.key=key; S.tab=tab; S.ctx=ctx;
}
function cur(){ return PROJECTS[S.key]; }
function yearOk(per, y){ return y==='all' || per.slice(0,4)===y; }
function filtered(p){
  return rowsOf(p.id).filter(function(r){
    if(!yearOk(r.per, S.year)) return false;
    if(S.per==='all') return true;
    if(S.per==='none') return r.st==='proc';
    return r.per===S.per && inPeriod(r);
  });
}
function periodsOf(ids){ var seen={}; ids.forEach(function(id){ rowsOf(id).forEach(function(r){ if(inPeriod(r)) seen[r.per]=1; }); }); return MONTHS.filter(function(m){ return seen[m]; }); }
function yearsOf(pers){ var y=[]; pers.forEach(function(m){ var x=m.slice(0,4); if(y.indexOf(x)<0) y.push(x); }); return y; }

/* ---------- words that change between a project and an event ---------- */
function isEv(p){ return p.kind==='event'; }
function amountLabel(p){ return isEv(p) ? 'Ticket Sales Amount' : 'Funding Amount'; }
function agathosLabel(p){ return isEv(p) ? 'Agathos Platform fee' : 'Beneficiary Love Gift to Agathos'; }
function rowsWord(p){ return isEv(p) ? 'Orders' : 'Transactions'; }
function plural(n, w){ return n+' '+w+(n===1?'':'s'); }
function countText(p, n){ return plural(n, isEv(p)?'order':'transaction'); }
function kinds(ids){
  var pr=ids.filter(function(id){ return PROJECTS[id].kind==='project'; }).length, ev=ids.length-pr;
  return [pr?plural(pr,'project'):'', ev?plural(ev,'event'):''].filter(Boolean).join(', ');
}
function others(ids, self){
  var o=ids.filter(function(id){ return id!==self; }).map(function(id){ return PROJECTS[id].kind; }), n=o.length;
  if(!n) return '';
  return n+' other '+(o.indexOf('project')>=0 && o.indexOf('event')>=0 ? 'projects and events' : o[0]+(n>1?'s':''));
}
/* one payout = one payout date for one organisation (or Personal), summed across its projects and events */
function payout(per, eid){
  var ids=pidsOf(eid).filter(function(id){ return !PROJECTS[id].ipc && rowsOf(id).some(function(r){ return r.per===per && inPeriod(r); }); });
  var parts=ids.map(function(id){ return {id:id, t:totals(rowsOf(id).filter(function(r){ return r.per===per && inPeriod(r); }))}; });
  var all=[]; ids.forEach(function(id){ all=all.concat(rowsOf(id).filter(function(r){ return r.per===per && inPeriod(r); })); });
  var date=payoutDate(per);
  return {per:per, ids:ids, parts:parts, t:totals(all), date:date, paid:date<=TODAY};
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
  plus:svg('<path d="M12 5v14M5 12h14"/>'),
  doc:svg('<rect x="3.5" y="4" width="17" height="12.5" rx="1.5"/><path d="M12 16.5V20M8.5 20h7M7.5 8.5h5M7.5 12h8"/>'),
  caret:svg('<path d="M6.5 9.5l5.5 5.5 5.5-5.5"/>'),
  cal:svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'),
  check:svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  clock:svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  arrow:svg('<path d="M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5"/>'),
  edit:svg('<path d="M12 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5v-6"/><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>'),
  pen:svg('<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>'),
  eye:svg('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'),
  leave:svg('<path d="M14 4.5h4A1.5 1.5 0 0 1 19.5 6v12a1.5 1.5 0 0 1-1.5 1.5h-4"/><path d="M10 16.5L5.5 12 10 7.5M5.5 12h10"/>'),
  dots:svg('<circle cx="12" cy="5.5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="18.5" r="1.4" fill="currentColor"/>')
};

/* ============ MANAGE PAGES (production, plus a Payouts tab) ============ */
var DASH_TABS=[['My Dashboard','Overview of your impact'],['Contributions','Track your donations & support'],['Tickets','View purchased tickets'],['Transactions Log','A detailed view of your donations & ticket purchases'],['Manage Pages','For Project, Event & Organization Owners']];
function entAvatar(e){ return e.avatar ? '<img class="av" src="'+e.avatar+'" alt="">' : '<span class="av">'+initials(e.name)+'</span>'; }
function projectCard(p){
  var t=totals(rowsOf(p.id)), pct=p.goal ? t.recv/p.goal*100 : 0, started=p.from+'-01';
  return '<article class="pc"><div class="pc-img"><img src="'+IMG+p.img+'" alt=""><span class="pc-st">Ongoing</span></div>'+
    '<div class="pc-main"><h3>'+h(p.name)+'</h3><a class="pc-manage" href="#/manage/'+p.id+'/'+manageTabs(p)[0][0]+'">'+I.edit+'Manage Project</a></div>'+
    '<div class="pc-stats"><div class="r1"><span>Started: '+fmtDMY(started)+'</span><span class="vis">Public</span></div>'+
      '<div class="r2"><b>S$'+Math.round(t.recv).toLocaleString('en-SG')+'</b><span>'+plural(t.n,'contribution')+'</span></div>'+
      '<div class="bar"><i style="width:'+Math.min(100,pct).toFixed(2)+'%"></i></div>'+
      '<div class="r3">'+parseFloat(pct.toFixed(2))+'% of S$'+p.goal.toLocaleString('en-SG')+'</div></div></article>';
}
function eventCard(p){
  var a=p.when[0], b=p.when[1];
  return '<article class="pc ev"><div class="pc-img"><img src="'+IMG+p.img+'" alt=""></div>'+
    '<div class="pc-main"><div class="ev-top"><h3>'+h(p.name)+'</h3><span class="vis">Public</span></div>'+
      '<p class="ev-when">'+a.slice(11,16)+'-'+fmtDMY(a)+' • '+b.slice(11,16)+'-'+fmtDMY(b)+'</p>'+
      '<a class="pc-manage" href="#/manage/'+p.id+'/'+manageTabs(p)[0][0]+'">'+I.edit+'Manage Event</a></div></article>';
}
function pagesView(e){
  var nav='<nav class="dn" aria-label="Account">'+DASH_TABS.map(function(t,i){ var on=i===DASH_TABS.length-1; return '<a href="#"'+(on?' class="on" aria-current="page"':' data-act="other"')+'><b>'+t[0]+'</b><span>'+t[1]+'</span></a>'; }).join('')+'</nav>';
  var side='<aside class="dp-side"><div class="dp-ents">'+ENT_ORDER.map(function(id){ var x=ENTITIES[id];
    return '<a class="dp-ent'+(id===e.id?' on':'')+'" href="#/pages/'+id+'/'+(S.tab==='events'?'events':'projects')+'">'+entAvatar(x)+'<span class="t"><span>'+x.label+'</span><b>'+h(x.name)+'</b></span></a>';
  }).join('')+'</div><button class="dp-create" type="button" data-act="other">'+I.plus+'Create Organization</button></aside>';
  var head=e.role ? '<div class="dp-head"><div><h2>'+h(e.name)+'</h2><span class="dp-role">'+e.role+'</span></div>'+
    '<div class="mp-dd dp-actions"><button class="dp-act" type="button" data-act="menu" aria-haspopup="menu" aria-expanded="false">Actions'+I.dots+'</button>'+
      '<div class="mp-pop" role="menu"><button type="button" role="menuitem" data-act="other">'+I.pen+'Manage</button><button type="button" role="menuitem" data-act="other">'+I.eye+'View Page</button><hr><button type="button" role="menuitem" class="danger" data-act="other">'+I.leave+'Leave Organization</button></div></div></div>' : '';
  var tabs='<div class="dp-tabs"><nav class="dp-pills" aria-label="'+h(e.name)+'">'+pageTabs(e).map(function(t){
    return '<a href="#/pages/'+e.id+'/'+t[0]+'"'+(S.tab===t[0]?' class="on" aria-current="page"':'')+'>'+t[1]+'</a>';
  }).join('')+'</nav>'+(S.tab==='events'?'<button class="dp-new" type="button" data-act="other">'+I.plus+'Create Event</button>':'')+'</div>';
  var ids=pidsOf(e.id), body;
  if(S.tab==='projects'){ var pr=ids.filter(function(id){ return !isEv(PROJECTS[id]); }); body=pr.length ? pr.map(function(id){ return projectCard(PROJECTS[id]); }).join('') : '<div class="dp-empty">No projects yet.</div>'; }
  else if(S.tab==='events'){ var ev=ids.filter(function(id){ return isEv(PROJECTS[id]); }); body=ev.length ? ev.map(function(id){ return eventCard(PROJECTS[id]); }).join('') : '<div class="dp-empty">No events yet.</div>'; }
  else if(S.tab==='invoices') body=viewInvoices(ids);
  else body=viewEntityPayouts(e);
  return '<div class="dp-wrap"><div class="dn-rule">'+nav+'</div><div class="dp-inner"><div class="dp">'+side+
    '<section class="dp-main">'+head+tabs+'<div class="dp-list'+(S.tab==='projects'||S.tab==='events'?' cards':'')+'">'+body+'</div></section></div></div></div>';
}

/* ============ MANAGE PROJECT / MANAGE EVENT (production chrome) ============ */
var MENU={
  project:[['info','Project Information'],['giving','Giving Settings'],['updates','Updates'],['impact','Impact Report'],['people','Human Resource'],['items','Items'],['dollar','Transactions & Payouts',1]],
  event:[['info','Event Information'],['tag','Tickets & Forms'],['people','Attendees Information'],['scan','Scan Ticket'],['card','Orders & Payouts',1]]
};
function managePage(p){
  var ev=isEv(p);
  var crumb=ev ? ['Events', p.name, 'Manage Event'] : ['Support a Cause', p.name, 'Manage Project'];
  var side='<aside class="mp-side"><h1>'+(ev?'Manage Event':'Manage Project')+'</h1><ul class="mp-menu">'+MENU[ev?'event':'project'].map(function(m){
    return '<li><a href="#"'+(m[2]?' class="on" aria-current="page"':' data-act="other"')+'>'+I[m[0]]+'<span>'+m[1]+'</span>'+I.chev+'</a></li>';
  }).join('')+'</ul><button class="mp-back" type="button" data-act="other">'+(ev?'Back to Event':'Back to Project page')+'</button></aside>';
  /* the current buttons stay (team comment F3); the two downloads share one Export menu so the actions fit on the tab row */
  var actions=ev
    ? '<button class="mp-act" type="button" data-act="csv">'+I.down+'Export Orders as .csv</button>'
    : '<button class="mp-act" type="button" data-act="offline">'+I.plusC+'Add Offline Transaction</button>'+
      '<div class="mp-dd"><button class="mp-act" type="button" data-act="menu" aria-haspopup="menu" aria-expanded="false">'+I.down+'Export'+I.caret+'</button>'+
        '<div class="mp-pop" role="menu"><button type="button" role="menuitem" data-act="csv">'+I.down+'Export as .csv</button><button type="button" role="menuitem" data-act="tax">'+I.doc+'Tax Deduction Report</button></div></div>';
  var seg='<nav class="mp-seg" aria-label="'+(ev?'Orders and payouts':'Transactions and payouts')+'">'+manageTabs(p).map(function(t){
    return '<a href="#/manage/'+p.id+'/'+t[0]+'"'+(S.tab===t[0]?' class="on" aria-current="page"':'')+'>'+t[1]+'</a>';
  }).join('')+'</nav>';
  var head='<h2 class="mp-title">'+(ev?'Orders &amp; Payouts':'Transactions &amp; Payouts')+'</h2><div class="mp-bar">'+seg+'<div class="mp-acts">'+actions+'</div></div>';
  var body=S.tab==='payouts' ? viewPayouts(p) : S.tab==='invoices' ? viewInvoices([p.id]) : viewRows(p);
  return '<div class="mp'+(ev?' is-event':'')+'"><div class="mp-inner">'+
    '<nav class="mp-crumb" aria-label="Breadcrumb"><a href="#" aria-label="Home">'+I.home+'</a>'+crumb.map(function(c){ return I.crumb+'<a href="#">'+h(c)+'</a>'; }).join('')+'</nav>'+
    side+'<section class="mp-card">'+head+body+'</section></div></div>';
}

/* ---------- summary: left side, and the summary table on the right ---------- */
function summaryBox(left, rows){
  return '<section class="ov"><div class="ov-left">'+left+'</div><dl class="ov-rows">'+rows.map(function(r){
    return '<div class="'+(r[2]||'')+'"><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>';
  }).join('')+'</dl></section>';
}
/* a long label set on two lines; the words stay as written */
function two(a, b){ return a+' <span class="l2">'+b+'</span>'; }
function payStatus(date, bank){
  var done=date<=TODAY;
  return '<span class="tag '+(done?'ok':'up')+'">'+(done?I.check+'Paid':I.clock+'Upcoming')+'</span><span class="tx">Agathos '+(done?'paid ':'pays ')+bank+'<br>on '+fmtDate(date)+'</span>';
}
function bigLeft(label, value, status){
  return '<div class="lbl">'+label+'</div><div class="big">'+money(value)+'</div>'+(status?'<div class="ov-status">'+status+'</div>':'');
}
function nextDate(list){ return list.filter(function(r){ return r.st==='await' || r.st==='proc'; }).map(function(r){ return payoutDate(r.per); }).sort()[0]; }
function bankOf(p){ return ENTITIES[p.ent].bank; }

function summaryRows(p, list){
  var t=totals(list), cnt='<small class="cnt">'+countText(p, t.n)+'</small>';
  if(p.ipc){
    return summaryBox(bigLeft('Paid to you by AXS', t.paidAxs, '<span class="tx">AXS pays donations to you directly.</span>'), [
      ['Total Funding Amount'+cnt, money(t.recv)],
      ['Donor love gifts', money(t.tip)],
      [two('Processing fees','(to Payment Service Provider)'), money(-t.fee)],
      ['Paid to you by AXS', money(t.paidAxs), 'total'],
      ['Love gifts to Agathos (invoiced)', money(t.lg), 'after']]);
  }
  if(S.per==='all'){
    /* default summary: the totals on the right; on the left, paid out and awaiting pay out, one amount per line, and the bar under them */
    var aw=c2(t.await+t.proc), due=nextDate(list), all=t.paid+aw || 1;
    var left='<ul class="ov-lines">'+
        '<li><div class="lbl"><i class="sw paid"></i>Total paid out</div><div class="v">'+money(t.paid)+'</div></li>'+
        '<li><div class="lbl"><i class="sw await"></i>Total awaiting pay out</div><div class="v">'+money(aw)+'</div>'+(aw && due?'<div class="s">Agathos pays on '+fmtDate(due)+'</div>':'')+'</li>'+
      '</ul>'+
      '<div class="ov-bar" role="img" aria-label="Total paid out '+money(t.paid)+', total awaiting pay out '+money(aw)+'">'+
        (t.paid?'<i class="paid" style="width:'+(t.paid/all*100).toFixed(2)+'%"></i>':'')+(aw?'<i class="await" style="width:'+(aw/all*100).toFixed(2)+'%"></i>':'')+'</div>';
    return summaryBox(left, [
      ['Total '+amountLabel(p)+cnt, money(t.recv)],
      ['Total '+agathosLabel(p), money(-t.ben)],
      [two('Total Processing fees','(to Payment Service Provider)'), money(-t.fee)],
      ['Total Net to you', money(t.net), 'total']]);
  }
  var status=S.per==='none' ? '<span class="tag up">'+I.clock+'Not in a payout yet</span>' : payStatus(payoutDate(S.per), bankOf(p));
  return summaryBox(bigLeft('Net to you', t.net, status), [
    ['Total '+amountLabel(p)+cnt, money(t.recv)],
    [agathosLabel(p), money(-t.ben)],
    [two('Processing fees','(to Payment Service Provider)'), money(-t.fee)],
    ['Net to you', money(t.net), 'total']]);
}

/* payout summary card: this project's share only; says when it is part of a larger payout; the expected date only while unpaid;
   the link goes to the payouts above the project level (Josias, A22) */
function payoutCard(p){
  if(S.per==='none') return '';
  var per=S.per;
  if(per==='all'){
    var mine=periodsOf([p.id]).filter(function(m){ return yearOk(m, S.year); });
    per=mine.filter(function(m){ return payoutDate(m)>TODAY; })[0] || mine[mine.length-1];
  }
  if(!per) return '';
  var po=payout(per, p.ent), part=po.parts.filter(function(x){ return x.id===p.id; })[0];
  return '<a class="ps" href="#/pages/'+p.ent+'/payouts" data-act="toPayout" data-per="'+per+'" data-ent="'+p.ent+'"><span class="hp-kicker">Payout summary</span>'+
    '<b>'+monthRange(per)+'</b>'+
    '<p>'+money(part.t.net)+' to you'+(po.paid?'':' · Agathos pays on '+fmtDate(po.date))+'</p>'+
    (po.ids.length>1?'<p>This is part of a larger payout with '+others(po.ids, p.id)+'.</p>':'')+
    '<span class="go">See payout summary '+I.arrow+'</span></a>';
}

/* ---------- 1. Transactions / Orders ---------- */
function sel(label, key, opts, val){
  return '<div class="fr-sel"><label for="f-'+key+'">'+label+'</label><select id="f-'+key+'" data-f="'+key+'">'+opts.map(function(o){
    return '<option value="'+h(o[0])+'"'+(o[0]===val?' selected':'')+'>'+h(o[1])+'</option>';
  }).join('')+'</select></div>';
}
function yearOpts(pers){ return [['all','All years']].concat(yearsOf(pers).map(function(y){ return [y,y]; })); }
function viewRows(p){
  var allPers=periodsOf([p.id]), pers=allPers.filter(function(m){ return yearOk(m, S.year); });
  var hasProc=!p.ipc && rowsOf(p.id).some(function(r){ return r.st==='proc' && yearOk(r.per, S.year); });
  var opts=[['all', p.ipc?'All months':'All payouts']].concat(pers.map(function(m){ return [m, monthRange(m)]; }));
  if(hasProc) opts.push(['none','Not in a payout yet']);
  if(!opts.some(function(o){ return o[0]===S.per; })) S.per='all';
  var list=filtered(p);
  return '<div class="fr-filters">'+sel('Year','year',yearOpts(allPers),S.year)+sel(p.ipc?'Month':'Payout period','per',opts,S.per)+'</div>'+
    summaryRows(p, list)+stats(p, list)+(p.ipc?'':payoutCard(p))+table(p, list);
}

/* giving statistics in a line graph: amount collected per day, number of donations (orders for an event) per day */
var CHARTS=[];
function stats(p, list){
  if(!list.length) return '';
  var days=list.map(function(r){ return r.day; }).sort(), first, last, keys=[], amt={}, cnt={};
  if(S.per!=='all' && S.per!=='none'){ first=S.per+'-01'; last=S.per===TODAY.slice(0,7) ? days[days.length-1] : S.per+'-'+monthDays(S.per); }
  else { first=days[0]; last=days[days.length-1]; }
  for(var x=first; x<=last; x=addDays(x,1)){ keys.push(x); amt[x]=0; cnt[x]=0; }
  list.forEach(function(r){ if(r.day in amt){ amt[r.day]+=cents(r.recv); cnt[r.day]++; } });
  var a={money:true, pts:keys.map(function(k){ return {l:fmtDate(k), v:amt[k]/100}; })};
  var b={pts:keys.map(function(k){ return {l:fmtDate(k), v:cnt[k]}; })};
  CHARTS=[a,b];
  return '<section class="fr-sec fr-stats"><div class="fr-sec-head"><h3>Giving statistics</h3><span class="sub">'+fmtDate(first)+' – '+fmtDate(last)+'</span></div><div class="fr-charts">'+
    '<figure class="ch"><figcaption>Amount collected per day (S$)</figcaption>'+chartSvg(0, a)+'</figure>'+
    '<figure class="ch"><figcaption>No. of '+(isEv(p)?'orders':'donations')+' per day</figcaption>'+chartSvg(1, b)+'</figure></div></section>';
}
var CW=700, CH=170, CL=44, CR=10, CT=12, CB=24;
function niceMax(v){ if(v<=0) return 1; var e=Math.pow(10, Math.floor(Math.log10(v))), f=v/e; return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*e; }
function tick(v, isMoney){ if(!isMoney) return String(Math.round(v*10)/10); return v>=1000 ? (v/1000).toLocaleString('en-SG',{maximumFractionDigits:1})+'k' : String(Math.round(v)); }
function xAt(c, i){ var n=c.pts.length, iw=CW-CL-CR; return CL+(n<2 ? iw/2 : i*iw/(n-1)); }
function yAt(c, v){ var ih=CH-CT-CB; return CT+ih-v/c.max*ih; }
function idxAt(c, px){ var n=c.pts.length, iw=CW-CL-CR; return n<2 ? 0 : Math.max(0, Math.min(n-1, Math.round((px-CL)/iw*(n-1)))); }
function chartSvg(idx, c){
  var n=c.pts.length, iw=CW-CL-CR, ih=CH-CT-CB, max=niceMax(Math.max.apply(null, c.pts.map(function(p){ return p.v; })));
  if(!c.money && max<4) max=4;
  c.max=max;
  var grid=[0, max/2, max].map(function(v){ var y=yAt(c,v); return '<line class="g" x1="'+CL+'" x2="'+(CW-CR)+'" y1="'+y+'" y2="'+y+'"/><text class="ax" x="'+(CL-6)+'" y="'+(y+3.5)+'" text-anchor="end">'+tick(v, c.money)+'</text>'; }).join('');
  var xl=[0, Math.floor((n-1)/2), n-1].filter(function(v,i,a){ return a.indexOf(v)===i; }).map(function(i){
    return '<text class="ax" x="'+xAt(c,i)+'" y="'+(CH-6)+'" text-anchor="'+(i===0?'start':i===n-1?'end':'middle')+'">'+h(c.pts[i].l)+'</text>';
  }).join('');
  var line=c.pts.map(function(p,i){ return (i?'L':'M')+xAt(c,i).toFixed(1)+' '+yAt(c,p.v).toFixed(1); }).join(' ');
  var label=c.pts.map(function(p){ return p.l+' '+(c.money?money(p.v):p.v); }).join(', ');
  return '<svg class="ch-svg" viewBox="0 0 '+CW+' '+CH+'" role="img" aria-label="'+h(label)+'">'+grid+xl+
    '<path class="area" d="'+line+' L'+xAt(c,n-1).toFixed(1)+' '+yAt(c,0)+' L'+xAt(c,0).toFixed(1)+' '+yAt(c,0)+' Z"/><path class="ln" d="'+line+'"/>'+
    '<line class="xh" x1="0" x2="0" y1="'+CT+'" y2="'+(CT+ih)+'"/><circle class="dot" r="4" cx="0" cy="0"/>'+
    '<rect class="hit" data-i="'+idx+'" x="'+(CL-6)+'" y="0" width="'+(iw+12)+'" height="'+CH+'"/></svg>';
}

var PER_PAGE=10;
function columns(p){
  if(p.ipc) return [
    ['Date & time','dt'], ['Reference','ref','c'], ['Payment method','method'], ['Currency','cur'], ['Funding Amount','recv','n'],
    ['Processing fees','fee','n','neg'], ['Paid to you','paidAxs','n','net'], ['Love gift to Agathos','lg','n']];
  return [
    ['Date & time','dt'], ['Reference','ref','c'], ['Payment method','method'], ['Currency','cur'], [amountLabel(p),'recv','n'],
    [agathosLabel(p),'ben','n','neg'], ['Processing fees','fee','n','neg'], ['Net payout','net','n','net'], ['Payout status','st']];
}
function stTag(st, text){ return '<span class="st st-'+st+'"><i></i>'+(text||ST[st])+'</span>'; }
function cell(c, r){
  if(c[1]==='dt') return fmtDate(r.at)+', '+r.at.slice(11,16);
  if(c[1]==='cur') return 'SGD';
  if(c[1]==='st') return stTag(r.st);
  if(c[2]==='c') return '<code>'+h(r.ref)+'</code>';
  if(c[2]==='n') return num(c[3]==='neg' ? -r[c[1]] : r[c[1]]);
  return h(r[c[1]]);
}
/* the first two columns stay in place while the table scrolls sideways */
function fz(i){ return i===0 ? 'c1' : i===1 ? 'c2' : ''; }
function cls(){ return Array.prototype.filter.call(arguments, Boolean).join(' '); }
/* 1 … 4 5 6 … 16 */
function pageList(c, n){
  if(n<=7){ var a=[]; for(var i=1;i<=n;i++) a.push(i); return a; }
  var s=Math.max(2, c-1), e=Math.min(n-1, c+1);
  if(c<=3){ s=2; e=4; }
  if(c>=n-2){ s=n-3; e=n-1; }
  var out=[1]; if(s>2) out.push('…');
  for(var j=s;j<=e;j++) out.push(j);
  if(e<n-1) out.push('…');
  out.push(n);
  return out;
}
function pager(total, start, count, pages){
  if(pages<2) return '';
  return '<nav class="fr-pager" aria-label="Pages"><span>'+(start+1)+'–'+(start+count)+' of '+total+'</span><div class="pg">'+
    '<button type="button" class="arw" data-act="page" data-p="'+(S.page-1)+'"'+(S.page<=1?' disabled':'')+' aria-label="Previous page">'+svg('<path d="M14.5 6.5L9 12l5.5 5.5"/>')+'</button>'+
    pageList(S.page, pages).map(function(x){
      return x==='…' ? '<span class="gap">…</span>' : '<button type="button" data-act="page" data-p="'+x+'"'+(x===S.page?' class="on" aria-current="page"':'')+'>'+x+'</button>';
    }).join('')+
    '<button type="button" class="arw" data-act="page" data-p="'+(S.page+1)+'"'+(S.page>=pages?' disabled':'')+' aria-label="Next page">'+svg('<path d="M9.5 6.5L15 12l-5.5 5.5"/>')+'</button></div></nav>';
}
function table(p, list){
  var cols=columns(p), pages=Math.max(1, Math.ceil(list.length/PER_PAGE));
  if(S.page>pages) S.page=pages;
  var start=(S.page-1)*PER_PAGE, slice=list.slice(start, start+PER_PAGE);
  var head='<tr>'+cols.map(function(c,i){ return '<th class="'+cls(fz(i), c[2]==='n'&&'n')+'">'+c[0]+'</th>'; }).join('')+'</tr>';
  var body=slice.map(function(r){ return '<tr>'+cols.map(function(c,i){ return '<td class="'+cls(fz(i), c[2]==='n'&&'n', c[3]==='net'&&'net')+'">'+cell(c,r)+'</td>'; }).join('')+'</tr>'; }).join('');
  var netCol=cols.filter(function(c){ return c[3]==='net'; })[0];
  var cards=slice.map(function(r){
    return '<div class="fr-item"><div class="r1"><span>'+fmtDate(r.at)+', '+r.at.slice(11,16)+'</span><b>SGD '+num(r.recv)+'</b></div>'+
      '<div class="r2">'+(r.st?stTag(r.st):'<span>'+h(r.method)+'</span>')+'<span class="net">'+netCol[0]+' '+num(r[netCol[1]])+'</span></div>'+
      '<details><summary>Details</summary><dl>'+cols.map(function(c){ return '<div><dt>'+c[0]+'</dt><dd>'+cell(c,r)+'</dd></div>'; }).join('')+'</dl></details></div>';
  }).join('');
  return '<section class="fr-sec fr-list"><div class="fr-sec-head"><h3>'+rowsWord(p)+' <span class="n">'+list.length+'</span></h3></div>'+
    (list.length ? '<div class="fr-tw has-cards"><table class="fr-t tx"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div><div class="fr-cards">'+cards+'</div>'+pager(list.length, start, slice.length, pages)
                 : '<div class="fr-empty">No '+rowsWord(p).toLowerCase()+' here.</div>')+'</section>';
}

/* ---------- 2. Payouts ---------- */
function split(label){ var i=label.indexOf('/'); return label.slice(0,i+1)+'<span class="l2">'+label.slice(i+1)+'</span>'; }
function nextBox(dates){
  var up=dates.filter(function(x){ return x>TODAY; }).sort()[0];
  if(!up) return '';
  return '<div class="nx">'+I.cal+'<div><b>Next payout: '+fmtDate(up)+'</b><p>Payouts are processed on the 20th of each month for the previous month\'s sales.<br>If the 20th falls on a non-working day, the payout shifts to the next working day.</p></div></div>';
}
/* Paid out and Balance under the table, so they show whatever the sideways scroll */
function payBalance(paid, balance){ return '<div class="fr-tot"><div><span>Paid out</span><b>'+money(paid)+'</b></div><div><span>Balance</span><b>'+money(balance)+'</b></div></div>'; }
function payoutFilters(pers, allPers){
  if(S.pper!=='all' && pers.indexOf(S.pper)<0) S.pper='all';
  return '<div class="fr-filters">'+sel('Year','pyear',yearOpts(allPers),S.pyear)+sel('Payout period','pper',[['all','All payouts']].concat(pers.map(function(m){ return [m, monthRange(m)]; })),S.pper)+'</div>';
}

/* 2a. Manage Project / Manage Event: this project's or event's share of each payout */
function viewPayouts(p){
  var allPers=periodsOf([p.id]), pers=allPers.filter(function(m){ return yearOk(m, S.pyear); });
  var filters=payoutFilters(pers, allPers), shown=S.pper==='all' ? pers : [S.pper];
  var lines=shown.map(function(per){
    var t=totals(rowsOf(p.id).filter(function(r){ return r.per===per && inPeriod(r); })), date=payoutDate(per);
    return {per:per, t:t, date:date, paid:date<=TODAY, po:payout(per, p.ent)};
  });
  var sum={recv:0, ben:0, fee:0, net:0, unpaid:0};
  lines.forEach(function(x){ sum.recv+=cents(x.t.recv); sum.ben+=cents(x.t.ben); sum.fee+=cents(x.t.fee); sum.net+=cents(x.t.net); if(!x.paid) sum.unpaid+=cents(x.t.net); });
  var unpaid=lines.filter(function(x){ return !x.paid; }), agathos=isEv(p)?'Agathos platform fee':'Beneficiary love gift to Agathos';
  var rows=[['Total '+amountLabel(p), money(sum.recv/100)], [agathos, money(-sum.ben/100)], ['Processing fees', money(-sum.fee/100)], ['Net payout', money(sum.net/100), 'total']];
  var status;
  if(S.pper==='all'){
    if(unpaid.length) rows.push([two('Not paid yet','Agathos pays on '+fmtDate(unpaid[0].date)), money(sum.unpaid/100), 'after']);
    status=unpaid.length ? payStatus(unpaid[0].date, bankOf(p)) : (lines.length?payStatus(lines[lines.length-1].date, bankOf(p)):'');
  } else status=payStatus(lines[0].date, bankOf(p));
  var body=lines.map(function(x){
    return '<tr><td class="c1"><b>'+fmtDate(x.date)+'</b>'+(x.paid?'':stTag('await','Not paid yet'))+'</td>'+
      '<td class="c2 desc"><b>Monthly payout</b><span>'+monthRange(x.per)+' · '+countText(p, x.t.n)+'</span>'+(x.po.ids.length>1?'<span>Part of a larger payout with '+others(x.po.ids, p.id)+'</span>':'')+'</td>'+
      '<td class="n">'+num(x.t.recv)+'</td><td class="n">'+num(-x.t.ben)+'</td><td class="n">'+num(-x.t.fee)+'</td><td class="n net">'+num(x.t.net)+'</td>'+
      '<td>'+(x.paid?'<button type="button" class="lnk" data-act="invoice">Download Invoice</button>':'<span class="na">—</span>')+'</td></tr>';
  }).join('');
  var head='<tr><th class="c1">Date</th><th class="c2">Description</th><th class="n">Total '+amountLabel(p)+'</th><th class="n">'+agathos+'</th><th class="n">Processing fees</th><th class="n">Net payout</th><th>Action</th></tr>';
  var cards=lines.map(function(x){
    return '<div class="fr-item"><div class="r1"><span>'+fmtDate(x.date)+' · '+monthRange(x.per)+'</span><b>SGD '+num(x.t.net)+'</b></div>'+
      '<div class="r2">'+stTag(x.paid?'paid':'await', x.paid?'Paid out':'Not paid yet')+'<span class="net">'+countText(p, x.t.n)+'</span></div></div>';
  }).join('');
  return filters+nextBox(lines.map(function(x){ return x.date; }))+summaryBox(bigLeft('Net to you', sum.net/100, status), rows)+
    '<section class="fr-sec"><div class="fr-sec-head"><h3>Payout History</h3></div>'+
    '<div class="fr-tw has-cards"><table class="fr-t ph"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div><div class="fr-cards">'+cards+'</div>'+
    payBalance(c2((sum.net-sum.unpaid)/100), sum.unpaid/100)+'</section>';
}

/* 2b. Manage Pages › Payouts: every payout to this organisation (or Personal), summed across its projects and events,
   each expandable by project and event (team comments F24–F33) */
var COL_AMOUNT='Total Funding Amount/Total Ticket Sales Amount';
var COL_AGATHOS='Beneficiary love gift to Agathos/Agathos platform fee';
function viewEntityPayouts(e){
  var ids=pidsOf(e.id).filter(function(id){ return !PROJECTS[id].ipc; });
  var allPers=periodsOf(ids), pers=allPers.filter(function(m){ return yearOk(m, S.pyear); });
  if(!allPers.length) return '<div class="dp-empty">No payouts yet.</div>';
  var filters=payoutFilters(pers, allPers), shown=S.pper==='all' ? pers : [S.pper];
  var pos=shown.map(function(per){ return payout(per, e.id); }), unpaid=pos.filter(function(x){ return !x.paid; });
  var sum={recv:0, ben:0, fee:0, net:0, unpaid:0};
  pos.forEach(function(x){ sum.recv+=cents(x.t.recv); sum.ben+=cents(x.t.ben); sum.fee+=cents(x.t.fee); sum.net+=cents(x.t.net); if(!x.paid) sum.unpaid+=cents(x.t.net); });
  var rows=[[split(COL_AMOUNT), money(sum.recv/100)], [split(COL_AGATHOS), money(-sum.ben/100)], ['Processing fees', money(-sum.fee/100)], ['Net payout', money(sum.net/100), 'total']];
  var status;
  if(S.pper==='all'){
    if(unpaid.length) rows.push([two('Not paid yet','Agathos pays on '+fmtDate(unpaid[0].date)), money(sum.unpaid/100), 'after']);
    status=unpaid.length ? payStatus(unpaid[0].date, e.bank) : (pos.length?payStatus(pos[pos.length-1].date, e.bank):'');
  } else status=payStatus(pos[0].date, e.bank);
  var body=pos.map(function(x){
    var open=S.pper!=='all' || S.open[x.per];
    var main='<tr class="po'+(open?' open':'')+'"><td class="c1"><b>'+fmtDate(x.date)+'</b>'+(x.paid?'':stTag('await','Not paid yet'))+'</td>'+
      '<td class="c2"><button type="button" class="exp" data-act="expand" data-per="'+x.per+'" aria-expanded="'+(open?'true':'false')+'">'+I.caret+'<span><b>Monthly payout</b><span>'+monthRange(x.per)+' · '+kinds(x.ids)+'</span></span></button></td>'+
      '<td class="n">'+num(x.t.recv)+'</td><td class="n">'+num(-x.t.ben)+'</td><td class="n">'+num(-x.t.fee)+'</td><td class="n net">'+num(x.t.net)+'</td>'+
      '<td>'+(x.paid?'<button type="button" class="lnk" data-act="invoice">Download Invoice</button>':'<span class="na">—</span>')+'</td></tr>';
    var subs=open ? x.parts.map(function(y){
      var q=PROJECTS[y.id];
      return '<tr class="sub"><td class="c1"></td><td class="c2"><a href="#/manage/'+q.id+'/'+manageTabs(q)[0][0]+'"><b>'+h(q.name)+'</b></a><span>'+(isEv(q)?'Event':'Project')+' · '+countText(q, y.t.n)+'</span></td>'+
        '<td class="n">'+num(y.t.recv)+'</td><td class="n">'+num(-y.t.ben)+'</td><td class="n">'+num(-y.t.fee)+'</td><td class="n net">'+num(y.t.net)+'</td><td></td></tr>';
    }).join('') : '';
    return main+subs;
  }).join('');
  var head='<tr><th class="c1">Date</th><th class="c2">Description</th><th class="n">'+split(COL_AMOUNT)+'</th><th class="n">'+split(COL_AGATHOS)+'</th><th class="n">Processing fees</th><th class="n">Net payout</th><th>Action</th></tr>';
  var cards=pos.map(function(x){
    return '<div class="fr-item"><div class="r1"><span>'+fmtDate(x.date)+' · '+monthRange(x.per)+'</span><b>SGD '+num(x.t.net)+'</b></div>'+
      '<div class="r2">'+stTag(x.paid?'paid':'await', x.paid?'Paid out':'Not paid yet')+'<span class="net">'+kinds(x.ids)+'</span></div>'+
      '<details><summary>By project and event</summary><dl>'+x.parts.map(function(y){ return '<div><dt>'+h(PROJECTS[y.id].name)+'</dt><dd>'+num(y.t.net)+'</dd></div>'; }).join('')+'</dl></details></div>';
  }).join('');
  return filters+nextBox(pos.map(function(x){ return x.date; }))+summaryBox(bigLeft('Net to you', sum.net/100, status), rows)+
    '<section class="fr-sec"><div class="fr-sec-head"><h3>Payout History</h3></div>'+
    '<div class="fr-tw has-cards"><table class="fr-t ph"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div><div class="fr-cards">'+cards+'</div>'+
    payBalance(c2((sum.net-sum.unpaid)/100), sum.unpaid/100)+'</section>';
}

/* ---------- IPC: the charity receives the money from AXS; Agathos invoices its love gifts ---------- */
function viewInvoices(ids){
  var n=0, inv=MONTHS.filter(function(m){ return m<TODAY.slice(0,7); }).map(function(m){
    var list=[]; ids.forEach(function(id){ list=list.concat(rowsOf(id).filter(function(r){ return r.per===m; })); });
    if(!list.length) return '';
    var t=totals(list); n++;
    return '<tr><td class="c1"><b>AG-'+m.replace('-','')+'-'+(100+n)+'</b></td><td class="c2">'+monthLabel(m)+'</td><td class="n">'+num(t.ben)+'</td><td class="n">'+num(t.tip)+'</td><td class="n net">'+num(t.lg)+'</td>'+
      '<td><button type="button" class="lnk" data-act="invoice">Download Invoice</button></td></tr>';
  }).join('');
  return '<div class="nx">'+I.cal+'<div><b>Love gifts to Agathos</b><span class="tbc">Invoice schedule to confirm</span><p>AXS pays donations to you directly. Agathos sends you an invoice for its love gifts.</p></div></div>'+
    '<section class="fr-sec"><div class="fr-sec-head"><h3>Invoices</h3></div>'+
    '<div class="fr-tw"><table class="fr-t inv"><thead><tr><th class="c1">Invoice</th><th class="c2">Month</th><th class="n">Beneficiary love gift</th><th class="n">Donor love gifts</th><th class="n">Amount</th><th>Action</th></tr></thead><tbody>'+inv+'</tbody></table></div></section>';
}

/* ---------- review notes: the comments this version does not follow ---------- */
var NOTES=[
  {t:'Admin console questions not covered',
   fb:['For admin console: How to account for emergency disbursement? Date of payout --> can this be always a fixed date or formularised? Or should we get finance to key in a date manually'],
   now:'This version covers the project and event owner screens only. Both questions are still open.',
   why:'Decided by the product lead on 29 Oct 2026: the admin view is left out of this version.'}
];
function notesHtml(){
  var x=svg('<path d="M6 6l12 12M18 6L6 18"/>');
  return '<div class="fr-md" role="dialog" aria-modal="true" aria-labelledby="fr-md-t">'+
    '<div class="fr-md-head"><div><h2 id="fr-md-t">Changes from the feedback</h2><p>Every other comment is built as written. '+(NOTES.length===1?'This one is':'These '+NOTES.length+' are')+' not, and why.</p></div>'+
    '<button class="fr-md-x" type="button" data-act="notesClose" aria-label="Close">'+x+'</button></div>'+
    '<ol class="fr-md-list">'+NOTES.map(function(o, i){
      return '<li class="fr-nt"><div class="fr-nt-h"><span class="no">'+(i+1)+'</span><h3>'+h(o.t)+'</h3></div>'+
        '<dl class="fr-nt-rows"><div><dt>Feedback</dt><dd>'+o.fb.map(function(q){ return '<q>'+h(q)+'</q>'; }).join('')+'</dd></div>'+
        '<div><dt>This version</dt><dd>'+h(o.now)+'</dd></div><div><dt>Why</dt><dd>'+h(o.why)+'</dd></div></dl></li>';
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
var REVIEW=[['Manage Pages','#/pages/antioch/projects'],['Manage Project','#/manage/erbil/transactions'],['Manage Event','#/manage/concert/orders'],['IPC charity (AXS)','#/manage/sunny/transactions']];
function reviewOn(i){
  if(S.view==='pages') return i===0;
  var p=cur();
  return i===(p.ipc ? 3 : isEv(p) ? 2 : 1);
}
function renderReview(){
  document.getElementById('fr-review').innerHTML='<span class="t">Financial report</span><span class="ver">Version 2</span>'+
    '<nav class="fr-rtabs" aria-label="Screens">'+REVIEW.map(function(x,i){ return '<a href="'+x[1]+'"'+(reviewOn(i)?' class="on"':'')+'>'+x[0]+'</a>'; }).join('')+'</nav>'+
    '<span class="note">Sample data · today is '+fmtDate(TODAY)+'</span>'+
    '<button class="fr-notes" type="button" data-act="notes" aria-haspopup="dialog"><span class="c">'+NOTES.length+'</span>Changes from the feedback</button>';
}
function render(){
  route(); renderReview(); hideTip();
  document.getElementById('fr').innerHTML=S.view==='pages' ? pagesView(ENTITIES[S.key]) : managePage(cur());
}

var toastT;
function toast(msg){ var t=document.getElementById('fr-toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(function(){ t.classList.remove('show'); }, 2200); }

/* CSV: the summary numbers first (payout period included), then one line per transaction */
function downloadCSV(){
  var p=cur(), onRows=S.tab==='transactions' || S.tab==='orders', list=onRows ? filtered(p) : rowsOf(p.id), t=totals(list);
  var esc=function(s){ s=String(s==null?'':s); return /[",\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; };
  var period=!onRows || S.per==='all' ? (onRows && S.year!=='all' ? 'All payouts in '+S.year : 'All payouts') : S.per==='none' ? 'Not in a payout yet' : monthRange(S.per);
  var sum=[[isEv(p)?'Event':'Project', p.name], [p.ipc?'Month':'Payout period', period], ['Currency','SGD']];
  var head, line;
  if(p.ipc){
    sum=sum.concat([['Total Funding Amount', t.recv.toFixed(2)], ['Donor love gifts', t.tip.toFixed(2)], ['Processing fees (to Payment Service Provider)', t.fee.toFixed(2)], ['Paid to you by AXS', t.paidAxs.toFixed(2)], ['Love gifts to Agathos (invoiced)', t.lg.toFixed(2)]]);
    head=['Date & time','Reference','Payment method','Currency','Funding Amount','Processing fees','Paid to you','Love gift to Agathos'];
    line=function(r){ return [r.at.replace('T',' '), r.ref, r.method, 'SGD', r.recv.toFixed(2), r.fee.toFixed(2), r.paidAxs.toFixed(2), r.lg.toFixed(2)]; };
  } else {
    var due=nextDate(list);
    sum=sum.concat([['Total '+amountLabel(p), t.recv.toFixed(2)], ['Total '+agathosLabel(p), t.ben.toFixed(2)], ['Total Processing fees (to Payment Service Provider)', t.fee.toFixed(2)], ['Total Net to you', t.net.toFixed(2)],
      ['Total paid out', t.paid.toFixed(2)], ['Total awaiting pay out', c2(t.await+t.proc).toFixed(2)], ['Agathos pays on', due||'']]);
    head=['Date & time','Reference','Payment method','Currency',amountLabel(p),agathosLabel(p),'Processing fees','Net payout','Payout status','Payout date'];
    line=function(r){ return [r.at.replace('T',' '), r.ref, r.method, 'SGD', r.recv.toFixed(2), r.ben.toFixed(2), r.fee.toFixed(2), r.net.toFixed(2), ST[r.st], r.st==='proc'?'':payoutDate(r.per)]; };
  }
  var csv=sum.map(function(x){ return x.map(esc).join(','); }).concat(['', head.map(esc).join(',')], list.map(function(r){ return line(r).map(esc).join(','); })).join('\n');
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download=p.id+'-'+(onRows && S.per!=='all' ? S.per : 'all')+'.csv';
  document.body.appendChild(a); a.click(); a.remove();
  toast('CSV downloaded');
}

/* ---------- chart tooltip ---------- */
var tipEl=document.getElementById('fr-tip');
function showTip(x, y, strong, text){
  tipEl.textContent='';
  var b=document.createElement('b'); b.textContent=strong; tipEl.appendChild(b);
  var s=document.createElement('span'); s.textContent=text; tipEl.appendChild(s);
  tipEl.classList.add('show');
  var w=tipEl.offsetWidth, left=Math.max(8, Math.min(window.innerWidth-w-8, x-w/2));
  tipEl.style.left=left+'px'; tipEl.style.top=(y-tipEl.offsetHeight-10)+'px';
}
function hideTip(){ tipEl.classList.remove('show'); }
document.addEventListener('pointermove', function(ev){
  var hit=ev.target.closest && ev.target.closest('.hit');
  if(!hit) return;
  var svgEl=hit.ownerSVGElement, c=CHARTS[+hit.getAttribute('data-i')], box=svgEl.getBoundingClientRect();
  var i=idxAt(c, (ev.clientX-box.left)/box.width*CW), p=c.pts[i], x=xAt(c,i), y=yAt(c,p.v);
  var xh=svgEl.querySelector('.xh'), dot=svgEl.querySelector('.dot');
  xh.setAttribute('x1',x); xh.setAttribute('x2',x); dot.setAttribute('cx',x); dot.setAttribute('cy',y);
  svgEl.classList.add('on');
  showTip(box.left+x/CW*box.width, box.top+y/CH*box.height, c.money?money(p.v):String(p.v), p.l);
});
document.addEventListener('pointerout', function(ev){ var hit=ev.target.closest && ev.target.closest('.hit'); if(hit){ hit.ownerSVGElement.classList.remove('on'); hideTip(); } });

/* ---------- events ---------- */
var ACT={
  page:function(t){ S.page=+t.getAttribute('data-p'); render(); var l=document.querySelector('.fr-list'); if(l) l.scrollIntoView({block:'start'}); },
  csv:downloadCSV,
  expand:function(t){
    var per=t.getAttribute('data-per');
    S.open[per]=!S.open[per];
    keepScroll(render);
    var b=document.querySelector('.exp[data-per="'+per+'"]'); if(b) b.focus({preventScroll:true});
  },
  toPayout:function(t){ S.carry=t.getAttribute('data-per'); location.hash='#/pages/'+t.getAttribute('data-ent')+'/payouts'; },
  offline:function(){ toast('Opens the Add Offline Transaction form, as today'); },
  tax:function(){ toast('Opens the Tax Deduction Report menu, as today'); },
  invoice:function(){ toast('Sample: no invoice file yet'); },
  other:function(){ toast('Not part of this prototype'); },
  notes:notesOpen,
  notesClose:notesClose,
  menu:function(t){ var dd=t.closest('.mp-dd'), open=!dd.classList.contains('open'); closeMenus(); dd.classList.toggle('open', open); t.setAttribute('aria-expanded', open?'true':'false'); }
};
/* redraw without losing the reader's place: the page, the Manage Pages list (it scrolls on its own) and each table's sideways scroll */
function keepScroll(fn){
  var y=window.scrollY, list=document.querySelector('.dp-list'), top=list ? list.scrollTop : 0;
  var left=Array.prototype.map.call(document.querySelectorAll('.fr-tw'), function(e){ return e.scrollLeft; });
  fn();
  var l2=document.querySelector('.dp-list'); if(l2) l2.scrollTop=top;
  Array.prototype.forEach.call(document.querySelectorAll('.fr-tw'), function(e, i){ if(left[i]){ e.scrollLeft=left[i]; e.classList.add('scrolled'); } });
  window.scrollTo(0, y);
}
function closeMenus(){
  document.querySelectorAll('.mp-dd.open').forEach(function(dd){ dd.classList.remove('open'); dd.querySelector('[data-act="menu"]').setAttribute('aria-expanded','false'); });
}
document.addEventListener('click', function(ev){
  if(ev.target.id==='fr-modal'){ notesClose(); return; }
  var t=ev.target.closest('[data-act]');
  if(!t || t.getAttribute('data-act')!=='menu') closeMenus();
  if(t && ACT[t.getAttribute('data-act')]){ ev.preventDefault(); ACT[t.getAttribute('data-act')](t); return; }
  var a=ev.target.closest('.mp-crumb a'); if(a) ev.preventDefault();
});
document.addEventListener('change', function(ev){
  var el=ev.target;
  if(el.hasAttribute('data-f')){ S[el.getAttribute('data-f')]=el.value; S.page=1; render(); }
});
document.addEventListener('keydown', function(ev){ if(ev.key==='Escape'){ closeMenus(); notesClose(); } });
/* a shadow on the second column once the table has scrolled sideways */
document.addEventListener('scroll', function(ev){
  var el=ev.target;
  if(el.classList && el.classList.contains('fr-tw')) el.classList.toggle('scrolled', el.scrollLeft>0);
}, true);
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
