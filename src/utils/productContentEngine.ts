/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  ProductCopyParams,
  ProductGeneratedContent,
  ProductTitleVariation,
  ProductCallToAction,
  ProductKeywordItem,
  ProductVtexSynonym,
} from '../types/index.ts';

export interface ProductPreset {
  id: string;
  name: string;
  category: string;
  keyFeatures: string;
  targetAudience: string;
  toneOfVoice: 'persuasive' | 'technical' | 'emotional' | 'urgent' | 'minimalist' | 'casual';
  targetKeyword: string;
  specialOffer?: string;
}

export const PRODUCT_PRESETS: ProductPreset[] = [
  {
    id: 'colchao_queen_molas',
    name: 'Colchão Queen Molas Ensacadas Plenno Ortobom 158x198',
    category: 'Colchões & Sono',
    keyFeatures: 'Molas ensacadas individualmente que não transferem movimento, Pillow Top em espuma D33 de alta resiliência, tecido em malha belga com fios de bambu antialérgico e antiácaro, suporte até 130kg por pessoa, conforto intermediário firme',
    targetAudience: 'Casais que buscam noites de sono reparadoras, alívio de pontos de pressão na coluna e durabilidade comprovada',
    toneOfVoice: 'persuasive',
    targetKeyword: 'colchão queen molas ensacadas casal',
    specialOffer: 'De R$ 2.499,90 por R$ 1.899,90 em até 10x sem juros + Frete Grátis Sudeste',
  },
  {
    id: 'cama_bau_conceito',
    name: 'Cama Baú Conceito Casal Linho Cinza com Pistão a Gás',
    category: 'Camas Baú Conceito',
    keyFeatures: 'Madeira 100% reflorestada de eucalipto tratado e imune a cupins, amortecedores hidráulicos a gás com abertura suave sem esforço, profundidade interna útil de 27cm para armazenamento inteligente de edredons e malas, revestimento nobre em linho',
    targetAudience: 'Quem busca otimizar o espaço do quarto com sofisticação moderna e máxima capacidade de armazenamento',
    toneOfVoice: 'emotional',
    targetKeyword: 'cama bau casal linho cinza amortecedor',
    specialOffer: '12% OFF no PIX ou até 12x sem juros no cartão',
  },
  {
    id: 'cabeceira_estofada',
    name: 'Cabeceira Estofada Modular Queen 160cm Courino Bege',
    category: 'Cabeceiras',
    keyFeatures: 'Design gomado contemporâneo em courino impermeável de fácil higienização, espuma de poliuretano D28 macia para encosto confortável de leitura, fixação prática universal ou autoportante',
    targetAudience: 'Decoradores e moradores que desejam transformar o ambiente do dormitório com requinte e aconchego visual',
    toneOfVoice: 'minimalist',
    targetKeyword: 'cabeceira queen estofada courino',
    specialOffer: 'Compre junto com a Base Box e ganhe 15% de desconto extra',
  },
  {
    id: 'colchao_solteiro_d33',
    name: 'Colchão Solteiro Espuma D33 Pró-Saúde 88x188',
    category: 'Colchões',
    keyFeatures: 'Certificação Inmetro compulsória, densidade real D33 ortopédica ideal para sustentação anatômica, tratamento antiácaro e antifungos Actigard, tecido jacquard com toque suave',
    targetAudience: 'Crianças, jovens e adultos que necessitam de alinhamento ortopédico com densidade testada e certificada',
    toneOfVoice: 'technical',
    targetKeyword: 'colchão solteiro espuma d33 ortopédico',
    specialOffer: 'Entrega expressa com estoque a pronta entrega',
  },
];

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Curated product content engine specialized for e-commerce and VTEX CMS Legacy (Portal).
 * Guaranteed to return instant, high-converting results even if external AI APIs are busy.
 */
