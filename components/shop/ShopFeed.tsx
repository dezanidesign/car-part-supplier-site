"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { SHOP_CATEGORIES } from "@/lib/shopCategories";
import { BUYING_REASSURANCE_POINTS } from "@/lib/siteContent";
import type { ShopSort, WooProduct } from "@/lib/woo";

const POPULAR_MODEL_SLUGS = [
  "x5-g05",
  "land-rover-defender",
  "range-rover-sport",
  "g-wagon-g63",
  "audi-r8",
  "urus",
];

const REQUEST_PART_HREF =
  "/contact?message=Hi%20FDL%20Bespoke%2C%0A%0AI%27m%20looking%20for%20help%20sourcing%20a%20part.%20Please%20let%20me%20know%20what%20details%20you%20need.";

const POPULAR_MODELS = POPULAR_MODEL_SLUGS.map((slug) => {
  const model = SHOP_CATEGORIES.flatMap((make) =>
    make.models.map((item) => ({
      ...item,
      makeLabel: make.label,
    })),
  ).find((item) => item.slug === slug);

  return model || null;
}).filter(Boolean) as Array<{ label: string; slug: string; makeLabel: string }>;

function formatProductPrice(price: string) {
  const numeric = parseFloat(price || "0");
  if (!Number.isFinite(numeric) || numeric <= 0) return "Price on request";

  return numeric.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}

