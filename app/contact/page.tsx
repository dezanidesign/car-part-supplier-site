import type { Metadata } from "next";
import ContactPage from '@/components/pages/ContactPage';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with FDL Bespoke for quotes and consultations. Located in Batley, West Yorkshire. Phone: +44 7869 022673. Open Thursday-Saturday 10:00-18:00.",
  keywords: ["contact FDL Bespoke", "quote", "consultation", "Batley", "West Yorkshire", "car styling quote", "bodykit quote"],
};

export default function Page() {
  return <ContactPage />;
}
