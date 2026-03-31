import type { Metadata } from "next";
import ServicesPage from "@/components/pages/ServicesPage";

export const metadata: Metadata = {
  title: "Our Services | FDL Bespoke",
  description:
    "Full range of automotive styling services including bodykits, alloy wheel refurbishment, privacy glass, vehicle wrapping, detailing, PPF, vehicle security, accident repair, and alloy wheel packages.",
  keywords: [
    "bodykits",
    "alloy wheel refurbishment",
    "window tinting",
    "vehicle wrapping",
    "PPF",
    "ghost immobiliser",
    "accident repair",
    "ceramic coating",
    "FDL Bespoke",
  ],
};

export default function Page() {
  return <ServicesPage />;
}
