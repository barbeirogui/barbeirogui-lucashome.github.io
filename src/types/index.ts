export interface VtexConfig {
  accountName: string;
  appKey: string;
  appToken: string;
  environment: string;
  storeDomain: string;
  isConnected: boolean;
  lastConnectedAt?: string;
  vtexVersion?: string;
}

export interface GoogleConfig {
  searchConsoleProperty: string;
  searchConsoleConnected: boolean;
  ga4PropertyId: string;
  ga4MeasurementId: string;
  ga4Connected: boolean;
}

export interface GeoConfig {
  llmsTxtDeployed: boolean;
  aiBotsAllowedInRobots: boolean;
  brandAuthorityScore: number;
  citationSharePercent: number;
}

export interface FunnelStage {
  stage: string;
  visitors: number;
  dropoffRate: number;
  conversionToNext: number;
  revenuePotentialLoss: number;
}

export interface SeoIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  url: string;
  impact: string;
  module: string;
  remedy: string;
}

export interface GscKeyword {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  opportunityType: 'low-hanging' | 'high-performer' | 'declining' | 'cannibalized';
  suggestedAction: string;
}

export interface GeoCitation {
  engine: 'Perplexity' | 'ChatGPT Search' | 'Google AI Overviews' | 'Microsoft Copilot';
  promptQuery: string;
  brandMentioned: boolean;
  citationRank: number | null; // 1 = 1st cited source
  sentiment: 'positive' | 'neutral' | 'negative';
  dateChecked: string;
}

export interface MonthlyComparativeData {
  monthName: string;
  previousMonthName: string;
  metrics: {
    revenue: { current: number; previous: number; unit: 'R$' };
    orders: { current: number; previous: number; unit: '' };
    conversionRate: { current: number; previous: number; unit: '%' };
    sessions: { current: number; previous: number; unit: '' };
    organicClicks: { current: number; previous: number; unit: '' };
    averageOrderValue: { current: number; previous: number; unit: 'R$' };
    bounceRate: { current: number; previous: number; unit: '%' };
    cartAbandonment: { current: number; previous: number; unit: '%' };
    lcpSeconds: { current: number; previous: number; unit: 's' };
    geoScore: { current: number; previous: number; unit: 'pts' };
  };
  highlights: string[];
  mainRisks: string[];
}

export interface OptimizationSuggestion {
  id: string;
  title: string;
  category: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  estimatedConversionUplift: string;
  difficulty: 'Fácil' | 'Moderado' | 'Avançado';
  problemSummary: string;
  actionSteps: string[];
  codeSnippet?: string;
  vtexModule: string;
  status?: 'pendente' | 'em_progresso' | 'aplicado';
}
