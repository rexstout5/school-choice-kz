# QA Report

Date: 2026-06-16

## Scope

Final stabilization pass covered the main public flows:

- Homepage / catalog (`/`)
- School detail pages (`/schools/[slug]`)
- Quiz (`/quiz`)
- Compare (`/compare`)
- Favorites (`/favorites`)
- Map (`/map`)
- Reviews (school detail review component)
- Contribute (`/contribute`)
- SEO landing pages (`/best-schools-astana`, `/private-schools-astana`, `/public-schools-astana`, `/how-to-choose-school`, `/school-readiness`)

## Checks performed

- Ran the structured school data validator.
- Ran the production Next.js build to validate static generation and Vercel-compatible build output.
- Smoke-tested main routes against a production server with HTTP status checks.
- Reviewed navigation links used by catalog cards, map popups, empty states, SEO pages, and contribution flows.
- Reviewed translation strings on the main catalog and map pages.
- Reviewed image fallback handling for catalog cards and school detail galleries.
- Reviewed responsive CSS breakpoints for catalog grids, detail pages, map layout, forms, and comparison UI.

## Fixes made

- Fixed map popup and map sidebar school links to use the canonical school slug fallback helper instead of raw IDs, preventing broken links when a school has a slug.
- Localized the map "schools without coordinates" fallback heading in Russian and Kazakh.
- Localized the catalog "Add school" navigation label in Russian and Kazakh.

## Result

The app passes data validation and production build. All tested main routes return successful HTTP responses in production mode. Existing image components provide generated placeholders when a school image is missing or fails to load, and the reviewed pages include empty or fallback states for no results, no favorites, no comparison selections, missing coordinates, missing values, and no reviews.

## Follow-ups

- Browser automation with real viewport screenshots would provide stronger mobile regression coverage if Playwright or another browser test runner is added to the project.
- Map tiles and Leaflet assets are loaded from third-party CDNs at runtime, so production availability still depends on those external resources.
