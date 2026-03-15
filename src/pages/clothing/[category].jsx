import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllProducts } from '@/lib/catalogLoader';
import taxonomy from '@/data/taxonomy.json';

const SORT_OPTIONS = [
  { value: 'default',     label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
];

/** Walk taxonomy tree to find a node by id/slug */
function findNode(nodes, idOrSlug) {
  for (const node of nodes) {
    if (node.id === idOrSlug || node.slug === idOrSlug) return node;
    if (node.children) {
      const found = findNode(node.children, idOrSlug);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Collects all leaf-level category IDs under a taxonomy node.
 * A leaf is a node with no children (i.e. has a catalogFile).
 * For tshirts/shirts this returns ['tshirts'] / ['shirts'].
 * For casual this returns ['tshirts'].
 * For formal this returns ['shirts'].
 * For clothing this returns ['tshirts', 'shirts'].
 */
function collectLeafIds(node) {
  if (!node.children || node.children.length === 0) {
    return [node.id];
  }
  return node.children.flatMap((child) => collectLeafIds(child));
}

/**
 * Collects ALL taxonomy node slugs recursively for getStaticPaths.
 * This ensures every node in the tree gets a generated page.
 */
function collectAllSlugs(nodes) {
  return nodes.flatMap((node) => {
    const self = node.slug;
    const children = node.children ? collectAllSlugs(node.children) : [];
    return [self, ...children];
  });
}

/** Build breadcrumb chain for a category node */
function buildCategoryBreadcrumb(categoryId) {
  const crumbs = [
    { label: 'Home',     href: '/' },
    { label: 'Clothing', href: '/clothing' },
  ];

  function walk(nodes, chain) {
    for (const node of nodes) {
      const current = [...chain, node];
      if (node.id === categoryId) return current;
      if (node.children) {
        const found = walk(node.children, current);
        if (found) return found;
      }
    }
    return null;
  }

  const chain = walk(taxonomy.categories, []);
  if (chain) {
    chain.forEach((n) => {
      if (!crumbs.find((c) => c.label === n.label)) {
        crumbs.push({ label: n.label, href: `/clothing/${n.slug}` });
      }
    });
  }
  return crumbs;
}

export default function CategoryPage({ category, products, categoryNode, isIntermediate }) {
  const [sort, setSort] = useState('default');

  const sorted = products.slice().sort((a, b) => {
    if (sort === 'price-asc')  return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name-asc')   return a.name.localeCompare(b.name);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const crumbs      = buildCategoryBreadcrumb(category);
  const displayName = categoryNode?.label ?? category;

  return (
    <>
      <Head>
        <title>{displayName} — House of Peacock</title>
        <meta
          name="description"
          content={`Shop our ${displayName} collection — premium quality clothing.`}
        />
      </Head>

      <Navbar />

      <main>
        {/* Header */}
        <div className="bg-white border-b border-neutral-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb crumbs={crumbs} />
            <h1 className="display-heading text-3xl sm:text-4xl mt-3">{displayName}</h1>
            <p className="text-neutral-500 text-sm mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''}
              {isIntermediate && (
                <span className="ml-1 text-neutral-400">across all {displayName.toLowerCase()} styles</span>
              )}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Sub-category pills for intermediate nodes */}
          {isIntermediate && categoryNode?.children?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 self-center mr-1">
                Filter:
              </span>
              {categoryNode.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/clothing/${child.slug}`}
                  className="chip"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}

          {/* Sort bar */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/clothing"
              className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              ← All Clothing
            </Link>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select-clean"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Grid */}
          {sorted.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {sorted.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-neutral-400 text-lg">No products in this category yet.</p>
              <Link href="/clothing" className="btn-outline-black mt-4 inline-block">
                Browse All
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  // Generate pages for EVERY taxonomy node, not just leaf catalog categories.
  // This means /clothing/casual and /clothing/formal get pages too.
  const slugs = collectAllSlugs(taxonomy.categories);
  // Deduplicate in case taxonomy has any duplicate slugs
  const unique = [...new Set(slugs)];

  return {
    paths: unique.map((slug) => ({ params: { category: slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { category } = params;
  const allProducts = getAllProducts();
  const categoryNode = findNode(taxonomy.categories, category) ?? null;

  // For intermediate nodes (like 'casual', 'formal'), collect products from
  // all descendant leaf categories. For leaf nodes, filter directly.
  const isIntermediate = !!(categoryNode?.children?.length);

  let products;
  if (isIntermediate && categoryNode) {
    const leafIds = collectLeafIds(categoryNode);
    products = allProducts.filter((p) => leafIds.includes(p.category));
  } else {
    products = allProducts.filter((p) => p.category === category);
  }

  return {
    props: {
      category,
      products,
      categoryNode,
      isIntermediate,
    },
  };
}
