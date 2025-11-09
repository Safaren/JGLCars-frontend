"use client";

import { motion } from "framer-motion";

export default function HeroMarquee() {
  const marcas = ["Audi", "BMW", "Mercedes", "Peugeot", "Seat", "Volkswagen", "Toyota"];

  return (
    <div className="overflow-hidden bg-gray-900 text-white py-4 mb-8">
      <motion.div
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        className="flex space-x-16 text-xl font-semibold"
      >
        {marcas.map((marca, i) => (
          <span key={i}>{marca}</span>
        ))}
      </motion.div>
    </div>
  );
}
