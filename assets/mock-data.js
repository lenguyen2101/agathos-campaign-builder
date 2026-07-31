/* Mock backend data. Replace with real API responses — see store.js for the endpoint map. */

/* Projects carry a fundraising goal; events do not. A campaign's total goal is
   the sum of its projects' goals — the campaign never stores a goal of its own. */
var CATALOGUE = [
  {id:'p1', name:'Support for widows · grief counselling', org:'Wicare',         kind:'project', c:'#2C6B53', goal:45000, img:'assets/img/items/p1.svg'},
  {id:'p2', name:'Turning Barriers into Bridges',         org:'SIL Global',      kind:'project', c:'#3B5B86', goal:60000, img:'assets/img/items/p2.svg'},
  {id:'p3', name:'Outreach @ displaced families',         org:'Love Cambodia',   kind:'project', c:'#7A5B2E', goal:30000, img:'assets/img/items/p3.svg'},
  {id:'e1', name:'Benefit concert for the unseen',        org:'RISE People',     kind:'event',   c:'#5B3B86', img:'assets/img/items/e1.svg'},
  {id:'p4', name:'A Bible Movement in Every Language',    org:'everylanguage',   kind:'project', c:'#3a2f28', goal:80000, img:'assets/img/items/p4.svg'},
  {id:'p5', name:'Living Waters Village',                 org:'agathos',         kind:'project', c:'#2e4a55', goal:120000, img:'assets/img/items/p5.svg'},
  {id:'e2', name:'Charity Gala Dinner 2026',              org:"St Andrew's",     kind:'event',   c:'#86532e', img:'assets/img/items/e2.svg'},
  {id:'p6', name:'Clean water wells · Mekong delta',      org:'Love Cambodia',   kind:'project', c:'#1f5f6b', goal:35000, img:'assets/img/items/p6.svg'},
  {id:'p7', name:'Scholarships for first-generation students', org:'Wicare',     kind:'project', c:'#5c4a7a', goal:40000, img:'assets/img/items/p7.svg'},
  {id:'e3', name:'Run for Hope 10K',                      org:'RISE People',     kind:'event',   c:'#8a3a4a', img:'assets/img/items/e3.svg'},
  {id:'p8', name:'Mobile clinics for remote villages',    org:'SIL Global',      kind:'project', c:'#2f6b4a', goal:55000, img:'assets/img/items/p8.svg'},
  {id:'p9', name:'Rebuilding after the floods',           org:'agathos',         kind:'project', c:'#6b4a2f', goal:70000, img:'assets/img/items/p9.svg'}
];

