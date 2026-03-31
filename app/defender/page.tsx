import type { Metadata } from "next";
import { fetchProductsByCategorySlug } from "@/lib/woo";
import DefenderPage from "@/components/pages/DefenderPage";

export const metadata: Metadata = {
  title: "Land Rover Defender Upgrades & Bespoke Styling | FDL Bespoke",
  description:
    "FDL Bespoke specialises in Land Rover Defender upgrades — bodykits, alloy wheels, carbon fibre, window tints, vehicle security, and complete bespoke transformations. Supplied and fitted in Batley, West Yorkshire.",
  keywords: [
    "Land Rover Defender upgrades",
    "Defender bodykit",
    "Defender bespoke styling",
    "Defender styling specialist",
    "Defender upgrades UK",
    "Defender upgrades Yorkshire",
    "Defender upgrades West Yorkshire",
    "Defender L663 styling",
    "Defender supplied and fitted",
    "FDL Bespoke Defender",
  ],
};

export default async function Page() {
  // Fetch Defender-specific products from both category slugs and deduplicate
  const [p1, p2] = await Promise.all([
    fetchProductsByCategorySlug("land-rover-defender"),
    fetchProductsByCategorySlug("defender-l663"),
  ]);

  const seen = new Set<number>();
  const products = [...p1, ...p2].filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return <DefenderPage products={products} />;
}
