import type { SanityImageSource } from '@sanity/image-url';
import type { HeadingWidth } from '../heading';

export type FaqTextSpan = {
  _type?: 'span';
  _key?: string;
  text?: string;
  marks?: string[];
};

export type FaqTextBlock = {
  _type?: 'block';
  _key?: string;
  children?: FaqTextSpan[];
  markDefs?: { _key?: string; _type?: string; href?: string }[];
};

export type FaqAnswer = string | FaqTextBlock[];

export type FaqItem = {
  question: string;
  answer: FaqAnswer;
};

export type TitledBlock = {
  title: string;
  description: string;
};

export type ProcessPhase = {
  index: string;
  title: string;
  description: string;
};

export type Metric = {
  valor: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  antes?: string;
  despues?: string;
};

export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  noindex?: boolean;
  canonicalPath?: string;
};

export type IndustryRecord = {
  id: string;
  alternateSlug?: string;
  data: {
    nombre: string;
    orden: number;
    tagline: string;
    heroTitle: string;
    heroDescription: string;
    heroImage?: string;
    heroImageAlt?: string;
    heroBadge?: string;
    retos: string[];
    porQue: TitledBlock[];
    faqs: FaqItem[];
    serviceBlurbs: { serviceSlug: string; nombre?: string; description?: string; icon?: string }[];
    heroCtaLabel?: string;
    whyEyebrow?: string;
    whyTitle?: string;
    whyDescription?: string;
    servicesTitle?: string;
    servicesDescription?: string;
    servicesCtaLabel?: string;
    servicesTag?: string;
    casesEyebrow?: string;
    casesTitle?: string;
    casesDescription?: string;
    casesEmpty?: string;
    faqTitle?: string;
    closingTitle?: string;
    sections?: IndustrySection[];
    seo?: SeoFields;
  };
};

export type IndustrySection = (
  | {
      _type: 'industryHero';
      badge?: string;
      title?: string;
      description?: string;
      image?: string;
      imageAlt?: string;
      ctaLabel?: string;
      ctaHref?: string;
    }
  | {
      _type: 'industryWhy';
      eyebrow?: string;
      title?: string;
      description?: string;
      pillars?: (TitledBlock & { icon?: string })[];
      retos?: string[];
    }
  | {
      _type: 'industryServices';
      eyebrow?: string;
      title?: string;
      description?: string;
      catalogLabel?: string;
      catalogHref?: string;
      ctaLabel?: string;
      tagLabel?: string;
      items?: { slug: string; nombre?: string; description?: string; icon?: string }[];
    }
  | {
      _type: 'industryCases';
      eyebrow?: string;
      title?: string;
      description?: string;
      emptyText?: string;
    }
  | {
      _type: 'industryFaq';
      eyebrow?: string;
      title?: string;
      items?: FaqItem[];
    }
  | {
      _type: 'industryCta';
      title?: string;
    }
  | BeforeAfterBlock
) & { hidden?: boolean; headingWidth?: HeadingWidth };

