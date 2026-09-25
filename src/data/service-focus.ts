import type { PillarIconName } from '../components/icons/PillarIcons';

export type ServiceFocusItem = {
  id: string;
  icon: PillarIconName;
  title: string;
  summary: string;
  detailTitle: string;
  detail: string;
  image: string;
  imageAlt: string;
};

const img = {
  seo: '/images/services/seo-hero.jpg',
  seoCard: '/images/services/seo.jpg',
  ads: '/images/services/google-ads-hero.jpg',
  adsCard: '/images/services/google-ads.jpg',
  meta: '/images/services/meta-ads-hero.jpg',
  metaCard: '/images/services/meta-ads.jpg',
  social: '/images/services/redes-sociales-hero.jpg',
  socialCard: '/images/services/redes-sociales.jpg',
  web: '/images/services/desarrollo-web-hero.jpg',
  webCard: '/images/services/desarrollo-web.jpg',
  crm: '/images/services/crm-automatizacion-hero.jpg',
  crmCard: '/images/services/crm-automatizacion.jpg',
  brand: '/images/services/branding-hero.jpg',
  brandCard: '/images/services/branding.jpg',
  ia: '/images/services/ia-marketing-hero.jpg',
  iaCard: '/images/services/ia-marketing.jpg',
  community: '/images/services/community-manager-hero.jpg',
  communityCard: '/images/services/community-manager.jpg',
  city: '/images/industries/inmobiliarias.jpg',
  plant: '/images/industries/manufactura.jpg',
  care: '/images/industries/salud.jpg',
  product: '/images/industries/saas.jpg',
} as const;

