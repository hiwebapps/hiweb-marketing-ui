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

const beforeAfterProjection = /* groq */ `
    _type == "beforeAfter" => {
      eyebrow,
      title,
      description,
      badge,
      badgeVariant,
      pairs[]{
        title,
        beforeLabel,
        afterLabel,
        beforeImage ${imageProjection},
        afterImage ${imageProjection},
        "beforeVideo": beforeVideo.asset->url,
        "afterVideo": afterVideo.asset->url
      }
    }`;

const personCardProjection = /* groq */ `{
  name,
  role,
  bio,
  photo ${imageProjection},
  category,
  accent,
  socials{ tiktok, instagram, linkedin }
}`;

const storyStatProjection = /* groq */ `{ value, label }`;

const testimonialFields = /* groq */ `{
  "client": coalesce(testimonial->client, client),
  "quote": coalesce(testimonial->quote, quote),
  "name": coalesce(testimonial->name, name),
  "role": coalesce(testimonial->role, role),
  "stats": testimonial->stats[] ${storyStatProjection},
  "photo": testimonial->photo ${imageProjection}
}`;

const seoProjection = /* groq */ `
  metaTitle,
  metaDescription,
  noindex,
  canonicalPath,
  ogImage ${imageProjection}
`;

const serviceSectionsProjection = /* groq */ `
  sections[]{
    _type,
    _key,
    hidden,
    headingWidth,
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
      items[]{
        title,
        summary,
        detailTitle,
        detail,
        "icon": coalesce(iconImage.asset->url, icon),
        "image": select(defined(image.asset) => image.asset->url, image),
        "imageAlt": coalesce(image.alt, imageAlt)
      }
    },
    _type == "servicePitch" => {
      badge,
      title,
      description,
      "image": select(defined(picture.asset) => picture.asset->url, image),
      "imageAlt": coalesce(picture.alt, imageAlt),
      ctaLabel,
      ctaHref
    },
    _type == "serviceWhy" => {
      title,
      description,
      ctaLabel,
      ctaHref,
      stats[]{ valor, prefix, suffix, label },
      cards[]{ title, description, "icon": coalesce(iconImage.asset->url, icon), accent }
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
      plans[]{ name, badge, price, period, featured, includes }
    },
    _type == "serviceIndustries" => {
      title,
      description,
      items[]{
        title,
        tagline,
        "icon": coalesce(iconImage.asset->url, icon),
        "slug": industry->slug.current,
        "nombre": coalesce(title, industry->nombre),
        "taglineResolved": coalesce(tagline, industry->tagline),
        "puntos": coalesce(puntos, industry->sections[_type == "industryWhy"][0].pillars[].title, industry->porQue[].title)
      }
    },
    _type == "serviceProcess" => {
      eyebrow,
      title,
      description,
      steps[]{ title, description, "icon": coalesce(iconImage.asset->url, icon), accent }
    },
    _type == "serviceCases" => {
      eyebrow,
      title,
      description,
      items[]->{
        client, quote, name, role,
        stats[] ${storyStatProjection},
        photo ${imageProjection},
        "project": *[_type == "caseStudy" && references(^._id)][0]{
          "slug": slug.current,
          "cover": sections[_type == "caseHero"][0].imagenesProyecto[0] ${imageProjection}
        }
      }
    },
    _type == "serviceFaq" => {
      eyebrow,
      title,
      columns,
      items[]{ question, answer }
    },
    _type == "serviceCta" => { badge, title, description },
    ${beforeAfterProjection}
  }
`;

