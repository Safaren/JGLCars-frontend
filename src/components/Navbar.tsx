"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  const [open, setOpen] = useState(false); // menú móvil abierto/cerrado

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Error cerrando sesión:", e);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("csrfToken");
    setUser(null);
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <nav
      id="main-navbar"
      className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50"
    >
      {/* LOGO */}
      <motion.div
        onClick={() => router.push("/")}
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer font-extrabold text-xl text-blue-700"
      >
        JLGCars
      </motion.div>

      {/* MENU ESCRITORIO */}
      <div className="hidden md:flex gap-6 items-center">
        <Link href="/">Inicio</Link>
        <Link href="/contacto">Contacto</Link>

        {!user ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/registro">Registrarse</Link>
          </>
        ) : (
          <>
            {(user.rol === "Admin" || user.rol === "ADMIN") && (
              <Link href="/admin">Panel</Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>

      {/* BOTÓN HAMBURGER PARA MÓVIL */}
      <button
        className="md:hidden flex flex-col gap-1"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`h-1 w-7 bg-black rounded transition ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`h-1 w-7 bg-black rounded transition ${
            open ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`h-1 w-7 bg-black rounded transition ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg p-6 flex flex-col gap-4 md:hidden"
          >
            <Link href="/" onClick={() => setOpen(false)}>
              Inicio
            </Link>
            <Link href="/contacto" onClick={() => setOpen(false)}>
              Contacto
            </Link>

            {!user ? (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/registro" onClick={() => setOpen(false)}>
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                {(user.rol === "Admin" || user.rol === "ADMIN") && (
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="bg-red-600 text-white px-3 py-2 rounded"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
