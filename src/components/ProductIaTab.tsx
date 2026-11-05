import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Eye,
  Code,
  FileText,
  Search,
  Tag,
  MousePointerClick,
  Layers,
  HelpCircle,
  ShoppingBag,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import type {
  ProductCopyParams,
  ProductGeneratedContent,
  ProductTitleVariation,
  ProductKeywordItem,
} from '../types/index.ts';
import {
  PRODUCT_PRESETS,
  generateCuratedProductContent,
} from '../utils/productContentEngine.ts';

interface ProductIaTabProps {
  storeDomain?: string;
}

export const ProductIaTab: React.FC<ProductIaTabProps> = ({
  storeDomain = 'www.lojamoda.com.br',
}) => {
  // Input parameters state
  const [productName, setProductName] = useState('Tênis Running Pro Carbon Turbo');
  const [category, setCategory] = useState('Calçados Esportivos');
  const [keyFeatures, setKeyFeatures] = useState(
    'Placa de carbono 100% responsiva, solado em superespuma EVA nitrogenada, peso ultraleve de 198g, cabedal respirável em mesh tecnológico, drop de 6mm, grip antiderrapante de alta tração'
  );
  const [targetAudience, setTargetAudience] = useState(
    'Corredores amadores e maratonistas que buscam baixar seu pace e máximo retorno de energia'
  );
  const [toneOfVoice, setToneOfVoice] = useState<ProductCopyParams['toneOfVoice']>('persuasive');
  const [targetKeyword, setTargetKeyword] = useState('tênis de corrida com placa de carbono');
  const [specialOffer, setSpecialOffer] = useState('De R$ 899,90 por R$ 649,90 em até 10x sem juros + Frete Grátis');

  // Loading & generation state
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProductGeneratedContent>(() =>
    generateCuratedProductContent({
      productName: 'Tênis Running Pro Carbon Turbo',
      category: 'Calçados Esportivos',
      keyFeatures:
        'Placa de carbono 100% responsiva, solado em superespuma EVA nitrogenada, peso ultraleve de 198g, cabedal respirável em mesh tecnológico, drop de 6mm, grip antiderrapante de alta tração',
      targetAudience:
        'Corredores amadores e maratonistas que buscam baixar seu pace e máximo retorno de energia',
      toneOfVoice: 'persuasive',
      targetKeyword: 'tênis de corrida com placa de carbono',
      specialOffer: 'De R$ 899,90 por R$ 649,90 em até 10x sem juros + Frete Grátis',
    })
  );

  // Active view tab inside results
  const [activeResultTab, setActiveResultTab] = useState<'titles_cta' | 'description' | 'seo_serp' | 'keywords' | 'vtex_guide'>('titles_cta');
  const [descViewMode, setDescViewMode] = useState<'preview' | 'html' | 'plain'>('preview');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = PRODUCT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setProductName(preset.name);
    setCategory(preset.category);
    setKeyFeatures(preset.keyFeatures);
    setTargetAudience(preset.targetAudience);
    setToneOfVoice(preset.toneOfVoice);
    setTargetKeyword(preset.targetKeyword);
    setSpecialOffer(preset.specialOffer || '');

    // Auto-generate preview immediately
    const immediate = generateCuratedProductContent({
      ...preset,
      productName: preset.name,
    });
    setResult(immediate);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productName.trim()) return;

    setIsLoading(true);
    const params: ProductCopyParams = {
      productName: productName.trim(),
      category: category.trim(),
      keyFeatures: keyFeatures.trim(),
      targetAudience: targetAudience.trim(),
      toneOfVoice,
      targetKeyword: targetKeyword.trim(),
      specialOffer: specialOffer.trim(),
    };

    try {
      const res = await fetch('/api/ai/generate-product-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await res.json();
      if (data.success && data.content) {
        setResult(data.content);
      } else {
        setResult(generateCuratedProductContent(params));
      }
    } catch {
      setResult(generateCuratedProductContent(params));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!result) return;
    const md = `# ${result.productName} - Conteúdo de Venda Otimizado (Product IA)
*Gerado para VTEX CMS Legacy em ${result.generatedAt}*
*Motor: ${result.modelUsed}*

---

## 1. Títulos de Produto
${result.titles.map((t) => `- **${t.title}** (${t.charCount} caracteres) - Foco: ${t.focus}\n  *${t.description}*`).join('\n')}

---

## 2. Pitch de Vendas & Transformação
${result.salesPitch}

### Benefícios:
${result.benefits.map((b) => `- ${b}`).join('\n')}

### Especificações Técnicas:
${result.technicalSpecs.map((s) => `- **${s.label}:** ${s.value}`).join('\n')}

---

## 3. Chamadas para Ação (CTAs)
${result.callToActions.map((c) => `- **${c.text}** [Tipo: ${c.type}] (${c.context})`).join('\n')}

---

## 4. Tags SEO & SERP
- **Title Tag (55-60c):** ${result.seoTags.metaTitle}
- **Meta Description (150-160c):** ${result.seoTags.metaDescription}
- **Canonical Slug VTEX:** ${result.seoTags.canonicalSlug}

---

## 5. Inteligência de Palavras-Chave
- **Palavra-chave Primária:** ${result.keywords.primary.keyword} (${result.keywords.primary.estimatedVolume} | CPC: ${result.keywords.primary.cpcEstimate})
- **Secundárias:** ${result.keywords.secondary.map((k) => k.keyword).join(', ')}
- **Cauda Longa (Long-Tail):** ${result.keywords.longTail.map((k) => k.keyword).join(', ')}
- **Termos para Busca Interna VTEX:** ${result.keywords.vtexInternalSearchTerms.map((t) => `${t.term} (${t.field})`).join(', ')}

---

## 6. HTML Formatado para Subtemplate VTEX CMS Legacy (<vtex.cmc:productDescription />)
\`\`\`html
${result.htmlDescription}
\`\`\`
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `product-ia-${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyKeywordsCsv = () => {
    if (!result) return;
    const rows = [
      ['Palavra-Chave', 'Tipo', 'Intenção', 'Volume Estimado', 'Concorrência', 'CPC Estimado'],
      [
        result.keywords.primary.keyword,
        'Primária',
        result.keywords.primary.searchIntent,
        result.keywords.primary.estimatedVolume,
        result.keywords.primary.competition,
        result.keywords.primary.cpcEstimate,
      ],
      ...result.keywords.secondary.map((k) => [
        k.keyword,
        'Secundária',
        k.searchIntent,
        k.estimatedVolume,
        k.competition,
        k.cpcEstimate,
      ]),
      ...result.keywords.longTail.map((k) => [
        k.keyword,
        'Cauda Longa',
        k.searchIntent,
        k.estimatedVolume,
        k.competition,
        k.cpcEstimate,
      ]),
    ];

    const csvContent = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    handleCopy(csvContent, 'keywords_csv');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Inspirado no productIA & Especializado para VTEX CMS Legacy
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Product IA: Conteúdo de Venda, SEO & Palavras-Chave
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Gere títulos persuasivos com foco em conversão e SEO, descrições ricas em HTML formatadas para o controle{' '}
              <code className="text-pink-300 bg-pink-950/60 px-1.5 py-0.5 rounded text-xs font-mono">&lt;vtex.cmc:productDescription /&gt;</code>,
              meta tags, CTAs e inteligência completa de palavras-chave para catálogo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm"
              title="Baixar todo o pacote gerado em arquivo Markdown"
            >
              <Download className="w-4 h-4 text-pink-400" />
              Exportar Markdown
            </button>
          </div>
        </div>

        {/* Quick Presets Carousel */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Produtos de Teste Rápido:
          </span>
          {PRODUCT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/40 text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3 h-3 text-pink-400" />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Parameters (Left/Top) & Generated Results (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Parameters */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Tag className="w-4 h-4 text-pink-400" />
                Parâmetros do Produto
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Etapa 1: Dados</span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome do Produto <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Tênis Running Pro Carbon Turbo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500 transition"
                  required
                />
              </div>

              {/* Category & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Categoria / Departamento
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Calçados Esportivos"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Palavra-Chave Principal
                  </label>
                  <input
                    type="text"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="Ex: tênis com placa de carbono"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500 transition"
                  />
                </div>
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Características & Atributos Principais
                </label>
                <textarea
                  rows={3}
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  placeholder="Materiais, tecnologias, peso, dimensões, garantias e diferenciais competitivos..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500 transition resize-none"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Público-Alvo / Perfil do Comprador
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ex: Corredores que buscam amortecimento e performance"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500 transition"
                />
              </div>

              {/* Tone of Voice */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tom de Voz do Copywriting
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'persuasive', label: 'Persuasivo' },
                    { id: 'technical', label: 'Técnico' },
                    { id: 'emotional', label: 'Emocional' },
                    { id: 'urgent', label: 'Urgente' },
                    { id: 'minimalist', label: 'Minimalista' },
                    { id: 'casual', label: 'Descontraído' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setToneOfVoice(t.id as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition ${
                        toneOfVoice === t.id
                          ? 'bg-pink-600/20 border-pink-500 text-pink-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Offer */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Oferta / Condição Comercial Especial (Opcional)
                </label>
                <input
                  type="text"
                  value={specialOffer}
                  onChange={(e) => setSpecialOffer(e.target.value)}
                  placeholder="Ex: De R$ 899 por R$ 649 em 10x sem juros + Frete Grátis"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500 transition"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading || !productName.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs transition shadow-lg shadow-pink-950/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    Gerando Conteúdo Otimizado...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    Gerar Conteúdo com Product IA
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Info Box for VTEX CMS Legacy */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Compatibilidade 100% VTEX CMS Legacy (Portal)
            </div>
            <p className="text-slate-400 leading-relaxed">
              O HTML gerado é limpo e validado para injeção via{' '}
              <span className="text-pink-300 font-mono">&lt;vtex.cmc:productDescription /&gt;</span> no
              Subtemplate de PDP, sem scripts externos conflitantes com o <span className="font-mono text-slate-300">skuJson</span> nativo.
            </p>
          </div>
        </div>

        {/* Right Column: Output Results */}
        <div className="lg:col-span-7 space-y-5">
          {/* Results Navigation Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1">
              {[
                { id: 'titles_cta', label: 'Títulos & CTAs', icon: MousePointerClick },
                { id: 'description', label: 'Descrição de Venda', icon: FileText },
                { id: 'seo_serp', label: 'Tags SEO & SERP', icon: Search },
                { id: 'keywords', label: 'Palavras-Chave', icon: TrendingUp },
                { id: 'vtex_guide', label: 'Guia VTEX', icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeResultTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveResultTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-pink-600 text-white shadow-md shadow-pink-950/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 px-2 py-1 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{result.modelUsed}</span>
            </div>
          </div>

          {/* TAB 1: Títulos & Chamadas para Ação (CTAs) */}
          {activeResultTab === 'titles_cta' && (
            <div className="space-y-5">
              {/* Titles Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4 text-pink-400" />
                    <h3 className="text-sm font-bold text-white">
                      3 Variações de Títulos Otimizados
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">Escolha a melhor estratégia</span>
                </div>

                <div className="space-y-3">
                  {result.titles.map((titleVar: ProductTitleVariation) => {
                    const isOptimalLength = titleVar.charCount >= 40 && titleVar.charCount <= 75;
                    return (
                      <div
                        key={titleVar.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                titleVar.focus === 'conversao'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : titleVar.focus === 'seo'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              Foco: {titleVar.focus}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {titleVar.charCount} caracteres{' '}
                              {isOptimalLength && (
                                <span className="text-emerald-400 font-semibold">(Ideal)</span>
                              )}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopy(titleVar.title, titleVar.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs transition"
                          >
                            {copiedId === titleVar.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-white tracking-tight">
                          {titleVar.title}
                        </p>
                        <p className="text-xs text-slate-400">{titleVar.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* High-Impact CTAs */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">
                      Call to Actions (CTAs) de Alto Impacto
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">Gatilhos de Conversão</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.callToActions.map((cta) => (
                    <div
                      key={cta.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-2.5"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {cta.type}
                          </span>
                          <button
                            onClick={() => handleCopy(cta.text, cta.id)}
                            className="text-slate-400 hover:text-pink-400 p-1 transition"
                            title="Copiar texto do CTA"
                          >
                            {copiedId === cta.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs font-bold text-slate-100">{cta.text}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                        {cta.context}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Descrição de Venda (HTML / Preview / Plain) */}
          {activeResultTab === 'description' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-pink-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Descrição Persuasiva Completa</h3>
                    <p className="text-xs text-slate-400">
                      Formatada com metodologia AIDA, especificações e selos de confiança
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <button
                      onClick={() => setDescViewMode('preview')}
                      className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                        descViewMode === 'preview'
                          ? 'bg-slate-800 text-pink-300 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      Visual
                    </button>
                    <button
                      onClick={() => setDescViewMode('html')}
                      className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                        descViewMode === 'html'
                          ? 'bg-slate-800 text-pink-300 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Code className="w-3 h-3" />
                      HTML VTEX
                    </button>
                    <button
                      onClick={() => setDescViewMode('plain')}
                      className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                        descViewMode === 'plain'
                          ? 'bg-slate-800 text-pink-300 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FileText className="w-3 h-3" />
                      Texto
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      handleCopy(
                        descViewMode === 'html'
                          ? result.htmlDescription
                          : descViewMode === 'plain'
                          ? result.plainDescription
                          : result.htmlDescription,
                        'desc_copy'
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs transition"
                  >
                    {copiedId === 'desc_copy' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* View: Visual Preview */}
              {descViewMode === 'preview' && (
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-5 text-slate-200 text-xs leading-relaxed">
                  {/* Sales Pitch */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-pink-400 block mb-1">
                      Gancho de Vendas (AIDA):
                    </span>
                    <p className="text-sm font-medium text-slate-100 leading-relaxed">
                      {result.salesPitch}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Principais Vantagens & Benefícios:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {result.benefits.map((benefit, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800/60"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 shrink-0" />
                          <span className="text-slate-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Ficha Técnica Estruturada:
                    </h4>
                    <div className="rounded-xl border border-slate-800 overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <tbody>
                          {result.technicalSpecs.map((spec, i) => (
                            <tr
                              key={i}
                              className={i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-950'}
                            >
                              <td className="px-3.5 py-2 font-semibold text-slate-300 border-r border-slate-800/60 w-1/3">
                                {spec.label}
                              </td>
                              <td className="px-3.5 py-2 text-slate-400">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Guarantee Badge */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
                    <div className="text-xl">🛡️</div>
                    <div className="text-xs text-emerald-300">
                      <strong>Garantia de Satisfação & Compra Segura:</strong> Pronto para publicação
                      no catálogo VTEX com suporte a trocas em 30 dias e selo de segurança.
                    </div>
                  </div>
                </div>
              )}

              {/* View: Raw HTML */}
              {descViewMode === 'html' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Pronto para colar em CMS &gt; Layout &gt; HTML Templates &gt; Subtemplates</span>
                    <span className="font-mono text-pink-400">{result.htmlDescription.length} caracteres</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-96">
                    {result.htmlDescription}
                  </pre>
                </div>
              )}

              {/* View: Plain Text */}
              {descViewMode === 'plain' && (
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {result.plainDescription}
                </pre>
              )}
            </div>
          )}

          {/* TAB 3: Tags SEO & Simulador de SERP do Google */}
          {activeResultTab === 'seo_serp' && (
            <div className="space-y-5">
              {/* Google SERP Simulator */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Simulador de Snippet Google (SERP)</h3>
                      <p className="text-xs text-slate-400">Prévia real de como o produto aparecerá nas buscas</p>
                    </div>
                  </div>

                  <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <button
                      onClick={() => setSerpDevice('desktop')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        serpDevice === 'desktop'
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setSerpDevice('mobile')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        serpDevice === 'mobile'
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                {/* Google Snippet Card */}
                <div
                  className={`p-4 rounded-xl bg-white text-slate-900 font-sans shadow-md border border-slate-200 space-y-1 ${
                    serpDevice === 'mobile' ? 'max-w-md mx-auto' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-[#202124]">
                    <span className="w-4 h-4 rounded-full bg-pink-600 flex items-center justify-center text-white text-[9px] font-bold">
                      V
                    </span>
                    <span className="font-medium truncate">{storeDomain}</span>
                    <span className="text-slate-400">›</span>
                    <span className="text-slate-500 truncate">{result.seoTags.canonicalSlug}</span>
                  </div>

                  <h4 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug">
                    {result.seoTags.metaTitle}
                  </h4>

                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                    {result.seoTags.metaDescription}
                  </p>

                  <div className="pt-1 flex items-center gap-3 text-[11px] text-[#70757a]">
                    <span>Avaliação: 4,9 ★★★★★ (128)</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">Em estoque</span>
                  </div>
                </div>

                {/* Meta Tags Details & Gauges */}
                <div className="space-y-3 pt-2">
                  {/* Meta Title */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">SEO Title (Meta Title):</span>
                      <span className="text-slate-400 font-mono">
                        {result.seoTags.metaTitle.length}/60 caracteres{' '}
                        {result.seoTags.metaTitle.length <= 60 && (
                          <span className="text-emerald-400 font-bold">(Perfeito)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={result.seoTags.metaTitle}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                      />
                      <button
                        onClick={() => handleCopy(result.seoTags.metaTitle, 'meta_title')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      >
                        {copiedId === 'meta_title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">Meta Description:</span>
                      <span className="text-slate-400 font-mono">
                        {result.seoTags.metaDescription.length}/160 caracteres{' '}
                        {result.seoTags.metaDescription.length <= 160 && (
                          <span className="text-emerald-400 font-bold">(Dentro do Limite)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <textarea
                        readOnly
                        rows={2}
                        value={result.seoTags.metaDescription}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono resize-none"
                      />
                      <button
                        onClick={() => handleCopy(result.seoTags.metaDescription, 'meta_desc')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      >
                        {copiedId === 'meta_desc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Canonical Slug */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">URL Canônica VTEX CMS Legacy (/p):</span>
                      <span className="text-pink-400 font-mono text-[11px]">Padrão Portal CMS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://${storeDomain}/${result.seoTags.canonicalSlug}`}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono"
                      />
                      <button
                        onClick={() => handleCopy(`https://${storeDomain}/${result.seoTags.canonicalSlug}`, 'canonical_url')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      >
                        {copiedId === 'canonical_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* JSON-LD Schema.org Product Rich Snippet */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">Schema.org Product (JSON-LD)</h3>
                  </div>
                  <button
                    onClick={() => handleCopy(result.seoTags.schemaJsonLd, 'schema_copy')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    {copiedId === 'schema_copy' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar JSON-LD</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300 overflow-x-auto max-h-56">
                  {result.seoTags.schemaJsonLd}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Inteligência & Pesquisa de Palavras-Chave (Keywords) */}
          {activeResultTab === 'keywords' && (
            <div className="space-y-5">
              {/* Primary Keyword Hero Card */}
              <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      Palavra-Chave Primária
                    </span>
                    <span className="text-xs text-slate-400">Intenção: {result.keywords.primary.searchIntent}</span>
                  </div>

                  <button
                    onClick={handleCopyKeywordsCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    {copiedId === 'keywords_csv' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">CSV Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-pink-400" />
                        <span>Copiar Todas em CSV</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      "{result.keywords.primary.keyword}"
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Termo central para usar no H1, Title Tag, primeiro parágrafo da descrição e slug da URL.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Volume Estimado</div>
                      <div className="text-xs font-bold text-emerald-400">
                        {result.keywords.primary.estimatedVolume}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Concorrência</div>
                      <div className="text-xs font-bold text-amber-400 uppercase">
                        {result.keywords.primary.competition}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">CPC Médio</div>
                      <div className="text-xs font-bold text-slate-200">
                        {result.keywords.primary.cpcEstimate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary & Long-Tail Keywords Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Secondary Keywords */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-pink-400" />
                      Palavras Secundárias (Cluster)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Para H2 e Subtítulos</span>
                  </div>

                  <div className="space-y-2">
                    {result.keywords.secondary.map((kw: ProductKeywordItem, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">{kw.keyword}</p>
                          <span className="text-[10px] text-slate-400">
                            {kw.estimatedVolume} · Intenção: {kw.searchIntent}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(kw.keyword, `sec_${idx}`)}
                          className="text-slate-400 hover:text-white p-1"
                          title="Copiar"
                        >
                          {copiedId === `sec_${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Long-Tail Keywords */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                      Cauda Longa (Alta Conversão)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Menor concorrência</span>
                  </div>

                  <div className="space-y-2">
                    {result.keywords.longTail.map((kw: ProductKeywordItem, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">{kw.keyword}</p>
                          <span className="text-[10px] text-slate-400">
                            {kw.estimatedVolume} · CPC: {kw.cpcEstimate}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(kw.keyword, `long_${idx}`)}
                          className="text-slate-400 hover:text-white p-1"
                          title="Copiar"
                        >
                          {copiedId === `long_${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* VTEX Internal Search Synonyms & Typos */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        Sinônimos para Busca Interna da Loja VTEX
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Termos recomendados para cadastrar no Admin VTEX em{' '}
                        <strong className="text-slate-300">Catálogo &gt; Produtos &gt; Palavras Substitutas</strong> ou no Intelligent Search
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.keywords.vtexInternalSearchTerms.map((term, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-pink-300 font-mono">
                            {term.term}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {term.field}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{term.reason}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(term.term, `vtex_kw_${i}`)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedId === `vtex_kw_${i}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* People Also Ask (Perguntas Frequentes do Google) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-white">
                    Perguntas Mais Buscadas pelos Clientes (People Also Ask)
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {result.keywords.questionsPeopleAsk.map((q, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-pink-400 font-bold">?</span>
                        {q}
                      </span>
                      <button
                        onClick={() => handleCopy(q, `q_${i}`)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedId === `q_${i}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Guia de Aplicação no VTEX CMS Legacy */}
          {activeResultTab === 'vtex_guide' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-pink-400" />
                  Como Publicar este Conteúdo no VTEX CMS Legacy (Portal)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Passo a passo exato para cadastrar no Admin do Portal tradicional da VTEX
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
                    <span className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px] border border-pink-500/40">
                      1
                    </span>
                    Cadastro do Produto no Catálogo
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Acesse <strong className="text-slate-200">Admin VTEX &gt; Catálogo &gt; Produtos e SKUs</strong>. Cole o{' '}
                    <strong className="text-slate-200">Título Otimizado</strong> no campo <em>Nome do Produto</em> e a{' '}
                    <strong className="text-slate-200">Descrição em HTML</strong> no campo <em>Descrição do Produto</em>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
                    <span className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px] border border-pink-500/40">
                      2
                    </span>
                    Subtemplate de PDP (CMS &gt; Layout &gt; HTML Templates)
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    No seu subtemplate de página de produto (PDP), verifique se o controle nativo da VTEX está presente:
                  </p>
                  <pre className="ml-7 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                    {result.vtexLegacyIntegrationGuide.subtemplateSnippet}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
                    <span className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px] border border-pink-500/40">
                      3
                    </span>
                    Gerenciador de URL 301 & Sitemaps
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Certifique-se de que a rota canônica{' '}
                    <code className="text-emerald-300 font-mono text-[11px]">/{result.seoTags.canonicalSlug}</code>{' '}
                    está ativa e incluída no seu <strong className="text-slate-200">sitemap-product-1.xml</strong> sem barras no final.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