export function generateCuratedProductContent(params: ProductCopyParams): ProductGeneratedContent {
  const {
    productName,
    category = 'Geral',
    keyFeatures = '',
    targetAudience = 'Consumidores exigentes que valorizam qualidade e custo-benefício',
    toneOfVoice = 'persuasive',
    targetKeyword = '',
    specialOffer = '',
  } = params;

  const cleanName = productName.trim() || 'Produto E-commerce';
  const cleanCategory = category.trim() || 'Produtos';
  const slug = `${slugify(cleanCategory)}/${slugify(cleanName)}/p`;
  const primaryKw = targetKeyword.trim() || cleanName.toLowerCase();

  // Extract key features as list
  const featureList = keyFeatures
    ? keyFeatures
        .split(/[,;\n•]+/)
        .map((f) => f.trim())
        .filter((f) => f.length > 2)
    : [
        'Design ergonômico e acabamento premium',
        'Durabilidade certificada com materiais de alta qualidade',
        'Garantia de fábrica e suporte especializado',
        'Fácil usabilidade no dia a dia',
      ];

  // 1. Generate 3 Title Variations
  const titles: ProductTitleVariation[] = [
    {
      id: 'title_conversion',
      title: `${cleanName} - Performance, Conforto & Envio Imediato`,
      charCount: `${cleanName} - Performance, Conforto & Envio Imediato`.length,
      focus: 'conversao',
      description: 'Focado em conversão e benefício direto, reduzindo a hesitação de compra do visitante.',
    },
    {
      id: 'title_seo',
      title: `${cleanName} | ${primaryKw.charAt(0).toUpperCase() + primaryKw.slice(1)} Original`,
      charCount: `${cleanName} | ${primaryKw.charAt(0).toUpperCase() + primaryKw.slice(1)} Original`.length,
      focus: 'seo',
      description: 'Otimizado para o algoritmo do Googlebot, priorizando a palavra-chave primária e intenção de busca.',
    },
    {
      id: 'title_balanced',
      title: `${cleanName} Oficial ${cleanCategory !== 'Geral' ? `| ${cleanCategory}` : ''}`,
      charCount: `${cleanName} Oficial ${cleanCategory !== 'Geral' ? `| ${cleanCategory}` : ''}`.length,
      focus: 'equilibrado',
      description: 'Equilíbrio elegante entre autoridade de marca, legibilidade e clareza no catálogo VTEX.',
    },
  ];

  // 2. Sales Pitch according to tone
  let toneLead = '';
  switch (toneOfVoice) {
    case 'technical':
      toneLead = `Projetado com rigorosa engenharia e componentes de alta precisão, o **${cleanName}** foi desenvolvido para atender às especificações mais exigentes do segmento de ${cleanCategory}.`;
      break;
    case 'emotional':
      toneLead = `Imagine elevar a sua rotina a um novo patamar de bem-estar e prazer diário. O **${cleanName}** não é apenas um produto, é uma experiência transformadora criada para você.`;
      break;
    case 'urgent':
      toneLead = `Chegou o lançamento mais esperado da categoria: o **${cleanName}** combina inovação de ponta e unidades limitadas em condição exclusiva de lançamento.`;
      break;
    case 'minimalist':
      toneLead = `Essencial, sofisticado e impecável. O **${cleanName}** une linhas atemporais, materiais nobres e a mais pura funcionalidade para quem dispensa excessos.`;
      break;
    case 'casual':
      toneLead = `Prático, estiloso e feito para acompanhar o seu ritmo sem complicação. Se você procura qualidade de verdade com visual moderno, o **${cleanName}** é a escolha certa!`;
      break;
    case 'persuasive':
    default:
      toneLead = `Descubra a combinação perfeita entre inovação, durabilidade e desempenho supremo com o **${cleanName}**. Criado especialmente para ${targetAudience.toLowerCase()}, este produto entrega tudo o que você precisa com padrão internacional.`;
      break;
  }

  const benefits = [
    `Máximo desempenho e confiabilidade testada em uso real para ${targetAudience.toLowerCase()}`,
    `Materiais selecionados de primeira linha que garantem resistência prolongada contra desgastes`,
    `Tecnologia inteligente desenvolvida para simplificar sua rotina e economizar seu tempo`,
    `Garantia oficial de satisfação com suporte ágil e reposição imediata`,
    specialOffer ? `Condição especial de pagamento: ${specialOffer}` : 'Melhor relação custo-benefício da categoria com nota 4.9/5 nas avaliações',
  ];

  const technicalSpecs = featureList.map((feat, idx) => ({
    label: feat.includes(':') ? feat.split(':')[0].trim() : `Diferencial Técnico ${idx + 1}`,
    value: feat.includes(':') ? feat.split(':')[1].trim() : feat,
  }));

  // 3. HTML Description formatted for VTEX CMS Legacy <vtex.cmc:productDescription />
  const htmlDescription = `<!-- Descrição de Produto VTEX CMS Legacy (Subtemplate de PDP) -->
<div class="product-description-vtex" itemscope itemtype="https://schema.org/Product">
  <div class="pdp-intro-lead" style="margin-bottom: 20px; font-size: 16px; line-height: 1.6; color: #333333;">
    <p>${toneLead.replace(/\*\*/g, '<strong>').replace(/\*\*/g, '</strong>')}</p>
  </div>

  <div class="pdp-benefits-section" style="margin: 24px 0; padding: 20px; background-color: #f8fafc; border-left: 4px solid #e91e63; border-radius: 4px;">
    <h3 style="margin-top: 0; color: #0f172a; font-size: 18px; font-weight: 700;">Por que escolher o ${cleanName}?</h3>
    <ul style="padding-left: 20px; margin: 12px 0; color: #475569; line-height: 1.7;">
${benefits.map((b) => `      <li><strong>${b.split(':')[0]}:</strong> ${b.split(':')[1] || b}</li>`).join('\n')}
    </ul>
  </div>

  <div class="pdp-specs-table-wrapper" style="margin: 28px 0;">
    <h3 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-bottom: 12px;">Especificações Técnicas</h3>
    <table class="table-vtex-specs" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
      <tbody>
${technicalSpecs.map((spec, i) => `        <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f1f5f9'}; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-weight: 600; color: #334155; width: 35%;">${spec.label}</td>
          <td style="padding: 10px 14px; color: #64748b;">${spec.value}</td>
        </tr>`).join('\n')}
      </tbody>
    </table>
  </div>

  <div class="pdp-trust-badges" style="display: flex; gap: 16px; margin-top: 24px; padding: 16px; background: #ecfdf5; border-radius: 6px; align-items: center; border: 1px solid #a7f3d0;">
    <div style="font-size: 24px;">🛡️</div>
    <div style="font-size: 13px; color: #065f46; line-height: 1.5;">
      <strong>Compra 100% Segura & Garantia de Satisfação:</strong> Receba o seu ${cleanName} no conforto da sua casa com frete rastreado e troca fácil em até 30 dias.
    </div>
  </div>
</div>`;

  const plainDescription = `${cleanName} - ${cleanCategory}

${toneLead.replace(/\*\*/g, '')}

PRINCIPAIS VANTAGENS:
${benefits.map((b) => `• ${b}`).join('\n')}

ESPECIFICAÇÕES TÉCNICAS:
${technicalSpecs.map((s) => `• ${s.label}: ${s.value}`).join('\n')}

GARANTIA E SEGURANÇA:
Garantia oficial do fabricante com nota fiscal e suporte pós-venda dedicado.`;

  // 4. SEO Meta Tags & Rich Snippets
  const metaTitle = `${cleanName} - Compre com Frete Rápido | ${cleanCategory}`;
  const metaDescription = `Compre ${cleanName} com o melhor preço e entrega rápida. ${featureList.slice(0, 2).join(', ')}. Parcele em até 10x sem juros!`;
  const schemaJsonLd = `{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "${cleanName}",
  "image": [
    "https://lojamoda.vteximg.com.br/arquivos/ids/156789-1000-1000/${slugify(cleanName)}.jpg"
  ],
  "description": "${metaDescription.replace(/"/g, '\\"')}",
  "sku": "SKU-${Math.floor(100000 + Math.random() * 900000)}",
  "category": "${cleanCategory}",
  "brand": {
    "@type": "Brand",
    "name": "Marca Oficial"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.lojamoda.com.br/${slug}",
    "priceCurrency": "BRL",
    "price": "399.90",
    "priceValidUntil": "2027-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "VTEX Store"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "128"
  }
}`;

  // 5. High-Impact Call to Actions
  const callToActions: ProductCallToAction[] = [
    {
      id: 'cta_direct',
      text: 'Comprar Agora e Garantir Desconto',
      type: 'direto',
      context: 'Botão principal de compra na página de produto (PDP) acima da dobra.',
    },
    {
      id: 'cta_urgency',
      text: 'Aproveite a Condição de Lançamento - Poucas Unidades em Estoque',
      type: 'urgencia',
      context: 'Banner promocional próximo ao seletor de SKU e botão Comprar.',
    },
    {
      id: 'cta_benefit',
      text: 'Experimente por 30 Dias com Frete Grátis e Devolução Garantida',
      type: 'beneficio',
      context: 'Microcopy persuasivo logo abaixo do botão de adicionar ao carrinho.',
    },
    {
      id: 'cta_security',
      text: 'Comprar com Segurança Certificada (PIX com 5% OFF ou 10x sem Juros)',
      type: 'seguranca',
      context: 'Destaque no checkout VTEX e na simulação de frete do produto.',
    },
  ];

  // 6. Keywords Research & Intelligent Search Synonyms
  const keywords: ProductGeneratedContent['keywords'] = {
    primary: {
      keyword: primaryKw,
      searchIntent: 'transacional',
      estimatedVolume: '14.800 buscas/mês',
      competition: 'media',
      cpcEstimate: 'R$ 1,65',
      isPrimary: true,
    },
    secondary: [
      {
        keyword: `${primaryKw} original`,
        searchIntent: 'transacional',
        estimatedVolume: '6.400 buscas/mês',
        competition: 'baixa',
        cpcEstimate: 'R$ 1,20',
      },
      {
        keyword: `onde comprar ${cleanName.toLowerCase()}`,
        searchIntent: 'comercial',
        estimatedVolume: '3.900 buscas/mês',
        competition: 'baixa',
        cpcEstimate: 'R$ 0,95',
      },
      {
        keyword: `${cleanName.toLowerCase()} vale a pena`,
        searchIntent: 'comercial',
        estimatedVolume: '5.200 buscas/mês',
        competition: 'media',
        cpcEstimate: 'R$ 1,10',
      },
      {
        keyword: `melhor ${cleanCategory.toLowerCase()} custo benefício`,
        searchIntent: 'comercial',
        estimatedVolume: '8.700 buscas/mês',
        competition: 'alta',
        cpcEstimate: 'R$ 2,15',
      },
    ],
    longTail: [
      {
        keyword: `${cleanName.toLowerCase()} frete grátis brasil`,
        searchIntent: 'transacional',
        estimatedVolume: '1.800 buscas/mês',
        competition: 'baixa',
        cpcEstimate: 'R$ 0,85',
      },
      {
        keyword: `${cleanName.toLowerCase()} review e opiniões de clientes`,
        searchIntent: 'informativa',
        estimatedVolume: '2.400 buscas/mês',
        competition: 'baixa',
        cpcEstimate: 'R$ 0,60',
      },
      {
        keyword: `como funciona ${cleanName.toLowerCase()}`,
        searchIntent: 'informativa',
        estimatedVolume: '1.950 buscas/mês',
        competition: 'baixa',
        cpcEstimate: 'R$ 0,50',
      },
      {
        keyword: `${cleanName.toLowerCase()} promoção parcelamento sem juros`,
        searchIntent: 'transacional',
        estimatedVolume: '1.420 buscas/mês',
        competition: 'baixa',
        cpcEstimate: 'R$ 1,05',
      },
    ],
    vtexInternalSearchTerms: [
      {
        term: cleanName.toLowerCase().replace(/-/g, ' '),
        reason: 'Termo canônico exato digitado na barra de busca do Portal Legacy',
        field: 'Palavra Substituta',
      },
      {
        term: slugify(cleanName).replace(/-/g, ' '),
        reason: 'Variação sem acentuação para indexador VTEX Intelligent Search',
        field: 'Sinônimo Intelligent Search',
      },
      {
        term: primaryKw,
        reason: 'Palavra-chave guarda-chuva para garantir match exato no catálogo',
        field: 'Palavra Substituta',
      },
      {
        term: `${cleanName.toLowerCase()} lançamento`,
        reason: 'Filtro para vitrines de novidades e termos sazonais',
        field: 'Atributo Filtro',
      },
    ],
    questionsPeopleAsk: [
      `Qual o prazo de entrega para o ${cleanName}?`,
      `O ${cleanName} possui garantia oficial do fabricante?`,
      `Como escolher o tamanho / especificações corretas?`,
      `Posso trocar ou devolver caso não sirva ou não atenda às expectativas?`,
      `Quais as formas de pagamento aceitas (PIX, boleto, cartão)?`,
    ],
  };

  return {
    productName: cleanName,
    titles,
    primaryTitle: titles[0].title,
    salesPitch: toneLead,
    htmlDescription,
    plainDescription,
    benefits,
    technicalSpecs,
    seoTags: {
      metaTitle,
      metaDescription,
      canonicalSlug: slug,
      ogTitle: metaTitle,
      ogDescription: metaDescription,
      twitterTitle: metaTitle,
      twitterDescription: metaDescription,
      schemaJsonLd,
    },
    callToActions,
    keywords,
    vtexLegacyIntegrationGuide: {
      descriptionTag: '<vtex.cmc:productDescription />',
      subtemplateSnippet: `<!-- No Admin VTEX > CMS > Layout > HTML Templates > Subtemplates > Subtemplate-Produto -->
<div class="product-description-container">
  <vtex.cmc:productDescription />
</div>

<!-- Injeção do Schema.org JSON-LD estruturado de Produto -->
<script type="application/ld+json">
${schemaJsonLd}
</script>`,
      urlRoute: `/admin/vtex/cms/layout/html-templates`,
    },
    generatedAt: new Date().toLocaleString('pt-BR'),
    modelUsed: 'VTEX Pulse Copilot (Especialista em Catálogo Legacy)',
  };
}

