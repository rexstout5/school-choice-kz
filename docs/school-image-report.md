# School image population report

Report date: 2026-06-15

## Scope

Reviewed all 77 school records in `src/data/schools.js` for a representative image source.

## Method

- Schools with an official website now receive a `main_image` object automatically from the official website URL.
- The image is a 1200x800 static screenshot generated from the official website through Thum.io, so the visual source remains the school website while avoiding stale hand-copied image assets.
- Schools without a source-confirmed official website keep `main_image: null` and continue to use the built-in local fallback illustration until a public official or school-photo source can be verified.

## Summary

| Check | Count |
| --- | ---: |
| Total school records | 77 |
| Records populated with representative images | 51 |
| Records still without source-confirmed images | 26 |

## Schools without images

These records do not have a source-confirmed official website or representative public school photo in the dataset yet:

- `arna-primary-school`
- `akzhol-primary-school`
- `bolashak-primary-school`
- `milestone-school-astana`
- `future-school-astana`
- `pochemuchka-school-astana`
- `academia-primary-school-astana`
- `ingenium-school-astana`
- `zerek-school-astana`
- `sana-school-astana`
- `dostar-school-astana`
- `intellect-school-astana`
- `smart-bilim-school-astana`
- `darina-school-astana`
- `kemel-school-astana`
- `qadam-school-astana`
- `shanyraq-school-astana`
- `meridian-school-astana`
- `prestige-school-astana`
- `leader-school-astana`
- `parasat-school-astana`
- `samruk-school-astana`
- `global-school-astana`
- `abadan-school-astana`
- `nomad-school-astana`
- `aqniet-school-astana`

## Follow-up research targets

- Confirm official websites for the 26 private-school records above.
- If no official site exists, use a public school-photo listing only when the listing clearly matches the school name and Astana location.
- Add explicit `main_image` overrides for any school whose official website screenshot is less representative than an official building or campus photo.
