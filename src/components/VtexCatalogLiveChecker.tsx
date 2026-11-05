import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Zap,
  Globe,
  Layers,
  Clock,
  Wifi,
  WifiOff,
} from 'lucide-react';

export interface VtexCatalogPingResult {
  success: boolean;
  status: number;
  isOnline: boolean;
  accountName: string;
  environment: string;
  targetEndpoint: string;
  latencyMs: number;
  categoryCount?: number;
  rootCategories?: string[];
  checkedAt: string;
  message: string;
}

interface VtexCatalogLiveCheckerProps {
  accountName?: string;
  environment?: string;
  className?: string;
  autoCheckOnMount?: boolean;
}

export const VtexCatalogLiveChecker: React.FC<VtexCatalogLiveCheckerProps> = ({
  accountName = 'lucashome',
  environment = 'vtexcommercestable',
  className = '',
  autoCheckOnMount = true,
}) => {
  const [result, setResult] = useState<VtexCatalogPingResult | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheckTime, setLastCheckTime] = useState<string | null>(null);

  const checkConnection = async (targetAccount = accountName, targetEnv = environment) => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/vtex/ping-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountName: targetAccount,
          environment: targetEnv,
        }),
      });

      const data = await res.json();
      setResult(data);
      setLastCheckTime(new Date().toLocaleTimeString('pt-BR'));
    } catch (err: unknown) {
      setResult({
        success: false,
        status: 0,
        isOnline: false,
        accountName: targetAccount,
        environment: targetEnv,
        targetEndpoint: `https://${targetAccount}.${targetEnv}.com.br/api/catalog_system/pub/category/tree/3`,
        latencyMs: 0,
        checkedAt: new Date().toISOString(),
        message: err instanceof Error ? err.message : 'Falha ao conectar com o serviço local.',
      });
      setLastCheckTime(new Date().toLocaleTimeString('pt-BR'));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (autoCheckOnMount) {
      checkConnection(accountName, environment);
    }
  }, [accountName, environment, autoCheckOnMount]);

  const isSuccess = result?.status === 200 && result?.isOnline;
  const isError = result !== null && !isSuccess;

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        isChecking
          ? 'bg-slate-900/60 border-slate-800'
          : isSuccess
          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm shadow-emerald-950/30'
          : isError
          ? 'bg-rose-950/20 border-rose-500/40 shadow-sm shadow-rose-950/30'
          : 'bg-slate-900 border-slate-800'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title and Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg border transition-colors ${
              isChecking
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : isSuccess
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : isError
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isChecking ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : isSuccess ? (
              <Wifi className="w-5 h-5 text-emerald-400" />
            ) : isError ? (
              <WifiOff className="w-5 h-5 text-rose-400" />
            ) : (
              <Activity className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Verificação de Conexão em Tempo Real (Catálogo VTEX)
              </h4>
              {result && (
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide border flex items-center gap-1.5 ${
                    isSuccess
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSuccess ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>
                    {isSuccess ? `HTTP 200 OK` : `HTTP ${result.status || 'ERRO'}`}
                  </span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Loja:</span>
              <strong className="text-white font-mono">{accountName}</strong>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-[11px] text-slate-300">
                api/catalog_system/pub/category/tree/3
              </span>
            </p>
          </div>
        </div>

        {/* Action Button & Latency */}
        <div className="flex items-center gap-3">
          {result?.latencyMs !== undefined && !isChecking && (
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                Latência
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  result.latencyMs < 400
                    ? 'text-emerald-400'
                    : result.latencyMs < 1000
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {result.latencyMs}ms
              </span>
            </div>
          )}

          <button
            onClick={() => checkConnection(accountName, environment)}
            disabled={isChecking}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-sm ${
              isSuccess
                ? 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40'
                : isError
                ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            } disabled:opacity-50`}
            title="Executar ping em tempo real na API VTEX agora"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Pingando...' : 'Testar Conexão Agora'}</span>
          </button>
        </div>
      </div>

      {/* Result Details Card */}
      {result && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span
                className={`font-medium ${
                  isSuccess ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {result.message}
              </span>
            </div>

            {lastCheckTime && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Último teste às {lastCheckTime}</span>
              </span>
            )}
          </div>

          {/* Connected Categories Preview when 200 OK */}
          {isSuccess && result.rootCategories && result.rootCategories.length > 0 && (
            <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-pink-400" />
                <span>Categorias ativas retornadas ({result.categoryCount}):</span>
              </span>
              {result.rootCategories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 border border-slate-700 text-slate-200"
                >
                  {cat}
                </span>
              ))}
              {result.categoryCount && result.categoryCount > result.rootCategories.length && (
                <span className="text-[11px] text-slate-400 italic">
                  +{result.categoryCount - result.rootCategories.length} outras
                </span>
              )}
            </div>
          )}

          {/* Direct Endpoint Link */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="font-mono truncate max-w-[80%]">
              Endpoint testado: <code className="text-slate-300">{result.targetEndpoint}</code>
            </span>
            <a
              href={result.targetEndpoint}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium transition-colors"
            >
              <span>Abrir JSON</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
