import {defineType, defineField} from 'sanity'

export const photoPackage = defineType({
  name: 'photoPackage',
  title: 'Package',
  type: 'document',
  fields: [
    defineField({
      name: 'packageId',
      title: 'Package ID (used in booking links)',
      type: 'string',
      description: 'Enter a unique ID such as snapshot or spotlight. Keep it stable after publishing.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'name', title: 'Package Name', type: 'string' }),
    defineField({ name: 'price', title: 'Price ($)', type: 'number' }),
    defineField({ name: 'hours', title: 'Hours', type: 'number' }),
    defineField({ name: 'description', title: 'Short Description', type: 'string' }),
    defineField({
      name: 'features',
      title: 'Features (one per line)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'popular', title: 'Mark as Most Popular', type: 'boolean' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'price' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `$${subtitle}` }),
  },
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
