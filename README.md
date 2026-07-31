# Agathos — Campaign admin prototype

A working front-end prototype of the **Campaign** layer and of Site Content —
the **Homepage Hero** carousel control and the **Free Slides** it can run —
built to match the existing Agathos admin portal (Ant Design Pro shell) already
used by the Project / Event / Organization layers.

This is a **specification you can click**, not production code. Nothing here is
meant to be dropped into the portal as-is. Read it, run it, then rebuild the
screens in the portal's own stack — the value is in the data model, the rules,
and the interaction detail, all of which are pinned down here.

---

## Run it

No build step, no dependencies. Any static file server:

```bash
python3 -m http.server 3000
# open http://127.0.0.1:3000
```

Double-clicking the HTML files works too — everything is relative, so `file://`
runs the whole prototype, images included.

> The browser caches `assets/*.js` aggressively behind a plain static server.
> After editing, hard-reload (`Cmd/Ctrl + Shift + R`) or you will keep seeing the
> old data.

### Screens

| Route | Screen |
|---|---|
| `index.html` | Campaign list |
| `create.html` | Create campaign (7-step wizard) |
| `create.html?id=<id>&step=<0-6>` | Edit campaign, opened at a given step |
| `campaign.html?id=<id>` | Campaign detail (read-only) |
| `hero.html` | Homepage Hero carousel |
| `slides.html` | Free slide list |
| `slide.html` | Create free slide |
| `slide.html?id=<id>` | Edit free slide |

State lives in `localStorage`. Every page has a **Reset** control to restore the
seed data — use it freely.

---

## Start here: `assets/store.js`

Everything the backend has to provide is behind that one file. No page touches
`localStorage` directly, so swapping in a real API is a change to `store.js`
alone.

### Endpoints to implement

```
listCampaigns()          GET    /admin/campaigns              -> Campaign[]
getCampaign(id)          GET    /admin/campaigns/:id          -> Campaign
saveCampaign(c)          POST   /admin/campaigns              -> Campaign   (no c.id)
                         PATCH  /admin/campaigns/:id          -> Campaign   (has c.id)
deleteCampaign(id)       DELETE /admin/campaigns/:id

getHero()                GET    /admin/homepage-hero          -> HeroConfig
saveHero(cfg)            PUT    /admin/homepage-hero          -> HeroConfig

listFreeSlides()         GET    /admin/free-slides            -> FreeSlide[]
getFreeSlide(id)         GET    /admin/free-slides/:id        -> FreeSlide
saveFreeSlide(s)         POST   /admin/free-slides            -> FreeSlide  (no s.id)
                         PATCH  /admin/free-slides/:id        -> FreeSlide  (has s.id)
deleteFreeSlide(id)      DELETE /admin/free-slides/:id
```

There is deliberately **no** archive / publish / status endpoint. Status is an
ordinary field, so it changes through `saveCampaign()` like any other.

The prototype's versions are synchronous. Against a real API they become async —
wrap the call sites in `await` / `.then()`.

```js
// prototype
function getCampaign(id){
  return _read().filter(c => c.id === id)[0] || null;
}

// real
async function getCampaign(id){
  const r = await fetch(`/admin/campaigns/${id}`);
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}
```

---

## Data model

### Campaign

| Field | Type | Notes |
|---|---|---|
| `id` | string | server-assigned |
| `eyebrow` | string | hero kicker, e.g. `EMERGENCY APPEAL · URGENT`. Free text, rendered in caps |
| `name` | string | **required** — hero title |
| `subtitle` | string | paragraph under the title |
| `bannerDesktop` | string | **required** — image URL, 1920×1080 (16:9) |
| `bannerMobile` | string | image URL, 375×667 (9:16). Empty ⇒ the desktop banner is cropped |
| `items` | string[] | project / event IDs. Referenced, never mutated |
| `featured` | string | item ID; only meaningful when `spotlight` is on |
| `showGoal` | boolean | render the campaign total goal on the public page |
| `status` | enum | see below |
| `start`, `end` | string | `YYYY-MM-DD`, or `''` when not scheduled |
| `spotlight` | boolean | feature one item at a time |
| `promoHero` | boolean | offer this campaign to the homepage carousel |
| `ctaLabel` | string | button wording on the hero slide; only meaningful when `promoHero` is on |
| `promoBanner` | boolean | show a "part of this campaign" band on every included item page |
| `aboutTitle` | string | heading of the ABOUT THIS CAMPAIGN block |
| `aboutBody` | string | **rich-text HTML** — see the security note below |
| `createdAt`, `updatedAt` | string | ISO 8601 |

