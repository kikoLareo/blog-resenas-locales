import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  icon: () => '🏷️',
  groups: [
    {
      name: 'basic',
      title: 'Información básica',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'display',
      title: 'Visualización',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la categoría',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(2).max(50),
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
      validation: (rule) => rule.required().min(50).max(200),
      description: 'Descripción de la categoría para SEO y visualización (50-200 caracteres)',
    }),
    defineField({
      name: 'schemaType',
      title: 'Tipo Schema.org',
      type: 'string',
      group: 'seo',
      options: {
        list: [
          { title: 'Restaurante', value: 'Restaurant' },
          { title: 'Cafetería', value: 'CafeOrCoffeeShop' },
          { title: 'Bar/Pub', value: 'BarOrPub' },
          { title: 'Comida rápida', value: 'FastFoodRestaurant' },
          { title: 'Pizzería', value: 'Restaurant' },
          { title: 'Panadería', value: 'Bakery' },
          { title: 'Heladería', value: 'IceCreamShop' },
          { title: 'Negocio local', value: 'LocalBusiness' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'Restaurant',
      description: 'Tipo de negocio según Schema.org para JSON-LD',
    }),
    defineField({
      name: 'cuisineType',
      title: 'Tipo de cocina',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'basic',
      options: {
        list: [
          { title: 'Española', value: 'spanish' },
          { title: 'Italiana', value: 'italian' },
          { title: 'Francesa', value: 'french' },
          { title: 'Asiática', value: 'asian' },
          { title: 'Japonesa', value: 'japanese' },
          { title: 'China', value: 'chinese' },
          { title: 'India', value: 'indian' },
          { title: 'Mexicana', value: 'mexican' },
          { title: 'Americana', value: 'american' },
          { title: 'Mediterránea', value: 'mediterranean' },
          { title: 'Vegetariana', value: 'vegetarian' },
          { title: 'Vegana', value: 'vegan' },
          { title: 'Fusión', value: 'fusion' },
          { title: 'Internacional', value: 'international' },
        ],
        layout: 'checkboxes',
      },
      validation: (rule) => rule.max(3),
      description: 'Tipos de cocina asociados a esta categoría (máximo 3)',
    }),
    defineField({
      name: 'priceRangeTypical',
      title: 'Rango de precios típico',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Económico (€)', value: '€' },
          { title: 'Moderado (€€)', value: '€€' },
          { title: 'Caro (€€€)', value: '€€€' },
          { title: 'Muy caro (€€€€)', value: '€€€€' },
          { title: 'Variado', value: 'mixed' },
        ],
        layout: 'radio',
      },
      description: 'Rango de precios típico para esta categoría',
    }),
    defineField({
      name: 'icon',
      title: 'Icono',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: '🍽️ Restaurante', value: '🍽️' },
          { title: '☕ Café', value: '☕' },
          { title: '🍺 Bar', value: '🍺' },
          { title: '🍕 Pizza', value: '🍕' },
          { title: '🍔 Comida rápida', value: '🍔' },
          { title: '🥘 Cocina casera', value: '🥘' },
          { title: '🍜 Asiática', value: '🍜' },
          { title: '🥖 Panadería', value: '🥖' },
          { title: '🍦 Heladería', value: '🍦' },
          { title: '🥗 Saludable', value: '🥗' },
          { title: '🍷 Bodega', value: '🍷' },
          { title: '🎂 Pastelería', value: '🎂' },
        ],
        layout: 'radio',
      },
      initialValue: '🍽️',
      description: 'Emoji representativo de la categoría',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Rojo', value: 'red' },
          { title: 'Azul', value: 'blue' },
          { title: 'Verde', value: 'green' },
          { title: 'Amarillo', value: 'yellow' },
          { title: 'Púrpura', value: 'purple' },
          { title: 'Rosa', value: 'pink' },
          { title: 'Índigo', value: 'indigo' },
          { title: 'Naranja', value: 'orange' },
          { title: 'Gris', value: 'gray' },
          { title: 'Turquesa', value: 'teal' },
        ],
        layout: 'radio',
      },
      initialValue: 'blue',
      description: 'Color para la visualización de la categoría',
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen representativa',
      type: 'image',
      group: 'display',
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
        {
          name: 'caption',
          title: 'Pie de foto',
          type: 'string',
        },
      ],
      description: 'Imagen para usar en páginas de categoría',
    }),
    defineField({
      name: 'featured',
      title: 'Categoría destacada',
      type: 'boolean',
      group: 'display',
      initialValue: false,
      description: 'Mostrar como categoría destacada en homepage',
    }),
    defineField({
      name: 'order',
      title: 'Orden de visualización',
      type: 'number',
      group: 'display',
      validation: (rule) => rule.min(0).integer(),
      description: 'Orden para mostrar las categorías (menor número = primero)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      color: 'color',
      icon: 'icon',
      featured: 'featured',
      priceRange: 'priceRangeTypical',
      media: 'heroImage',
    },
    prepare({ title, description, color, icon, featured, priceRange, media }) {
      const badges = [];
      if (featured) badges.push('⭐');
      if (priceRange) badges.push(priceRange);
      
      return {
        title: `${icon || '🏷️'} ${title}${badges.length ? ' ' + badges.join(' ') : ''}`,
        subtitle: description || 'Sin descripción',
        media: media || (() => (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: `var(--${color}-500, #3b82f6)`,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            {icon || '🏷️'}
          </div>
        )),
      };
    },
  },
  orderings: [
    {
      title: 'Orden personalizado',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Destacadas primero',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Nombre A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