/* A campaign never mutates the items it references — it only holds their IDs. */
var SEED_CAMPAIGNS = [
  {
    id:'c_monsoon_relief',
    eyebrow:'EMERGENCY APPEAL · URGENT',
    name:'Flood Relief for Central Vietnam',
    subtitle:'Families along the coast lost homes overnight. Emergency kits, clean water and shelter are needed now.',
    bannerDesktop:'assets/img/banners/flood-relief-desktop.svg',
    bannerMobile:'assets/img/banners/flood-relief-mobile.svg',
    items:['p9','p6','p3'],
    featured:'p2',
    showGoal:true,
    status:'ONGOING',
    start:'2026-07-01', end:'2026-08-31',
    spotlight:true,
    promoHero:true, ctaLabel:'View Campaign',
    promoBanner:true,
    aboutTitle:'When the water rose, everything went with it',
    aboutBody:'<p>In late June, floodwaters swept through coastal communities in Central Vietnam, leaving thousands of families without homes overnight. This campaign brings together 6 vetted local causes delivering what’s needed most right now — emergency kits, clean water, and temporary shelter.</p><p>Every dollar you give is matched 1-for-1 by our partner funds, and we share updates from the field as relief is delivered, so you can see exactly where your generosity goes.</p>',
    createdAt:'2026-06-18T14:30:00Z', updatedAt:'2026-07-29T10:05:00Z'
  },
  {
    id:'c_double_impact',
    eyebrow:'MATCHING GIVING',
    name:'Double The Impact',
    subtitle:'For a limited season, every dollar you give is matched by our partner funds — your gift goes twice as far.',
    bannerDesktop:'assets/img/banners/double-impact-desktop.svg',
    bannerMobile:'assets/img/banners/double-impact-mobile.svg',
    items:['p1','p5','p6','p9'],
    featured:'p5',
    showGoal:true,
    status:'ONGOING',
    start:'2026-06-01', end:'2026-09-30',
    spotlight:false,
    promoHero:true, ctaLabel:'View Campaign',
    promoBanner:true,
    aboutTitle:'Your gift, counted twice',
    aboutBody:'<p>Our partner funds have committed to match every gift made through this campaign, dollar for dollar, until the season closes. Nothing changes about how you give — the match is applied on our side and shows up in each cause’s total.</p><p>Every cause gathered here has been vetted and carries the agathos Trustmark, so you can give knowing exactly who receives it.</p>',
    createdAt:'2026-05-04T08:20:00Z', updatedAt:'2026-07-27T11:30:00Z'
  },
  {
    id:'c_christmas_2026',
    eyebrow:'SEASONAL CAMPAIGN',
    name:'Christmas Giving 2026',
    subtitle:'This Christmas, stand with families and causes across our community — every gift carries hope into the new year.',
    bannerDesktop:'assets/img/banners/christmas-2026-desktop.svg',
    bannerMobile:'assets/img/banners/christmas-2026-mobile.svg',
    items:['p2','p3','e1','p7'],
    featured:'p2',
    showGoal:true,
    status:'REVIEW',
    start:'2026-11-15', end:'2026-12-31',
    spotlight:false,
    promoHero:true, ctaLabel:'View Campaign',
    promoBanner:true,
    aboutTitle:'Hope, wrapped and handed on',
    aboutBody:'<p>Christmas is when our community gives most, and this campaign gathers the causes that need it most into one place — from grief counselling for widows to scholarships for students who would otherwise stop at secondary school.</p><p>Give to one cause or spread it across several. Whatever you choose, the whole amount reaches the organisation running the work.</p>',
    createdAt:'2026-06-02T09:14:00Z', updatedAt:'2026-07-28T16:40:00Z'
  },
  {
    id:'c_hidden_causes',
    eyebrow:'MONTHLY SPOTLIGHT',
    name:'Hidden Causes',
    subtitle:'Every month we lift one overlooked cause out of the shadows and put it in front of the whole community.',
    bannerDesktop:'assets/img/banners/hidden-causes-desktop.svg',
    bannerMobile:'assets/img/banners/hidden-causes-mobile.svg',
    items:['p1','p4','p8','p7','e3'],
    featured:'p1',
    showGoal:false,
    status:'ONGOING',
    start:'2026-01-01', end:'2026-12-31',
    spotlight:true,
    promoHero:true, ctaLabel:'Meet this month’s cause',
    promoBanner:true,
    aboutTitle:'The work no one is watching',
    aboutBody:'<p>Some causes never make it into a season or an appeal. They run quietly for years, funded by a handful of people who happened to hear about them.</p><p>Each month a different project takes the spotlight here. The others stay visible in the grid, waiting their turn — so nothing gets lost and nothing gets rushed.</p>',
    createdAt:'2025-12-08T11:02:00Z', updatedAt:'2026-07-01T08:15:00Z'
  },
  {
    id:'c_water_month',
    eyebrow:'MATCHING GIVING',
    name:'Clean Water Month',
    subtitle:'Through August, every gift to a water project is matched by our partner fund.',
    bannerDesktop:'assets/img/banners/clean-water-desktop.svg',
    bannerMobile:'',
    items:['p6','p5'],
    featured:'p6',
    showGoal:true,
    status:'REVIEW',
    start:'2026-08-01', end:'2026-08-31',
    spotlight:false,
    promoHero:false, ctaLabel:'View Campaign',
    promoBanner:true,
    aboutTitle:'One well changes a generation',
    aboutBody:'<p>A single working well removes a two-hour walk from a child’s day and takes waterborne illness out of a village’s life. The two causes here are drilling and maintaining wells across the Mekong delta.</p><p>For August only, our partner fund matches every gift to a water project.</p>',
    createdAt:'2026-07-11T07:48:00Z', updatedAt:'2026-07-22T13:20:00Z'
  },
  {
    id:'c_back_to_school',
    eyebrow:'',
    name:'Back to School 2026',
    subtitle:'',
    bannerDesktop:'',
    bannerMobile:'',
    items:['p7'],
    featured:'p7',
    showGoal:true,
    status:'DRAFT',
    start:'', end:'',
    spotlight:false,
    promoHero:false, ctaLabel:'View Campaign',
    promoBanner:false,
    aboutTitle:'',
    aboutBody:'',
    createdAt:'2026-07-25T15:12:00Z', updatedAt:'2026-07-25T15:12:00Z'
  },
  {
    id:'c_easter_2026',
    eyebrow:'SEASONAL CAMPAIGN',
    name:'Easter Appeal 2026',
    subtitle:'A short appeal across our partner churches through Holy Week.',
    bannerDesktop:'assets/img/banners/easter-2026-desktop.svg',
    bannerMobile:'assets/img/banners/easter-2026-mobile.svg',
    items:['p1','p8'],
    featured:'p1',
    showGoal:false,
    status:'COMPLETED',
    start:'2026-03-29', end:'2026-04-12',
    spotlight:false,
    promoHero:false, ctaLabel:'View Campaign',
    promoBanner:true,
    aboutTitle:'Hope, renewed',
    aboutBody:'<p>Two weeks, two causes, one message. Our partner churches carried this appeal through Holy Week and closed it on Easter Sunday.</p>',
    createdAt:'2026-02-20T13:00:00Z', updatedAt:'2026-04-13T08:30:00Z'
  },
  {
    id:'c_lunar_new_year',
    eyebrow:'SEASONAL CAMPAIGN',
    name:'Lunar New Year 2026',
    subtitle:'Mark the new year by backing a cause that carries someone else forward.',
    bannerDesktop:'assets/img/banners/lny-2026-desktop.svg',
    bannerMobile:'assets/img/banners/lny-2026-mobile.svg',
    items:['p3','e2','p4'],
    featured:'p3',
    showGoal:true,
    status:'COMPLETED',
    start:'2026-01-20', end:'2026-02-22',
    spotlight:false,
    promoHero:false, ctaLabel:'View Campaign',
    promoBanner:false,
    aboutTitle:'A new year, a new beginning for someone else',
    aboutBody:'<p>Reunion dinners, red packets, a fresh start. This appeal invited our community to extend that fresh start to three causes working across Cambodia and Vietnam.</p>',
    createdAt:'2025-11-30T10:00:00Z', updatedAt:'2026-02-23T09:00:00Z'
  },
  {
    id:'c_gala_2026',
    eyebrow:'GENERAL APPEAL',
    name:'Gala Season 2026',
    subtitle:'Our flagship fundraising dinners, gathered in one place.',
    bannerDesktop:'assets/img/banners/gala-2026-desktop.svg',
    bannerMobile:'',
    items:['e2','e1','e3'],
    featured:'e2',
    showGoal:true,
    status:'ARCHIVED',
    start:'2026-03-01', end:'2026-05-31',
    spotlight:false,
    promoHero:false, ctaLabel:'View Campaign',
    promoBanner:false,
    aboutTitle:'An evening that funds a year',
    aboutBody:'<p>Three dinners across three cities, each raising the operating budget for a partner organisation’s full year of work.</p>',
    createdAt:'2026-01-15T09:30:00Z', updatedAt:'2026-06-10T11:45:00Z'
  }
];

