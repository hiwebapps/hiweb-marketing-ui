import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { createElement, useState, type ReactNode } from 'react';
import { type Tool } from 'sanity';
import { Box, Button, Card, Flex, Text } from '@sanity/ui';

type Piece =
  | { kind: 'h'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'note'; text: string };

type Section = { id: string; title: string; body: Piece[] };

const SECTIONS: Section[] = [
  {
    id: 'empezar',
    title: 'Empieza aquí',
    body: [
      {
        kind: 'p',
        text: 'Este Studio es hiweb-web, en https://hiweb-web.sanity.studio. Aquí se edita el sitio de Hiweb Marketing: páginas, blog, menú, footer e imágenes. El sitio público todavía no se indexa en Google. Publicar un documento no lo mete al buscador.',
      },
      {
        kind: 'p',
        text: 'Arriba hay siete pestañas. Guía es este manual. Structure es el árbol de documentos (adentro se llama Contenido). Blogs y SEO son tableros para copy y SEO. Presentation muestra el sitio con los borradores. Galería junta todas las imágenes. Vision es una consola de consultas para desarrollo: el equipo de contenido puede ignorarla.',
      },
      {
        kind: 'ul',
        items: [
          'Para cambiar un texto, ábrelo en Structure, edítalo y pulsa Publish.',
          'Para ver el cambio antes de que salga al sitio público, usa Presentation o el botón Ver en staging.',
          'Para trabajar un artículo en los dos idiomas, usa la pestaña Blogs.',
          'Para revisar títulos, descripciones y parejas de idioma de todo el sitio, usa la pestaña SEO.',
        ],
      },
    ],
  },
  {
    id: 'publicar',
    title: 'Publicar y ver cambios',
    body: [
      {
        kind: 'p',
        text: 'Cada documento tiene dos estados. El borrador es lo que estás editando. La versión publicada es la oficial. Si el documento ya estaba publicado y sigues editando, verás “Cambios sin publicar”: el sitio público sigue con la versión anterior hasta que pulses Publish.',
      },
      {
        kind: 'ul',
        items: [
          'Publish guarda la versión oficial en Sanity.',
          'Discard changes tira el borrador y vuelve a lo último publicado.',
          'Unpublish quita la versión oficial. El documento deja de salir en el sitio en el próximo deploy.',
        ],
      },
      {
        kind: 'note',
        text: 'El sitio público (hiweb-marketing-ui.hiwebapps.workers.dev) se arma al desplegar, con lo que esté publicado en ese momento. Publicar en el Studio no cambia esa URL al instante. Presentation sí muestra el borrador al momento, porque lee staging.',
      },
      {
        kind: 'p',
        text: 'Ver en staging, en el menú de acciones del documento, abre esa página en el sitio de staging. Staging pide usuario y contraseña. Ahí se ven borradores. El sitio público no.',
      },
    ],
  },
  {
    id: 'pestanas',
    title: 'Las pestañas',
    body: [
      {
        kind: 'h',
        text: 'Guía',
      },
      { kind: 'p', text: 'Este manual. No edita contenido.' },
      {
        kind: 'h',
        text: 'Structure',
      },
      {
        kind: 'p',
        text: 'El árbol de todo el contenido. El panel se llama Contenido. Cada carpeta abre documentos. Al entrar a uno, el formulario está a la derecha. Los artículos tienen además una vista SEO, junto al formulario.',
      },
      {
        kind: 'h',
        text: 'Blogs',
      },
      {
        kind: 'p',
        text: 'Una fila por artículo, con español a la izquierda e inglés a la derecha. Sirve para buscar, filtrar y abrir los dos idiomas juntos. El detalle está en la sección Blog.',
      },
      {
        kind: 'h',
        text: 'SEO',
      },
      {
        kind: 'p',
        text: 'Una fila por URL del sitio: home, nosotros, servicios, industrias, casos, contacto, landings y posts. El detalle está en la sección SEO.',
      },
      {
        kind: 'h',
        text: 'Presentation',
      },
      {
        kind: 'p',
        text: 'El sitio de staging dentro del Studio, con el mapa de páginas a la izquierda. Un clic en un texto del sitio abre el campo que lo produce. Muestra borradores.',
      },
      {
        kind: 'h',
        text: 'Galería',
      },
      {
        kind: 'p',
        text: 'Todas las imágenes del proyecto, con el texto alternativo y en qué documento se usan.',
      },
      {
        kind: 'h',
        text: 'Vision',
      },
      {
        kind: 'p',
        text: 'Consultas al contenido para quien desarrolla. No hace falta para escribir ni para SEO.',
      },
    ],
  },
  {
    id: 'carpetas',
    title: 'Carpetas de Contenido',
    body: [
      {
        kind: 'h',
        text: 'Sitio',
      },
      {
        kind: 'p',
        text: 'Ajustes es la identidad del sitio: favicon, nombre corto, nombre legal, tagline, email, teléfono, WhatsApp, ciudades y redes. El favicon es el icono de la pestaña. El email y el teléfono salen en Contacto. Las redes y el nombre corto salen en el pie. El tagline es la descripción de respaldo cuando una página no tiene la suya. Aviso de privacidad y Términos son el texto de esas páginas. Redirecciones es la lista de rutas viejas. El grupo SEO de cada índice y de las páginas legales está en su propio documento, no aquí.',
      },
      {
        kind: 'h',
        text: 'Navbar',
      },
      {
        kind: 'p',
        text: 'El menú de arriba, en Español y en English. Cada idioma es su propio documento. Ahí se cambia el texto de los enlaces, el orden y qué aparece. Arrastrar una fila cambia el orden en el sitio.',
      },
      {
        kind: 'h',
        text: 'Footer',
      },
      {
        kind: 'ul',
        items: [
          'Marca y Título son los textos grandes.',
          'Texto del campo de email es el placeholder del formulario.',
          'Enlaces del menú, Enlaces de contacto y Enlaces legales son listas. El orden de la lista es el orden en el sitio. Quitar una fila la quita del footer.',
          'Ciudades es la línea de sedes, por ejemplo Mérida · Cancún · Monterrey.',
          'Nombre en el copyright y Texto de volver arriba cierran el pie.',
        ],
      },
      {
        kind: 'h',
        text: 'Home y Nosotros',
      },
      {
        kind: 'p',
        text: 'Cada una tiene Español y English. Son páginas armadas por secciones: se añaden, se reordenan y se pueden ocultar. Ocultar sección la deja en el Studio y la quita del sitio. El grupo SEO está al final del formulario.',
      },
      {
        kind: 'h',
        text: 'Industrias y Servicios',
      },
      {
        kind: 'p',
        text: 'Una carpeta por página. Dentro están Español y English, cada uno con su documento. El menú “+” de la lista crea la página en español o en inglés. Las secciones se reordenan y se pueden ocultar, igual que en Home. La URL en español es /industrias/slug o /servicios/slug. En inglés es /en/industrias/slug o /en/servicios/slug.',
      },
      {
        kind: 'p',
        text: 'Índice, dentro de Industrias, Servicios y Blog, es el texto de la página de listado en Español y en English: título, descripción y cierre. Casos tiene un solo índice, en español.',
      },
      {
        kind: 'h',
        text: 'Casos',
      },
      {
        kind: 'p',
        text: 'Los casos de portafolio. No tienen pareja de idioma: una sola versión, en /portafolio/slug. También tienen grupo SEO.',
      },
      {
        kind: 'h',
        text: 'Páginas',
      },
      {
        kind: 'p',
        text: 'Contacto y las landings. Contacto es un solo documento, en /contacto. Una landing vive en /su-slug y se crea con una plantilla: Servicio lite, Industria lite o Campaña / CTA. Si la plantilla quedó a medias, la acción Completar plantilla rellena los bloques que faltan.',
      },
      {
        kind: 'h',
        text: 'Biblioteca',
      },
      {
        kind: 'p',
        text: 'FAQs reutilizables, ordenadas por el campo Orden. Sirven para armar bloques de preguntas en las páginas. Testimonios es la biblioteca de citas: cliente, cita, nombre, cargo y foto. Home, cada caso y la sección Testimonios de cada servicio eligen de esa lista. En un servicio se ve igual que en la home: foto, cita y persona, sin las cifras del caso.',
      },
      {
        kind: 'h',
        text: 'Blog',
      },
      {
        kind: 'p',
        text: 'Español, English y Autores. Autores es la ficha (nombre, puesto, empresa, LinkedIn) que sale en el artículo. No es lo mismo que Equipo.',
      },
      {
        kind: 'h',
        text: 'Equipo',
      },
      {
        kind: 'p',
        text: 'Las personas que salen en la página de Nosotros y en bloques de equipo. El campo Orden define la posición.',
      },
    ],
  },
  {
    id: 'idiomas',
    title: 'Idiomas',
    body: [
      {
        kind: 'p',
        text: 'Casi todo existe dos veces: un documento en español y otro en inglés. No se traducen dentro del mismo documento. Navbar, Footer, Home y Nosotros tienen las dos entradas una al lado de la otra. Servicios e industrias agrupan la pareja dentro de la carpeta de esa página.',
      },
      {
        kind: 'p',
        text: 'En el blog, el artículo en inglés se empareja con el español por el campo Slug en español (esSlug). Tiene que ser exactamente el slug del artículo en español, no el título.',
      },
      {
        kind: 'ul',
        items: [
          'Español: /blog/mi-articulo',
          'English: /en/blogs/my-article',
          'Servicio: /servicios/seo y /en/servicios/…',
          'Industria: /industrias/salud y /en/industrias/…',
        ],
      },
      {
        kind: 'p',
        text: 'Lado a lado abre los dos editores a la vez: español a la izquierda, inglés a la derecha. Está en Blogs y en SEO cuando la página tiene pareja. Los dos se pueden editar y publicar por separado.',
      },
      {
        kind: 'note',
        text: 'Casos, contacto y landings no tienen versión en inglés. No muestran pareja ni hreflang.',
      },
    ],
  },
  {
    id: 'blog',
    title: 'Blog',
    body: [
      {
        kind: 'p',
        text: 'Para escribir, puedes entrar por Structure → Blog → Español o English, o por la pestaña Blogs. La pestaña Blogs es más rápida para encontrar un par.',
      },
      {
        kind: 'h',
        text: 'La tabla de Blogs',
      },
      {
        kind: 'ul',
        items: [
          'Cada fila es un artículo. A la izquierda el español, a la derecha el inglés.',
          'El estado dice Publicado, Borrador o Cambios sin publicar.',
          'Palabras y minutos salen del cuerpo, a 200 palabras por minuto.',
          '“Sin alt” cuenta imágenes del cuerpo o de la portada sin texto alternativo.',
          'La columna Traducción dice Al día, Falta EN, Falta ES o Revisar traducción.',
        ],
      },
      {
        kind: 'p',
        text: 'Revisar traducción aparece cuando el español se editó más de 10 minutos después que el inglés. Es un aviso. No bloquea la publicación y puede salir por un cambio que no tocó el texto.',
      },
      {
        kind: 'p',
        text: 'Filtros: texto (título o slug), estado de traducción (Falta EN, Falta ES, Revisar traducción, Al día), estado (Con borrador o Todo publicado), servicio, industria y autor. La lista se actualiza sola cuando alguien edita un artículo.',
      },
      {
        kind: 'ul',
        items: [
          'Lado a lado abre los dos editores.',
          'Ver ES y Ver EN abren esa URL en Presentation.',
          'Crear EN aparece solo si falta el inglés.',
        ],
      },
      {
        kind: 'h',
        text: 'Crear la versión en inglés',
      },
      {
        kind: 'p',
        text: 'Desde la fila o desde la acción Crear versión en inglés del artículo en español. Hace un borrador en inglés ya emparejado. Copia portada, autor, fecha, cuerpo, FAQs, descripción, keyword y la imagen Open Graph. El título queda con “[EN]” delante para que se vea qué falta traducir. El slug en inglés queda vacío: hay que definirlo. Las categorías pasan a su versión en inglés si esa versión existe.',
      },
      {
        kind: 'p',
        text: 'Si el inglés ya existe, la acción pasa a llamarse Abrir traducción. En el artículo en inglés, la acción equivalente es Abrir con español.',
      },
      {
        kind: 'h',
        text: 'Dentro del artículo',
      },
      {
        kind: 'ul',
        items: [
          'Idioma no se cambia a la ligera: define en qué lista y en qué URL vive.',
          'Slug es la parte final de la URL. Es único dentro de su idioma.',
          'Keyword es la etiqueta del índice del blog y también la que revisa el badge de keyword.',
          'Autor es la ficha de Autores. Autor (texto) es un respaldo si no hay ficha.',
          'Categoría servicio y Categoría industria relacionan el artículo con una página. La vista SEO avisa si el cuerpo no enlaza a esa página.',
          'Portada necesita texto alternativo.',
          'Cuerpo acepta títulos (H2 y H3), listas, tablas e imágenes. Cada imagen del cuerpo necesita su alt.',
          'FAQs del artículo pueden salir como preguntas en la página.',
        ],
      },
      {
        kind: 'p',
        text: 'Arriba del formulario hay etiquetas: traducción, palabras, keyword y el checklist SEO. La vista SEO, la segunda pestaña del artículo, lista los H2 y H3 en orden y los enlaces internos. Si un enlace no corresponde a ninguna página del sitio, lo marca como ruta desconocida. Esos avisos no impiden publicar.',
      },
    ],
  },
  {
    id: 'seo',
    title: 'SEO',
    body: [
      {
        kind: 'p',
        text: 'El grupo SEO está en casi todas las páginas, como una pestaña al final del formulario. No cambia el texto visible de la página: cambia cómo se presenta en buscadores y al compartir el enlace.',
      },
      {
        kind: 'ul',
        items: [
          'Título SEO. Encima del campo está la vista previa del resultado, con la URL hiwebmarketing.com. Si el título está vacío, la vista muestra el título que el sitio arma solo (en servicios e industrias termina en “— Hiweb Marketing”, en el blog en “— Hiweb”). El contador pasa a ámbar después de 60 caracteres y a rojo después de 70.',
          'Descripción SEO. El contador usa 155 y 160 caracteres.',
          'Imagen Open Graph, con su propio texto alternativo. Si no hay imagen, la página usa una imagen genérica del sitio.',
          'Excluir del índice. Hoy todo el sitio ya está en noindex. Este checkbox no enciende la indexación. Cuando el sitio se lance, una página marcada aquí seguirá fuera del índice.',
          'Canonical. Una ruta opcional que empieza con /, por ejemplo /blog/mi-articulo. Si se deja vacía, la canónica es la URL de la página.',
        ],
      },
      {
        kind: 'p',
        text: 'La etiqueta “SEO listo” significa que hay título, descripción, imagen Open Graph con alt y, cuando aplica, pareja de idioma. Si falta algo, la etiqueta dice qué: título, descripción, Open Graph, alt o pareja.',
      },
      {
        kind: 'p',
        text: 'En los artículos, “Keyword cubierta” significa que la keyword está en el título, en el slug y en las primeras 100 palabras del cuerpo. Si falta en alguno, la etiqueta dice “Keyword fuera de …” y nombra dónde. Si el campo Keyword está vacío, la etiqueta dice “Sin keyword”.',
      },
      {
        kind: 'h',
        text: 'La pestaña SEO',
      },
      {
        kind: 'ul',
        items: [
          'Ruta es la URL pública de esa versión.',
          'Título publicado es el que saldría, incluido el fallback si el campo está vacío.',
          'Meta marca título vacío, descripción corta (menos de 70 caracteres) y título duplicado.',
          'Open Graph marca imagen y alt.',
          'Pareja dice si existe el otro idioma. Casos, contacto, landings y el índice de industrias no tienen pareja: dicen “Sin idioma”.',
          'En los posts, un aviso extra dice si el cuerpo no enlaza a su servicio o a su industria.',
        ],
      },
      {
        kind: 'p',
        text: 'Filtros: búsqueda por ruta o título, sin título SEO, título duplicado, descripción corta, sin Open Graph, sin pareja, tipo de página e idioma. Abrir entra al documento. Lado a lado abre los dos idiomas. Ver abre Presentation en esa URL.',
      },
      {
        kind: 'h',
        text: 'Redirecciones',
      },
      {
        kind: 'p',
        text: 'Si cambia el slug de un artículo, servicio, industria, caso o landing que ya estaba publicado, la URL vieja deja de existir. La acción Crear redirección publica una ficha Desde → Hacia con la ruta vieja y la nueva. También se pueden crear a mano en Sitio → Redirecciones. Las dos rutas empiezan con / y no llevan dominio. Desde no se puede repetir.',
      },
      {
        kind: 'note',
        text: 'Una redirección entra al sitio en el próximo deploy, no al pulsar Publish. La página de destino sigue en noindex mientras el sitio entero esté fuera del índice.',
      },
    ],
  },
  {
    id: 'presentation',
    title: 'Presentation',
    body: [
      {
        kind: 'p',
        text: 'Presentation abre el sitio de staging dentro del Studio. A la izquierda hay un mapa llamado Sitemap, con botones ES y EN. Las carpetas son Sitio (Inicio, Nosotros o About, Contacto), Servicios, Industrias, Portafolio, Páginas y Blog, este último con Español y English. Al elegir una página, el sitio se carga en el centro y el documento se abre a la derecha.',
      },
      {
        kind: 'ul',
        items: [
          'La primera vez, el sitio de staging pide usuario y contraseña.',
          'Se ven los borradores, no solo lo publicado.',
          'Un clic en un texto del sitio resalta el campo en el Studio. Sirve para corregir una frase sin buscar el documento a mano.',
          'Los botones Ver, Ver ES y Ver EN de Blogs y SEO abren esta misma vista en esa URL.',
        ],
      },
      {
        kind: 'note',
        text: 'Staging no es el sitio público. También está en noindex. Lo que se aprueba aquí sale al sitio público cuando esa versión está publicada y el sitio se vuelve a desplegar.',
      },
    ],
  },
  {
    id: 'galeria',
    title: 'Galería',
    body: [
      {
        kind: 'p',
        text: 'Lista todas las imágenes subidas al proyecto, no solo las de una página. Cada tarjeta dice el formato, el peso y si tiene texto alternativo.',
      },
      {
        kind: 'ul',
        items: [
          'Sin alt: se usa en algún documento y le falta el texto alternativo.',
          'Con alt: todas sus apariciones tienen texto.',
          'Sin usar: ningún documento la referencia. Se puede borrar si ya no hace falta.',
          'Pesadas: pesan más de 500 KB.',
        ],
      },
      {
        kind: 'p',
        text: 'Al abrir una imagen se ve dónde está usada y se puede escribir el alt de cada uso. Guardar en un documento que ya está publicado escribe directo. Si el documento tiene borrador, el alt se guarda en el borrador y hay que publicar ese documento para verlo en el sitio.',
      },
    ],
  },
  {
    id: 'dudas',
    title: 'Si algo no cuadra',
    body: [
      {
        kind: 'ul',
        items: [
          'Publiqué y el sitio público no cambia. El sitio público se actualiza en el próximo deploy. Revisa el borrador en Presentation.',
          'No veo la página en inglés. En el blog, revisa que el inglés tenga Slug en español igual al slug del artículo en español. En servicios e industrias, la versión en inglés es el otro documento dentro de la misma carpeta.',
          'La etiqueta dice Revisar traducción y el texto está bien. Alguien editó el español después del inglés. Si la traducción sigue siendo válida, se puede ignorar.',
          'Falta EN en un artículo en inglés. Su Slug en español apunta a un artículo en español que no existe, o no está emparejado.',
          'El snippet se ve cortado. El contador del título pasó de 60, o el de la descripción pasó de 155. Acorta el texto.',
          'Quiero que Google indexe esta página. Todavía no se puede. Todo el sitio está en noindex hasta el lanzamiento. El checkbox Excluir del índice solo sirve para dejar una página fuera cuando el resto ya se indexe.',
          'Cambié un slug y la URL vieja da error. Crea la redirección (la acción aparece si el documento publicado y el borrador tienen slugs distintos) y espera al próximo deploy.',
          'Una sección sigue en el Studio pero no en el sitio. Revisa Ocultar sección. Si está marcada, es a propósito.',
        ],
      },
    ],
  },
];

