import { fetchStoreProducts, type ShopSort } from "@/lib/woo";
import ShopFeed from "../../components/shop/ShopFeed";

export const metadata = {
  title: "Shop All | FDL Bespoke",
  description: "Shop curated premium vehicle parts with fitment advice, specialist sourcing, and secure checkout from FDL Bespoke.",
};

export const revalidate = 300;

function normalizeSort(value: string | string[] | undefined): ShopSort {
  const next = Array.isArray(value) ? value[0] : value;
  return next === "price-low" || next === "price-high" ? next : "newest";
}

function normalizePage(value: string | string[] | undefined): number {
  const next = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(next) && next > 0 ? Math.floor(next) : 1;
}

function normalizeString(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value || "").trim();
}

export default async function ShopIndexPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const selectedCategory = normalizeString(searchParams?.category) || "all";
  const searchQuery = normalizeString(searchParams?.q);
  const sortBy = normalizeSort(searchParams?.sort);
  const page = normalizePage(searchParams?.page);

  const result = await fetchStoreProducts({
    page,
    perPage: 16,
    makeSlug: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchQuery || undefined,
    sort: sortBy,
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="bg-[#050505] pb-12 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-[1920px] mx-auto">
          <h1 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tight leading-none">
            Shop Premium Vehicle Parts<span className="text-[var(--accent)]">.</span>
          </h1>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl border-l-2 border-[var(--accent)] pl-6 text-sm leading-relaxed text-gray-400 md:text-base">
              Search listed parts, filter by vehicle, or send us the details for fitment and sourcing help. The shop is built around the quickest route to the right part.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#vehicle-browser"
                className="inline-flex items-center justify-center bg-[var(--accent)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-white"
              >
                Browse Vehicles
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                View Parts
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Shop Interface */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-12">
        <ShopFeed
          products={result.products}
          totalProducts={result.totalProducts}
          currentPage={result.page}
          totalPages={result.totalPages}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}
