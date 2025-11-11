# ✅ Checklist de Verificación - Gestión de Usuarios

## 🔧 Configuración Inicial

- [ ] Variable `ADMIN_API_SECRET` configurada en `.env`
- [ ] Variable `DATABASE_URL` configurada en `.env`
- [ ] Variable `PASSWORD_SALT_ROUNDS` configurada (default: 10)
- [ ] Prisma client generado: `npx prisma generate`
- [ ] Migraciones aplicadas: `npx prisma migrate deploy`

## 🌐 API Endpoints

### GET /api/admin/users
- [ ] Retorna lista de usuarios con secret válido
- [ ] Retorna 401 sin secret o con secret inválido
- [ ] Incluye estadísticas (total, byRole, verified, withImage)
- [ ] Ordena usuarios por fecha de creación (más recientes primero)

### POST /api/admin/users
- [ ] Crea usuario con datos válidos
- [ ] Valida formato de email
- [ ] Valida longitud mínima de contraseña (8 caracteres)
- [ ] Valida rol permitido
- [ ] Retorna 409 si email ya existe
- [ ] Hash de contraseña funciona correctamente
- [ ] Normaliza email a lowercase
- [ ] Trimea espacios en nombre

### GET /api/admin/users/[id]
- [ ] Retorna usuario específico con secret válido
- [ ] Retorna 404 si usuario no existe
- [ ] Incluye contadores de relaciones (_count)

### PUT /api/admin/users/[id]
- [ ] Actualiza nombre correctamente
- [ ] Actualiza username correctamente
- [ ] Actualiza rol correctamente
- [ ] Actualiza contraseña correctamente
- [ ] Valida username único
- [ ] Previene cambiar rol del último ADMIN
- [ ] Valida longitud de nueva contraseña
- [ ] Retorna 404 si usuario no existe
- [ ] Mensajes de error en español

### DELETE /api/admin/users/[id]
- [ ] Elimina usuario correctamente
- [ ] Previene eliminar último ADMIN
- [ ] Elimina en cascada (sessions, accounts)
- [ ] Retorna 404 si usuario no existe
- [ ] Confirmación antes de eliminar

## 🎨 Dashboard UI (/dashboard/users)

### Autenticación
- [ ] Muestra formulario de admin secret si no está configurado
- [ ] Guarda secret en localStorage
- [ ] Recarga usuarios al guardar secret
- [ ] Muestra error si secret es inválido

### Estadísticas
- [ ] Muestra total de usuarios
- [ ] Muestra usuarios por rol (ADMIN, EDITOR, MEMBER, GUEST)
- [ ] Muestra usuarios verificados
- [ ] Muestra usuarios con imagen
- [ ] Actualiza estadísticas al hacer cambios

### Filtros y Búsqueda
- [ ] Búsqueda por email funciona
- [ ] Búsqueda por nombre funciona
- [ ] Búsqueda por username funciona
- [ ] Filtro por rol funciona
- [ ] Contador de resultados filtrados
- [ ] Combinación de búsqueda + filtro funciona
- [ ] Búsqueda es case-insensitive

### Crear Usuario
- [ ] Modal se abre/cierra correctamente
- [ ] Validación de email en frontend
- [ ] Validación de contraseña mínima en frontend
- [ ] Selector de rol incluye todos los roles
- [ ] Botón "Crear" se deshabilita mientras crea
- [ ] Muestra mensaje de éxito
- [ ] Muestra mensaje de error con detalles
- [ ] Limpia formulario después de crear
- [ ] Recarga lista de usuarios
- [ ] Cierra modal después de crear exitosamente

### Editar Usuario
- [ ] Modo edición se activa correctamente
- [ ] Pre-llena campos con datos actuales
- [ ] Permite editar nombre
- [ ] Permite editar username
- [ ] Permite editar rol
- [ ] Botón cancelar revierte cambios
- [ ] Muestra mensaje de éxito
- [ ] Muestra mensaje de error
- [ ] Recarga datos después de editar
- [ ] Validación de username único

### Cambiar Contraseña
- [ ] Modal de contraseña se abre
- [ ] Campo de contraseña oculta caracteres
- [ ] Validación de longitud mínima
- [ ] Muestra mensaje de éxito
- [ ] Muestra mensaje de error
- [ ] Limpia campo al cancelar
- [ ] Cierra modal al cancelar

### Eliminar Usuario
- [ ] Muestra diálogo de confirmación
- [ ] Cancela si usuario no confirma
- [ ] Elimina si usuario confirma
- [ ] Previene eliminar último ADMIN (UI)
- [ ] Muestra mensaje de éxito
- [ ] Muestra mensaje de error
- [ ] Recarga lista después de eliminar

### Visualización de Usuarios
- [ ] Muestra avatar con inicial
- [ ] Muestra nombre o email
- [ ] Muestra icono de verificación
- [ ] Badge de rol con color correcto
  - [ ] ADMIN: Rojo
  - [ ] EDITOR: Azul
  - [ ] MEMBER: Verde
  - [ ] GUEST: Gris
