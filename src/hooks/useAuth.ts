// src/hooks/useAuth.ts

"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/auto-login`,
          {
            credentials: "include",
            cache: "no-store",
            mode: "cors",
          }
        );

        const data = await res.json();
        console.log("useAuth auto-login response:", data);

        if (data.loggedIn) setUser(data.user);
      } catch (err) {
        console.error("useAuth auto-login error:", err);
      }
      setLoading(false);
    }

    check();
  }, []);

  return { user, loading };
}
