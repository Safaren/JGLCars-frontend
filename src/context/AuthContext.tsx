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
  logout: () => Promise<void>;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carga inicial
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  // === LOGIN ===
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const body = await res.json();
      console.log("LOGIN RESPONSE:", body);

      if (!res.ok) return false;

      const loggedUser = body.user ?? body.userData;
      if (!loggedUser) return false;

      // 🔥 GUARDAR USUARIO + ACTUALIZAR CONTEXTO
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser); //  <--- ESTO ES LO MÁS IMPORTANTE

      // 🔥 FORZAR RE-RENDER DEL NAVBAR
      router.refresh();

      return true;
    } catch (err) {
      console.error("Login ERROR:", err);
      return false;
    }
  };

  // === LOGOUT ===
  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch {}

    localStorage.removeItem("user");
    setUser(null);
    router.refresh();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
