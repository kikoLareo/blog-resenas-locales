# Subagentes

> Crea y usa subagentes de IA especializados en Claude Code para flujos de trabajo específicos de tareas y gestión mejorada del contexto.

Los subagentes personalizados en Claude Code son asistentes de IA especializados que pueden ser invocados para manejar tipos específicos de tareas. Permiten una resolución de problemas más eficiente al proporcionar configuraciones específicas de tareas con prompts del sistema personalizados, herramientas y una ventana de contexto separada.

## ¿Qué son los subagentes?

Los subagentes son personalidades de IA preconfiguradas a las que Claude Code puede delegar tareas. Cada subagente:

* Tiene un propósito específico y área de experiencia
* Usa su propia ventana de contexto separada de la conversación principal
* Puede ser configurado con herramientas específicas que se le permite usar
* Incluye un prompt del sistema personalizado que guía su comportamiento

Cuando Claude Code encuentra una tarea que coincide con la experiencia de un subagente, puede delegar esa tarea al subagente especializado, que trabaja independientemente y devuelve resultados.

## Beneficios clave

<CardGroup cols={2}>
  <Card title="Preservación del contexto" icon="layer-group">
    Cada subagente opera en su propio contexto, previniendo la contaminación de la conversación principal y manteniéndola enfocada en objetivos de alto nivel.
  </Card>

  <Card title="Experiencia especializada" icon="brain">
    Los subagentes pueden ser ajustados finamente con instrucciones detalladas para dominios específicos, llevando a tasas de éxito más altas en tareas designadas.
  </Card>

  <Card title="Reutilización" icon="rotate">
    Una vez creados, los subagentes pueden ser usados a través de diferentes proyectos y compartidos con tu equipo para flujos de trabajo consistentes.
  </Card>

  <Card title="Permisos flexibles" icon="shield-check">
    Cada subagente puede tener diferentes niveles de acceso a herramientas, permitiéndote limitar herramientas poderosas a tipos específicos de subagentes.
  </Card>
</CardGroup>

## Inicio rápido

Para crear tu primer subagente:

<Steps>
  <Step title="Abrir la interfaz de subagentes">
    Ejecuta el siguiente comando:

    ```
    /agents
    ```
  </Step>

  <Step title="Seleccionar 'Crear Nuevo Agente'">
    Elige si crear un subagente a nivel de proyecto o a nivel de usuario
  </Step>

  <Step title="Definir el subagente">
    * **Recomendado**: Genera primero con Claude, luego personaliza para hacerlo tuyo
    * Describe tu subagente en detalle y cuándo debería ser usado
    * Selecciona las herramientas a las que quieres otorgar acceso (o deja en blanco para heredar todas las herramientas)
    * La interfaz muestra todas las herramientas disponibles, facilitando la selección
    * Si estás generando con Claude, también puedes editar el prompt del sistema en tu propio editor presionando `e`
  </Step>

  <Step title="Guardar y usar">
    ¡Tu subagente ya está disponible! Claude lo usará automáticamente cuando sea apropiado, o puedes invocarlo explícitamente:

    ```
    > Usa el subagente code-reviewer para revisar mis cambios recientes
    ```
  </Step>
</Steps>

## Configuración de subagentes

### Ubicaciones de archivos

Los subagentes se almacenan como archivos Markdown con frontmatter YAML en dos ubicaciones posibles:

| Tipo                       | Ubicación           | Alcance                           | Prioridad |
| :------------------------- | :------------------ | :-------------------------------- | :-------- |
| **Subagentes de proyecto** | `.claude/agents/`   | Disponible en el proyecto actual  | Más alta  |
| **Subagentes de usuario**  | `~/.claude/agents/` | Disponible en todos los proyectos | Más baja  |

Cuando los nombres de subagentes entran en conflicto, los subagentes a nivel de proyecto tienen precedencia sobre los subagentes a nivel de usuario.

### Formato de archivo

Cada subagente se define en un archivo Markdown con esta estructura:

```markdown
---
name: tu-nombre-de-sub-agente
description: Descripción de cuándo este subagente debería ser invocado
tools: herramienta1, herramienta2, herramienta3  # Opcional - hereda todas las herramientas si se omite
---

El prompt del sistema de tu subagente va aquí. Esto puede ser múltiples párrafos
y debería definir claramente el rol del subagente, capacidades, y enfoque
para resolver problemas.

Incluye instrucciones específicas, mejores prácticas, y cualquier restricción
que el subagente debería seguir.
```

