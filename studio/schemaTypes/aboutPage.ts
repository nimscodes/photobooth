import {defineType, defineField} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow Text (small label above heading)', type: 'string' }),
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'subtext', title: 'Subtext', type: 'text', rows: 2 }),
      ],
    }),
    defineField({
      name: 'whoWeAre',
      title: 'Who We Are Section',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'paragraph1', title: 'Paragraph 1', type: 'text', rows: 3 }),
        defineField({ name: 'paragraph2', title: 'Paragraph 2', type: 'text', rows: 3 }),
        defineField({ name: 'paragraph3', title: 'Paragraph 3', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Stats (shown beside Who We Are)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'value', title: 'Value (e.g. 500+)', type: 'string' }),
          defineField({ name: 'label', title: 'Label (e.g. Events Served)', type: 'string' }),
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      }],
    }),
    defineField({
      name: 'values',
      title: 'Our Values',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Value Title', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),
    defineField({
      name: 'cta',
      title: 'Call-to-Action Section',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'subtext', title: 'Subtext', type: 'string' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
})
