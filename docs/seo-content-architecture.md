# Arquitectura de Contenidos SEO - SaborLocal

## Nuevos Tipos de Contenido

### 1. **Guías & Rutas** (`guide`)
**Objetivo SEO**: Capturar búsquedas cabeza "dónde comer + zona/ocasión/presupuesto"

#### Campos principales:
- `title`: "Dónde comer en [Barrio] 2025 (mapa + 25 sitios)"
- `type`: 'neighborhood' | 'thematic' | 'budget' | 'occasion'
- `city`: referencia a ciudad
- `neighborhood`: string opcional
- `theme`: 'con-niños' | 'grupos' | 'barato' | 'brunch' | 'noche' | 'romantico'
- `venues`: array de referencias a locales (8-25)
- `mapData`: coordenadas y configuración
- `introduction`: texto introductorio
- `sections`: array de secciones con locales agrupados
- `faq`: preguntas frecuentes
- `lastUpdated`: fecha de última actualización

#### Schema JSON-LD: `BreadcrumbList`, `ItemList`, `LocalBusiness`, `FAQPage`

---

### 2. **Listas & Rankings** (`list`)
**Objetivo SEO**: Capturar intención comparativa ("mejor + plato + ciudad")

#### Campos principales:
- `title`: "10 mejores tortillas en [Ciudad] (2025)"
- `listType`: 'top-dish' | 'neighborhood-comparison' | 'price-range' | 'occasion'
- `dish`: string del plato específico
- `city`: referencia a ciudad
- `venues`: array ordenado de locales con posición
- `criteria`: criterios de selección
- `introduction`: contexto y metodología
- `comparison`: tabla comparativa
- `verdict`: conclusión final

#### Schema JSON-LD: `ItemList`, `Review`, `LocalBusiness`

---

### 3. **Recetas** (`recipe`)
**Objetivo SEO**: Tráfico informacional evergreen + apoyo a marca/EEAT

#### Campos principales:
- `title`: "Empanada gallega auténtica (masa casera)"
- `recipeType`: 'tradicional' | 'rapida' | 'saludable' | 'temporada'
- `difficulty`: 'facil' | 'intermedio' | 'avanzado'
- `prepTime`: minutos de preparación
- `cookTime`: minutos de cocción
- `servings`: número de porciones
- `ingredients`: array de ingredientes con cantidades
- `instructions`: pasos numerados
- `tips`: consejos y trucos
- `variations`: variantes de la receta
- `substitutions`: sustituciones de ingredientes
- `relatedVenues`: dónde probarlo fuera
- `nutritionalInfo`: información nutricional opcional

#### Schema JSON-LD: `Recipe`, `HowTo`, `VideoObject` (si hay), `ImageObject`

---

### 4. **Guías de Platos** (`dish-guide`)
**Objetivo SEO**: Capturar búsquedas "qué es + cómo se come + dónde probar"

#### Campos principales:
- `title`: "Qué es la zorza y dónde comerla en A Coruña"
- `dishName`: nombre del plato
- `origin`: origen e historia
- `description`: qué es y características
- `howToEat`: cómo se come/pide
- `variations`: variantes regionales
- `bestVenues`: dónde probarlo (referencias)
- `relatedRecipes`: recetas relacionadas
- `seasonality`: temporalidad si aplica

#### Schema JSON-LD: `Article`, `FAQPage`, `HowTo`

---

### 5. **Mapas Interactivos** (`map`)
**Objetivo SEO**: UX y retención; señales de interacción; SEO local

#### Campos principales:
- `title`: "Mapa para comer en [Ciudad]: filtra por terraza y ticket medio"
- `city`: referencia a ciudad
- `neighborhoods`: barrios incluidos
- `venues`: locales con coordenadas
- `filters`: configuración de filtros disponibles
- `defaultView`: vista por defecto del mapa
- `legend`: leyenda de iconos y colores