function renderPiece(piece: Piece, index: number): ReactNode {
  if (piece.kind === 'h') {
    return createElement(Text, { key: index, size: 2, weight: 'semibold' }, piece.text);
  }
  if (piece.kind === 'p') {
    return createElement(Text, { key: index, size: 2 }, piece.text);
  }
  if (piece.kind === 'note') {
    return createElement(
      Card,
      { key: index, padding: 3, radius: 2, tone: 'caution', border: true },
      createElement(Text, { size: 1 }, piece.text),
    );
  }
  return createElement(
    Flex,
    { key: index, direction: 'column', gap: 2 },
    ...piece.items.map((item, itemIndex) =>
      createElement(Text, { key: itemIndex, size: 2 }, `• ${item}`),
    ),
  );
}

function GuideTool(_props: { tool: Tool }) {
  const [active, setActive] = useState(SECTIONS[0].id);
  const section = SECTIONS.find((item) => item.id === active) ?? SECTIONS[0];

  return createElement(
    Flex,
    { style: { height: '100%' } },
    createElement(
      Card,
      { borderRight: true, style: { width: 240, flexShrink: 0, overflow: 'auto' } },
      createElement(
        Flex,
        { direction: 'column', gap: 1, padding: 3 },
        createElement(Text, { size: 1, weight: 'semibold', muted: true }, 'Guía del Studio'),
        ...SECTIONS.map((item) =>
          createElement(Button, {
            key: item.id,
            mode: item.id === section.id ? 'default' : 'bleed',
            text: item.title,
            justify: 'flex-start',
            fontSize: 1,
            onClick: () => setActive(item.id),
          }),
        ),
      ),
    ),
    createElement(
      Box,
      { flex: 1, padding: 5, style: { overflow: 'auto' } },
      createElement(
        Flex,
        { direction: 'column', gap: 4, style: { maxWidth: 760 } },
        createElement(Text, { size: 4, weight: 'semibold' }, section.title),
        ...section.body.map(renderPiece),
      ),
    ),
  );
}

export function guideTool(): Tool {
  return {
    name: 'guia',
    title: 'Guía',
    icon: HelpCircleIcon,
    component: GuideTool,
  };
}
