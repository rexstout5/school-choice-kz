# School image audit report

Updated: 2026-06-16

## Current policy

- School images must be stable direct image URLs ending in `.jpg`, `.jpeg`, `.png`, or `.webp`.
- Screenshot services, including Thum.io URLs, are not accepted because they can render unreliably in image blocks.
- When a stable direct image is not available, the application renders a generated school placeholder instead of a broken image icon.
- `image_source` remains visible on school detail pages when a source exists.

## Audit result

All school records in `src/data/schools.js` were audited by the validation script. The previous generated Thum.io screenshot URLs were removed from data generation, so records without stable direct image files are marked `image_status: 'missing'` and use placeholders.

## Validation

`npm test` validates that any populated `main_image_url`, `main_image.src`, or `gallery_images[].src` is a direct `jpg`, `jpeg`, `png`, or `webp` URL and is not served by Thum.io. Images are not allowed to be marked `verified` until direct image reachability has been audited.
