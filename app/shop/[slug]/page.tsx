import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getCategoryMeta } from "@/lib/shopCategories";
import { fetchProductsByCategorySlug } from "@/lib/woo";
import type { WooProduct } from "@/lib/woo";

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const meta = getCategoryMeta(params.slug);

  if (!meta) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${meta.label} - ${meta.brandLabel}`,
    description: `Shop premium ${meta.label} parts and accessories for ${meta.brandLabel}. High-quality automotive styling products with expert support.`,
    keywords: [meta.label, meta.brandLabel, "car parts", "automotive accessories", "OEM parts", "aftermarket parts"],
  };
}

// Product Card Component
function ProductCard({ product }: { product: WooProduct }) {
  const imageSrc = product.images?.[0]?.src || "/placeholder-product.jpg";
  const imageAlt = product.images?.[0]?.alt || product.name;
  const price = product.sale_price && parseFloat(product.sale_price) > 0
    ? product.sale_price
    : product.price;

  return (
    <div className="border border-white/10 bg-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-colors group">
      <div className="aspect-square relative overflow-hidden bg-black/20">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-[#FF4D00] font-bold text-lg">
            £{parseFloat(price || "0").toFixed(2)}
          </span>
          <a
            href={`/product/${product.slug}`} // <-- Points to Next.js route
            className="text-white/60 hover:text-[#FF4D00]..."
          >
            View →
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function ShopCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const meta = getCategoryMeta(params.slug);
  if (!meta) return notFound();

  // Fetch products server-side
  const products = await fetchProductsByCategorySlug(params.slug);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 pt-36 pb-20">
        {/* HERO */}
        <div className="border border-white/10 bg-white/5 rounded-2xl p-8 md:p-12 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(800px 400px at 20% 20%, rgba(255,77,0,0.25), transparent 60%), radial-gradient(700px 350px at 80% 0%, rgba(255,255,255,0.08), transparent 55%)",
            }}
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
              {meta.brandLabel}
            </p>

            <h1 className="font-display text-4xl md:text-7xl font-bold uppercase tracking-tight mt-3">
              {meta.label}
              <span className="text-[#FF4D00]">.</span>
            </h1>

            <p className="text-gray-400 mt-5 max-w-2xl">
              Browse our curated selection of premium parts for this vehicle model.
            </p>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="mt-14">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase">
            Products
          </h2>

          {products.length === 0 ? (
            <div className="mt-6 border border-white/10 bg-white/5 rounded-2xl p-10 text-gray-400">
              Products coming soon for <span className="text-white">{meta.label}</span>.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
