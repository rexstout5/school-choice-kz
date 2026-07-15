'use client';

import { useEffect, useMemo, useState } from 'react';
import { createSchoolImagePlaceholder } from '../utils/schoolImages.js';
import SchoolImagePlaceholder from './SchoolImagePlaceholder.jsx';

export default function SchoolImageWithFallback({ src, alt, schoolName, className = '', loading = 'lazy', decoding = 'async', size = 'large', fallbackSrc: providedFallbackSrc }) {
  const generatedFallbackSrc = useMemo(() => createSchoolImagePlaceholder(schoolName || alt, size), [alt, schoolName, size]);
  const fallbackSrc = providedFallbackSrc || generatedFallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const isFallback = currentSrc === fallbackSrc || currentSrc === generatedFallbackSrc;
  const dimensions = size === 'card' ? { width: 640, height: 360 } : { width: 1200, height: 800 };

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  if (isFallback) {
    return <SchoolImagePlaceholder className={className} schoolName={schoolName || alt} size={size} />;
  }

  return (
    <img
      className={className}
      src={currentSrc}
      alt={isFallback ? schoolName || alt : alt}
      width={dimensions.width}
      height={dimensions.height}
      loading={loading}
      decoding={decoding}
      onError={() => setCurrentSrc(currentSrc === fallbackSrc ? generatedFallbackSrc : fallbackSrc)}
    />
  );
}
