import { CaseIcon } from '@sanity/icons/Case';
import { CogIcon } from '@sanity/icons/Cog';
import { ComposeIcon } from '@sanity/icons/Compose';
import { DocumentIcon } from '@sanity/icons/Document';
import { FolderIcon } from '@sanity/icons/Folder';
import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { HomeIcon } from '@sanity/icons/Home';
import { CommentIcon } from '@sanity/icons/Comment';
import { UsersIcon } from '@sanity/icons/Users';
import { map } from 'rxjs';
import type { StructureResolver } from 'sanity/structure';
import { CreateEnglishPane } from './components/CreateEnglishPane';

const HIDDEN_FROM_FALLBACK = [
  'siteSettings',
  'navigation',
  'footer',
  'redirect',
  'navLink',
  'navGroup',
  'navBarItem',
  'homePage',
  'aboutPage',
  'industry',
  'industriesIndex',
  'servicesIndex',
  'blogIndex',
  'casesIndex',
  'legalPage',
  'legalSection',
  'legalSubsection',
  'legalParagraph',
  'legalBullets',
  'legalTerms',
  'legalLines',
  'service',
  'caseStudy',
  'post',
  'author',
  'person',
  'faq',
  'testimonial',
  'landingPage',
  'contactPage',
  'calendarPage',
  'sitePage',
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
  'homeHero',
  'homePillars',
  'homeServices',
  'homeIndustries',
  'homeStories',
  'homeProcess',
  'homeMetrics',
  'homeTeam',
  'homeFaq',
  'homeCta',
  'serviceHero',
  'serviceOverview',
  'serviceFocus',
  'servicePitch',
  'serviceWhy',
  'servicePlans',
  'serviceIndustries',
  'serviceProcess',
  'serviceCases',
  'serviceFaq',
  'serviceCta',
  'caseHero',
  'caseContext',
  'caseProcess',
  'caseMetrics',
  'caseTestimonial',
  'caseRelated',
  'caseCta',
  'industryHero',
  'industryWhy',
  'industryServices',
  'industryCases',
  'industryFaq',
  'industryCta',
  'aboutHero',
  'aboutHistory',
  'aboutPillars',
  'aboutProcess',
  'aboutTeam',
  'aboutMap',
  'aboutCta',
  'serviceFocusItem',
  'serviceWhyCard',
  'serviceIndustryItem',
  'serviceProcessStep',
];

type LocaleDoc = {
  _id: string;
  nombre: string;
  slug: string;
  orden: number;
  locale: string;
  role?: string;
};

function createMenu(
  S: Parameters<StructureResolver>[0],
  schemaType: 'service' | 'industry',
) {
  const title = schemaType === 'service' ? 'Nuevo servicio' : 'Nueva industria';
  return [
    S.menuItem()
      .title(title)
      .intent({ type: 'create', params: { type: schemaType, template: `${schemaType}-es` } }),
  ];
}

function postList(S: Parameters<StructureResolver>[0], locale: 'es' | 'en') {
  const english = locale === 'en';
  return S.documentTypeList('post')
    .title(english ? 'English' : 'Español')
    .filter(
      english
        ? '_type == "post" && locale == "en"'
        : '_type == "post" && coalesce(locale, "es") == "es"',
    )
    .defaultOrdering([{ field: 'fecha', direction: 'desc' }])
    .initialValueTemplates([S.initialValueTemplateItem(english ? 'post-en' : 'post-es')]);
}

function languageItems(
  S: Parameters<StructureResolver>[0],
  schemaType: string,
  esId?: string,
  enId?: string,
) {
  const englishId = enId || (esId ? `${esId}-en` : '');
  const canCreateEnglish = (schemaType === 'service' || schemaType === 'industry') && Boolean(esId) && !enId;
  return [
    esId
      ? S.listItem()
          .title('Español')
          .id(`${schemaType}-${esId}-es`)
          .child(S.document().schemaType(schemaType).documentId(esId).title('Español'))
      : null,
    englishId && (enId || canCreateEnglish)
      ? S.listItem()
          .title('English')
          .id(`${schemaType}-${englishId}-en`)
          .child(
            enId
              ? S.document().schemaType(schemaType).documentId(enId).title('English')
              : S.component(CreateEnglishPane)
                  .id(`${schemaType}-${englishId}-create`)
                  .title('English')
                  .options({ schemaType, esId }),
          )
      : null,
  ].filter((item) => item !== null);
}

