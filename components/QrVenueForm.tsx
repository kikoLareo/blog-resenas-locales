"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QRVenueFormProps {
  venueId: string;
  venueName: string;
  qrCode: string;
}

export default function QRVenueForm({ venueId, venueName, qrCode }: QRVenueFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    visitDate: "",
    visitTime: "",
    partySize: "",
    occasion: "",
    specialRequests: "",
    rating: "",
    feedback: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Aquí se enviaría la información a un endpoint o servicio
      const response = await fetch('/api/qr/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId,
          qrCode,
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Error al enviar la información');
      }
    } catch (error) {
      alert('Error al enviar la información. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Gracias por tu información!
        </h3>
        <p className="text-gray-600 mb-4">
          Hemos recibido tu información y la tendremos en cuenta para mejorar tu experiencia.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            Tu mesa está lista. ¡Disfruta de tu visita a {venueName}!
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información personal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Información personal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+34 600 000 000"
            />
          </div>

          <div>
            <Label htmlFor="partySize">Número de personas *</Label>
            <Select
              value={formData.partySize}
              onValueChange={(value) => setFormData({ ...formData, partySize: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 persona</SelectItem>
                <SelectItem value="2">2 personas</SelectItem>
                <SelectItem value="3">3 personas</SelectItem>
                <SelectItem value="4">4 personas</SelectItem>
                <SelectItem value="5">5 personas</SelectItem>
                <SelectItem value="6">6 personas</SelectItem>
                <SelectItem value="7+">7+ personas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Detalles de la visita */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Detalles de la visita
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="visitDate">Fecha de visita *</Label>
            <Input
              id="visitDate"
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="visitTime">Hora aproximada</Label>
            <Input
              id="visitTime"
              type="time"
              value={formData.visitTime}
              onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="occasion">Ocasión</Label>
            <Select
              value={formData.occasion}
              onValueChange={(value) => setFormData({ ...formData, occasion: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar ocasión" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Comida casual</SelectItem>
                <SelectItem value="business">Comida de negocios</SelectItem>
                <SelectItem value="date">Cita romántica</SelectItem>
                <SelectItem value="family">Comida familiar</SelectItem>
                <SelectItem value="celebration">Celebración</SelectItem>
                <SelectItem value="other">Otra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="rating">¿Has visitado antes este local?</Label>
            <Select
              value={formData.rating}
              onValueChange={(value) => setFormData({ ...formData, rating: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first-time">Primera vez</SelectItem>
                <SelectItem value="occasional">Visitante ocasional</SelectItem>
                <SelectItem value="regular">Cliente regular</SelectItem>
                <SelectItem value="frequent">Cliente frecuente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Solicitudes especiales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Solicitudes especiales
        </h3>
        
        <div>
          <Label htmlFor="specialRequests">Solicitudes especiales</Label>
          <Textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            placeholder="Alergias, preferencias de mesa, ocasión especial, etc."
            rows={3}
          />
        </div>
      </div>

      {/* Feedback */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Feedback (opcional)
        </h3>
        
        <div>
          <Label htmlFor="feedback">Comentarios o sugerencias</Label>
          <Textarea
            id="feedback"
            value={formData.feedback}
            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
            placeholder="¿Qué te gustaría ver mejorado? ¿Alguna sugerencia?"
            rows={3}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {submitting ? "Enviando..." : "Enviar información"}
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>
          Tu información será utilizada únicamente para mejorar tu experiencia en {venueName}.
        </p>
        <p className="mt-1">
          No compartiremos tus datos con terceros.
        </p>
      </div>
    </form>
  );
}

