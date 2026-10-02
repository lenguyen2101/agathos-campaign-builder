/* ============================================================================
   Agathos — project-owner onboarding prototype.
   One page, hash-routed. State lives in localStorage so a reviewer can leave
   and come back exactly where they were — which is also the product promise.

   Routes
     #/begin (step 0: cause, organisation or event)
     #/start #/account #/type #/docs #/contact #/payout #/review #/submitted
     #/orgdetails #/orgcontact #/orgcause #/orgdocs #/risk (organisation verification)
     #/entry #/org/<id> #/org/<id>/changes #/orgpage/<id> #/event/<host>
     #/individual #/individual/changes #/access
     #/build/proposal #/build/page #/build/goal #/build/team #/build/launch
     #/build/done #/dashboard
   ============================================================================ */
(function(){
'use strict';

var KEY = 'agathos.onboarding.v2';
var TODAY = new Date();

/* ---------- reference data ---------- */
/* cause categories as listed on agathos.be (Support a Cause filters, Oct 2026) */
var CAUSES = ['Children & Youth','Community-building','Creative Media & Arts','Discipleship','Education','Environment','Families','Healthcare','Humanitarian','Legacy','Marketplace & Innovation','Marriage & Family','Mental Health','Missions & Evangelism','Poverty Alleviation','Sports','Worship & Prayer'];
var YES_NO = [['yes','Yes'],['no','No']];
var COUNTRIES = 'Afghanistan|Albania|Algeria|Andorra|Angola|Antigua and Barbuda|Argentina|Armenia|Australia|Austria|Azerbaijan|Bahamas|Bahrain|Bangladesh|Barbados|Belarus|Belgium|Belize|Benin|Bhutan|Bolivia|Bosnia and Herzegovina|Botswana|Brazil|Brunei|Bulgaria|Burkina Faso|Burundi|Cabo Verde|Cambodia|Cameroon|Canada|Central African Republic|Chad|Chile|China|Colombia|Comoros|Congo|Costa Rica|Côte d\'Ivoire|Croatia|Cuba|Cyprus|Czechia|Democratic Republic of the Congo|Denmark|Djibouti|Dominica|Dominican Republic|Ecuador|Egypt|El Salvador|Equatorial Guinea|Eritrea|Estonia|Eswatini|Ethiopia|Fiji|Finland|France|Gabon|Gambia|Georgia|Germany|Ghana|Greece|Grenada|Guatemala|Guinea|Guinea-Bissau|Guyana|Haiti|Honduras|Hong Kong|Hungary|Iceland|India|Indonesia|Iran|Iraq|Ireland|Israel|Italy|Jamaica|Japan|Jordan|Kazakhstan|Kenya|Kiribati|Kuwait|Kyrgyzstan|Laos|Latvia|Lebanon|Lesotho|Liberia|Libya|Liechtenstein|Lithuania|Luxembourg|Macau|Madagascar|Malawi|Malaysia|Maldives|Mali|Malta|Marshall Islands|Mauritania|Mauritius|Mexico|Micronesia|Moldova|Monaco|Mongolia|Montenegro|Morocco|Mozambique|Myanmar|Namibia|Nauru|Nepal|Netherlands|New Zealand|Nicaragua|Niger|Nigeria|North Korea|North Macedonia|Norway|Oman|Pakistan|Palau|Palestine|Panama|Papua New Guinea|Paraguay|Peru|Philippines|Poland|Portugal|Qatar|Romania|Russia|Rwanda|Saint Kitts and Nevis|Saint Lucia|Saint Vincent and the Grenadines|Samoa|San Marino|Sao Tome and Principe|Saudi Arabia|Senegal|Serbia|Seychelles|Sierra Leone|Singapore|Slovakia|Slovenia|Solomon Islands|Somalia|South Africa|South Korea|South Sudan|Spain|Sri Lanka|Sudan|Suriname|Sweden|Switzerland|Syria|Taiwan|Tajikistan|Tanzania|Thailand|Timor-Leste|Togo|Tonga|Trinidad and Tobago|Tunisia|Turkey|Turkmenistan|Tuvalu|Uganda|Ukraine|United Arab Emirates|United Kingdom|United States|Uruguay|Uzbekistan|Vanuatu|Vatican City|Venezuela|Vietnam|Yemen|Zambia|Zimbabwe'.split('|');
/* the project type values seen in the admin portal; the full list is still to confirm */
var PROJECT_TYPES = [['COMMUNITY','Community'],['EMERGENCY','Emergency']];
var ROLES = [['manager','Manager'],['viewer','Viewer']];

/* organisations already on Agathos — what the org-match check looks up */
var DIRECTORY = [
  {id:'antioch21', name:'Antioch21', keys:['t08ss0123a','antioch21','antioch 21'], status:'verified', since:'2025-03-14', contact:'j•••@antioch21.org'},
  {id:'livingwaters', name:'Living Waters Village', keys:['t21ss0456b','living waters'], status:'pending', submitted:'2026-09-10', contact:'r•••@livingwaters.sg'}
];
/* emails that already have an account — the magic link logs them in instead */
var KNOWN_ACCOUNTS = {'adam@agathos.be':'Adam Le', 'josias@antioch21.org':'Josias Ding'};

var ORG_ANTIOCH = {id:'antioch21', name:'Antioch21', type:'charity', country:'Singapore', role:'Owner', verifiedSince:'2025-03-14', expiresOn:'2027-03-14', lastActive:'2026-09-02', regMasked:'T08SS••••A', contact:'Josias Ding', payoutMasked:'DBS ••••4821',
  details:{name:'Antioch21', country:'Singapore', registered:'yes', regNo:'T08SS0123A', operate:['Singapore','Iraq'], email:'hello@antioch21.org', phone:'+65 6123 4567', address:'10 Anson Road, Singapore 079903', causes:['Humanitarian','Children & Youth'], about:'A Singapore ministry serving refugee and displaced families in the Kurdistan Region of Iraq.', website:'https://antioch21.org'},
  page:{status:'live', fund:{on:true, purpose:'Staff, rent and the day-to-day running of our programmes.', raised:8450, contributions:64}}};
var ORG_TTB = {id:'treasurebox', name:'The Treasure Box Singapore', type:'charity', country:'Singapore', role:'Manager', verifiedSince:'2024-11-20', expiresOn:'2026-11-20', lastActive:'2026-08-15', regMasked:'T19SS••••C', contact:'Rachel Tan', payoutMasked:'OCBC ••••2210',
  details:{name:'The Treasure Box Singapore', country:'Singapore', registered:'yes', regNo:'T19SS0789C', operate:['Singapore'], email:'hello@thetreasureboxsg.com', phone:'+65 8891 0669', address:'51 Bukit Batok Crescent, #08-35, Singapore 658077', causes:['Children & Youth','Marriage & Family','Discipleship'], about:'Helping families grow closer to one another, and closer to God, together.', website:'https://www.thetreasurebox.sg'}, page:{status:'none'}};
var PROJ_A = {id:'c1', name:'Special Needs Centre in Kurdistan Region of Iraq', org:'antioch21', status:'live', raised:20000, goal:60000, contributions:186, started:'2025-08-08', cause:'Children & Youth', country:'Iraq', type:'COMMUNITY',
  intro:'A day centre where children with special needs get therapy, schooling and a safe place to play.', images:[{name:'kurdistan-centre-1.jpg', size:1}, {name:'kurdistan-centre-2.jpg', size:1}]};
var PROJ_B = {id:'c2', name:'Kurdistan Winter Relief 2025', org:'antioch21', status:'ended', raised:41200, goal:40000, contributions:402, started:'2025-11-02', cause:'Humanitarian', country:'Iraq', type:'EMERGENCY',
  intro:'Blankets, heaters and fuel for displaced families through the winter.', images:[{name:'winter-relief.jpg', size:1}]};

function newS2(){ return {projectId:'', proposal:{}, basics:{}, goal:{}, team:[], launch:{}, done:{}, status:''}; }
function base(){
  return {
    scenario:'new',
    auth:{loggedIn:false, name:'', email:''},
    account:{orgs:[], individual:null, projects:[]},
    s1:{mode:'visitor', intent:{}, account:{}, type:'', org:{}, docs:{}, contact:{}, payout:{}, done:{}, status:'draft'},
    s2:newS2(),
    path:'', requests:{}, update:null, selectedOrg:'', confirmed:{}
  };
}
function loggedIn(s){ s.auth = {loggedIn:true, name:'Adam Le', email:'adam@agathos.be'}; return s; }

var SCENARIOS = {
  'new':      {label:'New visitor', sub:'Choose a path, verify, then build', start:'begin', seed:function(){ return base(); }},
  'fresh':    {label:'Not verified yet', sub:'Has an account, nothing verified', start:'begin', seed:function(){ return loggedIn(base()); }},
  'ret1':     {label:'Owner of one organisation', sub:'Owner of Antioch21', start:'begin', seed:function(){ var s=loggedIn(base()); s.account.orgs=[clone(ORG_ANTIOCH)]; s.account.projects=[clone(PROJ_A),clone(PROJ_B)]; return s; }},
  'ret2':     {label:'In two organisations', sub:'Owner of one, manager of another', start:'begin', seed:function(){ var s=loggedIn(base()); s.account.orgs=[clone(ORG_ANTIOCH),clone(ORG_TTB)]; s.account.projects=[clone(PROJ_A),clone(PROJ_B)]; return s; }},
  'expiring': {label:'Verification expiring', sub:'Refresh reminder, 20 days left', start:'begin', seed:function(){ var s=loggedIn(base()); var o=clone(ORG_ANTIOCH); o.expiresOn=addDays(20); s.account.orgs=[o]; s.account.projects=[clone(PROJ_A)]; return s; }},
  'indiv':    {label:'Individual, already verified', sub:'No organisation, raises personally', start:'begin', seed:function(){ var s=loggedIn(base()); s.account.individual={name:'Adam Le', verifiedSince:'2025-08-02', idMasked:'S••••567A', idExpires:addDays(25), address:'Tampines, Singapore'}; return s; }},
  'awaiting': {label:'Project awaiting publish', sub:'Dashboard with a scheduled project', start:'dashboard', seed:function(){ var s=loggedIn(base()); s.account.orgs=[clone(ORG_ANTIOCH)]; s.account.projects=[{id:'c4', name:'Clean water for Erbil schools', org:'antioch21', status:'review', submittedOn:addDays(-1), cause:'Humanitarian', country:'Iraq', summary:'Water filters and taps for six schools.', goalEst:15000}, {id:'c3', name:'Living Waters Village', org:'antioch21', status:'scheduled', scheduledFor:addDays(7)+'T09:00', approvedOn:addDays(-2)}, clone(PROJ_A)]; s.selectedOrg='antioch21'; return s; }}
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
function causeLabel(v){ return v||''; }

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
  return '<div class="ob-field" data-field="'+o.k+'"><label>'+h(o.label)+(o.req?'<span class="req">*</span>':'')+(o.opt?'<span class="opt">Optional</span>':'')+'</label>'+(o.note?'<div class="ob-fieldnote">'+I.info+'<span>'+h(o.note)+'</span></div>':'')+input+'<div class="msg">'+h(o.msg||'Required')+'</div>'+(o.hint?'<div class="hint">'+o.hint+'</div>':'')+(o.after||'')+'</div>';
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
  return '<div class="ob-field" data-field="'+o.k+'">'+(o.label?'<label>'+h(o.label)+(o.req?'<span class="req">*</span>':'')+(o.opt?'<span class="opt">Optional</span>':'')+'</label>':'')+
    '<div class="ob-chips" data-choice="'+o.k+'"'+(o.req?' data-req="1"':'')+'>'+o.options.map(function(op){
      return '<label class="'+(v===op[0]?'on':'')+'"><input type="radio" name="'+o.k+'" value="'+op[0]+'"'+(v===op[0]?' checked':'')+'>'+h(op[1])+'</label>';
    }).join('')+'</div>'+(o.hint?'<div class="hint">'+o.hint+'</div>':'')+(o.req?'<div class="msg">Please choose one</div>':'')+'</div>';
}
function multiChips(o){
  var v=get(o.k)||[];
  return '<div class="ob-field" data-field="'+o.k+'"><label>'+h(o.label)+(o.req?'<span class="req">*</span>':'')+'</label>'+(o.note?'<div class="ob-fieldnote">'+I.info+'<span>'+h(o.note)+'</span></div>':'')+
    '<div class="ob-chips" data-multi="'+o.k+'" data-max="'+o.max+'"'+(o.req?' data-req="1"':'')+'>'+o.options.map(function(op){ var on=v.indexOf(op)>=0; return '<label class="'+(on?'on':'')+'"><input type="checkbox" value="'+h(op)+'"'+(on?' checked':'')+'>'+h(op)+'</label>'; }).join('')+
    '</div><div class="msg">Pick at least one</div></div>';
}
/* a long list where several answers apply: pick from the dropdown, each pick becomes a removable tag */
function multiSelect(o){
  var v=[].concat(get(o.k)||[]);
  return '<div class="ob-field" data-field="'+o.k+'"><label>'+h(o.label)+(o.req?'<span class="req">*</span>':'')+'</label>'+
    '<div class="ob-msel" data-multi="'+o.k+'"'+(o.req?' data-req="1"':'')+'>'+
    (v.length?'<div class="tags">'+v.map(function(x){ return '<span class="tag">'+h(x)+'<button type="button" data-act="mselRm" data-ms="'+o.k+'" data-v="'+h(x)+'" aria-label="Remove '+h(x)+'">×</button></span>'; }).join('')+'</div>':'')+
    '<select class="ob-input" data-msel="'+o.k+'"><option value="">'+h(v.length?'Add another':(o.placeholder||'Select…'))+'</option>'+
    o.options.filter(function(x){ return v.indexOf(x)<0; }).map(function(x){ return '<option value="'+h(x)+'">'+h(x)+'</option>'; }).join('')+'</select>'+
    '</div><div class="msg">Pick at least one</div></div>';
}
function checkbox(o){
  var v=!!get(o.k);
  return '<div class="ob-field" data-field="'+o.k+'"><label class="ob-check-box'+(o.plain?' plain':'')+(v?' on':'')+'"><input type="checkbox" data-k="'+o.k+'" data-bool="1"'+(o.req?' data-req="1"':'')+(v?' checked':'')+'><div><div class="t">'+o.t+'</div>'+(o.d?'<div class="d">'+o.d+'</div>':'')+'</div></label><div class="msg">'+h(o.msg||'Please confirm')+'</div></div>';
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
  root.querySelectorAll('[data-multi][data-req]').forEach(function(el){ if(!(get(el.getAttribute('data-multi'))||[]).length) fail(el); });
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
   STEP 0 — what the person wants to set up. It decides the wording, which rows
   the organisation list shows, and where approval leads.
   ============================================================================ */
var PATHS={
  cause:{t:'Raise funds for a cause', d:'A project with a clear purpose, like a build, a relief response or a mission. As an individual or for an organisation.'},
  org:{t:'Raise funds for your organisation', d:'An organisation page that shows all your projects and events, and takes donations for running costs.'},
  event:{t:'Host an event', d:'A run, a dinner, a concert. As an individual or for an organisation.'}
};
function pathKey(){ return PATHS[S.path] ? S.path : 'cause'; }
function kicker(){ return PATHS[pathKey()].t; }
/* the step to go back to when a verification was started and not submitted, else null */
function unfinished(){
  var s=S.s1; if(s.status!=='draft' || S.update) return null;
  var started=Object.keys(s.done).some(function(k){ return s.done[k] && k!=='account'; }) || (s.org&&s.org.name) || (s.intent&&s.intent.name) || (s.docs&&s.docs.fullName);
  if(!started) return null;
  var st=s1Steps(), next=st.filter(function(x){ return !s.done[x.id]; })[0];
  return next || st[st.length-1];
}
/* a path chosen on step 0, or from a button that already says what it creates */
function startPath(path, replace){
  var resume = S.path===path && unfinished();
  S.path=path;
  if(resume){ save(); go(resume.id, replace); return; }
  if(!S.auth.loggedIn){ S.s1={mode:'visitor', intent:{}, account:{}, type:path==='org'?'charity':'', org:{}, docs:{}, contact:{}, payout:{}, done:{}, status:'draft'}; save(); go('account', replace); return; }
  save(); go('entry', replace);
}
function viewBegin(){
  var name=firstName(S.auth.name), u=PATHS[S.path] && unfinished();
  var resume = u ? '<div class="ob-banner info ob-resume"><div class="ic">'+I.clock+'</div><div><b>Continue where you left off</b><p>'+h(kicker())+' · next step: '+h(u.lbl)+'</p></div><button class="ob-btn primary sm" type="button" data-go="'+u.id+'">Continue →</button></div>' : '';
  var cards=[['cause',I.heart],['org',I.building],['event',I.calendar]].map(function(c){ var p=PATHS[c[0]]; return '<button class="ob-path" type="button" data-act="pickPath" data-path="'+c[0]+'"><span class="ic">'+c[1]+'</span><span class="t"><b>'+h(p.t)+'</b><span>'+h(p.d)+'</span></span><span class="chev">'+I.chev+'</span></button>'; }).join('');
  var tree='<div class="ob-structure"><b>How pages fit together</b><div class="ob-tree">'+
    '<div class="node"><span>Organisation page</span><div class="kids"><i>Projects</i><i>Events</i><i>Running costs</i></div></div>'+
    '<div class="node"><span>Individual</span><div class="kids"><i>Projects</i><i>Events</i></div></div></div>'+
    '<p>An organisation page holds all of its projects and events, and can take donations for running costs.</p></div>';
  return center({kicker:'Get started', h1:S.auth.loggedIn&&name?'What would you like to do, '+h(name)+'?':'What would you like to do?', p:'Pick one to start. You can come back for the others any time.', body:expiryBanner()+resume+'<div class="ob-paths">'+cards+'</div>'+tree});
}

/* ============================================================================
   SESSION 1 — interest + verification
   ============================================================================ */
/* "Can you offer tax deductions to donors?" = Yes for a Singapore organisation means an IPC.
   IPCs set up payouts with AXS directly, so they don't send us a bank statement. */
function isIpc(){ var o=S.s1.org||{}; return o.country==='Singapore' && o.taxDeduction==='yes'; }
var UPDATE_LABELS={orgdetails:'organization details', orgdocs:'documents', risk:'risk declaration', docs:'identity'};
/* the live form's questions in five short steps; sub = how much each step asks */
function orgSteps(){
  return [
    {id:'orgdetails', lbl:'Organization', sub:(S.s1.org.country==='Singapore'?6:5)+' questions'},
    {id:'orgcontact', lbl:'Contact', sub:'4 questions'},
    {id:'orgcause', lbl:'Causes', sub:'4 questions'},
    {id:'orgdocs', lbl:'Documents', sub:(isIpc()?2:3)+' files'},
    {id:'risk', lbl:'Risk declaration', sub:'3 questions, then submit'}
  ];
}
/* "Organization details" on the what's-changed checklist reopens the first three steps */
var ORG_SECTIONS={orgdetails:['orgdetails','orgcontact','orgcause'], orgdocs:['orgdocs'], risk:['risk']};
function s1Steps(){
  if(S.update){
    if(S.update.kind==='individual') return [{id:'docs', lbl:'Update: identity', sub:''}];
    var out=[];
    S.update.sections.forEach(function(sec){
      orgSteps().filter(function(s){ return ORG_SECTIONS[sec].indexOf(s.id)>=0; }).forEach(function(s){ out.push({id:s.id, lbl:'Update: '+s.lbl.toLowerCase(), sub:''}); });
    });
    return out;
  }
  var st=[];
  /* a logged-in user already picked org or individual in the organisation list */
  if(S.s1.mode==='visitor'){
    st.push({id:'account', lbl:'Your account', sub:'So you can resume any time'});
    if(S.path==='event') return st;
    if(S.path!=='org') st.push({id:'type', lbl:'Who is raising', sub:'Organisation or individual'});
  }
  if(S.s1.type==='individual'){
    st.push({id:'start', lbl:'About your cause', sub:'Under a minute'});
    st.push({id:'docs', lbl:'Verify your identity', sub:'The one paperwork step'});
    st.push({id:'contact', lbl:'Contact & authority', sub:'Who we talk to'});
    st.push({id:'payout', lbl:'Payout details', sub:'Where donations go'});
    st.push({id:'review', lbl:'Review & submit', sub:'Reviewed in 1–2 business days'});
  } else {
    st=st.concat(orgSteps());
  }
  return st;
}
function s1Head(){
  if(S.update){
    return {kicker:'Update details', h1:'Just the part that changed', p:'Only this section is re-reviewed — usually the same day. Everything else stays verified.'};
  }
  if(S.s1.mode==='addorg' || S.path==='org') return {kicker:kicker(), h1:'Verify your organisation', p:'Verify once. Its page, projects and events all build on it. Documents are the only paperwork step.'};
  if(S.s1.mode==='addind') return {kicker:kicker(), h1:'Verify your identity', p:'A one-time check of who\'s raising. Documents are the only paperwork step.'};
  if(S.path==='event') return {kicker:kicker(), h1:'First, your account', p:'We\'ll email you a link to sign in. No password needed.'};
  return {kicker:kicker(), h1:'First, a one-time check', p:'We check who\'s raising once. One sitting, about ten minutes, and documents are the only paperwork step.'};
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
  if(!st[i+1]){ go('entry'); return; }
  go(st[i+1].id);
}
function s1Back(cur){
  var st=s1Steps(), i=-1; st.forEach(function(s,k){ if(s.id===cur) i=k; });
  if(S.update && i===0) return S.update.kind==='individual' ? 'individual' : 'org/'+S.update.id;
  return i>0 ? st[i-1].id : (S.s1.mode!=='visitor' ? 'entry' : 'begin');
}
function finishUpdate(){
  var u=S.update; S.update=null;
  if(u.kind==='individual'){ S.account.individual.pending=u.sections; save(); toast('Sent for expedited review — usually same day'); go('individual'); }
  else {
    var o=findOrg(u.id); o.pending=u.sections; if(u.refresh){ o.refreshPending=true; }
    if(u.sections.indexOf('orgdetails')>=0) o.details=clone(S.s1.org);
    save(); toast('Sent for expedited review — usually same day'); go('org/'+u.id);
  }
}

/* Step 1 — quick intent */
function viewStart(){
  var card='<div class="ob-card"><h2>Tell us about your cause</h2><p class="lead">Cause and country decide which documents we\'ll ask for, so we only ask for what applies to you.</p>'+formErr()+'<div class="ob-form">'+
    field({k:'s1.intent.name', label:'Your name or group name', req:1, placeholder:'The name donors will recognise'})+
    '<div class="ob-row">'+field({k:'s1.intent.cause', label:'Cause category', req:1, type:'select', options:CAUSES})+field({k:'s1.intent.country', label:'Country of operation', req:1, type:'select', options:COUNTRIES})+'</div>'+
    field({k:'s1.intent.purpose', label:'What are you raising funds for?', req:1, type:'textarea', rows:3, maxlen:300, placeholder:'One or two sentences is plenty.', hint:'Read by our review team only — nothing here is public yet.'})+
    '</div>'+actions({back:s1Back('start'), next:'Continue'})+'</div>';
  return s1Shell('start', card);
}

/* Step 2 — account / magic link */
function viewAccount(){
  var a=S.s1.account, card;
  if(a.exists){
    card='<div class="ob-card"><h2>You already have an account</h2><p class="lead">There is already an account on Agathos with this email address: <b>'+h(a.email.toLowerCase().trim())+'</b></p>'+
      '<div class="ob-actions"><button class="ob-btn text" type="button" data-act="changeEmail">Use a different email</button><div class="r"><button class="ob-btn primary" type="button" data-act="loginExisting">Log in →</button></div></div></div>';
  } else if(a.sent){
    card='<div class="ob-card"><h2>Check your inbox</h2><p class="lead">We sent a sign-in link to <b>'+h(a.email)+'</b>. It also works later — if you step away, the same link brings you back to where you left off.</p>'+
      '<div class="ob-inbox"><div class="ic">'+I.mail+'</div><div><b>Open the link to continue</b><p>Links expire after 24 hours. Didn\'t get it? Check spam, or <a href="#" data-act="resend">send it again</a>.</p><div class="acts"><button class="ob-btn primary" type="button" data-act="openLink">Demo: open the link →</button><button class="ob-btn text" type="button" data-act="changeEmail">Use a different email</button></div></div></div>'+
      '</div>';
  } else {
    card='<div class="ob-card"><h2>Create your account</h2><p class="lead">We\'ll email you a secure link — no password to remember. This is also how you come back if you need to stop halfway.</p>'+formErr()+'<div class="ob-form">'+
      field({k:'s1.account.email', label:'Email address', req:1, type:'email', placeholder:'you@organisation.org', hint:'Becomes your login.'})+
      field({k:'s1.account.phone', label:'Phone number', opt:1, type:'tel', placeholder:'+65', hint:'For SMS reminders and verification.'})+
      '</div>'+actions({back:s1Back('account'), next:'Send me the link', act:'sendLink', noArrow:1})+'</div>';
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
  var d=S.s1.docs;
  if(!d.fullName && S.account.individual) d.fullName=S.account.individual.name;
  var card='<div class="ob-card"><h2>Verify your identity</h2><p class="lead">This is the only paperwork step. Everything you upload is seen by our review team only and never shown to donors.</p>'+formErr()+'<div class="ob-form">'+
    field({k:'s1.docs.fullName', label:'Full legal name', req:1, placeholder:'Exactly as on your ID'})+
    upload({k:'s1.docs.idFile', label:'Government-issued ID', req:1, hint:'Passport, NRIC or national ID. Front and back on one page is fine.'})+
    upload({k:'s1.docs.addressFile', label:'Proof of address', req:1, hint:'A utility bill or bank statement from the last three months.'})+
    upload({k:'s1.docs.letterFile', label:'Supporting letter', opt:1, hint:'From a beneficiary, hospital or community leader. Not required, but it helps with the trust badge later.'})+
    '</div>'+actions({back:s1Back('docs'), next:'Continue'})+'</div>';
  return s1Shell('docs', card);
}

/* ---- organisation verification: the questions of the live "Create Organization Page" form, same wording,
   grouped into five short steps: quick facts first, writing and files once the person has started ---- */
var FILE_TYPES='PDF, Word, Excel, JPG, PNG (max 20MB)';
function orgNext(id){ return S.update && s1Steps().slice(-1)[0].id===id ? 'Send for review' : 'Next'; }
function orgPrep(){
  return '<div class="ob-prep"><b>Before you start, have these ready</b><ul>'+
    '<li>Your registration number</li>'+
    '<li>Your registration certificate, in English</li>'+
    '<li>Your latest financial statements or annual report</li>'+
    '<li>A bank statement showing the account name. Not needed if your organization is in Singapore and can offer tax deductions.</li>'+
    '</ul></div>';
}
function viewOrgDetails(){
  var o=S.s1.org;
  var card='<div class="ob-card"><h2>Organization Details</h2><p class="lead">Let\'s get started with a few details about your organization.</p>'+(S.update?'':orgPrep())+formErr()+'<div class="ob-form">'+
    field({k:'s1.org.name', label:'Organization Name', req:1})+
    field({k:'s1.org.country', label:'What country is your organization incorporated in?', req:1, type:'select', options:COUNTRIES, placeholder:'Select Answer'})+
    field({k:'s1.org.registered', label:'Is your organization a registered charity/non-profit in this country?', req:1, type:'select', options:YES_NO, placeholder:'Select Answer'})+
    field({k:'s1.org.regNo', label:'Organization\'s registration number', req:1, placeholder:'Eg. UEN, Charity Registration Number etc'})+
    (o.country==='Singapore'?'<div class="ob-reveal">'+field({k:'s1.org.taxDeduction', label:'Can you offer tax deductions to donors? (only for organizations incorporated in Singapore)', type:'select', options:YES_NO, placeholder:'Select Answer'})+'</div>':'')+
    field({k:'s1.org.size', label:'What is the size of your organization?', type:'select', options:[], placeholder:'Select Answer', hint:'Answer list to copy from the live form.'})+
    '</div>'+actions({back:s1Back('orgdetails'), next:orgNext('orgdetails')})+'</div>';
  return s1Shell('orgdetails', card);
}
function viewOrgContact(){
  var card='<div class="ob-card"><h2>Contact</h2><p class="lead">How donors and our team can reach your organization.</p>'+formErr()+'<div class="ob-form">'+
    '<div class="ob-row">'+field({k:'s1.org.email', label:'Organization Email', req:1, type:'email'})+field({k:'s1.org.phone', label:'Organization Phone Number', req:1, type:'tel', placeholder:'+65'})+'</div>'+
    field({k:'s1.org.address', label:'Organization Address', req:1})+
    field({k:'s1.org.website', label:'Please provide a link to the main website of your organization', type:'url', placeholder:'Your website'})+
    '</div>'+actions({back:s1Back('orgcontact'), next:orgNext('orgcontact')})+'</div>';
  return s1Shell('orgcontact', card);
}
function viewOrgCause(){
  var card='<div class="ob-card"><h2>Causes</h2><p class="lead">What your organization does, and where.</p>'+formErr()+'<div class="ob-form">'+
    multiChips({k:'s1.org.causes', label:'What causes does your organization support', req:1, max:3, note:'Please select up to 3 causes', options:CAUSES})+
    multiSelect({k:'s1.org.operate', label:'What countries does your organization operate in?', req:1, options:COUNTRIES, placeholder:'Select Answer'})+
    field({k:'s1.org.about', label:'Tell us more about the cause your organization supports', req:1, type:'textarea', rows:5, maxlen:2000, note:'In no more than 2000 words', placeholder:'Eg. The activities your organization engages in, populations served etc.', hint:'Also starts your organization page.'})+
    field({k:'s1.org.platforms', label:'Has your organization registered with other giving platforms? If so, please list them', type:'textarea', rows:3, maxlen:500, placeholder:'Write your answer'})+
    '</div>'+actions({back:s1Back('orgcause'), next:orgNext('orgcause')})+'</div>';
  return s1Shell('orgcause', card);
}
function viewOrgDocs(){
  var card='<div class="ob-card"><h2>Documents</h2><p class="lead">Submit the required documents to verify your organization.</p>'+formErr()+'<div class="ob-form">'+
    upload({k:'s1.org.certFile', label:'Please upload the registration certificate of your organization in English', req:1, cta:'Click to upload file', types:'Accepted file types: '+FILE_TYPES})+
    upload({k:'s1.org.finFile', label:'Please upload the latest Financial Statements or Annual Report of your organization', req:1, cta:'Click to upload file', types:'Accepted file types: '+FILE_TYPES})+
    (isIpc()
      ? note('<b>No bank statement needed.</b> You can offer tax deductions in Singapore, so payouts are set up directly with AXS.')
      : upload({k:'s1.org.bankFile', label:'Please upload a Bank Statement showing the name of the account', req:1, cta:'Click to upload file', types:'Accepted file types: '+FILE_TYPES}))+
    '</div>'+actions({back:s1Back('orgdocs'), next:orgNext('orgdocs')})+'</div>';
  return s1Shell('orgdocs', card);
}
function viewRisk(){
  var o=S.s1.org, upd=!!S.update;
  var card='<div class="ob-card"><h2>Risk declaration</h2><p class="lead">Provide risk-related information to ensure compliance.</p>'+formErr()+'<div class="ob-form">'+
    field({k:'s1.org.sanctions', label:'Are there any known sanctions or negative media reports related to your organization, owners, or directors?', req:1, type:'select', options:YES_NO, placeholder:'Select Answer'})+
    (o.sanctions==='yes'?'<div class="ob-reveal">'+field({k:'s1.org.sanctionsDetail', label:'If yes, please provide brief details', req:1, type:'textarea', rows:3, maxlen:500, placeholder:'Write your answer'})+'</div>':'')+
    field({k:'s1.org.peps', label:'Are there any known Politically Exposed Persons (PEPs) involved with your organization?', req:1, type:'select', options:YES_NO, placeholder:'Select Answer'})+
    (upd?'':field({k:'s1.org.heard', label:'How did you come to know about Agathos?', type:'select', options:[], placeholder:'Select Answer', hint:'Answer list to copy from the live form.'}))+
    '</div>'+(upd?'':'<div class="ob-sec">'+checkbox({k:'s1.confirm', req:1, plain:1, t:'By submitting this information, I confirm that it is true and accurate to the best of my knowledge, and that I am a valid representative of the organization. I also agree to Agathos\' <a href="#">Terms and Conditions</a>.', msg:'Please confirm before submitting'})+
    '<div style="margin-top:14px">'+note('<b>Reviewed within 1–2 business days.</b> We\'ll email '+h(o.email||S.auth.email)+' as soon as there\'s news.')+'</div></div>')+
    actions({back:s1Back('risk'), next:upd?'Send for review':'Submit', act:upd?'next':'submit', noArrow:1})+'</div>';
  return s1Shell('risk', card);
}
function matchOrg(){
  var d=S.s1.org||{}, reg=(d.regNo||'').toLowerCase().replace(/\s+/g,''), name=(d.name||'').toLowerCase();
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
  if(s.mode==='visitor' && S.path!=='org') secs.push(sec('Who is raising','type',[row('Type', ind?'Individual or informal group':'Registered charity or nonprofit')]));
  secs.push(sec('Identity','docs',[row('Full legal name',h(s.docs.fullName)), row('Government ID',fileChip(s.docs.idFile)), row('Proof of address',fileChip(s.docs.addressFile)), row('Supporting letter',fileChip(s.docs.letterFile))]));
  secs.push(sec('Contact & authority','contact',[row('Primary contact',h(s.contact.name)+(s.contact.role?' · '+h(s.contact.role):'')), row('Email',h(s.contact.email)), row('Phone',h(s.contact.phone)), row('Withdrawals',h(s.contact.authority))]));
  secs.push(sec('Payout','payout',[row('Account holder',h(s.payout.holder)), row('Bank',h(s.payout.bank)), row('Account',s.payout.account?'•••• '+h(s.payout.account.slice(-4)):''), row('Proof of account',fileChip(s.payout.proofFile)), row('Schedule',h({monthly:'Monthly',weekly:'Weekly',ondemand:'On request'}[s.payout.schedule]||'Monthly'))]));
  var card='<div class="ob-card"><h2>Review and submit</h2><p class="lead">Check everything once. You can still edit after submitting, right up until our team starts the review.</p>'+formErr()+'<div class="ob-review">'+secs.join('')+'</div>'+
    '<div class="ob-sec">'+note('<b>Reviewed within 1–2 business days.</b> We\'ll email '+h(s.contact.email||s.account.email||S.auth.email)+' as soon as there\'s news, and only ask for more if something is unclear.')+
    '<div style="margin-top:18px">'+checkbox({k:'s1.confirm', req:1, t:'The information above is accurate and I agree to the <a href="#">Terms of Use</a>.', msg:'Please confirm before submitting'})+'</div></div>'+
    actions({back:s1Back('review'), next:'Submit for review', act:'submit', noArrow:1})+'</div>';
  return s1Shell('review', card);
}

function viewSubmitted(){
  var email=S.s1.contact.email||(S.s1.org&&S.s1.org.email)||S.s1.account.email||S.auth.email;
  var body='<div class="ob-card ob-result"><div class="ic">'+I.clock+'</div><h2>Submitted — we\'re on it</h2><p class="lead">A member of our team will verify your submission and get back to you within <b>1–2 business days</b> at '+h(email)+'.</p>'+
    '<div class="ob-next">'+({
      cause:[['We verify','1–2 business days. We\'ll only write if something is unclear.'],['You propose a project','A short form. We\'ll call to talk it through.'],['You build and launch','Once the project is approved, build the page and choose when it goes live.']],
      org:[['We verify','1–2 business days. We\'ll only write if something is unclear.'],['You set up your page','An introduction, your logo, and donations for running costs.'],['You publish it','Now, on a date you pick, or keep it as a draft.']],
      event:[['We verify','1–2 business days. We\'ll only write if something is unclear.'],['You create your event','In the event form, with you as the host.'],['You publish it','When you\'re ready.']]
    })[pathKey()].map(function(x,i){ return '<div><span class="n">'+(i+1)+'</span><b>'+x[0]+'</b><p>'+x[1]+'</p></div>'; }).join('')+'</div>'+
    '<div class="acts"><a class="ob-btn ghost" href="#/dashboard">Go to my dashboard</a><button class="ob-btn gold" type="button" data-act="demoApprove">Demo: approve now →</button></div></div>';
  return center({kicker:kicker(), h1:S.s1.type==='individual'?'Thank you, '+h(firstName(S.s1.contact.name||S.auth.name||'friend')):'Thank you', p:'', body:body});
}

/* ============================================================================
   LOGGED-IN ENTRY, RETURNING USERS
   ============================================================================ */
function expiryBanner(){
  var out='';
  S.account.orgs.forEach(function(o){
    var d=daysUntil(o.expiresOn);
    if(d>0 && d<=30 && !o.refreshPending) out+='<div class="ob-banner"><div class="ic">'+I.clock+'</div><div><b>'+h(o.name)+'\'s verification needs a quick refresh by '+fmtDate(o.expiresOn)+'</b><p>Registration and charitable status are re-checked yearly. It takes a couple of minutes — want to do it now while you\'re here?</p><div class="acts"><button class="ob-btn primary sm" type="button" data-act="refresh" data-org="'+o.id+'">Refresh now →</button><button class="ob-btn text sm" type="button" data-go="entry">Later</button></div></div></div>';
  });
  var ind=S.account.individual;
  if(ind && daysUntil(ind.idExpires)<=30 && !ind.pending) out+='<div class="ob-banner"><div class="ic">'+I.clock+'</div><div><b>Your ID on file expires in '+daysUntil(ind.idExpires)+' days</b><p>Upload the renewed ID when you have it so payouts aren\'t interrupted.</p><div class="acts"><button class="ob-btn primary sm" type="button" data-act="indUpdate" data-sections="docs">Update ID →</button></div></div></div>';
  return out;
}
function pageStatus(o){
  var pg=o.page||{status:'none'};
  return {none:'No organisation page yet', draft:'Page saved as a draft', scheduled:'Page goes live '+fmtDateTime(pg.publishAt), live:'Page is live'}[pg.status];
}
function orgRow(o){
  var open = S.path==='org' ? 'data-go="orgpage/'+o.id+'"' : S.path==='event' ? 'data-go="event/'+o.id+'"' : 'data-act="orgStart" data-org="'+o.id+'"';
  var meta = S.path==='org' ? pageStatus(o) : 'Verified since '+fmtDate(o.verifiedSince)+' · Last active '+fmtDate(o.lastActive);
  return '<button class="ob-org" type="button" '+open+'><span class="av">'+initials(o.name)+'</span><span class="t"><b>'+h(o.name)+' '+roleBadge(o.role)+'</b><span>'+meta+'</span></span><span class="chev">'+I.chev+'</span></button>';
}
function addOrgRow(){
  return '<button class="ob-org add" type="button" data-act="addOrg"><span class="av">'+I.plus+'</span><span class="t"><b>Add an organisation</b><span>Verify a charity or nonprofit you\'re part of</span></span><span class="chev">'+I.chev+'</span></button>';
}
function indRow(){
  var ind=S.account.individual, ev=S.path==='event';
  var title = ev ? (ind?'Host as '+h(ind.name):'Host as an individual') : (ind?'Continue as '+h(ind.name):'Start an individual project');
  var sub = ev ? 'Opens the Create Event form' : (ind ? 'Verified since '+fmtDate(ind.verifiedSince)+' — no re-verification needed' : 'Raise for a personal cause or an informal group');
  return '<button class="ob-org add" type="button" data-go="'+(ev?'event/personal':'individual')+'"><span class="av">'+I.user+'</span><span class="t"><b>'+title+'</b><span>'+sub+'</span></span><span class="chev">'+I.chev+'</span></button>';
}
function remindHtml(c){
  if(c.status!=='scheduled' && c.status!=='draft') return '';
  var since=Math.max(0,-daysUntil(c.approvedOn||addDays(0)));
  return '<div class="ob-remind">Reminders until it\'s published:'+[3,7,14].map(function(d){ var next=[3,7,14].filter(function(x){ return x>since; })[0]; return '<i class="'+(d===next?'next':'')+'">day '+d+(d===next?' · '+fmtDate(addDays(d-since)):'')+'</i>'; }).join('')+'</div>';
}

function viewEntry(){
  if(!PATHS[S.path]){ go('begin'); return ''; }
  var orgs=S.account.orgs, ind=S.account.individual, name=firstName(S.auth.name), head, rows;
  if(S.path==='org'){
    head = orgs.length ? ['Which organisation?','Pick the one whose page you want to set up, or add a new one.'] : ['Add your organisation','Verify it once. Its page, projects and events all build on it.'];
    rows = orgs.map(orgRow).join('')+addOrgRow();
  } else if(S.path==='event'){
    head = ['Who is hosting?','Host for an organisation, or as an individual.'];
    rows = orgs.map(orgRow).join('')+addOrgRow()+indRow();
  } else {
    head = orgs.length ? ['Who is this project for?','Pick an organisation, add a new one, or raise as an individual.'] : (ind ? ['Pick up where you left off','You\'re verified as an individual. Add an organisation if you\'re raising on behalf of one.'] : ['Who is raising?','Verify once for an organisation, or as an individual. You only do this once.']);
    rows = orgs.map(orgRow).join('')+addOrgRow()+indRow();
  }
  var body='<a class="ob-btn text" href="#/begin" style="margin:-16px 0 8px -4px">← Back</a>'+expiryBanner()+'<div class="ob-card"><h2>'+head[0]+'</h2><p class="lead">'+head[1]+'</p><div class="ob-orglist">'+rows+'</div></div>';
  return center({kicker:kicker(), h1:name?'Welcome back, '+h(name):'Welcome back', p:'', body:body});
}

function orgSummary(o){
  var d=daysUntil(o.expiresOn), warnB = d>0 && d<=30 && !o.refreshPending;
  var pend = o.pending && o.pending.length ? '<div class="ob-banner info" style="margin-top:22px"><div class="ic">'+I.clock+'</div><div><b>'+h(o.pending.map(function(s){ var l=UPDATE_LABELS[s]; return l.charAt(0).toUpperCase()+l.slice(1); }).join(', '))+' under expedited review</b><p>Usually same day. You can carry on meanwhile.</p></div></div>' : '';
  var refreshed = o.refreshPending ? '<div class="ob-banner ok" style="margin-top:22px"><div class="ic">'+I.check+'</div><div><b>Refresh submitted</b><p>We\'ll confirm within a business day. Nothing else changes for you.</p></div></div>' : '';
  return '<div class="ob-recog"><div class="av">'+initials(o.name)+'</div><div class="t">'+(warnB?badge('warn','Verification refresh due in '+d+' days'):badge('verified','Verified since '+fmtDate(o.verifiedSince)))+'<h2>'+h(o.name)+'</h2><p>Registered charity · '+h(o.country)+' · You\'re '+(o.role==='Owner'?'the owner':'a manager')+'</p></div></div>'+
    '<div class="ob-facts"><div><span>Registration</span>'+h(o.regMasked)+'</div><div><span>Organization email</span>'+h((o.details&&o.details.email)||'—')+'</div><div><span>Payouts</span>'+h(o.payoutMasked)+'</div><div><span>Valid until</span>'+fmtDate(o.expiresOn)+'</div></div>'+pend+refreshed;
}
/* starting a project for an org you own or admin: confirm its details once, in a modal */
function orgConfirm(id){
  var o=findOrg(id);
  var phases='<ol class="ob-phases">'+['Confirm','Propose','Build','Launch'].map(function(t,i){ return '<li'+(i===0?' class="current"':'')+'><span class="n">'+(i+1)+'</span>'+t+'</li>'; }).join('')+'</ol>';
  modal('<button class="ob-x" type="button" data-act="modalClose" aria-label="Close">×</button>'+phases+orgSummary(o)+
    '<p class="ob-confirm-q">Are these details still accurate?</p>'+
    '<div class="acts"><button class="ob-btn ghost" type="button" data-act="orgChanged" data-org="'+id+'">Something changed</button><button class="ob-btn primary" type="button" data-act="startOrgProject" data-org="'+id+'">Yes, continue →</button></div>');
}
function viewOrg(id){
  var o=findOrg(id); if(!o){ go('entry'); return ''; }
  S.selectedOrg=id; save();
  var back='<a class="ob-btn text" href="#/dashboard" style="margin:-16px 0 8px -4px">← Dashboard</a>';
  var body='<div class="ob-card">'+orgSummary(o)+
    '<div class="ob-actions"><button class="ob-btn text" type="button" data-go="org/'+id+'/changes">Something changed? Update details</button><div class="r"><button class="ob-btn primary" type="button" data-act="orgStart" data-org="'+id+'">Start a new project →</button></div></div></div>';
  return center({kicker:'Your organisation', h1:'Organisation details', p:'', body:back+expiryBanner()+body});
}

function viewChanges(id){
  var o=findOrg(id); if(!o){ go('entry'); return ''; }
  var body='<div class="ob-card"><h2>What\'s changed?</h2><p class="lead">Tick what\'s different. Only those sections reopen, and only they get re-reviewed — usually the same day.</p>'+formErr()+'<div class="ob-checklist">'+
    checkbox({k:'chg.orgdetails', t:'Organization details', d:'Name, registration number, contact details, causes or website.'})+
    checkbox({k:'chg.orgdocs', t:'Documents', d:o.ipc?'Registration certificate or financial statements.':'Registration certificate, financial statements or bank statement.'})+
    checkbox({k:'chg.risk', t:'Risk declaration', d:'Sanctions, negative media, or politically exposed persons.'})+
    '</div><div class="ob-actions"><button class="ob-btn ghost" type="button" data-go="org/'+id+'">← Back</button><div class="r"><button class="ob-btn primary" type="button" data-act="startUpdate" data-org="'+id+'">Update these →</button></div></div></div>';
  return center({kicker:'Update details', h1:h(o.name), p:'', body:body});
}

function viewIndividual(){
  var ind=S.account.individual;
  if(!ind){
    if(S.auth.loggedIn && S.s1.mode!=='addind') S.s1={mode:'addind', intent:{}, account:{}, type:'individual', org:{}, docs:{}, contact:{}, payout:{}, done:{}, status:'draft'};
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
  return center({kicker:kicker(), h1:'Welcome back, '+h(firstName(ind.name)), p:'', body:(S.account.orgs.length?'<a class="ob-btn text" href="#/entry" style="margin:-16px 0 8px -4px">← Back</a>':'')+expiryBanner()+body});
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
  return center({kicker:kicker(), h1:'Almost there', p:'', body:body});
}

/* ============================================================================
   SESSION 2 — project build & launch
   ============================================================================ */
var S2_STEPS=[
  {id:'build/proposal', lbl:'Proposal', sub:'Reviewed by our team'},
  {id:'build/page', lbl:'Project page', sub:'Story and photos'},
  {id:'build/goal', lbl:'Goal & dates', sub:'All optional'},
  {id:'build/team', lbl:'Team', sub:'Optional'},
  {id:'build/launch', lbl:'Launch', sub:'Now, later, or draft'}
];
function s2Project(){ return S.account.projects.filter(function(c){ return c.id===S.s2.projectId; })[0]; }
function s2Shell(cur, card){
  var o=currentOrg(), ind=S.account.individual, who=o?o.name:(ind?ind.name:S.auth.name), prop=cur==='build/proposal';
  var noteHtml='<b>'+(prop?'Proposing for ':'Building for ')+h(who)+'</b>'+badge('verified','Verified')+'<div style="margin-top:8px">'+(prop?'We review every project and talk it through with you before the page goes up.':'Saved as you go. Come back any time from your dashboard.')+'</div>';
  var head = prop
    ? {kicker:'Raise funds for a cause', h1:'Propose your project', p:'A short proposal first. Once we\'ve talked it through and approved it, you build the page.'}
    : {kicker:'Build your project page', h1:'Now the good part', p:'Your project is approved. Tell the story, set a goal if you want one, and choose when to go live.'};
  return shell({steps:S2_STEPS, cur:cur, done:S.s2.done, kicker:head.kicker, h1:head.h1, p:head.p, card:card, note:noteHtml});
}
function s2Advance(cur){
  var i=-1; S2_STEPS.forEach(function(s,k){ if(s.id===cur) i=k; });
  S.s2.done[cur]=true; save(); go(S2_STEPS[i+1].id);
}

/* every project starts as a proposal: we review it and call before the page is built */
function viewProposal(){
  var c=s2Project(), card;
  if(c){
    var st = c.status==='review' ? '<b>In review.</b> We\'ll contact you to schedule a call.' : '<b>Approved.</b> Build the page, then choose when it goes live.';
    card='<div class="ob-card"><h2>Project proposal</h2><p class="lead">Sent '+fmtDate(c.submittedOn||addDays(0))+'.</p>'+note(st)+
      '<div class="ob-review" style="margin-top:22px"><div class="sec"><h3>Proposal</h3><dl><dt>Project title</dt><dd>'+h(c.name)+'</dd><dt>Cause</dt><dd>'+(h(c.cause)||'<span class="none">—</span>')+'</dd><dt>Country</dt><dd>'+(h(c.country)||'<span class="none">—</span>')+'</dd><dt>Summary</dt><dd>'+(h(c.summary)||'<span class="none">—</span>')+'</dd><dt>Rough fund goal</dt><dd>'+(c.goalEst?money(c.goalEst):'<span class="none">—</span>')+'</dd></dl></div></div>'+
      '<div class="ob-actions"><a class="ob-btn ghost" href="#/dashboard">Go to my dashboard</a><div class="r">'+(c.status==='review'?'':'<button class="ob-btn primary" type="button" data-go="build/page">Continue building →</button>')+'</div></div></div>';
    return s2Shell('build/proposal', card);
  }
  card='<div class="ob-card"><h2>Project proposal</h2><p class="lead">Tell us what the project is. We read every proposal and call you to talk it through before the page is built.</p>'+formErr()+'<div class="ob-form">'+
    field({k:'s2.proposal.name', label:'Project title', req:1, maxlen:80, placeholder:'What you\'re raising for, in a few words'})+
    '<div class="ob-row">'+field({k:'s2.proposal.cause', label:'Cause', req:1, type:'select', options:CAUSES})+field({k:'s2.proposal.country', label:'Country', req:1, type:'select', options:COUNTRIES})+'</div>'+
    field({k:'s2.proposal.summary', label:'What is the project, and who does it help?', req:1, type:'textarea', rows:4, maxlen:600, placeholder:'Two or three sentences.'})+
    field({k:'s2.proposal.goal', label:'Rough fund goal (S$)', opt:1, type:'number', placeholder:'0', hint:'Leave it empty if you\'re not sure yet.'})+
    '</div><div class="ob-sec">'+note('<b>What happens next.</b> We\'ll contact you to schedule a call. Once the project is approved, you build the page and choose when it goes live.')+'</div>'+
    actions({back:'entry', next:'Submit for review', act:'submitProposal', noArrow:1})+'</div>';
  return s2Shell('build/proposal', card);
}

function viewPage(){
  var b=S.s2.basics, imgs=b.images||[], c=s2Project();
  if(c){ if(!b.name) b.name=c.name; if(!b.cause && c.cause) b.cause=c.cause; if(!b.country && c.country) b.country=c.country; }
  var gallery='<div class="ob-field" data-field="s2.basics.images"><label>Cover image and gallery<span class="req">*</span></label><div class="ob-upload-grid">'+
    imgs.map(function(im,i){ return '<div class="thumb">'+(i===0?'<span class="tag">Cover</span>':'')+'<span>'+h(im.name)+'</span><button type="button" data-act="rmImg" data-i="'+i+'" aria-label="Remove">×</button></div>'; }).join('')+
    '<div class="ob-upload empty" data-up="s2.basics.images"'+(imgs.length?'':' data-req="1"')+'><div class="ic">'+I.upload+'</div><div><div class="t">'+(imgs.length?'Add more':'Add photos')+'</div></div><input type="file" accept="image/*" multiple data-upimg="1"></div>'+
    '</div><div class="hint">The first photo is the cover. Show real people and places: faces, warm natural light, no stock photos and no text on the image.</div><div class="msg">Add at least one photo</div></div>';
  var card='<div class="ob-card"><h2>Project page</h2><p class="lead">What donors see. Keep the title short and the story honest. You can add updates as things happen.</p>'+formErr()+'<div class="ob-form">'+
    field({k:'s2.basics.name', label:'Project title', req:1, maxlen:80, placeholder:'What you\'re raising for, in a few words'})+
    '<div class="ob-row">'+field({k:'s2.basics.type', label:'Project type', req:1, type:'select', options:PROJECT_TYPES})+field({k:'s2.basics.cause', label:'Cause', req:1, type:'select', options:CAUSES})+'</div>'+
    '<div class="ob-row">'+field({k:'s2.basics.country', label:'Country', req:1, type:'select', options:COUNTRIES})+field({k:'s2.basics.city', label:'City', opt:1})+'</div>'+
    field({k:'s2.basics.intro', label:'Introduction', req:1, type:'textarea', toolbar:1, rows:5, maxlen:3000, placeholder:'Who is this for, and what will change?'})+
    field({k:'s2.basics.background', label:'Background & Context', opt:1, type:'textarea', rows:4, maxlen:3000, placeholder:'How the need came about, and your history with it.'})+
    field({k:'s2.basics.scope', label:'Scope & Activities', opt:1, type:'textarea', rows:4, maxlen:3000, placeholder:'What you\'ll do, and roughly when.'})+
    gallery+
    '</div>'+actions({back:'build/proposal', next:'Continue'})+'</div>';
  return s2Shell('build/page', card);
}

function viewGoal(){
  var g=S.s2.goal, c=s2Project();
  if(c && g.amount==null && c.goalEst) g.amount=c.goalEst;
  var card='<div class="ob-card"><h2>Goal & dates</h2><p class="lead">All optional. A goal helps donors see progress, but a project can also raise without one.</p>'+formErr()+'<div class="ob-form">'+
    field({k:'s2.goal.amount', label:'Fund goal (S$)', opt:1, type:'number', placeholder:'0', hint:'Leave it empty to raise without a goal. Donors still see the total raised.'})+
    '<div class="ob-row">'+field({k:'s2.goal.start', label:'Start date', opt:1, type:'date'})+field({k:'s2.goal.endDate', label:'Fundraising end date', opt:1, type:'date', hint:'Leave it empty to keep raising until you close the project.'})+'</div>'+
    '</div>'+
    '<div class="ob-sec">'+note('<b>Agathos love gift.</b> We don\'t charge a platform fee. Donors are invited to add a love gift on top of their donation, and project owners typically set aside 10% of funds raised. To arrange a different share, write to <a href="mailto:rachel@agathos.be">rachel@agathos.be</a>.')+'</div>'+
    actions({back:'build/page', next:'Continue', skip:'skipGoal'})+'</div>';
  return s2Shell('build/goal', card);
}

function viewTeam(){
  var t=S.s2.team;
  var rows=t.length?'<div class="ob-team">'+t.map(function(m,i){ return '<div class="row"><span class="av">'+initials(m.email.split('@')[0].replace(/[._-]/g,' '))+'</span><span class="t">'+h(m.email)+'<span class="st">Invite sent</span></span>'+roleBadge(m.role==='manager'?'Manager':'Viewer')+(m.payouts?'<span class="ob-role payout">Payouts</span>':'')+'<button type="button" data-act="rmMember" data-i="'+i+'">Remove</button></div>'; }).join('')+'</div>':'<div class="ob-empty" style="margin-top:16px"><b>Just you for now</b>Invite people any time, before or after launch.</div>';
  var unsent='<div class="ob-banner info ob-unsent" id="inv-unsent" hidden><div class="ic">'+I.mail+'</div><div><b>This invite hasn\'t been sent</b><p id="inv-unsent-email"></p><div class="acts"><button class="ob-btn primary sm" type="button" data-act="inviteAndNext">Invite and continue</button><button class="ob-btn text sm" type="button" data-act="nextNoInvite">Continue without inviting</button></div></div></div>';
  var card='<div class="ob-card"><h2>Who else is on this?</h2><p class="lead">Optional. Managers can edit and publish the project. Viewers can see the numbers, including who gave. Only people with payout permission can request payouts.</p>'+
    '<div class="ob-field"><label>Invite by email</label><div class="ob-inline"><input class="ob-input" type="email" id="inv-email" placeholder="name@organisation.org"><select class="ob-input" id="inv-role" style="max-width:220px">'+ROLES.map(function(r){ return '<option value="'+r[0]+'">'+r[1]+'</option>'; }).join('')+'</select><button class="ob-btn ghost" type="button" data-act="addMember">Invite</button></div>'+
    '<label class="ob-check" style="margin-top:12px"><input type="checkbox" id="inv-pay"> Can request payouts (managers only)</label><div class="hint">Payout permission should match who you named under Contact & authority.</div></div>'+rows+unsent+
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
  var c=s2Project()||{name:S.s2.basics.name};
  var slug=(c.name||'project').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);
  var body='<div class="ob-card ob-result"><div class="ic ok">'+I.sparkle+'</div><h2>Your project is live</h2><p class="lead">Share it with the people who care most first — the first few gifts set the pace for everyone after.</p>'+
    '<div class="ob-link-box"><span>agathos.be/p/'+h(slug)+'</span><button class="ob-btn ghost sm" type="button" data-act="copyLink">Copy link</button></div>'+
    '<div class="acts"><a class="ob-btn primary" href="#">View project page</a><a class="ob-btn ghost" href="#/dashboard">Go to my dashboard</a></div></div>'+
    '<div class="ob-card"><div class="ob-recog"><div class="av" style="background:var(--hp-gold);color:var(--hp-navy)">'+I.star+'</div><div class="t"><h2 style="margin-top:0">Apply for the Agathos Trustmark</h2><p>A badge of trust for donors. Project owners with a good track record can earn it — it lifts donor confidence, visibility on the platform, and signals transparency.</p></div></div>'+
    '<div class="ob-actions"><span></span><div class="r"><a class="ob-btn text" href="#/dashboard">Not now</a><a class="ob-btn gold" href="#">Apply for Trustmark →</a></div></div></div>';
  return center({kicker:'Launched', h1:'🎉 It\'s out there', p:'', body:body});
}

/* ============================================================================
   ORGANISATION PAGE — separate from verification: built from the verified record,
   with an optional general fund for running costs and its own publish date
   ============================================================================ */
function viewOrgPage(id){
  var o=findOrg(id); if(!o){ go('dashboard'); return ''; }
  var pg=o.page||{status:'none'}, live=pg.status==='live', dt=o.details||{};
  if(!S.op || S.op.id!==id){ var f=pg.fund||{}; S.op={id:id, banner:pg.banner||null, logo:pg.logo||null, about:dt.about||'', fundOn:pg.fund?!!f.on:true, purpose:f.purpose||'', mode:'', at:''}; save(); }
  var op=S.op, labels={now:'Publish page', schedule:'Schedule page', draft:'Save as draft'};
  var facts='<div class="ob-facts" style="margin:0 0 8px"><div><span>Causes</span>'+h((dt.causes||[]).join(', ')||'—')+'</div><div><span>Website</span>'+h(dt.website||'—')+'</div><div><span>Organization email</span>'+h(dt.email||'—')+'</div><div><span>Organization phone</span>'+h(dt.phone||'—')+'</div></div>'+
    '<p class="ob-facts-note">From your organization details. To change them, use Update details.</p>';
  var card='<div class="ob-card"><h2>'+(pg.status==='none'?'Set up your organization page':'Your organization page')+'</h2><p class="lead">The public page for '+h(o.name)+'. Its projects and events appear on it automatically.</p>'+formErr()+facts+
    '<div class="ob-form" style="margin-top:22px">'+
    upload({k:'op.banner', label:'Banner Photo', opt:1, cta:'Click to upload file', types:'JPG or PNG'})+
    upload({k:'op.logo', label:'Logo', opt:1, cta:'Click to upload file', types:'JPG or PNG'})+
    field({k:'op.about', label:'Who we are', req:1, type:'textarea', rows:5, maxlen:2000, hint:'Starts from what you told us in your organization details.'})+
    '</div><div class="ob-sec"><div class="ob-sec-head"><h3>Donations for running costs</h3></div>'+
    checkbox({k:'op.fundOn', t:'Take donations for running costs', d:'Adds a Donate button to your page for general support, separate from your projects.'})+
    (op.fundOn?'<div class="ob-form" style="margin-top:18px">'+field({k:'op.purpose', label:'What do these donations pay for?', req:1, type:'textarea', rows:3, maxlen:400, placeholder:'For example: staff, rent and the day-to-day running of our programmes.'})+'</div>':'')+
    '</div>'+
    (live?'':'<div class="ob-sec"><div class="ob-sec-head"><h3>When should the page go live?</h3></div>'+
      choice({k:'op.mode', req:1, cols:3, options:[
        {v:'now', ic:I.rocket, t:'Publish now', d:'Live as soon as you confirm.'},
        {v:'schedule', ic:I.calendar, t:'Schedule a date', d:'Pick the day it goes live.'},
        {v:'draft', ic:I.draft, t:'Save as draft', d:'Keep it private for now.'}
      ]})+
      (op.mode==='schedule'?'<div class="ob-reveal">'+field({k:'op.at', label:'Go live on', req:1, type:'datetime-local', hint:'Singapore time.'})+'</div>':'')+'</div>')+
    actions({back:'dashboard', next:live?'Save changes':(labels[op.mode]||'Save'), act:'savePage', noArrow:1})+'</div>';
  return center({kicker:'Raise funds for your organization', h1:o.name, p:'', body:card});
}

/* events keep the Create Event form the platform already has; this only settles who hosts */
function viewEvent(host){
  var ind=S.account.individual, o=host==='personal'?null:findOrg(host);
  if(host!=='personal' && !o){ go('entry'); return ''; }
  var who=o?o.name:(ind?ind.name:(S.auth.name||S.auth.email)), since=o?o.verifiedSince:(ind?ind.verifiedSince:'');
  var body='<div class="ob-card"><div class="ob-recog"><div class="av">'+initials(who)+'</div><div class="t">'+(since?badge('verified','Verified since '+fmtDate(since)):'')+'<h2>'+h(who)+'</h2><p>'+(o?'Hosting as this organization':'Hosting as an individual')+'</p></div></div>'+
    '<div style="margin-top:22px">'+note('<b>Events use the Create Event form already on Agathos:</b> event page, tickets, and an optional registration form. In the live product, this button opens it with the host filled in. Paid events need onboarding with our payment provider, which is only available with a corporate bank account.')+'</div>'+
    '<div class="ob-actions"><a class="ob-btn ghost" href="#/entry">← Back</a><div class="r"><button class="ob-btn primary" type="button" data-act="openEventForm">Demo: open the event form →</button></div></div></div>';
  return center({kicker:'Host an event', h1:'Create your event', p:'', body:body});
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
    if(S.s1.type==='individual') list[0].pill='Submission Received';
    else list.push({id:'pending', label:'Organization', name:(S.s1.org&&S.s1.org.name)||'Your organisation', pill:'Submission Received'});
  }
  var r=S.requests.access;
  if(r){ var d=DIRECTORY.filter(function(x){ return x.id===r.org; })[0]; list.push({id:'request', label:'Organization', name:d.name, pill:'Request Sent'}); }
  return list;
}
function dashCard(c){
  var st={live:['Ongoing','on'], ended:['Completed','done'], scheduled:['Scheduled','wait'], draft:['Draft','wait'], review:['In review','wait'], building:['Approved','on']}[c.status];
  var left, box;
  if(c.status==='review'){
    left='<button class="ob-btn gold sm" type="button" data-act="demoApproveProject" data-id="'+c.id+'">Demo: approve →</button>';
    box='<div class="r1"><span>Proposal sent: '+fmtDMY(c.submittedOn||addDays(0))+'</span><span class="dc-vis off">Not published</span></div><div class="r2"><b class="sm">We\'ll contact you to schedule a call</b></div>';
  } else if(c.status==='building'){
    left='<button class="ob-btn primary sm" type="button" data-act="continueBuild" data-id="'+c.id+'">Continue building →</button>';
    box='<div class="r1"><span>Approved: '+fmtDMY(c.approvedOn||addDays(0))+'</span><span class="dc-vis off">Not published</span></div><div class="r2"><b class="sm">Build the page, then choose when it goes live</b></div>';
  } else if(c.status==='live'||c.status==='ended'){
    var pct=c.goal?parseFloat((c.raised/c.goal*100).toFixed(2)):0, priv=c.visibility==='private';
    left='<a class="dc-manage" href="#">'+I.draft+'Manage Project</a>';
    box='<div class="r1"><span>Started: '+fmtDMY(c.started)+'</span><span class="dc-vis'+(priv?' priv':'')+'">'+(priv?'Private':'Public')+'</span></div>'+
      '<div class="r2"><b>'+(c.raised?money(c.raised):'0')+'</b>'+(c.contributions?'<span>'+c.contributions+' contributions</span>':'')+'</div>'+
      (c.goal?'<div class="bar"><i style="width:'+Math.min(100,pct)+'%"></i></div><div class="r3">'+pct+'% of '+money(c.goal)+'</div>':'');
  } else {
    left='<button class="dc-manage" type="button" data-act="manageProject" data-id="'+c.id+'" data-step="'+(c.status==='scheduled'?'build/launch':'build/page')+'">'+I.draft+'Manage Project</button><button class="ob-btn primary sm" type="button" data-act="publishNow" data-id="'+c.id+'">Publish now</button>';
    box='<div class="r1"><span>Approved: '+fmtDMY(c.approvedOn||addDays(0))+'</span><span class="dc-vis off">Not published</span></div>'+
      '<div class="r2"><b class="sm">'+(c.status==='scheduled'?'Goes live '+fmtDateTime(c.scheduledFor):'Saved as a draft')+'</b></div>'+remindHtml(c);
  }
  return '<div class="dc"><div class="dc-img"><span class="dc-st '+st[1]+'">'+st[0]+'</span></div><div class="dc-main"><h3>'+h(c.name)+'</h3><div class="dc-acts">'+left+'</div></div><div class="dc-stats">'+box+'</div></div>';
}
function dashOrgPage(o){
  var pg=o.page||{status:'none'}, f=pg.fund||{};
  var st={none:['Not set up','off'], draft:['Draft','wait'], scheduled:['Scheduled','wait'], live:['Live','on']}[pg.status];
  var fund = f.on ? '<div class="op-fund"><span>Running costs</span><b>'+(f.raised?money(f.raised):'0')+'</b>'+(f.contributions?'<em>'+f.contributions+' contributions</em>':'')+'</div>' : '';
  return '<div class="op-card"><div class="t"><div class="op-h"><b>Organization page</b><span class="op-st '+st[1]+'">'+st[0]+'</span>'+(pg.status==='scheduled'?'<span class="op-when">Goes live '+fmtDateTime(pg.publishAt)+'</span>':'')+'</div>'+
    '<p>'+(pg.status==='none'?'One page for this organization: its projects and events in one place, and donations for running costs.':h((o.details&&o.details.about)||''))+'</p></div>'+fund+
    '<a class="ob-btn '+(pg.status==='none'?'primary':'ghost')+' sm" href="#/orgpage/'+o.id+'">'+(pg.status==='none'?'Set up page':'Edit page')+'</a></div>';
}
function dashActions(o){
  var items='<a href="#/orgpage/'+o.id+'">Organization page</a><a href="#/org/'+o.id+'">Organization details</a>';
  items+='<a href="#/org/'+o.id+'/changes">Update details</a>';
  var d=daysUntil(o.expiresOn); if(d>0 && d<=30 && !o.refreshPending) items+='<button type="button" data-act="refresh" data-org="'+o.id+'">Refresh verification</button>';
  return '<div class="dash-actions"><button type="button" class="dash-act-btn" data-act="dashMenu">Actions<span aria-hidden="true">⋮</span></button><div class="dash-menu">'+items+'</div></div>';
}
function dashPending(){
  return '<div class="dash-pending">'+note('<b>Submission received.</b> We review within 1–2 business days and email '+h(S.s1.contact.email||(S.s1.org&&S.s1.org.email)||S.s1.account.email||S.auth.email)+' when there\'s news.')+
    '<div class="acts"><a class="ob-btn ghost sm" href="#/review">View submission</a><button class="ob-btn gold sm" type="button" data-act="demoApprove">Demo: approve now →</button></div></div>';
}
function dashRequest(){
  var r=S.requests.access, d=DIRECTORY.filter(function(x){ return x.id===r.org; })[0];
  var due=new Date(r.sent); due.setDate(due.getDate()+5);
  var msg = r.kind==='join'
    ? '<b>Waiting for the person who applied first ('+h(d.contact)+') to respond.</b> They have until '+fmtDate(due.toISOString().slice(0,10))+'. After that, our team reviews your request.'
    : '<b>Waiting for approval.</b> We\'ve asked the primary contact at '+h(d.name)+' to add you to the team.';
  return '<div class="dash-pending">'+note(msg)+'<div class="acts"><button class="ob-btn gold sm" type="button" data-act="demoJoin">Demo: approve →</button></div></div>';
}
function viewDashboard(){
  var list=dashEntities(), sel=S.dashSel;
  if(!list.some(function(x){ return x.id===sel; })) sel=findOrg(S.selectedOrg) ? S.selectedOrg : (S.account.orgs[0] ? S.account.orgs[0].id : 'personal');
  var e=list.filter(function(x){ return x.id===sel; })[0], o=e.org, tab=S.dashTab==='events'?'events':'projects', panel;
  var nav='<nav class="dash-nav">'+DASH_TABS.map(function(t,i){ var on=i===DASH_TABS.length-1; return '<a href="'+(on?'#/dashboard':'#')+'"'+(on?' class="on"':'')+'><b>'+t[0]+'</b><span>'+t[1]+'</span></a>'; }).join('')+'</nav>';
  var side='<aside class="dash-side"><div class="dash-create"><a class="ob-btn primary sm" href="#/begin">'+I.plus+' Create</a></div>'+list.map(function(x){ return '<button type="button" class="dash-ent'+(x.id===sel?' on':'')+'" data-act="dashSel" data-id="'+x.id+'"><span class="av">'+initials(x.name)+'</span><span class="t"><span>'+x.label+'</span><b>'+h(x.name)+'</b></span>'+(x.pill?'<span class="dash-pill">'+x.pill+'</span>':'')+'</button>'; }).join('')+'</aside>';
  if(e.id==='pending'){
    panel='<div class="dash-head"><div class="t"><h2>'+h(e.name)+'</h2></div></div>'+dashPending();
  } else if(e.id==='request'){
    panel='<div class="dash-head"><div class="t"><h2>'+h(e.name)+'</h2></div></div>'+dashRequest();
  } else {
    var projects=S.account.projects.filter(function(c){ return o ? c.org===o.id : !c.org; });
    var content, ind=S.account.individual;
    var head = o ? '<div class="dash-head"><div class="t"><h2>'+h(o.name)+'</h2><span class="dash-role">'+h(o.role)+'</span></div>'+dashActions(o)+'</div>'+dashOrgPage(o) : (e.pill ? dashPending() : '');
    var tabs='<div class="dash-tabs"><button type="button" class="'+(tab==='projects'?'on':'')+'" data-act="dashTab" data-t="projects">Projects</button><button type="button" class="'+(tab==='events'?'on':'')+'" data-act="dashTab" data-t="events">Events</button>'+
      (tab==='projects'?'<button class="ob-btn gold sm dash-new" type="button" data-act="dashNew" data-id="'+e.id+'">'+I.plus+' New project</button>':'<button class="ob-btn gold sm dash-new" type="button" data-act="dashNewEvent" data-id="'+e.id+'">'+I.plus+' New event</button>')+'</div>';
    if(tab==='events') content='<div class="ob-empty"><b>No events yet</b></div>';
    else if(projects.length) content=projects.map(dashCard).join('');
    else content='<div class="ob-empty"><b>No projects yet</b>'+(o||ind?'':'New project starts with a one-time identity check.')+'</div>';
    panel=head+tabs+'<div class="dash-list">'+content+'</div>';
  }
  return '<div class="ob-wrap">'+nav+expiryBanner()+'<div class="dash">'+side+'<section class="dash-main">'+panel+'</section></div></div>';
}

/* ============================================================================
   ROUTER, EVENTS
   ============================================================================ */
var main=document.getElementById('ob'), lastRoute=null;
function go(p, replace){ var target='#/'+p; if(location.hash===target) render(); else if(replace) location.replace(target); else location.hash=target; }
function parts(){ return location.hash.replace(/^#\/?/,'').split('/').filter(Boolean); }
function render(){
  var p=parts(), r=p[0]||'', html='';
  if(!r){ go(S.auth.loggedIn && S.scenario==='awaiting' ? 'dashboard' : 'begin'); return; }
  if(!S.auth.loggedIn && ['entry','org','orgpage','event','access','build','dashboard'].indexOf(r)>=0){ go('begin'); return; }
  if(r==='build' && ['page','goal','team','launch'].indexOf(p[1])>=0){ var bc=s2Project(); if(!bc || bc.status==='review'){ go('dashboard'); return; } }
  switch(r){
    /* #/new/<path>: footer and in-context buttons skip step 0, the person already knows what they're creating */
    case 'new': if(PATHS[p[1]]) startPath(p[1], true); else go('begin', true); return;
    case 'begin': html=viewBegin(); break;
    case 'start': html=viewStart(); break;
    case 'account': html=viewAccount(); break;
    case 'type': html=viewType(); break;
    case 'docs': html=viewDocs(); break;
    case 'orgdetails': html=viewOrgDetails(); break;
    case 'orgcontact': html=viewOrgContact(); break;
    case 'orgcause': html=viewOrgCause(); break;
    case 'orgdocs': html=viewOrgDocs(); break;
    case 'risk': html=viewRisk(); break;
    case 'contact': html=viewContact(); break;
    case 'payout': html=viewPayout(); break;
    case 'review': html=viewReview(); break;
    case 'submitted': html=viewSubmitted(); break;
    case 'entry': html=viewEntry(); break;
    case 'org': html = p[2]==='changes' ? viewChanges(p[1]) : viewOrg(p[1]); break;
    case 'orgpage': html=viewOrgPage(p[1]); break;
    case 'event': html=viewEvent(p[1]); break;
    case 'individual': html = p[1]==='changes' ? viewIndividualChanges() : viewIndividual(); break;
    case 'access': html=viewAccess(); break;
    case 'build': html=(({proposal:viewProposal, page:viewPage, goal:viewGoal, team:viewTeam, launch:viewLaunch, done:viewDone})[p[1]] || viewProposal)(); break;
    case 'dashboard': html=viewDashboard(); break;
    default: go('begin'); return;
  }
  if(html===''){ return; }
  main.innerHTML=html;
  main.classList.toggle('is-dash', r==='dashboard');
  /* on a phone the tab strip scrolls; keep the active Manage Pages tab in view, again once web fonts widen it */
  var dn=main.querySelector('.dash-nav'); if(dn){ var toEnd=function(){ dn.scrollLeft=dn.scrollWidth; }; toEnd(); document.fonts.ready.then(toEnd); }
  renderNav(); renderDemo();
  var key=location.hash;
  if(key!==lastRoute){ window.scrollTo(0,0); lastRoute=key; closeModal(); }
}
window.addEventListener('hashchange', render);

function renderNav(){
  var el=document.getElementById('nav-auth');
  var lang='<button class="lang" type="button" aria-label="Language: English"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 3 4.2 6.2 4.2 9.5S14.8 18.5 12 21.5c-2.8-3-4.2-6.2-4.2-9.5S9.2 5.5 12 2.5z"/></svg>EN</button>';
  var burger='<button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-menu"><i></i><i></i><i></i></button>';
  /* the one way into step 0 from anywhere, logged in or not; on a phone it sits at the top of the menu */
  var create='<a class="create" href="#/begin">'+I.plus+'Create</a>';
  el.innerHTML = S.auth.loggedIn
    ? lang+create+'<a class="user" href="#/dashboard"><span class="av">'+initials(S.auth.name||S.auth.email)+'</span><span class="nm">'+h(S.auth.name||S.auth.email)+'</span></a>'+burger
    : lang+create+'<a class="signup" href="#" data-act="login">Log In / Sign Up</a>'+burger;
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
});
document.addEventListener('change', function(ev){
  var el=ev.target;
  if(el.hasAttribute('data-bool')){ set(el.getAttribute('data-k'), el.checked); var box=el.closest('.ob-check-box'); if(box) box.classList.toggle('on', el.checked); var f=el.closest('.ob-field'); if(f) f.classList.remove('err'); if(/^(confirmed\.|op\.fundOn)/.test(el.getAttribute('data-k'))) render(); return; }
  if(el.hasAttribute('data-msel')){ var sk=el.getAttribute('data-msel'), cur=[].concat(get(sk)||[]); if(el.value && cur.indexOf(el.value)<0) cur.push(el.value); set(sk, cur); render(); return; }
  if(el.hasAttribute('data-k') && el.tagName==='SELECT'){
    var sel=el.getAttribute('data-k'); set(sel, el.value); var ff=el.closest('.ob-field'); if(ff) ff.classList.remove('err');
    /* the tax-deduction question only applies to Singapore organisations */
    if(sel==='s1.org.country' && el.value!=='Singapore') set('s1.org.taxDeduction', '');
    if(/^s1\.org\.(sanctions|country|taxDeduction)$/.test(sel)) render();
    return;
  }
  if(el.type==='radio' && el.closest('[data-choice]')){ set(el.closest('[data-choice]').getAttribute('data-choice'), el.value); render(); return; }
  var multi=el.closest && el.closest('[data-multi]');
  if(multi){
    var mk=multi.getAttribute('data-multi'), max=+multi.getAttribute('data-max'), arr=(get(mk)||[]).slice();
    if(el.checked){ if(arr.length>=max){ el.checked=false; toast('Pick up to '+max); return; } arr.push(el.value); }
    else arr=arr.filter(function(x){ return x!==el.value; });
    set(mk, arr); el.closest('label').classList.toggle('on', el.checked); var mf=multi.closest('.ob-field'); if(mf) mf.classList.remove('err'); return;
  }
  if(el.id==='inv-role'){ var pay=document.getElementById('inv-pay'); pay.disabled=el.value!=='manager'; if(pay.disabled) pay.checked=false; return; }
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

function projectById(id){ return S.account.projects.filter(function(c){ return c.id===id; })[0]; }
/* load an approved project into the build steps */
function openBuild(c, step){
  S.selectedOrg=c.org||''; S.path='cause';
  if(S.s2.projectId!==c.id){
    S.s2=newS2(); S.s2.projectId=c.id; S.s2.proposal={name:c.name, cause:c.cause, country:c.country, summary:c.summary, goal:c.goalEst};
    S.s2.basics={name:c.name, cause:c.cause, country:c.country, intro:c.intro||'', images:clone(c.images||[])};
  }
  if(!S.s2.basics.name) S.s2.basics.name=c.name;
  S.s2.done['build/proposal']=true;
  if(step==='build/launch'){ S.s2.done['build/page']=S.s2.done['build/goal']=S.s2.done['build/team']=true; }
  save(); go(step);
}
var ACT={
  next:function(t){
    var card=t.closest('.ob-card'); if(!validate(card)) return;
    var r=parts()[0];
    if(r==='orgdetails' && !S.update){
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
    if(KNOWN_ACCOUNTS[(S.s1.account.email||'').toLowerCase().trim()]){ set('s1.account.exists', true); render(); return; }
    set('s1.account.sent', true); render();
  },
  resend:function(){ toast('Link sent again to '+S.s1.account.email); },
  changeEmail:function(){ S.s1.account.sent=false; S.s1.account.exists=false; save(); render(); },
  loginExisting:function(){
    var email=(S.s1.account.email||'').toLowerCase().trim();
    var path=S.path; reset('ret1'); S.path=path; S.auth={loggedIn:true, name:KNOWN_ACCOUNTS[email], email:email}; save();
    toast('Logged in as '+S.auth.name); go('entry');
  },
  openLink:function(){
    var email=(S.s1.account.email||'').toLowerCase().trim();
    S.auth={loggedIn:true, name:'', email:email}; save(); s1Advance('account');
  },
  matchDismiss:function(){ var e=matchOrg(); set('s1.docs.matchDismissed', e?e.id:''); closeModal(); s1Advance('orgdetails'); },
  matchDismissGo:function(){ S.requests.access=null; var e=matchOrg(); set('s1.docs.matchDismissed', e?e.id:''); s1Advance('orgdetails'); },
  mselRm:function(t){ var k=t.getAttribute('data-ms'), v=t.getAttribute('data-v'); set(k, [].concat(get(k)||[]).filter(function(x){ return x!==v; })); render(); },
  requestAccess:function(t){ S.requests.access={org:t.getAttribute('data-org'), kind:'access', sent:addDays(0)}; S.dashSel='request'; save(); closeModal(); go('access'); },
  requestJoin:function(t){ S.requests.access={org:t.getAttribute('data-org'), kind:'join', sent:addDays(0)}; S.dashSel='request'; save(); closeModal(); go('access'); },
  demoJoin:function(){
    var r=S.requests.access, e=DIRECTORY.filter(function(x){ return x.id===r.org; })[0];
    var o=clone(e.id==='antioch21'?ORG_ANTIOCH:{id:e.id, name:e.name, type:'charity', country:'Singapore', verifiedSince:addDays(0), expiresOn:addDays(365), lastActive:addDays(0), regMasked:'T21SS••••B', contact:'Rachel Ong', payoutMasked:'DBS ••••1180'});
    o.role='Manager'; if(!o.page) o.page={status:'none'}; if(!findOrg(o.id)) S.account.orgs.push(o); S.requests.access=null; save(); toast('Access approved — you\'re on the '+o.name+' team'); go('org/'+o.id);
  },
  unmask:function(){ set('s1.payout.masked', false); render(); setTimeout(function(){ var el=document.querySelector('[data-k="s1.payout.account"]'); if(el) el.focus(); }, 0); },
  submit:function(t){
    var card=t.closest('.ob-card'); if(!validate(card)) return;
    S.s1.status='submitted'; S.s1.submittedAt=addDays(0); S.s1.done[parts()[0]]=true; S.dashSel=S.s1.type==='individual'?'personal':'pending'; save(); go('submitted');
  },
  demoApprove:function(){
    var s=S.s1, ind=s.type==='individual';
    var newId='org'+Date.now();
    if(ind){ S.account.individual={name:s.docs.fullName||S.auth.name||'You', verifiedSince:addDays(0), idMasked:'S••••••'+(s.docs.fullName||'A').slice(-1).toUpperCase(), idExpires:addDays(1400), address:s.intent.country||'Singapore'}; }
    else { var og=s.org||{}; S.account.orgs.push({id:newId, name:og.name||'Your organisation', type:'charity', country:og.country||'Singapore', role:'Owner', verifiedSince:addDays(0), expiresOn:addDays(365), lastActive:addDays(0), regMasked:(og.regNo||'T00SS0000A').slice(0,5)+'••••'+(og.regNo||'A').slice(-1), ipc:isIpc(), payoutMasked:isIpc()?'Via AXS (IPC)':'Bank statement on file', details:clone(og), page:{status:'none'}}); }
    if(!S.auth.name) S.auth.name=s.contact.name||(s.auth&&s.auth.name)||'';
    var path=pathKey();
    S.s1.status='approved'; save(); toast('Approved. Your verification is on file.');
    if(path==='org' && !ind){ go('orgpage/'+newId); return; }
    if(path==='event'){ go('event/'+(ind?'personal':newId)); return; }
    S.selectedOrg=ind?'':newId; S.s2=newS2(); save(); go('build/proposal');
  },
  login:function(){ reset('ret1'); toast('Signed in as Adam Le'); go('begin'); },
  addOrg:function(){ S.s1={mode:'addorg', intent:{}, account:{}, type:'charity', org:{}, docs:{}, contact:{}, payout:{}, done:{}, status:'draft'}; save(); go('orgdetails'); },
  orgStart:function(t){ orgConfirm(t.getAttribute('data-org')); },
  orgChanged:function(t){ closeModal(); go('org/'+t.getAttribute('data-org')+'/changes'); },
  startOrgProject:function(t){ var id=t.getAttribute('data-org'); if(id) S.selectedOrg=id; S.path='cause'; S.s2=newS2(); save(); closeModal(); go('build/proposal'); },
  startProject:function(){ S.selectedOrg=''; S.path='cause'; S.s2=newS2(); save(); go('build/proposal'); },
  pickPath:function(t){ startPath(t.getAttribute('data-path')); },
  submitProposal:function(t){
    var card=t.closest('.ob-card'); if(!validate(card)) return;
    var o=currentOrg(), p=S.s2.proposal, c={id:'c'+Date.now(), name:p.name, org:o?o.id:'', status:'review', submittedOn:addDays(0), cause:p.cause, country:p.country, summary:p.summary, goalEst:+p.goal||0};
    S.account.projects.unshift(c); S.s2.projectId=c.id; S.s2.done['build/proposal']=true; S.dashSel=o?o.id:'personal'; S.dashTab='projects'; save();
    toast('Proposal sent. We\'ll be in touch to schedule a call.'); go('dashboard');
  },
  demoApproveProject:function(t){ var c=projectById(t.getAttribute('data-id')); c.status='building'; c.approvedOn=addDays(0); openBuild(c, 'build/page'); toast('Approved. Build the page when you\'re ready.'); },
  continueBuild:function(t){ openBuild(projectById(t.getAttribute('data-id')), 'build/page'); },
  manageProject:function(t){ openBuild(projectById(t.getAttribute('data-id')), t.getAttribute('data-step')); },
  dashSel:function(t){ S.dashSel=t.getAttribute('data-id'); S.dashTab='projects'; save(); render(); },
  dashTab:function(t){ S.dashTab=t.getAttribute('data-t'); save(); render(); },
  dashMenu:function(t){ t.closest('.dash-actions').classList.toggle('open'); },
  dashNew:function(t){
    var id=t.getAttribute('data-id');
    S.path='cause'; S.s2=newS2();
    if(id==='personal'){ S.selectedOrg=''; save(); go(S.account.individual?'build/proposal':'individual'); return; }
    save(); orgConfirm(id);
  },
  dashNewEvent:function(t){ S.path='event'; save(); go('event/'+t.getAttribute('data-id')); },
  openEventForm:function(){ toast('In the live product this opens Create Event'); },
  savePage:function(t){
    var card=t.closest('.ob-card'); if(!validate(card)) return;
    var o=findOrg(S.op.id), pg=o.page||{status:'none'}, op=S.op, f=pg.fund||{};
    var status = pg.status==='live' ? 'live' : ({now:'live', schedule:'scheduled', draft:'draft'})[op.mode];
    o.page={status:status, publishAt:op.mode==='schedule'?op.at:pg.publishAt, banner:op.banner, logo:op.logo, fund:{on:!!op.fundOn, purpose:op.purpose, raised:f.raised||0, contributions:f.contributions||0}};
    o.details=o.details||{name:o.name}; o.details.about=op.about;
    S.op=null; S.dashSel=o.id; S.dashTab='projects'; save();
    toast(status==='live'?(pg.status==='live'?'Page saved':'Page published'):status==='scheduled'?'Page scheduled for '+fmtDateTime(o.page.publishAt):'Page saved as a draft'); go('dashboard');
  },
  refresh:function(t){ var id=t.getAttribute('data-org'), o=findOrg(id); S.update={kind:'org', id:id, sections:['orgdocs'], refresh:true}; S.s1.org=clone(o.details||{name:o.name, country:o.country}); S.s1.type='charity'; S.s1.done={}; save(); go('orgdocs'); },
  startUpdate:function(t){
    var id=t.getAttribute('data-org'), o=findOrg(id), secs=['orgdetails','orgdocs','risk'].filter(function(s){ return S.chg && S.chg[s]; });
    if(!secs.length){ toast('Tick at least one section'); return; }
    S.update={kind:'org', id:id, sections:secs}; S.chg={}; S.s1.org=clone(o.details||{name:o.name, country:o.country}); S.s1.done={}; S.s1.type='charity'; save(); go(secs[0]);
  },
  indUpdate:function(t){
    if(parts()[1]==='changes' && !(S.chg && (S.chg.id||S.chg.address||S.chg.name))){ toast('Tick at least one section'); return; }
    S.update={kind:'individual', sections:['docs']}; S.chg={}; S.s1.docs={}; S.s1.done={}; S.s1.type='individual'; save(); go('docs');
  },
  skipGoal:function(){ s2Advance('build/goal'); },
  skipTeam:function(){ s2Advance('build/team'); },
  rmImg:function(t){ var imgs=S.s2.basics.images||[]; imgs.splice(+t.getAttribute('data-i'),1); set('s2.basics.images', imgs); render(); },
  addMember:function(){
    var e=document.getElementById('inv-email'), r=document.getElementById('inv-role');
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.value.trim())){ e.focus(); e.closest('.ob-field').classList.add('err'); return false; }
    var pay=document.getElementById('inv-pay');
    S.s2.team.push({email:e.value.trim(), role:r.value, payouts:r.value==='manager' && pay.checked}); save(); render();
    return true;
  },
  rmMember:function(t){ S.s2.team.splice(+t.getAttribute('data-i'),1); save(); render(); },
  launch:function(t){
    var card=t.closest('.ob-card'); if(!validate(card)) return;
    var l=S.s2.launch, o=currentOrg(), c=s2Project();
    if(!c){ c={id:'c'+Date.now(), org:o?o.id:'', approvedOn:addDays(0)}; S.account.projects.unshift(c); }
    var b=S.s2.basics; c.name=b.name||c.name; c.type=b.type; c.cause=b.cause; c.country=b.country; c.city=b.city; c.intro=b.intro; c.images=b.images;
    if(S.s2.goal.amount) c.goal=+S.s2.goal.amount; if(S.s2.goal.endDate) c.fundraisingEnd=S.s2.goal.endDate;
    if(l.mode==='now'){ c.status='live'; c.raised=0; c.contributions=0; c.started=S.s2.goal.start||addDays(0); }
    else if(l.mode==='schedule'){ c.status='scheduled'; c.scheduledFor=l.at; }
    else { c.status='draft'; }
    S.s2.status=c.status; S.s2.done['build/launch']=true; S.dashSel=o?o.id:'personal'; S.dashTab='projects'; save();
    if(c.status==='live') go('build/done'); else { toast(c.status==='scheduled'?'Scheduled for '+fmtDateTime(c.scheduledFor):'Saved as a draft'); go('dashboard'); }
  },
  publishNow:function(t){ var c=S.account.projects.filter(function(x){ return x.id===t.getAttribute('data-id'); })[0]; c.status='live'; c.raised=0; c.started=addDays(0); save(); toast('Published — '+c.name+' is live'); render(); },
  copyLink:function(t){ toast('Link copied'); },
  demoMail:function(t){ document.getElementById('ob-demo').classList.remove('open'); demoMail(t.getAttribute('data-k')); },
  mailPath:function(t){ lastMail.path=t.getAttribute('data-p'); mailModal(lastMail); },
  demoPick:function(t){ reset(t.getAttribute('data-s')); document.getElementById('ob-demo').classList.remove('open'); go(SCENARIOS[S.scenario].start); },
  demoReset:function(){ reset(S.scenario); document.getElementById('ob-demo').classList.remove('open'); go(SCENARIOS[S.scenario].start); },
  demoToggle:function(){ document.getElementById('ob-demo').classList.toggle('open'); },
  demoFlow:function(){ document.getElementById('ob-demo').classList.remove('open'); flowModal(S.scenario); },
  whatsNew:function(){ document.getElementById('ob-demo').classList.remove('open'); whatsNew(); },
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

/* email previews: drafted text for the team to review; the prototype sends nothing */
var MAIL_NEXT={
  cause:['Send us a short proposal for your project. We\'ll call you to talk it through, then you build the page.','Start your proposal'],
  org:['Set up your organization page: a banner, your logo, and donations for running costs if you want them.','Set up your page'],
  event:['Create your event: the page, tickets and an optional registration form.','Create your event']
};
var lastMail=null;
/* opened from the demo panel; the welcome email is the one sent on approval, so no one sends guides by hand */
function demoMail(kind){
  var to=S.auth.email||S.s1.account.email||'you@organisation.org';
  if(kind==='link') mailModal({kind:'link', to:S.s1.account.email||to});
  else mailModal({kind:'welcome', path:pathKey(), ind:S.s1.type==='individual', org:(S.s1.org&&S.s1.org.name)||(S.account.orgs[0]&&S.account.orgs[0].name)||'Your organisation', first:firstName(S.auth.name), to:to});
}
function mailModal(m){
  var subject, body, tabs='';
  lastMail=m;
  if(m.kind==='link'){
    var inbox=parts()[0]==='account' && S.s1.account.sent && !S.auth.loggedIn;
    subject='Your link to continue on Agathos';
    body='<p>Hi,</p><p>Tap the button to confirm your email and pick up where you left off.</p>'+
      '<p><button class="ob-btn primary" type="button" data-act="'+(inbox?'openLink':'modalClose')+'">Continue on Agathos</button></p>'+
      '<p class="mail-small">The link works for 24 hours. If it has expired, ask for a new one when you log in. Didn\'t ask for this? You can ignore this email.</p>';
  } else {
    var next=MAIL_NEXT[m.path];
    tabs='<div class="mail-tabs"><span>Next step for</span>'+[['cause','A project'],['org','An organization page'],['event','An event']].map(function(x){ return '<button type="button" class="'+(x[0]===m.path?'on':'')+'" data-act="mailPath" data-p="'+x[0]+'">'+x[1]+'</button>'; }).join('')+'</div>';
    subject = m.ind ? 'You\'re verified on Agathos' : m.org+' is verified on Agathos';
    body='<p>Hi '+h(m.first||'there')+',</p>'+
      '<p>'+(m.ind ? 'You\'re now verified on Agathos. You only do this once: your projects and events all build on it.' : 'Good news: <b>'+h(m.org)+'</b> is now verified on Agathos. You only do this once: its page, projects and events all build on it.')+'</p>'+
      '<h4>What\'s next</h4><p>'+next[0]+'</p><p><button class="ob-btn primary" type="button" data-act="modalClose">'+next[1]+'</button></p>'+
      '<h4>Guides to get you started</h4><div class="mail-gap">Guide links to add from Rachel\'s current guides.</div>'+
      '<p>You\'ll find everything in Manage Pages on your dashboard. Questions? Reply to this email or write to hello@agathos.be.</p>';
  }
  modal('<button class="ob-x" type="button" data-act="modalClose" aria-label="Close">×</button>'+
    '<div class="mail-tag"><b>'+(m.kind==='link'?'Sign-in link email':'Welcome email, sent on approval')+'</b><span>Draft text for review</span></div>'+tabs+
    '<div class="mail-meta"><div><span>From</span>Agathos &lt;hello@agathos.be&gt;</div><div><span>To</span>'+h(m.to||'')+'</div><div><span>Subject</span><b>'+h(subject)+'</b></div></div>'+
    '<div class="mail-body"><img class="logo" src="assets/img/home/agathos-logo.png" alt="agathos">'+body+'<p class="mail-sign">The Agathos team</p></div>');
  modalEl.querySelector('.box').classList.add('mail-box');
}

/* the build reviewers are looking at, and what changed in each one */
var VERSION='v1.3', VERSION_DATE='2 Oct 2026';
var CHANGELOG=[
  {v:'v1.3', date:'2 Oct 2026', items:[
    '"+ Create" on the nav, on every page, logged in or not, opens step 0. The same button sits at the top of Manage Pages.',
    'Links that already say what they create skip step 0: Start a Project, Register an Organization and Host an Event in the footer go straight to that path.',
    'Step 0 shows "Continue where you left off" when a verification was started and not submitted. Picking the same path again also resumes it.',
    'Email previews in the demo panel, with draft text for review: the sign-in link email, and the welcome email sent on approval with the next step and the guides. Guide links are still to add.',
    'Log In and Sign Up merged into one "Log In / Sign Up" button, which makes room for + Create.',
    'Suggested rollout. Phase 1: "+ Create" on the nav and in Manage Pages, plus the welcome email. Phase 2: Create Organization and Create Event go straight to their path without the log-in pop-up, and Support a Cause → Projects gets "+ Start a Project".'
  ]},
  {v:'v1.2', date:'2 Oct 2026', items:[
    'Step 0: choose between raising funds for a cause, for your organization, or hosting an event, with a short "How pages fit together".',
    'Organizations answer the same questions as the live Create Organization form, in five short steps: Organization, Contact, Causes, Documents, Risk declaration. Each step shows how many questions it has.',
    'A "Before you start" list on the first step shows the documents to have ready.',
    'The registration number is asked on the first step, so an organization already on Agathos is spotted before the rest of the form is filled in.',
    'The tax-deduction question only shows for organizations in Singapore. Those that can offer tax deductions (IPCs) skip the bank statement, because payouts are set up directly with AXS.',
    '"What countries does your organization operate in?" takes more than one country.',
    'Every project starts as a proposal. We review it and call before the page is built. The dashboard shows "In review", then "Approved".',
    'The project page uses the live project fields: title, type, cause, country, city, Introduction, Background & Context, Scope & Activities, goal and dates. Photo tips added.',
    'Fields that are not on the live platform were removed: volunteers, items, milestones and the monthly-giving switch.',
    'The organization page is separate from verification. Its content comes from the organization details, with banner, logo, donations for running costs and a publish date.',
    'Events: pick who hosts, then continue to the existing Create Event form. No verification needed, as on the live platform.',
    'Roles merged into Owner, Manager and Viewer, with payout permission per person. The Member role is gone.',
    'An email that already has an account is recognised before any link is sent, with a Log in button that keeps the chosen path.',
    'New demo scenario: logged in, not verified yet. "Open the link" is labelled as a demo shortcut. A pending request to join an organization shows on the dashboard.',
    'Version label and this What\'s new list. The roles page follows the team\'s answers.'
  ]},
  {v:'v1.1', date:'25 Sep 2026', items:[
    'Logged-in users are no longer asked again for their account or who is raising.',
    'One organisation shows the same organisation list as two or more, with Add an organisation.',
    'Organisation details are confirmed in a pop-up when starting a project.',
    'A reminder appears when an invite was typed but not sent.',
    '"How funds will be used" is no longer asked twice for individuals.',
    'Dashboard rebuilt after the live Manage Pages tab.',
    'Demo scenarios grouped, flow diagrams, and the roles matrix page.'
  ]},
  {v:'v1.0', date:'18 Sep 2026', items:['First onboarding prototype: verification, returning users, project build and launch.']}
];
function whatsNew(){
  modal('<button class="ob-x" type="button" data-act="modalClose" aria-label="Close">×</button><h2>What\'s new</h2><p class="lead">Changes in each version of the onboarding prototype.</p>'+
    CHANGELOG.map(function(c){ return '<div class="cl"><div class="cl-h"><b>'+c.v+'</b><span>'+c.date+'</span>'+(c.v===VERSION?'<i>This version</i>':'')+'</div><ul>'+c.items.map(function(t){ return '<li>'+h(t)+'</li>'; }).join('')+'</ul></div>'; }).join(''));
  modalEl.querySelector('.box').classList.add('cl-box');
}

/* scenarios grouped the way a reviewer thinks about them: logged out, then logged in by what the account has */
var DEMO_GROUPS=[
  {h:'Not logged in', keys:['new']},
  {h:'Logged in · starting something', keys:['fresh','ret1','ret2','indiv']},
  {h:'Logged in · other states', keys:['expiring','awaiting']}
];
var DEMO_ORDER=DEMO_GROUPS.reduce(function(a,g){ return a.concat(g.keys); }, []);
function renderDemo(){
  var el=document.getElementById('ob-demo');
  var tryIt='<div class="try"><b>Try in the forms</b><code>josias@antioch21.org</code> → existing account<br><code>T08SS0123A</code> → org already verified<br><code>T21SS0456B</code> → application in progress<br>Singapore + tax deductions <code>Yes</code> → no bank statement</div>';
  el.innerHTML='<button type="button" data-act="demoToggle"><i></i><span class="ver">'+VERSION+'</span>Demo · '+h(SCENARIOS[S.scenario].label)+'</button><div class="panel">'+
    '<div class="ver-row"><span>Prototype <b>'+VERSION+'</b> · '+VERSION_DATE+'</span><button type="button" data-act="whatsNew">What\'s new</button></div>'+
    '<div class="ver-row"><span>Email previews</span><span class="mail-btns"><button type="button" data-act="demoMail" data-k="link">Sign-in link</button><button type="button" data-act="demoMail" data-k="welcome">Welcome</button></span></div>'+
    DEMO_GROUPS.map(function(g){ return '<h4>'+h(g.h)+'</h4>'+g.keys.map(function(k){ var s=SCENARIOS[k]; return '<label><input type="radio" name="demo" data-act="demoPick" data-s="'+k+'"'+(k===S.scenario?' checked':'')+'><div>'+h(s.label)+'<span>'+h(s.sub)+'</span></div></label>'+(k==='new'?tryIt:''); }).join(''); }).join('')+
    '<div class="acts"><button class="ob-btn ghost sm" type="button" data-act="demoReset">Reset scenario</button><button class="ob-btn primary sm" type="button" data-act="demoFlow">Flow diagram</button></div>'+
    '<div class="acts"><a class="ob-btn ghost sm" href="onboarding-matrix.html">View matrix</a></div></div>';
}

function flowModal(key){
  var F=OB_FLOWS.get(key);
  modal('<div class="flow-top"><div class="flow-head"><div><h2>Flow diagram</h2><p class="lead">Where each demo scenario goes, per the handoff diagrams.</p></div><button class="flow-x" type="button" data-act="modalClose" aria-label="Close">×</button></div>'+
    '<div class="flow-pick">'+DEMO_ORDER.map(function(k){ return '<button type="button" class="'+(k===key?'on':'')+'" data-act="flowPick" data-s="'+k+'">'+h(SCENARIOS[k].label)+'</button>'; }).join('')+'</div></div>'+
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
