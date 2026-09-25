/* ============================================================================
   Agathos — project-owner onboarding prototype.
   One page, hash-routed. State lives in localStorage so a reviewer can leave
   and come back exactly where they were — which is also the product promise.

   Routes
     #/start #/account #/type #/docs #/contact #/payout #/review #/submitted
     #/entry #/org/<id> #/org/<id>/changes #/individual #/individual/changes
     #/access #/build/basics #/build/goal #/build/team #/build/launch
     #/build/done #/dashboard
   ============================================================================ */
(function(){
'use strict';

var KEY = 'agathos.onboarding.v2';
var TODAY = new Date();

/* ---------- reference data ---------- */
var CAUSES = [
  ['relief','Relief & emergency'], ['education','Education'], ['medical','Medical'],
  ['faith','Faith-based / ministry'], ['community','Community'], ['other','Other']
];
var COUNTRIES = ['Singapore','Malaysia','Indonesia','Philippines','Thailand','Vietnam','Cambodia','Myanmar','Nepal','India','Other'];
var PROJECT_TYPES = [
  {v:'once', t:'One-time need', d:'A specific need with a clear finish — a relief response, a build, a medical bill.'},
  {v:'ongoing', t:'Ongoing or recurring', d:'Operations you fund month after month. Donors can give monthly.'},
  {v:'event', t:'Tied to an event', d:'A run, a dinner, a mission trip. Has a date, so it has an end.'}
];
var GOALS = [['lt1','Under S$1k'],['1to5','S$1k – 5k'],['5to20','S$5k – 20k'],['gt20','S$20k+'],['exact','Exact amount'],['unsure','Not sure yet']];
var ROLES = [['editor','Editor'],['viewer','Viewer'],['withdraw','Withdrawal-authorised']];

/* organisations already on Agathos — what the org-match check looks up */
var DIRECTORY = [
  {id:'antioch21', name:'Antioch21', keys:['t08ss0123a','antioch21','antioch 21'], status:'verified', since:'2025-03-14', contact:'j•••@antioch21.org'},
  {id:'livingwaters', name:'Living Waters Village', keys:['t21ss0456b','living waters'], status:'pending', submitted:'2026-09-10', contact:'r•••@livingwaters.sg'}
];
/* emails that already have an account — the magic link logs them in instead */
var KNOWN_EMAILS = ['adam@agathos.be','josias@antioch21.org'];

var ORG_ANTIOCH = {id:'antioch21', name:'Antioch21', type:'charity', country:'Singapore', role:'Owner', verifiedSince:'2025-03-14', expiresOn:'2027-03-14', lastActive:'2026-09-02', regMasked:'T08SS••••A', contact:'Josias Ding', payoutMasked:'DBS ••••4821'};
var ORG_TTB = {id:'treasurebox', name:'The Treasure Box Singapore', type:'charity', country:'Singapore', role:'Collaborator', verifiedSince:'2024-11-20', expiresOn:'2026-11-20', lastActive:'2026-08-15', regMasked:'T19SS••••C', contact:'Rachel Tan', payoutMasked:'OCBC ••••2210'};
var ORG_YWAM = {id:'ywam', name:'YWAM Singapore', type:'charity', country:'Singapore', role:'Member', verifiedSince:'2023-06-01', expiresOn:'2027-06-01', lastActive:'2026-07-30', regMasked:'T04SS••••K', contact:'Daniel Koh', payoutMasked:'UOB ••••7734'};
var PROJ_A = {id:'c1', name:'Special Needs Centre in Kurdistan Region of Iraq', org:'antioch21', status:'live', raised:20000, goal:60000, contributions:186, started:'2025-08-08'};
var PROJ_B = {id:'c2', name:'Kurdistan Winter Relief 2025', org:'antioch21', status:'ended', raised:41200, goal:40000, contributions:402, started:'2025-11-02'};

function base(){
  return {
    scenario:'new',
    auth:{loggedIn:false, name:'', email:''},
    account:{orgs:[], individual:null, projects:[]},
    s1:{mode:'visitor', intent:{}, account:{}, type:'', docs:{}, contact:{}, payout:{}, done:{}, status:'draft'},
    s2:{basics:{}, goal:{}, team:[], launch:{}, done:{}, status:''},
    requests:{}, update:null, selectedOrg:'', confirmed:{}
  };
}
function loggedIn(s){ s.auth = {loggedIn:true, name:'Adam Le', email:'adam@agathos.be'}; return s; }

var SCENARIOS = {
  'new':      {label:'New visitor', sub:'Not logged in — full Session 1', start:'start', seed:function(){ return base(); }},
  'ret1':     {label:'Returning · one organisation', sub:'Owner of Antioch21, verified', start:'entry', seed:function(){ var s=loggedIn(base()); s.account.orgs=[clone(ORG_ANTIOCH)]; s.account.projects=[clone(PROJ_A),clone(PROJ_B)]; return s; }},
  'ret2':     {label:'Returning · two organisations', sub:'Owner + Collaborator — org selector', start:'entry', seed:function(){ var s=loggedIn(base()); s.account.orgs=[clone(ORG_ANTIOCH),clone(ORG_TTB)]; s.account.projects=[clone(PROJ_A),clone(PROJ_B)]; return s; }},
  'expiring': {label:'Returning · verification expiring', sub:'Refresh banner, 20 days left', start:'entry', seed:function(){ var s=loggedIn(base()); var o=clone(ORG_ANTIOCH); o.expiresOn=addDays(20); s.account.orgs=[o]; s.account.projects=[clone(PROJ_A)]; return s; }},
  'indiv':    {label:'Returning · verified individual', sub:'No org, ID expiring soon', start:'entry', seed:function(){ var s=loggedIn(base()); s.account.individual={name:'Adam Le', verifiedSince:'2025-08-02', idMasked:'S••••567A', idExpires:addDays(25), address:'Tampines, Singapore'}; return s; }},
  'collab':   {label:'Returning · collaborator / no permission', sub:'Collaborator on one org, member of another', start:'entry', seed:function(){ var s=loggedIn(base()); s.account.orgs=[clone(ORG_TTB),clone(ORG_YWAM)]; return s; }},
  'awaiting': {label:'Approved · awaiting publish', sub:'Dashboard with a scheduled project', start:'dashboard', seed:function(){ var s=loggedIn(base()); s.account.orgs=[clone(ORG_ANTIOCH)]; s.account.projects=[{id:'c3', name:'Living Waters Village', org:'antioch21', status:'scheduled', scheduledFor:addDays(7)+'T09:00', approvedOn:addDays(-2)}, clone(PROJ_A)]; s.selectedOrg='antioch21'; return s; }}
};

/* ---------- state ---------- */
var S;
function load(){ try{ var raw=localStorage.getItem(KEY); return raw?JSON.parse(raw):null; }catch(e){ return null; } }
function save(){ localStorage.setItem(KEY, JSON.stringify(S)); }
function reset(name){ S = SCENARIOS[name].seed(); S.scenario=name; save(); }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function get(path){ return path.split('.').reduce(function(o,k){ return o==null?undefined:o[k]; }, S); }
function set(path, v){
  var ks=path.split('.'), o=S;
  for(var i=0;i<ks.length-1;i++){ if(o[ks[i]]==null) o[ks[i]]={}; o=o[ks[i]]; }
  o[ks[ks.length-1]]=v; save();
}

/* ---------- small helpers ---------- */
var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function h(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function fmtDate(iso){ if(!iso) return ''; var d=new Date(iso); return d.getDate()+' '+MONTHS[d.getMonth()]+' '+d.getFullYear(); }
function fmtDateTime(iso){ if(!iso) return ''; var d=new Date(iso); var hh=d.getHours(), mm=('0'+d.getMinutes()).slice(-2); return fmtDate(iso)+', '+(hh%12||12)+':'+mm+(hh<12?' am':' pm'); }
function addDays(n){ var d=new Date(TODAY); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }
function daysUntil(iso){ return Math.ceil((new Date(iso)-TODAY)/86400000); }
function initials(name){ return (name||'').split(/\s+/).filter(Boolean).slice(0,2).map(function(w){ return w[0]; }).join('').toUpperCase() || '?'; }
function firstName(name){ return (name||'').split(' ')[0]; }
function fmtSize(b){ return b>1048576 ? (b/1048576).toFixed(1)+' MB' : Math.max(1,Math.round(b/1024))+' KB'; }
function money(n){ return 'S$'+Number(n||0).toLocaleString('en-SG'); }
function findOrg(id){ return S.account.orgs.filter(function(o){ return o.id===id; })[0]; }
function currentOrg(){ return findOrg(S.selectedOrg); }
function causeLabel(v){ var c=CAUSES.filter(function(x){ return x[0]===v; })[0]; return c?c[1]:''; }

var I = {
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M6 10l6-6 6 6M4 20h16"/></svg>',
  file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M8 7h4M8 11h4M8 15h4M2 21h20"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c3 0 5 2 5 5"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  rocket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15l-2 6 6-2M14 4c3-1 6 0 6 0s1 3 0 6c-2 5-7 8-7 8l-4-4s3-5 5-10z"/><circle cx="15" cy="9" r="1.5"/></svg>',
  draft:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10-10-4-4L4 16z"/><path d="M12 8l4 4"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  bank:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-5 9 5M4 9h16M6 9v8M10 9v8M14 9v8M18 9v8M3 21h18"/></svg>',
  chev:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9-4 9 4v9l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v9"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  sparkle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/></svg>'
};

/* ---------- form primitives ---------- */
function field(o){
  var v=get(o.k); if(v==null) v='';
  var attrs=' class="ob-input" data-k="'+o.k+'"'+(o.req?' data-req="1"':'')+(o.readonly?' readonly':'')+(o.placeholder?' placeholder="'+h(o.placeholder)+'"':'')+(o.maxlen?' maxlength="'+o.maxlen+'"':'');
  var input;
  if(o.type==='select'){
    input='<select'+attrs+'><option value="">'+h(o.placeholder||'Select…')+'</option>'+o.options.map(function(op){
      var val=Array.isArray(op)?op[0]:op, lbl=Array.isArray(op)?op[1]:op;
      return '<option value="'+h(val)+'"'+(val===v?' selected':'')+'>'+h(lbl)+'</option>';
    }).join('')+'</select>';
  } else if(o.type==='textarea'){
    input=(o.toolbar?'<div class="ob-toolbar"><span>B</span><span>I</span><span>U</span><span>H2</span><span>• List</span><span>1. List</span><span>Link</span></div>':'')+'<textarea'+attrs+(o.rows?' rows="'+o.rows+'"':'')+'>'+h(v)+'</textarea>'+(o.maxlen?'<div class="ob-count">'+String(v).length+'/'+o.maxlen+'</div>':'');
  } else {
    input='<input type="'+(o.type||'text')+'"'+attrs+' value="'+h(v)+'">';
  }
  return '<div class="ob-field" data-field="'+o.k+'"><label>'+h(o.label)+(o.req?'<span class="req">*</span>':'')+(o.opt?'<span class="opt">Optional</span>':'')+'</label>'+input+'<div class="msg">'+h(o.msg||'Required')+'</div>'+(o.hint?'<div class="hint">'+o.hint+'</div>':'')+(o.after||'')+'</div>';
}
function upload(o){
  var f=get(o.k), box;
  if(!f){
    box='<div class="ob-upload empty" data-up="'+o.k+'"'+(o.req?' data-req="1"':'')+'><div class="ic">'+I.upload+'</div><div><div class="t">'+h(o.cta||'Click to upload')+'</div><div class="d">'+h(o.types||'PDF, JPG or PNG · up to 20MB')+'</div></div><input type="file" data-upfile="'+o.k+'"></div>';
  } else if(f.busy){
    box='<div class="ob-upload busy"><div class="ic">'+I.file+'</div><div class="name"><div class="t">'+h(f.name)+'</div><div class="bar"><i></i></div></div></div>';
  } else {
    box='<div class="ob-upload done"><div class="ic">'+I.check+'</div><div class="name"><div class="t">'+h(f.name)+'</div><div class="d">'+fmtSize(f.size)+' · Uploaded</div></div><div class="acts"><button type="button" data-up-replace="'+o.k+'">Replace</button><button type="button" class="rm" data-up-rm="'+o.k+'">Remove</button></div></div>';
  }
  return '<div class="ob-field" data-field="'+o.k+'"><label>'+h(o.label)+(o.req?'<span class="req">*</span>':'')+(o.opt?'<span class="opt">Optional</span>':'')+'</label>'+box+'<div class="msg">Please upload this file</div>'+(o.hint?'<div class="hint">'+o.hint+'</div>':'')+(o.after||'')+'</div>';
}
function choice(o){
  var v=get(o.k);
  return '<div class="ob-field" data-field="'+o.k+'">'+(o.label?'<label>'+h(o.label)+(o.req?'<span class="req">*</span>':'')+'</label>':'')+
    '<div class="ob-choice'+(o.cols===3?' cols-3':'')+'" data-choice="'+o.k+'"'+(o.req?' data-req="1"':'')+'>'+o.options.map(function(op){
      return '<label class="'+(v===op.v?'on':'')+'"><input type="radio" name="'+o.k+'" value="'+op.v+'"'+(v===op.v?' checked':'')+'>'+(op.ic?'<div class="ic">'+op.ic+'</div>':'')+'<div class="body"><div class="t">'+h(op.t)+'</div><p>'+h(op.d)+'</p></div></label>';
    }).join('')+'</div>'+(o.hint?'<div class="hint">'+o.hint+'</div>':'')+'<div class="msg">Please choose one</div></div>';
}
function chips(o){
  var v=get(o.k);
  return '<div class="ob-field" data-field="'+o.k+'">'+(o.label?'<label>'+h(o.label)+(o.opt?'<span class="opt">Optional</span>':'')+'</label>':'')+
    '<div class="ob-chips" data-choice="'+o.k+'">'+o.options.map(function(op){
      return '<label class="'+(v===op[0]?'on':'')+'"><input type="radio" name="'+o.k+'" value="'+op[0]+'"'+(v===op[0]?' checked':'')+'>'+h(op[1])+'</label>';
    }).join('')+'</div>'+(o.hint?'<div class="hint">'+o.hint+'</div>':'')+'</div>';
}
function checkbox(o){
  var v=!!get(o.k);
  return '<div class="ob-field" data-field="'+o.k+'"><label class="ob-check-box'+(v?' on':'')+'"><input type="checkbox" data-k="'+o.k+'" data-bool="1"'+(o.req?' data-req="1"':'')+(v?' checked':'')+'><div><div class="t">'+o.t+'</div>'+(o.d?'<div class="d">'+o.d+'</div>':'')+'</div></label><div class="msg">'+h(o.msg||'Please confirm')+'</div></div>';
}
function actions(o){
  return '<div class="ob-actions">'+(o.back?'<button class="ob-btn ghost" type="button" data-go="'+o.back+'">← Back</button>':'<span></span>')+
    '<div class="r"><span class="ob-saved">Saved automatically</span>'+(o.skip?'<button class="ob-btn text" type="button" data-act="'+o.skip+'">Skip for now</button>':'')+
    '<button class="ob-btn '+(o.tone||'primary')+'" type="button" data-act="'+(o.act||'next')+'"'+(o.disabled?' disabled':'')+'>'+h(o.next||'Continue')+(o.noArrow?'':' →')+'</button></div></div>';
}
function badge(kind, text){
  var ic = kind==='verified'?I.shield : kind==='warn'?I.warn : kind==='pending'?I.clock : kind==='live'?I.sparkle : I.draft;
  return '<span class="ob-badge '+kind+'">'+ic+h(text)+'</span>';
}
function roleBadge(r){ return '<span class="ob-role '+r.toLowerCase()+'">'+h(r)+'</span>'; }
function note(html){ return '<div class="ob-note">'+I.info+'<div>'+html+'</div></div>'; }
function formErr(){ return '<div class="ob-form-err" id="form-err">A few required fields are still empty — they\'re marked below.</div>'; }

function validate(root){
  var ok=true, first=null;
  root.querySelectorAll('.ob-field.err').forEach(function(f){ f.classList.remove('err'); });
  function fail(el){ ok=false; var f=el.closest('.ob-field'); if(f){ f.classList.add('err'); if(!first) first=f; } }
  root.querySelectorAll('[data-k][data-req]').forEach(function(el){
    var v = el.type==='checkbox' ? el.checked : (el.value||'').trim();
    if(!v) fail(el);
  });
  root.querySelectorAll('.ob-upload.empty[data-req]').forEach(fail);
  root.querySelectorAll('[data-choice][data-req]').forEach(function(el){ if(!get(el.getAttribute('data-choice'))) fail(el); });
  var e=root.querySelector('#form-err'); if(e) e.classList.toggle('show', !ok);
  if(first) first.scrollIntoView({behavior:'smooth', block:'center'});
  return ok;
}

/* ---------- layout ---------- */
function shell(o){
  var idx=-1; o.steps.forEach(function(s,i){ if(s.id===o.cur) idx=i; });
  var pct=Math.round(((idx+1)/o.steps.length)*100);
  var rail='<aside class="ob-rail"><div class="ob-progress"><div class="t">'+h(o.steps[idx]?o.steps[idx].lbl:'')+'<span>Step '+(idx+1)+' of '+o.steps.length+'</span></div><div class="bar"><i style="width:'+pct+'%"></i></div></div><ol class="ob-steps">'+
    o.steps.map(function(s,i){
      var done=o.done[s.id] && i!==idx, cls=done?'done':(i===idx?'current':'');
      return '<li class="ob-step '+cls+'"'+(done?' data-go="'+s.id+'"':'')+'><span class="dot">'+(done?I.check:(i+1))+'</span><span><span class="lbl">'+h(s.lbl)+'</span>'+(s.sub?'<span class="sub">'+h(s.sub)+'</span>':'')+'</span></li>';
    }).join('')+'</ol>'+(o.note?'<div class="ob-rail-note">'+o.note+'</div>':'')+'</aside>';
  return '<div class="ob-wrap"><div class="ob-head"><span class="hp-kicker">'+h(o.kicker)+'</span><h1>'+h(o.h1)+'</h1><p>'+o.p+'</p></div><div class="ob-layout">'+rail+'<div>'+o.card+'</div></div></div>';
}
function center(o){
  return '<div class="ob-wrap"><div class="ob-center"><div class="ob-head">'+(o.kicker?'<span class="hp-kicker">'+h(o.kicker)+'</span>':'')+'<h1>'+h(o.h1)+'</h1>'+(o.p?'<p>'+o.p+'</p>':'')+'</div>'+o.body+'</div></div>';
}

/* ============================================================================
   SESSION 1 — interest + verification
   ============================================================================ */
function s1Steps(){
  if(S.update){
    return S.update.sections.map(function(id){ return {id:id, lbl:'Update: '+({docs:S.update.kind==='individual'?'identity':'registration', contact:'contact & authority', payout:'payout details'})[id], sub:''}; });
  }
  var st=[{id:'start', lbl:'About your cause', sub:'Under a minute'}];
  /* a logged-in user already picked org or individual at the entry screen */
  if(S.s1.mode==='visitor'){
    st.push({id:'account', lbl:'Your account', sub:'So you can resume any time'});
    st.push({id:'type', lbl:'Who is raising', sub:'Organisation or individual'});
  }
  st.push({id:'docs', lbl:S.s1.type==='individual'?'Verify your identity':'Documents', sub:'The one paperwork step'});
  st.push({id:'contact', lbl:'Contact & authority', sub:'Who we talk to'});
  st.push({id:'payout', lbl:'Payout details', sub:'Where donations go'});
  st.push({id:'review', lbl:'Review & submit', sub:'Reviewed in 1–2 business days'});
  return st;
}
function s1Head(){
  if(S.update){
    return {kicker:'Update details', h1:'Just the part that changed', p:'Only this section is re-reviewed — usually the same day. Everything else stays verified.'};
  }
  if(S.s1.mode==='addorg') return {kicker:'Add an organisation', h1:'Verify once, raise as often as you need', p:'Every project you run for this organisation starts from here. Documents are the only paperwork step.'};
  return {kicker:'Start a project', h1:'Raise funds for your initiative', p:'One sitting, about ten minutes. Documents are the only paperwork step — the rest is a conversation.'};
}
function s1Shell(cur, card, noteHtml){
  var head=s1Head();
  var defaultNote = S.update ? '' : '<b>Leave any time</b>Your progress is saved as you go. The link we email you brings you straight back here.';
  return shell({steps:s1Steps(), cur:cur, done:S.s1.done, kicker:head.kicker, h1:head.h1, p:head.p, card:card, note:noteHtml!=null?noteHtml:defaultNote});
}
function s1Advance(cur){
  var st=s1Steps(), i=-1; st.forEach(function(s,k){ if(s.id===cur) i=k; });
  S.s1.done[cur]=true; save();
  if(S.update){
    if(i+1<st.length){ go(st[i+1].id); return; }
    finishUpdate(); return;
  }
  go(st[i+1].id);
}
function s1Back(cur){
  var st=s1Steps(), i=-1; st.forEach(function(s,k){ if(s.id===cur) i=k; });
  if(S.update && i===0) return S.update.kind==='individual' ? 'individual' : 'org/'+S.update.id;
  return i>0 ? st[i-1].id : (S.s1.mode!=='visitor' ? 'entry' : '');
}
function finishUpdate(){
  var u=S.update; S.update=null;
  if(u.kind==='individual'){ S.account.individual.pending=u.sections; save(); toast('Sent for expedited review — usually same day'); go('individual'); }
  else {
    var o=findOrg(u.id); o.pending=u.sections; if(u.refresh){ o.refreshPending=true; }
    if(u.sections.indexOf('payout')>=0 && S.s1.payout.account) o.payoutMasked=(S.s1.payout.bank||'Bank')+' ••••'+S.s1.payout.account.slice(-4);
    if(u.sections.indexOf('contact')>=0 && S.s1.contact.name) o.contact=S.s1.contact.name;
    save(); toast('Sent for expedited review — usually same day'); go('org/'+u.id);
  }
}

/* Step 1 — quick intent */
function viewStart(){
  var card='<div class="ob-card"><h2>Tell us about your cause</h2><p class="lead">No account needed yet. Cause and country decide which documents we\'ll ask for later, so we only ask for what applies to you.</p>'+formErr()+'<div class="ob-form">'+
    field({k:'s1.intent.name', label:'Organisation or fundraiser name', req:1, placeholder:'The name donors will recognise'})+
    '<div class="ob-row">'+field({k:'s1.intent.cause', label:'Cause category', req:1, type:'select', options:CAUSES})+field({k:'s1.intent.country', label:'Country of operation', req:1, type:'select', options:COUNTRIES})+'</div>'+
    field({k:'s1.intent.purpose', label:'What are you raising funds for?', req:1, type:'textarea', rows:3, maxlen:300, placeholder:'One or two sentences is plenty.', hint:'Read by our review team only — nothing here is public yet.'})+
    '</div>'+actions({back:S.s1.mode!=='visitor'?'entry':'', next:'Continue'})+'</div>';
  return s1Shell('start', card);
}

/* Step 2 — account / magic link */
function viewAccount(){
  var a=S.s1.account, card;
  if(a.sent){
    card='<div class="ob-card"><h2>Check your inbox</h2><p class="lead">We sent a sign-in link to <b>'+h(a.email)+'</b>. It also works later — if you step away, the same link brings you back to where you left off.</p>'+
      '<div class="ob-inbox"><div class="ic">'+I.mail+'</div><div><b>Open the link to continue</b><p>Links expire after 24 hours. Didn\'t get it? Check spam, or <a href="#" data-act="resend">send it again</a>.</p><div class="acts"><button class="ob-btn primary" type="button" data-act="openLink">Open the link →</button><button class="ob-btn text" type="button" data-act="changeEmail">Use a different email</button></div></div></div>'+
      '</div>';
  } else {
    card='<div class="ob-card"><h2>Create your account</h2><p class="lead">We\'ll email you a secure link — no password to remember. This is also how you come back if you need to stop halfway.</p>'+formErr()+'<div class="ob-form">'+
      field({k:'s1.account.email', label:'Email address', req:1, type:'email', placeholder:'you@organisation.org', hint:'Becomes your login. If this email already has an account, we\'ll sign you in instead.'})+
      field({k:'s1.account.phone', label:'Phone number', opt:1, type:'tel', placeholder:'+65', hint:'For SMS reminders and verification.'})+
      '</div>'+actions({back:'start', next:'Send me the link', act:'sendLink', noArrow:1})+'</div>';
  }
  return s1Shell('account', card);
}

/* Step 3 — organisation type */
function viewType(){
  var card='<div class="ob-card"><h2>Who is raising the funds?</h2><p class="lead">This decides which documents we ask for next.</p>'+formErr()+
    choice({k:'s1.type', req:1, options:[
      {v:'charity', ic:I.building, t:'A registered charity or nonprofit', d:'You have a registration number and can show charitable status — for example an IRAS letter in Singapore.'},
      {v:'individual', ic:I.user, t:'An individual or informal group', d:'Raising for a personal cause, a community need or someone you care about.'}
    ]})+actions({back:s1Back('type'), next:'Continue'})+'</div>';
  return s1Shell('type', card);
}

/* Step 4A / 4B — documents */
function viewDocs(){
  var card, d=S.s1.docs;
  if(S.s1.type==='individual'){
    if(!d.fullName && S.account.individual) d.fullName=S.account.individual.name;
    card='<div class="ob-card"><h2>Verify your identity</h2><p class="lead">This is the only paperwork step. Everything you upload is seen by our review team only and never shown to donors.</p>'+formErr()+'<div class="ob-form">'+
      field({k:'s1.docs.fullName', label:'Full legal name', req:1, placeholder:'Exactly as on your ID'})+
      upload({k:'s1.docs.idFile', label:'Government-issued ID', req:1, hint:'Passport, NRIC or national ID. Front and back on one page is fine.'})+
      upload({k:'s1.docs.addressFile', label:'Proof of address', req:1, hint:'A utility bill or bank statement from the last three months.'})+
      upload({k:'s1.docs.letterFile', label:'Supporting letter', opt:1, hint:'From a beneficiary, hospital or community leader. Not required, but it helps with the trust badge later.'})+
      '</div>'+actions({back:s1Back('docs'), next:'Continue'})+'</div>';
  } else {
    if(!d.legalName && S.s1.intent.name) d.legalName=S.s1.intent.name;
    if(!d.regCountry && S.s1.intent.country) d.regCountry=S.s1.intent.country;
    if(S.update && !d.legalName){ var o=findOrg(S.update.id); d.legalName=o.name; d.regCountry=o.country; }
    card='<div class="ob-card"><h2>Your organisation\'s documents</h2><p class="lead">This is the only paperwork step. Everything you upload is seen by our review team only.</p>'+formErr()+'<div class="ob-form">'+
      field({k:'s1.docs.legalName', label:'Legal entity name', req:1, hint:'As it appears on your registration certificate.'})+
      '<div class="ob-row">'+field({k:'s1.docs.regNo', label:'Charity or registration number', req:1, placeholder:'UEN or charity registration number'})+field({k:'s1.docs.regCountry', label:'Country or state of registration', req:1, type:'select', options:COUNTRIES})+'</div>'+
      upload({k:'s1.docs.certFile', label:'Certificate of incorporation or registration', req:1})+
      upload({k:'s1.docs.taxFile', label:'Proof of charitable or tax-exempt status', req:1, hint:'For Singapore, the IRAS charity status letter.'})+
      upload({k:'s1.docs.finFile', label:'Latest audited financials or annual report', opt:1, hint:'Strongly encouraged — reviewers rely on it.', after:'<label class="ob-check" style="margin-top:10px"><input type="checkbox" data-k="s1.docs.finPending" data-bool="1"'+(d.finPending?' checked':'')+'> Not ready yet — mark as pending and send it later</label>'})+
      field({k:'s1.docs.website', label:'Website or social media', opt:1, type:'url', placeholder:'https://', hint:'A credibility signal for reviewers.'})+
      '</div>'+actions({back:s1Back('docs'), next:'Continue'})+'</div>';
  }
  return s1Shell('docs', card);
}
function matchOrg(){
  var d=S.s1.docs, reg=(d.regNo||'').toLowerCase().replace(/\s+/g,''), name=(d.legalName||'').toLowerCase();
  return DIRECTORY.filter(function(e){ return e.keys.some(function(k){ return (reg && reg===k.replace(/\s+/g,'')) || (name && name.indexOf(k)>=0 && k.length>4); }); })[0];
}
function orgMatchModal(e){
  var body;
  if(e.status==='verified'){
    body='<div class="ic">'+I.shield+'</div><h2>This organisation is already on Agathos</h2><div class="ob-matchcard"><div class="av">'+initials(e.name)+'</div><div><b>'+h(e.name)+'</b><span>'+badge('verified','Verified since '+fmtDate(e.since))+'</span></div></div>'+
      '<p class="lead">If you\'re part of the team, ask to be added — you won\'t need to verify again. We\'ll notify the primary contact ('+h(e.contact)+').</p>'+
      '<div class="acts"><button class="ob-btn ghost" type="button" data-act="matchDismiss">It\'s a different organisation</button><button class="ob-btn primary" type="button" data-act="requestAccess" data-org="'+e.id+'">Request access →</button></div>';
  } else {
    body='<div class="ic warn">'+I.clock+'</div><h2>An application for this organisation is already in progress</h2><div class="ob-matchcard"><div class="av">'+initials(e.name)+'</div><div><b>'+h(e.name)+'</b><span>Submitted by '+h(e.contact)+' on '+fmtDate(e.submitted)+' · '+badge('pending','Pending review')+'</span></div></div>'+
      '<p class="lead">We\'ll let them know you\'d like to join. They have 5 days to respond — if they don\'t, our team steps in and reviews your request directly.</p>'+
      '<div class="acts"><button class="ob-btn ghost" type="button" data-act="matchDismiss">It\'s a different organisation</button><button class="ob-btn primary" type="button" data-act="requestJoin" data-org="'+e.id+'">Request to join →</button></div>';
  }
  modal(body);
}

/* Step 5 — contact & authority */
function viewContact(){
  var c=S.s1.contact, ind=S.s1.type==='individual';
  if(!c.email && (S.s1.account.email||S.auth.email)) c.email=S.s1.account.email||S.auth.email;
  if(!c.name && ind && S.s1.docs.fullName) c.name=S.s1.docs.fullName;
  if(!c.name && S.auth.name) c.name=S.auth.name;
  if(!c.authority && ind && S.s1.docs.fullName) c.authority=S.s1.docs.fullName;
  var card='<div class="ob-card"><h2>Who should we talk to?</h2><p class="lead">Our review team will reach out here if anything needs clarifying. This can be a different email from your login.</p>'+formErr()+'<div class="ob-form">'+
    '<div class="ob-row">'+field({k:'s1.contact.name', label:'Primary contact name', req:1})+field({k:'s1.contact.role', label:'Role or title', req:!ind, opt:ind, placeholder:ind?'':'e.g. Executive Director'})+'</div>'+
    '<div class="ob-row">'+field({k:'s1.contact.email', label:'Contact email', req:1, type:'email'})+field({k:'s1.contact.phone', label:'Contact phone', req:1, type:'tel', placeholder:'+65'})+'</div>'+
    field({k:'s1.contact.authority', label:'Who can request withdrawals?', req:1, placeholder:'Name(s) of people authorised to request payouts', hint:'You can add them as team members later. Only these people can ask us to release funds.'})+
    '</div>'+actions({back:s1Back('contact'), next:'Continue'})+'</div>';
  return s1Shell('contact', card);
}

/* Step 6 — payout */
function viewPayout(){
  var p=S.s1.payout, ind=S.s1.type==='individual';
  var legal = ind ? S.s1.docs.fullName : S.s1.docs.legalName;
  if(S.update && !legal){ legal = S.update.kind==='individual' ? S.account.individual.name : findOrg(S.update.id).name; }
  if(!p.holder && legal) p.holder=legal;
  var mismatch = p.holder && legal && p.holder.trim().toLowerCase()!==legal.trim().toLowerCase();
  var acct = p.masked && p.account
    ? '<div class="ob-field" data-field="s1.payout.account"><label>Account number<span class="req">*</span></label><div class="ob-masked"><span>•••• •••• '+h(p.account.slice(-4))+'</span><button type="button" data-act="unmask">Edit</button></div></div>'
    : field({k:'s1.payout.account', label:'Account number', req:1, placeholder:'Account number or IBAN', hint:'Hidden after you leave the field.'});
  var card='<div class="ob-card"><h2>Where should donations go?</h2><p class="lead">Payouts are made to this account only. The account holder name has to match <b>'+h(legal||'the name on your documents')+'</b>.</p>'+formErr()+'<div class="ob-form">'+
    field({k:'s1.payout.holder', label:'Account holder name', req:1, after:'<div class="warn" id="holder-warn"'+(mismatch?'':' style="display:none"')+'>'+I.warn+'<span>Doesn\'t match "'+h(legal)+'". We can still review it, but payouts may be delayed until the names are reconciled.</span></div>'})+
    '<div class="ob-row">'+field({k:'s1.payout.bank', label:'Bank name', req:1})+acct+'</div>'+
    upload({k:'s1.payout.proofFile', label:'Proof of account', req:1, hint:'A voided cheque or bank letter showing the account name and number.'})+
    field({k:'s1.payout.schedule', label:'Payout schedule', opt:1, type:'select', options:[['monthly','Monthly'],['weekly','Weekly'],['ondemand','On request']], placeholder:'Monthly (default)', hint:'Change this any time from your dashboard.'})+
    '</div>'+actions({back:s1Back('payout'), next:S.update?'Send for review':'Continue'})+'</div>';
  return s1Shell('payout', card);
}

/* Step 7 — review & submit */
function viewReview(){
  var s=S.s1, ind=s.type==='individual';
  function row(dt, dd){ return '<dt>'+h(dt)+'</dt><dd>'+(dd||'<span class="none">—</span>')+'</dd>'; }
  function fileChip(f, pending){ if(f && !f.busy) return '<span class="file">'+I.check+h(f.name)+'</span>'; if(pending) return badge('pending','Marked as pending'); return ''; }
  function sec(title, stepId, rows){ return '<div class="sec"><h3>'+h(title)+'</h3><a class="edit" href="#/'+stepId+'">Edit</a><dl>'+rows.join('')+'</dl></div>'; }
  var secs=[
    sec('About your cause','start',[row('Name',h(s.intent.name)), row('Cause',h(causeLabel(s.intent.cause))), row('Country',h(s.intent.country)), row('Raising for',h(s.intent.purpose))]),
  ];
  if(!S.auth.loggedIn || s.account.email) secs.push(sec('Account','account',[row('Login email',h(s.account.email||S.auth.email)), row('Phone',h(s.account.phone))]));
  if(s.mode==='visitor') secs.push(sec('Who is raising','type',[row('Type', ind?'Individual or informal group':'Registered charity or nonprofit')]));
  if(ind){
    secs.push(sec('Identity','docs',[row('Full legal name',h(s.docs.fullName)), row('Government ID',fileChip(s.docs.idFile)), row('Proof of address',fileChip(s.docs.addressFile)), row('Supporting letter',fileChip(s.docs.letterFile))]));
  } else {
    secs.push(sec('Documents','docs',[row('Legal entity',h(s.docs.legalName)), row('Registration no.',h(s.docs.regNo)), row('Registered in',h(s.docs.regCountry)), row('Certificate',fileChip(s.docs.certFile)), row('Charitable status',fileChip(s.docs.taxFile)), row('Financials',fileChip(s.docs.finFile, s.docs.finPending)), row('Website',h(s.docs.website))]));
  }
  secs.push(sec('Contact & authority','contact',[row('Primary contact',h(s.contact.name)+(s.contact.role?' · '+h(s.contact.role):'')), row('Email',h(s.contact.email)), row('Phone',h(s.contact.phone)), row('Withdrawals',h(s.contact.authority))]));
  secs.push(sec('Payout','payout',[row('Account holder',h(s.payout.holder)), row('Bank',h(s.payout.bank)), row('Account',s.payout.account?'•••• '+h(s.payout.account.slice(-4)):''), row('Proof of account',fileChip(s.payout.proofFile)), row('Schedule',h({monthly:'Monthly',weekly:'Weekly',ondemand:'On request'}[s.payout.schedule]||'Monthly'))]));
  var card='<div class="ob-card"><h2>Review and submit</h2><p class="lead">Check everything once. You can still edit after submitting, right up until our team starts the review.</p>'+formErr()+'<div class="ob-review">'+secs.join('')+'</div>'+
    '<div class="ob-sec">'+note('<b>Reviewed within 1–2 business days.</b> We\'ll email '+h(s.contact.email||s.account.email||S.auth.email)+' as soon as there\'s news, and only ask for more if something is unclear.')+
    '<div style="margin-top:18px">'+checkbox({k:'s1.confirm', req:1, t:'The information above is accurate and I agree to the <a href="#">Terms of Use</a>.', msg:'Please confirm before submitting'})+'</div></div>'+
    actions({back:'payout', next:'Submit for review', act:'submit', noArrow:1})+'</div>';
  return s1Shell('review', card);
}

function viewSubmitted(){
  var email=S.s1.contact.email||S.s1.account.email||S.auth.email;
  var body='<div class="ob-card ob-result"><div class="ic">'+I.clock+'</div><h2>Submitted — we\'re on it</h2><p class="lead">A member of our team will verify your submission and get back to you within <b>1–2 business days</b> at '+h(email)+'.</p>'+
    '<div class="ob-next"><div><span class="n">1</span><b>We review</b><p>1–2 business days. We\'ll only write if something is unclear.</p></div><div><span class="n">2</span><b>You build</b><p>Once approved, tell the story, add photos and set a goal if you want one.</p></div><div><span class="n">3</span><b>You launch</b><p>Go live right away, schedule a date, or keep it as a draft.</p></div></div>'+
    '<div class="acts"><a class="ob-btn ghost" href="#/dashboard">Go to my dashboard</a><button class="ob-btn gold" type="button" data-act="demoApprove">Demo: approve now →</button></div></div>';
  return center({kicker:'Start a project', h1:'Thank you, '+h(firstName(S.s1.contact.name||S.auth.name||'friend')), p:'', body:body});
}

/* ============================================================================
   LOGGED-IN ENTRY, RETURNING USERS
   ============================================================================ */
function expiryBanner(){
  var out='';
  S.account.orgs.forEach(function(o){
    var d=daysUntil(o.expiresOn);
    if(d>0 && d<=30 && !o.refreshPending && (o.role==='Owner'||o.role==='Admin')) out+='<div class="ob-banner"><div class="ic">'+I.clock+'</div><div><b>'+h(o.name)+'\'s verification needs a quick refresh by '+fmtDate(o.expiresOn)+'</b><p>Registration and charitable status are re-checked yearly. It takes a couple of minutes — want to do it now while you\'re here?</p><div class="acts"><button class="ob-btn primary sm" type="button" data-act="refresh" data-org="'+o.id+'">Refresh now →</button><button class="ob-btn text sm" type="button" data-go="entry">Later</button></div></div></div>';
  });
  var ind=S.account.individual;
  if(ind && daysUntil(ind.idExpires)<=30 && !ind.pending) out+='<div class="ob-banner"><div class="ic">'+I.clock+'</div><div><b>Your ID on file expires in '+daysUntil(ind.idExpires)+' days</b><p>Upload the renewed ID when you have it so payouts aren\'t interrupted.</p><div class="acts"><button class="ob-btn primary sm" type="button" data-act="indUpdate" data-sections="docs">Update ID →</button></div></div></div>';
  return out;
}
function orgRow(o){
  return '<button class="ob-org" type="button" data-go="org/'+o.id+'"><span class="av">'+initials(o.name)+'</span><span class="t"><b>'+h(o.name)+' '+roleBadge(o.role)+'</b><span>Verified since '+fmtDate(o.verifiedSince)+' · Last active '+fmtDate(o.lastActive)+'</span></span><span class="chev">'+I.chev+'</span></button>';
}
function addRows(){
  var ind=S.account.individual;
  return '<button class="ob-org add" type="button" data-act="addOrg"><span class="av">'+I.plus+'</span><span class="t"><b>Add an organisation</b><span>Verify a charity or nonprofit you\'re part of</span></span><span class="chev">'+I.chev+'</span></button>'+
    '<button class="ob-org add" type="button" data-go="individual"><span class="av">'+I.user+'</span><span class="t"><b>'+(ind?'Continue as '+h(ind.name):'Start an individual project')+'</b><span>'+(ind?'Verified since '+fmtDate(ind.verifiedSince)+' — no re-verification needed':'Raise for a personal cause or an informal group')+'</span></span><span class="chev">'+I.chev+'</span></button>';
}
function projectRows(orgId){
  var list=S.account.projects.filter(function(c){ return !orgId || c.org===orgId; });
  if(!list.length) return '<div class="ob-empty"><b>No projects yet</b>Your first one starts with the button above.</div>';
  return list.map(projectCard).join('');
}
function projectCard(c){
  var st, acts='';
  if(c.status==='live'){ st=badge('live','Live'); acts='<a class="ob-btn ghost sm" href="#">View page</a><a class="ob-btn ghost sm" href="#">Post an update</a>'; }
  else if(c.status==='ended'){ st=badge('draft','Ended'); acts='<a class="ob-btn ghost sm" href="#">View report</a>'; }
  else if(c.status==='scheduled'){ st=badge('pending','Approved · scheduled for '+fmtDateTime(c.scheduledFor)); acts='<button class="ob-btn primary sm" type="button" data-act="publishNow" data-id="'+c.id+'">Publish now</button><button class="ob-btn ghost sm" type="button" data-go="build/launch">Change date</button>'; }
  else { st=badge('draft','Approved · draft, not published'); acts='<button class="ob-btn primary sm" type="button" data-act="publishNow" data-id="'+c.id+'">Publish now</button><button class="ob-btn ghost sm" type="button" data-go="build/basics">Keep editing</button>'; }
  var meta = c.status==='live'||c.status==='ended' ? money(c.raised)+' raised'+(c.goal?' of '+money(c.goal):'')+' · started '+fmtDate(c.started) : 'Approved '+fmtDate(c.approvedOn||addDays(0));
  return '<div class="ob-proj"><div class="cover"></div><div class="t">'+st+'<b>'+h(c.name)+'</b><p>'+h(meta)+'</p>'+remindHtml(c)+'<div class="acts">'+acts+'</div></div></div>';
}
function remindHtml(c){
  if(c.status!=='scheduled' && c.status!=='draft') return '';
  var since=Math.max(0,-daysUntil(c.approvedOn||addDays(0)));
  return '<div class="ob-remind">Reminders until it\'s published:'+[3,7,14].map(function(d){ var next=[3,7,14].filter(function(x){ return x>since; })[0]; return '<i class="'+(d===next?'next':'')+'">day '+d+(d===next?' · '+fmtDate(addDays(d-since)):'')+'</i>'; }).join('')+'</div>';
}

function viewEntry(){
  var orgs=S.account.orgs, ind=S.account.individual, body='';
  var name=firstName(S.auth.name);
  if(orgs.length===0){
    body='<div class="ob-card"><h2>'+(ind?'Pick up where you left off':'What are you raising for?')+'</h2><p class="lead">'+(ind?'You\'re verified as an individual. Add an organisation if you\'re raising on behalf of one.':'Verify once for an organisation, or start as an individual. Either way, you only do this once.')+'</p><div class="ob-orglist">'+addRows()+'</div></div>';
    return center({kicker:'Start a project', h1:'Welcome back, '+h(name), p:'', body:expiryBanner()+body});
  }
  /* handoff 1c: with one org the context bar is not a screen — it sits on top of the org screen */
  if(orgs.length===1){ history.replaceState(null, '', '#/org/'+orgs[0].id); render(); return ''; }
  body='<div class="ob-card"><h2>Which organisation is this for?</h2><p class="lead">You\'re on the team of more than one. Pick the one this project belongs to.</p><div class="ob-orglist">'+orgs.map(orgRow).join('')+addRows()+'</div></div>';
  return center({kicker:'Start a project', h1:'Welcome back, '+h(name), p:'', body:expiryBanner()+body});
}

function orgContext(o){
  if(S.account.orgs.length>1) return '<a class="ob-btn text" href="#/entry" style="margin:-16px 0 8px -4px">← All organisations</a>';
  var ind=S.account.individual;
  return '<div class="ob-ctx"><span>Raising for <b>'+h(o.name)+'</b></span><a href="#/individual">'+(ind?'Continue as '+h(ind.name)+' instead':'Start an individual project instead')+' →</a></div>';
}
function viewOrg(id){
  var o=findOrg(id); if(!o){ go('entry'); return ''; }
  S.selectedOrg=id; save();
  var body='', kicker='Start a project', back=S.account.orgs.length>1?'#/entry':'#/dashboard';
  if(o.role==='Owner'||o.role==='Admin'){
    var d=daysUntil(o.expiresOn), warnB = d>0 && d<=30 && !o.refreshPending;
    var pend = o.pending && o.pending.length ? '<div class="ob-banner info" style="margin-top:22px"><div class="ic">'+I.clock+'</div><div><b>'+h(o.pending.map(function(s){ return {docs:'Registration details', contact:'Contact & authority', payout:'Payout details'}[s]; }).join(', '))+' under expedited review</b><p>Usually same day. You can build and launch meanwhile'+(o.pending.indexOf('payout')>=0?' — payouts pause until the bank details are re-verified.':'.')+'</p></div></div>' : '';
    var refreshed = o.refreshPending ? '<div class="ob-banner ok" style="margin-top:22px"><div class="ic">'+I.check+'</div><div><b>Refresh submitted</b><p>We\'ll confirm within a business day. Nothing else changes for you.</p></div></div>' : '';
    var confirmed=!!S.confirmed[id];
    body='<div class="ob-card"><div class="ob-recog"><div class="av">'+initials(o.name)+'</div><div class="t">'+(warnB?badge('warn','Verification refresh due in '+d+' days'):badge('verified','Verified since '+fmtDate(o.verifiedSince)))+'<h2>'+h(o.name)+'</h2><p>Registered charity · '+h(o.country)+' · You\'re '+(o.role==='Owner'?'the owner':'an admin')+'</p></div></div>'+
      '<div class="ob-facts"><div><span>Registration</span>'+h(o.regMasked)+'</div><div><span>Primary contact</span>'+h(o.contact)+'</div><div><span>Payout account</span>'+h(o.payoutMasked)+'</div><div><span>Valid until</span>'+fmtDate(o.expiresOn)+'</div></div>'+pend+refreshed+
      '<div class="ob-confirm">'+checkbox({k:'confirmed.'+id, t:'These details are still accurate', d:'Takes a second, and it\'s what keeps donors trusting the platform. If something changed, update it below — only that part gets re-checked.'})+'</div>'+
      '<div class="ob-actions"><button class="ob-btn text" type="button" data-go="org/'+id+'/changes">Something changed? Update details</button><div class="r"><button class="ob-btn primary" type="button" data-act="startOrgProject"'+(confirmed?'':' disabled')+'>Start a new project →</button></div></div></div>'+
      '<div class="ob-card"><div class="ob-sec-head"><h3>Projects by '+h(o.name)+'</h3></div>'+projectRows(id)+'</div>';
    var phases='<ol class="ob-phases">'+['Confirm details','Build','Launch'].map(function(t,i){ return '<li'+(i===0?' class="current"':'')+'><span class="n">'+(i+1)+'</span>'+t+'</li>'; }).join('')+'</ol>';
    return center({kicker:kicker, h1:'Ready when you are', p:'', body:orgContext(o)+expiryBanner()+phases+body});
  }
  if(o.role==='Collaborator'){
    body='<div class="ob-card"><div class="ob-recog"><div class="av">'+initials(o.name)+'</div><div class="t">'+badge('verified','Verified since '+fmtDate(o.verifiedSince))+'<h2>'+h(o.name)+'</h2><p>Registered charity · '+h(o.country)+' · You\'re a collaborator</p></div></div>'+
      '<div style="margin-top:22px">'+note('<b>You can build and launch projects.</b> Verification, payouts and team access are handled by the owner, '+h(o.contact)+'.')+'</div>'+
      '<div class="ob-actions"><span></span><div class="r"><button class="ob-btn primary" type="button" data-act="startOrgProject">Start a new project →</button></div></div></div>';
    return center({kicker:kicker, h1:'Ready when you are', p:'', body:orgContext(o)+body});
  }
  var req=S.requests[id];
  if(req){
    body='<div class="ob-card ob-result"><div class="ic gold">'+I.clock+'</div><h2>Request sent</h2><p class="lead">We\'ve asked '+h(o.contact)+' to give you access to <b>'+h(o.name)+'</b>. You\'ll get an email the moment it\'s approved, and you\'ll land right back here.</p>'+badge('pending','Sent '+fmtDate(req.sent)+' · waiting on '+h(o.contact))+
      '<div class="acts"><a class="ob-btn ghost" href="'+back+'">Back</a><button class="ob-btn gold" type="button" data-act="demoGrant" data-org="'+id+'">Demo: approve →</button></div></div>';
  } else {
    body='<div class="ob-card"><div class="ob-recog"><div class="av">'+initials(o.name)+'</div><div class="t">'+badge('verified','Verified since '+fmtDate(o.verifiedSince))+'<h2>'+h(o.name)+'</h2><p>Registered charity · '+h(o.country)+' · You\'re a member</p></div></div>'+
      '<div style="margin-top:22px">'+note('<b>You don\'t have permission to create projects for '+h(o.name)+' yet.</b> Ask an owner or admin. We\'ll notify '+h(o.contact)+' and let you know when it\'s approved — no re-verification needed.')+'</div>'+
      '<div class="ob-actions"><a class="ob-btn ghost" href="'+back+'">Back</a><div class="r"><button class="ob-btn primary" type="button" data-act="requestPerm" data-org="'+id+'">Request access →</button></div></div></div>';
  }
  return center({kicker:kicker, h1:'Almost there', p:'', body:(S.account.orgs.length>1?'':orgContext(o))+body});
}

function viewChanges(id){
  var o=findOrg(id); if(!o){ go('entry'); return ''; }
  var body='<div class="ob-card"><h2>What\'s changed?</h2><p class="lead">Tick what\'s different. Only those sections reopen, and only they get re-reviewed — usually the same day.</p>'+formErr()+'<div class="ob-checklist">'+
    checkbox({k:'chg.docs', t:'Legal name or registration status', d:'New certificate, renewed charitable status, or a changed legal name.'})+
    checkbox({k:'chg.payout', t:'Bank or payout details', d:'A new account, or a different account holder.'})+
    checkbox({k:'chg.contact', t:'Authorised contact or signatories', d:'Who we talk to, or who can request withdrawals.'})+
    '</div><div class="ob-actions"><button class="ob-btn ghost" type="button" data-go="org/'+id+'">← Back</button><div class="r"><button class="ob-btn primary" type="button" data-act="startUpdate" data-org="'+id+'">Update these →</button></div></div></div>';
  return center({kicker:'Update details', h1:h(o.name), p:'', body:body});
}

function viewIndividual(){
  var ind=S.account.individual;
  if(!ind){
    if(S.auth.loggedIn && S.s1.mode!=='addind') S.s1={mode:'addind', intent:{}, account:{}, type:'individual', docs:{}, contact:{}, payout:{}, done:{}, status:'draft'};
    else S.s1.type='individual';
    save(); go('start'); return '';
  }
  var d=daysUntil(ind.idExpires), warnB=d<=30 && !ind.pending;
  var pend = ind.pending ? '<div class="ob-banner info" style="margin-top:22px"><div class="ic">'+I.clock+'</div><div><b>Identity update under expedited review</b><p>Usually same day. You can build and launch meanwhile.</p></div></div>' : '';
  var confirmed=!!S.confirmed.individual;
  var body='<div class="ob-card"><div class="ob-recog"><div class="av">'+initials(ind.name)+'</div><div class="t">'+(warnB?badge('warn','ID expires in '+d+' days'):badge('verified','Verified since '+fmtDate(ind.verifiedSince)))+'<h2>'+h(ind.name)+'</h2><p>Individual fundraiser · Singapore</p></div></div>'+
    '<div class="ob-facts"><div><span>Government ID</span>'+h(ind.idMasked)+'</div><div><span>ID valid until</span>'+fmtDate(ind.idExpires)+'</div><div><span>Address on file</span>'+h(ind.address)+'</div><div><span>Payout account</span>DBS ••••9031</div></div>'+pend+
    '<div class="ob-confirm">'+checkbox({k:'confirmed.individual', t:'These details are still accurate', d:'If your ID, address or legal name changed, update it below — only that part gets re-checked.'})+'</div>'+
    '<div class="ob-actions"><button class="ob-btn text" type="button" data-go="individual/changes">Something changed? Update details</button><div class="r"><button class="ob-btn primary" type="button" data-act="startProject"'+(confirmed?'':' disabled')+'>Start a new project →</button></div></div></div>';
  return center({kicker:'Start a project', h1:'Welcome back, '+h(firstName(ind.name)), p:'', body:(S.account.orgs.length?'<a class="ob-btn text" href="#/entry" style="margin:-16px 0 8px -4px">← Back</a>':'')+expiryBanner()+body});
}
function viewIndividualChanges(){
  if(!S.account.individual){ go('individual'); return ''; }
  var body='<div class="ob-card"><h2>What\'s changed?</h2><p class="lead">Tick what\'s different. Only that reopens, and only that gets re-reviewed.</p>'+formErr()+'<div class="ob-checklist">'+
    checkbox({k:'chg.id', t:'Government ID', d:'Renewed or replaced.'})+
    checkbox({k:'chg.address', t:'Address', d:'You\'ve moved.'})+
    checkbox({k:'chg.name', t:'Legal name', d:'Changed on your ID.'})+
    '</div><div class="ob-actions"><button class="ob-btn ghost" type="button" data-go="individual">← Back</button><div class="r"><button class="ob-btn primary" type="button" data-act="indUpdate" data-sections="docs">Update these →</button></div></div></div>';
  return center({kicker:'Update details', h1:h(S.account.individual.name), p:'', body:body});
}

function viewAccess(){
  var r=S.requests.access; if(!r){ go('entry'); return ''; }
  var e=DIRECTORY.filter(function(x){ return x.id===r.org; })[0];
  var join=r.kind==='join';
  var body='<div class="ob-card ob-result"><div class="ic gold">'+I.clock+'</div><h2>'+(join?'Request to join sent':'Request sent')+'</h2><p class="lead">'+(join
    ? 'We\'ve told '+h(e.contact)+' you\'d like to join the <b>'+h(e.name)+'</b> application. They have <b>5 days</b> to respond — if we don\'t hear back, our team reviews your request directly.'
    : 'We\'ve notified the primary contact at <b>'+h(e.name)+'</b>. Once they approve, you\'re added to the team and can start projects right away — no re-verification.')+'</p>'+
    badge('pending','Sent '+fmtDate(r.sent)+(join?' · response due '+fmtDate(addDays(5)):''))+
    '<div class="acts"><a class="ob-btn ghost" href="#/dashboard">Go to my dashboard</a><button class="ob-btn gold" type="button" data-act="demoJoin">Demo: approve →</button></div>'+
    (join?'<p style="margin-top:22px;font-size:13.5px;color:var(--hp-muted)">Not the right organisation after all? <a href="#" data-act="matchDismissGo">Start a separate application</a>.</p>':'')+
    '</div>';
  return center({kicker:'Start a project', h1:'Almost there', p:'', body:body});
}

/* ============================================================================
   SESSION 2 — project build & launch
   ============================================================================ */
var S2_STEPS=[
  {id:'build/basics', lbl:'Project basics', sub:'Name, story, photos'},
  {id:'build/goal', lbl:'Goal & needs', sub:'All optional'},
  {id:'build/team', lbl:'Team', sub:'Optional'},
  {id:'build/launch', lbl:'Launch', sub:'Now, later, or draft'}
];
function s2Shell(cur, card){
  var o=currentOrg(), ind=S.account.individual;
  var who = o ? o.name : (ind ? ind.name : S.auth.name);
  var noteHtml='<b>Building for '+h(who)+'</b>'+badge('verified','Verified')+'<div style="margin-top:8px">Saved as you go. Come back any time from your dashboard.</div>';
  return shell({steps:S2_STEPS, cur:cur, done:S.s2.done, kicker:'Build your project', h1:'Now the good part', p:'Verification\'s done. Tell the story, set a goal if you want one, and choose when to go live.', card:card, note:noteHtml});
}
function s2Advance(cur){
  var i=-1; S2_STEPS.forEach(function(s,k){ if(s.id===cur) i=k; });
  S.s2.done[cur]=true; save(); go(S2_STEPS[i+1].id);
}

function viewBasics(){
  var b=S.s2.basics, imgs=b.images||[];
  var hasPast=S.account.projects.some(function(c){ return c.status==='live'||c.status==='ended'; });
  var gallery='<div class="ob-field" data-field="s2.basics.images"><label>Cover image and gallery<span class="req">*</span></label><div class="ob-upload-grid">'+
    imgs.map(function(im,i){ return '<div class="thumb">'+(i===0?'<span class="tag">Cover</span>':'')+'<span>'+h(im.name)+'</span><button type="button" data-act="rmImg" data-i="'+i+'" aria-label="Remove">×</button></div>'; }).join('')+
    '<div class="ob-upload empty" data-up="s2.basics.images"'+(imgs.length?'':' data-req="1"')+'><div class="ic">'+I.upload+'</div><div><div class="t">'+(imgs.length?'Add more':'Add photos')+'</div></div><input type="file" accept="image/*" multiple data-upimg="1"></div>'+
    '</div><div class="hint">The first photo is the cover. Real photos of the people and place build more trust than stock.</div><div class="msg">Add at least one photo</div></div>';
  var card='<div class="ob-card"><h2>Project basics</h2><p class="lead">What donors see first. Keep the name short and the story honest — you can add updates as things happen.</p>'+formErr()+'<div class="ob-form">'+
    field({k:'s2.basics.name', label:'Project name', req:1, maxlen:80, placeholder:'What you\'re raising for, in a few words'})+
    field({k:'s2.basics.story', label:'Project story', req:1, type:'textarea', toolbar:1, rows:8, maxlen:3000, placeholder:'Who is this for? What will change? Why now?'})+
    gallery+
    choice({k:'s2.basics.type', label:'Project type', req:1, cols:3, options:PROJECT_TYPES})+
    (b.type==='event'?'<div class="ob-reveal">'+field({k:'s2.basics.eventDate', label:'Event date', req:1, type:'date', hint:'Sets the project\'s end date. You can change it in the next step.'})+'</div>':'')+
    (hasPast?field({k:'s2.basics.relation', label:'Relationship to your past projects', opt:1, type:'select', options:[['new','A new initiative'],['cont','Continuation of a past project'],['same','Same cause, new drive']], hint:'Helps us pre-fill photos and story from a past project, and keeps your reports tidy.'}):'')+
    '</div>'+actions({back:currentOrg()?'org/'+currentOrg().id:'individual', next:'Continue'})+'</div>';
  return s2Shell('build/basics', card);
}

function viewGoal(){
  var g=S.s2.goal, ev=S.s2.basics.type==='event';
  if(ev && !g.endDate && S.s2.basics.eventDate) g.endDate=S.s2.basics.eventDate;
  var vols=g.volunteers||[], items=g.items||[];
  var volRows=vols.map(function(v,i){ return '<div class="row"><input class="ob-input" placeholder="Position, e.g. Project manager" value="'+h(v.title)+'" data-list="volunteers" data-i="'+i+'" data-f="title"><input class="ob-input" type="number" min="1" placeholder="How many" value="'+h(v.count)+'" data-list="volunteers" data-i="'+i+'" data-f="count"><button type="button" data-act="rmRow" data-list="volunteers" data-i="'+i+'">Remove</button></div>'; }).join('');
  var itemRows=items.map(function(v,i){ return '<div class="row items"><input class="ob-input" placeholder="Item, e.g. 40 plastic chairs" value="'+h(v.title)+'" data-list="items" data-i="'+i+'" data-f="title"><input class="ob-input" type="number" min="1" placeholder="Qty" value="'+h(v.count)+'" data-list="items" data-i="'+i+'" data-f="count"><button type="button" data-act="rmRow" data-list="items" data-i="'+i+'">Remove</button></div>'; }).join('');
  var card='<div class="ob-card"><h2>Goal & needs</h2><p class="lead">All optional. A goal helps donors see progress, but an open project is fine too — you can add or change any of this after launch.</p>'+formErr()+'<div class="ob-form">'+
    chips({k:'s2.goal.range', label:'Fundraising goal', opt:1, options:GOALS, hint:'"Not sure yet" keeps the project open and ongoing.'})+
    (g.range==='exact'?'<div class="ob-reveal"><div class="ob-row">'+field({k:'s2.goal.currency', label:'Currency', type:'select', options:[['SGD','S$ SGD'],['USD','US$ USD'],['MYR','RM MYR']], placeholder:'S$ SGD'})+field({k:'s2.goal.amount', label:'Goal amount', req:1, type:'number', placeholder:'0'})+'</div></div>':'')+
    field({k:'s2.goal.milestone', label:'What a milestone covers', opt:1, placeholder:'e.g. S$5,000 keeps the shelter open for three months', hint:'An alternative to a hard target — donors love knowing what their gift does.'})+
    (ev?field({k:'s2.goal.endDate', label:'End date', req:1, type:'date', hint:'Tied to your event. Donations close at the end of this day.'}):'')+
    '</div>'+
    '<div class="ob-sec"><div class="ob-sec-head"><h3>More than money?</h3><p>Ask for hands and things, not just funds.</p></div>'+
    '<div class="ob-fold'+(vols.length?' open':'')+'" id="fold-vol"><button type="button" data-act="fold" data-fold="fold-vol"><span class="ic">'+I.users+'</span><span class="t"><b>Volunteers</b><span>'+(vols.length?vols.length+' position'+(vols.length>1?'s':''):'Positions people can sign up for')+'</span></span><span class="chev"></span></button><div class="body"><div class="ob-list">'+volRows+'</div><button class="ob-add" type="button" data-act="addRow" data-list="volunteers">'+I.plus+' Add a position</button></div></div>'+
    '<div class="ob-fold'+(items.length?' open':'')+'" id="fold-items"><button type="button" data-act="fold" data-fold="fold-items"><span class="ic">'+I.box+'</span><span class="t"><b>Items</b><span>'+(items.length?items.length+' item'+(items.length>1?'s':''):'Supplies or materials the project needs')+'</span></span><span class="chev"></span></button><div class="body"><div class="ob-list">'+itemRows+'</div><button class="ob-add" type="button" data-act="addRow" data-list="items">'+I.plus+' Add an item</button></div></div>'+
    '</div>'+
    '<div class="ob-sec"><div class="ob-sec-head"><h3>Giving options</h3></div>'+
    checkbox({k:'s2.goal.recurring', t:'Let donors give monthly', d:'Donors can set up a recurring gift by card. Good for ongoing work; you can switch it off later.'})+
    '<div style="margin-top:14px">'+note('<b>Agathos love gift.</b> We don\'t charge a platform fee. Donors are invited to add a love gift on top of their donation, and project owners typically set aside 10% of funds raised. To arrange a different share, write to <a href="mailto:rachel@agathos.be">rachel@agathos.be</a>.')+'</div></div>'+
    actions({back:'build/basics', next:'Continue', skip:'skipGoal'})+'</div>';
  return s2Shell('build/goal', card);
}

function viewTeam(){
  var t=S.s2.team;
  var rows=t.length?'<div class="ob-team">'+t.map(function(m,i){ return '<div class="row"><span class="av">'+initials(m.email.split('@')[0].replace(/[._-]/g,' '))+'</span><span class="t">'+h(m.email)+'<span class="st">Invite sent</span></span>'+roleBadge(({editor:'Editor',viewer:'Viewer',withdraw:'Withdrawal'})[m.role])+'<button type="button" data-act="rmMember" data-i="'+i+'">Remove</button></div>'; }).join('')+'</div>':'<div class="ob-empty" style="margin-top:16px"><b>Just you for now</b>Invite people any time, before or after launch.</div>';
  var unsent='<div class="ob-banner info ob-unsent" id="inv-unsent" hidden><div class="ic">'+I.mail+'</div><div><b>This invite hasn\'t been sent</b><p id="inv-unsent-email"></p><div class="acts"><button class="ob-btn primary sm" type="button" data-act="inviteAndNext">Invite and continue</button><button class="ob-btn text sm" type="button" data-act="nextNoInvite">Continue without inviting</button></div></div></div>';
  var card='<div class="ob-card"><h2>Who else is on this?</h2><p class="lead">Optional. Editors can update the page, viewers can see the numbers, and withdrawal-authorised members can request payouts.</p>'+
    '<div class="ob-field"><label>Invite by email</label><div class="ob-inline"><input class="ob-input" type="email" id="inv-email" placeholder="name@organisation.org"><select class="ob-input" id="inv-role" style="max-width:220px">'+ROLES.map(function(r){ return '<option value="'+r[0]+'">'+r[1]+'</option>'; }).join('')+'</select><button class="ob-btn ghost" type="button" data-act="addMember">Invite</button></div><div class="hint">Withdrawal-authorised members should match who you named under Contact & authority.</div></div>'+rows+unsent+
    actions({back:'build/goal', next:'Continue', skip:'skipTeam'})+'</div>';
  return s2Shell('build/team', card);
}

function viewLaunch(){
  var l=S.s2.launch;
  var labels={now:'Publish project', schedule:'Schedule project', draft:'Save as draft'};
  var card='<div class="ob-card"><h2>When should it go live?</h2><p class="lead">Your project is approved, so this is entirely your call. Nothing is public until you say so.</p>'+formErr()+
    choice({k:'s2.launch.mode', req:1, cols:3, options:[
      {v:'now', ic:I.rocket, t:'Go live now', d:'Published the moment you confirm. Share the link straight away.'},
      {v:'schedule', ic:I.calendar, t:'Schedule a date', d:'Pick the day and time. We\'ll remind you 24 hours before.'},
      {v:'draft', ic:I.draft, t:'Save as draft', d:'Keep it ready. We\'ll nudge you on days 3, 7 and 14 so it doesn\'t sit unpublished.'}
    ]})+
    (l.mode==='schedule'?'<div class="ob-reveal">'+field({k:'s2.launch.at', label:'Go live on', req:1, type:'datetime-local', hint:'Singapore time. Change it any time before then from your dashboard.'})+'</div>':'')+
    '<div class="ob-sec">'+checkbox({k:'s2.launch.tos', req:1, t:'I\'ve read and agree to the <a href="#">Terms of Use</a>.', d:'By publishing, you agree to keep donors updated and to use funds as described.', msg:'Please agree to the Terms of Use'})+'</div>'+
    actions({back:'build/team', next:labels[l.mode]||'Confirm', act:'launch', noArrow:1, tone:l.mode==='now'?'gold':'primary'})+'</div>';
  return s2Shell('build/launch', card);
}

function viewDone(){
  var c=S.account.projects[0]||{name:S.s2.basics.name};
  var slug=(c.name||'project').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);
  var body='<div class="ob-card ob-result"><div class="ic ok">'+I.sparkle+'</div><h2>Your project is live</h2><p class="lead">Share it with the people who care most first — the first few gifts set the pace for everyone after.</p>'+
    '<div class="ob-link-box"><span>agathos.be/p/'+h(slug)+'</span><button class="ob-btn ghost sm" type="button" data-act="copyLink">Copy link</button></div>'+
    '<div class="acts"><a class="ob-btn primary" href="#">View project page</a><a class="ob-btn ghost" href="#/dashboard">Go to my dashboard</a></div></div>'+
    '<div class="ob-card"><div class="ob-recog"><div class="av" style="background:var(--hp-gold);color:var(--hp-navy)">'+I.star+'</div><div class="t"><h2 style="margin-top:0">Apply for the Agathos Trustmark</h2><p>A badge of trust for donors. Project owners with a good track record can earn it — it lifts donor confidence, visibility on the platform, and signals transparency.</p></div></div>'+
    '<div class="ob-actions"><span></span><div class="r"><a class="ob-btn text" href="#/dashboard">Not now</a><a class="ob-btn gold" href="#">Apply for Trustmark →</a></div></div></div>';
  return center({kicker:'Launched', h1:'🎉 It\'s out there', p:'', body:body});
}

/* ============================================================================
   DASHBOARD — rebuilt after the "Manage Pages" tab of the live account area:
   Personal and each organisation on the left, the selected one's projects on the right
   ============================================================================ */
var DASH_TABS=[['My Dashboard','Overview of your impact'],['Contributions','Track your donations & support'],['Tickets','View purchased tickets'],['Transactions Log','A detailed view of your donations & ticket purchases'],['Manage Pages','For Project, Event & Organization Owners']];
function fmtDMY(iso){ var d=new Date(iso); return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear(); }
function dashEntities(){
  var list=[{id:'personal', label:'Personal', name:S.auth.name||S.auth.email}];
  S.account.orgs.forEach(function(o){ list.push({id:o.id, label:'Organization', name:o.name, org:o}); });
  if(S.s1.status==='submitted'){
    if(S.s1.type==='individual') list[0].pill=true;
    else list.push({id:'pending', label:'Organization', name:S.s1.docs.legalName||S.s1.intent.name||'Your organisation', pill:true});
  }
  return list;
}
function dashCard(c){
  var st={live:['Ongoing','on'], ended:['Completed','done'], scheduled:['Scheduled','wait'], draft:['Draft','wait']}[c.status];
  var left, box;
  if(c.status==='live'||c.status==='ended'){
    var pct=c.goal?parseFloat((c.raised/c.goal*100).toFixed(2)):0, priv=c.visibility==='private';
    left='<a class="dc-manage" href="#">'+I.draft+'Manage Project</a>';
    box='<div class="r1"><span>Started: '+fmtDMY(c.started)+'</span><span class="dc-vis'+(priv?' priv':'')+'">'+(priv?'Private':'Public')+'</span></div>'+
      '<div class="r2"><b>'+(c.raised?money(c.raised):'0')+'</b>'+(c.contributions?'<span>'+c.contributions+' contributions</span>':'')+'</div>'+
      (c.goal?'<div class="bar"><i style="width:'+Math.min(100,pct)+'%"></i></div><div class="r3">'+pct+'% of '+money(c.goal)+'</div>':'');
  } else {
    left='<a class="dc-manage" href="#/'+(c.status==='scheduled'?'build/launch':'build/basics')+'">'+I.draft+'Manage Project</a><button class="ob-btn primary sm" type="button" data-act="publishNow" data-id="'+c.id+'">Publish now</button>';
    box='<div class="r1"><span>Approved: '+fmtDMY(c.approvedOn||addDays(0))+'</span><span class="dc-vis off">Not published</span></div>'+
      '<div class="r2"><b class="sm">'+(c.status==='scheduled'?'Goes live '+fmtDateTime(c.scheduledFor):'Saved as a draft')+'</b></div>'+remindHtml(c);
  }
  return '<div class="dc"><div class="dc-img"><span class="dc-st '+st[1]+'">'+st[0]+'</span></div><div class="dc-main"><h3>'+h(c.name)+'</h3><div class="dc-acts">'+left+'</div></div><div class="dc-stats">'+box+'</div></div>';
}
function dashActions(o){
  var items='<a href="#/org/'+o.id+'">Organization details</a>';
  if(o.role==='Owner'||o.role==='Admin'){
    items+='<a href="#/org/'+o.id+'/changes">Update details</a>';
    var d=daysUntil(o.expiresOn); if(d>0 && d<=30 && !o.refreshPending) items+='<button type="button" data-act="refresh" data-org="'+o.id+'">Refresh verification</button>';
  }
  return '<div class="dash-actions"><button type="button" class="dash-act-btn" data-act="dashMenu">Actions<span aria-hidden="true">⋮</span></button><div class="dash-menu">'+items+'</div></div>';
}
function dashPending(){
  return '<div class="dash-pending">'+note('<b>Submission received.</b> We review within 1–2 business days and email '+h(S.s1.contact.email||S.s1.account.email||S.auth.email)+' when there\'s news.')+
    '<div class="acts"><a class="ob-btn ghost sm" href="#/review">View submission</a><button class="ob-btn gold sm" type="button" data-act="demoApprove">Demo: approve now →</button></div></div>';
}
function viewDashboard(){
  var list=dashEntities(), sel=S.dashSel;
  if(!list.some(function(x){ return x.id===sel; })) sel=findOrg(S.selectedOrg) ? S.selectedOrg : (S.account.orgs[0] ? S.account.orgs[0].id : 'personal');
  var e=list.filter(function(x){ return x.id===sel; })[0], o=e.org, tab=S.dashTab==='events'?'events':'projects', panel;
  var nav='<nav class="dash-nav">'+DASH_TABS.map(function(t,i){ var on=i===DASH_TABS.length-1; return '<a href="'+(on?'#/dashboard':'#')+'"'+(on?' class="on"':'')+'><b>'+t[0]+'</b><span>'+t[1]+'</span></a>'; }).join('')+'</nav>';
  var side='<aside class="dash-side">'+list.map(function(x){ return '<button type="button" class="dash-ent'+(x.id===sel?' on':'')+'" data-act="dashSel" data-id="'+x.id+'"><span class="av">'+initials(x.name)+'</span><span class="t"><span>'+x.label+'</span><b>'+h(x.name)+'</b></span>'+(x.pill?'<span class="dash-pill">Submission Received</span>':'')+'</button>'; }).join('')+'</aside>';
  if(e.id==='pending'){
    panel='<div class="dash-head"><div class="t"><h2>'+h(e.name)+'</h2></div></div>'+dashPending();
  } else {
    var projects=S.account.projects.filter(function(c){ return o ? c.org===o.id : !c.org; });
    var canNew = o ? o.role!=='Member' : true, content;
    var head = o ? '<div class="dash-head"><div class="t"><h2>'+h(o.name)+'</h2><span class="dash-role">'+h(o.role)+'</span></div>'+dashActions(o)+'</div>' : (e.pill ? dashPending() : '');
    var tabs='<div class="dash-tabs"><button type="button" class="'+(tab==='projects'?'on':'')+'" data-act="dashTab" data-t="projects">Projects</button><button type="button" class="'+(tab==='events'?'on':'')+'" data-act="dashTab" data-t="events">Events</button>'+
      (canNew && tab==='projects'?'<button class="ob-btn gold sm dash-new" type="button" data-act="dashNew" data-id="'+e.id+'">'+I.plus+' New project</button>':'')+'</div>';
    if(tab==='events') content='<div class="ob-empty"><b>No events yet</b></div>';
    else if(projects.length) content=projects.map(dashCard).join('');
    else if(!canNew) content='<div class="ob-empty"><b>No projects you can manage</b>You can\'t create projects for '+h(o.name)+' yet. <a href="#/org/'+o.id+'">Request access</a></div>';
    else content='<div class="ob-empty"><b>No projects yet</b>'+(o||S.account.individual?'':'New project starts with a one-time identity check.')+'</div>';
    panel=head+tabs+'<div class="dash-list">'+content+'</div>';
  }
  return '<div class="ob-wrap">'+nav+expiryBanner()+'<div class="dash">'+side+'<section class="dash-main">'+panel+'</section></div></div>';
}

/* ============================================================================
   ROUTER, EVENTS
   ============================================================================ */
var main=document.getElementById('ob'), lastRoute=null;
function go(p){ var target='#/'+p; if(location.hash===target) render(); else location.hash=target; }
function parts(){ return location.hash.replace(/^#\/?/,'').split('/').filter(Boolean); }
function render(){
  var p=parts(), r=p[0]||'', html='';
  if(!r){ go(S.auth.loggedIn ? (S.account.projects.length&&S.scenario==='awaiting'?'dashboard':'entry') : 'start'); return; }
  if(!S.auth.loggedIn && ['entry','org','individual','access','build','dashboard'].indexOf(r)>=0 && !(r==='individual')){ go('start'); return; }
  switch(r){
    case 'start': html=viewStart(); break;
    case 'account': html=viewAccount(); break;
    case 'type': html=viewType(); break;
    case 'docs': html=viewDocs(); break;
    case 'contact': html=viewContact(); break;
    case 'payout': html=viewPayout(); break;
    case 'review': html=viewReview(); break;
    case 'submitted': html=viewSubmitted(); break;
    case 'entry': html=viewEntry(); break;
    case 'org': html = p[2]==='changes' ? viewChanges(p[1]) : viewOrg(p[1]); break;
    case 'individual': html = p[1]==='changes' ? viewIndividualChanges() : viewIndividual(); break;
    case 'access': html=viewAccess(); break;
    case 'build': html = ({basics:viewBasics, goal:viewGoal, team:viewTeam, launch:viewLaunch, done:viewDone})[p[1]] ? ({basics:viewBasics, goal:viewGoal, team:viewTeam, launch:viewLaunch, done:viewDone})[p[1]]() : viewBasics(); break;
    case 'dashboard': html=viewDashboard(); break;
    default: go('start'); return;
  }
  if(html===''){ return; }
  main.innerHTML=html;
  main.classList.toggle('is-dash', r==='dashboard');
  /* on a phone the tab strip scrolls; keep the active Manage Pages tab in view, again once web fonts widen it */
  var dn=main.querySelector('.dash-nav'); if(dn){ var toEnd=function(){ dn.scrollLeft=dn.scrollWidth; }; toEnd(); document.fonts.ready.then(toEnd); }
  renderNav(); renderDemo();
  var key=location.hash;
  if(key!==lastRoute){ window.scrollTo(0,0); lastRoute=key; }
}
window.addEventListener('hashchange', render);

function renderNav(){
  var el=document.getElementById('nav-auth');
  var lang='<button class="lang" type="button" aria-label="Language: English"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 3 4.2 6.2 4.2 9.5S14.8 18.5 12 21.5c-2.8-3-4.2-6.2-4.2-9.5S9.2 5.5 12 2.5z"/></svg>EN</button>';
  var burger='<button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-menu"><i></i><i></i><i></i></button>';
  el.innerHTML = S.auth.loggedIn
    ? lang+'<a class="user" href="#/dashboard"><span class="av">'+initials(S.auth.name||S.auth.email)+'</span>'+h(S.auth.name||S.auth.email)+'</a>'+burger
    : lang+'<a class="login" href="#" data-act="login">Log In</a><a class="signup" href="#/start">Sign Up</a>'+burger;
}

/* one delegated handler for the whole page */
document.addEventListener('click', function(ev){
  var t=ev.target.closest('[data-go],[data-act],[data-up-replace],[data-up-rm],.ob-step.done');
  if(!t) return;
  if(t.hasAttribute('data-go')){ ev.preventDefault(); go(t.getAttribute('data-go')); return; }
  if(t.hasAttribute('data-up-replace')){ pickFile(t.getAttribute('data-up-replace')); return; }
  if(t.hasAttribute('data-up-rm')){ set(t.getAttribute('data-up-rm'), null); render(); return; }
  var act=t.getAttribute('data-act');
  if(ACT[act]){ ev.preventDefault(); ACT[act](t); }
});
document.addEventListener('click', function(ev){
  var m=document.querySelector('.dash-actions.open'); if(m && !m.contains(ev.target)) m.classList.remove('open');
});
document.addEventListener('input', function(ev){
  var el=ev.target;
  if(el.hasAttribute('data-k') && !el.hasAttribute('data-bool')){
    set(el.getAttribute('data-k'), el.value);
    var f=el.closest('.ob-field'); if(f) f.classList.remove('err');
    var cnt=el.parentNode.querySelector('.ob-count'); if(cnt && el.maxLength>0) cnt.textContent=el.value.length+'/'+el.maxLength;
    if(el.getAttribute('data-k')==='s1.payout.holder') holderCheck(el.value);
  }
  if(el.id==='inv-email'){ var un=document.getElementById('inv-unsent'); if(un) un.hidden=true; }
  if(el.hasAttribute('data-list')){
    var list=S.s2.goal[el.getAttribute('data-list')]; list[+el.getAttribute('data-i')][el.getAttribute('data-f')]=el.value; save();
  }
});
document.addEventListener('change', function(ev){
  var el=ev.target;
  if(el.hasAttribute('data-bool')){ set(el.getAttribute('data-k'), el.checked); var box=el.closest('.ob-check-box'); if(box) box.classList.toggle('on', el.checked); var f=el.closest('.ob-field'); if(f) f.classList.remove('err'); if(/^confirmed\./.test(el.getAttribute('data-k'))) render(); return; }
  if(el.hasAttribute('data-k') && el.tagName==='SELECT'){ set(el.getAttribute('data-k'), el.value); var ff=el.closest('.ob-field'); if(ff) ff.classList.remove('err'); return; }
  if(el.type==='radio' && el.closest('[data-choice]')){ set(el.closest('[data-choice]').getAttribute('data-choice'), el.value); render(); return; }
  if(el.hasAttribute('data-upfile')){ fileChosen(el.getAttribute('data-upfile'), el.files[0]); return; }
  if(el.hasAttribute('data-upimg')){ imagesChosen(el.files); return; }
});
document.addEventListener('focusout', function(ev){
  var el=ev.target;
  if(el.getAttribute && el.getAttribute('data-k')==='s1.payout.account' && el.value.trim().length>=4){ set('s1.payout.masked', true); render(); }
});
function holderCheck(v){
  var ind=S.s1.type==='individual', legal = ind ? S.s1.docs.fullName : S.s1.docs.legalName;
  if(S.update && !legal){ legal = S.update.kind==='individual' ? S.account.individual.name : findOrg(S.update.id).name; }
  var w=document.getElementById('holder-warn'); if(!w||!legal) return;
  w.style.display = v.trim() && v.trim().toLowerCase()!==legal.trim().toLowerCase() ? '' : 'none';
}
function fileChosen(k, f){
  if(!f) return;
  set(k, {name:f.name, size:f.size, busy:true}); render();
  setTimeout(function(){ set(k, {name:f.name, size:f.size}); render(); }, 800);
}
function pickFile(k){
  var inp=document.createElement('input'); inp.type='file'; inp.style.display='none'; document.body.appendChild(inp);
  inp.addEventListener('change', function(){ fileChosen(k, inp.files[0]); inp.remove(); });
  inp.click();
}
function imagesChosen(files){
  var imgs=S.s2.basics.images||[];
  Array.prototype.forEach.call(files, function(f){ imgs.push({name:f.name, size:f.size}); });
  set('s2.basics.images', imgs); render();
}

var ACT={
  next:function(t){
    var card=t.closest('.ob-card'); if(!validate(card)) return;
    var r=parts()[0];
    if(r==='docs' && S.s1.type!=='individual' && !S.update){
      var e=matchOrg();
      if(e && S.s1.docs.matchDismissed!==e.id){ orgMatchModal(e); return; }
    }
    if(r==='build' && parts()[1]==='team'){
      var inv=document.getElementById('inv-email'), un=document.getElementById('inv-unsent');
      if(inv.value.trim()){
        document.getElementById('inv-unsent-email').textContent='You typed '+inv.value.trim()+' but didn\'t press Invite.';
        un.hidden=false; un.scrollIntoView({behavior:'smooth', block:'center'}); return;
      }
    }
    if(r==='build'){ s2Advance('build/'+parts()[1]); return; }
    s1Advance(r);
  },
  inviteAndNext:function(){
    var email=document.getElementById('inv-email').value.trim();
    if(!ACT.addMember()){ document.getElementById('inv-unsent').hidden=true; return; }
    toast('Invite sent to '+email); s2Advance('build/team');
  },
  nextNoInvite:function(){ s2Advance('build/team'); },
  sendLink:function(t){
    var card=t.closest('.ob-card'); if(!validate(card)) return;
    set('s1.account.sent', true); render();
  },
  resend:function(){ toast('Link sent again to '+S.s1.account.email); },
  changeEmail:function(){ set('s1.account.sent', false); render(); },
  openLink:function(){
    var email=(S.s1.account.email||'').toLowerCase().trim();
    if(KNOWN_EMAILS.indexOf(email)>=0){
      /* the email already has an account: the link signs them in and drops them at the logged-in entry */
      var keep=S.s1; reset('ret1'); S.s1=keep; S.s1.account.sent=false; S.auth.email=email; save();
      toast('Welcome back — this email already had an account'); go('entry'); return;
    }
    S.auth={loggedIn:true, name:'', email:email}; S.s1.done.account=true; save(); go('type');
  },
  matchDismiss:function(){ var e=matchOrg(); set('s1.docs.matchDismissed', e?e.id:''); closeModal(); s1Advance('docs'); },
  matchDismissGo:function(){ S.requests.access=null; var e=matchOrg(); set('s1.docs.matchDismissed', e?e.id:''); go('contact'); },
  requestAccess:function(t){ S.requests.access={org:t.getAttribute('data-org'), kind:'access', sent:addDays(0)}; save(); closeModal(); go('access'); },
  requestJoin:function(t){ S.requests.access={org:t.getAttribute('data-org'), kind:'join', sent:addDays(0)}; save(); closeModal(); go('access'); },
  demoJoin:function(){
    var r=S.requests.access, e=DIRECTORY.filter(function(x){ return x.id===r.org; })[0];
    var o=clone(e.id==='antioch21'?ORG_ANTIOCH:{id:e.id, name:e.name, type:'charity', country:'Singapore', verifiedSince:addDays(0), expiresOn:addDays(365), lastActive:addDays(0), regMasked:'T21SS••••B', contact:'Rachel Ong', payoutMasked:'DBS ••••1180'});
    o.role='Collaborator'; if(!findOrg(o.id)) S.account.orgs.push(o); S.requests.access=null; save(); toast('Access approved — you\'re on the '+o.name+' team'); go('org/'+o.id);
  },
  unmask:function(){ set('s1.payout.masked', false); render(); setTimeout(function(){ var el=document.querySelector('[data-k="s1.payout.account"]'); if(el) el.focus(); }, 0); },
  submit:function(t){
    var card=t.closest('.ob-card'); if(!validate(card)) return;
    S.s1.status='submitted'; S.s1.submittedAt=addDays(0); S.s1.done.review=true; S.dashSel=S.s1.type==='individual'?'personal':'pending'; save(); go('submitted');
  },
  demoApprove:function(){
    var s=S.s1, ind=s.type==='individual';
    if(ind){ S.account.individual={name:s.docs.fullName||S.auth.name||'You', verifiedSince:addDays(0), idMasked:'S••••••'+(s.docs.fullName||'A').slice(-1).toUpperCase(), idExpires:addDays(1400), address:s.intent.country||'Singapore'}; }
    else { S.account.orgs.push({id:'org'+Date.now(), name:s.docs.legalName||s.intent.name||'Your organisation', type:'charity', country:s.docs.regCountry||s.intent.country||'Singapore', role:'Owner', verifiedSince:addDays(0), expiresOn:addDays(365), lastActive:addDays(0), regMasked:(s.docs.regNo||'T00SS0000A').slice(0,5)+'••••'+(s.docs.regNo||'A').slice(-1), contact:s.contact.name||S.auth.name, payoutMasked:(s.payout.bank||'Bank')+' ••••'+(s.payout.account||'0000').slice(-4)}); }
    if(!S.auth.name) S.auth.name=s.contact.name||'You';
    S.s1.status='approved'; save(); toast('Approved — verification is on file for future projects'); go('entry');
  },
  login:function(){ reset('ret1'); toast('Signed in as Adam Le'); go('entry'); },
  addOrg:function(){ S.s1={mode:'addorg', intent:{}, account:{}, type:'charity', docs:{}, contact:{}, payout:{}, done:{}, status:'draft'}; save(); go('start'); },
  startOrgProject:function(){ S.s2={basics:{}, goal:{}, team:[], launch:{}, done:{}, status:''}; save(); go('build/basics'); },
  startProject:function(){ S.selectedOrg=''; S.s2={basics:{}, goal:{}, team:[], launch:{}, done:{}, status:''}; save(); go('build/basics'); },
  dashSel:function(t){ S.dashSel=t.getAttribute('data-id'); S.dashTab='projects'; save(); render(); },
  dashTab:function(t){ S.dashTab=t.getAttribute('data-t'); save(); render(); },
  dashMenu:function(t){ t.closest('.dash-actions').classList.toggle('open'); },
  dashNew:function(t){
    var id=t.getAttribute('data-id');
    S.s2={basics:{}, goal:{}, team:[], launch:{}, done:{}, status:''};
    if(id==='personal'){ S.selectedOrg=''; save(); go(S.account.individual?'build/basics':'individual'); return; }
    S.selectedOrg=id; save(); go('build/basics');
  },
  requestPerm:function(t){ var id=t.getAttribute('data-org'); S.requests[id]={sent:addDays(0)}; save(); render(); },
  demoGrant:function(t){ var o=findOrg(t.getAttribute('data-org')); o.role='Collaborator'; delete S.requests[o.id]; save(); toast('Access approved by '+o.contact); render(); },
  refresh:function(t){ var id=t.getAttribute('data-org'); S.update={kind:'org', id:id, sections:['docs'], refresh:true}; S.s1.docs={}; S.s1.done={}; save(); go('docs'); },
  startUpdate:function(t){
    var id=t.getAttribute('data-org'), secs=['docs','payout','contact'].filter(function(s){ return S.chg && S.chg[s]; });
    if(!secs.length){ toast('Tick at least one section'); return; }
    S.update={kind:'org', id:id, sections:secs}; S.chg={}; S.s1.docs={}; S.s1.payout={}; S.s1.contact={}; S.s1.done={}; S.s1.type='charity'; save(); go(secs[0]);
  },
  indUpdate:function(t){
    if(parts()[1]==='changes' && !(S.chg && (S.chg.id||S.chg.address||S.chg.name))){ toast('Tick at least one section'); return; }
    S.update={kind:'individual', sections:['docs']}; S.chg={}; S.s1.docs={}; S.s1.done={}; S.s1.type='individual'; save(); go('docs');
  },
  skipGoal:function(){ s2Advance('build/goal'); },
  skipTeam:function(){ s2Advance('build/team'); },
  rmImg:function(t){ var imgs=S.s2.basics.images||[]; imgs.splice(+t.getAttribute('data-i'),1); set('s2.basics.images', imgs); render(); },
  fold:function(t){ document.getElementById(t.getAttribute('data-fold')).classList.toggle('open'); },
  addRow:function(t){ var k=t.getAttribute('data-list'); var list=S.s2.goal[k]||[]; list.push({title:'', count:''}); S.s2.goal[k]=list; save(); render(); document.getElementById(k==='items'?'fold-items':'fold-vol').classList.add('open'); },
  rmRow:function(t){ var k=t.getAttribute('data-list'); S.s2.goal[k].splice(+t.getAttribute('data-i'),1); save(); render(); },
  addMember:function(){
    var e=document.getElementById('inv-email'), r=document.getElementById('inv-role');
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.value.trim())){ e.focus(); e.closest('.ob-field').classList.add('err'); return false; }
    S.s2.team.push({email:e.value.trim(), role:r.value}); save(); render();
    return true;
  },
  rmMember:function(t){ S.s2.team.splice(+t.getAttribute('data-i'),1); save(); render(); },
  launch:function(t){
    var card=t.closest('.ob-card'); if(!validate(card)) return;
    var l=S.s2.launch, o=currentOrg();
    var c={id:'c'+Date.now(), name:S.s2.basics.name, org:o?o.id:'', approvedOn:addDays(0)};
    if(l.mode==='now'){ c.status='live'; c.raised=0; c.started=addDays(0); if(S.s2.goal.range==='exact') c.goal=+S.s2.goal.amount||0; }
    else if(l.mode==='schedule'){ c.status='scheduled'; c.scheduledFor=l.at; }
    else { c.status='draft'; }
    S.account.projects.unshift(c); S.s2.status=c.status; S.s2.done['build/launch']=true; S.dashSel=o?o.id:'personal'; S.dashTab='projects'; save();
    if(c.status==='live') go('build/done'); else { toast(c.status==='scheduled'?'Scheduled for '+fmtDateTime(c.scheduledFor):'Saved as a draft'); go('dashboard'); }
  },
  publishNow:function(t){ var c=S.account.projects.filter(function(x){ return x.id===t.getAttribute('data-id'); })[0]; c.status='live'; c.raised=0; c.started=addDays(0); save(); toast('Published — '+c.name+' is live'); render(); },
  copyLink:function(t){ toast('Link copied'); },
  demoPick:function(t){ reset(t.getAttribute('data-s')); document.getElementById('ob-demo').classList.remove('open'); go(SCENARIOS[S.scenario].start); },
  demoReset:function(){ reset(S.scenario); document.getElementById('ob-demo').classList.remove('open'); go(SCENARIOS[S.scenario].start); },
  demoToggle:function(){ document.getElementById('ob-demo').classList.toggle('open'); },
  demoFlow:function(){ document.getElementById('ob-demo').classList.remove('open'); flowModal(S.scenario); },
  flowPick:function(t){ flowModal(t.getAttribute('data-s')); },
  modalClose:function(){ closeModal(); }
};

/* ---------- modal, toast, demo panel ---------- */
var modalEl=document.getElementById('ob-modal');
function modal(inner){ modalEl.innerHTML='<div class="ob-modal" data-act="modalBg"><div class="box">'+inner+'</div></div>'; }
function closeModal(){ modalEl.innerHTML=''; }
ACT.modalBg=function(){};
modalEl.addEventListener('click', function(ev){ if(ev.target.classList.contains('ob-modal')) closeModal(); });

var toastEl=document.getElementById('ob-toast'), toastT;
function toast(msg){ toastEl.textContent=msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(function(){ toastEl.classList.remove('show'); }, 2800); }

function renderDemo(){
  var el=document.getElementById('ob-demo');
  el.innerHTML='<button type="button" data-act="demoToggle"><i></i>Demo · '+h(SCENARIOS[S.scenario].label)+'</button><div class="panel"><h4>Scenario</h4>'+
    Object.keys(SCENARIOS).map(function(k){ var s=SCENARIOS[k]; return '<label><input type="radio" name="demo" data-act="demoPick" data-s="'+k+'"'+(k===S.scenario?' checked':'')+'><div>'+h(s.label)+'<span>'+h(s.sub)+'</span></div></label>'; }).join('')+
    '<div class="hints"><b>Try in the forms</b><br>Email <code>josias@antioch21.org</code> → existing account.<br>Registration no. <code>T08SS0123A</code> → org already verified.<br>Registration no. <code>T21SS0456B</code> → application in progress.</div>'+
    '<div class="acts"><button class="ob-btn ghost sm" type="button" data-act="demoReset">Reset scenario</button><button class="ob-btn primary sm" type="button" data-act="demoFlow">Flow diagram</button></div>'+
    '<div class="acts"><a class="ob-btn ghost sm" href="onboarding-matrix.html">View matrix</a></div></div>';
}

function flowModal(key){
  var F=OB_FLOWS.get(key);
  modal('<div class="flow-top"><div class="flow-head"><div><h2>Flow diagram</h2><p class="lead">Where each demo scenario goes, per the handoff diagrams.</p></div><button class="flow-x" type="button" data-act="modalClose" aria-label="Close">×</button></div>'+
    '<div class="flow-pick">'+OB_FLOWS.keys.map(function(k){ return '<button type="button" class="'+(k===key?'on':'')+'" data-act="flowPick" data-s="'+k+'">'+h(SCENARIOS[k].label)+'</button>'; }).join('')+'</div></div>'+
    '<div class="flow-title"><b>'+h(F.title)+'</b><span>'+h(F.src)+'</span></div>'+
    '<div class="flow-svg">'+OB_FLOWS.render(key)+'</div>'+
    '<p class="flow-note">'+h(F.note)+'</p>'+
    '<div class="flow-legend"><i class="step"></i>Screen<i class="dec"></i>Decision<i class="next"></i>Hand-off to another diagram<i class="end"></i>End state<i class="ext"></i>Branch this scenario does not take</div>');
  modalEl.querySelector('.box').classList.add('flow');
  var sv=modalEl.querySelector('.flow-svg'); sv.scrollLeft=(sv.scrollWidth-sv.clientWidth)/2;
}

/* ---------- nav (same behaviour as the homepage) ---------- */
(function(){
  var nav=document.getElementById('nav');
  window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY>20); }, {passive:true});
  nav.addEventListener('click', function(ev){
    var b=ev.target.closest('.burger'); if(!b) return;
    var open=nav.classList.toggle('open'); b.setAttribute('aria-expanded', open?'true':'false');
  });
  nav.querySelectorAll('.hp-nav-menu a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); }); });
})();

/* ---------- boot ---------- */
S=load(); if(!S){ reset('new'); }
render();
})();
