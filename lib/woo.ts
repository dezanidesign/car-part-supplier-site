/**
 * WooCommerce storefront helper
 * Server-side fetches only. Keep secrets off the client.
 */

import { SHOP_CATEGORIES } from "@/lib/shopCategories";

const WOO_BASE_URL = (
  process.env.WOOCOMMERCE_URL ||
  process.env.WORDPRESS_URL ||
  process.env.WP_URL ||
  process.env.NEXT_PUBLIC_WOOCOMMERCE_URL ||
  ""
).replace(/\/$/, "");
const WOO_CONSUMER_KEY =
  process.env.WC_CONSUMER_KEY ||
  process.env.WOOCOMMERCE_CONSUMER_KEY ||
  "";
const WOO_CONSUMER_SECRET =
  process.env.WC_CONSUMER_SECRET ||
  process.env.WOOCOMMERCE_CONSUMER_SECRET ||
  "";

if (!WOO_BASE_URL || !WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
  console.warn("WooCommerce credentials missing. Product fetching will fail.");
}

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

export type ShopSort = "newest" | "price-low" | "price-high";

export type StorefrontProductQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  makeSlug?: string;
  sort?: ShopSort;
};

export type StorefrontProductResult = {
  products: WooProduct[];
  totalPages: number;
  totalProducts: number;
  page: number;
  perPage: number;
};

export const WOO_CACHE_TAGS = {
  categories: "woo:categories",
  products: "woo:products",
  product: (slug: string) => `woo:product:${slug}`,
  categoryProducts: (slug: string) => `woo:products:category:${slug}`,
  makeProducts: (slug: string) => `woo:products:make:${slug}`,
} as const;

type WooFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

function getAuthHeader(): string {
  const auth = Buffer.from(
    `${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`,
  ).toString("base64");
  return `Basic ${auth}`;
}

async function wooRequest(
  pathWithQuery: string,
  options: WooFetchOptions = {},
): Promise<Response> {
  if (!WOO_BASE_URL || !WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
    throw new Error("WooCommerce credentials are missing");
  }

  const url = `${WOO_BASE_URL}${pathWithQuery}`;
  const res = await fetch(url, {
    headers: { Authorization: getAuthHeader() },
    next: {
      revalidate: options.revalidate ?? 300,
      tags: options.tags,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`Woo fetch failed ${res.status} for ${url}\n${text}`);
    throw new Error(`Woo fetch failed: ${res.status}`);
  }

  return res;
}

async function wooFetch<T>(
  pathWithQuery: string,
  options: WooFetchOptions = {},
): Promise<T> {
  const res = await wooRequest(pathWithQuery, options);
  return (await res.json()) as T;
}

async function wooFetchPaged<T>(
  pathWithQuery: string,
  options: WooFetchOptions = {},
): Promise<{ data: T; totalPages: number; totalProducts: number }> {
  const res = await wooRequest(pathWithQuery, options);

  return {
    data: (await res.json()) as T,
    totalPages: parseInt(res.headers.get("x-wp-totalpages") || "1", 10),
    totalProducts: parseInt(res.headers.get("x-wp-total") || "0", 10),
  };
}

function uniqById<T extends { id: number }>(items: T[]): T[] {
  const map = new Map<number, T>();
  for (const item of items) map.set(item.id, item);
  return Array.from(map.values());
}

let cachedCategories: WooCategory[] | null = null;
let cachedProducts: WooProduct[] | null = null;
let categoriesCacheTimestamp = 0;
let productsCacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

function normalizeForMatch(value: string): string {
  return value.toLowerCase().replace(/[\s_-]+/g, "");
}

function buildProductQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }

  return query.toString();
}

function getSortParams(sort: ShopSort): { orderby: string; order: "asc" | "desc" } {
  if (sort === "price-low") {
    return { orderby: "price", order: "asc" };
  }

  if (sort === "price-high") {
    return { orderby: "price", order: "desc" };
  }

  return { orderby: "date", order: "desc" };
}

