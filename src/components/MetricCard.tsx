import React from 'react';
import { ArrowUpRight, ArrowDownRight, AlertOctagon } from 'lucide-react';
import { MetricPoint, calculateComparison } from '../utils/metricsEngine';

interface MetricCardProps {
  metric: MetricPoint;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, onClick }) => {
  const comp = calculateComparison(metric);

  const formatValue = (val: number, unit: string) => {
    if (unit === 'currency') {
      return `R$ ${val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
    }
    if (unit === '%') {
      return `${val.toFixed(2)}%`;
    }
    if (unit === 's') {
      return `${val.toFixed(2)}s`;
    }
    if (unit === 'score') {
      return `${val}/100`;
    }
    return val.toLocaleString('pt-BR');
  };

  const isPositiveChange = comp.status === 'improved';
  const isNegativeChange = comp.status === 'degraded';

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border bg-slate-900/60 transition-all ${
        comp.isCriticalDrop
          ? 'border-rose-500/50 bg-rose-950/10 hover:border-rose-400'
          : 'border-slate-800 hover:border-slate-700'
      } ${onClick ? 'cursor-pointer hover:bg-slate-900/80' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-slate-400 leading-snug">
          {metric.name}
        </span>
        {comp.isCriticalDrop && (
          <span
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 whitespace-nowrap"
            title="Queda brusca além do limite tolerado"
          >
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            <span>Queda Crítica</span>
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3 mt-1">
        <div className="text-2xl font-bold tracking-tight text-white font-mono-numbers">
          {formatValue(metric.currentValue, metric.unit)}
        </div>

        <div
          className={`flex items-center text-xs font-semibold font-mono-numbers ${
            isPositiveChange
              ? 'text-emerald-400'
              : isNegativeChange
              ? 'text-rose-400'
              : 'text-slate-400'
          }`}
        >
          {comp.deltaPercent > 0 ? (
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
          ) : comp.deltaPercent < 0 ? (
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
          ) : null}
          <span>
            {comp.deltaPercent > 0 ? '+' : ''}
            {comp.deltaPercent}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
        <span>Anterior: <strong className="text-slate-300 font-mono-numbers">{formatValue(metric.previousValue, metric.unit)}</strong></span>
        <span className="capitalize">{metric.category}</span>
      </div>
    </div>
  );
};
