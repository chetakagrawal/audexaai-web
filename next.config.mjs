/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  // Remove output: "export" for dev server to work properly
  // output: "export", // Commented out for dev server
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
