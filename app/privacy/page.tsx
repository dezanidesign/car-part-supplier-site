export const metadata = {
  title: "Privacy Policy | FDL Bespoke",
  description: "Our privacy policy and how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">
          Privacy Policy<span className="text-[var(--accent-orange)]">.</span>
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <p className="text-gray-400 text-lg border-l-2 border-[var(--accent-orange)] pl-6">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect information you provide directly to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Create an account or place an order</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us for support</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              This information may include: name, email address, phone number, shipping address,
              billing address, and payment information.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and shipping updates</li>
              <li>Respond to your comments and questions</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Protect against fraudulent transactions</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">3. Information Sharing</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-4">
              <li><strong>Service providers:</strong> Payment processors, shipping companies, and email service providers</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business transfers:</strong> In connection with a merger, sale, or acquisition</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">4. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate security measures to protect your personal information. However,
              no method of transmission over the Internet is 100% secure. We use SSL encryption for
              all transactions and store sensitive data securely.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">5. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">6. Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and similar technologies to improve your browsing experience, analyze
              site traffic, and personalize content. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">7. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 text-gray-300">
              <p>Email: <a href="mailto:privacy@fdlbespoke.com" className="text-[var(--accent-orange)] hover:underline">privacy@fdlbespoke.com</a></p>
              <p className="mt-2">Address: [Your Business Address]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
