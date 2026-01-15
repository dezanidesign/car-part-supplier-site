import Link from "next/link";
import Image from "next/image";

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-20 px-6 md:px-16 border-t border-white/10 text-white">
      <div className="max-w-[1920px] mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          {/* Logo & Tagline */}
          <div>
            <Image
              src="https://fdlbespoke.co.uk/wp-content/uploads/2025/06/cropped-cropped-FDL-UK-Logo-White-Sq.png"
              alt="FDL Bespoke"
              width={64}
              height={64}
              className="w-16 mb-6 opacity-50"
            />
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">
              Automotive Styling UK
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {/* Services */}
            <div className="flex flex-col gap-4">
              <span className="text-white mb-2">Services</span>
              <Link
                href="/customisation/bodykits"
                className="hover:text-white transition-colors"
              >
                Bodykits
              </Link>
              <Link
                href="/customisation/alloys"
                className="hover:text-white transition-colors"
              >
                Alloy Wheels
              </Link>
              <Link
                href="/customisation/styling"
                className="hover:text-white transition-colors"
              >
                Styling
              </Link>
              <Link
                href="/customisation/interiors"
                className="hover:text-white transition-colors"
              >
                Interiors
              </Link>
            </div>

            {/* Shop */}
            <div className="flex flex-col gap-4">
              <span className="text-white mb-2">Shop</span>
              <Link href="/shop" className="hover:text-white transition-colors">
                All Products
              </Link>
              <Link
                href="/shop?category=wheels"
                className="hover:text-white transition-colors"
              >
                Wheels
              </Link>
              <Link
                href="/shop?category=bodykits"
                className="hover:text-white transition-colors"
              >
                Body Kits
              </Link>
              <Link
                href="/shop?on_sale=true"
                className="hover:text-white transition-colors"
              >
                On Sale
              </Link>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-4">
              <span className="text-white mb-2">Company</span>
              <Link href="/info" className="hover:text-white transition-colors">
                About Us
              </Link>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
              <a
                href="https://www.instagram.com/fdlbespoke"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/fdlbespoke"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Facebook
              </a>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4">
              <span className="text-white mb-2">Contact</span>
              <a
                href="tel:07869022673"
                className="hover:text-[var(--accent-orange)] transition-colors"
              >
                07869 022673
              </a>
              <a
                href="mailto:info@fdlbespoke.co.uk"
                className="hover:text-[var(--accent-orange)] transition-colors"
              >
                Email Us
              </a>
              <span className="text-gray-600 normal-case">
                Thu-Sat 10am - Close
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-800 uppercase tracking-widest">
          <span>&copy; {currentYear} FDL Bespoke. All rights reserved.</span>
          <span>Unit C3, 511 Bradford Rd, Batley WF17 8LL</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-500 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
