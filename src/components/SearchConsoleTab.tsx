import React, { useState } from 'react';
import {
  Search,
  Zap,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { gscKeywordsData } from '../data/mockStoreData';
import { GscKeyword } from '../types';

export const SearchConsoleTab: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredKeywords = gscKeywordsData.filter((k) => {
    if (filterType !== 'all' && k.opportunityType !== filterType) return false;
    if (searchQuery && !k.query.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-pink-400 font-medium">
          <Search className="w-3.5 h-3.5" />
          <span>GOOGLE SEARCH CONSOLE (GSC)</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Performance Orgânica, Consultas & Oportunidades Rápidas (Low-Hanging Fruits)
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Estatísticas de cliques, impressões e palavras-chave onde pequenos ajustes de Title Tag e Rich Snippets
          geram ganhos imediatos de tráfego qualificado para o e-commerce VTEX.
        </p>
      </div>

      {/* GSC KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">Total de Cliques Orgânicos</span>
          <div className="text-3xl font-bold text-white font-mono-numbers mt-1">
            148.200
          </div>
          <span className="text-[11px] text-rose-400 font-mono-numbers mt-1 block">
            -10.4% em relação ao mês anterior
          </span>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">Total de Impressões no Google</span>
          <div className="text-3xl font-bold text-white font-mono-numbers mt-1">
            2.480.000
          </div>
          <span className="text-[11px] text-emerald-400 font-mono-numbers mt-1 block">
            +3.8% de alcance em termos de busca
          </span>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">CTR Médio (Taxa de Cliques)</span>
          <div className="text-3xl font-bold text-white font-mono-numbers mt-1">
            5.98%
          </div>
          <span className="text-[11px] text-slate-400 font-mono-numbers mt-1 block">
            Média segmento vestuário/calçados: 4.8%
          </span>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">Posição Média no Google</span>
          <div className="text-3xl font-bold text-white font-mono-numbers mt-1">
            6.4
          </div>
          <span className="text-[11px] text-slate-400 font-mono-numbers mt-1 block">
            Top 3 em 18% das palavras-chave
          </span>
        </div>
      </div>

      {/* Low Hanging Fruits Highlight Box */}
      <div className="p-5 rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-950/20 via-slate-900/60 to-slate-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white">
              Oportunidade de Tráfego: Consultas com Alta Impressão e Baixo CTR
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Identificamos 14 palavras-chave na página 1 do Google com mais de 80.000 impressões onde o CTR está abaixo de 4%.
            Adicionar gatilhos de preço ("a partir de R$ 199", "Frete Grátis") no Title Tag pode gerar até +12.000 cliques/mês.
          </p>
        </div>
        <button
          onClick={() => setFilterType('low-hanging')}
          className="px-4 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-sm whitespace-nowrap transition-colors shrink-0"
        >
          Filtrar Low-Hanging Fruits
        </button>
      </div>

      {/* Keywords Table with Filters */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar palavra-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filterType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType('low-hanging')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filterType === 'low-hanging' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Low-Hanging Fruit
            </button>
            <button
              onClick={() => setFilterType('cannibalized')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filterType === 'cannibalized' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Canibalização
            </button>
            <button
              onClick={() => setFilterType('declining')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filterType === 'declining' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Em Queda
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Palavra-Chave / Consulta</th>
                <th className="py-2.5 px-3 font-semibold text-right">Cliques</th>
                <th className="py-2.5 px-3 font-semibold text-right">Impressões</th>
                <th className="py-2.5 px-3 font-semibold text-right">CTR</th>
                <th className="py-2.5 px-3 font-semibold text-right">Posição</th>
                <th className="py-2.5 px-3 font-semibold">Tipo de Oportunidade</th>
                <th className="py-2.5 px-3 font-semibold">Ação Recomendada na VTEX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredKeywords.map((kw: GscKeyword, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="py-3 px-3 font-semibold text-white">
                    {kw.query}
                  </td>
                  <td className="py-3 px-3 text-right font-mono-numbers text-white">
                    {kw.clicks.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono-numbers text-slate-400">
                    {kw.impressions.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono-numbers">
                    <span
                      className={
                        kw.ctr > 6 ? 'text-emerald-400 font-semibold' : kw.ctr < 4 ? 'text-amber-400' : 'text-slate-300'
                      }
                    >
                      {kw.ctr.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono-numbers font-semibold text-pink-400">
                    #{kw.position.toFixed(1)}
                  </td>
                  <td className="py-3 px-3">
                    {kw.opportunityType === 'low-hanging' ? (
                      <span className="text-pink-400 font-medium">⚡ Ganho Rápido</span>
                    ) : kw.opportunityType === 'cannibalized' ? (
                      <span className="text-amber-400 font-medium">⚠️ Canibalizada</span>
                    ) : kw.opportunityType === 'declining' ? (
                      <span className="text-rose-400 font-medium">🔻 Em Queda</span>
                    ) : (
                      <span className="text-emerald-400 font-medium">⭐ Destaque</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {kw.suggestedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
