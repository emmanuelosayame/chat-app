/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  nextConfig,
  images: {
    domains: [
      "https://lh3.googleusercontent.com",
      "http://localhost:9199/v0/b/chatapp-levi.appspot.com",
      "https://firebasestorage.googleapis.com/v0/b/chatapp-levi.appspot.com",
    ],
    minimumCacheTTL: 1000,
  },
};
