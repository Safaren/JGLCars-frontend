// src/hooks/useTokenRefresher.ts

"use client";

import { useEffect } from "react";

export function useTokenRefresher() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!API) return;

    const doRefresh = async () => {
      try {
        await fetch(`${API}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          mode: "cors",
        });
      } catch (err) {
        console.error("Error refrescando token:", err);
      }
    };

    doRefresh(); // primera vez

    const interval = setInterval(doRefresh, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [API]);
}
