export type MetaAd = {
  id: string;
  brandName: string;
  brandHandle: string;
  brandAvatar: string;
  objective: 'ventas' | 'leads' | 'trafico';
  objectiveLabel: string;
  format: 'feed' | 'story' | 'carousel';
  primaryText: string;
  headline: string;
  displayUrl: string;
  ctaText: string;
  media: string[];
  metrics: {
    roas?: string;
    cpl?: string;
    ctr?: string;
    conversions?: string;
  };
  likes: string;
  comments: string;
  shares: string;
  caseSlug?: string;
};

export const META_ADS_DATA: MetaAd[] = [
  {
    id: 'ad-secreto-1',
    brandName: 'El Secreto Boutique',
    brandHandle: 'elsecretomx',
    brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6b7de00665af0256a45e514993369de06c993f42-1920x1080.webp',
    objective: 'ventas',
    objectiveLabel: 'Ventas E-commerce',
    format: 'carousel',
    primaryText: 'Piezas pensadas para acompañar tu ritmo. Tejidos ligeros en lino natural y cortes fluidos diseñados para el clima cálido. Colección cápsula de edición limitada con envíos exprés a todo México. ✨🐚',
    headline: 'Nueva Colección de Lino Natural · Edición Limitada',
    displayUrl: 'elsecretoboutique.com',
    ctaText: 'Comprar',
    media: [
      'https://cdn.sanity.io/images/fxardjr1/web-2026/6b7de00665af0256a45e514993369de06c993f42-1920x1080.webp',
      'https://cdn.sanity.io/images/fxardjr1/web-2026/cd858d1a55f67af738340261b8991d4e08e52e9e-720x360.webp',
      'https://cdn.sanity.io/images/fxardjr1/web-2026/baae5df344f05d8f163564d5325fe42d965b6f11-720x360.webp',
    ],
    metrics: {
      roas: '4.2x ROAS',
      ctr: '3.8% CTR',
      conversions: '+320 pedidos',
    },
    likes: '1,420',
    comments: '88',
    shares: '45',
    caseSlug: 'el-secreto',
  },
  {
    id: 'ad-gaios-1',
    brandName: 'Gaios Restaurante',
    brandHandle: 'gaios.merida',
    brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6af10203ad1bef25da64dcc5b2b2916e35f0c19a-1920x1080.webp',
    objective: 'trafico',
    objectiveLabel: 'Tráfico & Reservas',
    format: 'feed',
    primaryText: 'Los domingos se hicieron para desayunar sin prisa. Huevos benedictinos sobre pan brioche horneado en casa y café de especialidad. Ubicados en Gran San Pedro Cholul, Mérida. ¿Con quién vienes hoy? ☕🍳',
    headline: 'Reserva tu mesa para este fin de semana',
    displayUrl: 'gaios.mx',
    ctaText: 'Reservar',
    media: [
      'https://cdn.sanity.io/images/fxardjr1/web-2026/6af10203ad1bef25da64dcc5b2b2916e35f0c19a-1920x1080.webp',
    ],
    metrics: {
      roas: 'Mesas al 95%',
      cpl: '$14 MXN costo por reserva',
      conversions: '+450 reservas',
    },
    likes: '2,150',
    comments: '164',
    shares: '92',
    caseSlug: 'gaios',
  },
  {
    id: 'ad-residenciales-1',
    brandName: 'Residenciales Mérida',
    brandHandle: 'residencialesmerida',
    brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/74f1aec2f31f2ad99ebb3e4615aaafffa5ea4cc9-1920x1080.webp',
    objective: 'leads',
    objectiveLabel: 'Generación de Leads High-Ticket',
    format: 'feed',
    primaryText: 'Invierte en la zona de mayor plusvalía del norte de Mérida. Lotes residenciales en privada premium con amenidades de club y financiamiento directo hasta 36 meses sin intereses. Descarga el brochure y lista de precios.',
    headline: 'Lotes Residenciales en Preventa desde $1.4M MXN',
    displayUrl: 'residencialesmerida.com',
    ctaText: 'Más información',
    media: [
      'https://cdn.sanity.io/images/fxardjr1/web-2026/74f1aec2f31f2ad99ebb3e4615aaafffa5ea4cc9-1920x1080.webp',
    ],
    metrics: {
      cpl: '$38 MXN por lead calificado',
      conversions: '+680 prospectos',
      ctr: '4.1% CTR',
    },
    likes: '890',
    comments: '124',
    shares: '68',
    caseSlug: 'residenciales-merida',
  },
  {
    id: 'ad-happy-store-1',
    brandName: 'Happy Store MX',
    brandHandle: 'happystore.mx',
    brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/fe5cc1d38a198d4eae1e9d32defc7e803e9166ff-1920x1080.webp',
    objective: 'ventas',
    objectiveLabel: 'Ventas E-commerce',
    format: 'carousel',
    primaryText: 'Tus productos virales de skincare y maquillaje importados 100% originales. Envío gratis en compras mayores a $899 MXN y entrega garantizada en todo el país. ✨💄',
    headline: 'Favoritos de Skincare en Descuento · Solo esta semana',
    displayUrl: 'happystore.mx',
    ctaText: 'Comprar',
    media: [
      'https://cdn.sanity.io/images/fxardjr1/web-2026/fe5cc1d38a198d4eae1e9d32defc7e803e9166ff-1920x1080.webp',
      'https://cdn.sanity.io/images/fxardjr1/web-2026/b342926cf991414e187f4d8485accb3da392a043-720x360.webp',
    ],
    metrics: {
      roas: '5.1x ROAS',
      conversions: '+540 ventas',
      ctr: '3.6% CTR',
    },
    likes: '3,240',
    comments: '210',
    shares: '115',
    caseSlug: 'happy-store',
  },
  {
    id: 'ad-paulos-1',
    brandName: 'Paulo’s Pizza',
    brandHandle: 'paulospizzamx',
    brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/e07bb8167651341deac1779dfc1dae9e199835a7-1920x1080.webp',
    objective: 'trafico',
    objectiveLabel: 'Pedidos Hiperlocales',
    format: 'feed',
    primaryText: 'Masa madre con 48 horas de fermentación y mozzarella fresca fundida en horno de piedra. Pide por WhatsApp y recíbela caliente en tu puerta en menos de 35 minutos. 🍕🔥',
    headline: 'Pizza Napolitana a Domicilio en Mérida · Pide Directo',
    displayUrl: 'pedidos.paulospizza.mx',
    ctaText: 'Contactar',
    media: [
      'https://cdn.sanity.io/images/fxardjr1/web-2026/e07bb8167651341deac1779dfc1dae9e199835a7-1920x1080.webp',
    ],
    metrics: {
      cpl: '$11 MXN por pedido iniciado',
      roas: '6.4x Retorno',
      conversions: '+920 órdenes',
    },
    likes: '1,780',
    comments: '95',
    shares: '52',
    caseSlug: 'paulos-pizza',
  },
];
