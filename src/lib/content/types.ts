import type { SanityImageSource } from '@sanity/image-url';

export type FaqItem = {
  question: string;
  answer: string;
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
};

export type IndustryRecord = {
  id: string;
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
    serviceBlurbs: { serviceSlug: string; description: string }[];
    seo?: SeoFields;
  };
};

export type ServiceRecord = {
  id: string;
  data: {
    nombre: string;
    orden: number;
    tagline: string;
    heroTitle: string;
    heroDescription?: string;
    heroImage?: string;
    heroImageAlt?: string;
    heroBadge?: string;
    cards: TitledBlock[];
    proceso: TitledBlock[];
    faqs: FaqItem[];
    seo?: SeoFields;
  };
};

export type CaseRecord = {
  id: string;
  data: {
    cliente: string;
    industria: { id: string };
    servicios: { id: string; nombre?: string; heroImage?: string }[];
    resultadoFrase: string;
    titulo: string;
    resumen: string;
    destacado: boolean;
    accent: 'cyan' | 'orange' | 'purple';
    metricas: Metric[];
    reto: string;
    estrategia: string;
    fases: TitledBlock[];
    testimonio?: { quote: string; name: string; role: string };
    seo?: SeoFields;
  };
};

export type PostRecord = {
  id: string;
  data: {
    title: string;
    description: string;
    keyword: string;
    autor: string;
    fecha: Date;
    featured: boolean;
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
  titleMuted?: string;
  description?: string;
};

export type HomeTestimonial = {
  client: string;
  quote: string;
  name: string;
  role?: string;
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
};

export type HomeIndustryCard = {
  id: string;
  nombre: string;
  tagline: string;
  puntos: string[];
};

export type HomeCopy = {
  heroTitle?: string;
  heroLead?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  heroCases?: HomeHeroCase[];
  pillarIntro?: SectionIntro;
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
    ctaLabel?: string;
    ctaHref?: string;
  };
  closing?: {
    badge?: string;
    title?: string;
    description?: string;
    primaryCta?: { label: string; href: string };
  };
  sectionOrder?: string[];
  seo?: SeoFields;
};

export type AboutCopy = {
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroImageAlt?: string;
  historyEyebrow?: string;
  historyTitle?: string;
  historyDescription?: string;
  historyColumns?: { title: string; paragraphs: string[] }[];
  seo?: SeoFields;
};

export type CmsImage = SanityImageSource & { alt?: string };

export type LandingCta = { label: string; href: string };

export type LandingSection =
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
      industries: { id: string; nombre: string; tagline: string; puntos?: string[] }[];
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
      titleMuted?: string;
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
    };

export type LandingPage = {
  id: string;
  title: string;
  sections: LandingSection[];
  seo?: SeoFields;
};
