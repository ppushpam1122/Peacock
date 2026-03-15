import { useEffect } from 'react';

const SIZE_DATA = [
  { size: 'XS', chest: '34–35', waist: '27–28', length: '27', us: 'XS', uk: '6–8' },
  { size: 'S',  chest: '36–37', waist: '29–30', length: '28', us: 'S',  uk: '8–10' },
  { size: 'M',  chest: '38–40', waist: '31–33', length: '29', us: 'M',  uk: '10–12' },
  { size: 'L',  chest: '41–43', waist: '34–36', length: '30', us: 'L',  uk: '12–14' },
  { size: 'XL', chest: '44–46', waist: '37–39', length: '31', us: 'XL', uk: '14–16' },
  { size: 'XXL',chest: '47–49', waist: '40–42', length: '32', us: 'XXL',uk: '16–18' },
];

export default function SizeGuideModal({ onClose }) {
  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 py-6 sm:px-10 md:px-16 lg:px-24">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-white w-full max-w-xl mx-auto max-h-[88vh] overflow-y-auto animate-slide-up shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 sticky top-0 bg-white z-10">
          <div>
            <p className="section-label mb-0.5">Reference Guide</p>
            <h2 className="display-heading text-2xl">Size Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {/* How to measure */}
          <div className="bg-neutral-50 border border-neutral-100 p-4 mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
              How to Measure
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-neutral-600">
              <div className="flex gap-2.5">
                <span className="text-hop-red font-bold flex-shrink-0">①</span>
                <p><strong className="text-neutral-800">Chest</strong> — Measure around the fullest part of your chest, keeping the tape horizontal.</p>
              </div>
              <div className="flex gap-2.5">
                <span className="text-hop-red font-bold flex-shrink-0">②</span>
                <p><strong className="text-neutral-800">Waist</strong> — Measure around your natural waistline, keeping the tape comfortably loose.</p>
              </div>
              <div className="flex gap-2.5">
                <span className="text-hop-red font-bold flex-shrink-0">③</span>
                <p><strong className="text-neutral-800">Length</strong> — Measure from the top of the shoulder down to the hem.</p>
              </div>
            </div>
          </div>

          {/* Size table */}
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
            All measurements in inches
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] sm:text-sm border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white">
                  {['Size', 'Chest', 'Waist', 'Length', 'US', 'UK'].map((h) => (
                    <th key={h} className="px-2 py-2.5 sm:px-4 sm:py-3 text-left text-[9px] sm:text-xs font-semibold tracking-widest uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_DATA.map((row, i) => (
                  <tr
                    key={row.size}
                    className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}
                  >
                    <td className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-neutral-900">{row.size}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-neutral-600 whitespace-nowrap">{row.chest}"</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-neutral-600 whitespace-nowrap">{row.waist}"</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-neutral-600 whitespace-nowrap">{row.length}"</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-neutral-600">{row.us}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-neutral-600">{row.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fit tip */}
          <p className="mt-5 text-xs text-neutral-400 leading-relaxed">
            <strong className="text-neutral-600">Tip:</strong> If you are between sizes, we recommend sizing up for a more relaxed fit or sizing down for a fitted look.
            All Peacock garments are pre-washed to minimise shrinkage.
          </p>
        </div>
      </div>
    </div>
  );
}
