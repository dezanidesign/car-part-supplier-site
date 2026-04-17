import type { CuratedMediaItem } from "@/lib/curatedMedia";
import {
  COLLECTION_DELIVERY_MEDIA,
  SERVICE_ENTRY_MEDIA,
  SERVICE_MEDIA,
} from "@/lib/curatedMedia";

export type ServiceFaqItem = {
  q: string;
  a: string;
};

export type ServiceSubItem = {
  name: string;
  desc: string;
};

export type ServiceItem = {
  id: string;
  slug: string;
  num: string;
  title: string;
  subtitle?: string;
  description: string;
  subServices: ServiceSubItem[];
  badge?: string;
  media: CuratedMediaItem;
  faq?: ServiceFaqItem[];
  chips?: string[];
};

export const SERVICES: ServiceItem[] = [
  {
    id: "bodykits",
    slug: "bodykits",
    num: "01",
    title: "Bodykits",
    description:
      "Transform the profile of your vehicle with precision-fitted performance bodykits. From subtle enhancements to full wide-body conversions, every panel is aligned with OEM-level accuracy.",
    subServices: [
      { name: "Performance Bodykits", desc: "Full wide-body and aero packages from leading manufacturers." },
      { name: "Exterior Splitter Kits", desc: "Front splitters, side skirts, and rear diffusers for aggressive stance." },
      { name: "Carbon Fibre", desc: "Genuine carbon fibre components - bonnets, mirrors, spoilers, and trim." },
      { name: "Facelift Conversions", desc: "Factory-level upgrades to bring your vehicle up to latest-model specification." },
    ],
    media: SERVICE_MEDIA.bodykits,
  },
  {
    id: "alloy-refurb",
    slug: "alloy-wheel-refurbishment",
    num: "02",
    title: "Alloy Wheels Refurbishment",
    description:
      "Restore or completely transform your alloys with our expert refurbishment services. From kerb damage repair to full custom finishes.",
    subServices: [
      { name: "Powdercoating", desc: "Durable, high-quality colour finishes with industry-standard powder coating." },
      { name: "Diamond Cutting", desc: "CNC precision diamond-cut finish for a factory-fresh look." },
      { name: "Custom Coatings", desc: "Bespoke colour matching and multi-tone finishes." },
      { name: "Buckles & Welding Repairs", desc: "Structural repairs including buckle straightening and alloy welding." },
    ],
    media: SERVICE_MEDIA["alloy-refurb"],
  },
  {
    id: "privacy-glass",
    slug: "privacy-glass",
    num: "03",
    title: "Privacy Glass",
    description:
      "Premium window tinting with Enkahnz ceramic films - 99% UV rejection, heat reduction, and enhanced privacy. Full panel disassembly for flawless, edge-to-edge coverage.",
    subServices: [
      { name: "Window Tints", desc: "Automotive tinting in a range of shades from light to limo black." },
      { name: "Commercial Tinting", desc: "Building and office window films for privacy, heat reduction, and branding." },
    ],
    media: SERVICE_MEDIA["privacy-glass"],
    faq: [
      { q: "Is window tinting legal in the UK?", a: "Front windscreen must allow 75% light through, front sides 70%. Rear windows have no restriction. We ensure all tints meet legal requirements." },
      { q: "How long does tinting take?", a: "A full vehicle typically takes 2-4 hours. We remove panels for a flawless finish with no visible edges." },
      { q: "Will tinting affect my visibility at night?", a: "Our ceramic films maintain excellent clarity. We recommend lighter shades for drivers who frequently drive at night." },
      { q: "How long does window tint last?", a: "Our Enkahnz ceramic films come with a lifetime warranty against peeling, bubbling, and discolouration." },
    ],
  },
  {
    id: "light-tinting",
    slug: "headlight-tail-light-tinting",
    num: "04",
    title: "Headlight & Taillight Tinting",
    description:
      "Subtle smoke or full blackout tinting for headlights and taillights. Precision-applied film that transforms the look of your vehicle while maintaining light output.",
    subServices: [
      { name: "Headlight Tinting", desc: "Light smoke to medium tint options that maintain brightness and legality." },
      { name: "Taillight Tinting", desc: "Full blackout or tinted finishes for a sleek, murdered-out aesthetic." },
    ],
    media: SERVICE_MEDIA["light-tinting"],
  },
  {
    id: "wrapping",
    slug: "vehicle-wrapping",
    num: "05",
    title: "Vehicle Wrapping",
    description:
      "Complete colour changes, partial wraps, and commercial branding using premium vinyl from 3M and Avery Dennison. A cost-effective alternative to a full respray.",
    subServices: [
      { name: "Full Wraps", desc: "Complete colour change wraps in gloss, matte, satin, or chrome finishes." },
      { name: "Partial Wraps", desc: "Roof wraps, bonnet wraps, mirror caps, and accent panels." },
      { name: "Dechroming", desc: "Black-out or colour-match chrome trim for a cleaner, modern aesthetic." },
      { name: "Fleet Branding", desc: "Commercial vehicle livery and fleet graphics for businesses." },
    ],
    media: SERVICE_MEDIA.wrapping,
  },
  {
    id: "detailing-ppf",
    slug: "detailing-and-ppf",
    num: "06",
    title: "Detailing & PPF",
    description:
      "Protect your paintwork with the latest in ceramic coatings and paint protection film. Our accredited installers deliver showroom finishes that last.",
    subServices: [
      { name: "Ceramic Coatings", desc: "Multi-layer ceramic protection for paint, wheels, and glass. Hydrophobic and UV resistant." },
      { name: "Paint Protection Film", desc: "Self-healing PPF applied to high-impact areas or full vehicle coverage." },
    ],
    media: SERVICE_MEDIA["detailing-ppf"],
  },
  {
    id: "security",
    slug: "vehicle-security",
    num: "07",
    title: "Vehicle Security",
    subtitle: "Protect Your Investment",
    description:
      "Certified installation of leading vehicle security systems. From immobilisers to tracking, we provide complete peace of mind for your vehicle.",
    subServices: [
      { name: "Ghost Immobiliser", desc: "Autowatch Ghost II - the ultimate aftermarket immobiliser. Undetectable and insurance approved." },
      { name: "Trackers", desc: "GPS tracking systems with 24/7 monitoring and smartphone alerts." },
      { name: "Dashcams", desc: "Front and rear dashcam installation with hardwired parking mode." },
      { name: "Reverse Cameras & Sensors", desc: "OEM-style reversing cameras and parking sensors fitted to any vehicle." },
    ],
    media: SERVICE_MEDIA.security,
    chips: ["Autowatch Ghost", "Scorpion", "Road Angel"],
  },
  {
    id: "accident-repair",
    slug: "accident-repair",
    num: "08",
    title: "Accident Repair",
    description:
      "Insurance-approved accident repair and bodywork restoration. From minor scuffs to major panel damage, we restore your vehicle to factory condition.",
    subServices: [
      { name: "Insurance Approved Repairs", desc: "We work directly with insurers to manage your claim from start to finish." },
      { name: "Panel Repair & Replacement", desc: "Dent removal, panel beating, and full panel replacement." },
      { name: "Paint Refinishing", desc: "Colour-matched resprays using Spies Hecker premium paint systems." },
    ],
    media: SERVICE_MEDIA["accident-repair"],
    badge: "Insurance Approved",
  },
  {
    id: "alloy-packages",
    slug: "alloy-wheel-packages",
    num: "09",
    title: "Alloy Wheel Packages",
    description:
      "Complete alloy wheel and tyre packages sourced, fitted, and balanced in-house. From 18\" to 24\", we supply premium wheels for all makes and models.",
    subServices: [
      { name: "Alloy Wheel & Tyre Packages", desc: "Complete wheel and tyre sets supplied, fitted, and balanced." },
      { name: "Wheel Spacers", desc: "Precision hub-centric spacers for wider stance and improved fitment." },
      { name: "TPMS Sensors", desc: "OEM tyre pressure monitoring sensors programmed and fitted." },
    ],
    media: SERVICE_MEDIA["alloy-packages"],
  },
  {
    id: "branding",
    slug: "branding",
    num: "10",
    title: "Branding",
    subtitle: "Distinct Visual Identity",
    description:
      "Commercial branding, wraps, and visual identity packages designed to make working vehicles and business fleets look as considered as the rest of our builds.",
    subServices: [
      { name: "Commercial Branding", desc: "High-impact graphics packages tailored to your business and vehicle shape." },
      { name: "Amarok Build Branding", desc: "Project-led branding visuals inspired by our Amarok Europa work." },
      { name: "Fleet Wrap Packages", desc: "Consistent multi-vehicle branding with premium vinyl and clean installation." },
    ],
    media: SERVICE_MEDIA.branding,
  },
];

export function getServiceBySlug(slug: string) {
  return SERVICES.find((service) => service.slug === slug) || null;
}

export const HOME_SERVICE_TILES = [
  {
    key: "bespoke-conversions",
    title: "Bespoke Conversions",
    description: "Complete builds shaped around your brief, from bodykit packages to full transformations.",
    media: SERVICE_ENTRY_MEDIA.bespokeConversions,
    href: "/services",
  },
  {
    key: "vehicle-security",
    title: "Vehicle Security",
    description: "Autowatch Ghost, Scorpion, and Road Angel systems installed with a factory-minded finish.",
    media: SERVICE_ENTRY_MEDIA.vehicleSecurity,
    href: "/services#security",
    chips: ["Autowatch Ghost", "Scorpion", "Road Angel"],
  },
  {
    key: "facelift-conversions",
    title: "Facelift Conversions",
    description: "OEM-style facelift conversions that bring older models up to a sharper, newer spec.",
    media: SERVICE_ENTRY_MEDIA.faceliftConversions,
    href: "/services",
  },
];

export const COLLECTION_DELIVERY_SECTION = {
  media: COLLECTION_DELIVERY_MEDIA,
  title: "Collection & Delivery",
};
