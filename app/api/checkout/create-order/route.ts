import { NextResponse } from "next/server";

type IncomingItem = {
  productId: number;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as { items: IncomingItem[] };

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const ck = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const cs = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!baseUrl || !ck || !cs) {
      return NextResponse.json({ error: "Missing WooCommerce env vars" }, { status: 500 });
    }

    // Build minimal WooCommerce order payload
    const orderPayload = {
      status: "pending",
      set_paid: false,
      line_items: items.map((i) => ({
        product_id: i.productId,
        quantity: Math.max(1, Math.floor(i.quantity || 1)),
      })),
      meta_data: [
        { key: "source", value: "fdl-next-storefront" },
        { key: "_created_via", value: "storefront" },
      ],
    };

    const auth = Buffer.from(`${ck}:${cs}`).toString("base64");

    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[create-order] WooCommerce API error:", text);
      return NextResponse.json({ error: "Failed to create order", detail: text }, { status: 500 });
    }

    const order = await res.json();

    // Construct WooCommerce checkout URL with order details
    // Customer will fill in their info on WooCommerce checkout page
    const paymentUrl =
      order?.payment_url ||
      (order?.id && order?.order_key
        ? `${baseUrl.replace(/\/$/, "")}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`
        : undefined);

    if (!paymentUrl) {
      console.error("[create-order] No payment URL available:", order);
      return NextResponse.json({ error: "No payment URL available" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl,
    });
  } catch (err) {
    console.error("[create-order] Error:", err);
    return NextResponse.json({ error: "Checkout error", detail: String(err) }, { status: 500 });
  }
}
