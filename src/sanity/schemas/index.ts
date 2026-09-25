import { aboutPage } from './aboutPage';
import { landingSectionTypes } from './blocks/pageSections';
import { blogTable } from './blogTable';
import { faq } from './faq';
import { landingPage } from './landingPage';
import { author, post } from './post';
import { caseStudy } from './caseStudy';
import { homePage } from './homePage';
import { homeSectionTypes, homeServiceItem } from './homeSections';
import { industry } from './industry';
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
  siteSettings,
  homePage,
  aboutPage,
  industry,
  service,
  caseStudy,
  author,
  post,
  person,
  faq,
  landingPage,
];
