# Directrices de Código para Blog Reseñas Locales

Este documento establece las reglas y consideraciones a tener en cuenta al desarrollar en este proyecto. Seguir estas directrices asegurará la consistencia, mantenibilidad y calidad del código.

## Principios Generales

1. **Prioriza el SEO en todo momento** - El posicionamiento es clave para el éxito del proyecto.
2. **Accesibilidad primero** - Todo el código debe ser accesible (WCAG AA mínimo).
3. **Rendimiento optimizado** - El sitio debe cargar rápidamente y ser eficiente.
4. **Mobile-first** - El diseño debe optimizarse primero para dispositivos móviles.
5. **Código limpio y bien documentado** - El código debe ser legible y mantenible.

## Reglas Específicas

### Next.js y Componentes React

1. **"use client" obligatorio** - Añadir la directiva `"use client"` al principio de cada archivo que utilice hooks de React o interactividad del lado del cliente.
   ```tsx
   "use client";
   
   import { useState } from 'react';
   // resto del código...
   ```

2. **Componentes atómicos** - Crear componentes pequeños y reutilizables que tengan una única responsabilidad.

3. **Optimización de imágenes** - Utilizar siempre `ImageWithFallback` (nuestro componente personalizado basado en `next/image`) para todas las imágenes.

4. **Carga perezosa** - Implementar `lazy loading` para componentes pesados que no sean críticos para la primera carga.

5. **TypeScript estricto** - Definir tipos para todos los props, estados y funciones.
   ```tsx
   interface CardProps {
     title: string;
     image: string;
     description?: string;
     onClick?: () => void;
   }
   ```

### Convenciones de Nomenclatura

1. **Componentes React** - Usar PascalCase estricto para archivos de componentes:
   ```
   UserProfile.tsx    ✓ Correcto
   VenueDetail.tsx    ✓ Correcto 
   Faq.tsx           ✓ Correcto (acrónimo tratado como palabra)
   Tldr.tsx          ✓ Correcto (acrónimo tratado como palabra)
   QrVenueForm.tsx   ✓ Correcto (consistente con otros QR*)
   ```

2. **Páginas App Router** - Usar kebab-case para carpetas y archivos especiales:
   ```
   user-profile/      ✓ Correcto para carpetas
   blog-posts/        ✓ Correcto para carpetas
   page.tsx          ✓ Correcto para archivos especiales
   layout.tsx        ✓ Correcto para archivos especiales
   not-found.tsx     ✓ Correcto para archivos especiales
   ```

3. **Archivos utilitarios** - Usar kebab-case:
   ```
   api-client.ts     ✓ Correcto
   date-utils.ts     ✓ Correcto
   qr-utils.ts       ✓ Correcto
   auth-config.ts    ✓ Correcto
   ```

4. **Archivos de estilos** - Usar kebab-case:
   ```
   global-styles.css     ✓ Correcto
   component-theme.css   ✓ Correcto
   hero-carousel.css     ✓ Correcto
   ```

5. **Tipos TypeScript** - Usar kebab-case para archivos:
   ```
   user-types.ts     ✓ Correcto
   api-types.ts      ✓ Correcto
   venue-types.ts    ✓ Correcto
   ```

6. **Tratamiento de acrónimos** - Convertir acrónimos a PascalCase para componentes:
   ```
   FAQ → Faq         ✓ Más consistente
   TLDR → Tldr       ✓ Más consistente
   QR → Qr           ✓ Más consistente
   API → Api         ✓ Más consistente
   ```

### SEO y Estructura de Datos

1. **Metadatos por página** - Cada página debe tener sus propios metadatos usando el sistema de metadatos de Next.js:
   ```tsx
   export const metadata: Metadata = {
     title: 'Título de la página',
     description: 'Descripción detallada de la página',
     // otros metadatos...
   };
   ```

2. **Schema.org obligatorio** - Implementar marcado de Schema.org apropiado en cada página:
   - Usar `itemScope`, `itemType` y `itemProp` en elementos HTML relevantes
   - Para reseñas, usar `Review`, `Restaurant`, `LocalBusiness`, etc.
   - Para listas, usar `ItemList` con los correspondientes `itemListElement`

3. **Open Graph y Twitter Cards** - Incluir siempre metadatos para compartir en redes sociales:
   ```html
   <meta property="og:title" content="Título" />
   <meta property="og:description" content="Descripción" />
   <meta property="og:image" content="URL de imagen" />
   <meta name="twitter:card" content="summary_large_image" />
   ```

