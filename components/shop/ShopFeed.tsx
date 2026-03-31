"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";
import { SHOP_CATEGORIES } from "@/lib/shopCategories";
import type { ShopSort, WooProduct } from "@/lib/woo";

function ProductCard({ product }: { product: WooProduct }) {
  const imageSrc = product.images?.[0]?.src || "/placeholder-product.jpg";
  const price = product.sale_price || product.price || "0";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block border border-white/10 bg-[#111] hover:border-[var(--accent)] transition-colors duration-300"
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-[#0a0a0a]">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />

        {product.on_sale && (
          <span className="absolute top-2 left-2 bg-[var(--accent)] text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            Sale
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-white text-xs font-bold uppercase tracking-widest line-clamp-2 min-h-[2.5em]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2 gap-4">
          <span className="text-gray-400 text-xs line-clamp-1">
            {product.categories?.[0]?.name || "Part"}
          </span>
          <span className="text-white font-display font-bold text-sm whitespace-nowrap">
            £{parseFloat(price || "0").toFixed(2)}
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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const updateParams = (
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
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchInput === searchQuery) return;
      updateParams({ q: searchInput.trim() || null, page: null }, { replace: true });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchInput, searchQuery]);

  const pageButtons = useMemo(
    () => getVisiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative">
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="header-sticky-gap sticky">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-4">
            Filter by Vehicle
          </h3>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => updateParams({ category: null, page: null })}
              className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 ${
                selectedCategory === "all"
                  ? "border-[var(--accent)] text-white bg-white/5"
                  : "border-transparent text-gray-500 hover:text-white"
              }`}
            >
              All Vehicles
            </button>

            {SHOP_CATEGORIES.map((category) => (
              <button
                key={category.slug}
                onClick={() =>
                  updateParams({ category: category.slug, page: null })
                }
                className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 ${
                  selectedCategory === category.slug
                    ? "border-[var(--accent)] text-white bg-white/5"
                    : "border-transparent text-gray-500 hover:text-white"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="w-full bg-[#111] border border-white/20 text-white text-sm pl-12 pr-12 py-3 focus:outline-none focus:border-[var(--accent)] placeholder:text-gray-600"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
          <button
            onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
            className="lg:hidden flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest border border-white/20 px-4 py-2"
          >
            <Filter size={14} /> Filters
          </button>

          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              Showing {products.length} of {totalProducts} Result{totalProducts === 1 ? "" : "s"}
            </p>
            {searchQuery && (
              <span className="inline-flex items-center gap-2 bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                Searching: {searchQuery}
                <button
                  onClick={() => setSearchInput("")}
                  className="hover:text-white transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            {isPending && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Updating…
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs uppercase hidden sm:inline-block">
              Sort By:
            </span>
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(event) =>
                  updateParams({ sort: event.target.value, page: null })
                }
                className="appearance-none bg-[#111] border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 pr-8 focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white"
                size={12}
              />
            </div>
          </div>
        </div>

        {isMobileFiltersOpen && (
          <div className="lg:hidden mb-8 grid grid-cols-2 gap-2 bg-[#111] p-4 border border-white/10">
            <button
              onClick={() => {
                updateParams({ category: null, page: null });
                setIsMobileFiltersOpen(false);
              }}
              className={`text-xs p-2 text-left uppercase ${
                selectedCategory === "all" ? "text-[var(--accent)]" : "text-white"
              }`}
            >
              All Vehicles
            </button>
            {SHOP_CATEGORIES.map((category) => (
              <button
                key={category.slug}
                onClick={() => {
                  updateParams({ category: category.slug, page: null });
                  setIsMobileFiltersOpen(false);
                }}
                className={`text-xs p-2 text-left uppercase ${
                  selectedCategory === category.slug
                    ? "text-[var(--accent)]"
                    : "text-gray-400"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-white/10">
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">
              {searchQuery
                ? `No products found for "${searchQuery}"`
                : "No products found matching this selection."}
            </p>
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
                className="text-xs text-[var(--accent)] hover:underline uppercase tracking-widest"
              >
                Clear filters
              </button>
            )}
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
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border border-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 transition-colors"
            >
              <ChevronLeft size={14} />
              Prev
            </button>

            {pageButtons.map((pageNumber, index) => {
              const previous = pageButtons[index - 1];
              const showGap = previous && pageNumber - previous > 1;

              return (
                <span key={pageNumber} className="contents">
                  {showGap && (
                    <span className="px-2 text-gray-600 text-xs">…</span>
                  )}
                  <button
                    onClick={() =>
                      updateParams({ page: String(pageNumber) })
                    }
                    className={`w-10 h-10 text-xs font-bold transition-colors ${
                      pageNumber === currentPage
                        ? "bg-[var(--accent)] text-black"
                        : "text-gray-500 hover:text-white hover:bg-white/5"
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
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border border-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 transition-colors"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
