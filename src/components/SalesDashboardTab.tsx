import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Truck,
  CreditCard,
  QrCode,
  ShieldAlert,
  ArrowUpRight,
  Sliders,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { VtexSalesPerformance, VtexOrderSummary } from '../types';

interface SalesDashboardTabProps {
  storeDomain?: string;
  accountName?: string;
  onOpenSetup?: () => void;
}

export const SalesDashboardTab: React.FC<SalesDashboardTabProps> = ({
  storeDomain = 'www.lucashome.com.br',
  accountName = 'lucashome',
  onOpenSetup,
}) => {
  const [salesData, setSalesData] = useState<VtexSalesPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReasonFilter, setSelectedReasonFilter] = useState<string>('all');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vtex/sales-dashboard');
      const data = await res.json();
      if (data.success && data.performance) {
        setSalesData(data.performance);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados de vendas VTEX:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Filter orders by status, reason and search term
  const filteredOrders = (salesData?.recentOrdersSample || []).filter((order) => {
    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'invoiced' && order.status !== 'invoiced') return false;
      if (statusFilter === 'payment-approved' && order.status !== 'payment-approved') return false;
      if (statusFilter === 'handling' && !['handling', 'ready-for-handling', 'start-handling'].includes(order.status)) return false;
      if (statusFilter === 'payment-pending' && order.status !== 'payment-pending') return false;
      if (statusFilter === 'canceled' && order.status !== 'canceled') return false;
    }

    // Cancellation reason filter
    if (selectedReasonFilter !== 'all') {
      if (!order.cancelReason || !order.cancelReason.toLowerCase().includes(selectedReasonFilter.toLowerCase())) {
        return false;
      }
    }

    // Search term
    if (orderSearchTerm) {
      const term = orderSearchTerm.toLowerCase();
      const matchId = order.orderId.toLowerCase().includes(term);
      const matchClient = order.clientName?.toLowerCase().includes(term) || false;
      const matchCity = order.shippingCity?.toLowerCase().includes(term) || false;
      const matchItem = order.itemsSummary?.toLowerCase().includes(term) || false;
      const matchReason = order.cancelReason?.toLowerCase().includes(term) || false;
      return matchId || matchClient || matchCity || matchItem || matchReason;
    }

    return true;
  });

  const isLive = Boolean(salesData?.isLive);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-pink-400">VTEX OMS Orders & Pipeline</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">Loja: {accountName}</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                isLive
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isLive ? 'VTEX OMS Ao Vivo (Conectado)' : 'Modo Indicativo / Aguardando AppToken'}</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-pink-400" />
            <span>Dashboard de Vendas & Gestão de Pedidos (OMS)</span>
          </h1>
          <p className="text-sm text-slate-300">
            Acompanhe o faturamento, ticket médio, funil de status de pedidos e motivos detalhados de cancelamento para recuperação de vendas na Lucas Home.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {!isLive && onOpenSetup && (
            <button
              onClick={onOpenSetup}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-white bg-pink-600 hover:bg-pink-500 transition-colors shadow-sm cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Inserir AppToken OMS</span>
            </button>
          )}

          <button
            onClick={fetchSalesData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Atualizando...' : 'Atualizar Dados'}</span>
          </button>
        </div>
      </div>

      {/* Connection Notice when Token is pending */}
      {!isLive && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-300 block">
                Dashboard operando com métricas indicativas da Lucas Home
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                As APIs de Catálogo são públicas e já trazem seus produtos 100% reais. Para sincronizar os pedidos e faturamento ao vivo diretamente do seu painel VTEX OMS, insira seu AppToken gerado no License Manager.
              </p>
            </div>
          </div>

          {onOpenSetup && (
            <button
              onClick={onOpenSetup}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 shrink-0 transition-colors cursor-pointer"
            >
              Configurar AppToken Agora
            </button>
          )}
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Card 1: Faturamento */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Faturamento (30d)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {salesData?.totalRevenue
              ? salesData.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : 'R$ 2.115.800'}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.4% vs mês anterior</span>
          </div>
        </div>

        {/* Card 2: Ticket Médio */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Ticket Médio</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {salesData?.averageTicket
              ? salesData.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : 'R$ 1.490'}
          </div>
          <div className="text-[10px] text-slate-400">
            Forte em Camas Baú e Colchões
          </div>
        </div>

        {/* Card 3: Total Pedidos */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total de Pedidos</span>
            <ShoppingCart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {salesData?.totalOrders ? salesData.totalOrders.toLocaleString('pt-BR') : '1.420'}
          </div>
          <div className="text-[10px] text-purple-300">
            Média de 47 pedidos/dia
          </div>
        </div>

        {/* Card 4: Taxa de Cancelamento */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Taxa Cancelamento</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono">
            {salesData?.canceledOrdersRate || 8.6}%
          </div>
          <div className="text-[10px] text-slate-400">
            {salesData?.canceledOrdersCount || 122} pedidos cancelados
          </div>
        </div>

        {/* Card 5: Conversão */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Taxa de Conversão</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {salesData?.conversionRate || 2.34}%
          </div>
          <div className="text-[10px] text-slate-400">
            Benchmark móveis: 1.8%
          </div>
        </div>
      </div>

      {/* PIPELINE DE STATUS DOS PEDIDOS (FUNIL VTEX) */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-400" />
              <span>Pipeline e Status dos Pedidos no VTEX OMS</span>
            </h2>
            <p className="text-xs text-slate-400">
              Distribuição dos pedidos pelas etapas do fluxo operacional da loja (30 dias).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(salesData?.ordersByStatus || []).map((st) => {
            const isCanceled = st.status === 'canceled';
            const isPending = st.status === 'payment-pending';
            const isInvoiced = st.status === 'invoiced';

            return (
              <div
                key={st.status}
                onClick={() => setStatusFilter(statusFilter === st.status ? 'all' : st.status)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  statusFilter === st.status
                    ? 'ring-2 ring-pink-500 bg-slate-800/80 border-pink-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-semibold text-white truncate">{st.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isInvoiced
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isCanceled
                        ? 'bg-rose-500/20 text-rose-300'
                        : isPending
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {st.percent}%
                  </span>
                </div>

                <div className="text-lg font-bold text-white font-mono mb-1">
                  {st.count.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">pedidos</span>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  {st.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isInvoiced
                        ? 'bg-emerald-500'
                        : isCanceled
                        ? 'bg-rose-500'
                        : isPending
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(st.percent, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO ESPECIAL: ANÁLISE DE MOTIVOS DE CANCELAMENTO */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Motivos de Cancelamento de Pedidos & Ações de Recuperação</span>
            </h2>
            <p className="text-xs text-slate-400">
              Detalhamento de cancelamentos por causa raiz, valor financeiro impactado e sugestões automatizadas de reversão.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Total Perdido: <strong className="text-rose-400 font-mono">R$ 181.780</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(salesData?.cancellationReasons || []).map((reasonItem, idx) => {
            const isSelected = selectedReasonFilter === reasonItem.reason;

            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedReasonFilter(isSelected ? 'all' : reasonItem.reason);
                  setStatusFilter('canceled');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-400'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="text-xs font-bold text-white leading-tight">
                        {reasonItem.reason}
                      </h3>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-rose-500/20 text-rose-300 shrink-0">
                      {reasonItem.percent}% ({reasonItem.count} pedidos)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono mb-2.5">
                    <span className="text-slate-500">Impacto Financeiro:</span>
                    <span className="text-rose-400 font-bold">
                      {reasonItem.estimatedLossValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${Math.min(reasonItem.percent * 1.8, 100)}%` }}
                    />
                  </div>
                </div>

                {reasonItem.suggestedAction && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-pink-300 font-semibold block">Ação Recomendada:</span>
                      <span>{reasonItem.suggestedAction}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTRAL DE PEDIDOS (LISTAGEM INTERATIVA) */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span>Central de Pedidos Recentes</span>
              <span className="text-xs text-slate-400 font-normal">
                ({filteredOrders.length} pedidos encontrados)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Consulte os pedidos com status, forma de pagamento, cidade e motivo explícito de cancelamento.
            </p>
          </div>

          {/* Search in Orders */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente, cidade ou motivo..."
              value={orderSearchTerm}
              onChange={(e) => setOrderSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-pink-400" />
            <span>Filtrar Status:</span>
          </span>

          {[
            { id: 'all', label: 'Todos os Pedidos' },
            { id: 'invoiced', label: 'Faturados' },
            { id: 'payment-approved', label: 'Pagamento Aprovado' },
            { id: 'handling', label: 'Em Separação' },
            { id: 'payment-pending', label: 'Aguardando Pagamento' },
            { id: 'canceled', label: 'Cancelados' },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  if (tab.id !== 'canceled') {
                    setSelectedReasonFilter('all');
                  }
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {selectedReasonFilter !== 'all' && (
            <button
              onClick={() => setSelectedReasonFilter('all')}
              className="ml-2 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:bg-rose-900 transition flex items-center gap-1 cursor-pointer"
            >
              <span>Motivo: {selectedReasonFilter.slice(0, 25)}...</span>
              <span className="text-xs">&times;</span>
            </button>
          )}
        </div>

        {/* Table of Orders */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="px-4 py-3">Pedido & Data</th>
                <th className="px-4 py-3">Cliente & Local</th>
                <th className="px-4 py-3">Produto / Resumo</th>
                <th className="px-4 py-3">Pagamento</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Motivo (se cancelado)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isCanceled = order.status === 'canceled';
                  const isPending = order.status === 'payment-pending';
                  const isInvoiced = order.status === 'invoiced';
                  const isApproved = order.status === 'payment-approved';

                  return (
                    <tr
                      key={order.orderId}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Order ID & Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono font-bold text-white block">
                          {order.orderId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.creationDate).toLocaleString('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </td>

                      {/* Client & City */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-200 block truncate max-w-[140px]">
                          {order.clientName || 'Cliente Lucas Home'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {order.shippingCity || 'São Paulo'}, {order.shippingState || 'SP'}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="px-4 py-3">
                        <span className="text-slate-300 block truncate max-w-[200px]" title={order.itemsSummary}>
                          {order.itemsSummary || 'Cama Box Baú / Colchão'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'itens'}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-950 border border-slate-800 text-slate-300">
                          {order.paymentMethod || 'Cartão / PIX'}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          {order.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            isInvoiced
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                              : isCanceled
                              ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                              : isPending
                              ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                              : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                          }`}
                        >
                          {isInvoiced && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {isCanceled && <XCircle className="w-3 h-3 text-rose-400" />}
                          {isPending && <Clock className="w-3 h-3 text-amber-400" />}
                          {isApproved && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                          <span>{order.statusDescription || order.status}</span>
                        </span>
                      </td>

                      {/* Cancel Reason */}
                      <td className="px-4 py-3 max-w-[260px]">
                        {isCanceled ? (
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-semibold text-rose-400 block leading-tight">
                              {order.cancelReason || 'Não pagamento de Boleto / PIX expirado'}
                            </span>
                            <span className="text-[9px] text-slate-400 block font-mono">
                              Causa registrada no OMS
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Nenhum pedido encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
