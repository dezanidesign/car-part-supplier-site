import { NextRequest, NextResponse } from "next/server";
import { fetchProductsByCategorySlug } from "@/lib/woo";

/**
 * GET /api/woocommerce/products?categorySlug=xxx
 * 
 * Fetches products from WooCommerce by category slug.
 * Server-side only - credentials never exposed to client.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug");

    if (!categorySlug) {
      return NextResponse.json(
        { error: "categorySlug parameter is required", products: [] },
        { status: 400 }
      );
    }

    const products = await fetchProductsByCategorySlug(categorySlug);

    return NextResponse.json(
      { products },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("WooCommerce products API error:", error);

    const message = error instanceof Error ? error.message : "Failed to fetch products";

    return NextResponse.json(
      {
        error: message,
        products: [],
      },
      { status: 500 }
    );
  }
}

// Revalidate this route every 5 minutes
export const revalidate = 300;
