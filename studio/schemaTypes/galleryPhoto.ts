import {defineType, defineField} from 'sanity'

export const galleryPhoto = defineType({
  name: 'galleryPhoto',
  title: 'Gallery Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Wedding', value: 'Wedding' },
          { title: 'Birthday', value: 'Birthday' },
          { title: 'Corporate', value: 'Corporate' },
          { title: 'Party', value: 'Party' },
          { title: 'General', value: 'General' },
        ],
        layout: 'radio',
      },
      initialValue: 'General',
    }),
    defineField({
      name: 'order',
      title: 'Display Order (lower = first)',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'caption', subtitle: 'category', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({
      title: title || 'Untitled',
      subtitle,
      media,
    }),
  },
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
