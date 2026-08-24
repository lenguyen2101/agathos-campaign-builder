# PRD — Giving Settings change requests

**Feature**: a project owner asks Agathos to change a live project's fund goal or
fundraising end date; an Agathos admin approves or rejects it.

**Status**: admin side is built in this prototype (`requests.html`). Owner side is
designed in Figma. This document is the contract between the two.

**Last updated**: 24/08/2026

---

## 1. Why

A live project's **fund goal** and **fundraising end date** are promises to donors
who have already given. Letting a project owner edit them silently means a donor
can give to a S$1m campaign and find it is a S$1.5m campaign the next morning,
with no record of who moved it or why.

Every other field in Manage Project stays directly editable. These two go through
a request so that the record always says who proposed the change, why, who
decided, and when.

## 2. Scope

**In scope**

- Two requestable fields only: `fundGoal`, `fundraisingEnd`.
- Requests exist only on **live** projects. A draft project is edited directly.
- Owner: raise, view, withdraw a request; see the outcome on the settings page.
- Admin: list, view, approve, reject.
- In-app notification and email to the owner on a decision.
- In-app notification and email to the admins when a request needs a decision.

**Out of scope**

- Editing the requested value on the way through. An admin who wants a different
  number rejects and asks for a new request.
- Admin-initiated changes to these fields (an admin editing the project directly
  is a separate, existing path).
- Requests on any other field, any other role, or any bulk decision.
- Emailing the admins when an owner withdraws. In-app only — an email that
  says the work went away is noise.
- Reminders on a request left undecided. If ageing becomes a problem, add a
  digest rather than a per-request nag.

## 3. Roles

| Role | Where | Can |
|---|---|---|
| Project owner | Manage Project → Giving Settings | Raise, view, withdraw. Cannot decide. |
| Agathos admin | Admin → Project → Requests | List, view, approve, reject. Cannot raise, cannot edit the value. |

The owner never sees which admin decided — all decision copy names **Agathos**,
not a person.

---

## 4. Data model

### ChangeRequest

| Field | Type | Notes |
|---|---|---|
| `id` | string | server-assigned |
| `projectId` | string | |
| `field` | enum | `fundGoal` · `fundraisingEnd` — nothing else is requestable |
| `currentValue` | number \| string | the value **when the request was raised**, not a live read |
| `requestedValue` | number \| string | what the owner is asking for |
| `reason` | string | **required** — why the owner is asking. Max 500 chars |
| `requestedBy` | string | the owner |
| `requestedAt` | string | ISO 8601 |
| `status` | enum | `PENDING · APPROVED · REJECTED · WITHDRAWN` |
| `decidedAt` | string | ISO 8601, `''` while pending |
| `decidedBy` | string | the admin who handled it, or the owner on withdraw. `''` while pending |
| `decisionNote` | string | **required on reject**, `''` on approve, optional on withdraw. Max 500 chars |
| `dismissedAt` | string | ISO 8601, set when the owner dismisses the result box. `''` otherwise |

### Endpoints

```
GET   /admin/project-change-requests            -> ChangeRequest[]     admin
GET   /admin/project-change-requests/:id        -> ChangeRequest       admin
POST  /admin/project-change-requests/:id/approve                       admin
POST  /admin/project-change-requests/:id/reject   body { note }        admin

GET   /projects/:id/change-requests              -> ChangeRequest[]    owner
POST  /projects/:id/change-requests               body { field, requestedValue, reason }
POST  /project-change-requests/:id/withdraw                            owner
POST  /project-change-requests/:id/dismiss                             owner
```

### Rules the backend has to honour

1. **Approving is one transaction.** Write `requestedValue` onto the project, then
   stamp the request. If either half fails, neither happens. No admin ever has to
   go and edit the project by hand afterwards.
2. **The admin approves the exact value asked for.** There is no field to edit it
   on the way through.
3. **A request is decided once.** Approve, reject and withdraw all refuse a
   request whose status is not `PENDING`. Return `409`, not `404` — the caller
   has to be able to tell "already decided" from "does not exist".
4. **Rejecting requires a reason** and changes nothing on the project. An empty
   note is refused at the boundary as well as in the UI.
5. **Withdraw keeps the row.** Status becomes `WITHDRAWN`; the row is never
   deleted. `decidedBy` is the owner.
6. **One pending request per (project, field).** Enforce with a partial unique
   index on `status = PENDING`, so a withdrawn or decided row does not block a
   new request.
7. **`currentValue` is a snapshot.** The project can move after the request is
   raised — an admin edit, or another approved request. Approving still writes
   `requestedValue`. Any UI or email that states the *current* value must read it
   live at render time, never from `currentValue`.
8. **Only the requester's org can withdraw**, and only while `PENDING`.

---

## 5. Owner flow — Manage Project → Giving Settings

The slot under each of the two fields is never empty. It carries one of four
states.

### 5.1 Idle — blue

```
ℹ  This project is live, so changes here need to be reviewed by Agathos.
                                                          Request a change
```

The field itself is not editable in this state. **Request a change** opens the
request modal.

### 5.2 Request modal

