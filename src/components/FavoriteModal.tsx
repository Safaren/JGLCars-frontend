"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoriteModal({ isOpen, onClose }: FavoriteModalProps) {
  const router = useRouter();

  const handleRegister = () => {
    onClose();
    router.push("/register");
  };

  const handleContact = () => {
    onClose();
    router.push("/contacto");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">¡Guarda tus favoritos!</h2>
            <p className="text-gray-600 mb-6">
              Para guardar este coche en tus favoritos, necesitas estar registrado. ¿Quieres crear una cuenta ahora?
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleRegister}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Registrarse
              </button>
              <button
                onClick={handleContact}
                className="flex-1 bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Contactar
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-3 text-gray-600 hover:text-gray-900 transition"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
