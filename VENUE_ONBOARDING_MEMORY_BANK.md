# 🏗️ VENUE ONBOARDING SYSTEM - Memory Bank

**Fecha de implementación:** 29 de octubre, 2025  
**Estado:** 🚧 En desarrollo  
**Objetivo:** Sistema de registro de locales vía QR con aprobación administrativa

---

## 📋 RESUMEN EJECUTIVO

Sistema que permite a propietarios de locales registrar su negocio mediante un código QR único. El proceso incluye validación, formulario completo, revisión administrativa y aprobación antes de publicación.

### Flujo Completo
```
1. ADMIN crea QR de onboarding
2. PROPIETARIO escanea QR
3. PROPIETARIO completa formulario (un solo uso)
4. SISTEMA guarda como "venueSubmission" (pending)
5. QR se marca como usado (bloqueado)
6. ADMIN revisa y aprueba/rechaza
7. SISTEMA crea venue real si se aprueba
```

---

## 🗂️ SCHEMAS DE SANITY

### 1. venueSubmission (NUEVO)
**Archivo:** `sanity/schemas/venue-submission.ts`

**Propósito:** Almacenar solicitudes de registro de locales pendientes de aprobación.

**Campos principales:**
- `status`: pending | approved | rejected
- `qrCode`: Referencia al QR usado
- `submittedAt`: Timestamp de envío
- `submittedBy`: Nombre del propietario
- `title`, `slug`, `description`: Datos del local
- `address`, `postalCode`, `city`: Ubicación
- `categories[]`: Array de referencias a categorías
- `phone`, `email`, `website`: Contacto
- `priceRange`: Rango de precios
- `openingHours`: Objeto con horarios (lunes-domingo)
- `geo`: Geopoint con lat/lng
- `images[]`: Array de imágenes subidas
- `approvedAt`, `approvedBy`: Metadata de aprobación
- `rejectionReason`: Texto explicativo si rechazado
- `createdVenue`: Referencia al venue creado tras aprobación
- `internalNotes`: Notas solo para admins

**Preview:** Muestra emoji según estado, título, ciudad, nombre del solicitante y fecha

**Ordenamientos:**
- Más recientes primero (submittedAt desc)
- Por estado (pending primero)

---

### 2. qrCode (MODIFICADO)
**Archivo:** `sanity/schemas/qr-code.ts`

**Campos nuevos agregados:**
- `isOnboarding` (boolean): Marca si es QR de registro (vs QR de feedback)
- `isUsed` (boolean, readonly): Si ya fue utilizado
- `usedAt` (datetime, readonly): Cuándo se usó
- `submission` (reference): Link a venueSubmission creada

**Propósito de cambios:** Diferenciar QRs de onboarding de QRs normales y prevenir reuso.

---

## 🔍 QUERIES GROQ

**Archivo:** `sanity/lib/queries.ts`

### Queries agregadas:

#### venueSubmissionsListQuery
```groq
*[_type == "venueSubmission"] {
  _id, status, title, slug, submittedAt, submittedBy,
  email, phone, city->, categories[]->,...
} | order(submittedAt desc)
```

#### venueSubmissionsPendingQuery
```groq
*[_type == "venueSubmission" && status == "pending"] {
  ...campos relevantes
} | order(submittedAt desc)
```

#### venueSubmissionByIdQuery
```groq
*[_type == "venueSubmission" && _id == $id][0] {
  ...todos los campos completos
}
```

#### qrCodeOnboardingQuery
```groq
*[_type == "qrCode" && code == $code][0] {
  ...campos + validación isOnboarding, isUsed, expiresAt
}
```

---

## 🎨 TIPOS TYPESCRIPT

**Archivo:** `types/sanity.ts`

### Tipos agregados:

```typescript
interface OpeningHours {
  monday?: string;
  tuesday?: string;
  // ... resto de días
}

interface QRCode extends SanityDocument {
  // ... campos existentes
  isOnboarding: boolean;
  isUsed: boolean;
  usedAt?: string;
  submission?: reference | VenueSubmission;
}

interface VenueSubmission extends SanityDocument {
  status: 'pending' | 'approved' | 'rejected';
  qrCode: reference | QRCode;
  submittedAt: string;
  submittedBy: string;
  // ... todos los campos del local
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  createdVenue?: reference | Venue;
  internalNotes?: string;
}
```

---

## 🛣️ API ROUTES

### POST /api/qr/submit-venue
**Archivo:** `app/api/qr/submit-venue/route.ts`

