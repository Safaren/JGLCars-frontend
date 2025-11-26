"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* LOGO + DESCRIPCIÓN */}
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-3">JLGCars</h2>
          <p className="text-gray-400">
            Calidad, confianza y los mejores coches de segunda mano revisados
            por profesionales. Encuentra tu vehículo ideal con garantía.
          </p>
        </div>

        {/* ENLACES RÁPIDOS */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Enlaces</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
            <li><Link href="/admin" className="hover:text-white transition">Coches disponibles</Link></li>
            <li><Link href="/contacto" className="hover:text-white transition">Contacto</Link></li>
            <li><Link href="/admin" className="hover:text-white transition">Panel Admin</Link></li>
          </ul>
        </div>

        {/* CONTACTO */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contacto</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-500" />
              <span>+34 621 630 342</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-blue-500" />
              <span>jlgcars77@gmail.com</span>
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-500" />
              <span>Guadalajara, España</span>
            </li>
          </ul>
        </div>

        {/* REDES SOCIALES */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Síguenos</h3>
          <div className="flex gap-4 text-2xl">
            <motion.a whileHover={{ scale: 1.2 }} href="#" className="hover:text-white">
              <FaFacebook />
            </motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#" className="hover:text-white">
              <FaInstagram />
            </motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#" className="hover:text-white">
              <FaTwitter />
            </motion.a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} JLGCars. Todos los derechos reservados.
      </div>
    </footer>
  );
}