function getAllDescendantIds(parentId: number, allCategories: WooCategory[]): number[] {
  const descendants: number[] = [];
  const queue = [parentId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId) continue;

    const children = allCategories.filter((category) => category.parent === currentId);
    for (const child of children) {
      descendants.push(child.id);
      queue.push(child.id);
    }
  }

  return descendants;
}

function getMakeSlugForModelSlug(modelSlug: string): string | null {
  for (const make of SHOP_CATEGORIES) {
    if (make.models.some((model) => model.slug === modelSlug)) {
      return make.slug;
    }
  }

  return null;
}

export function getWooRevalidationTags(options?: {
  productSlug?: string | null;
  categorySlug?: string | null;
  makeSlug?: string | null;
}): string[] {
  const tags = new Set<string>([
    WOO_CACHE_TAGS.products,
    WOO_CACHE_TAGS.categories,
  ]);

  if (options?.productSlug) {
    tags.add(WOO_CACHE_TAGS.product(options.productSlug));
  }

  if (options?.categorySlug) {
    tags.add(WOO_CACHE_TAGS.categoryProducts(options.categorySlug));
    const makeSlug = options.makeSlug || getMakeSlugForModelSlug(options.categorySlug);
    if (makeSlug) {
      tags.add(WOO_CACHE_TAGS.makeProducts(makeSlug));
    }
  } else if (options?.makeSlug) {
    tags.add(WOO_CACHE_TAGS.makeProducts(options.makeSlug));
  }

  return Array.from(tags);
}

export async function getAllCategories(): Promise<WooCategory[]> {
  if (cachedCategories && isCacheValid(categoriesCacheTimestamp)) {
    return cachedCategories;
  }

  const all: WooCategory[] = [];
  const perPage = 100;

  for (let page = 1; page <= 5; page += 1) {
    const batch = await wooFetch<WooCategory[]>(
      `/wp-json/wc/v3/products/categories?${buildProductQuery({
        per_page: perPage,
        page,
      })}`,
      {
        revalidate: 300,
        tags: [WOO_CACHE_TAGS.categories],
      },
    ).catch(() => []);

    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < perPage) break;
  }

  cachedCategories = all;
  categoriesCacheTimestamp = Date.now();
  return all;
}

export async function getAllProducts(perPage = 100, maxPages = 10): Promise<WooProduct[]> {
  if (cachedProducts && isCacheValid(productsCacheTimestamp)) {
    return cachedProducts;
  }

  const all: WooProduct[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const batch = await wooFetch<WooProduct[]>(
      `/wp-json/wc/v3/products?${buildProductQuery({
        status: "publish",
        per_page: perPage,
        page,
        orderby: "date",
        order: "desc",
      })}`,
      {
        revalidate: 300,
        tags: [WOO_CACHE_TAGS.products],
      },
    ).catch(() => []);

    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < perPage) break;
  }

  cachedProducts = uniqById(all);
  productsCacheTimestamp = Date.now();
  return cachedProducts;
}

async function getCategoryBySlug(slug: string): Promise<WooCategory | null> {
  const normalizedSlug = slug.toLowerCase().trim();
  if (!normalizedSlug) return null;

  const categories = await getAllCategories();
  return (
    categories.find((category) => category.slug.toLowerCase() === normalizedSlug) ||
    null
  );
}

async function getCategoryIdsForMakeSlug(makeSlug: string): Promise<number[]> {
  if (!makeSlug || makeSlug === "all") return [];

  const categories = await getAllCategories();
  const normalizedMakeSlug = normalizeForMatch(makeSlug);

  let parentCategory =
    categories.find((category) => normalizeForMatch(category.slug) === normalizedMakeSlug) ||
    categories.find((category) => normalizeForMatch(category.name) === normalizedMakeSlug) ||
    categories.find(
      (category) =>
        normalizeForMatch(category.slug).includes(normalizedMakeSlug) ||
        normalizeForMatch(category.name).includes(normalizedMakeSlug),
    );

  if (!parentCategory) return [];

  return [parentCategory.id, ...getAllDescendantIds(parentCategory.id, categories)];
}

