import type { CaseItem } from '../../components/sections/CasePreview';
import type { TeamMember } from '../../components/sections/TeamGrid';
import type { FaqItem, Metric, ProcessPhase } from '../../lib/content/types';
import type { LpLogo, LpRoiIndustry, LpServiceLink } from '../../lib/content/lp-types';

export const LP_WHATSAPP = 'https://wa.me/529995602388';

export type LpServiceDef = {
  slug: string;
  name: string;
  short: string;
  h1: string;
  text: string;
  how: string[];
  pairs: string[];
  case?: string;
  faq: [string, string][];
};

export type LpIndustryDef = {
  slug: string;
  name: string;
  line: string;
  h1: string;
  text: string;
  retos: [string, string][];
  how: string[];
  combo: string[];
  kpis: string;
  case?: string;
  calc: { cpl: number; close: number; ticket: number; margin: number };
  faq: [string, string][];
};

export const LP_SERVICES: LpServiceDef[] = [
  {
    slug: 'seo',
    name: 'SEO, AEO y GEO',
    short: 'Posicionamiento basado en datos para captar demanda existente.',
    h1: 'Tu marca no compite solo en Google. Compite por ser la respuesta.',
    text: 'Hacemos que tu empresa sea fácil de encontrar en buscadores y en asistentes como ChatGPT, Gemini y Perplexity.',
    how: ['Auditoría técnica del sitio', 'Investigación de keywords por intención', 'Contenido que posiciona y responde', 'Visibilidad en motores de IA'],
    pairs: ['web', 'inbound', 'google-ads'],
    case: 'avant',
    faq: [
      ['¿Qué son AEO y GEO?', 'Son prácticas para que tu marca aparezca dentro de las respuestas de motores con IA, además de la lista de resultados de Google.'],
      ['¿Cuándo se ven resultados?', 'Los primeros avances suelen llegar entre el tercer y sexto mes, según tu competencia y el estado de tu sitio.'],
    ],
  },
  {
    slug: 'google-ads',
    name: 'Google Ads',
    short: 'Campañas de búsqueda y Display que convierten clics en clientes.',
    h1: 'Aparece justo cuando tu cliente te está buscando.',
    text: 'Campañas de búsqueda, Display y YouTube optimizadas para generar leads con intención real de compra.',
    how: ['Estructura de cuenta por intención', 'Keywords y negativas', 'Anuncios y recursos', 'Medición de conversiones'],
    pairs: ['web', 'crm', 'seo'],
    case: 'avant',
    faq: [
      ['¿Cuánto debo invertir en anuncios?', 'Depende de tu sector y de tu meta. En el diagnóstico definimos un presupuesto inicial con números reales.'],
      ['¿La cuenta queda a mi nombre?', 'Sí. Tus cuentas de anuncios siempre son tuyas. Nosotros trabajamos con acceso a ellas.'],
    ],
  },
  {
    slug: 'meta-ads',
    name: 'Meta Ads',
    short: 'Publicidad en Facebook e Instagram para generar leads y ventas.',
    h1: 'Anuncios que detienen el scroll y llenan tu agenda.',
    text: 'Campañas en Facebook e Instagram con creativos propios, audiencias bien definidas y seguimiento a cada lead.',
    how: ['Estrategia por etapa de compra', 'Creativos y video propios', 'Audiencias y remarketing', 'Pixel y API de conversiones'],
    pairs: ['social', 'branding', 'crm'],
    case: 'residenciales',
    faq: [
      ['¿Quién produce los anuncios?', 'Nuestro equipo de diseño y video, sin intermediarios.'],
      ['¿Funciona para empresas B2B?', 'Sí, con audiencias bien definidas y remarketing a quien ya visitó tu sitio.'],
    ],
  },
  {
    slug: 'chatgpt-ads',
    name: 'ChatGPT Ads',
    short: 'Anuncios en ChatGPT para llegar a quien le pregunta a la IA.',
    h1: 'Llega a tu cliente mientras le pregunta a ChatGPT.',
    text: 'Diseñamos campañas en OpenAI Ads para aparecer en conversaciones donde tu cliente ya está decidiendo.',
    how: ['Alta y configuración de cuenta', 'Segmentación por contexto de conversación', 'Anuncios en tono conversacional', 'Medición con UTMs y conversiones'],
    pairs: ['google-ads', 'seo', 'web'],
    faq: [
      ['¿Dónde aparecen los anuncios?', 'Debajo de la respuesta de ChatGPT, marcados como patrocinados. Nunca cambian lo que responde el modelo.'],
      ['¿Cualquier negocio puede anunciarse?', 'Algunos sectores, como salud o finanzas, tienen restricciones. Lo revisamos antes de invertir.'],
    ],
  },
  {
    slug: 'social',
    name: 'Redes Sociales',
    short: 'Gestión estratégica de contenido para construir autoridad de marca.',
    h1: 'Redes con estrategia, producción propia y un objetivo claro.',
    text: 'Planeamos, producimos y medimos contenido para Instagram, Facebook, TikTok y LinkedIn con equipo de diseño y video propio.',
    how: ['Estrategia y calendario', 'Diseño y fotografía', 'Video y reels', 'Reportes de desempeño'],
    pairs: ['meta-ads', 'branding', 'community'],
    case: 'gaios',
    faq: [
      ['¿Quién graba el contenido?', 'Nuestro equipo de video hace los levantamientos directamente con tu marca.'],
      ['¿Cómo miden el resultado?', 'Con alcance e interacción, y sobre todo con mensajes, visitas y leads generados.'],
    ],
  },
  {
    slug: 'community',
    name: 'Community Manager',
    short: 'Gestión activa de comunidad y atención para fidelizar clientes.',
    h1: 'Tu comunidad, atendida todos los días.',
    text: 'Gestionamos publicaciones, comentarios y mensajes para que cada interacción sume a tu marca.',
    how: ['Publicación y programación', 'Respuesta a comentarios y mensajes', 'Copys con llamado a la acción', 'Reporte mensual'],
    pairs: ['social', 'meta-ads', 'crm'],
    case: 'gaios',
    faq: [
      ['¿Responden mensajes directos?', 'Sí, con guías de respuesta que definimos contigo.'],
      ['¿En qué se diferencia de Redes Sociales?', 'Redes Sociales crea la estrategia y el contenido. Community Manager lo publica y cuida la conversación.'],
    ],
  },
  {
    slug: 'web',
    name: 'Desarrollo Web',
    short: 'Sitios de alto rendimiento diseñados para convertir visitantes.',
    h1: 'Un sitio rápido, claro y hecho para convertir.',
    text: 'Diseñamos y desarrollamos sitios que cargan rápido, posicionan desde el inicio y convierten visitas en contactos.',
    how: ['Experiencia y diseño', 'Desarrollo responsivo', 'SEO técnico desde el inicio', 'Integración con CRM y analítica'],
    pairs: ['seo', 'google-ads', 'crm'],
    case: 'eagle',
    faq: [
      ['¿En qué plataforma trabajan?', 'Elegimos la plataforma según tu operación y quién administrará el sitio.'],
      ['¿Cuánto tarda un sitio?', 'Lo definimos en el diagnóstico, según el número de páginas y funciones.'],
    ],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    short: 'Tu tienda en línea, lista para vender.',
    h1: 'Una tienda en línea que vende todos los días.',
    text: 'Construimos tu tienda y la hacemos crecer, desde la plataforma hasta las campañas que traen compradores.',
    how: ['Desarrollo de tienda', 'Catálogo optimizado', 'Pagos y envíos', 'Campañas de venta'],
    pairs: ['meta-ads', 'google-ads', 'crm'],
    faq: [
      ['¿Pueden mejorar una tienda que ya tengo?', 'Sí. Empezamos con un diagnóstico de conversión de tu tienda actual.'],
      ['¿Manejan campañas de catálogo?', 'Sí, en Google y Meta, conectadas a tu inventario.'],
    ],
  },
  {
    slug: 'branding',
    name: 'Branding',
    short: 'Identidad visual y verbal que diferencia a tu marca.',
    h1: 'Una marca que se reconoce antes de leer el nombre.',
    text: 'Definimos identidad, voz y sistema visual para que tu empresa se vea como el negocio que ya es.',
    how: ['Estrategia de marca', 'Identidad visual', 'Voz y tono', 'Manual de marca'],
    pairs: ['web', 'social', 'meta-ads'],
    faq: [
      ['¿Hacen rebranding de marcas existentes?', 'Sí. Partimos de lo que ya funciona en tu marca.'],
      ['¿Qué recibo al final?', 'Un manual con identidad, voz y aplicaciones listas para usar.'],
    ],
  },
  {
    slug: 'crm',
    name: 'CRM y Automatización',
    short: 'Sistemas que dan seguimiento a leads y cierran ventas.',
    h1: 'Ningún lead se queda sin seguimiento.',
    text: 'Conectamos formularios, anuncios y WhatsApp a un CRM con flujos que trabajan para tu equipo de ventas.',
    how: ['Implementación de CRM', 'Flujos de seguimiento', 'Integración con WhatsApp', 'Reportes de ventas'],
    pairs: ['google-ads', 'meta-ads', 'inbound'],
    faq: [
      ['¿Con qué CRM trabajan?', 'Elegimos el que mejor se adapta a tu equipo, o conectamos el que ya usas.'],
      ['¿Mi equipo necesita capacitación?', 'Sí, y la incluimos para que el CRM se use desde el primer día.'],
    ],
  },
  {
    slug: 'ia',
    name: 'IA Marketing',
    short: 'Inteligencia artificial para optimizar procesos.',
    h1: 'IA aplicada a tu marketing, con criterio humano.',
    text: 'Usamos IA como aliada para que tus campañas trabajen mientras tú duermes. La estrategia sigue en manos expertas.',
    how: ['Asistentes y agentes', 'Automatización de contenido', 'Análisis de datos', 'Chatbots de atención y ventas'],
    pairs: ['crm', 'seo', 'web'],
    faq: [
      ['¿La IA reemplaza a mi equipo?', 'No. Le quita trabajo repetitivo para que se enfoque en vender.'],
      ['¿Mis datos están seguros?', 'Definimos contigo qué información se usa y dónde se guarda.'],
    ],
  },
  {
    slug: 'inbound',
    name: 'Inbound Marketing',
    short: 'Atraemos, convertimos y damos seguimiento a tus prospectos.',
    h1: 'Atrae clientes que ya te estaban buscando.',
    text: 'Contenido, ofertas y correos que acompañan a tu cliente desde la primera búsqueda hasta la venta.',
    how: ['Estrategia de contenido', 'Recursos descargables', 'Email marketing', 'Seguimiento por etapa'],
    pairs: ['seo', 'crm', 'web'],
    faq: [
      ['¿Para qué empresas funciona mejor?', 'Para ventas con ciclos largos, donde el cliente investiga antes de decidir.'],
      ['¿En cuánto tiempo funciona?', 'Se construye en meses, y su costo por lead baja con el tiempo.'],
    ],
  },
];

