import { defineCliConfig } from 'sanity/cli';

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  'fxardjr1';

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  'web-2026';

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: 'hiweb-web',
  deployment: {
    appId: 'hfmbspi4louqwqyclcamau1z',
    autoUpdates: true,
  },
  typegen: {
    path: './src/**/*.{ts,tsx,js,jsx,astro}',
    schema: './schema.json',
    generates: './src/sanity/types.ts',
  },
});
