import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  ExternalLink,
  Wand2,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  RefreshCw,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  CornerDownRight,
  X,
} from 'lucide-react';
import type { VtexCatalogProduct, VtexSalesPerformance, VtexCategoryTreeItem } from '../types';

interface CatalogSalesTabProps {
  storeDomain?: string;
  accountName?: string;
  onSendProductToIa?: (product: VtexCatalogProduct) => void;
}

export const CatalogSalesTab: React.FC<CatalogSalesTabProps> = ({
  storeDomain = 'www.lucashome.com.br',
  accountName = 'lucashome',
  onSendProductToIa,
}) => {
  // Navigation sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'sales'>('catalog');

  // Products state
  const [products, setProducts] = useState<VtexCatalogProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [totalLoaded, setTotalLoaded] = useState(0);

  // Live Category Tree state
  const [categoriesTree, setCategoriesTree] = useState<VtexCategoryTreeItem[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  // Sales state
  const [salesData, setSalesData] = useState<VtexSalesPerformance | null>(null);
  const [isLoadingSales, setIsLoadingSales] = useState(false);

  // Load live category tree from VTEX API
  const fetchCategoryTree = async () => {
    setIsLoadingTree(true);
    try {
      const res = await fetch('/api/vtex/catalog-categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategoriesTree(data.categories);
      }
    } catch (err) {
      console.warn('Erro ao carregar árvore de categorias VTEX:', err);
    } finally {
      setIsLoadingTree(false);
    }
  };

  // Load products (accepts parent or sub category ID)
  const fetchProducts = async (catId = '', term = '') => {
    setIsLoadingProducts(true);
    try {
      let url = `/api/vtex/catalog-products?_from=0&_to=45`;
      if (catId && catId !== 'all') {
        url += `&categoryId=${encodeURIComponent(catId)}`;
      }
      if (term) {
        url += `&keyword=${encodeURIComponent(term)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
        setTotalLoaded(data.products.length);
      }
    } catch (err) {
      console.warn('Erro ao carregar catálogo da VTEX:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Load sales metrics
  const fetchSales = async () => {
    setIsLoadingSales(true);
    try {
      const res = await fetch('/api/vtex/sales-dashboard');
      const data = await res.json();
      if (data.success && data.performance) {
        setSalesData(data.performance);
      }
    } catch (err) {
      console.warn('Erro ao carregar métricas de vendas:', err);
    } finally {
      setIsLoadingSales(false);
    }
  };

  useEffect(() => {
    fetchCategoryTree();
    fetchProducts();
    fetchSales();
  }, [accountName]);

  // Selected parent category item from live tree
  const activeParentCategoryItem = categoriesTree.find(
    (c) => String(c.id) === selectedParentCategory
  );

  const subCategoriesList = activeParentCategoryItem?.children || [];

  const handleSelectParentCategory = (catId: string) => {
    setSelectedParentCategory(catId);
    setSelectedSubCategory('all');
    fetchProducts(catId === 'all' ? '' : catId, searchTerm);
  };

  const handleSelectSubCategory = (subId: string) => {
    setSelectedSubCategory(subId);
    const targetCatId = subId === 'all' ? selectedParentCategory : subId;
    fetchProducts(targetCatId === 'all' ? '' : targetCatId, searchTerm);
  };

  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.productName.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      (p.productReference && p.productReference.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-400">VTEX Catalog & OMS Intelligence</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">Loja: {accountName}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-pink-400" />
            <span>Catálogo Oficial & Desempenho de Vendas</span>
          </h1>
          <p className="text-sm text-slate-300">
            Acompanhe o catálogo real da Lucas Home conectado via API, audite o SEO de cada produto e envie para o gerador de conteúdo IA com 1 clique.
          </p>
        </div>

        {/* Sub-nav switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'catalog'
                ? 'bg-slate-800 text-pink-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catálogo de Produtos ({totalLoaded})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sales')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'sales'
                ? 'bg-slate-800 text-pink-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dashboard de Vendas</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CATALOG OF PRODUCTS */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-4">
          {/* Controls Bar: Search & Multilevel Category Filter */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome de produto, marca ou ref..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    fetchCategoryTree();
                    fetchProducts(
                      selectedSubCategory !== 'all' ? selectedSubCategory : (selectedParentCategory === 'all' ? '' : selectedParentCategory),
                      searchTerm
                    );
                  }}
                  disabled={isLoadingProducts || isLoadingTree}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${isLoadingProducts || isLoadingTree ? 'animate-spin' : ''}`} />
                  <span>{isLoadingProducts ? 'Atualizando...' : 'Recarregar Catálogo'}</span>
                </button>
              </div>
            </div>

            {/* Level 1: Parent Department Buttons (Loaded live from VTEX API) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-pink-400" />
                  <span>Departamentos Principais da Loja ({categoriesTree.length || 8}):</span>
                </span>
                {selectedParentCategory !== 'all' && (
                  <button
                    onClick={() => handleSelectParentCategory('all')}
                    className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Ver todos</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  onClick={() => handleSelectParentCategory('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedParentCategory === 'all'
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  Todas as Categorias
                </button>

                {categoriesTree.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectParentCategory(String(cat.id))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                      selectedParentCategory === String(cat.id)
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.children && cat.children.length > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedParentCategory === String(cat.id)
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {cat.children.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Level 2: Subcategories (Contextual when a parent category is selected) */}
            {selectedParentCategory !== 'all' && subCategoriesList.length > 0 && (
              <div className="p-3 rounded-lg bg-slate-950/80 border border-pink-500/30 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs">
                  <CornerDownRight className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span className="font-semibold text-slate-200">
                    Subcategorias de {activeParentCategoryItem?.name}:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    (Clique para filtrar modelos específicos)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleSelectSubCategory('all')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                      selectedSubCategory === 'all'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                    }`}
                  >
                    Todas de {activeParentCategoryItem?.name}
                  </button>

                  {subCategoriesList.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubCategory(String(sub.id))}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                        selectedSubCategory === String(sub.id)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Cards Grid */}
          {isLoadingProducts ? (
            <div className="p-12 text-center rounded-xl bg-slate-900 border border-slate-800">
              <RefreshCw className="w-8 h-8 text-pink-400 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">Carregando catálogo da VTEX...</p>
              <p className="text-xs text-slate-400 mt-1">Consultando https://{accountName}.vtexcommercestable.com.br</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-slate-900 border border-slate-800">
              <Package className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">Nenhum produto encontrado com os filtros atuais.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedParentCategory('all');
                  setSelectedSubCategory('all');
                  fetchProducts('', '');
                }}
                className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-pink-400 bg-slate-950 hover:bg-slate-800 rounded-lg border border-pink-500/40 cursor-pointer"
              >
                Limpar Filtros de Busca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.productId}
                  className="rounded-xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition flex flex-col justify-between overflow-hidden shadow-sm"
                >
                  <div>
                    {/* Image & Price Header */}
                    <div className="relative h-44 bg-slate-950 flex items-center justify-center border-b border-slate-800 overflow-hidden">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.productName}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-contain p-3 hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-slate-700" />
                      )}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/90 text-slate-300 border border-slate-700">
                        {p.brand}
                      </span>
                      {p.isAvailable ? (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Em Estoque
                        </span>
                      ) : (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Esgotado
                        </span>
                      )}
                    </div>

                    {/* Content Body */}
                    <div className="p-4 space-y-2.5">
                      <div className="text-[11px] text-pink-400 font-medium">
                        {p.categoryName}
                      </div>

                      <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug" title={p.productName}>
                        {p.productName}
                      </h3>

                      {/* Pricing */}
                      <div className="pt-1 border-t border-slate-800/80">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-emerald-400 font-mono-numbers">
                            R$ {(p.pricePix || p.priceCard || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          {p.hasBestPrice && p.priceCard && (
                            <span className="text-[11px] text-slate-400 line-through font-mono-numbers">
                              R$ {p.priceCard.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                          <span className="text-[10px] text-emerald-500 font-semibold">no PIX</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{p.installments}</p>
                      </div>

                      {/* SEO Tags Status */}
                      <div className="text-[11px] text-slate-400 space-y-1 pt-1 font-mono">
                        <div className="truncate text-[10px]">
                          Ref: <span className="text-slate-300">{p.productReference || p.productId}</span>
                        </div>
                        <div className="truncate text-[10px]">
                          URL: <span className="text-slate-300">{p.linkText}/p</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between gap-2">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
                    >
                      <span>Ver na Loja</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {onSendProductToIa && (
                      <button
                        onClick={() => onSendProductToIa(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-sm transition cursor-pointer"
                        title="Preencher gerador de IA com os dados deste produto"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Otimizar com IA</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SALES DASHBOARD */}
      {activeSubTab === 'sales' && salesData && (
        <div className="space-y-6">
          {/* Top KPI Cards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block">Faturamento (Últimos 30d)</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono-numbers">
                R$ {salesData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">+14.2% em relação ao mês anterior</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block">Pedidos Realizados</span>
              <div className="text-2xl font-bold text-white font-mono-numbers">
                {salesData.totalOrders.toLocaleString('pt-BR')}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Ticket médio de R$ {salesData.averageTicket.toLocaleString('pt-BR')}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block">Taxa de Conversão da Loja</span>
              <div className="text-2xl font-bold text-pink-400 font-mono-numbers">
                {salesData.conversionRate}%
              </div>
              <span className="text-[10px] text-pink-400/80 font-medium">Referência segmento móveis: 1.8%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block">Status da Conexão OMS</span>
              <div className="flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-bold text-white">
                  {salesData.isLive ? 'API OMS Ao Vivo' : 'Catálogo Sincronizado'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium font-mono">{accountName}.vtexcommercestable</span>
            </div>
          </div>

          {/* Breakdown by Category */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Participação em Receita por Departamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {salesData.topCategories.map((c, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{c.categoryName}</span>
                    <span className="text-xs font-bold text-pink-400 font-mono">{c.sharePercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: `${c.sharePercent}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span>{c.ordersCount} pedidos</span>
                    <span className="text-emerald-400 font-medium">R$ {c.revenue.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Amostra de Pedidos Recentes</h3>
              <button
                onClick={fetchSales}
                disabled={isLoadingSales}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSales ? 'animate-spin' : ''}`} />
                <span>Atualizar Pedidos</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2.5 px-3 font-semibold">ID do Pedido</th>
                    <th className="py-2.5 px-3 font-semibold">Data / Hora</th>
                    <th className="py-2.5 px-3 font-semibold">Itens</th>
                    <th className="py-2.5 px-3 font-semibold">Valor Total</th>
                    <th className="py-2.5 px-3 font-semibold">Status OMS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {salesData.recentOrdersSample.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-2.5 px-3 text-pink-400 font-bold">{order.orderId}</td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {new Date(order.creationDate).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{order.itemsCount} item(ns)</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold font-mono-numbers">
                        R$ {order.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {order.statusDescription}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
