import type { ClientPerspective, QueryParams, StegaConfig } from '@sanity/client';
import { getPreviewState } from '../../lib/preview-context';
import { getSanityClient } from '../client';

const STUDIO_URL = 'https://hiweb-web.sanity.studio';

const STEGA_SKIP = new Set([
  'href',
  'url',
  'slug',
  'icon',
  'accent',
  'tone',
  'variant',
  'id',
  'kind',
  'columns',
  'style',
  'listItem',
  'fecha',
]);

const stegaFilter: NonNullable<StegaConfig['filter']> = (props) => {
  const last = props.sourcePath.at(-1);
  if (typeof last === 'string' && STEGA_SKIP.has(last)) return false;
  return props.filterDefault(props);
};

function parsePerspective(raw: string | undefined): ClientPerspective | undefined {
  if (!raw) return undefined;
  const decoded = decodeURIComponent(raw);
  if (decoded.startsWith('[')) {
    try {
      return JSON.parse(decoded) as ClientPerspective;
    } catch {
      return undefined;
    }
  }
  return decoded as ClientPerspective;
}

export async function loadQuery<QueryResponse>({
  query,
  params,
  stega = true,
}: {
  query: string;
  params?: QueryParams;
  /** Related lists on a post page skip stega so preview stays inside the Worker CPU budget. */
  stega?: boolean;
}) {
  const client = await getSanityClient();
  const preview = getPreviewState();
  if (!stega || !preview?.stega) {
    const data = await client.fetch<QueryResponse>(query, params ?? {});
    return { data };
  }

  const response = await client.fetch<QueryResponse>(query, params ?? {}, {
    filterResponse: false,
    perspective: parsePerspective(preview.perspective) ?? 'drafts',
    resultSourceMap: 'withKeyArraySelector',
    stega: {
      enabled: true,
      studioUrl: STUDIO_URL,
      filter: stegaFilter,
    },
  });
  const data = response && typeof response === 'object' && 'result' in response ? response.result : response;
  return { data };
}
