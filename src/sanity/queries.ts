import { defineQuery } from 'groq';

const imageProjection = /* groq */ `{
  ...,
  alt,
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  }
}`;

const seoProjection = /* groq */ `
  metaTitle,
  metaDescription,
  ogImage ${imageProjection}
`;

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  name,
  legalName,
  tagline,
  email,
  phone,
  phoneHref,
  whatsapp,
  locales,
  socials[]{ label, href },
  ${seoProjection}
}`);

export const homePageQuery = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
  heroTitle,
  heroLead,
  primaryCta{ label, href },
  secondaryCta{ label, href },
  heroCases[]->{
    "id": slug.current,
    cliente,
    "industriaId": industria->slug.current,
    ogImage ${imageProjection}
  },
  pillarIntro{ eyebrow, title, titleMuted, description },
  pillars[]{ title, description },
  serviceIntro{ eyebrow, title, titleMuted, description },
  serviceItems[]{
    "id": service->slug.current,
    "nombre": service->nombre,
    "tagline": coalesce(tagline, service->tagline)
  },
  industryIntro{ eyebrow, title, titleMuted, description },
  homeIndustries[]->{
    "id": slug.current,
    nombre,
    tagline,
    "puntos": porQue[].title
  },
  storiesIntro{ eyebrow, title, titleMuted, description },
  testimonials[]{ client, quote, name, role },
  processIntro{ eyebrow, title, titleMuted, description },
  process[]{ index, title, description },
  metricsIntro{ eyebrow, title, titleMuted, description },
  metrics[]{ valor, label, prefix, suffix, decimals },
  faqIntro{ eyebrow, title, titleMuted, description },
  faqCategories[]{ id, label, items[]{ question, answer } },
  ${seoProjection}
}`);

export const aboutPageQuery = defineQuery(`*[_type == "aboutPage" && _id == "aboutPage"][0]{
  heroTitle,
  heroDescription,
  heroImage ${imageProjection},
  historyEyebrow,
  historyTitle,
  historyDescription,
  historyColumns[]{ title, paragraphs },
  ${seoProjection}
}`);

export const industriesQuery = defineQuery(`*[
  _type == "industry" && defined(slug.current)
] | order(orden asc) {
  "id": slug.current,
  nombre,
  orden,
  tagline,
  heroTitle,
  heroDescription,
  heroImage ${imageProjection},
  heroBadge,
  retos,
  porQue[]{ title, description },
  faqs[]{ question, answer },
  serviceBlurbs[]{
    "serviceSlug": service->slug.current,
    description
  },
  ${seoProjection}
}`);

export const industryBySlugQuery = defineQuery(`*[
  _type == "industry" && slug.current == $slug
][0]{
  "id": slug.current,
  nombre,
  orden,
  tagline,
  heroTitle,
  heroDescription,
  heroImage ${imageProjection},
  heroBadge,
  retos,
  porQue[]{ title, description },
  faqs[]{ question, answer },
  serviceBlurbs[]{
    "serviceSlug": service->slug.current,
    description
  },
  ${seoProjection}
}`);

export const servicesQuery = defineQuery(`*[
  _type == "service" && defined(slug.current)
] | order(orden asc) {
  "id": slug.current,
  nombre,
  orden,
  tagline,
  heroTitle,
  heroDescription,
  heroImage ${imageProjection},
  heroBadge,
  cards[]{ title, description },
  proceso[]{ title, description },
  faqs[]{ question, answer },
  ${seoProjection}
}`);

export const serviceBySlugQuery = defineQuery(`*[
  _type == "service" && slug.current == $slug
][0]{
  "id": slug.current,
  nombre,
  orden,
  tagline,
  heroTitle,
  heroDescription,
  heroImage ${imageProjection},
  heroBadge,
  cards[]{ title, description },
  proceso[]{ title, description },
  faqs[]{ question, answer },
  ${seoProjection}
}`);

export const casesQuery = defineQuery(`*[
  _type == "caseStudy" && defined(slug.current)
]{
  "id": slug.current,
  cliente,
  "industria": { "id": industria->slug.current },
  "servicios": servicios[]->{ "id": slug.current, nombre, heroImage ${imageProjection} },
  resultadoFrase,
  titulo,
  resumen,
  destacado,
  accent,
  metricas[]{ valor, label, prefix, suffix, decimals, antes, despues },
  reto,
  estrategia,
  fases[]{ title, description },
  testimonio{ quote, name, role },
  ${seoProjection}
}`);