function ProductCard({ product }: { product: WooProduct }) {
  const imageSrc = product.images?.[0]?.src || "/placeholder-product.jpg";
  const imageAlt = product.images?.[0]?.alt || product.name;
  const price = product.sale_price || product.price || "0";
  const fitment = product.categories?.[0]?.name || "Vehicle part";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-white/10 bg-[#111] transition-colors duration-300 hover:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/70"
      aria-label={`View ${product.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
          loading="lazy"
        />

        {product.on_sale && (
          <span className="absolute left-2 top-2 bg-[var(--accent)] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
          {fitment}
        </p>
        <h3 className="min-h-[2.75em] text-sm font-bold leading-snug text-white line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400">Fitment advice available</p>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-4">
          <span className="whitespace-nowrap text-sm font-bold text-white">
            {formatProductPrice(price)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
            View Product <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

type Props = {
  products: WooProduct[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  selectedCategory: string;
  searchQuery: string;
  sortBy: ShopSort;
};

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);
  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);
  if (currentPage > 2) pages.add(2);
  if (currentPage < totalPages - 1) pages.add(totalPages - 1);

  return Array.from(pages).sort((a, b) => a - b);
}

export default function ShopFeed({
  products,
  totalProducts,
  currentPage,
  totalPages,
  selectedCategory,
  searchQuery,
  sortBy,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const updateParams = useCallback(
    (
      updates: Record<string, string | null>,
      options?: { replace?: boolean },
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all" || (key === "sort" && value === "newest")) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const nextQuery = params.toString();
      const href = nextQuery ? `${pathname}?${nextQuery}` : pathname;

      startTransition(() => {
        if (options?.replace) {
          router.replace(href, { scroll: false });
        } else {
          router.push(href, { scroll: false });
        }
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchInput === searchQuery) return;
      updateParams({ q: searchInput.trim() || null, page: null }, { replace: true });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchInput, searchQuery, updateParams]);

  const pageButtons = useMemo(
    () => getVisiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const selectedCategoryLabel =
    selectedCategory === "all"
      ? "All Vehicles"
      : SHOP_CATEGORIES.find((category) => category.slug === selectedCategory)?.label ||
        "Selected Vehicle";

  return (
    <div className="space-y-10">
      <section
        id="vehicle-browser"
        className="scroll-mt-[calc(var(--header-offset)+24px)] border border-white/10 bg-white/[0.03] p-5 md:p-7"
      >
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-6 max-w-2xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--accent)]">
                Find the Right Parts
              </p>
              <h2 className="font-display text-3xl font-bold uppercase leading-tight text-white md:text-4xl">
                Search, filter or ask FDL
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                Browse listed parts by vehicle, search the catalogue, or send your vehicle details if you need fitment or sourcing help.
              </p>
            </div>

            <div className="relative max-w-3xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search product name, part or style..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="w-full border border-white/20 bg-[#111] py-4 pl-12 pr-12 text-sm text-white placeholder:text-gray-600 focus:border-[var(--accent)] focus:outline-none"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="mt-7">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Filter by Brand
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateParams({ category: null, page: null })}
                  aria-pressed={selectedCategory === "all"}
                  className={`border px-3 py-2 text-xs font-semibold transition-colors ${
                    selectedCategory === "all"
                      ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                      : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-[var(--accent)]/50 hover:text-white"
                  }`}
                >
                  All Vehicles
                </button>
                {SHOP_CATEGORIES.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => updateParams({ category: category.slug, page: null })}
                    aria-pressed={selectedCategory === category.slug}
                    className={`border px-3 py-2 text-xs font-semibold transition-colors ${
                      selectedCategory === category.slug
                        ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                        : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-[var(--accent)]/50 hover:text-white"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Popular Vehicles
              </p>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {POPULAR_MODELS.map((model) => (
                  <Link
                    key={model.slug}
                    href={`/shop/${model.slug}`}
                    className="group flex items-center justify-between gap-4 border border-white/10 bg-black/20 px-4 py-3 transition-colors hover:border-[var(--accent)]/45 hover:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/70"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">
                        {model.label}
                      </span>
                      <span className="text-xs text-gray-500">{model.makeLabel}</span>
                    </span>
                    <ArrowRight
                      size={13}
                      className="shrink-0 text-[var(--accent)] transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="border border-white/10 bg-black/25 p-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
              Need Help?
            </p>
            <h3 className="font-display text-2xl font-bold uppercase leading-tight text-white">
              Not sure what fits?
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Send your registration, model or part details and we will advise the right product, fitment route or sourcing next step.
            </p>
            <div className="mt-6 grid gap-3">
              <Link
                href={REQUEST_PART_HREF}
                className="inline-flex items-center justify-between gap-4 bg-[var(--accent)] px-4 py-3 text-xs font-bold text-black transition-colors hover:bg-white"
              >
                Source a Part <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-between gap-4 border border-white/15 px-4 py-3 text-xs font-bold text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Request a Quote <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="products"
        className="scroll-mt-[calc(var(--header-offset)+24px)]"
      >
        <div className="mb-8 grid gap-3 border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-2 xl:grid-cols-6">
          {BUYING_REASSURANCE_POINTS.map((point) => (
            <div key={point} className="flex items-center gap-3 text-xs text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span>{point}</span>
            </div>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {selectedCategoryLabel} / Showing {products.length} of {totalProducts} Result{totalProducts === 1 ? "" : "s"}
            </p>
            {searchQuery && (
              <span className="inline-flex items-center gap-2 border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                Searching: {searchQuery}
                <button
                  onClick={() => setSearchInput("")}
                  className="transition-colors hover:text-white"
                  aria-label="Clear search filter"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <button
                onClick={() => updateParams({ category: null, page: null })}
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-white"
              >
                Clear Vehicle
              </button>
            )}
            {isPending && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Updating...
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs uppercase text-gray-500 sm:inline-block">
              Sort By:
            </span>
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(event) => updateParams({ sort: event.target.value, page: null })}
                className="appearance-none border border-white/20 bg-[#111] px-4 py-2 pr-8 text-xs font-bold uppercase tracking-widest text-white focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white"
                size={12}
              />
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-white/10 px-6 py-20 text-center">
            <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">
              {searchQuery
                ? `No products found for "${searchQuery}"`
                : "No products found matching this selection."}
            </p>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-400">
              The part may still be available to source. Send us the vehicle and part details and we will advise the next step.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    updateParams({
                      q: null,
                      category: null,
                      page: null,
                      sort: null,
                    });
                  }}
                  className="border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-white/30"
                >
                  Clear Filters
                </button>
              )}
              <Link
                href={REQUEST_PART_HREF}
                className="bg-[var(--accent)] px-5 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-white"
              >
                Request a Part
              </Link>
              <Link
                href="/contact"
                className="border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex flex-wrap items-center justify-center gap-2 border-t border-white/5 pt-10">
            <button
              onClick={() =>
                updateParams({
                  page: currentPage > 1 ? String(currentPage - 1) : String(currentPage),
                })
              }
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Prev
            </button>

            {pageButtons.map((pageNumber, index) => {
              const previous = pageButtons[index - 1];
              const showGap = previous && pageNumber - previous > 1;

              return (
                <span key={pageNumber} className="contents">
                  {showGap && <span className="px-2 text-xs text-gray-600">...</span>}
                  <button
                    onClick={() => updateParams({ page: String(pageNumber) })}
                    className={`h-10 w-10 text-xs font-bold transition-colors ${
                      pageNumber === currentPage
                        ? "bg-[var(--accent)] text-black"
                        : "text-gray-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                </span>
              );
            })}

            <button
              onClick={() =>
                updateParams({
                  page:
                    currentPage < totalPages
                      ? String(currentPage + 1)
                      : String(currentPage),
                })
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
