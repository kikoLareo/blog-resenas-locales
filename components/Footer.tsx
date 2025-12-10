"use client";

import { Coffee, Instagram, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "./ui/separator";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-accent" />
              <span className="text-xl font-semibold">SaborLocal</span>
            </div>
            <p className="text-muted-foreground">
              Descubre los mejores restaurantes y locales de tu ciudad a través de 
              reseñas auténticas escritas por verdaderos amantes de la gastronomía.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/categorias" className="text-muted-foreground hover:text-accent transition-colors">Categorías</Link></li>
              <li><Link href="/top-resenas" className="text-muted-foreground hover:text-accent transition-colors">Top Reseñas</Link></li>
              <li><Link href="/ciudades" className="text-muted-foreground hover:text-accent transition-colors">Ciudades</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-accent transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Ciudades</h3>
            <ul className="space-y-2">
              <li><Link href="/madrid" className="text-muted-foreground hover:text-accent transition-colors">Madrid</Link></li>
              <li><Link href="/barcelona" className="text-muted-foreground hover:text-accent transition-colors">Barcelona</Link></li>
              <li><Link href="/valencia" className="text-muted-foreground hover:text-accent transition-colors">Valencia</Link></li>
              <li><Link href="/sevilla" className="text-muted-foreground hover:text-accent transition-colors">Sevilla</Link></li>
              <li><Link href="/bilbao" className="text-muted-foreground hover:text-accent transition-colors">Bilbao</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:hola@saborlocal.com" className="text-muted-foreground hover:text-accent transition-colors">hola@saborlocal.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+34 900 123 456</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">Calle Gastronómica, 123<br />28001 Madrid, España</span>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-accent transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-accent transition-colors">Términos de Uso</a>
            <a href="#" className="hover:text-accent transition-colors">Cookies</a>
            <a href="#" className="hover:text-accent transition-colors">Aviso Legal</a>
          </div>
          <div className="text-sm text-muted-foreground">© 2025 SaborLocal. Todos los derechos reservados.</div>
        </div>
      </div>
    </footer>
  );
}


