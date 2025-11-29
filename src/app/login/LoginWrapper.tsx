"use client";

import dynamic from "next/dynamic";

const LoginClient = dynamic(() => import("@/components/LoginClient"), {
  ssr: false,
});

export default function LoginWrapper() {
  return <LoginClient />;
}
