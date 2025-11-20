
// JGLCars-frontend/src/app/coches/[id]/page.tsx

import CarPageClient from "@/components/CarPageClient";



export default function CarPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return <CarPageClient id={id} />;
}