export const LP_INDUSTRIES: LpIndustryDef[] = [
  {
    slug: 'industrial',
    name: 'Industrial y manufactura',
    line: 'Antes de pedir una cotización, el comprador industrial investiga a fondo.',
    h1: 'Marketing industrial que atrae cotizaciones de compradores técnicos.',
    text: 'Tu comprador investiga mucho antes de llamar. Hacemos que te encuentre primero y que te pida cotización.',
    retos: [
      ['Ciclos largos', 'Una compra puede tardar meses y pasar por varias áreas.'],
      ['Varios decisores', 'Ingeniería, compras y dirección buscan cosas distintas.'],
      ['Catálogo técnico', 'Fichas y especificaciones difíciles de posicionar.'],
    ],
    how: ['Publicidad industrial para quien ya busca proveedor', 'Fichas técnicas que Google encuentra', 'Marketing B2B para quien aprueba la compra'],
    combo: ['seo', 'google-ads', 'web', 'crm'],
    kpis: 'Solicitudes de cotización, leads calificados y costo por lead.',
    case: 'eagle',
    calc: { cpl: 650, close: 12, ticket: 85000, margin: 30 },
    faq: [
      ['¿Funciona el marketing digital para ventas B2B?', 'Sí. Tu comprador investiga en línea mucho antes de llamar a un vendedor.'],
      ['¿Pueden posicionar productos técnicos?', 'Sí, con contenido que responde lo que buscan ingenieros y compradores.'],
    ],
  },
  {
    slug: 'salud',
    name: 'Salud',
    line: 'Antes de agendar, el paciente busca señales de confianza.',
    h1: 'Marketing médico para que más pacientes te encuentren y agenden.',
    text: 'El paciente compara antes de elegir. Construimos la presencia que le da certeza para agendar contigo.',
    retos: [
      ['Regulación', 'La publicidad en salud tiene reglas que no se negocian.'],
      ['Competencia local', 'Varias clínicas compiten por las mismas búsquedas.'],
      ['Confianza', 'Las reseñas y la reputación deciden la primera cita.'],
    ],
    how: ['SEO local por especialidad', 'Publicidad para clínicas dentro de la regulación', 'Citas agendadas por WhatsApp'],
    combo: ['seo', 'google-ads', 'social', 'crm'],
    kpis: 'Citas agendadas, llamadas y costo por cita.',
    case: 'restaura',
    calc: { cpl: 250, close: 25, ticket: 4500, margin: 50 },
    faq: [
      ['¿Cuidan la regulación en los anuncios?', 'Sí. Revisamos cada mensaje contra los lineamientos de publicidad en salud.'],
      ['¿Trabajan con clínicas y médicos independientes?', 'Sí, con una estrategia distinta para cada caso.'],
    ],
  },
  {
    slug: 'inmobiliario',
    name: 'Inmobiliario',
    line: 'Antes de comprar una propiedad, los clientes comparan opciones durante meses.',
    h1: 'Marketing inmobiliario que atrae prospectos listos para visitar.',
    text: 'Antes de comprar, tu cliente compara durante meses. Te mantenemos presente en cada etapa, hasta la visita.',
    retos: [
      ['Alto valor', 'Una decisión grande pide confianza antes del contacto.'],
      ['Leads curiosos', 'Muchos contactos sin presupuesto ni plazo real.'],
      ['Seguimiento largo', 'El cierre llega meses después del primer mensaje.'],
    ],
    how: ['Una campaña por cada desarrollo', 'Formularios que preguntan presupuesto', 'Seguimiento hasta la visita'],
    combo: ['meta-ads', 'google-ads', 'web', 'crm'],
    kpis: 'Leads calificados, citas de visita y costo por lead.',
    case: 'residenciales',
    calc: { cpl: 450, close: 2, ticket: 2800000, margin: 8 },
    faq: [
      ['¿Cómo filtran a los curiosos?', 'Con formularios que preguntan presupuesto y plazo, y con flujos de seguimiento en tu CRM.'],
      ['¿Promueven preventas?', 'Sí, con campañas por etapa de cada desarrollo.'],
    ],
  },
  {
    slug: 'turismo',
    name: 'Turismo y hospitalidad',
    line: 'El viajero planea entre buscadores, reseñas y redes sociales.',
    h1: 'Más reservas directas y menos comisiones.',
    text: 'Hacemos que tu hotel, tour o servicio aparezca cuando el viajero está planeando, en español y en inglés.',
    retos: [
      ['Intermediarios', 'Las plataformas de reserva se quedan con parte de cada venta.'],
      ['Temporadas', 'La demanda sube y baja durante el año.'],
      ['Viajeros extranjeros', 'Cada mercado busca en su idioma y a su manera.'],
    ],
    how: ['Marketing digital para hoteles y tours', 'Publicidad en español e inglés', 'Un camino claro a tu sistema de reservas'],
    combo: ['seo', 'google-ads', 'meta-ads', 'social'],
    kpis: 'Reservas directas, tasa de conversión e ingreso por campaña.',
    case: 'avant',
    calc: { cpl: 180, close: 15, ticket: 9000, margin: 35 },
    faq: [
      ['¿Hacen campañas para viajeros extranjeros?', 'Sí, en inglés y por país de origen.'],
      ['¿Cómo ayudan en temporada baja?', 'Con campañas y ofertas para los mercados que viajan en esas fechas.'],
    ],
  },
  {
    slug: 'restaurantes',
    name: 'Restaurantes',
    line: 'El comensal elige en minutos, casi siempre desde su celular.',
    h1: 'Mesas llenas, también entre semana.',
    text: 'El comensal decide en minutos desde su celular. Hacemos que tu restaurante sea la opción más fácil de elegir.',
    retos: [
      ['Decisión inmediata', 'Se elige en minutos, con lo que aparece primero.'],
      ['Reputación', 'Las reseñas pesan tanto como el menú.'],
      ['Competencia cercana', 'Otros restaurantes de tu zona buscan al mismo comensal.'],
    ],
    how: ['Publicidad cerca de tu local', 'Campañas en tus horarios de más venta', 'Reservas y pedidos por WhatsApp'],
    combo: ['social', 'meta-ads', 'seo', 'community'],
    kpis: 'Reservas, llamadas, solicitudes de ruta y pedidos.',
    case: 'gaios',
    calc: { cpl: 60, close: 35, ticket: 650, margin: 30 },
    faq: [
      ['¿Producen el contenido de comida?', 'Sí, con nuestro propio equipo de foto y video.'],
      ['¿Manejan varias sucursales?', 'Sí, con campañas y perfiles locales para cada sucursal.'],
    ],
  },
  {
    slug: 'saas',
    name: 'Software y SaaS',
    line: 'Ciclos de venta largos, con varios decisores en la mesa.',
    h1: 'Marketing B2B que convierte pruebas gratis en clientes.',
    text: 'Ciclos largos y varios decisores. Construimos un sistema que educa, captura y da seguimiento hasta la demo.',
    retos: [
      ['Costo de adquisición', 'Cada cliente nuevo cuesta más cada trimestre.'],
      ['Varios decisores', 'Usuario, comprador y dirección evalúan distinto.'],
      ['Competencia global', 'Compites con herramientas de todo el mundo.'],
    ],
    how: ['Generación de leads B2B calificados', 'Contenido por caso de uso', 'Un CRM que detecta quién está listo'],
    combo: ['seo', 'google-ads', 'chatgpt-ads', 'inbound'],
    kpis: 'Demos agendadas, SQL y costo de adquisición.',
    calc: { cpl: 900, close: 8, ticket: 60000, margin: 70 },
    faq: [
      ['¿Trabajan en inglés para Estados Unidos?', 'Sí. Somos un equipo bilingüe con clientes en México, Estados Unidos y Canadá.'],
      ['¿Por qué ChatGPT Ads para software?', 'Porque muchos compradores ya comparan herramientas conversando con la IA.'],
    ],
  },
  {
    slug: 'automotriz',
    name: 'Automotriz',
    line: 'Tu cliente llega a la agencia con el modelo casi elegido.',
    h1: 'Marketing automotriz que llena tu agenda de pruebas de manejo.',
    text: 'Tu cliente llega con el modelo casi elegido. Te ponemos frente a él cuando compara versiones y precios.',
    retos: [
      ['Otros distribuidores', 'Compites con agencias de la misma marca.'],
      ['Lineamientos de marca', 'Cada pieza debe respetar las reglas de la armadora.'],
      ['Seguimiento', 'Muchos prospectos se enfrían sin una respuesta rápida.'],
    ],
    how: ['Inventario que se ve y se vende', 'Seguimiento a cada prospecto en tu CRM', 'Citas de servicio que también generan ventas'],
    combo: ['google-ads', 'meta-ads', 'social', 'crm'],
    kpis: 'Leads por modelo, pruebas de manejo y costo por lead.',
    calc: { cpl: 350, close: 3, ticket: 650000, margin: 6 },
    faq: [
      ['¿Respetan los lineamientos de la armadora?', 'Sí. Cada pieza se ajusta a ellos antes de publicarse.'],
      ['¿Manejan vehículos comerciales y flotillas?', 'Sí, con campañas pensadas para compradores empresariales.'],
    ],
  },
  {
    slug: 'servicios-profesionales',
    name: 'Servicios profesionales',
    line: 'La reputación pesa más que el precio al momento de contratar.',
    h1: 'Marketing que convierte tu experiencia en clientes.',
    text: 'En despachos y consultorías, la confianza decide. Hacemos visible la experiencia que ya tienes.',
    retos: [
      ['Diferenciarte', 'Competir por precio desgasta tu marca.'],
      ['Confianza', 'Nadie contrata a un despacho que no conoce.'],
      ['Reglas del sector', 'Algunas profesiones limitan cómo se anuncian.'],
    ],
    how: ['Contenido que demuestra lo que sabes', 'Perfil de Google con reseñas reales', 'Seguimiento a cada consulta'],
    combo: ['seo', 'google-ads', 'branding', 'inbound'],
    kpis: 'Solicitudes de consulta, leads calificados y tasa de cierre.',
    calc: { cpl: 400, close: 15, ticket: 35000, margin: 50 },
    faq: [
      ['¿Funciona para despachos contables o legales?', 'Sí, con mensajes que respetan las reglas de cada profesión.'],
      ['¿Cómo muestran la experiencia del equipo?', 'Con contenido experto, perfiles y casos que posicionan a tus socios.'],
    ],
  },
];

