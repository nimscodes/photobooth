import {defineType, defineField} from 'sanity'

export const photoAddOn = defineType({
  name: 'photoAddOn',
  title: 'Add-On / Enhancement',
  type: 'document',
  fields: [
    defineField({
      name: 'addOnId',
      title: 'Add-On ID (used by booking forms)',
      type: 'string',
      description: 'Enter a unique ID such as extra-hour or custom-overlay. Keep it stable after publishing.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'name', title: 'Add-On Name', type: 'string' }),
    defineField({ name: 'price', title: 'Price ($)', type: 'number' }),
    defineField({ name: 'description', title: 'Short Description (optional)', type: 'string' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
    defineField({ name: 'image', title: 'Add-On Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'featured', title: 'Most Requested', type: 'boolean' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'price' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `+$${subtitle}` }),
  },
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
