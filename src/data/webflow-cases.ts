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
    "resumen": "Renovamos la presencia en redes y lanzamos campañas digitales para atraer más visitas a la boutique y reforzar su identidad en Mérida.",
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
    "reto": "El Secreto buscaba consolidar su presencia de marca en un mercado retail altamente competitivo:\n\n- **Identidad y posicionamiento:** Destacar su propuesta como concept boutique exclusiva en Mérida.\n- **Atracción de nuevas clientas:** Captar compradoras interesadas en moda contemporánea y piezas de edición limitada.\n- **Reconocimiento visual:** Elevar el valor percibido de sus colecciones a través de canales digitales.",
    "estrategia": "- **Gestión y dirección de marca:** Creación de contenido visual de alto impacto para redes sociales, construyendo coherencia estética y conexión emocional con una audiencia femenina selecta.\n- **Pauta publicitaria de alcance y venta:** Campañas segmentadas en Meta Ads enfocadas en descubrimiento de marca, tráfico a boutique y conversión de clientas locales y foráneas.",
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
    "resumen": "Contenido técnico y anuncios dirigidos a odontólogos y clínicas para generar confianza y cerrar convenios de trabajo con el laboratorio.",
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
    "reto": "Restaura buscaba posicionarse ante odontólogos y clínicas como un laboratorio dental especializado y de alta tecnología:\n\n- **Reconocimiento profesional:** Diferenciarse por su precisión digital CAD/CAM, materiales certificados y tiempos de entrega.\n- **Captación de nuevas clínicas:** Abrir convenios de trabajo continuo con especialistas en prótesis, implantes y estética dental.\n- **Comunicación técnica y confiable:** Transmitir respaldo clínico y tecnológico en canales digitales.",
    "estrategia": "- **Comunicación técnica especializada:** Gestión de redes sociales enfocada en mostrar casos clínicos, ajustes microscópicos y tecnología de escaneo 3D.\n- **Pauta digital B2B para odontólogos:** Campañas publicitarias segmentadas a cirujanos dentistas y clínicas especializadas en la región.\n- **Construcción de confianza:** Contenido educativo sobre protocolos de envío digital, garantías de ajuste y soporte directo entre técnicos y doctores.",
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
    "resumen": "Rediseñamos su web y pulimos el SEO técnico para que compradores industriales encuentren sus productos y soliciten cotizaciones en Google.",
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
    "reto": "Eagle Superabrasives buscaba renovar su presencia digital en México para capturar demanda industrial especializada:\n\n- **Presencia en buscadores:** Posicionarse en los primeros resultados de Google para ruedas y herramientas superabrasivas.\n- **Adaptación técnica al mercado local:** Estructurar y traducir su catálogo técnico al español con precisión para compradores industriales.\n- **Renovación de plataforma:** Desarrollar un sitio web moderno, rápido y orientado a solicitudes de cotización B2B.",
    "estrategia": "- **SEO industrial especializado:** Optimización técnica profunda, arquitectura de URLs por familias de producto y posicionamiento en términos de manufactura y rectificado de precisión en México.\n- **Web funcional y escalable:** Rediseño completo con enfoque en usabilidad técnica, velocidad de carga y presentación clara de especificaciones para ingenieros de planta y compradores industriales.",
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
    "resumen": "Historias visuales auténticas y campañas digitales para dar a conocer expediciones únicas por Yucatán y convertirlas en reservas.",
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
    "reto": "Península Project buscaba posicionar su propuesta de viajes auténticos frente a los tours comerciales tradicionales:\n\n- **Posicionamiento de valor:** Comunicar experiencias culturales personalizadas lejos del turismo masivo.\n- **Atracción de viajeros conscientes:** Conectar con personas interesadas en explorar la península de forma privada y respetuosa.\n- **Generación de consultas directas:** Diseñar un canal digital que facilitara la planeación y cotización de itinerarios.",
    "estrategia": "- **Storytelling visual y comunidad:** Gestión de redes sociales centrada en relatos de viaje, paisajes naturales y cultura maya viva.\n- **Pauta de descubrimiento de marca:** Campañas en Meta Ads segmentadas a viajeros con afinidad por turismo de naturaleza, aventura y cultura.\n- **Acompañamiento a conversión:** Mensajes estructurados para guiar al usuario desde el primer contacto en redes hasta la reserva personalizada.",
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
    "resumen": "Producción de video con antojo real y pauta local para llenar mesas y mantener el restaurante siempre presente en la mente de Mérida.",
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
    "reto": "Gaios buscaba destacar en una zona con alta oferta culinaria y consolidar su flujo de comensales:\n\n- **Atracción de visitas presenciales:** Convertir la atención de redes sociales en mesas ocupadas de martes a domingo.\n- **Posicionamiento de concepto:** Comunicar la calidad de su cocina artesanal, desayunos y café de especialidad.\n- **Presencia en su radio de influencia:** Dominar las búsquedas y recomendaciones en la zona norte de Mérida.",
    "estrategia": "- **Gestión de comunidad y antojo visual:** Contenido en video y fotografía de alta resolución enfocado en textura, preparación artesanal y experiencia en mesa.\n- **Pauta publicitaria geolocalizada:** Campañas de Meta Ads hiperlocales con optimización horaria para impulsar reservaciones y visitas espontáneas durante fines de semana.\n- **Producción audiovisual y fotográfica:** Sesiones continuas para capturar nuevos platillos, panadería horneada en casa y el ambiente del restaurante.",
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
    "resumen": "Videos dinámicos para redes y anuncios segmentados que aumentaron los pedidos en línea y el ticket promedio de compra.",
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
    "reto": "Happy Store buscaba acelerar su crecimiento comercial en un mercado de cosméticos saturado de réplicas:\n\n- **Confianza y autenticidad:** Comunicar la procedencia 100% original de productos importados de skincare coreano y estadounidense.\n- **Escalabilidad de ventas online:** Diseñar un embudo digital rentable para aumentar pedidos en su tienda en línea.\n- **Diferenciación en redes sociales:** Crear contenido educativo que guiara a las usuarias según su tipo de piel.",
    "estrategia": "- **Pauta de rendimiento (Performance Ads):** Campañas de Meta Ads con catálogo dinámico, segmentación por intereses de belleza y retargeting orientado a maximizar ROAS.\n- **Estrategia y gestión de redes sociales:** Contenido dinámico con unboxings, comparativas de rutina y testimonios reales de clientas.\n- **Producción fotográfica y audiovisual:** Generación de contenido visual de producto, destacando texturas, empaques originales y beneficios inmediatos de uso.",
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
    "resumen": "Videos entretenidos en TikTok que superaron las 450 mil vistas, revitalizaron la marca y llevaron más clientes a las tiendas físicas.",
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
    "reto": "Zapatería La Península buscaba modernizar su presencia comercial e incrementar el ticket promedio en sus sucursales:\n\n- **Atracción de nuevas generaciones:** Rejuvenecer la percepción de la marca manteniendo la fidelidad de sus clientes tradicionales.\n- **Impulso de tráfico a tiendas físicas:** Conectar las promociones y novedades digitales con visitas directas a sucursales en Mérida.\n- **Activación de ventas por temporada:** Dinamizar las temporadas escolares, festivas y de cambio de colección mediante canales digitales.",
    "estrategia": "- **Gestión integral de redes sociales:** Contenido dinámico con enfoque en moda accesible, confort, recomendaciones de estilo y promociones vigentes.\n- **Pauta publicitaria para retail:** Campañas en Meta Ads con segmentación local enfocadas en tráfico a tiendas, catálogo de calzado y ofertas de temporada.\n- **Producción de contenido visual:** Sesiones fotográficas y reels dinámicos destacando tendencias, durabilidad de materiales y variedad para toda la familia.",
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
    "resumen": "Estrategia de SEO local y contenido visual para posicionar el estudio entre parejas que viajan a casarse a Yucatán.",
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
    "reto": "Enfoque 21 llegó a Hiweb de forma orgánica desde Google con tres objetivos claros:\n\n- **Posicionamiento en bodas de destino:** Captar parejas nacionales y extranjeras que eligen Yucatán y la Riviera Maya para casarse.\n- **Diferenciación artística:** Resaltar su estilo documental y la calidad visual de su portafolio frente a la competencia.\n- **Generación de consultas de alto valor:** Aumentar las solicitudes de cotización para paquetes de fotografía premium.",
    "estrategia": "- **SEO local y de destino:** Optimización técnica y de contenidos orientada a búsquedas de alto valor como fotografía de bodas en Mérida, haciendas y playas de la península.\n- **Estrategia visual en redes sociales:** Curaduría de portafolio y narrativa visual en Instagram para conectar con parejas en etapa activa de planeación.\n- **Campañas de pauta publicitaria:** Pauta digital segmentada geográficamente para captar tráfico calificado y dirigirlo a un formulario de contacto de alta conversión.",
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
    "resumen": "Campañas estructuradas en Google y una web optimizada para captar estudiantes decididos a prepararse y certificar su nivel de inglés.",
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
    "reto": "Pass Your TOEFL llegó a Hiweb de forma orgánica buscando escalar su modelo educativo a nivel internacional:\n\n- **Captación de programas de alto ticket:** Transicionar de asesorías individuales a programas intensivos de alto valor.\n- **Autoridad y alcance global:** Posicionar su metodología ante estudiantes y profesionistas de toda América Latina.\n- **Plataforma web de alta conversión:** Rediseñar su sitio para comunicar resultados comprobados y facilitar la inscripción.",
    "estrategia": "- **SEO internacional de contenidos:** Estrategia de contenidos educativos y posicionamiento en Google para búsquedas de preparación y simuladores TOEFL en múltiples países.\n- **Rediseño web orientado a conversión:** Jerarquía de información clara, páginas de programa estructuradas con testimonios y pasarelas de registro sin fricción.\n- **Pauta digital y contenidos:** Campañas de apoyo en Google y Meta para captar alumnos en periodos de convocatorias universitarias y laborales.",
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
    "resumen": "Recorridos en video y campañas segmentadas en Meta para conectar con compradores e inversionistas interesados en desarrollos inmobiliarios.",
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
    "reto": "Residenciales Mérida buscaba destacar en uno de los mercados inmobiliarios más competidos del país:\n\n- **Captación de prospectos calificados:** Generar leads con perfil financiero real para compra e inversión patrimonial.\n- **Diferenciación de desarrollos:** Comunicar la plusvalía, amenidades y ubicación estratégica de cada privada residencial.\n- **Filtrado y costo por adquisición:** Reducir el costo por lead manteniendo un estándar estricto de calificación para el equipo de ventas.",
    "estrategia": "- **Pauta publicitaria orientada a leads:** Campañas segmentadas en Meta Ads enfocadas en inversionistas patrimoniales, compradores de primera vivienda y retiro en Mérida.\n- **Estrategia y gestión de redes sociales:** Contenido en Facebook, Instagram y TikTok enfocado en plusvalía, recorridos y estilo de vida residencial.\n- **Producción audiovisual y recorridos:** Levantamiento de video y fotografía profesional mostrando avances de obra, amenidades y arquitectura.",
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
    "resumen": "Videos frescos para redes y pauta en zonas cercanas que incrementaron los pedidos a domicilio y las visitas a la pizzería.",
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
    "reto": "Paulo’s Pizza buscaba consolidar su presencia de marca y elevar su flujo de pedidos en un mercado saturado:\n\n- **Visibilidad y diferenciación:** Destacar su masa madre con 48 horas de fermentación y horno de piedra frente a cadenas comerciales.\n- **Aumento de pedidos y visitas:** Impulsar el consumo tanto en salón como en pedidos directos a domicilio.\n- **Comunidad local activa:** Construir una audiencia fiel en redes sociales que recomendara la marca orgánicamente.",
    "estrategia": "- **Contenido visual y antojo en redes:** Gestión de comunidad enfocada en videos dinámicos de preparación, horneado en vivo y promociones semanales.\n- **Pauta local de alta intención:** Campañas de Meta Ads geolocalizadas dirigidas a radios cercanos en horarios clave (jueves a domingo) con enlace directo a WhatsApp.\n- **Producción fotográfica y audiovisual:** Sesiones profesionales para resaltar la calidad de los ingredientes, el queso fundido y el ambiente cálido del local.",
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
    "resumen": "Estrategia SEO enfocada en búsquedas comerciales para atraer cotizaciones de empresas y contratistas de forma orgánica y constante.",
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
    "reto": "Industrial Basanlo llegó a Hiweb de forma 100% orgánica con metas claras de captación B2B:\n\n- **Generación de prospectos calificados:** Atraer contratistas y empresas que requieren renta y compra de maquinaria.\n- **Construcción de presencia digital:** Diseñar un sitio web moderno que transmitiera respaldo, capacidad técnica y catálogo de equipo.\n- **Posicionamiento orgánico desde cero:** Establecer cimientos sólidos de SEO industrial en el norte de México.",
    "estrategia": "- **SEO industrial y catálogo:** Arquitectura web estructurada por categorías de maquinaria, optimización técnica y posicionamiento para consultas de renta de equipo industrial.\n- **Desarrollo web enfocado en cotizaciones:** Plataforma rápida, intuitiva y responsive con fichas técnicas claras y botones directos a WhatsApp comercial y formularios B2B.",
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
    "resumen": "Llevamos un software ERP de no tener tracción digital a posicionarse en los primeros lugares de Google y generar prospectos calificados en todo el país.",
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
    "reto": "Diazar llegó a Hiweb de forma orgánica desde Google con tres objetivos estratégicos:\n\n- **Posicionamiento nacional:** Ganar visibilidad en buscadores para términos clave de software y gestión de obra.\n- **Renovación web:** Transformar su sitio corporativo en un canal activo de captación de prospectos B2B.\n- **Autoridad de marca:** Diferenciarse como la solución ERP de referencia para constructoras y desarrolladoras en México.",
    "estrategia": "- **Posicionamiento SEO nacional:** Arquitectura web optimizada, metadatos, estrategia de contenidos técnicos y posicionamiento en Google para palabras clave de alto valor en la industria de la construcción.\n- **Sitio web estratégico:** Rediseño centrado en la propuesta de valor del software, usabilidad, jerarquía visual y embudos de conversión para demos comerciales.\n- **Presencia y autoridad de marca:** Estrategia editorial en redes sociales orientada a comunicar beneficios del ERP y reforzar credibilidad ante tomadores de decisión.",
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
    "resumen": "Optimizamos el sitio web y creamos campañas bilingües en Google Ads para que viajeros de México y el extranjero reserven directo, sumando más de 4,500 conversiones.",
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
    "reto": "Avant Rent a Car llegó a Hiweb con tres necesidades principales:\n\n- **Posicionamiento orgánico:** Mejorar su visibilidad en Google para captar usuarios de alto valor.\n- **Retorno de inversión:** Optimizar el rendimiento de sus campañas de Google Ads.\n- **Desempeño técnico:** Resolver fallas en el sitio web que afectaban su rendimiento, seguridad, experiencia de usuario y capacidad de conversión.",
    "estrategia": "- **Optimización y contenidos:** Reestructuración de contenidos, optimización de metadatos, estrategia de blogs y mejoras técnicas a partir de una auditoría SEO para fortalecer visibilidad orgánica.\n- **Publicidad estratégica en buscadores:** Implementación de campañas de Google Ads en búsqueda y Display, enfocadas en intención de compra y alineadas a servicios de renta de autos.\n- **UX y conversión:** Rediseño y reestructuración del sitio con enfoque en experiencia de usuario, CTAs claros, navegación intuitiva y funcionamiento óptimo en móvil y desktop.",
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
