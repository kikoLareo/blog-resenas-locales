# Issue: Eliminar duplicación de archivo de verificación

## Problema
El archivo de verificación `255652817f6748e6af39b3271870729a.txt` existe en dos ubicaciones, violando las convenciones de Next.js para archivos estáticos.

## Ubicaciones actuales
```
./public/255652817f6748e6af39b3271870729a.txt ✓ (correcto)
./app/(public)/255652817f6748e6af39b3271870729a.txt ✗ (incorrecto)
```

## Por qué es problemático
1. **Violación de convenciones Next.js**: Los archivos estáticos deben estar solo en `public/`
2. **Duplicación innecesaria**: Mantenimiento de dos copias del mismo archivo
3. **Confusión en URLs**: Puede generar rutas conflictivas
4. **SEO issues**: Múltiples URLs para el mismo recurso
5. **Violación App Router**: Los archivos estáticos no van en `app/`

## Convención Next.js
Según la documentación oficial de Next.js:
- Archivos estáticos (robots.txt, verificaciones, iconos) → `public/`
- Archivos de aplicación (páginas, layouts, componentes) → `app/`

## Acción recomendada
1. **Verificar contenido de ambos archivos**:
   ```bash
   diff public/255652817f6748e6af39b3271870729a.txt app/(public)/255652817f6748e6af39b3271870729a.txt
   ```

2. **Eliminar archivo de app/(public)**:
   ```bash
   git rm "app/(public)/255652817f6748e6af39b3271870729a.txt"
   ```

3. **Verificar que la verificación funciona** desde `/255652817f6748e6af39b3271870729a.txt`

## Criterio de aceptación
- [ ] Archivo eliminado de `app/(public)/`
- [ ] Archivo mantiene funcionalidad desde `public/`
- [ ] URL `https://dominio.com/255652817f6748e6af39b3271870729a.txt` accesible
- [ ] No hay rutas conflictivas

## Prioridad
**Media** - Limpieza de estructura y adherencia a convenciones

## Impacto estimado
- Tiempo: 15 minutos
- Riesgo: Muy bajo
- Beneficio: Estructura más limpia y conforme a Next.js