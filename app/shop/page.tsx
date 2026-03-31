import { fetchStoreProducts, type ShopSort } from "@/lib/woo";
import ShopFeed from "../../components/shop/ShopFeed";

export const metadata = {
  title: "Shop All | FDL Bespoke",
  description: "Browse our complete catalog of luxury automotive enhancements.",
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
            The Collection<span className="text-[var(--accent)]">.</span>
          </h1>
          <p className="text-gray-400 mt-6 max-w-xl text-sm md:text-base leading-relaxed border-l-2 border-[var(--accent)] pl-6">
            Explore our comprehensive range of bespoke automotive enhancements. 
            From carbon fiber aerodynamics to forged wheels and interior conversions.
          </p>
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
