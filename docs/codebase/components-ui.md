# UI

`src/components/ui`. El barril es la puerta que usan las secciones. `CalendarTool` y `MarketingQuiz` importan `Button.tsx` y `TextField.tsx` por archivo, no por el barril.

El grafo anota `src/components/ui/index.ts` con “Lo usan: —” porque los imports dicen `from '../ui'` y el barrido los guarda como carpeta. El archivo que resuelve es este `index.ts`.

## Fichas

### `src/components/ui/Button.tsx`
- Propósito: CTA del sitio. Puede ser `<button>` o `<a>` si llega `href`.
- Por qué está así: Variantes `primary`, `secondary`, `ghost`, `orange`, `outline` y tamaños `sm|md|lg`. En `primary` y `secondary` el glow es `BorderGlow` (hover, sin animación de loop salvo el primario). El resto son clases de token (`bg-ink`, `bg-accent-orange`, `border-border-strong`). Alturas fijas `h-[44px]`, `h-[50px]`, `h-[56px]`.
- Exporta: `Button`.
- Depende de: `src/components/effects/BorderGlow.jsx`.
- Lo usan: `src/components/ui/index.ts`, `growth/CalendarTool.tsx`, `growth/MarketingQuiz.tsx`. El resto de secciones lo recibe por el barril.
- Datos: `variant`, `size`, `glow`, `href`, `disabled` y el resto de atributos del botón o del enlace.
- Hallazgos: D-04 (43 usos fuera del catálogo), D-05 (alturas en px), D-06 (importa el `.jsx`).

### `src/components/ui/Badge.tsx`
- Propósito: Pastilla de etiqueta. La usan las cabeceras de sección y varias cards.
- Por qué está así: `variant` elige el acento; `tone="on-ink"` invierte el texto sobre fondo oscuro.
- CSS: `Badge.css` — el acento es `var(--color-accent-*)`. El ink del cyan es `#1b3645`, fuera de la paleta de tokens. El TSX no fija ese hex.
- Exporta: `Badge`, `BadgeVariant` (`cyan`, `orange`, `purple`, `lime`, `neutral`, `success`, `danger`).
- Depende de: `Badge.css`.
- Lo usan: `src/components/ui/index.ts`. Las secciones lo importan por el barril.
- Datos: `children`, `variant` (default `neutral`), `tone`.
- Hallazgos: D-04, D-05.

### `src/components/ui/TextField.tsx`
- Propósito: Input con label en mayúsculas, icono opcional, hint o error.
- Por qué está así: Borde `border` / `border-strong` y error `accent-red`. El foco es un anillo `rgba(17,17,17,.08)`, no un token con nombre.
- Exporta: `TextField`.
- Depende de: —
- Lo usan: `src/components/ui/index.ts`, `growth/CalendarTool.tsx`, `growth/MarketingQuiz.tsx`. `ContactForm` y `ContactPage` lo reciben por el barril.
- Datos: atributos de `<input>` más `label`, `hint`, `error`, `icon`.
- Hallazgos: D-04.

### `src/components/ui/TextArea.tsx`
- Propósito: Textarea con la misma etiqueta, hint y error que `TextField`.
- Por qué está así: Mismos tokens de borde y foco. `rows` por defecto 4. `resize-y`.
- Exporta: `TextArea`.
- Depende de: —
- Lo usan: `src/components/ui/index.ts`. En páginas: `ContactForm` y el demo `ContactPage`, vía barril.
- Datos: atributos de `<textarea>` más `label`, `hint`, `error`.
- Hallazgos: D-04.

### `src/components/ui/SelectField.tsx`
- Propósito: `<select>` con label y chevron en SVG de fondo.
- Por qué está así: Misma caja que `TextField`. La flecha es un data-URI; el trazo del SVG es `#6b7280` (el muted de la paleta, escrito en el URI).
- Exporta: `SelectField`.
- Depende de: —
- Lo usan: `src/components/ui/index.ts`. En JSX solo `DesignSystem` y `ContactPage`. `ContactPage` no lo monta ninguna ruta.
- Datos: `options` (`value`, `label`), `label`, `hint`.
- Hallazgos: D-04.

### `src/components/ui/Checkbox.tsx`
- Propósito: Checkbox con label. El input nativo se oculta visualmente y un SVG marca el check.
- Por qué está así: Tokens `border-strong`, `canvas`, `ink`. El comentario de producto no lo usa: el formulario real pinta `<input type="checkbox">`.
- Exporta: `Checkbox`.
- Depende de: —
- Lo usan: `src/components/ui/index.ts`. El único JSX está en `DesignSystem.tsx`.
- Datos: `label` y atributos de input salvo `type`.
- Hallazgos: D-04.

### `src/components/ui/Toggle.tsx`
- Propósito: Switch. Un checkbox accesible y una pastilla que se desplaza con `peer-checked`.
- Por qué está así: El comentario dice “sin hidratación React”: es CSS (`peer`, `duration-150`). Tokens `surface`, `ink`, `canvas`.
- Exporta: `Toggle`.
- Depende de: —
- Lo usan: `src/components/ui/index.ts`. El único JSX está en `DesignSystem.tsx`.
- Datos: `label` y atributos de input salvo `type`.
- Hallazgos: D-04.

### `src/components/ui/index.ts`
- Propósito: Barril del kit. Reexporta controles y el tipo `BadgeVariant`.
- Por qué está así: Las secciones importan `from '../ui'`. Exportar aquí no publica una pieza en una ruta: hace falta que alguna sección la use en JSX.
- Exporta: `Button`, `TextField`, `TextArea`, `SelectField`, `Badge`, `BadgeVariant`, `Checkbox`, `Toggle`.
- Depende de: `Button.tsx`, `TextField.tsx`, `TextArea.tsx`, `SelectField.tsx`, `Badge.tsx`, `Checkbox.tsx`, `Toggle.tsx`.
- Lo usan: quien importa la carpeta `src/components/ui`. En el grafo eso aparece como dependencia de `DesignSystem`, `Hero`, `SectionRenderer`, `SectionHeader`, `PortalPageView`, `PortalShowcase` y de las secciones de marketing que pintan `Button` o `Badge` (about, before/after, blog, casos, contacto, FAQ, CTA, heroes, industrias, métricas, pilares, servicios, nav, footer, equipo, kit). `CalendarTool` y `MarketingQuiz` no pasan por aquí.
- Datos: —
- Hallazgos: D-04, D-06.
