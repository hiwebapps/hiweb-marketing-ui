import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const usernameArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));

if (!usernameArg) {
  console.error('Uso: npx tsx scripts/sanity/sync-instagram.ts <usuario>');
  console.error('Ejemplo: npx tsx scripts/sanity/sync-instagram.ts el.secretomx');
  process.exit(1);
}

const username = usernameArg.trim().replace(/^@/, '');

function getEnvValue(key: string): string {
  if (process.env[key]) return process.env[key]!;
  // Read local .env if available
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(new RegExp(`^${key}=(.*)$`));
      if (match) return match[1].trim();
    }
  }
  return '';
}

const apifyToken = getEnvValue('APIFY_API_TOKEN');
if (!apifyToken) {
  console.error('Error: APIFY_API_TOKEN no encontrado en .env');
  process.exit(1);
}

const sanityToken = getEnvValue('SANITY_API_WRITE_TOKEN');
if (!sanityToken) {
  console.error('Error: SANITY_API_WRITE_TOKEN no encontrado en .env');
  process.exit(1);
}

const sanityClient = createClient({
  projectId: getEnvValue('PUBLIC_SANITY_PROJECT_ID') || 'fxardjr1',
  dataset: getEnvValue('PUBLIC_SANITY_DATASET') || 'web-2026',
  token: sanityToken,
  apiVersion: '2024-01-01',
  useCdn: false,
});

function formatStat(num: number | null | undefined): string {
  if (num == null) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(num);
}