export type ServiceSection = (
  | {
      _type: 'serviceHero';
      title?: string;
      description?: string;
      badge?: string;
      image?: string;
      imageAlt?: string;
      ctaLabel?: string;
      ctaHref?: string;
    }
  | {
      _type: 'serviceOverview';
      eyebrow?: string;
      title?: string;
      description?: string;
      cards?: TitledBlock[];
    }
  | {
      _type: 'serviceFocus';
      eyebrow?: string;
      title?: string;
      description?: string;
      items?: {
        title: string;
        summary: string;
        detailTitle: string;
        detail: string;
        icon: string;
        image: string;
        imageAlt: string;
      }[];
    }
  | {
      _type: 'servicePitch';
      badge?: string;
      title?: string;
      description?: string;
      image?: string;
      imageAlt?: string;
      ctaLabel?: string;
      ctaHref?: string;
    }
  | {
      _type: 'serviceWhy';
      title?: string;
      description?: string;
      ctaLabel?: string;
      ctaHref?: string;
      stats?: { valor: number; prefix?: string; suffix?: string; label: string }[];
      cards?: { title: string; description: string; icon: string; accent: string }[];
    }
  | {
      _type: 'servicePlans';
      eyebrow?: string;
      title?: string;
      description?: string;
      note?: string;
      noteLabel?: string;
      noteHref?: string;
      ctaLabel?: string;
      ctaHref?: string;
      plans?: { name?: string; badge?: string; price: string; period?: string; featured?: boolean; includes: string[] }[];
    }
  | {
      _type: 'serviceIndustries';
      title?: string;
      description?: string;
      items?: { slug: string; nombre: string; tagline: string; icon?: string; puntos?: string[] }[];
    }
  | {
      _type: 'serviceProcess';
      eyebrow?: string;
      title?: string;
      description?: string;
      steps?: { title: string; description: string; icon?: string; accent?: string }[];
    }
  | {
      _type: 'serviceCases';
      eyebrow?: string;
      title?: string;
      description?: string;
      items?: { client: string; quote: string; name: string; role?: string; photo?: string; cover?: string; href?: string; stats?: StoryStat[] }[];
    }
  | {
      _type: 'serviceFaq';
      eyebrow?: string;
      title?: string;
      columns?: number;
      items?: FaqItem[];
    }
  | { _type: 'serviceCta'; badge?: string; title?: string; description?: string }
  | BeforeAfterBlock
) & { hidden?: boolean; headingWidth?: HeadingWidth };

export type ServiceRecord = {
  id: string;
  alternateSlug?: string;
  data: {
    nombre: string;
    orden: number;
    tagline: string;
    cardImage?: string;
    cardIcon?: string;
    heroTitle: string;
    heroDescription?: string;
    heroImage?: string;
    heroImageAlt?: string;
    heroBadge?: string;
    cards: TitledBlock[];
    proceso: TitledBlock[];
    faqs: FaqItem[];
    sections?: ServiceSection[];
    planes?: {
      eyebrow: string;
      title: string;
      description: string;
      note: string;
      noteHref?: string;
      noteLabel?: string;
      ctaLabel: string;
      ctaHref: string;
      plans: {
        name?: string;
        badge?: string;
        price: string;
        period?: string;
        featured?: boolean;
        includes: string[];
      }[];
    };
    seo?: SeoFields;
  };
};

export type CasePageSection = (
  | {
      _type: 'caseHero';
      anio?: string;
      imagenesProyecto?: string[];
    }
  | {
      _type: 'caseContext';
      retoEyebrow?: string;
      retoTitle?: string;
      reto?: string;
      estrategiaEyebrow?: string;
      estrategiaTitle?: string;
      estrategia?: string;
    }
  | {
      _type: 'caseProcess';
      eyebrow?: string;
      title?: string;
      description?: string;
      fases: TitledBlock[];
    }
  | {
      _type: 'caseMetrics';
      eyebrow?: string;
      title?: string;
      description?: string;
      metricas: Metric[];
      primaryLabel?: string;
      primaryHref?: string;
      secondaryLabel?: string;
      secondaryHref?: string;
    }
  | {
      _type: 'caseTestimonial';
      eyebrow?: string;
      title?: string;
      description?: string;
      quote?: string;
      name?: string;
      role?: string;
      client?: string;
      photo?: string;
      stats?: StoryStat[];
    }
  | {
      _type: 'caseRelated';
      eyebrow?: string;
      title?: string;
      description?: string;
    }
  | {
      _type: 'caseCta';
      badge?: string;
      title?: string;
      description?: string;
      primaryLabel?: string;
      primaryHref?: string;
    }
  | BeforeAfterBlock
) & { hidden?: boolean; headingWidth?: HeadingWidth };

