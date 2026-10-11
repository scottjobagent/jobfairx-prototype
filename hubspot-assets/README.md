# JobFairX Event Template Assets

Build pack with all images needed for HubSpot and Eventbrite versions of the 5 event templates.

## Folder structure

```
hubspot-assets/
‚îú‚îÄ‚îÄ covers/                          ‚Äî 5 covers WITH "Virtual" (HubSpot version)
‚îÇ   ‚îú‚îÄ‚îÄ cover-entry-level.png        Entry-Level Virtual Job Fair
‚îÇ   ‚îú‚îÄ‚îÄ cover-healthcare.png         Healthcare Virtual Job Fair
‚îÇ   ‚îú‚îÄ‚îÄ cover-veterans.png           Veterans Virtual Job Fair
‚îÇ   ‚îú‚îÄ‚îÄ cover-diversity.png          Diversity Virtual Job Fair
‚îÇ   ‚îî‚îÄ‚îÄ cover-technology.png         Technology Virtual Job Fair
‚îú‚îÄ‚îÄ covers-eventbrite/               ‚Äî Eventbrite covers WITHOUT "Virtual"
‚îÇ   (shared cover + weekly per-type options now live in ../2027-eventbrite-files/)
‚îÇ   ‚îú‚îÄ‚îÄ cover-entry-level.png        previous per-type cover (superseded by cover-job-fair.png)
‚îÇ   ‚îú‚îÄ‚îÄ cover-healthcare.png         previous per-type cover
‚îÇ   ‚îú‚îÄ‚îÄ cover-veterans.png           previous per-type cover
‚îÇ   ‚îú‚îÄ‚îÄ cover-diversity.png          previous per-type cover
‚îÇ   ‚îî‚îÄ‚îÄ cover-technology.png         previous per-type cover
‚îú‚îÄ‚îÄ sections/                        ‚Äî section graphics
‚îÇ   ‚îú‚îÄ‚îÄ how-it-works.png             (1600√ó900 ‚Äî shared across all types)
‚îÇ   ‚îú‚îÄ‚îÄ trust-stats.png              (2160√ó320 ‚Äî shared across all types)
‚îÇ   ‚îú‚îÄ‚îÄ past-companies-entry-level.png
‚îÇ   ‚îú‚îÄ‚îÄ past-companies-healthcare.png
‚îÇ   ‚îú‚îÄ‚îÄ past-companies-veterans.png
‚îÇ   ‚îú‚îÄ‚îÄ past-companies-diversity.png
‚îÇ   ‚îî‚îÄ‚îÄ past-companies-technology.png
‚îî‚îÄ‚îÄ README.md
```

## Brand colors

| Element            | Hex        | Use                                    |
|--------------------|------------|----------------------------------------|
| Brand blue         | `#0044B3`  | Primary CTA, links, trust banner       |
| Brand blue (dark)  | `#003399`  | Hover state, secondary blue            |
| Gold accent        | `#FFB800`  | "Free for Job Seekers" pill            |
| Body text          | `#1a1a1a`  | Headings, body copy                    |
| Secondary text     | `#4b5563`  | Subtitles, meta                        |
| Surface gray       | `#fafafa`  | Section backgrounds                    |
| Border light       | `#e5e7eb`  | Card borders, hairlines                |

### Event-type covers

| Type        | Cover color |
|-------------|-------------|
| Entry-Level | `#0044B3`   |
| Healthcare  | `#0F8E57`   |
| Veterans    | `#A02525`   |
| Diversity   | `#E8731B`   |
| Technology  | `#5B3DAB`   |

### Shared Eventbrite cover (`../2027-eventbrite-files/cover-job-fair.png`)

One cover for all five Eventbrite event templates (added 11 Oct 2026). Replaces the five per-type Eventbrite covers above; the HubSpot `covers/` set is unchanged. All Eventbrite cover files, including the three per-type design directions for a one-type-per-week schedule, are in `../2027-eventbrite-files/` (gallery: `../2027-eventbrite-files/index.html`).

| Element | Spec |
|---------|------|
| Canvas | 2160 √ó 1080 px (2:1), PNG |
| Background | Brand blue `#0044B3` with a 72 px grid at 8% white |
| Labels, row 1 | HEALTHCARE `#0F8E57` ¬∑ ENTRY-LEVEL `#2563EB` ¬∑ VETERAN `#A02525` |
| Labels, row 2 | DIVERSITY `#E8731B` ¬∑ TECHNOLOGY `#5B3DAB` |
| Label type | Inter 800, 35 px, +0.06 em tracking, white, in fully rounded pills with a 3 px white stroke at 45% |
| Divider | Gold `#FFB800`, 360 √ó 8 px, rounded |
| Headline | "JOB FAIR", Inter 900, 222 px, ‚àí0.02 em tracking, white |
| Square-crop safe zone | Every element sits inside the centre 1080 √ó 1080 (x 540‚Äì1620) with a 56 px margin, so square thumbnails keep all text |
| Text on the cover | Only the five labels and "JOB FAIR" ‚Äî no dates, cities, logos, pricing or other copy |

**Editable source:** `cover-job-fair.svg` (plain SVG: rects + text, grouped by element; fonts Inter 800/900 via Google Fonts, fallback Helvetica Neue/Arial). Opens in Figma, Illustrator or Inkscape.

**Re-export after editing:** open the SVG in Chrome and screenshot it at 2160 √ó 1080, or run:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=2160,1080 --virtual-time-budget=10000 \
  --screenshot=cover-job-fair.png cover-job-fair.svg
```

Chrome writes the PNG within a few seconds. On this Mac the headless process does not always exit afterwards; quit it once the file exists.

## Typography

- **Font family:** Inter (system fallback: system-ui, sans-serif)
- **Heading weights:** 800 (h1/h2 hero), 700 (h3 section)
- **Body:** 400 (regular), 500 (medium), 700 (bold links)
- **Line heights:** 1.2 (hero), 1.3 (h3), 1.55 (body)

## Per-event stats (employer-facing copy)

| Event type   | Avg interviews | Avg hires |
|--------------|----------------|-----------|
| Entry-Level  | 73             | 19        |
| Healthcare   | 35             | 8         |
| Veterans     | 35             | 7         |
| Diversity    | 35             | 11        |
| Technology   | 53             | 11        |

## Per-event employer emails

| Event type   | Email                            |
|--------------|----------------------------------|
| Entry-Level  | eventbrite@jobfairx.com          |
| Healthcare   | eventbrite@healthcarex.co        |
| Veterans     | eventbrite@militaryx.com         |
| Diversity    | eventbrite@diversityx.net        |
| Technology   | eventbrite@technologyxevents.com |

## Reference

Live design templates (visual + dev doc toggle):
https://scottjobagent.github.io/jobfairx-prototype/eventbrite-entry-level-mockup.html
