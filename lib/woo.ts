/**
 * WooCommerce API Helper
 * Server-side only - keys must never reach the browser
 */

const WOO_BASE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
const WOO_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const WOO_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

if (!WOO_BASE_URL || !WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
  console.warn("WooCommerce credentials missing. Product fetching will fail.");
}

/**
 * WooCommerce REST API Types
 */
export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  count: number;
}

function getAuthHeader(): string {
  const auth = Buffer.from(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`).toString("base64");
  return `Basic ${auth}`;
}

async function wooFetch<T>(pathWithQuery: string, revalidate = 60): Promise<T> {
  if (!WOO_BASE_URL || !WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
    return [] as any;
  }

  const url = `${WOO_BASE_URL}${pathWithQuery}`;

  const res = await fetch(url, {
    headers: { Authorization: getAuthHeader() },
    next: { revalidate },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`Woo fetch failed ${res.status} for ${url}\n${text}`);
    throw new Error(`Woo fetch failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

function uniqById<T extends { id: number }>(items: T[]): T[] {
  const map = new Map<number, T>();
  for (const it of items) map.set(it.id, it);
  return Array.from(map.values());
}

// ============================================================================
// CACHED DATA - fetch once, reuse
// ============================================================================

let cachedCategories: WooCategory[] | null = null;
let cachedProducts: WooProduct[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheValid(): boolean {
  return Date.now() - cacheTimestamp < CACHE_TTL;
}

/**
 * Fetch ALL categories (with in-memory caching)
 */
export async function getAllCategories(): Promise<WooCategory[]> {
  if (cachedCategories && isCacheValid()) {
    return cachedCategories;
  }

  if (!WOO_BASE_URL || !WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) return [];

  const all: WooCategory[] = [];
  const perPage = 100;

  for (let page = 1; page <= 5; page++) {
    const batch = await wooFetch<WooCategory[]>(
      `/wp-json/wc/v3/products/categories?per_page=${perPage}&page=${page}`,
      300
    ).catch(() => []);

    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < perPage) break;
  }

  cachedCategories = all;
  cacheTimestamp = Date.now();
  console.log(`[woo] Cached ${all.length} categories`);

  return all;
}

/**
 * Fetch ALL products (with in-memory caching)
 * Since you have ~132 products, fetching all once is efficient
 */
export async function getAllProducts(perPage = 100, maxPages = 10): Promise<WooProduct[]> {
  if (cachedProducts && isCacheValid()) {
    console.log(`[woo] Returning ${cachedProducts.length} cached products`);
    return cachedProducts;
  }

  if (!WOO_BASE_URL || !WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) return [];

  const all: WooProduct[] = [];

  for (let page = 1; page <= maxPages; page++) {
    console.log(`[woo] Fetching products page ${page}...`);
    const pageItems = await wooFetch<WooProduct[]>(
      `/wp-json/wc/v3/products?status=publish&per_page=${perPage}&page=${page}`,
      60
    ).catch(() => []);

    if (!pageItems.length) break;
    all.push(...pageItems);
    if (pageItems.length < perPage) break;
  }

  const unique = uniqById(all);
  cachedProducts = unique;
  cacheTimestamp = Date.now();
  console.log(`[woo] Cached ${unique.length} products`);

  return unique;
}

/**
 * Get all descendant category IDs for a parent (using cached categories)
 */
function getAllDescendantIds(parentId: number, allCategories: WooCategory[]): number[] {
  const descendants: number[] = [];
  const queue = [parentId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const children = allCategories.filter((c) => c.parent === currentId);
    for (const child of children) {
      descendants.push(child.id);
      queue.push(child.id);
    }
  }

  return descendants;
}

/**
 * Fetch products for a SINGLE category slug
 */
export async function fetchProductsByCategorySlug(slug: string): Promise<WooProduct[]> {
  const allProducts = await getAllProducts();
  const normalizedSlug = slug.toLowerCase().trim();

  return allProducts.filter((p) =>
    (p.categories || []).some((c) => c.slug.toLowerCase() === normalizedSlug)
  );
}

/**
 * Normalize a string to match flexibly (removes hyphens, underscores, spaces, etc.)
 */
function normalizeForMatch(str: string): string {
  return str.toLowerCase().replace(/[\s_-]+/g, '');
}

/**
 * Fetch products for a MAKE slug (e.g. "bmw", "land-rover") INCLUDING ALL DESCENDANTS.
 *
 * This works by:
 * 1. Getting all categories (cached)
 * 2. Finding the make category and all its descendants (with flexible matching)
 * 3. Getting all products (cached)
 * 4. Filtering to products that belong to any of those categories
 *
 * NO EXTRA API CALLS - just filtering cached data!
 */
export async function fetchProductsByMakeSlug(makeSlug: string): Promise<WooProduct[]> {
  if (!makeSlug) return [];

  const normalizedMakeSlug = normalizeForMatch(makeSlug);

  // Get cached data (or fetch if needed - just 2 API calls total)
  const [allCategories, allProducts] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);

  // Find the parent category (the make) - try multiple matching strategies
  let parentCategory = allCategories.find(
    (c) => normalizeForMatch(c.slug) === normalizedMakeSlug
  );

  // Fallback: try matching by name
  if (!parentCategory) {
    parentCategory = allCategories.find(
      (c) => normalizeForMatch(c.name) === normalizedMakeSlug
    );
  }

  // Fallback 2: try partial match
  if (!parentCategory) {
    parentCategory = allCategories.find(
      (c) => normalizeForMatch(c.slug).includes(normalizedMakeSlug) ||
            normalizeForMatch(c.name).includes(normalizedMakeSlug)
    );
  }

  if (!parentCategory) {
    console.log(`[woo] No category found for make slug: ${makeSlug}`);
    // Final fallback: try to match products that have this slug in their category names
    return allProducts.filter((p) =>
      (p.categories || []).some(
        (c) =>
          normalizeForMatch(c.slug).includes(normalizedMakeSlug) ||
          normalizeForMatch(c.name).includes(normalizedMakeSlug)
      )
    );
  }

  // Get all descendant category IDs
  const descendantIds = getAllDescendantIds(parentCategory.id, allCategories);
  const allCategoryIds = new Set([parentCategory.id, ...descendantIds]);

  console.log(
    `[woo] Make "${makeSlug}" (id: ${parentCategory.id}, name: "${parentCategory.name}") includes ${allCategoryIds.size} categories (1 parent + ${descendantIds.length} descendants)`
  );

  // Filter products that belong to ANY of these categories
  const filtered = allProducts.filter((product) =>
    (product.categories || []).some((cat) => allCategoryIds.has(cat.id))
  );

  console.log(`[woo] Found ${filtered.length} products for make: ${makeSlug}`);

  return filtered;
}

/**
 * Clear the cache (useful if you need to force refresh)
 */
export function clearWooCache(): void {
  cachedCategories = null;
  cachedProducts = null;
  cacheTimestamp = 0;
  console.log("[woo] Cache cleared");
}