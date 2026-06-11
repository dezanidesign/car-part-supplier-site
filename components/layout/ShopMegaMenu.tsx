"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles, Wrench } from "lucide-react";
import { SHOP_CATEGORIES } from "@/lib/shopCategories";

type Props = {
  onNavigate?: () => void;
  className?: string;
  variant?: "desktop" | "mobile";
};

const POPULAR_MODEL_SLUGS = [
  "x5-g05",
  "land-rover-defender",
  "range-rover-sport",
  "g-wagon-g63",
  "audi-r8",
  "urus",
];

const REQUEST_PART_HREF =
  "/contact?message=Hi%20FDL%20Bespoke%2C%0A%0AI%27m%20looking%20for%20help%20sourcing%20a%20part.%20Please%20let%20me%20know%20what%20details%20you%20need.";

const ACTIONS = [
  {
    href: "/shop#products",
    label: "Shop All Parts",
    copy: "Go straight to the catalogue.",
    icon: Search,
    primary: true,
  },
  {
    href: "/shop#vehicle-browser",
    label: "Browse by Vehicle",
    copy: "Filter parts by make or model.",
    icon: ArrowRight,
    primary: false,
  },
  {
    href: REQUEST_PART_HREF,
    label: "Request a Part",
    copy: "Ask us to source what is not listed.",
    icon: Sparkles,
    primary: false,
  },
  {
    href: "/contact",
    label: "Request a Quote",
    copy: "Send vehicle details for advice.",
    icon: Wrench,
    primary: false,
  },
];

function getPopularModels() {
  const models = SHOP_CATEGORIES.flatMap((make) =>
    make.models.map((model) => ({
      ...model,
      makeLabel: make.label,
    })),
  );

  return POPULAR_MODEL_SLUGS.map((slug) => models.find((model) => model.slug === slug)).filter(
    Boolean,
  ) as Array<{ label: string; slug: string; makeLabel: string }>;
}

export default function ShopMegaMenu({
  onNavigate,
  className = "",
  variant = "desktop",
}: Props) {
  const popularModels = getPopularModels();
  const isMobile = variant === "mobile";

  return (
    <div
      className={`w-full font-sans normal-case tracking-normal text-white ${
        isMobile
          ? "bg-transparent"
          : "max-h-[calc(100vh-var(--header-offset)-24px)] overflow-y-auto border border-white/10 bg-[#050505] shadow-2xl"
      } ${className}`}
    >
      <div className={isMobile ? "space-y-6" : "space-y-6 p-5 md:p-6"}>
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
              Shop Parts
            </p>
            <h3 className="font-display text-2xl font-bold uppercase leading-tight text-white md:text-3xl">
              Find the right route
            </h3>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-gray-400">
            Shop listed parts, filter by vehicle, or send us the details if you need fitment or sourcing help.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                onClick={onNavigate}
                className={`group flex min-h-[104px] flex-col justify-between border p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/70 ${
                  action.primary
                    ? "border-[var(--accent)] bg-[var(--accent)] text-black hover:bg-white"
                    : "border-white/10 bg-white/[0.03] text-white hover:border-[var(--accent)]/45 hover:bg-white/[0.06]"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold">{action.label}</span>
                  <Icon
                    size={16}
                    className={action.primary ? "text-black" : "text-[var(--accent)]"}
                  />
                </span>
                <span
                  className={`mt-4 text-xs leading-relaxed ${
                    action.primary ? "text-black/70" : "text-gray-400"
                  }`}
                >
                  {action.copy}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.85fr)]">
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                Popular Vehicles
              </p>
              <Link
                href="/shop#vehicle-browser"
                onClick={onNavigate}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 transition-colors hover:text-white"
              >
                View All
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {popularModels.map((model) => (
                <Link
                  key={model.slug}
                  href={`/shop/${model.slug}`}
                  onClick={onNavigate}
                  className="group flex items-center justify-between gap-4 border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-[var(--accent)]/40 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/70"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">
                      {model.label}
                    </span>
                    <span className="text-xs text-gray-500">{model.makeLabel}</span>
                  </span>
                  <ArrowRight
                    size={13}
                    className="shrink-0 text-[var(--accent)] transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
              Browse by Brand
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/shop#products"
                onClick={onNavigate}
                className="border border-white/15 px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/70"
              >
                All Vehicles
              </Link>
              {SHOP_CATEGORIES.map((make) => (
                <Link
                  key={make.slug}
                  href={`/shop?category=${make.slug}#products`}
                  onClick={onNavigate}
                  className="border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-[var(--accent)]/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/70"
                >
                  {make.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 border border-white/10 bg-black/25 p-4">
              <p className="text-sm font-semibold text-white">Not sure what fits?</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                Send your registration, model or part details and we will point you to the best next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