const photo = (id: string) =>
  `https://cdn.sanity.io/images/fxardjr1/web-2026/${id}?w=500&auto=format`;

export const LP_TEAM: TeamMember[] = [
  { name: 'David Gallegos', role: 'Director', bio: 'Dirige la estrategia y la relación con cada cuenta.', photo: photo('871104cbd901e493855402b42a70207209616f31-2000x2000.png'), category: 'redes' },
  { name: 'Cindy Gorocica', role: 'SEO Manager', bio: 'Lleva el posicionamiento en buscadores y en motores de IA.', photo: photo('bf03dbe7c7c7a0a40aa84bb42d12391fa47771e6-2000x2000.png'), category: 'web' },
  { name: 'Valeria Demonte', role: 'Social Media Lead', bio: 'Define el contenido y la conversación de las redes.', photo: photo('0c89649a15bd4e89abd3a4e65df8584a905bcbe2-2000x2000.png'), category: 'redes' },
  { name: 'Cinthia May', role: 'Líder de diseño', bio: 'Cuida la identidad visual de cada pieza que sale.', photo: photo('c475e6e502224430ee12e3a24d17f32b111a09b1-2000x2000.png'), category: 'diseno' },
  { name: 'Isabella Tello', role: 'Lead Video Producer', bio: 'Produce el video y los reels de las campañas.', photo: photo('90580f261b0f40b003a0bb9992e8ce36fac437cd-2000x2000.png'), category: 'redes' },
  { name: 'Jahir Gonzalez', role: 'Web Manager', bio: 'Construye los sitios y las landings de cada campaña.', photo: photo('a824609b50077b70000fbb1c62a71eeba6dfee53-2000x2000.png'), category: 'web' },
];