#### Schema JSON-LD: `LocalBusiness` (por punto), `ItemList`

---

### 6. **Novedades & Tendencias** (`news`)
**Objetivo SEO**: Freshness + descubrimiento

#### Campos principales:
- `title`: "Nuevas aperturas en [Ciudad] – Septiembre 2025"
- `newsType`: 'aperturas' | 'pop-ups' | 'temporada' | 'eventos'
- `city`: referencia a ciudad
- `content`: contenido de la noticia
- `venues`: locales mencionados
- `eventDate`: fecha del evento si aplica
- `featured`: si es noticia destacada

#### Schema JSON-LD: `Article`, `NewsArticle`, `Event` (si aplica)

---

### 7. **Ofertas & Menús** (`offer`)
**Objetivo SEO**: Intención transaccional blanda + afiliación/lead

#### Campos principales:
- `title`: "Menús del día en [Barrio]: 10 opciones bajo 15€"
- `offerType`: 'menu-dia' | 'brunch' | 'degustacion' | 'descuento'
- `priceRange`: rango de precios
- `venues`: locales con ofertas
- `validUntil`: fecha de validez
- `conditions`: condiciones de la oferta

#### Schema JSON-LD: `Offer`, `Menu`, `LocalBusiness`

---

## Taxonomías y Relaciones

### **Taxonomía Principal**:
```
Ciudad → Barrio → Tipo de cocina → Formato → Servicios → Rango de precio → Dietas
```

### **Marcadores/Tags**:
- **Servicios**: terraza, kids-friendly, pet-friendly, wifi, parking
- **Dietas**: sin-gluten, vegano, vegetariano, sin-lactosa
- **Ocasiones**: romantico, grupos, familiar, negocios, celebraciones
- **Horarios**: desayuno, brunch, comida, merienda, cena, tardeo

### **Estados de Contenido**:
- `draft`: borrador
- `review`: en revisión
- `published`: publicado
- `archived`: archivado
- `updated`: actualizado recientemente

---

## Sistema de Enlazado Interno

### **Reglas de Enlazado**:
1. **Guías → Listas → Fichas**: Cada guía enlaza a 3-5 listas relevantes
2. **Listas → Fichas**: Cada lista enlaza a 8-12 fichas de locales
3. **Recetas → Guías de Plato → Listas → Fichas**: Flujo completo
4. **Mapas → Fichas**: Pins del mapa enlazan directamente a fichas
5. **Novedades → Fichas**: Menciones enlazan a fichas de locales

### **Módulos de Enlazado**:
- "Cerca de aquí" (por barrio + distancia)
- "También te puede gustar" (por similitud)
- "Dónde comer esto" (de receta a locales)
- "Sitios relacionados" (misma categoría/barrio)

---

## Optimización SEO

### **Breadcrumbs Jerárquicos**:
```
Home → [Ciudad] → [Barrio] → [Tipo de Contenido] → [Contenido Específico]
```

### **URLs Semánticas**:
- Guías: `/madrid/malasana/guia-donde-comer`
- Listas: `/madrid/mejores-tortillas-2025`
- Recetas: `/recetas/empanada-gallega-autentica`
- Fichas: `/madrid/malasana/nombre-local`

### **Metadatos Dinámicos**:
- Títulos con variables: "[Plato] en [Zona]: [Número] sitios imprescindibles"
- Descripciones con contexto local y temporal
- Keywords automáticas basadas en taxonomías

---

## Freshness y Actualización

### **Señales de Frescura**:
- "Actualizado en [Mes/Año]" visible
- Sección "Últimas actualizaciones"
- Fechas de revisión en metadatos
- Sistema de versionado de contenido

### **Programación de Actualizaciones**:
- Guías: revisión trimestral
- Listas: actualización mensual
- Recetas: evergreen con updates ocasionales
- Novedades: contenido semanal
- Ofertas: validez temporal automática
