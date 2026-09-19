import type {
  CaseRecord,
  IndustryRecord,
  LandingPage,
  LandingSection,
  PersonRecord,
  ServiceRecord,
} from './types';

type LandingCatalogs = {
  services: ServiceRecord[];
  industries: IndustryRecord[];
  cases: CaseRecord[];
  people: PersonRecord[];
};

export function hydrateLanding(page: LandingPage, catalogs: LandingCatalogs): LandingPage {
  const sections: LandingSection[] = page.sections.map((section) => {
    if (section._type === 'serviceGrid' && section.source !== 'refs') {
      return {
        ...section,
        services: catalogs.services.map((item) => ({
          id: item.id,
          nombre: item.data.nombre,
          tagline: item.data.tagline,
        })),
      };
    }
    if (section._type === 'industryGrid' && section.source !== 'refs') {
      return {
        ...section,
        industries: catalogs.industries.map((item) => ({
          id: item.id,
          nombre: item.data.nombre,
          tagline: item.data.tagline,
          puntos: item.data.porQue.map((punto) => punto.title),
        })),
      };
    }
    if (section._type === 'caseStories' && section.source !== 'refs') {
      return { ...section, cases: catalogs.cases };
    }
    if (section._type === 'casePreview' && section.source !== 'refs') {
      return { ...section, cases: catalogs.cases };
    }
    if (section._type === 'teamGrid' && section.source !== 'refs') {
      return { ...section, people: catalogs.people };
    }
    return section;
  });

  return { ...page, sections };
}

export function landingNeedsCatalogs(page: LandingPage) {
  return {
    services: page.sections.some((section) => section._type === 'serviceGrid' && section.source !== 'refs'),
    industries: page.sections.some((section) => section._type === 'industryGrid' && section.source !== 'refs'),
    cases: page.sections.some(
      (section) =>
        (section._type === 'caseStories' || section._type === 'casePreview') && section.source !== 'refs',
    ),
    people: page.sections.some((section) => section._type === 'teamGrid' && section.source !== 'refs'),
  };
}