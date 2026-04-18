import type { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";
import Marquee from "@/components/home/Marquee";
import ExpertiseGrid from "@/components/home/ExpertiseGrid";
import TransformationSection from "@/components/home/TransformationSection";
import ProductCarousel from "@/components/home/ProductCarousel";
import ReviewsSection from "@/components/home/ReviewsSection";
import QuoteSection from "@/components/home/QuoteSection";
import { HOME_HERO_SLIDES } from "@/lib/curatedMedia";

export const metadata: Metadata = {
  title: "FDL Bespoke | Automotive Styling & Bodykit Specialists",
  description:
    "Premium automotive styling, bodykit installations, carbon fibre packages, alloy wheel refurbishment, and bespoke vehicle conversions. Based in Batley, West Yorkshire.",
  keywords: [
    "FDL Bespoke",
    "automotive styling",
    "bodykits",
    "carbon fibre",
    "alloy wheels",
    "vehicle wrapping",
    "window tinting",
    "ghost immobiliser",
    "Batley",
  ],
};

export default function HomePage() {
  return (
    <>
      <HeroCarousel slides={HOME_HERO_SLIDES} />
      <Marquee />
      <ExpertiseGrid />
      <TransformationSection />
      <ProductCarousel />
      <ReviewsSection />
      <QuoteSection />
    </>
  );
}
