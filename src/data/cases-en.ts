import type { Metric, SeoFields, TitledBlock } from '../lib/content/types';

export interface EnglishCaseData {
  cliente: string;
  industria: { id: string; nombre: string };
  servicios: Array<{ id: string; nombre: string }>;
  resultadoFrase: string;
  titulo: string;
  resumen: string;
  destacado: boolean;
  accent: 'cyan' | 'orange' | 'purple';
  metricas: Metric[];
  reto: string;
  estrategia: string;
  fases: TitledBlock[];
  testimonio?: {
    quote: string;
    name: string;
    role: string;
    client?: string;
  };
  seo: SeoFields;
}

export const CASES_INDEX_EN = {
  eyebrow: 'Portfolio / Case Studies',
  title: 'Success Stories',
  description: 'Explore our track record and discover what we can achieve for your business.',
  seo: {
    metaTitle: 'Marketing Agency Portfolio | Real Projects & Verified Results',
    metaDescription: 'Explore our marketing agency case studies with verified results in SEO, web design, paid media, and growth marketing across competitive industries.',
  } satisfies SeoFields,
  closingTitle: 'Ready for a tailored diagnosis for your industry?',
} as const;

export const CASES_EN: Record<string, EnglishCaseData> = {
  'avant-rent-a-car': {
    cliente: 'Avant Rent a Car',
    industria: {
      id: 'hospitality-marketing-agency',
      nombre: 'Tourism / Hospitality',
    },
    servicios: [
      { id: 'seo', nombre: 'SEO Positioning' },
      { id: 'google-ads-management-services', nombre: 'Google Advertising' },
      { id: 'web-development', nombre: 'Web Design and Development' },
    ],
    resultadoFrase: '+37,000 new organic users',
    titulo: 'Car rental company in Cancún with a tourism focus, specialized in providing reliable mobility solutions to domestic and international travelers.',
    resumen: 'Discover how Hiweb optimized SEO, Google Ads, and the website for Avant Rent a Car to improve visibility, site performance, and customer acquisition across Cancún and international markets.',
    destacado: true,
    accent: 'cyan',
    metricas: [
      {
        valor: 37000,
        label: 'New organic users',
        prefix: '+',
        despues: 'Increase in qualified organic search visitors driven by a targeted bilingual SEO strategy.',
      },
      {
        valor: 10,
        label: 'Keywords in Top 10',
        prefix: '+',
        despues: 'Strategic high-intent travel keywords ranked within Google’s Top 10 during the project lifecycle.',
      },
      {
        valor: 4525,
        label: 'Conversions generated',
        prefix: '+',
        despues: 'Substantial increase in confirmed booking inquiries through Search and Performance Max campaigns.',
      },
      {
        valor: 123000,
        label: 'Page views',
        prefix: '+',
        despues: 'Total engagement and content interactions logged during the first full year of optimization.',
      },
    ],
    reto: 'Avant Rent a Car partnered with Hiweb to address three critical challenges:\n\n- **Organic search visibility:** Improve rankings on Google to capture high-value travel demand.\n- **Return on ad spend:** Maximize ROAS across targeted Google Ads search campaigns.\n- **Technical performance:** Resolve website bottlenecks that compromised site security, UX, and online booking conversion rates.',
    estrategia: '- **Optimization & Content Strategy:** Content restructuring, metadata enhancement, strategic blogging, and technical fixes derived from a comprehensive SEO audit to strengthen organic visibility.\n\n- **High-Intent Search Advertising:** Implementation of Google Search and Performance Max campaigns targeting high-intent travel queries and car rental keywords.\n\n- **UX & Conversion Optimization:** Redesign and architectural restructuring focused on frictionless user experience, clear calls-to-action, intuitive booking navigation, and seamless performance across mobile and desktop devices.',
    fases: [
      {
        title: 'Optimization & Content Architecture',
        description: 'Content restructuring, metadata optimization, blog publication cadence, and technical performance enhancements based on an in-depth SEO audit.',
      },
      {
        title: 'High-Intent Search Advertising',
        description: 'Execution of Google Ads Search and Display campaigns tailored to travelers with immediate rental intent, aligned with vehicle categories and seasonal demand.',
      },
      {
        title: 'UX & Conversion Optimization',
        description: 'Full website redesign with an intuitive booking flow, responsive layout, clear value propositions, and fast page speeds on both mobile and desktop.',
      },
    ],
    testimonio: {
      quote: 'The Google Ads campaigns were sharp, strategic, and laser-focused on attracting travelers with genuine rental intent.',
      name: 'Sebastian S.',
      role: 'Marketing Department, Avant Rent a Car',
    },
    seo: {
      metaTitle: 'Avant Rent a Car Case Study | SEO & Google Ads Growth | Hiweb',
      metaDescription: 'Discover how Hiweb drove +37,000 organic users and 4,500+ conversions for Avant Rent a Car through bilingual SEO, Google Ads, and UX optimization.',
    },
  },

  diazar: {
    cliente: 'Diazar',
    industria: {
      id: 'saas-marketing-agency',
      nombre: 'Software (SaaS)',
    },
    servicios: [
      { id: 'seo', nombre: 'SEO Positioning' },
      { id: 'web-development', nombre: 'Web Design and Development' },
      { id: 'social-media', nombre: 'Social Media' },
      { id: 'google-ads-management-services', nombre: 'Google Advertising' },
    ],
    resultadoFrase: '+2,100 new unique users',
    titulo: 'Specialized ERP software for construction and real estate development in Mexico, designed to streamline job site operations, project control, and executive decision-making.',
    resumen: 'Learn how Hiweb accelerated Diazar’s digital growth through SEO, modern web development, social media, and paid ads, building national brand authority and high commercial intent for its construction ERP platform.',
    destacado: true,
    accent: 'orange',
    metricas: [
      {
        valor: 2100,
        label: 'New unique users',
        prefix: '+',
        despues: 'Activation of steady, qualified traffic from a previously dormant digital footprint within the first 3 months.',
      },
      {
        valor: 2600,
        label: 'Website sessions',
        prefix: '+',
        despues: 'Sustained session volume generation following web redesign and technical SEO rollout.',
      },
      {
        valor: 42,
        label: 'Social media reach',
        prefix: '+',
        suffix: '%',
        despues: 'Expanded brand exposure among construction firms, contractors, and project managers.',
      },
      {
        valor: 31,
        label: 'Engagement rate',
        prefix: '+',
        suffix: '%',
        despues: 'Increased interaction across educational posts on job site control, budget management, and PropTech innovation.',
      },
    ],
    reto: 'Diazar needed to establish national search visibility, modernize its web platform, and build a commanding brand presence across digital channels. Coming to Hiweb organically through Google, their goal was to generate industry authority, educate construction decision-makers, and scale qualified B2B lead generation via website and social touchpoints.',
    estrategia: 'Brand Authority & Thought Leadership: Strategic B2B social content positioning the ERP platform, highlighting operational savings, and cementing thought leadership within the construction industry. National SEO Architecture: National search strategy encompassing technical SEO, site restructuring, optimized metadata, and in-depth blog guides targeting construction management software keywords. High-Conversion Website: Complete overhaul of the website prioritizing clear value propositions, interactive feature breakdowns, intuitive UX, and frictionless demo booking.',
    fases: [
      {
        title: 'Brand Authority & B2B Content',
        description: 'Social media and content strategy designed to position the Diazar brand, articulate core ERP modules, and establish thought leadership among developers and contractors.',
      },
      {
        title: 'National SEO Strategy',
        description: 'Targeted SEO execution focusing on national rankings, technical site health, modular content hubs, and construction software search intent.',
      },
      {
        title: 'Strategic Web Experience',
        description: 'Modern web redesign emphasizing value delivery, intuitive navigation, trust signals, and streamlined lead capture for enterprise sales teams.',
      },
    ],
    testimonio: {
      quote: 'The new website and digital strategy immediately helped us attract qualified enterprise leads genuinely eager to see the platform in action.',
      name: 'Carolina M.',
      role: 'Commercial Director, Diazar',
    },
    seo: {
      metaTitle: 'Diazar Case Study | SaaS SEO & Digital Strategy | Hiweb',
      metaDescription: 'Learn how Hiweb boosted Diazar’s digital presence through SEO, web redesign, and B2B marketing, generating +2,100 qualified users for its construction ERP.',
    },
  },

  'eagle-superabrasives': {
    cliente: 'Eagle Superabrasives',
    industria: {
      id: 'manufacturing-marketing-agency',
      nombre: 'Manufacturing',
    },
    servicios: [
      { id: 'web-development', nombre: 'Web Design and Development' },
      { id: 'seo', nombre: 'SEO Positioning' },
    ],
    resultadoFrase: '+1,600 new users',
    titulo: 'US manufacturer specialized in custom, high-precision Diamond, CBN, and CDX grinding wheels, serving global industrial manufacturers with tailored engineering solutions.',
    resumen: 'See how Hiweb redesigned and optimized Eagle Superabrasives’ digital presence in Mexico, strengthening technical site architecture, SEO, and top-tier industrial search rankings.',
    destacado: false,
    accent: 'cyan',
    metricas: [
      {
        valor: 1600,
        label: 'New users',
        prefix: '+',
        despues: 'Net new B2B users generated through the modern website design and localized search optimization.',
      },
      {
        valor: 1700,
        label: 'International reach',
        prefix: '+',
        despues: 'Active users attracted from precision manufacturing hubs across Mexico, the United States, and Asia.',
      },
      {
        valor: 2600,
        label: 'Page views',
        prefix: '+',
        despues: 'Surge in page views across key engineering product categories and technical documentation.',
      },
      {
        valor: 68,
        label: 'Organic clicks',
        prefix: '+',
        suffix: '%',
        despues: 'Substantial jump in organic search clicks driven by top-ranking industrial search terms.',
      },
    ],
    reto: 'Eagle Superabrasives needed to revamp its digital footprint in Mexico, not only upgrading its visual identity, but overhauling its site architecture, technical product catalog, and localized SEO. The primary objective was securing top rankings in industrial search engines and accurately translating complex engineering specifications for Spanish-speaking manufacturing buyers.',
    estrategia: 'Scalable B2B Web Architecture: Ground-up website redesign built for speed, technical precision, and industrial usability, providing engineers and procurement specialists with effortless access to wheel specifications. Industrial SEO Localization: Targeted technical SEO strategy for the Mexican industrial market, optimizing core web vitals, structured metadata, and custom keyword mapping for abrasive engineering solutions.',
    fases: [
      {
        title: 'Scalable Industrial Web Design',
        description: 'Full website restructuring focused on technical readability, intuitive product categorization, fast loading times, and B2B quote inquiries.',
      },
      {
        title: 'Industrial SEO & Localization',
        description: 'Strategic search engine optimization targeting high-value industrial machining and grinding queries across Mexico and Latin America.',
      },
    ],
    seo: {
      metaTitle: 'Eagle Superabrasives Case Study | Industrial Web & SEO | Hiweb',
      metaDescription: 'Discover how Hiweb transformed Eagle Superabrasives’ web presence and industrial SEO in Mexico, achieving a 68% increase in organic search clicks.',
    },
  },

  'el-secreto': {
    cliente: 'El Secreto',
    industria: {
      id: 'hospitality-marketing-agency',
      nombre: 'Tourism / Hospitality',
    },
    servicios: [
      { id: 'social-media', nombre: 'Social Media' },
      { id: 'meta-ads', nombre: 'Social Media Advertising' },
    ],
    resultadoFrase: '+52% social media reach',
    titulo: 'Curated concept boutique in Mérida, Mexico, celebrating feminine, timeless elegance through signature apparel and artisanal accessories designed for authentic self-expression.',
    resumen: 'See how Hiweb elevated brand awareness and boutique foot traffic for El Secreto through high-aesthetic social media curation and targeted Meta advertising in Mérida.',
    destacado: false,
    accent: 'orange',
    metricas: [
      {
        valor: 52,
        label: 'Social media reach',
        prefix: '+',
        suffix: '%',
        despues: 'Expanded organic and paid impression footprint across Instagram, Facebook, and TikTok.',
      },
      {
        valor: 41,
        label: 'Engagement rate',
        prefix: '+',
        suffix: '%',
        despues: 'Increased community engagement on collection reels, styling tips, and new arrival spotlights.',
      },
      {
        valor: 29,
        label: 'Saves & shares',
        prefix: '+',
        suffix: '%',
        despues: 'Surge in users bookmarking looks and sharing boutique selections with friends.',
      },
      {
        valor: 24,
        label: 'Brand recall',
        prefix: '+',
        suffix: '%',
        despues: 'Measurable uptick in local brand recognition among fashion-conscious shoppers.',
      },
    ],
    reto: 'El Secreto sought to expand its brand awareness and solidify its market standing as a premier concept boutique in a competitive retail landscape. The challenge was translating their distinctive in-store aesthetic into social media channels to attract stylish clientele, elevate local recognition, and drive customer traffic through targeted lifestyle campaigns.',
    estrategia: 'Visual Brand Storytelling: Tailored social media curation establishing visual cohesion, elevated creative direction, and an emotional bond with modern female shoppers. Targeted Awareness Media: High-impact paid campaigns across Instagram and Facebook focused on local reach, collection launches, and connecting with high-affinity fashion audiences.',
    fases: [
      {
        title: 'Brand Identity & Content Curation',
        description: 'Development of cohesive visual guidelines, collection showcases, and editorial video storytelling across Instagram and TikTok.',
      },
      {
        title: 'Targeted Discovery Advertising',
        description: 'Execution of hyper-local paid social campaigns to capture local fashion enthusiasts and stylish travelers visiting Mérida.',
      },
    ],
    seo: {
      metaTitle: 'El Secreto Case Study | Retail Fashion Marketing | Hiweb',
      metaDescription: 'Discover how Hiweb scaled brand reach by 52% for boutique concept store El Secreto through curated social media management and targeted Meta Ads.',
    },
  },

  'enfoque-21': {
    cliente: 'Enfoque 21',
    industria: {
      id: 'professional-services-marketing',
      nombre: 'Professional Services',
    },
    servicios: [
      { id: 'seo', nombre: 'SEO Positioning' },
      { id: 'social-media', nombre: 'Social Media' },
    ],
    resultadoFrase: '+27,900 new interactions',
    titulo: 'High-end destination wedding and portrait photography studio based in Mérida, Yucatán, capturing timeless love stories across luxury haciendas and scenic venues.',
    resumen: 'Learn how Hiweb positioned Enfoque 21 as a premier destination wedding photography studio through localized SEO, visual storytelling, and high-engagement social media campaigns.',
    destacado: false,
    accent: 'cyan',
    metricas: [
      {
        valor: 27900,
        label: 'New interactions',
        prefix: '+',
        despues: 'Overall volume of likes, shares, comments, and saves logged across portfolio showcases and reels.',
      },
      {
        valor: 147,
        label: 'Audience growth',
        prefix: '+',
        suffix: '%',
        despues: 'Accelerated subscriber and follower growth across engaged couples and wedding planners.',
      },
      {
        valor: 65,
        label: 'Engagement rate',
        prefix: '+',
        suffix: '%',
        despues: 'Deep community interaction with real wedding stories, venue walk-throughs, and bride showcases.',
      },
      {
        valor: 45,
        label: 'Consultation requests',
        prefix: '+',
        suffix: '%',
        despues: 'Increase in qualified inquiries submitted through the contact form and direct messages.',
      },
    ],
    reto: 'Enfoque 21 aimed to cement its standing as Mérida’s leading destination wedding photography studio, attracting couples seeking luxury venue shoots while standing out from local competitors. Coming to Hiweb organically, their goal was to generate high-intent inquiries from couples planning destination weddings in Yucatán and nearby colonial haciendas.',
    estrategia: 'Destination SEO Optimization: Localized search engine strategy centered on luxury destination wedding photography, wedding venues in Yucatán, and high-ticket bridal intent. Curated Visual Storytelling: Multi-channel social media strategy highlighting emotional real-wedding galleries, editorial reels, and cinematic behind-the-scenes footage. High-Impact Visibility Campaigns: Strategic ad campaigns amplifying portfolio highlights to affluent newly-engaged couples actively planning destination celebrations.',
    fases: [
      {
        title: 'Destination SEO Positioning',
        description: 'Local and regional SEO architecture ranking the studio for luxury wedding photography queries in Mérida and Riviera Maya.',
      },
      {
        title: 'Portfolio Storytelling',
        description: 'Elevated social media strategy focusing on real wedding narratives, couple testimonials, and hacienda venue showcases.',
      },
      {
        title: 'Targeted Bride & Groom Reach',
        description: 'Audience-targeted advertising reaching engaged couples domestically and abroad seeking photography services in southeastern Mexico.',
      },
    ],
    seo: {
      metaTitle: 'Enfoque 21 Case Study | Luxury Wedding Photography Growth | Hiweb',
      metaDescription: 'Explore how Hiweb generated +27,900 interactions and scaled wedding consultation inquiries for destination photography studio Enfoque 21.',
    },
  },

  gaios: {
    cliente: 'Gaios',
    industria: {
      id: 'restaurant-marketing',
      nombre: 'Restaurants',
    },
    servicios: [
      { id: 'social-media', nombre: 'Social Media' },
      { id: 'meta-ads', nombre: 'Social Media Advertising' },
    ],
    resultadoFrase: '+71.4% profile visits',
    titulo: 'Casual breakfast and brunch restaurant in Gran San Pedro Cholul, Mérida, known for wholesome dishes, vibrant flavors, and welcoming neighborhood hospitality.',
    resumen: 'Discover how Hiweb drove customer foot traffic and digital buzz for Gaios through mouthwatering audiovisual production, community management, and hyper-local Meta advertising.',
    destacado: false,
    accent: 'orange',
    metricas: [
      {
        valor: 71.4,
        label: 'Profile visits',
        prefix: '+',
        suffix: '%',
        decimals: 1,
        despues: 'Growth in food lovers navigating to the profile to view the menu, location pins, and daily specials.',
      },
      {
        valor: 62,
        label: 'Engagement rate',
        prefix: '+',
        suffix: '%',
        despues: 'Consistent interaction across likes, comments, and shares celebrating signature brunch dishes.',
      },
      {
        valor: 85,
        label: 'Content views',
        prefix: '+',
        suffix: '%',
        despues: 'Viral reach on appetizing video reels showcasing menu items and kitchen craftsmanship.',
      },
      {
        valor: 58,
        label: 'Link clicks',
        prefix: '+',
        suffix: '%',
        despues: 'Users tapping through to explore directions, Google Maps listings, and WhatsApp inquiries.',
      },
    ],
    reto: 'Gaios needed to build strong local awareness, stand out against established dining options, and consistently drive diner foot traffic to their newly expanded dining room. The goal was leveraging visual social media and targeted local ads to spark appetite, communicate their unique brunch menu, and turn online engagement into busy tables.',
    estrategia: 'Community Curation: Social media management focused on mouthwatering food showcases, warm hospitality, and engaging local neighborhood residents. Hyper-Local Paid Advertising: Geo-targeted campaigns across Facebook and Instagram targeting breakfast lovers and brunch enthusiasts within a precise local radius. High-Definition Audiovisual Production: On-site photo and video shoots capturing signature dishes, artisan drinks, and vibrant morning ambiance.',
    fases: [
      {
        title: 'Community & Appetite Building',
        description: 'Dynamic social media management highlighting daily specials, brunch favorites, and authentic customer moments.',
      },
      {
        title: 'Hyper-Local Advertising',
        description: 'Geo-targeted ad campaigns driving nearby foodies and families directly to the restaurant with map links and menu highlights.',
      },
      {
        title: 'Sensory Audiovisual Production',
        description: 'Professional video reels and food photography accentuating textures, sizzling plates, and the cozy dining atmosphere.',
      },
    ],
    seo: {
      metaTitle: 'Gaios Case Study | Restaurant & Brunch Marketing | Hiweb',
      metaDescription: 'See how Hiweb increased profile visits by 71.4% and drove diner foot traffic for brunch restaurant Gaios via food photography, video, and Meta Ads.',
    },
  },

  'happy-store': {
    cliente: 'Happy Store',
    industria: {
      id: 'professional-services-marketing',
      nombre: 'Retail / E-Commerce',
    },
    servicios: [
      { id: 'social-media', nombre: 'Social Media' },
      { id: 'meta-ads', nombre: 'Social Media Advertising' },
    ],
    resultadoFrase: '+76,300 video views',
    titulo: 'Online retailer specialized in 100% authentic imported beauty, skincare, personal care, and premium wellness supplements from internationally recognized brands.',
    resumen: 'Learn how Hiweb scaled brand visibility, social engagement, and online store sales for Happy Store through dynamic video content, community building, and high-converting e-commerce ads.',
    destacado: true,
    accent: 'purple',
    metricas: [
      {
        valor: 76300,
        label: 'Video views',
        prefix: '+',
        despues: 'Doubled content video viewership within the first 30 days after a prolonged period of plateau.',
      },
      {
        valor: 98,
        label: 'Social media reach',
        prefix: '+',
        suffix: '%',
        despues: 'Broadened reach introducing products to fresh audiences seeking authentic imported skincare.',
      },
      {
        valor: 738,
        label: 'Interactions',
        prefix: '+',
        despues: 'Sharp rise in likes, comments, and saves fueled by practical beauty tips and product demos.',
      },
      {
        valor: 95,
        label: 'Link clicks',
        prefix: '+',
        suffix: '%',
        despues: 'Direct traffic driven from social platforms directly into checkout and product landing pages.',
      },
    ],
    reto: 'Happy Store wanted to break through stagnant online growth, build consumer trust against counterfeit cosmetics in the market, and accelerate e-commerce sales. The objective was outshining competing digital shops by showcasing authenticity, educating buyers on skincare routines, and launching conversion-focused ad funnels.',
    estrategia: 'Audience Nurturing & Lifestyle Content: Social media strategy designed around skincare routines, ingredient spotlights, and authentic self-care education. E-Commerce Paid Acquisition: Multi-tier ad funnels targeting impulse and intent buyers, optimized for catalog sales, retargeting, and add-to-cart conversions. Short-Form Video Production: Dynamic video creation demonstrating product unboxings, textures, application routines, and verified authenticity seals.',
    fases: [
      {
        title: 'Audience Growth & Trust',
        description: 'Strategic content positioning Happy Store as a verified, knowledgeable authority for imported cosmetics and wellness.',
      },
      {
        title: 'Conversion-Focused Ad Funnels',
        description: 'Full-funnel Meta advertising targeting beauty enthusiasts with product discovery, reviews, and seasonal promotions.',
      },
      {
        title: 'Product & Lifestyle Production',
        description: 'Engaging unboxing videos, before-and-after reels, and product demonstrations that remove purchase hesitation.',
      },
    ],
    testimonio: {
      quote: 'Hiweb helped our brand look significantly more polished, professional, and trustworthy. We now have a genuine connection with the customers who shop with us every week.',
      name: 'Amanda D.',
      role: 'Founder, Happy Store',
    },
    seo: {
      metaTitle: 'Happy Store Case Study | E-Commerce Beauty Marketing | Hiweb',
      metaDescription: 'Discover how Hiweb generated +76,300 views and increased e-commerce link clicks by 95% for Happy Store through social media and paid advertising.',
    },
  },

  'industrial-basanlo': {
    cliente: 'Industrial Basanlo',
    industria: {
      id: 'manufacturing-marketing-agency',
      nombre: 'Manufacturing',
    },
    servicios: [
      { id: 'seo', nombre: 'SEO Positioning' },
      { id: 'web-development', nombre: 'Web Design and Development' },
    ],
    resultadoFrase: '+5,300 new users',
    titulo: 'Heavy machinery rental and sales provider specializing in industrial logistics, lifting solutions, and construction equipment headquartered in Monterrey, Nuevo León.',
    resumen: 'Discover how Hiweb drove organic growth and search engine supremacy for Industrial Basanlo, generating qualified industrial leads, top keyword rankings, and enhanced web performance.',
    destacado: false,
    accent: 'orange',
    metricas: [
      {
        valor: 5300,
        label: 'New users',
        prefix: '+',
        despues: 'Generated primarily from high-intent B2B organic searches on Google.',
      },
      {
        valor: 79,
        label: 'Organic traffic growth',
        prefix: '+',
        suffix: '%',
        despues: 'Substantial increase in search engine visits driven by structured equipment catalogs.',
      },
      {
        valor: 20,
        label: 'Keywords in Top 10',
        prefix: '+',
        despues: 'High-value industrial machinery terms ranking on Google’s first page.',
      },
      {
        valor: 312,
        label: 'Monthly site visits',
        prefix: '+',
        despues: 'Sustained average monthly qualified organic visits throughout the campaign period.',
      },
    ],
    reto: 'Industrial Basanlo needed to strengthen its digital footprint in Monterrey and northern Mexico, capturing high-value machinery rental and equipment purchase intent from construction and manufacturing contractors. Their website suffered from limited visibility on critical industrial queries, missing out on valuable equipment inquiries.',
    estrategia: 'Machinery Catalog SEO: In-depth search engine optimization structuring dedicated landing pages for equipment models, specifications, and rental terms. High-Speed Web Development: Re-engineered website emphasizing lightning-fast loading speeds, mobile responsiveness for site supervisors, and prominent RFQ touchpoints. B2B Industrial Keyword Dominance: Comprehensive content optimization targeting high-intent industrial queries such as crane rentals, heavy machinery logistics, and lifting equipment.',
    fases: [
      {
        title: 'Technical Site Optimization',
        description: 'Rebuilt digital infrastructure with fast load times, clear equipment categories, and direct quote request forms.',
      },
      {
        title: 'Industrial SEO & Content',
        description: 'Targeted SEO execution capturing construction and industrial search intent across Monterrey and northern Mexico.',
      },
    ],
    seo: {
      metaTitle: 'Industrial Basanlo Case Study | Heavy Machinery SEO & Web | Hiweb',
      metaDescription: 'Learn how Hiweb boosted Industrial Basanlo’s search rankings with +5,300 new users and a 79% organic traffic surge for industrial machinery rentals in Mexico.',
    },
  },

  'pass-your-toefl': {
    cliente: 'Pass Your TOEFL',
    industria: {
      id: 'professional-services-marketing',
      nombre: 'Professional Services',
    },
    servicios: [
      { id: 'seo', nombre: 'SEO Positioning' },
      { id: 'web-development', nombre: 'Web Design and Development' },
      { id: 'google-ads-management-services', nombre: 'Google Advertising' },
    ],
    resultadoFrase: '+2,300 new users',
    titulo: 'Specialized TOEFL coaching and test-prep academy tailored for Spanish-speaking professionals and students seeking high-score admissions abroad.',
    resumen: 'Discover how Hiweb scaled student enrollments for Pass Your TOEFL through bilingual SEO, a high-converting web platform, and targeted Google Ads for premium educational programs.',
    destacado: false,
    accent: 'orange',
    metricas: [
      {
        valor: 2300,
        label: 'New users',
        prefix: '+',
        despues: 'Qualified prospective students generated during the initial semester through combined digital channels.',
      },
      {
        valor: 1000,
        label: 'Monthly page views',
        prefix: '+',
        suffix: '%',
        despues: 'Explosive growth in content consumption, expanding from 60 to over 700 monthly visits in just 8 months.',
      },
      {
        valor: 78,
        label: 'Organic traffic',
        prefix: '+',
        suffix: '%',
        despues: 'Surge in qualified international search visitors looking for TOEFL test mastery.',
      },
      {
        valor: 65,
        label: 'Conversion intent',
        prefix: '+',
        suffix: '%',
        despues: 'Significant increase in diagnostic test submissions, consultation calls, and program enrollments.',
      },
    ],
    reto: 'Pass Your TOEFL required a high-converting digital presence capable of commanding premium pricing for high-ticket prep courses. Arriving at Hiweb organically from Google, they wanted to move away from low-margin tutoring perception, expand international student reach across the Americas, and build a predictable admissions funnel.',
    estrategia: 'Global EdTech SEO: Implementation of educational content clusters and international SEO targeting TOEFL preparation queries, score requirements, and test strategies. High-Ticket Conversion Funnel: Ground-up website redesign highlighting curriculum rigor, diagnostic score guarantees, student success stories, and seamless placement call booking. High-Intent Search Ads: Google Search campaigns targeting professionals actively preparing for university admissions, immigration exams, or medical board certifications.',
    fases: [
      {
        title: 'International EdTech SEO',
        description: 'SEO strategy and comprehensive study guides addressing specific test-taker hurdles, driving high-intent international traffic.',
      },
      {
        title: 'Conversion Architecture',
        description: 'Conversion-optimized website redesign featuring interactive score calculators, alumni video proof, and streamlined assessment booking.',
      },
      {
        title: 'High-Intent Student Acquisition',
        description: 'Google Ads campaigns targeting high-intent test-takers needing urgent preparation for upcoming exam deadlines.',
      },
    ],
    testimonio: {
      quote: 'We hired Hiweb to help us enroll more students, and the results have exceeded our expectations. Since day one, we’ve seen a clear, consistent uptick in admissions. The team is remarkably professional, proactive, and invested in our success. They truly feel like an extension of our internal team.',
      name: 'Gaby M.',
      role: 'Marketing Coordinator, Pass Your TOEFL',
    },
    seo: {
      metaTitle: 'Pass Your TOEFL Case Study | EdTech SEO & Growth | Hiweb',
      metaDescription: 'Learn how Hiweb scaled Pass Your TOEFL with +2,300 new students, a 10x traffic expansion, and 65% higher conversion intent via SEO and Google Ads.',
    },
  },

  'paulos-pizza': {
    cliente: 'Paulo’s Pizza',
    industria: {
      id: 'restaurant-marketing',
      nombre: 'Restaurants',
    },
    servicios: [
      { id: 'social-media', nombre: 'Social Media' },
      { id: 'meta-ads', nombre: 'Social Media Advertising' },
    ],
    resultadoFrase: '+14.6% profile visits',
    titulo: 'Artisanal stone-oven pizzeria in Mérida, Yucatán, dedicated to authentic slow-fermented crusts, fresh local ingredients, and cozy community dining.',
    resumen: 'See how Hiweb increased pizzeria foot traffic and local craving for Paulo’s Pizza through mouthwatering video storytelling, social media management, and local Meta Ads in Mérida.',
    destacado: false,
    accent: 'cyan',
    metricas: [
      {
        valor: 14.6,
        label: 'Profile visits',
        prefix: '+',
        suffix: '%',
        decimals: 1,
        despues: 'Steady stream of hungry patrons visiting the profile after discovering enticing pizza reels.',
      },
      {
        valor: 65.7,
        label: 'Total reach',
        prefix: '+',
        suffix: '%',
        decimals: 1,
        despues: 'Wide organic and paid exposure reaching pizza lovers across northern Mérida.',
      },
      {
        valor: 41,
        label: 'Link clicks',
        prefix: '+',
        suffix: '%',
        despues: 'Increased customer clicks to view the full menu, check opening hours, or call for takeout.',
      },
      {
        valor: 28,
        label: 'Direct inquiries',
        prefix: '+',
        suffix: '%',
        despues: 'Uptick in direct messages on WhatsApp and Instagram asking for table availability and specials.',
      },
    ],
    reto: 'Paulo’s Pizza aimed to solidify its reputation as the neighborhood’s favorite craft pizzeria, distinguishing its stone-oven technique from industrial fast-food chains. Their goal was engaging pizza lovers across social channels, highlighting the authenticity of their ingredients, and converting mouthwatering visuals into busy dining rooms and weekend takeout orders.',
    estrategia: 'Sensory Food Storytelling: Creative video reels and photography capturing bubbling mozzarella, wood-fired flames, hand-stretched dough, and genuine kitchen passion. Hyper-Local Craving Ads: Targeted Meta advertising focused on evening and weekend hunger peaks within delivery and dining radiuses. Interactive Social Management: Community management featuring weekly flavor spotlights, behind-the-counter banter, and rapid responses to diner questions.',
    fases: [
      {
        title: 'Wood-Fired Visual Storytelling',
        description: 'Content production focusing on the craft of slow fermentation, hand-stretched dough, and stone-oven baking.',
      },
      {
        title: 'Local Dinner & Weekend Campaigns',
        description: 'Targeted ads launched during dinner hours and weekends driving immediate hunger, table reservations, and takeout orders.',
      },
    ],
    seo: {
      metaTitle: 'Paulo’s Pizza Case Study | Artisanal Restaurant Growth | Hiweb',
      metaDescription: 'Discover how Hiweb grew profile visits by 14.6% and expanded reach by 65.7% for Paulo’s Pizza in Mérida through food reels and targeted Meta Ads.',
    },
  },

  'peninsula-project': {
    cliente: 'Península Project',
    industria: {
      id: 'hospitality-marketing-agency',
      nombre: 'Tourism / Hospitality',
    },
    servicios: [
      { id: 'social-media', nombre: 'Social Media' },
      { id: 'meta-ads', nombre: 'Social Media Advertising' },
    ],
    resultadoFrase: '+47% social media reach',
    titulo: 'Bespoke travel experience agency in Yucatán, curating private cultural journeys, secret cenote excursions, and authentic eco-tourism adventures for curious travelers.',
    resumen: 'Discover how Hiweb amplified brand discovery and booking inquiries for Península Project through evocative travel storytelling, community curation, and targeted paid campaigns.',
    destacado: false,
    accent: 'cyan',
    metricas: [
      {
        valor: 47,
        label: 'Social media reach',
        prefix: '+',
        suffix: '%',
        despues: 'Expanded digital footprint among domestic and international travelers searching for Yucatán adventures.',
      },
      {
        valor: 39,
        label: 'Engagement rate',
        prefix: '+',
        suffix: '%',
        despues: 'Deep audience interaction with travel stories, cultural reels, and scenic nature clips.',
      },
      {
        valor: 33,
        label: 'Saves & bookmarks',
        prefix: '+',
        suffix: '%',
        despues: 'Travelers bookmarking recommended itineraries, hidden cenotes, and historic hacienda stops.',
      },
      {
        valor: 25,
        label: 'Trip inquiries',
        prefix: '+',
        suffix: '%',
        despues: 'Consistent increase in direct inquiries requesting custom tour quotes and private bookings.',
      },
    ],
    reto: 'Península Project needed to elevate its brand recognition in a crowded tourist corridor, distinguishing its authentic, tailored cultural journeys from cookie-cutter commercial bus tours. The challenge was inspiring sophisticated travelers seeking meaningful off-the-beaten-path experiences and guiding them toward private booking consultations.',
    estrategia: 'Evocative Travel Storytelling: Visual social media narrative centered on secret cenotes, Mayan traditions, culinary encounters, and responsible travel. Discovery Advertising Campaigns: Paid Meta advertising reaching high-intent travelers researching upcoming trips to the Yucatán peninsula. Community Engagement: Interactive travel guides and real guest testimonials showcasing the magic of customized, private itineraries.',
    fases: [
      {
        title: 'Authentic Visual Storytelling',
        description: 'Documentary-style photography and cinematic reels showcasing hidden wonders of Yucatán, connecting emotionally with conscious travelers.',
      },
      {
        title: 'Targeted Traveler Acquisition',
        description: 'Hyper-targeted campaigns reaching independent travelers planning trips to the region, inviting them to co-design bespoke itineraries.',
      },
    ],
    testimonio: {
      quote: 'People now truly understand the depth of what we do. Our social channels help us tell the genuine story of traveling with Península Project, rather than just showing pretty destinations.',
      name: 'Lydia R.',
      role: 'Head of Guest Experiences, Península Project',
    },
    seo: {
      metaTitle: 'Península Project Case Study | Bespoke Travel Marketing | Hiweb',
      metaDescription: 'Learn how Hiweb boosted reach by 47% and scaled private tour inquiries for Península Project through visual storytelling and targeted travel ads.',
    },
  },

  'residenciales-merida': {
    cliente: 'Residenciales Mérida',
    industria: {
      id: 'real-estate-marketing-agency',
      nombre: 'Real Estate',
    },
    servicios: [
      { id: 'social-media', nombre: 'Social Media' },
      { id: 'meta-ads', nombre: 'Social Media Advertising' },
    ],
    resultadoFrase: '+197,900 views',
    titulo: 'Premier real estate brokerage in Yucatán, specialized in marketing and closing premium residential developments, master-planned communities, and investment land.',
    resumen: 'Discover how Hiweb scaled brand visibility and qualified investor lead generation for Residenciales Mérida through high-performance Meta Ads and cinematic property tours.',
    destacado: false,
    accent: 'purple',
    metricas: [
      {
        valor: 197900,
        label: 'Video views',
        prefix: '+',
        despues: 'Broad exposure across property tours and investment breakdowns in a highly competitive market.',
      },
      {
        valor: 315.4,
        label: 'Social media reach',
        prefix: '+',
        suffix: '%',
        decimals: 1,
        despues: 'Massive increase in unique prospective buyers exposed to residential offerings.',
      },
      {
        valor: 417,
        label: 'Link clicks',
        prefix: '+',
        despues: 'High-intent buyer clicks navigating to project brochures, master plans, and sales consultations.',
      },
      {
        valor: 137,
        label: 'New followers',
        prefix: '+',
        suffix: '%',
        despues: 'Steady expansion of an active community of property buyers and real estate investors.',
      },
    ],
    reto: 'Residenciales Mérida needed to command market attention and generate qualified property buyer leads in one of Latin America’s most fiercely competitive real estate booms. The challenge was standing out among hundreds of brokers, filtering out unqualified inquiries, and consistently feeding sales advisors with serious investors.',
    estrategia: 'Cinematic Property Showcases: High-production video tours, drone flyovers, and architectural walkthroughs across Instagram, Facebook, and TikTok detailing amenities and investment value. Performance Lead Advertising: Segmented Meta Ad funnels targeted by purchasing power, geographical investor hubs (Mexico City, Monterrey, USA/Canada), and lifestyle affinity. Brand Trust & Educational Content: Infographics and market analysis videos breaking down capital appreciation, legal security, and return on investment in Yucatán.',
    fases: [
      {
        title: 'Strategic Real Estate Content',
        description: 'Omnichannel content management (Facebook, Instagram, TikTok) delivering clear project presentations, master plan highlights, and lifestyle storytelling.',
      },
      {
        title: 'Investor Lead Generation Funnels',
        description: 'Targeted paid campaigns optimized for high-net-worth buyers, driving instant lead forms and scheduled private consultations.',
      },
      {
        title: 'Audiovisual Production & Drone Tours',
        description: 'On-site video production and drone footage highlighting construction progress, luxury amenities, and prime geographic connectivity.',
      },
    ],
    seo: {
      metaTitle: 'Residenciales Mérida Case Study | Real Estate Marketing | Hiweb',
      metaDescription: 'Explore how Hiweb generated +197,900 views and a 315% reach surge for Residenciales Mérida through video property tours and targeted real estate ad funnels.',
    },
  },

  restaura: {
    cliente: 'Restaura',
    industria: {
      id: 'healthcare-marketing-agency',
      nombre: 'Healthcare',
    },
    servicios: [
      { id: 'social-media', nombre: 'Social Media' },
      { id: 'meta-ads', nombre: 'Social Media Advertising' },
    ],
    resultadoFrase: '+35% engagement',
    titulo: 'Specialized digital dental laboratory in Mérida, dedicated to CAD/CAM precision prosthetics, ceramic restorations, and dental aesthetics for clinical dentists.',
    resumen: 'Learn how Hiweb elevated B2B awareness and clinical partnerships for Restaura Dental Lab through technical social media communication and targeted healthcare advertising.',
    destacado: false,
    accent: 'purple',
    metricas: [
      {
        valor: 35,
        label: 'Engagement rate',
        prefix: '+',
        suffix: '%',
        despues: 'Heightened interaction from dentists on clinical cases, material specs, and digital workflows.',
      },
      {
        valor: 48,
        label: 'Social reach',
        prefix: '+',
        suffix: '%',
        despues: 'Expanded visibility among dental clinics, specialists, and cosmetic practices.',
      },
      {
        valor: 30,
        label: 'Inquiry rate',
        prefix: '+',
        suffix: '%',
        despues: 'Increase in direct doctor messages seeking lab price sheets and case pickups.',
      },
      {
        valor: 25,
        label: 'Brand positioning',
        prefix: '+',
        suffix: '%',
        despues: 'Stronger brand recall and professional prestige across the regional dental community.',
      },
    ],
    reto: 'Restaura needed to establish itself as the premier specialized digital dental laboratory for clinics and prosthodontists. Their challenge was communicating technical precision, high-grade materials, and rapid turnaround times to busy dentists who demand uncompromised clinical quality.',
    estrategia: 'Technical B2B Communication: Professional social media content translating dental technology, milling precision, and clinical case studies into compelling visual proof. Clinician-Targeted Paid Campaigns: Focused ad campaigns reaching practicing dentists, oral surgeons, and cosmetic clinics across Yucatán and the southeast. Educational Authority: Showcases on CAD/CAM workflows, digital smile design, and ceramic artistry reinforcing Restaura’s technological leadership.',
    fases: [
      {
        title: 'Technical B2B Communication',
        description: 'Content strategy centered on laboratory engineering, CAD/CAM accuracy, dental materials, and clinical case outcomes.',
      },
    ],
    seo: {
      metaTitle: 'Restaura Case Study | Dental B2B Lab Marketing | Hiweb',
      metaDescription: 'Discover how Hiweb grew engagement by 35% and clinical inquiries by 30% for Restaura Dental Laboratory through targeted B2B medical marketing.',
    },
  },

  'zapateria-la-peninsula': {
    cliente: 'Zapatería La Península',
    industria: {
      id: 'professional-services-marketing',
      nombre: 'Retail / Footwear',
    },
    servicios: [
      { id: 'social-media', nombre: 'Social Media' },
      { id: 'meta-ads', nombre: 'Social Media Advertising' },
    ],
    resultadoFrase: '+450,000 views on TikTok',
    titulo: 'Regional footwear and fashion retail chain with 4 physical branch locations in Mérida, Yucatán, offering stylish shoes for every family member.',
    resumen: 'See how Hiweb drove viral retail reach and higher average order value for Zapatería La Península through trend-driven TikTok videos, social media management, and local Meta Ads.',
    destacado: false,
    accent: 'purple',
    metricas: [
      {
        valor: 450000,
        label: 'TikTok views',
        prefix: '+',
        despues: 'Massive organic viral growth driven by entertaining, relatable footwear video content.',
      },
      {
        valor: 84.7,
        label: 'Engagement rate',
        prefix: '+',
        suffix: '%',
        decimals: 1,
        despues: 'Outstanding audience involvement across viral clips, comments, and retail promotions.',
      },
      {
        valor: 37300,
        label: 'Facebook views',
        prefix: '+',
        despues: 'Consistent video consumption across loyal local family audiences in Yucatán.',
      },
      {
        valor: 664,
        label: 'Instagram followers',
        prefix: '+',
        despues: 'Steady net-new community growth of active local shoppers throughout the campaign.',
      },
    ],
    reto: 'Zapatería La Península wanted to increase foot traffic across its 4 physical store locations in Mérida, revitalize brand perception among younger generations, and increase customer basket size in a competitive footwear market dominated by department store chains.',
    estrategia: 'Trend-Driven Video Production: Viral, relatable TikTok and Instagram Reels featuring seasonal footwear trends, back-to-school essentials, and store try-ons. Retail Conversion Advertising: Geo-targeted promotional campaigns announcing flash sales, seasonal discounts, and new collection arrivals directly to shoppers within minutes of each store. Multi-Branch Store Promotion: Clear highlight of branch addresses, local parking, and WhatsApp inventory checks to simplify the in-store buying journey.',
    fases: [
      {
        title: 'Brand Modernization & Social Management',
        description: 'Full-scale social media overhaul engaging younger families and trend-conscious shoppers with upbeat lifestyle content.',
      },
      {
        title: 'Retail Paid Advertising',
        description: 'Geo-targeted paid campaigns boosting store footfall, seasonal clearances, and holiday shopping sprees.',
      },
      {
        title: 'Audiovisual Production & Trend Reels',
        description: 'On-location store filming focusing on fit, footwear styling, comfort, and affordable family fashion.',
      },
    ],
    seo: {
      metaTitle: 'Zapatería La Península Case Study | Retail Footwear Marketing | Hiweb',
      metaDescription: 'Learn how Hiweb drove +450,000 TikTok views and boosted retail foot traffic for Zapatería La Península through creative video and localized ads.',
    },
  },
};
