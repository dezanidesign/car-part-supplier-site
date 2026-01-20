import type { Metadata } from "next";
import AlloysPage from '@/components/pages/AlloysPage';

export const metadata: Metadata = {
  title: "Alloy Wheels",
  description: "Exclusive Barugzai wheel collection in 22-24 inch sizes. Premium finishes including gloss black, diamond-cut, and matte bronze. Expert fitting with advanced balancing and alignment.",
  keywords: ["alloy wheels", "Barugzai", "forged wheels", "wheel fitment", "22 inch", "23 inch", "24 inch", "custom wheels", "wheel alignment", "car wheels UK"],
};

export default function Page() {
  return <AlloysPage />;
}
