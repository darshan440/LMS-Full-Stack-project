/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // Leave empty for default port
        pathname: "/**", // Match all paths for this domain
      },
    ],
  },
};

module.exports = nextConfig;
