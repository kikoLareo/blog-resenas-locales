# Enlaces rotos en Footer (múltiples href="#")

**Tipo:** 🟡 Importante
**Componente:** Footer
**Archivos afectados:** `components/Footer.tsx`

## Descripción

El Footer contiene múltiples enlaces que usan `href="#"` en lugar de URLs reales, indicando que las páginas correspondientes no están conectadas o no existen.

## Problema

### 1. Redes sociales (líneas 21-23)
```tsx
<a href="#" className="..."><Instagram className="h-5 w-5" /></a>
<a href="#" className="..."><Twitter className="h-5 w-5" /></a>
<a href="#" className="..."><Facebook className="h-5 w-5" /></a>
```

### 2. Enlaces rápidos (líneas 29-33)
```tsx
<a href="#">Categorías</a>          <!-- Debería ser /categorias -->
<a href="#">Top Reseñas</a>         <!-- Debería ser /top-resenas (ver issue #3) -->
<a href="#">Nuevos Locales</a>      <!-- No existe -->
<a href="#">Cerca de ti</a>         <!-- No existe -->
<a href="#">Blog</a>                <!-- Debería ser /blog -->
```

### 3. Ciudades hardcodeadas (líneas 39-43)
```tsx
<a href="#">Madrid</a>              <!-- Debería ser /madrid -->
<a href="#">Barcelona</a>           <!-- Debería ser /barcelona -->
<a href="#">Valencia</a>            <!-- Debería ser /valencia -->
<a href="#">Sevilla</a>             <!-- Debería ser /sevilla -->
<a href="#">Bilbao</a>              <!-- Debería ser /bilbao -->
```
⚠️ **Nota:** Estas ciudades deberían ser dinámicas desde Sanity, no hardcodeadas.

### 4. Enlaces legales (líneas 67-70)
```tsx
<a href="#">Política de Privacidad</a>  <!-- Existe en /politica-privacidad -->
<a href="#">Términos de Uso</a>         <!-- Existe en /terminos -->
<a href="#">Cookies</a>                 <!-- Existe en /cookies -->
<a href="#">Aviso Legal</a>             <!-- No existe -->
```

## Impacto

- ❌ Enlaces que no funcionan confunden a usuarios
- ❌ Mala experiencia de usuario
- ❌ Problemas de SEO (enlaces internos a "#")
- ❌ **GDPR:** Páginas legales requeridas no accesibles
- ❌ Credibilidad del sitio se ve afectada
- ⚠️ Footer es componente crítico para navegación secundaria

## Solución propuesta

### 1. Actualizar enlaces de redes sociales

**Opción A - Conectar URLs reales:**
```tsx
<a href="https://instagram.com/saborlocal" target="_blank" rel="noopener">
  <Instagram className="h-5 w-5" />
</a>
<a href="https://twitter.com/saborlocal" target="_blank" rel="noopener">
  <Twitter className="h-5 w-5" />
</a>
<a href="https://facebook.com/saborlocal" target="_blank" rel="noopener">
  <Facebook className="h-5 w-5" />
</a>
```

**Opción B - Eliminar temporalmente si no existen:**
```tsx
{/* Temporalmente deshabilitado hasta crear redes sociales
<div className="flex space-x-4">
  ...
</div>
*/}
```

### 2. Corregir enlaces rápidos

```tsx
<a href="/categorias">Categorías</a>
<a href="/blog">Blog</a>
{/* Crear /nuevos-locales o eliminar */}
{/* Crear /cerca-de-ti o eliminar */}
```

### 3. Hacer ciudades dinámicas

```tsx
// Obtener ciudades desde Sanity
const cities = await getCities();

<div>
  <h3 className="font-semibold mb-4">Ciudades</h3>
  <ul className="space-y-2">
    {cities.slice(0, 5).map((city) => (
      <li key={city._id}>
        <Link href={`/${city.slug.current}`}>
          {city.title}
        </Link>
      </li>
    ))}
  </ul>
</div>
```

### 4. Conectar páginas legales

```tsx
<a href="/politica-privacidad">Política de Privacidad</a>
<a href="/terminos">Términos de Uso</a>
<a href="/cookies">Cookies</a>
{/* Crear /aviso-legal */}
```

## Páginas que existen pero no están enlazadas

Estas páginas YA EXISTEN en `app/(marketing)/`:
- ✅ `/sobre` - Sobre nosotros
- ✅ `/contacto` - Contacto
- ✅ `/politica-privacidad` - Política de privacidad
- ✅ `/terminos` - Términos de servicio
- ✅ `/cookies` - Política de cookies

Solo falta conectarlas en el Footer.

## Requerimientos legales (GDPR)

Las siguientes páginas son **requeridas por ley** en UE/España:
- ✅ Política de Privacidad (existe)
- ✅ Cookies (existe)
- ✅ Términos de Uso (existe)
- ❌ Aviso Legal (falta crear)

## Prioridad

**Media-Alta** - Afecta UX y cumplimiento legal

## Labels sugeridos

`bug`, `ux`, `footer`, `navigation`, `legal`, `gdpr`
