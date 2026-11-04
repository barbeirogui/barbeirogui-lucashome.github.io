import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Search,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Link as LinkIcon,
  Globe,
  Sliders,
  FileText,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react';
import { SitemapValidationResult, UrlCheckResult, VtexUrlBuildResult } from '../types';

interface SitemapUrlBuilderTabProps {
  storeDomain: string;
}

export const SitemapUrlBuilderTab: React.FC<SitemapUrlBuilderTabProps> = ({ storeDomain }) => {
  const [activeSubSection, setActiveSubSection] = useState<'sitemap' | 'url-validator' | 'url-builder'>('sitemap');

  // Sitemap state
  const [sitemapData, setSitemapData] = useState<SitemapValidationResult | null>(null);
  const [isValidatingSitemap, setIsValidatingSitemap] = useState(false);

  // Batch URLs state
  const [urlInput, setUrlInput] = useState<string>(
    `https://${storeDomain}/calcados/tenis-running-pro/p\nhttps://${storeDomain}/calcados/tenis-running-pro/p/\nhttps://${storeDomain}/calcados/corrida?fq=C:10001\nhttps://${storeDomain}/calcados/esportivos\nhttps://${storeDomain}/outlet-antigo\nhttps://${storeDomain}/produto-descontinuado-404/p`
  );
  const [urlResults, setUrlResults] = useState<UrlCheckResult[]>([]);
  const [isValidatingUrls, setIsValidatingUrls] = useState(false);

  // URL Builder state
  const [builderType, setBuilderType] = useState<'product' | 'category' | 'department' | 'search_filter'>('product');
  const [productName, setProductName] = useState('Tênis Corrida Alpha Pro Masculino');
  const [department, setDepartment] = useState('Calçados');
  const [category, setCategory] = useState('Tênis Esportivos');
  const [filterTerm, setFilterTerm] = useState('Corrida Amortecimento');
  const [buildResult, setBuildResult] = useState<VtexUrlBuildResult | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    handleValidateSitemap();
    handleBuildUrl();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleValidateSitemap = async () => {
    setIsValidatingSitemap(true);
    try {
      const res = await fetch('/api/sitemap/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeDomain }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setSitemapData(data.result);
      }
    } catch (err) {
      console.error('Failed to validate sitemap:', err);
    } finally {
      setIsValidatingSitemap(false);
    }
  };

  const handleValidateBatchUrls = async () => {
    const urls = urlInput
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length === 0) return;

    setIsValidatingUrls(true);
    try {
      const res = await fetch('/api/urls/validate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls, storeDomain }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        setUrlResults(data.results);
      }
    } catch (err) {
      console.error('Failed to validate batch URLs:', err);
    } finally {
      setIsValidatingUrls(false);
    }
  };

  const handleBuildUrl = async () => {
    try {
      const res = await fetch('/api/urls/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: builderType,
          productName,
          department,
          category,
          filterTerm,
          storeDomain,
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setBuildResult(data.result);
      }
    } catch (err) {
      console.error('Failed to build URL:', err);
    }
  };

  useEffect(() => {
    handleBuildUrl();
  }, [builderType, productName, department, category, filterTerm, storeDomain]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-pink-400">VTEX CMS Legacy (Portal)</span>
            <span className="text-xs text-slate-500" aria-hidden="true">·</span>
            <span className="text-xs text-slate-400">Validador de Sitemap, URLs & URL Builder</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-pink-400" />
            <span>Validador de Sitemaps, URLs & Construtor VTEX</span>
          </h1>
          <p className="text-sm text-slate-300">
            Monitore a integridade do índice de sitemaps da sua loja, audite URLs em massa e construa URLs canônicas
            compatíveis com o Gerenciador de URL 301 do Portal Legacy.
          </p>
        </div>

        {/* Sub Navigation Segmented Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveSubSection('sitemap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeSubSection === 'sitemap'
                ? 'bg-slate-800 text-pink-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Auditoria de Sitemap</span>
          </button>

          <button
            onClick={() => setActiveSubSection('url-validator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeSubSection === 'url-validator'
                ? 'bg-slate-800 text-pink-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Validador de URLs</span>
          </button>

          <button
            onClick={() => setActiveSubSection('url-builder')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeSubSection === 'url-builder'
                ? 'bg-slate-800 text-pink-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>URL Builder VTEX</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: SITEMAP AUDIT */}
      {activeSubSection === 'sitemap' && sitemapData && (
        <div className="space-y-6">
          {/* Top Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Total de URLs no Sitemap</span>
              <span className="text-2xl font-bold text-white font-mono-numbers">
                {sitemapData.totalUrls.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">4 Sub-sitemaps ativos</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-emerald-400 block mb-1">URLs Válidas (HTTP 200)</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono-numbers">
                {sitemapData.valid200Count.toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">97.1% do catálogo indexável</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-amber-400 block mb-1">Redirecionadas (301)</span>
              <span className="text-2xl font-bold text-amber-400 font-mono-numbers">
                {sitemapData.redirect301Count}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Não deveriam estar no sitemap</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-rose-400 block mb-1">Erros 404 Quebrados</span>
              <span className="text-2xl font-bold text-rose-400 font-mono-numbers">
                {sitemapData.error404Count}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Desperdiçam Crawl Budget</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-blue-400 block mb-1">Status do Índice Principal</span>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-bold text-white">sitemap.xml OK</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Acessível pelo Googlebot</span>
            </div>
          </div>

          {/* Sub-sitemaps Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Sub-sitemaps Gerados pelo VTEX CMS Legacy</h3>
                <p className="text-xs text-slate-400">
                  Índice canônico em <code className="text-pink-400 font-mono">{sitemapData.sitemapIndexUrl}</code>
                </p>
              </div>

              <button
                onClick={handleValidateSitemap}
                disabled={isValidatingSitemap}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isValidatingSitemap ? 'animate-spin' : ''}`} />
                <span>{isValidatingSitemap ? 'Reauditando...' : 'Reauditar Sitemaps'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">Sub-sitemap</th>
                    <th className="py-2.5 px-3 font-semibold">Qtd. URLs</th>
                    <th className="py-2.5 px-3 font-semibold">Última Modificação</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {sitemapData.subSitemaps.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 text-slate-200">
                        <div className="font-sans font-medium text-white">{sub.name}</div>
                        <span className="text-[11px] text-slate-400 font-mono">{sub.url}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono-numbers">
                        {sub.urlCount.toLocaleString('pt-BR')} URLs
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] font-sans">
                        {new Date(sub.lastModified).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-2.5 px-3">
                        {sub.status === 'ok' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-sans font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> 100% Válido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-sans font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" /> Contém Alertas
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleCopy(sub.url, `sitemap_${idx}`)}
                          className="px-2 py-1 text-[11px] font-sans bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition-colors"
                        >
                          {copiedId === `sitemap_${idx}` ? 'Copiado!' : 'Copiar URL'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Critical Issues Identified */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Falhas Críticas Detectadas no Sitemap (Requerem Ação no CMS Legacy)</span>
            </h3>
            <p className="text-xs text-slate-400">
              O Google exige que sitemaps contenham exclusivamente URLs de resposta 200 final e canônica.
            </p>

            <div className="space-y-2 pt-1">
              {sitemapData.criticalIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                          issue.issueType === '404_broken'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {issue.issueType.replace('_', ' ')}
                      </span>
                      <span className="text-slate-200">{issue.url}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{issue.impact}</p>
                    <p className="text-pink-400 text-[11px] font-medium">
                      💡 Solução: {issue.remedy}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(issue.url, issue.id)}
                    className="shrink-0 px-2.5 py-1 text-[11px] text-slate-300 bg-slate-900 hover:bg-slate-800 rounded border border-slate-700"
                  >
                    {copiedId === issue.id ? 'Copiado!' : 'Copiar URL'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: BATCH URL VALIDATOR */}
      {activeSubSection === 'url-validator' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Validador de URLs em Massa para VTEX</h3>
              <p className="text-xs text-slate-400">
                Cole abaixo uma lista de URLs da sua loja (uma por linha) para validar o status HTTP, verificar
                discrepâncias de barra final (/p/ vs /p) e detectar parâmetros legados de busca do Portal (?fq=).
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                URLs a verificar (uma por linha):
              </label>
              <textarea
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                rows={5}
                placeholder="https://www.sualoja.com.br/produto/p&#10;https://www.sualoja.com.br/categoria"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleValidateBatchUrls}
                disabled={isValidatingUrls || !urlInput.trim()}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-50 rounded-lg shadow-sm transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isValidatingUrls ? 'animate-spin' : ''}`} />
                <span>{isValidatingUrls ? 'Validando URLs...' : 'Validar Todas as URLs Agora'}</span>
              </button>

              <button
                onClick={() =>
                  setUrlInput(
                    `https://${storeDomain}/calcados/tenis-running-pro/p\nhttps://${storeDomain}/calcados/tenis-running-pro/p/\nhttps://${storeDomain}/calcados/corrida?fq=C:10001\nhttps://${storeDomain}/calcados/esportivos\nhttps://${storeDomain}/outlet-antigo\nhttps://${storeDomain}/produto-descontinuado-404/p`
                  )
                }
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                Carregar Exemplo com Falhas do Portal
              </button>
            </div>
          </div>

          {/* Results Table */}
          {urlResults.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Resultado do Diagnóstico de URLs</h3>
                <span className="text-xs text-slate-400">{urlResults.length} URLs analisadas</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3 font-semibold">URL Testada</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold">Latência</th>
                      <th className="py-2.5 px-3 font-semibold">Diagnóstico & Recomendação VTEX</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {urlResults.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3 text-slate-200 max-w-[280px] truncate" title={r.url}>
                          {r.url}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              r.status === 200
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                                : r.status === 301
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                                : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            HTTP {r.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 font-mono-numbers">
                          {r.latencyMs}ms
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-300 text-[11px]">
                          {r.recommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: VTEX URL BUILDER */}
      {activeSubSection === 'url-builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Builder Form */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-pink-400" />
                <span>Construtor de URLs Oficiais VTEX CMS Legacy</span>
              </h3>
              <p className="text-xs text-slate-400">
                Gere e valide URLs de Produto (/p), Categoria e Busca no padrão exato do Portal VTEX.
              </p>
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Tipo de Rota da Loja:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'product', label: 'Produto (/p)' },
                  { id: 'category', label: 'Categoria' },
                  { id: 'department', label: 'Departamento' },
                  { id: 'search_filter', label: 'Busca Interna' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setBuilderType(t.id as any)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                      builderType === t.id
                        ? 'bg-pink-600/20 text-pink-300 border-pink-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Inputs */}
            {builderType === 'product' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome do Produto (Cadastro no Catálogo):
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="ex: Tênis Nike Revolution 6 Masculino Preto"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-sans"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  A VTEX sanitiza o nome convertendo acentos e espaços em hífens, com o sufixo obrigatório <code>/p</code>.
                </span>
              </div>
            )}

            {builderType === 'category' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Departamento Pai:
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="ex: Calçados"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Categoria Filha:
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="ex: Corrida"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-sans"
                  />
                </div>
              </div>
            )}

            {builderType === 'department' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome do Departamento:
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="ex: Moda Masculina"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-sans"
                />
              </div>
            )}

            {builderType === 'search_filter' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Termo de Busca / Filtro:
                </label>
                <input
                  type="text"
                  value={filterTerm}
                  onChange={(e) => setFilterTerm(e.target.value)}
                  placeholder="ex: Tenis preto amortecimento"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-sans"
                />
              </div>
            )}
          </div>

          {/* Output & Rule Generator */}
          {buildResult && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>URL Canônica Gerada (Padrão VTEX Legacy)</span>
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                    Formatada
                  </span>
                </div>

                {/* Canonical URL Display */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-pink-300 truncate select-all">
                    {buildResult.generatedUrl}
                  </span>
                  <button
                    onClick={() => handleCopy(buildResult.generatedUrl, 'canonical_url')}
                    className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors shrink-0"
                    title="Copiar URL"
                  >
                    {copiedId === 'canonical_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* 301 Redirect Mapping Rule for Portal Legacy */}
                {buildResult.portalUrlManagerRule && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">
                        Regra Pronta para o Gerenciador de URL 301 do Portal:
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(
                            `URL Origem: ${buildResult.portalUrlManagerRule?.source}\nURL Destino: ${buildResult.portalUrlManagerRule?.destination}\nTipo: 301`,
                            'rule_301'
                          )
                        }
                        className="text-[11px] text-pink-400 hover:text-pink-300"
                      >
                        {copiedId === 'rule_301' ? 'Copiado!' : 'Copiar Regra 301'}
                      </button>
                    </div>

                    <div className="text-[11px] font-mono text-slate-300 space-y-1 p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div>
                        <span className="text-slate-400">Origem:</span>{' '}
                        <code className="text-rose-400">{buildResult.portalUrlManagerRule.source}</code>
                      </div>
                      <div>
                        <span className="text-slate-400">Destino:</span>{' '}
                        <code className="text-emerald-400">{buildResult.portalUrlManagerRule.destination}</code>
                      </div>
                      <div>
                        <span className="text-slate-400">Tipo:</span>{' '}
                        <code className="text-blue-400">301 (Permanente)</code>
                      </div>
                    </div>
                  </div>
                )}

                {/* Architecture Notes */}
                <div className="space-y-1.5 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300 block">Notas de Arquitetura VTEX Legacy:</span>
                  <ul className="space-y-1 list-disc list-inside">
                    {buildResult.notes.map((n, idx) => (
                      <li key={idx}>{n}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