export const LP_AVATARS = LP_TEAM.slice(0, 4).map((member) => member.photo);

export const LP_LOGOS: LpLogo[] = [
  { src: 'https://cdn.prod.website-files.com/65bdb53f22fa5cd7079bc4c1/695ad256088eb0f2d3a1a052_Frame%202.png', alt: 'Avant Rent a Car' },
  { src: 'https://cdn.prod.website-files.com/65bdb53f22fa5cd7079bc4c1/695ad2569ac7a2dda7cbe242_Frame%201.png', alt: 'Diazar' },
  { src: 'https://cdn.prod.website-files.com/65bdb53f22fa5cd7079bc4c1/695ad256d237fd6f92009134_Frame%206.png', alt: 'Gaios' },
  { src: 'https://cdn.prod.website-files.com/65bdb53f22fa5cd7079bc4c1/695ad256ca5fc1e37984bb4f_Frame%2010.png', alt: 'Happy Store' },
  { src: 'https://cdn.prod.website-files.com/65bdb53f22fa5cd7079bc4c1/695ad25608f4f6ff106a38c8_Frame%203.png', alt: 'Enfoque 21' },
  { src: 'https://cdn.prod.website-files.com/65bdb53f22fa5cd7079bc4c1/695ad256390e5e0c94d74093_Frame%208.png', alt: "Paulo's Pizza" },
  { src: 'https://cdn.prod.website-files.com/65bdb53f22fa5cd7079bc4c1/695ad2565dd1817fac1779ff_Frame%207.png', alt: 'Zapatería La Península' },
];