const PAIR_QUERY = /* groq */ `*[_type == $type]{
  _id,
  nombre,
  "slug": coalesce(slug.current, _id),
  orden,
  "locale": coalesce(locale, "es")
}`;

type Pair = {
  key: string;
  slug: string;
  nombre: string;
  orden: number;
  role?: string;
  esId?: string;
  enId?: string;
};

function groupPairs(rows: LocaleDoc[] | null) {
  const byKey = new Map<string, Pair>();
  for (const row of rows ?? []) {
    const id = row._id.replace(/^drafts\./, '');
    const key = row.locale === 'en' && id.endsWith('-en') ? id.slice(0, -3) : id;
    const current = byKey.get(key) ?? {
      key,
      slug: row.slug,
      nombre: row.nombre || 'Sin nombre',
      orden: row.orden ?? 0,
      role: row.role,
    };
    if (row.locale === 'en') {
      current.enId = id;
      current.role = current.role || row.role;
    } else {
      current.esId = id;
      current.nombre = row.nombre || current.nombre;
      current.orden = row.orden ?? 0;
      current.slug = row.slug;
      current.role = row.role || current.role;
    }
    byKey.set(key, current);
  }
  return [...byKey.values()].sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
}

function catalogIndex(
  S: Parameters<StructureResolver>[0],
  schemaType: 'industriesIndex' | 'servicesIndex',
) {
  const esId = schemaType === 'industriesIndex' ? 'industriesIndex' : 'servicesIndex';
  const paneId = schemaType === 'industriesIndex' ? 'industries-index' : 'services-index';
  return S.listItem()
    .title('Índice')
    .id(paneId)
    .child(
      S.list()
        .title('Índice')
        .items([
          S.listItem()
            .title('Español')
            .id(`${paneId}-es`)
            .child(S.document().schemaType(schemaType).documentId(esId).title('Español')),
          S.listItem()
            .title('English')
            .id(`${paneId}-en`)
            .child(S.document().schemaType(schemaType).documentId(`${esId}-en`).title('English')),
        ]),
    );
}

function catalogList(
  S: Parameters<StructureResolver>[0],
  context: Parameters<StructureResolver>[1],
  schemaType: 'service' | 'industry',
) {
  const title = schemaType === 'service' ? 'Servicios' : 'Industrias';
  const indexType = schemaType === 'service' ? 'servicesIndex' : 'industriesIndex';
  return context.documentStore
    .listenQuery<LocaleDoc[]>(PAIR_QUERY, { type: schemaType }, { apiVersion: '2024-01-01', perspective: 'raw' })
    .pipe(
      map((rows) =>
        S.list()
          .title(title)
          .menuItems(createMenu(S, schemaType))
          .items([
            catalogIndex(S, indexType),
            ...groupPairs(rows).map((page) =>
              S.listItem()
                .title(page.nombre)
                .id(`${schemaType}-pair-${page.key}`)
                .child(
                  S.list()
                    .title(page.nombre)
                    .items(languageItems(S, schemaType, page.esId, page.enId)),
                ),
            ),
          ]),
      ),
    );
}

const CASE_QUERY = /* groq */ `*[_type == "caseStudy"]{
  _id,
  "nombre": coalesce(cliente, titulo, "Sin nombre"),
  "slug": coalesce(slug.current, _id),
  "orden": 0,
  "locale": coalesce(locale, "es")
}`;

function caseList(S: Parameters<StructureResolver>[0], context: Parameters<StructureResolver>[1]) {
  return context.documentStore
    .listenQuery<LocaleDoc[]>(CASE_QUERY, {}, { apiVersion: '2024-01-01', perspective: 'raw' })
    .pipe(
      map((rows) =>
        S.list()
          .title('Casos')
          .menuItems([
            S.menuItem()
              .title('Nuevo caso')
              .intent({ type: 'create', params: { type: 'caseStudy', template: 'case-es' } }),
          ])
          .items([
            S.listItem()
              .title('Índice')
              .id('cases-index')
              .child(
                S.list()
                  .title('Índice')
                  .items([
                    S.listItem()
                      .title('Español')
                      .id('cases-index-es')
                      .child(S.document().schemaType('casesIndex').documentId('casesIndex').title('Español')),
                    S.listItem()
                      .title('English')
                      .id('cases-index-en')
                      .child(S.document().schemaType('casesIndex').documentId('casesIndex-en').title('English')),
                  ]),
              ),
            ...groupPairs(rows).map((page) =>
              S.listItem()
                .title(page.nombre)
                .id(`case-pair-${page.key}`)
                .child(
                  S.list()
                    .title(page.nombre)
                    .items(languageItems(S, 'caseStudy', page.esId, page.enId)),
                ),
            ),
          ]),
      ),
    );
}

