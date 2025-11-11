# 🧪 Testing Guide - Venue Onboarding System

**Fecha:** 29 de octubre, 2025  
**Sistema:** Registro de locales vía QR

---

## 📋 PREREQUISITOS ANTES DE TESTING

### 1. Verificar Sanity Studio
```bash
npm run studio
```
- Acceder a http://localhost:3333
- Verificar que existe schema "Solicitud de Local"
- Verificar schema "Código QR" tiene campos nuevos: isOnboarding, isUsed

### 2. Verificar App Next.js
```bash
npm run dev
```
- Acceder a http://localhost:3000
- Login en /acceso-simple (admin@saborlocal.com / admin123)

### 3. Datos necesarios en Sanity
- ✅ Al menos 1 ciudad creada (ej: A Coruña)
- ✅ Al menos 3 categorías creadas (ej: Restaurante, Tapas, Sushi)
- ✅ Al menos 1 local básico (para testing QR normal)

---

## 🔍 TEST 1: Crear QR de Onboarding

**Objetivo:** Verificar que se puede crear un QR de onboarding

### Pasos:
1. Login en dashboard
2. Ir a `/dashboard/qr-codes`
3. Click "Crear QR"
4. Completar formulario:
   - Título: "Test Onboarding - Nuevo Local X"
   - Local: Seleccionar cualquiera (temporal)
   - ✅ **Marcar checkbox "QR de Onboarding (un solo uso)"**
   - Fecha expiración: Vacío (o fecha futura)
   - Usos máximos: Vacío
   - Descripción: "QR de prueba para onboarding"
   - ✅ Código QR activo: Marcado
5. Click "Crear Código QR"

### Resultado esperado:
✅ Redirige a `/dashboard/qr-codes`  
✅ Aparece nuevo QR en la lista  
✅ Copiar el **código** (ej: ABC123-XYZ789)

---

## 🔍 TEST 2: Crear Nuevo Local desde Modal

**Objetivo:** Verificar que el botón "➕ Nuevo Local" funciona

### Pasos:
1. En `/dashboard/qr-codes/new`
2. Click botón "➕ Nuevo Local" (al lado del selector)
3. En el modal:
   - Nombre: "Restaurante Test QR"
   - Ciudad: Seleccionar una
   - Dirección: "Calle Test 123"
4. Click "Crear Local"

### Resultado esperado:
✅ Modal se cierra  
✅ Nuevo local aparece seleccionado en el dropdown  
✅ Alert "Local 'Restaurante Test QR' creado correctamente"

---

## 🔍 TEST 3: Acceder a QR de Onboarding

**Objetivo:** Verificar redirección automática

### Pasos:
1. Abrir navegador en modo incógnito (o logout)
2. Ir a `/qr/ABC123-XYZ789` (usar código del TEST 1)

### Resultado esperado:
✅ Redirige automáticamente a `/qr/onboarding/ABC123-XYZ789`  
✅ Muestra formulario completo  
✅ Header dice "Registra tu Local"

---

## 🔍 TEST 4: Completar Formulario de Onboarding

**Objetivo:** Enviar solicitud completa

### Pasos:

#### Información Básica
- Tu nombre completo: "Juan Pérez"
- Nombre del local: "Restaurante El Buen Comer"
- Descripción: Escribir al menos 50 caracteres (ej: "Restaurante familiar con cocina tradicional gallega. Especialidades en mariscos frescos y pulpo a feira. Ambiente acogedor y servicio atento.")
- Ciudad: Seleccionar una
- Rango de precios: €€ - Moderado
- Categorías: Marcar al menos 1 (ej: Restaurante)

#### Ubicación
- Dirección: "Rúa Test 42, Bajo"
- Código postal: "15001"
- Latitud: 43.3623 (opcional)
- Longitud: -8.4115 (opcional)

#### Contacto
- Teléfono: "+34 981 123 456"
- Email: "contacto@elbuencomer.com"
- Sitio web: "https://www.elbuencomer.com" (opcional)

#### Horarios
- Lunes: "13:00-16:00, 20:00-23:00"
- Martes: "13:00-16:00, 20:00-23:00"
- Miércoles: "Cerrado"
- Jueves: "13:00-16:00, 20:00-23:00"
- Viernes: "13:00-16:00, 20:00-00:00"
- Sábado: "13:00-16:00, 20:00-00:00"
- Domingo: "13:00-16:00"

#### Imágenes
- Subir al menos 2 imágenes (JPG/PNG, máx 4.5MB cada una)
- Ej: Foto fachada + foto plato

5. Click "Enviar Solicitud"

### Resultado esperado:
✅ Spinner "Enviando..."  
✅ Desaparece formulario  
✅ Muestra página de confirmación:
   - ✅ "¡Solicitud enviada correctamente!"
   - Próximos pasos listados
   - "Tiempo estimado: 24-48 horas"

---

## 🔍 TEST 5: Verificar QR Usado