export type CaseRecord = {
  id: string;
  data: {
    cliente: string;
    industria: { id: string };
    servicios: { id: string; nombre?: string; heroImage?: string }[];
    resultadoFrase?: string;
    titulo: string;
    resumen: string;
    destacado: boolean;
    accent: 'cyan' | 'orange' | 'purple';
    metricas: Metric[];
    reto: string;
    estrategia: string;
    fases: TitledBlock[];
    testimonio?: { quote: string; name: string; role: string; client?: string; photo?: string; stats?: StoryStat[] };
    anio?: string;
    imagenesProyecto?: string[];
    sections?: CasePageSection[];
    seo?: SeoFields;
  };
};

export type PostRecord = {
  id: string;
  alternateSlug?: string;
  data: {
    title: string;
    description: string;
    keyword: string;
    autor: string;
    author?: {
      name: string;
      role?: string;
      company?: string;
      linkedin?: string;
      photo?: string;
    };
    fecha: Date;
    featured: boolean;
    readingMinutes?: number;
    categoriaServicio?: { id: string; nombre?: string };
    categoriaIndustria?: { id: string };
    faqs: FaqItem[];
    seo?: SeoFields;
  };
  coverUrl?: string;
  markdownBody?: string;
  portableText?: unknown[];
};

export type PersonRecord = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  category: 'web' | 'redes' | 'diseno';
  accent?: string;
  socials?: {
    tiktok?: string;
    instagram?: string;
    linkedin?: string;
  };
};

export type SectionIntro = {
  eyebrow?: string;
  title?: string;
  description?: string;
  headingWidth?: HeadingWidth;
};

export type StoryStat = {
  value: string;
  label: string;
};

export type HomeTestimonial = {
  client: string;
  quote: string;
  name: string;
  role?: string;
  photo?: string;
  cover?: string;
  href?: string;
  stats?: StoryStat[];
};

export type HomeHeroCase = {
  id: string;
  cliente: string;
  industriaId?: string;
  image?: string;
};

export type HomeServiceCard = {
  id: string;
  nombre: string;
  tagline: string;
  image?: string;
  icon?: string;
};

export type HomeIndustryCard = {
  id: string;
  nombre: string;
  tagline: string;
  puntos: string[];
  icon?: string;
};

export type HomeCopy = {
  heroTitle?: string;
  heroHeadingWidth?: HeadingWidth;
  heroLead?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  heroCases?: HomeHeroCase[];
  pillarIntro?: SectionIntro;
  pillarCtaLabel?: string;
  pillars?: TitledBlock[];
  serviceIntro?: SectionIntro;
  serviceCards?: HomeServiceCard[];
  industryIntro?: SectionIntro;
  industryCards?: HomeIndustryCard[];
  storiesIntro?: SectionIntro;
  testimonials?: HomeTestimonial[];
  processIntro?: SectionIntro;
  process?: ProcessPhase[];
  metricsIntro?: SectionIntro;
  metrics?: Metric[];
  faqIntro?: SectionIntro;
  faqCategories?: { id: string; label: string; items: FaqItem[] }[];
  team?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    memberLocale?: 'es' | 'en';
    leaders?: PersonRecord[];
    ctaLabel?: string;
    ctaHref?: string;
    headingWidth?: HeadingWidth;
  };
  closing?: {
    badge?: string;
    title?: string;
    description?: string;
    headingWidth?: HeadingWidth;
    primaryCta?: { label: string; href: string };
  };
  hasSections?: boolean;
  sectionOrder?: string[];
  beforeAfter?: BeforeAfterBlock[];
  seo?: SeoFields;
};

export type AboutCopy = {
  heroTitle?: string;
  heroDescription?: string;
  heroBadge?: string;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  heroImage?: string;
  heroImageAlt?: string;
  historyEyebrow?: string;
  historyTitle?: string;
  historyDescription?: string;
  historyColumns?: { title: string; paragraphs: string[] }[];
  historyImages?: ({ src: string; alt: string } | undefined)[];
  pillarsEyebrow?: string;
  pillarsTitle?: string;
  pillars?: { title: string; description: string; icon?: string; accent?: string; href?: string }[];
  processEyebrow?: string;
  processTitle?: string;
  processDescription?: string;
  teamEyebrow?: string;
  teamTitle?: string;
  teamDescription?: string;
  teamCtaLabel?: string;
  teamCtaHref?: string;
  teamFilters?: { id?: string; label: string; members?: PersonRecord[] }[];
  mapEyebrow?: string;
  mapTitle?: string;
  mapDescription?: string;
  closingBadge?: string;
  closingTitle?: string;
  closingDescription?: string;
  closingCtaLabel?: string;
  sections?: AboutSection[];
  seo?: SeoFields;
};

