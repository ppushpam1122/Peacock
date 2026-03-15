import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/catalogLoader';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured'          },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z'          },
];
const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function AllClothingPage({ products, fits, categories }) {
  const [sort,             setSort]             = useState('default');
  const [activeFits,       setActiveFits]       = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeSizes,      setActiveSizes]      = useState([]);
  const [sidebarOpen,      setSidebarOpen]      = useState(false);

  const toggle = (arr, set, val) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        if (activeFits.length       && !activeFits.includes(p.fit))            return false;
        if (activeCategories.length && !activeCategories.includes(p.category)) return false;
        if (activeSizes.length) {
          const ok = p.colors.some((c) => activeSizes.some((sz) => c.sizes?.[sz] === true));
          if (!ok) return false;
        }
        return true;
      })
      .slice()
      .sort((a, b) => {
        if (sort === 'price-asc')  return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'name-asc')   return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, activeFits, activeCategories, activeSizes, sort]);

  const clearAll    = () => { setActiveFits([]); setActiveCategories([]); setActiveSizes([]); };
  const activeCount = activeFits.length + activeCategories.length + activeSizes.length;

  /* ── Sidebar (shared desktop + mobile) ──────────────────── */
  const FilterPanel = () => (
    <div className="bg-white p-5">
      <div className="flex items-center justify-between mb-5 border-b border-neutral-100 pb-4">
        <h2 className="font-display font-black text-sm uppercase tracking-widest">Filter By</h2>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-[10px] font-bold text-hop-red uppercase tracking-wide hover:underline">
            Clear All
          </button>
        )}
      </div>

      {/* Fit */}
      <div className="mb-5">
        <p className="font-bold text-sm text-hop-black mb-3">Fit</p>
        <div className="space-y-2.5">
          {fits.map((fit) => (
            <label key={fit} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFits.includes(fit)}
                onChange={() => toggle(activeFits, setActiveFits, fit)}
                className="filter-checkbox"
              />
              <span className="text-sm text-neutral-700">{fit}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-neutral-100 mb-5" />

      {/* Design / Category */}
      <div className="mb-5">
        <p className="font-bold text-sm text-hop-black mb-3">Category</p>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={activeCategories.includes(cat.value)}
                onChange={() => toggle(activeCategories, setActiveCategories, cat.value)}
                className="filter-checkbox"
              />
              <span className="text-sm text-neutral-700">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-neutral-100 mb-5" />

      {/* Sizes */}
      <div>
        <p className="font-bold text-sm text-hop-black mb-3">Sizes</p>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((sz) => (
            <button
              key={sz}
              onClick={() => toggle(activeSizes, setActiveSizes, sz)}
              className={`w-11 h-11 text-xs font-bold border-2 transition-all ${
                activeSizes.includes(sz)
                  ? 'bg-hop-red text-white border-hop-red'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-hop-black'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Shop All — House of Peacock</title>
        <meta name="description" content="Browse the full HOP collection." />
      </Head>

      <Navbar />

      {/* ── HERO BANNER ──────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#e8e0d8]" style={{ minHeight: '280px' }}>
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\' fill=\'%23000000\' fill-opacity=\'0.4\'/%3E%3C/svg%3E")' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-14 flex items-center justify-between">
          {/* Left: text */}
          <div className="max-w-xs sm:max-w-md z-10">
            <h1 className="font-display font-black text-4xl sm:text-5xl text-hop-black leading-tight mb-4">
              Premium Tees <span className="font-normal italic">for the Bold</span>
            </h1>
            <Link href="/clothing/tshirts" className="btn-red px-7 py-3 inline-flex text-sm">
              Shop Now
            </Link>
          </div>

          {/* Right: decorative — placeholder for model photo */}
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-l from-transparent via-transparent to-[#e8e0d8]" style={{ position: 'absolute', zIndex: 1 }} />
            <div className="w-full h-full flex items-center justify-end pr-8">
              <div className="w-48 h-64 bg-neutral-300/40 flex items-center justify-center text-neutral-400 text-xs">
                Add hero image here
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOP SECTION ─────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top toolbar */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 border-2 border-neutral-200 hover:border-hop-black px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>

          {/* Dropdowns row — matches screenshot */}
          <div className="flex items-center gap-3 ml-auto">
            {fits.length > 0 && (
              <select
                value={activeFits[0] || ''}
                onChange={(e) => setActiveFits(e.target.value ? [e.target.value] : [])}
                className="select-clean font-semibold"
              >
                <option value="">All Fits</option>
                {fits.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            )}
            {categories.length > 0 && (
              <select
                value={activeCategories[0] || ''}
                onChange={(e) => setActiveCategories(e.target.value ? [e.target.value] : [])}
                className="select-clean font-semibold"
              >
                <option value="">All Designs</option>
                {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            )}
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="select-clean">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Mobile filter panel */}
        {sidebarOpen && <div className="lg:hidden mb-6 shadow-card"><FilterPanel /></div>}

        {/* Two-column layout */}
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24 shadow-card">
              <FilterPanel />
            </div>
          </aside>

          {/* Product grid — 3 columns like screenshot */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-500 mb-4">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              {activeCount > 0 && (
                <button onClick={clearAll} className="ml-2 text-hop-red font-bold hover:underline">
                  (clear filters)
                </button>
              )}
            </p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 6} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="text-neutral-400 text-lg mb-4">No products match your filters.</p>
                <button onClick={clearAll} className="btn-red">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const products   = getAllProducts();
  const fits       = [...new Set(products.map((p) => p.fit).filter(Boolean))].sort();
  const categories = [...new Set(products.map((p) => p.category))].map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
  }));
  return { props: { products, fits, categories } };
}
