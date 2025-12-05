// src/app/page.tsx
import React from "react";
import HomeClient from "@/components/HomeClient";
import { siteConfig } from "./metadata";

export const revalidate = 60; // ISR corto: refresca cada 60s

function normalizeApiBase(url?: string) {
  if (!url) return "";
  // Evitar que la URL final sea http://host:4000/api/api/...
  return url.endsWith("/api") ? url.replace(/\/api$/, "") : url;
}

export async function generateMetadata(): Promise<any> {
  const rawApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const apiUrl = normalizeApiBase(rawApi);

  let firstImage = null;
  try {
    // Pedimos 1 página corta para metadata (no necesitamos muchos datos)
    const res = await fetch(`${apiUrl}/api/cars?page=1&limit=3`, { cache: "force-cache" });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
      if (items.length > 0 && items[0].imagenes?.length > 0) {
        firstImage = items[0].imagenes[0].url;
      }
    }
  } catch (e) {
    // ignoramos errores para no romper el build
  }

  return {
    title: siteConfig.name,
    description: siteConfig.description,
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
      images: firstImage ? [firstImage] : undefined,
      url: siteConfig.url,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: firstImage ? [firstImage] : undefined,
    },
  };
}

export default async function Page() {
  const rawApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const apiUrl = normalizeApiBase(rawApi);

  // SSR: cargamos unos coches para la home (mejor para SEO)
  let cars: any[] = [];
  try {
    // Pedimos una página corta para la home
    const res = await fetch(`${apiUrl}/api/cars?page=1&limit=6`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      // La API paginada devuelve { items, page, total, hasMore }
      if (Array.isArray(data.items)) {
        cars = data.items;
      } else if (Array.isArray(data)) {
        // compatibilidad por si la API devolviera un array (fallback)
        cars = data;
      } else {
        cars = [];
      }
    }
  } catch (e) {
    cars = [];
  }

  return (
    <>
      {/* JSON-LD Organization (mejora resultados de marca) */}
      <script
        key="org-jsonld"
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: siteConfig.logo || `${siteConfig.url}/logo.png`,
            sameAs: siteConfig.sameAs || [],
          }),
        }}
      />

      {/* Renderizamos el cliente que contiene la lógica de uso de estado y hooks */}
      <HomeClient initialCars={cars} />
    </>
  );
}
