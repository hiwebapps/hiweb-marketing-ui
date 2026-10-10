import { aboutPage } from './aboutPage';
import { aboutSectionTypes } from './aboutSections';
import { calendarPage } from './calendarPage';
import { contactPage } from './contactPage';
import { beforeAfter } from './blocks/beforeAfter';
import { landingSectionTypes } from './blocks/pageSections';
import { blogTable } from './blogTable';
import { faq } from './faq';
import { testimonial } from './testimonial';
import { landingPage } from './landingPage';
import { author, post } from './post';
import { caseStudy } from './caseStudy';
import { caseSectionTypes } from './caseSections';
import { homePage } from './homePage';
import { homeSectionTypes, homeServiceItem } from './homeSections';
import { industriesIndex, industry } from './industry';
import { industryPillar, industrySectionTypes } from './industrySections';
import { person } from './person';
import { service } from './service';
import { serviceSectionTypes } from './serviceSections';
import { table } from './table';
import {
  cta,
  faqCategory,
  faqItem,
  metric,
  processStep,
  sectionIntro,
  serviceBlurb,
  servicePlan,
  titledBlock,
  withVisibility,
} from './shared';
import { ctaBackdrop } from './ctaBackdrop';
import { footer, footerLink } from './footer';
import { navBarItem, navGroup, navLink, navigation } from './navigation';
import { redirect } from './redirect';
import { blogIndex, casesIndex, servicesIndex } from './catalogIndex';
import { legalObjectTypes, legalPage } from './legalPage';
import { siteSettings } from './siteSettings';
import { portalPage, portalSectionTypes } from './portalPage';
import { sitePage } from './sitePage';

export const schemaTypes = [
  faqItem,
  titledBlock,
  processStep,
  metric,
  sectionIntro,
  cta,
  faqCategory,
  serviceBlurb,
  servicePlan,
  table,
  blogTable,
  withVisibility(beforeAfter),
  ...landingSectionTypes,
  ...portalSectionTypes,
  homeServiceItem,
  ...homeSectionTypes,
  ...serviceSectionTypes,
  ...caseSectionTypes,
  industryPillar,
  ...industrySectionTypes,
  ...aboutSectionTypes,
  navLink,
  navGroup,
  navBarItem,
  navigation,
  footerLink,
  footer,
  ctaBackdrop,
  redirect,
  siteSettings,
  servicesIndex,
  blogIndex,
  casesIndex,
  ...legalObjectTypes,
  legalPage,
  homePage,
  aboutPage,
  contactPage,
  calendarPage,
  portalPage,
  sitePage,
  industry,
  industriesIndex,
  service,
  caseStudy,
  author,
  post,
  person,
  faq,
  testimonial,
  landingPage,
];
