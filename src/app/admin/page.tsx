// src/app/admin/page.tsx

"use client";


import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FotoPieza {
  id: number;
  url: string;
}

interface Pieza {
  id: number;
  descripcion: string;
  precio: number;
  numero: number;
  parteCoche: string;
  car: {
    marca: string;
    model: string;
  };
  fotos?: FotoPieza[];
}

export default function PiezasPage() {
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [filtered, setFiltered] = useState<Pieza[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState("");
  const [marcaFilter, setMarcaFilter] = useState("");
  const [parteFilter, setParteFilter] = useState("");
  const [maxPrecio, setMaxPrecio] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/piezas`);
        const data = await res.json();
        setPiezas(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error cargando piezas:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Filtros
  useEffect(() => {
    let res = [...piezas];

    if (search.trim() !== "") {
      res = res.filter((p) =>
        p.descripcion.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (marcaFilter !== "") {
      res = res.filter((p) => p.car.marca === marcaFilter);
    }

    if (parteFilter !== "") {
      res = res.filter((p) => p.parteCoche === parteFilter);
    }

    if (maxPrecio !== null && maxPrecio > 0) {
      res = res.filter((p) => p.precio <= maxPrecio);
    }

    setFiltered(res);
  }, [search, marcaFilter, parteFilter, maxPrecio, piezas]);

  const marcas = Array.from(new Set(piezas.map((p) => p.car.marca)));
  const partes = Array.from(new Set(piezas.map((p) => p.parteCoche)));

  return (
    <section className="max-w-7xl mx-auto px-6 mt-20 mb-32">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-10 text-center">
        Piezas disponibles
      </h1>

      {/* FILTROS */}
      <div
        className="
          bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10
        "
      >
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar pieza..."
          className="border rounded-xl p-3 w-full dark:bg-gray-700 dark:border-gray-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Marca */}
        <select
          className="border rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600"
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

        {/* Parte */}
        <select
          className="border rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600"
          value={parteFilter}
          onChange={(e) => setParteFilter(e.target.value)}
        >
          <option value="">Todas las partes</option>
          {partes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Precio máximo */}
        <input
          type="number"
          placeholder="Precio máximo (€)"
          className="border rounded-xl p-3 w-full dark:bg-gray-700 dark:border-gray-600"
          value={maxPrecio || ""}
          onChange={(e) =>
            setMaxPrecio(e.target.value ? Number(e.target.value) : null)
          }
        />
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 animate-pulse h-72 rounded-2xl"
            ></div>
          ))}
        </div>
      )}

      {/* RESULTADOS VACÍOS */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-xl text-gray-600 dark:text-gray-400 mt-20">
          No se encontraron piezas con esos filtros.
        </p>
      )}

      {/* GRID DE PIEZAS */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {filtered.map((pieza) => (
          <motion.div
            key={pieza.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl p-4 cursor-pointer border border-gray-100 dark:border-gray-700 transition"
          >
            {/* FOTO PRINCIPAL */}
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
              <img
                src={pieza.fotos?.[0]?.url || "/no-image.jpg"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="mt-4 space-y-1">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {pieza.descripcion}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Parte: {pieza.parteCoche}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Coche: {pieza.car.marca} {pieza.car.model}
              </p>

              <p className="text-blue-600 dark:text-blue-400 font-bold text-xl mt-2">
                {pieza.precio.toLocaleString()} €
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
