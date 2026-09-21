import type { FaqItem, SeoFields, TitledBlock } from '../lib/content/types';

export type WebflowServiceCopy = {
  nombre: string;
  orden: number;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  heroBadge: string;
  cards: TitledBlock[];
  proceso: TitledBlock[];
  faqs: FaqItem[];
  seo: SeoFields;
};

export const WEBFLOW_SERVICES_INDEX = {
  eyebrow: 'Servicios',
  title: 'Servicios de marketing digital en México',
  description:
    'Unificamos estrategia, ejecución y medición para escalar demanda y ventas. Elige un servicio o trabaja un stack completo.',
} as const;

export const WEBFLOW_SERVICES = {
  "seo": {
    "nombre": "SEO",
    "orden": 2,
    "heroTitle": "Agencia de Posicionamiento SEO y AEO: Dominamos la Intención de Búsqueda",
    "heroDescription": "En Hiweb, no solo posicionamos páginas; construimos autoridad. Combinamos las estrategias tradicionales de una agencia de servicios SEO con la nueva era del AEO (Answer Engine Optimization) para que tu marca no solo aparezca en Google, sino que sea la respuesta elegida por las IAs.",
    "heroBadge": "SEO / AEO",
    "cards": [
      {
        "title": "SEO Local para dominar tu ciudad",
        "description": "Optimizamos tu presencia en Google Maps y búsquedas locales para que los clientes cercanos te encuentren primero. Ideal para negocios físicos y servicios profesionales."
      },
      {
        "title": "SEO nacional y e-commerce",
        "description": "Arquitecturas de información escalables para empresas con alcance en todo México. Desde categorías hasta SEO técnico para tiendas en línea."
      },
      {
        "title": "SEO técnico y AEO",
        "description": "Corregimos velocidad, datos estructurados y Core Web Vitals, y adaptamos tu contenido para el Zero-Click Search y los motores de respuesta."
      }
    ],
    "proceso": [
      {
        "title": "Auditoría SEO técnica",
        "description": "Analizamos velocidad, estructura, errores de rastreo y oportunidades de mejora en tu sitio actual."
      },
      {
        "title": "Investigación de keywords",
        "description": "Identificamos las palabras clave con mayor volumen y menor competencia para tu industria y ciudad."
      },
      {
        "title": "Optimización on-page",
        "description": "Corregimos títulos, meta descripciones, estructura de encabezados, schema y contenido de cada página."
      },
      {
        "title": "Contenido estratégico",
        "description": "Creamos blogs y páginas de aterrizaje orientadas a captar tráfico orgánico calificado."
      },
      {
        "title": "Linkbuilding",
        "description": "Generamos enlaces de calidad desde sitios relevantes para aumentar la autoridad de tu dominio."
      },
      {
        "title": "Reporte mensual",
        "description": "Mostramos el progreso en posiciones, tráfico orgánico y conversiones con datos reales de Search Console y Semrush."
      }
    ],
    "tagline": "Posicionamiento orgánico basado en datos para captar demanda existente.",
    "faqs": [
      {
        "question": "¿Cómo funciona el posicionamiento web en México?",
        "answer": "El posicionamiento web en México se basa en optimizar tu sitio para que aparezca en los primeros resultados cuando tus clientes potenciales buscan tus servicios en Google. Esto incluye SEO local, SEO nacional y estrategias adaptadas al mercado mexicano."
      },
      {
        "question": "¿Cómo miden los resultados como agencia SEO?",
        "answer": "Como agencia SEO de posicionamiento web, medimos tráfico orgánico, ranking de palabras clave, tasa de conversión y crecimiento de visibilidad en buscadores. Entregamos reportes claros para que conozcas el impacto real de la estrategia."
      },
      {
        "question": "¿Cuánto tiempo tarda en dar resultados una agencia de SEO?",
        "answer": "El SEO es una estrategia de mediano plazo. Generalmente, una agencia de SEO comienza a mostrar mejoras visibles entre 3 y 6 meses, dependiendo del sector, competencia y estado inicial del sitio."
      },
      {
        "question": "¿El servicio de agencia de posicionamiento incluye SEO técnico?",
        "answer": "Sí. Como agencia de posicionamiento, realizamos auditorías técnicas para mejorar velocidad, estructura, indexación y Core Web Vitals, factores clave para que Google posicione tu sitio correctamente."
      },
      {
        "question": "¿Hiweb es una agencia de SEO en México con experiencia comprobada?",
        "answer": "Sí. Somos una agencia de SEO en México con experiencia en múltiples industrias. Hemos logrado posicionar empresas a nivel local, nacional e internacional, mejorando su tráfico orgánico y sus conversiones."
      },
      {
        "question": "¿Por qué elegir una agencia de posicionamiento web como Hiweb?",
        "answer": "En Hiweb somos la mejor agencia seo enfocada en resultados medibles. No solo optimizamos tu sitio, diseñamos una estrategia integral que combina auditoría técnica, optimización de contenido y análisis competitivo para lograr mayor visibilidad y generación de leads."
      },
      {
        "question": "¿Pueden posicionar mi empresa a nivel local y nacional?",
        "answer": "Sí. Nuestra agencia de servicios SEO desarrolla estrategias tanto para posicionamiento local (Google Maps y búsquedas geolocalizadas) como para posicionamiento nacional en mercados más amplios."
      },
      {
        "question": "¿Qué diferencia a Hiweb como agencia SEO de posicionamiento web?",
        "answer": "Como agencia SEO de posicionamiento web, trabajamos con un enfoque estratégico y técnico. Analizamos tu competencia, optimizamos la estructura del sitio y desarrollamos contenido alineado con las búsquedas reales de tu público objetivo."
      },
      {
        "question": "¿Qué hace una agencia de posicionamiento en buscadores?",
        "answer": "Una agencia de posicionamiento en buscadores optimiza tu sitio para que Google lo considere relevante y lo muestre en los primeros lugares. Los servicios seo implican mejoras técnicas, contenido estratégico y monitoreo constante del rendimiento."
      },
      {
        "question": "¿Qué incluye el servicio de una agencia de servicios SEO?",
        "answer": "Nuestra agencia de servicios SEO incluye auditoría técnica del sitio, investigación estratégica de palabras clave, optimización on-page, mejoras de velocidad y estructura, estrategia de contenidos y reportes mensuales de tráfico y posicionamiento."
      },
      {
        "question": "¿Qué es el SEO y el AEO?",
        "answer": "El SEO (Search Engine Optimization) optimiza tu sitio para aparecer en Google. El AEO (Answer Engine Optimization) lo prepara para ser la respuesta directa en IAs como Gemini, Perplexity o ChatGPT. En Hiweb combinamos ambas disciplinas."
      },
      {
        "question": "¿Cuánto tiempo tarda en dar resultados el SEO?",
        "answer": "Los primeros resultados orgánicos se ven generalmente entre 3 y 6 meses. El SEO es una inversión a largo plazo: una vez posicionado, el tráfico es constante sin depender de presupuesto publicitario."
      },
      {
        "question": "¿Cuánto cuesta el servicio de SEO en México?",
        "answer": "El costo varía según el alcance del proyecto. En Hiweb ofrecemos planes desde SEO local hasta estrategias nacionales e internacionales. Contáctanos para una cotización personalizada basada en tu industria y objetivos."
      },
      {
        "question": "¿Qué diferencia a Hiweb de otras agencias de SEO?",
        "answer": "Hiweb combina SEO técnico, contenido estratégico y AEO en una sola estrategia. Trabajamos con datos reales, reportes transparentes y reuniones mensuales para ajustar el roadmap según los resultados."
      },
      {
        "question": "¿Hacen SEO local y nacional?",
        "answer": "Sí. Ofrecemos SEO local para dominar búsquedas en ciudades específicas (Google Maps, paquete local), SEO nacional para empresas con presencia en todo México, y SEO internacional para marcas que operan en múltiples países."
      }
    ],
    "seo": {
      "metaTitle": "Agencia de Posicionamiento SEO y AEO en México | Hiweb",
      "metaDescription": "Agencia de posicionamiento SEO y AEO en México. Especialistas en SEO local, nacional e internacional y optimización para motores de respuesta. ¡Cotiza hoy!"
    }
  },
  "google-ads": {
    "nombre": "Google Ads",
    "orden": 4,
    "heroTitle": "Promoción Google Ads: Captura la Demanda Activa y Escala tus Ventas",
    "heroDescription": "Transformamos cada clic en una oportunidad de negocio mediante una promoción Google Ads estratégica, diseñada para colocar tu marca frente a quienes ya están listos para comprar.",
    "heroBadge": "Google Ads",
    "cards": [
      {
        "title": "Campañas de Búsqueda (Search)",
        "description": "Dominamos las subastas para que tus anuncios aparezcan cuando los usuarios buscan tus servicios, con un costo competitivo y enfocado en intención de compra."
      },
      {
        "title": "Red de Display y branding",
        "description": "Expandimos tu presencia visual en sitios y apps estratégicas para generar reconocimiento y alimentar el funnel de ventas."
      },
      {
        "title": "Google Shopping y Performance Max",
        "description": "Ideal para e-commerce. Optimizamos feeds de productos para que las ventas escalen con inteligencia artificial en todo el ecosistema de Google."
      }
    ],
    "proceso": [
      {
        "title": "Auditoría de cuenta",
        "description": "Si ya tienes una cuenta activa, analizamos su estructura, historial y oportunidades de mejora."
      },
      {
        "title": "Estrategia de campañas",
        "description": "Definimos objetivos, tipos de campaña, palabras clave, audiencias y presupuesto óptimo."
      },
      {
        "title": "Configuración técnica",
        "description": "Instalamos el seguimiento de conversiones, listas de remarketing y extensiones de anuncio."
      },
      {
        "title": "Lanzamiento",
        "description": "Activamos las campañas y monitoreamos de cerca durante la fase inicial de aprendizaje del algoritmo."
      },
      {
        "title": "Optimización continua",
        "description": "Ajustamos pujas, palabras clave negativas, anuncios y audiencias de forma semanal."
      },
      {
        "title": "Reporte mensual",
        "description": "Entregamos reporte con KPIs de negocio: CPC, CPA, ROAS y recomendaciones para el siguiente mes."
      }
    ],
    "tagline": "Campañas de búsqueda y display que convierten clics en clientes.",
    "faqs": [
      {
        "question": "¿Cómo funcionan las campañas publicitarias de Google Ads?",
        "answer": "Las campañas en Google Ads funcionan mostrando anuncios cuando un usuario busca productos o servicios relacionados con tu negocio. Se activan mediante palabras clave y se paga únicamente cuando alguien hace clic en tu anuncio."
      },
      {
        "question": "¿Cómo puede ayudar la promoción Google Ads a mi negocio?",
        "answer": "La promoción Google Ads permite que tu empresa aparezca justo cuando un cliente potencial está buscando tus servicios, generando visibilidad inmediata y oportunidades reales de venta."
      },
      {
        "question": "¿Cuál es el costo de Google Ads en México?",
        "answer": "El costo de Google Ads depende de la competencia del sector y las palabras clave. En Hiweb adaptamos la estrategia a tu presupuesto para que tu inversión genere el mejor retorno posible."
      },
      {
        "question": "¿La agencia gestiona campañas en Google Ads en español e inglés?",
        "answer": "Sí. Como expertos en Google Ads México, gestionamos campañas tanto en español como en inglés para captar clientes locales e internacionales según tu mercado objetivo."
      },
      {
        "question": "¿Por qué contratar una agencia Google Ads en lugar de hacerlo internamente?",
        "answer": "Una agencia Google Ads cuenta con especialistas certificados que optimizan campañas, analizan datos en tiempo real y ajustan la estrategia para maximizar conversiones y reducir costos por clic."
      },
      {
        "question": "¿Qué diferencia a Hiweb de otras agencias de Google Ads en México?",
        "answer": "A diferencia de otras opciones, nuestra agencia de Google Ads trabaja con estrategia integral: análisis de competencia, optimización de landing pages y seguimiento de conversiones reales, no solo clics."
      },
      {
        "question": "¿Qué incluye el servicio de una agencia de Google Ads?",
        "answer": "Nuestra agencia de Google Ads incluye investigación de palabras clave, configuración de campañas, segmentación estratégica, optimización continua, pruebas A/B y reportes de resultados enfocados en leads y ventas."
      },
      {
        "question": "¿Qué tipo de campañas en Google Ads manejan?",
        "answer": "Gestionamos campañas en Google Ads de búsqueda, display, remarketing y campañas con recursos gráficos complementarios, según el objetivo del negocio."
      },
      {
        "question": "¿Son expertos Google Ads certificados?",
        "answer": "Nuestro equipo está conformado por expertos Google Ads que se mantienen actualizados con las mejores prácticas, cambios en la plataforma y nuevas oportunidades de optimización."
      },
      {
        "question": "¿Trabajan campañas de Google Ads México para negocios locales?",
        "answer": "Sí. Gestionamos Google Ads México tanto para negocios locales como nacionales, segmentando por ubicación, idioma y perfil del usuario."
      },
      {
        "question": "¿Cómo funcionan las campañas de Google Ads?",
        "answer": "Google Ads funciona mediante un sistema de subastas donde los anunciantes pujan por palabras clave. Cuando un usuario realiza una búsqueda, Google evalúa la oferta y la calidad del anuncio para determinar cuál aparece primero. Solo se paga cuando el usuario hace clic."
      },
      {
        "question": "¿Cuánto cuesta Google Ads en México?",
        "answer": "El costo por clic (CPC) varía según la industria y la competencia. En México oscila entre $3 y $20 MXN para búsquedas generales, y puede superar los $50 MXN en sectores como legal, financiero o inmobiliario. En Hiweb optimizamos el presupuesto para maximizar el ROI."
      },
      {
        "question": "¿Cuánto presupuesto necesito para empezar con Google Ads?",
        "answer": "Para obtener datos estadísticamente significativos recomendamos un presupuesto mínimo de $5,000 MXN mensuales. Con menos inversión es difícil optimizar correctamente las campañas. En Hiweb gestionamos presupuestos desde ese monto hasta inversiones de alto volumen."
      },
      {
        "question": "¿Cuánto tiempo tarda en dar resultados Google Ads?",
        "answer": "A diferencia del SEO, Google Ads genera resultados inmediatos desde el primer día. Sin embargo, para optimizar el costo por adquisición (CPA) y estabilizar el rendimiento se requieren entre 2 y 4 semanas de datos y ajustes continuos."
      },
      {
        "question": "¿Qué incluye el servicio de Google Ads de Hiweb?",
        "answer": "Incluye auditoría de cuenta existente, configuración de campañas de búsqueda, display o Performance Max, configuración de conversiones, optimización semanal de pujas y palabras clave, pruebas A/B de anuncios y reporte mensual con KPIs de negocio."
      }
    ],
    "seo": {
      "metaTitle": "Promoción Google Ads y Campañas Efectivas en México | Hiweb",
      "metaDescription": "Optimiza tu inversión con nuestra agencia de Google Ads en México. Expertos en campañas de Google Ads enfocadas en ROI y generación de leads calificados."
    }
  },
  "meta-ads": {
    "nombre": "Meta Ads",
    "orden": 3,
    "heroTitle": "Meta Ads: Estrategias de Publicidad en Redes Sociales que Escalan tu Negocio",
    "heroDescription": "En Hiweb, transformamos la publicidad en redes sociales en un motor de crecimiento. Mediante Meta Ads, conectamos tu propuesta de valor con la audiencia exacta en el momento de mayor atención.",
    "heroBadge": "Meta Ads",
    "cards": [
      {
        "title": "Campañas de generación de leads",
        "description": "Anuncios optimizados para capturar datos de contacto directamente desde las plataformas, sin fricción y con un ciclo de ventas más corto."
      },
      {
        "title": "Ventas para e-commerce",
        "description": "Catálogos dinámicos y anuncios de colección para que tus productos lleguen a quienes ya mostraron interés y maximicen el ROAS."
      },
      {
        "title": "Remarketing y retargeting",
        "description": "Mantenemos tu marca presente ante quienes visitaron tu web pero no compraron, con un costo por resultado mucho más eficiente."
      }
    ],
    "proceso": [
      {
        "title": "Auditoría de cuenta",
        "description": "Revisamos el Business Manager, el Pixel, las audiencias guardadas y el historial de campañas."
      },
      {
        "title": "Estrategia de campañas",
        "description": "Definimos objetivos, embudos de conversión, segmentaciones y presupuesto por fase."
      },
      {
        "title": "Producción de creatividades",
        "description": "Diseñamos imágenes y videos para cada formato: feed, stories y reels patrocinados."
      },
      {
        "title": "Lanzamiento y aprendizaje",
        "description": "Monitoreamos diariamente durante las primeras 2 semanas para acelerar el aprendizaje del algoritmo."
      },
      {
        "title": "Optimización continua",
        "description": "Pruebas A/B, ajuste de audiencias, rotación de creatividades y gestión de frecuencia."
      },
      {
        "title": "Reporte mensual",
        "description": "CPL, ROAS, costo por compra y recomendaciones estratégicas para el siguiente mes."
      }
    ],
    "tagline": "Publicidad en Facebook e Instagram para generar leads y ventas.",
    "faqs": [
      {
        "question": "¿Cómo anunciarse en redes sociales de forma efectiva?",
        "answer": "Para saber cómo anunciarse en redes sociales, es clave definir objetivos claros, segmentar correctamente y optimizar constantemente. En Hiweb diseñamos estrategias alineadas a metas reales de negocio."
      },
      {
        "question": "¿Cómo funcionan los anuncios en redes sociales?",
        "answer": "Los anuncios en redes sociales se muestran a usuarios específicos según intereses, comportamiento y ubicación. Se pueden optimizar para generar tráfico, leads, ventas o reconocimiento de marca."
      },
      {
        "question": "¿Cómo optimizan los costos en campañas de Facebook Ads?",
        "answer": "Analizamos métricas como CPC, CPM, CTR y CPA para reducir la publicidad en Facebook costos innecesarios y mejorar el retorno de inversión en cada campaña."
      },
      {
        "question": "¿Cuál es el costo de publicidad en Facebook?",
        "answer": "El costo de publicidad en Facebook varía según la industria, la segmentación y la competencia. Adaptamos la inversión a tus objetivos para maximizar el rendimiento."
      },
      {
        "question": "¿Cuál es la diferencia entre publicidad en Facebook y otras plataformas?",
        "answer": "La publicidad en Facebook permite segmentación detallada y múltiples formatos de anuncio. También gestionamos campañas en Instagram como parte de una estrategia integral de Meta Ads."
      },
      {
        "question": "¿Cuánto cuesta un anuncio en Facebook?",
        "answer": "Cuánto cuesta un anuncio en Facebook depende del público objetivo y del tipo de campaña. Puede iniciarse con presupuestos controlados y escalar conforme se optimizan los resultados."
      },
      {
        "question": "¿Hiweb es una agencia publicidad redes sociales especializada?",
        "answer": "Sí. Somos una agencia publicidad redes sociales con enfoque estratégico y orientación a resultados, trabajando campañas tanto para negocios locales como nacionales."
      },
      {
        "question": "¿Por qué invertir en publicidad en redes sociales?",
        "answer": "La publicidad en redes sociales permite segmentar audiencias con alta precisión y llegar a personas interesadas en tus productos o servicios, aumentando visibilidad, interacción y conversiones."
      },
      {
        "question": "¿Qué incluye el servicio de una agencia de publicidad en redes sociales?",
        "answer": "Como agencia de publicidad en redes sociales, diseñamos la estrategia, segmentamos audiencias, desarrollamos creativos, optimizamos campañas y entregamos reportes enfocados en resultados."
      },
      {
        "question": "¿Qué resultados puedo esperar con publicidad en redes sociales marketing digital?",
        "answer": "La publicidad en redes sociales marketing digital puede generar aumento de tráfico, leads calificados, ventas y posicionamiento de marca cuando se ejecuta con estrategia y análisis continuo."
      },
      {
        "question": "¿Qué son Meta Ads?",
        "answer": "Meta Ads es el ecosistema publicitario de Facebook, Instagram y WhatsApp. Permite crear anuncios segmentados por edad, intereses, comportamientos y ubicación para llegar a audiencias específicas con alta precisión."
      },
      {
        "question": "¿Cuánto cuesta anunciarse en Facebook e Instagram en México?",
        "answer": "El costo por clic (CPC) en México varía entre $2 y $12 MXN según la plataforma, el objetivo y la segmentación. El presupuesto mínimo diario recomendado es de $100 MXN. En Hiweb optimizamos tu inversión para maximizar el ROAS."
      },
      {
        "question": "¿Cuál es la diferencia entre publicidad en Facebook e Instagram?",
        "answer": "Facebook tiene mayor alcance en audiencias de 30+ años y funciona bien con copy largo. Instagram es más efectivo para productos visuales y audiencias jóvenes. Meta Ads permite gestionar ambas plataformas desde el mismo Administrador de Anuncios."
      },
      {
        "question": "¿Qué resultados puedo esperar con Meta Ads?",
        "answer": "Los resultados dependen del objetivo, la industria y el presupuesto. Con una estrategia bien ejecutada es posible generar leads desde la primera semana. En Hiweb reportamos CPL (costo por lead), ROAS y tasa de conversión mensualmente."
      },
      {
        "question": "¿Qué incluye el servicio de Meta Ads de Hiweb?",
        "answer": "Incluye auditoría de cuenta, estrategia de campañas, creación de creatividades, configuración del Pixel de Meta, segmentación avanzada, pruebas A/B, optimización semanal y reporte mensual con métricas clave."
      }
    ],
    "seo": {
      "metaTitle": "Meta Ads: Agencia de Publicidad en Redes Sociales | Hiweb",
      "metaDescription": "Potencia tu marca con Meta Ads. Somos la agencia de publicidad en redes sociales experta en anuncios en Facebook e Instagram para generar ventas y leads."
    }
  },
  "redes-sociales": {
    "nombre": "Redes Sociales",
    "orden": 1,
    "heroTitle": "Agencia de Redes Sociales en México",
    "heroDescription": "En Hiweb no solo publicamos contenido: diseñamos estrategias de gestión de redes sociales que conectan tu marca con las personas correctas y generan resultados reales, no solo alcance.",
    "heroBadge": "Redes sociales",
    "cards": [
      {
        "title": "Estrategia de contenido y storytelling",
        "description": "Pilares, tono de voz y calendario editorial con impacto comercial."
      },
      {
        "title": "Producción multimedia y creativa",
        "description": "Piezas gráficas, reels y TikToks que comunican tu propuesta de valor."
      },
      {
        "title": "Auditoría y consultoría de canales",
        "description": "Detectamos oportunidades de crecimiento en tus perfiles actuales."
      }
    ],
    "proceso": [
      {
        "title": "Diagnóstico gratuito",
        "description": "Analizamos tus perfiles, competencia y audiencia."
      },
      {
        "title": "Estrategia personalizada",
        "description": "Definimos objetivos, plataformas, tono y calendario editorial."
      },
      {
        "title": "Producción de contenido",
        "description": "Piezas, reels y videos con tu identidad de marca."
      },
      {
        "title": "Publicación y seguimiento",
        "description": "Publicamos en los horarios con mejor desempeño histórico de tu audiencia."
      },
      {
        "title": "Reporte y optimización",
        "description": "Ajustamos la estrategia cada mes con datos reales."
      }
    ],
    "tagline": "Gestión estratégica de contenido para construir autoridad de marca.",
    "faqs": [
      {
        "question": "¿Cómo funciona el manejo de redes sociales en México?",
        "answer": "El manejo de redes sociales en México requiere entender el comportamiento del consumidor local, adaptar el tono de comunicación y aprovechar tendencias digitales relevantes."
      },
      {
        "question": "¿Cómo se miden los resultados en redes sociales?",
        "answer": "Medimos alcance, engagement, crecimiento de comunidad, clics al sitio y generación de leads para evaluar el impacto real de la estrategia de contenido."
      },
      {
        "question": "¿Cuál es la diferencia entre una agencia de social media y solo publicar contenido?",
        "answer": "Una agencia de social media no solo publica, analiza datos, define objetivos, estudia audiencias y ajusta la estrategia para generar posicionamiento y resultados medibles."
      },
      {
        "question": "¿Hiweb es una agencia de redes sociales en México?",
        "answer": "Sí. Somos una agencia de redes sociales México con experiencia en distintos sectores, trabajando estrategias adaptadas al mercado local y nacional."
      },
      {
        "question": "¿Por qué contratar una agencia de redes sociales?",
        "answer": "Una agencia de redes sociales desarrolla estrategias de contenido alineadas a objetivos de negocio, mejora la imagen de marca y optimiza la interacción con la audiencia para generar crecimiento sostenido."
      },
      {
        "question": "¿Por qué elegir una agencia de marketing digital y social media integral?",
        "answer": "Una agencia de marketing digital y social media integra redes sociales con SEO, campañas pagadas y desarrollo web, logrando una estrategia digital coherente y más efectiva."
      },
      {
        "question": "¿Qué diferencia a Hiweb de otras agencias de redes sociales en México?",
        "answer": "A diferencia de otras agencias de redes sociales en México, en Hiweb combinamos creatividad con análisis de datos y objetivos comerciales claros, asegurando que cada publicación tenga un propósito estratégico."
      },
      {
        "question": "¿Qué incluye el servicio de una agencia de manejo de redes sociales?",
        "answer": "Una agencia de redes sociales desarrolla estrategias de contenido alineadas a objetivos de negocio, mejora la imagen de marca y optimiza la interacción con la audiencia para generar crecimiento sostenido."
      },
      {
        "question": "¿Qué plataformas pueden gestionar como agencia de medios sociales?",
        "answer": "Como agencia de medios sociales, gestionamos Instagram, Facebook, TikTok y otras plataformas según el perfil del negocio y su audiencia objetivo."
      },
      {
        "question": "¿Qué resultados puedo esperar al trabajar con agencias de redes sociales en México?",
        "answer": "Las agencias de redes sociales en México pueden ayudarte a aumentar seguidores, mejorar engagement, fortalecer tu marca y generar oportunidades de venta cuando la estrategia está bien estructurada."
      },
      {
        "question": "¿Cuánto cuesta el manejo de redes sociales en México?",
        "answer": "Los precios van desde $9,000 hasta $17,000+ MXN/mes según el número de publicaciones. Todos nuestros planes incluyen 3 plataformas, diseño gráfico, estrategia de contenido y reporte mensual."
      },
      {
        "question": "¿Qué incluye el servicio de manejo de redes sociales de Hiweb?",
        "answer": "Incluye estrategia de contenido, producción de imágenes y videos, programación de publicaciones, auditoría inicial y reporte mensual de resultados. El alcance depende del plan contratado."
      },
      {
        "question": "¿En cuánto tiempo se ven resultados con el manejo de redes sociales?",
        "answer": "Los primeros resultados en engagement y alcance se ven en las primeras 4 semanas. El crecimiento sostenido de seguidores y la generación de leads toma entre 2 y 3 meses con una estrategia consistente."
      },
      {
        "question": "¿En qué plataformas trabaja Hiweb?",
        "answer": "Trabajamos en Instagram, Facebook, TikTok, LinkedIn y YouTube. Recomendamos las plataformas más adecuadas según el tipo de negocio, la audiencia y los objetivos comerciales."
      },
      {
        "question": "¿Hiweb hace también publicidad pagada en redes sociales?",
        "answer": "Sí. Además del manejo orgánico, gestionamos campañas de Meta Ads para amplificar el alcance con publicidad pagada. Ambos servicios se pueden contratar de forma integrada."
      },
      {
        "question": "¿Tienen contrato de permanencia?",
        "answer": "No. En Hiweb trabajamos con un modelo flexible: empezamos con un mes de prueba para que veas los resultados antes de comprometerte a un contrato de largo plazo."
      }
    ],
    "seo": {
      "metaTitle": "Agencia de Redes Sociales en México | Hiweb",
      "metaDescription": "Agencia de redes sociales en Mérida y México desde $12,000 MXN/mes. Estrategia y contenido que convierten seguidores en clientes."
    }
  },
  "desarrollo-web": {
    "nombre": "Desarrollo Web",
    "orden": 9,
    "heroTitle": "Agencia de Diseño Web: Creamos tu Activo Digital más Rentable",
    "heroDescription": "En Hiweb, el diseño y desarrollo web va más allá de la estética. Construimos plataformas de alto rendimiento que funcionan como una herramienta de ventas 24/7 para tu negocio.",
    "heroBadge": "Diseño web",
    "cards": [
      {
        "title": "Desarrollo web responsive",
        "description": "Sitios corporativos y landing pages que se adaptan a cualquier dispositivo."
      },
      {
        "title": "E-commerce avanzado",
        "description": "Tiendas online optimizadas para la venta, integradas con tu operación."
      },
      {
        "title": "Mantenimiento y soporte",
        "description": "Actualizaciones, copias de seguridad y monitoreo para que el sitio siga convirtiendo."
      }
    ],
    "proceso": [
      {
        "title": "Briefing y estrategia",
        "description": "Definimos objetivos, público, estructura del sitio y referencias de diseño."
      },
      {
        "title": "Arquitectura de información",
        "description": "Diseñamos los flujos de navegación y la jerarquía de contenido antes del diseño visual."
      },
      {
        "title": "Diseño UI",
        "description": "Creamos el diseño visual completo en Figma para tu aprobación antes del desarrollo."
      },
      {
        "title": "Desarrollo",
        "description": "Construimos el sitio con código limpio, velocidad optimizada y SEO técnico desde la base."
      },
      {
        "title": "QA y pruebas",
        "description": "Revisamos el sitio en distintos dispositivos y navegadores antes de publicar."
      },
      {
        "title": "Lanzamiento y capacitación",
        "description": "Publicamos el sitio y te enseñamos a gestionar el contenido de forma autónoma."
      }
    ],
    "tagline": "Sitios web de alto rendimiento diseñados para convertir visitantes.",
    "faqs": [
      {
        "question": "¿Cuál es el costo de diseño de página web?",
        "answer": "El costo de diseño de página web varía según si es un sitio informativo, corporativo o con funcionalidades avanzadas. En Hiweb ofrecemos propuestas personalizadas."
      },
      {
        "question": "¿Cuánto cuesta un sitio web en México?",
        "answer": "Cuánto cuesta un sitio web en México depende del alcance del proyecto, funcionalidades e integraciones. El precio se ajusta a los objetivos y necesidades del negocio."
      },
      {
        "question": "¿El desarrollo de páginas web incluye optimización para SEO?",
        "answer": "Sí. Nuestro desarrollo páginas web México contempla estructura técnica optimizada, tiempos de carga eficientes y configuración inicial para facilitar el posicionamiento en Google."
      },
      {
        "question": "¿Ofrecen diseño web en México para negocios locales?",
        "answer": "Sí. Desarrollamos proyectos de diseño web México tanto para negocios locales como nacionales, adaptando la estrategia al mercado y público objetivo."
      },
      {
        "question": "¿Por qué contratar una agencia de diseño web?",
        "answer": "Una agencia de diseño web crea sitios estratégicos, optimizados para conversión y alineados a tu marca. No se trata solo de diseño visual, sino de funcionalidad, velocidad y resultados."
      },
      {
        "question": "¿Por qué elegir empresas de desarrollo web en México como Hiweb?",
        "answer": "Entre las empresas de desarrollo web en México, destacamos por integrar diseño, SEO y estrategia digital en un mismo proyecto, garantizando coherencia y mejores resultados."
      },
      {
        "question": "¿Qué diferencia hay entre diseño web profesional y una plantilla básica?",
        "answer": "El diseño web profesional se adapta a tu identidad de marca, mejora la navegación y está pensado para generar conversiones, no solo para verse atractivo."
      },
      {
        "question": "¿Qué incluye el servicio de diseño y desarrollo web?",
        "answer": "Nuestro servicio de diseño y desarrollo web incluye diseño personalizado, estructura optimizada, adaptación móvil, integración de formularios y configuración SEO básica."
      },
      {
        "question": "¿Realizan desarrollo de páginas web en México?",
        "answer": "Sí. Nos especializamos en desarrollo de páginas web México, creando sitios optimizados para rendimiento, seguridad y posicionamiento en buscadores."
      },
      {
        "question": "¿Trabajan bajo estándares de diseño web actualizados?",
        "answer": "Sí. Aplicamos los estándares de diseño web actuales en experiencia de usuario (UX), velocidad de carga, seguridad, estructura responsiva y optimización técnica."
      },
      {
        "question": "¿Cuánto cuesta un sitio web profesional en México?",
        "answer": "El costo varía según la complejidad: un sitio corporativo básico parte de $15,000 MXN, mientras que proyectos con funcionalidades avanzadas, e-commerce o integraciones personalizadas pueden superar los $80,000 MXN. En Hiweb ofrecemos cotizaciones detalladas según los objetivos de cada negocio."
      },
      {
        "question": "¿Cuánto tiempo tarda en desarrollarse un sitio web?",
        "answer": "Un sitio corporativo estándar toma entre 4 y 8 semanas desde el inicio del diseño hasta la publicación. Proyectos más complejos como e-commerce o plataformas con integraciones pueden tomar de 2 a 4 meses."
      },
      {
        "question": "¿El sitio web estará optimizado para SEO?",
        "answer": "Sí. En Hiweb construimos todos los sitios con SEO técnico desde la base: estructura semántica HTML5, velocidad optimizada (Core Web Vitals), schema markup, sitemap, robots.txt y arquitectura de URLs limpia."
      },
      {
        "question": "¿Qué plataformas usan para el desarrollo web?",
        "answer": "Trabajamos principalmente con Webflow para sitios corporativos y landing pages de alta conversión, y con Shopify o WooCommerce para e-commerce. La elección depende de los objetivos, el presupuesto y las necesidades de escalabilidad del proyecto."
      },
      {
        "question": "¿Incluye el servicio mantenimiento después de la entrega?",
        "answer": "Sí. Ofrecemos planes de mantenimiento mensual que incluyen actualizaciones, copias de seguridad, monitoreo de rendimiento y soporte técnico para asegurar que el sitio funcione correctamente a largo plazo."
      }
    ],
    "seo": {
      "metaTitle": "Agencia de Diseño Web Profesional y Desarrollo Web en México",
      "metaDescription": "Creamos sitios de alto impacto. Somos la agencia de diseño web en México experta en diseño y desarrollo web enfocado a conversión, velocidad y SEO técnico."
    }
  },
  "crm-automatizacion": {
    "nombre": "CRM & Automatización",
    "orden": 6,
    "heroTitle": "CRM para empresas: Transforma tus datos en relaciones rentables",
    "heroDescription": "Impulsa el crecimiento de tu negocio mediante el manejo de CRM inteligente y estrategias de automatización diseñadas para maximizar cada oportunidad de venta.",
    "heroBadge": "CRM",
    "cards": [
      {
        "title": "Consultoría e implementación",
        "description": "Seleccionamos e instalamos las herramientas CRM que mejor se adaptan a tus objetivos comerciales."
      },
      {
        "title": "Flujos de automatización",
        "description": "Diseñamos procesos que eliminan tareas repetitivas y errores humanos en tu embudo."
      },
      {
        "title": "Capacitación y soporte",
        "description": "Capacitamos a tu equipo para asegurar una adopción tecnológica exitosa y rentable."
      }
    ],
    "proceso": [
      {
        "title": "Diagnóstico de procesos",
        "description": "Mapeamos cómo entran, se nutren y se cierran hoy tus leads."
      },
      {
        "title": "Selección e implementación",
        "description": "Instalamos el CRM y las integraciones con web, Ads y formularios."
      },
      {
        "title": "Automatización",
        "description": "Emails, WhatsApp y tareas se disparan según el comportamiento del prospecto."
      },
      {
        "title": "Capacitación",
        "description": "El equipo comercial opera el sistema con un protocolo claro de seguimiento."
      },
      {
        "title": "Optimización",
        "description": "Ajustamos flujos y reportes con datos reales del embudo."
      }
    ],
    "tagline": "Sistemas que nutren leads y cierran ventas mientras duermes.",
    "faqs": [
      {
        "question": "¿Cómo trabaja Hiweb el manejo de CRM en mi empresa?",
        "answer": "En Hiweb analizamos tu proceso comercial, configuramos el CRM según tus necesidades y creamos flujos automatizados que mejoran el seguimiento de leads y oportunidades de venta."
      },
      {
        "question": "¿Cuáles son las mejores CRM para pymes?",
        "answer": "Las mejores CRM para pymes dependen del tamaño del negocio y sus objetivos. En Hiweb analizamos tu operación y recomendamos la plataforma más adecuada."
      },
      {
        "question": "¿El servicio de manejo CRM incluye automatización de marketing?",
        "answer": "Sí. Nuestro servicio integra automatización CRM con formularios, email marketing y seguimiento automático para que ningún prospecto se quede sin atención."
      },
      {
        "question": "¿Hiweb personaliza el CRM según mi modelo de negocio?",
        "answer": "Sí. Adaptamos el CRM a tu proceso comercial, tipo de cliente y ciclo de ventas, asegurando que el sistema realmente se alinee a tus objetivos y operación diaria."
      },
      {
        "question": "¿Para qué me sirve un CRM en la automatización?",
        "answer": "Si te preguntas para qué me sirve un CRM en la automatización, te ayuda a reducir tiempos de respuesta, mejorar la experiencia del cliente y aumentar la tasa de conversión mediante procesos automatizados."
      },
      {
        "question": "¿Por qué implementar un CRM para empresas?",
        "answer": "Un CRM para empresas centraliza la información de clientes, mejora la organización del equipo comercial y permite tomar decisiones basadas en datos reales."
      },
      {
        "question": "¿Pueden integrar el CRM con mi sitio web y campañas digitales?",
        "answer": "Sí. Integramos el CRM con tu sitio web, landing pages, Google Ads y redes sociales para centralizar la información y optimizar el embudo de ventas."
      },
      {
        "question": "¿Qué es automatización CRM?",
        "answer": "La automatización CRM permite programar respuestas automáticas, nutrir leads, asignar tareas y optimizar el embudo de ventas sin intervención manual constante."
      },
      {
        "question": "¿Qué es manejo de CRM?",
        "answer": "El manejo de CRM consiste en administrar correctamente la base de datos, configurar automatizaciones, segmentar clientes y optimizar el seguimiento de oportunidades de venta."
      },
      {
        "question": "¿Qué es un CRM y para qué sirve?",
        "answer": "Si te preguntas qué es un CRM y para qué sirve, es un sistema que permite gestionar clientes, dar seguimiento a prospectos y automatizar procesos comerciales para aumentar ventas y eficiencia."
      }
    ],
    "seo": {
      "metaTitle": "CRM para empresas y Automatización de Ventas | Hiweb",
      "metaDescription": "Optimiza el manejo de CRM en tu empresa con Hiweb. Implementamos las mejores herramientas CRM para pymes y flujos de automatización para elevar tu ROI."
    }
  },
  "branding": {
    "nombre": "Branding",
    "orden": 5,
    "heroTitle": "Agencia de Branding: Construimos tu Identidad de Marca",
    "heroDescription": "En Hiweb, entendemos que la identidad de marca es mucho más que un logotipo; es la esencia que define cómo el mundo percibe y recuerda tu negocio en el entorno digital.",
    "heroBadge": "Branding",
    "cards": [
      {
        "title": "Diseño de logotipo y naming",
        "description": "Creamos el nombre y el símbolo central de tu negocio, únicos, escalables y alineados a tus valores."
      },
      {
        "title": "Manual de identidad de marca",
        "description": "Tipografías, paletas y reglas de uso para que la marca se mantenga impecable en cualquier formato."
      },
      {
        "title": "Materiales corporativos",
        "description": "Adaptamos la nueva identidad a papelería, kits de redes y activos de operación diaria."
      }
    ],
    "proceso": [
      {
        "title": "Investigación de marca",
        "description": "Analizamos competencia, audiencia y posicionamiento actual."
      },
      {
        "title": "Estrategia de marca",
        "description": "Definimos propósito, valores, personalidad y promesa de marca antes de diseñar."
      },
      {
        "title": "Propuesta de concepto",
        "description": "Presentamos direcciones creativas distintas para elegir la que mejor represente tu visión."
      },
      {
        "title": "Desarrollo visual",
        "description": "Refinamos el concepto elegido hasta el diseño final aprobado."
      },
      {
        "title": "Manual de identidad visual",
        "description": "Documentamos todos los elementos de la marca y sus reglas de uso."
      },
      {
        "title": "Entrega de archivos",
        "description": "Logo en PNG, SVG y PDF, con variantes para uso digital e impreso."
      }
    ],
    "tagline": "Identidad visual y verbal que diferencia a tu marca en el mercado.",
    "faqs": [
      {
        "question": "¿Qué es la identidad de marca?",
        "answer": "La identidad de marca es el conjunto de elementos visuales y comunicativos que definen cómo una empresa se presenta al mundo: logotipo, paleta de colores, tipografías, tono de voz y aplicaciones visuales. Una identidad sólida genera reconocimiento y confianza."
      },
      {
        "question": "¿Cuánto cuesta un servicio de branding en México?",
        "answer": "El costo varía según el alcance: desde diseño de logotipo básico hasta sistemas de identidad completos con manual de marca. En Hiweb ofrecemos cotizaciones personalizadas según los objetivos y el tamaño del negocio."
      },
      {
        "question": "¿Qué incluye un manual de identidad de marca?",
        "answer": "Un manual de identidad incluye: construcción del logotipo y sus variantes, paleta de colores principal y secundaria, tipografías corporativas, usos correctos e incorrectos, aplicaciones en papelería, redes sociales y medios digitales."
      },
      {
        "question": "¿Cuánto tiempo tarda el proceso de branding?",
        "answer": "Un proyecto de identidad de marca completo generalmente toma entre 3 y 6 semanas, dependiendo de la complejidad y los ciclos de revisión. Incluye investigación, propuesta de concepto, ajustes y entrega final."
      },
      {
        "question": "¿El servicio incluye diseño de logotipo?",
        "answer": "Sí. El diseño de logotipo es el punto de partida de cualquier proyecto de identidad de marca. Entregamos el logotipo en múltiples formatos (PNG, SVG, PDF) y variantes (positivo, negativo, horizontal, vertical) para todos sus usos."
      }
    ],
    "seo": {
      "metaTitle": "Identidad de Marca y Branding Profesional en México | Hiweb",
      "metaDescription": "Construimos la identidad de marca que tu negocio necesita. Especialistas en diseño identidad de marca, brand identity y manual de identidad en México."
    }
  },
  "ia-marketing": {
    "nombre": "IA Marketing",
    "orden": 8,
    "heroTitle": "IA Marketing: Revoluciona tu Estrategia con Inteligencia Artificial",
    "heroDescription": "En Hiweb, integramos la IA al marketing para transformar datos en decisiones estratégicas y que tu empresa escale con una eficiencia sin precedentes.",
    "heroBadge": "IA",
    "cards": [
      {
        "title": "Chatbots de IA para ventas",
        "description": "Asistentes que entienden lenguaje natural, resuelven dudas y califican prospectos en tiempo real."
      },
      {
        "title": "Segmentación con machine learning",
        "description": "Agrupamos usuarios por comportamientos predictivos para llegar al cliente correcto antes."
      },
      {
        "title": "Flujos de trabajo inteligentes",
        "description": "Correos y mensajes que se adaptan según la respuesta y el interés del usuario."
      }
    ],
    "proceso": [
      {
        "title": "Diagnóstico del embudo",
        "description": "Identificamos tareas repetitivas y fugas de seguimiento en marketing y ventas."
      },
      {
        "title": "Diseño de automatización",
        "description": "Definimos chatbots, flujos y reportes alineados a tus herramientas actuales."
      },
      {
        "title": "Implementación",
        "description": "Integramos IA con CRM, web y campañas sin interrumpir la operación."
      },
      {
        "title": "Entrenamiento y QA",
        "description": "Ajustamos tono de marca, calificación de leads y handoff al equipo comercial."
      },
      {
        "title": "Optimización continua",
        "description": "Medimos conversiones, tiempo de respuesta y ROI de cada flujo automatizado."
      }
    ],
    "tagline": "Implementación de inteligencia artificial para optimizar procesos.",
    "faqs": [
      {
        "question": "¿Qué es el IA Marketing?",
        "answer": "El IA Marketing es la aplicación de inteligencia artificial en estrategias de marketing digital: personalización predictiva, automatización de flujos, chatbots inteligentes, optimización de campañas en tiempo real y análisis de comportamiento con machine learning."
      },
      {
        "question": "¿Cómo puede la IA mejorar mis campañas de marketing?",
        "answer": "La IA puede optimizar pujas en Google y Meta Ads automáticamente, personalizar mensajes según el comportamiento del usuario, predecir qué leads tienen mayor probabilidad de convertir y automatizar el seguimiento de prospectos sin intervención humana."
      },
      {
        "question": "¿Qué herramientas de IA usa Hiweb?",
        "answer": "Utilizamos herramientas de IA generativa para creación de contenido, modelos de machine learning para segmentación predictiva, chatbots con NLP para automatización de conversaciones y plataformas de automatización como n8n y Make integradas con IA."
      },
      {
        "question": "¿El IA Marketing reemplaza a los especialistas humanos?",
        "answer": "No. La IA potencia el trabajo de los especialistas pero no los reemplaza. En Hiweb usamos la IA para automatizar tareas repetitivas y procesar grandes volúmenes de datos, liberando al equipo humano para la estrategia, la creatividad y la toma de decisiones."
      },
      {
        "question": "¿Necesito un presupuesto grande para implementar IA en mi marketing?",
        "answer": "No. Muchas herramientas de IA son accesibles incluso para pymes. En Hiweb evaluamos tu operación y recomendamos las soluciones con mejor relación costo-beneficio según el tamaño y los objetivos de tu negocio."
      }
    ],
    "seo": {
      "metaTitle": "IA Marketing: Soluciones de Inteligencia Artificial | Hiweb",
      "metaDescription": "Potencia tu negocio con IA marketing. Implementamos inteligencia artificial en el marketing digital para automatizar procesos y maximizar tu ROI."
    }
  },
  "community-manager": {
    "nombre": "Community Manager",
    "orden": 7,
    "heroTitle": "Community Manager: Construimos el Corazón de tu Comunidad Digital",
    "heroDescription": "En Hiweb, ofrecemos un servicio de community manager integral que va más allá de publicar; nos convertimos en la voz de tu marca para generar conexiones reales y duraderas.",
    "heroBadge": "Community",
    "cards": [
      {
        "title": "Gestión de interacciones",
        "description": "Atendemos dudas, comentarios y mensajes directos para que ningún prospecto se quede sin respuesta."
      },
      {
        "title": "Dinamización de comunidad",
        "description": "Creamos conversaciones que convierten seguidores pasivos en embajadores de la marca."
      },
      {
        "title": "Monitoreo y reporting",
        "description": "Medimos el sentimiento de la audiencia y entregamos reportes mensuales con métricas clave."
      }
    ],
    "proceso": [
      {
        "title": "Diagnóstico de comunidad",
        "description": "Revisamos tono, volumen de interacciones y protocolos actuales."
      },
      {
        "title": "Guía de voz de marca",
        "description": "Definimos cómo se responde, qué se escala y cómo se modera."
      },
      {
        "title": "Gestión diaria",
        "description": "Mensajes, comentarios, menciones y moderación con tiempos de respuesta claros."
      },
      {
        "title": "Escalamiento de crisis",
        "description": "Protocolo para situaciones adversas y reporte al equipo directivo."
      },
      {
        "title": "Reporte mensual",
        "description": "Interacciones, tiempo de respuesta y sentimiento de la comunidad."
      }
    ],
    "tagline": "Gestión activa de comunidad y atención para fidelizar clientes.",
    "faqs": [
      {
        "question": "¿Cuál es la diferencia entre community manager y manejo de redes sociales?",
        "answer": "El community manager se enfoca en gestionar la comunidad: responder, moderar y generar engagement. El manejo completo de redes sociales incluye además producción de contenido, diseño y estrategia. En Hiweb ofrecemos ambos servicios."
      },
      {
        "question": "¿Cuánto cuesta el servicio de community manager en México?",
        "answer": "En Hiweb el plan básico para 1 plataforma inicia desde $4,500 MXN/mes + IVA, y el plan estándar para 2 plataformas con moderación activa y reporte mensual es de $7,500 MXN/mes + IVA."
      },
      {
        "question": "¿En qué plataformas trabajan como community manager?",
        "answer": "Trabajamos en Instagram, Facebook, TikTok, LinkedIn y YouTube según el tipo de negocio y audiencia objetivo."
      },
      {
        "question": "¿Qué hace exactamente un community manager?",
        "answer": "Un community manager gestiona la presencia de tu marca en redes sociales: responde mensajes y comentarios, modera interacciones, monitorea menciones, detecta oportunidades de conversación y reporta mensualmente el sentimiento de la comunidad."
      },
      {
        "question": "¿Qué pasa si hay una crisis de reputación en mis redes?",
        "answer": "Tenemos protocolos de manejo de crisis: detectamos la situación, respondemos estratégicamente y escalamos al equipo directivo cuando es necesario para proteger tu reputación con rapidez y profesionalismo."
      },
      {
        "question": "¿Responden los mensajes con el tono de mi marca?",
        "answer": "Sí. Antes de iniciar definimos una guía de voz y tono. Todas las respuestas siguen esa guía para que la comunicación sea consistente y nunca genérica."
      },
      {
        "question": "¿Qué hace un community manager?",
        "answer": "Un community manager gestiona la presencia de una marca en redes sociales: crea y publica contenido, responde mensajes y comentarios, monitorea la reputación digital, analiza métricas y mantiene una comunicación activa con la comunidad de seguidores."
      },
      {
        "question": "¿Cuánto cuesta contratar un community manager en México?",
        "answer": "En México, el costo de un servicio de community manager varía según el número de plataformas, la frecuencia de publicaciones y el nivel estratégico. En Hiweb ofrecemos planes adaptados al tamaño y objetivos de cada negocio. Contáctanos para una cotización."
      },
      {
        "question": "¿Cuál es la diferencia entre community manager y social media manager?",
        "answer": "El community manager se enfoca en la gestión de la comunidad: responder, moderar y generar engagement. El social media manager tiene un rol más estratégico: define el plan de contenidos, los KPIs y la dirección de la marca en redes sociales. En Hiweb integramos ambos roles."
      },
      {
        "question": "¿En qué redes sociales trabajan?",
        "answer": "Trabajamos en Instagram, Facebook, TikTok, LinkedIn y YouTube. Recomendamos las plataformas más adecuadas según el tipo de negocio, la audiencia objetivo y los recursos disponibles."
      },
      {
        "question": "¿Qué herramientas usa un community manager profesional?",
        "answer": "Las herramientas más comunes incluyen Meta Business Suite, Later, Hootsuite o Buffer para programación, Google Analytics y Meta Insights para análisis, y Canva o Adobe para diseño. En Hiweb usamos herramientas avanzadas de monitoreo y reporte mensual."
      }
    ],
    "seo": {
      "metaTitle": "Community Manager en México | Gestión de Redes | Hiweb",
      "metaDescription": "Potencia tu comunidad digital con nuestro servicio de Community Manager. Gestión profesional de redes sociales, engagement y estrategia en Mérida y todo México."
    }
  }
} as Record<string, WebflowServiceCopy>;
