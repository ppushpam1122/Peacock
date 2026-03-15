/**
 * catalogLoader.js
 * Loads and merges all product catalogs from data/catalog/*.json
 * All catalog data is imported statically for Next.js static generation support.
 */

import tshirts from '@/data/catalog/tshirts.json';
import shirts  from '@/data/catalog/shirts.json';

/** Map of catalogFile key → imported data */
const CATALOG_MAP = {
  tshirts,
  shirts,
};

/**
 * Returns all products from a specific catalog file.
 * @param {string} catalogFile - Key matching a file in CATALOG_MAP
 * @returns {Array} Array of product objects
 */
export function getCatalog(catalogFile) {
  return CATALOG_MAP[catalogFile] ?? [];
}

/**
 * Returns all products across every catalog, merged into a flat array.
 * @returns {Array} All products
 */
export function getAllProducts() {
  return Object.values(CATALOG_MAP).flat();
}

/**
 * Finds a single product by its slug across all catalogs.
 * @param {string} slug
 * @returns {Object|null}
 */
export function getProductBySlug(slug) {
  return getAllProducts().find((p) => p.slug === slug) ?? null;
}

/**
 * Finds a single product by its ID across all catalogs.
 * @param {string} id
 * @returns {Object|null}
 */
export function getProductById(id) {
  return getAllProducts().find((p) => p.id === id) ?? null;
}

/**
 * Returns all products belonging to a specific category slug.
 * @param {string} category
 * @returns {Array}
 */
export function getProductsByCategory(category) {
  return getAllProducts().filter((p) => p.category === category);
}

/**
 * Returns all featured products across every catalog.
 * @returns {Array}
 */
export function getFeaturedProducts() {
  return getAllProducts().filter((p) => p.featured === true);
}

/**
 * Returns all unique category slugs present in the catalogs.
 * @returns {string[]}
 */
export function getAllCategories() {
  const all = getAllProducts().map((p) => p.category);
  return [...new Set(all)];
}

/**
 * Returns all product slugs (used for Next.js getStaticPaths).
 * @returns {string[]}
 */
export function getAllSlugs() {
  return getAllProducts().map((p) => p.slug);
}
