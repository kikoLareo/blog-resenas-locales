# 📱 Guía de Uso - Sección de Códigos QR

## 🎯 Para Administradores

### 1. Crear un Código QR

1. Ve a **Dashboard → Códigos QR**
2. Click en **"Crear QR"**
3. Completa el formulario:
   - **Título**: Nombre descriptivo (ej: "Mesa VIP 5 - Terraza")
   - **Local**: Selecciona el local asociado
   - **Fecha de expiración**: (Opcional) Cuando el QR deja de funcionar
   - **Usos máximos**: (Opcional) Límite de veces que puede usarse
   - **Descripción**: (Opcional) Notas adicionales
   - **Código QR activo**: Marca si quieres activarlo inmediatamente
4. Click en **"Crear Código QR"**
5. El sistema genera automáticamente un código único

**Nota:** El sistema valida que el código sea único (hasta 5 intentos de generación).

---

### 2. Editar un Código QR

1. En la lista de códigos QR, click en **"Editar"**
2. Modifica los campos que necesites:
   - Título
   - Local asociado
   - Fecha de expiración
   - Usos máximos
   - Descripción
   - Estado activo/inactivo
3. Visualiza el QR en tiempo real en el panel derecho
4. Click en **"Guardar Cambios"**

**Vista Previa:**
- Muestra el código QR generado
- URL completa del QR
- Contador de usos (actual/máximo)
- Fecha de último uso
- Estado actual

---

### 3. Descargar Imagen del QR

**Desde la lista:**
1. Click en **"Ver QR"** en cualquier código
2. Se abre un modal con el QR
3. Copia la URL o toma captura de pantalla

**Desde la edición:**
1. Abre el código QR para editar
2. En el panel de vista previa, click en **"Descargar QR"**
3. Se descarga un archivo PNG de alta calidad (600x600px)

**Por API directa:**
```
GET /api/qr/download/[code]
```
Ejemplo: `/api/qr/download/ABC123-XYZ789`

---

### 4. Activar/Desactivar Códigos

**Cambio rápido:**
1. En la lista de códigos QR
2. Click en **"Activar"** o **"Desactivar"**
3. El estado se actualiza inmediatamente

**Estados:**
- 🟢 **Activo**: El código QR funciona normalmente
- 🔴 **Inactivo**: El código QR muestra mensaje de error al escanearlo

---

### 5. Eliminar un Código QR

⚠️ **PRECAUCIÓN: Esta acción es irreversible**

1. En la lista o en edición, click en **"Eliminar"** (botón rojo)
2. Aparece modal de confirmación
3. Click en **"Eliminar"** para confirmar
4. El código QR se elimina permanentemente de Sanity

**Qué se elimina:**
- El código QR completo
- **NO se elimina** el feedback asociado (se mantiene para histórico)

---

### 6. Buscar y Filtrar Códigos QR

**Búsqueda:**
- Escribe en el campo de búsqueda
- Busca por: título, nombre del local o código

**Filtros:**
- **Todos los estados**: Muestra todos
- **Activos**: Solo códigos activos
- **Inactivos**: Solo códigos inactivos

**Ejemplo de búsqueda:**
- "VIP" → Encuentra todos los QR con VIP en el título
- "Restaurante Mar" → Encuentra QR del local
- "ABC123" → Busca por código específico

---

### 7. Gestionar Feedback Recibido

#### Acceso
Dashboard → Feedback

#### Panel de Estadísticas
Muestra en tiempo real:
- **Total Feedback**: Cantidad total recibida
- **Pendientes**: Feedback nuevo sin procesar
- **Procesados**: Feedback ya revisado
- **Clientes Recurrentes**: % de clientes regulares/frecuentes

#### Búsqueda y Filtros
**Búsqueda por:**
- Nombre del cliente
- Email
- Nombre del local
- Código QR utilizado

**Filtros por estado:**
- Todos
- Pendientes
- Procesados
- Archivados

#### Cambiar Estado de Feedback
1. Encuentra el feedback en la lista
2. Usa el selector desplegable de estado
3. Selecciona: Pendiente / Procesado / Archivado
4. Se guarda automáticamente

#### Ver Detalles Completos
1. Click en **"Ver detalles"** en cualquier feedback
2. Modal muestra toda la información:
   - Datos del cliente (nombre, email, teléfono)
   - Datos de la visita (fecha, hora, personas, ocasión)
   - Tipo de cliente (primera vez, ocasional, regular, frecuente)
   - Solicitudes especiales
   - Comentarios
   - Código QR utilizado
   - Fecha de recepción

#### Eliminar Feedback
1. Click en **"Eliminar"** (botón rojo)
2. Confirma la eliminación
3. Se elimina permanentemente

---

### 8. Exportar Feedback a CSV

1. En la página de Feedback, click en **"Exportar CSV"**
2. Se descarga archivo: `feedback-YYYY-MM-DD.csv`
3. Abre en Excel, Google Sheets, etc.

**Columnas incluidas:**
- ID, Fecha Recepción
- Local, Ciudad
- Código QR
- Nombre, Email, Teléfono
- Fecha Visita, Hora Visita
- Personas, Ocasión
- Solicitudes Especiales
- Tipo de Cliente
- Comentarios
- Estado

**Usos del CSV:**
- Análisis de datos
- Reportes mensuales
- Backup de información
- Integración con otras herramientas

---

## 👥 Para Clientes (Uso del QR)

### 1. Escanear el Código QR

El cliente escanea el código QR con su smartphone usando:
- Cámara nativa de iOS/Android
- App de QR scanner
- Google Lens

### 2. Acceso a la Página

Se abre automáticamente: `tudominio.com/qr/[codigo]`

