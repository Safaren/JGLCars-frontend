"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">(
    "idle"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    console.log(process.env.NEXT_PUBLIC_API_URL);


    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al enviar el mensaje");

      setEstado("ok");
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
    } catch (error) {
      console.error(error);
      setEstado("error");
    }
  };

  return (
    <motion.section
      className="max-w-3xl mx-auto py-16"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Contáctanos 📩
      </h1>

      <p className="text-center text-gray-600 mb-8">
        Si te interesa alguno de nuestros coches o tienes dudas, rellena el
        formulario y nos pondremos en contacto contigo lo antes posible.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Opcional"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mensaje *</label>
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={estado === "enviando"}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {estado === "enviando" ? "Enviando..." : "Enviar mensaje"}
        </motion.button>

        {estado === "ok" && (
          <motion.p
            className="text-green-600 font-semibold mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✅ ¡Tu mensaje ha sido enviado correctamente!
          </motion.p>
        )}

        {estado === "error" && (
          <motion.p
            className="text-red-600 font-semibold mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ❌ Hubo un error al enviar el mensaje. Intenta de nuevo más tarde.
          </motion.p>
        )}
      </form>
    </motion.section>
  );
}