const navPagePath = /* groq */ `{
  "path": select(
    _type == "homePage" && (locale == "en" || _id match "*-en") => "/en",
    _type == "homePage" => "/",
    _type == "aboutPage" && (locale == "en" || _id match "*-en") => "/en/nosotros",
    _type == "aboutPage" => "/nosotros",
    _type == "portalPage" && (locale == "en" || _id match "*-en") => "/en/portal",
    _type == "portalPage" => "/portal",
    _type == "contactPage" => "/contacto",
    _type == "calendarPage" && (locale == "en" || _id match "*-en") => "/en/calendario",
    _type == "calendarPage" => "/calendario",
    _type == "sitePage" && defined(slug.current) => "/" + slug.current,
    _type == "service" && defined(slug.current) && (locale == "en" || _id match "*-en") => "/en/servicios/" + slug.current,
    _type == "service" && defined(slug.current) => "/servicios/" + slug.current,
    _type == "industry" && defined(slug.current) && (locale == "en" || _id match "*-en") => "/en/industrias/" + slug.current,
    _type == "industry" && defined(slug.current) => "/industrias/" + slug.current,
    _type == "caseStudy" && defined(slug.current) => "/portafolio/" + slug.current,
    _type == "post" && defined(slug.current) && (locale == "en" || _id match "*-en") => "/en/blogs/" + slug.current,
    _type == "post" && defined(slug.current) => "/blog/" + slug.current,
    _type == "landingPage" && defined(slug.current) => "/" + slug.current,
    _type == "industriesIndex" && (locale == "en" || _id match "*-en") => "/en/industrias",
    _type == "industriesIndex" => "/industrias",
    _type == "servicesIndex" && (locale == "en" || _id match "*-en") => "/en/servicios",
    _type == "servicesIndex" => "/servicios",
    _type == "blogIndex" && (locale == "en" || _id match "*-en") => "/en/blogs",
    _type == "blogIndex" => "/blog",
    _type == "casesIndex" => "/portafolio",
    _type == "legalPage" && _id match "legal-terms*" && (locale == "en" || _id match "*-en") => "/en/terminos",
    _type == "legalPage" && _id match "legal-terms*" => "/terminos",
    _type == "legalPage" && (locale == "en" || _id match "*-en") => "/en/aviso-de-privacidad",
    _type == "legalPage" => "/aviso-de-privacidad"
  )
}`;

const navLinkProjection = /* groq */ `{
  title,
  description,
  icon,
  "iconImage": iconImage.asset->url,
  "href": coalesce(page->${navPagePath}.path, href)
}`;

export const navigationQuery = defineQuery(`*[_type == "navigation" && _id == $id][0]{
  ctaLabel,
  "ctaHref": coalesce(ctaPage->${navPagePath}.path, ctaHref),
  allIndustriesLabel,
  industriesIndexHref,
  allServicesLabel,
  servicesIndexHref,
  exploreHeading,
  bar[]{
    label,
    kind,
    "href": coalesce(page->${navPagePath}.path, href),
    indexLabel,
    "indexHref": coalesce(indexPage->${navPagePath}.path, indexHref),
    exploreHeading,
    links[] ${navLinkProjection},
    columns[]{
      heading,
      links[] ${navLinkProjection}
    },
    groups[]{
      heading,
      links[] ${navLinkProjection}
    },
    exploreLinks[] ${navLinkProjection}
  },
  industryLinks[] ${navLinkProjection},
  serviceGroups[]{
    heading,
    links[] ${navLinkProjection}
  },
  exploreLinks[] ${navLinkProjection}
}`);

export const footerQuery = defineQuery(`*[_type == "footer" && _id == $id][0]{
  brand,
  "brandMark": brandMark.asset->url,
  title,
  emailPlaceholder,
  menuHeading,
  menuLinks[]{ label, href },
  contactHeading,
  contactLinks[]{ label, href },
  locations,
  legalName,
  legalLinks[]{ label, href },
  backToTop
}`);

export const ctaBackdropQuery = defineQuery(`*[_type == "ctaBackdrop" && _id == "ctaBackdrop"][0]{
  "images": images[defined(asset)].asset->url
}`);

export const siteIdentityQuery = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  name,
  legalName,
  tagline,
  email,
  phone,
  phoneHref,
  whatsapp,
  locales,
  socials[]{ label, href }
}`);

export const catalogIndexQuery = defineQuery(`*[_id == $id][0]{
  eyebrow,
  title,
  headingWidth,
  description,
  label,
  sectionTitle,
  sectionHeadingWidth,
  listTitle,
  listHeadingWidth,
  listDescription,
  allLabel,
  filterLabel,
  featuredCta,
  readingSuffix,
  closingTitle,
  closingHeadingWidth,
  ${seoProjection}
}`);

const legalLeafProjection = /* groq */ `
  _type,
  _type == "legalParagraph" => { text },
  _type == "legalBullets" => { items },
  _type == "legalTerms" => { items[]{ term, text } },
  _type == "legalLines" => { items[]{ label, value } }
