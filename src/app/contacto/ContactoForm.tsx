"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ContactoForm() {
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
      <h1 className="text-4xl font-extrabold mb-8 text-amber-500">Contacto</h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          className="border-2 border-amber-500 placeholder-amber-100 p-3 rounded-xl 
            focus:outline-none
        focus:border-amber-600
         text-blue-300
        focus:ring-2 focus:ring-amber-300
                "
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border-2 border-amber-500 p-3 
          placeholder-amber-100
          text-blue-300
          rounded-xl
          focus:outline-none
        focus:border-amber-600
        focus:ring-2 focus:ring-amber-300
                "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Tu mensaje..."
          className="border-2  border-amber-500 p-3 
         placeholder-amber-100
          text-blue-300 rounded-xl h-40
                    focus:outline-none
        focus:border-amber-600
        focus:ring-2 focus:ring-amber-300"
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
