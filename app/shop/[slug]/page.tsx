import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getCategoryMeta } from "@/lib/shopCategories";
import { fetchProductsByCategorySlug } from "@/lib/woo";
import { getShopCategoryMedia, type CuratedMediaItem } from "@/lib/curatedMedia";
import type { WooProduct } from "@/lib/woo";
import VehicleMediaShowcase from "@/components/shop/VehicleMediaShowcase";
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
    keywords: [
      meta.label,
      meta.brandLabel,
      "car parts",
      "automotive accessories",
      "OEM parts",
      "aftermarket parts",
    ],
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
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D3BF89]/70"
      aria-label={`View ${product.name}`}
    >
      <div className="relative aspect-square overflow-hidden bg-black/20">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-bold uppercase tracking-wide text-white">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-bold text-[#D3BF89]">
            &pound;{parseFloat(price || "0").toFixed(2)}
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors group-hover:text-[#D3BF89]">
            <span>View Product</span>
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function getProductImageMedia(products: WooProduct[]): CuratedMediaItem[] {
  const seen = new Set<string>();
  const media: CuratedMediaItem[] = [];

  for (const product of products) {
    for (const [imageIndex, image] of (product.images || []).entries()) {
      const src = image.src?.trim();
      if (!src || seen.has(src)) continue;

      seen.add(src);
      media.push({
        id: `x5-g05-product-${product.id}-${image.id || imageIndex}`,
        type: "image",
        src,
        brand: "bmw",
        brandLabel: "BMW",
        project: "x5-g05-product-images",
        projectLabel: "X5 G05",
        title: image.alt || image.name || product.name,
        relatedSlugs: ["x5-g05"],
        featuredArea: ["shop-category"],
        sourceFolder: "WooCommerce product imagery",
      });
    }
  }

  return media;
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
  const isX5G05Page = params.slug === "x5-g05";
  const productImageMedia = isX5G05Page ? getProductImageMedia(products) : [];
  const hasProducts = products.length > 0;
  const hasMedia = isX5G05Page
    ? productImageMedia.length > 0 || curatedMedia.length > 0
    : curatedMedia.length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1920px] px-6 pb-20 md:px-12">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(800px 400px at 20% 20%, rgba(211,191,137,0.25), transparent 60%), radial-gradient(700px 350px at 80% 0%, rgba(255,255,255,0.08), transparent 55%)",
            }}
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
              {meta.brandLabel}
            </p>

            <h1 className="font-display mt-3 text-4xl font-bold uppercase tracking-tight md:text-7xl">
              {meta.label}
              <span className="text-[#D3BF89]">.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-gray-400">{meta.description}</p>
          </div>
        </div>

        {hasMedia && (
          <>
            {isX5G05Page ? (
              <>
                {productImageMedia.length > 0 && (
                  <VehicleMediaShowcase
                    media={productImageMedia}
                    categoryLabel="X5 G05"
                    brandLabel="BMW"
                    eyebrow="X5 G05"
                    title="X5 G05"
                    intro="Product-associated X5 G05 imagery pulled directly from the WooCommerce products shown below."
                  />
                )}

                {curatedMedia.length > 0 && (
                  <VehicleMediaShowcase
                    media={curatedMedia}
                    categoryLabel="X5 G05 LCI facelift"
                    brandLabel={meta.brandLabel}
                    eyebrow="Current recent X5 G05"
                    title="X5 G05 LCI facelift"
                    intro="Recent X5 G05 facelift images and videos from the matched FDL project folders."
                  />
                )}
              </>
            ) : (
              <VehicleMediaShowcase
                media={curatedMedia}
                categoryLabel={meta.label}
                brandLabel={meta.brandLabel}
              />
            )}
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
              <p className="max-w-xl text-sm text-gray-300">
                {hasProducts
                  ? CONVERSION_COPY.likeWhatYouSee
                  : CONVERSION_COPY.makeYourCarLookLikeThis}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 self-start bg-[var(--accent)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black transition-all hover:brightness-110 md:self-auto"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </>
        )}

        {!hasProducts && !hasMedia ? (
          <div className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="font-display mb-4 text-2xl font-bold uppercase text-white md:text-3xl">
              {meta.label}
            </h2>
            <p className="text-gray-400">{CONVERSION_COPY.comingSoon}</p>
          </div>
        ) : hasProducts ? (
          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold uppercase md:text-3xl">
              Products
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
