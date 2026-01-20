import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your selected automotive parts and accessories. Secure checkout for premium car styling products.",
  keywords: ["shopping cart", "checkout", "buy car parts", "automotive accessories"],
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
