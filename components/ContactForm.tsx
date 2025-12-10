'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertCircle } from 'lucide-react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For now, just show success message
    setStatus('success');
    
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">¡Mensaje enviado!</h3>
        <p className="text-green-600 mb-6">
          Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible.
        </p>
        <Button 
          variant="outline" 
          onClick={() => setStatus('idle')}
          className="bg-white hover:bg-green-50 text-green-700 border-green-200"
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>
      
      <form role="form" className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              required
              disabled={status === 'submitting'}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Apellidos
            </label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              required
              disabled={status === 'submitting'}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            disabled={status === 'submitting'}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Asunto
          </label>
          <select
            id="subject"
            name="subject"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
            disabled={status === 'submitting'}
          >
            <option value="">Selecciona un asunto</option>
            <option value="suggestion">Sugerencia de local</option>
            <option value="collaboration">Propuesta de colaboración</option>
            <option value="feedback">Comentario sobre reseña</option>
            <option value="technical">Problema técnico</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje
          </label>
          <Textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Cuéntanos más detalles..."
            required
            disabled={status === 'submitting'}
          />
        </div>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <p className="text-sm text-red-700">
              Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Enviando...' : 'Enviar mensaje'}
        </Button>
      </form>
    </div>
  );
}
