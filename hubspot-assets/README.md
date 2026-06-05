# JobFairX Event Template Assets

Build pack with all images needed for HubSpot and Eventbrite versions of the 5 event templates.

## Folder structure

```
hubspot-assets/
├── covers/                          — 5 covers WITH "Virtual" (HubSpot version)
│   ├── cover-entry-level.png        Entry-Level Virtual Job Fair
│   ├── cover-healthcare.png         Healthcare Virtual Job Fair
│   ├── cover-veterans.png           Veterans Virtual Job Fair
│   ├── cover-diversity.png          Diversity Virtual Job Fair
│   └── cover-technology.png         Technology Virtual Job Fair
├── covers-eventbrite/               — 5 covers WITHOUT "Virtual" (Eventbrite version)
│   ├── cover-entry-level.png        Entry-Level Job Fair
│   ├── cover-healthcare.png         Healthcare Job Fair
│   ├── cover-veterans.png           Veterans Job Fair
│   ├── cover-diversity.png          Diversity Job Fair
│   └── cover-technology.png         Technology Job Fair
├── sections/                        — section graphics
│   ├── how-it-works.png             (1600×900 — shared across all types)
│   ├── trust-stats.png              (2160×320 — shared across all types)
│   ├── past-companies-entry-level.png
│   ├── past-companies-healthcare.png
│   ├── past-companies-veterans.png
│   ├── past-companies-diversity.png
│   └── past-companies-technology.png
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
