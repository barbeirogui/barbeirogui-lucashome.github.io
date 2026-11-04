import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHtmlMetaTags, generateVtexLegacyHtml } from './seoHtmlValidator';

test('parseHtmlMetaTags correctly parses complete VTEX CMS Legacy HTML with 200 OK', () => {
  const url = 'https://www.lojamoda.com.br/calcados/tenis-running-pro/p';
  const html = generateVtexLegacyHtml({
    url,
    type: 'product',
    name: 'Tênis Running Pro Masculino',
    domain: 'www.lojamoda.com.br',
  });

  const result = parseHtmlMetaTags({
    html,
    url,
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 45,
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.statusText, 'OK');
  assert.equal(result.metaTags.title.present, true);
  assert.equal(result.metaTags.title.status, 'passed');
  assert.equal(result.metaTags.description.present, true);
  assert.equal(result.metaTags.description.status, 'passed');
  assert.equal(result.metaTags.canonical.present, true);
  assert.equal(result.metaTags.canonical.matchesUrl, true);
  assert.equal(result.metaTags.robots.present, true);
  assert.equal(result.metaTags.robots.isIndexable, true);
  assert.equal(result.metaTags.h1.present, true);
  assert.equal(result.metaTags.openGraph.present, true);
  assert.equal(result.metaTags.twitterCard.present, true);
  assert.equal(result.metaTags.schemaJsonLd.present, true);
  assert.equal(result.metaTags.schemaJsonLd.schemaType, 'Product');
  assert.equal(result.metaTags.vtexLegacyMarkers.hasSkuJson, true);
  assert.ok(result.score >= 90, `Expected score >= 90, got ${result.score}`);
});

test('parseHtmlMetaTags detects missing meta tags and penalizes score', () => {
  const url = 'https://www.lojamoda.com.br/produto-incompleto/p';
  const incompleteHtml = `
    <html>
      <head>
        <title>Curto</title>
      </head>
      <body>
        <p>Sem H1 e sem description</p>
      </body>
    </html>
  `;

  const result = parseHtmlMetaTags({
    html: incompleteHtml,
    url,
    statusCode: 200,
  });

  assert.equal(result.metaTags.title.status, 'warning'); // too short
  assert.equal(result.metaTags.description.present, false);
  assert.equal(result.metaTags.description.status, 'failed');
  assert.equal(result.metaTags.canonical.present, false);
  assert.equal(result.metaTags.canonical.status, 'failed');
  assert.equal(result.metaTags.h1.present, false);
  assert.equal(result.metaTags.h1.status, 'failed');
  assert.ok(result.score < 60, `Expected score < 60, got ${result.score}`);
  assert.ok(result.recommendations.length > 0);
});

test('parseHtmlMetaTags flags noindex robots tag as critical failure', () => {
  const url = 'https://www.lojamoda.com.br/pagina-bloqueada';
  const noindexHtml = `
    <html>
      <head>
        <title>Página de Teste Bloqueada - Loja VTEX</title>
        <meta name="description" content="Descrição completa da página com caracteres suficientes para passar no teste de SEO." />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body><h1>Título</h1></body>
    </html>
  `;

  const result = parseHtmlMetaTags({
    html: noindexHtml,
    url,
    statusCode: 200,
  });

  assert.equal(result.metaTags.robots.present, true);
  assert.equal(result.metaTags.robots.isIndexable, false);
  assert.equal(result.metaTags.robots.status, 'failed');
  assert.match(result.metaTags.robots.detail, /noindex/i);
});

test('parseHtmlMetaTags checks canonical mismatch when URL differs', () => {
  const url = 'https://www.lojamoda.com.br/calcados/tenis-pro/p/';
  const html = `
    <html>
      <head>
        <title>Tênis Pro - Moda e Acessórios Esportivos VTEX</title>
        <meta name="description" content="Compre online com segurança e entrega para todo o Brasil. Confira nosso catálogo!" />
        <link rel="canonical" href="https://www.lojamoda.com.br/calcados/tenis-pro/p" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body><h1>Tênis Pro</h1></body>
    </html>
  `;

  const result = parseHtmlMetaTags({
    html,
    url, // with trailing slash
    statusCode: 200,
  });

  assert.equal(result.metaTags.canonical.present, true);
  // Requested had trailing slash, canonical doesn't
  assert.equal(result.metaTags.canonical.matchesUrl, true); // normalized comparison matches
});
