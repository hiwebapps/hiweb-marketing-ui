export type LandingTemplateKind = 'serviceLite' | 'industryLite' | 'campaign';

export const LANDING_TEMPLATE_TYPES: Record<LandingTemplateKind, readonly string[]> = {
  serviceLite: [
    'pageHero',
    'pillarGrid',
    'industryGrid',
    'processPhases',
    'caseStories',
    'faqSection',
    'finalCta',
  ],
  industryLite: [
    'pageHero',
    'pillarGrid',
    'serviceGrid',
    'caseStories',
    'faqSection',
    'finalCta',
  ],
  campaign: ['pageHero', 'pillarGrid', 'metricsBand', 'faqSection', 'finalCta'],
};

export function randomKey(length = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function titled(title = '', description = '') {
  return { _type: 'titledBlock', _key: randomKey(), title, description };
}

function phase(index: string, title = '', description = '') {
  return { _type: 'processStep', _key: randomKey(), index, title, description };
}

function metric() {
  return {
    _type: 'metric',
    _key: randomKey(),
    valor: 0,
    label: '',
    prefix: '',
    suffix: '',
  };
}

export function makeLandingBlock(
  type: string,
  kind: LandingTemplateKind,
): Record<string, unknown> {
  const base = { _type: type, _key: randomKey() };

  switch (type) {
    case 'pageHero':
      return {
        ...base,
        variant: kind === 'campaign' ? 'plain' : 'photo',
        title: '',
        description: '',
        eyebrow: kind === 'serviceLite' ? 'Servicio' : kind === 'industryLite' ? 'Industria' : 'Campaña',
        tone: 'canvas',
        atmosphere: 'spotlight',
        badges: kind === 'campaign' ? [] : [{ _key: randomKey(), label: 'Hiweb', variant: 'lime' }],
        cta: { _type: 'cta', label: 'Agenda tu auditoría', href: '/contacto' },
      };
    case 'pillarGrid':
      return {
        ...base,
        eyebrow: 'Diferenciadores',
        title: 'Por qué este sistema',
        description: 'Tres razones. Un criterio.',
        tone: 'canvas',
        pillars: [titled(), titled(), titled()],
      };
    case 'serviceGrid':
      return {
        ...base,
        variant: kind === 'industryLite' ? 'industry' : 'catalog',
        source: 'all',
        eyebrow: 'Servicios',
        title: kind === 'industryLite' ? 'Nueve palancas, leídas para esta industria' : 'Nueve palancas, un solo sistema',
        description: 'Elige la palanca. El diagnóstico define el orden.',
        tone: 'canvas',
      };
    case 'industryGrid':
      return {
        ...base,
        source: 'all',
        eyebrow: 'Industrias',
        title: 'Cómo se lee en cada industria',
        description: 'El mismo servicio, un playbook distinto por sector.',
        tone: 'canvas',
      };
    case 'processPhases':
      return {
        ...base,
        eyebrow: 'Proceso',
        title: 'De la auditoría a la optimización',
        description: 'Cuatro fases. Un sistema.',
        tone: 'canvas',
        phases: [
          phase('01', 'Auditoría', ''),
          phase('02', 'Estrategia', ''),
          phase('03', 'Ejecución', ''),
          phase('04', 'Optimización', ''),
        ],
      };
    case 'caseStories':
      return {
        ...base,
        source: 'all',
        eyebrow: 'Casos',
        title: 'Resultados propios',
        description: 'Cliente, industria y outcome.',
        tone: 'canvas',
      };
    case 'casePreview':
      return {
        ...base,
        source: 'all',
        eyebrow: 'Casos',
        title: 'Evidencia verificable',
        description: 'Tres cuentas. Sin portfolio ornamental.',
        tone: 'canvas',
      };
    case 'faqSection':
      return {
        ...base,
        eyebrow: 'FAQ',
        title: 'Preguntas frecuentes',
        tone: 'canvas',
        items: [],
      };
    case 'finalCta':
      return {
        ...base,
        badge: 'Contacto',
        title: 'Listos cuando tú lo estés.',
        description: 'Cuéntanos industria, objetivo e ICP.',
        primaryCta: { _type: 'cta', label: 'Agenda tu auditoría', href: '/contacto' },
      };
    case 'teamGrid':
      return {
        ...base,
        source: 'all',
        eyebrow: 'Equipo',
        title: 'Conoce al equipo Hiweb',
        limit: 4,
        cta: { _type: 'cta', label: 'Conoce a todo el equipo', href: '/nosotros' },
      };
    case 'metricsBand':
      return {
        ...base,
        eyebrow: 'Cifras',
        title: 'Antes y después',
        titleMuted: 'en cifras verificables',
        description: 'Números de negocio, no recortes de Ads Manager.',
        metrics: [metric(), metric()],
        primaryCta: { _type: 'cta', label: 'Agenda tu auditoría', href: '/contacto' },
      };
    case 'presenceMap':
      return {
        ...base,
        eyebrow: 'Presencia',
        title: 'Mérida, Cancún y Monterrey',
        description: 'Operamos cross-border.',
        cta: { _type: 'cta', label: 'Agenda tu auditoría', href: '/contacto' },
      };
    default:
      return base;
  }
}

export function landingTemplateSections(kind: LandingTemplateKind): Array<Record<string, unknown>> {
  return LANDING_TEMPLATE_TYPES[kind].map((type) => makeLandingBlock(type, kind));
}
