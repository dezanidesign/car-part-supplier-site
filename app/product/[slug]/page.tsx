import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProductBySlug, fetchRelatedProducts } from "@/lib/woo";
import type { WooProduct } from "@/lib/woo";
import AddToCartBtn from "@/components/product/AddToCartBtn";

// Helper to format price
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
  // --- DEBUG START ---
  console.log(`[ProductPage] Loading page for slug: "${params.slug}"`);
  
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    console.error(`[ProductPage] ❌ Product NOT found for slug: "${params.slug}"`);
    // This triggers the 404 page
    return notFound();
  }

  console.log(`[ProductPage] ✅ Found product: "${product.name}" (ID: ${product.id})`);
  // --- DEBUG END ---

  const relatedProducts = await fetchRelatedProducts(product);
  const mainImage = product.images[0]?.src || "/placeholder-product.jpg";
  const currentPrice = product.sale_price || product.price;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* BREADCRUMB */}
        <div className="text-sm text-gray-500 mb-8 uppercase tracking-widest">
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2">/</span>
          <a href={`/shop/${product.categories[0]?.slug}`} className="hover:text-white transition">
            {product.categories[0]?.name || "Shop"}
          </a>
          <span className="mx-2">/</span>
          <span className="text-[#FF4D00]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT: IMAGE GALLERY */}
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
                {product.images.map((img) => (
                  <div key={img.id} className="aspect-square relative border border-white/10 rounded-lg overflow-hidden bg-white/5">
                    <Image
                      src={img.src}
                      alt={img.alt || product.name}
                      fill
                      className="object-cover hover:opacity-80 transition cursor-pointer"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div>
            <h1 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
              {product.name}
            </h1>

            <div className="text-2xl font-bold text-[#FF4D00] mb-6">
              {formatPrice(currentPrice)}
            </div>

            <div 
              className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: product.short_description }} 
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-10 border-b border-white/10 pb-10">
              <AddToCartBtn product={product} />
              <button className="flex-1 border border-white/20 text-white font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-full hover:bg-white hover:text-black transition">
                Enquire
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex gap-4">
                <span className="uppercase tracking-wider min-w-[80px]">SKU:</span>
                <span className="text-white">{product.sku || "N/A"}</span>
              </div>
              <div className="flex gap-4">
                <span className="uppercase tracking-wider min-w-[80px]">Category:</span>
                <div className="flex gap-2">
                  {product.categories.map(c => (
                    <span key={c.id} className="text-white bg-white/10 px-2 py-0.5 rounded text-xs">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mt-10 pt-10 border-t border-white/10">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-4">Product Details</h3>
                <div 
                  className="prose prose-invert prose-p:text-gray-400 max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }} 
                />
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 border-t border-white/10 pt-14">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <a href={`/product/${p.slug}`} key={p.id} className="group block">
                  <div className="aspect-square relative overflow-hidden rounded-xl bg-white/5 border border-white/10 mb-4">
                    <Image
                      src={p.images[0]?.src || "/placeholder-product.jpg"}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-[#FF4D00] transition line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-gray-500 mt-1">{formatPrice(p.sale_price || p.price)}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}