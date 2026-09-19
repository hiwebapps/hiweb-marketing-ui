import { aboutPage } from './aboutPage';
import { landingSectionTypes } from './blocks/pageSections';
import { blogTable } from './blogTable';
import { faq } from './faq';
import { landingPage } from './landingPage';
import { author, post } from './post';
import { caseStudy } from './caseStudy';
import { homePage } from './homePage';
import { industry } from './industry';
import { person } from './person';
import { service } from './service';
import { table } from './table';
import {
  cta,
  faqCategory,
  faqItem,
  metric,
  processStep,
  serviceBlurb,
  titledBlock,
} from './shared';
import { siteSettings } from './siteSettings';

export const schemaTypes = [
  faqItem,
  titledBlock,
  processStep,
  metric,
  cta,
  faqCategory,
  serviceBlurb,
  table,
  blogTable,
  ...landingSectionTypes,
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
