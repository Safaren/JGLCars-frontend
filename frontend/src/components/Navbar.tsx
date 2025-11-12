"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false); // ✅ evitar render SSR desajustado

  useEffect(() => {
    setMounted(true); // marcar cuando el cliente está listo

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

  // ⚙️ Evitar render SSR hasta que el cliente esté montado
  if (!mounted) return null;

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <motion.div
        onClick={() => router.push("/")}
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer font-extrabold text-xl text-blue-700"
      >
        JLGCars
      </motion.div>

      <div className="flex gap-6">
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
    </nav>
  );
}
