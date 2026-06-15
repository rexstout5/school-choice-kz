# School data audit report

Audit date: 2026-06-15

## Scope

Audited all 77 school records in `src/data/schools.js` for:

- missing addresses
- missing phone numbers
- missing websites
- missing tuition values
- missing localized texts

## Summary

| Check | Missing before fixes | Fixed in this audit | Missing after fixes |
| --- | ---: | ---: | ---: |
| Address | 26 | 2 | 24 |
| Phone number | 30 | 3 | 27 |
| Website | 26 | 0 | 26 |
| Tuition value | 2 | 2 | 0 |
| Localized text | 0 | 0 | 0 |

## Public-source fixes applied

| School | Fields fixed | Source used |
| --- | --- | --- |
| Altyn Orda School | phone | Yandex Maps listing for Altyn Orda School |
| EdVille International School | address, phone, district/source | Official EdVille website contact block |
| Talant School | address, phone, district/source | Yandex Maps listing for Talant School |
| Astana Bilim-Innovation Lyceum for Gifted Boys | tuition set to free/0 and verified | IB public school listing identifies the school as state; existing school source kept |
| Astana Bilim-Innovation Lyceum for Gifted Girls | tuition set to free/0 and verified | Public maps/network sources identify it as a Bilim-Innovation lyceum; existing contact source kept |

## Remaining gaps

### Missing addresses after fixes

The following 24 records still have city-only addresses and need primary-source confirmation before changing:

- `bolashak-primary-school`
- `milestone-school-astana`
- `future-school-astana`
- `pochemuchka-school-astana`
- `academia-primary-school-astana`
- `zerek-school-astana`
- `sana-school-astana`
- `dostar-school-astana`
- `intellect-school-astana`
- `smart-bilim-school-astana`
- `bilimkana-astana-school`
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

### Missing phone numbers after fixes

The following 27 records still need source-confirmed phone numbers:

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
- `bilimkana-astana-school`
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

### Missing websites after fixes

The following 26 records still need source-confirmed websites:

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

### Missing tuition values after fixes

None.

### Missing localized texts after fixes

None. The validation script confirms localized object coverage for school names, school types, languages, descriptions, addresses, admission requirements, class sizes, and programs.

## Notes

- Public schools already have verified registry contact and website data through the Astana public school helpers.
- Remaining private-school gaps were not filled from low-confidence directory snippets unless a direct school, map listing, or authoritative public profile provided a concrete value.
