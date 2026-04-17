import {
  SITE_EMAIL,
  SITE_EMAIL_LINK,
  SITE_HOURS,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_LINK,
} from "@/lib/siteContent";

export const metadata = {
  title: "Returns & Refunds | FDL Bespoke",
  description: "Our returns and refunds policy.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">
          Returns & Refunds<span className="text-[var(--accent)]">.</span>
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <p className="text-gray-400 text-lg border-l-2 border-[var(--accent)] pl-6">
            We want you to be completely satisfied with your purchase.
          </p>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">14-Day Return Policy</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have 14 days from the date of delivery to request a return for eligible items.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Items must be unused and in the same condition as received</li>
              <li>Original packaging, tags, and proof of purchase must be included</li>
              <li>Custom-made, painted, or fitted items are not eligible unless faulty</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">How to Start a Return</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-3 ml-4">
              <li>
                Contact us first at{" "}
                <a href={SITE_EMAIL_LINK} className="text-[var(--accent)] hover:underline">
                  {SITE_EMAIL}
                </a>
                {" "}with your order number and reason for return.
              </li>
              <li>Wait for return authorisation and instructions before sending anything back.</li>
              <li>Package the item securely and include any requested reference details.</li>
            </ol>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">Refund Processing</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Once your return is received and inspected, we will confirm the outcome by email.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Inspection normally takes 2-3 business days</li>
              <li>Approved refunds are issued to the original payment method</li>
              <li>Return shipping is the customer&apos;s responsibility unless the item is faulty or incorrect</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">Damaged or Incorrect Items</h2>
            <p className="text-gray-300 leading-relaxed">
              If your order arrives damaged, defective, or incorrect, contact us within 48 hours of
              delivery with clear photos and your order details so we can resolve it quickly.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              Questions about returns? We&apos;re here to help:
            </p>
            <div className="mt-4 text-gray-300">
              <p>Email: <a href={SITE_EMAIL_LINK} className="text-[var(--accent)] hover:underline">{SITE_EMAIL}</a></p>
              <p className="mt-2">Phone: <a href={SITE_PHONE_LINK} className="text-[var(--accent)] hover:underline">{SITE_PHONE_DISPLAY}</a></p>
              <p className="mt-2">Hours: {SITE_HOURS[0]}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
