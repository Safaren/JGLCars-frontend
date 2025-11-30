"use client";

import { useTokenRefresher } from "@/hooks/useTokenRefresher";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useTokenRefresher();
  return <>{children}</>;
}