export const SERVICE_FOCUS: Record<string, ServiceFocusItem[]> = {
  seo: [
    {
      id: 'auditoria',
      icon: 'layers',
      title: 'Auditoría técnica',
      summary: 'Velocidad, rastreo y Core Web Vitals antes de publicar más páginas.',
      detailTitle: 'Lo que Google ya está midiendo',
      detail:
        'Revisamos indexación, datos estructurados y rendimiento. El informe marca qué bloquea el rastreo y qué se corrige primero.',
      image: img.seo,
      imageAlt: 'Auditoría técnica de un sitio para SEO',
    },
    {
      id: 'intencion',
      icon: 'target',
      title: 'Intención de búsqueda',
      summary: 'Keywords con demanda real, no una lista larga que nadie compra.',
      detailTitle: 'De la búsqueda al negocio',
      detail:
        'Agrupamos queries locales, transaccionales e informativas. Cada grupo aterriza en una página que puede convertir, no solo posicionar.',
      image: img.seoCard,
      imageAlt: 'Investigación de intención de búsqueda',
    },
    {
      id: 'local',
      icon: 'globe',
      title: 'SEO local',
      summary: 'Maps y búsquedas de ciudad para quien ya está cerca de comprarte.',
      detailTitle: 'Aparecer cuando buscan en tu zona',
      detail:
        'Ficha, categorías, reseñas y páginas por ciudad. El resultado que importa es la llamada o la visita, no un ranking nacional suelto.',
      image: img.city,
      imageAlt: 'Presencia local de un negocio en su ciudad',
    },
    {
      id: 'aeo',
      icon: 'check',
      title: 'AEO y contenido',
      summary: 'Páginas que Google y los motores de respuesta pueden citar.',
      detailTitle: 'Ser la respuesta, no un resultado más',
      detail:
        'Schema, estructura y piezas que responden una pregunta concreta. El sitio compite en búsqueda clásica y en respuestas de IA.',
      image: img.product,
      imageAlt: 'Contenido preparado para motores de respuesta',
    },
  ],
  'google-ads': [
    {
      id: 'search',
      icon: 'target',
      title: 'Campañas de búsqueda',
      summary: 'Anuncios en la query exacta, con negativo y página de destino.',
      detailTitle: 'Captar a quien ya está buscando',
      detail:
        'Estructura por intención, concordancias y extensiones. El presupuesto se queda en términos que pueden convertirse en lead.',
      image: img.ads,
      imageAlt: 'Campañas de búsqueda en Google Ads',
    },
    {
      id: 'pmax',
      icon: 'layers',
      title: 'Shopping y Performance Max',
      summary: 'Feed, creatividades y señales para catálogo o demanda amplia.',
      detailTitle: 'El inventario también tiene que vender',
      detail:
        'Revisamos el feed, las audiencias y los activos. Performance Max no se deja en automático: se alimenta con lo que sí convierte.',
      image: img.adsCard,
      imageAlt: 'Catálogo y campañas de Performance Max',
    },
    {
      id: 'medicion',
      icon: 'workflow',
      title: 'Medición',
      summary: 'Conversiones, llamadas y valor, no solo clics del panel.',
      detailTitle: 'Saber qué anuncio deja dinero',
      detail:
        'Etiquetamos el evento que importa: formulario, llamada o venta. Sin eso, la optimización persigue tráfico barato.',
      image: img.product,
      imageAlt: 'Medición de conversiones de una cuenta de ads',
    },
    {
      id: 'optimizacion',
      icon: 'check',
      title: 'Optimización continua',
      summary: 'Pujas, términos de búsqueda y anuncios que se podan cada mes.',
      detailTitle: 'El presupuesto se mueve con evidencia',
      detail:
        'Cortamos lo que gasta sin consulta y empujamos lo que sí cierra. El reporte muestra costo por resultado, no una lista de impresiones.',
      image: img.plant,
      imageAlt: 'Revisión mensual de una cuenta publicitaria',
    },
  ],
  'meta-ads': [
    {
      id: 'leads',
      icon: 'users',
      title: 'Generación de leads',
      summary: 'Formularios y mensajes para quien todavía no te busca en Google.',
      detailTitle: 'Demanda que el buscador no alcanza',
      detail:
        'Audiencia, gancho y oferta en el mismo anuncio. El lead entra con contexto, no como un contacto frío de un formulario genérico.',
      image: img.meta,
      imageAlt: 'Campaña de leads en Meta Ads',
    },
    {
      id: 'ecommerce',
      icon: 'layers',
      title: 'Ventas de catálogo',
      summary: 'Creatividades y catálogo para tiendas que necesitan checkout.',
      detailTitle: 'Del scroll a la compra',
      detail:
        'Piezas por producto, públicos de compradores y exclusiones de quien ya pagó. La campaña persigue venta, no alcance vacío.',
      image: img.metaCard,
      imageAlt: 'Anuncios de catálogo para e-commerce',
    },
    {
      id: 'remarketing',
      icon: 'target',
      title: 'Remarketing',
      summary: 'Volver a hablarle a quien visitó, vio o abandonó.',
      detailTitle: 'La segunda conversación, más concreta',
      detail:
        'Secuencias por lo que ya hizo en el sitio. Quien abandonó el carrito no ve el mismo anuncio que quien apenas conoció la marca.',
      image: img.care,
      imageAlt: 'Secuencia de remarketing según el comportamiento',
    },
    {
      id: 'creatividades',
      icon: 'workflow',
      title: 'Creatividades',
      summary: 'Piezas que se prueban, no un solo video eterno.',
      detailTitle: 'El anuncio también es el mensaje',
      detail:
        'Variamos gancho, prueba y llamado. Lo que no sostiene el costo por resultado sale de la rotación en el siguiente corte.',
      image: img.social,
      imageAlt: 'Producción de creatividades para Meta',
    },
  ],
  'redes-sociales': [
    {
      id: 'estrategia',
      icon: 'layers',
      title: 'Estrategia de contenido',
      summary: 'Qué se dice, en qué canal y con qué objetivo de negocio.',
      detailTitle: 'Un calendario con trabajo, no con relleno',
      detail:
        'Definimos pilares, formatos y la pieza que empuja una acción. Publicar todos los días no es la estrategia.',
      image: img.social,
      imageAlt: 'Planeación de contenido para redes sociales',
    },
    {
      id: 'produccion',
      icon: 'workflow',
      title: 'Producción',
      summary: 'Foto, video y pieza gráfica con la misma voz de marca.',
      detailTitle: 'Contenido que se puede publicar de verdad',
      detail:
        'Guion, toma y edición en un flujo. Cada pieza sale lista para el canal, no como un archivo suelto por reinterpretar.',
      image: img.socialCard,
      imageAlt: 'Producción de piezas para redes',
    },
    {
      id: 'canales',
      icon: 'globe',
      title: 'Canales',
      summary: 'Dónde está tu comprador, no dónde está de moda publicar.',
      detailTitle: 'Menos perfiles, más señal',
      detail:
        'Auditamos qué canal trae conversación útil y cuál solo consume producción. El esfuerzo se queda donde hay audiencia real.',
      image: img.city,
      imageAlt: 'Elección de canales según la audiencia',
    },
    {
      id: 'seguimiento',
      icon: 'check',
      title: 'Publicación y lectura',
      summary: 'Sale en fecha y se lee con métricas que sí explican el mes.',
      detailTitle: 'Qué se queda y qué se corta',
      detail:
        'Alcance, guardados, clics y mensajes. El siguiente mes se arma con lo que movió la conversación, no con el formato de moda.',
      image: img.brand,
      imageAlt: 'Seguimiento del contenido publicado',
    },
  ],
  'desarrollo-web': [
    {
      id: 'responsive',
      icon: 'layers',
      title: 'Sitio responsive',
      summary: 'La misma página se usa bien en el teléfono y en el escritorio.',
      detailTitle: 'Primero el uso, luego el efecto',
      detail:
        'Jerarquía, velocidad y formularios que se pueden completar con el pulgar. Un sitio bonito que no carga no está terminado.',
      image: img.web,
      imageAlt: 'Sitio web responsive en distintos tamaños',
    },
    {
      id: 'arquitectura',
      icon: 'workflow',
      title: 'Arquitectura',
      summary: 'Qué página existe, qué enlaza y qué trabajo hace cada una.',
      detailTitle: 'El mapa antes del layout',
      detail:
        'Definimos secciones, rutas y la acción de cada URL. Así diseño y SEO construyen la misma estructura, no dos sitios distintos.',
      image: img.webCard,
      imageAlt: 'Arquitectura de información de un sitio',
    },
    {
      id: 'comercio',
      icon: 'target',
      title: 'Comercio',
      summary: 'Catálogo, ficha y checkout pensados para cerrar, no solo para verse.',
      detailTitle: 'La ficha también vende',
      detail:
        'Producto, prueba y pago en un recorrido corto. Medimos abandono y fricción, no solo si el tema se ve actual.',
      image: img.product,
      imageAlt: 'Recorrido de compra en un sitio de comercio',
    },
    {
      id: 'lanzamiento',
      icon: 'check',
      title: 'Lanzamiento',
      summary: 'QA, medición y el equipo interno sabe publicar lo que sigue.',
      detailTitle: 'Sale a producción con dueño',
      detail:
        'Probamos formularios, velocidad y eventos. Entregamos accesos y una capacitación corta para que el sitio no quede congelado.',
      image: img.plant,
      imageAlt: 'Lanzamiento y entrega de un sitio web',
    },
  ],
  'crm-automatizacion': [
    {
      id: 'diagnostico',
      icon: 'layers',
      title: 'Diagnóstico',
      summary: 'Dónde se pierde el lead entre el formulario y la venta.',
      detailTitle: 'El proceso real, no el organigrama',
      detail:
        'Mapeamos captura, seguimiento y cierre. Automatizamos el tramo que hoy depende de que alguien se acuerde.',
      image: img.crm,
      imageAlt: 'Diagnóstico del recorrido de un lead',
    },
    {
      id: 'flujos',
      icon: 'workflow',
      title: 'Flujos',
      summary: 'Avisos, tareas y etapas que se mueven solas cuando pasa algo.',
      detailTitle: 'Cada lead tiene un siguiente paso',
      detail:
        'Asignación, recordatorio y cambio de etapa según la acción. El equipo ve la cola, no una bandeja que nadie revisa.',
      image: img.crmCard,
      imageAlt: 'Flujos de automatización en el CRM',
    },
    {
      id: 'implementacion',
      icon: 'users',
      title: 'Implementación',
      summary: 'Campos, pipelines y las herramientas que ya usan, conectadas.',
      detailTitle: 'Un CRM que el equipo sí abre',
      detail:
        'Dejamos solo los campos que la venta necesita. Si el alta toma diez minutos, el sistema se abandona en la segunda semana.',
      image: img.product,
      imageAlt: 'Implementación de un CRM con el equipo de ventas',
    },
    {
      id: 'capacitacion',
      icon: 'check',
      title: 'Capacitación',
      summary: 'Quién hace qué cuando entra un lead nuevo.',
      detailTitle: 'El sistema no se queda en la demo',
      detail:
        'Sesión con el equipo comercial y un responsable interno. Después medimos si los flujos se usan, no si quedaron “configurados”.',
      image: img.care,
      imageAlt: 'Capacitación del equipo en el CRM',
    },
  ],
  branding: [
    {
      id: 'investigacion',
      icon: 'target',
      title: 'Investigación',
      summary: 'A quién le hablas y contra quién te confunden hoy.',
      detailTitle: 'La marca parte de una decisión',
      detail:
        'Revisamos categoría, competencia y lo que el cliente ya cree de ti. El concepto sale de ahí, no de un moodboard suelto.',
      image: img.brand,
      imageAlt: 'Investigación de marca y competencia',
    },
    {
      id: 'identidad',
      icon: 'layers',
      title: 'Identidad',
      summary: 'Nombre, voz y la idea que el logo tiene que sostener.',
      detailTitle: 'Una frase que el equipo puede repetir',
      detail:
        'Definimos posicionamiento y tono antes de dibujar. Si la identidad no se puede explicar en una junta, todavía no está lista.',
      image: img.brandCard,
      imageAlt: 'Sistema de identidad de una marca',
    },
    {
      id: 'sistema',
      icon: 'workflow',
      title: 'Sistema visual',
      summary: 'Color, tipo y reglas para que cada pieza se parezca.',
      detailTitle: 'El manual se usa, no se archiva',
      detail:
        'Logo, color, tipografía y ejemplos reales: red, presentación y anuncio. El siguiente diseño no empieza de cero.',
      image: img.socialCard,
      imageAlt: 'Aplicación del sistema visual en piezas reales',
    },
    {
      id: 'aplicaciones',
      icon: 'check',
      title: 'Piezas de salida',
      summary: 'Archivos listos para web, redes y el material que ya imprimes.',
      detailTitle: 'Lo que el equipo recibe al cerrar',
      detail:
        'Entregamos formatos editables y una guía corta de uso. La marca queda en manos de quien publica, no solo en el archivo del diseñador.',
      image: img.city,
      imageAlt: 'Entrega de archivos y aplicaciones de marca',
    },
  ],
  'ia-marketing': [
    {
      id: 'chatbots',
      icon: 'users',
      title: 'Chatbots de venta',
      summary: 'Responden, califican y pasan el lead cuando ya hay intención.',
      detailTitle: 'El bot no sustituye la conversación útil',
      detail:
        'Entrenamos con tus servicios, precios y límites. Si no sabe la respuesta, escala a una persona en lugar de inventar.',
      image: img.ia,
      imageAlt: 'Chatbot de ventas en un sitio',
    },
    {
      id: 'embudo',
      icon: 'workflow',
      title: 'Embudo',
      summary: 'Dónde una automatización ahorra tiempo y dónde estorba.',
      detailTitle: 'Automatizar el tramo repetido',
      detail:
        'Mapeamos captura, nutrición y cierre. La IA entra en clasificación y seguimiento, no en la decisión que todavía es comercial.',
      image: img.iaCard,
      imageAlt: 'Automatización de un embudo de marketing',
    },
    {
      id: 'segmentos',
      icon: 'target',
      title: 'Segmentos',
      summary: 'Agrupar contactos por lo que hicieron, no por una lista estática.',
      detailTitle: 'Mensajes distintos para comportamientos distintos',
      detail:
        'Separamos quien pidió precio, quien solo leyó y quien ya compró. Cada grupo recibe el siguiente paso que le corresponde.',
      image: img.product,
      imageAlt: 'Segmentación de contactos por comportamiento',
    },
    {
      id: 'operacion',
      icon: 'check',
      title: 'Operación',
      summary: 'El flujo queda documentado y alguien del equipo lo puede ajustar.',
      detailTitle: 'No se queda como una prueba',
      detail:
        'QA de respuestas, handoff a ventas y una revisión del primer mes. Medimos conversaciones útiles, no cuántos mensajes disparó el bot.',
      image: img.crm,
      imageAlt: 'Operación y revisión de flujos con IA',
    },
  ],
  'community-manager': [
    {
      id: 'comunidad',
      icon: 'users',
      title: 'Comunidad',
      summary: 'Comentarios, mensajes y la gente que ya te está hablando.',
      detailTitle: 'Responder es parte del canal',
      detail:
        'Definimos tiempos, tono y qué pregunta se contesta en público. Una comunidad no es un calendario de posts sin bandeja.',
      image: img.community,
      imageAlt: 'Gestión de comentarios y mensajes',
    },
    {
      id: 'voz',
      icon: 'layers',
      title: 'Voz de marca',
      summary: 'Cómo suena la marca cuando contesta, no solo cuando publica.',
      detailTitle: 'Una guía que se puede usar en el día',
      detail:
        'Ejemplos de respuesta, límites y lo que no se dice. Quien cubre la cuenta no improvisa el tono en cada hilo.',
      image: img.communityCard,
      imageAlt: 'Guía de voz para la comunidad',
    },
    {
      id: 'gestion',
      icon: 'workflow',
      title: 'Gestión diaria',
      summary: 'Bandeja, moderación y el tema que hay que subir con el equipo.',
      detailTitle: 'Nada importante se queda en un comentario',
      detail:
        'Clasificamos duda, queja y oportunidad. Lo que pide una persona del equipo se escala el mismo día, con contexto.',
      image: img.social,
      imageAlt: 'Operación diaria de community management',
    },
    {
      id: 'reporte',
      icon: 'check',
      title: 'Crisis y reporte',
      summary: 'Qué hacer si un hilo crece, y qué se cuenta a fin de mes.',
      detailTitle: 'El mes se lee en conversaciones, no en likes',
      detail:
        'Protocolo de escalamiento y un reporte de temas, tiempos de respuesta y lo que la comunidad pidió. Eso ajusta el contenido siguiente.',
      image: img.care,
      imageAlt: 'Reporte de comunidad y protocolo de crisis',
    },
  ],
};

export function serviceFocusItems(slug: string): ServiceFocusItem[] {
  return SERVICE_FOCUS[slug] ?? [];
}
