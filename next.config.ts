import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // =======================================
  // PERMITIR SVG COMO COMPONENTES (TURBOPACK)
  // =======================================
  turbopack: {
    svgr: true, // ⬅️ Esto reemplaza por completo tu config webpack
  },

  // =======================================
  // BACKEND PROXY → LOCAL + PRODUCCIÓN
  // =======================================
  async rewrites() {
    return [
      // 🔧 LOCAL
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },

      // 🔧 PRODUCCIÓN
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
