import type { Metadata } from "next";
import StylingPage from '@/components/pages/StylingPage';

export const metadata: Metadata = {
  title: "Paint & Styling",
  description: "Bespoke automotive paint finishes using premium Spies Hecker systems. OEM respray, custom color flips, and specialist finishes with unmatched depth and quality.",
  keywords: ["car painting", "vehicle respray", "custom paint", "Spies Hecker", "colour flip", "OEM paint", "automotive styling", "car refinishing", "bespoke finish"],
};

export default function Page() {
  return <StylingPage />;
}