type CaseSource = {
  client: string;
  industry: string;
  services: string;
  metrics: [string, string][];
  quote?: [string, string, string];
  href: string;
};

const CASES: Record<string, CaseSource> = {
  avant: {
    client: 'Avant Rent a Car',
    industry: 'Turismo',
    services: 'SEO, Google Ads y Desarrollo Web',
    metrics: [['+37,000', 'nuevos usuarios orgánicos'], ['+4,525', 'conversiones con Google Ads']],
    quote: ['Las campañas de Google Ads fueron claras, estratégicas y enfocadas en generar clientes con intención real de renta.', 'Sebastian S.', 'Marketing, Avant Rent a Car'],
    href: '/portafolio/avant-rent-a-car',
  },
  eagle: {
    client: 'Eagle Superabrasives',
    industry: 'Industrial',
    services: 'Desarrollo Web y SEO',
    metrics: [['+68%', 'clics orgánicos'], ['+1,600', 'usuarios nuevos']],
    href: '/portafolio/eagle-superabrasives',
  },
  residenciales: {
    client: 'Residenciales Mérida',
    industry: 'Inmobiliario',
    services: 'Redes Sociales y Meta Ads',
    metrics: [['+315%', 'alcance en redes'], ['+417', 'clics hacia los desarrollos']],
    quote: ['Las redes sociales se convirtieron en un canal constante para generar prospectos interesados en nuestros desarrollos.', 'Luis C.', 'Asesor inmobiliario, Residenciales Mérida'],
    href: '/portafolio/residenciales-merida',
  },
  gaios: {
    client: 'Gaios',
    industry: 'Restaurantes',
    services: 'Redes Sociales y Meta Ads',
    metrics: [['+71%', 'visitas al perfil'], ['+58%', 'clics para ubicación y contacto']],
    quote: ['Las redes empezaron a traer más gente al restaurante. Muchos llegan diciendo que nos vieron en Instagram.', 'Victoria G.', 'Fundadora, Gaios'],
    href: '/portafolio/gaios',
  },
  restaura: {
    client: 'Restaura',
    industry: 'Salud',
    services: 'Redes Sociales y Meta Ads',
    metrics: [['+30%', 'consultas de odontólogos'], ['+48%', 'alcance en redes']],
    href: '/portafolio/restaura',
  },
};

