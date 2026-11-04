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

export interface ToolValidationCheck {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  detail: string;
}

export interface ToolValidationResult {
  tool: 'vtex' | 'gsc' | 'ga4' | 'geo';
  isValid: boolean;
  latencyMs?: number;
  summary: string;
  checks: ToolValidationCheck[];
  testedAt: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
}

export interface SitemapValidationResult {
  sitemapIndexUrl: string;
  isIndexReachable: boolean;
  totalSubSitemaps: number;
  totalUrls: number;
  valid200Count: number;
  redirect301Count: number;
  error404Count: number;
  warningCount: number;
  testedAt: string;
  subSitemaps: Array<{
    name: string;
    url: string;
    urlCount: number;
    status: 'ok' | 'warning' | 'error';
    lastModified: string;
  }>;
  criticalIssues: Array<{
    id: string;
    url: string;
    issueType: '404_broken' | '301_redirect_in_sitemap' | 'trailing_slash_mismatch' | 'legacy_param';
    impact: string;
    remedy: string;
  }>;
}

export interface UrlCheckResult {
  url: string;
  status: 200 | 301 | 404 | 500;
  latencyMs: number;
  canonicalUrl?: string;
  hasCanonicalMismatch: boolean;
  hasTrailingSlashIssue: boolean;
  hasLegacyQueryParam: boolean;
  recommendation: string;
}

export interface VtexUrlBuildResult {
  generatedUrl: string;
  canonicalPath: string;
  slugSanitized: string;
  urlType: 'product' | 'category' | 'department' | 'search_filter';
  isVtexLegacyStandard: boolean;
  portalUrlManagerRule?: {
    source: string;
    destination: string;
    redirectType: '301' | '302';
  };
  notes: string[];
}


