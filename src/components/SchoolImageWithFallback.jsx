'use client';

import { useEffect, useMemo, useState } from 'react';
import { createSchoolImagePlaceholder } from '../utils/schoolImages.js';

export default function SchoolImageWithFallback({ src, alt, schoolName, className = '', loading = 'lazy', decoding = 'async', size = 'large' }) {
  const fallbackSrc = useMemo(() => createSchoolImagePlaceholder(schoolName || alt, size), [alt, schoolName, size]);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const isFallback = currentSrc === fallbackSrc;
  const dimensions = size === 'card' ? { width: 640, height: 360 } : { width: 1200, height: 800 };

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  return (
    <img
      className={className}
      src={currentSrc}
      alt={isFallback ? schoolName || alt : alt}
      width={dimensions.width}
      height={dimensions.height}
      loading={loading}
      decoding={decoding}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  );
}
