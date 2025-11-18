"use client";

import CarCarousel from "@/components/CarCarousel";
import NavBar from "@/components/NavBar";
import { motion } from "framer-motion";

export default function HeroHeader({ images }: { images: string[] }) {
  return (
    <header className="w-full h-auto bg-white overflow-hidden">
      {/* NAVBAR */}
      <NavBar />

      {/* CARRUSEL */}
      <div className="relative w-full">
        <CarCarousel images={images} />

        {/* TEXTO DEL HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="
            absolute inset-0 flex flex-col justify-center items-center 
            text-center px-6 select-none
          "
        >
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-lg">
            Encuentra tu próximo coche
          </h1>

          <p className="text-white/90 mt-3 text-lg sm:text-xl drop-shadow-md max-w-2xl">
            Vehículos seleccionados, revisados y listos para conducir.
          </p>

          <motion.a
            href="/coches"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="
              mt-6 bg-blue-600 text-white font-semibold py-3 px-8 
              rounded-full shadow-lg hover:bg-blue-700 transition
            "
          >
            Ver coches disponibles
          </motion.a>
        </motion.div>
      </div>
    </header>
  );
}
