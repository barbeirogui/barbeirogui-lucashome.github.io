import {
  VtexConfig,
  GoogleConfig,
  GeoConfig,
  FunnelStage,
  SeoIssue,
  GscKeyword,
  GeoCitation,
  MonthlyComparativeData,
  OptimizationSuggestion,
} from '../types';
import { MetricPoint } from '../utils/metricsEngine';

export const initialVtexConfig: VtexConfig = {
  accountName: 'lojamoda-vtex',
  appKey: 'vtexappkey-lojamoda-XQZT92',
  appToken: '••••••••••••••••••••••••••••••••••••••',
  environment: 'vtexcommercestable',
  storeDomain: 'www.lojamoda.com.br',
  isConnected: true,
  lastConnectedAt: '2026-11-04 12:45',
  vtexVersion: 'VTEX CMS Legacy (Portal v1.8)',
};

export const initialGoogleConfig: GoogleConfig = {
  searchConsoleProperty: 'sc-domain:lojamoda.com.br',
  searchConsoleConnected: true,
  ga4PropertyId: 'properties/412891920',
  ga4MeasurementId: 'G-7X98WZ11AA',
  ga4Connected: true,
};

export const initialGeoConfig: GeoConfig = {
  llmsTxtDeployed: true,
  aiBotsAllowedInRobots: true,
  brandAuthorityScore: 82,
  citationSharePercent: 34.6,
};

export const coreMetricsData: MetricPoint[] = [
  {
    id: 'conversion_rate',
    name: 'Taxa de Conversão da Loja',
    category: 'conversion',
    currentValue: 2.38,
    previousValue: 2.89,
    unit: '%',
    directionBetter: 'up',
    criticalDropThresholdPercent: 12, // -17.6% drop -> triggers CRITICAL ALERT
  },
  {
    id: 'monthly_revenue',
    name: 'Faturamento Mensal Estimado',
    category: 'analytics',
    currentValue: 842500,
    previousValue: 915000,
    unit: 'currency',
    directionBetter: 'up',
    criticalDropThresholdPercent: 10,
  },
  {
    id: 'organic_clicks',
    name: 'Cliques Orgânicos (GSC)',
    category: 'gsc',
    currentValue: 148200,
    previousValue: 165400,
    unit: 'num',
    directionBetter: 'up',
    criticalDropThresholdPercent: 10,
  },
  {
    id: 'cart_abandonment',
    name: 'Abandono de Carrinho VTEX',
    category: 'vtex',
    currentValue: 71.4,
    previousValue: 64.2,
    unit: '%',
    directionBetter: 'down',
    criticalDropThresholdPercent: 10, // Increased by 11.2% -> triggers WARNING
  },
  {
    id: 'lcp_vitals',
    name: 'Largest Contentful Paint (LCP)',
    category: 'seo',
    currentValue: 3.4,
    previousValue: 2.2,
    unit: 's',
    directionBetter: 'down',
    criticalDropThresholdPercent: 25, // Increased by 54% -> triggers WARNING
  },
  {
    id: 'geo_visibility',
    name: 'Score de Presença GEO / IA',
    category: 'geo',
    currentValue: 82,
    previousValue: 74,
    unit: 'score',
    directionBetter: 'up',
    criticalDropThresholdPercent: 15,
  },
];

export const checkoutFunnelData: FunnelStage[] = [
  {
    stage: '1. Visualização de Produto (PDP)',
    visitors: 142500,
    dropoffRate: 72.8,
    conversionToNext: 27.2,
    revenuePotentialLoss: 412000,
  },
  {
    stage: '2. Adição ao Carrinho (Minicart)',
    visitors: 38760,
    dropoffRate: 58.4,
    conversionToNext: 41.6,
    revenuePotentialLoss: 285000,
  },
  {
    stage: '3. Início de Checkout / Identificação',
    visitors: 16120,
    dropoffRate: 34.2,
    conversionToNext: 65.8,
    revenuePotentialLoss: 145000,
  },
  {
    stage: '4. Cálculo de Frete & Pagamento',
    visitors: 10600,
    dropoffRate: 67.9,
    conversionToNext: 32.1,
    revenuePotentialLoss: 182000,
  },
  {
    stage: '5. Pedido Faturado (Sucesso)',
    visitors: 3402,
    dropoffRate: 0,
    conversionToNext: 100,
    revenuePotentialLoss: 0,
  },
];

