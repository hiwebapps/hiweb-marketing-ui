export type InstagramPhoneSlide = {
  src: string;
  alt: string;
};

export type InstagramPhonePost = {
  kind: 'photo' | 'carousel' | 'reel';
  caption?: string;
  slides: InstagramPhoneSlide[];
  poster?: string;
  videoUrl?: string;
};

export type InstagramPhoneStat = {
  value: string;
  label: string;
};

export type InstagramPhoneProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: 'canvas' | 'surface';
  headingWidth?: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  avatarAlt?: string;
  stats?: InstagramPhoneStat[];
  posts?: InstagramPhonePost[];
};

/** Placeholder feed for the sections library. Editors replace it per page in Studio. */
export const INSTAGRAM_PHONE_DEMO: InstagramPhoneProps = {
  eyebrow: 'Redes',
  title: 'Un perfil, dentro del celular',
  description:
    'Nueve publicaciones de ejemplo. En Studio se cambian las fotos, los carruseles, los reels, el orden, la foto de perfil, el nombre y la biografía.',
  username: 'marca',
  displayName: 'Nombre de la marca',
  bio: 'Biografía del perfil. Se edita en Studio.',
  avatar: '/images/isotipo-hiweb.png',
  avatarAlt: 'Marca',
  stats: [
    { value: '9', label: 'publicaciones' },
    { value: '128', label: 'seguidores' },
    { value: '40', label: 'seguidos' },
  ],
  posts: [
    {
      kind: 'photo',
      caption: 'Una foto suelta. Al abrirla se ve completa, con el pie de foto.',
      slides: [{ src: '/images/services/redes-sociales-hero.jpg', alt: 'Ejemplo de foto' }],
    },
    {
      kind: 'carousel',
      caption: 'Carrusel de tres fotos. Las flechas y los puntos cambian de imagen.',
      slides: [
        { src: '/images/services/branding-hero.jpg', alt: 'Primera foto del carrusel' },
        { src: '/images/services/seo-hero.jpg', alt: 'Segunda foto del carrusel' },
        { src: '/images/industries/turismo-hoteleria.jpg', alt: 'Tercera foto del carrusel' },
      ],
    },
    {
      kind: 'photo',
      caption: 'Otra foto del feed.',
      slides: [{ src: '/images/services/seo.jpg', alt: 'Ejemplo de foto' }],
    },
    {
      kind: 'reel',
      caption: 'Reel. La portada sale en la cuadrícula. Si hay video, se reproduce al abrir la publicación.',
      poster: '/images/portal-reel-still.jpg',
      slides: [{ src: '/images/portal-reel-still.jpg', alt: 'Portada del reel' }],
    },
    {
      kind: 'photo',
      caption: 'Foto de ejemplo.',
      slides: [{ src: '/images/industries/inmobiliarias.jpg', alt: 'Ejemplo de foto' }],
    },
    {
      kind: 'carousel',
      caption: 'Segundo carrusel.',
      slides: [
        { src: '/images/industries/salud.jpg', alt: 'Primera foto' },
        { src: '/images/industries/manufactura.jpg', alt: 'Segunda foto' },
      ],
    },
    {
      kind: 'photo',
      caption: 'Foto de ejemplo.',
      slides: [{ src: '/images/services/google-ads-hero.jpg', alt: 'Ejemplo de foto' }],
    },
    {
      kind: 'photo',
      caption: 'Foto de ejemplo.',
      slides: [{ src: '/images/industries/restaurantes.jpg', alt: 'Ejemplo de foto' }],
    },
    {
      kind: 'photo',
      caption: 'Foto de ejemplo.',
      slides: [{ src: '/images/services/desarrollo-web-hero.jpg', alt: 'Ejemplo de foto' }],
    },
  ],
};
