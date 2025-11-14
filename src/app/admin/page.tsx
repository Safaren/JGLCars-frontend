import CarCard from "@/components/CarCard";
import HeroMarquee from "@/components/HeroMarquee";
import { getCars } from "@/lib/api";

export const dynamic = "force-dynamic"; 

export default async function HomePage() {
  const cars = await getCars();

  return (
    <main className="min-h-screen px-6 lg:px-16">
      {/* Marquesina */}
      <HeroMarquee />

      {/* Título */}
      <h2 className="text-3xl font-bold mb-6 text-center">
        Coches de ocasión disponibles 🚗
      </h2>

      {/* Rejilla de coches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-16">
        {cars.length > 0 ? (
          cars.map((car: any) => <CarCard key={car.id} car={car} />)
        ) : (
          <p className="text-gray-500">No hay coches disponibles en este momento.</p>
        )}
      </div>
    </main>
  );
}
