import { localLpPage, localLpPages } from '../../data/lp/pages';
import { loadQuery } from '../../sanity/lib/load-query';
import { mapLpDocument } from './map-lp';
import type { LpPage, LpTemplate } from './lp-types';

const LP_LIST_QUERY = `*[_type == "lpPage" && defined(path)]{ path, slug, template, role }`;
const LP_PAGE_QUERY = `*[_type == "lpPage" && path == $path][0]{
  _id, title, path, slug, template, role, description, watching, interests,
  metaTitle, metaDescription,
  nav, picker, sections
}`;

async function sanityLpPage(path: string): Promise<LpPage | null> {
  const { data } = await loadQuery<Record<string, unknown> | null>({
    query: LP_PAGE_QUERY,
    params: { path },
    stega: false,
  });
  return mapLpDocument(data);
}

export async function getLpPage(path: string): Promise<LpPage | null> {
  try {
    const remote = await sanityLpPage(path);
    if (remote?.sections.length) return remote;
  } catch (error) {
    console.error(`[lp] No se pudo leer ${path} desde Sanity.`, error);
  }
  return localLpPage(path);
}

export async function lpDetailPaths(template: Extract<LpTemplate, 'servicios' | 'industrias'>) {
  const pages = new Map(
    localLpPages()
      .filter((page) => page.template === template && page.role === 'detail')
      .map((page) => [page.path, { slug: page.slug, path: page.path }]),
  );
  try {
    const { data } = await loadQuery<{ path?: string; slug?: string; template?: string; role?: string }[]>({
      query: LP_LIST_QUERY,
      stega: false,
    });
    for (const item of data ?? []) {
      if (item.template === template && item.role === 'detail' && item.path && item.slug) {
        pages.set(item.path, { slug: item.slug, path: item.path });
      }
    }
  } catch (error) {
    console.error('[lp] La lista de Sanity no está disponible. Se usan las rutas locales.', error);
  }
  return [...pages.values()];
}