export const seoIssuesData: SeoIssue[] = [
  {
    id: 'seo_1',
    type: 'critical',
    title: '18 URLs com Erro 301 em Cadeia / Loop no Gerenciador de URL do Portal',
    url: '/calcados/tenis-esportivos?order=OrderByPriceASC',
    impact: 'Desperdiça Crawl Budget do Google e causa desindexação de subcategorias.',
    module: 'CMS > Gerenciador de URL',
    remedy: 'No Admin VTEX > CMS > Gerenciador de URL, substitua rotas intermediárias por apontamento 301 direto para a URL canônica limpa.',
  },
  {
    id: 'seo_2',
    type: 'critical',
    title: 'Falta de Schema.org AggregateRating no Subtemplate de PDP do CMS Legacy',
    url: '/produtos/*',
    impact: 'Perda de Rich Snippets de estrelas e avaliações nos resultados do Google.',
    module: 'CMS Layout > Subtemplate PDP',
    remedy: 'Inserir script JSON-LD lendo o objeto nativo skuJson no Subtemplate de Produto (CMS > Layout > HTML Templates > Subtemplates).',
  },
  {
    id: 'seo_3',
    type: 'warning',
    title: 'LCP Elevado (3.4s) por Scripts Bloqueantes no Subtemplate Head e Imagens em /arquivos/',
    url: '/ (Home) e /colecao-verao',
    impact: 'Penalização no Core Web Vitals e aumento de 14% na taxa de rejeição no mobile.',
    module: 'CMS Layout > Subtemplate Head',
    remedy: 'Adicionar atributo defer em scripts de terceiros no subtemplate head e comprimir imagens no Gerenciador de Arquivos.',
  },
  {
    id: 'seo_4',
    type: 'warning',
    title: '64 Produtos com Title Tags Duplicados ou Genéricos no Catálogo',
    url: '/vestuario/camisas/*',
    impact: 'Canibalização interna de palavras-chave no Search Console.',
    module: 'Catálogo > Produtos e SKUs',
    remedy: 'Configurar template automático de Title Tag no Catálogo ou manipular a tag <vtex:meta /> no subtemplate head.',
  },
  {
    id: 'seo_5',
    type: 'info',
    title: 'Robots.txt e Sitemap Index sem indicação para AI Crawlers no CMS Portal',
    url: '/robots.txt',
    impact: 'Limita citações no ChatGPT Search e Perplexity.',
    module: 'CMS Layout > Gerenciador de Arquivos',
    remedy: 'Liberar User-Agent: PerplexityBot e GPTBot no arquivo robots.txt estático via Gerenciador de Arquivos.',
  },
];

export const gscKeywordsData: GscKeyword[] = [
  {
    query: 'tenis esportivo masculino amortecimento',
    clicks: 12400,
    impressions: 184000,
    ctr: 6.74,
    position: 4.2,
    opportunityType: 'low-hanging',
    suggestedAction: 'Otimizar Meta Title com preço e parcelamento para subir CTR de 6.7% para 9.5%.',
  },
  {
    query: 'loja moda feminina vestidos festa',
    clicks: 8900,
    impressions: 112000,
    ctr: 7.95,
    position: 2.8,
    opportunityType: 'high-performer',
    suggestedAction: 'Manter autoridade e criar links internos a partir da Home da VTEX.',
  },
  {
    query: 'sandalia salto bloco couro legitimo',
    clicks: 3450,
    impressions: 98000,
    ctr: 3.52,
    position: 7.6,
    opportunityType: 'low-hanging',
    suggestedAction: 'Adicionar FAQ schema e sinônimos no Intelligent Search.',
  },
  {
    query: 'jaqueta corta vento impermeavel corrida',
    clicks: 2100,
    impressions: 84000,
    ctr: 2.5,
    position: 11.4,
    opportunityType: 'declining',
    suggestedAction: 'Queda de 3 posições. Atualizar especificações técnicas e reviews na PDP.',
  },
  {
    query: 'tenis corrida feminino leve',
    clicks: 6700,
    impressions: 76000,
    ctr: 8.81,
    position: 3.1,
    opportunityType: 'cannibalized',
    suggestedAction: 'Duas URLs competindo (/calcados/feminino e /colecao-tenis). Definir canonical única.',
  },
];

