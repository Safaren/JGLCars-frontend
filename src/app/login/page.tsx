"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // 🔥 USAMOS EL CONTEXTO
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 🔥 USAMOS login() DEL CONTEXTO
    const ok = await login(email, password);

    if (!ok) {
      setError("Credenciales incorrectas");
      return;
    }

    // Leemos usuario actualizado del localStorage
    const saved = localStorage.getItem("user");
    const user = saved ? JSON.parse(saved) : null;

    // Redirección según rol
    if (user?.rol?.toLowerCase() === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Iniciar sesión</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <label className="block mb-1 text-gray-700">Email</label>
        <input
          className="w-full border p-2 rounded mb-3"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-1 text-gray-700">Contraseña</label>
        <input
          className="w-full border p-2 rounded mb-3"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700">
          Entrar
        </button>
      </form>
    </div>
  );
}
