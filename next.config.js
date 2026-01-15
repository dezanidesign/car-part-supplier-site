/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================================
  // IMAGE OPTIMIZATION
  // ============================================================================
  images: {
    remotePatterns: [
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
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ============================================================================
  // REDIRECTS (Old WordPress URLs → New Structure)
  // ============================================================================
  async redirects() {
    return [
      // Product URLs
      {
        source: "/product/:slug",
        destination: "/shop/:slug",
        permanent: true,
      },
      // Category URLs
      {
        source: "/product-category/:slug",
        destination: "/shop?category=:slug",
        permanent: true,
      },
      // Cart redirect
      {
        source: "/cart",
        destination: "/cart",
        permanent: false,
      },
      // Old page redirects (if any)
      {
        source: "/about",
        destination: "/info",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/",
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
        // Apply to all routes
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
        // Cache static assets aggressively
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
    // Enable optimized package imports
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // ============================================================================
  // BUILD CONFIGURATION
  // ============================================================================
  // Suppress punycode deprecation warning
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }
    return config;
  },

  // Generate source maps in production for debugging
  productionBrowserSourceMaps: false,

  // Strict mode for React
  reactStrictMode: true,

  // Output standalone build (useful for Docker deployments)
  // output: 'standalone',
};

module.exports = nextConfig;
