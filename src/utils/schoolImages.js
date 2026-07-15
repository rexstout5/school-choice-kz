const escapeSvgText = (value) => String(value ?? '').replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);

export const schoolPlaceholderImages = {
  public: '/images/placeholders/public-school.svg',
  private: '/images/placeholders/private-school.svg',
  international: '/images/placeholders/international-school.svg',
  stem: '/images/placeholders/stem-school.svg'
};

const getLocalizedText = (value) => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return [value.en, value.ru, value.kk].filter(Boolean).join(' ');
  return '';
};

const getSearchableSchoolText = (school) => [
  school?.type,
  getLocalizedText(school?.school_type),
  getLocalizedText(school?.name),
  ...(Array.isArray(school?.programs) ? school.programs : []),
  ...(Array.isArray(school?.academics?.programs) ? school.academics.programs : [])
].map(getLocalizedText).join(' ').toLowerCase();

export const getSchoolPlaceholderType = (school) => {
  const searchableText = getSearchableSchoolText(school);

  if (searchableText.includes('stem') || searchableText.includes('science') || searchableText.includes('mathematics') || searchableText.includes('робот')) {
    return 'stem';
  }

  if (school?.type === 'international' || searchableText.includes('international') || searchableText.includes('халықаралық') || searchableText.includes('международ')) {
    return 'international';
  }

  if (school?.type === 'private' || searchableText.includes('private') || searchableText.includes('частн') || searchableText.includes('жеке')) {
    return 'private';
  }

  return 'public';
};

export const getSchoolPlaceholderImage = (school) => createSchoolImagePlaceholder(getLocalizedText(school?.name) || 'BilimChoice', 'card');

const getImageSrc = (image) => {
  if (typeof image === 'string') return image;
  if (image && typeof image === 'object') return image.src ?? image.url ?? '';
  return '';
};

export const getSchoolCoverImage = (school) => {
  const candidates = [
    getImageSrc(school?.cover_image),
    getImageSrc(Array.isArray(school?.images) ? school.images[0] : null),
    getImageSrc(school?.main_image_url),
    getImageSrc(school?.main_image),
    getImageSrc(Array.isArray(school?.gallery_images) ? school.gallery_images[0] : null),
    getImageSrc(Array.isArray(school?.gallery) ? school.gallery[0] : null)
  ];

  return candidates.find(isUsableImageUrl) || getSchoolPlaceholderImage(school);
};

export const createSchoolImagePlaceholder = (schoolName, size = 'large') => {
  const safeLabel = schoolName || 'BilimChoice school image placeholder';
  const viewBox = size === 'card' ? '0 0 640 360' : '0 0 1200 800';
  const logoX = size === 'card' ? 38 : 70;
  const logoY = size === 'card' ? 42 : 76;
  const logoSize = size === 'card' ? 28 : 48;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${escapeSvgText(safeLabel)}"><rect width="100%" height="100%" fill="#EAF3FA"/><circle cx="78%" cy="18%" r="22%" fill="#DDEFE7"/><circle cx="14%" cy="88%" r="28%" fill="#FFF9F4"/><path d="M120 265C210 190 300 190 390 265S570 340 660 265 840 190 930 265" fill="none" stroke="#17324D" stroke-width="7" stroke-linecap="round" opacity=".16" transform="${size === 'card' ? 'scale(.62) translate(18 -24)' : 'scale(1.08) translate(28 60)'}"/><path d="M160 120h220M160 185h340M160 250h280" fill="none" stroke="#E9684A" stroke-width="8" stroke-linecap="round" opacity=".28" transform="${size === 'card' ? 'scale(.72) translate(260 40)' : 'scale(1.35) translate(430 130)'}"/><g transform="translate(${logoX} ${logoY})"><rect width="${logoSize}" height="${logoSize}" rx="12" fill="#17324D"/><path d="M${logoSize * 0.28} ${logoSize * 0.58}l${logoSize * 0.16} ${logoSize * 0.16} ${logoSize * 0.3}-${logoSize * 0.36}" fill="none" stroke="#fff" stroke-width="${Math.max(3, logoSize * 0.09)}" stroke-linecap="round" stroke-linejoin="round"/></g><text x="${logoX + logoSize + 14}" y="${logoY + logoSize * 0.66}" font-family="Manrope,Arial,sans-serif" font-size="${size === 'card' ? 24 : 42}" font-weight="700" fill="#17324D">BilimChoice</text></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const isUsableImageUrl = (value) => typeof value === 'string' && value.trim().length > 0;

export const normalizeImageRecord = (image) => {
  if (!image || typeof image !== 'object' || Array.isArray(image) || !isUsableImageUrl(image.src)) {
    return null;
  }

  return image;
};
