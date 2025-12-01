import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  /*const access = req.cookies.get("accessToken")?.value || null;
  const path = req.nextUrl.pathname;

  // Rutas solo admin
  const adminRoutes = ["/admin"];

  if (adminRoutes.some(r => path.startsWith(r))) {
    if (!access) {
      // No logueado → fuera
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Decodificar token
    try {
      const payload = JSON.parse(
        Buffer.from(access.split(".")[1], "base64").toString()
      );

     if (payload.rol?.toLowerCase() !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }*/

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
