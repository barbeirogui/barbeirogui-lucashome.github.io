import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  BellRing,
  Send,
  Check,
  CheckCheck,
  Sliders,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { AlertNotification } from '../utils/metricsEngine';

interface AlertsTabProps {
  alerts: AlertNotification[];
  onAcknowledgeAlert: (id: string) => void;
  onResolveAlert: (id: string) => void;
  dropThreshold: number;
  setDropThreshold: (val: number) => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
  dropThreshold,
  setDropThreshold,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'webhook' | 'slack'>('email');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const handleSimulateAlert = async (alert: AlertNotification) => {
    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const response = await fetch('/api/alerts/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: selectedChannel,
          alert,
          recipient: selectedChannel === 'slack' ? '#ecommerce-alerts' : 'ecommerce-team@lojamoda.com.br',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSimulationResult(data.message);
      } else {
        setSimulationResult('Falha na simulação.');
      }
    } catch (err: unknown) {
      setSimulationResult('Erro ao conectar ao serviço de notificações.');
    } finally {
      setIsSimulating(false);
    }
  };

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const totalEstimatedLoss = activeAlerts.reduce((acc, a) => acc + (a.estimatedRevenueLossBRL || 0), 0);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-rose-400 font-medium">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>SISTEMA DE ALERTA ANÔMALO DE QUEDAS BRUSCAS</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Monitoramento Automático de Quedas em Métricas Críticas
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Disparo proativo de notificações sempre que métricas vitais (Taxa de Conversão, Cliques Orgânicos,
          Abandono de Carrinho e Core Web Vitals) sofrerem variações negativas anormais além do limiar estipulado.
        </p>
      </div>

      {/* Financial Risk Banner */}
      {totalEstimatedLoss > 0 && (
        <div className="p-5 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/30 via-slate-900/60 to-slate-900/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 mt-0.5">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                Perda Financeira Potencial em Aberto
              </span>
              <div className="text-2xl font-extrabold text-white font-mono-numbers mt-0.5">
                R$ {totalEstimatedLoss.toLocaleString('pt-BR')} /mês
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Calculado com base nas quedas de conversão e cliques orgânicos ativas no momento.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
            Alertas Ativos: <strong className="text-rose-400 font-mono-numbers">{activeAlerts.length}</strong>
          </div>
        </div>
      )}

      {/* Threshold Config & Dispatch Simulation */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensitivity Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-pink-400" />
              <h2 className="text-sm font-bold text-white">Sensibilidade do Limiar de Queda</h2>
            </div>
            <span className="text-xs font-bold text-pink-400 font-mono-numbers bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Queda &gt; {dropThreshold}%
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Avisar a equipe imediatamente se uma métrica cair mais que a porcentagem tolerada.
          </p>

          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={dropThreshold}
            onChange={(e) => setDropThreshold(parseInt(e.target.value, 10))}
            className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          <div className="flex justify-between text-[11px] text-slate-400 font-mono-numbers">
            <span>5% (Alta sensibilidade)</span>
            <span>12% (Recomendado E-commerce)</span>
            <span>30% (Apenas colapsos)</span>
          </div>
        </div>

        {/* Dispatch Channel Simulator */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white">Canais de Notificação Automática</h2>
          </div>
          <p className="text-xs text-slate-300">
            Escolha o canal para receber avisos instantâneos via Webhook, Slack ou E-mail da diretoria.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedChannel('email')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                selectedChannel === 'email'
                  ? 'bg-slate-800 text-pink-400 border-pink-500/40 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              E-mail da Equipe
            </button>
            <button
              onClick={() => setSelectedChannel('slack')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                selectedChannel === 'slack'
                  ? 'bg-slate-800 text-pink-400 border-pink-500/40 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Canal Slack (#ecommerce)
            </button>
            <button
              onClick={() => setSelectedChannel('webhook')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                selectedChannel === 'webhook'
                  ? 'bg-slate-800 text-pink-400 border-pink-500/40 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Webhook / API
            </button>
          </div>

          {simulationResult && (
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{simulationResult}</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-base font-semibold text-white">
            Histórico & Fila de Alertas de Queda
          </h2>
          <span className="text-xs text-slate-400">
            {activeAlerts.length} não resolvidos
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <CheckCheck className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="text-sm font-semibold text-white">Nenhuma queda crítica detectada no momento!</p>
            <p className="text-xs text-slate-400">Todas as métricas da loja estão dentro dos padrões normais de tolerância.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((al) => (
              <div
                key={al.id}
                className={`p-5 rounded-xl border transition-all ${
                  al.resolved
                    ? 'border-slate-800 bg-slate-950/40 opacity-60'
                    : al.severity === 'critical'
                    ? 'border-rose-500/40 bg-rose-950/10'
                    : 'border-amber-500/40 bg-amber-950/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {al.severity === 'critical' ? (
                        <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <h3 className="text-sm font-bold text-white">{al.title}</h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          al.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {al.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{al.message}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSimulateAlert(al)}
                      disabled={isSimulating}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                      title="Testar envio imediato deste alerta"
                    >
                      <Send className="w-3 h-3 text-pink-400" />
                      <span>Testar Disparo</span>
                    </button>

                    {!al.resolved && (
                      <button
                        onClick={() => onResolveAlert(al.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Resolver</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Valor Anterior → Atual</span>
                    <strong className="text-white font-mono-numbers">
                      {al.previousValue} → <span className="text-rose-400">{al.currentValue}</span>
                    </strong>
                  </div>

                  {al.estimatedRevenueLossBRL && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Impacto Financeiro Estimado</span>
                      <strong className="text-rose-400 font-mono-numbers">
                        -R$ {al.estimatedRevenueLossBRL.toLocaleString('pt-BR')} /mês
                      </strong>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 block text-[11px]">Status</span>
                    <span className="text-slate-300">
                      {al.resolved ? 'Resolvido' : al.acknowledged ? 'Em Investigação' : 'Não Lido'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ação Recomendada:</strong> {al.suggestedAction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
