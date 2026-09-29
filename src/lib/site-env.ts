export function isStagingSite() {
  const value = String(import.meta.env.PUBLIC_SITE_ENV ?? '').trim().toLowerCase();
  return value === 'staging';
}

export const STAGING_ORIGIN = 'https://hiweb-marketing-ui-staging.hiwebapps.workers.dev';