#### Campos de configuración

| Campo         | Requerido | Descripción                                                                                                         |
| :------------ | :-------- | :------------------------------------------------------------------------------------------------------------------ |
| `name`        | Sí        | Identificador único usando letras minúsculas y guiones                                                              |
| `description` | Sí        | Descripción en lenguaje natural del propósito del subagente                                                         |
| `tools`       | No        | Lista separada por comas de herramientas específicas. Si se omite, hereda todas las herramientas del hilo principal |

### Herramientas disponibles

Los subagentes pueden tener acceso a cualquiera de las herramientas internas de Claude Code. Ve la [documentación de herramientas](/es/docs/claude-code/settings#tools-available-to-claude) para una lista completa de herramientas disponibles.

<Tip>
  **Recomendado:** Usa el comando `/agents` para modificar el acceso a herramientas - proporciona una interfaz interactiva que lista todas las herramientas disponibles, incluyendo cualquier herramienta de servidor MCP conectada, facilitando la selección de las que necesitas.
</Tip>

Tienes dos opciones para configurar herramientas:

* **Omitir el campo `tools`** para heredar todas las herramientas del hilo principal (por defecto), incluyendo herramientas MCP
* **Especificar herramientas individuales** como una lista separada por comas para un control más granular (puede ser editado manualmente o vía `/agents`)

**Herramientas MCP**: Los subagentes pueden acceder a herramientas MCP de servidores MCP configurados. Cuando el campo `tools` se omite, los subagentes heredan todas las herramientas MCP disponibles para el hilo principal.

## Gestión de subagentes

### Usando el comando /agents (Recomendado)

El comando `/agents` proporciona una interfaz integral para la gestión de subagentes:

```
/agents
```

Esto abre un menú interactivo donde puedes:

* Ver todos los subagentes disponibles (integrados, de usuario, y de proyecto)
* Crear nuevos subagentes con configuración guiada
* Editar subagentes personalizados existentes, incluyendo su acceso a herramientas
* Eliminar subagentes personalizados
* Ver qué subagentes están activos cuando existen duplicados
* **Gestionar fácilmente permisos de herramientas** con una lista completa de herramientas disponibles

### Gestión directa de archivos

También puedes gestionar subagentes trabajando directamente con sus archivos:

```bash
# Crear un subagente de proyecto
mkdir -p .claude/agents
echo '---
name: test-runner
description: Usar proactivamente para ejecutar pruebas y corregir fallas
---

Eres un experto en automatización de pruebas. Cuando veas cambios de código, ejecuta proactivamente las pruebas apropiadas. Si las pruebas fallan, analiza las fallas y corrígelas mientras preservas la intención original de la prueba.' > .claude/agents/test-runner.md

# Crear un subagente de usuario
mkdir -p ~/.claude/agents
# ... crear archivo de subagente
```

## Usando subagentes efectivamente

### Delegación automática

Claude Code delega tareas proactivamente basándose en:

* La descripción de la tarea en tu solicitud
* El campo `description` en las configuraciones de subagentes
* Contexto actual y herramientas disponibles

<Tip>
  Para fomentar un uso más proactivo de subagentes, incluye frases como "usar PROACTIVAMENTE" o "DEBE SER USADO" en tu campo `description`.
</Tip>

### Invocación explícita

Solicita un subagente específico mencionándolo en tu comando:

```
> Usa el subagente test-runner para corregir pruebas que fallan
> Haz que el subagente code-reviewer revise mis cambios recientes
> Pide al subagente debugger que investigue este error
```

## Ejemplos de subagentes

### Revisor de código

```markdown
---
name: code-reviewer
description: Especialista experto en revisión de código. Revisa proactivamente código por calidad, seguridad, y mantenibilidad. Usar inmediatamente después de escribir o modificar código.
tools: Read, Grep, Glob, Bash
---

Eres un revisor de código senior asegurando altos estándares de calidad y seguridad de código.

Cuando seas invocado:
1. Ejecuta git diff para ver cambios recientes
2. Enfócate en archivos modificados
3. Comienza la revisión inmediatamente

Lista de verificación de revisión:
- El código es simple y legible
- Las funciones y variables están bien nombradas
- No hay código duplicado
- Manejo apropiado de errores
- No hay secretos o claves API expuestas
- Validación de entrada implementada
- Buena cobertura de pruebas
- Consideraciones de rendimiento abordadas

Proporciona retroalimentación organizada por prioridad:
- Problemas críticos (debe corregir)
- Advertencias (debería corregir)
- Sugerencias (considerar mejorar)

Incluye ejemplos específicos de cómo corregir problemas.
```

### Depurador

```markdown
---
name: debugger
description: Especialista en depuración para errores, fallas de pruebas, y comportamiento inesperado. Usar proactivamente cuando se encuentren problemas.
tools: Read, Edit, Bash, Grep, Glob
---

Eres un experto depurador especializado en análisis de causa raíz.

Cuando seas invocado:
1. Captura mensaje de error y stack trace
2. Identifica pasos de reproducción
3. Aísla la ubicación de la falla
4. Implementa corrección mínima
5. Verifica que la solución funcione

Proceso de depuración:
- Analiza mensajes de error y logs
- Revisa cambios recientes de código
- Forma y prueba hipótesis
- Agrega logging de depuración estratégico
- Inspecciona estados de variables

Para cada problema, proporciona:
- Explicación de causa raíz
- Evidencia que respalde el diagnóstico
- Corrección específica de código
- Enfoque de pruebas
- Recomendaciones de prevención

Enfócate en corregir el problema subyacente, no solo los síntomas.
```

### Científico de datos

```markdown
---
name: data-scientist
description: Experto en análisis de datos para consultas SQL, operaciones BigQuery, e insights de datos. Usar proactivamente para tareas de análisis de datos y consultas.
tools: Bash, Read, Write
---

Eres un científico de datos especializado en análisis SQL y BigQuery.

Cuando seas invocado:
1. Entiende el requerimiento de análisis de datos
2. Escribe consultas SQL eficientes
3. Usa herramientas de línea de comandos BigQuery (bq) cuando sea apropiado
4. Analiza y resume resultados
5. Presenta hallazgos claramente

Prácticas clave:
- Escribe consultas SQL optimizadas con filtros apropiados
- Usa agregaciones y joins apropiados
- Incluye comentarios explicando lógica compleja
- Formatea resultados para legibilidad
- Proporciona recomendaciones basadas en datos

Para cada análisis:
- Explica el enfoque de la consulta
- Documenta cualquier suposición
- Resalta hallazgos clave
- Sugiere próximos pasos basados en datos

Siempre asegúrate de que las consultas sean eficientes y costo-efectivas.
```

## Mejores prácticas

* **Comienza con agentes generados por Claude**: Recomendamos altamente generar tu subagente inicial con Claude y luego iterar sobre él para hacerlo personalmente tuyo. Este enfoque te da los mejores resultados - una base sólida que puedes personalizar a tus necesidades específicas.

* **Diseña subagentes enfocados**: Crea subagentes con responsabilidades únicas y claras en lugar de tratar de hacer que un subagente haga todo. Esto mejora el rendimiento y hace que los subagentes sean más predecibles.

* **Escribe prompts detallados**: Incluye instrucciones específicas, ejemplos, y restricciones en tus prompts del sistema. Mientras más orientación proporciones, mejor será el rendimiento del subagente.

* **Limita el acceso a herramientas**: Solo otorga herramientas que sean necesarias para el propósito del subagente. Esto mejora la seguridad y ayuda al subagente a enfocarse en acciones relevantes.

* **Control de versiones**: Incluye subagentes de proyecto en el control de versiones para que tu equipo pueda beneficiarse y mejorarlos colaborativamente.

## Uso avanzado

### Encadenamiento de subagentes

Para flujos de trabajo complejos, puedes encadenar múltiples subagentes:

```
> Primero usa el subagente code-analyzer para encontrar problemas de rendimiento, luego usa el subagente optimizer para corregirlos
```

### Selección dinámica de subagentes

Claude Code selecciona inteligentemente subagentes basándose en el contexto. Haz que tus campos `description` sean específicos y orientados a la acción para mejores resultados.

## Consideraciones de rendimiento

* **Eficiencia de contexto**: Los agentes ayudan a preservar el contexto principal, permitiendo sesiones generales más largas
* **Latencia**: Los subagentes comienzan con una pizarra limpia cada vez que son invocados y pueden agregar latencia mientras recopilan el contexto que requieren para hacer su trabajo efectivamente.

## Documentación relacionada

* [Comandos slash](/es/docs/claude-code/slash-commands) - Aprende sobre otros comandos integrados
* [Configuraciones](/es/docs/claude-code/settings) - Configura el comportamiento de Claude Code
* [Hooks](/es/docs/claude-code/hooks) - Automatiza flujos de trabajo con manejadores de eventos