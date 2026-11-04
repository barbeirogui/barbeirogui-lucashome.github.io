import React from 'react';
import {
  BarChart3,
  Smartphone,
  Monitor,
  MapPin,
  TrendingDown,
  Clock,
  CreditCard,
  Truck,
} from 'lucide-react';
import { regionalConversionData, devicePerformanceData } from '../data/mockStoreData';

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-pink-400 font-medium">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>ANALYTICS & CONVERSÃO (GA4 + VTEX OMS)</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Comportamento de Compra, Dispositivos & Atrito Regional no E-commerce
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Dados profundos de navegação cruzando Google Analytics 4 com pedidos reais faturados na VTEX,
          revelando gaps entre mobile e desktop e atritos no checkout.
        </p>
      </div>

      {/* Device Gap Highlight (Mobile vs Desktop) */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">
              O Gap Mobile vs Desktop (Maior Oportunidade de CRO)
            </h2>
            <p className="text-xs text-slate-400">
              O mobile concentra 78.5% do tráfego, mas converte quase metade do desktop. Fechar esse gap em +0.5% gera +R$ 115k/mês.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Mobile Card */}
          <div className="p-5 rounded-xl border border-rose-500/30 bg-slate-950/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Smartphone className="w-4 h-4 text-pink-400" />
                <span>Mobile (Smartphones)</span>
              </div>
              <span className="text-xs text-slate-400 font-mono-numbers">78.5% do Tráfego</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400">Taxa Conversão</span>
                <div className="text-xl font-bold text-rose-400 font-mono-numbers mt-0.5">
                  1.98%
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">LCP Médio</span>
                <div className="text-xl font-bold text-amber-400 font-mono-numbers mt-0.5">
                  3.6s
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Rejeição</span>
                <div className="text-xl font-bold text-slate-200 font-mono-numbers mt-0.5">
                  52.4%
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 pt-1">
              <strong>Gargalos:</strong> Carrossel de imagens pesado, teclado não abrindo numérico para CEP/CPF e botão "Finalizar Compra" fora da primeira dobra (viewport).
            </p>
          </div>

          {/* Desktop Card */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-slate-950/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span>Desktop (Computadores)</span>
              </div>
              <span className="text-xs text-slate-400 font-mono-numbers">21.5% do Tráfego</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400">Taxa Conversão</span>
                <div className="text-xl font-bold text-emerald-400 font-mono-numbers mt-0.5">
                  3.84%
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">LCP Médio</span>
                <div className="text-xl font-bold text-emerald-400 font-mono-numbers mt-0.5">
                  1.9s
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Rejeição</span>
                <div className="text-xl font-bold text-slate-200 font-mono-numbers mt-0.5">
                  32.1%
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 pt-1">
              <strong>Desempenho:</strong> Conversão saudável acima da média do setor. Ticket Médio R$ 284,00 com maior número de itens por pedido (1.9 itens).
            </p>
          </div>
        </div>
      </div>

      {/* Cart Abandonment Root Causes */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <h2 className="text-base font-semibold text-white">
          Diagnóstico de Abandono de Carrinho no Checkout VTEX (71.4%)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <Truck className="w-4 h-4 shrink-0" />
              <span>48% Custo & Prazo de Frete</span>
            </div>
            <p className="text-xs text-slate-300">
              Usuários abandonam ao calcular frete para regiões fora de SP/RJ onde o valor supera 20% do produto.
            </p>
            <span className="text-[11px] text-pink-400 block pt-1">
              Solução VTEX: Barra de progresso para Frete Grátis no Minicart.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>28% Falta de Destaque do PIX</span>
            </div>
            <p className="text-xs text-slate-300">
              64% dos clientes compram via PIX, mas a opção exige múltiplos cliques no checkout VTEX nativo.
            </p>
            <span className="text-[11px] text-pink-400 block pt-1">
              Solução VTEX: PIX pré-selecionado com 5% de desconto visível.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
              <Clock className="w-4 h-4 shrink-0" />
              <span>24% Lentidão de Validação</span>
            </div>
            <p className="text-xs text-slate-300">
              Lentidão na consulta do orderForm da VTEX ao trocar endereço ou aplicar cupom.
            </p>
            <span className="text-[11px] text-pink-400 block pt-1">
              Solução VTEX: Otimizar chamadas assíncronas no checkout6-custom.js.
            </span>
          </div>
        </div>
      </div>

      {/* Regional Conversion Breakdown */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-400" />
              <span>Desempenho Geográfico & Faturamento por Região</span>
            </h2>
            <p className="text-xs text-slate-400">
              Conversão e receita por estado/região da sua loja VTEX.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Região / Estado</th>
                <th className="py-2.5 px-3 font-semibold text-right">Sessões</th>
                <th className="py-2.5 px-3 font-semibold text-right">Taxa de Conversão</th>
                <th className="py-2.5 px-3 font-semibold text-right">Faturamento</th>
                <th className="py-2.5 px-3 font-semibold">Status de Logística VTEX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {regionalConversionData.map((reg, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="py-3 px-3 font-semibold text-white">{reg.region}</td>
                  <td className="py-3 px-3 text-right font-mono-numbers text-slate-300">
                    {reg.sessions.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono-numbers">
                    <span
                      className={`font-semibold ${
                        reg.cr >= 2.5
                          ? 'text-emerald-400'
                          : reg.cr >= 2.0
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {reg.cr.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono-numbers text-white font-semibold">
                    R$ {reg.revenue.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {reg.cr >= 2.5 ? (
                      <span className="text-emerald-400 font-medium">Entrega Expressa / SLA Alto</span>
                    ) : (
                      <span className="text-amber-400 font-medium">SLA Padrão / Custo Alto de Frete</span>
                    )}
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
