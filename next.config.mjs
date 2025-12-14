/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export only for production builds (CI/CD deployment)
  // Dev server needs this disabled to work properly
  ...(process.env.NEXT_EXPORT === 'true' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
