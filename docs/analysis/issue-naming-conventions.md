# Issue: Estandarizar convenciones de nomenclatura de archivos

## Problema
El proyecto presenta inconsistencias en las convenciones de nomenclatura de archivos, mezclando kebab-case, camelCase y PascalCase sin seguir las mejores prácticas de Next.js.

## Ejemplos de inconsistencias

### En carpetas
```
./app/(auth)/           ✓ kebab-case (correcto para Next.js)
./app/dashboard/        ✓ kebab-case
./qr-codes/            ✓ kebab-case  
./homepage-sections/   ✓ kebab-case
```

### En archivos de configuración
```
./hero-swipe-animations.css     ✓ kebab-case
./hero-carousel.css             ✓ kebab-case
```

### En componentes (posibles inconsistencias)
```
./components/FAQ.tsx            ✗ Debería ser faq.tsx o Faq.tsx
./components/TLDR.tsx           ✗ Debería ser tldr.tsx o Tldr.tsx
./components/QRVenueForm.tsx    ✗ Debería ser qr-venue-form.tsx
```

## Convenciones Next.js recomendadas

### Para App Router (carpetas y páginas)
- **Carpetas**: kebab-case (`user-profile`, `blog-posts`)
- **Archivos especiales**: snake_case (`page.tsx`, `layout.tsx`, `not-found.tsx`)
- **Rutas dinámicas**: brackets (`[id]`, `[...slug]`)

### Para componentes
- **Archivos**: PascalCase (`UserProfile.tsx`, `BlogPost.tsx`)
- **Archivos utilitarios**: kebab-case (`api-client.ts`, `date-utils.ts`)

### Para otros archivos
- **Styles**: kebab-case (`global-styles.css`, `component-theme.css`)
- **Utils/Libs**: kebab-case (`auth-config.ts`, `api-client.ts`)
- **Types**: kebab-case (`user-types.ts`, `api-types.ts`)

## Archivos que necesitan renombramiento

### Componentes con acrónimos
```
FAQ.tsx → Faq.tsx (o mantener FAQ.tsx si se prefiere)
TLDR.tsx → Tldr.tsx (o mantener TLDR.tsx si se prefiere)  
QRVenueForm.tsx → QrVenueForm.tsx (consistente con otros QR*)
```

## Acción recomendada
1. **Definir estándar del proyecto** para acrónimos:
   - Opción A: PascalCase estricto (`Faq`, `Tldr`, `QrVenue`)
   - Opción B: Mantener acrónimos conocidos (`FAQ`, `TLDR`, `QRVenue`)

2. **Renombrar archivos inconsistentes** (si se elige Opción A):
   ```bash
   git mv components/FAQ.tsx components/Faq.tsx
   git mv components/TLDR.tsx components/Tldr.tsx
   git mv components/QRVenueForm.tsx components/QrVenueForm.tsx
   ```

3. **Actualizar imports** en archivos que referencien componentes renombrados

4. **Documentar convenciones** en `CODE_GUIDELINES.md`:
   ```markdown
   ### Convenciones de nomenclatura
   - Componentes: PascalCase (UserProfile.tsx)
   - Páginas App Router: kebab-case para carpetas, archivos especiales como page.tsx
   - Utilities: kebab-case (api-client.ts)
   - Styles: kebab-case (global-styles.css)
   - Acrónimos: [definir estándar elegido]
   ```

## Criterio de aceptación
- [ ] Estándar de nomenclatura definido en documentación
- [ ] Archivos inconsistentes renombrados
- [ ] Imports actualizados sin errores
- [ ] Build exitoso después de cambios
- [ ] Convenciones documentadas en CODE_GUIDELINES.md

## Prioridad
**Baja** - Mejora consistencia pero no afecta funcionalidad

## Impacto estimado
- Tiempo: 1-2 horas (dependiendo de la cantidad de imports a actualizar)
- Riesgo: Bajo (principalmente cambios de nombres)
- Beneficio: Mayor consistencia y claridad en el codebase