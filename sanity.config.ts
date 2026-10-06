import { createElement } from 'react';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { completeLandingTemplate } from './src/sanity/actions/completeLandingTemplate';
import { createEnglishVersion } from './src/sanity/actions/createEnglishVersion';
import { ensureEnglishPair } from './src/sanity/actions/ensureEnglishPair';
import { createRedirect } from './src/sanity/actions/createRedirect';
import { keywordBadge, seoChecklistBadge } from './src/sanity/badges/seoBadges';
import { translationBadge, wordsBadge } from './src/sanity/badges/postBadges';
import { PostSeoView } from './src/sanity/components/PostSeoView';
import { ViewStagingButton } from './src/sanity/components/ViewStagingButton';
import { resolve } from './src/sanity/presentation/resolve';
import { SiteNavigator } from './src/sanity/presentation/SiteNavigator';
import { landingTemplateSections, type LandingTemplateKind } from './src/sanity/landingTemplate';
import { schemaTypes } from './src/sanity/schemas';
import { industryStarter, serviceStarter } from './src/sanity/starters';
import { structure } from './src/sanity/structure';
import { blogsTool } from './src/sanity/tools/blogsTool';
import { guideTool } from './src/sanity/tools/guideTool';
import { imageGalleryTool } from './src/sanity/tools/imageGalleryTool';
import { seoTool } from './src/sanity/tools/seoTool';

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  'fxardjr1';

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  'web-2026';

const STAGING_ORIGIN = 'https://staging.hiweb.com.mx';
const STAGING_WORKERS_ORIGIN = 'https://hiweb-marketing-ui-staging.hiwebapps.workers.dev';

function previewOrigin() {
  const fromEnv = process.env.SANITY_STUDIO_PREVIEW_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return STAGING_ORIGIN;
}

export default defineConfig({
  name: 'hiweb-web',
  __internal_tasks: {
    footerAction: createElement(ViewStagingButton),
  },
  title: 'Hiweb Web 2026',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure,
      defaultDocumentNode: (S, { schemaType }) => {
        if (schemaType !== 'post') return S.document().views([S.view.form()]);
        return S.document().views([
          S.view.form(),
          S.view.component(PostSeoView).title('SEO'),
        ]);
      },
    }),
    presentationTool({
      resolve,
      allowOrigins: [
        STAGING_ORIGIN,
        STAGING_WORKERS_ORIGIN,
        'http://localhost:4321',
        'http://127.0.0.1:4321',
      ],
      previewUrl: {
        initial: previewOrigin(),
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      components: {
        unstable_navigator: {
          minWidth: 240,
          maxWidth: 360,
          component: SiteNavigator,
        },
      },
    }),
    visionTool({ defaultApiVersion: '2026-09-18' }),
  ],
  tools: (prev) => {
    const order = ['guia', 'structure', 'blogs', 'seo', 'presentation', 'galeria', 'vision'];
    const tools = [...prev, guideTool(), blogsTool(), seoTool(), imageGalleryTool()];
    return tools.sort((a, b) => {
      const left = order.indexOf(a.name);
      const right = order.indexOf(b.name);
      return (left === -1 ? order.length : left) - (right === -1 ? order.length : right);
    });
  },
  document: {
    badges: (prev, context) => {
      const withChecklist = [...prev, seoChecklistBadge];
      return context.schemaType === 'post'
        ? [...withChecklist, translationBadge, wordsBadge, keywordBadge]
        : withChecklist;
    },
    actions: (prev, context) => {
      const withTemplate =
        context.schemaType === 'landingPage'
          ? [...prev, completeLandingTemplate]
          : context.schemaType === 'post'
            ? [...prev, createEnglishVersion]
            : prev;
      const withPair =
        context.schemaType === 'service' ||
        context.schemaType === 'industry' ||
        context.schemaType === 'caseStudy' ||
        context.schemaType === 'landingPage' ||
        context.schemaType === 'testimonial' ||
        context.schemaType === 'person' ||
        context.schemaType === 'contactPage' ||
        context.schemaType === 'calendarPage'
          ? [ensureEnglishPair, ...withTemplate]
          : withTemplate;
      return ['post', 'service', 'industry', 'caseStudy', 'landingPage'].includes(context.schemaType)
        ? [...withPair, createRedirect]
        : withPair;
    },
  },
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter(
        (template) =>
          template.schemaType !== 'landingPage' &&
          template.schemaType !== 'service' &&
          template.schemaType !== 'industry' &&
          template.schemaType !== 'caseStudy' &&
          template.schemaType !== 'testimonial' &&
          template.schemaType !== 'person',
      ),
      {
        id: 'service-es',
        title: 'Servicio en español',
        schemaType: 'service',
        value: serviceStarter('es'),
      },
      {
        id: 'service-en',
        title: 'Servicio en inglés',
        schemaType: 'service',
        value: serviceStarter('en'),
      },
      {
        id: 'industry-es',
        title: 'Industria en español',
        schemaType: 'industry',
        value: industryStarter('es'),
      },
      {
        id: 'industry-en',
        title: 'Industria en inglés',
        schemaType: 'industry',
        value: industryStarter('en'),
      },
      {
        id: 'case-es',
        title: 'Caso en español',
        schemaType: 'caseStudy',
        value: { locale: 'es' },
      },
      {
        id: 'testimonial-es',
        title: 'Testimonio en español',
        schemaType: 'testimonial',
        value: { locale: 'es' },
      },
      {
        id: 'person-es',
        title: 'Persona en español',
        schemaType: 'person',
        value: { locale: 'es' },
      },
      {
        id: 'post-es',
        title: 'Artículo en español',
        schemaType: 'post',
        value: { locale: 'es' },
      },
      {
        id: 'post-en',
        title: 'Artículo en inglés',
        schemaType: 'post',
        value: { locale: 'en' },
      },
      ...(['serviceLite', 'industryLite', 'campaign'] as const).map((kind: LandingTemplateKind) => ({
        id: `landing-${kind}`,
        title:
          kind === 'serviceLite'
            ? 'Página — Servicio lite'
            : kind === 'industryLite'
              ? 'Página — Industria lite'
              : 'Página — Campaña / CTA',
        schemaType: 'landingPage',
        value: () => ({
          locale: 'es',
          templateKind: kind,
          sections: landingTemplateSections(kind),
        }),
      })),
    ],
  },
});
