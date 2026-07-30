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
     id         string            server-assigned
     name       string
     tagline    string
     intro      string
     color      string            hex, drives the hero background
     cover      string            filename only (upload is mocked)
     items      string[]          catalogue IDs — referenced, never mutated
     featured   string            item ID, only meaningful when spotlight=true
     status     string            one of STATUSES — set explicitly by the admin
     start      string            'YYYY-MM-DD' or '' when not scheduled
     end        string            'YYYY-MM-DD' or ''
     spotlight  boolean
     promoHero  boolean
     ctaLabel   string            only meaningful when promoHero=true
     link       string            only meaningful when promoHero=true
     promoBanner boolean
     story      string
     createdAt  string            ISO 8601
     updatedAt  string            ISO 8601

   Status is a stored enum chosen by the admin, matching the Event layer:
   REVIEW / ONGOING / COMPLETED / ARCHIVED / DRAFT. It is not derived from the
   dates — start/end control when the campaign's surfaces appear, status
   controls its workflow state, and the two are independent.
   ============================================================================ */

/* Bumped when the Campaign shape changes, so stale localStorage reseeds
   instead of silently rendering records that miss the new fields. */
var STORE_KEY = 'agathos.campaigns.v2';

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
    name:'', tagline:'', intro:'', color:'#15479E', cover:'',
    items:[], featured:'',
    status:STATUS_DEFAULT,
    start:'', end:'',
    spotlight:false,
    promoHero:false, ctaLabel:'View campaign', link:'',
    promoBanner:false,
    story:''
  };
}

function statusOf(c){
  return STATUSES.indexOf(c.status) >= 0 ? c.status : STATUS_DEFAULT;
}

function catItem(id){ return CATALOGUE.filter(function(x){ return x.id === id; })[0] || null; }

function orgsOf(items){
  var seen = {};
  items.forEach(function(id){ var x = catItem(id); if(x) seen[x.org] = 1; });
  return Object.keys(seen);
}

function hasMatching(items){
  return items.some(function(id){ var x = catItem(id); return x && x.matching; });
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
