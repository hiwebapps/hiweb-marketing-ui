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

const serviceSectionsProjection = /* groq */ `
  sections[]{
    _type,
    _key,
    _type == "serviceHero" => {
      title,
      description,
      badge,
      image ${imageProjection},
      ctaLabel,
      ctaHref
    },
    _type == "serviceOverview" => {
      eyebrow,
      title,
      description,
      cards[]{ title, description }
    },
    _type == "serviceFocus" => {
      eyebrow,
      title,
      description,
      items[]{ title, summary, detailTitle, detail, icon, image, imageAlt }
    },
    _type == "servicePitch" => {
      badge,
      title,
      description,
      image,
      imageAlt,
      ctaLabel,
      ctaHref
    },
    _type == "serviceWhy" => {
      title,
      description,
      ctaLabel,
      ctaHref,
      cards[]{ title, description, icon, accent }
    },
    _type == "servicePlans" => {
      eyebrow,
      title,
      description,
      note,
      noteLabel,
      noteHref,
      ctaLabel,
      ctaHref,
      plans[]{ name, price, period, featured, includes }
    },
    _type == "serviceIndustries" => {
      title,
      description,
      items[]{
        title,
        tagline,
        icon,
        "slug": industry->slug.current,
        "nombre": coalesce(title, industry->nombre),
        "taglineResolved": coalesce(tagline, industry->tagline),
        "puntos": coalesce(puntos, industry->porQue[].title)
      }
    },
    _type == "serviceProcess" => {
      eyebrow,
      title,
      description,
      steps[]{ title, description, icon, accent }
    },
    _type == "serviceCases" => {
      eyebrow,
      title,
      description,
      items[]->{
        "id": slug.current,
        cliente,
        resumen,
        "industria": industria->nombre,
        testimonio{ quote, name, role },
        metricas[]{ valor, label, prefix, suffix, decimals }
      }
    },
    _type == "serviceFaq" => {
      eyebrow,
      title,
      columns,
      items[]{ question, answer }
    },
    _type == "serviceCta" => { badge, title, description }
  }
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

const introProjection = /* groq */ `{ eyebrow, title, titleMuted, description }`;

export const homePageEnQuery = defineQuery(`*[_type == "homePage" && _id == "homePage-en"][0]{
  sections[]{
    _type,
    _type == "homeHero" => {
      title,
      lead,
      primaryCta{ label, href },
      secondaryCta{ label, href },
      cases[]->{
        "id": slug.current,
        cliente,
        "industriaId": industria->slug.current,
        ogImage ${imageProjection}
      }
    },
    _type == "homePillars" => {
      intro ${introProjection},
      ctaLabel,
      items[]{ title, description }
    },
    _type == "homeServices" => {
      intro ${introProjection},
      items[]{
        "id": service->slug.current,
        "nombre": coalesce(nombre, service->nombre),
        "tagline": coalesce(tagline, service->tagline)
      }
    },
    _type == "homeIndustries" => {
      intro ${introProjection},
      items[]->{
        "id": slug.current,
        nombre,
        tagline,
        "puntos": porQue[].title
      }
    },
    _type == "homeStories" => {
      intro ${introProjection},
      items[]{ client, quote, name, role }
    },
    _type == "homeProcess" => {
      intro ${introProjection},
      items[]{ index, title, description }
    },
    _type == "homeMetrics" => {
      intro ${introProjection},
      items[]{ valor, label, prefix, suffix, decimals }
    },
    _type == "homeTeam" => {
      eyebrow,
      title,
      description,
      ctaLabel,
      ctaHref
    },
    _type == "homeFaq" => {
      intro ${introProjection},
      categories[]{ id, label, items[]{ question, answer } }
    },
    _type == "homeCta" => {
      badge,
      title,
      description,
      primaryCta{ label, href }
    }
  },
  ${seoProjection}
}`);

export const homePageQuery = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
  sections[]{
    _type,
    _type == "homeHero" => {
      title,
      lead,
      primaryCta{ label, href },
      secondaryCta{ label, href },
      cases[]->{
        "id": slug.current,
        cliente,
        "industriaId": industria->slug.current,
        ogImage ${imageProjection}
      }
    },
    _type == "homePillars" => {
      intro ${introProjection},
      ctaLabel,
      items[]{ title, description }
    },
    _type == "homeServices" => {
      intro ${introProjection},
      items[]{
        "id": service->slug.current,
        "nombre": coalesce(nombre, service->nombre),
        "tagline": coalesce(tagline, service->tagline)
      }
    },
    _type == "homeIndustries" => {
      intro ${introProjection},
      items[]->{
        "id": slug.current,
        nombre,
        tagline,
        "puntos": porQue[].title
      }
    },
    _type == "homeStories" => {
      intro ${introProjection},
      items[]{ client, quote, name, role }
    },
    _type == "homeProcess" => {
      intro ${introProjection},
      items[]{ index, title, description }
    },
    _type == "homeMetrics" => {
      intro ${introProjection},
      items[]{ valor, label, prefix, suffix, decimals }
    },
    _type == "homeTeam" => {
      eyebrow,
      title,
      description,
      ctaLabel,
      ctaHref
    },
    _type == "homeFaq" => {
      intro ${introProjection},
      categories[]{ id, label, items[]{ question, answer } }
    },
    _type == "homeCta" => {
      badge,
      title,
      description,
      primaryCta{ label, href }
    }
  },
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
  _type == "industry" && defined(slug.current) && coalesce(locale, "es") == $locale
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
  heroCtaLabel,
  whyEyebrow,
  whyTitle,
  servicesTitle,
  servicesDescription,
  servicesCtaLabel,
  servicesTag,
  casesEyebrow,
  casesTitle,
  casesDescription,
  casesEmpty,
  faqTitle,
  closingTitle,
  serviceBlurbs[]{
    "serviceSlug": service->slug.current,
    description
  },
  ${seoProjection}
}`);

