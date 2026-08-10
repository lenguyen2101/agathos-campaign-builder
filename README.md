# Agathos — Campaign admin prototype

A working front-end prototype of the **Campaign** layer, of Site Content — the
**Homepage Hero** carousel control and the **Other Slides** it can run — and of
**project change requests**, built to match the existing Agathos admin portal
(Ant Design Pro shell) already used by the Project / Event / Organization
layers.

The Project list is rebuilt here too, but only as the place the **Requests**
button lives. Creating, editing and deleting a project stay in the portal and
are inert in this prototype.

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
| `projects.html` | Project list |
| `requests.html` | Change requests on projects — approve / reject |
| `index.html` | Campaign list |
| `create.html` | Create campaign (7-step wizard) |
| `create.html?id=<id>&step=<0-6>` | Edit campaign, opened at a given step |
| `campaign.html?id=<id>` | Campaign detail (read-only) |
| `hero.html` | Homepage Hero carousel |
| `slides.html` | Other slide list |
| `slide.html` | Create other slide |
| `slide.html?id=<id>` | Edit other slide |

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

listOtherSlides()        GET    /admin/other-slides           -> OtherSlide[]
getOtherSlide(id)        GET    /admin/other-slides/:id       -> OtherSlide
saveOtherSlide(s)        POST   /admin/other-slides           -> OtherSlide (no s.id)
                         PATCH  /admin/other-slides/:id       -> OtherSlide (has s.id)
deleteOtherSlide(id)     DELETE /admin/other-slides/:id

listProjects()           GET    /admin/projects               -> Project[]
getProject(id)           GET    /admin/projects/:id           -> Project

listChangeRequests()        GET  /admin/project-change-requests             -> ChangeRequest[]
getChangeRequest(id)        GET  /admin/project-change-requests/:id         -> ChangeRequest
approveRequest(id, by)      POST /admin/project-change-requests/:id/approve -> ChangeRequest
rejectRequest(id, note, by) POST /admin/project-change-requests/:id/reject  -> ChangeRequest
                                 body { note }
```

The Project endpoints are **read-only from here** — the portal already owns
create / edit / delete. The only write this prototype makes to a project is
inside `approveRequest()`.

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
| `heroEyebrow` | string | the slide's own copy — see below |
| `heroTitle` | string | **required once `promoHero` is on** |
| `heroSubtitle` | string | |
| `heroBannerDesktop` | string | **required once `promoHero` is on** — 1920×1080 (16:9) |
| `heroBannerMobile` | string | 375×667 (9:16) |
| `promoBanner` | boolean | show a "part of this campaign" band on every included item page |
| `bannerPromoDesktop` | string | the band image — 764×254 (3:1) |
| `bannerPromoMobile` | string | 375×250 (3:2) |
| `aboutTitle` | string | heading of the ABOUT THIS CAMPAIGN block |
| `aboutBody` | string | **rich-text HTML** — see the security note below |
| `createdAt`, `updatedAt` | string | ISO 8601 |

`name` and `bannerDesktop` are the only fields required to schedule a campaign;
the wizard blocks the Schedule button until both are set, and saving an
incomplete draft is always allowed.

Two more become required conditionally, and neither blocks saving — they gate
the surface instead. `heroTitle` and `heroBannerDesktop` are required once
`promoHero` is on, or the slide is held off the homepage
(`heroSlideMissing()`). `featured` is required once `spotlight` is on, or the
spotlight section renders empty.

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

`goal` exists on projects only. **Events carry no goal.** For a project it is
read from the project record, not from this entry, so an approved change request
moves every campaign total that references it.

### Project

Owned by the existing Project API. Only the fields the two screens here need are
modelled; the real record has many more and none of them matter for this flow.

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `title` | string | |
| `type` | enum | `COMMUNITY · EMERGENCY` — the two values seen in the portal. Confirm the full enum |
| `country`, `city` | string | |
| `org` | string | the organisation running the project |
| `fundGoal` | number | what the project is raising, in S$ |
| `start` | string | `YYYY-MM-DD` |
| `fundraisingEnd` | string | `YYYY-MM-DD` — **the End Date column in the portal**. See the open questions |
| `status` | enum | the same enum as campaigns |
| `createdAt` | string | ISO 8601 — the Create Date column |
| `updatedAt` | string | ISO 8601 — stamped when a request is approved |

`fundGoal` and `fundraisingEnd` are the only two fields a project manager can
ask to change. Everything else stays admin-only, as it is today.

> The list adds a **Fund Goal** column the portal does not have today, because
> approving a request has to be visible somewhere. Drop the column if the real
> screen should not carry it.

### Change request

Raised by a project manager, decided by an admin. A manager cannot edit a live
project's fund goal or fundraising end date directly.

| Field | Type | Notes |
|---|---|---|
| `id` | string | server-assigned |
| `projectId` | string | |
| `field` | enum | `fundGoal` · `fundraisingEnd` — nothing else is requestable |
| `currentValue` | number \| string | the value **when the request was raised**, not a live read |
| `requestedValue` | number \| string | what the manager is asking for |
| `reason` | string | why they are asking |
| `requestedBy` | string | the manager's name |
| `requestedAt` | string | ISO 8601 |
| `status` | enum | `PENDING · APPROVED · REJECTED` |
| `decidedAt` | string | ISO 8601, `''` while pending |
| `decidedBy` | string | the admin who handled it, `''` while pending |
| `decisionNote` | string | **required on reject**, `''` on approve |

### Other slide

A homepage slide that belongs to no campaign — an announcement, a partner, a
brand message. Managed under **Site Content → Other Slides**.

| Field | Type | Notes |
|---|---|---|
| `id` | string | server-assigned, `o_` prefix |
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
  order: ['default', '<campaignId>', '<otherSlideId>', ...]
}
```