`;

export const legalPageQuery = defineQuery(`*[_id == $id][0]{
  eyebrow,
  title,
  headingWidth,
  updatedLabel,
  updatedOn,
  intro,
  sections[]{
    title,
    blocks[]{
      ${legalLeafProjection},
      _type == "legalSubsection" => {
        title,
        blocks[]{ ${legalLeafProjection} }
      }
    }
  },
  ${seoProjection}
}`);

export const siteFaviconQuery = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  favicon{
    asset->{ _id, url, mimeType }
  }
}`);

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

const introProjection = /* groq */ `{ eyebrow, title, description, headingWidth }`;

const homeServiceItemProjection = /* groq */ `{
  "id": service->slug.current,
  "nombre": coalesce(nombre, service->nombre),
  "tagline": coalesce(tagline, service->tagline),
  "image": coalesce(image.asset->url, service->cardImage.asset->url),
  "icon": coalesce(iconImage.asset->url, icon, service->cardIconImage.asset->url, service->cardIcon)
}`;

const industryCardProjection = /* groq */ `{
  _type == "reference" => @->{
    "id": slug.current,
    nombre,
    tagline,
    "puntos": coalesce(sections[_type == "industryWhy"][0].pillars[].title, porQue[].title)
  },
  _type != "reference" => {
    "id": industry->slug.current,
    "nombre": coalesce(title, industry->nombre),
    "tagline": coalesce(tagline, industry->tagline),
    "icon": coalesce(iconImage.asset->url, icon),
    "puntos": coalesce(puntos, industry->sections[_type == "industryWhy"][0].pillars[].title, industry->porQue[].title)
  }
}`;

export const homePageEnQuery = defineQuery(`*[_type == "homePage" && _id == "homePage-en"][0]{
  sections[]{
    _type,
    hidden,
    headingWidth,
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
      items[] ${homeServiceItemProjection}
    },
    _type == "homeIndustries" => {
      intro ${introProjection},
      items[] ${industryCardProjection}
    },
    _type == "homeStories" => {
      intro ${introProjection},
      items[]->{
        client, quote, name, role,
        stats[] ${storyStatProjection},
        photo ${imageProjection},
        "project": *[_type == "caseStudy" && references(^._id)][0]{
          "slug": slug.current,
          "cover": sections[_type == "caseHero"][0].imagenesProyecto[0] ${imageProjection}
        }
      }
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
      memberLocale,
      leaders[]->${personCardProjection},
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
    },
    ${beforeAfterProjection}
  },
  ${seoProjection}
}`);

export const homePageQuery = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
  sections[]{
    _type,
    hidden,
    headingWidth,
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
      items[] ${homeServiceItemProjection}
    },
    _type == "homeIndustries" => {
      intro ${introProjection},
      items[] ${industryCardProjection}
    },
    _type == "homeStories" => {
      intro ${introProjection},
      items[]->{
        client, quote, name, role,
        stats[] ${storyStatProjection},
        photo ${imageProjection},
        "project": *[_type == "caseStudy" && references(^._id)][0]{
          "slug": slug.current,
          "cover": sections[_type == "caseHero"][0].imagenesProyecto[0] ${imageProjection}
        }
      }
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
      memberLocale,
      leaders[]->${personCardProjection},
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
    },
    ${beforeAfterProjection}
  },
  ${seoProjection}
}`);

const aboutSectionsProjection = /* groq */ `
  sections[]{
    _type,
    _key,
    hidden,
    headingWidth,
    _type == "aboutHero" => {
      badges[]{ label, variant },
      title,
      description,
      image ${imageProjection},
      imagePosition,
      ctaLabel,
      ctaHref
    },
    _type == "aboutHistory" => {
      eyebrow,
      title,
      description,
      imageLarge ${imageProjection},
      imageTop ${imageProjection},
      imageBottom ${imageProjection},
      columns[]{ title, paragraphs }
    },
    _type == "aboutPillars" => {
      eyebrow,
      title,
      description,
      pillars[]{ title, description, icon, accent, href }
    },
    _type == "aboutProcess" => {
      eyebrow,
      title,
      description,
      phases[]{ index, title, description }
    },
    _type == "aboutPortal" => {
      eyebrow,
      title,
      description,
      clientName,
      badgeVariant,
      primaryLabel,
      primaryHref,
      secondaryLabel,
      secondaryHref
    },
    ${beforeAfterProjection},
    _type == "aboutTeam" => {
      eyebrow,
      title,
      description,
      ctaLabel,
      ctaHref,
      memberLocale,
      filterLabel,
      filters[]{
        id,
        label,
        members[]->${personCardProjection}
      }
    },
    _type == "aboutMap" => {
      eyebrow,
      title,
      description,
      sectionLabel,
      globeLabel,
      ctaLabel,
      ctaHref
    },
    _type == "aboutCta" => {
      badge,
      title,
      description,
      ctaLabel,
      ctaHref
    }
  }
