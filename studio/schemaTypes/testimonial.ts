import {defineType, defineField} from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventLabel',
      title: 'Event Label',
      description: 'e.g. "Wedding · June 2025" or "Birthday Party · Dallas"',
      type: 'string',
    }),
    defineField({
      name: 'quote',
      title: 'Testimonial',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      initialValue: 5,
      options: {
        list: [
          {title: '⭐⭐⭐⭐⭐ (5 stars)', value: 5},
          {title: '⭐⭐⭐⭐ (4 stars)', value: 4},
          {title: '⭐⭐⭐ (3 stars)', value: 3},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'photo',
      title: 'Client Photo (optional)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'featured',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order (lower = first)',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'eventLabel', media: 'photo'},
    prepare: ({title, subtitle, media}) => ({
      title: title || 'Unnamed',
      subtitle: subtitle || '',
      media,
    }),
  },
  orderings: [
    {title: 'Display Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
})