Shows the current value, an input for the requested value, and a required
**Why does this need to change?** textarea (max 500). Submitting creates the
request and moves the slot to pending.

### 5.3 Pending — yellow

```
🕐  Change requested        Sent on 21:48, 27/07/2026 — change to S$1,500,000
    View Request   Withdraw
```

- **View Request** → read-only modal: current value, requested value, the owner's
  own reason, and `Agathos is reviewing this. You'll be notified once there's a
  decision.` Footer carries **Withdraw Request** and **Close**.
- **Withdraw** → confirm modal:
  `Withdraw This Request?` / `Agathos will stop reviewing it. This setting stays
  as it is, and you can send a new request whenever you need to.`
  Buttons **Keep Request** / **Withdraw**. On confirm the slot returns to idle.

### 5.4 Approved

The slot returns to the **idle blue box** and the field shows the new value. No
extra note — the value on the field is the confirmation.

### 5.5 Rejected — red

```
✕  Change not approved                                            Dismiss
   Reason: "Closing in September would cut off the donors who pledged for
   the March cycle. Keep 31/03/2027 — if the relief wraps up sooner, raise
   a new request and we will close it early."
```

Rejected is the one outcome that leaves no trace on the field itself — without
this box the screen is identical to one where nothing was ever asked. It stays
until dismissed.

- Reason clamps to **2 lines** with an ellipsis; the full text is in **View
  Request**. Admins can write up to 500 chars.
- **Dismiss** → back to idle blue. `dismissedAt` is stored **server-side** so the
  box does not come back on another device.
- Raising a new request while the red box is showing replaces it with the yellow
  box — the owner does not have to dismiss first.
- Only the most recently decided request for that field is shown.

---

## 6. Admin flow — Project → Requests

A single list of every request, newest first, whatever its status. Deciding one
must not make the row disappear: the outcome **is** the record.

**Columns**: Index · ID · Project · Field · Change (`current → requested`, plus a
drift note) · Reason · Status · Handled · Requested by · Requested · Action.

- **Reason** clamps to 2 lines with an ellipsis. The full text is in the popups.
- **Status** is plain uppercase text: `PENDING` gold, `APPROVED` green,
  `REJECTED` red, `WITHDRAWN` grey.
- Filters: keyword (ID, project, manager, reason), status, field. Counts per
  option. Pagination 10/20/50/100.

### Action column — three icons

| Icon | When | Does |
|---|---|---|
| 👁 View | every status | Opens the read-only **Request detail** popup |
| ✓ Approve | `PENDING` only | Opens the approve confirmation |
| ✕ Reject | `PENDING` only | Opens the reject form |

### Popups

**Request detail** (read-only) — ID, status, requested by, requested at, the
owner's full reason; and once decided, handled at, handled by, and the rejection
reason. Carries the drift warning when the project has moved.

**Approve** — the change in one sentence, then requested by / requested at / the
owner's full reason. If the project's live value no longer matches
`currentValue`, a warning: `Fund Goal is S$1.2m now, not the S$1m in the request
— approving still writes S$1.5m.` Confirm writes the value.

**Reject** — the same detail block, plus a **required** reason textarea. The
Reject button stays disabled until there is text. A rejection with no reason is
the thing this flow exists to prevent.

---

## 7. Notifications — owner

One notification per request. Two requests decided together produce two
notifications — each carries its own outcome and reason.

### In-app

Entities in **bold**, connective text grey, timestamp `HH:mm - DD/MM/YYYY`.

**Approved — fund goal** · green ✓
> **Agathos** approved your request to change the fundraising goal of
> **&lt;Project's name&gt;** to **&lt;Requested goal&gt;**.

**Approved — end date** · green ✓
> **Agathos** approved your request to change the fundraising end date of
> **&lt;Project's name&gt;** to **&lt;Requested end date&gt;**.

**Rejected — fund goal** · red ✕
> **Agathos** rejected your request to change the fundraising goal of
> **&lt;Project's name&gt;**. The goal stays at **&lt;Current goal&gt;**.

**Rejected — end date** · red ✕
> **Agathos** rejected your request to change the fundraising end date of
> **&lt;Project's name&gt;**. The end date stays at **&lt;Current end date&gt;**.

The rejection reason is not in the row — rows in this list never carry another
person's free text. Clicking a row opens Giving Settings, scrolled to the field,
with the Request detail modal open.

No notification is sent on withdraw: the owner did it themselves.

### Email

Sent on every decision. The owner does not live in the portal and a request can
sit for days.

**Subjects**

```
Fundraising goal approved — {projectTitle}
Fundraising goal not approved — {projectTitle}
Fundraising end date approved — {projectTitle}
Fundraising end date not approved — {projectTitle}
```

**Preheader**: `The goal is now {newGoal}.` / `It stays at {currentGoal}.`

**Body — approved**

```
Hi {firstName},

Agathos approved your change request. The fundraising goal for
{projectTitle} is now {newGoal}.

Requested {requestedAt}
Decided {decidedAt}

[ Open Giving Settings ]

You are receiving this because you manage this project.
```