`;

export const aboutPageQuery = defineQuery(`*[_type == "aboutPage" && _id == $id][0]{
  "heroTitle": coalesce(sections[_type == "aboutHero"][0].title, heroTitle),
  "heroDescription": coalesce(sections[_type == "aboutHero"][0].description, heroDescription),
  "heroBadge": coalesce(sections[_type == "aboutHero"][0].badges[0].label, heroBadge),
  "heroCtaLabel": coalesce(sections[_type == "aboutHero"][0].ctaLabel, heroCtaLabel),
  "heroCtaHref": coalesce(sections[_type == "aboutHero"][0].ctaHref, heroCtaHref),
  "heroImage": coalesce(sections[_type == "aboutHero"][0].image ${imageProjection}, heroImage ${imageProjection}),
  "historyEyebrow": coalesce(sections[_type == "aboutHistory"][0].eyebrow, historyEyebrow),
  "historyTitle": coalesce(sections[_type == "aboutHistory"][0].title, historyTitle),
  "historyDescription": coalesce(sections[_type == "aboutHistory"][0].description, historyDescription),
  "historyColumns": coalesce(sections[_type == "aboutHistory"][0].columns[]{ title, paragraphs }, historyColumns[]{ title, paragraphs }),
  "historyImageLarge": sections[_type == "aboutHistory"][0].imageLarge ${imageProjection},
  "historyImageTop": sections[_type == "aboutHistory"][0].imageTop ${imageProjection},
  "historyImageBottom": sections[_type == "aboutHistory"][0].imageBottom ${imageProjection},
  "pillarsEyebrow": coalesce(sections[_type == "aboutPillars"][0].eyebrow, pillarsEyebrow),
  "pillarsTitle": coalesce(sections[_type == "aboutPillars"][0].title, pillarsTitle),
  "pillars": coalesce(sections[_type == "aboutPillars"][0].pillars[]{ title, description, icon, accent, href }, pillars[]{ title, description, icon, accent, href }),
  "processEyebrow": coalesce(sections[_type == "aboutProcess"][0].eyebrow, processEyebrow),
  "processTitle": coalesce(sections[_type == "aboutProcess"][0].title, processTitle),
  "processDescription": coalesce(sections[_type == "aboutProcess"][0].description, processDescription),
  "teamEyebrow": coalesce(sections[_type == "aboutTeam"][0].eyebrow, teamEyebrow),
  "teamTitle": coalesce(sections[_type == "aboutTeam"][0].title, teamTitle),
  "teamDescription": coalesce(sections[_type == "aboutTeam"][0].description, teamDescription),
  "teamCtaLabel": coalesce(sections[_type == "aboutTeam"][0].ctaLabel, teamCtaLabel),
  "teamCtaHref": coalesce(sections[_type == "aboutTeam"][0].ctaHref, teamCtaHref),
  "teamFilters": coalesce(sections[_type == "aboutTeam"][0].filters[]{ id, label, members[]->${personCardProjection} }, teamFilters[]{ id, label }),
  "mapEyebrow": coalesce(sections[_type == "aboutMap"][0].eyebrow, mapEyebrow),
  "mapTitle": coalesce(sections[_type == "aboutMap"][0].title, mapTitle),
  "mapDescription": coalesce(sections[_type == "aboutMap"][0].description, mapDescription),
  "closingBadge": coalesce(sections[_type == "aboutCta"][0].badge, closingBadge),
  "closingTitle": coalesce(sections[_type == "aboutCta"][0].title, closingTitle),
  "closingDescription": coalesce(sections[_type == "aboutCta"][0].description, closingDescription),
  "closingCtaLabel": coalesce(sections[_type == "aboutCta"][0].ctaLabel, closingCtaLabel),
  ${aboutSectionsProjection},
  ${seoProjection}
}`);

const industrySectionsProjection = /* groq */ `
  sections[]{
    _type,
    _key,
    hidden,
    headingWidth,
    _type == "industryHero" => {
      badge,
      title,
      description,
      image ${imageProjection},
      ctaLabel,
      ctaHref
    },
    _type == "industryWhy" => {
      eyebrow,
      title,
      description,
      pillars[]{ title, description, "icon": icon.asset->url },
      retos
    },
    _type == "industryServices" => {
      eyebrow,
      title,
      description,
      catalogLabel,
      catalogHref,
      ctaLabel,
      tagLabel,
      blurbs[]{
        "slug": service->slug.current,
        "nombre": coalesce(nombre, service->nombre),
        description,
        "icon": coalesce(iconImage.asset->url, icon, service->cardIconImage.asset->url, service->cardIcon)
      }
    },
    _type == "industryCases" => {
      eyebrow,
      title,
      description,
      emptyText
    },
    _type == "industryFaq" => {
      eyebrow,
      title,
      items[]{ question, answer }
    },
    _type == "industryCta" => {
      title
    },
    ${beforeAfterProjection}
  }