export const geoCitationsData: GeoCitation[] = [
  {
    engine: 'Perplexity',
    promptQuery: 'Melhores tênis de corrida com custo benefício no Brasil em 2026',
    brandMentioned: true,
    citationRank: 1,
    sentiment: 'positive',
    dateChecked: '03 Nov 2026',
  },
  {
    engine: 'ChatGPT Search',
    promptQuery: 'Onde comprar roupas de linho premium online entrega rápida',
    brandMentioned: true,
    citationRank: 3,
    sentiment: 'positive',
    dateChecked: '02 Nov 2026',
  },
  {
    engine: 'Google AI Overviews',
    promptQuery: 'Cupom e frete grátis loja moda esportiva',
    brandMentioned: false,
    citationRank: null,
    sentiment: 'neutral',
    dateChecked: '01 Nov 2026',
  },
  {
    engine: 'Microsoft Copilot',
    promptQuery: 'Lojas online confiáveis com nota alta no Reclame Aqui calçados',
    brandMentioned: true,
    citationRank: 2,
    sentiment: 'positive',
    dateChecked: '30 Out 2026',
  },
];

export const monthlyComparativeReports: MonthlyComparativeData = {
  monthName: 'Outubro 2026',
  previousMonthName: 'Setembro 2026',
  metrics: {
    revenue: { current: 842500, previous: 915000, unit: 'R$' },
    orders: { current: 3402, previous: 3820, unit: '' },
    conversionRate: { current: 2.38, previous: 2.89, unit: '%' },
    sessions: { current: 142500, previous: 132100, unit: '' },
    organicClicks: { current: 148200, previous: 165400, unit: '' },
    averageOrderValue: { current: 247.6, previous: 239.5, unit: 'R$' },
    bounceRate: { current: 48.2, previous: 44.1, unit: '%' },
    cartAbandonment: { current: 71.4, previous: 64.2, unit: '%' },
    lcpSeconds: { current: 3.4, previous: 2.2, unit: 's' },
    geoScore: { current: 82, previous: 74, unit: 'pts' },
  },
  highlights: [
    'O Ticket Médio (AOV) cresceu +3.4% (R$ 239,50 para R$ 247,60) impulsionado por bundles de cross-sell no checkout.',
    'A presença GEO em motores de IA (ChatGPT e Perplexity) subiu de 74 para 82 pontos graças à publicação do arquivo llms.txt.',
    'O volume total de sessões teve aumento de +7.8% com expansão de campanhas e engajamento social.',
  ],
  mainRisks: [
    'Queda de -17.6% na Taxa de Conversão da loja (de 2.89% para 2.38%), representando perda estimada de ~R$ 72.500 no mês.',
    'Aumento de 11.2% no abandono de carrinho, concentrado na etapa de cálculo de frete de transportadoras parceiras.',
    'Degradação do Core Web Vitals (LCP subiu de 2.2s para 3.4s), afetando o ranqueamento orgânico mobile no Google.',
  ],
};

export const regionalConversionData = [
  { region: 'São Paulo (SP)', sessions: 62400, cr: 3.12, revenue: 482000 },
  { region: 'Rio de Janeiro (RJ)', sessions: 28100, cr: 2.45, revenue: 172000 },
  { region: 'Minas Gerais (MG)', sessions: 19800, cr: 2.15, revenue: 104000 },
  { region: 'Região Sul (PR/SC/RS)', sessions: 21500, cr: 2.28, revenue: 118000 },
  { region: 'Centro-Oeste & Nordeste', sessions: 10700, cr: 1.62, revenue: 41500 },
];

export const devicePerformanceData = [
  { device: 'Mobile', shareSessions: 78.5, cr: 1.98, lcp: '3.6s', bounceRate: '52.4%' },
  { device: 'Desktop', shareSessions: 21.5, cr: 3.84, lcp: '1.9s', bounceRate: '32.1%' },
];
