/**
 * Pure calculation logic for VTEX Pulse: SEO, GEO, Search Console and Analytics metrics,
 * Month-over-Month comparisons, sudden drop anomaly detection, and conversion impact modeling.
 */

export interface MetricPoint {
  id: string;
  name: string;
  category: 'conversion' | 'seo' | 'geo' | 'gsc' | 'analytics' | 'vtex';
  currentValue: number;
  previousValue: number;
  unit: '%' | 'ms' | 's' | 'num' | 'currency' | 'score';
  targetValue?: number;
  directionBetter: 'up' | 'down';
  criticalDropThresholdPercent: number; // e.g. 15 means a 15% drop triggers a critical alert
}

export interface MetricComparison {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  deltaAbsolute: number;
  deltaPercent: number;
  status: 'improved' | 'degraded' | 'neutral';
  isCriticalDrop: boolean;
  unit: string;
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  metricId: string;
  metricName: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  currentValue: string;
  previousValue: string;
  deltaPercent: number;
  estimatedRevenueLossBRL?: number;
  suggestedAction: string;
  resolved: boolean;
  acknowledged: boolean;
}

/**
 * Calculates absolute and relative delta between current and previous values.
 */
export function calculateComparison(metric: MetricPoint): MetricComparison {
  const deltaAbsolute = metric.currentValue - metric.previousValue;
  const deltaPercent =
    metric.previousValue === 0
      ? 0
      : Number((((metric.currentValue - metric.previousValue) / metric.previousValue) * 100).toFixed(2));

  let status: 'improved' | 'degraded' | 'neutral' = 'neutral';
  let isCriticalDrop = false;

  if (metric.directionBetter === 'up') {
    if (deltaPercent > 0.5) status = 'improved';
    else if (deltaPercent < -0.5) status = 'degraded';

    // A drop happens when current is lower than previous
    if (deltaPercent <= -metric.criticalDropThresholdPercent) {
      isCriticalDrop = true;
    }
  } else {
    // Lower is better (e.g. LCP, Bounce rate, 404 count, Cart abandonment)
    if (deltaPercent < -0.5) status = 'improved';
    else if (deltaPercent > 0.5) status = 'degraded';

    // A drop/deterioration happens when the value increases negatively
    if (deltaPercent >= metric.criticalDropThresholdPercent) {
      isCriticalDrop = true;
    }
  }

  return {
    id: metric.id,
    name: metric.name,
    currentValue: metric.currentValue,
    previousValue: metric.previousValue,
    deltaAbsolute: Number(deltaAbsolute.toFixed(2)),
    deltaPercent,
    status,
    isCriticalDrop,
    unit: metric.unit,
  };
}

/**
 * Detects sudden drops across a list of metrics and generates structured alerts.
 */