export type AboutSection = (
  | {
      _type: 'aboutHero';
      badges?: { label: string; variant?: string }[];
      title?: string;
      description?: string;
      image?: string;
      imageAlt?: string;
      imagePosition?: string;
      ctaLabel?: string;
      ctaHref?: string;
    }
  | {
      _type: 'aboutHistory';
      eyebrow?: string;
      title?: string;
      description?: string;
      images?: ({ src: string; alt: string } | undefined)[];
      columns?: { title: string; paragraphs: string[] }[];
    }
  | {
      _type: 'aboutPillars';
      eyebrow?: string;
      title?: string;
      description?: string;
      pillars?: { title: string; description: string; icon?: string; accent?: string; href?: string }[];
    }
  | {
      _type: 'aboutProcess';
      eyebrow?: string;
      title?: string;
      description?: string;
      phases?: { index: string; title: string; description: string }[];
    }
  | {
      _type: 'aboutTeam';
      eyebrow?: string;
      title?: string;
      description?: string;
      ctaLabel?: string;
      ctaHref?: string;
      memberLocale?: 'es' | 'en';
      filterLabel?: string;
      filters?: { id?: string; label: string; members?: PersonRecord[] }[];
    }
  | {
      _type: 'aboutMap';
      eyebrow?: string;
      title?: string;
      description?: string;
      sectionLabel?: string;
      globeLabel?: string;
      ctaLabel?: string;
      ctaHref?: string;
    }
  | {
      _type: 'aboutPortal';
      eyebrow?: string;
      title?: string;
      description?: string;
      clientName?: string;
      badgeVariant?: string;
      primaryLabel?: string;
      primaryHref?: string;
      secondaryLabel?: string;
      secondaryHref?: string;
    }
  | {
      _type: 'aboutCta';
      badge?: string;
      title?: string;
      description?: string;
      ctaLabel?: string;
      ctaHref?: string;
    }
  | BeforeAfterBlock
) & { hidden?: boolean; headingWidth?: HeadingWidth };

export type BeforeAfterPair = {
  title?: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImage?: string;
  beforeVideo?: string;
  afterImage?: string;
  afterVideo?: string;
};

export type BeforeAfterBlock = {
  _type: 'beforeAfter';
  eyebrow?: string;
  title?: string;
  description?: string;
  badge?: string;
  badgeVariant?: string;
  pairs: BeforeAfterPair[];
};

export type CmsImage = SanityImageSource & { alt?: string };

export type LandingCta = { label: string; href: string };

