# Issue: Reorganizar archivos CSS según convenciones de Next.js

## Problema
Los archivos CSS están dispersos en múltiples ubicaciones, violando la convención de Next.js de centralizar estilos en el directorio `styles/`.

## Archivos mal ubicados
```
./components/hero-swipe-animations.css → debería estar en ./styles/
./app/globals.css → duplicado de ./styles/globals.css
```

## Por qué es problemático
1. **Violación de convenciones Next.js**: Los estilos globales deben estar en `styles/`
2. **Duplicación de globals.css**: Causa confusión sobre cuál archivo es la fuente de verdad
3. **Organización inconsistente**: Mezcla lógica de componentes con estilos
4. **Dificultad de mantenimiento**: Estilos repartidos dificultan actualizaciones
5. **Potenciales conflictos**: Múltiples archivos globals.css pueden causar problemas

## Ubicación actual vs recomendada
| Actual | Recomendado |
|--------|-------------|
| `./components/hero-swipe-animations.css` | `./styles/hero-swipe-animations.css` |
| `./app/globals.css` | Eliminar (usar `./styles/globals.css`) |

## Acción recomendada
1. **Mover archivos CSS a styles/**:
   ```bash
   git mv components/hero-swipe-animations.css styles/
   ```

2. **Eliminar duplicado de globals.css**:
   ```bash
   git rm app/globals.css
   ```

3. **Actualizar imports** en componentes afectados:
   ```tsx
   // Cambiar imports como:
   import './hero-swipe-animations.css'
   // Por:
   import '@/styles/hero-swipe-animations.css'
   ```

4. **Verificar que globals.css se importa correctamente** en `app/layout.tsx`:
   ```tsx
   import '@/styles/globals.css'
   ```

## Criterio de aceptación
- [ ] Todos los archivos CSS movidos a `styles/`
- [ ] Eliminado `app/globals.css` duplicado
- [ ] Imports actualizados en componentes
- [ ] Build exitoso sin errores CSS
- [ ] Estilos se aplican correctamente en desarrollo y producción

## Prioridad
**Media** - Mejora organización pero no afecta funcionalidad

## Impacto estimado
- Tiempo: 30-60 minutos
- Riesgo: Bajo 
- Beneficio: Mejor organización y adherencia a convenciones Next.js