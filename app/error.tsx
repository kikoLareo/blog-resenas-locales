'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging
    console.error('Application error:', error);
    
    // Check if this is a destructuring error
    if (error.message && error.message.includes('destructur')) {
      console.warn('Caught destructuring error - this may be related to NextAuth or params handling');
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            ¡Ups! Algo salió mal
          </CardTitle>
          <CardDescription className="text-gray-600">
            Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={reset} 
            className="w-full"
            variant="default"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Intentar de nuevo
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline"
            className="w-full"
          >
            Ir al inicio
          </Button>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-4 bg-gray-100 rounded-lg">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Detalles del error (desarrollo)
              </summary>
              <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                {error.message}
                {error.stack && '\n\nStack trace:\n' + error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
