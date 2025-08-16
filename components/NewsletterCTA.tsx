"use client";

import { Mail, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Suscripción exitosa!</h2>
            <p className="text-muted-foreground">
              Gracias por suscribirte. Recibirás las mejores reseñas cada semana en tu email.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Descubre los mejores locales cada semana</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Únete a nuestra comunidad de food lovers y recibe reseñas exclusivas, nuevas aperturas y ofertas especiales directamente en tu bandeja de entrada.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" required />
            <Button type="submit" className="bg-accent hover:bg-accent/90 px-8">Suscribirse</Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">Sin spam. Solo las mejores reseñas. Cancela cuando quieras.</p>
        </div>
      </div>
    </section>
  );
}


