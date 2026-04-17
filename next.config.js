/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================================
  // IMAGE OPTIMIZATION
  // ============================================================================
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "woocommerce-1124088-5635456.cloudwaysapps.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "wp.fdlbespoke.co.uk",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "fdlbespoke.co.uk",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ============================================================================
  // REDIRECTS (Old WordPress URLs -> New Structure)
  // ============================================================================
  async redirects() {
    return [
      {
        source: "/product-category/:slug",
        destination: "/shop?category=:slug",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/info",
        permanent: true,
      },
    ];
  },

  // ============================================================================
  // HEADERS (Security & Caching)
  // ============================================================================
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // ============================================================================
  // EXPERIMENTAL FEATURES
  // ============================================================================
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // ============================================================================
  // BUILD CONFIGURATION
  // ============================================================================
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }
    return config;
  },

  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  // output: 'standalone',
};

module.exports = nextConfig;
