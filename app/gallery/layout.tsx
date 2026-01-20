import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "View our portfolio of premium automotive styling projects. Browse completed builds by make including Range Rover, Mercedes G-Wagon, BMW, Audi, and more.",
  keywords: ["gallery", "portfolio", "car builds", "Range Rover builds", "G-Wagon styling", "BMW customisation", "Audi styling", "before and after"],
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
