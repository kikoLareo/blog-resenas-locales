import Link from 'next/link';
import { Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-gray-50 text-gray-700 p-6">
      <Frown className="h-24 w-24 text-blue-500 mb-6" />
      <h1 className="text-4xl font-bold mb-3">Local No Encontrado</h1>
      <p className="text-lg text-center mb-8">
        Lo sentimos, no pudimos encontrar el local que estás buscando.
        <br />
        Puede que haya sido eliminado o que la URL sea incorrecta.
      </p>
      <Link href="/dashboard/venues">
        <Button>Volver a la lista de Locales</Button>
      </Link>
    </div>
  );
}
