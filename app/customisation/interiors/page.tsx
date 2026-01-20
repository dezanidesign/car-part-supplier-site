import type { Metadata } from "next";
import InteriorsPage from '@/components/pages/InteriorsPage';

export const metadata: Metadata = {
  title: "Interior Conversions",
  description: "Bespoke luxury interior conversions with premium Nappa leather, diamond quilting, Alcantara, and carbon fibre. Custom upholstery, trim upgrades, and lighting installations.",
  keywords: ["interior conversion", "Nappa leather", "diamond quilting", "Alcantara", "carbon fibre interior", "custom upholstery", "car interior", "luxury interiors", "seat retrim", "dashboard upgrade"],
};

export default function Page() {
  return <InteriorsPage />;
}
