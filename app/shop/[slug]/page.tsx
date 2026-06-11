import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Search, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { getCategoryMeta } from "@/lib/shopCategories";
import { fetchProductsByCategorySlug } from "@/lib/woo";
import { getShopCategoryMedia, type CuratedMediaItem } from "@/lib/curatedMedia";
import type { WooProduct } from "@/lib/woo";
import VehicleMediaShowcase from "@/components/shop/VehicleMediaShowcase";
import { BUYING_REASSURANCE_POINTS, CONVERSION_COPY } from "@/lib/siteContent";

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
    title: `${meta.label} Parts, Styling & Upgrades - ${meta.brandLabel}`,
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

const POPULAR_UPGRADES = [
  {
    title: "Carbon Styling",
    copy: "Splitters, diffusers, mirror caps and exterior details chosen for fitment and finish.",
    icon: Sparkles,
  },
  {
    title: "Exhaust Upgrades",
    copy: "Performance and styling-led exhaust options with fitment advice before purchase.",
    icon: Wrench,
  },
  {
    title: "Bodykits",
    copy: "Exterior conversion parts and styling packages for a stronger road presence.",
    icon: ShieldCheck,
  },
  {
    title: "Security & Retrofits",
    copy: "Ghost immobilisers, cameras, coding and specialist retrofit enquiries.",
    icon: Search,
  },
];

function formatPrice(price: string) {
  const numeric = parseFloat(price || "0");
  if (!Number.isFinite(numeric) || numeric <= 0) return "Price on request";

  return numeric.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}

