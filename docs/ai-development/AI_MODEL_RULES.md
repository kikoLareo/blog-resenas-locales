# Reglas para Modelos de IA

Este archivo contiene directrices específicas para modelos de IA que trabajen con este código base. Estos lineamientos ayudan a asegurar que las sugerencias y modificaciones propuestas por los asistentes de IA se alineen con las mejores prácticas y requerimientos del proyecto.

## Reglas Generales

1. **Priorizar SEO** - Cualquier código generado debe incluir elementos que favorezcan el SEO.
2. **Enfatizar la accesibilidad** - Siempre incluir atributos ARIA y seguir las directrices de WCAG.
3. **Considerar el rendimiento** - Priorizar soluciones eficientes y optimizadas.
4. **Mantener la consistencia** - Seguir el estilo y patrones existentes en el código base.
5. **Sugerir mejoras** - Identificar oportunidades para mejorar el código existente.
6. **Enfoque mobile first** - Siempre hay que enfocar la interfaz para que sea vea bien en los dispositivos moviles ya que
serán los más usados, sin dejar de lado la vista navegador

## Generación de Componentes

Cuando generes o modifiques componentes React:

1. **Incluir siempre la directiva "use client"** si el componente utiliza hooks de React o interactividad del lado del cliente.

2. **Estructura del componente**:
   ```tsx
   "use client";
   
   import { useState, useEffect, useCallback } from 'react';
   import { ComponenteX } from './ComponenteX';
   
   interface MiComponenteProps {
     prop1: string;
     prop2?: number;
     onAction?: () => void;
   }
   
   export function MiComponente({ prop1, prop2 = 0, onAction }: MiComponenteProps) {
     // Lógica del componente...
     
     return (
       // JSX con elementos semánticos y atributos de accesibilidad
     );
   }
   ```

3. **Para componentes con estado**, usar `useCallback` para funciones que se pasan a componentes hijos o se utilizan en dependencias de `useEffect`.

4. **Para imágenes**, siempre usar `ImageWithFallback` de nuestro componente personalizado:
   ```tsx
   <ImageWithFallback
     src={imageUrl}
     alt="Descripción detallada de la imagen"
     fill
     sizes="100vw"
     quality={85}
     priority={isPriority}
   />
   ```

## SEO y Accesibilidad

1. **Schema.org**: Implementar marcado estructurado en todos los componentes relevantes:
   ```tsx
   <article itemScope itemType="https://schema.org/Review">
     <h2 itemProp="name">{title}</h2>
     <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
       <meta itemProp="ratingValue" content={rating.toString()} />
       <meta itemProp="bestRating" content="5" />
     </div>
     <p itemProp="reviewBody">{content}</p>
   </article>
   ```

2. **Estructura semántica**: Usar elementos HTML apropiados (header, main, footer, nav, section, article, etc.) en lugar de div genéricos.

3. **Atributos ARIA**: Incluir atributos como `aria-label`, `aria-expanded`, `role`, etc. en elementos interactivos:
   ```tsx
   <button 
     aria-label="Abrir menú de navegación"
     aria-expanded={isOpen}
     onClick={toggleMenu}
   >
     <MenuIcon />
   </button>
   ```

4. **Carrusel accesible**: Seguir este patrón para componentes de carrusel:
   ```tsx
   <div role="region" aria-label="Reseñas destacadas">
     <div role="tablist" aria-label="Controles de carrusel">
       {slides.map((_, index) => (
         <button
           key={index}
           role="tab"
           aria-selected={index === currentIndex}
           aria-label={`Ver diapositiva ${index + 1}`}
           onClick={() => goToSlide(index)}
         />
       ))}
     </div>
     {/* Contenido del carrusel */}
   </div>
   ```

## Estilos y Diseño

1. **Tailwind CSS**: Utilizar exclusivamente clases de Tailwind para los estilos:
   ```tsx
   <div className="flex flex-col md:flex-row gap-4 p-6 rounded-lg bg-white shadow-md">
     {/* Contenido */}
   </div>
   ```

2. **Responsive design**: Implementar diseño responsive con las clases de Tailwind:
   ```tsx
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
     {/* Items */}
   </div>
   ```

