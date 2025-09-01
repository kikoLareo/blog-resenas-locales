# Issue: Limpiar archivos duplicados con sufijos numéricos

## Problema
El repositorio contiene múltiples archivos duplicados con sufijos numéricos (" 2", " 3") que indican copias de seguridad o versiones experimentales no finalizadas. Esto viola las mejores prácticas de Next.js y crea confusión en el proyecto.

## Archivos afectados
```
./app/dashboard/acceso/page 2.tsx
./public/manifest 2.json
./components/figma/ImageWithFallback 2.tsx
./components/ui/card 2.tsx
./components/ui/separator 2.tsx
./components/ui/sheet 2.tsx
./components/ui/badge 2.tsx
./components/ui/utils 2.ts
./components/ui/utils 3.ts
./components/ui/input 2.tsx
./components/ui/button 2.tsx
./components/ui/sheet 3.tsx
./lib/slug 2.ts
./lib/slug 3.ts
```

## Por qué es problemático
1. **Confusión en imports**: Los desarrolladores no saben cuál archivo usar
2. **Duplicación de código**: Posibles implementaciones divergentes
3. **Violación de convenciones**: Next.js espera archivos únicos con nombres claros
4. **Mantenimiento problemático**: Cambios deben aplicarse en múltiples archivos
5. **Build issues**: Potenciales conflictos en el bundle de producción

## Acción recomendada
1. **Revisar cada par de archivos duplicados**:
   - Comparar contenido entre versión original y numerada
   - Identificar cuál es la versión correcta/más actualizada
   - Fusionar cambios necesarios en la versión principal

2. **Eliminar archivos numerados**:
   ```bash
   # Ejemplo para cada archivo
   git rm "components/ui/card 2.tsx"
   git rm "components/ui/separator 2.tsx"
   # ... etc
   ```

3. **Verificar que no hay imports rotos** después de la limpieza

## Criterio de aceptación
- [ ] Todos los archivos con sufijos numéricos eliminados
- [ ] Ningún import roto en el código
- [ ] Build exitoso sin errores
- [ ] Tests pasan sin fallos

## Prioridad
**Alta** - Afecta la maintainability y claridad del proyecto

## Impacto estimado
- Tiempo: 1-2 horas
- Riesgo: Bajo (si se verifican imports)
- Beneficio: Limpieza significativa del codebase