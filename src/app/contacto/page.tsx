"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ContactoPage() {
  const params = useSearchParams();
  const autoMessage = params.get("mensaje") || "";

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (autoMessage) {
      setMensaje(autoMessage);
    }
  }, [autoMessage]);

  const enviar = () => {
    alert("Mensaje enviado!");
  };

  return (
    <section className="max-w-xl mx-auto px-6 mt-20 mb-32">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-700">Contacto</h1>

      <div className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Nombre"
          className="border p-3 rounded-xl"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Tu mensaje..."
          className="border p-3 rounded-xl h-40"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />

        <button
          onClick={enviar}
          className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
        >
          Enviar mensaje
        </button>
      </div>
    </section>
  );
}
