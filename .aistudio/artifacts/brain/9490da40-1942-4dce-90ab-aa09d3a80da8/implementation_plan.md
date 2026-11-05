# Plano de Implementação: Conexão Real VTEX (Lucas Home) & Eliminação de Dados Mockados (/calcados/)

## 1. Diagnóstico da Conexão & Causa do "Modo Demonstração"

### Por que ainda estava em Modo Demonstração?
1. Você inseriu a conta **`lucashome`** e a chave **`vtexappkey-lucashome-DTGGHF`**, porém:
   - O arquivo persistido no servidor (`store-config.json`) ainda continha a conta demonstrativa antiga (`loja-vtex-premium`).
   - O **AppToken** ainda estava com o token de exemplo (`8291048102938475`), o que faz com que a VTEX recuse a conexão com **HTTP 401 Unauthorized**.
   - Para segurança e precisão, o sistema só desativa o "Modo Demonstração" quando recebe **HTTP 200 OK** direto da API VTEX.
2. **De onde vieram as URLs `/calcados/`?**
   - Na aba **Validador de Sitemaps & URLs**, o campo vinha pré-preenchido com exemplos ilustrativos genéricos de e-commerce (`/calcados/tenis-running-pro/p`, etc.). Como sua loja é a **Lucas Home** (especializada em Colchões, Camas Box, Cabeceiras e Móveis), esses exemplos causavam confusão.

---

## 2. Ações Planejadas

### Fase 1: Atualização para a Conta Real `lucashome`
- Atualizar a configuração padrão do servidor (`store-config.json` e `defaultStoreConfig`):
  - **Account Name:** `lucashome`
  - **Ambiente:** `vtexcommercestable`
  - **Domínio Principal:** `www.lucashome.com.br`
  - **AppKey:** `vtexappkey-lucashome-DTGGHF`
  - **Google Search Console:** `sc-domain:lucashome.com.br`

### Fase 2: Carregamento Automático de Dados Reais do Catálogo da VTEX
- Criar a rota backend `/api/vtex/catalog-categories`:
  - Consulta a API nativa pública da VTEX: `https://lucashome.vtexcommercestable.com.br/api/catalog_system/pub/category/tree/3`
  - Puxa os departamentos reais da loja (Colchões, Camas Box, Travesseiros, Móveis de Quarto).
- Criar botão **"Carregar URLs do Sitemap Real da Loja"**:
  - No `SitemapUrlBuilderTab`, buscar as URLs reais de `https://www.lucashome.com.br/sitemap.xml` para testar imediatamente as páginas reais da Lucas Home, eliminando 100% de qualquer resquício de `/calcados/`.

### Fase 3: Auto-Validação Imediata ao Salvar
- Atualizar o modal de **Configurações** para que, assim que você inserir ou colar seu **AppToken** real gerado no License Manager, o sistema execute o teste em tempo real na API VTEX OMS (`/api/oms/pvt/orders?per_page=15`).
- Se o token for válido e tiver perfil de leitura, o sistema ativará instantaneamente o selo verde **"🟢 API VTEX Ao Vivo (Dados Reais)"** em todo o painel.
- Se o token estiver incorreto ou não possuir permissão de acesso no License Manager, o painel exibirá exatamente o motivo técnico e o passo a passo para liberar o acesso no Admin VTEX.

---

## 3. Como Fornecer o AppToken da Lucas Home
Para concluir a autenticação ao vivo com a API da Lucas Home:
1. Acesse `https://lucashome.myvtex.com/admin`.
2. Vá em **Configurações da Conta > Gerenciamento de Contas > Chaves de aplicação**.
3. Localize a chave `vtexappkey-lucashome-DTGGHF` e certifique-se de que os perfis **OMS (Leitura de Pedidos)** e **Catalog (Leitura)** estão atribuídos.
4. Gere/copie o **AppToken** secreto correspondente e cole no menu **Configurações** do painel.
