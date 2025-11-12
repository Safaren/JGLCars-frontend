"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Error al iniciar sesión");
        return;
      }

      // ✅ Guardar datos de usuario y CSRF token
      localStorage.setItem("user", JSON.stringify(body.user));
      localStorage.setItem("csrfToken", body.csrfToken);

      if (body.user?.rol === "Admin" || body.user?.rol === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
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
