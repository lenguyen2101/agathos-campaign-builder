/* Flow diagrams for the demo scenarios — one per case, drawn from the handoff
   diagrams (1, 1c, 2, 2b, 2c, 3) and the flow spec. Rendered as inline SVG. */
window.OB_FLOWS = (function(){
'use strict';

/* node types: start · step · dec (decision) · end · next (hand-off to another diagram) · ext (branch not taken here)
   r/c = grid row / column. dim = drawn muted (a branch this scenario does not take). */
var FLOWS = {
  'new': {
    title:'New visitor', src:'+ Create → Step 0 → account → Create Organization questions (5 short steps) or Create Event form',
    note:'Organisations answer the same questions as the live Create Organization form, in five short steps. The registration number is asked first, so an organisation already on Agathos is spotted before the rest is filled in. The organisation path skips "Who is raising". Singapore organisations that can offer tax deductions (IPCs) skip the bank statement. Events need no verification: the host goes straight to the Create Event form.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Visitor lands, not logged in'},
      {id:'nv', t:'step', r:1, c:1, l:'+ Create', s:'On the nav, any page'},
      {id:'nf', t:'ext', r:1, c:2, l:'Footer link', s:'Start a Project · Register an Organization · Host an Event → straight to that path'},
      {id:'b', t:'step', r:2, c:1, l:'Step 0 · What would you like to do?', s:'Cause · Organization · Event'},
      {id:'c', t:'step', r:3, c:1, l:'Your account', s:'Email link, no password'},
      {id:'d', t:'dec', r:4, c:1, l:'Email already has an account?'},
      {id:'d1', t:'ext', r:4, c:2, l:'"Already an account"', s:'Log in → organisation list'},
      {id:'e', t:'dec', r:5, c:1, l:'Which path?'},
      {id:'e2', t:'next', r:5, c:2, l:'Event', s:'Who is hosting? → Create Event form'},
      {id:'f', t:'dec', r:6, c:1, l:'Who is raising?'},
      {id:'f2', t:'ext', r:6, c:2, l:'Individual', s:'About your cause → identity → contact → payout → review'},
      {id:'g', t:'step', r:7, c:1, l:'Organization', s:'Name · country · registration number · size'},
      {id:'i', t:'dec', r:8, c:1, l:'Matches an existing organisation?'},
      {id:'i1', t:'step', r:8, c:2, l:'Request access or join', s:'Verified org · application in progress (2b)'},
      {id:'g2', t:'step', r:9, c:1, l:'Contact → Causes', s:'Email, phone, address, website · causes, countries, about'},
      {id:'h', t:'step', r:10, c:1, l:'Documents', s:'Certificate · financials · bank statement (not for IPCs)'},
      {id:'j', t:'step', r:11, c:1, l:'Risk declaration → Submit', s:'Reviewed in 1–2 business days'},
      {id:'k', t:'dec', r:12, c:1, l:'Path chosen at step 0?'},
      {id:'l0', t:'next', r:13, c:0, l:'Cause', s:'Proposal → review and call → build'},
      {id:'l1', t:'next', r:13, c:2, l:'Organization', s:'Organization page'}
    ],
    edges:[['a','nv'],['nv','b'],['a','nf','',1],['b','c'],['c','d'],['d','d1','Yes',1],['d','e','No'],['e','e2','Event'],['e','f','Cause or org'],['f','f2','Individual',1],['f','g','Organization'],['g','i'],['i','i1','Match'],['i','g2','No match'],['g2','h'],['h','j'],['j','k'],['k','l0','Cause'],['k','l1','Org']]
  },
  'fresh': {
    title:'Not verified yet', src:'+ Create → Step 0 → Diagram 1c (no organisations) → 2 or 2c',
    note:'Has an account but has never verified an organisation or themselves. The account step is skipped because they are logged in, and so is "Who is raising" because they choose it in the list.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Logged in', s:'No organisation, not verified'},
      {id:'nv', t:'step', r:1, c:1, l:'+ Create', s:'On the nav or in Manage Pages'},
      {id:'b', t:'step', r:2, c:1, l:'Step 0 · What would you like to do?'},
      {id:'c', t:'step', r:3, c:1, l:'Who is raising?', s:'+ Add an organisation · + Individual'},
      {id:'c0', t:'step', r:4, c:0, l:'Add an organisation', s:'Organization → Contact → Causes → Documents → Risk declaration'},
      {id:'c2', t:'step', r:4, c:2, l:'Individual', s:'About your cause → Verify your identity → Contact → Payout → Review'},
      {id:'d', t:'step', r:5, c:1, l:'Manual review', s:'1–2 business days'},
      {id:'e', t:'next', r:6, c:1, l:'Approved → where the path leads', s:'Proposal · organisation page · event form'}
    ],
    edges:[['a','nv'],['nv','b'],['b','c'],['c','c0'],['c','c2'],['c0','d'],['c2','d'],['d','e']]
  },
  'ret1': {
    title:'Owner of one organisation', src:'+ Create → Step 0 → Diagram 1c → proposal, organisation page or event',
    note:'Verification is tied to the organisation, not the project. The confirm pop-up keeps mild friction on purpose. Every project is reviewed and talked through before its page is built.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Logged in', s:'Owner of Antioch21'},
      {id:'nv', t:'step', r:1, c:1, l:'+ Create', s:'On the nav or in Manage Pages'},
      {id:'b', t:'step', r:2, c:1, l:'Step 0 · What would you like to do?'},
      {id:'c', t:'dec', r:3, c:1, l:'Which path?'},
      {id:'o0', t:'step', r:4, c:0, l:'Which organisation?', s:'Antioch21 · + Add an organisation'},
      {id:'o1', t:'step', r:4, c:1, l:'Who is this project for?', s:'Antioch21 · + Add org · + Individual'},
      {id:'o2', t:'step', r:4, c:2, l:'Who is hosting?', s:'Antioch21 · + Add org · + Individual'},
      {id:'p0', t:'next', r:5, c:0, l:'Organization page', s:'Who we are · images · running costs · publish'},
      {id:'p1', t:'step', r:5, c:1, l:'Confirm pop-up', s:'Verified details · still accurate?'},
      {id:'p2', t:'next', r:5, c:2, l:'Event form', s:'Create Event, host filled in'},
      {id:'q', t:'dec', r:6, c:1, l:'Details still accurate?'},
      {id:'q2', t:'step', r:6, c:2, l:'What\'s-changed checklist', s:'Only ticked sections reopen'},
      {id:'r', t:'step', r:7, c:1, l:'Project proposal', s:'Title · cause · country · summary · rough goal'},
      {id:'s', t:'step', r:8, c:1, l:'Agathos reviews and calls', s:'Dashboard shows "In review"'},
      {id:'t', t:'next', r:9, c:1, l:'Approved → build & launch', s:'Diagram 3'}
    ],
    edges:[['a','nv'],['nv','b'],['b','c'],['c','o0','Org'],['c','o1','Cause'],['c','o2','Event'],['o0','p0'],['o1','p1'],['o2','p2'],['p1','q'],['q','q2','Changed'],['q','r','Yes'],['r','s'],['s','t']]
  },
  'ret2': {
    title:'In two organisations', src:'+ Create → Step 0 → Diagram 1c (v4) · Spec "Is this for the same organization as before?"',
    note:'One login, several organisations. The organisation picked decides which verification, payout account and organisation page the project uses. Owner and Manager do the same here. An individual project is always available.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Logged in', s:'Owner of Antioch21 · Manager of Treasure Box'},
      {id:'nv', t:'step', r:1, c:1, l:'+ Create', s:'On the nav or in Manage Pages'},
      {id:'b', t:'step', r:2, c:1, l:'Step 0 → Raise funds for a cause'},
      {id:'c', t:'step', r:3, c:1, l:'Who is this project for?', s:'Both organisations · + Add org · + Individual'},
      {id:'c0', t:'ext', r:3, c:0, l:'Add an organisation', s:'→ the five organisation steps'},
      {id:'c2', t:'ext', r:3, c:2, l:'Individual project', s:'→ Diagram 2c'},
      {id:'d', t:'step', r:4, c:1, l:'Confirm pop-up', s:'Owner or Manager confirms details'},
      {id:'e', t:'step', r:5, c:1, l:'Project proposal'},
      {id:'f', t:'step', r:6, c:1, l:'Agathos reviews and calls'},
      {id:'g', t:'next', r:7, c:1, l:'Approved → build & launch', s:'Diagram 3'}
    ],
    edges:[['a','nv'],['nv','b'],['b','c'],['c','c0','',1],['c','c2','',1],['c','d'],['d','e'],['e','f'],['f','g']]
  },
  'expiring': {
    title:'Verification expiring', src:'Diagram 1c · Spec UX note "expiring within 30 days"',
    note:'Spec triggers for the lightweight re-verification (never the full Session 1): payout details changed · 12+ months since last verification · registration expiry passed · new cause outside what was declared → manual review.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Logged in · one org'},
      {id:'b', t:'step', r:1, c:1, l:'Step 0 and organisation list', s:'The refresh banner shows on both'},
      {id:'c', t:'dec', r:2, c:1, l:'Verification expires within 30 days?'},
      {id:'c1', t:'ext', r:2, c:2, l:'Confirm pop-up', s:'As usual'},
      {id:'d', t:'step', r:3, c:1, l:'Proactive banner', s:'"Refresh due in [n] days" — before they try to launch'},
      {id:'e', t:'dec', r:4, c:1, l:'Refresh now?'},
      {id:'e1', t:'step', r:4, c:2, l:'Later', s:'Continue as usual · blocked once the date passes'},
      {id:'f', t:'step', r:5, c:1, l:'What\'s-changed checklist', s:'Organization details · documents · risk declaration'},
      {id:'g', t:'step', r:6, c:1, l:'Re-open only the ticked sections'},
      {id:'h', t:'step', r:7, c:1, l:'Expedited review', s:'Refresh submitted · usually same day'},
      {id:'i', t:'next', r:8, c:1, l:'Carry on while the review runs', s:'Proposal · page · event'}
    ],
    edges:[['a','b'],['b','c'],['c','c1','No',1],['c','d','Yes'],['d','e'],['e','e1','Later'],['e','f','Now'],['f','g'],['g','h'],['h','i'],['e1','i']]
  },
  'indiv': {
    title:'Individual, already verified', src:'Step 0 → Diagram 1c → 2c · Handoff §D',
    note:'Same details summary as the organisation confirm, with individual fields. The ID-expiry warning is a badge variant on the same screen, not a separate screen.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Logged in · no org'},
      {id:'b', t:'step', r:1, c:1, l:'Step 0 → Raise funds for a cause', s:'+ Add organisation · + Continue as you'},
      {id:'b2', t:'ext', r:1, c:2, l:'Host an event', s:'Host as yourself → event form'},
      {id:'c', t:'dec', r:2, c:1, l:'Previously verified individual on this account?'},
      {id:'c1', t:'ext', r:2, c:2, l:'Full Step 4B', s:'ID · proof of address → manual review'},
      {id:'d', t:'step', r:3, c:1, l:'Recognised individual', s:'Verified since [date] · name + masked ID'},
      {id:'e', t:'dec', r:4, c:1, l:'ID expiring soon?'},
      {id:'e1', t:'step', r:4, c:2, l:'Amber badge', s:'"ID expires in [n] days" · badge variant, same screen'},
      {id:'f', t:'dec', r:5, c:1, l:'Details still accurate?'},
      {id:'f1', t:'step', r:5, c:2, l:'What\'s-changed', s:'Government ID · address · legal name — only ticked items reopen'},
      {id:'g', t:'step', r:6, c:1, l:'Project proposal', s:'Reviewed and talked through'},
      {id:'h', t:'next', r:7, c:1, l:'Approved → build & launch', s:'Diagram 3'}
    ],
    edges:[['a','b'],['b','b2','',1],['b','c'],['c','c1','No',1],['c','d','Yes'],['d','e'],['e','e1','Yes'],['e','f','No'],['e1','f'],['f','f1','Changed'],['f','g','Confirm'],['g','h'],['f1','h','After update']]
  },
  'awaiting': {
    title:'Project awaiting publish', src:'Diagram 3 · Spec Steps 8–11, with a proposal step in front',
    note:'Every project starts as a proposal. Once it is approved, the page is built and the launch timing chosen (three equal cards, not a dropdown). Schedule and draft land in "Approved, awaiting publish" on the dashboard, with reminders on day 3, 7 and 14.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Verified organisation or individual'},
      {id:'b', t:'step', r:1, c:1, l:'Project proposal', s:'Title · cause · country · summary · rough goal'},
      {id:'c', t:'step', r:2, c:1, l:'Agathos reviews and calls', s:'Dashboard: "In review"'},
      {id:'d', t:'step', r:3, c:1, l:'Project page', s:'Title · type · cause · place · introduction · background · scope · photos'},
      {id:'e', t:'step', r:4, c:1, l:'Goal & dates · Team', s:'Optional goal and dates · Manager or Viewer'},
      {id:'f', t:'dec', r:5, c:1, l:'Launch timing?'},
      {id:'f0', t:'end', r:5, c:0, l:'Go live now', s:'Public page'},
      {id:'f2', t:'step', r:5, c:2, l:'Save as draft'},
      {id:'g', t:'step', r:6, c:1, l:'Scheduled', s:'Date & time · 24h-prior reminder'},
      {id:'h', t:'step', r:7, c:1, l:'Approved, awaiting publish', s:'Dashboard state on every return visit'},
      {id:'i', t:'step', r:8, c:1, l:'Reminders', s:'Day 3 · day 7 · day 14'},
      {id:'j', t:'end', r:9, c:1, l:'Publish now → live'}
    ],
    edges:[['a','b'],['b','c'],['c','d','Approved'],['d','e'],['e','f'],['f','f0','Now'],['f','f2','Draft'],['f','g','Schedule'],['g','h'],['f2','h'],['h','i'],['i','j']]
  }
};

