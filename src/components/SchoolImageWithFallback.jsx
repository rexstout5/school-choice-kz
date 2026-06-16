'use client';

import { useMemo, useState } from 'react';
import { createSchoolImagePlaceholder } from '../utils/schoolImages.js';

export default function SchoolImageWithFallback({ src, alt, schoolName, className = '', loading = 'lazy', decoding = 'async', size = 'large' }) {
  const fallbackSrc = useMemo(() => createSchoolImagePlaceholder(schoolName || alt, size), [alt, schoolName, size]);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const isFallback = currentSrc === fallbackSrc;

  return (
    <img
      className={className}
      src={currentSrc}
      alt={isFallback ? schoolName || alt : alt}
      loading={loading}
      decoding={decoding}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  );
}
