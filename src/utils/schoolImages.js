const escapeSvgText = (value) => String(value ?? '').replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);

export const schoolPlaceholderImages = {
  public: '/images/placeholders/public-school.jpg',
  private: '/images/placeholders/private-school.jpg',
  international: '/images/placeholders/international-school.jpg',
  stem: '/images/placeholders/stem-school.jpg'
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

export const getSchoolPlaceholderImage = (school) => schoolPlaceholderImages[getSchoolPlaceholderType(school)] ?? schoolPlaceholderImages.public;

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
  const safeSchoolName = schoolName || 'School image placeholder';
  const viewBox = size === 'card' ? '0 0 640 360' : '0 0 1200 800';
  const textY = size === 'card' ? 318 : 735;
  const fontSize = size === 'card' ? 26 : 42;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${escapeSvgText(safeSchoolName)}"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f6fbfa"/><stop offset="1" stop-color="#fff4d8"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><path d="M50 178h220V94L160 42 50 94z" transform="${size === 'card' ? 'scale(1.65) translate(34 -2)' : 'scale(3.75) translate(0 10)'}" fill="#0b7f86"/><path d="M75 178v-68h170v68z" transform="${size === 'card' ? 'scale(1.65) translate(34 -2)' : 'scale(3.75) translate(0 10)'}" fill="#fff" opacity=".94"/><rect x="138" y="134" width="44" height="44" rx="8" transform="${size === 'card' ? 'scale(1.65) translate(34 -2)' : 'scale(3.75) translate(0 10)'}" fill="#0b2f35"/><text x="50%" y="${textY}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="${fontSize}" font-weight="800" fill="#0b2f35">${escapeSvgText(safeSchoolName)}</text></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const isUsableImageUrl = (value) => typeof value === 'string' && value.trim().length > 0;

export const normalizeImageRecord = (image) => {
  if (!image || typeof image !== 'object' || Array.isArray(image) || !isUsableImageUrl(image.src)) {
    return null;
  }

  return image;
};
