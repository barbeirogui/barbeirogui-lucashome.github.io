import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  ExternalLink,
  Wand2,
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
  Sparkles,
} from 'lucide-react';
import type { VtexCatalogProduct, VtexCategoryTreeItem } from '../types';

interface CatalogTabProps {
  storeDomain?: string;
  accountName?: string;
  onSendProductToIa?: (product: VtexCatalogProduct) => void;
}

export const CatalogTab: React.FC<CatalogTabProps> = ({
  storeDomain = 'www.lucashome.com.br',
  accountName = 'lucashome',
  onSendProductToIa,
}) => {
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

  useEffect(() => {
    fetchCategoryTree();
    fetchProducts();
  }, []);

  const handleSelectParentCategory = (catId: string) => {
    setSelectedParentCategory(catId);
    setSelectedSubCategory('all');
    fetchProducts(catId === 'all' ? '' : catId, searchTerm);
  };

  const handleSelectSubCategory = (subId: string) => {
    setSelectedSubCategory(subId);
    const effectiveCat = subId === 'all' ? (selectedParentCategory === 'all' ? '' : selectedParentCategory) : subId;
    fetchProducts(effectiveCat, searchTerm);
  };

  // Get current active parent category item to display its children subcategories
  const currentParentItem = categoriesTree.find(
    (c) => String(c.id) === selectedParentCategory
  );

  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.productName.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.productId.includes(term) ||
      (p.categoryName ? p.categoryName.toLowerCase().includes(term) : false)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-400">VTEX Catalog API (Live)</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">Loja: {accountName}</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
              Árvore de Categorias Viva
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-emerald-400" />
            <span>Catálogo Oficial de Produtos</span>
          </h1>
          <p className="text-sm text-slate-300">
            Acompanhe o catálogo real da Lucas Home conectado via API aberta, navegue por departamentos e subcategorias, audite o SEO de cada produto e envie para o gerador de conteúdo IA com 1 clique.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Produtos Carregados</span>
            <span className="text-lg font-bold text-emerald-400">{filteredProducts.length} itens</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Multilevel Category Filter */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por nome de produto (ex: Baú Queen, Colchão Molas, Cabeceira)..."
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
                <span>Ver todos os departamentos</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => handleSelectParentCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                selectedParentCategory === 'all'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              Todas as Categorias ({totalLoaded})
            </button>

            {categoriesTree.map((cat) => {
              const isSelected = selectedParentCategory === String(cat.id);
              const childrenCount = cat.children ? cat.children.length : 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectParentCategory(String(cat.id))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-pink-600 text-white shadow-sm ring-1 ring-pink-400'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <span>{cat.name}</span>
                  {childrenCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-pink-700/80 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {childrenCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level 2: Subcategories of the selected parent */}
        {currentParentItem && currentParentItem.children && currentParentItem.children.length > 0 && (
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-pink-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-pink-300 font-semibold">
              <CornerDownRight className="w-3 h-3 text-pink-400" />
              <span>Subcategorias de {currentParentItem.name}:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <button
                onClick={() => handleSelectSubCategory('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium shrink-0 transition-colors cursor-pointer ${
                  selectedSubCategory === 'all'
                    ? 'bg-pink-500 text-white'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                Todas as subcategorias
              </button>

              {currentParentItem.children.map((sub) => {
                const isSubSelected = selectedSubCategory === String(sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectSubCategory(String(sub.id))}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium shrink-0 transition-colors cursor-pointer ${
                      isSubSelected
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoadingProducts && (
        <div className="p-12 text-center rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
          <RefreshCw className="w-7 h-7 text-pink-400 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-300">
            Consultando Catálogo Oficial da VTEX em tempo real...
          </p>
          <p className="text-xs text-slate-500 font-mono">
            GET https://{accountName}.vtexcommercestable.com.br/api/catalog_system/pub/products/search
          </p>
        </div>
      )}

      {/* Products Grid */}
      {!isLoadingProducts && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((prod) => {
            const hasPix = Boolean(prod.pricePix && prod.pricePix > 0);
            const pricePixFormatted = hasPix
              ? Number(prod.pricePix).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : null;
            const priceCardFormatted = prod.priceCard
              ? Number(prod.priceCard).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : null;

            return (
              <div
                key={prod.productId}
                className="group rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all flex flex-col justify-between p-4 shadow-sm"
              >
                <div>
                  {/* Top info: Brand & Category Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold text-pink-400 tracking-wider uppercase font-mono truncate">
                      {prod.brand || 'Lucas Home'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 truncate max-w-[140px]">
                      {prod.categoryName || 'Móveis'}
                    </span>
                  </div>

                  {/* Thumbnail and Title */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center relative">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-slate-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-xs font-semibold text-white line-clamp-2 group-hover:text-pink-300 transition-colors leading-snug"
                        title={prod.productName}
                      >
                        {prod.productName}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <span>ID: {prod.productId}</span>
                        {prod.skuCount && prod.skuCount > 1 && (
                          <span className="text-emerald-400">({prod.skuCount} SKUs)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prices & Payment Conditions */}
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-3 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[10px] text-slate-400">À vista no PIX:</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {pricePixFormatted || priceCardFormatted || 'Sob Consulta'}
                      </span>
                    </div>

                    {prod.installments && (
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Parcelado:</span>
                        <span className="text-slate-300">{prod.installments}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions: View on store + Send to AI */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={prod.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Ver página oficial na Lucas Home"
                  >
                    <span>Ver na Loja</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {onSendProductToIa && (
                    <button
                      onClick={() => onSendProductToIa(prod)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-pink-300 hover:text-white bg-pink-950/50 hover:bg-pink-900 border border-pink-500/30 rounded-lg transition-colors cursor-pointer"
                      title="Abrir no gerador de títulos, descrições e SEO com IA"
                    >
                      <Wand2 className="w-3 h-3 text-pink-400" />
                      <span>Otimizar no Product IA</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoadingProducts && filteredProducts.length === 0 && (
        <div className="p-12 text-center rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
          <Package className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-medium text-white">Nenhum produto encontrado</p>
          <p className="text-xs text-slate-400">
            Tente buscar por outro termo ou selecione outro departamento na barra superior.
          </p>
        </div>
      )}
    </div>
  );
};
