export const metadata = {
  title: "Terms & Conditions | FDL Bespoke",
  description: "Terms and conditions for using our website and purchasing our products.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">
          Terms & Conditions<span className="text-[var(--accent-orange)]">.</span>
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <p className="text-gray-400 text-lg border-l-2 border-[var(--accent-orange)] pl-6">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by these Terms and Conditions.
              If you do not agree to these terms, please do not use our website or purchase our products.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">2. Products and Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              All products are subject to availability. We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Limit quantities of products available for purchase</li>
              <li>Discontinue products at any time</li>
              <li>Refuse service to anyone for any reason</li>
              <li>Modify product specifications and pricing without notice</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Product images are for illustrative purposes. Actual products may vary slightly in appearance.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">3. Pricing and Payment</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              All prices are in GBP (£) and include VAT where applicable. We accept the following payment methods:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Credit and debit cards</li>
              <li>PayPal</li>
              <li>Bank transfer</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Payment is required in full before order dispatch. We reserve the right to cancel orders
              if payment cannot be verified.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">4. Shipping and Delivery</h2>
            <p className="text-gray-300 leading-relaxed">
              Delivery times are estimates and may vary. We are not liable for delays caused by carriers,
              customs, or circumstances beyond our control. Title and risk of loss pass to you upon delivery
              to the carrier.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">5. Returns and Refunds</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Please refer to our Returns Policy for detailed information. In summary:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Returns must be requested within 14 days of delivery</li>
              <li>Products must be unused and in original packaging</li>
              <li>Custom or made-to-order items are non-refundable</li>
              <li>Return shipping costs are the customer's responsibility unless the product is defective</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">6. Warranty and Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              Products are covered by manufacturer warranties where applicable. We are not liable for:
              improper installation, misuse, normal wear and tear, or modifications. Our liability is
              limited to the purchase price of the product.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">7. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content on this website, including images, logos, text, and designs, is protected by
              copyright and trademark laws. You may not reproduce, distribute, or use any content without
              our written permission.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">8. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms are governed by the laws of England and Wales. Any disputes shall be subject
              to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">9. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately
              upon posting. Your continued use of the website constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">10. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these Terms & Conditions, please contact us:
            </p>
            <div className="mt-4 text-gray-300">
              <p>Email: <a href="mailto:info@fdlbespoke.com" className="text-[var(--accent-orange)] hover:underline">info@fdlbespoke.com</a></p>
              <p className="mt-2">Address: [Your Business Address]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