const ACCENTS = ['cyan', 'orange', 'purple'] as const;

export function lpCaseItem(key: string, index = 0): CaseItem | null {
  const item = CASES[key];
  if (!item) return null;
  return {
    client: item.client,
    industry: item.industry,
    outcome: item.metrics.map(([value, label]) => `${value} ${label}`).join(' · '),
    title: item.services,
    summary: item.quote ? `“${item.quote[0]}” — ${item.quote[1]}, ${item.quote[2]}` : item.services,
    href: item.href,
    accent: ACCENTS[index % ACCENTS.length],
  };
}

export function lpCases(keys: string[]): CaseItem[] {
  return keys.flatMap((key, index) => {
    const item = lpCaseItem(key, index);
    return item ? [item] : [];
  });
}

export const LP_DEFAULT_CASES = lpCases(['avant', 'eagle', 'residenciales', 'gaios']);

export const LP_FAQ: FaqItem[] = [
  ['¿Cuánto cuesta trabajar con Hiweb?', 'No manejamos paquetes cerrados. Cada propuesta se cotiza a la medida después del diagnóstico, según tus metas y el alcance.'],
  ['¿Puedo contratar un solo servicio?', 'Sí. Muchos clientes empiezan con uno y suman otros cuando ven resultados. Lo que más rinde es conectarlos.'],
  ['¿Trabajan con empresas fuera de Mérida?', 'Sí. Nuestra oficina está en Mérida, Yucatán, y trabajamos con empresas de todo México, Estados Unidos y Canadá.'],
  ['¿Las cuentas de anuncios quedan a mi nombre?', 'Sí. Tus cuentas de Google Ads, Meta Ads y demás plataformas siempre son tuyas, con tu historial y tus datos.'],
  ['¿Cómo sé si está funcionando?', 'Definimos contigo metas medibles al inicio. Cada mes recibes un reporte con lo que se hizo, lo que se logró y lo que sigue.'],
  ['¿Cómo reviso y apruebo el trabajo?', 'Desde el portal de clientes de Hiweb. Ahí ves cada entregable y envías cambios, con hasta tres rondas por entregable.'],
].map(([question, answer]) => ({ question, answer }));

