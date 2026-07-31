/* ============================================================================
   BACKEND BOUNDARY
   ----------------------------------------------------------------------------
   Every page reads and writes campaigns through this file only — no page ever
   touches localStorage directly. To wire a real backend, replace the six
   functions in the "DATA ACCESS" block below with HTTP calls. Nothing else in
   the prototype needs to change.

     listCampaigns()        GET    /admin/campaigns            -> Campaign[]
     getCampaign(id)        GET    /admin/campaigns/:id         -> Campaign
     saveCampaign(c)        POST   /admin/campaigns             -> Campaign   (no c.id)
                            PATCH  /admin/campaigns/:id         -> Campaign   (has c.id)
     deleteCampaign(id)     DELETE /admin/campaigns/:id

   Status is part of the Campaign record, so it changes through saveCampaign()
   like any other field — there is no separate archive/publish endpoint.

   These are synchronous in the prototype. Against a real API they become
   async — wrap call sites in await / .then().

   Campaign shape
   --------------
     id            string      server-assigned
     eyebrow       string      hero kicker, e.g. 'EMERGENCY APPEAL · URGENT'
     name          string      hero title
     subtitle      string      the paragraph under the hero title
     bannerDesktop string      image path — 1920x1080 (16:9)
     bannerMobile  string      image path — 375x667 (9:16), optional
     items         string[]    catalogue IDs — referenced, never mutated
     featured      string      item ID, only meaningful when spotlight=true
     showGoal      boolean     render the campaign total goal on the page
     status        string       one of STATUSES
     start         string      'YYYY-MM-DD' or '' when not scheduled
     end           string      'YYYY-MM-DD' or ''
     spotlight     boolean
     promoHero     boolean
     ctaLabel      string      only meaningful when promoHero=true
     link          string      only meaningful when promoHero=true
     promoBanner   boolean
     aboutTitle    string      heading of the ABOUT THIS CAMPAIGN block
     aboutBody     string      body of that block, as rich-text HTML
     createdAt     string      ISO 8601
     updatedAt     string      ISO 8601

   Status is a stored enum chosen by the admin, matching the Event layer:
   REVIEW / ONGOING / COMPLETED / ARCHIVED / DRAFT. It is not derived from the
   dates — start/end control when the campaign's surfaces appear, status
   controls its workflow state, and the two are independent.

   The campaign has NO goal field. Its total goal is the sum of the goals of
   the PROJECTS it references (see totalGoal()) — events carry no goal, so a
   campaign made only of events has no total. showGoal only decides whether
   that total is rendered on the public page.

   There is no theme colour either: the hero band uses the brand colour for
   every campaign.

   Raised amount and donor count are runtime aggregates owned by the backend.
   They are not part of this shape and the admin never enters them.

   SECURITY — aboutBody is rich-text HTML written by the admin and rendered with
   innerHTML on both the wizard preview and the detail page. The prototype does
   not sanitise it. Before this ships, the backend must sanitise on write and
   the front end must render through a sanitiser; otherwise it is a stored XSS
   hole. Every other field goes through esc().
   ============================================================================ */

/* Bumped when the Campaign shape changes, so stale localStorage reseeds
   instead of silently rendering records that miss the new fields. */
var STORE_KEY = 'agathos.campaigns.v7';

/* ---------------------------------------------------------------- DATA ACCESS */

function _read(){
  var raw = localStorage.getItem(STORE_KEY);
  if(!raw){
    localStorage.setItem(STORE_KEY, JSON.stringify(SEED_CAMPAIGNS));
    return JSON.parse(JSON.stringify(SEED_CAMPAIGNS));
  }
  try { return JSON.parse(raw); }
  catch(e){
    /* Corrupt payload would leave every page blank with no explanation. */
    console.error('[store] cannot parse ' + STORE_KEY + ' — reseeding.', e);
    localStorage.setItem(STORE_KEY, JSON.stringify(SEED_CAMPAIGNS));
    return JSON.parse(JSON.stringify(SEED_CAMPAIGNS));
  }
}
function _write(list){ localStorage.setItem(STORE_KEY, JSON.stringify(list)); }

function listCampaigns(){ return _read(); }

function getCampaign(id){
  var found = _read().filter(function(c){ return c.id === id; })[0];
  return found || null;
}

