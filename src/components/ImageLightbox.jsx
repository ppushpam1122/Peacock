import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * ImageLightbox — renders via React Portal directly into document.body
 * so it's always above ALL other page content regardless of DOM order.
 * Frosted glass backdrop (20% black + blur).
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

  const goTo = useCallback((i) => {
    const n = ((i % images.length) + images.length) % images.length;
    setIndex(n);
    setScale(1);
    setOffset({ x: 0, y: 0 });
    offsetRef.current = { x: 0, y: 0 };
  }, [images.length]);

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

  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isDragRef.current = scale > 1;
      dragStartRef.current = {
        x: e.touches[0].clientX - offsetRef.current.x,
        y: e.touches[0].clientY - offsetRef.current.y,
      };
    } else if (e.touches.length === 2) {
      pinchDistRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchScaleRef.current = scale;
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchDistRef.current) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const ns = Math.min(1.5, Math.max(1, pinchScaleRef.current * (d / pinchDistRef.current)));
      setScale(ns);
      if (ns <= 1) { offsetRef.current = { x:0,y:0 }; setOffset({ x:0,y:0 }); }
    } else if (e.touches.length === 1 && scale > 1 && isDragRef.current) {
      const nx = e.touches[0].clientX - dragStartRef.current.x;
      const ny = e.touches[0].clientY - dragStartRef.current.y;
      offsetRef.current = { x: nx, y: ny };
      setOffset({ x: nx, y: ny });
    }
  };

  const onTouchEnd = (e) => {
    pinchDistRef.current = null;
    if (e.changedTouches.length === 1 && touchStartRef.current && scale === 1) {
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);
      if (Math.abs(dx) > 50 && dy < 80) dx < 0 ? goTo(index+1) : goTo(index-1);
    }
    touchStartRef.current = null;
    isDragRef.current = false;
  };

  const S = {
    root: {
      position: 'fixed', inset: 0, zIndex: 2147483647, /* max z-index */
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    backdrop: {
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.22)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    },
    close: {
      position: 'absolute', top: 14, right: 14, zIndex: 2,
      width: 44, height: 44, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.2)',
      border: '1.5px solid rgba(255,255,255,0.4)',
    },
    counter: {
      position: 'absolute', top: 20, left: 18, zIndex: 2,
      color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600,
      textShadow: '0 1px 4px rgba(0,0,0,0.6)',
    },
    imageWrap: {
      position: 'relative', zIndex: 1,
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '64px 56px',
      touchAction: 'none',
      userSelect: 'none',
    },
    img: (sc, off) => ({
      maxWidth: '100%', maxHeight: '100%',
      objectFit: 'contain', display: 'block',
      width: 'auto', height: 'auto',
      transform: `scale(${sc}) translate(${off.x/sc}px,${off.y/sc}px)`,
      transition: 'transform 0.2s ease',
      cursor: sc > 1 ? 'grab' : 'zoom-in',
      boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
    }),
    arrowL: { position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', zIndex:2, width:44, height:44, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.3)' },
    arrowR: { position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', zIndex:2, width:44, height:44, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.3)' },
    dots: { position:'absolute', bottom:14, left:0, right:0, zIndex:2, display:'flex', justifyContent:'center', gap:8 },
  };

  return (
    <div style={S.root}>
      {/* Backdrop — click to close */}
      <div style={S.backdrop} onClick={onClose} />

      {/* Close */}
      <button onClick={onClose} aria-label="Close" style={S.close}>
        <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div style={S.counter}>{index + 1} / {images.length}</div>

      {/* Image */}
      <div
        style={S.imageWrap}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onClose}
      >
        <img
          src={images[index]}
          alt={`Image ${index + 1}`}
          draggable={false}
          onClick={(e) => e.stopPropagation()}
          style={S.img(scale, offset)}
        />
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button onClick={() => goTo(index-1)} aria-label="Previous" style={S.arrowL}>
            <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => goTo(index+1)} aria-label="Next" style={S.arrowR}>
            <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div style={S.dots}>
            {images.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Image ${i+1}`}
                style={{ height:6, width: i===index?20:6, borderRadius:3, padding:0, border:'none', cursor:'pointer',
                  background: i===index ? '#fff' : 'rgba(255,255,255,0.4)', transition:'all 0.2s' }} />
            ))}
          </div>
        </>
      )}
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

