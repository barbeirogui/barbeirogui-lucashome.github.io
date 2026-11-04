import React, { useState } from 'react';
import {
  X,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Key,
  ShieldCheck,
  ExternalLink,
  Search,
  BarChart3,
  Bot,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { VtexConfig, GoogleConfig } from '../types';

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

  // Test connection state
  const [isTestingVtex, setIsTestingVtex] = useState(false);
  const [vtexTestStatus, setVtexTestStatus] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleTestVtex = async () => {
    setIsTestingVtex(true);
    setVtexTestStatus(null);

    try {
      const res = await fetch('/api/vtex/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountName,
          appKey,
          appToken,
          environment,
        }),
      });

      const data = await res.json();
      setVtexTestStatus({
        success: data.success,
        message: data.message,
        details: data.data,
      });

      if (data.success) {
        onSaveVtexConfig({
          accountName,
          appKey,
          appToken,
          environment,
          storeDomain,
          isConnected: true,
          lastConnectedAt: new Date().toLocaleString('pt-BR'),
          vtexVersion: data.data?.vtexVersion || 'VTEX IO',
        });
      }
    } catch (err: unknown) {
      setVtexTestStatus({
        success: false,
        message: 'Falha ao testar conexão com o servidor local.',
      });
    } finally {
      setIsTestingVtex(false);
    }
  };

  const handleSaveGoogle = () => {
    onSaveGoogleConfig({
      searchConsoleProperty: gscProperty,
      searchConsoleConnected: Boolean(gscProperty),
      ga4PropertyId: ga4Property,
      ga4MeasurementId: ga4Measurement,
      ga4Connected: Boolean(ga4Measurement),
    });
    alert('Configurações do Google Search Console e GA4 salvas com sucesso!');
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
                Assistente Central de Configuração & Chaves
              </h2>
              <p className="text-xs text-slate-400">
                Guia prático para conectar sua VTEX, Search Console, GA4 e otimização para IAs (GEO).
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('gsc')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'gsc'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>2. Google Search Console</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ga4')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'ga4'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>3. Google Analytics 4 (GA4)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('geo')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'geo'
                ? 'border-pink-500 text-pink-400'
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
                  <span>Conexão Direta com sua Conta VTEX</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Insira abaixo as credenciais geradas no License Manager da VTEX. Nosso dashboard utiliza
                  essas chaves para ler o catálogo, consultas do Intelligent Search e pedidos do OMS.
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
                    O nome que aparece na URL: <code className="text-slate-300">{accountName || 'sualoja'}.myvtex.com</code>
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
                    Domínio da Loja em Produção
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

              {/* Test Button & Result */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleTestVtex}
                  disabled={isTestingVtex || !accountName || !appKey || !appToken}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-50 rounded-lg shadow-sm transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingVtex ? 'animate-spin' : ''}`} />
                  <span>{isTestingVtex ? 'Testando Conexão...' : 'Testar Conexão em Tempo Real'}</span>
                </button>

                {vtexTestStatus && (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      vtexTestStatus.success
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-950/40 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {vtexTestStatus.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{vtexTestStatus.message}</span>
                  </div>
                )}
              </div>

              {/* Step by step tutorial for VTEX Key */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200">
                  Onde encontrar ou gerar sua Key e Token no Admin da VTEX:
                </h4>
                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
                  <li>
                    Acesse o Admin VTEX em <code className="text-pink-400 font-mono">https://sualoja.myvtex.com/admin</code>.
                  </li>
                  <li>
                    No menu lateral esquerdo, vá em <strong>Configurações da Conta &gt; Gerenciamento de Contas &gt; Chaves de aplicação</strong> (ou busque por "Chaves de aplicação").
                  </li>
                  <li>
                    Clique em <strong>Gerenciar chaves</strong> e depois em <strong>Gerar chave</strong>.
                  </li>
                  <li>
                    Dê um rótulo como "Dashboard VTEX Pulse" e atribua o perfil de acesso com permissão para <strong>Catalog (Leitura)</strong> e <strong>OMS (Leitura de Pedidos)</strong>.
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
                  <span>Configuração do Google Search Console para VTEX</span>
                </h3>
                <p className="text-xs text-slate-300">
                  O Search Console fornece a verdade sobre impressões, termos de busca e falhas de indexação
                  de URLs e sitemaps do seu e-commerce.
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
              </div>

              {/* 3 Methods */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-200">
                  Escolha um dos 3 métodos para vincular o Search Console à sua loja VTEX:
                </h4>

                {/* Method 1 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      Método 1: Registro DNS TXT (Recomendado para VTEX)
                    </span>
                    <span className="text-[10px] text-slate-400">Verificação de todo o domínio</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Acesse seu provedor de DNS (ex: Cloudflare, Registro.br, Route53) e crie uma entrada:
                  </p>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span>Tipo: TXT | Nome: @ | Valor: google-site-verification=exemploDeCodigoGSC12345</span>
                    <button
                      onClick={() => handleCopy('google-site-verification=exemploDeCodigoGSC12345', 'dns')}
                      className="text-pink-400 text-xs hover:text-pink-300"
                    >
                      {copiedText === 'dns' ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                {/* Method 2 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">
                      Método 2: Tag Meta HTML no VTEX IO
                    </span>
                    <span className="text-[10px] text-slate-400">Direto no Storefront</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Insira a tag no arquivo <code className="text-pink-400">store/blocks/header.jsonc</code> ou via Google Tag Manager:
                  </p>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span>&lt;meta name="google-site-verification" content="SEU_CODIGO_AQUI" /&gt;</span>
                    <button
                      onClick={() => handleCopy('<meta name="google-site-verification" content="SEU_CODIGO_AQUI" />', 'meta')}
                      className="text-pink-400 text-xs hover:text-pink-300"
                    >
                      {copiedText === 'meta' ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                {/* Method 3 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200">
                    Onde submeter o Sitemap da VTEX no GSC:
                  </span>
                  <p className="text-xs text-slate-300">
                    Na VTEX, o índice de sitemaps é gerado automaticamente na URL:{' '}
                    <code className="text-emerald-400 font-mono">https://www.sualoja.com.br/sitemap.xml</code>.
                    Basta colar essa URL na aba <strong>Sitemaps</strong> do Google Search Console.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSaveGoogle}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Salvar Configurações GSC
              </button>
            </div>
          )}

          {/* TAB 3: GA4 */}
          {activeSubTab === 'ga4' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Configuração do Google Analytics 4 (GA4)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  O GA4 é responsável por medir o tráfego de usuários, origens de campanha e funis de conversão
                  em perfeita sintonia com os pedidos faturados pela VTEX.
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
                    Encontrado em: Admin GA4 &gt; Fluxos de dados &gt; Web &gt; ID da métrica.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ID da Propriedade GA4
                  </label>
                  <input
                    type="text"
                    placeholder="ex: properties/412891920"
                    value={ga4Property}
                    onChange={(e) => setGa4Property(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* VTEX GTM Integration guide */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200">
                  Como ativar o GA4 nativamente no VTEX IO:
                </h4>
                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
                  <li>
                    Instale o app oficial da VTEX: <code className="text-pink-400 font-mono">vtex.google-tag-manager</code> no seu workspace ou admin da VTEX.
                  </li>
                  <li>
                    Em <strong>Admin VTEX &gt; Storefront &gt; Apps &gt; Google Tag Manager</strong>, cole o seu container GTM (ex: GTM-XXXXXX).
                  </li>
                  <li>
                    O app da VTEX dispara automaticamente os eventos do dataLayer recomendados pelo GA4 para e-commerce: <code className="text-amber-400 font-mono">view_item</code>, <code className="text-amber-400 font-mono">add_to_cart</code>, <code className="text-amber-400 font-mono">begin_checkout</code> e <code className="text-amber-400 font-mono">purchase</code>.
                  </li>
                </ol>
              </div>

              <button
                onClick={handleSaveGoogle}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors"
              >
                Salvar Configurações GA4
              </button>
            </div>
          )}

          {/* TAB 4: GEO & ROBOTS */}
          {activeSubTab === 'geo' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/10 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Configuração para GEO (Generative Engine Optimization)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Garanta que motores de IA generativa (ChatGPT Search, Perplexity e Google AI Overviews) consigam
                  acessar o catálogo da sua loja sem serem bloqueados no robots.txt da VTEX.
                </p>
              </div>

              {/* Robots.txt block */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    Regras recomendadas para o robots.txt na VTEX:
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `User-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: https://www.sualoja.com.br/sitemap.xml`,
                        'robots'
                      )
                    }
                    className="text-pink-400 text-xs hover:text-pink-300 flex items-center gap-1"
                  >
                    {copiedText === 'robots' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText === 'robots' ? 'Copiado!' : 'Copiar Diretivas'}</span>
                  </button>
                </div>

                <pre className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed">
{`User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Evitar que IAs indexem carrinhos ou checkout:
Disallow: /checkout/
Disallow: /account/
Disallow: /search?*

Sitemap: https://www.sualoja.com.br/sitemap.xml`}
                </pre>
              </div>

              {/* llms.txt guide */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <span className="font-bold text-slate-200 block">
                  Publicação do arquivo llms.txt na VTEX:
                </span>
                <p>
                  Você pode gerar o arquivo diretamente na aba <strong>GEO (IA Search)</strong> deste dashboard
                  e salvá-lo no Gerenciador de Arquivos Estáticos da VTEX ou adicioná-lo na pasta estática do seu tema VTEX IO.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