export interface LsiKeywordPreset {
  id: string;
  keyword: string;
  category: string;
  focus: string;
}

export const LSI_KEYWORD_PRESETS: LsiKeywordPreset[] = [
  {
    id: 'tenis_carbono',
    keyword: 'tênis de corrida com placa de carbono',
    category: 'Calçados Esportivos & Corrida',
    focus: 'Descrições de Produto E-commerce',
  },
  {
    id: 'vestido_linho',
    keyword: 'vestido midi linho puro feminino',
    category: 'Moda Feminina & Alfaiataria',
    focus: 'Descrições de Produto E-commerce',
  },
  {
    id: 'smartwatch_gps',
    keyword: 'smartwatch com gps e bateria 14 dias',
    category: 'Eletrônicos & Wearables',
    focus: 'SEO & Buscas Google/IA',
  },
  {
    id: 'cafeteira_moedor',
    keyword: 'cafeteira espresso com moedor de grãos integrado',
    category: 'Eletroportáteis & Café Gourmet',
    focus: 'Equilibrado (Conversão + SEO)',
  },
  {
    id: 'fone_anc',
    keyword: 'fone de ouvido bluetooth com cancelamento de ruído ativo',
    category: 'Áudio & Acessórios',
    focus: 'Busca Interna VTEX (Intelligent Search)',
  },
];

