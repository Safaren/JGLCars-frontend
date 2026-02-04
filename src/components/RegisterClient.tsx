"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Error registrando");
        setLoading(false);
        return;
      }

      // Redirigir a login para que el usuario inicie sesión
      setLoading(false);
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    window.location.href = url;
  };

  return (
    <section className="py-16 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Registrarse</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Nombre</label>
            <input className="w-full border p-3 rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input className="w-full border p-3 rounded-lg" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Contraseña</label>
            <input className="w-full border p-3 rounded-lg" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <p className="text-red-600 text-center font-medium">{error}</p>}

          <button disabled={loading} className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"}`}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={handleGoogle} className="bg-white border px-4 py-2 rounded inline-flex items-center gap-2">
            <img src="/google.svg" alt="Google" className="h-5" /> Entrar con Google
          </button>
        </div>
      </div>
    </section>
  );
}