export const industryBySlugQuery = defineQuery(`*[
  _type == "industry" && slug.current == $slug && coalesce(locale, "es") == $locale
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
  heroCtaLabel,
  whyEyebrow,
  whyTitle,
  servicesTitle,
  servicesDescription,
  servicesCtaLabel,
  servicesTag,
  casesEyebrow,
  casesTitle,
  casesDescription,
  casesEmpty,
  faqTitle,
  closingTitle,
  serviceBlurbs[]{
    "serviceSlug": service->slug.current,
    description
  },
  ${seoProjection}
}`);

export const industriesIndexQuery = defineQuery(`*[
  _type == "industriesIndex" && _id == $id
][0]{
  eyebrow,
  title,
  description,
  whyEyebrow,
  whyTitle,
  closingTitle,
  cardCtaLabel,
  pillars[]{ title, description },
  ${seoProjection}
}`);

export const servicesQuery = defineQuery(`*[
  _type == "service" && defined(slug.current) && coalesce(locale, "es") == $locale
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
  planesEyebrow,
  planesTitle,
  planesDescription,
  planesNote,
  planesNoteLabel,
  planesNoteHref,
  planesCtaLabel,
  planesCtaHref,
  planes[]{ name, price, period, featured, includes },
  ${serviceSectionsProjection},
  ${seoProjection}
}`);

export const serviceBySlugQuery = defineQuery(`*[
  _type == "service" && slug.current == $slug && coalesce(locale, "es") == $locale
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
  planesEyebrow,
  planesTitle,
  planesDescription,
  planesNote,
  planesNoteLabel,
  planesNoteHref,
  planesCtaLabel,
  planesCtaHref,
  planes[]{ name, price, period, featured, includes },
  ${serviceSectionsProjection},
  ${seoProjection}
}`);

export const casesQuery = defineQuery(`*[
  _type == "caseStudy" && defined(slug.current)
]{
  "id": slug.current,
  cliente,
  "industria": { "id": industria->slug.current },
  "servicios": servicios[]->{ "id": slug.current, nombre, "heroImage": coalesce(heroImage, sections[_type == "serviceHero"][0].image) ${imageProjection} },
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
  "servicios": servicios[]->{ "id": slug.current, nombre, "heroImage": coalesce(heroImage, sections[_type == "serviceHero"][0].image) ${imageProjection} },
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
  "authorCard": author->{ name, role, company, linkedin },
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
  "authorCard": author->{ name, role, company, linkedin },
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
