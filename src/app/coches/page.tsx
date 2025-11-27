"use client";

import { useEffect, useState } from "react";
import CarCard from "@/components/CarCard";
import { motion } from "framer-motion";
import { CarForFrontend } from "@/types/CarForFrontend";
import CarVideos from "@/components/CarVideos";

export default function CochesPage() {
  const [cars, setCars] = useState<CarForFrontend[]>([]);
  const [filtered, setFiltered] = useState<CarForFrontend[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState("");
  const [marcaFilter, setMarcaFilter] = useState("");
  const [combustibleFilter, setCombustibleFilter] = useState("");
  const [maxPrecio, setMaxPrecio] = useState<number | null>(null);

  const sanitizeCar = (car: any): CarForFrontend => ({
  ...car,
  tipoVenta:
    car.tipoVenta === "COCHE" || car.tipoVenta === "PIEZAS"
      ? car.tipoVenta
      : "COCHE", // valor por defecto que quieres
  imagenes: car.imagenes?.map((i: any) => ({ url: i.url })) ?? [],
});


  // Cargar coches
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("❌ Error HTTP:", res.status);
          setCars([]);
          setFiltered([]);
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("❌ El backend devolvió un objeto, no un array:", data);
          setCars([]);
          setFiltered([]);
          return;
        }

        setCars(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error cargando coches:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let res = [...cars];

    // Buscar por marca o modelo
    if (search.trim() !== "") {
      res = res.filter((c) =>
        `${c.marca ?? ""} ${c.model ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Filtrar marca
    if (marcaFilter !== "") {
      res = res.filter((c) => (c.marca ?? "") === marcaFilter);
    }

    // Filtro combustible
    if (combustibleFilter !== "") {
      res = res.filter((c) => (c.combustible ?? "") === combustibleFilter);
    }

    // Filtro precio
    if (maxPrecio !== null && maxPrecio > 0) {
      res = res.filter(
        (c) => typeof c.precio === "number" && c.precio <= maxPrecio
      );
    }

    setFiltered(res);
  }, [search, marcaFilter, combustibleFilter, maxPrecio, cars]);

  // MARCAS SEGURAS
  const marcas = Array.from(
    new Set(cars.map((c) => c.marca ?? "Sin marca"))
  );

  // COMBUSTIBLES SEGUROS
  const combustibles = Array.from(
    new Set(cars.map((c) => c.combustible ?? ""))
  );

  return (
    <section className="max-w-7xl mx-auto px-6 mt-20 mb-32">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-10 text-center">
        Coches disponibles
      </h1>

      {/* FILTROS */}
      <div
        className="
          bg-white p-6 rounded-2xl shadow-md grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10
        "
      >
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por marca o modelo..."
          className="border rounded-xl p-3 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Marca */}
        <select
          className="border rounded-xl p-3"
          value={marcaFilter}
          onChange={(e) => setMarcaFilter(e.target.value)}
        >
          <option value="">Todas las marcas</option>
          {marcas.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Combustible */}
        <select
          className="border rounded-xl p-3"
          value={combustibleFilter}
          onChange={(e) => setCombustibleFilter(e.target.value)}
        >
          <option value="">Todos los combustibles</option>
          {combustibles.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Precio máximo */}
        <input
          type="number"
          placeholder="Precio máximo (€)"
          className="border rounded-xl p-3 w-full"
          value={maxPrecio ?? ""}
          onChange={(e) =>
            setMaxPrecio(e.target.value ? Number(e.target.value) : null)
          }
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse h-72 rounded-2xl"
            ></div>
          ))}
        </div>
      )}

      {/* SIN RESULTADOS */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-xl text-gray-600 mt-20">
          No se encontraron coches con esos filtros.
        </p>
      )}

      {/* GRID */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {filtered.map((car) => (
  <div key={car.id}>
    <CarCard car={car} />

  </div>
))}
      </motion.div>
      
    </section>

    
  );
}
