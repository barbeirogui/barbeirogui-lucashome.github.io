# Integração do Catálogo Real VTEX, Painel de Vendas, Sitemap Oficial e Correção XML do Subtemplate CMS Legacy

Plano completo de arquitetura e implementação para conectar o catálogo real de produtos e análise de vendas da loja **Lucas Home** na VTEX, eliminar dados de calçados do validador de sitemap lendo os XMLs reais (`category-0.xml`, `product-0.xml`), corrigir a compatibilidade XML do snippet de `skuJson` no CMS Legacy e garantir armazenamento seguro e mascarado de chaves no backend.

---

### Decisões Confirmadas com o Usuário

- **Localização do Catálogo e Vendas**: Implementar tanto a nova aba dedicada **Catálogo & Vendas** na navegação principal quanto a integração contextual dos produtos reais na aba **Produto IA** (seleção de produtos do catálogo da Lucas Home com 1 clique) e métricas consolidadas no **Dashboard**.
- **Segurança de Chaves e Tokens VTEX**: Armazenamento seguro no backend (`store-config.json` protegido com mascaramento de exibição `vtexappkey-lucashome-***` e `••••••••••••`), sem expor o segredo no payload público do cliente, com suporte a injeção via variáveis de ambiente (`VTEX_ACCOUNT`, `VTEX_APP_KEY`, `VTEX_APP_TOKEN`).
- **Validador de Sitemap**: Obtenção de URLs híbrida em tempo real: lê diretamente os sitemaps XML oficiais da VTEX (`https://lucashome.vtexcommercestable.com.br/sitemap/category-0.xml` e `product-0.xml`) combinados com a API pública de busca de produtos (`/api/catalog_system/pub/products/search`), eliminando permanentemente qualquer URL fictícia de calçados (`/calcados/tenis-running-pro/p`).
- **Correção do Subtemplate VTEX CMS Legacy**: No motor de templates do VTEX Portal, o subtemplate é processado por um parser XML/XSL estrito. Caracteres `&&` soltos causam a exceção fatal:
  `An error occurred while parsing EntityName. Line 52, position 39`.
  A correção envolve:
  1. Envolver os blocos JavaScript em `//<![CDATA[ ... //]]>` ou usar entidades XML (`&amp;&amp;`).
  2. Fornecer a versão estruturada em `CDATA` pronta para colar diretamente no template do CMS sem erros.

---

## 1. Visão Geral do Sistema e Arquitetura

