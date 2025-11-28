// src/app/metadata.ts
import { Metadata } from "next";

export const siteConfig = {
  name: "JLG Cars",
  description:
    "Compra y venta de coches de ocasión. Coches revisados, con garantía y entrega en toda España.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.com",
  logo: "/logo.png",
  sameAs: ["https://www.facebook.com/tu-pagina", "https://twitter.com/tu-cuenta"],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: "%s | JLG Cars",
  },
  description: siteConfig.description,
  keywords: [
    "coches ocasión",
    "coches segunda mano",
    "coches baratos",
    "compra coche",
    "venta coche",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};
