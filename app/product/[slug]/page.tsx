import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  fetchProductBySlug,
  fetchRelatedProducts,
  getProductFittingPrice,
} from "@/lib/woo";
import AddToCartBtn from "@/components/product/AddToCartBtn";
import { BUYING_REASSURANCE_POINTS } from "@/lib/siteContent";

const formatPrice = (price: string) =>
  parseFloat(price).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | FDL Bespoke`,
    description: product.short_description.replace(/<[^>]*>?/gm, ""),
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    return notFound();
  }

  const relatedProducts = await fetchRelatedProducts(product);
  const mainImage = product.images[0]?.src || "/placeholder-product.jpg";
  const currentPrice = product.sale_price || product.price;
  const enquiryHref = `/contact?${new URLSearchParams({
    makeModel: product.name,
    message: `Hi FDL Bespoke,\n\nI'm interested in ${product.name}. Please let me know about availability, fitting, and pricing.`,
  }).toString()}`;
  const fittingPrice = getProductFittingPrice(product);
  const fittingOption =
    typeof fittingPrice === "number" &&
    Number.isFinite(fittingPrice) &&
    fittingPrice > 0
    ? {
        name: `Fitting for ${product.name}`,
        price: fittingPrice,
        regularPrice: fittingPrice,
      }
    : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-sm text-gray-500 mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/shop/${product.categories[0]?.slug}`}
            className="hover:text-white transition"
          >
            {product.categories[0]?.name || "Shop"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#D3BF89]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-4">
            <div className="aspect-square relative border border-white/10 bg-white/5 rounded-2xl overflow-hidden">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square relative border border-white/10 rounded-lg overflow-hidden bg-white/5"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover hover:opacity-80 transition cursor-pointer"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
              {product.name}
            </h1>

            <div className="text-2xl font-bold text-[#D3BF89] mb-6">
              {formatPrice(currentPrice)}
            </div>

            <div
              className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />

            <div className="mb-8 grid gap-3 border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2">
              {BUYING_REASSURANCE_POINTS.slice(0, 4).map((point) => (
                <div key={point} className="flex items-center gap-3 text-xs text-gray-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end mb-10 border-b border-white/10 pb-10">
              <AddToCartBtn product={product} fittingOption={fittingOption} />
              <Link
                href={enquiryHref}
                className="flex-1 sm:self-end border border-white/20 text-white font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-full hover:bg-white hover:text-black transition text-center"
              >
                Check Fitment
              </Link>
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex gap-4">
                <span className="uppercase tracking-wider min-w-[80px]">SKU:</span>
                <span className="text-white">{product.sku || "N/A"}</span>
              </div>
              <div className="flex gap-4">
                <span className="uppercase tracking-wider min-w-[80px]">Category:</span>
                <div className="flex gap-2">
                  {product.categories.map((category) => (
                    <span
                      key={category.id}
                      className="text-white bg-white/10 px-2 py-0.5 rounded text-xs"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mt-10 pt-10 border-t border-white/10">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-4">
                  Product Details
                </h3>
                <div
                  className="prose prose-invert prose-p:text-gray-400 max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-28 border-t border-white/10 pt-14">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  href={`/product/${relatedProduct.slug}`}
                  key={relatedProduct.id}
                  className="group block"
                >
                  <div className="aspect-square relative overflow-hidden rounded-xl bg-white/5 border border-white/10 mb-4">
                    <Image
                      src={relatedProduct.images[0]?.src || "/placeholder-product.jpg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-[#D3BF89] transition line-clamp-1">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {formatPrice(relatedProduct.sale_price || relatedProduct.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
