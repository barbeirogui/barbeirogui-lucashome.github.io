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
  Play,
  CheckCircle2,
  AlertCircle,
  Code2,
  ChevronDown,
  ChevronUp,
  Zap,
  Tag,
  Share2,
  Eye,
  Sparkles,
} from 'lucide-react';
import { SitemapValidationResult, UrlCheckResult, VtexUrlBuildResult, SeoHttpTestResult } from '../types';

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

  // HTTP GET Test & SEO Meta Tags state
  const [seoTestResult, setSeoTestResult] = useState<SeoHttpTestResult | null>(null);
  const [isTestingHttp, setIsTestingHttp] = useState(false);
  const [customTestUrl, setCustomTestUrl] = useState('');
  const [showRawHeadCode, setShowRawHeadCode] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

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

  const handleRunHttpTest = async (targetUrl?: string) => {
    const url = targetUrl || customTestUrl || buildResult?.generatedUrl;
    if (!url) return;

    setIsTestingHttp(true);
    setTestError(null);
    try {
      const res = await fetch('/api/urls/test-http', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          storeDomain,
          type: builderType,
          name: productName,
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setSeoTestResult(data.result);
        setCustomTestUrl(url);
      } else {
        setTestError(data.message || 'Falha ao executar teste HTTP.');
      }
    } catch (err) {
      console.error('Failed to run HTTP GET test:', err);
      setTestError('Erro de conexão ao executar requisição HTTP.');
    } finally {
      setIsTestingHttp(false);
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
        setCustomTestUrl(data.result.generatedUrl);
        // Execute HTTP test on generated URL
        handleRunHttpTest(data.result.generatedUrl);
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
                      <th className="py-2.5 px-3 font-semibold text-right">Ação</th>
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
                        <td className="py-2.5 px-3 text-right font-sans">
                          <button
                            onClick={() => {
                              setActiveSubSection('url-builder');
                              setCustomTestUrl(r.url);
                              handleRunHttpTest(r.url);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-pink-300 hover:text-white bg-pink-950/50 hover:bg-pink-900/60 border border-pink-500/30 rounded-lg transition-colors"
                            title="Executar requisição HTTP GET e auditar meta tags"
                          >
                            <Play className="w-3 h-3 text-pink-400" />
                            <span>Auditar Tags</span>
                          </button>
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
        <div className="space-y-6">
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

                {/* Quick HTTP GET Test Action Button */}
                <button
                  onClick={() => handleRunHttpTest(buildResult.generatedUrl)}
                  disabled={isTestingHttp}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-50 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 ${isTestingHttp ? 'animate-spin' : ''}`} />
                  <span>{isTestingHttp ? 'Testando Requisição HTTP (GET)...' : 'Testar Requisição HTTP GET & Meta Tags'}</span>
                </button>

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

        {/* HTTP GET Request Test & Essential SEO Meta Tags Inspector */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 mt-6">
          {/* Header with Title and URL Input/Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                  HTTP GET Inspector
                </span>
                <span className="text-xs text-slate-500" aria-hidden="true">·</span>
                <span className="text-xs text-slate-400">Validador de Status 200 OK & Meta Tags Essenciais de SEO</span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-pink-400" />
                <span>Teste de Requisição HTTP (GET) na URL Gerada</span>
              </h3>
              <p className="text-xs text-slate-300">
                Dispara uma requisição HTTP GET no endpoint da loja VTEX, valida o código de resposta (200 OK) e disseca todas as meta tags do HTML retornado.
              </p>
            </div>

            {/* URL input and trigger button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              <div className="relative min-w-[280px]">
                <input
                  type="text"
                  value={customTestUrl}
                  onChange={(e) => setCustomTestUrl(e.target.value)}
                  placeholder="https://sua-loja.com.br/produto/p"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>
              <button
                onClick={() => handleRunHttpTest(customTestUrl)}
                disabled={isTestingHttp || !customTestUrl.trim()}
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-50 rounded-lg shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <Play className={`w-3.5 h-3.5 ${isTestingHttp ? 'animate-spin' : ''}`} />
                <span>{isTestingHttp ? 'Executando Teste...' : 'Executar Teste HTTP'}</span>
              </button>
            </div>
          </div>

          {testError && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{testError}</span>
            </div>
          )}

          {/* Loading State */}
          {isTestingHttp && (
            <div className="p-8 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw className="w-6 h-6 text-pink-400 animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white">Disparando requisição HTTP GET em {customTestUrl}...</p>
                <p className="text-[11px] text-slate-400">Validando cabeçalhos de resposta, código de status 200 OK e dissecando meta tags do HTML retornado.</p>
              </div>
            </div>
          )}

          {/* Results State */}
          {!isTestingHttp && seoTestResult && (
            <div className="space-y-6">
              {/* Overview Cards Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: HTTP Status Code */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">Código de Status HTTP</span>
                    {seoTestResult.statusCode === 200 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-2xl font-bold font-mono ${
                        seoTestResult.statusCode === 200
                          ? 'text-emerald-400'
                          : seoTestResult.statusCode === 301
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {seoTestResult.statusCode} {seoTestResult.statusText}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Latência de Rede:</span>
                    <span className="font-mono font-semibold text-slate-200">{seoTestResult.latencyMs}ms</span>
                  </div>
                </div>

                {/* Card 2: Score de Conformidade SEO */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">Score de Meta Tags SEO</span>
                    <ShieldCheck className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white font-mono">{seoTestResult.score}/100</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        seoTestResult.score >= 90
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : seoTestResult.score >= 75
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {seoTestResult.score >= 90 ? 'Excelente' : seoTestResult.score >= 75 ? 'Regular' : 'Atenção'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Tags Aprovadas:</span>
                    <span className="font-semibold text-emerald-400">
                      {Object.values(seoTestResult.metaTags).filter((t: any) => t.status === 'passed').length}/10 Válidas
                    </span>
                  </div>
                </div>

                {/* Card 3: Canônica & Indexabilidade */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">Canônica & Indexabilidade</span>
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                      <span className={`w-2 h-2 rounded-full ${seoTestResult.metaTags.canonical.matchesUrl ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span>{seoTestResult.metaTags.canonical.matchesUrl ? 'Canônica Exata (/p)' : 'Canônica Divergente'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className={`w-2 h-2 rounded-full ${seoTestResult.metaTags.robots.isIndexable ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span>{seoTestResult.metaTags.robots.isIndexable ? 'Robots: index, follow' : 'Robots: noindex'}</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Origem da Resposta */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">Origem & Protocolo</span>
                    <CheckSquare className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xs font-bold text-slate-200">
                    {seoTestResult.isLiveFetch ? 'Conexão Real (Live Web)' : 'Simulação VTEX CMS Legacy'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Testado em: <span className="font-mono text-slate-300">{seoTestResult.testedAt}</span>
                  </div>
                </div>
              </div>

              {/* Grid of 10 Meta Tags Detailed Inspection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-pink-400" />
                    <span>Auditoria Detalhada de Meta Tags & Controles VTEX</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Padrão Googlebot + OpenGraph + Schema.org</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Tag 1: <title> */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {seoTestResult.metaTags.title.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white font-mono">&lt;title&gt;</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {seoTestResult.metaTags.title.length || 0} caracteres
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-200 bg-slate-900 p-2 rounded border border-slate-800 truncate" title={seoTestResult.metaTags.title.value}>
                      {seoTestResult.metaTags.title.value || '<title ausente>'}
                    </div>
                    <p className="text-[11px] text-slate-400">{seoTestResult.metaTags.title.detail}</p>
                  </div>

                  {/* Tag 2: <meta name="description"> */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {seoTestResult.metaTags.description.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white font-mono">&lt;meta name="description"&gt;</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {seoTestResult.metaTags.description.length || 0} caracteres
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-200 bg-slate-900 p-2 rounded border border-slate-800 line-clamp-2" title={seoTestResult.metaTags.description.value}>
                      {seoTestResult.metaTags.description.value || '<description ausente>'}
                    </div>
                    <p className="text-[11px] text-slate-400">{seoTestResult.metaTags.description.detail}</p>
                  </div>

                  {/* Tag 3: <link rel="canonical"> */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {seoTestResult.metaTags.canonical.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white font-mono">&lt;link rel="canonical"&gt;</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${seoTestResult.metaTags.canonical.matchesUrl ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                        {seoTestResult.metaTags.canonical.matchesUrl ? 'Compatível 100%' : 'Diferente'}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-pink-300 bg-slate-900 p-2 rounded border border-slate-800 truncate" title={seoTestResult.metaTags.canonical.value}>
                      {seoTestResult.metaTags.canonical.value || '<canonical ausente>'}
                    </div>
                    <p className="text-[11px] text-slate-400">{seoTestResult.metaTags.canonical.detail}</p>
                  </div>

                  {/* Tag 4: <meta name="robots"> */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {seoTestResult.metaTags.robots.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white font-mono">&lt;meta name="robots"&gt;</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {seoTestResult.metaTags.robots.isIndexable ? 'Indexável' : 'Bloqueado'}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-200 bg-slate-900 p-2 rounded border border-slate-800">
                      {seoTestResult.metaTags.robots.value || 'index, follow'}
                    </div>
                    <p className="text-[11px] text-slate-400">{seoTestResult.metaTags.robots.detail}</p>
                  </div>

                  {/* Tag 5: <h1> Header */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {seoTestResult.metaTags.h1.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white font-mono">&lt;h1&gt; Título Primário</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {seoTestResult.metaTags.h1.count} tag(s) H1
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-200 bg-slate-900 p-2 rounded border border-slate-800 truncate" title={seoTestResult.metaTags.h1.value}>
                      {seoTestResult.metaTags.h1.value || '<h1 ausente>'}
                    </div>
                    <p className="text-[11px] text-slate-400">{seoTestResult.metaTags.h1.detail}</p>
                  </div>

                  {/* Tag 6: OpenGraph (Social) */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {seoTestResult.metaTags.openGraph.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white font-mono">OpenGraph (og:title, og:image)</span>
                      </div>
                      <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="text-xs text-slate-200 bg-slate-900 p-2 rounded border border-slate-800 truncate">
                      {seoTestResult.metaTags.openGraph.ogTitle || 'Tags OpenGraph detectadas'}
                    </div>
                    <p className="text-[11px] text-slate-400">{seoTestResult.metaTags.openGraph.detail}</p>
                  </div>

                  {/* Tag 7: Schema.org JSON-LD */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {seoTestResult.metaTags.schemaJsonLd.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white font-mono">Schema.org JSON-LD</span>
                      </div>
                      <span className="text-[10px] font-bold text-purple-400">
                        {seoTestResult.metaTags.schemaJsonLd.schemaType ? `@type: ${seoTestResult.metaTags.schemaJsonLd.schemaType}` : 'Ausente'}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-purple-300 bg-slate-900 p-2 rounded border border-slate-800 truncate">
                      {seoTestResult.metaTags.schemaJsonLd.schemaType ? `application/ld+json (${seoTestResult.metaTags.schemaJsonLd.schemaType})` : '<ld+json ausente>'}
                    </div>
                    <p className="text-[11px] text-slate-400">{seoTestResult.metaTags.schemaJsonLd.detail}</p>
                  </div>

                  {/* Tag 8: Marcadores VTEX CMS Legacy */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {seoTestResult.metaTags.vtexLegacyMarkers.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white font-mono">VTEX CMS Legacy (skuJson & /arquivos/)</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                        Portal Legacy
                      </span>
                    </div>
                    <div className="text-xs text-slate-200 bg-slate-900 p-2 rounded border border-slate-800 flex items-center justify-between">
                      <span>skuJson: <strong className="text-emerald-400">{seoTestResult.metaTags.vtexLegacyMarkers.hasSkuJson ? 'Presente' : 'Não'}</strong></span>
                      <span>/arquivos/: <strong className="text-emerald-400">{seoTestResult.metaTags.vtexLegacyMarkers.hasArquivosAsset ? 'Presente' : 'Não'}</strong></span>
                    </div>
                    <p className="text-[11px] text-slate-400">{seoTestResult.metaTags.vtexLegacyMarkers.detail}</p>
                  </div>
                </div>
              </div>

              {/* Code Inspector Toggle */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowRawHeadCode(!showRawHeadCode)}
                    className="flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>{showRawHeadCode ? 'Ocultar Código <head> Inspecionado' : 'Inspecionar Código <head> e Meta Tags Retornadas'}</span>
                    {showRawHeadCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showRawHeadCode && (
                    <button
                      onClick={() => handleCopy(seoTestResult.rawHeadSnippet, 'head_raw')}
                      className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 cursor-pointer"
                    >
                      {copiedId === 'head_raw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'head_raw' ? 'Copiado!' : 'Copiar <head>'}</span>
                    </button>
                  )}
                </div>

                {showRawHeadCode && (
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[300px] leading-relaxed">
                    {seoTestResult.rawHeadSnippet}
                  </pre>
                )}
              </div>

              {/* Actionable Advice for VTEX CMS Legacy */}
              {seoTestResult.recommendations.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950 border border-pink-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-pink-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>Recomendações Técnicas para o Portal VTEX Legacy:</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {seoTestResult.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  );
};
