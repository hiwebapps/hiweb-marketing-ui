/**
 * Fetch Webflow /portafolio index + detail pages and write UTF-8 JSON.
 */
import fs from 'node:fs';
import path from 'node:path';

const INDEX = 'https://www.hiwebmarketing.com/portafolio';
const OUT = path.join(process.cwd(), 'scripts/sanity/webflow-cases-raw.json');

function decode(html: string) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function strip(html: string) {
  return decode(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function meta(html: string, name: string) {
  const byName =
    html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1] ??
    html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'))?.[1];
  const byProp =
    html.match(new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1] ??
    html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${name}["']`, 'i'))?.[1];
  return decode(byName || byProp || '').trim();
}

function hrefs(html: string) {
  const found = new Set<string>();
  for (const match of html.matchAll(/href=["'](https?:\/\/www\.hiwebmarketing\.com)?\/portafolio\/([a-z0-9-]+)\/?["']/gi)) {
    found.add(match[2].toLowerCase());
  }
  return [...found];
}

function extract(html: string, slug: string) {
  const title = strip(html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '');
  const desc = meta(html, 'description');
  const ogImage = meta(html, 'og:image');
  const h1 = strip(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
  const images = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)]
    .map((m) => m[1])
    .filter((src) => /cdn\.prod\.website-files|uploads-ssl\.webflow|hiwebmarketing/i.test(src))
    .slice(0, 12);

  const headings = [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => strip(m[1]));
  const metrics: { value: string; label: string; detail: string }[] = [];
  const metricHits = [
    ...html.matchAll(
      />([+\-]?[\d.,]+\s*%?|<span[^>]*>[+\-]?[\d.,]+\s*%?<\/span>)\s*<\/[^>]+>\s*(?:<[^>]+>\s*){0,6}<h[23][^>]*>([\s\S]*?)<\/h[23]>\s*(?:<p[^>]*>([\s\S]*?)<\/p>)?/gi,
    ),
  ];
  for (const hit of metricHits) {
    const value = strip(hit[1]);
    const label = strip(hit[2]);
    const detail = hit[3] ? strip(hit[3]) : '';
    if (!/^[+\-]?\d/.test(value)) continue;
    if (label.length < 2 || label.length > 80) continue;
    metrics.push({ value, label, detail });
  }

  const quotes: { quote: string; name: string; role: string }[] = [];
  const testimonialHtml =
    html.split(/Nuestros clientes hablan por nosotros/i)[1]?.split(/Te ayudamos a escalar/i)[0] ?? '';
  const slides = [...testimonialHtml.matchAll(/class="[^"]*testimonial-slide-item[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)];
  const slideTexts = (slides.length ? slides.map((m) => strip(m[1])) : [strip(testimonialHtml)]).filter(
    (text) => text.length > 40 && !/^resultados comprobados/i.test(text),
  );
  for (const text of slideTexts.slice(0, 4)) {
    quotes.push({ quote: text.slice(0, 500), name: '', role: '' });
  }

  const cover =
    images.find((src) => /65d62528ef033d56ee0665d1/.test(src) && !/placeholder/i.test(src)) ??
    images.find((src) => !/isotipo|placeholder|Frame%/i.test(src)) ??
    '';

  const retoMatch = strip(html).match(
    /(?:buscaba|llegó a Hiweb)[\s\S]{40,500}?(?:\.|$)/i,
  );

  const skipHead = new Set([
    '¿qué buscaba el cliente?',
    'marketing digital que sí genera resultados',
    'nuestros resultados dicen más que mil palabras.',
    'hiweb te espera',
    'construyamos tu historia de éxito',
    'galería',
    'nuestros clientes hablan por nosotros.',
    'te ayudamos a escalar, con servicios que sí funcionan',
    'resultados comprobados, proyectos que resaltan.',
  ]);
  const metricLabels = new Set(metrics.map((item) => item.label.toLowerCase()));
  const fases: { title: string; description: string }[] = [];
  for (const match of html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*(?:<p[^>]*>([\s\S]*?)<\/p>)?/gi)) {
    const faseTitle = strip(match[1]);
    const faseDesc = match[2] ? strip(match[2]) : '';
    if (!faseTitle || skipHead.has(faseTitle.toLowerCase()) || metricLabels.has(faseTitle.toLowerCase())) continue;
    if (faseDesc.length < 40) continue;
    fases.push({ title: faseTitle, description: faseDesc });
  }

  return {
    slug,
    title,
    desc,
    ogImage,
    h1,
    cover,
    headings: headings.slice(0, 20),
    metrics,
    quotes: quotes.slice(0, 4),
    fases: fases.slice(0, 4),
    reto: retoMatch?.[0]?.trim() ?? '',
    images,
    textSample: strip(html).slice(0, 2200),
  };
}

async function fetchHtml(url: string) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 Hiweb-scrape' } });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.text();
}

async function main() {
  const indexHtml = await fetchHtml(INDEX);
  const slugs = hrefs(indexHtml);
  console.error(`Index slugs: ${slugs.join(', ') || '(none)'}`);
  const fallback = [
    'avant-rent-a-car',
    'diazar',
    'happy-store',
    'peninsula-project',
    'el-secreto',
    'restaura',
    'eagle-superabrasives',
    'gaios',
    'zapateria-la-peninsula',
    'enfoque-21',
    'pass-your-toefl',
    'residenciales-merida',
    'paulos-pizza',
    'industrial-basanlo',
  ];
  const unique = [...new Set([...slugs, ...fallback])];
  const pages = [];
  for (const slug of unique) {
    const url = `https://www.hiwebmarketing.com/portafolio/${slug}`;
    try {
      const html = await fetchHtml(url);
      pages.push(extract(html, slug));
      console.error(`OK ${slug}`);
    } catch (error) {
      console.error(`FAIL ${slug}: ${(error as Error).message}`);
    }
  }
  const payload = {
    indexTitle: strip(indexHtml.match(/<title>([^<]+)/i)?.[1] ?? ''),
    indexDesc: meta(indexHtml, 'description'),
    pages,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2), 'utf8');
  console.error(`Wrote ${OUT} (${pages.length} pages)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