export type LandingSection = (
  | {
      _type: 'pageHero';
      variant: 'plain' | 'photo';
      eyebrow?: string;
      title: string;
      description?: string;
      image?: string;
      imageAlt?: string;
      imagePosition?: string;
      badges?: { label: string; variant?: string }[];
      cta?: LandingCta;
      atmosphere?: 'none' | 'spotlight' | 'mesh' | 'wash';
    }
  | {
      _type: 'pillarGrid';
      eyebrow?: string;
      title?: string;
      description?: string;
      tone?: 'canvas' | 'surface';
      pillars: { title: string; description: string; icon?: string; accent?: string; href?: string }[];
      ctaLabel?: string;
    }
  | {
      _type: 'serviceGrid';
      variant: 'catalog' | 'industry';
      source: 'all' | 'refs';
      eyebrow?: string;
      title?: string;
      description?: string;
      tone?: 'canvas' | 'surface';
      industryName?: string;
      services: { id: string; nombre: string; tagline: string }[];
    }
  | {
      _type: 'industryGrid';
      source: 'all' | 'refs';
      eyebrow?: string;
      title?: string;
      description?: string;
      tone?: 'canvas' | 'surface';
      industries: { id: string; nombre: string; tagline: string; puntos?: string[]; icon?: string }[];
    }
  | {
      _type: 'processPhases';
      eyebrow?: string;
      title?: string;
      description?: string;
      tone?: 'canvas' | 'surface';
      phases: ProcessPhase[];
    }
  | {
      _type: 'caseStories';
      source: 'all' | 'refs';
      eyebrow?: string;
      title?: string;
      description?: string;
      cases: CaseRecord[];
    }
  | {
      _type: 'casePreview';
      source: 'all' | 'refs';
      eyebrow?: string;
      title?: string;
      description?: string;
      tone?: 'canvas' | 'surface';
      cases: CaseRecord[];
    }
  | {
      _type: 'faqSection';
      eyebrow?: string;
      title?: string;
      description?: string;
      tone?: 'canvas' | 'surface';
      items: FaqItem[];
    }
  | {
      _type: 'finalCta';
      badge?: string;
      title?: string;
      description?: string;
      primaryCta?: LandingCta;
      secondaryCta?: LandingCta;
    }
  | {
      _type: 'teamGrid';
      source: 'all' | 'refs';
      eyebrow?: string;
      title?: string;
      description?: string;
      limit?: number;
      showFilters?: boolean;
      cta?: LandingCta;
      people: PersonRecord[];
    }
  | {
      _type: 'metricsBand';
      eyebrow?: string;
      title?: string;
      description?: string;
      metrics: Metric[];
      primaryCta?: LandingCta;
      secondaryCta?: LandingCta;
    }
  | {
      _type: 'presenceMap';
      eyebrow?: string;
      title?: string;
      description?: string;
      cta?: LandingCta;
    }
  | BeforeAfterBlock
) & { hidden?: boolean; headingWidth?: HeadingWidth };

export type LandingPage = {
  id: string;
  title: string;
  sections: LandingSection[];
  seo?: SeoFields;
};

export type PortalSample = {
  module: 'rrss' | 'web' | 'seo' | 'docs' | 'hilinks';
  title: string;
  detail?: string;
};

export type PortalSection = (
  | {
      _type: 'portalHero';
      badge?: string;
      badgeNote?: string;
      title?: string;
      description?: string;
      clientName?: string;
      windowTitle?: string;
      proofTitle?: string;
      proofText?: string;
      tourLabel?: string;
      viewerLabel?: string;
      coachLabel?: string;
      coachText?: string;
      samples?: PortalSample[];
    }
  | {
      _type: 'portalStrip';
      text?: string;
      badges?: { label: string; variant?: string }[];
    }
  | {
      _type: 'portalJourney';
      eyebrow?: string;
      title?: string;
      description?: string;
      steps?: {
        index?: string;
        title?: string;
        description?: string;
        panelTitle?: string;
        panelText?: string;
        badge?: string;
        badgeVariant?: string;
      }[];
    }
  | {
      _type: 'portalBento';
      eyebrow?: string;
      title?: string;
      description?: string;
      cards?: { eyebrow?: string; title?: string; description?: string; module?: string }[];
    }
  | {
      _type: 'portalFaq';
      eyebrow?: string;
      title?: string;
      description?: string;
      searchPlaceholder?: string;
      items?: { question: string; answer: string; badge?: string; category?: string }[];
    }
  | {
      _type: 'portalCloser';
      lead?: string;
      title?: string;
      description?: string;
      primaryLabel?: string;
      secondaryLabel?: string;
      trust?: string[];
    }
  | BeforeAfterBlock
) & { hidden?: boolean; headingWidth?: HeadingWidth };

export type PortalPage = {
  title: string;
  sections: PortalSection[];
  seo?: SeoFields;
};