function pairedDocuments(
  S: Parameters<StructureResolver>[0],
  context: Parameters<StructureResolver>[1],
  options: {
    title: string;
    schemaType: string;
    query: string;
    idPrefix: string;
    menuItems?: ReturnType<Parameters<StructureResolver>[0]['menuItem']>[];
    leading?: ReturnType<Parameters<StructureResolver>[0]['listItem']>[];
  },
) {
  return context.documentStore
    .listenQuery<LocaleDoc[]>(options.query, {}, { apiVersion: '2024-01-01', perspective: 'raw' })
    .pipe(
      map((rows) =>
        S.list()
          .title(options.title)
          .menuItems(options.menuItems ?? [])
          .items([
            ...(options.leading ?? []),
            ...groupPairs(rows).map((page) => {
              const title =
                options.schemaType === 'testimonial' && page.role?.trim()
                  ? `${page.nombre} · ${page.role.trim()}`
                  : page.nombre;
              const onlyId = page.esId && !page.enId ? page.esId : page.enId && !page.esId ? page.enId : '';
              return S.listItem()
                .title(title)
                .id(`${options.idPrefix}-${page.key}`)
                .child(
                  onlyId
                    ? S.document().schemaType(options.schemaType).documentId(onlyId).title(title)
                    : S.list()
                        .title(title)
                        .items(languageItems(S, options.schemaType, page.esId, page.enId)),
                );
            }),
          ]),
      ),
    );
}

const LANDING_QUERY = /* groq */ `*[_type == "landingPage"]{
  _id,
  "nombre": coalesce(title, "Sin nombre"),
  "slug": coalesce(slug.current, _id),
  "orden": 0,
  "locale": coalesce(locale, "es")
}`;

const TESTIMONIAL_QUERY = /* groq */ `*[_type == "testimonial"]{
  _id,
  "nombre": coalesce(name, "Sin nombre") + " · " + coalesce(client, "Sin cliente"),
  role,
  "slug": _id,
  "orden": 0,
  "locale": coalesce(locale, "es")
}`;

const PERSON_QUERY = /* groq */ `*[_type == "person"]{
  _id,
  "nombre": coalesce(name, "Sin nombre"),
  "slug": _id,
  "orden": coalesce(orden, 0),
  "locale": coalesce(locale, "es")
}`;

