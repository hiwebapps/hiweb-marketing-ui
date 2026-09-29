/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SITE_ENV?: string;
  readonly PUBLIC_SITE_INDEXABLE?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly STAGING_USER?: string;
  readonly STAGING_PASSWORD?: string;
  readonly SANITY_API_READ_TOKEN?: string;
  readonly SANITY_API_WRITE_TOKEN?: string;
  readonly SANITY_REVALIDATE_SECRET?: string;
  readonly CLOUDFLARE_DEPLOY_HOOK_URL?: string;
  readonly SANITY_STUDIO_PROJECT_ID?: string;
  readonly SANITY_STUDIO_DATASET?: string;
  readonly SANITY_STUDIO_PREVIEW_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'cloudflare:workers' {
  export const env: Record<string, string | undefined>;
}
