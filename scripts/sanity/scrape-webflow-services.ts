import fs from 'node:fs';
import path from 'node:path';
const PAGES = [
  ['seo', 'https://www.hiwebmarketing.com/servicios/agencia-posicionamiento-seo'],
  ['google-ads', 'https://www.hiwebmarketing.com/servicios/promocion-google-ads'],
  ['meta-ads', 'https://www.hiwebmarketing.com/servicios/meta-ads-publicidad-redes-sociales'],
  ['redes-sociales', 'https://www.hiwebmarketing.com/servicios/agencia-redes-sociales'],
  ['desarrollo-web', 'https://www.hiwebmarketing.com/servicios/diseno-desarrollo-web-mexico'],
  ['crm-automatizacion', 'https://www.hiwebmarketing.com/servicios/crm-automatizacion-empresas'],
  ['branding', 'https://www.hiwebmarketing.com/servicios/branding'],
  ['ia-marketing', 'https://www.hiwebmarketing.com/servicios/ia-marketing'],
  ['community-manager', 'https://www.hiwebmarketing.com/servicios/community-manager'],
] as const;

function decode(html: string) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function strip(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extract(html: string, slug: string) {
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? '';
  const desc =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1] ??
    '';
  const faqs: { question: string; answer: string }[] = [];
  const seen = new Set<string>();
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of scripts) {
    const raw = decode(match[1].trim());
    try {
      const data = JSON.parse(raw) as {
        '@type'?: string;
        mainEntity?: Array<{ name?: string; acceptedAnswer?: { text?: string } }>;
      };
      if (data['@type'] === 'FAQPage' && Array.isArray(data.mainEntity)) {
        for (const item of data.mainEntity) {
          const question = item.name?.trim();
          const answer = item.acceptedAnswer?.text ? strip(item.acceptedAnswer.text) : '';
          if (question && answer && !seen.has(question)) {
            seen.add(question);
            faqs.push({ question, answer });
          }
        }
      }
    } catch {
      // ignore malformed blocks
    }
  }

  const questions = [...html.matchAll(/class="[^"]*data-faq-question[^"]*"[^>]*>([\s\S]*?)<\//gi)].map((m) =>
    strip(m[1]),
  );
  const answers = [...html.matchAll(/class="[^"]*data-faq-answer[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)].map((m) =>
    strip(m[1]),
  );
  const n = Math.min(questions.length, answers.length);
  for (let i = 0; i < n; i += 1) {
    const question = questions[i];
    const answer = answers[i];
    if (question.startsWith('¿') && answer.length > 20 && !seen.has(question)) {
      seen.add(question);
      faqs.push({ question, answer });
    }
  }

  return { slug, title, desc, faqCount: faqs.length, faqs };
}

async function main() {
  const out: ReturnType<typeof extract>[] = [];
  for (const [slug, url] of PAGES) {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 HiwebBot' } });
    const html = await res.text();
    const data = extract(html, slug);
    console.error(`${slug}: ${res.status} faqs=${data.faqCount} title=${data.title}`);
    out.push(data);
  }
  const outPath = path.join(process.cwd(), 'scripts/sanity/webflow-services-raw.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.error(`Wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
