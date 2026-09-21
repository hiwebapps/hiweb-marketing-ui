import type { CaseRecord, SeoFields } from '../lib/content/types';

export const WEBFLOW_CASES_INDEX = {
  eyebrow: 'Portafolio / Casos',
  title: 'Casos de Éxito',
  description: 'Descubre nuestros logros y lo que podemos hacer por tu marca.',
  seo: {
    metaTitle: "Portafolio de Agencia de Marketing | Proyectos y Resultados Reales",
    metaDescription: "Conoce nuestro portafolio de agencia de marketing con casos reales, estrategias digitales y resultados comprobables en SEO, diseño web y publicidad digital.",
  } satisfies SeoFields,
} as const;

export type WebflowCaseCopy = CaseRecord['data'] & {
  cover: string;
};

export const WEBFLOW_CASES: Record<string, WebflowCaseCopy> = {
  "el-secreto": {
    "cliente": "El Secreto",
    "industria": {
      "id": ""
    },
    "servicios": [
      {
        "id": "redes-sociales"
      },
      {
        "id": "meta-ads"
      }
    ],
    "resultadoFrase": "+52% alcance en redes",
    "titulo": "Concept boutique en Mérida, México, con una propuesta femenina, libre y atemporal, enfocada en prendas y piezas que expresan estilo, identidad y autenticidad.",
    "resumen": "Conoce cómo Hiweb impulsó la visibilidad y el reconocimiento de El Secreto mediante redes sociales y pauta digital, fortaleciendo su identidad como concept boutique en Mérida.",
    "destacado": false,
    "accent": "orange",
    "metricas": [
      {
        "valor": 52,
        "label": "Alcance en redes",
        "prefix": "+",
        "suffix": "%",
        "despues": "Incremento en alcance de contenido visual en Instagram, Facebook y TikTok."
      },
      {
        "valor": 41,
        "label": "Engagement",
        "prefix": "+",
        "suffix": "%",
        "despues": "Mayor interacción con publicaciones, reels y videos de producto y estilo."
      },
      {
        "valor": 29,
        "label": "Guardados y compartidos",
        "prefix": "+",
        "suffix": "%",
        "despues": "Usuarios guardan y comparten contenido relacionado con looks y colecciones."
      },
      {
        "valor": 24,
        "label": "Reconocimiento de marca",
        "prefix": "+",
        "suffix": "%",
        "despues": "Mayor recordación de marca entre nuevas audiencias interesadas en moda local."
      }
    ],
    "reto": "El Secreto buscaba aumentar su visibilidad y fortalecer su posicionamiento como concept boutique en un mercado altamente competitivo. Su objetivo era destacar su identidad de marca, atraer nuevas clientas y generar reconocimiento a través de redes sociales y campañas de pauta enfocadas en branding y alcance.",
    "estrategia": "Gestión de marca: Gestión de redes sociales enfocada en construir identidad visual, coherencia de marca y conexión emocional con una audiencia femenina. Pauta de visibilidad: Implementación de campañas publicitarias enfocadas en alcance, reconocimiento de marca y atracción de nuevas clientas.",
    "fases": [
      {
        "title": "Gestión de marca",
        "description": "Gestión de redes sociales enfocada en construir identidad visual, coherencia de marca y conexión emocional con una audiencia femenina."
      },
      {
        "title": "Pauta de visibilidad",
        "description": "Implementación de campañas publicitarias enfocadas en alcance, reconocimiento de marca y atracción de nuevas clientas."
      }
    ],
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/6a1314e7d8dcbbe12c0356a3_Secreto.jpg",
    "seo": {
      "metaTitle": "El Secreto | Caso de Éxito Hiweb",
      "metaDescription": "Conoce cómo Hiweb impulsó la visibilidad y el reconocimiento de El Secreto mediante redes sociales y pauta digital, fortaleciendo su identidad como concept boutique en Mérida."
    }
  },
  "restaura": {
    "cliente": "Restaura",
    "industria": {
      "id": "salud"
    },
    "servicios": [
      {
        "id": "redes-sociales"
      },
      {
        "id": "meta-ads"
      }
    ],
    "resultadoFrase": "+35% engagement",
    "titulo": "Laboratorio dental especializado en prótesis y restauraciones de alta precisión, enfocado en apoyar a odontólogos con tecnología digital, materiales premium y resultados consistentes.",
    "resumen": "Conoce cómo Hiweb impulsó la visibilidad y captación de Restaura Laboratorio Dental mediante redes sociales y pauta digital, conectando con odontólogos que buscan precisión y calidad.",
    "destacado": false,
    "accent": "purple",
    "metricas": [
      {
        "valor": 35,
        "label": "Engagement",
        "prefix": "+",
        "suffix": "%",
        "despues": "Mayor interacción con publicaciones sobre procesos, tecnología y casos clínicos."
      },
      {
        "valor": 48,
        "label": "Alcance en redes",
        "prefix": "+",
        "suffix": "%",
        "despues": "Incremento en alcance de contenido técnico y educativo dirigido a odontólogos y clínicas."
      },
      {
        "valor": 30,
        "label": "Intención de contacto",
        "prefix": "+",
        "suffix": "%",
        "despues": "Incremento en mensajes directos y consultas de odontólogos interesados en los servicios."
      },
      {
        "valor": 25,
        "label": "Posicionamiento",
        "prefix": "+",
        "suffix": "%",
        "despues": "Mayor recordación de marca dentro del sector odontológico local y regional."
      }
    ],
    "reto": "Restaura buscaba aumentar su visibilidad y posicionarse como un laboratorio dental confiable y especializado ante odontólogos y clínicas. Su objetivo era fortalecer el reconocimiento de marca, comunicar su nivel técnico y atraer nuevos contactos profesionales a través de redes sociales y campañas de pauta digital.",
    "estrategia": "Comunicación técnica: Gestión de redes sociales enfocada en comunicar procesos, tecnología y valor técnico del laboratorio de forma clara y profesional.",
    "fases": [
      {
        "title": "Comunicación técnica",
        "description": "Gestión de redes sociales enfocada en comunicar procesos, tecnología y valor técnico del laboratorio de forma clara y profesional."
      }
    ],
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/695ee0a10797e428425c3196_restaura%20(1).png",
    "seo": {
      "metaTitle": "Restaura | Caso de Éxito Hiweb",
      "metaDescription": "Conoce cómo Hiweb impulsó la visibilidad y captación de Restaura Laboratorio Dental mediante redes sociales y pauta digital, conectando con odontólogos que buscan precisión y calidad."
    }
  },
  "eagle-superabrasives": {
    "cliente": "Eagle Superabrasives",
    "industria": {
      "id": "manufactura"
    },
    "servicios": [
      {
        "id": "desarrollo-web"
      },
      {
        "id": "seo"
      }
    ],
    "resultadoFrase": "+1,600 usuarios nuevos",
    "titulo": "Empresa americana especializada en el diseño y fabricación de discos de esmeril de alto rendimiento en diamante, CBN y CDX, con presencia internacional y enfoque en soluciones industriales personalizadas.",
    "resumen": "Conoce cómo Hiweb rediseñó y optimizó el sitio web de Eagle Superabrasives en México, fortaleciendo su estructura, SEO y posicionamiento en buscadores para el mercado industrial.",
    "destacado": false,
    "accent": "cyan",
    "metricas": [
      {
        "valor": 1600,
        "label": "Usuarios nuevos",
        "prefix": "+",
        "despues": "Usuarios nuevos generados a partir del rediseño web y optimización SEO del sitio."
      },
      {
        "valor": 1700,
        "label": "Alcance internacional",
        "prefix": "+",
        "despues": "Usuarios activos provenientes de distintos países, incluyendo México, Estados Unidos y Asia."
      },
      {
        "valor": 2600,
        "label": "Vistas de página",
        "prefix": "+",
        "despues": "Incremento en vistas de páginas clave de productos y contenido técnico especializado."
      },
      {
        "valor": 68,
        "label": "Clics orgánicos",
        "prefix": "+",
        "suffix": "%",
        "despues": "Incremento en clics provenientes de búsquedas orgánicas tras optimización SEO del sitio."
      }
    ],
    "reto": "Eagle Superabrasives buscaba renovar su sitio web en México, no solo a nivel visual, sino también en estructura, funcionalidad y optimización SEO. Su objetivo era posicionarse entre los primeros resultados en buscadores en México y adaptar correctamente su contenido técnico al español para atraer leads industriales calificados.",
    "estrategia": "Web funcional y escalable: Rediseño del sitio web con enfoque en usabilidad, claridad técnica, velocidad y experiencia de usuario para un público industrial B2B. Posicionamiento industrial: Estrategia SEO enfocada en posicionamiento en México, optimización técnica, estructura del sitio y adaptación de palabras clave industriales al mercado local.",
    "fases": [
      {
        "title": "Web funcional y escalable",
        "description": "Rediseño del sitio web con enfoque en usabilidad, claridad técnica, velocidad y experiencia de usuario para un público industrial B2B."
      },
      {
        "title": "Posicionamiento industrial",
        "description": "Estrategia SEO enfocada en posicionamiento en México, optimización técnica, estructura del sitio y adaptación de palabras clave industriales al mercado local."
      }
    ],
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/695ea6fceb27cdd594fa36c6_El%20secreto%201.png",
    "seo": {
      "metaTitle": "Eagle Superabrasives | Caso de Éxito Hiweb",
      "metaDescription": "Conoce cómo Hiweb rediseñó y optimizó el sitio web de Eagle Superabrasives en México, fortaleciendo su estructura, SEO y posicionamiento en buscadores para el mercado industrial."
    }
  },
  "peninsula-project": {
    "cliente": "Península Project",
    "industria": {
      "id": "turismo-hoteleria"
    },
    "servicios": [
      {
        "id": "redes-sociales"
      },
      {
        "id": "meta-ads"
      }
    ],
    "resultadoFrase": "+315.4% alcance en redes",
    "titulo": "Empresa especializada en diseñar viajes por carretera que conectan con la esencia auténtica de Yucatán, a través de experiencias personalizadas y un enfoque artesanal.",
    "resumen": "Descubre cómo Hiweb impulsó la visibilidad y el reconocimiento de Península Project mediante redes sociales y pauta digital, posicionando experiencias de viaje auténticas en Yucatán.",
    "destacado": true,
    "accent": "cyan",
    "metricas": [
      {
        "valor": 315.4,
        "label": "Alcance en redes",
        "prefix": "+",
        "suffix": "%",
        "decimals": 1,
        "despues": "Incremento significativo en personas únicas alcanzadas, fortaleciendo el reconocimiento del proyecto."
      },
      {
        "valor": 197900,
        "label": "Visualizaciones en Instagram",
        "prefix": "+",
        "despues": "El contenido logró una expansión acelerada, exponiendo la marca a nuevas audiencias interesadas en experiencias de viaje."
      },
      {
        "valor": 3500,
        "label": "Clics en enlaces",
        "prefix": "+",
        "despues": "Los usuarios mostraron una intención clara de conocer rutas, recorridos y detalles del proyecto."
      },
      {
        "valor": 61000,
        "label": "Visualizaciones en TikTok",
        "prefix": "+",
        "despues": "Un video orgánico logró alto alcance y generó más de 1,000 nuevos seguidores en poco tiempo."
      }
    ],
    "reto": "Península Project buscaba aumentar su visibilidad y reconocimiento de marca en un mercado turístico competitivo, destacando su propuesta de valor basada en experiencias auténticas y personalizadas. Su objetivo era atraer nuevos viajeros, generar interés real en sus rutas y posicionarse como una alternativa al turismo convencional mediante redes sociales y pauta digital.",
    "estrategia": "Storytelling de marca: Gestión de redes sociales enfocada en storytelling visual, construcción de comunidad y posicionamiento de experiencias auténticas de viaje en Yucatán. Pauta de descubrimiento: Implementación de campañas publicitarias enfocadas en alcance, reconocimiento de marca y atracción de viajeros interesados en experiencias personalizadas.",
    "fases": [
      {
        "title": "Storytelling de marca",
        "description": "Gestión de redes sociales enfocada en storytelling visual, construcción de comunidad y posicionamiento de experiencias auténticas de viaje en Yucatán."
      },
      {
        "title": "Pauta de descubrimiento",
        "description": "Implementación de campañas publicitarias enfocadas en alcance, reconocimiento de marca y atracción de viajeros interesados en experiencias personalizadas."
      }
    ],
    "testimonio": {
      "quote": "Ahora las personas entienden mejor lo que hacemos. Las redes nos ayudaron a contar la experiencia de viajar con Península Project, no solo a mostrar destinos.",
      "name": "Lydia R.",
      "role": "Área de Experiencias, Península Project"
    },
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/695422cb16bd1b912597fda2_10%201.png",
    "seo": {
      "metaTitle": "Península Project | Caso de Éxito Hiweb",
      "metaDescription": "Descubre cómo Hiweb impulsó la visibilidad y el reconocimiento de Península Project mediante redes sociales y pauta digital, posicionando experiencias de viaje auténticas en Yucatán."
    }
  },
  "gaios": {
    "cliente": "Gaios",
    "industria": {
      "id": "restaurantes"
    },
    "servicios": [
      {
        "id": "redes-sociales"
      },
      {
        "id": "meta-ads"
      }
    ],
    "resultadoFrase": "+71.4% visitas al perfil",
    "titulo": "Restaurante de desayunos y almuerzos ubicado en Gran San Pedro Cholul, Mérida, con una propuesta variada, accesible y pensada para disfrutar en cualquier momento del día.",
    "resumen": "Descubre cómo Hiweb impulsó la visibilidad y afluencia de Gaios mediante redes sociales, pauta digital y contenido audiovisual para un restaurante en Mérida.",
    "destacado": false,
    "accent": "orange",
    "metricas": [
      {
        "valor": 71.4,
        "label": "Visitas al perfil",
        "prefix": "+",
        "suffix": "%",
        "decimals": 1,
        "despues": "Más usuarios ingresaron al perfil para conocer menú, ubicación y concepto del restaurante."
      },
      {
        "valor": 62,
        "label": "Engagement",
        "prefix": "+",
        "suffix": "%",
        "despues": "Incremento constante en likes, comentarios y compartidos, reflejando interés real en la propuesta del restaurante."
      },
      {
        "valor": 85,
        "label": "Visualizaciones",
        "prefix": "+",
        "suffix": "%",
        "despues": "El contenido logró una alta exposición, especialmente en reels de platillos y experiencia en el restaurante."
      },
      {
        "valor": 58,
        "label": "Clics en enlaces",
        "prefix": "+",
        "suffix": "%",
        "despues": "Usuarios dirigidos desde redes sociales para consultar ubicación, contacto y más información."
      }
    ],
    "reto": "Gaios buscaba aumentar su visibilidad local, atraer más comensales a su restaurante y fortalecer el reconocimiento de marca en una zona con alta competencia gastronómica. Su objetivo era utilizar redes sociales y pauta digital para mostrar su propuesta de comida, generar antojo y convertir la atención digital en visitas físicas al restaurante.",
    "estrategia": "Gestión de comunidad: Gestión de redes sociales enfocada en visibilidad local, antojo visual y conexión constante con la comunidad del restaurante. Pauta local: Implementación de campañas publicitarias para alcance local, atracción de nuevos clientes y promoción del restaurante en su zona de influencia. Contenido audiovisual y fotográfico: Producción de fotografía y video para mostrar platillos, ambiente, experiencias y momentos reales dentro del restaurante.",
    "fases": [
      {
        "title": "Gestión de comunidad",
        "description": "Gestión de redes sociales enfocada en visibilidad local, antojo visual y conexión constante con la comunidad del restaurante."
      },
      {
        "title": "Pauta local",
        "description": "Implementación de campañas publicitarias para alcance local, atracción de nuevos clientes y promoción del restaurante en su zona de influencia."
      },
      {
        "title": "Contenido audiovisual y fotográfico",
        "description": "Producción de fotografía y video para mostrar platillos, ambiente, experiencias y momentos reales dentro del restaurante."
      }
    ],
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/695423205cca63a80880b3bd_11%201.png",
    "seo": {
      "metaTitle": "Gaios | Caso de Éxito Hiweb",
      "metaDescription": "Descubre cómo Hiweb impulsó la visibilidad y afluencia de Gaios mediante redes sociales, pauta digital y contenido audiovisual para un restaurante en Mérida."
    }
  },
  "happy-store": {
    "cliente": "Happy Store",
    "industria": {
      "id": ""
    },
    "servicios": [
      {
        "id": "redes-sociales"
      },
      {
        "id": "meta-ads"
      }
    ],
    "resultadoFrase": "+76,300 visualizaciones",
    "titulo": "Tienda online especializada en productos importados originales de maquillaje, cuidado personal, cuidado masculino, vitaminas y suplementos de marcas reconocidas.",
    "resumen": "Conoce cómo Hiweb impulsó la visibilidad, el alcance y las ventas de Happy Store mediante redes sociales, pauta digital y producción de contenido audiovisual para e-commerce.",
    "destacado": true,
    "accent": "purple",
    "metricas": [
      {
        "valor": 76300,
        "label": "Visualizaciones",
        "prefix": "+",
        "despues": "Tras un periodo de estancamiento antes de Hiweb, el contenido logró duplicar las visualizaciones en menos de un mes."
      },
      {
        "valor": 98,
        "label": "Alcance en redes",
        "prefix": "+",
        "suffix": "%",
        "despues": "Mayor alcance del contenido, mostrando productos a nuevas audiencias interesadas en beauty y cuidado personal."
      },
      {
        "valor": 738,
        "label": "Interacciones",
        "prefix": "+",
        "despues": "Incremento claro en likes, comentarios y guardados gracias a contenido estratégico y videos cortos."
      },
      {
        "valor": 95,
        "label": "Clics en enlaces",
        "prefix": "+",
        "suffix": "%",
        "despues": "Usuarios dirigidos directamente desde redes sociales para conocer productos y realizar compras."
      }
    ],
    "reto": "Happy Store buscaba aumentar su visibilidad de marca, generar mayor alcance en redes sociales y fortalecer sus ventas online en un mercado altamente competitivo. Su objetivo era destacar frente a otras tiendas digitales, atraer nuevos clientes y comunicar confianza a través de contenido visual atractivo y campañas de pauta enfocadas en conversión.",
    "estrategia": "Gestión y crecimiento: Gestión de redes sociales enfocada en visibilidad, posicionamiento de marca y conexión con audiencias interesadas en belleza, cuidado personal y bienestar. Pauta para e-commerce: Implementación de campañas publicitarias enfocadas en alcance, tráfico y conversión para impulsar ventas online y reconocimiento de marca. Contenido audiovisual y fotográfico: Producción de contenido fotográfico y de video para mostrar productos, rutinas, beneficios y generar confianza en la experiencia de compra.",
    "fases": [
      {
        "title": "Gestión y crecimiento",
        "description": "Gestión de redes sociales enfocada en visibilidad, posicionamiento de marca y conexión con audiencias interesadas en belleza, cuidado personal y bienestar."
      },
      {
        "title": "Pauta para e-commerce",
        "description": "Implementación de campañas publicitarias enfocadas en alcance, tráfico y conversión para impulsar ventas online y reconocimiento de marca."
      },
      {
        "title": "Contenido audiovisual y fotográfico",
        "description": "Producción de contenido fotográfico y de video para mostrar productos, rutinas, beneficios y generar confianza en la experiencia de compra."
      }
    ],
    "testimonio": {
      "quote": "Con el apoyo de Hiweb logramos que la marca se viera más profesional y cercana. Hoy sentimos una conexión más real con quienes nos compran.",
      "name": "Amanda D.",
      "role": "Fundadora, Happy Store"
    },
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/69542350c17165f5b99a5eee_9%201.png",
    "seo": {
      "metaTitle": "Happy Store | Caso de Éxito Hiweb",
      "metaDescription": "Conoce cómo Hiweb impulsó la visibilidad, el alcance y las ventas de Happy Store mediante redes sociales, pauta digital y producción de contenido audiovisual para e-commerce."
    }
  },
  "zapateria-la-peninsula": {
    "cliente": "Zapatería La Península",
    "industria": {
      "id": ""
    },
    "servicios": [
      {
        "id": "redes-sociales"
      },
      {
        "id": "meta-ads"
      }
    ],
    "resultadoFrase": "+450,000 visualizaciones en tiktok",
    "titulo": "Zapatería enfocada en moda y calzado para todas las edades, con 4 sucursales en Mérida, Yucatán",
    "resumen": "Conoce cómo Hiweb impulsó la visibilidad y el reconocimiento de Zapatería La Península mediante redes sociales y pauta, fortaleciendo marca y aumentando el ticket promedio en retail.",
    "destacado": false,
    "accent": "purple",
    "metricas": [
      {
        "valor": 450000,
        "label": "Visualizaciones en TikTok",
        "prefix": "+",
        "despues": "Crecimiento fuerte en alcance orgánico con contenido de alto rendimiento."
      },
      {
        "valor": 84.7,
        "label": "Engagement",
        "prefix": "+",
        "suffix": "%",
        "decimals": 1,
        "despues": "Alto nivel de engagement con contenido orgánico y pautado."
      },
      {
        "valor": 37300,
        "label": "Visualizaciones en Facebook",
        "prefix": "+",
        "despues": "Aumento constante en consumo de contenido de marca."
      },
      {
        "valor": 664,
        "label": "Seguidores en Instagram",
        "prefix": "+",
        "despues": "Crecimiento constante de seguidores a lo largo del año mediante contenido orgánico y estrategias de redes sociales."
      }
    ],
    "reto": "Zapatería La Península buscaba aumentar su visibilidad de marca en un mercado altamente competitivo, fortalecer el reconocimiento de su negocio y elevar su ticket promedio. Su objetivo era atraer nuevos clientes, impulsar ventas desde redes sociales y posicionarse como una zapatería referente para su público objetivo.",
    "estrategia": "Gestión de marca: Gestión integral de redes sociales enfocada en visibilidad, posicionamiento de marca y conexión constante con clientes potenciales mediante contenido atractivo. Pauta para retail: Ejecución de campañas publicitarias orientadas a alcance, tráfico y conversión para impulsar ventas y reconocimiento de marca. Contenido audiovisual y gráfico: Creación y grabación de contenido audiovisual y gráfico enfocado en productos, tendencias y estilo de vida para fortalecer la identidad visual de la marca.",
    "fases": [
      {
        "title": "Gestión de marca",
        "description": "Gestión integral de redes sociales enfocada en visibilidad, posicionamiento de marca y conexión constante con clientes potenciales mediante contenido atractivo."
      },
      {
        "title": "Pauta para retail",
        "description": "Ejecución de campañas publicitarias orientadas a alcance, tráfico y conversión para impulsar ventas y reconocimiento de marca."
      },
      {
        "title": "Contenido audiovisual y gráfico",
        "description": "Creación y grabación de contenido audiovisual y gráfico enfocado en productos, tendencias y estilo de vida para fortalecer la identidad visual de la marca."
      }
    ],
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/6958364329166e3fc1d81c96_Copia%20de%20Sin%20ti%CC%81tulo%201.png",
    "seo": {
      "metaTitle": "Zapatería La Península | Caso de Éxito Hiweb",
      "metaDescription": "Conoce cómo Hiweb impulsó la visibilidad y el reconocimiento de Zapatería La Península mediante redes sociales y pauta, fortaleciendo marca y aumentando el ticket promedio en retail."
    }
  },
  "enfoque-21": {
    "cliente": "Enfoque 21",
    "industria": {
      "id": ""
    },
    "servicios": [
      {
        "id": "seo"
      },
      {
        "id": "redes-sociales"
      }
    ],
    "resultadoFrase": "+236 usuarios nuevos",
    "titulo": "Estudio de fotografía de bodas de destino en Mérida, Yucatán, enfocado en capturar historias auténticas y emocionales para parejas que buscan experiencias únicas.",
    "resumen": "Descubre cómo Hiweb ayudó a Enfoque 21 a posicionarse como fotógrafo de bodas en Mérida mediante SEO y redes sociales, aumentando visibilidad local y tráfico calificado.",
    "destacado": false,
    "accent": "cyan",
    "metricas": [
      {
        "valor": 236,
        "label": "Usuarios nuevos",
        "prefix": "+",
        "despues": "Usuarios nuevos generados durante los primeros meses de trabajo SEO."
      },
      {
        "valor": 576,
        "label": "Visitas en el sitio",
        "prefix": "+",
        "despues": "Incremento en visitas mensuales a páginas clave como home, portafolio y precios."
      },
      {
        "valor": 35,
        "label": "Alcance en redes",
        "prefix": "+",
        "suffix": "%",
        "despues": "Incremento en el alcance del contenido entre parejas interesadas en fotografía de bodas en Mérida."
      },
      {
        "valor": 28,
        "label": "Engagement",
        "prefix": "+",
        "suffix": "%",
        "despues": "Mayor interacción con contenido del portafolio, historias y publicaciones de bodas reales."
      }
    ],
    "reto": "Enfoque 21 buscaba posicionarse en Mérida como un fotógrafo de bodas reconocido, aumentar su visibilidad digital y fortalecer su presencia de marca. Llegaron a Hiweb de forma orgánica desde Google, con el objetivo de atraer parejas interesadas en fotografía de bodas de destino y diferenciarse en un mercado altamente competitivo.",
    "estrategia": "Posicionamiento local: Optimización SEO enfocada en visibilidad local, estructura del sitio y palabras clave relacionadas con fotografía de bodas en Mérida y bodas de destino. Presencia de marca: Estrategia de contenido para redes sociales enfocada en mostrar el portafolio, reforzar la identidad de marca y aumentar el alcance entre parejas interesadas en bodas de destino. Impulso de visibilidad: Implementación de campañas publicitarias para aumentar la visibilidad del estudio, dirigir tráfico al sitio web y reforzar el posicionamiento de marca en un mercado competitivo.",
    "fases": [
      {
        "title": "Posicionamiento local",
        "description": "Optimización SEO enfocada en visibilidad local, estructura del sitio y palabras clave relacionadas con fotografía de bodas en Mérida y bodas de destino."
      },
      {
        "title": "Presencia de marca",
        "description": "Estrategia de contenido para redes sociales enfocada en mostrar el portafolio, reforzar la identidad de marca y aumentar el alcance entre parejas interesadas en bodas de destino."
      },
      {
        "title": "Impulso de visibilidad",
        "description": "Implementación de campañas publicitarias para aumentar la visibilidad del estudio, dirigir tráfico al sitio web y reforzar el posicionamiento de marca en un mercado competitivo."
      }
    ],
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/695304df92d082503c8fc4bc_1%20(1).png",
    "seo": {
      "metaTitle": "Enfoque 21 | Caso de Éxito Hiweb",
      "metaDescription": "Descubre cómo Hiweb ayudó a Enfoque 21 a posicionarse como fotógrafo de bodas en Mérida mediante SEO y redes sociales, aumentando visibilidad local y tráfico calificado."
    }
  },
  "pass-your-toefl": {
    "cliente": "Pass Your TOEFL",
    "industria": {
      "id": ""
    },
    "servicios": [
      {
        "id": "seo"
      },
      {
        "id": "desarrollo-web"
      },
      {
        "id": "google-ads"
      }
    ],
    "resultadoFrase": "+2,300 usuarios nuevos",
    "titulo": "Asesoría y entrenamiento TOEFL diseñado para hispanohablantes que buscan obtener puntajes altos.",
    "resumen": "Conoce cómo Hiweb impulsó el crecimiento digital de Pass Your TOEFL mediante SEO, web y Ads, aumentando visibilidad, tráfico orgánico y generación de leads para programas TOEFL de alto ticket.",
    "destacado": false,
    "accent": "orange",
    "metricas": [
      {
        "valor": 2300,
        "label": "Usuarios nuevos",
        "prefix": "+",
        "despues": "Usuarios nuevos generados durante el primer semestre del proyecto mediante estrategia digital."
      },
      {
        "valor": 1000,
        "label": "Vistas mensuales del sitio",
        "prefix": "+",
        "suffix": "%",
        "despues": "Incremento en el consumo de contenido y navegación del sitio web, pasando de 60 a 700 visitas en solo 8 meses."
      },
      {
        "valor": 78,
        "label": "Tráfico orgánico",
        "prefix": "+",
        "suffix": "%",
        "despues": "Aumento del tráfico calificado proveniente de búsquedas orgánicas en Google."
      },
      {
        "valor": 65,
        "label": "Intención de conversión",
        "prefix": "+",
        "suffix": "%",
        "despues": "Incremento en formularios, clics y acciones clave orientadas a venta."
      }
    ],
    "reto": "Pass Your buscaba un sitio web más profesional y enfocado en conversión, aumentar su visibilidad orgánica y generar ventas de programas de alto ticket. Llegaron a Hiweb de forma completamente orgánica desde Google, con el objetivo de escalar su presencia digital y atraer prospectos calificados mediante una estrategia integral.",
    "estrategia": "Estrategia orgánica: Implementación de una estrategia SEO enfocada en posicionamiento, contenidos educativos y visibilidad internacional para atraer tráfico calificado interesado en certificaciones TOEFL. UX y conversión: Rediseño del sitio web con enfoque en claridad, jerarquía de información y conversión, alineado a la venta de programas de alto ticket. Escalamiento de resultados: Apoyo con campañas digitales y contenidos en redes sociales para reforzar visibilidad, captación de leads y posicionamiento de marca.",
    "fases": [
      {
        "title": "Estrategia orgánica",
        "description": "Implementación de una estrategia SEO enfocada en posicionamiento, contenidos educativos y visibilidad internacional para atraer tráfico calificado interesado en certificaciones TOEFL."
      },
      {
        "title": "UX y conversión",
        "description": "Rediseño del sitio web con enfoque en claridad, jerarquía de información y conversión, alineado a la venta de programas de alto ticket."
      },
      {
        "title": "Escalamiento de resultados",
        "description": "Apoyo con campañas digitales y contenidos en redes sociales para reforzar visibilidad, captación de leads y posicionamiento de marca."
      }
    ],
    "testimonio": {
      "quote": "Contratamos a Hiweb para que nos ayudara a tener más alumnos, y realmente ha funcionado muy bien. Desde que empezamos a trabajar con ellos, hemos notado un aumento claro en las inscripciones. El equipo es profesional, atento y siempre está pendiente de lo que necesitamos. Nos sienten como parte de su equipo y eso se nota en los resultados.",
      "name": "Gaby M.",
      "role": "Coordinadora de Marketing, Pass your TOEFL"
    },
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/6a1315449ce2c3576da12898_PYT.jpg",
    "seo": {
      "metaTitle": "Pass Your TOEFL | Caso de Éxito Hiweb",
      "metaDescription": "Conoce cómo Hiweb impulsó el crecimiento digital de Pass Your TOEFL mediante SEO, web y Ads, aumentando visibilidad, tráfico orgánico y generación de leads para programas TOEFL de alto ticket."
    }
  },
  "residenciales-merida": {
    "cliente": "Residenciales Mérida",
    "industria": {
      "id": "inmobiliarias"
    },
    "servicios": [
      {
        "id": "redes-sociales"
      },
      {
        "id": "meta-ads"
      }
    ],
    "resultadoFrase": "+197,900 visualizaciones",
    "titulo": "Empresa líder en asesoría inmobiliaria en Yucatán, especializada en la promoción y venta de desarrollos residenciales en un mercado altamente competitivo.",
    "resumen": "Descubre cómo Hiweb impulsó la visibilidad y generación de leads de Residenciales Mérida mediante redes sociales y pauta digital en un mercado inmobiliario altamente competitivo.",
    "destacado": false,
    "accent": "purple",
    "metricas": [
      {
        "valor": 197900,
        "label": "Visualizaciones",
        "prefix": "+",
        "despues": "El contenido logró una alta exposición, aumentando la visibilidad de desarrollos y propiedades en un mercado altamente competitivo."
      },
      {
        "valor": 315.4,
        "label": "Alcance en redes",
        "prefix": "+",
        "suffix": "%",
        "decimals": 1,
        "despues": "Incremento significativo en el número de personas únicas que vieron el contenido de la marca."
      },
      {
        "valor": 417,
        "label": "Clics en enlaces",
        "prefix": "+",
        "despues": "Los usuarios mostraron mayor intención de conocer proyectos y solicitar información desde redes sociales."
      },
      {
        "valor": 137,
        "label": "Nuevos seguidores",
        "prefix": "+",
        "suffix": "%",
        "despues": "Incremento sostenido de la audiencia interesada en el mercado inmobiliario de Yucatán."
      }
    ],
    "reto": "Residenciales Mérida buscaba aumentar su visibilidad y generación de leads en un entorno inmobiliario altamente competitivo. Su objetivo era destacar sus marcas, impulsar nuevas ventas y captar prospectos calificados a través de redes sociales y campañas de pauta enfocadas en conversión y posicionamiento de marca.",
    "estrategia": "Contenido estratégico: Gestión de redes sociales (Facebook, Instagram y TikTok) enfocada en visibilidad, storytelling inmobiliario y presentación clara de proyectos para atraer y conectar con compradores potenciales. Pauta orientada a leads: Implementación de campañas publicitarias enfocadas en generación de leads, aumento de alcance y posicionamiento de marcas inmobiliarias en redes sociales. Contenido audiovisual y gráfico: Grabación y creación de contenido audiovisual y gráfico para redes sociales, enfocado en mostrar propiedades, estilos de vida y proyectos de forma atractiva y comercial.",
    "fases": [
      {
        "title": "Contenido estratégico",
        "description": "Gestión de redes sociales (Facebook, Instagram y TikTok) enfocada en visibilidad, storytelling inmobiliario y presentación clara de proyectos para atraer y conectar con compradores potenciales."
      },
      {
        "title": "Pauta orientada a leads",
        "description": "Implementación de campañas publicitarias enfocadas en generación de leads, aumento de alcance y posicionamiento de marcas inmobiliarias en redes sociales."
      },
      {
        "title": "Contenido audiovisual y gráfico",
        "description": "Grabación y creación de contenido audiovisual y gráfico para redes sociales, enfocado en mostrar propiedades, estilos de vida y proyectos de forma atractiva y comercial."
      }
    ],
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/6953084a940124a03957b60d_4%20(1).png",
    "seo": {
      "metaTitle": "Residenciales Mérida | Caso de Éxito Hiweb",
      "metaDescription": "Descubre cómo Hiweb impulsó la visibilidad y generación de leads de Residenciales Mérida mediante redes sociales y pauta digital en un mercado inmobiliario altamente competitivo."
    }
  },
  "paulos-pizza": {
    "cliente": "Paulo’s Pizza",
    "industria": {
      "id": "restaurantes"
    },
    "servicios": [
      {
        "id": "redes-sociales"
      },
      {
        "id": "meta-ads"
      }
    ],
    "resultadoFrase": "+14.6% visitas al perfil",
    "titulo": "Pizzería artesanal en horno de piedra ubicada en Mérida, Yucatán, enfocada en ofrecer pizzas de calidad, sabor auténtico y una experiencia casual y cercana.",
    "resumen": "Descubre cómo Hiweb impulsó la visibilidad y afluencia de Paulo’s Pizza mediante redes sociales, pauta digital y contenido audiovisual para una pizzería artesanal en Mérida.",
    "destacado": false,
    "accent": "cyan",
    "metricas": [
      {
        "valor": 14.6,
        "label": "Visitas al perfil",
        "prefix": "+",
        "suffix": "%",
        "decimals": 1,
        "despues": "El aumento refleja que más personas ingresan al perfil después de ver el contenido en redes."
      },
      {
        "valor": 65.7,
        "label": "Alcance",
        "prefix": "+",
        "suffix": "%",
        "decimals": 1,
        "despues": "Mayor interacción con reels, videos y publicaciones de pizzas y procesos artesanales."
      },
      {
        "valor": 41,
        "label": "Clics en enlaces",
        "prefix": "+",
        "suffix": "%",
        "despues": "Más usuarios dieron el paso de consultar menú, ubicación o contacto desde redes sociales."
      },
      {
        "valor": 185.9,
        "label": "Seguidores en Instagram",
        "prefix": "+",
        "suffix": "%",
        "decimals": 1,
        "despues": "Incremento acelerado de seguidores impulsado por contenido visual atractivo y presencia constante."
      }
    ],
    "reto": "Paulo’s Pizza buscaba aumentar su visibilidad local, atraer más clientes al restaurante y fortalecer el reconocimiento de marca en un mercado gastronómico altamente competitivo. Su objetivo era utilizar redes sociales, pauta digital y contenido visual para generar antojo, diferenciar su propuesta artesanal y convertir la atención digital en visitas presenciales.",
    "estrategia": "Gestión de comunidad: Gestión de redes sociales enfocada en visibilidad local, antojo visual y conexión constante con la comunidad y clientes del restaurante. Pauta local: Implementación de campañas publicitarias para alcance local, promoción de productos y atracción de nuevos clientes al restaurante. Contenido audiovisual y fotográfico: Producción de fotografía y video para mostrar pizzas, horno de piedra, procesos artesanales y ambiente real del restaurante.",
    "fases": [
      {
        "title": "Gestión de comunidad",
        "description": "Gestión de redes sociales enfocada en visibilidad local, antojo visual y conexión constante con la comunidad y clientes del restaurante."
      },
      {
        "title": "Pauta local",
        "description": "Implementación de campañas publicitarias para alcance local, promoción de productos y atracción de nuevos clientes al restaurante."
      },
      {
        "title": "Contenido audiovisual y fotográfico",
        "description": "Producción de fotografía y video para mostrar pizzas, horno de piedra, procesos artesanales y ambiente real del restaurante."
      }
    ],
    "testimonio": {
      "quote": "Desde que empezamos a trabajar con Hiweb, hemos notado un cambio muy positivo en nuestras ventas. Antes dependíamos mucho de las sucursales físicas, pero ahora, gracias a su estrategia digital, hemos logrado atraer más clientes y aumentar nuestros ingresos. El equipo es profesional, creativo y siempre está pendiente de nuestros resultados. Sin duda, una gran inversión para nuestro negocio.",
      "name": "Julia T.",
      "role": "Gerente de Marketing, Paulo’s Pizza"
    },
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/6953085fd7ae06cf48c59a49_6%20(1).png",
    "seo": {
      "metaTitle": "Paulo’s Pizza | Caso de Éxito Hiweb",
      "metaDescription": "Descubre cómo Hiweb impulsó la visibilidad y afluencia de Paulo’s Pizza mediante redes sociales, pauta digital y contenido audiovisual para una pizzería artesanal en Mérida."
    }
  },
  "industrial-basanlo": {
    "cliente": "Industrial Basanlo",
    "industria": {
      "id": "manufactura"
    },
    "servicios": [
      {
        "id": "seo"
      },
      {
        "id": "desarrollo-web"
      }
    ],
    "resultadoFrase": "+5,300 usuarios nuevos",
    "titulo": "Empresa especializada en soluciones logísticas y en la renta y venta de maquinaria pesada para proyectos industriales, ubicada en Monterrey, Nuevo León.",
    "resumen": "Descubre cómo Hiweb impulsó el crecimiento orgánico y el posicionamiento SEO de Industrial Basanlo, aumentando visibilidad, tráfico calificado y rendimiento del sitio web.",
    "destacado": false,
    "accent": "orange",
    "metricas": [
      {
        "valor": 5300,
        "label": "Usuarios nuevos",
        "prefix": "+",
        "despues": "Generados principalmente desde búsquedas orgánicas en Google."
      },
      {
        "valor": 79,
        "label": "Crecimiento de tráfico orgánico",
        "prefix": "+",
        "suffix": "%",
        "despues": "Aumento del tráfico desde Google gracias a la estrategia SEO implementada."
      },
      {
        "valor": 20,
        "label": "Keywords en el Top 10",
        "prefix": "+",
        "despues": "Palabras clave del sector industrial posicionadas en los primeros 10 lugares de Google."
      },
      {
        "valor": 312,
        "label": "Visitas mensuales al sitio",
        "prefix": "+",
        "despues": "Promedio mensual de visitas orgánicas sostenidas durante el periodo del proyecto."
      }
    ],
    "reto": "Industrial Basanlo buscaba construir un sitio web visualmente atractivo que transmitiera solidez industrial y, al mismo tiempo, lograra un buen posicionamiento orgánico en Google. Llegaron a Hiweb de forma completamente orgánica, con el objetivo de aumentar su visibilidad digital, atraer tráfico calificado y sentar bases sólidas de crecimiento SEO desde el inicio del proyecto.",
    "estrategia": "Código optimizado y funcional.: Desarrollamos la página web pensando en la optimización del sitio desde el día 1. Posicionamiento clave para la página.: Desarrollo e implementación de una estrategia SEO integral enfocada en estructura, contenidos y posicionamiento orgánico para generar visibilidad sostenida en buscadores.",
    "fases": [
      {
        "title": "Código optimizado y funcional.",
        "description": "Desarrollamos la página web pensando en la optimización del sitio desde el día 1."
      },
      {
        "title": "Posicionamiento clave para la página.",
        "description": "Desarrollo e implementación de una estrategia SEO integral enfocada en estructura, contenidos y posicionamiento orgánico para generar visibilidad sostenida en buscadores."
      }
    ],
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/695306be206ecb0f029b9fbb_2%20(1).png",
    "seo": {
      "metaTitle": "Industrial Basanlo | Caso de Éxito Hiweb",
      "metaDescription": "Descubre cómo Hiweb impulsó el crecimiento orgánico y el posicionamiento SEO de Industrial Basanlo, aumentando visibilidad, tráfico calificado y rendimiento del sitio web."
    }
  },
  "diazar": {
    "cliente": "Diazar",
    "industria": {
      "id": "saas"
    },
    "servicios": [
      {
        "id": "seo"
      },
      {
        "id": "desarrollo-web"
      },
      {
        "id": "redes-sociales"
      },
      {
        "id": "google-ads"
      }
    ],
    "resultadoFrase": "+2,100 usuarios únicos nuevos",
    "titulo": "Software ERP especializado en proyectos de construcción en México, enfocado en optimizar procesos, control y toma de decisiones para constructoras y desarrolladores.",
    "resumen": "Conoce cómo Hiweb impulsó el posicionamiento digital de Diazar mediante SEO, web, redes sociales y Ads, construyendo visibilidad nacional y generando intención comercial para su ERP de construcción.",
    "destacado": true,
    "accent": "orange",
    "metricas": [
      {
        "valor": 2100,
        "label": "Usuarios únicos nuevos",
        "prefix": "+",
        "despues": "Activación de tráfico real desde una presencia digital inicial sin tracción durante los primeros 3 meses."
      },
      {
        "valor": 2600,
        "label": "Sesiones en el sitio",
        "prefix": "+",
        "despues": "Generación sostenida de sesiones tras optimización SEO y web. en el primer trimestre."
      },
      {
        "valor": 42,
        "label": "Alcance en redes",
        "prefix": "+",
        "suffix": "%",
        "despues": "Incremento en alcance del contenido entre constructoras y profesionales del sector construcción."
      },
      {
        "valor": 31,
        "label": "Engagement",
        "prefix": "+",
        "suffix": "%",
        "despues": "Mayor interacción en publicaciones educativas sobre control, gestión y tecnología para obra."
      }
    ],
    "reto": "Diazar buscaba posicionarse en buscadores a nivel nacional, renovar su sitio web y fortalecer su presencia de marca en canales digitales. Llegaron a Hiweb de forma orgánica desde Google, con el objetivo de generar visibilidad, construir autoridad en su industria y aumentar la captación de leads calificados a través del sitio web y redes sociales.",
    "estrategia": "Presencia de marca: Estrategia de contenido para redes sociales orientada a posicionar la marca, comunicar beneficios del ERP y otros productos, así como reforzar autoridad en el sector de la construcción. Posicionamiento nacional: Estrategia SEO enfocada en posicionamiento a nivel nacional, estructura del sitio, metadatos, contenido (blogs) y palabras clave relacionadas con software y gestión de proyectos de construcción. Web estratégica: Renovación del sitio web con enfoque en claridad, propuesta de valor, experiencia de usuario y captación de leads.",
    "fases": [
      {
        "title": "Presencia de marca",
        "description": "Estrategia de contenido para redes sociales orientada a posicionar la marca, comunicar beneficios del ERP y otros productos, así como reforzar autoridad en el sector de la construcción."
      },
      {
        "title": "Posicionamiento nacional",
        "description": "Estrategia SEO enfocada en posicionamiento a nivel nacional, estructura del sitio, metadatos, contenido (blogs) y palabras clave relacionadas con software y gestión de proyectos de construcción."
      },
      {
        "title": "Web estratégica",
        "description": "Renovación del sitio web con enfoque en claridad, propuesta de valor, experiencia de usuario y captación de leads."
      }
    ],
    "testimonio": {
      "quote": "El nuevo sitio y la estrategia digital nos han ayudado a recibir prospectos más interesados en conocer la plataforma.",
      "name": "Carolina M.",
      "role": "Área Comercial, Diazar"
    },
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/69530801904bf8333c82b1ba_5%20(1).png",
    "seo": {
      "metaTitle": "Diazar | Caso de Éxito Hiweb",
      "metaDescription": "Conoce cómo Hiweb impulsó el posicionamiento digital de Diazar mediante SEO, web, redes sociales y Ads, construyendo visibilidad nacional y generando intención comercial para su ERP de construcción."
    }
  },
  "avant-rent-a-car": {
    "cliente": "Avant Rent a Car",
    "industria": {
      "id": "turismo-hoteleria"
    },
    "servicios": [
      {
        "id": "seo"
      },
      {
        "id": "google-ads"
      },
      {
        "id": "desarrollo-web"
      }
    ],
    "resultadoFrase": "+37,000 nuevos usuarios orgánicos",
    "titulo": "Empresa de renta de autos en Cancún con enfoque turístico, especializada en ofrecer soluciones confiables de movilidad a clientes nacionales e internacionales.",
    "resumen": "Descubre cómo Hiweb optimizó SEO, Google Ads y el sitio web de Avant Rent a Car para mejorar visibilidad, rendimiento y captación de clientes en Cancún y el extranjero.",
    "destacado": true,
    "accent": "cyan",
    "metricas": [
      {
        "valor": 37000,
        "label": "Nuevos usuarios orgánicos",
        "prefix": "+",
        "despues": "Incremento de usuarios desde búsquedas orgánicas gracias a estrategia SEO bilingüe."
      },
      {
        "valor": 10,
        "label": "Keywords en Top 10",
        "prefix": "+",
        "despues": "Palabras clave estratégicas posicionadas en Top 10 de Google durante el periodo del proyecto."
      },
      {
        "valor": 4525,
        "label": "Conversiones generadas",
        "prefix": "+",
        "despues": "Aumento significativo de conversiones mediante campañas de búsqueda y Performance Max."
      },
      {
        "valor": 123000,
        "label": "Vistas de página",
        "prefix": "+",
        "despues": "Interacciones y consumo de contenido registradas el primer año del proyecto"
      }
    ],
    "reto": "Avant Rent a Car llegó a Hiweb con tres necesidades principales: Mejorar su posicionamiento orgánico en Google, optimizar el retorno de inversión de sus campañas de Google Ads y resolver fallas técnicas del sitio web que afectaban su rendimiento, seguridad, experiencia de usuario y capacidad de conversión.",
    "estrategia": "Optimización y contenidos: Reestructuración de contenidos, optimización de metadatos, estrategia de blogs y mejoras técnicas a partir de una auditoría SEO para fortalecer visibilidad orgánica. Publicidad estratégica en buscadores: Implementación de campañas de Google Ads en búsqueda y Display, enfocadas en intención de compra y alineadas a servicios de renta de autos. UX y conversión: Rediseño y reestructuración del sitio con enfoque en experiencia de usuario, CTAs claros, navegación intuitiva y funcionamiento óptimo en móvil y desktop.",
    "fases": [
      {
        "title": "Optimización y contenidos",
        "description": "Reestructuración de contenidos, optimización de metadatos, estrategia de blogs y mejoras técnicas a partir de una auditoría SEO para fortalecer visibilidad orgánica."
      },
      {
        "title": "Publicidad estratégica en buscadores",
        "description": "Implementación de campañas de Google Ads en búsqueda y Display, enfocadas en intención de compra y alineadas a servicios de renta de autos."
      },
      {
        "title": "UX y conversión",
        "description": "Rediseño y reestructuración del sitio con enfoque en experiencia de usuario, CTAs claros, navegación intuitiva y funcionamiento óptimo en móvil y desktop."
      }
    ],
    "testimonio": {
      "quote": "Las campañas de Google Ads fueron claras, estratégicas y enfocadas en generar clientes con intención real de renta.",
      "name": "Sebastian S.",
      "role": "Área de Marketing, Avant Rent a Car"
    },
    "cover": "https://cdn.prod.website-files.com/65d62528ef033d56ee0665d1/695306f8d7093494b40e94d4_3%20(1).png",
    "seo": {
      "metaTitle": "Avant Rent a Car | Caso de Éxito Hiweb",
      "metaDescription": "Descubre cómo Hiweb optimizó SEO, Google Ads y el sitio web de Avant Rent a Car para mejorar visibilidad, rendimiento y captación de clientes en Cancún y el extranjero."
    }
  }
};
