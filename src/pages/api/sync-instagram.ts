import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

export const prerender = false;

const ALLOWED_ORIGINS = new Set([
  'https://hiweb-web.sanity.studio',
  'http://localhost:3333',
  'http://127.0.0.1:3333',
  'http://localhost:4321',
  'http://localhost:4322',
]);

function getCorsHeaders(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Vary: 'Origin',
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
  }
  return headers;
}

export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
};

function formatStat(num: number | null | undefined): string {
  if (num == null) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(num);
}

async function getSecret(key: string): Promise<string | undefined> {
  try {
    const { env } = await import('cloudflare:workers');
    const val = (env as Record<string, unknown>)?.[key];
    if (typeof val === 'string' && val) return val;
  } catch {}

  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }

  const fromMeta = (import.meta.env as Record<string, unknown>)?.[key];
  if (typeof fromMeta === 'string' && fromMeta) return fromMeta;

  return undefined;
}

function cleanInstagramUrl(raw: string): string {
  try {
    const u = new URL(raw.trim());
    return `${u.origin}${u.pathname.replace(/\/+$/, '')}/`;
  } catch {
    return raw.trim();
  }
}

function cleanInstagramHandle(raw: string): string {
  if (!raw) return '';
  let u = raw.trim();
  u = u.replace(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\//i, '');
  u = u.split('?')[0].split('#')[0];
  u = u.replace(/^\/+|\/+$/g, '').replace(/^@+/, '').trim();
  return u;
}

export const POST: APIRoute = async ({ request }) => {
  const cors = getCorsHeaders(request);

  try {
    const body = (await request.json()) as {
      username?: string;
      documentId?: string;
      untilDate?: string;
      postUrls?: string[];
    };

    const username = cleanInstagramHandle(body.username || '');
    const documentId = body.documentId?.trim();
    const untilDate = body.untilDate?.trim();
    const rawPostUrls = Array.isArray(body.postUrls) ? body.postUrls : [];
    const postUrls = rawPostUrls
      .map((u) => (typeof u === 'string' ? cleanInstagramUrl(u) : ''))
      .filter((u) => u && (u.includes('instagram.com/p/') || u.includes('instagram.com/reel/')));

    if (!username) {
      return new Response(JSON.stringify({ success: false, error: 'Usuario requerido.' }), {
        status: 400,
        headers: cors,
      });
    }

    if (!documentId) {
      return new Response(JSON.stringify({ success: false, error: 'Document ID requerido.' }), {
        status: 400,
        headers: cors,
      });
    }

    const apifyToken = await getSecret('APIFY_API_TOKEN');

    if (!apifyToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Falta configurar APIFY_API_TOKEN en el servidor.' }),
        { status: 500, headers: cors }
      );
    }

    const sanityToken = await getSecret('SANITY_API_WRITE_TOKEN');

    if (!sanityToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Falta configurar SANITY_API_WRITE_TOKEN en el servidor.' }),
        { status: 500, headers: cors }
      );
    }

    const projectId =
      (await getSecret('PUBLIC_SANITY_PROJECT_ID')) ||
      process.env.PUBLIC_SANITY_PROJECT_ID ||
      'fxardjr1';

    const dataset =
      (await getSecret('PUBLIC_SANITY_DATASET')) ||
      process.env.PUBLIC_SANITY_DATASET ||
      'web-2026';

    const sanityClient = createClient({
      projectId,
      dataset,
      token: sanityToken,
      apiVersion: '2024-01-01',
      useCdn: false,
    });

    const cleanId = documentId.replace(/^drafts\./, '');
    const draftId = `drafts.${cleanId}`;

    // Si las URLs o la fecha no vinieron en el cuerpo, verificar si ya existen en el documento de Sanity
    let effectivePostUrls = postUrls;
    let effectiveUntilDate = untilDate;

    if (effectivePostUrls.length === 0 || !effectiveUntilDate) {
      try {
        const existingDoc =
          (await sanityClient.getDocument(draftId)) ||
          (await sanityClient.getDocument(cleanId));
        if (existingDoc) {
          if (effectivePostUrls.length === 0 && Array.isArray(existingDoc.customPostUrls)) {
            effectivePostUrls = existingDoc.customPostUrls
              .map((u: any) => (typeof u === 'string' ? cleanInstagramUrl(u) : ''))
              .filter(
                (u: string) =>
                  u && (u.includes('instagram.com/p/') || u.includes('instagram.com/reel/'))
              );
          }
          if (!effectiveUntilDate && typeof existingDoc.cutoffDate === 'string') {
            effectiveUntilDate = existingDoc.cutoffDate;
          }
        }
      } catch (docErr) {
        console.warn('Nota: no se pudo leer documento previo de Sanity:', docErr);
      }
    }

    // 1. Ejecutar Apify actor (instagram-profile-scraper)
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
      const errText = await apifyRes.text();
      return new Response(
        JSON.stringify({ success: false, error: `Error de Apify: ${errText}` }),
        { status: 502, headers: cors }
      );
    }

    const apifyData = (await apifyRes.json()) as Array<{
      username?: string;
      fullName?: string;
      biography?: string;
      externalUrl?: string;
      followersCount?: number;
      followsCount?: number;
      postsCount?: number;
      profilePicUrlHD?: string;
      profilePicUrl?: string;
      latestPosts?: Array<{
        id?: string;
        type?: string;
        caption?: string;
        displayUrl?: string;
        images?: string[];
        videoUrl?: string;
        likesCount?: number;
        commentsCount?: number;
        url?: string;
      }>;
    }>;

    const profile = apifyData?.[0];
    if (!profile) {
      return new Response(
        JSON.stringify({ success: false, error: `No se encontró información para @${username}.` }),
        { status: 404, headers: cors }
      );
    }

    // 2. Subir avatar a Sanity
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
        }
      } catch (e) {
        console.warn('Error subiendo avatar a Sanity:', e);
      }
    }

    // 3. Procesar las publicaciones según modo (URLs directas, filtro por fecha o más recientes)
    let rawPosts: Array<any> = [];

    if (effectivePostUrls.length > 0) {
      console.log(`[Apify] Consultando ${effectivePostUrls.length} enlaces directos vía apify~instagram-scraper...`);
      try {
        const directRes = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?timeout=90`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apifyToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              directUrls: effectivePostUrls,
              resultsType: 'posts',
            }),
          }
        );
        if (directRes.ok) {
          const directData = (await directRes.json()) as Array<any>;
          if (Array.isArray(directData) && directData.length > 0) {
            rawPosts = directData;
          }
        } else {
          console.error('[Apify directUrls error]:', await directRes.text());
        }
      } catch (err) {
        console.warn('Error en scraper de enlaces directos:', err);
      }
    } else if (effectiveUntilDate) {
      console.log(`[Apify] Filtrando publicaciones de @${username} anteriores a ${effectiveUntilDate}...`);
      try {
        const cutoffTime = new Date(effectiveUntilDate).getTime() + 86400000 - 1; // Fin del día
        const postsRes = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-post-scraper/run-sync-get-dataset-items?timeout=120`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apifyToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: [username],
              resultsLimit: 150,
              skipPinnedPosts: true,
            }),
          }
        );
        if (postsRes.ok) {
          const pData = (await postsRes.json()) as Array<any>;
          if (Array.isArray(pData) && pData.length > 0) {
            const filtered = pData.filter((p) => {
              const rawT = p.timestamp || p.takenAtTimestamp || p.takenAt;
              const t = rawT ? (typeof rawT === 'number' ? rawT * 1000 : new Date(rawT).getTime()) : null;
              return t != null ? t <= cutoffTime : false;
            });
            filtered.sort((a, b) => {
              const tA = a.timestamp ? new Date(a.timestamp).getTime() : (a.takenAtTimestamp ? a.takenAtTimestamp * 1000 : 0);
              const tB = b.timestamp ? new Date(b.timestamp).getTime() : (b.takenAtTimestamp ? b.takenAtTimestamp * 1000 : 0);
              return tB - tA;
            });
            rawPosts = filtered;
          }
        }
      } catch (err) {
        console.warn('Error en scraper filtrado por fecha:', err);
      }

      if (rawPosts.length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `No se encontraron publicaciones anteriores a ${effectiveUntilDate} en los últimos 150 posts de @${username}. Te sugerimos pegar los enlaces directos en el campo 'Enlaces directos de publicaciones o reels'.`,
          }),
          { status: 404, headers: cors }
        );
      }
    } else {
      rawPosts = profile.latestPosts || [];
      if (rawPosts.length === 0) {
        try {
          const postsRes = await fetch(
            `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?timeout=90`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${apifyToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                directUrls: [`https://www.instagram.com/${username}/`],
                resultsType: 'posts',
                resultsLimit: 12,
              }),
            }
          );
          if (postsRes.ok) {
            const postsData = (await postsRes.json()) as typeof rawPosts;
            if (Array.isArray(postsData) && postsData.length > 0) {
              rawPosts = postsData;
            }
          }
        } catch (e) {
          console.warn('Fallback instagram-scraper error:', e);
        }
      }
    }
    const formattedPosts: Array<Record<string, unknown>> = [];

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
            console.warn('Error subiendo poster de reel:', e);
          }
        }

        formattedPosts.push({
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
      } else if (kind === 'carousel') {
        const slides: Array<Record<string, unknown>> = [];
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
            console.warn('Error subiendo slide de carrusel:', e);
          }
        }

        formattedPosts.push({
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
      } else {
        // kind === 'photo'
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
            console.warn('Error subiendo foto de post:', e);
          }
        }

        if (photoAssetId) {
          formattedPosts.push({
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
        }
      }
    }

    // 4. Parchear o crear documento en Sanity
    const patchPayload: Record<string, unknown> = {
      bio: profile.biography || '',
      stats: {
        posts: String(profile.postsCount ?? rawPosts.length),
        followers: formatStat(profile.followersCount),
        following: formatStat(profile.followsCount),
      },
    };

    if (profile.fullName) {
      patchPayload.category = patchPayload.category || profile.fullName;
    }

    if (profile.externalUrl) {
      patchPayload.linkUrl = profile.externalUrl;
      try {
        patchPayload.linkText = new URL(profile.externalUrl).hostname.replace(/^www\./, '');
      } catch {
        patchPayload.linkText = 'Sitio web';
      }
    }

    if (avatarAssetId) {
      patchPayload.avatar = {
        _type: 'image',
        asset: { _type: 'reference', _ref: avatarAssetId },
      };
    }

    if (formattedPosts.length > 0) {
      patchPayload.posts = formattedPosts;
    }

    if (effectiveUntilDate) {
      patchPayload.cutoffDate = effectiveUntilDate;
    }

    if (effectivePostUrls.length > 0) {
      patchPayload.customPostUrls = effectivePostUrls;
    }

    // 4. Parchear documento publicado y borrador en Sanity
    try {
      await sanityClient.createIfNotExists({
        _id: cleanId,
        _type: 'socialBrand',
        name: profile.fullName || username,
        handle: username,
      });
    } catch (createErr) {
      console.warn('Nota: no se pudo ejecutar createIfNotExists en cleanId:', createErr);
    }

    try {
      await sanityClient.patch(cleanId).set(patchPayload).commit();
    } catch (e) {
      console.warn('No se pudo parchear cleanId:', e);
    }

    // Asegurar que el borrador (draftId) se cree o reemplace con todos los datos
    // para que Sanity Studio en el navegador del usuario actualice la vista inmediatamente en vivo
    try {
      const updatedDoc = await sanityClient.getDocument(cleanId);
      if (updatedDoc) {
        const draftDoc = {
          ...updatedDoc,
          _id: draftId,
        };
        delete (draftDoc as any)._rev;
        delete (draftDoc as any)._updatedAt;
        delete (draftDoc as any)._createdAt;
        await sanityClient.createOrReplace(draftDoc);
      }
    } catch (draftErr) {
      console.warn('Nota creando/actualizando draftId:', draftErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: formattedPosts.length,
        bio: profile.biography,
        followers: profile.followersCount,
      }),
      { status: 200, headers: cors }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error en sync-instagram:', errorMsg);
    return new Response(JSON.stringify({ success: false, error: errorMsg }), {
      status: 500,
      headers: cors,
    });
  }
};
