type WPProductCategory = {
    id: number;
    slug: string;
    name: string;
  };
  
  export type StoreProduct = {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    images: { id: number; src: string; alt: string }[];
    prices: {
      price: string;
      regular_price: string;
      sale_price: string;
      currency_code: string;
      currency_symbol: string;
    };
  };
  
  function mustGetEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
  }
  
  /**
   * REQUIRED env:
   * NEXT_PUBLIC_WP_URL=https://YOURDOMAIN.COM
   */
  function wpBase(): string {
    const base = mustGetEnv("NEXT_PUBLIC_WP_URL").replace(/\/$/, "");
    return base;
  }
  
  export async function resolveCategoryIdBySlug(slug: string): Promise<WPProductCategory | null> {
    const url = `${wpBase()}/wp-json/wp/v2/product_cat?slug=${encodeURIComponent(slug)}&per_page=1`;
  
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
  
    const data = (await res.json()) as WPProductCategory[];
    if (!Array.isArray(data) || data.length === 0) return null;
  
    return data[0];
  }
  
  export async function fetchProductsByCategoryId(categoryId: number): Promise<StoreProduct[]> {
    const url = `${wpBase()}/wp-json/wc/store/v1/products?category=${categoryId}&per_page=48`;
  
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
  
    const data = (await res.json()) as StoreProduct[];
    return Array.isArray(data) ? data : [];
  }
  
  export function formatPrice(p: StoreProduct["prices"]): string {
    // Store API returns price strings in minor units sometimes depending on config.
    // We’ll do a safe display: if it's numeric-ish and long, attempt decimal.
    const sym = p.currency_symbol || "£";
    const raw = p.price ?? "";
    const n = Number(raw);
  
    if (!Number.isFinite(n)) return `${sym}${raw}`;
  
    // Heuristic: if looks like pennies (e.g. 14999), convert
    if (raw.length >= 4) {
      const v = (n / 100).toFixed(2);
      return `${sym}${v}`;
    }
  
    return `${sym}${n.toFixed(2)}`;
  }
  