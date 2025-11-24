import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // =======================================
  // BACKEND PROXY → LOCAL + PRODUCCIÓN
  // =======================================
  async rewrites() {
    return [
      // 🔧 LOCAL → redirige a tu backend local
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },

      // 🔧 PRODUCCIÓN → redirige a Render
      {
        source: "/api/:path*",
        destination: "https://jlgcars-api.onrender.com/api/:path*",
      },
    ];
  },

  // =======================================
  // PERMITIR IMÁGENES DE CLOUDINARY
  // =======================================
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
