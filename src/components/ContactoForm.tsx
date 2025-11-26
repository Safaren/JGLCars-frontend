"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ContactoForm() {
  const params = useSearchParams();
  const autoMessage = params.get("mensaje") || "";

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (autoMessage) {
      setMensaje(autoMessage);
    }
  }, [autoMessage]);

  const enviar = async () => {
    if (!nombre || !email || !mensaje) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          telefono,
          mensaje,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error al enviar el mensaje: " + (data.error || JSON.stringify(data)));
        return;
      }

      alert("Mensaje enviado correctamente!");

      // Reset form
      setNombre("");
      setEmail("");
      setTelefono("");
      setMensaje("");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al enviar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        enviar();
      }}
      className="bg-gray-800 p-6 rounded-xl shadow space-y-4"
    >
      {/* Nota: el título de la página está en page.tsx para evitar duplicados */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          className="border-2 border-amber-500 placeholder-amber-300 text-gray-900 p-3 rounded-xl
            focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border-2 border-amber-500 placeholder-amber-300 text-gray-900 p-3 rounded-xl
            focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Teléfono (opcional)"
          className="border-2 border-amber-500 placeholder-amber-300 text-gray-900 p-3 rounded-xl
            focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <textarea
          placeholder="Tu mensaje..."
          className="border-2 border-amber-500 placeholder-amber-300 text-gray-900 p-3 rounded-xl h-40
            focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-300"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Enviando..." : "Enviar mensaje"}
          </button>

          {/* Opción rápida para llamar desde móvil */}
          <a
            href="tel:644123456"
            className="ml-auto text-sm text-gray-600 underline hover:text-gray-800"
          >
            ¿Prefieres llamarnos?
          </a>
        </div>
      </div>
    </form>
  );
}