Only the brand slide's copy and the running order are stored. Campaign slides
and other slides are **not** stored here — each keeps its own record. See the
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
`promoHero` on and against the other slides. Each record stays the single source
of truth for its own copy, so nothing can drift out of sync.

A **campaign slide** reaches the public homepage only when:

```
status === 'ONGOING'  AND  start ≤ today ≤ end
```

An **other slide** follows the same rule with two differences: a blank date is not
a bound (`ONGOING` with no dates = always live), and an incomplete slide is held
back — no title, no desktop banner, or a button with no URL means it would
render as a broken band, so it never ships. See `otherSlideMissing()`.

The brand slide is always live, cannot be removed, and can be reordered. IDs in
`order` that no longer qualify are skipped but **kept**, parked behind the
visible ones, so a slide that goes live again returns to the carousel instead of
vanishing. Anything newly created or switched on is appended. See `heroSlides()`
and `slideLive()`.

> ⚠️ The live rule above was inferred from the design, not specified, and the
> completeness gate on top of it is an engineering decision rather than a
> product one. Confirm both before implementing.

**The homepage slide has its own copy.** `heroEyebrow` / `heroTitle` /
`heroSubtitle` / `heroBannerDesktop` / `heroBannerMobile` are separate fields
from the campaign page's `eyebrow` / `name` / `subtitle` / `bannerDesktop` /
`bannerMobile`. They are seeded from Basics the first time the admin switches
`promoHero` on (`seedHeroFromBasics()`), and nothing copies between them again —
a later rename on the campaign page must not silently rewrite the homepage.
`slideCopy()` reads the hero fields only, and a campaign slide missing its title
or desktop banner is held back exactly like an incomplete other slide.

**`featured` is never reassigned for the admin.** It must be one of the IDs in
`items`. Remove that item and the spotlight is *cleared*, not handed to the next
item in the list — the admin is told which item went and picks the replacement.
Treat a `featured` that is not in `items` as unset wherever you render it; the
detail page already does.

**A campaign never mutates the items it references.** It holds IDs only.

**Approving a change request is one transaction.** Write `requestedValue` onto
the project, then stamp the request. If either half fails, neither happens. The
admin never has to go and edit the project by hand afterwards.

**The admin approves the exact value asked for.** There is no field to edit it on
the way through. Wanting a different number means rejecting and asking for a new
request, so the record always says who proposed what.

**A request is decided once.** Both endpoints must refuse a request whose status
is not `PENDING`; the prototype throws. The Approve / Reject buttons disappear
from a decided row and the decision — time, admin, and the reason on a rejection
— is kept forever.

**Rejecting requires a reason and changes nothing.** The note goes back to the
manager, so an empty one is refused at the boundary as well as in the UI.

**`currentValue` is a snapshot.** The project can move after the request is
raised — an admin edit in the portal, or another approved request. The prototype
shows the drift on the row and again in the approve dialog, and approving still
writes `requestedValue`. Decide whether the real system should instead force the
manager to re-raise; today it does not.

---

## What is faked and must be built for real

| Area | In the prototype | What is needed |
|---|---|---|
| Image upload | The file picker stores a path under `assets/img/` and previews the chosen file via `URL.createObjectURL`. Nothing is uploaded | Real upload + storage, returning a URL. Four ratios are in play and each slot is locked to one: 16:9 (1920×1080), 9:16 (375×667), 3:1 (764×254) and 3:2 (375×250) |
| `aboutBody` | Rich text via `contenteditable` + `execCommand`, chosen only because the prototype has no build step | Use the portal's own editor |
| Publish view | Shows a toast | Open the generated public campaign URL |
| Catalogue | Static array in `mock-data.js` | The real Project / Event list, with search and paging |
| List sorting, search, paging | Client-side over the whole array — there is no network call anywhere | Server-side. The UI already tracks page, page size, sort key and direction in one place, ready to be forwarded |
| Raised / donors | Em dashes | Real aggregates |
| Project create / detail / edit / delete | Every icon on a project row shows a toast | Nothing — those screens already exist in the portal. Point the row actions at them |
| Raising a request | Not here at all. Requests only arrive as seed data | The project manager's side: the form they submit from, and whatever notifies the admin |
| Telling the manager | Nothing leaves the browser | Deliver the decision and, on a rejection, the reason |
| The Requests count | Read on render from the local store | A pending count on the Project list, polled or pushed |