`;

const industryBodyProjection = /* groq */ `
  "heroTitle": coalesce(sections[_type == "industryHero"][0].title, heroTitle),
  "heroDescription": coalesce(sections[_type == "industryHero"][0].description, heroDescription),
  "heroImage": coalesce(sections[_type == "industryHero"][0].image ${imageProjection}, heroImage ${imageProjection}),
  "heroBadge": coalesce(sections[_type == "industryHero"][0].badge, heroBadge),
  "heroCtaLabel": coalesce(sections[_type == "industryHero"][0].ctaLabel, heroCtaLabel),
  "heroCtaHref": sections[_type == "industryHero"][0].ctaHref,
  "retos": coalesce(sections[_type == "industryWhy"][0].retos, retos),
  "porQue": coalesce(sections[_type == "industryWhy"][0].pillars[]{ title, description }, porQue[]{ title, description }),
  "whyEyebrow": coalesce(sections[_type == "industryWhy"][0].eyebrow, whyEyebrow),
  "whyTitle": coalesce(sections[_type == "industryWhy"][0].title, whyTitle),
  "whyDescription": sections[_type == "industryWhy"][0].description,
  "servicesTitle": coalesce(sections[_type == "industryServices"][0].title, servicesTitle),
  "servicesDescription": coalesce(sections[_type == "industryServices"][0].description, servicesDescription),
  "servicesCtaLabel": coalesce(sections[_type == "industryServices"][0].ctaLabel, servicesCtaLabel),
  "servicesTag": coalesce(sections[_type == "industryServices"][0].tagLabel, servicesTag),
  "servicesEyebrow": sections[_type == "industryServices"][0].eyebrow,
  "servicesCatalogLabel": sections[_type == "industryServices"][0].catalogLabel,
  "servicesCatalogHref": sections[_type == "industryServices"][0].catalogHref,
  "casesEyebrow": coalesce(sections[_type == "industryCases"][0].eyebrow, casesEyebrow),
  "casesTitle": coalesce(sections[_type == "industryCases"][0].title, casesTitle),
  "casesDescription": coalesce(sections[_type == "industryCases"][0].description, casesDescription),
  "casesEmpty": coalesce(sections[_type == "industryCases"][0].emptyText, casesEmpty),
  "faqTitle": coalesce(sections[_type == "industryFaq"][0].title, faqTitle),
  "faqEyebrow": sections[_type == "industryFaq"][0].eyebrow,
  "faqs": coalesce(sections[_type == "industryFaq"][0].items[]{ question, answer }, faqs[]{ question, answer }),
  "closingTitle": coalesce(sections[_type == "industryCta"][0].title, closingTitle),
  "serviceBlurbs": coalesce(
    sections[_type == "industryServices"][0].blurbs[]{
      "serviceSlug": service->slug.current,
      "nombre": coalesce(nombre, service->nombre),
      description,
      "icon": coalesce(iconImage.asset->url, icon, service->cardIconImage.asset->url, service->cardIcon)
    },
    serviceBlurbs[]{
      "serviceSlug": service->slug.current,
      "nombre": coalesce(nombre, service->nombre),
      description,
      "icon": coalesce(iconImage.asset->url, icon, service->cardIconImage.asset->url, service->cardIcon)
    }
  ),
  ${industrySectionsProjection}
