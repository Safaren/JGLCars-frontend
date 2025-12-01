// src/app/registro/page.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta");
      } else {
        setMensaje("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    }

    setLoading(false);
  };

  return (
    <motion.section
      className="py-16 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          Crear cuenta
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}

          {mensaje && (
            <p className="text-green-600 text-center font-medium">{mensaje}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 font-semibold">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </motion.section>
  );
}
