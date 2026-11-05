/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SeoHttpTestResult, SeoMetaTagItem } from '../types/index.ts';

export interface SeoExtractorInput {
  html: string;
  url: string;
  statusCode?: number;
  statusText?: string;
  latencyMs?: number;
  isLiveFetch?: boolean;
}

/**
 * Pure logic function that parses HTML string to validate HTTP status and essential SEO meta tags.
 * Designed for VTEX CMS Legacy (Portal) architecture.
 */
export function parseHtmlMetaTags({
  html,
  url,
  statusCode = 200,
  statusText = 'OK',
  latencyMs = 58,
  isLiveFetch = false,
}: SeoExtractorInput): SeoHttpTestResult {
  const testedAt = new Date().toLocaleString('pt-BR');

  // Extract head section
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : html;

  // Title tag
  const titleMatch = headContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].trim() : '';
  const titleLength = titleText.length;
  let titleStatus: SeoMetaTagItem['status'] = 'passed';
  let titleDetail = `Tag <title> detectada com ${titleLength} caracteres.`;

  if (!titleMatch || titleLength === 0) {
    titleStatus = 'failed';
    titleDetail = 'Tag <title> ausente ou vazia no <head>. Crítico para indexação e CTR.';
  } else if (titleLength < 25) {
    titleStatus = 'warning';
    titleDetail = `Título curto (${titleLength} caracteres). Recomendado entre 30 e 65 caracteres para melhor relevância no Google.`;
  } else if (titleLength > 70) {
    titleStatus = 'warning';
    titleDetail = `Título extenso (${titleLength} caracteres). O Google poderá truncar após ~60-65 caracteres na SERP.`;
  }

  // Meta description
  const descMatch =
    headContent.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    headContent.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const descText = descMatch ? descMatch[1].trim() : '';
  const descLength = descText.length;
  let descStatus: SeoMetaTagItem['status'] = 'passed';
  let descDetail = `Meta description presente com ${descLength} caracteres.`;

  if (!descMatch || descLength === 0) {
    descStatus = 'failed';
    descDetail = 'Meta description ausente. O Google gerará snippets automáticos menos atrativos.';
  } else if (descLength < 80) {
    descStatus = 'warning';
    descDetail = `Meta description curta (${descLength} caracteres). O ideal para VTEX é entre 120 e 160 caracteres.`;
  } else if (descLength > 175) {
    descStatus = 'warning';
    descDetail = `Meta description longa (${descLength} caracteres). Será cortada nos resultados de busca.`;
  }

  // Canonical tag
  const canonicalMatch =
    headContent.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i) ||
    headContent.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const canonicalHref = canonicalMatch ? canonicalMatch[1].trim() : '';
  
  // Normalization for matching
  const cleanRequested = url.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '').toLowerCase();
  const cleanCanonical = canonicalHref.replace(/^https?:\/\//i, '').replace(/\/$/, '').toLowerCase();
  const canonicalMatches = cleanCanonical === cleanRequested;

  let canonicalStatus: SeoMetaTagItem['status'] = 'passed';
  let canonicalDetail = `Tag canonical aponta corretamente para ${canonicalHref}.`;

  if (!canonicalMatch || !canonicalHref) {
    canonicalStatus = 'failed';
    canonicalDetail = 'Tag <link rel="canonical"> não encontrada. Risco de conteúdo duplicado no Portal VTEX.';
  } else if (!canonicalMatches) {
    canonicalStatus = 'warning';
    canonicalDetail = `Tag canonical aponta para URL diferente (${canonicalHref}). Verifique se é proposital para consolidação.`;
  }

  // Robots
  const robotsMatch =
    headContent.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    headContent.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']robots["'][^>]*>/i);
  const robotsContent = robotsMatch ? robotsMatch[1].trim().toLowerCase() : 'index, follow';
  const isNoindex = robotsContent.includes('noindex');
  let robotsStatus: SeoMetaTagItem['status'] = 'passed';
  let robotsDetail = `Meta robots configurado como "${robotsContent}". Página indexável.`;

  if (isNoindex) {
    robotsStatus = 'failed';
    robotsDetail = `ALERTA: A tag contém "noindex". A página NÃO será indexada pelo Google ou Bing!`;
  }

  // Viewport
  const viewportMatch = headContent.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const viewportContent = viewportMatch ? viewportMatch[1].trim() : '';
  let viewportStatus: SeoMetaTagItem['status'] = 'passed';
  let viewportDetail = 'Tag viewport mobile configurada corretamente.';

  if (!viewportMatch) {
    viewportStatus = 'failed';
    viewportDetail = 'Tag <meta name="viewport"> ausente. A página não passará no teste Mobile-Friendly do Google.';
  }

  // H1 tag
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h1Count = h1Matches.length;
  const firstH1Text = h1Matches[0] ? h1Matches[0].replace(/<[^>]*>/g, '').trim() : '';
  let h1Status: SeoMetaTagItem['status'] = 'passed';
  let h1Detail = `H1 único detectado: "${firstH1Text.slice(0, 50)}${firstH1Text.length > 50 ? '...' : ''}".`;

  if (h1Count === 0) {
    h1Status = 'failed';
    h1Detail = 'Nenhuma tag <h1> encontrada no HTML. Essencial para hierarquia de conteúdo e SEO.';
  } else if (h1Count > 1) {
    h1Status = 'warning';
    h1Detail = `Detectadas ${h1Count} tags <h1> no código. Recomenda-se manter apenas 1 H1 principal por página.`;
  }

  // Open Graph
  const ogTitleMatch = headContent.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogDescMatch = headContent.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogImageMatch = headContent.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogUrlMatch = headContent.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["'][^>]*>/i);

  const hasOg = Boolean(ogTitleMatch && ogDescMatch && ogImageMatch);
  let ogStatus: SeoMetaTagItem['status'] = 'passed';
  let ogDetail = 'Meta tags OpenGraph (og:title, og:description, og:image) completas.';

  if (!ogTitleMatch && !ogImageMatch) {
    ogStatus = 'failed';
    ogDetail = 'Tags OpenGraph essenciais (og:title, og:image) ausentes para compartilhamento no WhatsApp e redes.';
  } else if (!hasOg) {
    ogStatus = 'warning';
    ogDetail = 'Algumas tags OpenGraph estão ausentes (og:image ou og:description).';
  }

  // Twitter Card
  const twitterCardMatch =
    headContent.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    headContent.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const twitterCardType = twitterCardMatch ? twitterCardMatch[1] : '';
  let twitterStatus: SeoMetaTagItem['status'] = 'passed';
  let twitterDetail = `Twitter Card configurado (${twitterCardType || 'summary_large_image'}).`;

  if (!twitterCardMatch) {
    twitterStatus = 'warning';
    twitterDetail = 'Tag twitter:card ausente. Adicione no subtemplate head.html do CMS Legacy.';
  }

  // Schema.org JSON-LD
  const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  let schemaType = '';
  let schemaSnippet = '';
  let schemaStatus: SeoMetaTagItem['status'] = 'passed';
  let schemaDetail = 'Dados estruturados Schema.org JSON-LD presentes.';

  if (jsonLdMatch) {
    schemaSnippet = jsonLdMatch[1].trim();
    try {
      const parsed = JSON.parse(schemaSnippet);
      schemaType = parsed['@type'] || (Array.isArray(parsed) ? parsed[0]?.['@type'] : 'Custom');
      schemaDetail = `Schema.org @type="${schemaType}" validado com sucesso. Habilita Rich Snippets no Google.`;
    } catch {
      schemaType = 'JSON Inválido';
      schemaStatus = 'warning';
      schemaDetail = 'Script ld+json encontrado, porém a formatação JSON possui erro de sintaxe.';
    }
  } else {
    schemaStatus = 'warning';
    schemaDetail = 'Nenhum script application/ld+json encontrado. Recomendado incluir Product/BreadcrumbList.';
  }

  // VTEX CMS Legacy Markers
  const hasSkuJson = html.includes('skuJson') || html.includes('vtexjs');
  const hasArquivosAsset = html.includes('/arquivos/');
  const isProductRoute = url.toLowerCase().includes('/p');
  let vtexStatus: SeoMetaTagItem['status'] = 'passed';
  let vtexDetail = 'Padrão VTEX CMS Legacy validado: controle de template e caminhos /arquivos/.';

  if (isProductRoute && !hasSkuJson) {
    vtexStatus = 'warning';
    vtexDetail = 'Página de produto (/p) sem objeto global skuJson detectado no HTML. Verifique controle <vtex.cmc:skuSelection />.';
  }

  // Calculate score
  let score = 100;
  if (statusCode !== 200) score -= 35;
  if (titleStatus === 'failed') score -= 15;
  else if (titleStatus === 'warning') score -= 5;

  if (descStatus === 'failed') score -= 12;
  else if (descStatus === 'warning') score -= 4;

  if (canonicalStatus === 'failed') score -= 12;
  else if (canonicalStatus === 'warning') score -= 4;

  if (robotsStatus === 'failed') score -= 25;
  if (h1Status === 'failed') score -= 10;
  else if (h1Status === 'warning') score -= 3;

  if (viewportStatus === 'failed') score -= 8;
  if (ogStatus === 'failed') score -= 6;
  if (schemaStatus !== 'passed') score -= 6;

  score = Math.max(10, Math.min(100, score));

  // Extract head snippet (up to 1200 chars formatted)
  const rawHeadSnippet = headMatch
    ? headMatch[1].trim().slice(0, 1800)
    : html.slice(0, 1800);

  // Recommendations based on audit
  const recommendations: string[] = [];
  if (statusCode !== 200) {
    recommendations.push(`A rota retornou HTTP ${statusCode}. Para o Google indexar a URL gerada, o servidor VTEX deve responder com 200 OK.`);
  }
  if (titleStatus !== 'passed') {
    recommendations.push(`Ajuste a tag <title> no template HTML do VTEX CMS Legacy (CMS > Layout > HTML Templates > Subtemplates > head).`);
  }
  if (descStatus !== 'passed') {
    recommendations.push(`Configure a meta description no cadastro de Produto/Categoria do Catálogo VTEX ou no subtemplate.`);
  }
  if (canonicalStatus !== 'passed') {
    recommendations.push(`Garanta que a tag <link rel="canonical"> aponte exatamente para a URL canônica sem trailing slash (/p).`);
  }
  if (!jsonLdMatch) {
    recommendations.push(`Insira dados estruturados Schema.org (Product, BreadcrumbList, WebSite) no subtemplate de rodapé ou cabeçalho.`);
  }
  if (isProductRoute && !hasSkuJson) {
    recommendations.push(`Adicione o controle nativo <vtex.cmc:skuSelection /> no template de Produto para garantir compatibilidade com vtexjs.`);
  }

  return {
    url,
    statusCode,
    statusText,
    latencyMs,
    testedAt,
    isLiveFetch,
    score,
    metaTags: {
      title: {
        present: Boolean(titleMatch && titleText.length > 0),
        value: titleText,
        length: titleLength,
        status: titleStatus,
        detail: titleDetail,
      },
      description: {
        present: Boolean(descMatch && descText.length > 0),
        value: descText,
        length: descLength,
        status: descStatus,
        detail: descDetail,
      },
      canonical: {
        present: Boolean(canonicalMatch && canonicalHref.length > 0),
        value: canonicalHref,
        length: canonicalHref.length,
        status: canonicalStatus,
        detail: canonicalDetail,
        matchesUrl: canonicalMatches,
      },
      robots: {
        present: Boolean(robotsMatch),
        value: robotsContent,
        status: robotsStatus,
        detail: robotsDetail,
        isIndexable: !isNoindex,
      },
      viewport: {
        present: Boolean(viewportMatch),
        value: viewportContent,
        status: viewportStatus,
        detail: viewportDetail,
      },
      h1: {
        present: h1Count > 0,
        value: firstH1Text,
        count: h1Count,
        status: h1Status,
        detail: h1Detail,
      },
      openGraph: {
        present: hasOg,
        value: ogTitleMatch ? ogTitleMatch[1] : '',
        ogTitle: ogTitleMatch ? ogTitleMatch[1] : undefined,
        ogImage: ogImageMatch ? ogImageMatch[1] : undefined,
        ogUrl: ogUrlMatch ? ogUrlMatch[1] : undefined,
        status: ogStatus,
        detail: ogDetail,
      },
      twitterCard: {
        present: Boolean(twitterCardMatch),
        value: twitterCardType,
        cardType: twitterCardType,
        status: twitterStatus,
        detail: twitterDetail,
      },
      schemaJsonLd: {
        present: Boolean(jsonLdMatch),
        value: schemaType,
        schemaType,
        snippet: schemaSnippet.slice(0, 300),
        status: schemaStatus,
        detail: schemaDetail,
      },
      vtexLegacyMarkers: {
        present: true,
        hasSkuJson,
        hasArquivosAsset,
        status: vtexStatus,
        detail: vtexDetail,
      },
    },
    rawHeadSnippet,
    recommendations,
  };
}

