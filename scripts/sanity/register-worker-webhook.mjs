import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const sanityToken = process.env.SANITY_API_WRITE_TOKEN;
if (!sanityToken) throw new Error('missing SANITY_API_WRITE_TOKEN');

const secret = randomBytes(32).toString('hex');
writeFileSync('.sanity-revalidate.secret', secret, { encoding: 'utf8' });

let readToken = process.env.SANITY_API_READ_TOKEN || '';
if (!readToken) {
  const tokenRes = await fetch('https://api.sanity.io/v2021-06-07/projects/fxardjr1/tokens', {
    method: 'POST',
    headers: { Authorization: `Bearer ${sanityToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ label: 'hiweb-marketing-ui-worker-read', roleName: 'viewer' }),
  });
  const tokenJson = await tokenRes.json();
  console.log('viewer-token-status', tokenRes.status);
  if (tokenRes.ok && tokenJson.key) {
    readToken = tokenJson.key;
    console.log('viewer-token-created', true);
  } else {
    readToken = sanityToken;
    console.log('viewer-token-fallback-write', true, JSON.stringify(tokenJson).slice(0, 200));
  }
}

const hookBody = {
  type: 'document',
  name: 'Worker web-2026 (no Vercel)',
  description: 'Publish on web-2026 hits the Worker only. Does not deploy Vercel.',
  url: 'https://hiweb-marketing-ui.hiwebapps.workers.dev/api/sanity-webhook',
  dataset: 'web-2026',
  httpMethod: 'POST',
  apiVersion: 'v2021-03-25',
  includeDrafts: false,
  includeAllVersions: false,
  headers: { Authorization: `Bearer ${secret}` },
  rule: {
    on: ['create', 'update', 'delete'],
    filter:
      '_type in ["industry","service","caseStudy","post","homePage","aboutPage","siteSettings","person","landingPage","faq"]',
  },
};

const hookRes = await fetch('https://api.sanity.io/v2021-10-04/hooks/projects/fxardjr1', {
  method: 'POST',
  headers: { Authorization: `Bearer ${sanityToken}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(hookBody),
});
const hookJson = await hookRes.json();
console.log('hook-status', hookRes.status);
console.log('hook-id', hookJson.id || hookJson._id || 'none');
console.log('hook-name', hookJson.name || '');
console.log('hook-url', hookJson.url || '');
console.log('hook-dataset', hookJson.dataset || '');
if (!hookRes.ok) console.log('hook-error', JSON.stringify(hookJson).slice(0, 400));

function putSecret(name, value) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['wrangler', 'secret', 'put', name], {
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: true,
    });
    child.stdin.write(value);
    child.stdin.end();
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${name} exit ${code}`)),
    );
  });
}

await putSecret('SANITY_REVALIDATE_SECRET', secret);
await putSecret('SANITY_API_READ_TOKEN', readToken);
console.log('wrangler-secrets-ok');