var COLW=312, ROWH=106, PAD=18;
var SIZE={start:[200,0], step:[204,0], dec:[222,90], end:[204,0], next:[212,0], ext:[198,0]};

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function wrap(str, max){
  var words=String(str).split(' '), lines=[], cur='';
  words.forEach(function(w){ if((cur+' '+w).trim().length>max && cur){ lines.push(cur); cur=w; } else cur=(cur+' '+w).trim(); });
  if(cur) lines.push(cur);
  return lines;
}
function measure(n){
  var w=SIZE[n.t][0], fixed=SIZE[n.t][1];
  n.L=wrap(n.l, n.t==='dec'?22:25);
  n.S=n.s?wrap(n.s, 31):[];
  n.w=w;
  n.h=fixed||Math.max(46, 24+16*n.L.length+(n.S.length?4+14*n.S.length:0));
}
function tspans(lines, x, y0, lh, cls){
  return lines.map(function(t,i){ return '<text class="'+cls+'" x="'+x+'" y="'+(y0+i*lh)+'" text-anchor="middle">'+esc(t)+'</text>'; }).join('');
}
function drawNode(n){
  var x=n.x-n.w/2, y=n.y-n.h/2, cls='fn '+n.t+((n.dim||n.t==='ext')?' dim':''), shape;
  if(n.t==='dec'){
    shape='<polygon points="'+n.x+','+y+' '+(x+n.w)+','+n.y+' '+n.x+','+(y+n.h)+' '+x+','+n.y+'"/>';
  } else {
    var rx=(n.t==='start'||n.t==='end'||n.t==='next')?Math.min(n.h/2,22):12;
    shape='<rect x="'+x+'" y="'+y+'" width="'+n.w+'" height="'+n.h+'" rx="'+rx+'"/>';
  }
  var total=16*n.L.length+(n.S.length?4+14*n.S.length:0);
  var y0=n.y-total/2+12;
  return '<g class="'+cls+'">'+shape+tspans(n.L, n.x, y0, 16, 'l')+(n.S.length?tspans(n.S, n.x, y0+16*n.L.length+4, 14, 's'):'')+'</g>';
}
function drawEdge(f, t, label, dim){
  var pts, lab, dir;
  if(t.r===f.r){
    dir=t.c>f.c?1:-1;
    pts=[{x:f.x+dir*f.w/2, y:f.y},{x:t.x-dir*t.w/2, y:t.y}];
    lab={x:(pts[0].x+pts[1].x)/2, y:f.y-9, a:'middle'};
  } else if(t.c===f.c){
    pts=[{x:f.x, y:f.y+f.h/2},{x:t.x, y:t.y-t.h/2}];
    lab={x:f.x+7, y:(pts[0].y+pts[1].y)/2+4, a:'start'};
  } else if(f.t==='dec'){
    dir=t.c>f.c?1:-1;
    pts=[{x:f.x+dir*f.w/2, y:f.y},{x:t.x, y:f.y},{x:t.x, y:t.y-t.h/2}];
    lab={x:f.x+dir*(f.w/2+8), y:f.y-9, a:dir>0?'start':'end'};
  } else {
    var my=t.y-t.h/2-22;
    pts=[{x:f.x, y:f.y+f.h/2},{x:f.x, y:my},{x:t.x, y:my},{x:t.x, y:t.y-t.h/2}];
    lab={x:f.x+7, y:pts[0].y+16, a:'start'};
  }
  var d=pts.map(function(p,i){ return (i?'L':'M')+p.x+' '+p.y; }).join(' ');
  var out='<path class="fe'+(dim?' dim':'')+'" d="'+d+'" marker-end="url(#'+(dim?'fa-dim':'fa')+')"/>';
  if(label){
    var w=label.length*6.1+10, bx=lab.a==='middle'?lab.x-w/2:(lab.a==='start'?lab.x-4:lab.x-w+4);
    out+='<rect class="fl-bg" x="'+bx+'" y="'+(lab.y-11)+'" width="'+w+'" height="15" rx="4"/><text class="fl'+(dim?' dim':'')+'" x="'+lab.x+'" y="'+lab.y+'" text-anchor="'+lab.a+'">'+esc(label)+'</text>';
  }
  return out;
}
function render(key){
  var F=FLOWS[key]; if(!F) return '';
  var byId={}, rows=0;
  F.nodes.forEach(function(n){ measure(n); n.x=PAD+n.c*COLW+COLW/2; n.y=PAD+n.r*ROWH+ROWH/2; byId[n.id]=n; rows=Math.max(rows,n.r+1); });
  var W=PAD*2+F.cols*COLW, H=PAD*2+rows*ROWH;
  var edges=F.edges.map(function(e){ return drawEdge(byId[e[0]], byId[e[1]], e[2]||'', !!e[3]); }).join('');
  var nodes=F.nodes.map(drawNode).join('');
  return '<svg class="flow" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(F.title)+' flow">'+
    '<defs><marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2C50A8"/></marker>'+
    '<marker id="fa-dim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#B3BDCF"/></marker></defs>'+
    edges+nodes+'</svg>';
}

return {
  keys:Object.keys(FLOWS),
  get:function(k){ return FLOWS[k]; },
  render:render
};
})();
