// src/context/AuthContext.tsx

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

  // ==========================================
  // 🔵 CARGA INICIAL (si hay usuario guardado)
  // ==========================================
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {}

    setLoading(false);
  }, []);

  // ==========================================
  // 🔵 LOGIN NORMAL (CORREGIDO)
  // ==========================================
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

      // ⭐ GUARDAR TOKEN CORRECTAMENTE
      const token = body.accessToken;
      if (!token) {
        console.error("❌ El backend no envió accessToken");
        return false;
      }

      localStorage.setItem("token", token);

      // ⭐ GUARDAR USUARIO
      const loggedUser: User = body.user;
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);

      router.refresh();
      return true;
    } catch (err) {
      console.error("Login ERROR:", err);
      return false;
    }
  };

  // ==========================================
  // 🔵 LOGIN SOCIAL (Google / Facebook)
  // ==========================================
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

      // Aquí `data.user` es el usuario real
      const socialUser: User = data.user ?? data;

      localStorage.setItem("user", JSON.stringify(socialUser));
      setUser(socialUser);

      router.refresh();
    } catch (err) {
      console.error("Login social ERROR:", err);
    }
  };

  // ==========================================
  // 🔵 REFRESCAR TOKEN (placeholder)
  // ==========================================
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

  // Refrescar cada 10 min
  useEffect(() => {
    const interval = setInterval(refreshToken, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // 🔵 LOGOUT
  // ==========================================
  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    localStorage.removeItem("token");
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

// ==========================================
// 🔵 HOOK PERSONALIZADO
// ==========================================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
