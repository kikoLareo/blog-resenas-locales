# Issues del Proyecto - Blog Reseñas Locales

Esta carpeta contiene issues detallados identificados durante la revisión del proyecto el 30 de octubre de 2025.

## Resumen de Issues

**Total: 10 issues**

### 🔴 Críticos (2)
1. [Configuración webpack duplicada](./01-webpack-duplicado.md)
2. [Código muerto en homepage (~300 líneas)](./02-codigo-muerto-homepage.md)

### 🟡 Importantes (4)
3. [Ruta /top-resenas no existe (404)](./03-ruta-top-resenas-404.md)
4. [Enlaces rotos en Footer (múltiples href="#")](./04-footer-enlaces-rotos.md)
5. [Ciudad "A Coruña" faltante en display](./05-ciudad-a-coruna-faltante.md)
6. [Páginas marketing sin enlaces desde el sitio](./06-paginas-marketing-sin-enlaces.md)

### 🔵 Menores (4)
7. [Emoji genérico para A Coruña](./07-emoji-a-coruna-generico.md)
8. [Newsletter CTA sin funcionalidad](./08-newsletter-sin-funcionalidad.md)
9. [Búsqueda en Header sin implementar](./09-busqueda-header-sin-implementar.md)
10. [Inconsistencia en URLs de reviews](./10-urls-reviews-inconsistentes.md)

## Cómo usar estos issues

### Opción 1: Copiar a GitHub Issues manualmente
1. Ir a https://github.com/kikoLareo/blog-resenas-locales/issues/new
2. Copiar el contenido de cada archivo .md
3. Crear issue con título y contenido correspondiente
4. Asignar labels sugeridos

### Opción 2: Usar GitHub CLI (si está disponible)
```bash
# Para cada issue
gh issue create --title "Título del issue" --body-file .github/ISSUES/01-webpack-duplicado.md --label bug,critical,configuration
```

### Opción 3: Script de automatización
```bash
# Crear todos los issues automáticamente
for file in .github/ISSUES/*.md; do
  if [ "$file" != ".github/ISSUES/README.md" ]; then
    title=$(head -n 1 "$file" | sed 's/# //')
    gh issue create --title "$title" --body-file "$file"
  fi
done
```

## Priorización recomendada

### Sprint 1 - Críticos (Alta prioridad)
- [ ] Issue #1: Webpack duplicado (2-3 horas)
- [ ] Issue #2: Código muerto homepage (3-4 horas)

**Estimación:** 5-7 horas

### Sprint 2 - Importantes (Media prioridad)
- [ ] Issue #4: Footer enlaces rotos (2-3 horas)
- [ ] Issue #6: Conectar páginas marketing (1-2 horas)
- [ ] Issue #3: Crear /top-resenas o redireccionar (3-4 horas)
- [ ] Issue #5: A Coruña en display (30 min)

**Estimación:** 7-10 horas

### Sprint 3 - Mejoras (Baja prioridad)
- [ ] Issue #7: Emoji A Coruña (15 min)
- [ ] Issue #9: Búsqueda Header (4-6 horas)
- [ ] Issue #8: Newsletter funcionalidad (4-6 horas)
- [ ] Issue #10: Unificar URLs reviews (3-4 horas)

**Estimación:** 11-16 horas

## Estructura de cada issue

Cada archivo de issue incluye:

- **Tipo y prioridad** (🔴/🟡/🔵)
- **Componente afectado**
- **Archivos específicos** con números de línea
- **Descripción detallada** del problema
- **Código problemático** con ejemplos
- **Impacto** en la aplicación
- **Solución propuesta** con código de ejemplo
- **Pasos para reproducir**
- **Prioridad y labels sugeridos**

## Métricas

### Por tipo
- Configuración: 1
- Código/Lógica: 2
- Navegación/Links: 3
- UI/UX: 2
- Features faltantes: 2

### Por severidad
- Afectan build/producción: 2
- Afectan UX crítica: 2
- Afectan UX importante: 2
- Mejoras: 4

### Tiempo estimado total
- **Mínimo:** 23 horas
- **Máximo:** 33 horas
- **Promedio:** 28 horas

## Documentación relacionada

- [ERRORES_ENCONTRADOS.md](../../ERRORES_ENCONTRADOS.md) - Documento maestro con todos los errores
- [TECHNICAL_DOCUMENTATION.md](../../TECHNICAL_DOCUMENTATION.md) - Documentación técnica
- [README.md](../../README.md) - README principal del proyecto

## Contacto

Si tienes preguntas sobre estos issues:
1. Revisar el documento maestro ERRORES_ENCONTRADOS.md
2. Consultar la documentación técnica
3. Crear una discusión en GitHub

---

**Fecha de creación:** 30 de octubre de 2025
**Revisión realizada por:** Claude Code Assistant
**Branch:** claude/review-blog-errors-011CUd5YngHEMDqo4upFnD53
