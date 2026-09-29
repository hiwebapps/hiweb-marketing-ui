import { aboutPage } from './aboutPage';
import { aboutSectionTypes } from './aboutSections';
import { contactPage } from './contactPage';
import { landingSectionTypes } from './blocks/pageSections';
import { blogTable } from './blogTable';
import { faq } from './faq';
import { landingPage } from './landingPage';
import { author, post } from './post';
import { caseStudy } from './caseStudy';
import { caseSectionTypes } from './caseSections';
import { homePage } from './homePage';
import { homeSectionTypes, homeServiceItem } from './homeSections';
import { industriesIndex, industry } from './industry';
import { industrySectionTypes } from './industrySections';
import { person } from './person';
import { service } from './service';
import { serviceSectionTypes } from './serviceSections';
import { table } from './table';
import {
  cta,
  faqCategory,
  faqItem,
  homeTestimonial,
  metric,
  processStep,
  sectionIntro,
  serviceBlurb,
  servicePlan,
  titledBlock,
} from './shared';
import { footer, footerLink } from './footer';
import { navBarItem, navGroup, navLink, navigation } from './navigation';
import { siteSettings } from './siteSettings';

export const schemaTypes = [
  faqItem,
  titledBlock,
  processStep,
  metric,
  sectionIntro,
  homeTestimonial,
  cta,
  faqCategory,
  serviceBlurb,
  servicePlan,
  table,
  blogTable,
  ...landingSectionTypes,
  homeServiceItem,
  ...homeSectionTypes,
  ...serviceSectionTypes,
  ...caseSectionTypes,
  ...industrySectionTypes,
  ...aboutSectionTypes,
  navLink,
  navGroup,
  navBarItem,
  navigation,
  footerLink,
  footer,
  siteSettings,
  homePage,
  aboutPage,
  contactPage,
  industry,
  industriesIndex,
  service,
  caseStudy,
  author,
  post,
  person,
  faq,
  landingPage,
];
