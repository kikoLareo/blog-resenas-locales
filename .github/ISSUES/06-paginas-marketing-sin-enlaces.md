# Páginas marketing implementadas sin enlaces desde el sitio

**Tipo:** 🟡 Importante
**Componente:** Navegación / Marketing
**Archivos afectados:**
- `app/(marketing)/sobre/page.tsx`
- `app/(marketing)/contacto/page.tsx`
- `app/(marketing)/politica-privacidad/page.tsx`
- `app/(marketing)/terminos/page.tsx`
- `app/(marketing)/cookies/page.tsx`
- `components/Footer.tsx`

## Descripción

Existen 5 páginas de marketing completamente implementadas en la carpeta `app/(marketing)/`, pero no hay enlaces funcionales a ellas desde el Footer ni desde ninguna otra parte del sitio, haciéndolas **inaccesibles para usuarios normales**.

## Páginas huérfanas (existen pero no están enlazadas)

### ✅ Implementadas
1. **Sobre nosotros:** `/sobre` (`app/(marketing)/sobre/page.tsx`)
2. **Contacto:** `/contacto` (`app/(marketing)/contacto/page.tsx`)
3. **Política de Privacidad:** `/politica-privacidad` (`app/(marketing)/politica-privacidad/page.tsx`)
4. **Términos de Servicio:** `/terminos` (`app/(marketing)/terminos/page.tsx`)
5. **Cookies:** `/cookies` (`app/(marketing)/cookies/page.tsx`)

### ❌ Estado actual en Footer

El Footer tiene estos enlaces pero todos apuntan a `href="#"`:

```tsx
// Footer.tsx líneas 67-70
<a href="#">Política de Privacidad</a>  <!-- Debería ser /politica-privacidad -->
<a href="#">Términos de Uso</a>         <!-- Debería ser /terminos -->
<a href="#">Cookies</a>                 <!-- Debería ser /cookies -->
<a href="#">Aviso Legal</a>             <!-- No existe -->
```

**Faltan en el Footer:**
- `/sobre` - No hay enlace en ninguna parte
- `/contacto` - No hay enlace en ninguna parte

## Impacto

### Legal (GDPR / LOPDGDD)
- ❌ **Páginas legales REQUERIDAS** no accesibles para usuarios
- ❌ Incumplimiento potencial de GDPR (Art. 13 y 14)
- ❌ Falta de transparencia obligatoria
- ⚠️ Posibles sanciones si se recopilan datos sin acceso a políticas

### Negocio
- ❌ Página de contacto inaccesible = pérdida de leads
- ❌ Página "Sobre" invisible = pérdida de confianza
- ❌ No se puede conocer al equipo o la misión

### SEO
- ❌ Páginas implementadas pero sin enlaces internos
- ❌ Contenido que no se indexará correctamente
- ❌ Pérdida de oportunidades de ranking

### UX
- ❌ Usuarios no pueden contactar fácilmente
- ❌ Información corporativa no disponible
- ❌ Falta de confianza del sitio

## Solución propuesta

### 1. Actualizar Footer.tsx

Convertir el componente a Server Component para obtener datos dinámicos (opcional) o usar enlaces estáticos:

```tsx
export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Columna 1: Branding */}
          <div className="space-y-4">
            {/* ... código existente ... */}
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/categorias">Categorías</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/ciudades">Ciudades</Link></li>
              <li><Link href="/sobre">Sobre nosotros</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
            </ul>
          </div>

          {/* Columna 3: Ciudades (dinámicas) */}
          <div>
            <h3 className="font-semibold mb-4">Ciudades</h3>
            <ul className="space-y-2">
              <li><Link href="/a-coruna">A Coruña</Link></li>
              <li><Link href="/madrid">Madrid</Link></li>
              <li><Link href="/barcelona">Barcelona</Link></li>
              <li><Link href="/valencia">Valencia</Link></li>
              <li><Link href="/ciudades">Ver todas →</Link></li>
            </ul>
          </div>

          {/* Columna 4: Legal & Contacto */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/politica-privacidad">Política de Privacidad</Link></li>
              <li><Link href="/terminos">Términos de Uso</Link></li>
              <li><Link href="/cookies">Política de Cookies</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar - Enlaces legales */}
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/politica-privacidad">Privacidad</Link>
            <Link href="/terminos">Términos</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/sobre">Sobre</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025 SaborLocal. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
```

### 2. Agregar enlace "Contacto" en Header (opcional)

```tsx
// components/Header.tsx
<nav className="hidden md:flex items-center space-x-1">
  <Link href="/categorias" className="nav-link">Categorías</Link>
  <Link href="/ciudades" className="nav-link">Ciudades</Link>
  <Link href="/blog" className="nav-link">Blog</Link>
  <Link href="/contacto" className="nav-link">Contacto</Link>
  <DarkModeToggle className="ml-2" />
</nav>
```

### 3. Crear página /aviso-legal si es necesaria

Verificar requerimientos legales específicos de España.

## Verificación de contenido actual

Revisar que las páginas existentes tengan:
- ✅ Contenido completo y actualizado
- ✅ Información de contacto correcta
- ✅ Cumplimiento con GDPR
- ✅ Diseño consistente con el resto del sitio

## Páginas a revisar/actualizar

1. **`/sobre`** - Verificar que tenga:
   - Historia del proyecto
   - Misión y valores
   - Equipo (si aplica)
   - Contacto

2. **`/contacto`** - Verificar que tenga:
   - Formulario funcional
   - Email de contacto
   - Información de respuesta

3. **`/politica-privacidad`** - Verificar:
   - Cumplimiento GDPR
   - Información sobre cookies
   - Derechos del usuario
   - Contacto DPO

4. **`/terminos`** - Verificar:
   - Términos claros de uso
   - Limitaciones de responsabilidad
   - Ley aplicable

5. **`/cookies`** - Verificar:
   - Lista de cookies usadas
   - Propósito de cada cookie
   - Cómo deshabilitarlas

## Prioridad

**Media-Alta** - Cumplimiento legal y UX

## Labels sugeridos

`enhancement`, `navigation`, `legal`, `gdpr`, `ux`, `footer`

## Checklist de implementación

- [ ] Actualizar Footer con enlaces correctos
- [ ] Revisar contenido de cada página marketing
- [ ] Verificar cumplimiento GDPR en páginas legales
- [ ] Agregar enlace a Contacto en lugares estratégicos
- [ ] Probar que todos los enlaces funcionan
- [ ] Verificar responsive en mobile
- [ ] Actualizar sitemap.xml para incluir estas URLs