**Objetivo:** Confirmar que QR queda bloqueado

### Pasos:
1. Intentar acceder nuevamente a `/qr/onboarding/ABC123-XYZ789`

### Resultado esperado:
✅ Muestra error:  
❌ "Código QR no válido"  
"Este código QR ya ha sido utilizado"  
"Contacta con el administrador..."

---

## 🔍 TEST 6: Verificar en Sanity Studio

**Objetivo:** Confirmar datos guardados

### Pasos:
1. Abrir Sanity Studio: http://localhost:3333
2. Ir a "Solicitud de Local"
3. Buscar "Restaurante El Buen Comer"

### Resultado esperado:
✅ Aparece submission con:
   - Estado: ⏳ Pendiente
   - Título: "Restaurante El Buen Comer"
   - Ciudad, categorías correctas
   - Todos los datos llenados

4. Ir a "Código QR"
5. Buscar el QR de test

### Resultado esperado:
✅ Campo "Usado": ✅ true  
✅ Campo "Fecha de uso": Timestamp actual  
✅ Campo "Solicitud asociada": Link a submission

---

## 🔍 TEST 7: Dashboard de Submissions

**Objetivo:** Revisar solicitud como admin

### Pasos:
1. Login en dashboard
2. Ir a `/dashboard/venue-submissions`

### Resultado esperado:
✅ Cards estadísticas:
   - Total: 1+
   - Pendientes: 1+ (amarillo)
✅ Lista muestra submission "Restaurante El Buen Comer"
✅ Estado: ⏳
✅ Ciudad, enviado por, email, fecha correctos
✅ Tags con categorías

3. Click "Ver Detalles"

### Resultado esperado en modal:
✅ Modal abre full screen  
✅ Muestra TODOS los datos:
   - Información Básica completa
   - Ubicación con coordenadas
   - Contacto con links
   - Categorías en chips
   - Horarios en tabla
   - **Galería con 2 imágenes** (preview correcto)
✅ Textarea "Notas Internas" (vacío)  
✅ Textarea "Razón de Rechazo" (vacío)  
✅ Botones disponibles:
   - ✅ Aprobar y Publicar (verde)
   - ❌ Rechazar (rojo)
   - Guardar Notas

---

## 🔍 TEST 8: Agregar Notas Internas

**Objetivo:** Guardar notas solo para admins

### Pasos:
1. En modal de detalles
2. En "Notas Internas", escribir: "Local verificado. Fotos de calidad. Aprobar."
3. Click "Guardar Notas"

### Resultado esperado:
✅ Alert "Notas guardadas correctamente"  
✅ Modal sigue abierto  
✅ Al cerrar y reabrir: notas persisten

---

## 🔍 TEST 9: Aprobar Submission

**Objetivo:** Crear venue público

### Pasos:
1. En modal, click "✅ Aprobar y Publicar"
2. Confirmar en alert

### Resultado esperado:
✅ Botón muestra "Procesando..."  
✅ Alert "¡Local 'Restaurante El Buen Comer' aprobado y publicado!"  
✅ Modal se cierra  
✅ Lista se recarga  
✅ Submission ahora muestra:
   - Estado: ✅ Aprobada
   - Badge verde en lista

### Verificar en Sanity Studio:
1. Ir a "Local/Venue"
2. Buscar "Restaurante El Buen Comer"

### Resultado esperado:
✅ Venue creado con:
   - Todos los datos del formulario
   - Imágenes copiadas
   - Ciudad y categorías linkeadas
   - Horarios guardados
   - Geolocalización (si se llenó)

---

## 🔍 TEST 10: Ver Venue en Frontend

**Objetivo:** Confirmar que es público

### Pasos:
1. Ir a `/[ciudad]/restaurante-el-buen-comer`
   (Ej: `/a-coruna/restaurante-el-buen-comer`)

### Resultado esperado:
✅ Página del venue se carga  
✅ Muestra nombre, descripción  
✅ Galería con las 2 imágenes  
✅ Mapa con ubicación (si lat/lng estaban)  
✅ Horarios visibles  
✅ Botones de contacto (tel, email, web)

---

## 🔍 TEST 11: Rechazar Submission

**Objetivo:** Probar flujo de rechazo

### Pasos:
1. Crear otro QR de onboarding (TEST 1)
2. Completar formulario con datos diferentes (TEST 4)
3. En dashboard, abrir modal
4. En "Razón de Rechazo", escribir: "Fotos de baja calidad. Por favor, vuelve a enviar con mejores imágenes."
5. Click "❌ Rechazar"
6. Confirmar

### Resultado esperado:
✅ Alert "Solicitud de '...' rechazada"  
✅ Modal se cierra  
✅ Lista se actualiza  
✅ Submission muestra:
   - Estado: ❌ Rechazada
   - Razón visible al reabrir modal

---

## 🔍 TEST 12: Filtros y Búsqueda

