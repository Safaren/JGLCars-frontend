// src/components/AdminLogin.tsx

"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || "Credenciales inválidas");
        return;
      }

      if (data.csrfToken)
        localStorage.setItem("csrfToken", data.csrfToken);

      router.push("/admin");
    } catch (error) {
      console.error(error);
      setErr("Error de red, prueba de nuevo");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
      >
        <h2 className="text-2xl font-semibold mb-4">Acceso administrador</h2>

        {err && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{err}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}
