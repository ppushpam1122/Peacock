import { useEffect } from 'react';

const SIZE_DATA = [
  { size: 'XS',  chest: '34–35', waist: '27–28', length: '27', us: 'XS',  uk: '6–8'   },
  { size: 'S',   chest: '36–37', waist: '29–30', length: '28', us: 'S',   uk: '8–10'  },
  { size: 'M',   chest: '38–40', waist: '31–33', length: '29', us: 'M',   uk: '10–12' },
  { size: 'L',   chest: '41–43', waist: '34–36', length: '30', us: 'L',   uk: '12–14' },
  { size: 'XL',  chest: '44–46', waist: '37–39', length: '31', us: 'XL',  uk: '14–16' },
  { size: 'XXL', chest: '47–49', waist: '40–42', length: '32', us: 'XXL', uk: '16–18' },
];

export default function SizeGuideModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    /* Full-screen fixed overlay — always on top, always scroll-locked */
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      onClick={onClose}   /* click backdrop to close */
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel — stop propagation so clicks inside don't close */}
      <div
        className="relative bg-white w-full max-w-lg max-h-[90vh] flex flex-col shadow-modal animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
          <div>
            <p className="section-label mb-0.5">Reference Guide</p>
            <h2 className="font-display font-black text-xl">Size Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-hop-black hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-4">
          {/* Measurement note */}
          <div className="bg-hop-grey rounded px-4 py-3 mb-4 text-sm text-neutral-600">
            All measurements in <strong>inches</strong>. For best fit, measure over a fitted shirt.
          </div>

          {/* Size table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-hop-black text-white">
                  {['Size','Chest','Waist','Length','US','UK'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-bold tracking-wider uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_DATA.map((row, i) => (
                  <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="px-3 py-2.5 font-bold text-hop-black">{row.size}</td>
                    <td className="px-3 py-2.5 text-neutral-600 whitespace-nowrap">{row.chest}"</td>
                    <td className="px-3 py-2.5 text-neutral-600 whitespace-nowrap">{row.waist}"</td>
                    <td className="px-3 py-2.5 text-neutral-600 whitespace-nowrap">{row.length}"</td>
                    <td className="px-3 py-2.5 text-neutral-600">{row.us}</td>
                    <td className="px-3 py-2.5 text-neutral-600 whitespace-nowrap">{row.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tips */}
          <div className="mt-4 space-y-1.5 text-xs text-neutral-500">
            <p>• <strong>Chest:</strong> Measure around the fullest part of your chest.</p>
            <p>• <strong>Waist:</strong> Measure around the narrowest part of your torso.</p>
            <p>• <strong>Length:</strong> Measured from shoulder seam to hem.</p>
            <p>• Between sizes? We recommend sizing up for a relaxed fit.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-neutral-100 px-6 py-4">
          <button onClick={onClose} className="btn-black w-full py-3 text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
