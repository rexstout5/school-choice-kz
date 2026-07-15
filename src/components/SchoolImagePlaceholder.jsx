import { createSchoolImagePlaceholder } from '../utils/schoolImages.js';

export default function SchoolImagePlaceholder({ schoolName = 'BilimChoice', size = 'card', className = '' }) {
  return (
    <img
      className={className}
      src={createSchoolImagePlaceholder(schoolName, size)}
      alt=""
      aria-hidden="true"
      width={size === 'card' ? 640 : 1200}
      height={size === 'card' ? 360 : 800}
      loading="lazy"
      decoding="async"
    />
  );
}
