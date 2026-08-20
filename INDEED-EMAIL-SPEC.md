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
