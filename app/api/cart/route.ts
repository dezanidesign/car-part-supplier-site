import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP_URL = process.env.WOOCOMMERCE_URL;
const STORE_API_BASE = `${WP_URL}/wp-json/wc/store/v1`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCartToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("wc_cart_token")?.value;
}

function setCartTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set("wc_cart_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

async function fetchStoreAPI(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: any; token?: string }> {
  const token = await getCartToken();
  
  const response = await fetch(`${STORE_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Cart-Token": token }),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  const data = await response.json();
  const newToken = response.headers.get("Cart-Token");
  
  return { data, token: newToken || token };
}

// ============================================================================
// GET /api/cart - Fetch current cart
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { data, token } = await fetchStoreAPI("/cart");
    
    const response = NextResponse.json({
      items: data.items || [],
      totals: data.totals || {},
      itemCount: data.items_count || 0,
      needsShipping: data.needs_shipping || false,
      coupons: data.coupons || [],
    });
    
    if (token) {
      setCartTokenCookie(response, token);
    }
    
    return response;
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart", items: [], totals: {}, itemCount: 0 },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/cart - Add item to cart
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.productId || !body.quantity) {
      return NextResponse.json(
        { error: "productId and quantity are required" },
        { status: 400 }
      );
    }
    
    const { data, token } = await fetchStoreAPI("/cart/add-item", {
      method: "POST",
      body: JSON.stringify({
        id: body.productId,
        quantity: body.quantity,
        variation: body.variation || [],
      }),
    });
    
    const response = NextResponse.json({
      success: true,
      cart: {
        items: data.items || [],
        totals: data.totals || {},
        itemCount: data.items_count || 0,
      },
    });
    
    if (token) {
      setCartTokenCookie(response, token);
    }
    
    return response;
  } catch (error) {
    console.error("Cart POST error:", error);
    const message = error instanceof Error ? error.message : "Failed to add item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// PUT /api/cart - Update item quantity
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.key || body.quantity === undefined) {
      return NextResponse.json(
        { error: "key and quantity are required" },
        { status: 400 }
      );
    }
    
    const { data, token } = await fetchStoreAPI("/cart/update-item", {
      method: "POST",
      body: JSON.stringify({
        key: body.key,
        quantity: body.quantity,
      }),
    });
    
    const response = NextResponse.json({
      success: true,
      cart: {
        items: data.items || [],
        totals: data.totals || {},
        itemCount: data.items_count || 0,
      },
    });
    
    if (token) {
      setCartTokenCookie(response, token);
    }
    
    return response;
  } catch (error) {
    console.error("Cart PUT error:", error);
    const message = error instanceof Error ? error.message : "Failed to update item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/cart - Remove item from cart
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    
    if (!key) {
      return NextResponse.json(
        { error: "key parameter is required" },
        { status: 400 }
      );
    }
    
    const { data, token } = await fetchStoreAPI("/cart/remove-item", {
      method: "POST",
      body: JSON.stringify({ key }),
    });
    
    const response = NextResponse.json({
      success: true,
      cart: {
        items: data.items || [],
        totals: data.totals || {},
        itemCount: data.items_count || 0,
      },
    });
    
    if (token) {
      setCartTokenCookie(response, token);
    }
    
    return response;
  } catch (error) {
    console.error("Cart DELETE error:", error);
    const message = error instanceof Error ? error.message : "Failed to remove item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