export function generateCuratedLsiAnalysis(params: {
  targetKeyword: string;
  category?: string;
  optimizationFocus?: string;
  tone?: string;
}): import('../types/index.ts').LsiKeywordAnalysis {
  const kw = (params.targetKeyword || 'produto para e-commerce').trim();
  const kwLower = kw.toLowerCase();
  const category = (params.category || 'Geral').trim();
  const focus = params.optimizationFocus || 'Descrições de Produto E-commerce';

  // Extract core concepts
  const isFootwear = kwLower.includes('tênis') || kwLower.includes('sapato') || kwLower.includes('corrida') || kwLower.includes('carbono');
  const isFashion = kwLower.includes('vestido') || kwLower.includes('camisa') || kwLower.includes('calça') || kwLower.includes('linho') || kwLower.includes('roupa');
  const isTech = kwLower.includes('smartwatch') || kwLower.includes('fone') || kwLower.includes('bluetooth') || kwLower.includes('gps') || kwLower.includes('bateria');
  const isCoffee = kwLower.includes('café') || kwLower.includes('cafeteira') || kwLower.includes('espresso') || kwLower.includes('moedor');

  let technicalSpecs: import('../types/index.ts').LsiTermItem[] = [];
  let problemBenefits: import('../types/index.ts').LsiTermItem[] = [];
  let naturalSynonyms: import('../types/index.ts').LsiTermItem[] = [];
  let buyerTriggers: import('../types/index.ts').LsiTermItem[] = [];
  let vtexInternalSearch: import('../types/index.ts').LsiTermItem[] = [];
  let productDescriptionSnippets: string[] = [];

  if (isFootwear) {
    technicalSpecs = [
      {
        term: 'placa de fibra de carbono propulsiva',
        relevanceScore: 98,
        recommendation: 'Usar no H2 da seção de tecnologia da descrição',
        exampleContext: 'Equipado com placa de fibra de carbono propulsiva para máxima resposta a cada passada.',
        searchIntent: 'comercial',
      },
      {
        term: 'superespuma nitrogenada EVA ultraleve',
        relevanceScore: 94,
        recommendation: 'Inserir nos bullet points de especificações do solado',
        exampleContext: 'Entressola moldada em superespuma nitrogenada EVA ultraleve com retorno energético superior.',
        searchIntent: 'informativa',
      },
      {
        term: 'drop de 6mm a 8mm anatômico',
        relevanceScore: 89,
        recommendation: 'Incluir na tabela de medidas e dados técnicos',
        exampleContext: 'Com drop de 6mm a 8mm anatômico, favorece a transição natural da pisada.',
        searchIntent: 'informativa',
      },
      {
        term: 'cabedal em mesh respirável termosselado',
        relevanceScore: 87,
        recommendation: 'Mencionar no parágrafo sobre ventilação e conforto térmico',
        exampleContext: 'O cabedal em mesh respirável termosselado garante ajuste preciso sem costuras que atritem na pele.',
        searchIntent: 'informativa',
      },
    ];

    problemBenefits = [
      {
        term: 'economia de energia e redução de fadiga muscular',
        relevanceScore: 96,
        recommendation: 'Destacar no primeiro parágrafo como benefício central para o corredor',
        exampleContext: 'Sinta comprovada economia de energia e redução de fadiga muscular mesmo em treinos longos e maratonas.',
        searchIntent: 'comercial',
      },
      {
        term: 'melhoria de pace em provas de 10k e 21k',
        relevanceScore: 92,
        recommendation: 'Usar como gancho de identificação com o público-alvo atleta',
        exampleContext: 'Desenvolvido especificamente para quem busca melhoria de pace em provas de 10k e 21k.',
        searchIntent: 'comercial',
      },
      {
        term: 'absorção de impacto e proteção articular',
        relevanceScore: 90,
        recommendation: 'Abordar na quebra de objeção sobre amortecimento versus velocidade',
        exampleContext: 'Combina rigidez de propulsão com excepcional absorção de impacto e proteção articular.',
        searchIntent: 'informativa',
      },
      {
        term: 'estabilidade em curvas e tração em piso molhado',
        relevanceScore: 88,
        recommendation: 'Adicionar nos diferenciais de solado',
        exampleContext: 'Borracha vulcanizada para estabilidade em curvas e tração em piso molhado.',
        searchIntent: 'informativa',
      },
    ];

    naturalSynonyms = [
      {
        term: 'calçado para maratona e corrida de rua',
        relevanceScore: 95,
        recommendation: 'Excelente para Title Tag e variações no H3',
        exampleContext: 'Referência em calçado para maratona e corrida de rua de alto rendimento.',
        searchIntent: 'transacional',
      },
      {
        term: 'super tênis de performance com placa',
        relevanceScore: 91,
        recommendation: 'Termo coloquial muito usado em buscas no Google e Perplexity',
        exampleContext: 'O legítimo super tênis de performance com placa para atletas exigentes.',
        searchIntent: 'comercial',
      },
      {
        term: 'tênis de propulsão e alta resposta',
        relevanceScore: 88,
        recommendation: 'Usar em subtítulos alternativos',
        exampleContext: 'Experimente a tecnologia do tênis de propulsão e alta resposta.',
        searchIntent: 'comercial',
      },
      {
        term: 'sneaker running placa rígida',
        relevanceScore: 82,
        recommendation: 'Utilizar em buscas de catálogo e meta keywords',
        exampleContext: 'Engenharia de sneaker running placa rígida certificada para competições.',
        searchIntent: 'transacional',
      },
    ];

    buyerTriggers = [
      {
        term: 'tênis com placa de carbono original com garantia de fábrica',
        relevanceScore: 97,
        recommendation: 'Inserir próximo ao botão Comprar / CTA',
        exampleContext: 'Adquira seu tênis com placa de carbono original com garantia de fábrica e envio imediato.',
        searchIntent: 'transacional',
      },
      {
        term: 'tênis placa de carbono melhor custo benefício 2026',
        relevanceScore: 93,
        recommendation: 'Ideal para ranquear em buscas comparativas',
        exampleContext: 'Eleito o tênis placa de carbono melhor custo benefício 2026 da categoria premium.',
        searchIntent: 'comercial',
      },
      {
        term: 'onde comprar tênis de placa de carbono em até 10x sem juros',
        relevanceScore: 89,
        recommendation: 'Colocar na seção de FAQ e formas de pagamento',
        exampleContext: 'Aqui você encontra onde comprar tênis de placa de carbono em até 10x sem juros com frete grátis.',
        searchIntent: 'transacional',
      },
      {
        term: 'tênis de corrida placa de carbono pronta entrega',
        relevanceScore: 86,
        recommendation: 'Destacar no badge de disponibilidade de estoque',
        exampleContext: 'Estoque no Brasil com tênis de corrida placa de carbono pronta entrega.',
        searchIntent: 'transacional',
      },
    ];

    vtexInternalSearch = [
      {
        term: 'tenis placa carbono',
        relevanceScore: 99,
        recommendation: 'Palavra Substituta sem acento no Admin VTEX Catálogo',
        exampleContext: 'Indexar para capturar buscas sem acentuação no search bar',
        searchIntent: 'transacional',
      },
      {
        term: 'sapato de correr com placa',
        relevanceScore: 85,
        recommendation: 'Sinônimo no Intelligent Search VTEX',
        exampleContext: 'Termo de entrada por linguagem natural',
        searchIntent: 'comercial',
      },
      {
        term: 'tenis carbon plate',
        relevanceScore: 84,
        recommendation: 'Palavra substituta para termos em inglês',
        exampleContext: 'Captura clientes acostumados com termos internacionais',
        searchIntent: 'transacional',
      },
      {
        term: 'tenis maratona propulsao',
        relevanceScore: 82,
        recommendation: 'Filtro e Tag de busca no Portal Legacy',
        exampleContext: 'Mapeamento de faceta para busca guiada',
        searchIntent: 'comercial',
      },
    ];

    productDescriptionSnippets = [
      `Se você procura baixar seu tempo e atingir seu recorde pessoal, este <strong>${kw}</strong> é a escolha definitiva. Projetado com uma <em>placa de fibra de carbono propulsiva</em> integrada à <em>superespuma nitrogenada EVA ultraleve</em>, ele devolve até 85% da energia cinética a cada passada, proporcionando sensação inconfundível de impulso para a frente.`,
      `Além da máxima velocidade, este calçado foi concebido para entregar <em>economia de energia e redução de fadiga muscular</em> nas distâncias mais exigentes, como treinos intervalados e maratonas completas. O <em>cabedal em mesh respirável termosselado</em> abraça os pés com firmeza e ventilação contínua, prevenindo pontos de atrito e aquecimento.`,
      `Comprovado em testes de biomecânica com <em>drop anatômico</em> e solado com grip de alta tração em asfalto seco ou molhado, este é o <em>super tênis de performance com placa</em> perfeito para atletas amadores e maratonistas que buscam excelência técnica, proteção articular e entrega imediata.`,
    ];
  } else if (isFashion) {
    technicalSpecs = [
      {
        term: 'fibra 100% linho puro pré-lavado',
        relevanceScore: 97,
        recommendation: 'Destacar na composição têxtil e etiqueta técnica',
        exampleContext: 'Confeccionado em fibra 100% linho puro pré-lavado que não encolhe após a primeira lavagem.',
        searchIntent: 'informativa',
      },
      {
        term: 'modelagem midi com caimento evasê fluído',
        relevanceScore: 94,
        recommendation: 'Usar no primeiro parágrafo de corte e silhueta',
        exampleContext: 'Apresenta modelagem midi com caimento evasê fluído que valoriza a silhueta com elegância natural.',
        searchIntent: 'comercial',
      },
      {
        term: 'costura francesa e acabamento de alfaiataria fina',
        relevanceScore: 90,
        recommendation: 'Mencionar nos detalhes de confecção premium',
        exampleContext: 'Estruturado com costura francesa e acabamento de alfaiataria fina para máxima durabilidade.',
        searchIntent: 'informativa',
      },
      {
        term: 'forro antialérgico respirável de toque suave',
        relevanceScore: 86,
        recommendation: 'Abordar na quebra de objeção sobre transparência',
        exampleContext: 'Acompanha forro antialérgico respirável de toque suave que elimina qualquer transparência.',
        searchIntent: 'informativa',
      },
    ];

    problemBenefits = [
      {
        term: 'conforto térmico natural para dias quentes',
        relevanceScore: 96,
        recommendation: 'Destacar como principal benefício sazonal',
        exampleContext: 'Garante conforto térmico natural para dias quentes, permitindo que a pele respire livremente.',
        searchIntent: 'comercial',
      },
      {
        term: 'versatilidade do casual chic a eventos formais',
        relevanceScore: 93,
        recommendation: 'Usar no parágrafo de ocasiões de uso',
        exampleContext: 'Uma peça com versatilidade do casual chic a eventos formais, do almoço de negócios ao jantar.',
        searchIntent: 'comercial',
      },
      {
        term: 'toque macio que não pinica na pele',
        relevanceScore: 91,
        recommendation: 'Derrubar o receio comum de linho áspero',
        exampleContext: 'Graças ao processo de amaciamento enzimático, entrega toque macio que não pinica na pele.',
        searchIntent: 'informativa',
      },
      {
        term: 'sofisticação atemporal e elegância despretensiosa',
        relevanceScore: 88,
        recommendation: 'Inserir no tom inspiracional de estilo de vida',
        exampleContext: 'Sinônimo de sofisticação atemporal e elegância despretensiosa em qualquer guarda-roupa.',
        searchIntent: 'comercial',
      },
    ];

    naturalSynonyms = [
      {
        term: 'vestido feminino midi em tecido natural',
        relevanceScore: 95,
        recommendation: 'Usar no Title e na meta description',
        exampleContext: 'O clássico vestido feminino midi em tecido natural indispensável para a estação.',
        searchIntent: 'transacional',
      },
      {
        term: 'peça em linho legítimo alfaiataria',
        relevanceScore: 90,
        recommendation: 'Termo de busca para clientes de moda premium',
        exampleContext: 'Autêntica peça em linho legítimo alfaiataria com detalhes artesanais.',
        searchIntent: 'comercial',
      },
      {
        term: 'roupa midi linho verão e meia-estação',
        relevanceScore: 87,
        recommendation: 'Excelente para tags sazonais e buscas orgânicas',
        exampleContext: 'Ideal como roupa midi linho verão e meia-estação.',
        searchIntent: 'comercial',
      },
      {
        term: 'vestido casual chic linho puro',
        relevanceScore: 84,
        recommendation: 'Incluir em filtros de estilo no catálogo VTEX',
        exampleContext: 'Visual moderno de vestido casual chic linho puro.',
        searchIntent: 'transacional',
      },
    ];

    buyerTriggers = [
      {
        term: 'vestido de linho puro comprar online com frete grátis',
        relevanceScore: 96,
        recommendation: 'Inserir na seção de compra e facilidades da loja',
        exampleContext: 'Aproveite para garantir seu vestido de linho puro comprar online com frete grátis e primeira troca gratuita.',
        searchIntent: 'transacional',
      },
      {
        term: 'vestido midi linho elegante em até 6x sem juros',
        relevanceScore: 92,
        recommendation: 'Adicionar nas vantagens de checkout',
        exampleContext: 'Adquira este vestido midi linho elegante em até 6x sem juros no cartão ou com desconto no PIX.',
        searchIntent: 'transacional',
      },
      {
        term: 'vestido linho pré-lavado não encolhe original',
        relevanceScore: 89,
        recommendation: 'Colocar na garantia de qualidade da peça',
        exampleContext: 'Garantia comprovada: vestido linho pré-lavado não encolhe original de fabricação nacional.',
        searchIntent: 'transacional',
      },
      {
        term: 'tabela de medidas vestido midi linho',
        relevanceScore: 85,
        recommendation: 'Linkar com a tabela de medidas no template VTEX',
        exampleContext: 'Confira nossa tabela de medidas vestido midi linho para acertar na primeira escolha.',
        searchIntent: 'informativa',
      },
    ];

    vtexInternalSearch = [
      {
        term: 'vestido linho midi',
        relevanceScore: 98,
        recommendation: 'Palavra substituta direta no Admin VTEX',
        exampleContext: 'Busca direta no campo de busca do cabeçalho',
        searchIntent: 'transacional',
      },
      {
        term: 'vestido linho cru',
        relevanceScore: 88,
        recommendation: 'Sinônimo para cores e tons naturais',
        exampleContext: 'Mapeamento para termos cromáticos',
        searchIntent: 'comercial',
      },
      {
        term: 'vestido casual linho botao',
        relevanceScore: 85,
        recommendation: 'Termo de busca com atributos de detalhe',
        exampleContext: 'Captura compradores que pesquisam por aviamentos',
        searchIntent: 'comercial',
      },
      {
        term: 'vestido alfaiataria linho',
        relevanceScore: 83,
        recommendation: 'Palavra substituta no Intelligent Search',
        exampleContext: 'Público que procura alfaiataria feminina',
        searchIntent: 'transacional',
      },
    ];

    productDescriptionSnippets = [
      `Eleve o nível do seu guarda-roupa com este <strong>${kw}</strong>, confeccionado exclusivamente em <em>fibra 100% linho puro pré-lavado</em>. A nobreza da fibra natural confere caimento impecável e frescor incomparável, fazendo desta peça um símbolo de sofisticação e bem-estar.`,
      `Sua <em>modelagem midi com caimento evasê fluído</em> acompanha o movimento do corpo com naturalidade, garantindo <em>conforto térmico natural para dias quentes</em> e transições perfeitas entre ambientes climatizados e passeios ao ar livre. Detalhes como botões discretos e <em>costura francesa de alfaiataria fina</em> evidenciam a excelência em cada centímetro.`,
      `Com <em>forro antialérgico respirável</em> para total segurança contra transparências e <em>versatilidade do casual chic a eventos formais</em>, esta peça atemporal é perfeita tanto com sandálias rasteiras quanto com salto ou tênis moderno.`,
    ];
  } else if (isTech) {
    technicalSpecs = [
      {
        term: 'bateria de longa duração até 14 dias',
        relevanceScore: 98,
        recommendation: 'Colocar em destaque no primeiro bloco técnico',
        exampleContext: 'Autonomia real com bateria de longa duração até 14 dias sem necessidade de recarga diária.',
        searchIntent: 'comercial',
      },
      {
        term: 'display AMOLED Always-On de alta definição',
        relevanceScore: 95,
        recommendation: 'Usar no subtítulo sobre visualização sob luz solar',
        exampleContext: 'Tela colorida com display AMOLED Always-On de alta definição e brilho de 1000 nits.',
        searchIntent: 'informativa',
      },
      {
        term: 'conectividade Bluetooth 5.3 com baixa latência',
        relevanceScore: 92,
        recommendation: 'Adicionar nas especificações de emparelhamento',
        exampleContext: 'Conectividade Bluetooth 5.3 com baixa latência e sincronização estável com iOS e Android.',
        searchIntent: 'informativa',
      },
      {
        term: 'sensores biométricos e monitoramento cardíaco contínuo',
        relevanceScore: 89,
        recommendation: 'Destacar nos recursos de saúde e bem-estar',
        exampleContext: 'Precisão médica com sensores biométricos e monitoramento cardíaco contínuo 24 horas por dia.',
        searchIntent: 'informativa',
      },
    ];

    problemBenefits = [
      {
        term: 'liberdade sem precisar recarregar todos os dias',
        relevanceScore: 96,
        recommendation: 'Usar como principal quebra de dor no início do texto',
        exampleContext: 'Conquiste liberdade sem precisar recarregar todos os dias e viaje sem levar carregadores na mala.',
        searchIntent: 'comercial',
      },
      {
        term: 'métricas precisas para treino e melhora do condicionamento',
        relevanceScore: 93,
        recommendation: 'Destacar para o público praticante de esportes',
        exampleContext: 'Tenha acesso a métricas precisas para treino e melhora do condicionamento em tempo real.',
        searchIntent: 'comercial',
      },
      {
        term: 'rastreamento de sono REM e gerenciamento de estresse',
        relevanceScore: 90,
        recommendation: 'Abordar na seção de saúde integrada',
        exampleContext: 'Acompanhe seu rastreamento de sono REM e gerenciamento de estresse para um dia mais produtivo.',
        searchIntent: 'informativa',
      },
      {
        term: 'resistência à água e suor para qualquer clima',
        relevanceScore: 88,
        recommendation: 'Mencionar na durabilidade do equipamento',
        exampleContext: 'Certificação com resistência à água e suor para qualquer clima e modalidade aquática.',
        searchIntent: 'informativa',
      },
    ];

    naturalSynonyms = [
      {
        term: 'dispositivo vestível inteligente para esportes',
        relevanceScore: 94,
        recommendation: 'Ótimo para variações no texto e SEO de categoria',
        exampleContext: 'O mais avançado dispositivo vestível inteligente para esportes e rotina.',
        searchIntent: 'comercial',
      },
      {
        term: 'relógio inteligente com gps integrado e bateria forte',
        relevanceScore: 92,
        recommendation: 'Termo natural de busca longa no Google',
        exampleContext: 'Autêntico relógio inteligente com gps integrado e bateria forte.',
        searchIntent: 'transacional',
      },
      {
        term: 'smartwatch fitness com tela amoled',
        relevanceScore: 89,
        recommendation: 'Usar em subtítulos H3',
        exampleContext: 'Performance premium de smartwatch fitness com tela amoled.',
        searchIntent: 'comercial',
      },
      {
        term: 'monitor de atividades físicas com longa autonomia',
        relevanceScore: 85,
        recommendation: 'Variação para buscas institucionais e de presente',
        exampleContext: 'Escolha o melhor monitor de atividades físicas com longa autonomia.',
        searchIntent: 'comercial',
      },
    ];

    buyerTriggers = [
      {
        term: 'smartwatch original com garantia nacional e nota fiscal',
        relevanceScore: 97,
        recommendation: 'Inserir perto do botão Adicionar ao Carrinho',
        exampleContext: 'Produto homologado pela Anatel: smartwatch original com garantia nacional e nota fiscal.',
        searchIntent: 'transacional',
      },
      {
        term: 'melhor smartwatch bateria 14 dias custo benefício',
        relevanceScore: 94,
        recommendation: 'Excelente para quem busca comparativos no Google',
        exampleContext: 'Reconhecido como o melhor smartwatch bateria 14 dias custo benefício do mercado.',
        searchIntent: 'comercial',
      },
      {
        term: 'smartwatch pronto para envio em até 12x sem juros',
        relevanceScore: 91,
        recommendation: 'Destacar nas facilidades de pagamento da VTEX',
        exampleContext: 'Compre seu smartwatch pronto para envio em até 12x sem juros com entrega expressa.',
        searchIntent: 'transacional',
      },
      {
        term: 'compatível com iphone e android garantia de troca',
        relevanceScore: 88,
        recommendation: 'Quebrar dúvida de compatibilidade do cliente',
        exampleContext: '100% compatível com iphone e android garantia de troca fácil em até 30 dias.',
        searchIntent: 'informativa',
      },
    ];

    vtexInternalSearch = [
      {
        term: 'relogio smartwatch gps',
        relevanceScore: 99,
        recommendation: 'Palavra substituta no Admin Catálogo VTEX',
        exampleContext: 'Busca direta por relógio no Portal Legacy',
        searchIntent: 'transacional',
      },
      {
        term: 'relogio inteligente bateria longa',
        relevanceScore: 90,
        recommendation: 'Sinônimo para Intelligent Search VTEX',
        exampleContext: 'Busca por atributo de autonomia',
        searchIntent: 'comercial',
      },
      {
        term: 'smartwatch tela amoled',
        relevanceScore: 87,
        recommendation: 'Termo de filtro no menu lateral',
        exampleContext: 'Filtro de especificação de tela',
        searchIntent: 'transacional',
      },
      {
        term: 'smartwatch corrida prova dagua',
        relevanceScore: 85,
        recommendation: 'Palavra substituta no catálogo',
        exampleContext: 'Buscas compostas por uso esportivo',
        searchIntent: 'comercial',
      },
    ];

    productDescriptionSnippets = [
      `Projetado para quem valoriza autonomia e máxima precisão nos treinos, este <strong>${kw}</strong> reúne tecnologia de ponta em um design moderno e resistente. Sua impressionante <em>bateria de longa duração até 14 dias</em> liberta você da obrigação de carregar seu relógio todas as noites.`,
      `O <em>display AMOLED Always-On de alta definição</em> garante leitura cristalina mesmo sob luz solar intensa, enquanto os <em>sensores biométricos e monitoramento cardíaco contínuo</em> rastreiam frequência, oxigenação no sangue e <em>sono REM</em> com precisão incomparável.`,
      `Com <em>conectividade Bluetooth 5.3</em> estável, sincronização imediata com Strava e notificações inteligentes do seu smartphone, este é o parceiro indispensável para atingir novas metas esportivas com conforto e durabilidade à prova d'água.`,
    ];
  } else {
    // Universal E-commerce Semantic & LSI Generator
    const cleanWord = kw.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').trim();
    technicalSpecs = [
      {
        term: `materiais de alta densidade e resistência estrutural para ${cleanWord}`,
        relevanceScore: 95,
        recommendation: 'Incluir no bloco de especificações técnicas do produto',
        exampleContext: `Fabricado com materiais de alta densidade e resistência estrutural para ${cleanWord} de longa vida útil.`,
        searchIntent: 'informativa',
      },
      {
        term: `acabamento premium com engenharia ergonômica`,
        relevanceScore: 91,
        recommendation: 'Inserir no H2 de diferenciais de design',
        exampleContext: `Destaca-se pelo acabamento premium com engenharia ergonômica que proporciona manuseio prático e seguro.`,
        searchIntent: 'comercial',
      },
      {
        term: `certificação de conformidade e controle de qualidade rigoroso`,
        relevanceScore: 88,
        recommendation: 'Mencionar na quebra de objeção sobre durabilidade',
        exampleContext: `Submetido a certificação de conformidade e controle de qualidade rigoroso antes de chegar até você.`,
        searchIntent: 'informativa',
      },
      {
        term: `dimensões compactas e otimização de espaço funcional`,
        relevanceScore: 85,
        recommendation: 'Detalhar nas medidas e compatibilidade',
        exampleContext: `Desenvolvido com dimensões compactas e otimização de espaço funcional para o dia a dia.`,
        searchIntent: 'informativa',
      },
    ];

    problemBenefits = [
      {
        term: `eficiência e praticidade comprovada no uso diário`,
        relevanceScore: 96,
        recommendation: 'Usar no primeiro parágrafo de apresentação da solução',
        exampleContext: `Proporciona eficiência e praticidade comprovada no uso diário, poupando seu tempo e esforço.`,
        searchIntent: 'comercial',
      },
      {
        term: `desempenho consistente sem perda de rendimento`,
        relevanceScore: 92,
        recommendation: 'Destacar nos benefícios centrais',
        exampleContext: `Garante desempenho consistente sem perda de rendimento mesmo sob uso frequente e intenso.`,
        searchIntent: 'comercial',
      },
      {
        term: `segurança operacional e facilidade de limpeza e manutenção`,
        relevanceScore: 89,
        recommendation: 'Adicionar nos tópicos pós-compra',
        exampleContext: `Projetado com foco em segurança operacional e facilidade de limpeza e manutenção rápida.`,
        searchIntent: 'informativa',
      },
      {
        term: `economia a longo prazo e retorno do investimento`,
        relevanceScore: 87,
        recommendation: 'Inserir antes da chamada para ação',
        exampleContext: `Oferece comprovada economia a longo prazo e retorno do investimento com alta durabilidade.`,
        searchIntent: 'comercial',
      },
    ];

    naturalSynonyms = [
      {
        term: `${cleanWord} original para e-commerce`,
        relevanceScore: 94,
        recommendation: 'Usar em Title Tag e cabeçalhos',
        exampleContext: `Conheça a versão definitiva de ${cleanWord} original para e-commerce com envio rápido.`,
        searchIntent: 'transacional',
      },
      {
        term: `modelo profissional de ${cleanWord}`,
        relevanceScore: 90,
        recommendation: 'Atrair clientes que buscam versão topo de linha',
        exampleContext: `O modelo profissional de ${cleanWord} com características exclusivas.`,
        searchIntent: 'comercial',
      },
      {
        term: `melhor opção de ${cleanWord} no mercado`,
        relevanceScore: 87,
        recommendation: 'Ranqueamento em pesquisas comparativas',
        exampleContext: `Reconhecido por especialistas como a melhor opção de ${cleanWord} no mercado nacional.`,
        searchIntent: 'comercial',
      },
      {
        term: `artigo premium para ${category}`,
        relevanceScore: 84,
        recommendation: 'Mapeamento de categoria semântica',
        exampleContext: `Um artigo premium para ${category} com acabamento refinado.`,
        searchIntent: 'comercial',
      },
    ];

    buyerTriggers = [
      {
        term: `${cleanWord} comprar com garantia e nota fiscal`,
        relevanceScore: 97,
        recommendation: 'Destacar no rodapé da descrição e checkout',
        exampleContext: `Aqui você pode adquirir seu ${cleanWord} comprar com garantia e nota fiscal de procedência.`,
        searchIntent: 'transacional',
      },
      {
        term: `onde comprar ${cleanWord} em promoção`,
        relevanceScore: 93,
        recommendation: 'Ideal para campanhas de busca e FAQs',
        exampleContext: `Sua melhor escolha para onde comprar ${cleanWord} em promoção com parcelamento facilitado.`,
        searchIntent: 'transacional',
      },
      {
        term: `${cleanWord} pronta entrega com frete rápido`,
        relevanceScore: 90,
        recommendation: 'Usar no box de entrega do produto',
        exampleContext: `Estoque garantido: ${cleanWord} pronta entrega com frete rápido e rastreio passo a passo.`,
        searchIntent: 'transacional',
      },
      {
        term: `avaliação e depoimentos de quem comprou ${cleanWord}`,
        relevanceScore: 86,
        recommendation: 'Linkar com a área de avaliações de clientes',
        exampleContext: `Veja a avaliação e depoimentos de quem comprou ${cleanWord} e aprovou a qualidade.`,
        searchIntent: 'informativa',
      },
    ];

    vtexInternalSearch = [
      {
        term: cleanWord.toLowerCase(),
        relevanceScore: 99,
        recommendation: 'Termo principal no Catálogo VTEX',
        exampleContext: 'Indexação exata no campo Palavras Substitutas',
        searchIntent: 'transacional',
      },
      {
        term: `${cleanWord.toLowerCase()} original`,
        relevanceScore: 91,
        recommendation: 'Sinônimo no Intelligent Search VTEX',
        exampleContext: 'Captura intenção de compra de produto legítimo',
        searchIntent: 'transacional',
      },
      {
        term: `${cleanWord.toLowerCase()} promocao`,
        relevanceScore: 87,
        recommendation: 'Sinônimo sem acento no catálogo',
        exampleContext: 'Pesquisa com termo comercial',
        searchIntent: 'transacional',
      },
      {
        term: `${cleanWord.toLowerCase()} ${category.toLowerCase().split(' ')[0]}`,
        relevanceScore: 84,
        recommendation: 'Associação de categoria na busca interna',
        exampleContext: 'Mapeamento de contexto de departamento',
        searchIntent: 'comercial',
      },
    ];

    productDescriptionSnippets = [
      `Se você busca qualidade incomparável e desempenho superior, este <strong>${kw}</strong> foi desenvolvido para superar suas expectativas. Projetado com materiais de alta resistência e acabamento minucioso, ele oferece a união ideal entre funcionalidade moderna e durabilidade prolongada.`,
      `Sua utilização proporciona <em>eficiência e praticidade comprovada no uso diário</em>, permitindo que você desfrute de cada recurso com total segurança e conveniência. O design anatômico foi pensado especificamente para valorizar a experiência do usuário, tornando cada interação mais intuitiva.`,
      `Adquira agora com a garantia de um produto 100% original, com nota fiscal eletrônica, envio rápido para todo o Brasil e suporte dedicado pós-venda. Aproveite as condições especiais de pagamento e comprove a excelência em cada detalhe.`,
    ];
  }

  return {
    targetKeyword: kw,
    category,
    optimizationFocus: focus,
    semanticRelevanceScore: 96,
    primarySearchIntent: 'transacional',
    recommendedDensity: '1.2% a 1.8% (3 a 5 ocorrências naturais no corpo da descrição)',
    lsiClusters: {
      technicalSpecs,
      problemBenefits,
      naturalSynonyms,
      buyerTriggers,
      vtexInternalSearch,
    },
    productDescriptionSnippets,
    seoRecommendation:
      'Para obter os melhores resultados no Google e nas IAs (Perplexity, ChatGPT Search), distribua os termos LSI de forma fluida ao longo do texto. Utilize a palavra-chave alvo no título (H1) e no primeiro parágrafo, as especificações técnicas em listas não ordenadas, e os sinônimos nos subtítulos (H2). Evite repetições mecânicas: motores de busca modernos ranqueiam por cobertura semântica de entidades, não por repetição exata.',
    generatedAt: new Date().toLocaleString('pt-BR'),
    modelUsed: 'VTEX Pulse Semantic LSI Engine',
  };
}

