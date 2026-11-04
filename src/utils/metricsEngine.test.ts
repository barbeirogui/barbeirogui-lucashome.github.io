import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateComparison,
  detectSuddenDrops,
  calculateConversionOpportunity,
  calculateStoreHealthScore,
  MetricPoint,
} from './metricsEngine';

test('calculateComparison identifies improvement for metrics where higher is better', () => {
  const metric: MetricPoint = {
    id: 'organic_clicks',
    name: 'Cliques Orgânicos',
    category: 'gsc',
    currentValue: 120000,
    previousValue: 100000,
    unit: 'num',
    directionBetter: 'up',
    criticalDropThresholdPercent: 15,
  };

  const comp = calculateComparison(metric);
  assert.equal(comp.status, 'improved');
  assert.equal(comp.deltaPercent, 20);
  assert.equal(comp.isCriticalDrop, false);
});

test('calculateComparison identifies critical drop when conversion rate drops > threshold', () => {
  const metric: MetricPoint = {
    id: 'conversion_rate',
    name: 'Taxa de Conversão',
    category: 'conversion',
    currentValue: 2.1,
    previousValue: 2.8,
    unit: '%',
    directionBetter: 'up',
    criticalDropThresholdPercent: 15, // Drop from 2.8 to 2.1 is -25%
  };

  const comp = calculateComparison(metric);
  assert.equal(comp.status, 'degraded');
  assert.equal(comp.deltaPercent, -25);
  assert.equal(comp.isCriticalDrop, true);
});

test('calculateComparison handles metrics where lower is better (e.g. LCP vitals)', () => {
  const metric: MetricPoint = {
    id: 'lcp_vitals',
    name: 'Largest Contentful Paint (LCP)',
    category: 'seo',
    currentValue: 3.6,
    previousValue: 2.2,
    unit: 's',
    directionBetter: 'down',
    criticalDropThresholdPercent: 30, // Increase of >30% in load time is critical
  };

  const comp = calculateComparison(metric);
  assert.equal(comp.status, 'degraded');
  assert.equal(comp.isCriticalDrop, true);
});

test('detectSuddenDrops extracts actionable alerts with financial impact', () => {
  const metrics: MetricPoint[] = [
    {
      id: 'conversion_rate',
      name: 'Taxa de Conversão',
      category: 'conversion',
      currentValue: 2.1,
      previousValue: 2.8,
      unit: '%',
      directionBetter: 'up',
      criticalDropThresholdPercent: 15,
    },
    {
      id: 'cart_abandonment',
      name: 'Abandono de Carrinho',
      category: 'analytics',
      currentValue: 80,
      previousValue: 65,
      unit: '%',
      directionBetter: 'down',
      criticalDropThresholdPercent: 15,
    },
  ];

  const alerts = detectSuddenDrops(metrics, 1000000, 150000);
  assert.equal(alerts.length, 2);
  assert.equal(alerts[0].severity, 'critical');
  assert.ok((alerts[0].estimatedRevenueLossBRL ?? 0) > 0);
  assert.ok(alerts[0].suggestedAction.includes('checkout VTEX'));
});

test('calculateConversionOpportunity correctly projects additional revenue', () => {
  const opp = calculateConversionOpportunity(100000, 2.0, 300, 0.5);
  // Current: 100,000 * 2% = 2,000 orders * 300 = R$ 600,000
  // Target: 2.5% = 2,500 orders * 300 = R$ 750,000
  // Additional: 500 orders, R$ 150,000
  assert.equal(opp.currentOrders, 2000);
  assert.equal(opp.projectedOrders, 2500);
  assert.equal(opp.additionalOrders, 500);
  assert.equal(opp.currentRevenueBRL, 600000);
  assert.equal(opp.projectedRevenueBRL, 750000);
  assert.equal(opp.additionalRevenueBRL, 150000);
});

test('calculateStoreHealthScore computes balanced index within 0-100', () => {
  const score = calculateStoreHealthScore({
    technicalSeoScore: 88,
    geoAiVisibilityScore: 82,
    coreWebVitalsScore: 90,
    gscIndexationRate: 95,
    catalogCompletenessScore: 85,
  });

  assert.ok(score >= 80 && score <= 95);
});
