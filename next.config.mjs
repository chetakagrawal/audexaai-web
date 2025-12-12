/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,        // 👉 add this
  images: {
    unoptimized: true,
  },
  // keep this if you added it
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
