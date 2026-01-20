export const metadata = {
  title: "Returns & Refunds | FDL Bespoke",
  description: "Our returns and refunds policy.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">
          Returns & Refunds<span className="text-[var(--accent-orange)]">.</span>
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <p className="text-gray-400 text-lg border-l-2 border-[var(--accent-orange)] pl-6">
            We want you to be completely satisfied with your purchase.
          </p>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">14-Day Return Policy</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have 14 days from the date of delivery to return eligible items for a refund or exchange.
              To be eligible for a return:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Item must be unused and in the same condition as received</li>
              <li>Item must be in original packaging with all tags and labels</li>
              <li>Proof of purchase (order number or receipt) must be provided</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">Non-Returnable Items</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Custom or made-to-order products</li>
              <li>Items marked as "final sale"</li>
              <li>Products that have been installed or fitted</li>
              <li>Items with broken seals or tampered packaging</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">How to Initiate a Return</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-3 ml-4">
              <li>
                <strong>Contact us:</strong> Email{' '}
                <a href="mailto:returns@fdlbespoke.com" className="text-[var(--accent-orange)] hover:underline">
                  returns@fdlbespoke.com
                </a>{' '}
                with your order number and reason for return
              </li>
              <li><strong>Receive authorization:</strong> We'll provide a Return Authorization (RA) number and instructions</li>
              <li><strong>Pack the item:</strong> Securely package the item in its original packaging</li>
              <li><strong>Ship the item:</strong> Send to the address provided with your RA number clearly marked</li>
            </ol>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">Shipping Costs</h2>
            <p className="text-gray-300 leading-relaxed">
              Return shipping costs are the customer's responsibility unless the item is defective or
              we shipped the wrong product. We recommend using a tracked shipping service as we cannot
              guarantee receipt of untracked returns.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">Refund Processing</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Once we receive and inspect your return:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>You'll receive email confirmation of receipt</li>
              <li>Inspection typically takes 2-3 business days</li>
              <li>Approved refunds are processed within 5-7 business days</li>
              <li>Refunds are issued to the original payment method</li>
              <li>A restocking fee of 15% may apply to opened items</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">Exchanges</h2>
            <p className="text-gray-300 leading-relaxed">
              If you need to exchange an item for a different size, color, or product, please contact
              us first. Exchanges are subject to stock availability. The fastest way is to return the
              original item and place a new order.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">Damaged or Defective Items</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you receive a damaged or defective item:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Contact us within 48 hours of delivery</li>
              <li>Provide photos of the damage or defect</li>
              <li>We'll arrange a replacement or full refund at no cost to you</li>
              <li>Return shipping will be prepaid</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              Questions about returns? We're here to help:
            </p>
            <div className="mt-4 text-gray-300">
              <p>Email: <a href="mailto:returns@fdlbespoke.com" className="text-[var(--accent-orange)] hover:underline">returns@fdlbespoke.com</a></p>
              <p className="mt-2">Phone: [Your Phone Number]</p>
              <p className="mt-2">Hours: Monday-Friday, 9am-5pm GMT</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
