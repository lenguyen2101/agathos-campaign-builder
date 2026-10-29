/* ============================================================================
   Agathos — Giving Guarantee (/task219, GitLab #219).
     #/v1       Version 1: front page banner (minimal) + project badge, both open the page
     #/v1/page  Version 1: the Giving Guarantee page
     #/v2       Version 2: front page banner (full information) + project mini banner
   Copy is the "Proposed Copy" from the task; "100% refunded" is from its Background.
   ============================================================================ */
(function(){
'use strict';

var COPY={
  title:'Our Giving Guarantee',
  intro:'Your generosity matters. Whilst every effort is made to ensure integrity, if fraud is proven, we will return your donation, no questions asked.',
  short:'If fraud is proven, we will return your donation, no questions asked.',
  full:'If a project is found to be fraudulent, your donation is refunded in full.',
  months:['Protected for 12 months','If a donation is found to be misused, you can request a refund within 12 months of the date you made the donation.'],
  where:['Wherever You Give','The donation is covered by our guarantee regardless of where the donation is made around the world and where your donation is directed.']
};

/* ---------- illustrations (home page style: gradient, offset shadow, highlight, sparkles) ---------- */
var uid=0;
function gold(id){ return '<linearGradient id="'+id+'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE59A"/><stop offset="1" stop-color="#FFC838"/></linearGradient><linearGradient id="'+id+'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9A90F"/><stop offset="1" stop-color="#C48A04"/></linearGradient>'; }
function shield(plain){
  var id='gs'+(++uid), body='M70 14l46 17v35c0 33-21 54-46 66-25-12-46-33-46-66V31z';
  return '<svg class="gg-shield" viewBox="0 0 140 150" fill="none" aria-hidden="true"><defs>'+gold(id)+'</defs>'+
    '<path d="'+body+'" fill="url(#'+id+'b)" transform="translate(0 8)"/>'+
    '<path d="'+body+'" fill="url(#'+id+'a)"/>'+
    '<path d="M70 27l34 12.5v26.5c0 25-15.5 41-34 50.5-18.5-9.5-34-25.5-34-50.5V39.5z" stroke="#fff" stroke-opacity=".55" stroke-width="2.5"/>'+
    '<path d="M51 70l13 13 26-28" stroke="#12275E" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<ellipse cx="48" cy="40" rx="9" ry="5" fill="#fff" opacity=".55" transform="rotate(-30 48 40)"/>'+
    (plain?'':'<path d="M124 18l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5z" fill="#37B9FF"/><path d="M14 96l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#FFC838"/><circle cx="20" cy="30" r="3" fill="#FFC838" opacity=".8"/>')+
  '</svg>';
}
function icRefund(){
  var id='gr'+(++uid);
  return '<svg class="gg-shield" viewBox="0 0 90 90" fill="none" aria-hidden="true"><defs>'+gold(id)+'</defs>'+
    '<circle cx="45" cy="50" r="32" fill="url(#'+id+'b)"/><circle cx="45" cy="45" r="32" fill="url(#'+id+'a)"/>'+
    '<circle cx="45" cy="45" r="24" stroke="#E9A90F" stroke-width="2.5" opacity=".6"/>'+
    '<text x="45" y="52" text-anchor="middle" font-family="Be Vietnam Pro, system-ui, sans-serif" font-weight="900" font-size="19" fill="#12275E">100%</text>'+
    '<ellipse cx="31" cy="25" rx="7" ry="4" fill="#fff" opacity=".55" transform="rotate(-30 31 25)"/>'+
    '<path d="M80 12l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#37B9FF"/></svg>';
}
function icCalendar(){
  var id='gc'+(++uid);
  return '<svg class="gg-shield" viewBox="0 0 90 90" fill="none" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F3F6FB"/></linearGradient></defs>'+
    '<rect x="18" y="22" width="62" height="60" rx="12" fill="#BFD1F0"/>'+
    '<rect x="12" y="16" width="62" height="60" rx="12" fill="url(#'+id+')" stroke="#E6ECF7"/>'+
    '<path d="M12 28a12 12 0 0 1 12-12h38a12 12 0 0 1 12 12v6H12z" fill="#12275E"/>'+
    '<rect x="25" y="9" width="7" height="16" rx="3.5" fill="#37B9FF"/><rect x="54" y="9" width="7" height="16" rx="3.5" fill="#37B9FF"/>'+
    '<text x="43" y="66" text-anchor="middle" font-family="Be Vietnam Pro, system-ui, sans-serif" font-weight="900" font-size="26" fill="#12275E">12</text>'+
    '<path d="M82 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#FFC838"/></svg>';
}
function icGlobe(){
  var id='gl'+(++uid);
  return '<svg class="gg-shield" viewBox="0 0 90 90" fill="none" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FD3FF"/><stop offset="1" stop-color="#37B9FF"/></linearGradient></defs>'+
    '<circle cx="42" cy="50" r="31" fill="#1FA9F5"/><circle cx="42" cy="45" r="31" fill="url(#'+id+')"/>'+
    '<g stroke="#fff" stroke-width="2.5" opacity=".85"><ellipse cx="42" cy="45" rx="13" ry="31"/><path d="M11 45h62M16 30h52M16 60h52"/></g>'+
    '<ellipse cx="27" cy="25" rx="7" ry="4" fill="#fff" opacity=".5" transform="rotate(-30 27 25)"/>'+
    '<path d="M70 12c-6 0-10.5 4.5-10.5 10.2C59.5 29.5 70 38 70 38s10.5-8.5 10.5-15.8C80.5 16.5 76 12 70 12z" fill="#E9A90F" transform="translate(0 3)"/>'+
    '<path d="M70 12c-6 0-10.5 4.5-10.5 10.2C59.5 29.5 70 38 70 38s10.5-8.5 10.5-15.8C80.5 16.5 76 12 70 12z" fill="#FFC838"/>'+
    '<circle cx="70" cy="22" r="4" fill="#12275E"/></svg>';
}
var ARROW='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg>';
var BACK='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 10H4M9 5l-5 5 5 5"/></svg>';
var TICK='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 10.5l3.2 3L15 6.5"/></svg>';
var LINK='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12l4-4M7 6.5L9 4.5a3.5 3.5 0 0 1 5 5L12 11.5M13 13.5L11 15.5a3.5 3.5 0 0 1-5-5L8 8.5"/></svg>';

/* ---------- 1. front page banners ---------- */
function bannerV1(){
  return '<a class="gg-b1" href="#/v1/page">'+
    '<div class="fig gg-float">'+shield()+'</div>'+
    '<div><h2>'+COPY.title+'</h2><p>'+COPY.short+'</p>'+
      '<div class="gg-chips"><span>'+TICK+'100% refund</span><span>'+TICK+'Protected for 12 months</span><span>'+TICK+'Wherever you give</span></div></div>'+
    '<span class="hp-btn gold cta">Learn more '+ARROW+'</span>'+
  '</a>';
}
function bannerV2(){
  return '<section class="gg-b2" id="gg-banner-v2" aria-label="Our Giving Guarantee">'+
    '<div class="gg-b2-main">'+
      '<div class="top"><div class="fig gg-float">'+shield()+'</div><h2>'+COPY.title+'</h2></div>'+
      '<p>'+COPY.intro+'</p>'+
      '<div class="big"><b>100%</b><span>of your donation is refunded if a project is found to be fraudulent.</span></div>'+
      '<a class="faq" href="#" data-act="faq">Read the FAQ '+ARROW+'</a>'+
    '</div>'+
    '<div class="gg-b2-side">'+
      '<div class="gg-point"><div class="ic">'+icCalendar()+'</div><div><h3>'+COPY.months[0]+'</h3><p>'+COPY.months[1]+'</p></div></div>'+
      '<div class="gg-point"><div class="ic">'+icGlobe()+'</div><div><h3>'+COPY.where[0]+'</h3><p>'+COPY.where[1]+'</p></div></div>'+
    '</div>'+
  '</section>';
}

/* ---------- 2. project page: the live "Sayang Kalimantan 2026" page, rebuilt from screenshots ---------- */
var IC={
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 10.5L12 3.5l8.5 7"/><path d="M5.5 9v11h4.5v-6h4v6h4.5V9"/></svg>',
  crumb:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5l5 5-5 5"/></svg>',
  clock:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M10 6v4.2l2.6 1.6"/></svg>',
  person:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="6.5" r="3.5"/><path d="M3.5 17.5c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/></svg>',
  bookmark:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 3h9v14l-4.5-3.2L5.5 17z"/></svg>',
  share:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="14.5" cy="4.5" r="2.5"/><circle cx="5.5" cy="10" r="2.5"/><circle cx="14.5" cy="15.5" r="2.5"/><path d="M7.7 8.8l4.6-2.9M7.7 11.2l4.6 2.9"/></svg>',
  down:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7.5l5 5 5-5"/></svg>',
  right:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 5l5 5-5 5"/></svg>',
  guest:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#E4E4E7"/><circle cx="24" cy="24" r="22.5" fill="none" stroke="#F4F4F5" stroke-width="3"/><circle cx="24" cy="19" r="7" fill="#A1A1AA"/><path d="M11 37c2.2-6 7-9 13-9s10.8 3 13 9a20 20 0 0 1-26 0z" fill="#A1A1AA"/></svg>'
};
/* a flat shield that sits with the page's own icons and the gold Trustmark */
function shieldFlat(){
  return '<svg viewBox="0 0 32 34" fill="none" aria-hidden="true"><path d="M16 2l12 4.5v9c0 8.6-5.4 14-12 17.1C9.4 29.5 4 24.1 4 15.5v-9z" fill="#FFC838"/><path d="M16 2l12 4.5v9c0 8.6-5.4 14-12 17.1z" fill="#F2B21B"/><path d="M10.5 16.5l3.8 3.8 7.4-7.8" stroke="#12275E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
/* version 1: one row inside the giving box, under the Give button */
function ggBadge(){
  return '<a class="pp-gg" href="#/v1/page"><span class="ic">'+shieldFlat()+'</span><span class="t"><b>Giving Guarantee</b><small>'+COPY.months[0]+'</small></span>'+IC.right+'</a>';
}
/* version 2: a mini banner right under the giving box */
function ggMini(){
  return '<a class="pp-ggm" href="#gg-banner-v2" data-act="toBanner"><span class="ic">'+shieldFlat()+'</span>'+
    '<div><b>'+COPY.title+'</b><p>'+COPY.short+' '+COPY.months[0]+'.</p><span class="more">Learn more'+IC.right+'</span></div></a>';
}
function project(v){
  var donations=[['S$100','29/10/2026'],['S$215','28/10/2026'],['S$200','28/10/2026']];
  return '<div class="pp"><div class="pp-inner">'+
    '<nav class="pp-crumb" aria-label="Breadcrumb"><a href="home.html" aria-label="Home">'+IC.home+'</a>'+IC.crumb+'<a href="home.html#causes">Support a Cause</a>'+IC.crumb+'<span>Sayang Kalimantan 2026</span></nav>'+
    '<div class="pp-cols"><div class="pp-left">'+
      '<div class="pp-media"><img src="assets/img/task219/slide-kalimantan.png" alt="Help Kalimantan Breathe and Fight the Fires"></div>'+
      '<div class="pp-head"><h1>Sayang Kalimantan 2026</h1>'+
        '<div class="pp-by">by <img src="assets/img/task219/avatar-wally.png" alt=""><span>wallytham</span></div>'+
        '<div class="pp-acts"><a href="#">'+IC.bookmark+'Bookmark</a><a href="#">'+IC.share+'Share</a></div>'+
        '<div class="pp-chips"><span class="pp-chip hum"><img src="assets/img/task219/icon-humanitarian.png" alt="">Humanitarian</span><span class="pp-chip trust"><img src="assets/img/task219/icon-trustmark.png" alt="">agathos Trustmark</span></div></div>'+
      '<div class="pp-tabs"><span class="on">Project</span><span>Updates</span><span>Contributions</span></div>'+
      '<div class="pp-sec intro"><div class="lbl">Introduction</div>'+
        '<h3>We’re suffering from the haze in Singapore, but there are those in greater danger.</h3>'+
        '<p>The conditions in Kalimantan are deadly.</p>'+
        '<p><b>PM 2.5</b> levels have been over <b>1000</b> regularly for weeks due to the fires.</p>'+
        '<p><b>RISKS</b>: Children and the elderly are most vulnerable to toxic exposure that can lead to strokes, trigger respiratory issues and increase risks of cancer and heart disease.</p>'+
        '<h3>Let’s be a good neighbour and help them.</h3>'+
        '<p><b>Please adopt a Place of Safety for $700. We aim to build 40 more haze shelters to protect the vulnerable.</b></p></div>'+
      '<div class="pp-sec bg"><div class="lbl">Background &amp; Context</div>'+
        '<p>Wally &amp; his team at Big Red Button have been pioneering the work of Haze Shelters in Indonesia since 2015. With our partner, Ranu Welum Foundation, we have 23 shelters in operation. In total we are taking care of up to 600 individuals at any given time.</p></div>'+
    '</div><div class="pp-right">'+
      '<div class="pp-give">'+
        '<div class="days">'+IC.clock+'<span><b>33 days</b> to go</span></div>'+
        '<div class="row"><div class="raised"><b>S$73,612</b><span>Raised</span></div><div class="donors">'+IC.person+'<b>243</b></div></div>'+
        '<div class="pct">92.02% of S$80,000</div><div class="track"><i style="width:92.02%"></i></div>'+
        '<a class="give" href="#" data-act="give">Give</a>'+(v===1?ggBadge():'')+
        '<div class="brk"><span>Breakdown of total raised</span>'+IC.down+'</div>'+
      '</div>'+(v===2?ggMini():'')+
      '<div class="pp-card pp-recent"><h3>Recent Donations</h3>'+donations.map(function(d){
        return '<div class="don"><span class="av">'+IC.guest+'</span><div><b>guest</b><span class="amt">'+d[0]+'</span></div><span class="dt">'+d[1]+'</span></div>';
      }).join('')+'<a class="more" href="#">Show More</a></div>'+
      '<div class="pp-card pp-who"><h3>Who We Are</h3><div class="pro"><img src="assets/img/task219/avatar-wally.png" alt=""><div><b>Wally Tham</b><span>@wallytham</span></div></div>'+
        '<p>Wally Tham is an intervention designer, filmmaker and organisational development practitioner whose work focuses on communities, humanitarian issues and social change.</p></div>'+
    '</div></div>'+
  '</div></div>';
}

/* ---------- 3. Giving Guarantee page (version 1) ---------- */
function page(){
  return '<div class="gg-bar"><span>Task #219 · Version 1 · Giving Guarantee page</span><a href="#/v1">'+BACK+'Back to Version 1</a></div>'+
  '<section class="gg-hero"><div class="hp-inner">'+
    '<div><span class="hp-kicker gold">Giving Guarantee</span><h1>'+COPY.title+'</h1><p>'+COPY.intro+'</p>'+
      '<div class="acts"><a class="hp-btn gold" href="home.html#causes">Find a project to support '+ARROW+'</a><a class="hp-btn outline" href="#" data-act="toHow">How it works</a></div></div>'+
    '<div class="fig gg-float">'+shield()+'</div>'+
  '</div></section>'+

  '<section class="gg-sec"><div class="hp-inner">'+
    '<div class="gg-sec-head"><span class="hp-kicker">What\'s covered</span><h2 class="hp-h2" style="margin-top:12px">Every donation, <em class="hp-hl">protected<i></i></em></h2></div>'+
    '<div class="gg-pillars">'+
      '<div class="gg-pillar"><div class="ic">'+icRefund()+'</div><h3>100% of your donation</h3><p>'+COPY.full+'</p></div>'+
      '<div class="gg-pillar"><div class="ic">'+icCalendar()+'</div><h3>'+COPY.months[0]+'</h3><p>'+COPY.months[1]+'</p></div>'+
      '<div class="gg-pillar"><div class="ic">'+icGlobe()+'</div><h3>'+COPY.where[0]+'</h3><p>'+COPY.where[1]+'</p></div>'+
    '</div></div></section>'+

  '<section class="gg-sec cream" id="gg-how"><div class="hp-inner">'+
    '<div class="gg-sec-head"><span class="hp-kicker">How it works</span><h2 class="hp-h2" style="margin-top:12px">If fraud is proven, you get your gift back</h2></div>'+
    '<ol class="gg-steps">'+
      '<li><span class="no">01</span><h3>You give to a project</h3><p>Every project on Agathos is covered, wherever you give from and wherever your donation goes.</p></li>'+
      '<li><span class="no">02</span><h3>Fraud is proven</h3><p>Every effort is made to ensure integrity. If a project is found to be fraudulent, the guarantee applies.</p><span class="gg-tbc">To confirm: who decides</span></li>'+
      '<li><span class="no">03</span><h3>You get your donation back</h3><p>Request a refund within 12 months of your donation. We return it in full, no questions asked.</p><span class="gg-tbc">To confirm: how to request</span></li>'+
    '</ol></div></section>'+

  '<section class="gg-sec" style="padding-top:56px;padding-bottom:56px"><div class="gg-tbc-box">'+
    '<h3>To confirm before launch</h3><p>Review note, not part of the page. The task copy doesn\'t cover these yet.</p><ul>'+
      '<li><b>How donors request a refund.</b> Give.asia: donors email their team. GoFundMe: a claim form.</li>'+
      '<li><b>What counts as proven fraud, and who decides.</b> Give.asia lists examples, and says rumours and family disputes are not fraud.</li>'+
      '<li><b>What is not covered.</b> For example, whether love gifts to Agathos are refunded too (Give.asia refunds the tip with the donation).</li>'+
      '<li><b>How long a refund takes, and where it goes.</b> Give.asia: back to the original card in 5–10 business days.</li>'+
    '</ul></div></section>'+

  '<section class="gg-close"><h2>Every donation on Agathos is covered.</h2><p>Find a project you care about and give with confidence.</p><a class="hp-btn gold" href="home.html#causes">Explore causes '+ARROW+'</a></section>';
}

/* ---------- review views ---------- */
function note(n, title, text, to){
  return '<div class="gg-note"><span class="no">'+n+'</span><div><h2>'+title+'</h2><p>'+text+'</p>'+(to?'<span class="to">'+LINK+to+'</span>':'')+'</div></div>';
}
function stage(where, inner){
  return '<div class="gg-stage"><div class="gg-where">'+where+'</div><div class="gg-frame">'+inner+'</div></div>';
}
/* the project page runs full width, at its real size */
function stageBleed(where, inner){
  return '<div class="gg-bleed"><div class="gg-where">'+where+'</div>'+inner+'</div>';
}
function head(v){
  return '<section class="gg-review"><div class="hp-inner">'+
    '<span class="hp-kicker">Task #219</span><h1>Giving Guarantee banners</h1>'+
    '<p>Two versions to compare. Version 1 has its own Giving Guarantee page. Version 2 explains the guarantee on the front page instead.</p>'+
    '<nav class="gg-tabs" aria-label="Versions">'+
      '<a href="#/v1"'+(v===1?' class="on" aria-current="page"':'')+'>Version 1<small>With a Giving Guarantee page</small></a>'+
      '<a href="#/v2"'+(v===2?' class="on" aria-current="page"':'')+'>Version 2<small>No Giving Guarantee page</small></a>'+
    '</nav></div></section>';
}
function preview(){
  return '<a class="gg-preview" href="#/v1/page">'+
    '<div class="pv-hero"><div class="pv-fig">'+shield(true)+'</div><div><b>'+COPY.title+'</b><span>'+COPY.short+'</span></div></div>'+
    '<ul class="pv-list"><li><i>'+TICK+'</i>What\'s covered</li><li><i>'+TICK+'</i>How a refund works, in 3 steps</li><li><i>'+TICK+'</i>A link to find a project</li></ul>'+
    '<span class="hp-btn blue">Open the page '+ARROW+'</span></a>';
}
function v1(){
  return head(1)+
    note(1,'Front page banner','Minimal, for branding. Sits on the home page between "Causes that need you today" and "Three ways".','Opens the Giving Guarantee page (3)')+
    stage('Home page', bannerV1())+
    note(2,'Project page badge','On every project, inside the giving box, right under the Give button.','Opens the Giving Guarantee page (3)')+
    stageBleed('Project page', project(1))+
    note(3,'Giving Guarantee page','Explains what the guarantee covers and how a refund works.')+
    stage('Giving Guarantee page', preview())+
    '<div class="gg-end"></div>';
}
function v2(){
  return head(2)+
    note(1,'Front page banner','Explains the guarantee in full, in the same spot on the home page.','"Read the FAQ" opens the FAQ')+
    stage('Home page', bannerV2())+
    note(2,'Project page mini banner','On every project, right under the giving box. Gives the key point without leaving the page.','Opens the front page banner (1)')+
    stageBleed('Project page', project(2))+
    '<div class="gg-end"></div>';
}

function route(){ var hsh=location.hash; return hsh==='#/v2' ? 'v2' : hsh==='#/v1/page' ? 'page' : 'v1'; }
function render(){
  var r=route();
  document.getElementById('gg').innerHTML = r==='v2' ? v2() : r==='page' ? page() : v1();
  window.scrollTo(0,0);
}

var toastT;
function toast(msg){ var t=document.getElementById('gg-toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(function(){ t.classList.remove('show'); }, 2600); }
function scrollToId(id){ var el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }

var ACT={
  faq:function(){ toast('Opens the FAQ (Giving Guarantee) on the live site'); },
  give:function(){ toast('The giving flow is not part of this task'); },
  toBanner:function(){ scrollToId('gg-banner-v2'); toast('On the live site this opens the banner on the home page'); },
  toHow:function(){ scrollToId('gg-how'); }
};
document.addEventListener('click', function(ev){
  var a=ev.target.closest('a'); if(!a) return;
  var act=a.getAttribute('data-act');
  if(act && ACT[act]){ ev.preventDefault(); ACT[act](a); return; }
  /* placeholder links in the nav and footer would clear the route */
  if(a.getAttribute('href')==='#') ev.preventDefault();
});
window.addEventListener('hashchange', render);

/* nav (same behaviour as the homepage) */
(function(){
  var nav=document.getElementById('nav'), burger=nav.querySelector('.burger');
  window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY>20); }, {passive:true});
  burger.addEventListener('click', function(){ var open=nav.classList.toggle('open'); burger.setAttribute('aria-expanded', open?'true':'false'); });
  nav.querySelectorAll('.hp-nav-menu a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }); });
})();

render();
})();
