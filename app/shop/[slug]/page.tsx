import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryMeta } from "@/lib/shopCategories";
import { fetchProductsByCategorySlug } from "@/lib/woo";
import { getShopCategoryMedia } from "@/lib/curatedMedia";
import type { WooProduct } from "@/lib/woo";
import { CONVERSION_COPY } from "@/lib/siteContent";

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

function ProductCard({ product }: { product: WooProduct }) {
  const imageSrc = product.images?.[0]?.src || "/placeholder-product.jpg";
  const imageAlt = product.images?.[0]?.alt || product.name;
  const price =
    product.sale_price && parseFloat(product.sale_price) > 0
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
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#D3BF89] font-bold text-lg">
            £{parseFloat(price || "0").toFixed(2)}
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="text-white/60 hover:text-[#D3BF89] transition-colors text-sm font-medium"
          >
            View →
          </Link>
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

  const products = await fetchProductsByCategorySlug(params.slug);
  const curatedMedia = getShopCategoryMedia(params.slug);
  const hasProducts = products.length > 0;
  const hasMedia = curatedMedia.length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 pb-20">
        <div className="border border-white/10 bg-white/5 rounded-2xl p-8 md:p-12 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(800px 400px at 20% 20%, rgba(211,191,137,0.25), transparent 60%), radial-gradient(700px 350px at 80% 0%, rgba(255,255,255,0.08), transparent 55%)",
            }}
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
              {meta.brandLabel}
            </p>

            <h1 className="font-display text-4xl md:text-7xl font-bold uppercase tracking-tight mt-3">
              {meta.label}
              <span className="text-[#D3BF89]">.</span>
            </h1>

            <p className="text-gray-400 mt-5 max-w-2xl">
              Browse our curated selection of premium parts for this vehicle model.
            </p>
          </div>
        </div>

        {hasMedia && (
          <div className="mt-12 md:mt-14">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D3BF89] mb-2">
                  Project Media
                </p>
                <h2 className="font-display text-2xl md:text-4xl font-bold uppercase leading-tight">
                  Recent {meta.label} Work
                </h2>
              </div>
              <p className="text-gray-500 text-sm max-w-md leading-relaxed">
                Curated stills and clips from our latest {meta.brandLabel} content library, chosen to match this model and nearby build themes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-7 border border-white/10 overflow-hidden bg-white/5">
                {curatedMedia[0].type === "video" ? (
                  <video
                    className="w-full aspect-[16/10] object-cover"
                    src={curatedMedia[0].src}
                    poster={curatedMedia[0].poster}
                    muted
                    playsInline
                    loop
                    autoPlay
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={curatedMedia[0].src}
                    alt={curatedMedia[0].title}
                    className="w-full aspect-[16/10] object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                {curatedMedia.slice(1).map((item) => (
                  <div key={item.id} className="border border-white/10 overflow-hidden bg-white/5">
                    {item.type === "video" ? (
                      <video
                        className="w-full aspect-[16/10] object-cover"
                        src={item.src}
                        poster={item.poster}
                        muted
                        playsInline
                        loop
                        autoPlay
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full aspect-[16/10] object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="p-4 border-t border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D3BF89] mb-2">
                        {item.projectLabel}
                      </p>
                      <p className="text-white text-sm font-medium leading-snug">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-white/10 bg-white/5 rounded-2xl p-5 md:p-6">
              <p className="text-sm text-gray-300 max-w-xl">
                {hasProducts
                  ? CONVERSION_COPY.likeWhatYouSee
                  : CONVERSION_COPY.makeYourCarLookLikeThis}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-[var(--accent)] text-black px-5 py-3 font-bold uppercase tracking-[0.18em] text-[10px] hover:brightness-110 transition-all self-start md:self-auto"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        )}

        {!hasProducts && !hasMedia ? (
          <div className="mt-14 border border-white/10 bg-white/5 rounded-2xl p-10 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase text-white mb-4">
              {meta.label}
            </h2>
            <p className="text-gray-400">{CONVERSION_COPY.comingSoon}</p>
          </div>
        ) : hasProducts ? (
          <div className="mt-14">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase">
              Products
            </h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
