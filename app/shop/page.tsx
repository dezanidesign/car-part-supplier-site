import { getAllProducts, getAllCategories } from "@/lib/woo";
import ShopFeed from "../../components/shop/ShopFeed";

export const metadata = {
  title: "Shop All | FDL Bespoke",
  description: "Browse our complete catalog of luxury automotive enhancements.",
};

// Force dynamic rendering so we always get fresh stock data
export const dynamic = "force-dynamic";

export default async function ShopIndexPage() {
  // Fetch all products and categories (cached, only 2 API calls total)
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]); 

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="bg-[#050505] pt-40 pb-12 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-[1920px] mx-auto">
          <h1 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tight leading-none">
            The Collection<span className="text-[var(--accent-orange)]">.</span>
          </h1>
          <p className="text-gray-400 mt-6 max-w-xl text-sm md:text-base leading-relaxed border-l-2 border-[var(--accent-orange)] pl-6">
            Explore our comprehensive range of bespoke automotive enhancements. 
            From carbon fiber aerodynamics to forged wheels and interior conversions.
          </p>
        </div>
      </div>

      {/* Main Shop Interface */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-12">
        <ShopFeed initialProducts={products} initialCategories={categories} />
      </div>
    </div>
  );
}