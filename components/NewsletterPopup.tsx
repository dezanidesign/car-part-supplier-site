"use client";

import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import Link from "next/link";

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    // Check if user has already seen/dismissed the popup
    const hasSeenPopup = localStorage.getItem("newsletter-popup-seen");
    const hasSubscribed = localStorage.getItem("newsletter-subscribed");

    if (hasSeenPopup || hasSubscribed) {
      return;
    }

    // Show popup after 10 seconds of browsing (non-annoying delay)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("newsletter-popup-seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace with your actual newsletter API endpoint
    // For now, just simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSuccess(true);
    localStorage.setItem("newsletter-subscribed", "true");

    // Close popup after showing success message
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-[#111] border border-white/20 max-w-md w-full p-8 relative pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {!isSuccess ? (
            <>
              {/* Icon */}
              <div className="w-12 h-12 bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 flex items-center justify-center mb-6">
                <Mail className="text-[var(--accent-orange)]" size={24} />
              </div>

              {/* Heading */}
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white mb-2">
                Stay Updated<span className="text-[var(--accent-orange)]">.</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Get exclusive access to new products, special offers, and styling inspiration.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-orange)] placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-orange)] placeholder:text-gray-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--accent-orange)] text-black font-bold uppercase tracking-[0.2em] py-3 hover:brightness-110 transition disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>

              {/* Terms */}
              <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                By subscribing, you agree to receive marketing emails.{" "}
                <Link href="/privacy" className="text-gray-400 hover:text-white underline">
                  Privacy Policy
                </Link>
                {" "}and{" "}
                <Link href="/terms" className="text-gray-400 hover:text-white underline">
                  Terms
                </Link>
                .
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2">
                You're In!
              </h3>
              <p className="text-gray-400 text-sm">
                Thanks for subscribing. Check your inbox soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
