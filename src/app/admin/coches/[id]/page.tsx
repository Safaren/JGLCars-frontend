import CarPageClient from "./CarPageClient";

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {

  // 🔥 Next.js 14: params es una PROMESA → hay que usar await
  const { id } = await params;

  return <CarPageClient id={id} />;
}