**Body — not approved**

```
Hi {firstName},

Agathos did not approve your change request. The fundraising goal for
{projectTitle} stays at {currentGoal}.

Reason from Agathos
{reason}

You can send a new request whenever you need to.

Requested {requestedAt}
Decided {decidedAt}

[ Open Giving Settings ]

You are receiving this because you manage this project.
```

End date uses the same two bodies with the field name and values swapped.

`{currentGoal}` and `{currentEndDate}` are read live when the email is composed,
not from `currentValue` on the request — see rule 7.

---

## 8. Notifications — admin

The owner is told `You'll be notified once there's a decision`, so how fast a
request is seen is the whole promise. Admins do not sit on the Requests page.

Sent to every user with the Agathos admin role. Volume is low — single digits a
week across all projects — so one notification per request is right; there is no
batching.

### In-app

Same list, same grammar as the owner's. A request needing a decision uses the
`Please approve or reject` opening the product already uses for tribe
invitations, so the actionable rows read alike.

**Raised — fund goal** · gold 🕐
> Please approve or reject **&lt;Owner's name&gt;**'s request to change the
> fundraising goal of **&lt;Project's name&gt;** to **&lt;Requested goal&gt;**.

**Raised — end date** · gold 🕐
> Please approve or reject **&lt;Owner's name&gt;**'s request to change the
> fundraising end date of **&lt;Project's name&gt;** to
> **&lt;Requested end date&gt;**.

**Withdrawn — fund goal** · grey ✕
> **&lt;Owner's name&gt;** withdrew the request to change the fundraising goal of
> **&lt;Project's name&gt;**.

**Withdrawn — end date** · grey ✕
> **&lt;Owner's name&gt;** withdrew the request to change the fundraising end date
> of **&lt;Project's name&gt;**.

The owner's reason is not in the row — rows never carry another person's free
text. Clicking a row opens Requests with the Request detail popup open on that
request.

A request decided by another admin sends nothing. The list is the shared state,
and a second admin who opens a decided request sees the outcome; approve and
reject answer `409` (rule 3).

### Email

Sent when a request is raised. Not sent on withdraw.

**Subjects**

```
Approval needed: fundraising goal — {projectTitle}
Approval needed: fundraising end date — {projectTitle}
```

**Preheader**: `{ownerName} is asking for {requestedValue}.`

**Body**

```
Hi {firstName},

{ownerName} raised a change request on {projectTitle}.

Fundraising goal   {currentValue} -> {requestedValue}

Their reason
{reason}

Requested {requestedAt}

[ Review the request ]

You are receiving this because you handle change requests for Agathos.
```

`{currentValue}` here is the project's live value at send time, not
`currentValue` on the request — at send time they are equal, but reading live
keeps one rule instead of two (rule 7).

The link opens the Requests list with the Request detail popup open, so the
admin lands on the request itself rather than the queue.

---

## 9. Copy reference

| Where | String |
|---|---|
| Idle box | `This project is live, so changes here need to be reviewed by Agathos.` / `Request a change` |
| Request modal | `Why does this need to change?` |
| Pending box | `Change requested` · `Sent on {requestedAt} — change to {requestedValue}` · `View Request` · `Withdraw` |
| View Request, pending | `Agathos is reviewing this. You'll be notified once there's a decision.` |
| View Request, approved | `Approved on {decidedAt}. This setting is now {newValue}.` |
| View Request, rejected | `Not approved on {decidedAt}. This setting stays as it is.` |
| Withdraw confirm | `Withdraw This Request?` · `Agathos will stop reviewing it. This setting stays as it is, and you can send a new request whenever you need to.` · `Keep Request` / `Withdraw` |
| Rejected box | `Change not approved` · `Reason: "{decisionNote}"` · `Dismiss` |
| Admin approve | `Approve this change?` · `{project} — {field} changes from {current} to {requested}.` |
| Admin reject | `Reject this change?` · `{project} keeps its {field} of {current}.` · `Why this cannot be approved` · `Sent to the project manager.` |
| Admin drift | `{field} is {live} now, not the {snapshot} in the request — approving still writes {requested}.` |

---

## 10. Open questions

1. **Does a drifted request need re-raising?** Today the admin sees the drift and
   approving still writes `requestedValue`. The alternative is to auto-reject a
   request whose `currentValue` no longer matches and ask the owner to raise a
   new one. Current answer: no, show the drift and let the admin judge.
2. **How long do decided requests stay on the admin list?** Today: forever. If
   volume becomes a problem, archive rather than delete.
3. **Should the admin see the owner's request history** (e.g. a manager who
   raises and withdraws repeatedly)? Not built; the data supports it.
4. **Email frequency.** If a project has several owners, decide whether all of
   them are emailed or only `requestedBy`.
5. **Who receives the admin email?** Today: every admin. A shared queue inbox
   would cut N emails per request to one, at the cost of no per-admin read
   state. Decide before the admin team grows past a handful.
6. **Does an undecided request need a reminder?** Nothing chases an admin today.
   A daily digest of what is still `PENDING` is the cheap version if requests
   start ageing.
