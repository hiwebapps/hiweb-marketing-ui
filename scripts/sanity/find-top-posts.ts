const apifyToken = process.env.APIFY_API_TOKEN;

const handles = [
  'happy.store.mx',
  'paulospizzamid',
  'residencialesmerida',
  'diazarcontrol',
  'el.secretomx',
  'enfoque21fotografia',
  'gaios.mx',
  'peninsulaproject.mx',
  'restauralabdental',
  'zapaterialapeninsula'
];

function parseStat(v) {
  if (!v) return 0;
  const s = String(v).trim().toLowerCase().replace(/,/g, '');
  if (s.endsWith('m')) return parseFloat(s) * 1000000;
  if (s.endsWith('k')) return parseFloat(s) * 1000;
  return parseFloat(s) || 0;
}

async function checkAccount(username) {
  console.log(`\n=================== Checking @${username} ===================`);
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?timeout=120`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apifyToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          directUrls: [`https://www.instagram.com/${username}/`],
          resultsType: 'posts',
          resultsLimit: 30,
        }),
      }
    );
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) {
      console.log(`No posts found for @${username}`);
      return;
    }
    console.log(`Fetched ${posts.length} posts for @${username}`);
    const ranked = posts.map(p => {
      const views = parseStat(p.videoViewCount || p.playCount);
      const likes = parseStat(p.likesCount);
      const comments = parseStat(p.commentsCount);
      const score = views + likes * 5 + comments * 10;
      return {
        url: p.url,
        type: p.type,
        views,
        likes,
        comments,
        score,
        caption: p.caption?.slice(0, 45)
      };
    }).sort((a, b) => b.score - a.score);

    console.log('Top 3 posts:');
    ranked.slice(0, 3).forEach((r, idx) => {
      console.log(`  #${idx + 1}: ${r.url} | type=${r.type} | views=${r.views} | likes=${r.likes} | comments=${r.comments} | score=${r.score} | cap="${r.caption}"`);
    });
  } catch (err) {
    console.error(`Error for @${username}:`, err);
  }
}

async function main() {
  for (const h of handles) {
    await checkAccount(h);
  }
}

main().catch(console.error);
