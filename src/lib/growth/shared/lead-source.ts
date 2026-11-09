/** Campaign fields the forms send (see src/lib/attribution.ts). `referrer` is a bare hostname. */
const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
  'referrer',
] as const;

export type LeadAttribution = Partial<Record<(typeof ATTRIBUTION_FIELDS)[number], string>>;

export type LeadSourceChannel =
  | 'paid'
  | 'ai'
  | 'organic'
  | 'social'
  | 'email'
  | 'campaign'
  | 'referral'
  | 'direct';

export type LeadSource = { label: string; channel: LeadSourceChannel };

export function attributionFields(value: unknown): LeadAttribution | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const source = value as Record<string, unknown>;
  const result: LeadAttribution = {};
  for (const key of ATTRIBUTION_FIELDS) {
    const item = source[key];
    if (typeof item !== 'string') continue;
    const trimmed = item.trim().slice(0, 200);
    if (trimmed) result[key] = trimmed;
  }
  return Object.keys(result).length ? result : undefined;
}

const PAID_MEDIUM = /^(cpc|ppc|cpm|cpv|paid.*|display|ads?|sem)$/;
const AI_SOURCE = /chatgpt|openai/;
const AI_HOST = /(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com)$/;
const SEARCH_HOST = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|yandex|baidu)\.[a-z.]+$/;
const SOCIAL_HOST =
  /(^|\.)(facebook|instagram|linkedin|tiktok|youtube|pinterest|twitter|x|threads)\.(com|net)$|^(t\.co|lnkd\.in)$/;

/** Readable origin of a lead for Slack and the CRM. The first matching rule wins. */
export function classifyLeadSource(attribution: LeadAttribution | undefined): LeadSource {
  const source = attribution?.utm_source?.toLowerCase() ?? '';
  const medium = attribution?.utm_medium?.toLowerCase() ?? '';
  const paid = PAID_MEDIUM.test(medium);

  if (AI_SOURCE.test(source)) {
    return paid ? { label: 'OpenAI Ads', channel: 'paid' } : { label: 'ChatGPT (orgánico)', channel: 'ai' };
  }
  if (attribution?.gclid || (paid && source.includes('google'))) return { label: 'Google Ads', channel: 'paid' };
  if (attribution?.fbclid || (paid && /facebook|instagram|meta|^fb$|^ig$/.test(source))) {
    return { label: 'Meta Ads', channel: 'paid' };
  }
  if (paid && source.includes('linkedin')) return { label: 'LinkedIn Ads', channel: 'paid' };
  if (paid) return { label: `Anuncio (${attribution?.utm_source || medium})`, channel: 'paid' };
  if (medium === 'email') return { label: 'Email', channel: 'email' };
  if (source || medium) return { label: `Campaña (${attribution?.utm_source || medium})`, channel: 'campaign' };

  const host = attribution?.referrer?.toLowerCase() ?? '';
  if (!host) return { label: 'Directo', channel: 'direct' };
  if (AI_HOST.test(host)) return { label: 'IA (orgánico)', channel: 'ai' };
  if (SEARCH_HOST.test(host)) return { label: 'Orgánico (buscador)', channel: 'organic' };
  if (SOCIAL_HOST.test(host)) return { label: 'Social orgánico', channel: 'social' };
  return { label: `Referido (${host.replace(/^www\./, '')})`, channel: 'referral' };
}
