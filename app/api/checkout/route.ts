import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP_URL = process.env.WOOCOMMERCE_URL;
const STORE_API_BASE = `${WP_URL}/wp-json/wc/store/v1`;

// ============================================================================
// TYPES
// ============================================================================

interface CheckoutData {
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    postcode: string;
    country: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  ship_to_different_address?: boolean;
  customer_note?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCartToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("wc_cart_token")?.value;
}

// ============================================================================
// POST /api/checkout - Process checkout
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutData = await request.json();
    const token = await getCartToken();
    
    if (!token) {
      return NextResponse.json(
        { error: "No cart found. Please add items to your cart first." },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const requiredFields = ["first_name", "last_name", "email", "address_1", "city", "postcode", "country"];
    const missingFields = requiredFields.filter(field => !body.billing[field as keyof typeof body.billing]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }
    
    // Prepare shipping address (use billing if not provided)
    const shippingAddress = body.ship_to_different_address && body.shipping
      ? body.shipping
      : {
          first_name: body.billing.first_name,
          last_name: body.billing.last_name,
          address_1: body.billing.address_1,
          address_2: body.billing.address_2,
          city: body.billing.city,
          state: body.billing.state,
          postcode: body.billing.postcode,
          country: body.billing.country,
        };
    
    // Process checkout via WooCommerce Store API
    const response = await fetch(`${STORE_API_BASE}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": token,
      },
      body: JSON.stringify({
        billing_address: body.billing,
        shipping_address: shippingAddress,
        payment_method: body.payment_method,
        customer_note: body.customer_note || "",
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error("Checkout error:", result);
      return NextResponse.json(
        { error: result.message || "Checkout failed" },
        { status: response.status }
      );
    }
    
    // Handle different payment results
    if (result.payment_result?.payment_status === "success") {
      // Payment completed (e.g., cash on delivery, bank transfer)
      return NextResponse.json({
        success: true,
        orderId: result.order_id,
        orderKey: result.order_key,
        status: "completed",
        redirectUrl: `/order-confirmation/${result.order_id}`,
      });
    } else if (result.payment_result?.redirect_url) {
      // Redirect to payment gateway
      return NextResponse.json({
        success: true,
        orderId: result.order_id,
        orderKey: result.order_key,
        status: "pending_payment",
        redirectUrl: result.payment_result.redirect_url,
      });
    }
    
    // Default response
    return NextResponse.json({
      success: true,
      orderId: result.order_id,
      orderKey: result.order_key,
      status: result.status || "pending",
      redirectUrl: `/order-confirmation/${result.order_id}`,
    });
    
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================================================
// GET /api/checkout - Get available payment methods and shipping options
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const token = await getCartToken();
    
    // Fetch available payment gateways
    const paymentResponse = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
        ).toString("base64")}`,
      },
    });
    
    const paymentGateways = await paymentResponse.json();
    const enabledGateways = Array.isArray(paymentGateways) 
      ? paymentGateways.filter((g: any) => g.enabled)
      : [];
    
    // If we have a cart, fetch shipping options
    let shippingOptions: any[] = [];
    if (token) {
      const shippingResponse = await fetch(`${STORE_API_BASE}/cart`, {
        headers: { "Cart-Token": token },
      });
      const cart = await shippingResponse.json();
      shippingOptions = cart.shipping_rates || [];
    }
    
    return NextResponse.json({
      paymentMethods: enabledGateways.map((g: any) => ({
        id: g.id,
        title: g.title,
        description: g.description,
      })),
      shippingOptions,
    });
    
  } catch (error) {
    console.error("Checkout GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch checkout options", paymentMethods: [], shippingOptions: [] },
      { status: 500 }
    );
  }
}