### Security — read this one

`aboutBody` is admin-authored HTML and is rendered with `innerHTML` on both the
wizard preview and the detail page. **The prototype does not sanitise it.** Ship
it that way and it is a stored XSS hole. Sanitise on write in the backend and
render through a sanitiser in the front end. Every other field goes through
`esc()`.

The other admin-authored value that escapes plain text is an other slide's
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
  with a page-size select. The Other Slides list is the same machinery with its
  own columns: `Index | ID | Slide | Status | Start Date | End Date | Links to |
  Homepage | Last Updated | Action`. The Project list keeps the portal's columns
  and adds Fund Goal; Requests runs the same machinery over `Index | ID |
  Project | Field | Change | Reason | Status | Handled | Requested by |
  Requested | Action`.
- **Action column** — pinned right with a shadow that fades once the table is
  scrolled fully right; four icons: publish view, view, edit, delete. On
  Requests it holds the two decisions instead, and a dash once the row is
  decided.
- **Requests** — a button on the Project list, left of Refresh list, with a
  count of what is waiting. No count when nothing is. The screen it opens is an
  inbox: it lands filtered to `PENDING`, and the Status filter reaches the rest.
- **Status** — plain uppercase text, not a badge.
- **Dates** — `DD/MM/YYYY`.
- **Detail page** — a single column of disabled inputs, like the Event detail
  screen. Each section links back to the matching wizard step.
- **Wizard** — 7 steps: `Basics · Add items · Schedule · Display · Promotion ·
  About · Review`. A step is ticked when it actually holds content, never
  because you walked past it. **Save** sits both in the page header and next to
  the step buttons, because the header one gets missed. Creating shows
  `Back · Save · Next`; editing drops Next — the rail is the navigation there,
  so each section just saves.
- **Add items** — what is already in the campaign is listed above the catalogue,
  in campaign order, each row removable. Reading the selection out of a scattered
  set of "Added" buttons was the thing this step got wrong first.

Two details worth keeping because they took iterations to get right:

- `box-shadow` is **not painted on table cells** while `border-collapse: collapse`
  is set in Chrome. The pinned column's shadow is drawn by a pseudo-element.
- Re-rendering a form while the user types destroys the caret. The rich-text
  editor and the hero page's default-slide fields patch the affected node
  instead of re-rendering their block.

---

## Prototype-only — do not port

- `localStorage` persistence, and the `STORE_KEY` / `HERO_KEY` / `OTHER_KEY` /
  `PROJECT_KEY` / `REQUEST_KEY` version bumps (`agathos.campaigns.v9`,
  `agathos.hero.v2`, `agathos.otherslides.v1`, `agathos.projects.v1`,
  `agathos.requests.v1`). The version suffix exists so stale local data reseeds
  during prototyping.
- Every **Reset** button, `resetStore()`, `resetHero()`, `resetOtherSlides()`,
  `resetProjects()` and `resetRequests()`. Projects and requests reset together
  — an approved request has already been written onto its project.
- `assets/mock-data.js` in its entirety, including the placeholder SVGs under
  `assets/img/` — those are generated gradients standing in for real photography.
- `vercel.json`. Note the images live in `assets/img/`, **not** `public/`: Vercel
  treats a top-level `public/` as the static output directory and stops serving
  the repository root.

---

## File map

```
projects.html         Project list
requests.html         Project change requests
index.html            Campaign list
create.html           Create / edit wizard
campaign.html         Campaign detail
hero.html             Homepage Hero carousel
slides.html           Other slide list
slide.html            Other slide create / edit

assets/store.js       ★ backend boundary + all derived rules and formatting
assets/mock-data.js   seed campaigns, catalogue, hero config, other slides,
                      projects, change requests
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
5. **Is the portal's End Date the fundraising end date?** The prototype assumes
   so and calls the field `fundraisingEnd`. If a project has a separate
   fundraising deadline, the list needs a second date column and the request
   points at that one instead.
6. **Who may raise a request, and against which projects?** The prototype only
   records `requestedBy` as a name. Whether that is the project's own manager,
   anyone in the organisation, or a role, is an auth question nothing here
   answers.
7. **Can a manager have two open requests on the same field?** Nothing prevents
   it today, and approving both applies them in the order they are decided.
8. Should a rejected request be re-raisable as-is, or does the manager have to
   submit a new one? The prototype keeps the rejected record and never reopens
   it.
