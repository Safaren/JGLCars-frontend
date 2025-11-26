import ContactoForm from "../../components/ContactoForm";



export default function ContactoPage() {
  // Cambia aquí el número que quieres mostrar
  const phone = "621 630 342";

  return (
    <section className="max-w-6xl mx-auto mt-20 mb-32 px-6">
      <h1 className="text-4xl font-extrabold mb-8 text-amber-500">Contacto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* IZQUIERDA: formulario */}
        <div>
          <ContactoForm />
        </div>

        {/* DERECHA: tarjeta de llamada */}
        <aside className="sticky top-24">
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl mb-3 font-bold text-amber-400">
              ¿Prefieres que te llamemos?
            </h2>

            <p className="text-gray-300 mb-4">
              Déjanos tu teléfono en el formulario y uno de nuestros asesores te llamará.
            </p>

            <div className="border border-gray-800 p-4 rounded-lg bg-black/50">
              <p className="text-sm text-gray-400">O llámanos al:</p>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="block text-3xl font-extrabold text-amber-500 mt-2"
              >
                {phone}
              </a>

              <p className="text-gray-400 text-sm mt-3">
                Horario: Lun–Vie 9:00 – 20:00
              </p>
            </div>

            <hr className="border-gray-800 my-5" />

            <p className="text-sm text-gray-300">
              Si lo prefieres, indica en el mensaje la franja horaria en la que te viene mejor
              recibir la llamada.
            </p>

            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="inline-block mt-6 bg-amber-500 text-black font-semibold px-5 py-2 rounded-lg hover:opacity-90"
            >
              Llamar ahora
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
