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

    // Build Woo order payload
    const orderPayload = {
      status: "pending",
      payment_method: "", // Woo will let user pick at checkout
      payment_method_title: "",
      set_paid: false,
      line_items: items.map((i) => ({
        product_id: i.productId,
        quantity: Math.max(1, Math.floor(i.quantity || 1)),
      })),
      // Optional: add meta so you can trace orders back to storefront
      meta_data: [{ key: "source", value: "fdl-next-storefront" }],
    };

    const auth = Buffer.from(`${ck}:${cs}`).toString("base64");

    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
      // Don't let Next cache this
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Woo order create failed", detail: text }, { status: 500 });
    }

    const order = await res.json();

    // Woo often returns a "payment_url" when supported; if not, you can construct order-pay URL using order.id + order.order_key
    const paymentUrl: string | undefined =
      order?.payment_url ||
      (order?.id && order?.order_key
        ? `${baseUrl.replace(/\/$/, "")}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`
        : undefined);

    if (!paymentUrl) {
      return NextResponse.json({ error: "No payment URL returned", order }, { status: 500 });
    }

    return NextResponse.json({ paymentUrl, orderId: order.id });
  } catch (err) {
    return NextResponse.json({ error: "Checkout error", detail: String(err) }, { status: 500 });
  }
}