3. **Animaciones**: Usar transiciones y animaciones optimizadas:
   ```tsx
   <div className="transition-all duration-300 transform hover:scale-105">
     {/* Contenido */}
   </div>
   ```

## Interacción con Sanity

1. **Consultas GROQ**: Optimizar consultas para recuperar solo los datos necesarios:
   ```tsx
   const query = `*[_type == "review" && slug.current == $slug][0]{
     title,
     "slug": slug.current,
     rating,
     content,
     "venue": venue->{name, "slug": slug.current, city},
     "imageUrl": mainImage.asset->url
   }`;
   ```

2. **Revalidación**: Configurar estrategias de revalidación adecuadas:
   ```tsx
   const data = await sanityFetch({
     query: query,
     params: { slug },
     tags: ['review', 'venue'],
     revalidate: 3600
   });
   ```

## Patrones a Evitar

1. **No utilizar estilos en línea** - Usar siempre clases de Tailwind.

2. **No utilizar elementos no semánticos** - Evitar divs cuando un elemento semántico sería más apropiado.

3. **No omitir claves en listas** - Usar siempre keys únicas y estables:
   ```tsx
   {items.map((item) => (
     <ListItem key={item.id} data={item} />
   ))}
   ```

4. **No cargar imágenes sin optimización** - Evitar usar la etiqueta `<img>` directamente.

5. **No olvidar manejar estados de carga y error** - Implementar siempre estados de carga y manejo de errores:
   ```tsx
   if (isLoading) return <LoadingSpinner />;
   if (error) return <ErrorMessage message={error.message} />;
   ```

## Ejemplos de Patrones Correctos

### Carrusel con SEO y Accesibilidad

```tsx
"use client";

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './ImageWithFallback';

interface CarouselProps {
  items: CarouselItem[];
  onItemClick?: (id: string) => void;
}

export function Carousel({ items, onItemClick }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);
  
  return (
    <section className="relative" itemScope itemType="https://schema.org/ItemList">
      <meta itemProp="numberOfItems" content={items.length.toString()} />
      
      <div role="region" aria-label="Carrusel de contenido" className="overflow-hidden">
        <div className="relative">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className={`transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={index !== currentIndex}
            >
              <div itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <meta itemProp="position" content={(index + 1).toString()} />
                {/* Contenido del item */}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4" role="tablist" aria-label="Navegación de carrusel">
          {items.map((_, index) => (
            <button
              key={index}
              className={`mx-1 h-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-gray-300'}`}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Componente de Reseña con Schema.org

```tsx
"use client";

import { Star, MapPin, Clock } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    image: string;
    rating: number;
    location: string;
    readTime: string;
    content: string;
    date: string;
    author: string;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article 
      className="rounded-lg overflow-hidden shadow-md bg-white"
      itemScope 
      itemType="https://schema.org/Review"
    >
      <div className="relative h-48">
        <ImageWithFallback
          src={review.image}
          alt={`Imagen de ${review.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 
          className="text-xl font-semibold mb-2 line-clamp-2"
          itemProp="name"
        >
          {review.title}
        </h3>
        
        <div className="flex items-center mb-3">
          <div 
            className="flex items-center"
            itemProp="reviewRating" 
            itemScope 
            itemType="https://schema.org/Rating"
          >
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span itemProp="ratingValue">{review.rating}</span>
            <meta itemProp="bestRating" content="5" />
          </div>
          
          <div className="flex items-center ml-3">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{review.location}</span>
          </div>
        </div>
        
        <p 
          className="text-gray-600 line-clamp-3 mb-4"
          itemProp="reviewBody"
        >
          {review.content}
        </p>
        
        <meta itemProp="datePublished" content={review.date} />
        <meta itemProp="author" content={review.author} />
        
        <button 
          className="text-primary font-medium hover:underline"
          aria-label={`Leer reseña completa de ${review.title}`}
        >
          Leer más
        </button>
      </div>
    </article>
  );
}
```

---

Estas directrices están diseñadas para asegurar que las sugerencias de IA se alineen con los objetivos y prácticas del proyecto. Deben actualizarse a medida que evolucionen las necesidades y tecnologías del proyecto.
