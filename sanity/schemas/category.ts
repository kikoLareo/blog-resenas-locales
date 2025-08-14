import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  icon: () => '🏷️',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la categoría',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
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
      description: 'Breve descripción de la categoría',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          { title: 'Rojo', value: 'red' },
          { title: 'Azul', value: 'blue' },
          { title: 'Verde', value: 'green' },
          { title: 'Amarillo', value: 'yellow' },
          { title: 'Púrpura', value: 'purple' },
          { title: 'Rosa', value: 'pink' },
          { title: 'Índigo', value: 'indigo' },
          { title: 'Gris', value: 'gray' },
        ],
        layout: 'radio',
      },
      initialValue: 'blue',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      color: 'color',
    },
    prepare({ title, description, color }) {
      return {
        title,
        subtitle: description || 'Sin descripción',
        media: () => (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: `var(--${color}-500, #3b82f6)`,
              borderRadius: '4px',
            }}
          />
        ),
      };
    },
  },
});
