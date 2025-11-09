"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="text-2xl font-bold text-blue-700 tracking-wide"
          >
            JLGCars
          </motion.span>
        </Link>

        {/* MENÚ */}
        <ul className="flex space-x-6 font-medium text-gray-700">
          <li>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/contacto"
              className="hover:text-blue-600 transition-colors"
            >
              Contacto
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              className="hover:text-blue-600 transition-colors"
            >
              Registrarse
            </Link>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
}
