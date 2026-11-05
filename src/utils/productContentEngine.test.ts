import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCuratedProductContent, PRODUCT_PRESETS } from './productContentEngine.ts';

test('PRODUCT_PRESETS contains rich realistic ecommerce products', () => {
  assert.ok(PRODUCT_PRESETS.length >= 4);
  for (const preset of PRODUCT_PRESETS) {
    assert.ok(preset.name.length > 3);
    assert.ok(preset.category.length > 2);
    assert.ok(preset.keyFeatures.length > 10);
    assert.ok(preset.targetKeyword.length > 3);
  }
});

test('generateCuratedProductContent generates 3 title variations and valid SEO tags', () => {
  const result = generateCuratedProductContent({
    productName: 'Tênis Running Pro Carbon Turbo',
    category: 'Calçados Esportivos',
    keyFeatures: 'Placa de carbono, 198g de peso, solado responsivo',
    targetAudience: 'Maratonistas e corredores',
    toneOfVoice: 'persuasive',
    targetKeyword: 'tênis de corrida com placa de carbono',
  });

  assert.equal(result.productName, 'Tênis Running Pro Carbon Turbo');
  assert.equal(result.titles.length, 3);
  assert.ok(result.primaryTitle.includes('Tênis Running Pro Carbon Turbo'));
  assert.ok(result.seoTags.metaTitle.length > 10);
  assert.ok(result.seoTags.metaDescription.length > 20);
  assert.ok(result.seoTags.canonicalSlug.endsWith('/p'));
  assert.ok(result.seoTags.schemaJsonLd.includes('"@type": "Product"'));
});

test('generateCuratedProductContent generates comprehensive keyword intelligence', () => {
  const result = generateCuratedProductContent({
    productName: 'Vestido Midi Linho Puro Riviera',
    category: 'Moda Feminina',
    keyFeatures: '100% linho, botões de madrepérola',
    targetKeyword: 'vestido midi linho puro',
  });

  assert.ok(result.keywords.primary.keyword.length > 0);
  assert.ok(result.keywords.primary.estimatedVolume.includes('buscas/mês'));
  assert.ok(result.keywords.secondary.length >= 4);
  assert.ok(result.keywords.longTail.length >= 4);
  assert.ok(result.keywords.vtexInternalSearchTerms.length >= 3);
  assert.ok(result.keywords.questionsPeopleAsk.length >= 4);
});

test('generateCuratedProductContent generates high converting CTAs and VTEX legacy guide', () => {
  const result = generateCuratedProductContent({
    productName: 'Smartwatch Pulse Elite GPS',
    category: 'Eletrônicos',
    specialOffer: 'Frete Grátis para todo o Brasil',
  });

  assert.ok(result.callToActions.length >= 4);
  assert.ok(result.htmlDescription.includes('product-description-vtex'));
  assert.ok(result.vtexLegacyIntegrationGuide.descriptionTag === '<vtex.cmc:productDescription />');
  assert.ok(result.vtexLegacyIntegrationGuide.subtemplateSnippet.includes('<vtex.cmc:productDescription />'));
});