async function run() {
  console.log(`[1/4] Consultando perfil de Instagram para @${username} vía Apify...`);

  const apifyRes = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?timeout=90`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apifyToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernames: [username],
      }),
    }
  );

  if (!apifyRes.ok) {
    const err = await apifyRes.text();
    throw new Error(`Fallo en Apify: ${err}`);
  }

  const dataset = (await apifyRes.json()) as Array<any>;
  const profile = dataset?.[0];

  if (!profile) {
    throw new Error(`No se encontró el perfil de @${username}`);
  }

  console.log(`✓ Perfil encontrado: ${profile.fullName || username} (${profile.followersCount} seguidores, ${profile.latestPosts?.length || 0} publicaciones recientes)`);

  // Subir avatar
  console.log(`[2/4] Subiendo foto de perfil a Sanity CDN...`);
  let avatarAssetId: string | undefined;
  const avatarUrl = profile.profilePicUrlHD || profile.profilePicUrl;
  if (avatarUrl) {
    const imgRes = await fetch(avatarUrl);
    if (imgRes.ok) {
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
      const asset = await sanityClient.assets.upload('image', imgBuffer, {
        filename: `${username}-avatar.jpg`,
      });
      avatarAssetId = asset._id;
      console.log(`✓ Avatar subido: ${asset._id}`);
    }
  }

  // Subir publicaciones
  console.log(`[3/4] Procesando y subiendo imágenes de las publicaciones...`);
  let rawPosts = profile.latestPosts || [];
  if (rawPosts.length === 0) {
    console.log(`[i] Consultando publicaciones vía apify~instagram-post-scraper...`);
    try {
      const pRes = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-post-scraper/run-sync-get-dataset-items?timeout=90`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apifyToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: [username],
            resultsLimit: 12,
          }),
        }
      );
      if (pRes.ok) {
        const pData = (await pRes.json()) as Array<any>;
        if (Array.isArray(pData) && pData.length > 0) {
          rawPosts = pData;
          console.log(`✓ Se encontraron ${rawPosts.length} publicaciones.`);
        }
      }
    } catch (e) {
      console.warn('Advertencia consultando posts complementarios:', e);
    }
  }
  const posts: Array<any> = [];

  for (let i = 0; i < Math.min(rawPosts.length, 12); i++) {
    const p = rawPosts[i];
    const kind =
      p.type === 'Video' || Boolean(p.videoUrl)
        ? 'reel'
        : p.type === 'Sidecar' || (Array.isArray(p.images) && p.images.length > 1)
          ? 'carousel'
          : 'photo';

    const key = `post-${i}-${Date.now()}`;

    if (kind === 'reel') {
      let posterAssetId: string | undefined;
      if (p.displayUrl) {
        const pRes = await fetch(p.displayUrl);
        if (pRes.ok) {
          const pBuf = Buffer.from(await pRes.arrayBuffer());
          const asset = await sanityClient.assets.upload('image', pBuf, {
            filename: `${username}-reel-${i}.jpg`,
          });
          posterAssetId = asset._id;
        }
      }

      posts.push({
        _key: key,
        _type: 'instagramPhonePost',
        kind: 'reel',
        showInService: true,
        caption: p.caption || '',
        poster: posterAssetId
          ? { _type: 'image', asset: { _type: 'reference', _ref: posterAssetId } }
          : undefined,
        videoUrl: p.videoUrl || undefined,
        stats: {
          views: formatStat(p.videoViewCount || p.playCount),
          likes: formatStat(p.likesCount),
          comments: formatStat(p.commentsCount),
        },
      });
      console.log(`  - Post ${i + 1}/${Math.min(rawPosts.length, 12)}: Reel subido`);
    } else if (kind === 'carousel') {
      const slides: Array<any> = [];
      const imagesList = Array.isArray(p.images) && p.images.length ? p.images : p.displayUrl ? [p.displayUrl] : [];

      for (let sIdx = 0; sIdx < Math.min(imagesList.length, 5); sIdx++) {
        const sRes = await fetch(imagesList[sIdx]);
        if (sRes.ok) {
          const sBuf = Buffer.from(await sRes.arrayBuffer());
          const asset = await sanityClient.assets.upload('image', sBuf, {
            filename: `${username}-carousel-${i}-${sIdx}.jpg`,
          });
          slides.push({
            _key: `slide-${sIdx}`,
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
          });
        }
      }

      posts.push({
        _key: key,
        _type: 'instagramPhonePost',
        kind: 'carousel',
        showInService: true,
        caption: p.caption || '',
        slides: slides.length >= 2 ? slides : undefined,
        image: slides[0] ? slides[0] : undefined,
        stats: {
          likes: formatStat(p.likesCount),
          comments: formatStat(p.commentsCount),
        },
      });
      console.log(`  - Post ${i + 1}/${Math.min(rawPosts.length, 12)}: Carrusel (${slides.length} slides) subido`);
    } else {
      let photoAssetId: string | undefined;
      if (p.displayUrl) {
        const pRes = await fetch(p.displayUrl);
        if (pRes.ok) {
          const pBuf = Buffer.from(await pRes.arrayBuffer());
          const asset = await sanityClient.assets.upload('image', pBuf, {
            filename: `${username}-photo-${i}.jpg`,
          });
          photoAssetId = asset._id;
        }
      }

      if (photoAssetId) {
        posts.push({
          _key: key,
          _type: 'instagramPhonePost',
          kind: 'photo',
          showInService: true,
          caption: p.caption || '',
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: photoAssetId },
          },
          stats: {
            likes: formatStat(p.likesCount),
            comments: formatStat(p.commentsCount),
          },
        });
        console.log(`  - Post ${i + 1}/${Math.min(rawPosts.length, 12)}: Foto subida`);
      }
    }
  }

  // Guardar documento en Sanity
  console.log(`[4/4] Creando o actualizando documento socialBrand en Sanity...`);
  const docId = `socialBrand-${username.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  const docData: any = {
    _id: docId,
    _type: 'socialBrand',
    name: profile.fullName || username,
    handle: username,
    bio: profile.biography || '',
    stats: {
      posts: String(profile.postsCount ?? rawPosts.length),
      followers: formatStat(profile.followersCount),
      following: formatStat(profile.followsCount),
    },
    posts,
  };

  if (profile.externalUrl) {
    docData.linkUrl = profile.externalUrl;
    try {
      docData.linkText = new URL(profile.externalUrl).hostname.replace(/^www\./, '');
    } catch {
      docData.linkText = 'Sitio web';
    }
  }

  if (avatarAssetId) {
    docData.avatar = {
      _type: 'image',
      asset: { _type: 'reference', _ref: avatarAssetId },
    };
  }

  await sanityClient.createOrReplace(docData);
  console.log(`\n🎉 ¡Listo! Documento '${docId}' creado y publicado en Sanity.`);
  console.log(`Nombre: ${docData.name}`);
  console.log(`Bio: ${docData.bio.slice(0, 60)}...`);
  console.log(`Posts guardados: ${posts.length}`);
}

run().catch((e) => {
  console.error('\n❌ Error:', e);
  process.exit(1);
});
