import type { Metadata, Viewport } from "next";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import "../styles/globals.css";

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.fdlbespoke.co.uk"),
  title: {
    default: "FDL Bespoke | Automotive Styling UK",
    template: "%s | FDL Bespoke",
  },
  description:
    "Premium automotive styling solutions. Specialist bodykits, carbon fibre, alloy wheels, vehicle wrapping, and bespoke interior conversions in West Yorkshire.",
  keywords: [
    "automotive styling",
    "bodykits",
    "carbon fibre",
    "alloy wheels",
    "vehicle wrapping",
    "car customisation",
    "Range Rover styling",
    "G-Wagon bodykit",
    "Defender upgrades",
    "UK car styling",
    "West Yorkshire",
    "Batley",
  ],
  authors: [{ name: "FDL Bespoke" }],
  creator: "FDL Bespoke",
  publisher: "FDL Bespoke",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.fdlbespoke.co.uk",
    siteName: "FDL Bespoke",
    title: "FDL Bespoke | Automotive Styling UK",
    description:
      "Premium automotive styling solutions. Specialist bodykits, carbon fibre, alloy wheels, and bespoke interior conversions.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FDL Bespoke - Automotive Styling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FDL Bespoke | Automotive Styling UK",
    description: "Premium automotive styling solutions in West Yorkshire.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.fdlbespoke.co.uk",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

// ============================================================================
// ROOT LAYOUT
// ============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-[#050505] text-white antialiased min-h-screen flex flex-col">
        {/* Custom Cursor (desktop only) */}
        <CustomCursor />
        
        {/* Noise Overlay */}
        <div className="noise" aria-hidden="true" />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Main Content */}
        <main className="flex-grow">{children}</main>
        
        {/* Footer */}
        <Footer />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoBodyShop",
              name: "FDL Bespoke",
              description: "Premium automotive styling solutions",
              url: "https://www.fdlbespoke.co.uk",
              telephone: "+447869022673",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Unit C3, 511 Bradford Rd",
                addressLocality: "Batley",
                addressRegion: "West Yorkshire",
                postalCode: "WF17 8LL",
                addressCountry: "GB",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 53.7064,
                longitude: -1.6378,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Thursday", "Friday", "Saturday"],
                  opens: "10:00",
                  closes: "18:00",
                },
              ],
              priceRange: "£££",
              image: "https://www.fdlbespoke.co.uk/og-image.jpg",
              sameAs: [
                "https://www.instagram.com/fdlbespoke",
                "https://www.facebook.com/fdlbespoke",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
