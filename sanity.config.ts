import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { completeLandingTemplate } from './src/sanity/actions/completeLandingTemplate';
import { landingTemplateSections, type LandingTemplateKind } from './src/sanity/landingTemplate';
import { schemaTypes } from './src/sanity/schemas';
import { industryStarter, serviceStarter } from './src/sanity/starters';
import { structure } from './src/sanity/structure';

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  'fxardjr1';

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  'web-2026';

export default defineConfig({
  name: 'hiweb-web',
  title: 'Hiweb Web 2026',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2026-09-18' }),
  ],
  document: {
    actions: (prev, context) =>
      context.schemaType === 'landingPage' ? [...prev, completeLandingTemplate] : prev,
  },
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter(
        (template) =>
          template.schemaType !== 'landingPage' &&
          template.schemaType !== 'service' &&
          template.schemaType !== 'industry',
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
          templateKind: kind,
          sections: landingTemplateSections(kind),
        }),
      })),
    ],
  },
});