4. **Breadcrumbs** - Implementar migas de pan en todas las páginas de contenido con marcado de Schema.org.

5. **URLs semánticas** - Utilizar URLs descriptivas y semánticas con slugs basados en el contenido.

### CSS y Estilos

1. **Tailwind CSS** - Utilizar Tailwind para todos los estilos. Evitar CSS en línea o módulos CSS separados.

2. **Sistema de diseño coherente** - Seguir el sistema de diseño establecido:
   - Espaciado: usar los valores de espaciado de Tailwind (p-4, m-6, etc.)
   - Tipografía: usar las clases de texto predefinidas
   - Colores: usar solo colores del tema de Tailwind personalizado

3. **Componentes UI reutilizables** - Utilizar los componentes de `./components/ui/` para elementos de interfaz comunes.

4. **Responsive design** - Utilizar las clases responsive de Tailwind (sm:, md:, lg:, xl:) para adaptar el diseño a diferentes tamaños de pantalla.

5. **Animaciones optimizadas** - Usar solo animaciones que no afecten al rendimiento, preferiblemente con `transform` y `opacity`.

### Accesibilidad

1. **Atributos ARIA** - Incluir atributos ARIA apropiados en elementos interactivos y dinámicos:
   ```tsx
   <button aria-label="Cerrar modal" role="button">X</button>
   ```

2. **Contraste adecuado** - Asegurar un contraste adecuado entre texto y fondo (mínimo 4.5:1 para texto normal).

3. **Navegación por teclado** - Todos los elementos interactivos deben ser accesibles mediante teclado.

4. **Texto alternativo** - Proporcionar texto alternativo descriptivo para todas las imágenes:
   ```tsx
   <Image alt="Descripción detallada de la imagen que transmite su propósito" ... />
   ```

5. **Estructura semántica** - Utilizar elementos HTML semánticos apropiados (article, section, nav, etc.).

### Rendimiento

1. **Lazy loading** - Implementar carga perezosa para imágenes y componentes pesados.

2. **Optimización de bundle** - Minimizar el tamaño del bundle usando importaciones dinámicas cuando sea apropiado.

3. **Caché efectiva** - Configurar estrategias de caché adecuadas para contenido estático y dinámico.

4. **Optimización de imágenes** - Comprimir imágenes y servir en formatos modernos (WebP, AVIF).

5. **Métricas Core Web Vitals** - Monitorizar y optimizar para las métricas Core Web Vitals (LCP, FID, CLS).

### Sanity CMS

1. **Consultas optimizadas** - Escribir consultas GROQ eficientes que solo recuperen los campos necesarios.

2. **Revalidación planificada** - Configurar estrategias de revalidación apropiadas:
   ```tsx
   await sanityFetch({
     query: yourQuery,
     revalidate: 3600, // revalidar cada hora
     tags: ['tag1', 'tag2'], // para revalidación selectiva
   });
   ```

3. **Esquemas tipados** - Definir tipos TypeScript para todos los esquemas de Sanity.

4. **Gestión de imágenes** - Utilizar la API de imágenes de Sanity para transformaciones y optimizaciones.

5. **Vistas previas** - Implementar vistas previas para contenido no publicado durante el proceso editorial.

## Proceso de desarrollo

1. **Pruebas unitarias** - Escribir pruebas para componentes críticos y funcionalidades principales.

2. **Revisión de código** - Todas las pull requests deben ser revisadas por al menos un miembro del equipo.

3. **Linting y formateo** - El código debe pasar todas las reglas de ESLint y Prettier antes de ser fusionado.

4. **Documentación** - Documentar funciones, componentes y decisiones arquitectónicas importantes.

5. **Commits semánticos** - Utilizar mensajes de commit descriptivos que sigan un formato estándar:
   ```
   feat: añadir nuevo componente de carrusel para reseñas
   fix: corregir problema de carga en imágenes de hero
   docs: actualizar documentación de API
   ```

## Consideraciones de seguridad

1. **Validación de entrada** - Validar todas las entradas del usuario en el cliente y servidor.

2. **Autenticación segura** - Utilizar las mejores prácticas para autenticación y manejo de sesiones.

3. **Prevención de XSS** - Escapar adecuadamente el contenido generado por el usuario.

4. **API segura** - Implementar límites de tasa y validación en endpoints de API.

5. **Secretos seguros** - Nunca exponer secretos o claves API en el código del cliente.

---

Estas directrices deben ser revisadas y actualizadas periódicamente para reflejar las mejores prácticas actuales y las necesidades del proyecto.
