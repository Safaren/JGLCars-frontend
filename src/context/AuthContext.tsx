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

  // AUTO LOGIN
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`${API}/auth/auto-login`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (data.loggedIn) setUser(data.user);
      } catch {}

      setLoading(false);
    }

    init();
  }, []);

  // LOGIN
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();

      if (!res.ok || !body.user) return false;

      setUser(body.user);
      router.refresh();
      return true;
    } catch {
      return false;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    setUser(null);
    router.refresh();
    router.push("/login");
  };

  // REFRESH
  const refreshToken = async () => {
    try {
      await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
  };

  useEffect(() => {
    const interval = setInterval(refreshToken, 12 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe estar dentro de AuthProvider");
  return ctx;
};
