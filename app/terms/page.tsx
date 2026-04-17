import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_EMAIL_LINK,
} from "@/lib/siteContent";

export const metadata = {
  title: "Terms & Conditions | FDL Bespoke",
  description: "Terms and conditions for using our website and purchasing our products.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">
          Terms & Conditions<span className="text-[var(--accent)]">.</span>
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <p className="text-gray-400 text-lg border-l-2 border-[var(--accent)] pl-6">
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using this website, you agree to these terms. If you do not agree,
              please do not use the website or place an order.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">2. Products and Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              All products and services are subject to availability. We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Limit quantities available for purchase</li>
              <li>Discontinue or amend products at any time</li>
              <li>Refuse service where necessary</li>
              <li>Update specifications or pricing without notice</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">3. Pricing and Payment</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              All prices are in GBP and include VAT where applicable unless stated otherwise.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Card and cash payments are accepted</li>
              <li>Payment is required before order dispatch unless agreed otherwise</li>
              <li>We may cancel orders if payment cannot be verified</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">4. Shipping and Delivery</h2>
            <p className="text-gray-300 leading-relaxed">
              Delivery times are estimates only. We are not responsible for delays caused by carriers,
              customs, supplier delays, or circumstances beyond our control.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">5. Returns and Refunds</h2>
            <p className="text-gray-300 leading-relaxed">
              Please refer to our Returns Policy for full details. Custom-made, painted, or fitted
              items may be excluded unless faulty.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">6. Warranty and Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              Manufacturer warranties apply where available. We are not liable for misuse, incorrect
              installation by third parties, normal wear and tear, or unauthorised modifications.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">7. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content on this website, including imagery, branding, text, and design, remains
              the property of FDL Bespoke unless stated otherwise and may not be reused without permission.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">8. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms are governed by the laws of England and Wales. Any disputes are subject to
              the jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">9. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these terms, please contact us:
            </p>
            <div className="mt-4 text-gray-300">
              <p>Email: <a href={SITE_EMAIL_LINK} className="text-[var(--accent)] hover:underline">{SITE_EMAIL}</a></p>
              <p className="mt-2">Address: {SITE_ADDRESS}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
