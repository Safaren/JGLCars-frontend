"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthDebugPage() {
  const { user, loading } = useAuth();

  const [autoLoginResult, setAutoLoginResult] = useState<any>(null);
  const [refreshResult, setRefreshResult] = useState<any>(null);
  const [cookies, setCookies] = useState("");
  const [backendUser, setBackendUser] = useState<any>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // Leer cookies en cliente
  useEffect(() => {
    setCookies(document.cookie || "(sin cookies visibles)");
  }, []);

  // Probar auto-login
  useEffect(() => {
    async function testAutoLogin() {
      try {
        const res = await fetch(`${API}/auth/auto-login`, {
          credentials: "include",
        });
        const data = await res.json();
        setAutoLoginResult(data);
      } catch (err) {
        setAutoLoginResult("ERROR");
      }
    }

    testAutoLogin();
  }, []);

  // Pedir /auth/me para ver qué ve el backend
  useEffect(() => {
    async function backendMe() {
      try {
        const res = await fetch(`${API}/auth/me`, {
          credentials: "include",
        });
        const data = await res.json().catch(() => null);
        setBackendUser(data);
      } catch {
        setBackendUser(null);
      }
    }

    backendMe();
  }, []);

  // Probar refresh
  async function testRefresh() {
    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setRefreshResult(data);
    } catch (err) {
      setRefreshResult("ERROR");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">🔍 Debug Autenticación</h1>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Cookies visibles en navegador</h2>
        <pre className="bg-gray-100 p-2 rounded">{cookies}</pre>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">useAuth() → Estado actual</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify({ loading, user }, null, 2)}
        </pre>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">/auth/auto-login</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(autoLoginResult, null, 2)}
        </pre>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Backend /auth/me</h2>
        <p className="text-sm text-gray-600">(lo que el backend cree que eres)</p>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(backendUser, null, 2)}
        </pre>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Probar refresh token</h2>
        <button
          onClick={testRefresh}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Ejecutar
        </button>
        <pre className="bg-gray-100 p-2 rounded mt-2">
          {JSON.stringify(refreshResult, null, 2)}
        </pre>
      </section>
    </div>
  );
}
