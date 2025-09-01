# Issue: Remover archivos de base de datos de control de versiones

## Problema
Archivos de base de datos SQLite están siendo trackeados en Git, incluyendo backups numerados, violando las mejores prácticas de desarrollo.

## Archivos problemáticos
```
./prisma/dev.db      → Base de datos de desarrollo
./prisma/dev 2.db    → Backup de base de datos
```

## Por qué es problemático
1. **Violación de mejores prácticas**: Las bases de datos no deben estar en Git
2. **Archivos binarios en Git**: Incrementa innecesariamente el tamaño del repo
3. **Conflictos de merge**: Las DB pueden causar conflictos binarios
4. **Datos sensibles**: Potencial exposición de datos de desarrollo
5. **Backup innecesario**: Los backups de DB no van en control de versiones

## Convención estándar
Según las mejores prácticas de desarrollo:
- Archivos `.db` deben estar en `.gitignore`
- Solo esquemas y migraciones van en Git
- Datos de desarrollo se generan localmente

## Acción recomendada
1. **Verificar .gitignore actual** para archivos de base de datos
2. **Remover archivos DB del repositorio**:
   ```bash
   git rm --cached prisma/dev.db
   git rm --cached "prisma/dev 2.db"
   ```

3. **Actualizar .gitignore** si es necesario:
   ```gitignore
   # Database files
   *.db
   *.db-*
   /prisma/*.db
   ```

4. **Documentar regeneración de DB** en README:
   ```bash
   npx prisma migrate dev
   npx prisma db seed  # si existe seed
   ```

## Verificar archivos a mantener
✓ Mantener en Git:
- `prisma/schema.prisma`
- `prisma/migrations/`
- Scripts de seed

✗ Remover de Git:
- `*.db` files
- Database backups

## Criterio de aceptación
- [ ] Archivos `.db` removidos del repositorio
- [ ] `.gitignore` actualizado apropiadamente
- [ ] Documentación de setup de DB local
- [ ] Verificar que migraciones y schema se mantienen

## Prioridad
**Alta** - Seguridad y mejores prácticas

## Impacto estimado
- Tiempo: 15-30 minutos
- Riesgo: Muy bajo (solo afecta archivos locales)
- Beneficio: Repo más limpio y seguro