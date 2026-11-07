import {defineType, defineField} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subtext', title: 'Subtext', type: 'text', rows: 3 }),
        defineField({ name: 'stat1Value', title: 'Stat 1 Value (e.g. 500+)', type: 'string' }),
        defineField({ name: 'stat1Label', title: 'Stat 1 Label (e.g. Events Captured)', type: 'string' }),
        defineField({ name: 'stat2Value', title: 'Stat 2 Value', type: 'string' }),
        defineField({ name: 'stat2Label', title: 'Stat 2 Label', type: 'string' }),
        defineField({ name: 'stat3Value', title: 'Stat 3 Value', type: 'string' }),
        defineField({ name: 'stat3Label', title: 'Stat 3 Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'paragraph1', title: 'Paragraph 1', type: 'text', rows: 4 }),
        defineField({ name: 'paragraph2', title: 'Paragraph 2', type: 'text', rows: 4 }),
        defineField({ name: 'paragraph3', title: 'Paragraph 3', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'features',
      title: 'Why Choose Us (Feature Cards)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'icon', title: 'Emoji Icon', type: 'string' }),
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
        ],
        preview: { select: { title: 'title', subtitle: 'icon' } },
      }],
    }),
    defineField({
      name: 'howItWorks',
      title: 'How It Works Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'step', title: 'Step Number (e.g. 01)', type: 'string' }),
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
        ],
        preview: { select: { title: 'title', subtitle: 'step' } },
      }],
    }),
    defineField({
      name: 'cta',
      title: 'Bottom Call-to-Action',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'subtext', title: 'Subtext', type: 'text', rows: 2 }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})
