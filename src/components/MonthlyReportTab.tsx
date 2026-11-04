import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { monthlyComparativeReports } from '../data/mockStoreData';

export const MonthlyReportTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('oct26');
  const report = monthlyComparativeReports;

  const metricsList = [
    { key: 'revenue', label: 'Faturamento / Receita Total', data: report.metrics.revenue, prefix: 'R$ ', isUpBetter: true },
    { key: 'conversionRate', label: 'Taxa de Conversão da Loja', data: report.metrics.conversionRate, suffix: '%', isUpBetter: true },
    { key: 'orders', label: 'Pedidos Faturados no Checkout VTEX', data: report.metrics.orders, suffix: ' pedidos', isUpBetter: true },
    { key: 'sessions', label: 'Sessões / Visitantes Totais (GA4)', data: report.metrics.sessions, suffix: ' sessões', isUpBetter: true },
    { key: 'organicClicks', label: 'Cliques Orgânicos (Search Console)', data: report.metrics.organicClicks, suffix: ' cliques', isUpBetter: true },
    { key: 'averageOrderValue', label: 'Ticket Médio (AOV)', data: report.metrics.averageOrderValue, prefix: 'R$ ', isUpBetter: true },
    { key: 'cartAbandonment', label: 'Taxa de Abandono de Carrinho VTEX', data: report.metrics.cartAbandonment, suffix: '%', isUpBetter: false },
    { key: 'bounceRate', label: 'Taxa de Rejeição Geral', data: report.metrics.bounceRate, suffix: '%', isUpBetter: false },
    { key: 'lcpSeconds', label: 'Core Web Vitals - LCP', data: report.metrics.lcpSeconds, suffix: 's', isUpBetter: false },
    { key: 'geoScore', label: 'Score de Presença GEO (IAs)', data: report.metrics.geoScore, suffix: ' pts', isUpBetter: true },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `Métrica,${report.previousMonthName},${report.monthName},Variação Absoluta,Variação %\n`;

    metricsList.forEach((m) => {
      const deltaAbs = m.data.current - m.data.previous;
      const deltaPct = (((m.data.current - m.data.previous) / m.data.previous) * 100).toFixed(2);
      csvContent += `"${m.label}",${m.data.previous},${m.data.current},${deltaAbs.toFixed(2)},${deltaPct}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_comparativo_${report.monthName.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 print:p-0 print:space-y-4">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-pink-400 font-medium">
            <FileText className="w-3.5 h-3.5" />
            <span>RELATÓRIOS MENSAIS COMPARATIVOS (MoM)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Comparativo Mensal: {report.monthName} vs {report.previousMonthName}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Visão executiva com variação percentual de faturamento, SEO, Search Console, GEO e conversão no e-commerce.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 print:hidden">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Comparative Highlights & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Positives */}
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>Ganhos & Destaques Positivos do Mês</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.highlights.map((hl, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Pontos Críticos & Riscos de Queda</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.mainRisks.map((rk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>{rk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full Comparative Table */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-base font-semibold text-white">
            Tabela Analítica Month-over-Month (MoM)
          </h2>
          <span className="text-xs text-slate-400 font-mono-numbers">Período: Últimos 30 dias fechados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 font-semibold">Indicador de Performance</th>
                <th className="py-3 px-3 text-right font-semibold">{report.previousMonthName}</th>
                <th className="py-3 px-3 text-right font-semibold">{report.monthName}</th>
                <th className="py-3 px-3 text-right font-semibold">Diferença Absoluta</th>
                <th className="py-3 px-3 text-right font-semibold">Variação %</th>
                <th className="py-3 px-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
              {metricsList.map((m) => {
                const deltaAbs = m.data.current - m.data.previous;
                const deltaPct = Number((((m.data.current - m.data.previous) / m.data.previous) * 100).toFixed(2));
                const isImproved = m.isUpBetter ? deltaPct > 0.5 : deltaPct < -0.5;
                const isDegraded = m.isUpBetter ? deltaPct < -0.5 : deltaPct > 0.5;

                const formatMetric = (val: number) => {
                  let formatted = val.toLocaleString('pt-BR', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: val % 1 !== 0 ? 2 : 0,
                  });
                  if (m.prefix) formatted = `${m.prefix}${formatted}`;
                  if (m.suffix) formatted = `${formatted}${m.suffix}`;
                  return formatted;
                };

                return (
                  <tr key={m.key} className="hover:bg-slate-900/50">
                    <td className="py-3.5 px-3 font-sans font-semibold text-white">{m.label}</td>
                    <td className="py-3.5 px-3 text-right text-slate-400">{formatMetric(m.data.previous)}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-white">{formatMetric(m.data.current)}</td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      {deltaAbs > 0 ? '+' : ''}
                      {deltaAbs.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div
                        className={`inline-flex items-center gap-0.5 font-bold ${
                          isImproved ? 'text-emerald-400' : isDegraded ? 'text-rose-400' : 'text-slate-400'
                        }`}
                      >
                        {deltaPct > 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : deltaPct < 0 ? (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        ) : null}
                        <span>{deltaPct > 0 ? '+' : ''}{deltaPct}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`text-[11px] font-sans font-medium px-2 py-0.5 rounded ${
                          isImproved
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : isDegraded
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isImproved ? 'Melhorou' : isDegraded ? 'Queda' : 'Estável'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