O sistema passará a operar com 4 novos pilares funcionais:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VTEX Pulse - Lucas Home                         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
┌──────────────┐          ┌────────────────┐          ┌────────────────┐
│  Catálogo &  │          │   Sitemap &    │          │  Subtemplates  │
│ Vendas Reais │          │   Indexação    │          │   CMS Legacy   │
├──────────────┤          ├────────────────┤          ├────────────────┤
│• 50+ produtos│          │• XML oficial   │          │• CDATA safe    │
│  Lucas Home  │          │  category-0.xml│          │• Zero erro &&  │
│• Vendas OMS/ │          │• product-0.xml │          │  no XML parser │
│  Analytics   │          │• Zero calçados │          │• skuJson real  │
└──────┬───────┘          └────────┬───────┘          └────────┬───────┘
       │                           │                           │
       └───────────────────────────┼───────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Backend Express Proxy (/api/vtex/*)                   │
├────────────────────────────────────────────────────────────────────────┤
│ • GET /api/vtex/catalog-products (Paginação, busca, filtros)           │
│ • GET /api/vtex/sales-dashboard (Ticket médio, receita, conversão)     │
│ • POST /api/vtex/fetch-official-sitemap (Parsers XML de sitemaps)      │
│ • Mascaramento de segurança para AppKey e AppToken                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Experiência do Usuário (UX) & Design Visual

### A. Nova Aba "Catálogo & Vendas"
- **Seletor de Categorias e Departamentos**: Navegação pelas categorias reais da Lucas Home (*Colchões, Camas Conceito, Camas Baú Conceito, Base Box, Base Baú, Bicamas, Cabeceiras*).
- **Tabela de Auditoria de Produtos do Catálogo**:
  - Imagem do produto, Título, SKU/Referência, Marca (Ortobom, Gazin, Lucas Home, etc.), Preço Pix vs Cartão, Estoque e Status SEO (Title, Description, URL amigável).
  - Ação rápida com 1 clique: **"Otimizar com Produto IA"** — carrega automaticamente o nome, atributos e categoria do produto selecionado no gerador de conteúdo persuasivo e tags SEO.
- **Painel de Desempenho de Vendas**:
  - Cards de KPI com números tabulares (`tabular-nums`): Faturamento 30d, Quantidade de Pedidos, Ticket Médio, Taxa de Conversão por Categoria.
  - Alertas de produtos de alto volume com descrição curta ou sem meta-tags otimizadas.

### B. Integração Contextual no "Produto IA"
- Barra de seleção rápida **"Puxar Produto do Catálogo da Loja"**: Um dropdown pesquisável com os produtos reais da Lucas Home que preenche instantaneamente o formulário, eliminando digitação manual.

### C. Sanitização do Validador de Sitemap
- O botão **"Carregar Sitemap Oficial VTEX"** agora faz o parse de `https://lucashome.vtexcommercestable.com.br/sitemap/category-0.xml` e `product-0.xml`.
- O relatório de auditoria não conterá nenhum item de `/calcados/` ou `/roupas/`; todas as falhas detectadas refletirão a realidade do catálogo e das URLs da Lucas Home.

### D. Subtemplate CMS Legacy com Blindagem CDATA
- Atualização imediata do gerador de código Schema.org (`skuJson`) para incluir a blindagem XML oficial:
  ```html
  <script type="text/javascript">
  //<![CDATA[
    $(document).ready(function() {
      if (typeof skuJson !== 'undefined' && skuJson.skus && skuJson.skus.length > 0) {
        // Código seguro que não quebra o parser XML do CMS Legacy
      }
    });
  //]]>
  </script>
  ```
- Adição de um seletor de formato: **"Formato CMS Legacy (com CDATA para evitar erro de EntityName)"** com botão de cópia rápida e instrução passo a passo para o subtemplate.

---

## 3. Segurança e Armazenamento no Backend

1. **Proteção contra Vazamento de Credenciais**:
   - `AppToken` nunca é retornado em texto claro nas requisições GET `/api/config` ou `/api/vtex/live-metrics`. O servidor retorna apenas o status de configuração e uma versão mascarada (`••••••••••••`).
   - Apenas o backend utiliza o token na comunicação direta server-to-server com a VTEX (`X-VTEX-API-AppKey` e `X-VTEX-API-AppToken`).
2. **Suporte a Variáveis de Ambiente**:
   - Se existirem no ambiente (`process.env.VTEX_APP_KEY`, `process.env.VTEX_APP_TOKEN`), o backend as priorizará automaticamente, permitindo operar sem persistir chaves em arquivos de texto.

---

## 4. Plano de Execução Técnica

1. **Backend (`server.ts`)**:
   - Implementar endpoint `/api/vtex/catalog-products`: consulta `https://lucashome.vtexcommercestable.com.br/api/catalog_system/pub/products/search` com paginação, filtros de categoria e ordenação.
   - Implementar endpoint `/api/vtex/sales-dashboard`: agrega métricas consolidadas de vendas, faturamento e desempenho por categoria para a Lucas Home.
   - Atualizar `/api/vtex/fetch-sitemap-urls` e rota de sitemap para ler o `sitemap.xml` oficial da VTEX (`category-0.xml` e `product-0.xml`).
   - Ajustar todos os snippets gerados no backend para usar wrappers `//<![CDATA[` e evitar o erro de `&` / `&&`.
   - Adicionar mascaramento do `appToken` na API de configurações.

2. **Frontend (`src/components/`)**:
   - Criar componente `CatalogSalesTab.tsx` com navegação visual dos produtos reais da Lucas Home, busca por termo/SKU, filtros e botão para enviar ao `ProductIaTab`.
   - Atualizar a barra de navegação em `App.tsx` para incluir a nova aba **Catálogo & Vendas**.
   - Conectar o botão no `ProductIaTab` para receber produto importado do catálogo.
   - Atualizar `SitemapUrlBuilderTab.tsx` para carregar o sitemap XML oficial e remover qualquer resquício de `/calcados/`.
   - Atualizar as recomendações de Subtemplate em `AiSuggestionsTab.tsx` com o código devidamente escapado para o VTEX Portal.

3. **Validação & Testes**:
   - Executar suíte de testes (`productContentEngine.test.ts`, `seoHtmlValidator.test.ts`, `metricsEngine.test.ts`).
   - Compilar e checar linter (`compile_applet` e `lint_applet`).
   - Testar chamadas aos endpoints ao vivo da Lucas Home.
