import { isColorInStock } from '@/lib/productUtils';

export default function ColorSelector({ colors, selected, onChange }) {
  return (
    <div>
      <p className="text-sm font-bold text-hop-black uppercase tracking-wide mb-3">Color</p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const inStock  = isColorInStock(color);
          const isSelected = selected?.name === color.name;
          const isLight = ['#ffffff','#f8f8f6','#f5f5f0','#ece8e0','#e8c4c4','#d4c5a9','#c9b99a'].includes(color.hex.toLowerCase());

          return (
            <button
              key={color.name}
              onClick={() => inStock && onChange(color)}
              disabled={!inStock}
              title={`${color.name}${!inStock ? ' – Out of stock' : ''}`}
              aria-pressed={isSelected}
              className={`flex items-center gap-2 px-3 py-1.5 border-2 transition-all duration-150 ${
                isSelected
                  ? 'border-hop-black'
                  : 'border-transparent hover:border-neutral-300'
              } ${!inStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Swatch circle */}
              <span
                className={`w-5 h-5 rounded-full flex-shrink-0 ${isLight ? 'border border-neutral-300' : ''}`}
                style={{ backgroundColor: color.hex }}
              />
              {/* Name */}
              <span className={`text-xs font-semibold ${isSelected ? 'text-hop-black' : 'text-neutral-600'}`}>
                {color.name}
              </span>
              {/* OOS slash */}
              {!inStock && (
                <span className="text-[10px] text-neutral-400">(OOS)</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
