// proxy.ts (Next.js 15+)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  // Rutas protegidas
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString("utf8")
      );

      const rol = payload.rol?.toLowerCase();

      if (rol !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (err) {
      console.error("Error decoding JWT in proxy:", err);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Qué rutas deben pasar por este proxy
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};
