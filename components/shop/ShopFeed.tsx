"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Filter } from "lucide-react";
import { SHOP_CATEGORIES } from "@/lib/shopCategories";
import type { WooProduct } from "@/lib/woo";

function ProductCard({ product }: { product: WooProduct }) {
  const imageSrc = product.images?.[0]?.src || "/placeholder-product.jpg";
  const price = product.sale_price || product.price || "0";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block border border-white/10 bg-[#111] hover:border-[var(--accent-orange)] transition-colors duration-300"
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-[#0a0a0a]">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        {product.on_sale && (
          <span className="absolute top-2 left-2 bg-[var(--accent-orange)] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            Sale
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-white text-xs font-bold uppercase tracking-widest line-clamp-2 min-h-[2.5em]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-400 text-xs">
            {product.categories?.[0]?.name || "Part"}
          </span>
          <span className="text-white font-display font-bold text-sm">
            £{Number.parseFloat(price || "0").toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}

type Props = {
  initialProducts: WooProduct[];
};

export default function ShopFeed({ initialProducts }: Props) {
  const [products, setProducts] = useState<WooProduct[]>(initialProducts || []);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Keep local state in sync if the server ever re-renders with a new batch
  useEffect(() => {
    setProducts(initialProducts || []);
  }, [initialProducts]);

  // When user clicks a make, fetch products for that make from the server.
  // This is the real fix: no more "filtering only the first page".
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (selectedCategory === "all") {
        setProducts(initialProducts || []);
        return;
      }

      setIsLoading(true);
      try {
        // IMPORTANT:
        // This assumes you have (or will add) an API route that calls fetchProductsByMakeSlug on the server.
        // If your existing /api/products already supports categorySlug,
        // we can use mode=make to tell it “include children”.
        const res = await fetch(
          `/api/products?mode=make&categorySlug=${encodeURIComponent(selectedCategory)}&per_page=200`,
          { cache: "no-store" }
        );

        const json = await res.json();

        if (cancelled) return;

        const nextProducts: WooProduct[] = Array.isArray(json?.products) ? json.products : [];
        setProducts(nextProducts);
      } catch (e) {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, initialProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...(products || [])];

    // Sorting only (filtering is now done by server fetch on make selection)
    if (sortBy === "price-low") {
      result.sort((a, b) => Number.parseFloat(a.price || "0") - Number.parseFloat(b.price || "0"));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number.parseFloat(b.price || "0") - Number.parseFloat(a.price || "0"));
    }

    return result;
  }, [products, sortBy]);

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative">
      {/* --- SIDEBAR FILTERS (Desktop) --- */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-32">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-4">
            Filter by Vehicle
          </h3>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 
                ${
                  selectedCategory === "all"
                    ? "border-[var(--accent-orange)] text-white bg-white/5"
                    : "border-transparent text-gray-500 hover:text-white"
                }`}
            >
              All Vehicles
            </button>

            {SHOP_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l-2 
                  ${
                    selectedCategory === cat.slug
                      ? "border-[var(--accent-orange)] text-white bg-white/5"
                      : "border-transparent text-gray-500 hover:text-white"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest border border-white/20 px-4 py-2"
          >
            <Filter size={14} /> Filters
          </button>

          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            {isLoading ? "Loading…" : `Showing ${filteredProducts.length} Results`}
          </p>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs uppercase hidden sm:inline-block">Sort By:</span>
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#111] border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 pr-8 focus:outline-none focus:border-[var(--accent-orange)]"
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

        {/* Mobile Filters Drawer */}
        {isMobileFiltersOpen && (
          <div className="lg:hidden mb-8 grid grid-cols-2 gap-2 bg-[#111] p-4 border border-white/10">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`text-xs p-2 text-left uppercase ${
                selectedCategory === "all" ? "text-[var(--accent-orange)]" : "text-white"
              }`}
            >
              All Vehicles
            </button>

            {SHOP_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs p-2 text-left uppercase ${
                  selectedCategory === cat.slug ? "text-[var(--accent-orange)]" : "text-gray-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-white/10">
            <p className="text-gray-500 text-sm uppercase tracking-widest">
              {isLoading ? "Fetching products…" : "No products found matching filters."}
            </p>
          </div>
        )}

        {/* Load More (optional later) */}
        <div className="mt-20 flex justify-center border-t border-white/5 pt-12">
          <button className="text-white text-xs font-bold uppercase tracking-[0.2em] border-b border-[var(--accent-orange)] pb-1 hover:text-[var(--accent-orange)] transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
}
