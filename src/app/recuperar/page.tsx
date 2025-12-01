// src/app/recuperar/page.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Hubo un error. Inténtalo de nuevo.");
      } else {
        setMensaje(data.message || "Si el email existe, recibirás instrucciones.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="py-16 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-4">
          Recuperar contraseña
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Introduce tu correo y te enviaremos un enlace para restablecerla.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </button>
        </form>

        {/* Mensajes */}
        {mensaje && (
          <p className="mt-4 text-green-600 text-center font-medium">{mensaje}</p>
        )}
        {error && (
          <p className="mt-4 text-red-600 text-center font-medium">{error}</p>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