**Objetivo:** Verificar funcionalidad de filtrado

### Pasos en `/dashboard/venue-submissions`:

1. **Filtro por estado**:
   - Seleccionar "Pendientes" → Solo muestra ⏳
   - Seleccionar "Aprobadas" → Solo muestra ✅
   - Seleccionar "Rechazadas" → Solo muestra ❌
   - Seleccionar "Todos" → Muestra todas

2. **Búsqueda**:
   - Escribir nombre del local → Filtra
   - Escribir email → Filtra
   - Escribir ciudad → Filtra
   - Borrar búsqueda → Muestra todas

### Resultado esperado:
✅ Filtrado reactivo inmediato  
✅ Contador actualiza: "Solicitudes (X)"  
✅ Sin recargas de página

---

## 🔍 TEST 13: QR Normal (No Onboarding)

**Objetivo:** Verificar que QRs normales siguen funcionando

### Pasos:
1. Crear QR normal (TEST 1 pero **SIN marcar** "QR de Onboarding")
2. Acceder a `/qr/CODE123` (QR normal)

### Resultado esperado:
✅ **NO** redirige a `/qr/onboarding/`  
✅ Muestra formulario de **feedback** (QRVenueForm)  
✅ Flujo normal de feedback sigue funcionando

---

## 🐛 CASOS EDGE A PROBAR

### Edge 1: QR Expirado
1. Crear QR con fecha expiración en el pasado
2. Intentar acceder

**Esperado:** ❌ "Este código QR ha expirado"

### Edge 2: QR Inactivo
1. Crear QR y desactivarlo (isActive=false)
2. Intentar acceder

**Esperado:** ❌ "Este código QR está inactivo"

### Edge 3: Formulario Incompleto
1. Llenar formulario parcialmente
2. Intentar enviar

**Esperado:** Validación HTML5 previene submit

### Edge 4: Sin Imágenes
1. Llenar todo excepto imágenes
2. Intentar enviar

**Esperado:** Error "Debe subir al menos una imagen"

### Edge 5: Sin Categorías
1. Llenar todo excepto categorías
2. Intentar enviar

**Esperado:** Error "Debe seleccionar al menos una categoría"

### Edge 6: Email Inválido
1. Escribir email sin @
2. Intentar enviar

**Esperado:** Validación HTML5 de email

### Edge 7: Imágenes Muy Grandes
1. Intentar subir imagen > 4.5MB

**Esperado:** Error de upload o warning

### Edge 8: Descripción Muy Corta
1. Escribir menos de 50 caracteres
2. Intentar enviar

**Esperado:** Validación HTML5 minLength

---

## ✅ CHECKLIST FINAL

Marcar al completar cada test:

- [ ] TEST 1: Crear QR de Onboarding
- [ ] TEST 2: Crear Nuevo Local desde Modal
- [ ] TEST 3: Acceder a QR de Onboarding
- [ ] TEST 4: Completar Formulario de Onboarding
- [ ] TEST 5: Verificar QR Usado
- [ ] TEST 6: Verificar en Sanity Studio
- [ ] TEST 7: Dashboard de Submissions
- [ ] TEST 8: Agregar Notas Internas
- [ ] TEST 9: Aprobar Submission
- [ ] TEST 10: Ver Venue en Frontend
- [ ] TEST 11: Rechazar Submission
- [ ] TEST 12: Filtros y Búsqueda
- [ ] TEST 13: QR Normal (No Onboarding)
- [ ] Edge 1-8: Casos especiales

---

## 🔧 TROUBLESHOOTING

### Error: "No se pudo subir las imágenes"
- Verificar SANITY_API_TOKEN tiene permisos de escritura
- Verificar tamaño < 4.5MB

### Error: "Slug duplicado"
- Sanity rechaza slugs duplicados
- Usar nombres únicos en testing

### Modal no abre en Dashboard
- Verificar consola browser por errores
- Verificar query retorna datos correctos

### Imágenes no se ven en Dashboard
- URL de Sanity CDN correcta
- Verificar NEXT_PUBLIC_SANITY_PROJECT_ID y DATASET

### QR no redirige a onboarding
- Verificar campo isOnboarding=true en Sanity
- Verificar query qrCodeOnboardingQuery incluye campo

---

## 📊 MÉTRICAS DE ÉXITO

Al finalizar testing, sistema debe cumplir:

✅ **Flujo básico** funciona end-to-end  
✅ **QR de un solo uso** se bloquea correctamente  
✅ **Imágenes** se suben y visualizan  
✅ **Aprobación** crea venue público  
✅ **Rechazo** guarda razón  
✅ **Filtros** funcionan reactivamente  
✅ **Validaciones** previenen datos incorrectos  
✅ **QRs normales** no se afectan

---

**Estado:** 📝 PENDIENTE  
**Estimado:** 1-2 horas de testing manual  
**Última actualización:** 29 de octubre, 2025
