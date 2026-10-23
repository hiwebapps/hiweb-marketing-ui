/**
 * JSON for an inline <script type="application/ld+json">. Escapes `<` so a
 * Studio value like "</script><script>…" cannot close the tag early.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
