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
          { credentials: "include" }
        );

        const data = await res.json();

        if (data.loggedIn) setUser(data.user);
      } catch {}
      setLoading(false);
    }

    check();
  }, []);

  return { user, loading };
}