async function fetchProductsForCategoryIds(
  categoryIds: number[],
  options: { perPage?: number; maxPages?: number; tag?: string } = {},
): Promise<WooProduct[]> {
  if (!categoryIds.length) return [];

  const perPage = options.perPage ?? 100;
  const maxPages = options.maxPages ?? 10;
  const all: WooProduct[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const batch = await wooFetch<WooProduct[]>(
      `/wp-json/wc/v3/products?${buildProductQuery({
        status: "publish",
        category: categoryIds.join(","),
        per_page: perPage,
        page,
        orderby: "date",
        order: "desc",
      })}`,
      {
        revalidate: 300,
        tags: [
          WOO_CACHE_TAGS.products,
          ...(options.tag ? [options.tag] : []),
        ],
      },
    ).catch(() => []);

    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < perPage) break;
  }

  return uniqById(all);
}

export async function fetchStoreProducts(
  query: StorefrontProductQuery = {},
): Promise<StorefrontProductResult> {
  const page = Math.max(1, query.page || 1);
  const perPage = Math.min(48, Math.max(1, query.perPage || 16));
  const search = query.search?.trim() || undefined;
  const sort = query.sort || "newest";

  let categoryIds: number[] | undefined;
  let makeTag: string | undefined;

  if (query.makeSlug && query.makeSlug !== "all") {
    categoryIds = await getCategoryIdsForMakeSlug(query.makeSlug);
    makeTag = WOO_CACHE_TAGS.makeProducts(query.makeSlug);

    if (!categoryIds.length) {
      return {
        products: [],
        totalPages: 0,
        totalProducts: 0,
        page,
        perPage,
      };
    }
  }

  const sortParams = getSortParams(sort);
  const { data, totalPages, totalProducts } = await wooFetchPaged<WooProduct[]>(
    `/wp-json/wc/v3/products?${buildProductQuery({
      status: "publish",
      per_page: perPage,
      page,
      search,
      category: categoryIds?.join(","),
      orderby: sortParams.orderby,
      order: sortParams.order,
    })}`,
    {
      revalidate: 300,
      tags: [WOO_CACHE_TAGS.products, ...(makeTag ? [makeTag] : [])],
    },
  );

  return {
    products: data,
    totalPages,
    totalProducts,
    page,
    perPage,
  };
}

export async function fetchProductsByCategorySlug(slug: string): Promise<WooProduct[]> {
  const category = await getCategoryBySlug(slug);
  if (!category) return [];

  return fetchProductsForCategoryIds([category.id], {
    tag: WOO_CACHE_TAGS.categoryProducts(slug),
  });
}

export async function fetchProductsByMakeSlug(makeSlug: string): Promise<WooProduct[]> {
  const categoryIds = await getCategoryIdsForMakeSlug(makeSlug);
  return fetchProductsForCategoryIds(categoryIds, {
    tag: WOO_CACHE_TAGS.makeProducts(makeSlug),
  });
}

export async function fetchProductBySlug(slug: string): Promise<WooProduct | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) return null;

  const { data } = await wooFetchPaged<WooProduct[]>(
    `/wp-json/wc/v3/products?${buildProductQuery({
      slug: normalizedSlug,
      status: "publish",
      per_page: 1,
    })}`,
    {
      revalidate: 300,
      tags: [WOO_CACHE_TAGS.products, WOO_CACHE_TAGS.product(normalizedSlug)],
    },
  );

  return data[0] || null;
}

export async function fetchRelatedProducts(
  currentProduct: WooProduct,
  limit = 4,
): Promise<WooProduct[]> {
  const primaryCategory = currentProduct.categories?.[0];
  if (!primaryCategory) return [];

  const { data } = await wooFetchPaged<WooProduct[]>(
    `/wp-json/wc/v3/products?${buildProductQuery({
      status: "publish",
      category: primaryCategory.id,
      exclude: currentProduct.id,
      per_page: limit,
      orderby: "date",
      order: "desc",
    })}`,
    {
      revalidate: 300,
      tags: [
        WOO_CACHE_TAGS.products,
        WOO_CACHE_TAGS.categoryProducts(primaryCategory.slug),
      ],
    },
  );

  return data;
}

export function clearWooCache(): void {
  cachedCategories = null;
  cachedProducts = null;
  categoriesCacheTimestamp = 0;
  productsCacheTimestamp = 0;
}
