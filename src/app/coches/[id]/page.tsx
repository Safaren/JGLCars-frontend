import CarPageClient from "@/components/CarPageClient";

interface PageParams {
  params: {
    id: string;
  };
}

// ⭐ METADATA DEL DETALLE DEL COCHE
export async function generateMetadata({ params }: PageParams) {
  const car = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cars/${params.id}`,
    { cache: "no-store" }
  ).then((r) => r.json());

  if (!car)
    return {
      title: "Coche no encontrado",
    };

  return {
    title: `${car.marca} ${car.model} - ${car.precio}€`,
    description: `Coche ${car.marca} ${car.model}, año ${car.anoFabricacion}.`,
    openGraph: {
      title: `${car.marca} ${car.model}`,
      images: car.imagenes?.[0]?.url ? [car.imagenes[0].url] : [],
    },
  };
}

// ⭐ PÁGINA SERVER → RENDER CLIENT COMPONENT
export default async function CarPage({ params }: { params: { id: string } }) {
  return <CarPageClient id={params.id} />;
}
