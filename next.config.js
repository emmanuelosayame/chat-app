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
    minimumCacheTTL: 1000,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    reloadOnOnline: false,
  },
});
