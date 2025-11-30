"use client";

import { useEffect } from "react";

export function useTokenRefresher() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch(`${API}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Error refrescando token:", err);
      }
    }, 10 * 60 * 1000); // cada 10 minutos

    return () => clearInterval(interval);
  }, []);
}
