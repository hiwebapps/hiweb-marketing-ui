export type SocialPostSlide = {
  src: string;
  alt: string;
};

export type SocialPost = {
  id: string;
  brandId: string;
  brandName: string;
  brandHandle: string;
  brandAvatar: string;
  brandCategory: string;
  kind: 'photo' | 'carousel' | 'reel';
  cover: string;
  slides: SocialPostSlide[];
  caption: string;
  stats: {
    views?: string;
    likes?: string;
    comments?: string;
    shares?: string;
  };
  outcomeTag?: string;
  caseSlug?: string;
  instagramUrl?: string;
};

export type BrandProfile = {
  id: string;
  name: string;
  handle: string;
  category: string;
  avatar: string;
  bio: string;
  linkText?: string;
  linkUrl?: string;
  stats: {
    posts: string;
    followers: string;
    following: string;
  };
  highlights: {
    title: string;
    cover: string;
  }[];
  posts: SocialPost[];
};

export const SOCIAL_BRANDS: BrandProfile[] = [
  {
    id: 'gaios',
    name: 'Gaios Restaurante',
    handle: 'gaios.merida',
    category: 'Restaurante / Desayunos y Brunch',
    avatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6af10203ad1bef25da64dcc5b2b2916e35f0c19a-1920x1080.webp',
    bio: 'Desayunos, almuerzos y café de especialidad en Gran San Pedro Cholul. Sabor honesto todos los días. ☕🥐✨',
    linkText: 'menu.gaios.mx',
    linkUrl: 'https://gaios.mx',
    stats: {
      posts: '148',
      followers: '12.4k',
      following: '284',
    },
    highlights: [
      { title: 'Menú', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6af10203ad1bef25da64dcc5b2b2916e35f0c19a-1920x1080.webp' },
      { title: 'Brunch', cover: '/images/industries/restaurantes.jpg' },
      { title: 'Café', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/f269c5d3fcb59ecc211c1cc8f54c265de6ec4d4b-720x360.webp' },
      { title: 'Ubicación', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/e12b4bc316d5f0d26686a0814eb00b5d5002ff1d-720x360.webp' },
    ],
    posts: [
      {
        id: 'gaios-1',
        brandId: 'gaios',
        brandName: 'Gaios Restaurante',
        brandHandle: 'gaios.merida',
        brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6af10203ad1bef25da64dcc5b2b2916e35f0c19a-1920x1080.webp',
        brandCategory: 'Gastronomía',
        kind: 'reel',
        cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6af10203ad1bef25da64dcc5b2b2916e35f0c19a-1920x1080.webp',
        slides: [
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6af10203ad1bef25da64dcc5b2b2916e35f0c19a-1920x1080.webp', alt: 'Chilaquiles artesanales en salsa verde con aguacate' }
        ],
        caption: 'Los domingos se hicieron para desayunar sin prisa. Huevos benedictinos sobre pan brioche horneado en casa. ¿Con quién vienes hoy? 👇✨',
        stats: { views: '48.2k', likes: '1,840', comments: '94' },
        outcomeTag: '+71% Visitas al perfil',
        caseSlug: 'gaios',
        instagramUrl: 'https://instagram.com',
      },
      {
        id: 'gaios-2',
        brandId: 'gaios',
        brandName: 'Gaios Restaurante',
        brandHandle: 'gaios.merida',
        brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6af10203ad1bef25da64dcc5b2b2916e35f0c19a-1920x1080.webp',
        brandCategory: 'Gastronomía',
        kind: 'carousel',
        cover: '/images/industries/restaurantes.jpg',
        slides: [
          { src: '/images/industries/restaurantes.jpg', alt: 'Mesa con selección de desayunos y café' },
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/f269c5d3fcb59ecc211c1cc8f54c265de6ec4d4b-720x360.webp', alt: 'Detalle de café latte arte' },
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/e12b4bc316d5f0d26686a0814eb00b5d5002ff1d-720x360.webp', alt: 'Waffles recién hechos con frutos rojos' }
        ],
        caption: 'Nuevo menú de temporada: texturas frescas, ingredientes locales y café de especialidad de origen veracruzano. Desliza para ver tus próximos favoritos ➡️',
        stats: { views: '32.1k', likes: '1,210', comments: '68' },
        outcomeTag: 'Mesas llenas en fin de semana',
        caseSlug: 'gaios',
        instagramUrl: 'https://instagram.com',
      },
      {
        id: 'gaios-3',
        brandId: 'gaios',
        brandName: 'Gaios Restaurante',
        brandHandle: 'gaios.merida',
        brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6af10203ad1bef25da64dcc5b2b2916e35f0c19a-1920x1080.webp',
        brandCategory: 'Gastronomía',
        kind: 'photo',
        cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/760fea17e86028e65a793a33e657b9e4c80e0829-720x360.webp',
        slides: [
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/760fea17e86028e65a793a33e657b9e4c80e0829-720x360.webp', alt: 'Platillo estelar con presentación cuidada' }
        ],
        caption: 'Detalles que hacen la diferencia. Cada platillo se prepara al momento con productos frescos del día. Te esperamos desde las 8:00 AM.',
        stats: { views: '19.4k', likes: '890', comments: '42' },
        caseSlug: 'gaios',
        instagramUrl: 'https://instagram.com',
      },
    ],
  },
  {
    id: 'el-secreto',
    name: 'El Secreto Boutique',
    handle: 'elsecretomx',
    category: 'Boutique & Moda Femenina',
    avatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6b7de00665af0256a45e514993369de06c993f42-1920x1080.webp',
    bio: 'Prendas con identidad, atemporales y libres. Concept store en Mérida, Yucatán. Envíos a todo México. 🐚🕊️',
    linkText: 'elsecretoboutique.com',
    linkUrl: 'https://elsecretoboutique.com',
    stats: {
      posts: '312',
      followers: '28.6k',
      following: '195',
    },
    highlights: [
      { title: 'Nueva Col.', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6b7de00665af0256a45e514993369de06c993f42-1920x1080.webp' },
      { title: 'Lino & Sol', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/cd858d1a55f67af738340261b8991d4e08e52e9e-720x360.webp' },
      { title: 'Boutique', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/baae5df344f05d8f163564d5325fe42d965b6f11-720x360.webp' },
      { title: 'Reviews', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/fae523d5a5a7bc84df007acb0a44da989f92781c-720x360.webp' },
    ],
    posts: [
      {
        id: 'secreto-1',
        brandId: 'el-secreto',
        brandName: 'El Secreto Boutique',
        brandHandle: 'elsecretomx',
        brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6b7de00665af0256a45e514993369de06c993f42-1920x1080.webp',
        brandCategory: 'Moda & Retail',
        kind: 'reel',
        cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6b7de00665af0256a45e514993369de06c993f42-1920x1080.webp',
        slides: [
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6b7de00665af0256a45e514993369de06c993f42-1920x1080.webp', alt: 'Lookbook en lino natural para clima cálido' }
        ],
        caption: 'Prendas pensadas para acompañar tu ritmo. Tejidos ligeros en lino natural y cortes fluidos para días cálidos. Disponible en boutique y tienda online.',
        stats: { views: '64.5k', likes: '2,950', comments: '143' },
        outcomeTag: '+52% Alcance en redes',
        caseSlug: 'el-secreto',
        instagramUrl: 'https://instagram.com',
      },
      {
        id: 'secreto-2',
        brandId: 'el-secreto',
        brandName: 'El Secreto Boutique',
        brandHandle: 'elsecretomx',
        brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/6b7de00665af0256a45e514993369de06c993f42-1920x1080.webp',
        brandCategory: 'Moda & Retail',
        kind: 'carousel',
        cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/cd858d1a55f67af738340261b8991d4e08e52e9e-720x360.webp',
        slides: [
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/cd858d1a55f67af738340261b8991d4e08e52e9e-720x360.webp', alt: 'Vestido midi en tono crudo' },
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/baae5df344f05d8f163564d5325fe42d965b6f11-720x360.webp', alt: 'Detalle de costuras y accesorios artesanales' }
        ],
        caption: 'La sutileza de los tonos neutros. Piezas versátiles para elevar cualquier momento del día. Colección cápsula de edición limitada.',
        stats: { views: '41.8k', likes: '1,670', comments: '87' },
        caseSlug: 'el-secreto',
        instagramUrl: 'https://instagram.com',
      },
    ],
  },
  {
    id: 'paulos-pizza',
    name: 'Paulo’s Pizza',
    handle: 'paulospizzamx',
    category: 'Pizzería Artesanal & Trattoria',
    avatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/e07bb8167651341deac1779dfc1dae9e199835a7-1920x1080.webp',
    bio: 'Fermentación lenta de 48 hrs y horno de piedra. El auténtico sabor de la pizza napolitana en Mérida. 🍕🔥',
    linkText: 'pedidos.paulospizza.mx',
    linkUrl: 'https://paulospizza.mx',
    stats: {
      posts: '204',
      followers: '18.9k',
      following: '120',
    },
    highlights: [
      { title: 'Pizzas', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/e07bb8167651341deac1779dfc1dae9e199835a7-1920x1080.webp' },
      { title: 'Horno', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/bd40b724a6f2a3eed123587ba3b2b2a039548f4f-720x360.webp' },
      { title: 'Promos', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/8c6d905767c143e2a66347e390026a63bbc57f63-720x360.webp' },
    ],
    posts: [
      {
        id: 'paulos-1',
        brandId: 'paulos-pizza',
        brandName: 'Paulo’s Pizza',
        brandHandle: 'paulospizzamx',
        brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/e07bb8167651341deac1779dfc1dae9e199835a7-1920x1080.webp',
        brandCategory: 'Gastronomía',
        kind: 'reel',
        cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/e07bb8167651341deac1779dfc1dae9e199835a7-1920x1080.webp',
        slides: [
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/e07bb8167651341deac1779dfc1dae9e199835a7-1920x1080.webp', alt: 'Corte de pizza artesanal saliendo del horno' }
        ],
        caption: '48 horas de fermentación lenta para lograr bordes aireados y una masa ligera e inolvidable. Directo de nuestro horno de piedra a tu mesa.',
        stats: { views: '89.6k', likes: '3,840', comments: '210' },
        outcomeTag: '+14% Visitas a sucursal',
        caseSlug: 'paulos-pizza',
        instagramUrl: 'https://instagram.com',
      },
    ],
  },
  {
    id: 'zapateria-la-peninsula',
    name: 'Zapatería La Península',
    handle: 'zapaterialapeninsula',
    category: 'Calzado & Moda Retail',
    avatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/9fe36aaf4ce941a7cc02a2964bae3a048d352d9d-1920x1080.webp',
    bio: 'Más de 40 años vistiendo los pasos de las familias en Yucatán. Calidad, comodidad y estilo para toda la familia. 👟✨',
    stats: {
      posts: '420',
      followers: '34.2k',
      following: '410',
    },
    highlights: [
      { title: 'Novedades', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/9fe36aaf4ce941a7cc02a2964bae3a048d352d9d-1920x1080.webp' },
      { title: 'Tenis', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/414edf99a4f9f3270e60b3f7d6070dea7e254524-720x360.webp' },
      { title: 'Niños', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/e8673c2cd72ef04a24719b39b1dc2a63623a1024-720x360.webp' },
    ],
    posts: [
      {
        id: 'zapateria-1',
        brandId: 'zapateria-la-peninsula',
        brandName: 'Zapatería La Península',
        brandHandle: 'zapaterialapeninsula',
        brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/9fe36aaf4ce941a7cc02a2964bae3a048d352d9d-1920x1080.webp',
        brandCategory: 'Retail',
        kind: 'reel',
        cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/9fe36aaf4ce941a7cc02a2964bae3a048d352d9d-1920x1080.webp',
        slides: [
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/9fe36aaf4ce941a7cc02a2964bae3a048d352d9d-1920x1080.webp', alt: 'Campaña viral de calzado en tienda' }
        ],
        caption: 'Comodidad real para tus días más activos. Descubre los nuevos modelos de temporada que llegaron a todas nuestras sucursales en Mérida.',
        stats: { views: '450k', likes: '18.2k', comments: '640' },
        outcomeTag: '+450k Vistas en video',
        caseSlug: 'zapateria-la-peninsula',
        instagramUrl: 'https://instagram.com',
      },
    ],
  },
  {
    id: 'peninsula-project',
    name: 'Península Project',
    handle: 'peninsulaproject',
    category: 'Turismo & Viajes por Carretera',
    avatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/16c5eab0cf3bf56af56a34ab5e7f4d2019748616-1920x1080.webp',
    bio: 'Viajes por carretera para reconectar con lo auténtico de Yucatán. Rutas artesanales y experiencias que no están en las guías comunes. 🚙🌿',
    linkText: 'peninsulaproject.com',
    linkUrl: 'https://peninsulaproject.com',
    stats: {
      posts: '186',
      followers: '21.5k',
      following: '310',
    },
    highlights: [
      { title: 'Rutas', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/16c5eab0cf3bf56af56a34ab5e7f4d2019748616-1920x1080.webp' },
      { title: 'Cenotes', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/d0b1a0e54c3a8306a658c1567203ecabc71ef292-1920x1080.webp' },
    ],
    posts: [
      {
        id: 'peninsula-1',
        brandId: 'peninsula-project',
        brandName: 'Península Project',
        brandHandle: 'peninsulaproject',
        brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/16c5eab0cf3bf56af56a34ab5e7f4d2019748616-1920x1080.webp',
        brandCategory: 'Turismo',
        kind: 'photo',
        cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/16c5eab0cf3bf56af56a34ab5e7f4d2019748616-1920x1080.webp',
        slides: [
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/16c5eab0cf3bf56af56a34ab5e7f4d2019748616-1920x1080.webp', alt: 'Camino abierto en la selva maya de Yucatán' }
        ],
        caption: 'Caminos que te llevan al origen. Viajar no es solo llegar, es aprender a detenerse en las comunidades que conservan la verdadera historia.',
        stats: { views: '52.3k', likes: '2,140', comments: '112' },
        outcomeTag: '+315% Alcance en redes',
        caseSlug: 'peninsula-project',
        instagramUrl: 'https://instagram.com',
      },
    ],
  },
  {
    id: 'happy-store',
    name: 'Happy Store MX',
    handle: 'happystore.mx',
    category: 'E-commerce & Maquillaje',
    avatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/fe5cc1d38a198d4eae1e9d32defc7e803e9166ff-1920x1080.webp',
    bio: 'Maquillaje, skincare y suplementos importados 100% originales. Envíos exprés a todo México. ✨💄📦',
    linkText: 'happystore.mx',
    linkUrl: 'https://happystore.mx',
    stats: {
      posts: '540',
      followers: '45.1k',
      following: '230',
    },
    highlights: [
      { title: 'Skincare', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/fe5cc1d38a198d4eae1e9d32defc7e803e9166ff-1920x1080.webp' },
      { title: 'Unboxing', cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/b342926cf991414e187f4d8485accb3da392a043-720x360.webp' },
    ],
    posts: [
      {
        id: 'happy-1',
        brandId: 'happy-store',
        brandName: 'Happy Store MX',
        brandHandle: 'happystore.mx',
        brandAvatar: 'https://cdn.sanity.io/images/fxardjr1/web-2026/fe5cc1d38a198d4eae1e9d32defc7e803e9166ff-1920x1080.webp',
        brandCategory: 'E-commerce',
        kind: 'reel',
        cover: 'https://cdn.sanity.io/images/fxardjr1/web-2026/fe5cc1d38a198d4eae1e9d32defc7e803e9166ff-1920x1080.webp',
        slides: [
          { src: 'https://cdn.sanity.io/images/fxardjr1/web-2026/fe5cc1d38a198d4eae1e9d32defc7e803e9166ff-1920x1080.webp', alt: 'Rutina de skincare viral en video' }
        ],
        caption: 'La rutina que tu piel estaba esperando. Productos virales originales con envío exprés y garantía directa. Haz tu pedido hoy en happystore.mx 🛍️',
        stats: { views: '76.3k', likes: '3,420', comments: '185' },
        outcomeTag: '+76k Vistas en video',
        caseSlug: 'happy-store',
        instagramUrl: 'https://instagram.com',
      },
    ],
  },
];

export const ALL_POSTS = SOCIAL_BRANDS.flatMap((b) => b.posts);
