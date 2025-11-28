/// src/app/page.tsx
import React from "react";
import HomeClient from "@/components/HomeClient";
import { siteConfig } from "./metadata";

export const revalidate = 60; // ISR corto: refresca cada 60s

export async function generateMetadata(): Promise<any> {
  // Traemos algunos coches para enriquecer openGraph (puede fallar en dev si API no accesible)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  let firstImage = null;
  try {
    const res = await fetch(`${apiUrl}/cars`, { cache: "force-cache" });
    if (res.ok) {
      const cars = await res.json();
      if (cars && cars.length > 0 && cars[0].imagenes?.length > 0) {
        firstImage = cars[0].imagenes[0].url;
      }
    }
  } catch (e) {
    // ignoramos errores de fetch para no romper el build
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Cargamos coches en el servidor para SSR/SEO (mejor para indexación)
  let cars = [];
  try {
    const res = await fetch(`${apiUrl}/cars`, { cache: "no-store" });
    if (res.ok) cars = await res.json();
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