export function lpFaq(pairs: [string, string][], extra = 4): FaqItem[] {
  const specific = pairs.map(([question, answer]) => ({ question, answer }));
  return [...specific, ...LP_FAQ.slice(0, extra)];
}

export const LP_BENEFITS = [
  { title: 'Especialistas en cada disciplina', description: 'SEO, campañas, diseño, video y desarrollo trabajan juntos en tu cuenta.' },
  { title: 'Un solo interlocutor', description: 'Las personas que revisan tu diagnóstico son las mismas que trabajan tu cuenta.' },
  { title: 'Datos reales, sin adivinar', description: 'Metas medibles desde el inicio y un reporte mensual que las explica.' },
  { title: 'Cuentas a tu nombre', description: 'Tus cuentas de anuncios, tu historial y tus datos siempre son tuyos.' },
  { title: 'Respuesta ágil', description: 'Decidimos rápido, con la cercanía de un equipo local en México.' },
  { title: 'Bilingües', description: 'Campañas y contenido en español e inglés para México, Estados Unidos y Canadá.' },
];

export const LP_METRICS: Metric[] = [
  { valor: 6, prefix: '+', label: 'años haciendo crecer marcas' },
  { valor: 20, prefix: '+', label: 'marcas en México y el extranjero' },
  { valor: 3, label: 'países: México, Estados Unidos y Canadá' },
  { valor: 8, label: 'industrias con experiencia comprobada' },
  { valor: 12, label: 'servicios en un mismo equipo' },
  { valor: 2, label: 'idiomas de trabajo: español e inglés' },
];

