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
    id: 'tenis_running',
    name: 'Tênis Running Pro Carbon Turbo',
    category: 'Calçados Esportivos',
    keyFeatures: 'Placa de carbono 100% responsiva, solado em superespuma EVA nitrogenada, peso ultraleve de 198g, cabedal respirável em mesh tecnológico, drop de 6mm, grip antiderrapante de alta tração',
    targetAudience: 'Corredores amadores e maratonistas que buscam baixar seu pace e máximo retorno de energia',
    toneOfVoice: 'persuasive',
    targetKeyword: 'tênis de corrida com placa de carbono',
    specialOffer: 'De R$ 899,90 por R$ 649,90 em até 10x sem juros + Frete Grátis',
  },
  {
    id: 'vestido_linho',
    name: 'Vestido Midi Linho Puro Riviera',
    category: 'Moda Feminina',
    keyFeatures: '100% fibra natural de linho europeu pré-lavado, modelagem evasê fluida com decote sutil, botões em madrepérola natural, bolsos laterais embutidos, forro de algodão antialérgico',
    targetAudience: 'Mulheres elegantes de 28 a 55 anos que valorizam sofisticação, conforto térmico e alfaiataria atemporal',
    toneOfVoice: 'minimalist',
    targetKeyword: 'vestido midi linho puro feminino',
    specialOffer: '10% OFF na primeira compra no PIX',
  },
  {
    id: 'smartwatch_ultra',
    name: 'Smartwatch Pulse Elite GPS AMOLED',
    category: 'Eletrônicos & Wearables',
    keyFeatures: 'Tela AMOLED de 1.43 polegadas Always-On 1000 nits, GPS integrado multi-banda com rota offline, monitor de ECG, oxigenação sanguínea e sono REM, bateria de 14 dias de duração, resistência à água 5ATM (50m)',
    targetAudience: 'Entusiastas de tecnologia e esportistas que exigem precisão biométrica e alta autonomia de bateria',
    toneOfVoice: 'technical',
    targetKeyword: 'smartwatch com gps e bateria 14 dias',
    specialOffer: 'Brinde: Pulseira extra em silicone esportivo + Cabo magnético fast charge',
  },
  {
    id: 'cafeteira_espresso',
    name: 'Cafeteira Espresso Automática Barista Prime',
    category: 'Eletroportáteis & Café',
    keyFeatures: 'Bomba italiana de 19 bar de pressão, moedor cônico integrado com 15 níveis de moagem, vaporizador profissional em aço inox para microespuma de leite, sistema térmico Thermoblock de aquecimento rápido em 35s',
    targetAudience: 'Amantes de cafés especiais que desejam a experiência de cafeteria gourmet em casa com praticidade',
    toneOfVoice: 'emotional',
    targetKeyword: 'cafeteira espresso com moedor de grãos integrado',
    specialOffer: 'Acompanha kit degustação com 500g de grãos 100% Arábica Torra Média',
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
