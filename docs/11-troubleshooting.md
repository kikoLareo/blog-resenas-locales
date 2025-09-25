## 11. Troubleshooting

- `ERESOLVE` al instalar: alinear versiones (Next 15 + React 19; Prisma 5.22 para Lucia); usa `npm install --legacy-peer-deps` y commitea lock.
- Studio rompe el build: el Studio se carga dinámicamente en dev; en prod se devuelve `null`.
- No aparece contenido: verifica `NEXT_PUBLIC_SANITY_*` y que los docs estén publicados (no drafts).
- Imágenes no aparecen: verificar configuración de Sanity y URLs de assets válidas.
- Sitemaps 404: revisa `/api/sitemap` y que `SITE_URL` esté definido.


