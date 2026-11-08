import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Elite Event Images',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'nt42z7dh',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('🏠 Home Page')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('📖 About Page')
              .id('aboutPage')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('⚙️ Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('photoPackage').title('📦 Packages & Pricing'),
            S.documentTypeListItem('photoAddOn').title('✨ Add-Ons / Enhancements'),
            S.divider(),
            S.documentTypeListItem('galleryPhoto').title('🖼️ Gallery Photos'),
            S.divider(),
            S.documentTypeListItem('testimonial').title('⭐ Testimonials'),
            S.divider(),
            S.documentTypeListItem('faqItem').title('❓ FAQ Items'),
          ]),
    }),
  ],
  schema: {types: schemaTypes},
})