`name` and `bannerDesktop` are the only required fields. The wizard blocks
scheduling until both are set; saving an incomplete draft is always allowed.

### Status

```
REVIEW · ONGOING · COMPLETED · ARCHIVED · DRAFT
```

Same enum and same dropdown order as the Event layer. Default is `DRAFT`.

Status is **stored and chosen by the admin**, not derived. It is independent of
the dates: `start`/`end` say *when* the campaign's surfaces appear, `status` is
its workflow state. `ARCHIVED` is a status value — there is no separate archive
flag or action.

### Catalogue item (project / event)

Supplied by the existing Project and Event APIs; the prototype fakes it in
`assets/mock-data.js`.

```js
{ id, name, org, kind: 'project' | 'event', goal, img }
```

`goal` exists on projects only. **Events carry no goal.**

### Free slide

A homepage slide that belongs to no campaign — an announcement, a partner, a
brand message. Managed under **Site Content → Free Slides**.

| Field | Type | Notes |
|---|---|---|
| `id` | string | server-assigned, `f_` prefix |
| `title` | string | **required** — the slide headline |
| `eyebrow` | string | kicker above the title, rendered in caps |
| `subtitle` | string | paragraph under the title |
| `bannerDesktop` | string | **required** — image URL, 1920×1080 (16:9) |
| `bannerMobile` | string | image URL, 375×667 (9:16). Empty ⇒ desktop banner is cropped |
| `ctaLabel` | string | button wording. Empty ⇒ the slide has no button |
| `ctaUrl` | string | **required when `ctaLabel` is set** — `/causes` or `https://…` |
| `status` | enum | same enum as campaigns |
| `start`, `end` | string | `YYYY-MM-DD`, or `''`. **Both optional**, unlike a campaign |
| `createdAt`, `updatedAt` | string | ISO 8601 |

Dates are optional because a brand slide often runs with no end in sight. Status
still gates it, so `ONGOING` with no dates means always live.

> ⚠️ `ctaUrl` is admin-typed and becomes an `href` on the public homepage. The
> prototype only trims it. Reject anything that is not `http(s)` or a
> site-relative path on write, or it is a `javascript:` injection hole.

### HeroConfig

```js
{
  defaultSlide: { eyebrow, title, subtitle, bannerDesktop, bannerMobile, ctaLabel },
  order: ['default', '<campaignId>', '<freeSlideId>', ...]
}
```

Only the brand slide's copy and the running order are stored. Campaign slides
and free slides are **not** stored here — each keeps its own record. See the
hero rules below.

---

## Rules the backend must honour

These are load-bearing. The UI reads the way it does because of them.

**A campaign has no goal of its own.** Its total is the sum of the goals of the
projects it references (`totalGoal()`). Events contribute nothing, so a campaign
made only of events has no total and every surface says so instead of printing
`S$0`. `showGoal` only decides whether that total is rendered.

**Raised amount and donor count are yours, not the admin's.** They are runtime
aggregates and are not part of the Campaign shape. The prototype lays out their
slots but shows em dashes rather than inventing numbers.

**The campaign page URL is generated by the backend.** It is not stored and the
admin never types it. Only `ctaLabel` is editable.

**The carousel has three sources, and `order` holds only IDs.** It is assembled
by joining the stored `order` against the campaigns that currently have
`promoHero` on and against the free slides. Each record stays the single source
of truth for its own copy, so nothing can drift out of sync.

A **campaign slide** reaches the public homepage only when:

```
status === 'ONGOING'  AND  start ≤ today ≤ end
```

A **free slide** follows the same rule with two differences: a blank date is not
a bound (`ONGOING` with no dates = always live), and an incomplete slide is held
back — no title, no desktop banner, or a button with no URL means it would
render as a broken band, so it never ships. See `freeSlideMissing()`.

The brand slide is always live, cannot be removed, and can be reordered. IDs in
`order` that no longer qualify are skipped but **kept**, parked behind the
visible ones, so a slide that goes live again returns to the carousel instead of
vanishing. Anything newly created or switched on is appended. See `heroSlides()`
and `slideLive()`.

> ⚠️ The live rule above was inferred from the design, not specified. Confirm it
> with product before implementing.

