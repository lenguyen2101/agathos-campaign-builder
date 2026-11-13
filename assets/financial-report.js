/* ============================================================================
   Agathos — financial report, version 5 (/financial-report).
   v4 (team feedback of 12/11/2026, docs/financial-report-v4-plan.md) plus the old
   transactions of the team chat of 13/11/2026 (docs/financial-report-v5-plan.md):
   transactions before a page's first one with payout data have no payout data, so
   they sit in their own table under the new one: the production list's fields in the
   new table's frame (round 2). A review bar switch puts every page in one of three cases.
   A page with only old transactions shows only that list.
   Routes:
     #/pages/<entity>/projects|events|payouts   Manage Pages: Personal or one organisation;
                                                Payouts sit here, above the project level (F1)
     #/manage/<id>/transactions                 Manage Project › Transactions (no payouts tab, M1)
     #/manage/<id>/orders                       Manage Event › Orders
     #/manage/<id>/transactions|invoices        an IPC charity on AXS: the charity receives the
                                                money, Agathos invoices its love gifts
   Manage Project / Manage Event show the data of that one project or event only.
   Production screens (nav, Manage Pages, Manage Project / Event) are rebuilt from
   screenshots (1728px screen, 1216px content). The Agathos admin view is /finance.
   ============================================================================ */
