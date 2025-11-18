import { Suspense } from "react";
import ContactoForm from "./ContactoForm";

export default function ContactoPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Cargando...</p>}>
      <ContactoForm />
    </Suspense>
  );
}
