/** @type {import('next').NextConfig} */
const withPwa = require("next-pwa");
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPwa({
  nextConfig,
  images: {
    domains: [
      "https://lh3.googleusercontent.com",
      "http://localhost:9199/v0/b/chatapp-levi.appspot.com",
      "https://firebasestorage.googleapis.com/v0/b/chatapp-levi.appspot.com",
    ],
    minimumCacheTTL: 100000,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    dynamicStartUrl: true,
    runtimeCaching: [
      {
        urlPattern: "/",
        handler: "CacheFirst",
        options: {
          cacheName: "start-url",
          expiration: {
            maxEntries: 16,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },

      {
        urlPattern: ({ url }) => {
          const isSameOrigin = self.origin === url.origin;
          if (!isSameOrigin) return false;
          const pathname = url.pathname;
          if (pathname.startsWith("/api/")) return false;
          return true;
        },
        handler: "CacheFirst",
        options: {
          cacheName: "others",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: /\.(?:js)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-js-assets",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
    ],
    disable: process.env.NODE_ENV === "development",
  },
});
