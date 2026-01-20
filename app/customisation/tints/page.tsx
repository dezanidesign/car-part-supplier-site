import type { Metadata } from "next";
import TintsPage from '@/components/pages/TintsPage';

export const metadata: Metadata = {
  title: "Tints & Privacy Glass",
  description: "Premium Enkahnz privacy glass installation with 99% UV rejection. Expert window tinting with full door panel disassembly for factory-level finish. Enhanced privacy, heat reduction, and security.",
  keywords: ["window tinting", "privacy glass", "Enkahnz", "ceramic tint", "UV protection", "car tinting", "limo tint", "window film", "heat rejection", "vehicle privacy"],
};

export default function Page() {
  return <TintsPage />;
}
