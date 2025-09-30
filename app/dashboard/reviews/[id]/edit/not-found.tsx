import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileX } from 'lucide-react';

export default function ReviewNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <FileX className="h-24 w-24 text-gray-400" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reseña no encontrada
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            La reseña que buscas no existe o ha sido eliminada.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/dashboard/reviews" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a Reseñas</span>
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/dashboard">
              Ir al Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}