/* ============================================================================
   Agathos — sign-in for accounts made at checkout (/task218, GitLab #218).
   Seven mockups for the GitLab comment, one image per frame.
   ============================================================================ */
(function(){
'use strict';

function h(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

var I={
  fb:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#1877F2"/><path d="M26.4 38V26.6h3.8l.6-4.5h-4.4v-2.8c0-1.3.4-2.2 2.2-2.2h2.3v-4c-.4-.1-1.8-.2-3.4-.2-3.4 0-5.6 2-5.6 5.8v3.4h-3.8v4.5h3.8V38z" fill="#fff"/></svg>',
  g:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23.5" fill="#fff" stroke="#DADCE0"/><path d="M34.6 24.2c0-.8-.1-1.5-.2-2.2H24v4.2h6a5.2 5.2 0 0 1-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2z" fill="#4285F4"/><path d="M24 35c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.7h-3.7v2.9A11 11 0 0 0 24 35z" fill="#34A853"/><path d="M17.7 25.9a6.6 6.6 0 0 1 0-4.2v-2.9h-3.7a11 11 0 0 0 0 9.9z" fill="#FBBC05"/><path d="M24 17.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 14 18.8l3.7 2.9c.9-2.7 3.4-4.3 6.3-4.3z" fill="#EA4335"/></svg>',
  eye:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5C6.8 5.5 3 9.6 2 12c1 2.4 4.8 6.5 10 6.5s9-4.1 10-6.5c-1-2.4-4.8-6.5-10-6.5z" fill="currentColor"/><circle cx="12" cy="12" r="3.6" fill="#fff"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.8 7.2l8.2 6.3 8.2-6.3"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/></svg>',
  tick:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5"/></svg>',
  person:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-3.6 4.1-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/></svg>',
  x:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>',
  okc:'<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="currentColor"/><path d="M4.6 8.3l2.3 2.3 4.5-4.8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  card:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5V8H3zM3 10.5h18v7a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5zM6 15h4v1.6H6z"/></svg>',
  qr:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 3h8v8H3zm2 2v4h4V5zM13 3h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 13h3v3h-3zm5 0h3v3h-3zm-5 5h3v3h-3zm5 0h3v3h-3z"/></svg>'
};

var EMAIL='lenguyen@gmail.com';

/* ============ KEYCLOAK ============ */
function kc(inner){
  return '<div class="kc"><div class="kc-top"><img src="assets/img/home/agathos-logo.png" alt="agathos"></div>'+
    '<div class="kc-body"><div class="kc-card"><div class="kc-lang">English</div>'+inner+'</div></div></div>';
}
function field(label, val, o){
  o=o||{};
  return '<div class="kc-f'+(o.err?' err':'')+'"><div class="kc-l">'+h(label)+'</div>'+
    '<div class="kc-box'+(o.pw?' pw':'')+'"><div class="kc-in">'+h(val||'')+'</div>'+(o.pw?'<span class="kc-eye">'+I.eye+'</span>':'')+'</div>'+
    (o.msg?'<div class="kc-msg">'+o.msg+'</div>':'')+'</div>';
}
function social(){ return '<div class="kc-social">'+I.fb+I.g+'</div>'; }

function signIn(){
  return kc('<h1>Sign in to your account</h1>'+
    '<div class="kc-first"><b>First time here?</b>If you\'ve bought a ticket or donated, your account is ready.<br><span class="go">Get a sign-in link</span></div>'+
    '<p class="kc-sub">Using your social media accounts:</p>'+social()+
    '<p class="kc-sub">or sign in manually</p>'+
    '<div class="kc-form">'+field('Username or email')+field('Password','',{pw:1})+'</div>'+
    '<div class="kc-opts"><span class="kc-check"><i></i>Remember me</span><a>Forgot Password?</a></div>'+
    '<div class="kc-submit">Sign In</div>'+
    '<p class="kc-signup"><b>Don\'t have an account?</b><a>Create an account</a></p>');
}
function getLink(){
  return kc('<h1>Get a sign-in link</h1>'+
    '<p class="kc-p">Enter your email. We\'ll send you a link to set a password and sign in.</p>'+
    '<div class="kc-form">'+field('Email', EMAIL)+'</div>'+
    '<a class="kc-back">« Back to Login</a>'+
    '<div class="kc-submit">Send link</div>');
}
function checkEmail(){
  return kc('<div class="kc-icon">'+I.mail+'</div><h1>Check your email</h1>'+
    '<p class="kc-p">If <b>'+h(EMAIL)+'</b> has an Agathos account, a sign-in link is on its way.</p>'+
    '<p class="kc-note">'+I.clock+'The link works for 15 minutes.</p>'+
    '<p class="kc-again">Didn\'t get it? Check your spam folder, or <a>send it again</a>.</p>'+
    '<div class="kc-center"><a class="kc-back">« Back to Login</a></div>');
}
function register(){
  return kc('<h1>Register</h1>'+
    '<p class="kc-sub">Using your social media accounts:</p>'+social()+
    '<p class="kc-sub">Or register with email address</p>'+
    '<div class="kc-form">'+
      field('First name','Nguyen')+field('Last name','Le')+
      field('Email', EMAIL, {err:1, msg:'An account with this email already exists.<span>Try <a>Logging In</a> or <a>Resetting Your Password</a>.</span>'})+
      field('Username','nguyenle')+field('Password','',{pw:1})+field('Confirm password','',{pw:1})+
    '</div>'+
    '<a class="kc-back">« Back to Login</a>'+
    '<div class="kc-submit">Create an account</div>'+
    '<p class="kc-terms">By joining agathos, you agree with our <a>Terms of Use</a> and <a>Privacy Policy</a>.</p>');
}

/* ============ EMAILS ============ */
function mail(inner){ return '<div class="em"><div class="email-wrap"><img class="logo" src="assets/img/task218/email-logo.png" alt="agathos">'+inner+'<p class="footer">&copy; 2023 Agathos Investments Pte Ltd</p></div></div>'; }
var SIGN='<p class="signature">Reimagining the Giving Movement,<br>Team agathos</p><hr class="divider">';

function linkMail(){
  return mail('<h1 class="main-title">Your sign-in link</h1>'+
    '<p>Hi {{firstName}},</p>'+
    '<p class="lede">Set a password to sign in to your Agathos account.</p>'+
    '<a class="btn">Set Password &amp; Sign In</a>'+
    '<div class="disclaimer"><p>This link works for 15 minutes. If it has expired, ask for a new one on the Sign in page.<br>Didn\'t ask for this? You can ignore this email.</p></div>'+
    SIGN);
}
function ticketMail(){
  return mail('<img class="hero" src="assets/img/task218/email-hero.jpg" alt="">'+
    '<h1 class="main-title">Your tickets are confirmed!</h1>'+
    '<p>Dear {{recipient_name}},</p>'+
    '<p>Great news &mdash; your ticket(s) for <strong>Registration Test</strong> have been secured. We can\'t wait to see you there.</p>'+
    '<div class="detail-card"><h2>Event Details</h2><table><tbody>'+
      '<tr><td class="key">Event</td><td class="val"><a>Registration Test</a></td></tr>'+
      '<tr><td class="key">Organiser</td><td class="val">Paya Lebar Methodist Church</td></tr>'+
      '<tr><td class="key">Location</td><td class="val">111 Harborfront, Singapore</td></tr>'+
      '<tr><td class="key">Date &amp; Time</td><td class="val">Mon, 11 Aug 2025 &ndash; Mon, 31 Aug 2026<br>9:39 AM to 9:39 AM (Asia/Singapore)</td></tr>'+
    '</tbody></table></div>'+
    '<div class="detail-card"><h2>Your Tickets</h2><table class="items"><tbody>'+
      '<tr><td class="d">Admission for 1<span class="q">2 &times; S$10.00</span></td><td class="a">S$20.00</td></tr>'+
      '<tr><td class="d">VIP Seat<span class="q">1 &times; S$50.00</span></td><td class="a">S$50.00</td></tr>'+
      '<tr class="sum"><td class="d">Subtotal &middot; 3 tickets</td><td class="a">S$70.00</td></tr>'+
      '<tr><td class="d">Love Gift to Organiser</td><td class="a">S$5.00</td></tr>'+
      '<tr><td class="d">Promo Discount</td><td class="a neg">&minus;S$10.00</td></tr>'+
      '<tr class="grand"><td class="d">Total Paid</td><td class="a">S$65.00</td></tr>'+
    '</tbody></table></div>'+
    '<div class="detail-card"><h2>Payment</h2><table><tbody>'+
      '<tr><td class="key">Payment Method</td><td class="val">Credit Card</td></tr>'+
      '<tr><td class="key">Reference No.</td><td class="val">Aihmjq9ps</td></tr>'+
      '<tr><td class="key">Date</td><td class="val">{{purchase_date}}</td></tr>'+
    '</tbody></table></div>'+
    '<div class="detail-card acct"><h2>Your Agathos Account</h2><p>We\'ve created an account with <strong>{{recipient_email}}</strong> so your tickets are always within reach. Set a password once, then sign in to see them anytime.</p></div>'+
    '<a class="btn">Set Password &amp; View Tickets</a>'+
    '<p class="btn-note">If the button has expired, go to Sign in and choose <strong>First time here?</strong></p>'+
    '<p class="contact">If you have any questions, feel free to reach out to us at <a>hello@agathos.be</a> or the event organisers at <a>{{organiser_email}}</a></p>'+
    SIGN+
    '<p class="social-title">Connect With Us</p>'+
    '<div class="social"><span><img src="assets/img/task218/social-instagram.png" alt="Instagram"></span><span><img src="assets/img/task218/social-facebook.png" alt="Facebook"></span><span><img src="assets/img/task218/social-linkedin.png" alt="LinkedIn"></span></div>');
}

/* ============ GET TICKETS, STEP 3 ============ */
function checkout(){
  return '<div class="co"><div class="co-m">'+
    '<div class="co-hd">'+I.back+'<h3>Get Tickets</h3>'+I.close+'</div>'+
    '<p class="co-ev">Creation Care Conference 2025<i>•</i>Friday, 19/2/2025<i>•</i>6:30 PM - 8:30 PM</p>'+
    '<div class="co-steps"><span class="ok">'+I.tick+'</span><b>Select Tickets</b><i></i><span class="ok">'+I.tick+'</span><b>Registration Form</b><i></i><span class="cur">3</span><b class="cur">Checkout</b></div>'+
    '<div class="co-body">'+
      '<div class="co-h">Billing Information</div>'+
      '<div class="co-info"><span>'+I.person+'Already have an account? Log in to autofill your details.</span><span class="co-login">Login</span></div>'+
      '<div class="co-row"><div><div class="co-l"><em>*</em>Your name</div><div class="co-in">Nguyen Le</div></div><div><div class="co-l"><em>*</em>Email</div><div class="co-in">'+h(EMAIL)+'</div></div></div>'+
      '<div class="co-note">We\'ll create an Agathos account with these details and send your tickets to <a>'+h(EMAIL)+'</a></div>'+
      '<div class="co-mk"><i></i>Send me news about events and causes on Agathos</div>'+
      '<div class="co-h gap">Order Summary</div>'+
      '<div class="co-sum">'+
        '<div class="co-li"><b>1x</b>General Admission<em>S$1000</em></div>'+
        '<div class="co-li"><b>2x</b>Female Ticket<em>S$400</em></div>'+
        '<div class="co-promo"><span>'+I.x+'HITHERE</span><span class="ok">'+I.okc+'Applied</span></div>'+
        '<div class="co-li">Discount Applied:<em>-S$50</em></div>'+
        '<div class="co-tot"><span>Total</span><span>S$1,350</span></div>'+
      '</div>'+
      '<div class="co-h gap">Select Payment Method</div>'+
      '<div class="co-pay"><div class="sel">'+I.card+'Cards &amp; Digital Wallets</div><div>'+I.qr+'PayNow<em>For Singapore Only</em></div></div>'+
    '</div>'+
    '<div class="co-ft"><div><div class="q">3 Tickets</div><div class="p">S$1,350<s>S$1,400</s></div></div><span class="co-go">Proceed To Payment</span></div>'+
  '</div></div>';
}

/* ============ PAGE ============ */
var ITEMS=[
  {id:'sign-in',        t:'Sign in',                         d:'New: the "First time here?" box under the title. The rest is the live page.', draw:signIn},
  {id:'get-link',       t:'Get a sign-in link',              d:'The Forgot Password page, reworded to fit both cases. "Get a sign-in link" and "Forgot Password?" both open it.', draw:getLink},
  {id:'check-email',    t:'Check your email',                d:'Shown after "Send link". It says the same thing whether or not the email has an account.', draw:checkEmail},
  {id:'sign-in-email',  t:'Email: sign-in link',             d:'The reset email that Keycloak sends, in the Agathos email style. The button opens the set-password page, then signs the person in.', draw:linkMail},
  {id:'tickets-email',  t:'Email: tickets and account in one', d:'The tickets email template, for a new account. New: the "Your Agathos account" box and the button "Set Password & View Tickets". Existing accounts keep "View Your Tickets".', draw:ticketMail},
  {id:'checkout',       t:'Get Tickets, step 3',             d:'From the checkout design "Step checkout - Opt. 2". New: the unticked marketing box under the account line.', draw:checkout},
  {id:'register',       t:'Register (#228)',                 d:'The live Register page with the error copy from the sheet.', draw:register}
];

function render(){
  document.getElementById('t18-bar').innerHTML=
    '<span class="t">Task #218 <span>· Sign-in for accounts made at checkout</span></span>';
  document.getElementById('t18').innerHTML=
    '<p class="t18-intro">Mockups for the GitLab comment on #218. Each frame is one image.</p>'+
    ITEMS.map(function(x, i){
      return '<section class="t18-item" id="'+x.id+'"><div class="t18-cap"><span class="n">Image '+(i+1)+'</span>'+
        '<div><h2>'+h(x.t)+'</h2><p>'+h(x.d)+'</p></div></div>'+
        '<div class="t18-shot"><div id="f-'+x.id+'">'+x.draw()+'</div></div></section>';
    }).join('');
}

render();
})();
