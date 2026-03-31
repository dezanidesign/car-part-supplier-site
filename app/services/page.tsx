import type { Metadata } from "next";
import ServicesPage from "@/components/pages/ServicesPage";

export const metadata: Metadata = {
  title: "Our Services | FDL Bespoke",
  description:
    "Full range of automotive styling services including bodykits, facelift conversions, privacy glass, wrapping, detailing, PPF, vehicle security, branding, accident repair, and alloy wheel packages.",
  keywords: [
    "bodykits",
    "alloy wheel refurbishment",
    "window tinting",
    "vehicle wrapping",
    "PPF",
    "ghost immobiliser",
    "vehicle branding",
    "facelift conversions",
    "accident repair",
    "ceramic coating",
    "FDL Bespoke",
  ],
};

export default function Page() {
  return <ServicesPage />;
}
