import React from 'react';
import {
  Bell,
  Sliders,
  PanelLeftOpen,
  PanelLeftClose,
  ShieldCheck,
  Activity,
  FileCheck,
  Globe,
  Bot,
  Search,
  BarChart3,
  Sparkles,
  MessageSquare,
  FileText,
  AlertTriangle,
  ShoppingCart,
} from 'lucide-react';
import { TabType } from './Sidebar';

interface TopbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  unreadAlertsCount: number;
  onOpenSetup: () => void;
  storeName: string;
}

const TAB_TITLES: Record<TabType, { label: string; icon: React.ReactNode }> = {
  overview: { label: 'Visão Geral Executiva', icon: <ShoppingCart className="w-4 h-4 text-pink-400" /> },
  'sitemap-urls': { label: 'Validador de Sitemaps & Construtor de URLs', icon: <FileCheck className="w-4 h-4 text-pink-400" /> },
  seo: { label: 'SEO Técnico & Core Web Vitals', icon: <Globe className="w-4 h-4 text-blue-400" /> },
  geo: { label: 'GEO (Generative Engine Optimization)', icon: <Bot className="w-4 h-4 text-purple-400" /> },
  gsc: { label: 'Google Search Console', icon: <Search className="w-4 h-4 text-blue-400" /> },
  analytics: { label: 'Google Analytics 4 (GA4)', icon: <BarChart3 className="w-4 h-4 text-amber-400" /> },
  'ai-suggestions': { label: 'Sugestões de Otimização com IA', icon: <Sparkles className="w-4 h-4 text-pink-400" /> },
  chat: { label: 'Chatbot Especialista VTEX Legacy', icon: <MessageSquare className="w-4 h-4 text-pink-400" /> },
  'monthly-reports': { label: 'Relatórios MoM Comparativos', icon: <FileText className="w-4 h-4 text-emerald-400" /> },
  alerts: { label: 'Monitoramento de Quedas Bruscas', icon: <AlertTriangle className="w-4 h-4 text-rose-400" /> },
};

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  unreadAlertsCount,
  onOpenSetup,
  storeName,
}) => {
  const currentTabInfo = TAB_TITLES[activeTab] || { label: 'Painel', icon: <Activity className="w-4 h-4 text-pink-400" /> };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Sidebar Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-800 transition-colors"
          title={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          aria-label={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-pink-400" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-slate-900 border border-slate-800">
            {currentTabInfo.icon}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">VTEX Pulse /</span>
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {currentTabInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Status badge & Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-950/30 border border-pink-500/30 text-[11px] text-pink-300">
          <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
          <span>Loja: <strong className="text-white">{storeName}</strong> (CMS Legacy)</span>
        </div>

        {/* Alerts Bell */}
        <button
          onClick={() => setActiveTab('alerts')}
          className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-800 transition-colors"
          aria-label={`Ver alertas (${unreadAlertsCount} não lidos)`}
          title="Ver alertas de quedas bruscas"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] bg-rose-500 text-white font-bold rounded-full font-mono-numbers ring-2 ring-slate-950">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenSetup}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-sm transition-colors whitespace-nowrap active:scale-95"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Configurar Ferramentas</span>
        </button>
      </div>
    </header>
  );
};
