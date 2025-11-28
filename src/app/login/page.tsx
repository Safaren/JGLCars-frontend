// src/app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();

  const { login, loginSocial } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // =======================================================
  // 🔥 AUTO-LOGIN DESPUÉS DE GOOGLE/FACEBOOK
  // =======================================================
  useEffect(() => {
    const oauth = params.get("oauth");

    if (oauth === "success") {
      console.log("🔵 Detectado callback OAuth → loginSocial()");
      (async () => {
        await loginSocial();

        // Redirigimos según rol
        const saved = localStorage.getItem("user");
        const user = saved ? JSON.parse(saved) : null;

        if (user?.rol?.toLowerCase() === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      })();
    }
  }, [params]); // se ejecuta al cargar la página si viene con ?oauth=success

  // =======================================================
  // 🔥 LOGIN NORMAL (EMAIL + PASS)
  // =======================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const ok = await login(email, password);

    setLoading(false);

    if (!ok) {
      setError("Credenciales incorrectas");
      return;
    }

    const saved = localStorage.getItem("user");
    const user = saved ? JSON.parse(saved) : null;

    if (user?.rol?.toLowerCase() === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  // =======================================================
  // 🔥 LOGIN SOCIAL
  // =======================================================
  const loginGoogle = () => {
    window.location.href = `${API}/auth/google`;
  };

  const loginFacebook = () => {
    window.location.href = `${API}/auth/facebook`;
  };

  return (
    <motion.section
      className="py-16 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          Iniciar sesión
        </h1>

        {/* BOTONES SOCIALES */}
        {/*<div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={loginGoogle}
            className="w-full flex items-center justify-center gap-3 border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <img src="/icons/google.svg" className="w-5 h-5" />
            Continuar con Google
          </button>

          <button
            type="button"
            onClick={loginFacebook}
            className="w-full flex items-center justify-center gap-3 border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <img src="/icons/facebook.svg" className="w-5 h-5" />
            Continuar con Facebook
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">o</span>
          </div>
        </div>*/}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              className="w-full border p-3 rounded-lg"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Contraseña</label>
            <input
              className="w-full border p-3 rounded-lg"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}

          <button
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Accediendo..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            href="/recuperar"
            className="text-sm text-gray-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

       {/* <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-blue-600 font-semibold">
            Crear cuenta
          </Link>
        </p>*/}
      </div>
    </motion.section>
  );
}
