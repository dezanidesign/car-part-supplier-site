import Link from "next/link";
import Image from "next/image";
import {
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  ApplePayIcon,
  ContactlessIcon,
} from "../icons/PaymentIcons";
import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_HOURS,
  SITE_LOCATION,
  SITE_LOGO_PATH,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_LINK,
} from "@/lib/siteContent";

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-16 md:py-20 px-6 md:px-16 border-t border-white/10 text-white">
      <div className="max-w-[1920px] mx-auto">
        {/* Top: Logo */}
        <div className="mb-12 md:mb-16">
          <Image
            src={SITE_LOGO_PATH}
            alt="FDL Bespoke"
            width={64}
            height={64}
            className="w-14 mb-4 opacity-50"
          />
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">
            Automotive Styling UK
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          {/* General Info */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-5">
              General Info
            </h4>
            <div className="flex flex-col gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span className="normal-case text-xs text-gray-300 font-normal leading-relaxed">
                Located in: {SITE_LOCATION}
                <br />
                {SITE_ADDRESS}
              </span>
              <span className="normal-case text-xs text-gray-400 font-normal leading-relaxed">
                {SITE_HOURS[0]}
                <br />
                {SITE_HOURS[1]}
                <br />
                {SITE_HOURS[2]}
              </span>
              <a
                href={SITE_PHONE_LINK}
                className="hover:text-[var(--accent)] transition-colors"
              >
                {SITE_PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="hover:text-[var(--accent)] transition-colors normal-case"
              >
                {SITE_EMAIL}
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-5">
              Legal
            </h4>
            <div className="flex flex-col gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/returns"
                className="hover:text-white transition-colors"
              >
                Returns Policy
              </Link>
              <Link
                href="/admin/login"
                className="hover:text-white transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-5">
              Company
            </h4>
            <div className="flex flex-col gap-3 text-[10px] text-gray-400">
              <div>
                <span className="font-bold uppercase tracking-widest block mb-1">
                  Company No.
                </span>
                <span className="text-gray-300 font-mono">15331132</span>
              </div>
              <div>
                <span className="font-bold uppercase tracking-widest block mb-1">
                  VAT No.
                </span>
                <span className="text-gray-500 font-mono">&mdash;</span>
              </div>
              <div className="flex gap-3 mt-2">
                <a
                  href="https://www.instagram.com/fdlbespoke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/fdlbespoke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-5">
              Payment
            </h4>
            <p className="text-gray-400 text-xs mb-4">
              Card & Cash Payments Accepted
            </p>
            <div className="flex flex-wrap gap-2">
              <VisaIcon />
              <MastercardIcon />
              <AmexIcon />
              <ApplePayIcon />
              <ContactlessIcon />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-700 uppercase tracking-widest">
          <span>
            &copy; {currentYear} FDL Bespoke. All rights reserved.
          </span>
          <span className="text-gray-800">
            {SITE_LOCATION} · {SITE_ADDRESS}
          </span>
        </div>
      </div>
    </footer>
  );
}