**Propósito:** Procesar formulario de registro de local

**Input:** FormData con:
- `qrCode`: Código único
- `title`, `description`, `address`, etc.
- `categories`: JSON array de IDs
- `openingHours`: JSON object
- `geo`: JSON object con lat/lng (opcional)
- `images`: Array de archivos File

**Proceso:**
1. Valida QR (existe, activo, isOnboarding=true, !isUsed, !expirado)
2. Valida campos requeridos
3. Sube imágenes a Sanity Assets
4. Genera slug a partir del título
5. Crea documento venueSubmission con status='pending'
6. Marca QR como isUsed=true y usedAt=now
7. Retorna success + submissionId

**Response:**
```json
{
  "success": true,
  "message": "Solicitud enviada correctamente",
  "submissionId": "..."
}
```

**Errores posibles:**
- 400: Campos faltantes, QR inválido, ya usado, etc.
- 404: QR no encontrado
- 500: Error de servidor

---

## 📄 PÁGINAS

### /qr/onboarding/[code]
**Archivo:** `app/qr/onboarding/[code]/page.tsx`

**Propósito:** Formulario completo de registro de local

**Estados:**
- Loading: Spinner mientras valida QR
- Error: Mensaje si QR inválido/usado/expirado
- Form: Formulario multi-sección
- Success: Confirmación tras envío

**Secciones del formulario:**

1. **Información Básica**
   - Nombre del propietario
   - Nombre del local
   - Descripción (50-500 chars)
   - Ciudad (selector)
   - Rango de precios
   - Categorías (multi-select con botones)

2. **Ubicación**
   - Dirección completa
   - Código postal (5 dígitos)
   - Latitud/Longitud (opcional)

3. **Contacto**
   - Teléfono
   - Email
   - Sitio web (opcional)

4. **Horarios**
   - Lunes a Domingo
   - Texto libre (Ej: "12:00-16:00, 20:00-23:00" o "Cerrado")