- [ ] Muestra email completo
- [ ] Muestra username si existe
- [ ] Muestra fecha de creación formateada
- [ ] Muestra número de sesiones
- [ ] Muestra número de suscripciones

### Botones de Acción
- [ ] Botón editar muestra icono y tooltip
- [ ] Botón cambiar contraseña muestra icono y tooltip
- [ ] Botón eliminar muestra icono y tooltip
- [ ] Botones tienen tamaño y espaciado correcto

### Mensajes y Feedback
- [ ] Mensajes de éxito en verde
- [ ] Mensajes de error en rojo
- [ ] Mensajes desaparecen al hacer nueva acción
- [ ] Mensajes son claros y en español

### Estados de Carga
- [ ] Muestra "Cargando usuarios..." al iniciar
- [ ] Deshabilita botón mientras crea usuario
- [ ] Feedback visual durante operaciones

### Responsive
- [ ] Funciona en desktop
- [ ] Funciona en tablet
- [ ] Funciona en mobile
- [ ] Grid de estadísticas se adapta

## 🔒 Seguridad

- [ ] Contraseñas hasheadas con bcrypt
- [ ] No se exponen contraseñas en responses
- [ ] Header x-admin-secret requerido en todas las rutas
- [ ] Validación de inputs en backend
- [ ] Sanitización de datos (trim, lowercase)
- [ ] Protección contra último ADMIN
- [ ] Validación de email único
- [ ] Validación de username único

## 🧪 Casos de Prueba

### Escenario 1: Crear primer usuario
1. [ ] Base de datos vacía
2. [ ] Crear usuario ADMIN
3. [ ] Verificar que aparece en lista
4. [ ] Verificar estadísticas actualizadas

### Escenario 2: No permitir duplicados
1. [ ] Crear usuario con email "test@test.com"
2. [ ] Intentar crear otro con mismo email
3. [ ] Verificar error "El usuario ya existe"

### Escenario 3: Protección de último ADMIN
1. [ ] Tener solo 1 usuario ADMIN
2. [ ] Intentar cambiar su rol a MEMBER
3. [ ] Verificar error de protección
4. [ ] Intentar eliminar último ADMIN
5. [ ] Verificar error de protección

### Escenario 4: Filtros combinados
1. [ ] Tener usuarios de diferentes roles
2. [ ] Filtrar por EDITOR
3. [ ] Buscar por nombre específico
4. [ ] Verificar que solo muestra EDITOR con ese nombre

### Escenario 5: Cambio de contraseña
1. [ ] Crear usuario
2. [ ] Cambiar su contraseña
3. [ ] Intentar login con contraseña nueva
4. [ ] Verificar que funciona

### Escenario 6: Edición de datos
1. [ ] Editar nombre de usuario
2. [ ] Verificar actualización inmediata
3. [ ] Editar username
4. [ ] Verificar cambio en UI
5. [ ] Editar rol
6. [ ] Verificar badge actualizado

## 📊 Pruebas de Rendimiento

- [ ] Carga lista de 100+ usuarios en < 2 segundos
- [ ] Búsqueda filtra en tiempo real (< 100ms)
- [ ] Creación de usuario < 1 segundo
- [ ] Actualización de usuario < 1 segundo
- [ ] Eliminación de usuario < 1 segundo

## 🐛 Manejo de Errores

- [ ] Error de red muestra mensaje apropiado
- [ ] Error 401 (Unauthorized) muestra mensaje claro
- [ ] Error 404 (Not Found) manejado correctamente
- [ ] Error 409 (Conflict) muestra razón
- [ ] Error 500 muestra mensaje genérico
- [ ] Errores de validación muestran campo específico

## ✨ UX/UI

- [ ] Colores consistentes con el resto del dashboard
- [ ] Iconos claros y descriptivos
- [ ] Tooltips informativos
- [ ] Formularios claros y concisos
- [ ] Confirmaciones para acciones destructivas
- [ ] Feedback inmediato en todas las acciones
- [ ] Textos en español correctamente
- [ ] Sin datos mock o placeholder

## 🚀 Próximos Pasos

- [ ] Implementar paginación si hay muchos usuarios
- [ ] Agregar ordenamiento por columnas
- [ ] Exportar a CSV
- [ ] Envío de emails de bienvenida
- [ ] Reset de contraseña vía email
- [ ] Historial de actividad
- [ ] Suspensión temporal
- [ ] Gestión masiva (bulk actions)

---

## ✅ Resultado Final

**Estado**: [ ] Todas las funcionalidades verificadas y funcionando
**Sin datos mock**: [ ] Confirmado - Todos los datos vienen de PostgreSQL
**Documentación**: [ ] Completa en /docs/10-user-management.md
**Listo para producción**: [ ] Sí / [ ] No

### Notas de Verificación

```
Fecha de prueba: _______________
Probado por: _______________
Ambiente: [ ] Local [ ] Staging [ ] Production
Base de datos: PostgreSQL via Prisma
Versión Next.js: 15.1.0
```
