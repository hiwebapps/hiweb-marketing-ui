import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

function getEnvValue(key: string): string {
  if (process.env[key]) return process.env[key]!;
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
const sanityToken = getEnvValue('SANITY_API_WRITE_TOKEN');

if (!apifyToken || !sanityToken) {
  console.error('Error: Se requieren APIFY_API_TOKEN y SANITY_API_WRITE_TOKEN en .env');
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

export interface SyncClientOptions {
  caseStudyId?: string;
  category?: string;
  untilDate?: string;
  postUrls?: string[];
}

export async function syncSingleClient(
  usernameInput: string,
  caseStudyIdOrOptions?: string | SyncClientOptions,
  categoryArg?: string
) {
  const options: SyncClientOptions =
    typeof caseStudyIdOrOptions === 'object' && caseStudyIdOrOptions !== null
      ? caseStudyIdOrOptions
      : {
          caseStudyId: caseStudyIdOrOptions,
          category: categoryArg,
        };

  const { caseStudyId, category, untilDate, postUrls = [] } = options;
  const username = usernameInput.trim().replace(/^@/, '');
  console.log(`\n==================================================`);
  console.log(`▶ Sincronizando @${username} (caso: ${caseStudyId || 'ninguno'})...`);
  if (postUrls.length > 0) console.log(`  Modo: ${postUrls.length} URLs directas`);
  if (untilDate) console.log(`  Filtro: Publicaciones hasta ${untilDate}`);
  console.log(`==================================================`);

  console.log(`[1/4] Consultando perfil en Instagram vía Apify...`);
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
    throw new Error(`Fallo en Apify profile-scraper: ${err}`);
  }

  const dataset = (await apifyRes.json()) as Array<any>;
  const profile = dataset?.[0];

  if (!profile) {
    throw new Error(`No se encontró el perfil de @${username}`);
  }

  console.log(
    `✓ Perfil encontrado: ${profile.fullName || username} (${profile.followersCount} seguidores, ${profile.latestPosts?.length || 0} posts en perfil)`
  );

  // Subir avatar
  console.log(`[2/4] Subiendo foto de perfil a Sanity CDN...`);
  let avatarAssetId: string | undefined;
  const avatarUrl = profile.profilePicUrlHD || profile.profilePicUrl;
  if (avatarUrl) {
    try {
      const imgRes = await fetch(avatarUrl);
      if (imgRes.ok) {
        const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
        const asset = await sanityClient.assets.upload('image', imgBuffer, {
          filename: `${username}-avatar.jpg`,
        });
        avatarAssetId = asset._id;
        console.log(`✓ Avatar subido: ${asset._id}`);
      }
    } catch (e) {
      console.warn('⚠️ No se pudo subir el avatar:', e);
    }
  }

  // Subir publicaciones
  console.log(`[3/4] Procesando publicaciones...`);
  let rawPosts: Array<any> = [];

  if (postUrls.length > 0) {
    console.log(`[i] Obteniendo ${postUrls.length} publicaciones específicas vía Apify...`);
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
            directUrls: postUrls,
            resultsLimit: 1,
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
      console.warn('Advertencia consultando URLs directas:', e);
    }
  } else if (untilDate) {
    console.log(`[i] Obteniendo publicaciones anteriores a ${untilDate} vía Apify...`);
    try {
      const cutoffTime = new Date(untilDate).getTime() + 86400000 - 1;
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
            resultsLimit: 60,
            skipPinnedPosts: true,
          }),
        }
      );
      if (pRes.ok) {
        const pData = (await pRes.json()) as Array<any>;
        if (Array.isArray(pData) && pData.length > 0) {
          const eligible = pData.filter((p) => {
            const rawT = p.timestamp || p.takenAtTimestamp || p.takenAt;
            const t = rawT ? (typeof rawT === 'number' ? rawT * 1000 : new Date(rawT).getTime()) : null;
            return t != null ? t <= cutoffTime : true;
          });
          eligible.sort((a, b) => {
            const tA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const tB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return tB - tA;
          });
          rawPosts = eligible;
          console.log(`✓ Se encontraron ${rawPosts.length} publicaciones anteriores a ${untilDate}.`);
        }
      }
    } catch (e) {
      console.warn('Advertencia consultando publicaciones por fecha:', e);
    }
  } else {
    rawPosts = profile.latestPosts || [];
    if (rawPosts.length === 0) {
      console.log(`[i] Obteniendo publicaciones vía apify~instagram-post-scraper...`);
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
        try {
          const pRes = await fetch(p.displayUrl);
          if (pRes.ok) {
            const pBuf = Buffer.from(await pRes.arrayBuffer());
            const asset = await sanityClient.assets.upload('image', pBuf, {
              filename: `${username}-reel-${i}.jpg`,
            });
            posterAssetId = asset._id;
          }
        } catch (e) {
          console.warn(`Error subiendo poster para reel ${i}:`, e);
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
      console.log(`  - Post ${i + 1}/${Math.min(rawPosts.length, 12)}: Reel procesado`);
    } else if (kind === 'carousel') {
      const slides: Array<any> = [];
      const imagesList = Array.isArray(p.images) && p.images.length ? p.images : p.displayUrl ? [p.displayUrl] : [];

      for (let sIdx = 0; sIdx < Math.min(imagesList.length, 5); sIdx++) {
        try {
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
        } catch (e) {
          console.warn(`Error subiendo slide ${sIdx} de post ${i}:`, e);
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
      console.log(`  - Post ${i + 1}/${Math.min(rawPosts.length, 12)}: Carrusel (${slides.length} slides) procesado`);
    } else {
      let photoAssetId: string | undefined;
      if (p.displayUrl) {
        try {
          const pRes = await fetch(p.displayUrl);
          if (pRes.ok) {
            const pBuf = Buffer.from(await pRes.arrayBuffer());
            const asset = await sanityClient.assets.upload('image', pBuf, {
              filename: `${username}-photo-${i}.jpg`,
            });
            photoAssetId = asset._id;
          }
        } catch (e) {
          console.warn(`Error subiendo foto de post ${i}:`, e);
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
        console.log(`  - Post ${i + 1}/${Math.min(rawPosts.length, 12)}: Foto procesada`);
      }
    }
  }

  // Guardar documento socialBrand en Sanity
  console.log(`[4/4] Guardando socialBrand y vinculando caso de éxito...`);
  const docId = `socialBrand-${username.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  const docData: any = {
    _id: docId,
    _type: 'socialBrand',
    name: profile.fullName || username,
    handle: username,
    category: category || undefined,
    bio: profile.biography || '',
    stats: {
      posts: String(profile.postsCount ?? rawPosts.length),
      followers: formatStat(profile.followersCount),
      following: formatStat(profile.followsCount),
    },
    posts,
    cutoffDate: untilDate || undefined,
    customPostUrls: postUrls.length ? postUrls : undefined,
  };

  if (caseStudyId) {
    docData.caseStudy = {
      _type: 'reference',
      _ref: caseStudyId,
    };
  }

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
  console.log(`✓ Documento '${docId}' creado y publicado en Sanity.`);

  // Vincular caseStudy hacia socialBrand
  if (caseStudyId) {
    try {
      await sanityClient.patch(caseStudyId).set({
        socialBrand: { _type: 'reference', _ref: docId },
      }).commit();
      console.log(`✓ Caso '${caseStudyId}' vinculado a '${docId}'.`);

      // Si existe versión en inglés, vincular también
      const enCaseId = `${caseStudyId}-en`;
      const enExists = await sanityClient.getDocument(enCaseId);
      if (enExists) {
        await sanityClient.patch(enCaseId).set({
          socialBrand: { _type: 'reference', _ref: docId },
        }).commit();
        console.log(`✓ Caso en inglés '${enCaseId}' vinculado a '${docId}'.`);
      }
    } catch (e) {
      console.warn(`Advertencia vinculando caso de éxito:`, e);
    }
  }

  console.log(`🎉 @${username} sincronizado exitosamente con ${posts.length} publicaciones.`);
  return { docId, postsCount: posts.length };
}

// Si se ejecuta directamente por CLI
if (process.argv[1]?.endsWith('sync-client.ts')) {
  const userArg = process.argv[2];
  const caseArg = process.argv[3];
  const catArg = process.argv[4];

  if (!userArg) {
    console.error('Uso: npx tsx scripts/sanity/sync-client.ts <usuario> [casoId] [categoria]');
    process.exit(1);
  }

  syncSingleClient(userArg, caseArg, catArg).catch((e) => {
    console.error('❌ Error en sincronización:', e);
    process.exit(1);
  });
}