export const caseBySlugQuery = defineQuery(`*[
  _type == "caseStudy" && slug.current == $slug
][0]{
  "id": slug.current,
  cliente,
  "industria": { "id": industria->slug.current },
  "servicios": servicios[]->{ "id": slug.current, nombre, heroImage ${imageProjection} },
  resultadoFrase,
  titulo,
  resumen,
  destacado,
  accent,
  metricas[]{ valor, label, prefix, suffix, decimals, antes, despues },
  reto,
  estrategia,
  fases[]{ title, description },
  testimonio{ quote, name, role },
  ${seoProjection}
}`);

export const postsQuery = defineQuery(`*[
  _type == "post" && defined(slug.current)
] | order(fecha desc) {
  "id": slug.current,
  title,
  description,
  keyword,
  autor,
  "authorName": coalesce(author->name, autor),
  fecha,
  featured,
  "categoriaServicio": { "id": categoriaServicio->slug.current, "nombre": categoriaServicio->nombre },
  "categoriaIndustria": { "id": categoriaIndustria->slug.current },
  cover ${imageProjection},
  faqs[]{ question, answer },
  ${seoProjection}
}`);

export const postBySlugQuery = defineQuery(`*[
  _type == "post" && slug.current == $slug
][0]{
  "id": slug.current,
  title,
  description,
  keyword,
  autor,
  "authorName": coalesce(author->name, autor),
  fecha,
  featured,
  "categoriaServicio": { "id": categoriaServicio->slug.current, "nombre": categoriaServicio->nombre },
  "categoriaIndustria": { "id": categoriaIndustria->slug.current },
  cover ${imageProjection},
  body,
  faqs[]{ question, answer },
  ${seoProjection}
}`);

export const peopleQuery = defineQuery(`*[
  _type == "person" && defined(name)
] | order(orden asc) {
  name,
  role,
  bio,
  photo ${imageProjection},
  category,
  accent,
  socials{ tiktok, instagram, linkedin }
}`);

const landingCaseProjection = /* groq */ `{
  "id": slug.current,
  cliente,
  "industria": { "id": industria->slug.current, "nombre": industria->nombre },
  "servicios": servicios[]->{ "id": slug.current, nombre },
  resultadoFrase,
  titulo,
  resumen,
  destacado,
  accent,
  metricas[]{ valor, label, prefix, suffix, decimals, antes, despues },
  reto,
  estrategia,
  fases[]{ title, description },
  testimonio{ quote, name, role }
}`;

const landingPersonProjection = /* groq */ `{
  name,
  role,
  bio,
  photo ${imageProjection},
  category,
  accent,
  socials{ tiktok, instagram, linkedin }
}`;

export const landingsQuery = defineQuery(`*[
  _type == "landingPage" && defined(slug.current)
] | order(title asc) {
  "id": slug.current,
  title,
  ${seoProjection}
}`);

export const landingBySlugQuery = defineQuery(`*[
  _type == "landingPage" && slug.current == $slug
][0]{
  "id": slug.current,
  title,
  sections[]{
    ...,
    image ${imageProjection},
    cta{ label, href },
    primaryCta{ label, href },
    secondaryCta{ label, href },
    pillars[]{ title, description, icon, accent, href },
    phases[]{ index, title, description },
    metrics[]{ valor, label, prefix, suffix, decimals, antes, despues },
    items[]{ question, answer },
    badges[]{ label, variant },
    "services": services[]->{ "id": slug.current, nombre, tagline },
    "industries": industries[]->{
      "id": slug.current,
      nombre,
      tagline,
      porQue[]{ title }
    },
    "cases": cases[]->${landingCaseProjection},
    "people": people[]->${landingPersonProjection},
    "faqFromLibrary": faqRefs[]->{ question, answer }
  },
  ${seoProjection}
}`);

export const sitemapEntriesQuery = defineQuery(`{
  "industries": *[_type == "industry" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "services": *[_type == "service" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "cases": *[_type == "caseStudy" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "landings": *[_type == "landingPage" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`);
