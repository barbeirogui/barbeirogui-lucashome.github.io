import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Bot,
} from 'lucide-react';
import { MetricPoint, calculateStoreHealthScore, calculateConversionOpportunity } from '../utils/metricsEngine';
import { MetricCard } from './MetricCard';
import { checkoutFunnelData } from '../data/mockStoreData';
import { TabType } from './Header';

interface OverviewTabProps {
  metrics: MetricPoint[];
  onNavigateTab: (tab: TabType) => void;
  onOpenSetup: () => void;
  isVtexConnected: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  onNavigateTab,
  onOpenSetup,
  isVtexConnected,
}) => {
  const [upliftDelta, setUpliftDelta] = useState<number>(0.4);

  // Conversion rate metric
  const crMetric = metrics.find((m) => m.id === 'conversion_rate');
  const currentCR = crMetric ? crMetric.currentValue : 2.38;

  // Conversion calculator: 142.500 monthly sessions, current CR, R$ 247,60 AOV
  const opportunity = calculateConversionOpportunity(142500, currentCR, 247.6, upliftDelta);

  // Store Health Score
  const healthScore = calculateStoreHealthScore({
    technicalSeoScore: 78,
    geoAiVisibilityScore: 82,
    coreWebVitalsScore: 68, // Pulled down by LCP 3.4s
    gscIndexationRate: 94,
    catalogCompletenessScore: 88,
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Store Status */}
      {!isVtexConnected && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h2 className="text-sm font-semibold text-white">VTEX não conectada</h2>
              <p className="text-xs text-slate-300">
                Insira sua chave (AppKey) e token (AppToken) da VTEX para sincronizar estatísticas em tempo real.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSetup}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg whitespace-nowrap transition-colors"
          >
            Conectar Agora
          </button>
        </div>
      )}

      {/* Health Score & Executive Summary */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-pink-400">Auditoria Executiva Centralizada</span>
            <span className="text-xs text-slate-500" aria-hidden="true">·</span>
            <span className="text-xs text-slate-400">VTEX CMS Legacy (Portal) + GSC + GA4 + GEO</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Saúde & Potencial de Conversão do E-commerce
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Identificamos uma <strong className="text-rose-400">queda de 17.6% na conversão</strong> no último período,
            acompanhada de aumento no LCP (3.4s). Nossas sugestões com IA estimam um potencial de recuperação de até{' '}
            <strong className="text-emerald-400">+R$ 141.000/mês</strong> aplicando correções de checkout, schema e SEO.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('ai-suggestions')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ver Sugestões de IA para Conversão</span>
            </button>
            <button
              onClick={() => onNavigateTab('chat')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              <Bot className="w-3.5 h-3.5 text-pink-400" />
              <span>Consultar Especialista IA (Chat)</span>
            </button>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Ver 2 Alertas Críticos de Queda</span>
            </button>
          </div>
        </div>

        {/* Score Ring */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-slate-400 mb-1">Índice Geral de Performance</span>
          <div className="relative flex items-center justify-center my-2">
            <div className="text-4xl font-extrabold text-white font-mono-numbers tracking-tight">
              {healthScore}
              <span className="text-lg text-slate-400 font-normal">/100</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 my-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 65 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 w-full mt-2 pt-2 border-t border-slate-800">
            <span>SEO Técnico: <strong className="text-slate-200">78%</strong></span>
            <span>GEO IA: <strong className="text-slate-200">82%</strong></span>
            <span>Indexação: <strong className="text-slate-200">94%</strong></span>
            <span>Vitals LCP: <strong className="text-rose-400">68%</strong></span>
          </div>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-pink-400" />
            <span>Métricas Críticas de Desempenho (Mês Atual vs Anterior)</span>
          </h2>
          <span className="text-xs text-slate-400">Clique no card para abrir o módulo detalhado</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              onClick={() => {
                if (metric.category === 'seo') onNavigateTab('seo');
                else if (metric.category === 'geo') onNavigateTab('geo');
                else if (metric.category === 'gsc') onNavigateTab('gsc');
                else if (metric.category === 'conversion') onNavigateTab('analytics');
                else if (metric.category === 'vtex') onNavigateTab('analytics');
                else onNavigateTab('monthly-reports');
              }}
            />
          ))}
        </div>
      </div>

      {/* VTEX Checkout Funnel & Dropout Analysis */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" />
              <span>Funil de Conversão VTEX & Atrito de Abandono</span>
            </h2>
            <p className="text-xs text-slate-400">
              Análise dos pontos exatos de fuga de visitantes entre a PDP e o Pedido Faturado no checkout VTEX.
            </p>
          </div>
          <span className="text-xs text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20 font-mono-numbers">
            Abandono no Frete/Pagamento: 67.9%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 pt-2">
          {checkoutFunnelData.map((stage, idx) => (
            <div
              key={stage.stage}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>{stage.stage}</span>
                </div>
                <div className="text-xl font-bold text-white font-mono-numbers mb-1">
                  {stage.visitors.toLocaleString('pt-BR')}
                </div>
                <div className="text-[11px] text-slate-400 mb-3">
                  {idx === 0 ? 'Visitantes únicos' : `${stage.conversionToNext}% continuaram`}
                </div>
              </div>

              {stage.dropoffRate > 0 && (
                <div className="pt-2 border-t border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex justify-between text-rose-400">
                    <span>Queda:</span>
                    <strong className="font-mono-numbers">{stage.dropoffRate}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Perda est.:</span>
                    <strong className="text-slate-300 font-mono-numbers">
                      R$ {(stage.revenuePotentialLoss / 1000).toFixed(0)}k
                    </strong>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Uplift Simulator */}
      <div className="p-6 rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-950/20 via-slate-900/60 to-slate-900/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-pink-400 tracking-wide">
                SIMULADOR DE RECEITA VTEX
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Impacto Financeiro ao Otimizar a Taxa de Conversão
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Ajuste o incremento percentual para projetar o faturamento adicional baseado no tráfego atual (142.500 sessões e R$ 247,60 de Ticket Médio).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Meta de Uplift:</span>
            <span className="text-base font-bold text-pink-400 font-mono-numbers">
              +{upliftDelta.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.05"
            value={upliftDelta}
            onChange={(e) => setUpliftDelta(parseFloat(e.target.value))}
            className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            aria-label="Ajustar incremento de taxa de conversão"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono-numbers">
            <span>+0.10% (Correções básicas)</span>
            <span>+0.40% (Recomendações IA VTEX)</span>
            <span>+1.00% (Checkout 1-Click + Vitals)</span>
            <span>+1.50% (Potencial máximo)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400">Taxa Atual → Projetada</span>
            <div className="text-lg font-bold text-white font-mono-numbers mt-1">
              {currentCR}% → <span className="text-pink-400">{opportunity.targetCRPercent}%</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400">Novos Pedidos/Mês</span>
            <div className="text-lg font-bold text-emerald-400 font-mono-numbers mt-1">
              +{opportunity.additionalOrders.toLocaleString('pt-BR')} pedidos
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400">Receita Mensal Projetada</span>
            <div className="text-lg font-bold text-white font-mono-numbers mt-1">
              R$ {opportunity.projectedRevenueBRL.toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 bg-emerald-950/10">
            <span className="text-xs text-emerald-400 font-semibold">Ganho Financeiro Adicional</span>
            <div className="text-lg font-bold text-emerald-400 font-mono-numbers mt-1">
              +R$ {opportunity.additionalRevenueBRL.toLocaleString('pt-BR')} /mês
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