export function detectSuddenDrops(
  metrics: MetricPoint[],
  monthlyRevenueBRL: number = 850000,
  monthlySessions: number = 120000
): AlertNotification[] {
  const alerts: AlertNotification[] = [];

  for (const metric of metrics) {
    const comp = calculateComparison(metric);

    if (comp.isCriticalDrop) {
      let estimatedLoss = 0;
      let actionSuggestion = '';
      let severity: 'critical' | 'warning' = 'critical';

      if (metric.id === 'conversion_rate') {
        // Revenue loss calculation based on conversion drop:
        // Revenue = Sessions * (ConvRate / 100) * AOV
        // Loss ~ Monthly Revenue * (abs(deltaPercent) / 100)
        estimatedLoss = Math.round(monthlyRevenueBRL * (Math.abs(comp.deltaPercent) / 100));
        actionSuggestion =
          'Investigar checkout VTEX, falhas de gateway de pagamento, lentidão em páginas de produto e tags recentes.';
      } else if (metric.id === 'organic_clicks') {
        const estimatedLostSessions = Math.round(monthlySessions * (Math.abs(comp.deltaPercent) / 100));
        estimatedLoss = Math.round(estimatedLostSessions * 0.02 * 280); // ~2% CR, R$280 AOV
        actionSuggestion =
          'Verificar desindexação no Google Search Console, canibalização de URLs após alterações de catálogo VTEX ou queda em Core Web Vitals.';
      } else if (metric.id === 'lcp_vitals') {
        severity = comp.deltaPercent > 40 ? 'critical' : 'warning';
        actionSuggestion =
          'Otimizar imagens de banner no VTEX CMS, ativar formato WebP/AVIF e adiar scripts pesados no VTEX IO.';
      } else if (metric.id === 'cart_abandonment') {
        estimatedLoss = Math.round(monthlyRevenueBRL * 0.15 * (Math.abs(comp.deltaPercent) / 100));
        actionSuggestion =
          'Validar cálculo de frete (SLA) dos transportadores VTEX, opções de PIX com desconto e velocidade do minicart.';
      } else if (metric.id === 'geo_visibility') {
        severity = 'warning';
        actionSuggestion =
          'Atualizar schema JSON-LD de produtos, revisar llms.txt e verificar permissões para crawlers de IA no robots.txt da loja.';
      } else {
        actionSuggestion = `Analisar telemetria detalhada de ${metric.name} e validar mudanças recentes na loja.`;
      }

      alerts.push({
        id: `alert_${metric.id}_${Date.now()}`,
        timestamp: new Date().toISOString(),
        metricId: metric.id,
        metricName: metric.name,
        severity,
        title: `Queda crítica detectada em ${metric.name}`,
        message: `${metric.name} variou ${comp.deltaPercent > 0 ? '+' : ''}${comp.deltaPercent}% em relação ao período anterior (${metric.previousValue} para ${metric.currentValue}${metric.unit}).`,
        currentValue: `${metric.currentValue}${metric.unit}`,
        previousValue: `${metric.previousValue}${metric.unit}`,
        deltaPercent: comp.deltaPercent,
        estimatedRevenueLossBRL: estimatedLoss > 0 ? estimatedLoss : undefined,
        suggestedAction: actionSuggestion,
        resolved: false,
        acknowledged: false,
      });
    }
  }

  return alerts;
}

/**
 * Calculates revenue upside from potential conversion rate improvement.
 */
export function calculateConversionOpportunity(
  currentSessions: number,
  currentCRPercent: number,
  averageOrderValueBRL: number,
  upliftPercentagePoints: number = 0.4
): {
  targetCRPercent: number;
  currentOrders: number;
  projectedOrders: number;
  additionalOrders: number;
  currentRevenueBRL: number;
  projectedRevenueBRL: number;
  additionalRevenueBRL: number;
} {
  const currentOrders = Math.round(currentSessions * (currentCRPercent / 100));
  const targetCRPercent = Number((currentCRPercent + upliftPercentagePoints).toFixed(2));
  const projectedOrders = Math.round(currentSessions * (targetCRPercent / 100));
  const additionalOrders = projectedOrders - currentOrders;

  const currentRevenueBRL = Math.round(currentOrders * averageOrderValueBRL);
  const projectedRevenueBRL = Math.round(projectedOrders * averageOrderValueBRL);
  const additionalRevenueBRL = projectedRevenueBRL - currentRevenueBRL;

  return {
    targetCRPercent,
    currentOrders,
    projectedOrders,
    additionalOrders,
    currentRevenueBRL,
    projectedRevenueBRL,
    additionalRevenueBRL,
  };
}

/**
 * Computes an overall SEO & GEO store health index (0 to 100).
 */
export function calculateStoreHealthScore(factors: {
  technicalSeoScore: number; // 0 - 100
  geoAiVisibilityScore: number; // 0 - 100
  coreWebVitalsScore: number; // 0 - 100
  gscIndexationRate: number; // 0 - 100
  catalogCompletenessScore: number; // 0 - 100
}): number {
  const weighted =
    factors.technicalSeoScore * 0.25 +
    factors.geoAiVisibilityScore * 0.25 +
    factors.coreWebVitalsScore * 0.2 +
    factors.gscIndexationRate * 0.15 +
    factors.catalogCompletenessScore * 0.15;

  return Math.round(Math.min(100, Math.max(0, weighted)));
}
