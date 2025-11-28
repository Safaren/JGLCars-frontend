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

  useEffect(() => {
    setMounted(true);
  }, []);

  console.log("USER EN NAVBAR --->", user);

  // si quieres que las animaciones dependan de user, ya lo hace automáticamente
  if (!mounted) return null;

  return (
    <nav id="main-navbar" className="fixed top-0 z-50 w-full bg-white shadow-md h-16 px-6 flex justify-between items-center">
      <motion.div onClick={() => router.push("/")} whileHover={{ scale: 1.05 }} className="cursor-pointer font-extrabold text-2xl text-blue-700 select-none ">
        <img src="/logo.svg" alt="Logo" className="h-15 w-auto object-contain mr-2" />
      </motion.div>

      <div className="hidden md:flex gap-8 items-center text-[17px] font-medium">
        <Link href="/" className="hover:text-blue-600 transition">Inicio</Link>
        <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>

        {!user ? (
          <>
            <Link href="/login" className="hover:text-blue-600 transition">Login</Link>
           {/* <Link href="/registro" className="hover:text-blue-600 transition">Registrarse</Link> */}
          </>
        ) : (
          <>
            {(user.rol === "Admin" || user.rol === "ADMIN" || user.rol === "admin") && (
              <Link href="/admin" className="hover:text-blue-600 transition">Panel</Link>
            )}
            <button onClick={() => logout()} className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition">Cerrar sesión</button>
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
                <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/registro" onClick={() => setOpen(false)}>Registrarse</Link>
              </>
            ) : (
              <>
                {(user.rol === "Admin" || user.rol === "ADMIN" || user.rol === "admin") && (
                  <Link href="/admin" onClick={() => setOpen(false)}>Panel</Link>
                )}
                <button onClick={() => { setOpen(false); logout(); }} className="bg-red-600 text-white px-3 py-2 rounded">Cerrar sesión</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