export const LP_PROCESS: ProcessPhase[] = [
  { index: '01', title: 'Auditoría y diagnóstico', description: 'Analizamos tus canales, tu competencia y tu mercado para encontrar oportunidades reales.' },
  { index: '02', title: 'Estrategia a tu medida', description: 'Armamos tu plan solo con lo que sí aplica a tu negocio.' },
  { index: '03', title: 'Implementación', description: 'Ejecutamos campañas, sitio y sistemas con un estándar técnico internacional.' },
  { index: '04', title: 'Optimización por ROI', description: 'Medimos, ajustamos y escalamos lo que funciona.' },
];

export const LP_QUADRANTS: { title: string; description: string; slugs: string[] }[] = [
  { title: 'Atraer demanda', description: 'Llegar a quien ya está buscando.', slugs: ['google-ads', 'meta-ads', 'chatgpt-ads'] },
  { title: 'Ser la respuesta', description: 'Aparecer en Google y en la IA.', slugs: ['seo', 'inbound', 'ia'] },
  { title: 'Construir marca', description: 'Que te reconozcan y te recuerden.', slugs: ['branding', 'social', 'community'] },
  { title: 'Convertir y escalar', description: 'Que ningún lead se pierda.', slugs: ['web', 'ecommerce', 'crm'] },
];

export const LP_COMBOS: { title: string; description: string; services: string[]; ctaLabel: string }[] = [
  { title: 'Generar leads ya', description: 'Google Ads, una landing hecha para convertir y CRM para dar seguimiento.', services: ['google-ads', 'web', 'crm'], ctaLabel: 'Cotizar esta combinación' },
  { title: 'Crecer en Google y en la IA', description: 'SEO, AEO y GEO con Inbound Marketing y contenido constante.', services: ['seo', 'inbound', 'ia'], ctaLabel: 'Cotizar esta combinación' },
  { title: 'Lanzar o renovar tu marca', description: 'Branding, sitio web y redes sociales con un mismo concepto.', services: ['branding', 'web', 'social'], ctaLabel: 'Cotizar esta combinación' },
  { title: 'Vender en línea', description: 'E-commerce, Meta Ads y automatización para recuperar carritos.', services: ['ecommerce', 'meta-ads', 'crm'], ctaLabel: 'Cotizar esta combinación' },
];

export function lpService(slug: string): LpServiceDef | undefined {
  return LP_SERVICES.find((item) => item.slug === slug);
}

export function lpServiceLink(slug: string): LpServiceLink | null {
  const service = lpService(slug);
  if (!service) return null;
  return {
    slug: service.slug,
    name: service.name,
    short: service.short,
    href: `/ads/servicios/${service.slug}`,
  };
}

export function lpRoiIndustries(): LpRoiIndustry[] {
  return LP_INDUSTRIES.map((item) => ({
    slug: item.slug,
    name: item.name,
    ...item.calc,
  }));
}
