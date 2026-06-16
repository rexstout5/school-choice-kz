const escapeSvgText = (value) => String(value ?? '').replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);

export const createSchoolImagePlaceholder = (schoolName, size = 'large') => {
  const safeSchoolName = schoolName || 'School image placeholder';
  const viewBox = size === 'card' ? '0 0 320 220' : '0 0 1200 800';
  const textY = size === 'card' ? 205 : 735;
  const fontSize = size === 'card' ? 16 : 42;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${escapeSvgText(safeSchoolName)}"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#e9f4ff"/><stop offset="1" stop-color="#dff8ef"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><path d="M50 178h220V94L160 42 50 94z" transform="${size === 'card' ? '' : 'scale(3.75) translate(0 10)'}" fill="#0a7c8f"/><path d="M75 178v-68h170v68z" transform="${size === 'card' ? '' : 'scale(3.75) translate(0 10)'}" fill="#fff" opacity=".94"/><rect x="138" y="134" width="44" height="44" rx="8" transform="${size === 'card' ? '' : 'scale(3.75) translate(0 10)'}" fill="#12365d"/><text x="50%" y="${textY}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="${fontSize}" font-weight="800" fill="#12365d">${escapeSvgText(safeSchoolName)}</text></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const isUsableImageUrl = (value) => typeof value === 'string' && value.trim().length > 0;

export const normalizeImageRecord = (image) => {
  if (!image || typeof image !== 'object' || Array.isArray(image) || !isUsableImageUrl(image.src)) {
    return null;
  }

  return image;
};