function saveCampaign(c){
  var list = _read();
  var now = new Date().toISOString();
  if(c.id){
    var i = -1;
    list.forEach(function(x, ix){ if(x.id === c.id) i = ix; });
    if(i < 0) throw new Error('[store] saveCampaign: no campaign with id ' + c.id);
    c.createdAt = list[i].createdAt;
    c.updatedAt = now;
    list[i] = c;
  } else {
    c.id = 'c_' + Math.random().toString(36).slice(2, 10);
    c.createdAt = now;
    c.updatedAt = now;
    list.unshift(c);
  }
  _write(list);
  return c;
}

function deleteCampaign(id){
  var list = _read();
  var kept = list.filter(function(c){ return c.id !== id; });
  if(kept.length === list.length) throw new Error('[store] deleteCampaign: no campaign with id ' + id);
  _write(kept);
}

/* Prototype only — lets you get the seed data back after experimenting. */
function resetStore(){ localStorage.removeItem(STORE_KEY); }

/* ------------------------------------------------- DERIVED / PURE (no backend) */

/* Same enum and dropdown order as the Event layer. */
var STATUSES = ['REVIEW','ONGOING','COMPLETED','ARCHIVED','DRAFT'];
var STATUS_DEFAULT = 'DRAFT';

function newCampaign(){
  return {
    eyebrow:'', name:'', subtitle:'',
    bannerDesktop:'', bannerMobile:'',
    items:[], featured:'',
    showGoal:true,
    status:STATUS_DEFAULT,
    start:'', end:'',
    spotlight:false,
    promoHero:false, ctaLabel:'View Campaign', link:'',
    promoBanner:false,
    aboutTitle:'', aboutBody:''
  };
}

function statusOf(c){
  return STATUSES.indexOf(c.status) >= 0 ? c.status : STATUS_DEFAULT;
}

function catItem(id){ return CATALOGUE.filter(function(x){ return x.id === id; })[0] || null; }

/* How many of the referenced items are projects, or events. */
function countKind(items, kind){
  return items.filter(function(id){ var x = catItem(id); return x && x.kind === kind; }).length;
}

function plural(n, word){ return n + ' ' + word + (n === 1 ? '' : 's'); }

/* aboutBody is HTML, so '' and '<p><br></p>' both mean "nothing written". */
function richEmpty(html){
  return !String(html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/* '3 projects · 1 event' — the only breakdown of a campaign's items we show. */
function itemMix(items){
  return plural(countKind(items, 'project'), 'project') + ' · ' + plural(countKind(items, 'event'), 'event');
}

/* Campaign total goal = sum of the referenced projects' goals.
   Events have no goal, so they contribute nothing. A campaign made only of
   events therefore totals 0 and has no goal to display. */
function totalGoal(items){
  return items.reduce(function(sum, id){
    var x = catItem(id);
    return sum + (x && x.goal ? x.goal : 0);
  }, 0);
}

/* How many referenced items actually contribute a goal. */
function goalItemCount(items){
  return items.filter(function(id){ var x = catItem(id); return x && x.goal; }).length;
}

function promoLabels(c){
  var out = [];
  if(c.promoHero)   out.push('Homepage hero');
  if(c.promoBanner) out.push('In-project banner');
  return out;
}

/* -------------------------------------------------------------- FORMATTING */

function esc(s){
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtMoney(n){
  return 'S$' + Number(n || 0).toLocaleString('en-SG');
}

/* DD/MM/YYYY — the format the Project / Event tables already use. */
function fmtDate(iso){
  if(!iso) return '';
  var p = iso.slice(0,10).split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

function fmtRange(start, end){
  if(!start || !end) return '';
  return fmtDate(start) + ' → ' + fmtDate(end);
}

function fmtAgo(iso){
  if(!iso) return '';
  var mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if(mins < 1)     return 'just now';
  if(mins < 60)    return mins + 'm ago';
  if(mins < 1440)  return Math.floor(mins / 60) + 'h ago';
  if(mins < 10080) return Math.floor(mins / 1440) + 'd ago';
  return fmtDate(iso);
}

/* Status renders as plain uppercase text, like the Project / Event tables. */
function stText(status){
  return '<span class="st ' + status.toLowerCase() + '">' + status.toUpperCase() + '</span>';
}

function toast(msg){
  var el = document.getElementById('toast');
  if(!el) return;
  el.innerHTML = '<span class="ti">' + icon('check', 16) + '</span><span></span>';
  el.lastChild.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(function(){ el.classList.remove('show'); }, 2600);
}