/**
 * Generates canonical VTEX CMS Legacy HTML template for simulation and tests.
 */
export function generateVtexLegacyHtml({
  url,
  type = 'product',
  name = 'Tênis Running Pro Masculino',
  domain = 'www.lojamoda.com.br',
}: {
  url: string;
  type?: 'product' | 'category' | 'department' | 'search_filter';
  name?: string;
  domain?: string;
}): string {
  const cleanUrl = url.startsWith('http') ? url : `https://${domain}${url.startsWith('/') ? '' : '/'}${url}`;
  const canonicalUrl = cleanUrl.replace('/p/', '/p').split('?')[0];

  return `<!DOCTYPE html>
<html lang="pt-br" xmlns:vtex="http://www.vtex.com.br/2009/vtex-common">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} - Compre Online | Moda & Calçados VTEX</title>
  <meta name="description" content="Garanta seu ${name} com as melhores condições de pagamento, frete ágil para todo o Brasil e troca fácil. Confira nossa coleção!" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  
  <!-- OpenGraph Social Meta Tags -->
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:type" content="${type === 'product' ? 'product' : 'website'}" />
  <meta property="og:title" content="${name} | Loja Oficial" />
  <meta property="og:description" content="Confira ${name} com desconto exclusivo no PIX e parcelamento sem juros." />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="Loja Moda VTEX" />
  <meta property="og:image" content="https://${domain}/arquivos/tenis-pro-cover-1200x630.jpg" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${name}" />
  <meta name="twitter:description" content="Compre online com entrega garantida." />
  <meta name="twitter:image" content="https://${domain}/arquivos/tenis-pro-cover-1200x630.jpg" />

  <!-- VTEX Legacy Asset Styles -->
  <link rel="stylesheet" href="/arquivos/vtex-legacy-theme.css" />

  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "${type === 'product' ? 'Product' : 'CollectionPage'}",
    "name": "${name}",
    "url": "${canonicalUrl}",
    "image": "https://${domain}/arquivos/tenis-pro-cover.jpg",
    "description": "${name} com tecnologia de ponta.",
    "brand": {
      "@type": "Brand",
      "name": "Marca Exclusiva"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BRL",
      "price": "299.90",
      "availability": "https://schema.org/InStock"
    }
  }
  </script>
</head>
<body class="vtex-portal-legacy">
  <div id="header-container">
    <div class="header-content">Header VTEX CMS Legacy</div>
  </div>
  <main class="main-content">
    <div class="product-header">
      <h1 class="product-name">${name}</h1>
    </div>
    <div class="product-details">
      <!-- VTEX CMS Legacy skuJson script -->
      <script type="text/javascript">
        var skuJson = {
          productId: 100249,
          name: "${name}",
          skus: [{ id: 10024901, name: "Tamanho 40", available: true }]
        };
      </script>
    </div>
  </main>
  <footer class="footer-portal">
    <script src="/arquivos/vtexjs.min.js"></script>
  </footer>
</body>
</html>`;
}
