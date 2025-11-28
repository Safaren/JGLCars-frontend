"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  email: string;
  rol: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginSocial: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // ===============================
  // 🔵 CARGA INICIAL
  // ===============================
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));

    setLoading(false);
  }, []);

  // ===============================
  // 🔵 LOGIN NORMAL (EMAIL + PASS)
  // ===============================
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();
      console.log("LOGIN RESPONSE:", body);

      if (!res.ok) return false;

      const loggedUser = body.user ?? body.userData;
      if (!loggedUser) return false;

      // Guardar usuario
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);

      router.refresh();
      return true;
    } catch (err) {
      console.error("Login ERROR:", err);
      return false;
    }
  };

  // ===============================
  // 🔵 LOGIN SOCIAL (Google / Facebook)
  // Se llama tras volver del callback /auth/google/callback
  // ===============================
  const loginSocial = async (): Promise<void> => {
    try {
      const res = await fetch(`${API}/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        console.warn("No hay usuario después de login social.");
        return;
      }

      const data = await res.json();

      // Guardar y actualizar contexto
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      router.refresh();
    } catch (err) {
      console.error("Login social ERROR:", err);
    }
  };

  // ===============================
  // 🔵 REFRESCAR TOKEN AUTOMÁTICAMENTE
  // ===============================
  const refreshToken = async () => {
    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.warn("No se pudo refrescar el token");
      }
    } catch (err) {
      console.error("Error refrescando token:", err);
    }
  };

  // refrescar token cada 10 minutos
  useEffect(() => {
    const interval = setInterval(refreshToken, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ===============================
  // 🔵 LOGOUT
  // ===============================
  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    localStorage.removeItem("user");
    setUser(null);
    router.refresh();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginSocial,
        refreshToken,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ===============================
// 🔵 HOOK PERSONALIZADO
// ===============================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
