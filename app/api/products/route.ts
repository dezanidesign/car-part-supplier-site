import { NextRequest, NextResponse } from "next/server";
import {
  getAllProducts,
  fetchProductsByCategorySlug,
  fetchProductsByMakeSlug,
} from "@/lib/woo";

// Force dynamic rendering (uses request.url)
export const dynamic = 'force-dynamic';

/**
 * GET /api/products
 *
 * Query params:
 *   - mode: "all" | "make" | "category" (default: "all")
 *   - categorySlug: required when mode is "make" or "category"
 *   - per_page: number (default 100)
 *
 * Examples:
 *   /api/products                              → all products
 *   /api/products?mode=make&categorySlug=bmw   → BMW + all BMW child categories (X5, X7, etc.)
 *   /api/products?mode=category&categorySlug=x5-g05 → single category only
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const mode = searchParams.get("mode") || "all";
    const categorySlug = searchParams.get("categorySlug")?.trim() || "";
    const perPage = Math.min(Number(searchParams.get("per_page")) || 100, 100);

    let products = [];

    switch (mode) {
      case "make":
        // Fetch products from parent category + all children
        // e.g., BMW → gets BMW + X5 G05 + X5 G05 LCI + X7 + etc.
        if (!categorySlug) {
          return NextResponse.json(
            { error: "categorySlug is required for mode=make", products: [] },
            { status: 400 }
          );
        }
        console.log(`[API /products] Fetching make: ${categorySlug}`);
        products = await fetchProductsByMakeSlug(categorySlug);
        console.log(`[API /products] Found ${products.length} products for make: ${categorySlug}`);
        break;

      case "category":
        // Fetch products from a single category only
        if (!categorySlug) {
          return NextResponse.json(
            { error: "categorySlug is required for mode=category", products: [] },
            { status: 400 }
          );
        }
        console.log(`[API /products] Fetching single category: ${categorySlug}`);
        products = await fetchProductsByCategorySlug(categorySlug);
        break;

      case "all":
      default:
        // Fetch all products (handles pagination internally)
        console.log(`[API /products] Fetching all products`);
        products = await getAllProducts(perPage);
        break;
    }

    return NextResponse.json({
      products,
      count: products.length,
      mode,
      categorySlug: categorySlug || null,
    });
  } catch (error) {
    console.error("[API /products] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch products";
    return NextResponse.json({ error: message, products: [] }, { status: 500 });
  }
}
