import type { QueryParams } from '@sanity/client';
import { getSanityClient } from '../client';

export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}) {
  const client = await getSanityClient();
  const data = await client.fetch<QueryResponse>(query, params ?? {});
  return { data };
}
