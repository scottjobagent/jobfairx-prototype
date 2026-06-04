# JobFairX Eventbrite → HubSpot Template Assets

Everything Bryce needs to rebuild the 5 event templates in HubSpot.

## Folder structure

```
hubspot-assets/
├── covers/              — 5 hero cover photos (2160×1080)
│   ├── cover-entry-level.png    (brand blue   #0044B3)
│   ├── cover-healthcare.png     (green        #0F8E57)
│   ├── cover-veterans.png       (red          #A02525)
│   ├── cover-diversity.png      (orange       #E8731B)
│   └── cover-technology.png     (purple       #5B3DAB)
├── sections/            — section graphics
│   ├── how-it-works.png             (1600×900 — shared across all types)
│   ├── trust-stats.png              (2160×320 — shared across all types)
│   ├── past-companies-entry-level.png   (1600×900 — Birmingham/Entry-Level grid)
│   ├── past-companies-healthcare.png    (1600×900 — Healthcare grid)
│   ├── past-companies-veterans.png      (1600×900 — Veterans grid)
│   ├── past-companies-diversity.png     (1600×900 — Diversity grid)
│   └── past-companies-technology.png    (1600×900 — Technology grid)
└── README.md
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

Use the toggle at the top right to switch between Visual and Dev Doc views.
There's also a cross-template toggle to jump between all 5 event types.
