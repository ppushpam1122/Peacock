import { useState } from 'react';
import Image from 'next/image';
import { getGalleryImages } from '@/lib/productUtils';

export default function ProductGallery({ product }) {
  const images = getGalleryImages(product);
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
      {/* Thumbnail strip (left on desktop, bottom on mobile) */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:overflow-y-auto md:max-h-[600px] pb-1 md:pb-0 md:w-20 flex-shrink-0 scrollbar-hide">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`relative flex-shrink-0 w-16 h-20 md:w-20 md:h-24 border-2 transition-all duration-150 overflow-hidden ${
              activeIdx === i
                ? 'border-neutral-900'
                : 'border-transparent hover:border-neutral-300'
            }`}
          >
            <Image
              src={src}
              alt={`${product.name} view ${i + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative">
        <div
          className={`relative w-full aspect-[3/4] bg-neutral-100 overflow-hidden cursor-zoom-in transition-transform duration-300 ${
            zoomed ? 'scale-105' : ''
          }`}
          onClick={() => setZoomed(!zoomed)}
        >
          <Image
            key={images[activeIdx]}
            src={images[activeIdx]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover animate-fade-in"
          />

          {/* Navigation arrows (if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all"
                aria-label="Next image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 font-medium">
              {activeIdx + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeIdx === i ? 'bg-neutral-900 w-4' : 'bg-neutral-300'
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
