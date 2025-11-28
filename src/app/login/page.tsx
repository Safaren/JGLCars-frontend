// src/app/login/page.tsx
import dynamic from "next/dynamic";

// 🚀 Importamos el componente cliente SIN SSR (muy importante)
const LoginClient = dynamic(() => import("@/components/LoginClient"), {
  ssr: false,
});

export default function LoginPage() {
  return <LoginClient />;
}
