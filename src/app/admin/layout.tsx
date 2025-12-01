// src/app/admin/layout.tsx

"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (!user || user.rol?.toLowerCase() !== "admin") redirect("/login");

  return <>{children}</>;
}
