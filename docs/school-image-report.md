# School image population report

Report date: 2026-06-15

## Scope

Reviewed all 77 school records in `src/data/schools.js` for a representative image source.

## Method

- Official school websites are checked first. Records with a verified official website receive a `main_image` object from that official website URL.
- Official-site images use a 1200x800 static screenshot generated through Thum.io. The public image URL is stored in `main_image.src`, while `image_source.url` points back to the official school website that was reviewed first.
- If an official website is unavailable, the dataset falls back only to existing public directory sources that are not search-result pages. Those directory-derived images are marked `needs_review`.
- Records without an official website or a specific public directory page remain `missing` and continue to use the local fallback illustration.

## Summary

| Check | Count |
| --- | ---: |
| Total school records | 77 |
| Records with verified official-site images | 51 |
| Records with public-directory images needing review | 19 |
| Records still without reliable images | 7 |

## Schools without images

These records do not have a source-confirmed official website or specific representative public school-photo page in the dataset yet:

- `arna-primary-school`
- `bolashak-primary-school`
- `milestone-school-astana`
- `future-school-astana`
- `pochemuchka-school-astana`
- `academia-primary-school-astana`
- `ingenium-school-astana`

## Public-directory images needing review

These records use public directory pages instead of official school websites, so their `image_status` is `needs_review`:

- `akzhol-primary-school` — 2GIS page
- `zerek-school-astana` — public private-school directory
- `sana-school-astana` — public private-school directory
- `dostar-school-astana` — public private-school directory
- `intellect-school-astana` — public private-school directory
- `smart-bilim-school-astana` — public private-school directory
- `darina-school-astana` — public private-school directory
- `kemel-school-astana` — public private-school directory
- `qadam-school-astana` — public private-school directory
- `shanyraq-school-astana` — public private-school directory
- `meridian-school-astana` — public private-school directory
- `prestige-school-astana` — public private-school directory
- `leader-school-astana` — public private-school directory
- `parasat-school-astana` — public private-school directory
- `samruk-school-astana` — public private-school directory
- `global-school-astana` — public private-school directory
- `abadan-school-astana` — public private-school directory
- `nomad-school-astana` — public private-school directory
- `aqniet-school-astana` — public private-school directory

## Follow-up research targets

- Confirm official websites for the 7 private-school records above.
- Replace public-directory screenshots with official school photos if an official image source becomes available.
- Add explicit `main_image` overrides for any school whose official website screenshot is less representative than an official building or campus photo.
