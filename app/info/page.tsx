import type { Metadata } from "next";
import InfoPage from '@/components/pages/InfoPage';

export const metadata: Metadata = {
  title: "About Us",
  description: "FDL Bespoke - Premium automotive styling specialists in West Yorkshire. Expert bodykit installation, alloy wheels, interior conversions, paint, and tinting services since our founding.",
  keywords: ["FDL Bespoke", "automotive styling UK", "West Yorkshire", "Batley", "car customisation", "about us", "car styling specialists"],
};

export default function Page() {
  return <InfoPage />;
}