export const structure: StructureResolver = (S, context) => {

  return S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Sitio')
        .id('sitio')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Sitio')
            .items([
              S.listItem()
                .title('Ajustes')
                .id('site-settings')
                .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Ajustes del sitio')),
              S.listItem()
                .title('Redirecciones')
                .id('redirects')
                .child(S.documentTypeList('redirect').title('Redirecciones')),
            ]),
        ),
      S.listItem()
        .title('Navbar')
        .id('navbar')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Navbar')
            .items([
              S.listItem()
                .title('Español')
                .id('navbar-es')
                .child(S.document().schemaType('navigation').documentId('navigation').title('Español')),
              S.listItem()
                .title('English')
                .id('navbar-en')
                .child(S.document().schemaType('navigation').documentId('navigation-en').title('English')),
            ]),
        ),
      S.listItem()
        .title('Footer')
        .id('footer')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Footer')
            .items([
              S.listItem()
                .title('Español')
                .id('footer-es')
                .child(S.document().schemaType('footer').documentId('footer').title('Español')),
              S.listItem()
                .title('English')
                .id('footer-en')
                .child(S.document().schemaType('footer').documentId('footer-en').title('English')),
            ]),
        ),
      S.listItem()
        .title('Home')
        .id('home')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Home')
            .items([
              S.listItem()
                .title('Español')
                .id('home-es')
                .child(S.document().schemaType('homePage').documentId('homePage').title('Español')),
              S.listItem()
                .title('English')
                .id('home-en')
                .child(S.document().schemaType('homePage').documentId('homePage-en').title('English')),
            ]),
        ),
      S.listItem()
        .title('Nosotros')
        .id('nosotros')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Nosotros')
            .items([
              S.listItem()
                .title('Español')
                .id('nosotros-es')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('Español')),
              S.listItem()
                .title('English')
                .id('nosotros-en')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage-en').title('English')),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Industrias')
        .id('industrias')
        .icon(CaseIcon)
        .child(() => catalogList(S, context, 'industry')),
      S.listItem()
        .title('Servicios')
        .id('servicios')
        .icon(CaseIcon)
        .child(() => catalogList(S, context, 'service')),
      S.listItem()
        .title('Casos')
        .id('casos')
        .icon(CaseIcon)
        .child(() => caseList(S, context)),
      S.divider(),
      S.listItem()
        .title('Páginas')
        .id('paginas')
        .icon(DocumentIcon)
        .child(() =>
          pairedDocuments(S, context, {
            title: 'Páginas',
            schemaType: 'landingPage',
            query: LANDING_QUERY,
            idPrefix: 'landing-pair',
            menuItems: [
              S.menuItem()
                .title('Nueva página — Servicio lite')
                .intent({ type: 'create', params: { type: 'landingPage', template: 'landing-serviceLite' } }),
              S.menuItem()
                .title('Nueva página — Industria lite')
                .intent({ type: 'create', params: { type: 'landingPage', template: 'landing-industryLite' } }),
              S.menuItem()
                .title('Nueva página — Campaña / CTA')
                .intent({ type: 'create', params: { type: 'landingPage', template: 'landing-campaign' } }),
            ],
            leading: [
              S.listItem()
                .title('Contacto')
                .id('contacto-pair')
                .child(
                  S.list()
                    .title('Contacto')
                    .items(languageItems(S, 'contactPage', 'contactPage', 'contactPage-en')),
                ),
              S.listItem()
                .title('Términos y condiciones')
                .id('legal-terms-pair')
                .child(
                  S.list()
                    .title('Términos y condiciones')
                    .items(languageItems(S, 'legalPage', 'legal-terms', 'legal-terms-en')),
                ),
              S.listItem()
                .title('Aviso de privacidad')
                .id('legal-privacy-pair')
                .child(
                  S.list()
                    .title('Aviso de privacidad')
                    .items(languageItems(S, 'legalPage', 'legal-privacy', 'legal-privacy-en')),
                ),
              S.listItem()
                .title('Calendario')
                .id('calendario-pair')
                .child(
                  S.list()
                    .title('Calendario')
                    .items(languageItems(S, 'calendarPage', 'calendarPage', 'calendarPage-en')),
                ),
              S.listItem()
                .title('Diagnóstico de marketing digital')
                .id('page-diagnostico')
                .child(
                  S.document().schemaType('sitePage').documentId('page-diagnostico').title('Diagnóstico de marketing digital'),
                ),
            ],
          }),
        ),
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
              S.listItem()
                .title('Testimonios')
                .id('testimonials')
                .icon(CommentIcon)
                .child(() =>
                  pairedDocuments(S, context, {
                    title: 'Testimonios',
                    schemaType: 'testimonial',
                    query: TESTIMONIAL_QUERY,
                    idPrefix: 'testimonial-pair',
                    menuItems: [
                      S.menuItem()
                        .title('Nuevo testimonio')
                        .intent({ type: 'create', params: { type: 'testimonial', template: 'testimonial-es' } }),
                    ],
                  }),
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
                .title('Índice')
                .id('blog-index')
                .child(
                  S.list()
                    .title('Índice')
                    .items([
                      S.listItem()
                        .title('Español')
                        .id('blog-index-es')
                        .child(S.document().schemaType('blogIndex').documentId('blogIndex').title('Español')),
                      S.listItem()
                        .title('English')
                        .id('blog-index-en')
                        .child(S.document().schemaType('blogIndex').documentId('blogIndex-en').title('English')),
                    ]),
                ),
              S.listItem()
                .title('Español')
                .id('posts-es')
                .child(postList(S, 'es')),
              S.listItem()
                .title('English')
                .id('posts-en')
                .child(postList(S, 'en')),
              S.listItem().title('Autores').id('authors').child(S.documentTypeList('author').title('Autores')),
            ]),
        ),
      S.listItem()
        .title('Equipo')
        .id('equipo')
        .icon(UsersIcon)
        .child(() =>
          pairedDocuments(S, context, {
            title: 'Equipo',
            schemaType: 'person',
            query: PERSON_QUERY,
            idPrefix: 'person-pair',
            menuItems: [
              S.menuItem()
                .title('Nueva persona')
                .intent({ type: 'create', params: { type: 'person', template: 'person-es' } }),
            ],
          }),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !HIDDEN_FROM_FALLBACK.includes(item.getId() ?? '')),
    ]);
};
