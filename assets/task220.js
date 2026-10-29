/* ============================================================================
   Agathos — change username, first and last name (/task220, GitLab #220).
     #/signup    Keycloak Register page + the public-username note
     #/settings  Account Settings › Account Information + change username/first/last name
     #/flow      the change flow and every error message
   Rules are Keycloak's defaults (user profile + prohibited-character validators).
   ============================================================================ */
(function(){
'use strict';

var PUBLIC='Your username is displayed publicly next to your donations. Avoid using sensitive personal details or your full name if you prefer privacy.';
var NAMES={username:'username', firstName:'first name', lastName:'last name'};
var LABELS={username:'Username', firstName:'First Name', lastName:'Last Name'};
var TAKEN=['admin','agathos','wallytham'];
var EMAIL_TAKEN=['lenguyen2101@gmail.com'];
/* Keycloak: UsernameProhibitedCharactersValidator / PersonNameProhibitedCharactersValidator */
var BAD_USER=/[<>&"'\s$%!#?§,;:*~\/\\|^=\[\]{}()`]/;
var BAD_NAME=/[<>&"$%!#?§;*~\/\\|^=\[\]{}()]/;
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
var MSG={
  usernameRequired:'Please enter a username.',
  usernameLength:'Username must be between 3 and 255 characters.',
  usernameChars:'Username can’t contain spaces or symbols such as ! # $ % & * / ( ).',
  usernameTaken:'This username is already taken. Try another one.',
  nameRequired:function(f){ return 'Please enter your '+NAMES[f]+'.'; },
  nameLength:function(f){ return cap(NAMES[f])+' must be 255 characters or fewer.'; },
  nameChars:function(f){ return cap(NAMES[f])+' can’t contain symbols such as $ % ! # * / ( ).'; },
  emailRequired:'Please enter your email.',
  emailInvalid:'Enter a valid email address.',
  emailTaken:'An account with this email already exists. Try logging in or resetting your password.',
  passwordRequired:'Please enter a password.',
  passwordMatch:'Passwords don’t match.',
  saveFailed:'We couldn’t save your change. Please try again.'
};
function check(f, v){
  if(f==='username'){
    if(!v) return MSG.usernameRequired;
    if(v.length<3 || v.length>255) return MSG.usernameLength;
    if(BAD_USER.test(v)) return MSG.usernameChars;
    return '';
  }
  if(!v.trim()) return MSG.nameRequired(f);
  if(v.length>255) return MSG.nameLength(f);
  if(BAD_NAME.test(v)) return MSG.nameChars(f);
  return '';
}

/* ---------- state (resets on reload) ---------- */
var S;
function fresh(){
  return {
    left:{username:2, firstName:2, lastName:2},
    vals:{username:'lenguyen2101', firstName:'Nguyen', lastName:'Le'},
    edit:null, draft:'', err:'', modal:null, failNext:false,
    other:{gender:'male', bio:'Christian. Vietnamese. Product Designer.', news:true, dirty:false},
    su:{v:{first:'', last:'', email:'', username:'', pw:'', pw2:''}, e:{}, show:{}, done:false}
  };
}
S=fresh();

/* ---------- icons ---------- */
function ic(p, extra){ return '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'+(extra||'')+'>'+p+'</svg>'; }
var I={
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 10.5L12 3.5l8.5 7"/><path d="M5.5 9v11h4.5v-6h4v6h4.5V9"/></svg>',
  crumb:ic('<path d="M8 5l5 5-5 5"/>'),
  right:ic('<path d="M7.5 4.5l5.5 5.5-5.5 5.5"/>',' stroke-width="1.8"'),
  user:ic('<circle cx="10" cy="6.5" r="3.5"/><path d="M3.5 17.5c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/>'),
  at:ic('<circle cx="10" cy="10" r="3.2"/><path d="M13.2 10v1.3a2.2 2.2 0 0 0 4.3.6A7.5 7.5 0 1 0 14 16.6"/>'),
  spark:ic('<path d="M9 2.5l1.3 4.2 4.2 1.3-4.2 1.3L9 13.5 7.7 9.3 3.5 8l4.2-1.3z"/><path d="M15 12l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7zM4.5 13.5l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5z"/>'),
  card:ic('<rect x="2.5" y="4.5" width="15" height="11" rx="2"/><path d="M2.5 8.5h15M5.5 12.5h2M9.5 12.5h1"/>'),
  pen:ic('<path d="M12.8 3.7l3.5 3.5L7.5 16H4v-3.5z"/><path d="M11 5.5l3.5 3.5"/>'),
  lock:ic('<rect x="4.5" y="8.5" width="11" height="8" rx="1.8"/><path d="M7 8.5V6.5a3 3 0 0 1 6 0v2"/>'),
  info:ic('<circle cx="10" cy="10" r="7.5"/><path d="M10 9v4.5M10 6.4v.1"/>'),
  count:ic('<path d="M15.5 6.5A6.5 6.5 0 1 0 16.5 10"/><path d="M16.5 3.5v3.3h-3.3"/>'),
  mail:ic('<rect x="2.5" y="4.5" width="15" height="11" rx="2"/><path d="M3 5.5l7 5.5 7-5.5"/>'),
  err:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="currentColor"/><path d="M10 5.8v5.4" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="14.1" r="1.2" fill="#fff"/></svg>',
  warn:ic('<path d="M10 2.8l7.8 13.6H2.2z"/><path d="M10 8v4M10 14.3v.1"/>',' stroke-width="1.7"'),
  down:ic('<path d="M5 7.5l5 5 5-5"/>',' stroke-width="1.8"'),
  tick:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="#111"/><path d="M6 10.3l2.7 2.6L14 7.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  vn:'<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#DA251D"/><path d="M15 4.2l1.6 4.9h5.2l-4.2 3 1.6 4.9-4.2-3-4.2 3 1.6-4.9-4.2-3h5.2z" fill="#FFCD00"/></svg>',
  eye:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5C6.8 5.5 3 9.6 2 12c1 2.4 4.8 6.5 10 6.5s9-4.1 10-6.5c-1-2.4-4.8-6.5-10-6.5z" fill="currentColor"/><circle cx="12" cy="12" r="3.6" fill="#fff"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
  fb:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#1877F2"/><path d="M26.4 38V26.6h3.8l.6-4.5h-4.4v-2.8c0-1.3.4-2.2 2.2-2.2h2.3v-4c-.4-.1-1.8-.2-3.4-.2-3.4 0-5.6 2-5.6 5.8v3.4h-3.8v4.5h3.8V38z" fill="#fff"/></svg>',
  g:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23.5" fill="#fff" stroke="#DADCE0"/><path d="M34.6 24.2c0-.8-.1-1.5-.2-2.2H24v4.2h6a5.2 5.2 0 0 1-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2z" fill="#4285F4"/><path d="M24 35c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.7h-3.7v2.9A11 11 0 0 0 24 35z" fill="#34A853"/><path d="M17.7 25.9a6.6 6.6 0 0 1 0-4.2v-2.9h-3.7a11 11 0 0 0 0 9.9z" fill="#FBBC05"/><path d="M24 17.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 14 18.8l3.7 2.9c.9-2.7 3.4-4.3 6.3-4.3z" fill="#EA4335"/></svg>'
};
function h(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

/* ============ ACCOUNT SETTINGS ============ */
function same(f){ return f==='username' ? S.draft===S.vals[f] : S.draft.trim()===S.vals[f]; }
function limited(f){
  var left=S.left[f], ed=S.edit===f;
  var act=ed ? '' : left>0 ? '<button class="as-change" type="button" data-act="edit" data-f="'+f+'">'+I.pen+'Change</button>' : '<span class="as-locked">'+I.lock+'No changes left</span>';
  var input=ed
    ? '<input class="as-in edit'+(S.err?' err':'')+'" id="as-'+f+'" value="'+h(S.draft)+'" data-draft="'+f+'" autocomplete="off" spellcheck="false" aria-invalid="'+(S.err?'true':'false')+'" aria-describedby="as-'+f+'-err">'
    : '<input class="as-in" id="as-'+f+'" value="'+h(S.vals[f])+'" disabled>';
  var notes=(f==='username' ? '<p class="as-note pub">'+I.info+'<span>'+PUBLIC+'</span></p>' : '')+
    '<p class="as-note">'+I.count+'<span>You have <b>'+left+' of 2</b> '+NAMES[f]+' changes remaining for this account.</span></p>'+
    (left===0 ? '<p class="as-note">'+I.mail+'<span>Need another change? Contact us at <a href="mailto:hello@agathos.be">hello@agathos.be</a>.</span></p>' : '');
  return '<div class="as-f" data-field="'+f+'">'+
    '<div class="as-lbl"><label for="as-'+f+'">'+LABELS[f]+'</label>'+act+'</div>'+input+
    '<p class="as-err" id="as-'+f+'-err"'+(ed && S.err ? '' : ' hidden')+'>'+I.err+'<span>'+h(S.err)+'</span></p>'+notes+
    (ed ? '<div class="as-acts"><button class="as-btn ghost" type="button" data-act="cancel">Cancel</button><button class="as-btn primary" type="button" data-act="save" id="as-fsave"'+(same(f)?' disabled':'')+'>Save</button></div>' : '')+
  '</div>';
}
function settings(){
  var o=S.other;
  var menu=[[I.user,'Account Information',1],[I.at,'Social Networks'],[I.spark,'Skills'],[I.card,'Payment Methods']];
  return '<div class="as"><div class="as-inner">'+
    '<aside class="as-side"><nav class="as-crumb" aria-label="Breadcrumb"><a href="home.html" aria-label="Home">'+I.home+'</a>'+I.crumb+'<a href="#/settings">Profile</a>'+I.crumb+'<span>Account Settings</span></nav>'+
      '<h1>Account Settings</h1><ul class="as-menu">'+menu.map(function(m){ return '<li><a href="#/settings"'+(m[2]?' class="on" aria-current="page"':'')+'>'+m[0]+'<span>'+m[1]+'</span>'+I.right+'</a></li>'; }).join('')+'</ul></aside>'+
    '<section class="as-card"><div class="as-card-head"><h2>Account Information</h2><button class="as-save" type="button" data-act="saveOther"'+(o.dirty?'':' disabled')+'>Save</button></div>'+
      '<div class="as-grid">'+
        limited('username')+
        '<div class="as-f"><div class="as-lbl"><label for="as-email">Email</label></div><input class="as-in" id="as-email" value="lenguyen2101@gmail.com" disabled></div>'+
        limited('firstName')+limited('lastName')+
        '<div class="as-f"><div class="as-lbl"><span class="l">Phone Number</span></div><div class="as-phone"><span class="cc">'+I.vn+'VN'+I.down+'</span><input value="+84 793 617 115" data-other aria-label="Phone number"></div></div>'+
        '<div class="as-f"><div class="as-lbl"><span class="l">Gender</span></div><div class="as-gender">'+
          '<button type="button" data-act="gender" data-g="male" class="'+(o.gender==='male'?'on':'')+'">Male'+(o.gender==='male'?I.tick:'')+'</button>'+
          '<button type="button" data-act="gender" data-g="female" class="'+(o.gender==='female'?'on':'')+'">Female'+(o.gender==='female'?I.tick:'')+'</button></div></div>'+
        '<div class="as-f full"><div class="as-lbl big"><label>Language</label></div><button class="as-lang" type="button">English'+I.down+'</button></div>'+
        '<div class="as-f full"><div class="as-lbl"><label for="as-bio">Bio</label></div><div class="as-bio"><textarea id="as-bio" maxlength="200" data-other>'+h(o.bio)+'</textarea><span id="as-bio-n">'+o.bio.length+'/200</span></div></div>'+
      '</div>'+
      '<label class="as-toggle"><input type="checkbox" data-other'+(o.news?' checked':'')+'><i></i>I want to receive updates on latest news and events.</label>'+
    '</section></div></div>';
}
function modal(){
  var m=S.modal; if(!m) return '';
  var f=m.f, after=S.left[f]-1, n=NAMES[f];
  return '<div class="md-wrap" data-act="mdBackdrop"><div class="md" role="dialog" aria-modal="true" aria-labelledby="md-t">'+
    '<h3 id="md-t">Change your '+n+'?</h3>'+
    '<dl class="diff"><div><dt>Current</dt><dd>'+h(S.vals[f])+'</dd></div><div class="new"><dt>New</dt><dd>'+h(m.to)+'</dd></div></dl>'+
    (f==='username' ? '<p>Your new username will be displayed publicly next to your donations.</p>' : '')+
    '<p>After this change, you will have <b>'+after+' of 2</b> '+n+' changes remaining for this account.</p>'+
    (after===0 ? '<div class="warn">'+I.warn+'<span>This is your last '+n+' change. After this, you won’t be able to change it yourself.</span></div>' : '')+
    '<div class="acts"><button class="as-btn ghost" type="button" data-act="mdCancel">Cancel</button><button class="as-btn primary" type="button" data-act="mdConfirm">Change '+n+'</button></div>'+
  '</div></div>';
}

/* ============ SIGN UP (Keycloak) ============ */
function suField(k, label, pw){
  var e=S.su.e[k], show=S.su.show[k];
  return '<div class="kc-f'+(e?' err':'')+'"><label for="kc-'+k+'">'+label+'</label>'+
    '<div class="kc-box'+(pw?' pw':'')+'"><input class="kc-in" id="kc-'+k+'" data-su="'+k+'" type="'+(pw && !show?'password':'text')+'" value="'+h(S.su.v[k])+'" autocomplete="off"'+(e?' aria-invalid="true"':'')+'>'+
      (pw ? '<button type="button" class="kc-eye" data-act="eye" data-k="'+k+'" aria-label="'+(show?'Hide':'Show')+' password">'+I.eye+'</button>' : '')+'</div>'+
    (e ? '<div class="kc-msg">'+h(e)+'</div>' : '')+
    (k==='username' ? '<p class="kc-help">'+I.info+'<span>'+PUBLIC+'</span></p>' : '')+
  '</div>';
}
function signup(){
  return '<div class="kc"><div class="kc-top"><img src="assets/img/home/agathos-logo.png" alt="agathos"></div><div class="kc-body"><div class="kc-card">'+
    '<div class="kc-lang">English</div><h1>Register</h1>'+
    '<p class="kc-sub">Using your social media accounts:</p><div class="kc-social"><a href="#" aria-label="Register with Facebook">'+I.fb+'</a><a href="#" aria-label="Register with Google">'+I.g+'</a></div>'+
    '<p class="kc-sub">Or register with email address</p>'+
    (S.su.done ? '<div class="kc-alert">Demo: the form is valid. Keycloak would now create the account.</div>' : '')+
    '<form class="kc-form" novalidate>'+suField('first','First name')+suField('last','Last name')+suField('email','Email')+suField('username','Username')+suField('pw','Password',1)+suField('pw2','Confirm password',1)+'</form>'+
    '<a class="kc-back" href="#">« Back to Login</a>'+
    '<button class="kc-submit" type="button" data-act="suSubmit">Create an account</button>'+
    '<p class="kc-terms">By joining agathos, you agree with our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.</p>'+
  '</div></div></div>';
}
function suValidate(){
  var v=S.su.v, e={};
  ['first','last'].forEach(function(k){ var m=check(k==='first'?'firstName':'lastName', v[k]); if(m) e[k]=m; });
  if(!v.email.trim()) e.email=MSG.emailRequired;
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email=MSG.emailInvalid;
  else if(EMAIL_TAKEN.indexOf(v.email.trim().toLowerCase())>=0) e.email=MSG.emailTaken;
  var u=check('username', v.username); if(!u && TAKEN.indexOf(v.username.toLowerCase())>=0) u=MSG.usernameTaken; if(u) e.username=u;
  if(!v.pw) e.pw=MSG.passwordRequired;
  else if(v.pw!==v.pw2) e.pw2=MSG.passwordMatch;
  S.su.e=e; S.su.done=!Object.keys(e).length;
}

/* ============ FLOW & MESSAGES ============ */
function flow(){
  var steps=[
    ['Account Information','Each of the three fields shows “You have 2 of 2 … changes remaining for this account.”'],
    ['Change','Click Change next to Username, First Name or Last Name. The field opens for editing.'],
    ['Type the new value','Rules are checked on Save, then live as the person fixes the error.'],
    ['Save','Opens the confirmation modal: current → new, and how many changes are left after.'],
    ['Confirm','The value is saved, the count drops by one, and a toast confirms it.'],
    ['No changes left','At 0 of 2, Change becomes “No changes left”, with a line to contact the team.']
  ];
  var rows=[
    ['Username',[
      ['Empty',MSG.usernameRequired,'both','Please specify username.','missingUsernameMessage'],
      ['Under 3 or over 255 characters',MSG.usernameLength,'both','Length must be between 3 and 255.','error-invalid-length'],
      ['Spaces or symbols < > & " \' $ % ! # ? § , ; : * ~ / \\ | ^ = [ ] { } ( ) `',MSG.usernameChars,'both','Value contains invalid character.','error-username-invalid-character'],
      ['Already used by another account',MSG.usernameTaken,'both','Username already exists.','usernameExistsMessage']]],
    ['First name / Last name',[
      ['Empty',MSG.nameRequired('firstName')+' / '+MSG.nameRequired('lastName'),'both','Please specify first name. / Please specify last name.','missingFirstNameMessage, missingLastNameMessage'],
      ['Over 255 characters',MSG.nameLength('firstName'),'both','Maximal length is 255.','error-invalid-length-too-long'],
      ['Symbols < > & " $ % ! # ? § ; * ~ / \\ | ^ = [ ] { } ( )',MSG.nameChars('firstName'),'both','Value contains invalid character.','error-person-name-invalid-character']]],
    ['Email (sign up)',[
      ['Empty',MSG.emailRequired,'signup','Please specify email.','missingEmailMessage'],
      ['Not an email address',MSG.emailInvalid,'signup','Invalid email address.','invalidEmailMessage'],
      ['Already has an account',MSG.emailTaken,'signup','Email already exists.','emailExistsMessage']]],
    ['Password (sign up)',[
      ['Empty',MSG.passwordRequired,'signup','Please specify password.','missingPasswordMessage'],
      ['Confirmation differs',MSG.passwordMatch,'signup','Password confirmation doesn\'t match.','invalidPasswordConfirmMessage']]],
    ['Account settings only',[
      ['Save fails (server or network); no change is used',MSG.saveFailed,'settings','',''],
      ['No changes left (a state, not an error)','You have 0 of 2 username changes remaining for this account. Need another change? Contact us at hello@agathos.be.','settings','','']]]
  ];
  var where={both:'Sign up, Account settings', signup:'Sign up', settings:'Account settings'};
  return '<div class="fm"><div class="fm-inner">'+
    '<h1>Flow &amp; messages</h1><p class="fm-lead">How a person changes their username, first name or last name, and every message they can see on the two pages.</p>'+
    '<h2>Changing a field in Account settings</h2>'+
    '<div class="fm-flow">'+steps.map(function(s,i){ return '<div class="fm-step"><span class="n">'+String(i+1).padStart(2,'0')+'</span><b>'+s[0]+'</b><p>'+s[1]+'</p></div>'; }).join('')+'</div>'+
    '<div class="fm-branches">'+
      '<div class="fm-branch"><b>Cancel</b>In the field or in the modal. Nothing changes and no change is used.</div>'+
      '<div class="fm-branch"><b>Last change</b>With 1 of 2 left, the modal warns that the field can’t be changed again after this.</div>'+
      '<div class="fm-branch"><b>Save fails</b>The field stays open with an error. No change is used. Try it with “Next save fails” in the bar above.</div>'+
    '</div>'+
    '<h2>Error messages</h2>'+
    '<div class="fm-wrap"><table class="fm-table"><thead><tr><th>When</th><th>Message</th><th>Shown on</th><th>Keycloak today (sign up)</th></tr></thead><tbody>'+
      rows.map(function(g){ return '<tr class="grp"><td colspan="4">'+g[0]+'</td></tr>'+g[1].map(function(r){
        return '<tr><td>'+h(r[0])+'</td><td class="msg">'+h(r[1])+'</td><td>'+where[r[2]]+'</td><td>'+(r[3]?h(r[3])+'<span class="kcd"><code>'+h(r[4])+'</code></span>':'—')+'</td></tr>';
      }).join(''); }).join('')+
    '</tbody></table></div>'+
    '<h2>Notes for the team</h2><ul class="fm-notes">'+
      '<li>The rules are Keycloak’s defaults: username 3 to 255 characters, no spaces or the symbols listed; names up to 255 characters. <span class="tbc">To check</span> whether the Agathos realm changes them.</li>'+
      '<li>To show the new messages on sign up, override the keys above in the realm’s Localization tab. <code>error-invalid-length</code> and <code>error-invalid-length-too-long</code> are shared by every field, so the text needs the field name placeholder <code>{0}</code>, e.g. “{0} must be between {1} and {2} characters.” The prohibited-character validators accept their own message key in the User Profile settings.</li>'+
      '<li>Account settings should check the same rules before saving, and the backend still has the last word (for example a username taken a second earlier).</li>'+
      '<li>New copy waiting for approval <span class="tbc">To confirm</span>: the modal text, the last-change warning, “No changes left”, the contact line, and the messages that differ from Keycloak’s.</li>'+
      '<li>Questions <span class="tbc">To confirm</span>: does a change count if someone changes back to an old value? Should we email the person after each change?</li>'+
    '</ul></div></div>';
}

/* ============ page ============ */
function route(){ var x=location.hash; return x==='#/signup' ? 'signup' : x==='#/flow' ? 'flow' : 'settings'; }
function review(r){
  var all=function(n){ return S.left.username===n && S.left.firstName===n && S.left.lastName===n; };
  var ctl='';
  if(r==='settings') ctl='<em>Changes left</em>'+[2,1,0].map(function(n){ return '<button type="button" data-act="setLeft" data-n="'+n+'"'+(all(n)?' class="on"':'')+'>'+n+' of 2</button>'; }).join('')+
    '<button type="button" data-act="failNext"'+(S.failNext?' class="on"':'')+'>Next save fails</button><button type="button" data-act="reset">Reset</button><em>Taken: admin, agathos, wallytham</em>';
  if(r==='signup') ctl='<button type="button" data-act="suErrors">Show errors</button><button type="button" data-act="suReset">Reset</button><em>Taken: admin, agathos · lenguyen2101@gmail.com</em>';
  return '<span class="t">Task #220 <span>· Change username, first and last name</span></span>'+
    '<nav class="t2-tabs" aria-label="Screens">'+[['signup','Sign up'],['settings','Account settings'],['flow','Flow & messages']].map(function(t){ return '<a href="#/'+t[0]+'"'+(r===t[0]?' class="on" aria-current="page"':'')+'>'+t[1]+'</a>'; }).join('')+'</nav>'+
    '<div class="t2-ctl">'+ctl+'</div>';
}
function render(keepScroll){
  var r=route(), y=window.scrollY;
  document.querySelector('.t2-page').classList.toggle('is-kc', r==='signup');
  document.getElementById('t2-review').innerHTML=review(r);
  document.getElementById('t2').innerHTML = r==='signup' ? signup() : r==='flow' ? flow() : settings();
  document.getElementById('t2-modal').innerHTML = r==='settings' ? modal() : '';
  window.scrollTo(0, keepScroll ? y : 0);
}

var toastT;
function toast(msg){ var t=document.getElementById('t2-toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(function(){ t.classList.remove('show'); }, 2400); }
function focusDraft(select){ var el=document.querySelector('[data-draft]'); if(!el) return; el.focus(); if(select) el.select(); else el.setSelectionRange(el.value.length, el.value.length); }
function showErr(){
  var f=S.edit, el=document.querySelector('[data-draft]'), p=document.getElementById('as-'+f+'-err'), b=document.getElementById('as-fsave');
  if(!el) return;
  el.classList.toggle('err', !!S.err); el.setAttribute('aria-invalid', S.err?'true':'false');
  p.hidden=!S.err; p.querySelector('span').textContent=S.err;
  b.disabled=same(f);
}
function trySave(){
  var f=S.edit, v=f==='username' ? S.draft : S.draft.trim();
  S.err=check(f, v);
  if(!S.err && f==='username' && TAKEN.indexOf(v.toLowerCase())>=0) S.err=MSG.usernameTaken;
  if(S.err){ showErr(); focusDraft(); return; }
  S.modal={f:f, to:v}; document.getElementById('t2-modal').innerHTML=modal();
  var c=document.querySelector('[data-act="mdConfirm"]'); if(c) c.focus();
}
function closeModal(){ S.modal=null; document.getElementById('t2-modal').innerHTML=''; focusDraft(); }

var ACT={
  edit:function(t){ S.edit=t.getAttribute('data-f'); S.draft=S.vals[S.edit]; S.err=''; render(true); focusDraft(true); },
  cancel:function(){ S.edit=null; S.err=''; render(true); },
  save:trySave,
  mdCancel:closeModal,
  mdBackdrop:function(t, ev){ if(ev.target===t) closeModal(); },
  mdConfirm:function(){
    var f=S.modal.f, to=S.modal.to; S.modal=null;
    if(S.failNext){ S.failNext=false; S.err=MSG.saveFailed; render(true); focusDraft(); return; }
    S.vals[f]=to; S.left[f]--; S.edit=null; S.err=''; render(true); toast(cap(NAMES[f])+' changed');
  },
  setLeft:function(t){ var n=+t.getAttribute('data-n'); S.left={username:n, firstName:n, lastName:n}; S.edit=null; S.err=''; render(true); },
  failNext:function(){ S.failNext=!S.failNext; render(true); },
  reset:function(){ S=fresh(); render(true); },
  gender:function(t){ S.other.gender=t.getAttribute('data-g'); S.other.dirty=true; render(true); },
  saveOther:function(){ S.other.dirty=false; render(true); toast('Saved'); },
  eye:function(t){ var k=t.getAttribute('data-k'); S.su.show[k]=!S.su.show[k]; render(true); },
  suSubmit:function(){ suValidate(); render(true); },
  suErrors:function(){ S.su.v={first:'', last:'Le', email:'lenguyen2101@gmail.com', username:'my name', pw:'secret12', pw2:'secret13'}; suValidate(); render(true); },
  suReset:function(){ S.su=fresh().su; render(true); }
};
document.addEventListener('click', function(ev){
  var t=ev.target.closest('[data-act]');
  if(t && ACT[t.getAttribute('data-act')]){ if(t.tagName==='A') ev.preventDefault(); ACT[t.getAttribute('data-act')](t, ev); return; }
  var a=ev.target.closest('a'); if(a && a.getAttribute('href')==='#') ev.preventDefault();
});
document.addEventListener('input', function(ev){
  var el=ev.target;
  if(el.hasAttribute('data-draft')){ S.draft=el.value; if(S.err){ var v=S.edit==='username'?S.draft:S.draft.trim(); S.err=check(S.edit, v); } showErr(); return; }
  if(el.hasAttribute('data-su')){ S.su.v[el.getAttribute('data-su')]=el.value; return; }
  if(el.hasAttribute('data-other')){
    if(el.id==='as-bio'){ S.other.bio=el.value; document.getElementById('as-bio-n').textContent=el.value.length+'/200'; }
    if(!S.other.dirty){ S.other.dirty=true; document.querySelector('.as-save').disabled=false; }
  }
});
document.addEventListener('change', function(ev){
  if(ev.target.type==='checkbox' && ev.target.hasAttribute('data-other')){ S.other.news=ev.target.checked; S.other.dirty=true; document.querySelector('.as-save').disabled=false; }
});
document.addEventListener('keydown', function(ev){
  if(S.modal && ev.key==='Escape'){ closeModal(); return; }
  if(ev.target.hasAttribute && ev.target.hasAttribute('data-draft')){
    if(ev.key==='Enter'){ ev.preventDefault(); if(!same(S.edit)) trySave(); }
    if(ev.key==='Escape'){ ACT.cancel(); }
  }
  if(ev.target.hasAttribute && ev.target.hasAttribute('data-su') && ev.key==='Enter'){ ev.preventDefault(); ACT.suSubmit(); }
});
window.addEventListener('hashchange', function(){ render(); });

/* nav (same behaviour as the homepage) */
(function(){
  var nav=document.getElementById('nav'), burger=nav.querySelector('.burger');
  window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY>20); }, {passive:true});
  burger.addEventListener('click', function(){ var open=nav.classList.toggle('open'); burger.setAttribute('aria-expanded', open?'true':'false'); });
  nav.querySelectorAll('.hp-nav-menu a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }); });
})();

render();
})();