**El sistema valida:**
- ✅ Código activo
- ✅ No expirado
- ✅ Límite de usos no alcanzado

**Si hay error, muestra:**
- ❌ Código QR no válido
- 💡 Razón específica (inactivo/expirado/límite alcanzado)
- 📞 Mensaje para contactar al administrador

### 3. Completar Formulario

El cliente completa:

**Datos personales** (algunos opcionales):
- Nombre *
- Email
- Teléfono

**Datos de la visita** (*requeridos):
- Fecha de visita *
- Hora de visita
- Número de personas *
- Ocasión (casual/negocio/romántica/familiar/celebración/otra)

**Feedback**:
- Tipo de cliente (primera vez/ocasional/regular/frecuente)
- Solicitudes especiales
- Comentarios adicionales

### 4. Envío del Formulario

1. Click en **"Enviar"**
2. Se guarda en Sanity como `qrFeedback`
3. Se incrementa el contador de usos del QR
4. Se actualiza `lastUsedAt`
5. Mensaje de confirmación al cliente

---

## 🔍 Casos de Uso

### Caso 1: Mesa VIP con QR Personalizado
**Objetivo:** Acceso exclusivo para clientes VIP

**Configuración:**
- Título: "Acceso VIP - Mesa Premium"
- Local: Seleccionar restaurant
- Usos máximos: 10 (una mesa por noche durante 10 días)
- Expiración: Fin de mes
- Estado: Activo

**Resultado:**
- QR impreso en la mesa
- Clientes escanean para dejar feedback
- Tracking de cuántas veces se usa
- Expira automáticamente

---

### Caso 2: Código QR de Evento Especial
**Objetivo:** Recolectar feedback de evento de San Valentín

**Configuración:**
- Título: "Evento San Valentín 2025"
- Local: Restaurante Romántico
- Expiración: 15 de febrero
- Usos máximos: 50 parejas
- Estado: Activo

**Resultado:**
- QR en invitaciones/mesas
- Limita a 50 usos
- Se desactiva automáticamente después del evento
- Feedback específico del evento

---

### Caso 3: QR para Encuesta Post-Visita
**Objetivo:** Encuesta a todos los clientes que visitaron

**Configuración:**
- Título: "Encuesta Satisfacción - [Local]"
- Local: Cualquier local
- Sin límite de usos
- Sin expiración
- Estado: Activo

**Resultado:**
- QR permanente en el local
- Recolección continua de feedback
- Análisis mensual de tendencias

---

## 📊 Informes y Análisis

### Métricas Disponibles

**Por Código QR:**
- Usos totales
- Usos vs. máximo permitido
- Última fecha de uso
- Estado (activo/inactivo/expirado)

**Por Feedback:**
- Total recibidos
- Pendientes de revisar
- Procesados
- % Clientes recurrentes
- Distribución por ocasión
- Feedback por local

### Exportación de Datos

**CSV de Feedback:**
- Todos los campos exportados
- Formato compatible con Excel
- Actualización en tiempo real

**Análisis Recomendado:**
1. Tabla dinámica por local
2. Gráfico de visitas por fecha
3. Análisis de ocasiones más comunes
4. Seguimiento de clientes recurrentes
5. Identificar solicitudes especiales recurrentes

---

## ⚡ Atajos y Tips

### Administración Eficiente

**Crear múltiples QR rápidamente:**
1. Crea uno con configuración base
2. Edita y guarda con nuevo título
3. Repite para mesas/zonas diferentes

**Gestión de Feedback Diaria:**
1. Filtra por "Pendientes"
2. Revisa uno por uno
3. Cambia estado a "Procesado"
4. Archiva los antiguos mensualmente

**Exportaciones Regulares:**
- Exporta CSV cada fin de mes
- Guarda backup de datos
- Analiza tendencias mensuales

### Troubleshooting

**"El QR no funciona":**
1. Verifica que esté **Activo**
2. Revisa fecha de **expiración**
3. Confirma que no alcanzó **límite de usos**

**"No aparece el feedback":**
1. Verifica filtros aplicados
2. Revisa búsqueda activa
3. Recarga la página

**"Error al descargar imagen":**
1. Verifica que el código exista
2. Prueba con navegador diferente
3. Revisa console de errores

---

## 🔒 Seguridad y Privacidad

### Datos Personales
- Solo administradores pueden ver feedback
- Email y teléfono opcionales
- Exportación protegida por rol ADMIN

### Códigos QR
- Códigos únicos imposibles de adivinar
- Validación en cada escaneo
- Timestamps de uso registrados

### Permisos
- Solo role ADMIN puede:
  - Crear/Editar/Eliminar QR
  - Ver feedback
  - Exportar datos
  - Descargar imágenes

---

## 🎉 Mejores Prácticas

1. **Nombres Descriptivos**: Usa títulos claros (ej: "Mesa 5 Terraza" no solo "QR-001")

2. **Fechas de Expiración**: Configura fechas para eventos temporales

3. **Límites de Uso**: Establece máximos para controlar acceso

4. **Revisión Regular**: Revisa feedback pendiente semanalmente

5. **Exportación Mensual**: Backup de datos regularmente

6. **QR Físicos**: Imprime en alta calidad para mejor escaneo

7. **URLs Cortas**: La URL generada es fácil de compartir también manualmente

8. **Estados Claros**: Desactiva QR cuando ya no sean necesarios en lugar de eliminar

---

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que estés autenticado como ADMIN
2. Revisa console del navegador (F12)
3. Verifica conexión con Sanity
4. Contacta al administrador del sistema

---

**Última actualización:** 22 de octubre, 2025  
**Versión:** 1.0.0  
**Sistema:** Totalmente funcional ✅