/* ============================================================================
   HOMEPAGE HERO CAROUSEL
   The carousel is assembled from two sources: this one brand slide, which
   belongs to no campaign, and every campaign with promoHero on. Only the brand
   slide's copy and the running order live here — campaign slides render from
   the campaign record itself.
   ============================================================================ */
var SEED_HERO = {
  defaultSlide: {
    eyebrow:'GIVE WITH CONFIDENCE',
    title:'Every cause here is vetted',
    subtitle:'Agathos verifies every organisation on the platform, so you always know exactly where your gift goes.',
    bannerDesktop:'assets/img/banners/agathos-default-desktop.svg',
    bannerMobile:'assets/img/banners/agathos-default-mobile.svg',
    ctaLabel:'Explore causes'
  },
  /* 'default' is the brand slide; the rest are campaign or free-slide IDs. */
  order: ['default', 'c_monsoon_relief', 'f_volunteer_drive', 'c_double_impact', 'c_christmas_2026', 'c_hidden_causes', 'f_annual_report']
};

/* Slides that belong to no campaign. Sample content — see SEED_CAMPAIGNS. */
var SEED_FREE_SLIDES = [
  {
    id:'f_volunteer_drive',
    eyebrow:'JOIN US',
    title:'Give an hour, not just a gift',
    subtitle:'Thirty organisations on Agathos are looking for volunteers this quarter — from tutoring to warehouse shifts.',
    bannerDesktop:'assets/img/banners/agathos-default-desktop.svg',
    bannerMobile:'assets/img/banners/agathos-default-mobile.svg',
    ctaLabel:'See volunteer roles',
    ctaUrl:'/volunteer',
    status:'ONGOING',
    start:'', end:'',
    createdAt:'2026-05-19T10:00:00Z', updatedAt:'2026-07-24T11:12:00Z'
  },
  {
    id:'f_annual_report',
    eyebrow:'2025 ANNUAL REPORT',
    title:'Where every dollar went last year',
    subtitle:'The full breakdown of what the community gave, which organisations received it, and what changed as a result.',
    bannerDesktop:'assets/img/banners/agathos-default-desktop.svg',
    bannerMobile:'',
    ctaLabel:'Read the report',
    ctaUrl:'https://agathos.org/annual-report-2025',
    status:'DRAFT',
    start:'2026-09-01', end:'2026-10-15',
    createdAt:'2026-07-11T08:30:00Z', updatedAt:'2026-07-29T15:45:00Z'
  }
];
