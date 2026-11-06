/* ============================================================================
   Agathos — Giving Guarantee (/task219, GitLab #219). Option 2, as chosen:
     #/         review: project page badge, the info window it opens, mobile
     #/m/sheet  phone frame: the info window open as a bottom sheet; it stays open
   The info window is the version 2 home page banner, repurposed.
   Copy is the "Proposed Copy" from the task; "100% refunded" is from its Background.
   ============================================================================ */
(function(){
'use strict';

var COPY={
  title:'Our Giving Guarantee',
  intro:'Your generosity matters. Whilst every effort is made to ensure integrity, if fraud is proven, we will return your donation, no questions asked.',
  short:'If fraud is proven, we will return your donation, no questions asked.',
  months:['Protected for 12 months','If a donation is found to be misused, you can request a refund within 12 months of the date you made the donation.'],
  where:['Wherever You Give','The donation is covered by our guarantee regardless of where the donation is made around the world and where your donation is directed.'],
  mail:'support@agathos.be'
};

/* ---------- illustrations (home page style: gradient, offset shadow, highlight, sparkles) ---------- */
var uid=0;
function gold(id){ return '<linearGradient id="'+id+'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE59A"/><stop offset="1" stop-color="#FFC838"/></linearGradient><linearGradient id="'+id+'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9A90F"/><stop offset="1" stop-color="#C48A04"/></linearGradient>'; }
function shield(){
  var id='gs'+(++uid), body='M70 14l46 17v35c0 33-21 54-46 66-25-12-46-33-46-66V31z';
  return '<svg class="gg-shield" viewBox="0 0 140 150" fill="none" aria-hidden="true"><defs>'+gold(id)+'</defs>'+
    '<path d="'+body+'" fill="url(#'+id+'b)" transform="translate(0 8)"/>'+
    '<path d="'+body+'" fill="url(#'+id+'a)"/>'+
    '<path d="M70 27l34 12.5v26.5c0 25-15.5 41-34 50.5-18.5-9.5-34-25.5-34-50.5V39.5z" stroke="#fff" stroke-opacity=".55" stroke-width="2.5"/>'+
    '<path d="M51 70l13 13 26-28" stroke="#12275E" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<ellipse cx="48" cy="40" rx="9" ry="5" fill="#fff" opacity=".55" transform="rotate(-30 48 40)"/>'+
    '<path d="M124 18l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5z" fill="#37B9FF"/><path d="M14 96l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#FFC838"/><circle cx="20" cy="30" r="3" fill="#FFC838" opacity=".8"/>'+
  '</svg>';
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
var LINK='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12l4-4M7 6.5L9 4.5a3.5 3.5 0 0 1 5 5L12 11.5M13 13.5L11 15.5a3.5 3.5 0 0 1-5-5L8 8.5"/></svg>';
var CLOSE='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg>';
var MAIL='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2"/><path d="M3 5.5l7 5.5 7-5.5"/></svg>';

/* ---------- info window: the version 2 home page banner, opened from the project page badge ---------- */
function infoWindow(open){
  return '<div class="gg-win'+(open?'':' is-inline')+'"'+(open?' role="dialog" aria-modal="true" aria-labelledby="gg-win-t"':'')+'>'+
    (open?'<button class="gg-win-x" type="button" data-act="winClose" aria-label="Close">'+CLOSE+'</button>':'<span class="gg-win-x" aria-hidden="true">'+CLOSE+'</span>')+
    '<div class="gg-win-main">'+
      '<div class="top"><div class="fig gg-float">'+shield()+'</div><h2'+(open?' id="gg-win-t"':'')+'>'+COPY.title+'</h2></div>'+
      '<p>'+COPY.intro+'</p>'+
      '<div class="big"><b>100%</b><span>of your donation is refunded if a project is found to be fraudulent.</span></div>'+
    '</div>'+
    '<div class="gg-win-side">'+
      '<div class="gg-point"><div class="ic">'+icCalendar()+'</div><div><h3>'+COPY.months[0]+'</h3><p>'+COPY.months[1]+'</p></div></div>'+
      '<div class="gg-point"><div class="ic">'+icGlobe()+'</div><div><h3>'+COPY.where[0]+'</h3><p>'+COPY.where[1]+'</p></div></div>'+
    '</div>'+
    '<div class="gg-win-foot">'+MAIL+'<span>Have a question or need a refund? Contact us at <a href="mailto:'+COPY.mail+'">'+COPY.mail+'</a>.</span></div>'+
  '</div>';
}

/* ---------- project page: the live "Sayang Kalimantan 2026" page, rebuilt from screenshots ---------- */
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
/* the badge: a mini banner right under the giving box; opens the info window */
function ggMini(){
  return '<a class="pp-ggm" href="#" data-act="winOpen" aria-haspopup="dialog"><span class="ic">'+shieldFlat()+'</span>'+
    '<div><b>'+COPY.title+'</b><p>'+COPY.short+' '+COPY.months[0]+'.</p><span class="more">Learn more'+IC.right+'</span></div></a>';
}
function project(){
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
        '<a class="give" href="#" data-act="give">Give</a>'+
        '<div class="brk"><span>Breakdown of total raised</span>'+IC.down+'</div>'+
      '</div>'+ggMini()+
      '<div class="pp-card pp-recent"><h3>Recent Donations</h3>'+donations.map(function(d){
        return '<div class="don"><span class="av">'+IC.guest+'</span><div><b>guest</b><span class="amt">'+d[0]+'</span></div><span class="dt">'+d[1]+'</span></div>';
      }).join('')+'<a class="more" href="#">Show More</a></div>'+
      '<div class="pp-card pp-who"><h3>Who We Are</h3><div class="pro"><img src="assets/img/task219/avatar-wally.png" alt=""><div><b>Wally Tham</b><span>@wallytham</span></div></div>'+
        '<p>Wally Tham is an intervention designer, filmmaker and organisational development practitioner whose work focuses on communities, humanitarian issues and social change.</p></div>'+
    '</div></div>'+
  '</div></div>';
}

/* ---------- review view ---------- */
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
function phone(route, caption){
  return '<figure class="gg-phone"><iframe src="task219.html#/m/'+route+'" title="'+caption+' on a phone" loading="lazy"></iframe><figcaption>'+caption+'</figcaption></figure>';
}
function review(){
  return '<section class="gg-review"><div class="hp-inner">'+
      '<span class="hp-kicker">Task #219</span><h1>Giving Guarantee</h1>'+
      '<p>Option 2, as chosen. A badge on every project page opens an info window about the guarantee. No home page banner and no Giving Guarantee page.</p>'+
    '</div></section>'+
    note(1,'Project page badge','On every project, right under the giving box.','Opens the info window (2)')+
    stageBleed('Project page · desktop', project())+
    note(2,'Info window','A popup that opens when someone clicks the badge (1). It closes with ×, Esc or a click outside. Drawn open here so it can be reviewed without clicking.')+
    stage('Info window (popup) · desktop', infoWindow(false))+
    note(3,'Mobile','The badge comes right after the giving box. The info window opens as a sheet from the bottom of the screen.')+
    '<div class="gg-stage"><div class="gg-where">Mobile · 390px</div><div class="gg-phones">'+phone('sheet','Info window open')+'</div></div>'+
    '<div class="gg-end"></div>';
}

/* ---------- page ---------- */
var winOpen=false, opener=null, winHost=document.createElement('div');
document.body.appendChild(winHost);
function route(){ return location.hash==='#/m/sheet' ? 'msheet' : 'review'; }
function render(){
  var r=route();
  document.getElementById('gg').innerHTML = r==='review' ? review() : project();
  winOpen = r==='msheet';
  renderWin();
  window.scrollTo(0,0);
  /* scroll this frame only: scrollIntoView would also move the review page around the phone frame */
  if(r!=='review'){ var b=document.querySelector('.pp-ggm'); if(b) window.scrollTo(0, b.getBoundingClientRect().top+window.scrollY-160); }
}
function renderWin(){
  winHost.innerHTML = winOpen ? '<div class="gg-win-wrap" data-act="winBackdrop">'+infoWindow(true)+'</div>' : '';
  document.documentElement.classList.toggle('gg-lock', winOpen);
}
function openWin(from){ opener=from||null; winOpen=true; renderWin(); var x=document.querySelector('.gg-win-x'); if(x) x.focus(); }
function closeWin(){
  if(route()==='msheet') return;
  winOpen=false; renderWin(); if(opener) opener.focus(); opener=null; }

var toastT;
function toast(msg){ var t=document.getElementById('gg-toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(function(){ t.classList.remove('show'); }, 2600); }

var ACT={
  give:function(){ toast('The giving flow is not part of this task'); },
  winOpen:openWin,
  winClose:closeWin,
  winBackdrop:function(t, ev){ if(ev.target===t) closeWin(); }
};
document.addEventListener('click', function(ev){
  var t=ev.target.closest('[data-act]');
  if(t && ACT[t.getAttribute('data-act')]){
    if(t.tagName==='A') ev.preventDefault();
    ACT[t.getAttribute('data-act')](t, ev); return;
  }
  /* placeholder links in the nav and footer would clear the route */
  var a=ev.target.closest('a'); if(a && a.getAttribute('href')==='#') ev.preventDefault();
});
document.addEventListener('keydown', function(ev){ if(winOpen && ev.key==='Escape') closeWin(); });
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
