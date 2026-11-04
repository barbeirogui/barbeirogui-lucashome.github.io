import React, { useState, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { OverviewTab } from './components/OverviewTab';
import { SitemapUrlBuilderTab } from './components/SitemapUrlBuilderTab';
import { SeoTab } from './components/SeoTab';
import { GeoTab } from './components/GeoTab';
import { SearchConsoleTab } from './components/SearchConsoleTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { AiOptimizationsTab } from './components/AiOptimizationsTab';
import { MonthlyReportTab } from './components/MonthlyReportTab';
import { AlertsTab } from './components/AlertsTab';
import { ChatbotTab } from './components/ChatbotTab';
import { SetupAssistantModal } from './components/SetupAssistantModal';

import {
  coreMetricsData,
  initialVtexConfig,
  initialGoogleConfig,
} from './data/mockStoreData';
import { detectSuddenDrops, AlertNotification } from './utils/metricsEngine';
import { OptimizationSuggestion, VtexConfig, GoogleConfig } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [dropThreshold, setDropThreshold] = useState<number>(12);

  // Load persisted configuration from localStorage if available
  const [vtexConfig, setVtexConfig] = useState<VtexConfig>(() => {
    try {
      const saved = localStorage.getItem('vtex_pulse_config_vtex');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.accountName) {
          return { ...initialVtexConfig, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Could not read vtexConfig from localStorage:', e);
    }
    return initialVtexConfig;
  });

  const [googleConfig, setGoogleConfig] = useState<GoogleConfig>(() => {
    try {
      const saved = localStorage.getItem('vtex_pulse_config_google');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return { ...initialGoogleConfig, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Could not read googleConfig from localStorage:', e);
    }
    return initialGoogleConfig;
  });

  const [metrics, setMetrics] = useState(coreMetricsData);
  const [alerts, setAlerts] = useState<AlertNotification[]>(() =>
    detectSuddenDrops(coreMetricsData)
  );

  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiSource, setAiSource] = useState<string>('gemini-3.8-flash');

  // Load server-persisted config on initial mount (keeps state synchronized across sessions)
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.vtexConfig && data.vtexConfig.accountName) {
            setVtexConfig(data.vtexConfig);
            try {
              localStorage.setItem('vtex_pulse_config_vtex', JSON.stringify(data.vtexConfig));
            } catch (err) {
              console.warn('Could not save to localStorage:', err);
            }
          }
          if (data.googleConfig) {
            setGoogleConfig(data.googleConfig);
            try {
              localStorage.setItem('vtex_pulse_config_google', JSON.stringify(data.googleConfig));
            } catch (err) {
              console.warn('Could not save to localStorage:', err);
            }
          }
        }
      })
      .catch((err) => console.warn('Could not load server config:', err));
  }, []);

  // Save VTEX config to state, localStorage and server
  const handleSaveVtexConfig = (newConfig: VtexConfig) => {
    setVtexConfig(newConfig);
    try {
      localStorage.setItem('vtex_pulse_config_vtex', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Failed to save vtexConfig to localStorage:', e);
    }
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vtexConfig: newConfig }),
    }).catch((err) => console.warn('Failed to sync vtexConfig to server:', err));
  };

  // Save Google config to state, localStorage and server
  const handleSaveGoogleConfig = (newConfig: GoogleConfig) => {
    setGoogleConfig(newConfig);
    try {
      localStorage.setItem('vtex_pulse_config_google', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Failed to save googleConfig to localStorage:', e);
    }
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googleConfig: newConfig }),
    }).catch((err) => console.warn('Failed to sync googleConfig to server:', err));
  };

  // Load AI optimizations on initial mount
  useEffect(() => {
    fetchAiOptimizations();
  }, []);

  // Update alerts if threshold changes
  useEffect(() => {
    const adjustedMetrics = metrics.map((m) => ({
      ...m,
      criticalDropThresholdPercent: dropThreshold,
    }));
    setAlerts(detectSuddenDrops(adjustedMetrics));
  }, [dropThreshold, metrics]);

  const fetchAiOptimizations = async () => {
    setIsLoadingAi(true);
    try {
      const cr = metrics.find((m) => m.id === 'conversion_rate')?.currentValue || 2.38;
      const res = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: vtexConfig.accountName,
          currentConversionRate: cr,
          organicTraffic: 148200,
          abandonmentRate: 71.4,
          recentDrops: alerts.map((a) => a.title),
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        setAiSource(data.source || 'gemini-3.8-flash');
      }
    } catch (err) {
      console.warn('Failed to load AI suggestions, using default fallback:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleUpdateSuggestionStatus = (
    id: string,
    status: 'pendente' | 'em_progresso' | 'aplicado'
  ) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  const unreadAlertsCount = alerts.filter((a) => !a.resolved && !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-pink-500 selection:text-white">
      {/* Collapsible Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        unreadAlertsCount={unreadAlertsCount}
        onOpenSetup={() => setIsSetupOpen(true)}
        storeName={vtexConfig.accountName}
      />

      {/* Main Content Area offset by Sidebar */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Topbar */}
        <Topbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          unreadAlertsCount={unreadAlertsCount}
          onOpenSetup={() => setIsSetupOpen(true)}
          storeName={vtexConfig.accountName}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'overview' && (
            <OverviewTab
              metrics={metrics}
              onNavigateTab={setActiveTab}
              onOpenSetup={() => setIsSetupOpen(true)}
              isVtexConnected={vtexConfig.isConnected}
            />
          )}

          {activeTab === 'sitemap-urls' && (
            <SitemapUrlBuilderTab storeDomain={vtexConfig.storeDomain} />
          )}

          {activeTab === 'seo' && <SeoTab />}

          {activeTab === 'geo' && <GeoTab />}

          {activeTab === 'gsc' && <SearchConsoleTab />}

          {activeTab === 'analytics' && <AnalyticsTab />}

          {activeTab === 'ai-suggestions' && (
            <AiOptimizationsTab
              suggestions={suggestions}
              onRefreshAi={fetchAiOptimizations}
              isLoadingAi={isLoadingAi}
              onUpdateStatus={handleUpdateSuggestionStatus}
              aiSource={aiSource}
            />
          )}

          {activeTab === 'chat' && <ChatbotTab storeName={vtexConfig.accountName} />}

          {activeTab === 'monthly-reports' && <MonthlyReportTab />}

          {activeTab === 'alerts' && (
            <AlertsTab
              alerts={alerts}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onResolveAlert={handleResolveAlert}
              dropThreshold={dropThreshold}
              setDropThreshold={setDropThreshold}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-5 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">VTEX Pulse</span>
              <span>·</span>
              <span>Plataforma de Otimização e Crescimento de E-commerce</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>Ambiente: <strong className="text-slate-300">{vtexConfig.environment}</strong></span>
              <span>·</span>
              <span>IA: <strong className="text-pink-400">Gemini 3.8 Flash</strong></span>
              <span>·</span>
              <span>Versão: <strong className="text-pink-400">VTEX CMS Legacy (Portal)</strong></span>
            </div>
          </div>
        </footer>
      </div>

      {/* Setup Assistant Modal */}
      <SetupAssistantModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        vtexConfig={vtexConfig}
        onSaveVtexConfig={handleSaveVtexConfig}
        googleConfig={googleConfig}
        onSaveGoogleConfig={handleSaveGoogleConfig}
      />
    </div>
  );
}
