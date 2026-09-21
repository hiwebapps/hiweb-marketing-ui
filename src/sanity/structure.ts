import { CaseIcon } from '@sanity/icons/Case';
import { CogIcon } from '@sanity/icons/Cog';
import { ComposeIcon } from '@sanity/icons/Compose';
import { DocumentIcon } from '@sanity/icons/Document';
import { FolderIcon } from '@sanity/icons/Folder';
import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { HomeIcon } from '@sanity/icons/Home';
import { UsersIcon } from '@sanity/icons/Users';
import type { StructureResolver } from 'sanity/structure';

const HIDDEN_FROM_FALLBACK = [
  'siteSettings',
  'homePage',
  'aboutPage',
  'industry',
  'service',
  'caseStudy',
  'post',
  'author',
  'person',
  'faq',
  'landingPage',
  'faqItem',
  'titledBlock',
  'processStep',
  'metric',
  'cta',
  'faqCategory',
  'serviceBlurb',
  'pageHero',
  'pillarGrid',
  'serviceGrid',
  'industryGrid',
  'processPhases',
  'caseStories',
  'casePreview',
  'faqSection',
  'finalCta',
  'teamGrid',
  'metricsBand',
  'presenceMap',
  'homeServiceItem',
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Sitio')
        .id('sitio')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Ajustes del sitio')),
      S.listItem()
        .title('Home')
        .id('home')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Home')),
      S.listItem()
        .title('Nosotros')
        .id('nosotros')
        .icon(UsersIcon)
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('Nosotros')),
      S.divider(),
      S.listItem()
        .title('Industrias')
        .id('industrias')
        .icon(CaseIcon)
        .child(S.documentTypeList('industry').title('Industrias').defaultOrdering([{ field: 'orden', direction: 'asc' }])),
      S.listItem()
        .title('Servicios')
        .id('servicios')
        .icon(CaseIcon)
        .child(S.documentTypeList('service').title('Servicios').defaultOrdering([{ field: 'orden', direction: 'asc' }])),
      S.listItem()
        .title('Casos')
        .id('casos')
        .icon(CaseIcon)
        .child(S.documentTypeList('caseStudy').title('Casos')),
      S.divider(),
      S.listItem()
        .title('Páginas')
        .id('paginas')
        .icon(DocumentIcon)
        .child(S.documentTypeList('landingPage').title('Páginas')),
      S.listItem()
        .title('Biblioteca')
        .id('biblioteca')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Biblioteca')
            .items([
              S.listItem()
                .title('FAQs')
                .id('faqs')
                .icon(HelpCircleIcon)
                .child(
                  S.documentTypeList('faq')
                    .title('FAQs')
                    .defaultOrdering([{ field: 'orden', direction: 'asc' }]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Blog')
        .id('blog')
        .icon(ComposeIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Artículos')
                .id('posts')
                .child(
                  S.documentTypeList('post')
                    .title('Artículos')
                    .defaultOrdering([{ field: 'fecha', direction: 'desc' }]),
                ),
              S.listItem().title('Autores').id('authors').child(S.documentTypeList('author').title('Autores')),
            ]),
        ),
      S.listItem()
        .title('Equipo')
        .id('equipo')
        .icon(UsersIcon)
        .child(S.documentTypeList('person').title('Equipo').defaultOrdering([{ field: 'orden', direction: 'asc' }])),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !HIDDEN_FROM_FALLBACK.includes(item.getId() ?? '')),
    ]);