`;

export const industriesQuery = defineQuery(`*[
  _type == "industry" && defined(slug.current) && coalesce(locale, "es") == $locale
] | order(orden asc) {
  "id": slug.current,
  nombre,
  orden,
  tagline,
  ${industryBodyProjection},
  "alternateSlug": select(
    $locale == "en" => *[_type == "industry" && _id == string::split(^._id, "-en")[0]][0].slug.current,
    *[_type == "industry" && _id == ^._id + "-en"][0].slug.current
  ),
  ${seoProjection}
}`);

export const industryBySlugQuery = defineQuery(`*[
  _type == "industry" && slug.current == $slug && coalesce(locale, "es") == $locale
][0]{
  "id": slug.current,
  nombre,
  orden,
  tagline,
  ${industryBodyProjection},
  "alternateSlug": select(
    $locale == "en" => *[_type == "industry" && _id == string::split(^._id, "-en")[0]][0].slug.current,
    *[_type == "industry" && _id == ^._id + "-en"][0].slug.current
  ),
  ${seoProjection}
}`);

export const industriesIndexQuery = defineQuery(`*[
  _type == "industriesIndex" && _id == $id
][0]{
  eyebrow,
  title,
  headingWidth,
  description,
  whyEyebrow,
  whyTitle,
  whyHeadingWidth,
  closingTitle,
  closingHeadingWidth,
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
  "cardImage": cardImage.asset->url,
  "cardIcon": coalesce(cardIconImage.asset->url, cardIcon),
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
  "alternateSlug": select(
    $locale == "en" => *[_type == "service" && _id == string::split(^._id, "-en")[0]][0].slug.current,
    *[_type == "service" && _id == ^._id + "-en"][0].slug.current
  ),
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
  "alternateSlug": select(
    $locale == "en" => *[_type == "service" && _id == string::split(^._id, "-en")[0]][0].slug.current,
    *[_type == "service" && _id == ^._id + "-en"][0].slug.current
  ),
  ${seoProjection}
}`);

const caseSectionsProjection = /* groq */ `
sections[]{
  _key,
  _type,
  hidden,
  headingWidth,
  _type == "caseHero" => {
    anio,
    imagenesProyecto[] ${imageProjection}
  },
  _type == "caseContext" => {
    retoEyebrow,
    retoTitle,
    reto,
    estrategiaEyebrow,
    estrategiaTitle,
    estrategia,
    servicios[]->{ "id": slug.current, nombre, "heroImage": coalesce(heroImage, sections[_type == "serviceHero"][0].image) ${imageProjection} }
  },
  _type == "caseProcess" => {
    eyebrow,
    title,
    description,
    fases[]{ title, description }
  },
  _type == "caseMetrics" => {
    eyebrow,
    title,
    description,
    items[]{ valor, label, prefix, suffix, decimals, antes, despues },
    primaryCta{ label, href },
    secondaryCta{ label, href }
  },
  _type == "caseTestimonial" => {
    eyebrow,
    title,
    description,
    "client": coalesce(testimonial->client, client),
    "quote": coalesce(testimonial->quote, quote),
    "name": coalesce(testimonial->name, name),
    "role": coalesce(testimonial->role, role),
    "stats": testimonial->stats[] ${storyStatProjection},
    "photo": testimonial->photo ${imageProjection}
  },
  _type == "caseRelated" => {
    eyebrow,
    title,
    description
  },
  _type == "caseCta" => {
    badge,
    title,
    description,
    primaryCta{ label, href }
  },
  ${beforeAfterProjection}
}`;

const caseBodyProjection = /* groq */ `
  "metricas": coalesce(sections[_type == "caseMetrics"][0].items[]{ valor, label, prefix, suffix, decimals, antes, despues }, metricas[]{ valor, label, prefix, suffix, decimals, antes, despues }),
  "reto": coalesce(sections[_type == "caseContext"][0].reto, reto),
  "estrategia": coalesce(sections[_type == "caseContext"][0].estrategia, estrategia),
  "fases": coalesce(sections[_type == "caseProcess"][0].fases[]{ title, description }, fases[]{ title, description }),
  "testimonio": coalesce(sections[_type == "caseTestimonial"][0]${testimonialFields}, testimonio{ quote, name, role }),
  "anio": coalesce(sections[_type == "caseHero"][0].anio, anio),
  "imagenesProyecto": coalesce(sections[_type == "caseHero"][0].imagenesProyecto[] ${imageProjection}, imagenesProyecto[] ${imageProjection}),
  ${caseSectionsProjection}
