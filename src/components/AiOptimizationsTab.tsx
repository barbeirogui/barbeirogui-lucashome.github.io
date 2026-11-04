import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Filter,
} from 'lucide-react';
import { OptimizationSuggestion } from '../types';

interface AiOptimizationsTabProps {
  suggestions: OptimizationSuggestion[];
  onRefreshAi: () => Promise<void>;
  isLoadingAi: boolean;
  onUpdateStatus: (id: string, status: 'pendente' | 'em_progresso' | 'aplicado') => void;
  aiSource?: string;
}

export const AiOptimizationsTab: React.FC<AiOptimizationsTabProps> = ({
  suggestions,
  onRefreshAi,
  isLoadingAi,
  onUpdateStatus,
  aiSource,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todas as Otimizações' },
    { id: 'Checkout/Conversão', label: 'Checkout & Conversão' },
    { id: 'SEO', label: 'SEO Técnico' },
    { id: 'GEO', label: 'GEO (IA Search)' },
    { id: 'VTEX CMS', label: 'VTEX CMS (Portal)' },
    { id: 'Search Console', label: 'Search Console' },
  ];

  const filteredSuggestions = suggestions.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const appliedCount = suggestions.filter((s) => s.status === 'aplicado').length;

  return (
    <div className="space-y-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-pink-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SUGESTÕES AUTOMÁTICAS DE OTIMIZAÇÃO (GEMINI 3.8 FLASH)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Plano de Otimização Prática para Alavancar a Conversão no VTEX CMS Legacy
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Recomendações técnicas geradas por IA a partir dos dados do seu e-commerce, com instruções passo a passo
            específicas para o VTEX CMS Legacy (HTML Templates, Subtemplates, Gerenciador de Arquivos e Checkout v6).
          </p>
        </div>

        <button
          onClick={onRefreshAi}
          disabled={isLoadingAi}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 disabled:bg-pink-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
          <span>{isLoadingAi ? 'Analisando Loja com IA...' : 'Gerar Novas Otimizações com IA'}</span>
        </button>
      </div>

      {/* Progress & AI Source Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono-numbers">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {appliedCount} de {suggestions.length} Otimizações Aplicadas
            </span>
          </div>
          <span className="text-slate-500" aria-hidden="true">·</span>
          <span className="text-slate-400">
            Motor: <strong className="text-pink-400">{aiSource === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash (VTEX Legacy Engine)' : 'Motor Especialista VTEX Legacy CRO'}</strong>
          </span>
        </div>

        <div className="text-slate-400 font-mono-numbers">
          Potencial acumulado: <strong className="text-emerald-400">+1.85% na Taxa de Conversão</strong>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-slate-800 text-pink-400 font-semibold border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Suggestions List */}
      <div className="space-y-6">
        {filteredSuggestions.map((item) => {
          const isApplied = item.status === 'aplicado';
          const isInProgress = item.status === 'em_progresso';

          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition-all ${
                isApplied
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : item.priority === 'Alta'
                  ? 'border-slate-800 bg-slate-900/50 hover:border-pink-500/30'
                  : 'border-slate-800 bg-slate-900/30'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-pink-400">{item.category}</span>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    <span className="text-xs text-slate-400">Módulo VTEX: <strong className="text-slate-200">{item.vtexModule}</strong></span>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    <span className="text-xs text-slate-400">Prioridade: <strong className={item.priority === 'Alta' ? 'text-rose-400' : 'text-amber-400'}>{item.priority}</strong></span>
                  </div>
                  <h2 className="text-base font-bold text-white leading-snug">
                    {item.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Uplift Estimado</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono-numbers">
                      {item.estimatedConversionUplift}
                    </span>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => {
                      const nextStatus = isApplied
                        ? 'pendente'
                        : isInProgress
                        ? 'aplicado'
                        : 'em_progresso';
                      onUpdateStatus(item.id, nextStatus);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                      isApplied
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : isInProgress
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Aplicado</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Em Progresso</span>
                      </>
                    ) : (
                      <span>Marcar como Feito</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Problem Diagnosis */}
              <div className="mt-4 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Diagnóstico do Problema:</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.problemSummary}
                </p>
              </div>

              {/* Action Steps */}
              <div className="mt-4 space-y-2">
                <span className="text-xs font-semibold text-slate-400">Passo a Passo de Implementação na VTEX:</span>
                <ol className="space-y-1.5">
                  {item.actionSteps.map((step, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-pink-400 font-mono-numbers text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Code / Snippet if available */}
              {item.codeSnippet && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-pink-400" />
                      <span>Snippet de Código / Configuração Pronta:</span>
                    </span>
                    <button
                      onClick={() => handleCopyCode(item.id, item.codeSnippet!)}
                      className="flex items-center gap-1 text-[11px] font-medium text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      {copiedCodeId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 overflow-x-auto text-[11px] font-mono text-slate-300 max-h-48 leading-relaxed">
                    {item.codeSnippet}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
