// src/components/NavBar.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isAdmin = user?.rol?.toLowerCase() === "admin";
  const getInitials = () => {
    if (!user?.email) return "?";
    return user.email[0].toUpperCase();
  };

  return (
    <nav id="main-navbar" className="fixed top-0 z-50 w-full bg-white shadow-md h-16 px-6 flex justify-between items-center">
      <motion.div onClick={() => router.push("/")} whileHover={{ scale: 1.05 }} className="cursor-pointer font-extrabold text-2xl text-blue-700 select-none">
        <img src="/logo.svg" alt="Logo" className="h-15 w-auto object-contain mr-2" />
      </motion.div>

      <div className="hidden md:flex gap-8 items-center text-[17px] font-medium">
        <Link href="/" className="hover:text-blue-600 transition">Inicio</Link>
        <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>

        {!user ? (
          <>
            <Link href="/login" className="hover:text-blue-600 transition">Registro/Acceder</Link>
          </>
        ) : (
          <>
            {isAdmin && (
              <Link href="/admin" className="hover:text-blue-600 transition">Panel</Link>
            )}
            
            {/* Avatar/Profile Menu */}
            {!isAdmin && (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition">
                  {getInitials()}
                </button>
                
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-12 right-0 bg-white border rounded-lg shadow-lg w-48 py-2 z-50">
                      <Link href="/perfil" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                        Mi Perfil
                      </Link>
                      <button onClick={() => { setProfileOpen(false); logout(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {isAdmin && (
              <button onClick={() => logout()} className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition">Cerrar sesión</button>
            )}
          </>
        )}
      </div>

      <button className="md:hidden flex flex-col gap-1 w-8" onClick={() => setOpen(!open)}>
        <span className={`h-1 w-full bg-black rounded transition ${open ? "rotate-45 translate-y-2" : ""}`}></span>
        <span className={`h-1 w-full bg-black rounded transition ${open ? "opacity-0" : ""}`}></span>
        <span className={`h-1 w-full bg-black rounded transition ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col gap-4 py-5 px-6 md:hidden text-lg">
            <Link href="/" onClick={() => setOpen(false)}>Inicio</Link>
            <Link href="/contacto" onClick={() => setOpen(false)}>Contacto</Link>

            {!user ? (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>Registro/Acceder</Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setOpen(false)}>Panel</Link>
                )}
                {!isAdmin && (
                  <Link href="/perfil" onClick={() => setOpen(false)}>Mi Perfil</Link>
                )}
                <button onClick={() => { setOpen(false); logout(); }} className="bg-red-600 text-white px-3 py-2 rounded text-left">Cerrar sesión</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
