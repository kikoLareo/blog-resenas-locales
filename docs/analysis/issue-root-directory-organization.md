# Issue: Reorganizar documentación en el directorio raíz

## Problema
El directorio raíz tiene demasiados archivos de documentación dispersos, dificultando la navegación y violando principios de organización de proyectos Next.js.

## Archivos de documentación en raíz
```
./AI_MODEL_RULES.md
./Agents.md
./CARRUSEL_STATUS.md
./CODE_GUIDELINES.md          ← Podría quedarse
./DEPLOYMENT.md
./IDEA_DASHBOARD.md
./MCP.md
./MEMORY_BANK.md
./MEMORY_BANK_HOME_SECTIONS.md
./PLAN_COMPLETO.md
./PLAN_MAESTRO_AGENTES.md
./README.md                   ← Debe quedarse
./SubAgents.md
./TODO.md
./Tools.md
```

## Por qué es problemático
1. **Clutter en raíz**: Dificulta encontrar archivos de configuración importantes
2. **Falta de categorización**: Documentos mezclados sin estructura lógica
3. **Violación de convenciones**: Los proyectos profesionales mantienen raíz limpio
4. **Experiencia de desarrollador**: Confuso para nuevos desarrolladores
5. **Navegación compleja**: Demasiados archivos al nivel superior

## Propuesta de reorganización

### Mantener en raíz (archivos esenciales)
```
./README.md                   ← Principal del proyecto
./CODE_GUIDELINES.md          ← Crítico para desarrollo
```

### Mover a docs/ (por categoría)
```
docs/
├── planning/
│   ├── PLAN_COMPLETO.md
│   ├── PLAN_MAESTRO_AGENTES.md
│   └── TODO.md
├── ai-development/
│   ├── AI_MODEL_RULES.md
│   ├── Agents.md
│   ├── SubAgents.md
│   ├── MCP.md
│   └── Tools.md
├── features/
│   ├── CARRUSEL_STATUS.md
│   ├── IDEA_DASHBOARD.md
│   └── MEMORY_BANK_HOME_SECTIONS.md
└── infrastructure/
    ├── DEPLOYMENT.md
    └── MEMORY_BANK.md
```

## Acción recomendada
1. **Crear subdirectorios en docs/**:
   ```bash
   mkdir -p docs/planning
   mkdir -p docs/ai-development  
   mkdir -p docs/features
   mkdir -p docs/infrastructure
   ```

2. **Mover archivos apropiadamente**:
   ```bash
   git mv PLAN_COMPLETO.md docs/planning/
   git mv PLAN_MAESTRO_AGENTES.md docs/planning/
   git mv TODO.md docs/planning/
   
   git mv AI_MODEL_RULES.md docs/ai-development/
   git mv Agents.md docs/ai-development/
   git mv SubAgents.md docs/ai-development/
   git mv MCP.md docs/ai-development/
   git mv Tools.md docs/ai-development/
   
   git mv CARRUSEL_STATUS.md docs/features/
   git mv IDEA_DASHBOARD.md docs/features/
   git mv MEMORY_BANK_HOME_SECTIONS.md docs/features/
   
   git mv DEPLOYMENT.md docs/infrastructure/
   git mv MEMORY_BANK.md docs/infrastructure/
   ```

3. **Actualizar README.md** con enlaces a nueva estructura
4. **Crear índice en docs/README.md** para facilitar navegación

## Criterio de aceptación
- [ ] Archivos movidos a subdirectorios apropiados
- [ ] README.md actualizado con nueva estructura
- [ ] Índice creado en docs/README.md
- [ ] Links internos entre documentos actualizados
- [ ] Máximo 5-6 archivos en el directorio raíz

## Prioridad
**Baja** - Mejora experiencia de desarrollo pero no afecta funcionalidad

## Impacto estimado
- Tiempo: 1-2 horas
- Riesgo: Muy bajo
- Beneficio: Mejor organización y experiencia de desarrollador