import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Copy,
  Check,
  Download,
  Tag,
  TrendingUp,
  Layers,
  ShoppingBag,
  RefreshCw,
  Zap,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Cpu,
  BookOpen,
} from 'lucide-react';
import type { LsiKeywordAnalysis, LsiTermItem } from '../types/index.ts';
import {
  LSI_KEYWORD_PRESETS,
  generateCuratedLsiAnalysis,
} from '../utils/productContentEngine.ts';

interface LsiKeywordExplorerSectionProps {
  initialKeyword?: string;
  initialCategory?: string;
  onApplyToProductGenerator?: (keyword: string, category: string) => void;
}

export const LsiKeywordExplorerSection: React.FC<LsiKeywordExplorerSectionProps> = ({
  initialKeyword = 'tênis de corrida com placa de carbono',
  initialCategory = 'Calçados Esportivos & Corrida',
  onApplyToProductGenerator,
}) => {
  const [targetKeyword, setTargetKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [optimizationFocus, setOptimizationFocus] = useState('Descrições de Produto E-commerce');
  const [tone, setTone] = useState('persuasive');

  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [activeClusterTab, setActiveClusterTab] = useState<
    'all' | 'technicalSpecs' | 'problemBenefits' | 'naturalSynonyms' | 'buyerTriggers' | 'vtexInternalSearch'
  >('all');

  const [analysis, setAnalysis] = useState<LsiKeywordAnalysis>(() =>
    generateCuratedLsiAnalysis({
      targetKeyword: initialKeyword,
      category: initialCategory,
      optimizationFocus: 'Descrições de Produto E-commerce',
      tone: 'persuasive',
    })
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = LSI_KEYWORD_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setTargetKeyword(preset.keyword);
    setCategory(preset.category);
    setOptimizationFocus(preset.focus);

    // Instant local preview
    const immediate = generateCuratedLsiAnalysis({
      targetKeyword: preset.keyword,
      category: preset.category,
      optimizationFocus: preset.focus,
      tone,
    });
    setAnalysis(immediate);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetKeyword.trim()) return;

    setIsLoading(true);
    const payload = {
      targetKeyword: targetKeyword.trim(),
      category: category.trim() || 'Geral',
      optimizationFocus,
      tone,
    };

    try {
      const res = await fetch('/api/ai/lsi-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis(generateCuratedLsiAnalysis(payload));
      }
    } catch {
      setAnalysis(generateCuratedLsiAnalysis(payload));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAllTerms = () => {
    if (!analysis) return;
    const all = [
      `=== TERMOS LSI & SUGESTÕES SEMÂNTICAS PARA: "${analysis.targetKeyword}" ===`,
      `Categoria: ${analysis.category} | Relevância Semântica: ${analysis.semanticRelevanceScore}%`,
      `Intenção: ${analysis.primarySearchIntent} | Densidade Recomendada: ${analysis.recommendedDensity}`,
      '',
      '--- 1. ESPECIFICAÇÕES TÉCNICAS & ATRIBUTOS ---',
      ...analysis.lsiClusters.technicalSpecs.map((t) => `- ${t.term} (Relevância: ${t.relevanceScore}%) -> ${t.recommendation}`),
      '',
      '--- 2. DORES, BENEFÍCIOS & CONTEXTO DE USO ---',
      ...analysis.lsiClusters.problemBenefits.map((t) => `- ${t.term} (Relevância: ${t.relevanceScore}%) -> ${t.recommendation}`),
      '',
      '--- 3. SINÔNIMOS NATURAIS & VARIAÇÕES SEMÂNTICAS ---',
      ...analysis.lsiClusters.naturalSynonyms.map((t) => `- ${t.term} (Relevância: ${t.relevanceScore}%) -> ${t.recommendation}`),
      '',
      '--- 4. TERMOS DE DECISÃO DE COMPRA & CRO ---',
      ...analysis.lsiClusters.buyerTriggers.map((t) => `- ${t.term} (Relevância: ${t.relevanceScore}%) -> ${t.recommendation}`),
      '',
      '--- 5. TERMOS PARA BUSCA INTERNA VTEX (PALAVRAS SUBSTITUTAS) ---',
      ...analysis.lsiClusters.vtexInternalSearch.map((t) => `- ${t.term} (Relevância: ${t.relevanceScore}%) -> ${t.recommendation}`),
    ].join('\n');

    handleCopy(all, 'copy_all_lsi');
  };

  const handleExportMarkdown = () => {
    if (!analysis) return;
    const md = `# Relatório Semântico LSI - Palavra-Chave: "${analysis.targetKeyword}"
*Gerado via Gemini AI + Motor Semântico VTEX CMS Legacy em ${analysis.generatedAt}*
*Modelo: ${analysis.modelUsed}*

---

## Métricas da Palavra-Chave Alvo
- **Palavra-Chave:** ${analysis.targetKeyword}
- **Categoria / Nicho:** ${analysis.category}
- **Pontuação de Relevância Semântica:** ${analysis.semanticRelevanceScore}/100
- **Intenção Principal:** ${analysis.primarySearchIntent}
- **Densidade Recomendada na Descrição:** ${analysis.recommendedDensity}

---

## 1. Especificações Técnicas & Materiais LSI
${analysis.lsiClusters.technicalSpecs.map((t) => `### ${t.term} (Relevância: ${t.relevanceScore}%)
- **Recomendação VTEX:** ${t.recommendation}
- **Exemplo em Frase:** *"${t.exampleContext}"*`).join('\n\n')}

---

## 2. Dores, Benefícios & Situações de Uso
${analysis.lsiClusters.problemBenefits.map((t) => `### ${t.term} (Relevância: ${t.relevanceScore}%)
- **Recomendação VTEX:** ${t.recommendation}
- **Exemplo em Frase:** *"${t.exampleContext}"*`).join('\n\n')}

---

## 3. Sinônimos Naturais & Variações Semânticas
${analysis.lsiClusters.naturalSynonyms.map((t) => `### ${t.term} (Relevância: ${t.relevanceScore}%)
- **Recomendação VTEX:** ${t.recommendation}
- **Exemplo em Frase:** *"${t.exampleContext}"*`).join('\n\n')}

---

## 4. Gatilhos de Decisão de Compra (CRO E-commerce)
${analysis.lsiClusters.buyerTriggers.map((t) => `### ${t.term} (Relevância: ${t.relevanceScore}%)
- **Recomendação VTEX:** ${t.recommendation}
- **Exemplo em Frase:** *"${t.exampleContext}"*`).join('\n\n')}

---

## 5. Termos para Busca Interna VTEX (Intelligent Search & Portal Legacy)
${analysis.lsiClusters.vtexInternalSearch.map((t) => `- **${t.term}**: ${t.recommendation} (Exemplo: *${t.exampleContext}*)`).join('\n')}

---

## Exemplos de Parágrafos Prontos para a Descrição (<vtex.cmc:productDescription />)
${analysis.productDescriptionSnippets.map((p, i) => `### Exemplo ${i + 1}\n${p.replace(/<[^>]*>?/gm, '')}`).join('\n\n')}

---

## Orientação Estratégica de SEO & IA
${analysis.seoRecommendation}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lsi-semantico-${targetKeyword.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper to render cluster cards
  const renderClusterSection = (
    title: string,
    description: string,
    icon: React.ReactNode,
    terms: LsiTermItem[],
    clusterKey: string,
    accentColor: string
  ) => {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
              {icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {terms.length} termos
                </span>
              </h4>
              <p className="text-xs text-slate-400">{description}</p>
            </div>
          </div>

          <button
            onClick={() => {
              const list = terms.map((t) => t.term).join(', ');
              handleCopy(list, `cluster_${clusterKey}`);
            }}
            className="self-start sm:self-auto flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            {copiedId === `cluster_${clusterKey}` ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiados!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Cluster</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {terms.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white tracking-wide">
                      {item.term}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                        item.relevanceScore >= 95
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}
                    >
                      {item.relevanceScore}% relevância
                    </span>
                    {item.searchIntent && (
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {item.searchIntent}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(item.term, `term_${clusterKey}_${idx}`)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 shrink-0"
                  title="Copiar termo"
                >
                  {copiedId === `term_${clusterKey}_${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Recommendation tip */}
              <div className="flex items-start gap-1.5 text-[11px] text-pink-300/90 bg-pink-950/20 px-2.5 py-1.5 rounded-lg border border-pink-500/20">
                <Lightbulb className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{item.recommendation}</span>
              </div>

              {/* Example context sentence */}
              <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 italic leading-relaxed">
                "{item.exampleContext}"
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Card for LSI Explorer */}
      <div className="bg-gradient-to-r from-purple-950/50 via-slate-900 to-pink-950/30 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Pesquisa Semântica & LSI com Gemini API para VTEX CMS Legacy
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explorador de Palavras Semânticas & Termos LSI
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Descubra os termos semânticos e entidades LSI (<em>Latent Semantic Indexing</em>) essenciais que os motores de busca (Google, AI Overviews, Perplexity) e o Intelligent Search da VTEX esperam encontrar na descrição dos seus produtos para ranquear na primeira página.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportMarkdown}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm"
              title="Exportar dossiê semântico em Markdown"
            >
              <Download className="w-4 h-4 text-purple-400" />
              Exportar Markdown
            </button>

            {onApplyToProductGenerator && (
              <button
                onClick={() => onApplyToProductGenerator(targetKeyword, category)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-md"
                title="Transferir palavra-chave e categoria para o gerador de texto de produto"
              >
                <span>Usar no Gerador de Produto</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Test Keyword Chips */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Palavras de Exemplo Rápido:
          </span>
          {LSI_KEYWORD_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
            >
              <Search className="w-3 h-3 text-purple-400" />
              {preset.keyword}
            </button>
          ))}
        </div>
      </div>

      {/* Input Parameters Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Search className="w-4 h-4 text-purple-400" />
              Configurar Palavra-Chave Alvo & Parâmetros Semânticos
            </div>
            <span className="text-xs text-slate-400 font-mono">IA: Gemini 3.8 Flash / Flash Lite</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Target Keyword */}
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Palavra-Chave Alvo (Target Keyword) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="Ex: tênis de corrida com placa de carbono"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition pl-9"
                  required
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Category */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Categoria / Nicho de E-commerce
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Calçados Esportivos"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Optimization Focus */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Foco Semântico
              </label>
              <select
                value={optimizationFocus}
                onChange={(e) => setOptimizationFocus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 transition"
              >
                <option value="Descrições de Produto E-commerce">Descrições PDP</option>
                <option value="SEO & Buscas Google/IA">Google & IAs (AIO)</option>
                <option value="Busca Interna VTEX (Intelligent Search)">Busca VTEX</option>
                <option value="Equilibrado (Conversão + SEO)">Equilibrado</option>
              </select>
            </div>

            {/* Tone */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tom de Aplicação
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 transition"
              >
                <option value="persuasive">Persuasivo & Técnico</option>
                <option value="technical">Especialista / Engenharia</option>
                <option value="casual">Casual & Atraente</option>
                <option value="minimalist">Minimalista</option>
                <option value="emotional">Emocional & Aspiracional</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-400">
              Dica: O motor analisa coocorrências semânticas no corpus do e-commerce brasileiro e mapeia sinônimos para o catálogo VTEX Legacy.
            </p>

            <button
              type="submit"
              disabled={isLoading || !targetKeyword.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-purple-950/40 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Analisando Semântica com Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  Gerar Sugestões Semânticas & LSI com IA
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Target Keyword Score & Metrics Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                Palavra-Chave Alvo Analisada
              </span>
              <span className="text-xs text-slate-400">Categoria: {analysis.category}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              "{analysis.targetKeyword}"
            </h3>
          </div>

          {/* Quick Metrics Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Relevância Semântica</div>
              <div className="text-sm font-bold text-emerald-400">
                {analysis.semanticRelevanceScore}/100
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Intenção Primária</div>
              <div className="text-sm font-bold text-purple-300 capitalize">
                {analysis.primarySearchIntent}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 sm:col-span-2">
              <div className="text-[10px] text-slate-400">Densidade Recomendada na Descrição</div>
              <div className="text-xs font-bold text-slate-200">
                {analysis.recommendedDensity}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Motor: <strong className="text-slate-200">{analysis.modelUsed}</strong></span>
            <span>·</span>
            <span>Atualizado: {analysis.generatedAt}</span>
          </div>

          <button
            onClick={handleCopyAllTerms}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            {copiedId === 'copy_all_lsi' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Todos os Termos Copiados!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-purple-400" />
                <span>Copiar Todos os Termos LSI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cluster Navigation Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center gap-1">
        {[
          { id: 'all', label: 'Todos os Clusters (20 Termos)', count: 20 },
          { id: 'technicalSpecs', label: '1. Especificações & Materiais', count: analysis.lsiClusters.technicalSpecs.length },
          { id: 'problemBenefits', label: '2. Dores & Benefícios', count: analysis.lsiClusters.problemBenefits.length },
          { id: 'naturalSynonyms', label: '3. Sinônimos Naturais', count: analysis.lsiClusters.naturalSynonyms.length },
          { id: 'buyerTriggers', label: '4. Gatilhos de Compra (CRO)', count: analysis.lsiClusters.buyerTriggers.length },
          { id: 'vtexInternalSearch', label: '5. Busca Interna VTEX', count: analysis.lsiClusters.vtexInternalSearch.length },
        ].map((tab) => {
          const isActive = activeClusterTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveClusterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Clusters */}
      <div className="space-y-6">
        {(activeClusterTab === 'all' || activeClusterTab === 'technicalSpecs') &&
          renderClusterSection(
            '1. Termos LSI de Especificações Técnicas, Materiais & Atributos',
            'Entidades e vocabulário técnico associados à fabricação, componentes, medidas e desempenho.',
            <Cpu className="w-4 h-4 text-purple-400" />,
            analysis.lsiClusters.technicalSpecs,
            'technical',
            'purple'
          )}

        {(activeClusterTab === 'all' || activeClusterTab === 'problemBenefits') &&
          renderClusterSection(
            '2. Termos LSI de Dores Resolvidas, Benefícios & Situações de Uso',
            'Termos que o usuário pesquisa quando procura o resultado prático, alívio de dor ou contexto de uso.',
            <TrendingUp className="w-4 h-4 text-emerald-400" />,
            analysis.lsiClusters.problemBenefits,
            'benefits',
            'emerald'
          )}

        {(activeClusterTab === 'all' || activeClusterTab === 'naturalSynonyms') &&
          renderClusterSection(
            '3. Sinônimos Semânticos & Variações Naturais de Busca',
            'Termos vizinhos no espaço vetorial semântico que previnem repetição forçada da palavra-chave alvo.',
            <Tag className="w-4 h-4 text-blue-400" />,
            analysis.lsiClusters.naturalSynonyms,
            'synonyms',
            'blue'
          )}

        {(activeClusterTab === 'all' || activeClusterTab === 'buyerTriggers') &&
          renderClusterSection(
            '4. Termos de Decisão de Compra, Segurança & Conversão (CRO)',
            'Palavras com alta intenção comercial e transacional para inserir próximo aos botões de compra e garantias.',
            <ShoppingBag className="w-4 h-4 text-amber-400" />,
            analysis.lsiClusters.buyerTriggers,
            'buyer',
            'amber'
          )}

        {(activeClusterTab === 'all' || activeClusterTab === 'vtexInternalSearch') &&
          renderClusterSection(
            '5. Termos Recomendados para Busca Interna VTEX (Palavras Substitutas)',
            'Indexação recomendada para cadastrar no Admin VTEX (Catálogo > Produtos > Palavras Substitutas e Intelligent Search).',
            <Layers className="w-4 h-4 text-pink-400" />,
            analysis.lsiClusters.vtexInternalSearch,
            'vtex',
            'pink'
          )}
      </div>

      {/* Product Description Snippets (Ready-to-use HTML / Text) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-pink-400" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Exemplos de Parágrafos Prontos com LSI Integrado para a Descrição do Produto
              </h4>
              <p className="text-xs text-slate-400">
                Formatados para injeção via <code className="text-pink-300 font-mono">&lt;vtex.cmc:productDescription /&gt;</code> no Subtemplate VTEX CMS Legacy
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Anti-Keyword Stuffing Validado
          </span>
        </div>

        <div className="space-y-3">
          {analysis.productDescriptionSnippets.map((snippet, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-purple-300">
                  Parágrafo Exemplo #{idx + 1}
                </span>

                <button
                  onClick={() => handleCopy(snippet.replace(/<[^>]*>?/gm, ''), `snippet_${idx}`)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
                >
                  {copiedId === `snippet_${idx}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>

              <div
                className="text-xs text-slate-200 leading-relaxed font-sans prose prose-invert prose-pink max-w-none"
                dangerouslySetInnerHTML={{ __html: snippet }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* SEO & AI Strategy Guidelines Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/20 via-slate-950 to-slate-950 border border-purple-500/20 space-y-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Diretriz Estratégica para Rankeamento Semântico no Google e IA Overviews
          </h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {analysis.seoRecommendation}
        </p>
      </div>
    </div>
  );
};
