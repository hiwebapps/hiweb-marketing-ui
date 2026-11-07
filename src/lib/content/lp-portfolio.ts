import type { CaseIndexCard } from '../../components/sections/CasesIndex';
import { postCoverUrl } from '../blog';
import type { CaseRecord, IndustryRecord } from './types';
import type { LpPage } from './lp-types';

/** Landing slug → ids stored on a case (published slug and the short content key). */
const SERVICE_IDS: Record<string, string[]> = {
  seo: ['agencia-seo', 'seo'],
  'google-ads': ['agencia-de-google-ads', 'google-ads'],
  'meta-ads': ['agencia-de-facebook-ads', 'meta-ads'],
  'chatgpt-ads': ['agencia-de-chatgpt-ads', 'chatgpt-ads'],
  social: ['gestion-de-redes-sociales', 'redes-sociales', 'social'],
  community: ['servicio-de-community-manager', 'community-manager', 'community'],
  web: ['agencia-de-desarrollo-web', 'desarrollo-web', 'web'],
  ecommerce: ['desarrollo-de-ecommerce', 'ecommerce'],
  branding: ['agencia-de-branding', 'branding'],
  crm: ['crm-para-empresas', 'crm-automatizacion', 'crm'],
  ia: ['marketing-con-inteligencia-artificial', 'ia-marketing', 'ia'],
  inbound: ['agencia-de-inbound-marketing-mexico', 'inbound'],
};

const INDUSTRY_IDS: Record<string, string[]> = {
  industrial: ['agencia-de-marketing-industrial', 'manufactura', 'industrial'],
  salud: ['agencia-de-marketing-medico', 'salud'],
  inmobiliario: ['marketing-digital-inmobiliario', 'inmobiliarias', 'inmobiliario'],
  turismo: ['marketing-turistico', 'turismo-hoteleria', 'turismo'],
  restaurantes: ['marketing-digital-para-restaurantes', 'restaurantes'],
  saas: ['marketing-para-saas', 'saas'],
  automotriz: ['agencia-de-marketing-automotriz', 'automotriz'],
  'servicios-profesionales': ['marketing-de-servicios-profesionales', 'servicios-profesionales'],
};

type Candidate = CaseIndexCard & {
  serviceIds: string[];
  industryId: string;
};

function hash(value: string) {
  let state = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    state ^= value.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

function sample<T>(items: T[], count: number, seed: string) {
  const copy = [...items];
  let state = hash(seed) || 1;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    const current = copy[index];
    copy[index] = copy[swap];
    copy[swap] = current;
  }
  return copy.slice(0, count);
}

function accepted(slug: string, groups: Record<string, string[]>) {
  return new Set([slug, ...(groups[slug] ?? [])]);
}

export function portfolioCandidates(cases: CaseRecord[], industries: IndustryRecord[]): Candidate[] {
  const industryName = Object.fromEntries(industries.map((item) => [item.id, item.data.nombre]));
  return cases.map((item) => ({
    id: item.id,
    title: item.data.titulo || item.data.cliente,
    description: item.data.resumen,
    client: item.data.cliente,
    industry: industryName[item.data.industria.id] || item.data.cliente,
    industrySlug: item.data.industria.id,
    industryId: item.data.industria.id,
    image: item.data.imagen || item.data.seo?.ogImage || postCoverUrl(`caso-${item.id}`, 800, 520),
    href: `/portafolio/${item.id}`,
    featured: item.data.destacado,
    serviceIds: item.data.servicios.map((service) => service.id),
  }));
}

function toCard({ serviceIds: _serviceIds, industryId: _industryId, ...card }: Candidate): CaseIndexCard {
  return card;
}

export function pickLpPortfolio(
  page: Pick<LpPage, 'template' | 'role' | 'slug' | 'path'>,
  cases: Candidate[],
  chosen: string[] = [],
): CaseIndexCard[] {
  const picked = chosen.flatMap((slug) => cases.filter((item) => item.id === slug));
  if (picked.length) return picked.map(toCard);
  const filtered =
    page.role === 'detail' && page.template === 'servicios'
      ? cases.filter((item) => item.serviceIds.some((id) => accepted(page.slug, SERVICE_IDS).has(id)))
      : page.role === 'detail' && page.template === 'industrias'
        ? cases.filter((item) => accepted(page.slug, INDUSTRY_IDS).has(item.industryId))
        : cases;
  const pool = filtered.length ? filtered : cases;
  return sample(pool, 3, page.path).map(toCard);
}