`;

export const casesQuery = defineQuery(`*[
  _type == "caseStudy" && defined(slug.current) && coalesce(locale, "es") == "es"
]{
  "id": slug.current,
  cliente,
  "industria": { "id": industria->slug.current },
  "servicios": coalesce(sections[_type == "caseContext"][0].servicios[]->{ "id": slug.current, nombre, "heroImage": coalesce(heroImage, sections[_type == "serviceHero"][0].image) ${imageProjection} }, servicios[]->{ "id": slug.current, nombre, "heroImage": coalesce(heroImage, sections[_type == "serviceHero"][0].image) ${imageProjection} }),
  titulo,
  resumen,
  destacado,
  accent,
  ${caseBodyProjection},
  ${seoProjection}
}`);

export const caseBySlugQuery = defineQuery(`*[
  _type == "caseStudy" && slug.current == $slug && coalesce(locale, "es") == "es"
][0]{
  "id": slug.current,
  cliente,
  "industria": { "id": industria->slug.current },
  "servicios": coalesce(sections[_type == "caseContext"][0].servicios[]->{ "id": slug.current, nombre, "heroImage": coalesce(heroImage, sections[_type == "serviceHero"][0].image) ${imageProjection} }, servicios[]->{ "id": slug.current, nombre, "heroImage": coalesce(heroImage, sections[_type == "serviceHero"][0].image) ${imageProjection} }),
  titulo,
  resumen,
  destacado,
  accent,
  ${caseBodyProjection},
  ${seoProjection}
}`);

export const postsQuery = defineQuery(`*[
  _type == "post" && defined(slug.current) && coalesce(locale, "es") == $locale
] | order(fecha desc) {
  "id": slug.current,
  title,
  description,
  keyword,
  autor,
  "authorName": coalesce(author->name, autor),
  "authorCard": author->{ name, role, company, linkedin, photo ${imageProjection} },
  fecha,
  featured,
  readingMinutes,
  "bodyText": pt::text(body),
  "categoriaServicio": { "id": categoriaServicio->slug.current, "nombre": categoriaServicio->nombre },
  "categoriaIndustria": { "id": categoriaIndustria->slug.current },
  cover ${imageProjection},
  faqs[]{ question, answer },
  ${seoProjection}
}`);

export const postBySlugQuery = defineQuery(`*[
  _type == "post" && slug.current == $slug && coalesce(locale, "es") == $locale
][0]{
  "id": slug.current,
  title,
  description,
  keyword,
  autor,
  "authorName": coalesce(author->name, autor),
  "authorCard": author->{ name, role, company, linkedin, photo ${imageProjection} },
  fecha,
  featured,
  "categoriaServicio": { "id": categoriaServicio->slug.current, "nombre": categoriaServicio->nombre },
  "categoriaIndustria": { "id": categoriaIndustria->slug.current },
  cover ${imageProjection},
  body,
  faqs[]{ question, answer },
  "alternateSlug": select(
    $locale == "en" => *[_type == "post" && coalesce(locale, "es") == "es" && slug.current == ^.esSlug][0].slug.current,
    *[_type == "post" && locale == "en" && esSlug == ^.slug.current][0].slug.current
  ),
  ${seoProjection}
}`);

export const peopleQuery = defineQuery(`*[
  _type == "person" && defined(name) && coalesce(locale, "es") == $locale
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
  "servicios": coalesce(sections[_type == "caseContext"][0].servicios[]->{ "id": slug.current, nombre }, servicios[]->{ "id": slug.current, nombre }),
  titulo,
  resumen,
  destacado,
  accent,
  "metricas": coalesce(sections[_type == "caseMetrics"][0].items[]{ valor, label, prefix, suffix, decimals, antes, despues }, metricas[]{ valor, label, prefix, suffix, decimals, antes, despues }),
  "reto": coalesce(sections[_type == "caseContext"][0].reto, reto),
  "estrategia": coalesce(sections[_type == "caseContext"][0].estrategia, estrategia),
  "fases": coalesce(sections[_type == "caseProcess"][0].fases[]{ title, description }, fases[]{ title, description }),
  "testimonio": coalesce(sections[_type == "caseTestimonial"][0]${testimonialFields}, testimonio{ quote, name, role })
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
  _type == "landingPage" && defined(slug.current) && coalesce(locale, "es") == "es"
] | order(title asc) {
  "id": slug.current,
  title,
  ${seoProjection}
}`);

export const landingBySlugQuery = defineQuery(`*[
  _type == "landingPage" && slug.current == $slug && coalesce(locale, "es") == "es"
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
    _type == "industryGrid" => {
      "cards": items[] ${industryCardProjection}
    },
    "cases": cases[]->${landingCaseProjection},
    "people": people[]->${landingPersonProjection},
    "faqFromLibrary": faqRefs[]->{ question, answer },
    ${beforeAfterProjection}
  },
  ${seoProjection}
}`);

export const calendarPageQuery = defineQuery(`*[_id == $id && _type == "calendarPage"][0]{
  title,
  bannerTitle,
  bannerSubtitle,
  fields[]{ _key, kind, label, placeholder, hint },
  services[]{ _key, label, serviceId, asksForWebsite },
  servicesError,
  servicesEmpty,
  weekdays,
  previousLabel,
  nextLabel,
  scheduleLabel,
  scheduleHint,
  loadingLabel,
  fullDayLabel,
  confirmLabel,
  pendingLabel,
  confirmedLabel,
  cancelledLabel,
  timezoneNote,
  cancelLabel,
  cancellingLabel,
  metaTitle,
  metaDescription
}`);

export const portalPageQuery = defineQuery(`*[_id == $id && _type == "portalPage"][0]{
  title,
  sections[]{
    _type,
    _key,
    hidden,
    headingWidth,
    _type == "portalHero" => {
      badge,
      badgeNote,
      title,
      description,
      clientName,
      windowTitle,
      proofTitle,
      proofText,
      tourLabel,
      viewerLabel,
      coachLabel,
      coachText,
      samples[]{ module, title, detail }
    },
    _type == "portalStrip" => { text, badges[]{ label, variant } },
    _type == "portalJourney" => {
      eyebrow,
      title,
      description,
      steps[]{ index, title, description, panelTitle, panelText, badge, badgeVariant }
    },
    _type == "portalBento" => {
      eyebrow,
      title,
      description,
      cards[]{ eyebrow, title, description, module }
    },
    _type == "portalFaq" => {
      eyebrow,
      title,
      description,
      searchPlaceholder,
      items[]{ question, answer, badge, category }
    },
    _type == "portalCloser" => {
      lead,
      title,
      description,
      primaryLabel,
      secondaryLabel,
      trust
    },
    ${beforeAfterProjection}
  },
  ${seoProjection}
}`);

export const sitePageQuery = defineQuery(`*[_id == $id && _type == "sitePage"][0]{
  title,
  eyebrow,
  description,
  metaTitle,
  metaDescription
}`);

export const contactPageQuery = defineQuery(`*[_type == "contactPage" && _id == "contactPage"][0]{
  title,
  bannerTitle,
  bannerSubtitle,
  submitLabel,
  servicesError,
  amountLabel,
  amountPlaceholder,
  budgetError,
  customBudgetError,
  fields[]{
    _key,
    kind,
    label,
    placeholder,
    hint,
    required,
    width
  },
  services[]{ _key, label },
  budgets[]{ _key, label, custom },
  metaTitle,
  metaDescription,
  noindex,
  canonicalPath
}`);

export const sitemapEntriesQuery = defineQuery(`{
  "industries": *[_type == "industry" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "services": *[_type == "service" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "cases": *[_type == "caseStudy" && defined(slug.current) && coalesce(locale, "es") == "es"]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "landings": *[_type == "landingPage" && defined(slug.current) && coalesce(locale, "es") == "es"]{ "slug": slug.current, _updatedAt }
}`);