**A campaign never mutates the items it references.** It holds IDs only.

---

## What is faked and must be built for real

| Area | In the prototype | What is needed |
|---|---|---|
| Image upload | The file picker stores a path under `assets/img/` and previews the chosen file via `URL.createObjectURL`. Nothing is uploaded | Real upload + storage, returning a URL. Enforce 16:9 and 9:16 |
| `aboutBody` | Rich text via `contenteditable` + `execCommand`, chosen only because the prototype has no build step | Use the portal's own editor |
| Publish view | Shows a toast | Open the generated public campaign URL |
| Catalogue | Static array in `mock-data.js` | The real Project / Event list, with search and paging |
| List sorting, search, paging | Client-side over the whole array — there is no network call anywhere | Server-side. The UI already tracks page, page size, sort key and direction in one place, ready to be forwarded |
| Raised / donors | Em dashes | Real aggregates |

### Security — read this one

`aboutBody` is admin-authored HTML and is rendered with `innerHTML` on both the
wizard preview and the detail page. **The prototype does not sanitise it.** Ship
it that way and it is a stored XSS hole. Sanitise on write in the backend and
render through a sanitiser in the front end. Every other field goes through
`esc()`.

The other admin-authored value that escapes plain text is a free slide's
`ctaUrl`, which becomes an `href` on the public homepage. Allow only `http(s)`
and site-relative paths; reject `javascript:` and `data:` on write.

---

## Matching the portal when you rebuild

The prototype copies the conventions already in the Project / Event screens, so
following it keeps the Campaign layer consistent:

- **Layout** — fixed left nav, top bar, page title left with actions right, grey
  page background with white cards.
- **List table** — `Index | ID | Campaign | Status | Start Date | End Date |
  Items | Total Goal | Promotion | Spotlight | Last Updated | Action`, sortable
  headers with carets, Toggle Search panel, Refresh list, Ant-style pagination
  with a page-size select.
- **Action column** — pinned right with a shadow that fades once the table is
  scrolled fully right; four icons: publish view, view, edit, delete.
- **Status** — plain uppercase text, not a badge.
- **Dates** — `DD/MM/YYYY`.
- **Detail page** — a single column of disabled inputs, like the Event detail
  screen. Each section links back to the matching wizard step.
- **Wizard** — 7 steps: `Basics · Add items · Schedule · Display · Promotion ·
  About · Review`. A step is ticked when it actually holds content, never
  because you walked past it.

Two details worth keeping because they took iterations to get right:

- `box-shadow` is **not painted on table cells** while `border-collapse: collapse`
  is set in Chrome. The pinned column's shadow is drawn by a pseudo-element.
- Re-rendering a form while the user types destroys the caret. The rich-text
  editor and the hero page's default-slide fields patch the affected node
  instead of re-rendering their block.

---

## Prototype-only — do not port

- `localStorage` persistence, and the `STORE_KEY` / `HERO_KEY` / `FREE_KEY`
  version bumps (`agathos.campaigns.v8`, `agathos.hero.v2`,
  `agathos.freeslides.v1`). The version suffix exists so stale local data
  reseeds during prototyping.
- Every **Reset** button, `resetStore()`, `resetHero()` and `resetFreeSlides()`.
- `assets/mock-data.js` in its entirety, including the placeholder SVGs under
  `assets/img/` — those are generated gradients standing in for real photography.
- `vercel.json`. Note the images live in `assets/img/`, **not** `public/`: Vercel
  treats a top-level `public/` as the static output directory and stops serving
  the repository root.

---

## File map

```
index.html            Campaign list
create.html           Create / edit wizard
campaign.html         Campaign detail
hero.html             Homepage Hero carousel
slides.html           Free slide list
slide.html            Free slide create / edit

assets/store.js       ★ backend boundary + all derived rules and formatting
assets/mock-data.js   seed campaigns, catalogue, hero config
assets/shell.js       left nav + top bar, shared by every page
assets/app.css        design tokens and every component
assets/img/           placeholder banners and item thumbnails
```

---

## Open questions for product

1. The homepage slide live rule (`ONGOING` and inside the run window) is an
   inference — confirm it.
2. `eyebrow` is free text. If the values should be consistent across campaigns
   it wants to become an enum plus an `urgent` flag.
3. The `Spotlight` caption and the `Everything in this campaign` heading are
   currently fixed template copy, not per-campaign fields.
4. Currency is hard-coded to `S$`.
