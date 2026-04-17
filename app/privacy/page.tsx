import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_EMAIL_LINK,
} from "@/lib/siteContent";

export const metadata = {
  title: "Privacy Policy | FDL Bespoke",
  description: "Our privacy policy and how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">
          Privacy Policy<span className="text-[var(--accent)]">.</span>
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <p className="text-gray-400 text-lg border-l-2 border-[var(--accent)] pl-6">
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect information you provide directly to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Place an order</li>
              <li>Submit an enquiry or quote request</li>
              <li>Contact us for support</li>
              <li>Request updates about a build or product</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              This information may include your name, email address, phone number, vehicle details,
              shipping address, billing address, and payment information where relevant.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Process and fulfil your orders</li>
              <li>Respond to enquiries and quote requests</li>
              <li>Send you order confirmations and progress updates</li>
              <li>Provide customer support</li>
              <li>Improve our products, services, and website experience</li>
              <li>Protect against fraudulent transactions</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">3. Information Sharing</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell your personal information. We may share your information with payment
              processors, delivery partners, service providers that help us run the website, and
              legal authorities where required by law.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">4. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We take appropriate technical and organisational measures to protect your information.
              No method of online transmission is completely secure, but we work to keep your data
              protected and access-limited.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">5. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information where appropriate</li>
              <li>Object to certain processing activities</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">6. Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and similar technologies to improve browsing performance, remember cart
              and preference data, and understand how the site is used.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">7. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:
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
