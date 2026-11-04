import React, { useState } from 'react';
import {
  X,
  Sliders,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Key,
  ShieldCheck,
  Search,
  BarChart3,
  Bot,
  Copy,
  Check,
  RefreshCw,
  Activity,
  Globe,
  FileCheck,
} from 'lucide-react';
import { VtexConfig, GoogleConfig, ToolValidationResult } from '../types';

interface SetupAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  vtexConfig: VtexConfig;
  onSaveVtexConfig: (config: VtexConfig) => void;
  googleConfig: GoogleConfig;
  onSaveGoogleConfig: (config: GoogleConfig) => void;
}

export const SetupAssistantModal: React.FC<SetupAssistantModalProps> = ({
  isOpen,
  onClose,
  vtexConfig,
  onSaveVtexConfig,
  googleConfig,
  onSaveGoogleConfig,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vtex' | 'gsc' | 'ga4' | 'geo'>('vtex');

  // VTEX Form state
  const [accountName, setAccountName] = useState(vtexConfig.accountName);
  const [appKey, setAppKey] = useState(vtexConfig.appKey);
  const [appToken, setAppToken] = useState(vtexConfig.appToken);
  const [environment, setEnvironment] = useState(vtexConfig.environment);
  const [storeDomain, setStoreDomain] = useState(vtexConfig.storeDomain);

  // GSC and GA4 state
  const [gscProperty, setGscProperty] = useState(googleConfig.searchConsoleProperty);
  const [ga4Property, setGa4Property] = useState(googleConfig.ga4PropertyId);
  const [ga4Measurement, setGa4Measurement] = useState(googleConfig.ga4MeasurementId);

  // Validation states per tool
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({
    vtex: false,
    gsc: false,
    ga4: false,
    geo: false,
  });

  const [validationResults, setValidationResults] = useState<Record<string, ToolValidationResult | null>>({
    vtex: null,
    gsc: null,
    ga4: null,
    geo: null,
  });

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleValidateTool = async (tool: 'vtex' | 'gsc' | 'ga4' | 'geo') => {
    setIsValidating((prev) => ({ ...prev, [tool]: true }));

    let configPayload: Record<string, any> = { storeDomain };

    if (tool === 'vtex') {
      configPayload = { accountName, appKey, appToken, environment, storeDomain };
    } else if (tool === 'gsc') {
      configPayload = { searchConsoleProperty: gscProperty, storeDomain };
    } else if (tool === 'ga4') {
      configPayload = { ga4MeasurementId: ga4Measurement, ga4PropertyId: ga4Property, storeDomain };
    } else if (tool === 'geo') {
      configPayload = { storeDomain };
    }

    try {
      const res = await fetch('/api/tools/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool,
          config: configPayload,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setValidationResults((prev) => ({ ...prev, [tool]: data.result }));

        // Auto sync if valid
        if (tool === 'vtex' && data.result.isValid) {
          onSaveVtexConfig({
            accountName,
            appKey,
            appToken,
            environment,
            storeDomain,
            isConnected: true,
            lastConnectedAt: new Date().toLocaleString('pt-BR'),
            vtexVersion: 'VTEX CMS Legacy (Portal)',
          });
        } else if ((tool === 'gsc' || tool === 'ga4') && data.result.isValid) {
          onSaveGoogleConfig({
            searchConsoleProperty: gscProperty,
            searchConsoleConnected: Boolean(gscProperty),
            ga4PropertyId: ga4Property,
            ga4MeasurementId: ga4Measurement,
            ga4Connected: Boolean(ga4Measurement),
          });
        }
      }
    } catch (err: unknown) {
      console.error(`Erro ao validar ${tool}:`, err);
    } finally {
      setIsValidating((prev) => ({ ...prev, [tool]: false }));
    }
  };

  const handleSaveVtexManual = () => {
    onSaveVtexConfig({
      accountName,
      appKey,
      appToken,
      environment,
      storeDomain,
      isConnected: Boolean(accountName && appKey && appToken),
      lastConnectedAt: new Date().toLocaleString('pt-BR'),
      vtexVersion: 'VTEX CMS Legacy (Portal)',
    });
    setSaveSuccessNotice('Configurações da VTEX salvas com sucesso!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleSaveGoogleManual = () => {
    onSaveGoogleConfig({
      searchConsoleProperty: gscProperty,
      searchConsoleConnected: Boolean(gscProperty),
      ga4PropertyId: ga4Property,
      ga4MeasurementId: ga4Measurement,
      ga4Connected: Boolean(ga4Measurement),
    });
    setSaveSuccessNotice('Configurações do Google (GSC & GA4) salvas com sucesso!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Diagnostic Checklist Component
  const renderValidationReport = (tool: 'vtex' | 'gsc' | 'ga4' | 'geo') => {
    const result = validationResults[tool];
    if (!result) return null;

    return (
      <div
        className={`p-4 rounded-xl border space-y-3 transition-all ${
          result.isValid
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : 'bg-rose-950/20 border-rose-500/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {result.isValid ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <h4 className="text-xs font-bold text-white">
                {result.isValid
                  ? 'Vínculo Ativo & Conexão Validada com Sucesso!'
                  : 'Atenção: Falha ou Pendência na Validação do Vínculo'}
              </h4>
              <p className="text-[11px] text-slate-300">{result.summary}</p>
            </div>
          </div>

          {result.latencyMs !== undefined && (
            <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-300 rounded-full">
              {result.latencyMs}ms de resposta
            </span>
          )}
        </div>

        {/* Detailed Checks Checklist */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Diagnóstico Granular de Vínculo:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.checks.map((check, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start gap-2 text-xs"
              >
                {check.status === 'passed' && (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {check.status === 'warning' && (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                {check.status === 'failed' && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-slate-200 block text-[11px]">
                    {check.name}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight block">
                    {check.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-pink-600/20 text-pink-400 rounded-lg border border-pink-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 id="setup-modal-title" className="text-base font-bold text-white">
                Assistente Central de Configuração & Validação de Vínculos
              </h2>
              <p className="text-xs text-slate-400">
                Conecte e teste em tempo real o vínculo da sua loja VTEX CMS Legacy, Search Console, GA4 e IAs (GEO).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Save Notice */}
        {saveSuccessNotice && (
          <div className="px-6 py-2 bg-emerald-950/60 border-b border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('vtex')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'vtex'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>1. VTEX (KEY & TOKEN)</span>
            {vtexConfig.isConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" title="Vínculo Ativo" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('gsc')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'gsc'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>2. Google Search Console</span>
            {googleConfig.searchConsoleConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" title="Vínculo Ativo" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('ga4')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'ga4'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>3. Google Analytics 4 (GA4)</span>
            {googleConfig.ga4Connected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" title="Vínculo Ativo" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('geo')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'geo'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>4. GEO & IAs (Robots & llms.txt)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* TAB 1: VTEX */}
          {activeSubTab === 'vtex' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-pink-500/30 bg-pink-950/10 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-pink-400" />
                  <span>Conexão Direta com sua Conta VTEX CMS Legacy</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Insira abaixo as credenciais geradas no License Manager da VTEX. O sistema validará se a AppKey e
                  AppToken estão conectando corretamente à API de Catálogo e OMS da sua loja.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nome da Conta VTEX (Account Name)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: minhaloja"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    URL base: <code className="text-slate-300">{accountName || 'sualoja'}.myvtex.com</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ambiente VTEX (Environment)
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="vtexcommercestable">vtexcommercestable (Padrão Produção)</option>
                    <option value="vtexcommercebeta">vtexcommercebeta (Ambiente Beta)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    VTEX AppKey (X-VTEX-API-AppKey)
                  </label>
                  <input
                    type="text"
                    placeholder="vtexappkey-sualoja-XXXXXX"
                    value={appKey}
                    onChange={(e) => setAppKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    VTEX AppToken (X-VTEX-API-AppToken)
                  </label>
                  <input
                    type="password"
                    placeholder="Token secreto da chave..."
                    value={appToken}
                    onChange={(e) => setAppToken(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Domínio da Loja em Produção (URL Canônica)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: www.minhaloja.com.br"
                    value={storeDomain}
                    onChange={(e) => setStoreDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleValidateTool('vtex')}
                  disabled={isValidating.vtex || !accountName || !appKey || !appToken}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-50 rounded-lg shadow-sm transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isValidating.vtex ? 'animate-spin' : ''}`} />
                  <span>{isValidating.vtex ? 'Validando Vínculo...' : 'Validar Conexão VTEX Agora'}</span>
                </button>

                <button
                  onClick={handleSaveVtexManual}
                  className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Salvar Sem Testar
                </button>
              </div>

              {/* Diagnostic Card */}
              {renderValidationReport('vtex')}

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200">
                  Como gerar uma Chave com as permissões corretas no Admin VTEX:
                </h4>
                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
                  <li>
                    Acesse o Admin VTEX em <code className="text-pink-400 font-mono">https://{accountName || 'sualoja'}.myvtex.com/admin</code>.
                  </li>
                  <li>
                    Vá em <strong>Configurações da Conta &gt; Gerenciamento de Contas &gt; Chaves de aplicação</strong>.
                  </li>
                  <li>
                    Clique em <strong>Gerenciar chaves</strong> &gt; <strong>Gerar chave</strong>.
                  </li>
                  <li>
                    Defina um rótulo (ex: "Dashboard VTEX Pulse") e adicione os perfis <strong>Catalog (Leitura)</strong> e <strong>OMS (Leitura de Pedidos)</strong>.
                  </li>
                  <li>
                    Copie a <strong>Chave de Aplicação (AppKey)</strong> e o <strong>Segredo (AppToken)</strong> gerado.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE SEARCH CONSOLE */}
          {activeSubTab === 'gsc' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/10 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-blue-400" />
                  <span>Configuração & Validação do Google Search Console</span>
                </h3>
                <p className="text-xs text-slate-300">
                  O Search Console monitora impressões orgânicas, palavras-chave e sitemaps do seu e-commerce VTEX CMS Legacy.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Propriedade do Search Console
                </label>
                <input
                  type="text"
                  placeholder="sc-domain:minhaloja.com.br ou https://www.minhaloja.com.br/"
                  value={gscProperty}
                  onChange={(e) => setGscProperty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Recomendado: utilize <code className="text-blue-300">sc-domain:{storeDomain || 'minhaloja.com.br'}</code> para monitorar todos os protocolos e subdomínios da loja.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => handleValidateTool('gsc')}
                  disabled={isValidating.gsc || !gscProperty}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg shadow-sm transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isValidating.gsc ? 'animate-spin' : ''}`} />
                  <span>{isValidating.gsc ? 'Validando Vínculo...' : 'Validar Vínculo com Search Console'}</span>
                </button>

                <button
                  onClick={handleSaveGoogleManual}
                  className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Salvar Propriedade
                </button>
              </div>

              {/* Diagnostic Card */}
              {renderValidationReport('gsc')}

              {/* Step-by-Step for VTEX CMS Legacy */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-200">
                  Métodos de Vínculo de Propriedade no VTEX CMS Legacy:
                </h4>

                {/* Method 1: DNS */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      Método 1: Registro DNS TXT (Recomendado para VTEX)
                    </span>
                    <span className="text-[10px] text-slate-400">Verificação de domínio completo</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    No seu provedor de DNS (Cloudflare, Registro.br, etc.), adicione uma entrada TXT:
                  </p>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span>Tipo: TXT | Host: @ | Valor: google-site-verification=exemploDeCodigoGSC12345</span>
                    <button
                      onClick={() => handleCopy('google-site-verification=exemploDeCodigoGSC12345', 'dns')}
                      className="text-pink-400 text-xs hover:text-pink-300"
                    >
                      {copiedText === 'dns' ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                {/* Method 2: Subtemplate Head */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">
                      Método 2: Tag Meta HTML no Subtemplate Head do Portal Legacy
                    </span>
                    <span className="text-[10px] text-slate-400">CMS &gt; Layout &gt; Subtemplates</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Acesse <strong>CMS &gt; Layout &gt; HTML Templates &gt; Subtemplates &gt; head</strong> e insira dentro da tag &lt;head&gt;:
                  </p>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span>&lt;meta name="google-site-verification" content="SEU_CODIGO_GSC" /&gt;</span>
                    <button
                      onClick={() => handleCopy('<meta name="google-site-verification" content="SEU_CODIGO_GSC" />', 'meta')}
                      className="text-pink-400 text-xs hover:text-pink-300"
                    >
                      {copiedText === 'meta' ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                {/* Method 3: Sitemap */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200">
                    Índice de Sitemaps da VTEX:
                  </span>
                  <p className="text-xs text-slate-300">
                    No CMS Legacy, o sitemap index oficial fica na URL:{' '}
                    <code className="text-emerald-400 font-mono">https://{storeDomain || 'www.sualoja.com.br'}/sitemap.xml</code>.
                    Submeta essa URL diretamente no menu <strong>Sitemaps</strong> do Search Console.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GA4 */}
          {activeSubTab === 'ga4' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Configuração & Validação do Google Analytics 4 (GA4)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Valide se o Measurement ID e a Camada de Dados (dataLayer) do CMS Legacy estão prontos para medir sessões e pedidos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ID da Métrica GA4 (Measurement ID)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: G-XXXXXXXXXX"
                    value={ga4Measurement}
                    onChange={(e) => setGa4Measurement(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Formato: <code className="text-amber-400">G-XXXXXXXXXX</code> (Admin GA4 &gt; Fluxos de dados).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ID da Propriedade GA4
                  </label>
                  <input
                    type="text"
                    placeholder="ex: properties/412891920 ou 412891920"
                    value={ga4Property}
                    onChange={(e) => setGa4Property(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => handleValidateTool('ga4')}
                  disabled={isValidating.ga4 || !ga4Measurement}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-lg shadow-sm transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isValidating.ga4 ? 'animate-spin' : ''}`} />
                  <span>{isValidating.ga4 ? 'Validando Vínculo...' : 'Validar Vínculo com GA4 & dataLayer'}</span>
                </button>

                <button
                  onClick={handleSaveGoogleManual}
                  className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Salvar IDs do GA4
                </button>
              </div>

              {/* Diagnostic Card */}
              {renderValidationReport('ga4')}

              {/* VTEX CMS Legacy GTM / GA4 Setup Guide */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200">
                  Implementação no VTEX CMS Legacy (Portal):
                </h4>
                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
                  <li>
                    Acesse <strong>CMS &gt; Layout &gt; HTML Templates &gt; Subtemplates &gt; head</strong> e insira o script do container GTM.
                  </li>
                  <li>
                    No container GTM, crie a <strong>Tag do Google</strong> configurada com seu Measurement ID (<code className="text-amber-400 font-mono">{ga4Measurement || 'G-XXXXXXXXXX'}</code>).
                  </li>
                  <li>
                    No checkout da VTEX (<strong>/arquivos/checkout6-custom.js</strong>), confirme que os disparos de conversão utilizam o gatilho de sucesso do pedido do <code>vtexjs</code>.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: GEO & ROBOTS */}
          {activeSubTab === 'geo' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/10 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Validação de Vínculos GEO (Generative Engine Optimization)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Valide se os motores de IA generativa (ChatGPT Search, Perplexity e Google AI Overviews) têm permissão
                  para rastrear e citar sua loja VTEX CMS Legacy.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleValidateTool('geo')}
                  disabled={isValidating.geo}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg shadow-sm transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isValidating.geo ? 'animate-spin' : ''}`} />
                  <span>{isValidating.geo ? 'Auditando Diretivas...' : 'Validar Vínculo GEO & Rastreadores IA'}</span>
                </button>
              </div>

              {/* Diagnostic Card */}
              {renderValidationReport('geo')}

              {/* Robots.txt block */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    Diretivas recomendadas para o robots.txt no Portal VTEX Legacy:
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `User-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\n# Evitar indexação de rotas privadas:\nDisallow: /checkout/\nDisallow: /account/\nDisallow: /search?*\n\nSitemap: https://${storeDomain || 'www.sualoja.com.br'}/sitemap.xml`,
                        'robots'
                      )
                    }
                    className="text-pink-400 text-xs hover:text-pink-300 flex items-center gap-1"
                  >
                    {copiedText === 'robots' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText === 'robots' ? 'Copiado!' : 'Copiar Diretivas'}</span>
                  </button>
                </div>

                <pre className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Evitar indexação de rotas privadas:
Disallow: /checkout/
Disallow: /account/
Disallow: /search?*

Sitemap: https://${storeDomain || 'www.sualoja.com.br'}/sitemap.xml`}
                </pre>
              </div>

              {/* llms.txt guide for CMS Legacy */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <span className="font-bold text-slate-200 block">
                  Publicação do arquivo llms.txt no VTEX CMS Legacy:
                </span>
                <p>
                  1. Gere o conteúdo do arquivo na aba <strong>GEO (IA)</strong> deste painel.<br />
                  2. Acesse o Admin VTEX &gt; <strong>CMS &gt; Layout &gt; Gerenciador de Arquivos</strong> (Files) e faça upload do arquivo <code>llms.txt</code>.<br />
                  3. No <strong>CMS &gt; Gerenciador de URL</strong>, adicione uma regra de redirecionamento 301 da URL raiz <code>/llms.txt</code> apontando para <code>/arquivos/llms.txt</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
