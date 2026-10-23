import { createClient } from '@sanity/client';

const apifyToken = process.env.APIFY_API_TOKEN;
const sanityToken = process.env.SANITY_API_WRITE_TOKEN;

if (!apifyToken || !sanityToken) {
  console.error('Error: Faltan tokens APIFY_API_TOKEN o SANITY_API_WRITE_TOKEN');
  process.exit(1);
}

const sanityClient = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'fxardjr1',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'web-2026',
  token: sanityToken,
  apiVersion: '2024-01-01',
  useCdn: false,
});

function formatStat(num: number | null | undefined): string {
  if (num == null || isNaN(num) || num < 0) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(num);
}

const topPostsMap: Record<string, string> = {
  'el.secretomx': 'https://www.instagram.com/p/DQrf-qyjUpK/',
  'happy.store.mx': 'https://www.instagram.com/p/DU7Al8YDoHO/',
  'diazarcontrol': 'https://www.instagram.com/p/DaoG3IxB2Ch/',
  'peninsulaproject.mx': 'https://www.instagram.com/p/DM_qEU8O14w/',
  'enfoque21fotografia': 'https://www.instagram.com/p/DUtQthjifGs/',
  'residencialesmerida': 'https://www.instagram.com/p/Ddw_mSNq1O0/',
  'paulospizzamid': 'https://www.instagram.com/p/DaWZ8jQBDKc/',
  'gaios.mx': 'https://www.instagram.com/p/DSdcHr3DxP-/',
  'zapaterialapeninsula': 'https://www.instagram.com/p/Dexm2UBE4VN/',
  'restauralabdental': 'https://www.instagram.com/p/DJ-H8FdhCyJ/',
};

async function syncTopPosts() {
  const directUrls = Object.values(topPostsMap);
  console.log(`Fetching details for ${directUrls.length} top posts via Apify...`);

  const apifyRes = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?timeout=120`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apifyToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        directUrls,
        resultsType: 'posts',
      }),
    }
  );

  if (!apifyRes.ok) {
    throw new Error(`Apify error: ${await apifyRes.text()}`);
  }

  const scrapedPosts = (await apifyRes.json()) as Array<any>;
  console.log(`Scraped ${scrapedPosts.length} posts from Apify.`);

  for (const [handle, targetUrl] of Object.entries(topPostsMap)) {
    console.log(`\n==================================================`);
    console.log(`Processing top post for @${handle} (${targetUrl})`);

    const p = scrapedPosts.find((item) => {
      if (!item.url) return false;
      const normalize = (u: string) => u.split('?')[0].replace(/\/+$/, '');
      return normalize(item.url) === normalize(targetUrl);
    });

    if (!p) {
      console.warn(`Could not find scraped data for @${handle} at ${targetUrl}`);
      continue;
    }

    const plays = Number(p.videoPlayCount || p.videoViewCount || p.playCount || 0);
    const likes = Number(p.likesCount || 0);
    const comments = Number(p.commentsCount || 0);

    const stats = {
      views: formatStat(plays),
      likes: formatStat(likes),
      comments: formatStat(comments),
    };

    console.log(`  Metrics: plays=${plays} (${stats.views}), likes=${likes}, comments=${comments}`);

    // Fetch existing brand doc from Sanity (both draft and published)
    const brandDocs = await sanityClient.fetch(
      `*[_type == 'socialBrand' && handle == $handle]`,
      { handle }
    );

    if (!brandDocs || brandDocs.length === 0) {
      console.warn(`No socialBrand found in Sanity for handle @${handle}`);
      continue;
    }

    // Upload poster or image asset
    let posterAssetId: string | undefined;
    if (p.displayUrl) {
      try {
        const imgRes = await fetch(p.displayUrl);
        if (imgRes.ok) {
          const buf = Buffer.from(await imgRes.arrayBuffer());
          const asset = await sanityClient.assets.upload('image', buf, {
            filename: `${handle}-top-post.jpg`,
          });
          posterAssetId = asset._id;
          console.log(`  Uploaded image asset: ${posterAssetId}`);
        }
      } catch (err) {
        console.warn(`  Failed to upload image asset for @${handle}:`, err);
      }
    }

    const kind = p.type === 'Video' || Boolean(p.videoUrl) ? 'reel' : 'photo';
    const newTopPost = {
      _key: `top-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      _type: 'instagramPhonePost',
      kind,
      showInService: true,
      caption: p.caption || '',
      poster: posterAssetId
        ? { _type: 'image', asset: { _type: 'reference', _ref: posterAssetId } }
        : undefined,
      image: posterAssetId && kind !== 'reel'
        ? { _type: 'image', asset: { _type: 'reference', _ref: posterAssetId } }
        : undefined,
      videoUrl: p.videoUrl || undefined,
      stats,
    };

    for (const doc of brandDocs) {
      const existingPosts = Array.isArray(doc.posts) ? doc.posts : [];
      // Set showInService: false on all existing posts
      const updatedExisting = existingPosts.map((ep: any) => ({
        ...ep,
        showInService: false,
      }));

      // Prepend or add new top post as first post with showInService: true
      const finalPosts = [newTopPost, ...updatedExisting];

      await sanityClient.patch(doc._id).set({ posts: finalPosts }).commit();
      console.log(`  Updated Sanity doc ${doc._id} with new top post!`);
    }
  }

  console.log(`\nAll 10 brands updated successfully!`);
}

syncTopPosts().catch(console.error);
