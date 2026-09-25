/* Flow diagrams for the demo scenarios — one per case, drawn from the handoff
   diagrams (1, 1c, 2, 2b, 2c, 3) and the flow spec. Rendered as inline SVG. */
window.OB_FLOWS = (function(){
'use strict';

/* node types: start · step · dec (decision) · end · next (hand-off to another diagram) · ext (branch not taken here)
   r/c = grid row / column. dim = drawn muted (a branch this scenario does not take). */
var FLOWS = {
  'new': {
    title:'New visitor', src:'Diagram 1 → 2 (2b, 2c) → 3 · Spec Steps 1–8',
    note:'A match on the registration number or legal name interrupts the document step (modal, not a new page). No match → the application continues standalone and goes to manual review.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Visitor lands, not logged in'},
      {id:'b', t:'step', r:1, c:1, l:'Quick intent', s:'Org name · cause · country'},
      {id:'c', t:'step', r:2, c:1, l:'Account', s:'Email → magic link, no password'},
      {id:'d', t:'dec', r:3, c:1, l:'Email matches an existing account?'},
      {id:'d1', t:'ext', r:3, c:2, l:'Treat as logged in', s:'→ Diagram 1c entry'},
      {id:'e', t:'dec', r:4, c:1, l:'Who is raising?'},
      {id:'e1', t:'ext', r:4, c:2, l:'Individual', s:'→ Diagram 2c, Step 4B'},
      {id:'f', t:'step', r:5, c:1, l:'Documents', s:'Reg. number · certificates · financials'},
      {id:'g', t:'dec', r:6, c:1, l:'Reg. no. or name matches an existing record?'},
      {id:'g1', t:'step', r:6, c:2, l:'Request access', s:'Verified org · primary contact notified · added to team on approval'},
      {id:'g2', t:'step', r:6, c:0, l:'Request to join', s:'In-progress application · 5-day window · timeout → manual review'},
      {id:'g3', t:'ext', r:7, c:0, l:'"Different organisation"', s:'Escape hatch → separate application'},
      {id:'h', t:'step', r:7, c:1, l:'Contact & authority', s:'Primary contact · who may withdraw'},
      {id:'i', t:'step', r:8, c:1, l:'Payout details', s:'Account masked · holder must match'},
      {id:'j', t:'step', r:9, c:1, l:'Review & submit', s:'Editable recap · SLA stated'},
      {id:'k', t:'step', r:10, c:1, l:'Manual review', s:'1–2 business days'},
      {id:'l', t:'next', r:11, c:1, l:'Approved → Session 2 build', s:'Diagram 3'}
    ],
    edges:[['a','b'],['b','c'],['c','d'],['d','d1','Yes',1],['d','e','No'],['e','e1','Individual',1],['e','f','Charity'],['f','g'],['g','g1','Verified'],['g','g2','Pending (2b)'],['g2','g3','',1],['g','h','No match'],['h','i'],['i','j'],['j','k'],['k','l']]
  },
  'ret1': {
    title:'Owner of one organisation', src:'Diagram 1c → 3 · Spec "Returning-user flow"',
    note:'Verification is tied to the organisation, not the project. The confirm checkbox keeps mild friction on purpose; a change re-opens only that section and the build can start while the expedited review runs.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Logged in', s:'Direct login or email match'},
      {id:'b', t:'dec', r:1, c:1, l:'How many orgs on the account?'},
      {id:'b0', t:'ext', r:1, c:0, l:'Zero-org prompt', s:'Add org · start individual'},
      {id:'c', t:'step', r:2, c:1, l:'Org selector', s:'Antioch21 · + Add org · + Individual'},
      {id:'c0', t:'ext', r:2, c:0, l:'Add organisation', s:'→ Diagram 2'},
      {id:'c1', t:'ext', r:2, c:2, l:'Start individual project', s:'→ Diagram 2c'},
      {id:'d', t:'dec', r:3, c:1, l:'Role on this org?'},
      {id:'d0', t:'ext', r:3, c:0, l:'Anything else', s:'→ request permissions'},
      {id:'d2', t:'ext', r:3, c:2, l:'Collaborator', s:'→ straight to build'},
      {id:'e', t:'step', r:4, c:1, l:'Recognised-org screen', s:'Verified since [date] · details summary'},
      {id:'f', t:'dec', r:5, c:1, l:'Details still accurate?'},
      {id:'f1', t:'step', r:5, c:2, l:'What\'s-changed checklist', s:'Payout · registration · contact'},
      {id:'f2', t:'step', r:6, c:2, l:'Only that section reopens', s:'Expedited review, often same day'},
      {id:'g', t:'step', r:6, c:1, l:'Start a new project'},
      {id:'h', t:'next', r:7, c:1, l:'Session 2 — build & launch', s:'Diagram 3 · one dashboard for all projects'}
    ],
    edges:[['a','b'],['b','b0','0',1],['b','c','1 or more'],['c','c0','',1],['c','c1','',1],['d','d0','Other',1],['d','d2','Collaborator',1],['c','d'],['d','e','Owner / Admin'],['e','f'],['f','f1','Changed'],['f1','f2'],['f','g','Confirm'],['g','h'],['f2','h','Build meanwhile']]
  },
  'ret2': {
    title:'In two organisations', src:'Diagram 1c (v4) · Spec "Is this for the same organization as before?"',
    note:'One login, several organisations. The selector decides which verification record, payout account and public "by [Org]" the project uses. An individual project is always available from this screen.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Logged in'},
      {id:'b', t:'dec', r:1, c:1, l:'How many orgs on the account?'},
      {id:'b0', t:'ext', r:1, c:0, l:'Zero-org prompt'},
      {id:'c', t:'step', r:2, c:1, l:'Org selector', s:'Orgs with role badges · + Add org · + Individual'},
      {id:'c0', t:'ext', r:2, c:0, l:'Add organisation', s:'→ Diagram 2, account and org-type steps skipped'},
      {id:'c2', t:'ext', r:2, c:2, l:'Start individual project', s:'→ Diagram 2c'},
      {id:'d', t:'dec', r:3, c:1, l:'Role on the chosen org?'},
      {id:'d0', t:'ext', r:3, c:0, l:'Anything else', s:'→ request permissions'},
      {id:'d2', t:'step', r:3, c:2, l:'Collaborator (Treasure Box)', s:'Straight to build · owner handles verification & payout'},
      {id:'e', t:'step', r:4, c:1, l:'Recognised-org screen (Antioch21)', s:'Verified since · confirm details'},
      {id:'f', t:'step', r:5, c:1, l:'Start a new project'},
      {id:'g', t:'next', r:6, c:1, l:'Session 2 — build & launch', s:'Diagram 3'}
    ],
    edges:[['a','b'],['b','b0','0',1],['b','c','1 or more'],['c','c0','',1],['c','c2','',1],['c','d'],['d','d0','Other',1],['d','d2','Collaborator'],['d','e','Owner / Admin'],['e','f'],['f','g'],['d2','g']]
  },
  'expiring': {
    title:'Verification expiring', src:'Diagram 1c · Spec UX note "expiring within 30 days"',
    note:'Spec triggers for the lightweight re-verification (never the full Session 1): payout details changed · 12+ months since last verification · registration expiry passed · new cause outside what was declared → manual review.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Logged in · one org'},
      {id:'b', t:'step', r:1, c:1, l:'Org selector', s:'Banner shows here and on the org screen'},
      {id:'c', t:'dec', r:2, c:1, l:'Verification expires within 30 days?'},
      {id:'c1', t:'ext', r:2, c:2, l:'Recognised-org screen', s:'As usual'},
      {id:'d', t:'step', r:3, c:1, l:'Proactive banner', s:'"Refresh due in [n] days" — before they try to launch'},
      {id:'e', t:'dec', r:4, c:1, l:'Refresh now?'},
      {id:'e1', t:'step', r:4, c:2, l:'Later', s:'Continue as usual · blocked once the date passes'},
      {id:'f', t:'step', r:5, c:1, l:'What\'s-changed checklist', s:'Payout · registration · contact'},
      {id:'g', t:'step', r:6, c:1, l:'Re-open only the ticked sections'},
      {id:'h', t:'step', r:7, c:1, l:'Expedited review', s:'Refresh submitted · usually same day'},
      {id:'i', t:'next', r:8, c:1, l:'Session 2 — build while the review runs', s:'Diagram 3'}
    ],
    edges:[['a','b'],['b','c'],['c','c1','No',1],['c','d','Yes'],['d','e'],['e','e1','Later'],['e','f','Now'],['f','g'],['g','h'],['h','i'],['e1','i']]
  },
  'indiv': {
    title:'Individual, already verified', src:'Diagram 1c → 2c · Handoff §D',
    note:'Same pattern as the recognised-org screen with individual fields. The ID-expiry warning is a badge variant on the same screen, not a separate screen.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Logged in · no org'},
      {id:'b', t:'step', r:1, c:1, l:'Zero-org prompt', s:'+ Add organisation · + Start individual project'},
      {id:'b0', t:'ext', r:1, c:0, l:'Add organisation', s:'→ Diagram 2'},
      {id:'c', t:'dec', r:2, c:1, l:'Previously verified individual on this account?'},
      {id:'c1', t:'ext', r:2, c:2, l:'Full Step 4B', s:'ID · proof of address → manual review'},
      {id:'d', t:'step', r:3, c:1, l:'Recognised individual', s:'Verified since [date] · name + masked ID'},
      {id:'e', t:'dec', r:4, c:1, l:'ID expiring soon?'},
      {id:'e1', t:'step', r:4, c:2, l:'Amber badge', s:'"ID expires in [n] days" · badge variant, same screen'},
      {id:'f', t:'dec', r:5, c:1, l:'Details still accurate?'},
      {id:'f1', t:'step', r:5, c:2, l:'What\'s-changed', s:'Government ID · address · legal name — only ticked items reopen'},
      {id:'g', t:'step', r:6, c:1, l:'Start a new project'},
      {id:'h', t:'next', r:7, c:1, l:'Session 2 — build & launch', s:'Diagram 3'}
    ],
    edges:[['a','b'],['b','b0','',1],['b','c','Individual'],['c','c1','No',1],['c','d','Yes'],['d','e'],['e','e1','Yes'],['e','f','No'],['e1','f'],['f','f1','Changed'],['f','g','Confirm'],['g','h'],['f1','h','After update']]
  },
  'collab': {
    title:'Collaborator or member', src:'Diagram 1c (v4) · Handoff "Request-permissions screen"',
    note:'A collaborator builds and launches without verifying anything — the owner already did. Anyone else on the org asks an Owner/Admin; on approval they loop back here with no re-verification.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Logged in · two orgs'},
      {id:'b', t:'step', r:1, c:1, l:'Org selector', s:'Treasure Box · Collaborator / YWAM · Member'},
      {id:'c', t:'dec', r:2, c:1, l:'Role on the chosen org?'},
      {id:'c0', t:'step', r:2, c:0, l:'Collaborator (Treasure Box)', s:'Straight to build · owner handles verification & payout'},
      {id:'c2', t:'ext', r:2, c:2, l:'Owner / Admin', s:'→ recognised-org screen'},
      {id:'d', t:'step', r:3, c:1, l:'Request-permissions screen', s:'Explanation + "Request access"'},
      {id:'e', t:'step', r:4, c:1, l:'Pending state', s:'Owner / Admin notified · request shown as sent'},
      {id:'f', t:'dec', r:5, c:1, l:'Approved by Owner / Admin?'},
      {id:'f1', t:'ext', r:5, c:2, l:'Stays pending', s:'Ask the owner'},
      {id:'g', t:'step', r:6, c:1, l:'Loops back with permission', s:'No re-verification'},
      {id:'h', t:'next', r:7, c:1, l:'Session 2 — build & launch', s:'Diagram 3'}
    ],
    edges:[['a','b'],['b','c'],['c','c0','Collaborator'],['c','c2','Owner / Admin',1],['c','d','Anything else (YWAM)'],['d','e'],['e','f'],['f','f1','No reply',1],['f','g','Yes'],['g','h'],['c0','h']]
  },
  'awaiting': {
    title:'Project awaiting publish', src:'Diagram 3 · Spec Steps 9–11',
    note:'Launch timing is a real decision (three equal cards, not a dropdown). Schedule and draft both land in "Approved, awaiting publish" — a dashboard state, not a one-time screen — with reminders on day 3, 7 and 14.',
    cols:3,
    nodes:[
      {id:'a', t:'start', r:0, c:1, l:'Verification approved', s:'Org or individual'},
      {id:'b', t:'step', r:1, c:1, l:'Project basics', s:'Name · story · photos · type (event-tied → date)'},
      {id:'c', t:'step', r:2, c:1, l:'Goal & needs', s:'All optional — range, exact, milestone, not sure yet'},
      {id:'d', t:'step', r:3, c:1, l:'Team', s:'Invite by email · role'},
      {id:'e', t:'dec', r:4, c:1, l:'Launch timing?'},
      {id:'e0', t:'end', r:4, c:0, l:'Go live now', s:'Public page'},
      {id:'e2', t:'step', r:4, c:2, l:'Save as draft'},
      {id:'f', t:'step', r:5, c:1, l:'Scheduled', s:'Date & time · 24h-prior reminder'},
      {id:'g', t:'step', r:6, c:1, l:'Approved, awaiting publish', s:'Dashboard state on every return visit'},
      {id:'h', t:'step', r:7, c:1, l:'Reminders', s:'Day 3 · day 7 · day 14'},
      {id:'i', t:'end', r:8, c:1, l:'Publish now → live'}
    ],
    edges:[['a','b'],['b','c'],['c','d'],['d','e'],['e','e0','Now'],['e','e2','Draft'],['e','f','Schedule'],['f','g'],['e2','g'],['g','h'],['h','i']]
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