5. **Imágenes**
   - Upload múltiple (1-10 imágenes)
   - Acepta image/*

**Validaciones client-side:**
- Campos requeridos marcados con *
- Min/max length en description
- Pattern para código postal
- Email válido
- URL válida
- Al menos 1 categoría
- Al menos 1 imagen

**Validaciones server-side (en API):**
- QR válido y no usado
- Campos obligatorios presentes
- Formato correcto de datos

---

## 🎯 DASHBOARD (Pendiente de implementar)

### /dashboard/venue-submissions
**Propósito:** Gestión administrativa de solicitudes

**Características a implementar:**
- Lista de todas las submissions
- Filtros: pending/approved/rejected
- Búsqueda por nombre/email/ciudad
- Vista detallada modal:
  - Todos los datos del local
  - Galería de imágenes
  - Mapa con ubicación
  - Botones: Aprobar / Rechazar / Agregar nota
- Al aprobar:
  - Crea venue real en Sanity
  - Marca submission como approved
  - Guarda referencia createdVenue
  - Registra approvedBy y approvedAt
- Al rechazar:
  - Marca como rejected
  - Guarda rejectionReason
  - Opcionalmente: libera QR (isUsed=false)

---

## 🔄 MODIFICACIONES A CÓDIGO EXISTENTE

### /dashboard/qr-codes/new (A modificar)
**Objetivo:** Agregar opción de crear nuevo local al selector

**Cambio necesario:**
```tsx
// Agregar botón "➕ Crear nuevo local"
// Al hacer click, abre modal inline
// Modal tiene formulario básico (título, ciudad)
// Al guardar:
//   1. Crea venue básico en Sanity
//   2. Refresca lista de venues
//   3. Selecciona el nuevo venue automáticamente
//   4. Cierra modal
```

### /qr/[code] (A modificar)
**Objetivo:** Redirigir a /qr/onboarding si es QR de onboarding

**Lógica:**
```typescript
// En page.tsx
const qrCode = await fetch(qrCodeQuery);

if (qrCode.isOnboarding) {
  // Redirigir a /qr/onboarding/[code]
  redirect(`/qr/onboarding/${code}`);
}

// Si no es onboarding, continuar con flujo normal (feedback)
```

---

## 🧪 TESTING (Checklist)

### Flujo completo E2E
1. ✅ Crear QR de onboarding en dashboard
2. ⏳ Acceder a /qr/onboarding/[code]
3. ⏳ Validar que muestre formulario correcto
4. ⏳ Completar todos los campos
5. ⏳ Subir imágenes
6. ⏳ Enviar formulario
7. ⏳ Verificar submission creada en Sanity
8. ⏳ Verificar QR marcado como usado
9. ⏳ Intentar acceder de nuevo (debe mostrar error)
10. ⏳ Ir a /dashboard/venue-submissions
11. ⏳ Ver submission pendiente
12. ⏳ Aprobar submission
13. ⏳ Verificar venue creado en Sanity
14. ⏳ Verificar venue visible en frontend

### Casos edge a probar
- QR expirado
- QR inactivo
- QR no-onboarding
- Formulario incompleto
- Imágenes muy grandes
- Sin imágenes
- Slug duplicado
- Email inválido
- Teléfono inválido

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Schemas creados
2. ✅ Queries agregadas
3. ✅ Tipos TypeScript actualizados
4. ✅ API submit-venue creada
5. ✅ Página onboarding creada
6. ⏳ Dashboard venue-submissions
7. ⏳ Modificar /dashboard/qr-codes/new (selector + crear nuevo)
8. ⏳ Modificar /qr/[code] (redirección onboarding)
9. ⏳ Testing E2E completo
10. ⏳ Documentación de usuario final

---

## 📊 ESTADO ACTUAL

**Completado:**
- ✅ Arquitectura definida
- ✅ Schema venueSubmission
- ✅ Modificación schema qrCode
- ✅ Queries GROQ
- ✅ Tipos TypeScript
- ✅ API POST /api/qr/submit-venue
- ✅ Página /qr/onboarding/[code]

**En progreso:**
- 🚧 Dashboard de submissions
- 🚧 Modificación selector QR
- 🚧 Redirección en /qr/[code]

**Pendiente:**
- ⏳ Testing E2E
- ⏳ Documentación usuario
- ⏳ Deployment

---

## 🔐 SEGURIDAD

**Consideraciones:**
- QR de un solo uso previene spam
- Validación server-side estricta
- Aprobación manual antes de publicar
- Imágenes validadas en tamaño y tipo
- Email/teléfono validados con regex
- Slugs sanitizados (sin caracteres especiales)

**Permisos Sanity:**
- Crear venueSubmission: Público (via API)
- Leer venueSubmission: Solo admins
- Aprobar/Rechazar: Solo admins (ADMIN role)
- Crear venue real: Solo admins

---

## 📝 NOTAS TÉCNICAS

### Upload de imágenes
- Se usa FormData para enviar archivos
- Convertidos a Buffer en servidor
- Subidos a Sanity Assets con adminSanityWriteClient.assets.upload()
- Genera _id que se referencia en el documento

### Generación de slug
- Normaliza título (NFD)
- Elimina acentos
- Convierte a lowercase
- Reemplaza espacios y caracteres especiales por guiones
- Elimina guiones al inicio/fin

### Validación de QR
- Debe existir
- Debe estar activo (isActive=true)
- Debe ser de onboarding (isOnboarding=true)
- No debe estar usado (isUsed=false)
- No debe estar expirado (expiresAt > now)

### Proceso de aprobación
1. Admin revisa submission en dashboard
2. Si aprueba:
   - Crea venue con todos los datos de submission
   - Copia imágenes (ya están en Assets)
   - Marca submission.status = 'approved'
   - Guarda submission.createdVenue = venue._id
   - Registra approvedAt y approvedBy
3. Si rechaza:
   - Marca submission.status = 'rejected'
   - Guarda rejectionReason
   - Opcionalmente: libera QR para reintento

---

## 🐛 TROUBLESHOOTING

### Error: "Código QR ya ha sido utilizado"
- Verificar campo isUsed en Sanity
- Si es error legítimo: usuario intentó reusar QR
- Si es bug: resetear isUsed=false manualmente en Sanity

### Error: "Error al subir imágenes"
- Verificar permisos de SANITY_API_TOKEN
- Verificar tamaño de archivos (límite Vercel: 4.5MB)
- Verificar tipo MIME de archivos

### Submission no aparece en dashboard
- Verificar que se creó en Sanity Studio
- Verificar query venueSubmissionsListQuery
- Verificar permisos de lectura

### Venue no se crea al aprobar
- Verificar adminSanityWriteClient tiene permisos
- Verificar que submission tenga todos los datos
- Verificar que city y categories existan

---

**Última actualización:** 29 de octubre, 2025 - 20:30  
**Implementado por:** AI Assistant  
**Revisado por:** Pendiente
