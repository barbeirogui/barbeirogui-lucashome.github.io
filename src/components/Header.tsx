import React from 'react';
import {
  Bell,
  Sliders,
  Sparkles,
  BarChart3,
  Search,
  Bot,
  FileText,
  AlertTriangle,
  ShoppingCart,
  MessageSquare,
  Globe,
} from 'lucide-react';

import type { TabType } from './Sidebar';
export type { TabType };

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadAlertsCount: number;
  onOpenSetup: () => void;
  storeName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertsCount,
  onOpenSetup,
  storeName,
}) => {
  const navTabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Visão Geral', icon: <ShoppingCart className="w-3.5 h-3.5" /> },
    { id: 'seo', label: 'SEO Técnico', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'geo', label: 'GEO (IA)', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'gsc', label: 'Search Console', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'ai-suggestions', label: 'Sugestões IA', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'chat', label: 'Chatbot IA', icon: <MessageSquare className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'monthly-reports', label: 'Relatórios MoM', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'alerts', label: 'Alertas', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Bar Contract: 3 zones separated by gap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400 font-bold text-sm shadow-sm">
            L
          </div>
          <div className="flex flex-col">
            <a
              href="#overview"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('overview');
              }}
              className="text-base font-bold tracking-tight text-white whitespace-nowrap hover:text-pink-400 transition-colors"
            >
              Lucas IA
            </a>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">
              Loja: <strong className="text-slate-200">{storeName}</strong>{' '}
              <span className="text-pink-400 font-mono font-medium">(CMS Legacy)</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line tabs) */}
        <nav
          className="hidden xl:flex items-center gap-0.5 overflow-x-auto py-1"
          aria-label="Navegação Principal"
        >
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-pink-400 font-semibold border border-slate-700/60 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'alerts' && unreadAlertsCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full font-mono-numbers font-bold">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Alert Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('alerts')}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label={`Ver alertas de queda crítica (${unreadAlertsCount} não lidos)`}
            title="Alertas de quedas bruscas"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950" />
            )}
          </button>

          <button
            onClick={onOpenSetup}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
            aria-label="Abrir configurações"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configurações</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet scrollable navigation tabs */}
      <div className="xl:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none bg-slate-950">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-slate-800 text-pink-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'alerts' && unreadAlertsCount > 0 && (
                <span className="ml-1 px-1 text-[10px] bg-rose-500/20 text-rose-300 rounded-full font-mono-numbers">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
