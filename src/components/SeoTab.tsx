import React, { useState } from 'react';
import {
  Globe,
  Gauge,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  FileCode,
} from 'lucide-react';
import { seoIssuesData } from '../data/mockStoreData';

export const SeoTab: React.FC = () => {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [selectedIssueCategory, setSelectedIssueCategory] = useState<'all' | 'critical' | 'warning'>('all');

  const filteredIssues = seoIssuesData.filter((i) => {
    if (selectedIssueCategory === 'all') return true;
    return i.type === selectedIssueCategory;
  });

  const sampleVtexSchema = `<script>
/**
 * Injeção de Schema.org Product para VTEX CMS Legacy (Portal)
 * Adicionar no Subtemplate de PDP (CMS > Layout > HTML Templates > Subtemplates)
 */
$(document).ready(function() {
  if (typeof skuJson !== 'undefined' && skuJson.skus && skuJson.skus.length > 0) {
    var primarySku = skuJson.skus[0];
    var priceFormatted = (primarySku.bestPrice / 100).toFixed(2);
    
    var productLdJson = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": skuJson.name,
      "image": [primarySku.image],
      "description": $('meta[name="description"]').attr('content') || skuJson.name,
      "sku": String(primarySku.id),
      "mpn": String(skuJson.productId),
      "brand": {
        "@type": "Brand",
        "name": $("meta[name='brand']").attr("content") || "Loja Oficial"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "128",
        "bestRating": "5"
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href.split('?')[0],
        "priceCurrency": "BRL",
        "price": priceFormatted,
        "priceValidUntil": "2027-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": primarySku.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Loja Moda Brasil"
        }
      }
    };

    var scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.text = JSON.stringify(productLdJson, null, 2);
    document.head.appendChild(scriptTag);
  }
});
</script>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2 text-xs text-pink-400 font-medium">
          <Globe className="w-3.5 h-3.5" />
          <span>SEO TÉCNICO & CORE WEB VITALS (VTEX CMS LEGACY)</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Otimização de Rastreabilidade, Velocidade & Schema no VTEX CMS Legacy
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Auditoria de subtemplates HTML do Portal, scripts em /arquivos/, redirecionamentos 301 no Gerenciador de URL
          e injeção de dados estruturados Schema.org via objeto nativo skuJson.
        </p>
      </div>

      {/* Core Web Vitals Panel */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Gauge className="w-4 h-4 text-pink-400" />
            <span>Métricas de Experiência na Página (Core Web Vitals - VTEX CMS Legacy)</span>
          </h2>
          <span className="text-xs text-slate-400">Origem: Google CrUX / PageSpeed Insights</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* LCP */}
          <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">LCP (Renderização Maior Conteúdo)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Crítico
              </span>
            </div>
            <div className="text-3xl font-bold text-white font-mono-numbers mt-2">
              3.4s
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Meta Google: &lt; 2.5s. Afetado por banners descompactados no carrossel VTEX.
            </p>
          </div>

          {/* INP */}
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">INP (Interação para Próx. Pintura)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Bom
              </span>
            </div>
            <div className="text-3xl font-bold text-white font-mono-numbers mt-2">
              88ms
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Meta Google: &lt; 200ms. Excelente resposta no minicart e filtros de busca.
            </p>
          </div>

          {/* CLS */}
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">CLS (Estabilidade Visual)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Bom
              </span>
            </div>
            <div className="text-3xl font-bold text-white font-mono-numbers mt-2">
              0.04
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Meta Google: &lt; 0.1. Dimensões reservadas para imagens evitam saltos.
            </p>
          </div>

          {/* TTFB */}
          <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">TTFB (Resposta do Servidor VTEX)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Atenção
              </span>
            </div>
            <div className="text-3xl font-bold text-white font-mono-numbers mt-2">
              740ms
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Meta: &lt; 600ms. Otimizar chamadas GraphQL no Store Framework.
            </p>
          </div>
        </div>
      </div>

      {/* Issues List with Filter Tabs */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">
              Problemas de SEO Técnico & Indexabilidade Detectados
            </h2>
            <p className="text-xs text-slate-400">
              Falhas que afetam o posicionamento orgânico e gastam Crawl Budget no VTEX CMS.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedIssueCategory('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedIssueCategory === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({seoIssuesData.length})
            </button>
            <button
              onClick={() => setSelectedIssueCategory('critical')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedIssueCategory === 'critical'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Críticos (2)
            </button>
            <button
              onClick={() => setSelectedIssueCategory('warning')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedIssueCategory === 'warning'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Avisos (2)
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`p-4 rounded-xl border bg-slate-950/70 space-y-2 ${
                issue.type === 'critical'
                  ? 'border-rose-500/30'
                  : issue.type === 'warning'
                  ? 'border-amber-500/30'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {issue.type === 'critical' ? (
                    <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : issue.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <h3 className="text-sm font-semibold text-white">{issue.title}</h3>
                </div>
                <span className="text-[11px] font-mono-numbers px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {issue.module}
                </span>
              </div>

              <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                <span>URL Afetada: <code className="text-pink-400 font-mono text-[11px]">{issue.url}</code></span>
              </div>

              <p className="text-xs text-slate-300">
                <strong className="text-slate-200">Impacto:</strong> {issue.impact}
              </p>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-emerald-300 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
                <span>
                  <strong>Como Corrigir na VTEX:</strong> {issue.remedy}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schema.org Product Rich Snippets Validator */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-pink-400" />
              <span>Gerador de Script JSON-LD para Subtemplate de PDP no CMS Legacy (skuJson)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Copie o código abaixo e adicione ao seu Subtemplate de Produto (CMS &gt; Layout &gt; HTML Templates &gt; Subtemplates) para ativar Rich Snippets imediatos no Google consumindo o objeto skuJson nativo da VTEX.
            </p>
          </div>

          <button
            onClick={() => copyToClipboard(sampleVtexSchema)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors shrink-0"
          >
            {copiedSchema ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar JSON-LD</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-[11px] font-mono text-slate-300 max-h-64 leading-relaxed">
          {sampleVtexSchema}
        </pre>
      </div>
    </div>
  );
};
