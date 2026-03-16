import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * ImageLightbox
 * - Portal renders above everything (z: max)
 * - Frosted glass backdrop
 * - Controls live NEXT TO the image, not at viewport edges
 * - Mouse wheel: scroll up = zoom in (max 2×), scroll down = zoom out (min 1×)
 * - Touch: swipe to navigate, pinch to zoom
 */
function LightboxContent({ images, initialIndex, onClose }) {
  const [index,  setIndex]  = useState(initialIndex);
  const [scale,  setScale]  = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const touchStartRef = useRef(null);
  const pinchDistRef  = useRef(null);
  const pinchScaleRef = useRef(1);
  const offsetRef     = useRef({ x: 0, y: 0 });
  const isDragRef     = useRef(false);
  const dragStartRef  = useRef({ x: 0, y: 0 });
  const scaleRef      = useRef(1); // mirror of scale for wheel handler

  const MIN_SCALE = 1;
  const MAX_SCALE = 2;

  const resetZoom = useCallback(() => {
    setScale(MIN_SCALE);
    setOffset({ x: 0, y: 0 });
    offsetRef.current = { x: 0, y: 0 };
    scaleRef.current  = MIN_SCALE;
  }, []);

  const goTo = useCallback((i) => {
    const n = ((i % images.length) + images.length) % images.length;
    setIndex(n);
    resetZoom();
  }, [images.length, resetZoom]);

  // Keyboard nav
  useEffect(() => {
    const saved = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = saved;
    };
  }, [index, goTo, onClose]);

  // Mouse wheel zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const step  = 0.15;
    const curr  = scaleRef.current;
    const next  = delta > 0
      ? Math.min(MAX_SCALE, curr + step)
      : Math.max(MIN_SCALE, curr - step);

    scaleRef.current = next;
    setScale(next);
    if (next <= MIN_SCALE) {
      offsetRef.current = { x: 0, y: 0 };
      setOffset({ x: 0, y: 0 });
    }
  }, []);

  // Touch: swipe + pinch
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isDragRef.current = scaleRef.current > 1;
      dragStartRef.current = {
        x: e.touches[0].clientX - offsetRef.current.x,
        y: e.touches[0].clientY - offsetRef.current.y,
      };
    } else if (e.touches.length === 2) {
      pinchDistRef.current  = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchScaleRef.current = scaleRef.current;
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchDistRef.current) {
      const d  = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchScaleRef.current * (d / pinchDistRef.current)));
      scaleRef.current = ns;
      setScale(ns);
      if (ns <= MIN_SCALE) { offsetRef.current = { x:0,y:0 }; setOffset({ x:0,y:0 }); }
    } else if (e.touches.length === 1 && scaleRef.current > 1 && isDragRef.current) {
      const nx = e.touches[0].clientX - dragStartRef.current.x;
      const ny = e.touches[0].clientY - dragStartRef.current.y;
      offsetRef.current = { x:nx, y:ny };
      setOffset({ x:nx, y:ny });
    }
  };

  const onTouchEnd = (e) => {
    pinchDistRef.current = null;
    if (e.changedTouches.length === 1 && touchStartRef.current && scaleRef.current === 1) {
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);
      if (Math.abs(dx) > 50 && dy < 80) dx < 0 ? goTo(index + 1) : goTo(index - 1);
    }
    touchStartRef.current = null;
    isDragRef.current = false;
  };

  const btn = (extra = {}) => ({
    width: 40, height: 40, cursor: 'pointer', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(255,255,255,0.18)',
    border: '1.5px solid rgba(255,255,255,0.35)',
    borderRadius: 0,
    ...extra,
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2147483647,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Frosted backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.22)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />

      {/*
        ── Main panel — constrained size, centred
        Everything lives inside this panel so controls are near the image.
      */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          width: '90vw', maxWidth: 900,
          height: '90vh', maxHeight: 900,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top bar: counter (left) + close (right) ── */}
        <div style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 0 10px',
          flexShrink: 0,
        }}>
          <span style={{ color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:600, textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>
            {index + 1} / {images.length}
          </span>
          <button onClick={onClose} aria-label="Close" style={btn()}>
            <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Middle row: left-arrow + image + right-arrow ── */}
        <div style={{
          flex: 1, minHeight: 0,
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {/* Left arrow */}
          {images.length > 1 ? (
            <button onClick={() => goTo(index - 1)} aria-label="Previous" style={btn({ flexShrink: 0 })}>
              <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : <div style={{ width: 0 }} />}

          {/* Image container */}
          <div
            style={{
              flex: 1, minWidth: 0, height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              touchAction: 'none', userSelect: 'none',
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onWheel={onWheel}
          >
            <img
              src={images[index]}
              alt={`Image ${index + 1}`}
              draggable={false}
              style={{
                maxWidth: '100%', maxHeight: '100%',
                objectFit: 'contain', display: 'block',
                width: 'auto', height: 'auto',
                transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
                transition: isDragRef.current ? 'none' : 'transform 0.2s ease',
                cursor: scale > 1 ? 'grab' : (scale < MAX_SCALE ? 'zoom-in' : 'zoom-out'),
                boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* Right arrow */}
          {images.length > 1 ? (
            <button onClick={() => goTo(index + 1)} aria-label="Next" style={btn({ flexShrink: 0 })}>
              <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : <div style={{ width: 0 }} />}
        </div>

        {/* ── Bottom: dot indicators ── */}
        {images.length > 1 && (
          <div style={{ display:'flex', gap:8, paddingTop:10, flexShrink:0 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Image ${i + 1}`}
                style={{
                  height: 6, width: i === index ? 20 : 6,
                  borderRadius: 3, padding: 0, border: 'none', cursor: 'pointer',
                  background: i === index ? '#fff' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        )}

        {/* Zoom hint */}
        <div style={{ paddingTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
          Scroll to zoom · Swipe to navigate
        </div>
      </div>
    </div>
  );
}

export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(
    <LightboxContent images={images} initialIndex={initialIndex} onClose={onClose} />,
    document.body
  );
}
