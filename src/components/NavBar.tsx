
// JGLCars-frontend/src/components/NavBar.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false); // menú móvil

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
    localStorage.removeItem("user");

    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <nav
      id="main-navbar"
      className="
        bg-white shadow-md h-16 
        px-6 flex justify-between items-center 
        sticky top-0 z-50
      "
    >
      {/* LOGO */}
      <motion.div
        onClick={() => router.push("/")}
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer font-extrabold text-2xl text-blue-700 select-none"
      >
        JLGCars
      </motion.div>

      {/* MENU ESCRITORIO */}
      <div className="hidden md:flex gap-8 items-center text-[17px] font-medium">
        <Link href="/" className="hover:text-blue-600 transition">
          Inicio
        </Link>

        <Link href="/contacto" className="hover:text-blue-600 transition">
          Contacto
        </Link>

        {!user ? (
          <>
            <Link href="/login" className="hover:text-blue-600 transition">
              Login
            </Link>
            <Link href="/registro" className="hover:text-blue-600 transition">
              Registrarse
            </Link>
          </>
        ) : (
          <>
            {(user.rol === "Admin" || user.rol === "ADMIN") && (
              <Link href="/admin" className="hover:text-blue-600 transition">
                Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>

      {/* BOTÓN HAMBURGUER — MÓVIL */}
      <button
        className="md:hidden flex flex-col gap-1 w-8"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`h-1 w-full bg-black rounded transition ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`h-1 w-full bg-black rounded transition ${
            open ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`h-1 w-full bg-black rounded transition ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute top-16 left-0 w-full bg-white shadow-md 
                       flex flex-col gap-4 py-5 px-6 md:hidden text-lg"
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
