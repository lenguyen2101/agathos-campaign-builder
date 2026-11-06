/* ============================================================================
   Agathos — financial report sample data, shared by the owner pages
   (/financial-report) and the Agathos admin page (/finance).
   Rules come from "Agathos Financial Report Reconcilation copy.xlsx" (the newest version of the file):
     fees           sheet Intro, rows 5 (Agathos to merchant) and 6 (PSP to Agathos)
     PSP pay dates  sheet Intro, A13
     admin columns  sheet "Agathos Financial Reports", section 3.0, and Elaine's
                    definitions per PSP model (B100–D104)
   Sample data: one payout a month, on the 20th of the next month, named after the
   month it is paid in. Today is 29 Oct 2026; the PSP files uploaded so far cover
   up to 25 Oct 2026.
   ============================================================================ */
var FIN=(function(){
'use strict';

var TODAY='2026-10-29';
var UPLOADED='2026-10-25';   /* last day covered by the payment data uploaded so far */
var IMG='assets/img/home/';

/* model: how the PSP settles. connect = Stripe pays the owner and Agathos separately;
   master = the PSP pays Agathos, Agathos pays the owner; direct = AXS pays the charity */
var PROJECTS={
  erbil:   {id:'erbil',    ent:'antioch',  name:'Special Needs Centre in Erbil',    kind:'project', psp:'stripe', model:'connect', ben:.05, tip:.6, n:12, from:'2025-11', goal:60000, img:'project-storybook.jpg'},
  outreach:{id:'outreach', ent:'antioch',  name:'Outreach @ displaced families',    kind:'project', psp:'stripe', model:'connect', ben:.05, tip:.5, n:7,  from:'2026-03', goal:20000, img:'project-nepal.jpg'},
  concert: {id:'concert',  ent:'antioch',  name:'Benefit concert for the unseen',   kind:'event',   psp:'2c2p',   model:'master',  mid:'764764000011923', ben:.03, tip:0,  n:18, from:'2026-08', img:'project-carnival.jpg', when:['2026-11-15T19:00','2026-11-15T22:00'],
            tickets:[{name:'Benefit concert for the unseen - Student / NSF', price:35}, {name:'Benefit concert for the unseen - Working Adults', price:60}]},
  care:    {id:'care',     ent:'personal', name:'Care packages for migrant workers', kind:'project', psp:'stripe', model:'master',  ben:.05, tip:.5, n:6,  from:'2026-05', goal:8000,  img:'hero-3.jpg'},
  /* AXS is the Hidden Cause route: no beneficiary love gift there (Intro D5) */
  sunny:   {id:'sunny',    ent:'sunshine', name:'Sunny Days for Seniors',           kind:'project', psp:'axs',    model:'direct',  mid:'30019871', ipc:true, ben:0,   tip:.4, n:10, from:'2026-01', goal:40000, img:'hero-2.jpg'}
};
/* Manage Pages: the account's own pages and the organisations it belongs to.
   Agathos pays each one with one transfer per payout date, to that one's bank account.
   acct: the Stripe connected account of an organisation on Stripe Connect */
var ENTITIES={
  personal:{id:'personal', label:'Personal',     name:'lenguyen2101',          avatar:'assets/img/task220/avatar-user.png', bank:'POSB ••••1093'},
  antioch: {id:'antioch',  label:'Organization', name:'Antioch 21',            role:'Owner', bank:'DBS ••••4821', acct:'acct_1QJm8vRt2kX9pLwB'},
  sunshine:{id:'sunshine', label:'Organization', name:'Sunshine Care Society', role:'Owner', ipc:true}
};
var ENT_ORDER=['personal','antioch','sunshine'];
var PSP_NAME={stripe:'Stripe', '2c2p':'2c2p', axs:'AXS'};
var MODEL_NAME={connect:'Connect', master:'Master', direct:'Direct'};

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
/* payout date: the 20th of the next month; a Saturday or Sunday moves to Monday */
function payoutDate(per){ var iso=nextMonth(per)+'-20', w=weekday(iso); return w===6 ? addDays(iso,2) : w===0 ? addDays(iso,1) : iso; }
/* a payout is named after the month it is paid in: October's sales are the "Nov 2026" payout (team comments P3, E7) */
function payoutLabel(per){ return monthLabel(nextMonth(per)); }
function initials(s){ return s.split(/\s+/).filter(Boolean).slice(0,2).map(function(w){ return w[0]; }).join('').toUpperCase(); }

function rng(seed){ return function(){ seed=seed+0x6D2B79F5|0; var t=Math.imul(seed^seed>>>15, 1|seed); t=t+Math.imul(t^t>>>7, 61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function hash(s){ var x=2166136261; for(var i=0;i<s.length;i++){ x^=s.charCodeAt(i); x=Math.imul(x,16777619); } return x>>>0; }
function pick(r, a){ return a[Math.floor(r()*a.length)]; }
function code(r, n, chars){ var s=''; for(var i=0;i<n;i++) s+=chars[Math.floor(r()*chars.length)]; return s; }

/* ---------- fee rules (sheet Intro) ----------
   procFee / axsFee: what the owner is charged ("Agathos To Merchant Fee", row 5), shown to them as Processing fees.
   pspFee: what the PSP really charges ("PSP To Agathos Fee", row 6); the gap is Agathos's margin. */
function procFee(psp, method, R){
  var card=method!=='PayNow';
  if(psp==='stripe') return c2(card ? .039*R+.5 : .013*R*1.09);
  return c2(card ? (.034*R+.2)*1.09 : .008*R*1.09);
}
function axsFee(gross){ return c2(.016*gross+.2); }
function pspFee(psp, method, intl, amt){
  var card=method!=='PayNow';
  if(psp==='stripe') return c2(card ? (intl?.039:.034)*amt+.5 : .013*amt*1.09);
  if(psp==='2c2p') return c2(card ? ((intl?.034:.028)*amt+.2)*1.09 : .008*amt*1.09);
  return c2(card ? (intl ? .028*amt+.1 : .012*amt+.2) : .004*amt);
}
/* the PSP fee on a donor love gift: the percentage part only (sheet DB Table, psp_fee_on_donor_lovegift) */
function pspFeeOnGift(psp, method, intl, tip){
  var card=method!=='PayNow';
  if(psp==='stripe') return c2(card ? (intl?.039:.034)*tip : .013*tip*1.09);
  return c2(card ? (intl?.034:.028)*tip*1.09 : .008*tip*1.09);
}

var METHODS={stripe:['Card','Card','Card','PayNow','PayNow'], '2c2p':['Card','Card','Apple Pay','Google Pay','PayNow'], axs:['PayNow','PayNow','Card']};
var GIFTS=[20,30,50,50,80,100,100,150,200,250,300,500,1000];

/* proc: not in an uploaded PSP file yet ("Processing"); in a file: in the payout of its month.
   paid / await only split that payout by its date, for the paid-out and awaiting totals (F9). */
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
    var tt=p.kind==='event' ? Math.floor(r()*p.tickets.length) : -1;
    var R=p.kind==='event' ? p.tickets[tt].price*qty : pick(r,GIFTS);
    var tip=p.tip && r()<p.tip ? c2(R*pick(r,[.05,.1,.12])) : 0;
    var ben=c2(R*p.ben), fee=p.ipc ? axsFee(R+tip) : procFee(p.psp, method, R);
    var ref=p.psp==='stripe' ? 'ch_3Q'+code(r,14,'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789') : p.psp==='2c2p' ? code(r,16,'0123456789') : 'AXS'+code(r,12,'0123456789');
    var row={p:p, per:per, day:day, at:day+'T'+t, ref:ref, method:method, intl:intl, qty:qty, tt:tt, recv:R, tip:tip, ben:ben, fee:fee, net:c2(R-fee-ben)};
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
/* an event's sales by ticket type (team comment E1) */
function ticketSales(p, list){
  return p.tickets.map(function(tk, i){
    var mine=list.filter(function(r){ return r.tt===i; }), q=0, a=0;
    mine.forEach(function(r){ q+=r.qty; a+=cents(r.recv); });
    return {name:tk.name, price:tk.price, qty:q, amount:a/100};
  });
}

function pidsOf(eid){ return Object.keys(PROJECTS).filter(function(id){ return PROJECTS[id].ent===eid; }); }
function yearOk(per, y){ return y==='all' || per.slice(0,4)===y; }
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

/* ---------- admin: one transaction as Agathos Finance sees it ----------
   Only transactions in an uploaded PSP file ("after reconciliation data from PSP file", A2). */
function reconciled(r){ return r.day<=UPLOADED; }
/* Intro A13: Stripe pays on the first business day of the month (for the month before); 2c2p three business days
   after the transaction. AXS has not sent a report yet (Intro D8), so its two business days are a sample */
function businessDay(iso){ var w=weekday(iso); return w===6 ? addDays(iso,2) : w===0 ? addDays(iso,1) : iso; }
function addBusinessDays(iso, n){ var x=iso; while(n>0){ x=addDays(x,1); var w=weekday(x); if(w!==0 && w!==6) n--; } return x; }
function pspPayoutDate(r){ return r.p.psp==='stripe' ? businessDay(nextMonth(r.per)+'-01') : addBusinessDays(r.day, r.p.psp==='2c2p' ? 3 : 2); }
function merchantId(p){ return p.model==='connect' ? ENTITIES[p.ent].acct : p.mid || ''; }
function adminRow(r){
  var p=r.p, C=cents, gross=C(r.recv)+C(r.tip), fees, feeGift, finalGift;
  if(p.psp==='axs'){ fees=C(pspFee('axs', r.method, r.intl, r.recv+r.tip)); feeGift=0; finalGift=C(r.tip); }   /* AXS: the gift is clawed back whole (E89) */
  else { feeGift=r.tip ? C(pspFeeOnGift(p.psp, r.method, r.intl, r.tip)) : 0; fees=C(pspFee(p.psp, r.method, r.intl, r.recv)); finalGift=C(r.tip)-feeGift; }
  var margin=C(r.fee)-fees, net=C(r.net), toAgathos=C(r.ben)+finalGift+margin;
  var toAgathosFromPsp = p.model==='direct' ? margin : p.model==='connect' ? gross-fees-feeGift-net : gross-fees-feeGift;
  /* Elaine's table (B103): Total Disbursed is the total net to merchant for every model, Connect included;
     Total Paid Out (Connect) is the Connect part of it */
  var disbursed = net, paidOut = p.model==='connect' ? net : 0;
  var final = p.model==='connect' ? toAgathosFromPsp : p.model==='master' ? toAgathosFromPsp-disbursed : toAgathosFromPsp+finalGift;
  var x=function(v){ return v/100; };
  return {r:r, gross:x(gross), fees:x(fees), margin:x(margin), bene:isEv(p)?0:r.ben, platform:isEv(p)?r.ben:0, net:r.net,
    gift:r.tip, finalGift:x(finalGift), feeGift:x(feeGift), toAgathos:x(toAgathos),
    pspPayout:x(toAgathosFromPsp), disbursed:x(disbursed), paidOut:x(paidOut), final:x(final),
    tally:x(gross-fees-feeGift-net-toAgathos), payDate:pspPayoutDate(r), psp:PSP_NAME[p.psp], mid:merchantId(p), model:MODEL_NAME[p.model]};
}
/* Stripe's monthly charges on Connect (sheet D48), sample rates: S$2.00 per active connected account,
   0.25% of the volume paid out to connected accounts, S$0.25 per payout to a connected account */
function otherCharges(list){
  var accts={}, vol=0, payouts={};
  list.forEach(function(a){
    if(a.r.p.model!=='connect') return;
    var acct=ENTITIES[a.r.p.ent].acct;
    accts[acct+'|'+a.r.per]=1; payouts[acct+'|'+a.payDate]=1; vol+=cents(a.net);
  });
  var active=Object.keys(accts).length*200, volume=Math.round(vol*.0025), fee=Object.keys(payouts).length*25;
  return {active:active/100, volume:volume/100, payout:fee/100, total:(active+volume+fee)/100};
}

return {TODAY:TODAY, UPLOADED:UPLOADED, IMG:IMG, PROJECTS:PROJECTS, ENTITIES:ENTITIES, ENT_ORDER:ENT_ORDER, MONTHS:MONTHS, PSP_NAME:PSP_NAME, MODEL_NAME:MODEL_NAME,
  h:h, c2:c2, cents:cents, fmt2:fmt2, money:money, num:num, MON:MON, d:d, fmtDate:fmtDate, fmtDMY:fmtDMY, addDays:addDays, weekday:weekday,
  monthLabel:monthLabel, monthDays:monthDays, nextMonth:nextMonth, payoutDate:payoutDate, payoutLabel:payoutLabel, initials:initials,
  procFee:procFee, axsFee:axsFee, pspFee:pspFee, status:status, rowsOf:rowsOf, inPeriod:inPeriod, totals:totals, ticketSales:ticketSales,
  pidsOf:pidsOf, yearOk:yearOk, periodsOf:periodsOf, yearsOf:yearsOf, isEv:isEv, amountLabel:amountLabel, agathosLabel:agathosLabel,
  rowsWord:rowsWord, plural:plural, countText:countText, kinds:kinds, others:others, payout:payout,
  reconciled:reconciled, adminRow:adminRow, otherCharges:otherCharges};
})();
