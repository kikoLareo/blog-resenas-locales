import { defineField, defineType } from 'sanity';

export const recipe = defineType({
  name: 'recipe',
  title: 'Receta',
  type: 'document',
  icon: () => '👨‍🍳',
  groups: [
    {
      name: 'basic',
      title: 'Información básica',
    },
    {
      name: 'ingredients',
      title: 'Ingredientes',
    },
    {
      name: 'instructions',
      title: 'Preparación',
    },
    {
      name: 'nutrition',
      title: 'Nutrición',
    },
    {
      name: 'seo',
      title: 'SEO/AEO',
    },
    {
      name: 'settings',
      title: 'Configuración',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la receta',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(10).max(120),
      description: 'Ej: "Empanada gallega auténtica (masa casera)"',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      group: 'basic',
      validation: (rule) => rule.required().min(100).max(300),
      description: 'Descripción atractiva de la receta',
    }),
    defineField({
      name: 'recipeType',
      title: 'Tipo de receta',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Tradicional', value: 'tradicional' },
          { title: 'Rápida', value: 'rapida' },
          { title: 'Saludable', value: 'saludable' },
          { title: 'Temporada', value: 'temporada' },
          { title: 'Postre', value: 'postre' },
          { title: 'Aperitivo', value: 'aperitivo' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'difficulty',
      title: 'Dificultad',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Fácil', value: 'facil' },
          { title: 'Intermedio', value: 'intermedio' },
          { title: 'Avanzado', value: 'avanzado' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'prepTime',
      title: 'Tiempo de preparación (minutos)',
      type: 'number',
      group: 'basic',
      validation: (rule) => rule.required().min(5).max(480),
    }),
    defineField({
      name: 'cookTime',
      title: 'Tiempo de cocción (minutos)',
      type: 'number',
      group: 'basic',
      validation: (rule) => rule.required().min(0).max(480),
    }),
    defineField({
      name: 'totalTime',
      title: 'Tiempo total (calculado)',
      type: 'number',
      readOnly: true,
      description: 'Se calcula automáticamente',
    }),
    defineField({
      name: 'servings',
      title: 'Número de porciones',
      type: 'number',
      group: 'basic',
      validation: (rule) => rule.required().min(1).max(20),
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'basic',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredientes',
      type: 'array',
      group: 'ingredients',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'amount',
              title: 'Cantidad',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'Ej: "2", "1/2", "al gusto"',
            },
            {
              name: 'unit',
              title: 'Unidad',
              type: 'string',
              options: {
                list: [
                  'kg', 'g', 'l', 'ml', 'taza', 'cucharada', 'cucharadita',
                  'unidad', 'diente', 'rama', 'hoja', 'pizca', 'al gusto',
                ],
              },
            },
            {
              name: 'ingredient',
              title: 'Ingrediente',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'preparation',
              title: 'Preparación',
              type: 'string',
              description: 'Ej: "picado fino", "en juliana"',
            },
            {
              name: 'optional',
              title: 'Opcional',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              amount: 'amount',
              unit: 'unit',
              ingredient: 'ingredient',
              optional: 'optional',
            },
            prepare({ amount, unit, ingredient, optional }) {
              return {
                title: `${amount} ${unit || ''} ${ingredient}`,
                subtitle: optional ? 'Opcional' : '',
              };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(3).max(25),
    }),
    defineField({
      name: 'instructions',
      title: 'Instrucciones',
      type: 'array',
      group: 'instructions',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'step',
              title: 'Paso',
              type: 'number',
              validation: (rule) => rule.required().min(1),
            },
            {
              name: 'instruction',
              title: 'Instrucción',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().min(20).max(500),
            },
            {
              name: 'image',
              title: 'Imagen del paso',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Texto alternativo',
                  type: 'string',
                },
              ],
            },
            {
              name: 'tip',
              title: 'Consejo',
              type: 'string',
              description: 'Tip específico para este paso',
            },
          ],
          preview: {
            select: {
              step: 'step',
              instruction: 'instruction',
              media: 'image',
            },
            prepare({ step, instruction, media }) {
              return {
                title: `Paso ${step}`,
                subtitle: instruction?.slice(0, 60) + '...',
                media,
              };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(3).max(20),
    }),
    defineField({
      name: 'tips',
      title: 'Consejos y trucos',
      type: 'array',
      group: 'instructions',
      of: [{ type: 'string' }],
      validation: (rule) => rule.max(8),
      description: 'Consejos generales para la receta',
    }),
    defineField({
      name: 'variations',
      title: 'Variaciones',
      type: 'array',
      group: 'instructions',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Nombre de la variación',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required(),
            },
            {
              name: 'changes',
              title: 'Cambios necesarios',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'description',
            },
          },
        },
      ],
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: 'substitutions',
      title: 'Sustituciones',
      type: 'array',
      group: 'ingredients',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'original',
              title: 'Ingrediente original',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'substitute',
              title: 'Sustituto',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'ratio',
              title: 'Proporción',
              type: 'string',
              description: 'Ej: "1:1", "2:1"',
            },
            {
              name: 'notes',
              title: 'Notas',
              type: 'string',
              description: 'Diferencias en sabor o textura',
            },
          ],
          preview: {
            select: {
              original: 'original',
              substitute: 'substitute',
            },
            prepare({ original, substitute }) {
              return {
                title: `${original} → ${substitute}`,
              };
            },
          },
        },
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'nutritionalInfo',
      title: 'Información nutricional (por porción)',
      type: 'object',
      group: 'nutrition',
      fields: [
        {
          name: 'calories',
          title: 'Calorías',
          type: 'number',
          validation: (rule) => rule.min(0),
        },
        {
          name: 'protein',
          title: 'Proteínas (g)',
          type: 'number',
          validation: (rule) => rule.min(0),
        },
        {
          name: 'carbs',
          title: 'Carbohidratos (g)',
          type: 'number',
          validation: (rule) => rule.min(0),
        },
        {
          name: 'fat',
          title: 'Grasas (g)',
          type: 'number',
          validation: (rule) => rule.min(0),
        },
        {
          name: 'fiber',
          title: 'Fibra (g)',
          type: 'number',
          validation: (rule) => rule.min(0),
        },
        {
          name: 'sodium',
          title: 'Sodio (mg)',
          type: 'number',
          validation: (rule) => rule.min(0),
        },
      ],
    }),
    defineField({
      name: 'dietaryInfo',
      title: 'Información dietética',
      type: 'array',
      group: 'nutrition',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Vegetariano', value: 'vegetarian' },
          { title: 'Vegano', value: 'vegan' },
          { title: 'Sin gluten', value: 'gluten-free' },
          { title: 'Sin lactosa', value: 'lactose-free' },
          { title: 'Bajo en sodio', value: 'low-sodium' },
          { title: 'Bajo en grasa', value: 'low-fat' },
          { title: 'Keto', value: 'keto' },
        ],
        layout: 'tags',
      },
    }),
    defineField({
      name: 'relatedVenues',
      title: 'Dónde probarlo',
      type: 'array',
      group: 'basic',
      of: [
        {
          type: 'reference',
          to: [{ type: 'venue' }],
        },
      ],
      validation: (rule) => rule.max(5),
      description: 'Locales donde se puede probar este plato',
    }),
    defineField({
      name: 'relatedDishGuides',
      title: 'Guías de plato relacionadas',
      type: 'array',
      group: 'basic',
      of: [
        {
          type: 'reference',
          to: [{ type: 'dish-guide' }],
        },
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta descripción',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'seoKeywords',
      title: 'Keywords',
      type: 'array',
      group: 'seo',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (rule) => rule.max(10),
    }),
    defineField({
      name: 'stats',
      title: 'Estadísticas',
      type: 'object',
      group: 'settings',
      fields: [
        {
          name: 'views',
          title: 'Visualizaciones',
          type: 'number',
          initialValue: 0,
        },
        {
          name: 'shares',
          title: 'Compartidos',
          type: 'number',
          initialValue: 0,
        },
        {
          name: 'bookmarks',
          title: 'Guardados',
          type: 'number',
          initialValue: 0,
        },
      ],
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Última actualización',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'Destacar',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'published',
      title: 'Publicado',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      difficulty: 'difficulty',
      totalTime: 'totalTime',
      servings: 'servings',
      media: 'heroImage',
    },
    prepare({ title, difficulty, totalTime, servings, media }) {
      const difficultyEmoji = {
        facil: '🟢',
        intermedio: '🟡',
        avanzado: '🔴',
      };

      return {
        title: title || 'Receta sin título',
        subtitle: `${difficultyEmoji[difficulty as keyof typeof difficultyEmoji] || ''} ${difficulty} • ${totalTime || 0}min • ${servings} porciones`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Más reciente',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Por dificultad',
      name: 'difficultyAsc',
      by: [{ field: 'difficulty', direction: 'asc' }],
    },
    {
      title: 'Por tiempo total',
      name: 'totalTimeAsc',
      by: [{ field: 'totalTime', direction: 'asc' }],
    },
  ],
});
