// src/app/coches/[id]/page.tsx

import CarPageClient from "@/components/CarPageClient";

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  return <CarPageClient id={id} />;
}

