/**
 * HopLogo — SVG logo for House of Peacock
 * Can be used at any size via the `size` prop.
 * `variant` = 'full' (icon + HOP + tagline) | 'compact' (icon + HOP only)
 */
export default function HopLogo({ size = 40, variant = 'full', className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Peacock fan icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Fan feathers — red */}
        <path d="M24 36 C24 36 12 28 10 18 C9 12 14 8 18 10 C20 11 21 14 20 17 C19 20 17 22 17 25 C17 28 20 31 24 36Z" fill="#C41E1E" />
        <path d="M24 36 C24 36 8 24 10 14 C11 8 17 6 20 9 C22 11 21 15 19 18 C17 21 15 23 16 27 C17 30 20 33 24 36Z" fill="#A01818" opacity="0.8"/>
        <path d="M24 36 C24 36 36 28 38 18 C39 12 34 8 30 10 C28 11 27 14 28 17 C29 20 31 22 31 25 C31 28 28 31 24 36Z" fill="#C41E1E" />
        <path d="M24 36 C24 36 40 24 38 14 C37 8 31 6 28 9 C26 11 27 15 29 18 C31 21 33 23 32 27 C31 30 28 33 24 36Z" fill="#D93030" opacity="0.85"/>
        {/* Center stem */}
        <path d="M24 36 L24 20" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
        {/* Bottom base */}
        <ellipse cx="24" cy="37" rx="5" ry="2" fill="#111"/>
      </svg>

      {/* Text */}
      <div className="leading-none">
        <div
          className="font-display font-black tracking-[-0.02em] text-hop-black"
          style={{ fontSize: size * 0.7 }}
        >
          HOP
        </div>
        {variant === 'full' && (
          <div
            className="font-display font-semibold tracking-[0.08em] text-hop-black uppercase"
            style={{ fontSize: size * 0.2 }}
          >
            House of Peacock
          </div>
        )}
      </div>
    </div>
  );
}
