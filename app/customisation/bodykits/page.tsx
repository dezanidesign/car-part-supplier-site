import type { Metadata } from "next";
import BodykitsPage from '@/components/pages/BodykitsPage';

export const metadata: Metadata = {
  title: "Bodykits",
  description: "Expert bodykit installation and fitment. Premium materials including PU plastic, PP, GRP fibreglass, and carbon fibre. Professional in-house painting for factory-level finish.",
  keywords: ["bodykit", "body kit", "bumpers", "splitters", "diffusers", "side skirts", "wide arch", "fibreglass", "carbon fibre", "automotive styling"],
};

export default function Page() {
  return <BodykitsPage />;
}
