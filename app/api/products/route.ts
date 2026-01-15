import { NextRequest, NextResponse } from "next/server";
import { getProducts, type GetProductsParams } from "@/lib/woocommerce";

/**
 * GET /api/products
 * 
 * Fetches products from WooCommerce API.
 * This route acts as a proxy to keep API credentials server-side.
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - per_page: Items per page (default: 12)
 * - category: Category ID to filter by
 * - search: Search term
 * - featured: "true" to show only featured products
 * - on_sale: "true" to show only sale items
 * - min_price: Minimum price filter
 * - max_price: Maximum price filter
 * - orderby: Sort field (date, title, price, popularity, rating)
 * - order: Sort order (asc, desc)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build params object from query string
    const params: GetProductsParams = {};
    
    // Pagination
    const page = searchParams.get("page");
    if (page) params.page = parseInt(page);
    
    const perPage = searchParams.get("per_page");
    if (perPage) params.per_page = parseInt(perPage);
    
    // Filters
    const category = searchParams.get("category");
    if (category) params.category = parseInt(category);
    
    const search = searchParams.get("search");
    if (search) params.search = search;
    
    const featured = searchParams.get("featured");
    if (featured === "true") params.featured = true;
    
    const onSale = searchParams.get("on_sale");
    if (onSale === "true") params.on_sale = true;
    
    const minPrice = searchParams.get("min_price");
    if (minPrice) params.min_price = minPrice;
    
    const maxPrice = searchParams.get("max_price");
    if (maxPrice) params.max_price = maxPrice;
    
    const stockStatus = searchParams.get("stock_status") as GetProductsParams["stock_status"];
    if (stockStatus) params.stock_status = stockStatus;
    
    // Sorting
    const orderby = searchParams.get("orderby") as GetProductsParams["orderby"];
    if (orderby) params.orderby = orderby;
    
    const order = searchParams.get("order") as GetProductsParams["order"];
    if (order) params.order = order;
    
    // Fetch products
    const { products, totalPages, totalProducts } = await getProducts(params);
    
    // Return response with pagination info
    return NextResponse.json({
      products,
      pagination: {
        page: params.page || 1,
        perPage: params.per_page || 12,
        totalPages,
        totalProducts,
      },
    }, {
      headers: {
        // Cache for 60 seconds, revalidate in background
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    
    // Return appropriate error response
    const message = error instanceof Error ? error.message : "Failed to fetch products";
    
    return NextResponse.json(
      { 
        error: message,
        products: [],
        pagination: { page: 1, perPage: 12, totalPages: 0, totalProducts: 0 }
      },
      { status: 500 }
    );
  }
}

// Revalidate this route every 60 seconds
export const revalidate = 60;
