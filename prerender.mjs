/**
 * prerender.mjs
 *
 * Runs AFTER `vite build`. Boots a local static server, opens every public
 * route in a headless Chromium browser, then saves the fully-rendered HTML
 * into subfolders inside `dist/` so search-engine bots and social-media
 * scrapers get real, pre-rendered content instead of a blank index.html.
 *
 * Usage (called automatically by `npm run build`):
 *   node prerender.mjs
 */

import puppeteer from 'puppeteer';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = resolve(__dirname, 'dist');
const PORT = 5173;

// ─── Routes to pre-render ────────────────────────────────────────────────────
const ROUTES = [
  '/',
  '/about',
  '/courses',
  '/services',
  '/students',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/refund-policy',
];

// ─── Tiny static file server (serves the `dist` folder) ─────────────────────
function getMimeType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const types = {
    html: 'text/html',
    js: 'application/javascript',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpeg',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    json: 'application/json',
    woff2: 'font/woff2',
    woff: 'font/woff',
    txt: 'text/plain',
    xml: 'application/xml',
    webp: 'image/webp',
  };
  return types[ext] || 'application/octet-stream';
}

function serveStatic(req, res) {
  let urlPath = req.url.split('?')[0];

  // Try the exact file first, then look for index.html
  let candidates = [
    join(DIST, urlPath),
    join(DIST, urlPath, 'index.html'),
    join(DIST, 'index.html'), // SPA fallback
  ];

  for (const filePath of candidates) {
    if (existsSync(filePath) && readFileSync(filePath)?.length) {
      try {
        const content = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
        res.end(content);
        return;
      } catch {}
    }
  }

  // Ultimate fallback — serve root index.html for SPA routing
  const fallback = join(DIST, 'index.html');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(readFileSync(fallback));
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const server = createServer(serveStatic);
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
  console.log(`\n🌐  Static server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log(`🚀  Pre-rendering ${ROUTES.length} routes...\n`);

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    const page = await browser.newPage();

    // Block unnecessary network calls to keep prerender fast
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'media', 'font'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Extra wait for React rendering + AOS init
      await new Promise((r) => setTimeout(r, 1500));

      let html = await page.content();

      // Inject a prerendered flag so the client knows to hydrateRoot
      html = html.replace('<html', '<html data-prerendered="true"');

      // Work out where to write the file
      const outDir =
        route === '/'
          ? DIST
          : join(DIST, ...route.slice(1).split('/'));

      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'index.html'), html, 'utf-8');

      console.log(`  ✅  ${route}`);
    } catch (err) {
      console.error(`  ❌  ${route}  →  ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  console.log('\n🎉  Pre-rendering complete!\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
