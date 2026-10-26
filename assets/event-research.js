/* ============================================================================
   Agathos — event feedback research (/event-research).
   The 17 issues of the "Event Feedback" sheet in "Product & Tech Roadmap (Q3 2026).xlsx",
   grouped by where they happen, with how other event platforms handle the same
   problem (each claim links to its source) and a short recommendation for Agathos.
   ============================================================================ */
(function(){
'use strict';

var GROUPS=[
  {id:'checkout',  t:'Checkout and account',      d:'Buying a ticket creates an Agathos account. These issues happen around that step.'},
  {id:'tickets',   t:'Finding and opening tickets', d:'After buying: getting from the email to the ticket.'},
  {id:'checkin',   t:'Check-in at the door',      d:'What the event team sees and can do while scanning.'},
  {id:'timing',    t:'Dates and times',           d:'How dates are written, and which date means what.'},
  {id:'attendees', t:'Attendee list',             d:'How the event owner finds and reads attendee details.'},
  {id:'messages',  t:'Messages to attendees',     d:'What Agathos sends, and how the event owner reaches attendees.'},
  {id:'after',     t:'After the event',           d:'Closing the books once the event is over.'}
];

/* row = row in the sheet; p = priority (null when the sheet has none); gl = GitLab issue */
var ISSUES=[
  {row:5,  g:'checkout', p:1, t:'Account is created even when payment fails',
   prob:'In auto-account creation flow, acc is created regardless of whether the transaction was successful. User is also sent activation email. Copy of activation email assumes transaction was successful and this might confuse users.',
   idea:'Update copy', how:[["Tito", "Emails go out only once an order is paid or claimed. On a declined card nothing is charged and the order stays pending until the buyer retries.", "https://go.tito.io/docs/getting-started/how-booking-works"], ["Stripe docs", "Fulfil orders from the payment-succeeded webhook, only when the payment is not unpaid. A separate \"payment failed\" event can trigger a \"your payment didn't go through\" email.", "https://docs.stripe.com/checkout/fulfillment"], ["Baymard", "Save account creation for the end of checkout, where it only means setting a password.", "https://baymard.com/blog/delayed-account-creation"]],
   rec:"Send the \"your account is ready\" email only after the payment provider confirms success. If payment fails, send nothing, or a separate \"Your payment didn't go through, try again\" email with no thank-you and no account wording."},
  {row:7,  g:'checkout', p:1, t:'"Email already exists" gives no way forward',
   prob:'Change error copy to "An account with this email already exists. Try [Logging In] or [Resetting Your Password]."',
   how:[["NN/g", "Stating the problem is not enough: offer a way to fix it, show the message next to the field, and keep what the user typed.", "https://www.nngroup.com/articles/error-message-guidelines/"], ["Peatix", "Asks for the email first. If it is already registered, the next screen asks for the password and offers \"Email me a sign in code\".", "https://help-attendee.peatix.com/en/support/solutions/articles/44001821777"], ["OWASP", "Saying an email is \"already in use\" lets anyone check who has an account. Their safer wording is \"A link to activate your account has been emailed to the address provided.\"", "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"]],
   rec:"Use the team's copy under the email field: \"An account with this email already exists. Try Logging in or Resetting your password.\" Both are real links with the email filled in, and the form keeps what was typed. If revealing the account matters more, use OWASP's \"we've emailed you a link\" wording."},
  {row:13, g:'checkout', p:2, t:'"Email already in use" hides the log-in button',
   prob:'When user buys a ticket and keys in existing email address > scrolls down selects payment type > clicks proceed to payment, screen jumps up to error message saying email is already in use, user should log in. However, log in button is not seen in the screen (it is located further at the top).',
   how:[["Baymard", "People who type an email that already has an account should still be allowed to check out as a guest. A sign-in prompt shown after the email field was overlooked by most test users.", "https://baymard.com/blog/make-guest-checkout-prominent"], ["NN/g", "Keep error messages next to the field. A summary at the top should not be the only sign of the error.", "https://www.nngroup.com/articles/errors-forms-design-guidelines/"], ["Tito", "No buyer account is needed, so an email never blocks checkout. The order page needs no sign-in.", "https://go.tito.io/docs/getting-started/how-booking-works"], ["Humanitix", "\"You do not need to create an account on Humanitix to purchase a ticket.\"", "https://help.humanitix.com/en/articles/12821567-do-i-need-to-create-an-account-on-humanitix"]],
   rec:"Don't block payment because the email has an account: let the order through and attach it to that account. If a log-in is truly needed, check the email as soon as the field is left, and show the message under it with \"Log in\" and \"Use a different email\"."},

  {row:3,  g:'tickets', p:1, gl:218, t:'"View tickets" before the account is activated',
   prob:'Users who click \'view tickets\' without activating account don\'t know how to login.',
   how:[["Eventbrite", "Also creates accounts from the checkout email. A \"Find my tickets\" button for signed-out visitors sends an email that logs the buyer in and opens their orders.", "https://www.eventbrite.com/blog/?p=423459"], ["Zeffy", "Buyers activate from the link in the confirmation email or straight from the login page: enter the payment email, get a link to set a password. An expired link sends them back to ask for a new one.", "https://support.zeffy.com/activating-your-zeffy-donor-account-czxn4"], ["Peatix", "The login page has \"Email me a sign in code\", so a buyer without a password still gets in.", "https://help-attendee.peatix.com/en/support/solutions/articles/44001821777"], ["Luma", "Passwords are optional. You sign in with your email and a 6-digit code.", "https://help.luma.com/p/signing-in"]],
   rec:"Put \"First time here? Get a sign-in link\" on the login page and wherever \"View tickets\" lands. It asks only for the email, so a buyer who never activated always has a way in without a password."},
  {row:6,  g:'tickets', p:1, t:'"Page has expired" while setting a password',
   prob:'Encountered during update password flow. Confusing copy as it says page has expired and user would choose first option.',
   how:[["Keycloak", "The screen is the \"login-page-expired\" template, with two links: restart the flow, or re-send the current step. Its text can be changed per realm (Localization tab) or in a login theme.", "https://www.keycloak.org/ui-customization/themes"], ["Keycloak", "Realm settings decide how long one login page stays valid (\"Login action timeout\") and how long emailed action links last (action lifespans). Community reports also tie the screen to the Back button and double-clicking submit.", "https://www.keycloak.org/docs/latest/server_admin/index.html"], ["Keycloak", "The update-password email can carry a client and a redirect URL; without them, the user has no link back to the site after setting a password.", "https://github.com/keycloak/keycloak/blob/main/services/src/main/java/org/keycloak/services/resources/admin/UserResource.java"], ["Zeffy", "An expired or used activation link sends the user to the login page to request a new one, not to a dead end.", "https://support.zeffy.com/activating-your-zeffy-donor-account-czxn4"]],
   rec:"First check Keycloak's login events to see the cause (Back button, double submit, or an expired link). Meanwhile rewrite the screen in plain words with one button, \"Start again\". Send the password email with a redirect URL so people land back on Agathos."},
  {row:9,  g:'tickets', p:2, t:'Account email or registration email?',
   prob:'User confused about email addressed used. Agathos account email vs registration form email. User cannot locate the tickets email.',
   how:[["Eventbrite", "Names the usual causes (logged in with another email, typo at checkout). \"Find my tickets\" works from the order email.", "https://www.eventbrite.com/blog/?p=423459"], ["Peatix", "The ticket email shows which account was used to register. If tickets don't show, \"you are probably logged into the wrong account.\"", "https://help-attendee.peatix.com/en/support/solutions/articles/44001821776"], ["Humanitix", "Tells buyers to check other addresses: autofill may have used one, and Apple Pay or Google Pay orders go to the email on that wallet.", "https://help.humanitix.com/en/articles/11751732-i-can-t-find-my-order-confirmation-email"], ["Tito", "A lookup page emails a link to every ticket registered under the address you type.", "https://help.tito.io/en/articles/2038143-can-i-request-a-copy-of-my-ticket"]],
   rec:"On the confirmation page and in every ticket email, name the address in one line: \"Tickets sent to a@b.com. Sign in with this same email.\" Add a \"Find my tickets\" box that emails a link to whatever address is typed."},
  {row:14, g:'tickets', p:3, t:'Buyers won\'t log in just to see their tickets',
   prob:'Users click \'view tickets\' in email but are prompted to login/sign up and are not willing to do so.',
   idea:'Use magic links for ticket email?', how:[["Tito", "Every order has its own page at a private link. \"View your order\" in the email opens it with no account and no sign-in. A one-ticket email is itself the ticket.", "https://go.tito.io/docs/getting-started/how-booking-works"], ["Humanitix", "\"View tickets\" in the confirmation email opens the digital tickets. No account is needed to buy or see them.", "https://help.humanitix.com/en/articles/8924058-where-is-my-ticket"], ["Eventbrite", "Went the other way: since May 2024 tickets are no longer in the emails, only in the app or behind log-in, softened by an auto-login \"Find my tickets\" email.", "https://www.eventbrite.co.uk/blog/?p=423905"], ["Keycloak add-on", "The open-source keycloak-magic-link extension sends a sign-in link (or code) that works on another device; links last 24 hours by default. Licence ELv2.", "https://github.com/p2-inc/keycloak-magic-link"]],
   rec:"\"View tickets\" opens that one order through a private, expiring link with no log-in (the Tito and Humanitix way), and the QR code is also in the email. Ask for sign-in only to edit or transfer. A Keycloak magic link is the heavier option if viewing should also log the user in."},

  {row:8,  g:'checkin', p:2, t:'Scanner may not show the attendee\'s name',
   prob:'Scanning ticket might not show name of attendee.',
   idea:'To investigate', how:[["Peatix", "After a scan, the app shows the attendee's name and the number and name of their tickets. Tapping the check mark undoes it.", "https://help-organizer.peatix.com/en/support/solutions/articles/44001821822"], ["Luma", "A scan opens the guest's details: name, photo, ticket type and registration answers. Staff tap to confirm or undo the check-in.", "https://help.luma.com/p/check-in"], ["Tito", "A ticket with no attendee reads \"Unassigned\", with the buyer's name under it. In Tito Pro, showing names on scanning devices is a setting on each check-in list.", "https://go.tito.io/docs/events/check-someone-in"]],
   rec:"Every scan result shows the attendee's name in large text, with ticket type and quantity under it. A ticket with no name shows \"Unassigned\" and the buyer's name. Hiding names can be a per-event setting, not the default."},
  {row:10, g:'checkin', p:2, t:'Manual check-in should always check the person in',
   prob:'Manual check-in should override any rules and always change status to \'checked in\'.',
   how:[["Tito", "The app reports the problem and leaves the call to staff: someone already in is shown with their arrival time; invalid or refunded tickets say so. Undo asks first.", "https://go.tito.io/docs/events/check-someone-in"], ["Humanitix", "Each rule has its own scan message (\"Ticket type unauthorised\", \"Different event date\", \"Already checked in\"). Manual check-in is done from the Attendees or Orders tab.", "https://help.humanitix.com/en/articles/13753417-how-to-use-the-humanitix-for-hosts-app"], ["Ticket Tailor", "An \"already checked in\" banner can be tapped to see when and on which scanner. On the door list, tapping the tick checks a person in or out.", "https://help.tickettailor.com/en/articles/5151698-how-to-check-in-your-attendees-with-the-tazotix-app-at-your-event"], ["pretix", "The check-in API has a \"force\" flag that succeeds regardless of revoked barcode, earlier check-ins or required questions. It is mainly used for offline scans.", "https://docs.pretix.eu/dev/api/resources/checkin.html"]],
   rec:"Scanning keeps its rules. Manual check-in from the attendee list always succeeds, but says which rule it skipped (e.g. \"Already checked in at 6:42pm\"). It is saved as manual, with the staff name and time, and can be undone."},
  {row:12, g:'checkin', p:2, t:'When can tickets be scanned?',
   prob:'EO does not know when tickets can be scanned.',
   how:[["Eventbrite", "For timed-entry events, staff pick a time slot in the app and only tickets for that slot scan. The slot is shown at the top of the screen.", "https://www.eventbrite.ca/help/en-ca/articles/741083/how-to-check-in-attendees-at-the-event-with-eventbrite-organizer/"], ["Humanitix", "For multi-date events, staff choose the date before scanning. A ticket for another date returns \"Different event date\".", "https://help.humanitix.com/en/articles/13753417-how-to-use-the-humanitix-for-hosts-app"], ["pretix", "The organizer sets the scanning window on the check-in list (\"after event start\", \"before event end\"), with an optional tolerance in minutes for early entry.", "https://docs.pretix.eu/en/latest/user/events/guides/timeslots.html"], ["Tito", "Check-in lists can have an expiry date. After it, the list data is removed from the app and the web check-in link stops working.", "https://help.tito.io/en/articles/2006183-check-ins"]],
   rec:"Give scanning its own opening and closing time, shown in event setup and at the top of the scanner (\"Scanning open: Sat 8 Nov, 6:00pm to 11:00pm SGT\"). Default it to a set time before the event until the end, editable. Outside the window the scanner says \"Scanning opens at …\", not a generic error."},

  {row:11, g:'timing', p:2, t:'Dates and times are hard to read',
   prob:'Date & time representation on tickets are confusing (and across all UI).',
   how:[["GOV.UK", "Write dates as \"4 June 2017\". Use \"to\" in ranges (\"10am to 11am\", not \"10-11am\"). Write \"5:30pm\", not \"1730hrs\". Add the time zone for people elsewhere.", "https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/"], ["W3C", "Numeric date order differs by country (12/02 is 12 Feb or 2 Dec). Use month names and 4-digit years.", "https://www.w3.org/International/questions/qa-date-format"], ["Microsoft", "Show the time zone when people outside it may see the event. In a range, lead with what matters most to the reader.", "https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/term-collections/date-time-terms"], ["Luma", "In-person events show times in the venue's time zone. Event lists add the viewer's local time in brackets when it differs.", "https://help.luma.com/p/understanding-timezones"]],
   rec:"One format everywhere: day, short month, 4-digit year, then the time with am/pm and SGT, e.g. \"Wed 12 Feb 2025, 10:45am SGT\". Use \"to\" for ranges. Put a label before every date (\"Sales end\", \"Event starts\"), so two bare timestamps never sit side by side."},
  {row:16, g:'timing', p:3, t:'Page live time vs event time',
   prob:'EO gets confused by page LIVE timing vs event LIVE timing.',
   how:[["Ticket Tailor", "Publishing and ticket sales are separate. Sales can open immediately, at a set date and time, or a set interval before the event. Before then the page is visible but nobody can buy.", "https://help.tickettailor.com/en/articles/4068121-how-can-i-schedule-my-event-to-go-live-at-a-future-date"], ["Humanitix", "Sales start when the event is published and end at the event end, unless set per ticket type (\"At\", \"Before\", or \"When another ticket sells out\"). Buyers see \"Sales start at…\".", "https://help.humanitix.com/en/articles/9833326-set-when-tickets-will-start-or-end-sales"], ["Peatix", "Sales open on publishing unless a start time is set, and close by default at the event start (\"Event cutoff\"), which can be moved.", "https://help-organizer.peatix.com/en/support/solutions/articles/44001821718"], ["Eventbrite", "\"Schedule Publish\" sets when the listing goes live and marks the event \"Scheduled\". Each ticket type has its own \"When are tickets available?\".", "https://www.eventbrite.ca/help/en-ca/articles/644100/how-to-create-custom-ticket-types/"]],
   rec:"Name the three times differently and show them together on one timeline in event setup: \"Page goes live\", \"Ticket sales: open to close\", \"Event: starts to ends\". Default sales to open with the page and close at the event start. Buyers see a labelled line, e.g. \"Sales open 1 Nov, 10:00am SGT\"."},

  {row:2,  g:'attendees', p:1, t:'Clicking a name opens the wrong page',
   prob:'Click on name in attendee list directs to user info page, which does not really follow typical expected behaviour during registration.',
   idea:'Change to open \'more details\'', how:[["Eventbrite", "Each attendee row has \"View attendee details\": their answers to custom questions, with edit, note and transfer. The order page holds resend, refund and print.", "https://www.eventbrite.ca/help/en-ca/articles/296681/how-to-view-attendee-orders-in-eventbrite-music/"], ["Tito", "Clicking an attendee's name opens their ticket: reference, order, status, ticket type, answers, and internal notes the attendee can't see.", "https://help.tito.io/en/articles/2006164-attendee-management"], ["Luma", "Clicking a guest shows check-in status, details and registration answers. The host can change their status (Going, Not going, Waitlist) from there.", "https://help.luma.com/p/managing-your-guest-list"], ["Ticket Tailor", "In the door list, clicking a name expands the order to show the answers to attendee questions.", "https://help.tickettailor.com/en/articles/8583541-how-to-see-answers-to-your-checkout-form-questions"]],
   rec:"Clicking a name opens a side panel with that registration: ticket, order (amount, date, status), form answers, check-in status, and actions (resend, refund, note). The user profile becomes a secondary link."},
  {row:15, g:'attendees', p:3, t:'Can\'t search by other fields',
   prob:'EO that wants to search other fields cannot do so on Agathos platform. A lot of info is also "hidden" until EO clicks more details.',
   how:[["Luma", "Search matches name, email or email domain, with status and ticket filters. An expanded guest table shows every registration answer in one view, and the CSV export keeps the current filter.", "https://help.luma.com/p/expanded-guest-table"], ["Eventbrite", "Search matches order number, email or name. Custom answers are in a separate \"Custom questions responses\" report, filterable and exportable.", "https://www.eventbrite.se/help/sv/articles/588323/how-to-view-responses-to-custom-questions/"], ["Tito", "Search matches name, email, or attendee or order reference, with ticket and status filters. Answers show on each ticket; attendees and orders export to Excel or CSV.", "https://help.tito.io/en/articles/2006164-attendee-management"], ["Humanitix", "Checkout answers are mainly in the CSV reports: per-order answers in the orders report, per-ticket answers in the attendees report.", "https://help.humanitix.com/en/articles/8906247-where-to-find-attendee-information-and-answers-to-checkout-questions"]],
   rec:"Let the event owner add form answers as columns in the attendee table, and make search match those columns too. The export uses the same filtered view. None of these platforms document search by custom answers, so this would go further than they do."},

  {row:4,  g:'messages', p:1, gl:209, t:'Which emails does Agathos send?',
   prob:'EO does not know what notifications will be sent out by Agathos platform.',
   idea:'System messages UI', how:[["Luma", "The Blasts tab has a \"System Messages\" section. The host can turn off the automatic reminders (1 day and 1 hour before) and add their own text to the confirmation, waitlist and declined emails.", "https://help.luma.com/p/disabling-or-enabling-notifications-and-reminders"], ["Eventbrite", "A help article lists every automatic attendee email (order confirmation, 48-hour reminder, refund, event changes…). Organizers can add text to the confirmation email and ticket, per ticket type.", "https://www.eventbrite.ca/help/en-ca/articles/748624/what-emails-will-attendees-automatically-receive/"], ["Ticket Tailor", "Settings › Email templates lists the automatic emails. Each has Edit, a text editor and placeholders for buyer or order details.", "https://help.tickettailor.com/en/articles/8015413-how-to-edit-your-order-confirmation-email"], ["Humanitix", "The order confirmation always goes out and its layout is fixed. The host adds a custom message for all buyers or per ticket type. There are no automatic reminders; the host schedules them.", "https://help.humanitix.com/en/articles/9938796-do-ticket-buyers-receive-a-confirmation-email-for-their-purchase"]],
   rec:"Add a \"System messages\" list in Manage Event: each email Agathos sends, when it goes out, who gets it, and a preview. Where allowed, an on/off switch and a box for the event owner's own text."},
  {row:17, g:'messages', p:4, t:'No way to message attendees',
   prob:'EO cannot contact attendees on the platform. Separate info mailers potentially confuse users because they don\'t know if to search for \'agathos\' or \'EO\'.',
   how:[["Eventbrite", "\"Emails to attendees\" under Manage attendees: send to all, by ticket type or to chosen people, now or scheduled. The sender name and reply-to address are the organizer's.", "https://www.eventbrite.ca/help/en-ca/articles/484221/how-to-email-your-attendees/"], ["Luma", "Blasts go by email, SMS and push, filtered by status or ticket type, and also appear on the event page. The email shows the host's name and photo; replies go to the host.", "https://help.luma.com/p/sending-or-scheduling-event-blasts"], ["Humanitix", "Email campaigns to buyers or attendees, scheduled before or after the event. Sent from the Humanitix domain with the host's name as sender, and a reply-to field. Event updates only, no marketing.", "https://help.humanitix.com/en/articles/8888873"], ["Peatix", "\"Message all\", or a mail icon next to one attendee. Replies land in the organizer's Peatix inbox and are forwarded to their email.", "https://us-help-organizer.peatix.com/support/solutions/articles/44002536640-how-to-send-messages-to-attendees"]],
   rec:"Add \"Message attendees\" in Manage Event, sent through Agathos as \"[Event owner] via Agathos\" with replies going to the event owner. Attendees find it whichever name they search for. Keep a log of sent messages."},

  {row:18, g:'after', p:null, t:'Where is the accounting export?',
   prob:'EO cannot find where to do accounting during post-event phase (finding orders.csv file).',
   idea:'To be addressed with finance report enhancement. Also, work on improving the categorisation of Manage Event.', how:[["Eventbrite", "The orders export sits under Reporting › Event reports › Orders. Finance › Payouts has a payout summary and an itemized payout report: gross, fees, tax and amount paid out per order.", "https://www.eventbrite.co.uk/help/en-gb/articles/620300/export-payout-reports/"], ["Humanitix", "The event menu has orders (CSV with amounts, refunds, fees, discounts) and payouts (a PDF receipt with fees and the bank-statement reference). The top menu has the same reports across all events.", "https://help.humanitix.com/en/articles/8913401-how-to-find-your-event-payout-receipt-and-breakdown"], ["Zeffy", "Finances › Transactions and Finances › Payouts each export, including the transactions inside each payout.", "https://support.zeffy.com/reports-and-exporting-data-k15ip"], ["Ticket Tailor", "Orders › Actions › Export gives an overview report (one row per order) or a line-item report, with saved filters.", "https://help.tickettailor.com/en/articles/950965-how-to-export-your-order-information"]],
   rec:"Give Manage Event its own \"Reports & payouts\" section, separate from Attendees. It holds the orders export and the payout summary (the new /financial-report). Once the event has ended, the event page points to it."}
];

/* ---------- helpers ---------- */
function h(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
var EXT='<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 2.5h5v5M9.5 2.5L3 9"/></svg>';
var PLUS='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 4.5v11M4.5 10h11"/></svg>';
function pri(p){ return p ? 'p'+p : 'none'; }
function host(u){ return u.replace(/^https?:\/\/(www\.)?/,'').split('/')[0]; }

var filter='all';

function card(x){
  return '<article class="er-card" id="row-'+x.row+'">'+
    '<div class="er-tags">'+(x.p?'<span class="p'+x.p+'">Priority '+x.p+'</span>':'<span>No priority set</span>')+(x.gl?'<span class="gl">GitLab #'+x.gl+'</span>':'')+'<span>Sheet row '+x.row+'</span></div>'+
    '<h3>'+h(x.t)+'</h3>'+
    '<p class="prob">'+h(x.prob)+'</p>'+
    (x.idea?'<p class="idea"><b>Team idea:</b><span>'+h(x.idea)+'</span></p>':'')+
    '<h4>How others do it</h4>'+
    '<ul class="er-how">'+x.how.map(function(w){
      return '<li><span class="who">'+h(w[0])+'</span><p class="what">'+h(w[1])+(w[2]?'<a href="'+h(w[2])+'" target="_blank" rel="noopener">'+h(host(w[2]))+EXT+'</a>':'')+'</p></li>';
    }).join('')+'</ul>'+
    '<div class="er-rec"><div><b>For Agathos</b>'+h(x.rec)+'</div></div>'+
  '</article>';
}

function render(){
  var shown=ISSUES.filter(function(x){ return filter==='all' || pri(x.p)===filter; });
  var platforms={}, sources=0;
  ISSUES.forEach(function(x){ x.how.forEach(function(w){ platforms[w[0]]=1; if(w[2]) sources++; }); });
  var count=function(p){ return ISSUES.filter(function(x){ return pri(x.p)===p; }).length; };

  var head='<div class="er-head"><span class="hp-kicker">Product &amp; Tech Roadmap · Q3 2026</span>'+
    '<h1>Event feedback: how others solve it</h1>'+
    '<p>The 17 issues from the Event Feedback sheet, grouped by where they happen. Each one shows what other event platforms do, with links to their help pages, and a suggestion for Agathos.</p></div>';
  var band='<section class="er-band">'+
    '<div><div class="num">'+ISSUES.length+'</div><div class="lbl">issues</div></div>'+
    '<div><div class="num">'+GROUPS.length+'</div><div class="lbl">areas</div></div>'+
    '<div><div class="num">'+sources+'</div><div class="lbl">sources</div></div>'+
    '<div class="pri"><div class="t">By priority</div><div class="chips">'+
      ['p1','p2','p3','p4'].map(function(p){ return '<span>Priority '+p.slice(1)+'<b>'+count(p)+'</b></span>'; }).join('')+
      (count('none')?'<span>Not set<b>'+count('none')+'</b></span>':'')+
    '</div></div></section>';

  var groups=GROUPS.map(function(g, i){
    var list=shown.filter(function(x){ return x.g===g.id; });
    if(!list.length) return '';
    return '<section class="er-group" id="'+g.id+'"><div class="er-group-head"><span class="n">'+String(i+1).padStart(2,'0')+'</span><div><h2>'+h(g.t)+'</h2><p>'+h(g.d)+'</p></div></div>'+list.map(card).join('')+'</section>';
  }).join('');

  var rail='<aside class="er-rail"><h4>Areas</h4><ol>'+GROUPS.map(function(g){
    var n=shown.filter(function(x){ return x.g===g.id; }).length;
    return n ? '<li><a href="#'+g.id+'" data-g="'+g.id+'">'+h(g.t)+'<span>'+n+'</span></a></li>' : '';
  }).join('')+'</ol>'+
  '<div class="src"><b>Platforms</b>'+h(Object.keys(platforms).join(', '))+'</div></aside>';

  var filters='<div class="er-filter" role="group" aria-label="Filter by priority"><span>Priority</span>'+
    [['all','All'],['p1','1'],['p2','2'],['p3','3'],['p4','4'],['none','Not set']].map(function(f){ return '<button type="button" data-f="'+f[0]+'"'+(filter===f[0]?' class="on" aria-pressed="true"':' aria-pressed="false"')+'>'+f[1]+'</button>'; }).join('')+'</div>';

  document.getElementById('er').innerHTML='<div class="er-wrap">'+head+band+
    '<div class="er-layout">'+rail+'<div class="er-content">'+filters+(groups||'<div class="er-empty">No issues with this priority.</div>')+
    '<p class="er-foot">Research done in October 2026 from each platform\'s public help pages. Features change: check the source link before building on a detail.</p></div></div></div>';
  spy();
}

/* highlight the area in view */
var io;
function spy(){
  if(io) io.disconnect();
  if(!('IntersectionObserver' in window)) return;
  io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      document.querySelectorAll('.er-rail a').forEach(function(a){ a.classList.toggle('on', a.getAttribute('data-g')===e.target.id); });
    });
  }, {rootMargin:'-120px 0px -60% 0px'});
  document.querySelectorAll('.er-group').forEach(function(s){ io.observe(s); });
}

document.addEventListener('click', function(ev){
  var b=ev.target.closest('[data-f]');
  if(b){ filter=b.getAttribute('data-f'); render(); }
});

document.getElementById('nav-auth').innerHTML='<a class="create" href="onboarding.html#/begin">'+PLUS+'Create</a>'+
  '<a class="user" href="onboarding.html#/dashboard"><span class="av">JD</span><span class="nm">Josias Ding</span></a>'+
  '<button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-menu"><i></i><i></i><i></i></button>';

/* nav (same behaviour as the homepage) */
(function(){
  var nav=document.getElementById('nav');
  window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY>20); }, {passive:true});
  nav.addEventListener('click', function(ev){
    var b=ev.target.closest('.burger'); if(!b) return;
    var open=nav.classList.toggle('open'); b.setAttribute('aria-expanded', open?'true':'false');
  });
  nav.querySelectorAll('.hp-nav-menu a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); }); });
})();

render();
})();
