# Indeed's seeker email design — measured, not guessed

Extracted 2026-08-20 from the live DOM of Indeed's own emails in Scott's Gmail
label "A - Indeed Job Seeker Emails" (the 7-Eleven in-person confirmation and
the ECPI virtual hiring-event email).

## Type

| Role | Spec |
|---|---|
| Font stack | `'Noto Sans', Helvetica, Arial, sans-serif` |
| Headline (h1) | 36px / 45px, bold, `#000000`, margin 0 |
| Bold data line | 16px / 24px, weight 700, `#2d2d2d` |
| Secondary line | 16px / 24px, weight 400, `#595959` |
| Section heading | 16px / 24px, weight 700, `#595959` |
| Action link | `#2557a7`, `text-decoration:none` |
| Header link | `#004fcb`, underlined |

Everything in the body is **16px / 24px**. There is no small type.

## Structure

Big h1. No coloured callout box anywhere. No two-column label/value card.
Details are **iconed stacked rows**: a small icon, a bold line beside it, then
grey lines stacked underneath.

    [clock]  August 19, 2026
             11:00 AM US/Eastern

    [pin]    7-Eleven
             7-Eleven #19919
             610 US HWY 64
             Manteo, NC 27954

Then a bold grey section heading with grey body under it
("Here's how you can prepare" / "How to attend" / "How to join your interview"),
then plain text links — Change interview time, Cancel interview — then a sign-off.

## No greeting

Indeed's seeker mail opens straight on the headline. There is no "Hi <name>,".
Ours matches.

## The one button

Indeed has exactly one filled button, and only for joining:

    background:#2557a7; color:#fff; font-size:16px; font-weight:700;
    line-height:44px; border-radius:8px; text-decoration:none;
    display:inline-block

It is followed by a fallback line — "If the button doesn't work, use this link:"
— with the raw URL printed beneath it. Phone and in-person have no button.

## Section order, per type

Virtual: No software required -> How to join your interview -> button ->
fallback link -> Change interview time -> Cancel interview -> Have a great
interview!

In person: How to attend (employer's own words) -> Here's how you can prepare ->
Change interview time -> Cancel interview. No sign-off, no button.

The prepare section appears on the in-person reminder and not on the virtual
one. Matched per type rather than averaged.

## Icons

Small hosted PNGs: 14px and 12px wide for the inline row icons, 80px for the
logo. Not SVG, not emoji — email clients need images.

## What we already share

`#2d2d2d` and `#595959` are exactly our `--ink` and `--ink-2`. Noto Sans is
already the prototype's font. Their `#2557a7` is close to our `--blue` `#0044B3`.

## Where ours differs today

| | Indeed | jobseeker-emails-preview.html |
|---|---|---|
| Font | Noto Sans | system stack |
| Body size | 16 / 24 everywhere | 13–14px |
| Headline | h1 36px, plain | 15px title inside a green callout |
| Details | iconed stacked rows | grey card, two-column rows, 14px |
| Section heading | 16px bold grey | 10px uppercase, letterspaced |
| Actions | plain links | filled button + small link |
| Container | plain white | grey outer, white inner card, radius, shadow |

## Phone, from Indeed's employer mail

There is no seeker-side phone email from Indeed to copy. The mechanics come from
their employer mail instead, in the "A - Indeed Employer Emails" label.

On the request: **"Indeed will email phone details after the candidate
confirms."** No number exists yet.

On the confirmation, to the employer:

    Call from your phone
    <the candidate's number>
    Call the number above at your interview start time.
    Visit the candidate's page to choose another way to contact them.

Three things follow. The number that changes hands is the **candidate's own** —
the employer dials it. The heading names the direction rather than leaving it to
be inferred. And the number is withheld until the interview is confirmed.

Indeed never names a person as the caller anywhere in this flow, which matches
our own rule that candidates do not see recruiter names.

Our seeker-side wording is therefore inferred from their employer copy, not
transcribed. It is the one place in these emails where we are designing rather
than matching.

## The employer's video call: name the product

Indeed never names the video product in any email. Their employer form asks only
"Paste your video link" and never asks which service it is, so they cannot name
it. We can: the link's host says so.

`platformFromLink()` reads the host and maps the known ones — Teams, Zoom, Google
Meet, Webex, Whereby, GoTo, Jitsi. An unrecognised host names no product and the
copy falls back to "a video link from the employer".

This is worth the small mechanism because it answers the only question this type
raises that the others do not: whether the candidate needs to install something
before the interview starts. "Open the link a few minutes early — you may need to
install Microsoft Teams first" prevents a candidate spending the first four
minutes of a fifteen-minute interview at a download screen.

Note this is derived, not declared. If the employer form ever captures the
product name directly, that value is authoritative and should win.