(function(){
'use strict';

/* sample data, fee rules and totals: assets/finance-data.js (shared with the admin page /finance) */
var F=FIN;
var TODAY=F.TODAY, IMG=F.IMG, PROJECTS=F.PROJECTS, ENTITIES=F.ENTITIES, ENT_ORDER=F.ENT_ORDER, MONTHS=F.MONTHS;
var newRowsOf=F.newRowsOf, oldRowsOf=F.oldRowsOf, cutoffOf=F.cutoffOf;
var h=F.h, c2=F.c2, cents=F.cents, money=F.money, num=F.num, fmtDate=F.fmtDate, fmtDMY=F.fmtDMY, addDays=F.addDays,
    monthLabel=F.monthLabel, monthDays=F.monthDays, payoutDate=F.payoutDate, payoutLabel=F.payoutLabel, initials=F.initials;
var rowsOf=F.rowsOf, inPeriod=F.inPeriod, totals=F.totals, ticketSales=F.ticketSales, pidsOf=F.pidsOf, yearOk=F.yearOk, periodsOf=F.periodsOf, yearsOf=F.yearsOf;
var isEv=F.isEv, amountLabel=F.amountLabel, agathosLabel=F.agathosLabel, rowsWord=F.rowsWord, plural=F.plural, countText=F.countText,
    kinds=F.kinds, others=F.others, payout=F.payout;

/* ---------- state ---------- */
/* pper: the payout months picked on Manage Pages › Payouts; none picked means all (P1).
   carry / carryTx: a payout to open after the hash changes (Payouts, or one project's transactions, P4) */
var S={view:'manage', key:'erbil', tab:'transactions', ctx:'', data:'both', seg:'new', year:'all', per:'all', pyear:'all', pper:[], page:1, opage:1, open:{}, chart:'amt', carry:null, carryTx:null, msOpen:false};
function manageTabs(p){ return p.ipc ? [['transactions','Transactions'],['invoices','Invoices']] : isEv(p) ? [['orders','Orders']] : [['transactions','Transactions']]; }
function pageTabs(e){ return [['projects','Projects'],['events','Events'], e.ipc ? ['invoices','Invoices'] : ['payouts','Payouts']]; }
var ALIAS={project:'erbil', event:'concert', ipc:'sunny'};
/* the review bar's Data switch rides in the hash (#/manage/erbil/transactions?data=old) so a link keeps its case;
   links without it keep the case already picked */
function hashPath(){ return location.hash.replace(/^#\/?/,'').split('?')[0]; }
function route(){
  var dm=/(?:^|&)data=(\w+)/.exec(location.hash.split('?')[1]||'');
  if(dm) S.data=F.setCase(dm[1]);
  var p=hashPath().split('/'), view, key, tab, tabs;
  if(p[0]==='pages'){
    view='pages'; key=ENTITIES[p[1]] ? p[1] : 'antioch'; tabs=pageTabs(ENTITIES[key]); tab=p[2];
  } else {
    view='manage'; key=p[0]==='manage' ? (PROJECTS[p[1]] ? p[1] : 'erbil') : (ALIAS[p[0]] || 'erbil'); tabs=manageTabs(PROJECTS[key]); tab=p[0]==='manage' ? p[2] : p[1];
  }
  if(!tabs.some(function(t){ return t[0]===tab; })) tab=tabs[0][0];
  var ctx=view+':'+key+':'+S.data;
  if(ctx!==S.ctx){ S.year='all'; S.per='all'; S.pyear='all'; S.pper=[]; S.page=1; S.opage=1; S.seg='new'; S.open={}; S.msOpen=false; S.full=false; }
  if(S.carry){ S.pper=[S.carry]; S.carry=null; }
  if(S.carryTx){ S.per=S.carryTx; S.seg='new'; S.carryTx=null; }
  S.view=view; S.key=key; S.tab=tab; S.ctx=ctx;
}
function cur(){ return PROJECTS[S.key]; }
/* the new section: transactions with payout data only (the summary leaves the old ones out, v5 D3) */
function filtered(p){
  return newRowsOf(p.id).filter(function(r){
    if(!yearOk(r.per, S.year)) return false;
    if(S.per==='all') return true;
    if(S.per==='none') return r.st==='proc';
    return r.per===S.per && inPeriod(r);
  });
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
  expand:svg('<path d="M14.5 4.5h5v5M9.5 19.5h-5v-5M19.5 4.5l-6 6M4.5 19.5l6-6"/>'),
  shrink:svg('<path d="M13.5 5.5v5h5M10.5 18.5v-5h-5M13.5 10.5l6-6M10.5 13.5l-6 6"/>'),
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
  project:[['info','Project Information'],['giving','Giving Settings'],['updates','Updates'],['impact','Impact Report'],['people','Human Resource'],['items','Items'],['dollar','Transactions',1]],
  event:[['info','Event Information'],['tag','Tickets & Forms'],['people','Attendees Information'],['scan','Scan Ticket'],['card','Orders',1]]
};
function managePage(p){
  var ev=isEv(p);
  var crumb=ev ? ['Events', p.name, 'Manage Event'] : ['Support a Cause', p.name, 'Manage Project'];
  var side='<aside class="mp-side"><h1>'+(ev?'Manage Event':'Manage Project')+'</h1><ul class="mp-menu">'+MENU[ev?'event':'project'].map(function(m){
    return '<li><a href="#"'+(m[2]?' class="on" aria-current="page"':' data-act="other"')+'>'+I[m[0]]+'<span>'+m[1]+'</span>'+I.chev+'</a></li>';
  }).join('')+'</ul><button class="mp-back" type="button" data-act="other">'+(ev?'Back to Event':'Back to Project page')+'</button></aside>';
  /* the current buttons stay (F3). Tax Deduction Report is its own button with its own menu, as today (E2);
     the CSV export follows the filters, so it sits under them (viewRows) */
  var actions=ev ? '' : '<button class="mp-act" type="button" data-act="offline">'+I.plusC+'Add Offline Transaction</button>'+
    '<button class="mp-act" type="button" data-act="tax" aria-haspopup="menu">'+I.doc+'Tax Deduction Report'+I.caret+'</button>';
  var tabs=manageTabs(p), seg=tabs.length<2 ? '' : '<nav class="mp-seg" aria-label="'+h(p.name)+'">'+tabs.map(function(t){
    return '<a href="#/manage/'+p.id+'/'+t[0]+'"'+(S.tab===t[0]?' class="on" aria-current="page"':'')+'>'+t[1]+'</a>';
  }).join('')+'</nav>';
  var head='<h2 class="mp-title">'+(ev?'Orders':'Transactions')+'</h2>'+(seg||actions ? '<div class="mp-bar">'+seg+'<div class="mp-acts">'+actions+'</div></div>' : '');
  var body=S.tab==='invoices' ? viewInvoices([p.id]) : viewRows(p);
  return '<div class="mp'+(ev?' is-event':'')+'"><div class="mp-inner">'+
    '<nav class="mp-crumb" aria-label="Breadcrumb"><a href="#" aria-label="Home">'+I.home+'</a>'+crumb.map(function(c){ return I.crumb+'<a href="#">'+h(c)+'</a>'; }).join('')+'</nav>'+
    side+'<section class="mp-card">'+head+body+'</section></div></div>';
}

/* ---------- summary: left side, and the summary table on the right ---------- */
function summaryBox(left, rows){
  return '<section class="ov"><div class="ov-left">'+left+'</div><dl class="ov-rows">'+rows.filter(Boolean).map(function(r){
    return r.raw || '<div class="'+(r[2]||'')+'"><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>';
  }).join('')+'</dl></section>';
}
/* an event's sales by ticket type, folded under the ticket sales total (E1); each ticket keeps its full name */
function byTicket(p, list){
  if(!isEv(p)) return null;
  return {raw:'<div class="ov-tt"><details'+(S.ttOpen?' open':'')+'><summary>By ticket type'+I.caret+'</summary><ul>'+ticketSales(p, list).map(function(x){
    return '<li><span class="n">'+h(x.name)+'</span><span class="q">'+plural(x.qty,'ticket')+'</span><b>'+money(x.amount)+'</b></li>';
  }).join('')+'</ul></details></div>'};
}
/* a long label set on two lines; the words stay as written */
function two(a, b){ return a+' <span class="l2">'+b+'</span>'; }
/* no paid / upcoming tag and no bank account or date under the amount (O4, P1) */
function bigLeft(label, value, status){
  return '<div class="lbl">'+label+'</div><div class="big">'+money(value)+'</div>'+(status?'<div class="ov-status">'+status+'</div>':'');
}
/* the payout split is by whether a transaction sits in a payout month, not by whether it is paid (O2); words from the team */
var INFO={
  asg:'Total net amount of transactions that have been sorted into a payout month. Includes both completed disbursements and scheduled upcoming payouts.',
  un:'Total net amount of transactions that have not yet been assigned to a payout month. These are typically more recent transactions.'
};
function infoBtn(label, k){ return '<button type="button" class="ov-i" data-info="'+k+'" aria-label="About '+label+'">'+I.info+'</button>'; }
var PAY_NOTE='Payouts are disbursed on the 20th of each month for the previous month\'s transactions. Funds might take a few days to reach your bank account depending on where you are located.';

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
    /* default summary: the totals on the right; on the left, assigned to a payout and unassigned (O2), one amount per line, and the bar under them */
    var asg=c2(t.paid+t.await), un=t.proc, all=asg+un || 1;
    var left='<ul class="ov-lines">'+
        '<li><div class="lbl"><i class="sw paid"></i>Assigned to payout'+infoBtn('Assigned to payout','asg')+'</div><div class="v">'+money(asg)+'</div></li>'+
        '<li><div class="lbl"><i class="sw await"></i>Unassigned transactions'+infoBtn('Unassigned transactions','un')+'</div><div class="v">'+money(un)+'</div></li>'+
      '</ul>'+
      '<div class="ov-bar" role="img" aria-label="Assigned to payout '+money(asg)+', unassigned transactions '+money(un)+'">'+
        (asg?'<i class="paid" style="width:'+(asg/all*100).toFixed(2)+'%"></i>':'')+(un?'<i class="await" style="width:'+(un/all*100).toFixed(2)+'%"></i>':'')+'</div>';
    return summaryBox(left, [
      ['Total '+amountLabel(p)+cnt, money(t.recv), isEv(p)?'has-tt':''],
      byTicket(p, list),
      ['Total '+agathosLabel(p), money(-t.ben)],
      [two('Total Processing fees','(to Payment Service Provider)'), money(-t.fee)],
      ['Total Net to you', money(t.net), 'total']]);
  }
  return summaryBox(bigLeft('Net to you', t.net), [
    ['Total '+amountLabel(p)+cnt, money(t.recv), isEv(p)?'has-tt':''],
    byTicket(p, list),
    [agathosLabel(p), money(-t.ben)],
    [two('Processing fees','(to Payment Service Provider)'), money(-t.fee)],
    ['Net to you', money(t.net), 'total']]);
}

/* payout summary (O5): above "Net to you", as the title of what follows. With a payout picked: which payout it is and
   whether it is part of a larger one. "View full payout summary" is a small link on the side, and stays, as an FYI line,
   when no payout is picked. No amount and no date */
function payoutHead(p){
  var picked=S.per!=='all' && S.per!=='none';
  var go='<a class="ps-go" href="#/pages/'+p.ent+'/payouts" data-act="toPayout"'+(picked?' data-per="'+S.per+'"':'')+' data-ent="'+p.ent+'">View full payout summary'+I.arrow+'</a>';
  var note='<p class="ps-note">'+I.info+'<span>'+PAY_NOTE+'</span></p>';
  if(!picked) return '<div class="ps-fyi">'+note+go+'</div>';
  var po=payout(S.per, p.ent);
  return '<div class="ps"><div class="ps-top"><div><span class="hp-kicker">Payout summary</span><h3>'+payoutLabel(S.per)+'</h3></div>'+go+'</div>'+
    (po.ids.length>1?'<p class="ps-sub">This is part of a larger payout with '+others(po.ids, p.id)+'.</p>':'')+note+'</div>';
}

/* ---------- 1. Transactions / Orders ---------- */
/* a dropdown drawn by the page instead of the browser's own list, the same look as the month picker */
function sel(label, key, opts, val){
  var cur=opts.filter(function(o){ return o[0]===val; })[0] || opts[0];
  return '<div class="fr-sel"><span class="lbl" id="f-'+key+'-l">'+label+'</span><div class="mp-dd dd" data-dd="'+key+'">'+
    '<button type="button" class="ms-btn" id="f-'+key+'" data-act="menu" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="f-'+key+'-l f-'+key+'"><span>'+h(cur[1])+'</span>'+I.caret+'</button>'+
    '<div class="mp-pop dd-pop" role="listbox" aria-labelledby="f-'+key+'-l">'+opts.map(function(o){
      var on=o[0]===cur[0];
      return '<button type="button" role="option" aria-selected="'+on+'" data-act="pick" data-key="'+key+'" data-v="'+h(o[0])+'"'+(on?' class="on"':'')+'>'+I.check+'<span>'+h(o[1])+'</span></button>';
    }).join('')+'</div></div></div>';
}
function yearOpts(pers){ return [['all','All years']].concat(yearsOf(pers).map(function(y){ return [y,y]; })); }
function viewRows(p){
  /* only old transactions (the page ended before the payout data starts): the old table alone */
  var olds=oldRowsOf(p.id);
  if(!newRowsOf(p.id).length) return oldSection(p, olds);
  /* old and new: one place, one list at a time (v5 round 3); the page opens on the new one */
  var cut=cutoffOf(p.id), seg=cut ? segBar(p, cut, olds.length) : '';
  /* what the owner misses on these, and where it shows: the date, the missing details, the totals they stay out of */
  if(cut && S.seg==='old') return seg+note(rowsWord(p)+' before '+fmtDate(cut)+' have no payout details, such as fees and '+(p.ipc?'the amount paid to you':'net payout')+
    ', so they are not counted in the totals under “With payout details”.')+oldSection(p, olds);
  var allPers=periodsOf([p.id]), pers=allPers.filter(function(m){ return yearOk(m, S.year); });
  var hasProc=!p.ipc && newRowsOf(p.id).some(function(r){ return r.st==='proc' && yearOk(r.per, S.year); });
  var opts=[['all','-']].concat(pers.map(function(m){ return [m, p.ipc ? monthLabel(m) : payoutLabel(m)]; }));
  if(hasProc) opts.push(['none','Unassigned']);
  if(!opts.some(function(o){ return o[0]===S.per; })) S.per='all';
  var list=filtered(p);
  /* the CSV follows the filters, so the two sit in one box (E2) */
  return seg+
    '<section class="fr-fx" aria-labelledby="fr-fx-t"><h3 class="fr-fx-t" id="fr-fx-t">Filter &amp; export</h3><div class="fr-fx-row">'+
      '<div class="fr-filters">'+sel('Year','year',yearOpts(allPers),S.year)+sel(p.ipc?'Month':'Payout period','per',opts,S.per)+'</div>'+
      '<button class="mp-act" type="button" data-act="csv">'+I.down+(isEv(p)?'Export Orders as .csv':'Export as .csv')+'</button>'+
    '</div></section>'+pinBar(p, opts)+
    (p.ipc?'':payoutHead(p))+summaryRows(p, inPayout(list))+offlineLine(list)+stats(p, inPayout(list))+table(p, list);
}
/* while a filter is on and the filter box has scrolled away: a thin bar under the site menu keeps the choice in sight
   (13/11/2026). A period says its year, so the year shows only when it is the one filter. */
var pinOn=false;
function pinBar(p, opts){
  if(S.year==='all' && S.per==='all') return '';
  var by=S.per!=='all' ? [p.ipc?'Month':'Payout period', opts.filter(function(o){ return o[0]===S.per; })[0][1]] : ['Year', S.year];
  return '<div class="fr-pin'+(pinOn?' on':'')+'"><div class="fr-pin-bar"><span class="k">'+by[0]+':</span><b>'+h(by[1])+'</b>'+
    '<button type="button" data-act="pinChange" aria-label="Change filters">Change</button></div></div>';
}
/* the bar sits right under the box until it sticks under the menu, so a gap between them means the box is out of sight */
function pinUpdate(){
  var pin=document.querySelector('.fr-pin'), fx=document.querySelector('.fr-fx');
  pinOn=!!(pin && fx) && pin.getBoundingClientRect().top-fx.getBoundingClientRect().bottom>0.5;
  if(pin) pin.classList.toggle('on', pinOn);
}
/* offline transactions are listed but sit in no payout, so the payout figures leave them out (team answer 2) */
function inPayout(list){ return list.filter(function(r){ return !r.offline; }); }
/* under the summary, the offline money of the listed transactions, so the summary and the "Earlier" total
   add up to the amount raised on the project card (choice (a), 13/11/2026) */
function offlineLine(list){
  var off=list.filter(function(r){ return r.offline; });
  return off.length ? '<p class="fr-off-total">Offline, not in payout: <b>'+money(totals(off).recv)+'</b></p>' : '';
}

/* ---------- old transactions (v5): before the page's first transaction with payout data ----------
   The fields of the production list (Manage Project › Transaction, Manage Event › Orders) in a table
   like the new one: account, date, reference, method, then the amount, or an order's tickets. */
/* the switch between the two lists, each with its count */
function segBar(p, cut, nOld){
  var opts=[['new','With payout details', newRowsOf(p.id).length], ['old','Earlier', nOld]];
  return '<div class="fr-seg" role="group" aria-label="'+rowsWord(p)+'">'+opts.map(function(o){
    var on=S.seg===o[0];
    return '<button type="button" data-act="seg" data-v="'+o[0]+'" aria-pressed="'+on+'"'+(on?' class="on"':'')+'>'+o[1]+'<span class="n">'+o[2]+'</span></button>';
  }).join('')+'</div>';
}
/* why there are two lists */
function note(text){ return '<p class="fr-split">'+I.info+'<span>'+text+'</span></p>'; }
var OLD_PER_PAGE=10;
/* the giver's account, learnt from the production list (v5 round 2): production's default picture for an
   account without a photo, otherwise the first letter on grey; then the username */
var AV_DEFAULT='<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="14" y="10" width="16" height="17.5" rx="8" fill="#E07EB0"/><ellipse cx="22" cy="43" rx="13" ry="12" fill="#E07EB0"/></svg>';
/* production's tags, on a line under the account, in the column that stays in sight: Tax Deduction on a
   donation whose giver asked for it (projects), the promotion code an order used (events). A tagged row is
   taller; the line spans the column (108px), which the longest tag needs */
var PROMO_IC='<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="#60B6F9" d="M8 .6l1.6 1.3 2-.4.8 1.9 1.9.8-.4 2L15.4 8l-1.3 1.6.4 2-1.9.8-.8 1.9-2-.4L8 15.4l-1.6-1.3-2 .4-.8-1.9-1.9-.8.4-2L.6 8l1.3-1.6-.4-2 1.9-.8.8-1.9 2 .4z"/><path d="M5.6 10.4l4.8-4.8" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><circle cx="5.9" cy="5.9" r="1.1" fill="#fff"/><circle cx="10.1" cy="10.1" r="1.1" fill="#fff"/></svg>';
function tags(r){
  return (r.offline ? '<span class="tag-off">Offline</span>' : '')+
    (r.tax ? '<span class="tag-tax">Tax Deduction</span>' : '')+
    (r.promo ? '<span class="tag-promo">'+PROMO_IC+'<span class="sr">Promotion code </span>'+h(r.promo)+'</span>' : '');
}
function account(r){
  var av=r.av==='d' ? '<span class="av is-d">'+AV_DEFAULT+'</span>' : '<span class="av" aria-hidden="true">'+h(r.user.charAt(0).toUpperCase())+'</span>';
  var t=tags(r);
  return '<span class="acct">'+av+'<a href="#" data-act="other">'+h(r.user)+'</a></span>'+(t ? '<span class="tags">'+t+'</span>' : '');
}
/* the old table: the fields of the production list in the frame of the new table, so the two read alike.
   The amount keeps production's S$ (no Currency column); an order shows its tickets and a link to its details.
   Narrow enough to fit the card without scrolling sideways */
function oldColumns(p){
  return isEv(p) ? [['Account','acct'], ['Date & time','dt'], ['Tickets','qty','q'], ['Payment method','method'], ['Reference','ref','c'], ['<span class="sr">Order details</span>','vd']]
                 : [['Account','acct'], ['Date & time','dt'], [amountLabel(p),'recv','sg'], ['Payment method','method'], ['Reference','ref','c']];
}
function right(c){ return c[2]==='n' || c[2]==='sg' || c[2]==='q'; }
function oldSection(p, list){
  var ev=isEv(p), word=rowsWord(p), cols=oldColumns(p), pages=Math.max(1, Math.ceil(list.length/OLD_PER_PAGE));
  if(S.opage>pages) S.opage=pages;
  var start=(S.opage-1)*OLD_PER_PAGE, slice=list.slice(start, start+OLD_PER_PAGE);
  var head='<tr>'+cols.map(function(c,i){ return '<th class="'+cls(fz(i), right(c)&&'n')+'">'+thText(c[0])+'</th>'; }).join('')+'</tr>';
  var body=slice.map(function(r){ return '<tr>'+cols.map(function(c,i){ return '<td class="'+cls(fz(i), right(c)&&'n')+'">'+cell(c,r)+'</td>'; }).join('')+'</tr>'; }).join('');
  return '<section class="fr-sec fr-old" aria-labelledby="fr-old-t"><div class="fr-sec-head">'+
      '<h3 id="fr-old-t">'+word+' <span class="n">'+list.length+'</span></h3>'+
      '<button class="mp-act" type="button" data-act="oldCsv">'+I.down+(ev?'Export Orders as .csv':'Export as .csv')+'</button></div>'+
    (list.length ? '<p class="fr-old-total">Total '+amountLabel(p)+' <b>'+money(totals(list).recv)+'</b></p>' : '')+
    (list.length ? '<div class="fr-tw"><table class="fr-t old"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>'+pager(list.length, start, slice.length, pages, S.opage, 'opage')
                 : '<div class="fr-empty">No '+word.toLowerCase()+' here.</div>')+'</section>';
}

/* statistics in one line graph (M2): amount collected per day, or number of donations (orders for an event) per day,
   one at a time. Not two y-axes on one chart: two scales on one picture are easy to misread.
   Only for a picked payout period (O3): with "-" or "Unassigned" there is no statistics section */
var CHARTS=[];
function stats(p, list){
  if(!list.length || S.per==='all' || S.per==='none') return '';
  var days=list.map(function(r){ return r.day; }).sort(), keys=[], amt={}, cnt={};
  var first=S.per+'-01', last=S.per===TODAY.slice(0,7) ? days[days.length-1] : S.per+'-'+monthDays(S.per);
  for(var x=first; x<=last; x=addDays(x,1)){ keys.push(x); amt[x]=0; cnt[x]=0; }
  list.forEach(function(r){ if(r.day in amt){ amt[r.day]+=cents(r.recv); cnt[r.day]++; } });
  var a={money:true, pts:keys.map(function(k){ return {l:fmtDate(k), v:amt[k]/100}; })};
  var b={pts:keys.map(function(k){ return {l:fmtDate(k), v:cnt[k]}; })};
  CHARTS=[a,b];
  var k=S.chart==='cnt' ? 1 : 0, names=['Amount collected per day (S$)', 'No. of '+(isEv(p)?'orders':'donations')+' per day'];
  return '<section class="fr-sec fr-stats"><div class="fr-sec-head"><h3>Statistics</h3><span class="sub">'+fmtDate(first)+' – '+fmtDate(last)+'</span></div>'+
    '<figure class="ch"><div class="ch-seg" role="group" aria-label="Statistics">'+names.map(function(n, i){
      return '<button type="button" data-act="chart" data-c="'+(i?'cnt':'amt')+'" aria-pressed="'+(i===k)+'"'+(i===k?' class="on"':'')+'>'+n+'</button>';
    }).join('')+'</div>'+chartSvg(k, CHARTS[k])+'</figure></section>';
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
/* Account first, learnt from the production list (v5 round 2) */
/* the owner's order (team answer 4): who and when, the amount, what reaches the owner and when, then the
   deductions, then the technical columns. An order also shows its tickets and a link to its details, as the
   production list does */
function columns(p){
  if(p.ipc) return [
    ['Account','acct'], ['Date & time','dt'], ['Funding Amount','recv','n'], ['Paid to you','paidAxs','n','net'],
    ['Processing fees','fee','n','neg'], ['Love gift to Agathos','lg','n'], ['Payment method','method'], ['Currency','cur'], ['Reference','ref','c']];
  if(isEv(p)) return [
    ['Account','acct'], ['Date & time','dt'], ['Tickets','qty','q'], [amountLabel(p),'recv','n'], ['Net payout','net','n','net'], ['Payout status','st'],
    [agathosLabel(p),'ben','n','neg'], ['Processing fees','fee','n','neg'], ['Payment method','method'], ['Currency','cur'], ['Reference','ref','c'], ['<span class="sr">Order details</span>','vd']];
  return [
    ['Account','acct'], ['Date & time','dt'], [amountLabel(p),'recv','n'], ['Net payout','net','n','net'], ['Payout status','st'],
    [agathosLabel(p),'ben','n','neg'], ['Processing fees','fee','n','neg'], ['Payment method','method'], ['Currency','cur'], ['Reference','ref','c']];
}
/* a long column title takes two lines, so the column is as wide as its numbers, not its title (round 6) */
var TH_BREAK={'Funding Amount':'Funding<br>Amount', 'Ticket Sales Amount':'Ticket Sales<br>Amount', 'Beneficiary Love Gift to Agathos':'Beneficiary Love<br>Gift to Agathos',
  'Agathos Platform fee':'Agathos<br>Platform fee', 'Processing fees':'Processing<br>fees', 'Payment method':'Payment<br>method', 'Love gift to Agathos':'Love gift<br>to Agathos'};
function thText(label){ return TH_BREAK[label] || label; }
function stTag(st, text){ return '<span class="st st-'+st+'"><i></i>'+text+'</span>'; }
/* two statuses (E7): Unassigned until the PSP file has it (the "Unassigned transactions" of O2), then the payout it is in */
function txStatus(r){ return r.st==='proc' ? stTag('proc','Unassigned') : stTag('in', payoutLabel(r.per)); }
var NO_PAYOUT={ref:1, method:1, ben:1, fee:1, net:1, st:1, paidAxs:1, lg:1};
function cell(c, r){
  if(c[1]==='acct') return account(r);
  if(r.offline && NO_PAYOUT[c[1]]) return '<span class="na">—</span>';
  if(c[1]==='vd') return '<a class="lnk" href="#" data-act="orderDetails">Details</a>';
  if(c[2]==='sg') return 'S$'+num(r.recv);
  if(c[2]==='q') return String(r.qty);
  if(c[1]==='dt') return fmtDate(r.at)+', '+r.at.slice(11,16);
  if(c[1]==='cur') return 'SGD';
  if(c[1]==='st') return txStatus(r);
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
/* cur / act: the page shown and its action, the new table's (S.page, "page") unless given */
function pager(total, start, count, pages, cur, act){
  if(pages<2) return '';
  cur=cur || S.page; act=act || 'page';
  return '<nav class="fr-pager" aria-label="Pages"><span>'+(start+1)+'–'+(start+count)+' of '+total+'</span><div class="pg">'+
    '<button type="button" class="arw" data-act="'+act+'" data-p="'+(cur-1)+'"'+(cur<=1?' disabled':'')+' aria-label="Previous page">'+svg('<path d="M14.5 6.5L9 12l5.5 5.5"/>')+'</button>'+
    pageList(cur, pages).map(function(x){
      return x==='…' ? '<span class="gap">…</span>' : '<button type="button" data-act="'+act+'" data-p="'+x+'"'+(x===cur?' class="on" aria-current="page"':'')+'>'+x+'</button>';
    }).join('')+
    '<button type="button" class="arw" data-act="'+act+'" data-p="'+(cur+1)+'"'+(cur>=pages?' disabled':'')+' aria-label="Next page">'+svg('<path d="M9.5 6.5L15 12l-5.5 5.5"/>')+'</button></div></nav>';
}
/* a table over the whole screen, so every column fits without scrolling sideways */
function fullBtn(){ return '<button class="fr-full" type="button" data-act="full" aria-pressed="'+!!S.full+'">'+(S.full ? I.shrink+'Exit full screen' : I.expand+'View full screen')+'</button>'; }
function table(p, list){
  var cols=columns(p), pages=Math.max(1, Math.ceil(list.length/PER_PAGE));
  if(S.page>pages) S.page=pages;
  var start=(S.page-1)*PER_PAGE, slice=list.slice(start, start+PER_PAGE);
  var head='<tr>'+cols.map(function(c,i){ return '<th class="'+cls(fz(i), right(c)&&'n')+'">'+thText(c[0])+'</th>'; }).join('')+'</tr>';
  var body=slice.map(function(r){ return '<tr>'+cols.map(function(c,i){ return '<td class="'+cls(fz(i), right(c)&&'n', c[3]==='net'&&'net')+'">'+cell(c,r)+'</td>'; }).join('')+'</tr>'; }).join('');
  var netCol=cols.filter(function(c){ return c[3]==='net'; })[0];
  var cards=slice.map(function(r){
    return '<div class="fr-item"><div class="r1"><span>'+fmtDate(r.at)+', '+r.at.slice(11,16)+'</span><b>SGD '+num(r.recv)+'</b></div>'+
      '<div class="r2">'+(r.offline ? '<span>Offline</span>' : r.st ? txStatus(r) : '<span>'+h(r.method)+'</span>')+'<span class="net">'+netCol[0]+' '+(r.offline ? '—' : num(r[netCol[1]]))+'</span></div>'+
      '<details><summary>Details</summary><dl>'+cols.map(function(c){ return '<div><dt>'+c[0]+'</dt><dd>'+cell(c,r)+'</dd></div>'; }).join('')+'</dl></details></div>';
  }).join('');
  return '<section class="fr-sec fr-list'+(S.full?' is-full':'')+'" aria-label="'+rowsWord(p)+'"><div class="fr-sec-head"><h3>'+rowsWord(p)+' <span class="n">'+list.length+'</span></h3>'+(list.length?fullBtn():'')+'</div>'+
    (list.length ? '<div class="fr-tw has-cards"><table class="fr-t tx"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div><div class="fr-cards">'+cards+'</div>'+pager(list.length, start, slice.length, pages)
                 : '<div class="fr-empty">No '+rowsWord(p).toLowerCase()+' here.</div>')+'</section>';
}

/* ---------- 2. Payouts ---------- */
function split(label){ var i=label.indexOf('/'); return label.slice(0,i+1)+'<span class="l2">'+label.slice(i+1)+'</span>'; }
/* the team's copy (P3); the title with the date stays */
function nextBox(dates){
  var up=dates.filter(function(x){ return x>TODAY; }).sort()[0];
  if(!up) return '';
  return '<div class="nx">'+I.cal+'<div><b>Next payout: '+fmtDate(up)+'</b><p>'+PAY_NOTE+'</p></div></div>';
}
/* payout months, several at a time (P1); none ticked shows every payout, as "-" */
function payoutFilters(pers, allPers){
  S.pper=S.pper.filter(function(m){ return pers.indexOf(m)>=0; });
  var picked=S.pper, label=!picked.length ? '-' : picked.length<3 ? picked.map(payoutLabel).join(', ') : plural(picked.length,'month');
  return '<div class="fr-filters">'+sel('Year','pyear',yearOpts(allPers),S.pyear)+
    '<div class="fr-sel"><span class="lbl" id="f-pper-l">Payout period</span><div class="mp-dd ms'+(S.msOpen?' open':'')+'">'+
      '<button type="button" class="ms-btn" data-act="menu" aria-haspopup="true" aria-expanded="'+S.msOpen+'" aria-labelledby="f-pper-l"><span>'+h(label)+'</span>'+I.caret+'</button>'+
      '<div class="mp-pop ms-pop">'+pers.map(function(m){
        return '<label class="ms-opt"><input type="checkbox" data-ms="pper" value="'+m+'"'+(picked.indexOf(m)>=0?' checked':'')+'>'+payoutLabel(m)+'</label>';
      }).join('')+'</div></div></div></div>';
}
/* count under the amount row, for picked months only: with no month picked the line is gone (P4) */
function payoutCnt(tx, ev){
  if(!S.pper.length) return '';
  return '<small class="cnt">'+[tx?plural(tx,'transaction'):'', ev?plural(ev,'order'):''].filter(Boolean).join(', ')+'</small>';
}

/* Manage Pages › Payouts: every payout to this organisation (or Personal), summed across its projects and events,
   each expandable by project and event (F24–F33); no date column and no "Not paid yet" tag (P2); named "Nov 2026 Payout" (P3);
   a project or event in an open payout leads to its transactions, filtered to that payout (P4) */
var COL_AMOUNT='Total Funding Amount/Total Ticket Sales Amount';
var COL_AGATHOS='Beneficiary love gift to Agathos/Agathos platform fee';
function viewEntityPayouts(e){
  var ids=pidsOf(e.id).filter(function(id){ return !PROJECTS[id].ipc; });
  var allPers=periodsOf(ids), pers=allPers.filter(function(m){ return yearOk(m, S.pyear); });
  if(!allPers.length) return '<div class="dp-empty">No payouts yet.</div>';
  var filters=payoutFilters(pers, allPers), shown=S.pper.length ? S.pper : pers, one=S.pper.length===1;
  var pos=shown.map(function(per){ return payout(per, e.id); });
  var sum={tx:0, ev:0, recv:0, ben:0, fee:0, net:0};
  pos.forEach(function(x){ x.parts.forEach(function(q){ sum[isEv(PROJECTS[q.id])?'ev':'tx']+=q.t.n; }); sum.recv+=cents(x.t.recv); sum.ben+=cents(x.t.ben); sum.fee+=cents(x.t.fee); sum.net+=cents(x.t.net); });
  /* no "Not paid yet" row (P5), and no paid tag, bank account or date (P1) */
  var rows=[[split(COL_AMOUNT)+payoutCnt(sum.tx, sum.ev), money(sum.recv/100)], [split(COL_AGATHOS), money(-sum.ben/100)], ['Processing fees', money(-sum.fee/100)], ['Net payout', money(sum.net/100), 'total']];
  var body=pos.map(function(x){
    var open=one || S.open[x.per];
    var main='<tr class="po'+(open?' open':'')+'">'+
      '<td class="c1"><button type="button" class="exp" data-act="expand" data-per="'+x.per+'" aria-expanded="'+(open?'true':'false')+'">'+I.caret+'<span><b>'+payoutLabel(x.per)+' Payout</b><span>'+kinds(x.ids)+'</span></span></button></td>'+
      '<td class="n">'+num(x.t.recv)+'</td><td class="n">'+num(-x.t.ben)+'</td><td class="n">'+num(-x.t.fee)+'</td><td class="n net">'+num(x.t.net)+'</td>'+
      '<td class="dl">'+(x.paid?'<button type="button" class="dl-i" data-act="summaryFile" aria-label="Download '+payoutLabel(x.per)+' payout summary" title="Download">'+I.down+'</button>':'<span class="na">—</span>')+'</td></tr>';
    var subs=open ? x.parts.map(function(y){
      var q=PROJECTS[y.id];
      return '<tr class="sub"><td class="c1"><a href="#/manage/'+q.id+'/'+manageTabs(q)[0][0]+'" data-act="toTx" data-per="'+x.per+'"><b>'+h(q.name)+'</b></a><span>'+(isEv(q)?'Event':'Project')+' · '+countText(q, y.t.n)+'</span></td>'+
        '<td class="n">'+num(y.t.recv)+'</td><td class="n">'+num(-y.t.ben)+'</td><td class="n">'+num(-y.t.fee)+'</td><td class="n net">'+num(y.t.net)+'</td><td></td></tr>';
    }).join('') : '';
    return main+subs;
  }).join('');
  /* P6: the column is named for what it does; each row is just the download icon */
  var head='<tr><th class="c1">Description</th><th class="n">'+split(COL_AMOUNT)+'</th><th class="n">'+split(COL_AGATHOS)+'</th><th class="n">Processing fees</th><th class="n">Net payout</th><th class="dl">Download<span class="l2">payout summary</span></th></tr>';
  var cards=pos.map(function(x){
    return '<div class="fr-item"><div class="r1"><span>'+payoutLabel(x.per)+' Payout</span><b>SGD '+num(x.t.net)+'</b></div>'+
      '<div class="r2"><span class="net">'+kinds(x.ids)+'</span></div>'+
      '<details><summary>By project and event</summary><dl>'+x.parts.map(function(y){ return '<div><dt>'+h(PROJECTS[y.id].name)+'</dt><dd>'+num(y.t.net)+'</dd></div>'; }).join('')+'</dl></details></div>';
  }).join('');
  /* no Paid out / Balance line under the table: it split the payouts by paid or not (P1, P5) */
  return filters+nextBox(pos.map(function(x){ return x.date; }))+summaryBox(bigLeft('Net to you', sum.net/100), rows)+
    '<section class="fr-sec'+(S.full?' is-full':'')+'" aria-label="Payout History"><div class="fr-sec-head"><h3>Payout History</h3>'+
      fullBtn()+'</div>'+
    '<div class="fr-tw has-cards"><table class="fr-t ph"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div><div class="fr-cards">'+cards+'</div></section>';
}

/* ---------- IPC: the charity receives the money from AXS; Agathos invoices its love gifts ---------- */
function viewInvoices(ids){
  var n=0, inv=MONTHS.filter(function(m){ return m<TODAY.slice(0,7); }).map(function(m){
    var list=[]; ids.forEach(function(id){ list=list.concat(rowsOf(id).filter(function(r){ return r.per===m; })); });
    if(!list.length) return '';
    var t=totals(list); n++;
    return '<tr><td class="c1"><b>AG-'+m.replace('-','')+'-'+(100+n)+'</b></td><td class="c2">'+monthLabel(m)+'</td><td class="n">'+num(t.tip)+'</td><td class="n net">'+num(t.lg)+'</td>'+
      '<td><button type="button" class="lnk" data-act="invoice">Download Invoice</button></td></tr>';
  }).join('');
  return '<div class="nx">'+I.cal+'<div><b>Love gifts to Agathos</b><span class="tbc">Invoice schedule to confirm</span><p>AXS pays donations to you directly. Agathos sends you an invoice for its love gifts.</p></div></div>'+
    '<section class="fr-sec"><div class="fr-sec-head"><h3>Invoices</h3></div>'+
    '<div class="fr-tw"><table class="fr-t inv"><thead><tr><th class="c1">Invoice</th><th class="c2">Month</th><th class="n">Donor love gifts</th><th class="n">Amount</th><th>Action</th></tr></thead><tbody>'+inv+'</tbody></table></div></section>';
}

/* ---------- review: questions for the team ---------- */
/* open points the team decides, and what the prototype shows meanwhile (v5) */
var QUESTIONS=[
  {t:'Payouts before the cut-off',
   q:'Should Manage Pages › Payouts list the payouts made before a page has payout details, or say that they are not listed?',
   why:'Payouts are built from the PSP files, which start at the cut-off (1 Jun 2026 in the sample). Erbil has taken donations since Nov 2025, but its payouts start at Jul 2026, so an owner may think money is missing.',
   now:'Only the payouts with payout details are listed, with no line about the earlier ones.'},
  {t:'Earlier transactions in the summary',
   q:'Should the summary leave the earlier transactions out, or show them in one line such as "previous disbursed" (Rachel\'s idea)? If the line, were all of them paid out?',
   why:'The summary counts only transactions with payout details. "Disbursed" is right only if every earlier transaction was paid out.',
   now:'The summary leaves them out. The "Earlier" list shows their own total.'}
];
function questionsHtml(){
  var x=svg('<path d="M6 6l12 12M18 6L6 18"/>');
  return '<div class="fr-md" role="dialog" aria-modal="true" aria-labelledby="fr-md-t">'+
    '<div class="fr-md-head"><div><h2 id="fr-md-t">Questions for the team</h2><p>Open points in this version. Under each one is what the prototype shows for now.</p></div>'+
    '<button class="fr-md-x" type="button" data-act="notesClose" aria-label="Close">'+x+'</button></div>'+
    '<ol class="fr-md-list">'+QUESTIONS.map(function(o, i){
      return '<li class="fr-nt"><div class="fr-nt-h"><span class="no">'+(i+1)+'</span><h3>'+h(o.t)+'</h3></div>'+
        '<dl class="fr-nt-rows"><div><dt>Question</dt><dd>'+h(o.q)+'</dd></div><div><dt>Why we ask</dt><dd>'+h(o.why)+'</dd></div>'+
        '<div><dt>For now</dt><dd>'+h(o.now)+'</dd></div></dl></li>';
    }).join('')+'</ol>'+
    '<p class="fr-md-foot">Not in this prototype: the CSV files do not carry the Tax Deduction tag or the promotion code.</p></div>';
}
/* the questions window; closing it returns to its button */
function notesOpen(){
  var m=document.getElementById('fr-modal');
  m.innerHTML=questionsHtml(); m.hidden=false;
  document.documentElement.classList.add('fr-lock');
  m.querySelector('.fr-md-x').focus();
}
function notesClose(){
  var m=document.getElementById('fr-modal');
  if(m.hidden) return;
  m.hidden=true; m.innerHTML='';
  document.documentElement.classList.remove('fr-lock');
  var b=document.querySelector('.fr-qs'); if(b) b.focus();
}

/* ---------- page ---------- */
var REVIEW=[['Manage Pages','#/pages/antioch/projects'],['Manage Project','#/manage/erbil/transactions'],['Manage Event','#/manage/concert/orders'],['IPC charity (AXS)','#/manage/sunny/transactions']];
/* the three cases a project or event can be in (v5 round 2); every screen follows the one picked */
var CASES=[['both','Old and new'],['new','New only'],['old','Old only (ended)']];
function reviewOn(i){
  if(S.view==='pages') return i===0;
  var p=cur();
  return i===(p.ipc ? 3 : isEv(p) ? 2 : 1);
}
function renderReview(){
  document.getElementById('fr-review').innerHTML='<span class="t">Financial report</span><span class="ver">Version 5</span>'+
    '<nav class="fr-rtabs" aria-label="Screens">'+REVIEW.map(function(x,i){ return '<a href="'+x[1]+'"'+(reviewOn(i)?' class="on"':'')+'>'+x[0]+'</a>'; }).join('')+'</nav>'+
    '<div class="fr-rtabs fr-rcase" role="group" aria-label="Data"><span class="lbl">Data</span>'+CASES.map(function(c){
      var on=S.data===c[0];
      return '<button type="button" data-act="data" data-v="'+c[0]+'" aria-pressed="'+on+'"'+(on?' class="on"':'')+'>'+c[1]+'</button>';
    }).join('')+'</div>'+
    '<button class="fr-notes fr-qs" type="button" data-act="questions" aria-haspopup="dialog"><span class="c">'+QUESTIONS.length+'</span>Questions for the team</button>';
}
function render(){
  route(); renderReview(); hideTip();
  document.documentElement.classList.toggle('fr-full-on', !!S.full);
  document.getElementById('fr').innerHTML=S.view==='pages' ? pagesView(ENTITIES[S.key]) : managePage(cur());
  pinUpdate();
}

var toastT;
function toast(msg){ var t=document.getElementById('fr-toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(function(){ t.classList.remove('show'); }, 2200); }

/* CSV: the summary numbers first (the filters included), then one line per transaction, as filtered */
function downloadCSV(){
  var p=cur(), list=inPayout(filtered(p)), t=totals(list);
  var esc=function(s){ s=String(s==null?'':s); return /[",\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; };
  var period=S.per==='all' ? '-' : S.per==='none' ? 'Unassigned' : p.ipc ? monthLabel(S.per) : payoutLabel(S.per);
  var sum=[[isEv(p)?'Event':'Project', p.name], ['Year', S.year==='all' ? 'All years' : S.year], [p.ipc?'Month':'Payout period', period], ['Currency','SGD']];
  var head, line;
  if(p.ipc){
    sum=sum.concat([['Total Funding Amount', t.recv.toFixed(2)], ['Donor love gifts', t.tip.toFixed(2)], ['Processing fees (to Payment Service Provider)', t.fee.toFixed(2)], ['Paid to you by AXS', t.paidAxs.toFixed(2)], ['Love gifts to Agathos (invoiced)', t.lg.toFixed(2)]]);
    head=['Account','Date & time','Reference','Payment method','Currency','Funding Amount','Processing fees','Paid to you','Love gift to Agathos'];
    line=function(r){ return [r.user, r.at.replace('T',' '), r.ref, r.method, 'SGD', r.recv.toFixed(2), r.fee.toFixed(2), r.paidAxs.toFixed(2), r.lg.toFixed(2)]; };
  } else {
    sum=sum.concat([['Total '+amountLabel(p), t.recv.toFixed(2)], ['Total '+agathosLabel(p), t.ben.toFixed(2)], ['Total Processing fees (to Payment Service Provider)', t.fee.toFixed(2)], ['Total Net to you', t.net.toFixed(2)],
      ['Assigned to payout', c2(t.paid+t.await).toFixed(2)], ['Unassigned transactions', t.proc.toFixed(2)]]);
    head=['Account','Date & time','Reference','Payment method','Currency',amountLabel(p),agathosLabel(p),'Processing fees','Net payout','Payout status'];
    line=function(r){ return [r.user, r.at.replace('T',' '), r.ref, r.method, 'SGD', r.recv.toFixed(2), r.ben.toFixed(2), r.fee.toFixed(2), r.net.toFixed(2), r.st==='proc' ? 'Unassigned' : payoutLabel(r.per)]; };
  }
  var csv=sum.map(function(x){ return x.map(esc).join(','); }).concat(['', head.map(esc).join(',')], list.map(function(r){ return line(r).map(esc).join(','); })).join('\n');
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download=p.id+'-'+(S.per==='all' ? 'all' : S.per==='none' ? 'unassigned' : S.per)+'.csv';
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
function hideTip(){ tipEl.classList.remove('show','info'); }
/* the ⓘ next to Assigned to payout and Unassigned transactions: on hover, and on keyboard focus or a tap */
function showInfo(el){
  var b=el.getBoundingClientRect();
  tipEl.textContent=INFO[el.getAttribute('data-info')];
  tipEl.classList.add('show','info');
  var w=tipEl.offsetWidth;
  tipEl.style.left=Math.max(8, Math.min(window.innerWidth-w-8, b.left+b.width/2-w/2))+'px';
  tipEl.style.top=Math.max(8, b.top-tipEl.offsetHeight-8)+'px';
}
function infoAt(ev){ return ev.target.closest && ev.target.closest('[data-info]'); }
document.addEventListener('pointerover', function(ev){ var el=infoAt(ev); if(el) showInfo(el); });
document.addEventListener('pointerout', function(ev){ if(infoAt(ev) && document.activeElement!==infoAt(ev)) hideTip(); });
document.addEventListener('focusin', function(ev){ var el=infoAt(ev); if(el) showInfo(el); });
document.addEventListener('focusout', function(ev){ if(infoAt(ev)) hideTip(); });
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
  page:function(t){
    S.page=+t.getAttribute('data-p'); render();
    var l=document.querySelector('.fr-list'); if(!l) return;
    if(S.full) l.scrollTop=0; else l.scrollIntoView({block:'start'});
  },
  csv:downloadCSV,
  opage:function(t){
    S.opage=+t.getAttribute('data-p'); render();
    var o=document.querySelector('.fr-old'); if(o) o.scrollIntoView({block:'start'});
  },
  /* the old list exports through the CSV template the backend has today */
  oldCsv:function(){ toast('Exports in the current .csv format'); },
  seg:function(t){
    S.seg=t.getAttribute('data-v'); S.opage=1; keepScroll(render);
    var b=document.querySelector('.fr-seg [data-v="'+S.seg+'"]'); if(b) b.focus({preventScroll:true});
  },
  /* the review bar's Data switch: same screen, another case */
  data:function(t){ location.hash='#/'+hashPath()+'?data='+t.getAttribute('data-v'); },
  orderDetails:function(){ toast('Opens the order details, as today'); },
  /* back up to the filter box, on the dropdown the bar was showing */
  pinChange:function(){
    var fx=document.querySelector('.fr-fx'); if(!fx) return;
    fx.scrollIntoView({block:'start', behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    var b=document.getElementById(S.per!=='all' ? 'f-per' : 'f-year'); if(b) b.focus({preventScroll:true});
  },
  expand:function(t){
    var per=t.getAttribute('data-per');
    S.open[per]=!S.open[per];
    keepScroll(render);
    var b=document.querySelector('.exp[data-per="'+per+'"]'); if(b) b.focus({preventScroll:true});
  },
  toPayout:function(t){ S.carry=t.getAttribute('data-per'); location.hash='#/pages/'+t.getAttribute('data-ent')+'/payouts'; },
  toTx:function(t){ S.carryTx=t.getAttribute('data-per'); location.hash=t.getAttribute('href'); },
  chart:function(t){ S.chart=t.getAttribute('data-c'); keepScroll(render); },
  full:function(){ S.full=!S.full; keepScroll(render); var b=document.querySelector('.fr-full'); if(b) b.focus({preventScroll:true}); },
  offline:function(){ toast('Opens the Add Offline Transaction form, as today'); },
  tax:function(){ toast('Opens the Tax Deduction Report menu, as today'); },
  invoice:function(){ toast('Sample: no invoice file yet'); },
  summaryFile:function(){ toast('Sample: no payout summary file yet'); },
  other:function(){ toast('Not part of this prototype'); },
  questions:notesOpen,
  notesClose:notesClose,
  menu:function(t){
    var dd=t.closest('.mp-dd'), open=!dd.classList.contains('open'); closeMenus(); dd.classList.toggle('open', open); t.setAttribute('aria-expanded', open?'true':'false');
    if(dd.classList.contains('ms')) S.msOpen=open;
    if(open && dd.classList.contains('dd')){ var on=dd.querySelector('[aria-selected="true"]'); if(on) on.focus(); }
  },
  pick:function(t){ S[t.getAttribute('data-key')]=t.getAttribute('data-v'); S.page=1; S.opage=1; closeMenus(); render(); var b=document.getElementById('f-'+t.getAttribute('data-key')); if(b) b.focus(); }
};
/* redraw without losing the reader's place: the page and each table's sideways scroll (the Manage Pages tabs scroll with the page, P2) */
function keepScroll(fn){
  var y=window.scrollY;
  var left=Array.prototype.map.call(document.querySelectorAll('.fr-tw'), function(e){ return e.scrollLeft; });
  fn();
  Array.prototype.forEach.call(document.querySelectorAll('.fr-tw'), function(e, i){ if(left[i]){ e.scrollLeft=left[i]; e.classList.add('scrolled'); } });
  window.scrollTo(0, y);
}
function closeMenus(){
  S.msOpen=false;
  document.querySelectorAll('.mp-dd.open').forEach(function(dd){ dd.classList.remove('open'); dd.querySelector('[data-act="menu"]').setAttribute('aria-expanded','false'); });
}
document.addEventListener('click', function(ev){
  if(ev.target.id==='fr-modal'){ notesClose(); return; }
  if(ev.target.closest('.ms-pop')) return;   /* ticking months keeps the month list open */
  var t=ev.target.closest('[data-act]');
  if(!t || t.getAttribute('data-act')!=='menu') closeMenus();
  if(t && ACT[t.getAttribute('data-act')]){ ev.preventDefault(); ACT[t.getAttribute('data-act')](t); return; }
  var a=ev.target.closest('.mp-crumb a'); if(a) ev.preventDefault();
});
document.addEventListener('change', function(ev){
  var el=ev.target;
  if(el.hasAttribute('data-ms')){
    var m=el.value;
    S.pper=el.checked ? S.pper.concat([m]).sort() : S.pper.filter(function(x){ return x!==m; });
    S.msOpen=true; S.open={};
    keepScroll(render);
    var box=document.querySelector('.ms-pop input[value="'+m+'"]'); if(box) box.focus({preventScroll:true});
  }
});
/* the "By ticket type" fold stays as the reader left it */
document.addEventListener('toggle', function(ev){ if(ev.target.closest && ev.target.closest('.ov-tt')) S.ttOpen=ev.target.open; }, true);
document.addEventListener('keydown', function(ev){
  /* up and down move through an open dropdown; Escape closes it and returns to its button */
  var pop=ev.target.closest && ev.target.closest('.dd-pop');
  if(pop && (ev.key==='ArrowDown' || ev.key==='ArrowUp')){
    var items=[].slice.call(pop.querySelectorAll('[role="option"]')), i=items.indexOf(ev.target)+(ev.key==='ArrowDown'?1:-1);
    if(items[i]) items[i].focus();
    ev.preventDefault(); return;
  }
  if(ev.key==='Escape'){
    var btn=pop && pop.parentNode.querySelector('.ms-btn'), menuOpen=document.querySelector('.mp-dd.open');
    hideTip(); closeMenus(); notesClose(); if(btn) btn.focus();
    if(S.full && !menuOpen){ ACT.full(); }
  }
});
/* a shadow on the second column once the table has scrolled sideways */
document.addEventListener('scroll', function(ev){
  var el=ev.target;
  if(el.classList && el.classList.contains('fr-tw')) el.classList.toggle('scrolled', el.scrollLeft>0);
}, true);
window.addEventListener('hashchange', function(){ S.page=1; S.opage=1; render(); window.scrollTo(0,0); });
window.addEventListener('scroll', pinUpdate, {passive:true});
window.addEventListener('resize', pinUpdate);

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
