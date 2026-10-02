# Onboarding walkthrough — v1.1

Walked on 2 October 2026, on the live v1.1 prototype (the version from 25 September 2026). I went through it as a first-time partner registering an organisation, and as each kind of returning user in the demo panel. I checked desktop and phone. I used the form test values (an existing email, a verified organisation, an application in progress).

---

## The five things that matter most

1. **Nothing explains the three kinds of pages.** A new partner lands straight on "Raise funds for your initiative — step 1 of 7". Nothing mentions organisation pages or events, so the partner can't form a picture of how the platform is organised before they start. This is the "structure" problem. A Step 0 that offers the three paths up front would fix it.

2. **Verifying an organisation looks like starting a project.** The heading says "Start a project" through the whole verification, on the thank-you screen, and again afterwards. I registered a shelter raising money for its running costs, and the flow turned that straight into a project. That is the duplication Rachel describes: the same information about the ministry goes into both the organisation page and a project page.

3. **A project goes live without any review by us.** After the organisation is approved, the partner can build a project and publish it in one sitting. In practice Rachel reviews and meets the partner for every project. The flow promises "We review → You build → You launch" and never mentions that conversation.

4. **Waiting leaves people with a question mark.** After asking to join an organisation that already has an application in progress, the dashboard shows nothing about the request. It even suggests "New project starts with a one-time identity check", which points them back to the start.

5. **The organisation page never appears.** You can't see, create or publish an organisation page anywhere in the flow. The organisation only exists as a verification record and a name on the dashboard.

---

## Step by step

| Where | What happened | Why it's confusing | Suggestion |
|---|---|---|---|
| Homepage | Sign Up and the "raise funds" button lead nowhere in the prototype | There's no way in from the homepage | Point Sign Up and the main call to action at Step 0 |
| Step 1 · Tell us about your cause | Asks for "Organisation or fundraiser name" before asking who is raising | The partner doesn't know yet whether they're naming an organisation or themselves | Ask which path first (Step 0), then word the name field to match |
| Step 1, when already logged in | Still says "No account needed yet" | Wrong for someone who already has an account | Drop that line for logged-in users |
| Your account · existing email | The existing email is only noticed after "Send me the link". The link then logs in under a different name | Looks like a bug. The feedback asked for "There is already an account on Agathos with this email address" up front | Say so straight away, with a Log in button |
| Check your inbox | "Open the link" looks like a real button | It only stands in for opening the email | Label it as a demo shortcut |
| Documents · Singapore charity | No question about IPC status. An IPC letter goes in as "proof of charitable status", and bank details are still asked for afterwards | IPCs set up payouts directly with AXS, so the payout step is wasted effort for them | Ask "Is your charity an IPC?" and skip the payout step if yes |
| Thank you | Heading still says "Start a project". Next steps read "We review → You build → You launch" | Promises a self-serve build that doesn't match how we work | Say we'll be in touch to talk about the first project |
| Right after approval | The confirm window asks "Are these details still accurate?" seconds after approval | Only odd in the demo, where approval is instant. In real life this happens days later | No change |
| Project basics | Fields are name, story, photos and type. Type includes "Tied to an event" | The fields don't match our real project page (introduction, background, scope and activities). "Tied to an event" overlaps with hosting an event | Use our real fields. Drop "Tied to an event" once events have their own path |
| Project basics · "Relationship to your past projects" | A dropdown with no visible effect | The feedback asked how it works. Nothing on screen answers that | Replace with "Start from a past project", which copies its story and photos |
| Launch → "It's out there" | Project is public immediately | See point 3 above | Add a review step before the page is built or published |
| Request to join an organisation | Confirmation screen is clear. The dashboard afterwards is silent | See point 4 above | Show the pending request on the dashboard, with its 5-day deadline |
| Owner starts a personal project | Has to verify their own identity once | Correct, but the step 1 wording is for new visitors | Fix the wording (see above) |
| Member of an organisation | Asked to request permission | The team has said the member role isn't needed | Remove it once roles are settled |
| Events | No way to create an event anywhere. The Events tab is empty with no action | Matches Rachel's point that "Create Event" is hard to find | Make "Host an event" one of the Step 0 paths |
| Phone | No layout problems on the screens I checked | — | — |

---

## Answers to the magic-link questions

**How does it work?**
We email a one-time link. Opening it proves the email belongs to them and signs them in. In the prototype, "Open the link" stands in for clicking the link in the email.

**Do users have to verify their email before continuing?**
Yes. Opening the link is the verification. They can't reach the organisation or document steps without it.

**What happens when a link expires?**
They ask for a new one, either on the same screen ("send it again") or from Log in. Nothing they've filled in is lost, because progress is saved.

**Do users always have to log in through a link?**
In the prototype, yes. Worth considering alongside it:
- A 6-digit code in the same email. It works when the link opens in a different browser or on another device, which is the most common failure with magic links.
- "Continue with Google".
- Passkeys, later.

**One trade-off to note.** Telling someone "There is already an account on Agathos with this email address" also tells anyone who types an email whether that person has an account. For Agathos this is a small risk and the clearer message is worth it. It's still a choice the team should make knowingly.

---

## What I couldn't check

- Our current "create organisation" form and project page fields on the live platform, which I can't see.
- The real activation and welcome emails, which aren't part of the prototype.
