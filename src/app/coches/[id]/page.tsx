import CarPageClient from "@/components/CarPageClient";

// Tipo para params
interface PageParams {
  params: Promise<{ id: string }>;
}

// ⭐ METADATA DEL DETALLE DEL COCHE
export async function generateMetadata({ params }: PageParams) {
  const { id } = await params; // ⬅️ SOLUCIÓN

  const car = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`,
    { cache: "no-store" }
  ).then((r) => r.json());

  if (!car) {
    return {
      title: "Coche no encontrado",
    };
  }

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
export default async function CarPage({ params }: PageParams) {
  const { id } = await params; // ⬅️ SOLUCIÓN

  return <CarPageClient id={id} />;
}
