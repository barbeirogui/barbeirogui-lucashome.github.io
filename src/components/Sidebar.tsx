import React from 'react';
import {
  ShoppingCart,
  Globe,
  Bot,
  Search,
  BarChart3,
  Sparkles,
  FileText,
  AlertTriangle,
  MessageSquare,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen,
  Wand2,
  Package,
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'catalog-sales'
  | 'product-ia'
  | 'sitemap-urls'
  | 'seo'
  | 'geo'
  | 'gsc'
  | 'analytics'
  | 'ai-suggestions'
  | 'chat'
  | 'monthly-reports'
  | 'alerts';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  unreadAlertsCount: number;
  onOpenSetup: () => void;
  storeName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  unreadAlertsCount,
  onOpenSetup,
  storeName,
}) => {
  const navTabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Visão Geral', icon: <ShoppingCart className="w-4 h-4 shrink-0" /> },
    {
      id: 'catalog-sales',
      label: 'Catálogo & Vendas',
      icon: <Package className="w-4 h-4 shrink-0 text-emerald-400" />,
    },
    {
      id: 'product-ia',
      label: 'Product IA (Copy & SEO)',
      icon: <Wand2 className="w-4 h-4 shrink-0 text-pink-400" />,
    },
    { id: 'sitemap-urls', label: 'Sitemap & Construtor', icon: <FileCheck className="w-4 h-4 shrink-0 text-pink-400" /> },
    { id: 'seo', label: 'SEO Técnico', icon: <Globe className="w-4 h-4 shrink-0" /> },
    { id: 'geo', label: 'GEO (IA)', icon: <Bot className="w-4 h-4 shrink-0" /> },
    { id: 'gsc', label: 'Search Console', icon: <Search className="w-4 h-4 shrink-0" /> },
    { id: 'analytics', label: 'Analytics (GA4)', icon: <BarChart3 className="w-4 h-4 shrink-0" /> },
    { id: 'ai-suggestions', label: 'Sugestões IA', icon: <Sparkles className="w-4 h-4 shrink-0" /> },
    { id: 'chat', label: 'Chatbot Especialista', icon: <MessageSquare className="w-4 h-4 shrink-0 text-pink-400" /> },
    { id: 'monthly-reports', label: 'Relatórios MoM', icon: <FileText className="w-4 h-4 shrink-0" /> },
    {
      id: 'alerts',
      label: 'Alertas de Quedas',
      icon: <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />,
      badge: unreadAlertsCount,
    },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div>
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400 font-bold text-base shrink-0">
              V
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="text-sm font-bold text-white tracking-tight truncate">
                  VTEX Pulse
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {storeName} <strong className="text-pink-400 font-mono">(CMS Legacy)</strong>
                </span>
              </div>
            )}
          </div>

          {/* Toggle Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            title={isCollapsed ? 'Expandir barra lateral (Mostrar texto)' : 'Ocultar barra lateral (Mostrar só ícones)'}
            aria-label={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-pink-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-none" aria-label="Menu Lateral">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={isCollapsed ? tab.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-pink-600/20 text-white font-semibold border border-pink-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              >
                {tab.icon}

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left font-sans">{tab.label}</span>
                )}

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full font-mono-numbers shrink-0 ${
                      isActive
                        ? 'bg-rose-500 text-white'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    } ${isCollapsed ? 'absolute top-1 right-1' : ''}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/90">
        <button
          onClick={onOpenSetup}
          title={isCollapsed ? 'Configurações & Vínculos' : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 transition-colors shadow-sm active:scale-95 cursor-pointer ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
          aria-label="Abrir configurações da loja e ferramentas"
        >
          <Sliders className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Configurações</span>}
        </button>

        {!isCollapsed && (
          <div className="px-2 py-1 text-[10px] text-slate-500 text-center font-mono">
            VTEX CMS Legacy Portal
          </div>
        )}
      </div>
    </aside>
  );
};
