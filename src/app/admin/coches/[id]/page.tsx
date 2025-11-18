import CarPageClient from "./CarPageClient";

export default function CarPage({ params }: { params: { id: string } }) {
  return <CarPageClient id={params.id} />;
}
