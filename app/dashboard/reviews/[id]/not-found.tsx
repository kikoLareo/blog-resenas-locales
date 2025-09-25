import Link from "next/link";
import { FileX } from "lucide-react";

export default function ReviewNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <FileX className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Reseña no encontrada</h2>
      <p className="text-gray-600 mb-6">
        La reseña que buscas no existe o ha sido eliminada.
      </p>
      <Link
        href="/dashboard/reviews"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Volver a reseñas
      </Link>
    </div>
  );
}
