import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok.io",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "kreanovasi.uty.ac.id",
      },
      {
        protocol: "https",
        hostname: "uch.uty.ac.id",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
