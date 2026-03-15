import { isSizeAvailable } from '@/lib/productUtils';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function SizeSelector({ color, selected, onChange, onSizeGuideClick }) {
  if (!color) {
    return (
      <div>
        <p className="text-sm font-bold text-hop-black uppercase tracking-wide mb-3">Size</p>
        <p className="text-sm text-neutral-400 italic">Select a color first</p>
      </div>
    );
  }

  const sortedSizes = Object.keys(color.sizes).sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-hop-black uppercase tracking-wide">Size</span>
        <button
          onClick={onSizeGuideClick}
          className="text-xs font-semibold text-neutral-500 hover:text-hop-red underline underline-offset-2 transition-colors"
        >
          Size Guide
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {sortedSizes.map((size) => {
          const available  = isSizeAvailable(color, size);
          const isSelected = selected === size;

          return (
            <button
              key={size}
              onClick={() => available && onChange(size)}
              disabled={!available}
              aria-pressed={isSelected}
              className={`relative min-w-[48px] h-11 px-3 text-sm font-bold border-2 transition-all duration-150 ${
                isSelected
                  ? 'bg-hop-black text-white border-hop-black'
                  : available
                  ? 'bg-white text-hop-black border-neutral-200 hover:border-hop-black'
                  : 'bg-hop-grey text-neutral-300 border-neutral-100 cursor-not-allowed'
              }`}
            >
              {size}
              {!available && (
                <span className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                  <span className="absolute top-1/2 left-0 right-0 h-px bg-neutral-300 rotate-[20deg] origin-center" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected && !isSizeAvailable(color, selected) && (
        <p className="mt-2 text-xs text-hop-red font-semibold">This size is currently out of stock.</p>
      )}
    </div>
  );
}
