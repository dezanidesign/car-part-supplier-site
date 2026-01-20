import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/woo";

/**
 * GET /api/products/featured
 * Returns a random selection of products for the homepage carousel
 */
export async function GET() {
  try {
    const allProducts = await getAllProducts();

    // Filter to products with images
    const productsWithImages = allProducts.filter(
      (p) => p.images && p.images.length > 0 && p.images[0]?.src
    );

    if (productsWithImages.length === 0) {
      return NextResponse.json([]);
    }

    // Select 5 random products
    const shuffled = [...productsWithImages].sort(() => Math.random() - 0.5);
    const featured = shuffled.slice(0, 5);

    // Map to simplified format for carousel
    const simplified = featured.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: parseFloat(p.price) || 0,
      category: p.categories?.[0]?.name || "Products",
      image: p.images[0]?.src || "",
    }));

    return NextResponse.json(simplified);
  } catch (error) {
    console.error("[featured-products] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