function buildQuoteHref(vehicleLabel: string) {
  return `/contact?${new URLSearchParams({
    makeModel: vehicleLabel,
    message: `Hi FDL Bespoke,\n\nI'm looking for parts, fitment or upgrade advice for a ${vehicleLabel}. Please let me know the next step.`,
  }).toString()}`;
}

function ProductCard({ product, vehicleLabel }: { product: WooProduct; vehicleLabel: string }) {
  const imageSrc = product.images?.[0]?.src || "/placeholder-product.jpg";
  const imageAlt = product.images?.[0]?.alt || product.name;
  const price =
    product.sale_price && parseFloat(product.sale_price) > 0
      ? product.sale_price
      : product.price;
  const fitment = product.categories?.[0]?.name || vehicleLabel;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-white/10 bg-white/[0.04] transition-colors hover:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/70"
      aria-label={`View ${product.name}`}
    >
      <div className="relative aspect-square overflow-hidden bg-black/20">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={460}
          height={460}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
        {product.on_sale && (
          <span className="absolute left-3 top-3 bg-[var(--accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
            Sale
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <p className="line-clamp-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
          {fitment}
        </p>
        <h3 className="line-clamp-2 min-h-[2.75em] text-sm font-bold leading-snug text-white">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400">Fitment advice available</p>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-4">
          <span className="text-sm font-bold text-white">{formatPrice(price)}</span>
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
            View Product <ArrowRight size={11} />
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
  const quoteHref = buildQuoteHref(meta.label);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1920px] px-6 pb-20 md:px-12">
        <section className="border-b border-white/10 pb-12">
          <div className="grid gap-8 border border-white/10 bg-white/[0.03] p-7 md:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
                {meta.brandLabel}
              </p>
              <h1 className="font-display mt-4 text-4xl font-bold uppercase leading-tight tracking-tight md:text-7xl">
                {meta.label} Parts, Styling &amp; Upgrades<span className="text-[#D3BF89]">.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
                Shop premium parts and styling upgrades for {meta.label}. Need help with fitment, installation, sourcing or a custom build? Send your vehicle details and we will advise the next step.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="#products"
                className="inline-flex items-center justify-center gap-3 bg-white px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--accent)]"
              >
                Shop {meta.label} Parts <ArrowRight size={14} />
              </Link>
              <Link
                href={quoteHref}
                className="inline-flex items-center justify-center gap-3 border border-white/20 px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-black"
              >
                Request {meta.label} Quote <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 border border-white/10 bg-black/20 p-4 sm:grid-cols-2 lg:grid-cols-6">
            {BUYING_REASSURANCE_POINTS.map((point) => (
              <div key={point} className="flex items-center gap-3 text-xs text-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
                Popular Upgrades
              </p>
              <h2 className="font-display text-3xl font-bold uppercase text-white md:text-5xl">
                Common {meta.label} Requests
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-gray-400">
              Not sure what fits? Send your registration, model or part details and we will help confirm compatibility.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {POPULAR_UPGRADES.map((upgrade) => {
              const Icon = upgrade.icon;

              return (
                <Link
                  key={upgrade.title}
                  href={quoteHref}
                  className="group border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/70"
                >
                  <Icon size={18} className="mb-6 text-[var(--accent)]" />
                  <h3 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                    {upgrade.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-gray-400">{upgrade.copy}</p>
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                    Ask About This <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {hasProducts ? (
          <section id="products" className="border-t border-white/10 py-14 md:py-20">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
                  Available Parts
                </p>
                <h2 className="font-display text-3xl font-bold uppercase md:text-5xl">
                  Shop {meta.label} Parts
                </h2>
              </div>
              <Link
                href={quoteHref}
                className="inline-flex items-center gap-3 self-start border border-white/20 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] md:self-auto"
              >
                Need Fitment Advice <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} vehicleLabel={meta.label} />
              ))}
            </div>
          </section>
        ) : (
          <section id="products" className="border-t border-white/10 py-14 md:py-20">
            <div className="border border-white/10 bg-white/[0.03] p-8 text-center md:p-10">
              <h2 className="font-display mb-4 text-2xl font-bold uppercase text-white md:text-3xl">
                Need {meta.label} Parts?
              </h2>
              <p className="mx-auto mb-7 max-w-2xl text-sm leading-relaxed text-gray-400">
                {CONVERSION_COPY.comingSoon} Send us your vehicle and part details and we can advise on sourcing, fitment and installation options.
              </p>
              <Link
                href={quoteHref}
                className="inline-flex items-center gap-3 bg-[var(--accent)] px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-white"
              >
                Request {meta.label} Parts <ArrowRight size={13} />
              </Link>
            </div>
          </section>
        )}

        {hasMedia && (
          <section className="border-t border-white/10 py-14 md:py-20">
            <div className="mb-10">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
                Workshop Proof
              </p>
              <h2 className="font-display text-3xl font-bold uppercase md:text-5xl">
                Recent {meta.label} Work
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
                Gallery and media content is shown as proof of fitment, finish and workshop capability.
              </p>
            </div>

            {isX5G05Page ? (
              <>
                {productImageMedia.length > 0 && (
                  <VehicleMediaShowcase
                    media={productImageMedia}
                    categoryLabel="X5 G05"
                    brandLabel="BMW"
                    eyebrow="X5 G05 product imagery"
                    title="X5 G05 product imagery"
                    intro="Product-associated X5 G05 imagery pulled directly from the WooCommerce products shown above."
                  />
                )}

                {curatedMedia.length > 0 && (
                  <VehicleMediaShowcase
                    media={curatedMedia}
                    categoryLabel="X5 G05 LCI facelift"
                    brandLabel={meta.brandLabel}
                    eyebrow="Recent X5 G05 work"
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

            <div className="mt-6 flex flex-col gap-4 border border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between md:p-6">
              <p className="max-w-xl text-sm text-gray-300">
                Not sure what fits? Send your registration, model or part details and we will help confirm compatibility.
              </p>
              <Link
                href={quoteHref}
                className="inline-flex items-center gap-3 self-start bg-[var(--accent)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black transition-all hover:brightness-110 md:self-auto"
              >
                <span>Request Fitment Help</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
