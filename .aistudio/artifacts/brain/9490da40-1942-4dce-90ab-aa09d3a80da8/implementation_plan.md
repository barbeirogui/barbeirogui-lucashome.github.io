# Integração da Árvore Viva de Categorias e Subcategorias VTEX (Lucas Home)

Plano detalhado para carregar dinamicamente a árvore completa de categorias e subcategorias diretamente da API oficial da VTEX (`/api/vtex/catalog-categories`), incluir as categorias que estavam ausentes nos filtros rápidos (**Camas Conceito**, **Camas Baú Conceito** e **Colchões Enrolados**) e disponibilizar um seletor multinível para filtragem refinada por subcategorias (Casal, Queen, King, Solteiro, Viúva, Solteirinho).

---

### Decisões Confirmadas com o Usuário

- **Árvore Viva via API**: Substituir a lista estática por uma chamada dinâmica que consome `/api/vtex/catalog-categories` em tempo real, mapeando todos os 8 departamentos raiz da Lucas Home e suas mais de 30 subcategorias.
- **Seletor Multinível Hierárquico**:
  - **Nível 1 (Departamento Raiz)**: Todas as Categorias, Camas Conceito, Camas Baú Conceito, Colchões Enrolados, Base Box, Base Baú, Bicamas, Cabeceiras e Colchões.
  - **Nível 2 (Subcategorias Contextuais)**: Ao selecionar um departamento (ex: *Camas Conceito* ou *Base Baú*), o sistema exibe imediatamente as subcategorias correspondentes (*Casal, Queen, King, Solteirinho, Solteiro King, Viúva, etc.*) como filtros refinados.
- **Integração com Busca e Paginação**: O filtro aciona a API de busca da VTEX via `fq=C:{id}`, atualizando a grade de produtos com a contagem exata e imagem oficial de cada item.

---

## 1. Mapeamento Completo da Árvore da Lucas Home

A API `/api/catalog_system/pub/category/tree/3` da conta `lucashome` retorna 8 departamentos oficiais:

```
┌────────────────────────────────────────────────────────────────────────┐
│               Árvore Completa de Categorias (Lucas Home)               │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
  ┌───────────────┬────────────────┼───────────────┬────────────────┐
  ▼               ▼                ▼               ▼                ▼
[264]           [265]            [266]           [267]            [268]
Camas Conceito  Camas Baú Conc.  Colchões Enrol. Base Box         Base Baú
├── Casal (280) ├── Casal (297)  ├── Solt. (278) ├── Queen (284)  ├── Queen (288)
├── Queen (281) └── Queen (298)  ├── Casal (279) ├── Casal (285)  ├── Solt. (289)
└── King (307)                   └── Queen (299) ├── Solt. (286)  ├── King (290)
                                                 ├── Viúva (287)  ├── Casal (291)
                                                 ├── King (300)   ├── Viúva (292)
                                                 └── Solt. (304)  └── Solt. (306)
  ┌────────────────────────────────┼────────────────────────────────┐
  ▼                                ▼                                ▼
[269]                            [271]                            [272]
Bicamas                          Cabeceiras                       Colchões
├── Bicama Box + Colchão (293)   ├── Cabeceira Casal (282)        ├── Colchão Solteiro (273)
├── Bicama Baú + Colchão (294)   └── Cabeceira Queen (283)        ├── Colchão Viúva (274)
├── Bicama Conjugada (295)                                        ├── Colchão Casal (275)
├── Bicamas Avulsas (296)                                         ├── Colchão Queen (276)
└── Bicama Box Casal (301)                                        └── Colchão King (277)
```

---

## 2. Experiência do Usuário (UX) & Design Visual

1. **Barra de Navegação Multinível**:
   - Linha 1: Botões de rolagem suave com ícone de categoria para os 8 departamentos principais + opção "Todas as Categorias" com contadores ativos.
   - Linha 2 (Contextual): Quando um departamento for selecionado, uma barra secundária translúcida surge com as subcategorias filhas daquele departamento.
2. **Badge de Categoria Ativa**:
   - Exibe a trilha de navegação (breadcrumb de filtro), por exemplo: `Camas Conceito > Queen (ID: 281)`.
   - Botão para limpar o filtro de subcategoria ou voltar para a raiz com 1 clique.
3. **Sincronização com o "Product IA"**:
   - Quando o usuário clica em "Otimizar com IA", a árvore de categoria e subcategoria é transmitida para o formulário gerador.

---

## 3. Plano de Implementação

1. **Tipos (`src/types/index.ts`)**:
   - Adicionar ou exportar a interface `VtexCategoryTreeItem` contendo `id`, `name`, `url`, `hasChildren` e `children?: VtexCategoryTreeItem[]`.

2. **Componente `CatalogSalesTab.tsx`**:
   - Adicionar estado `categoriesTree: VtexCategoryTreeItem[]` e carregar via `GET /api/vtex/catalog-categories` na montagem.
   - Substituir o array fixo de 6 itens pela árvore viva de 8 departamentos + subcategorias filhas.
   - Implementar estado `selectedParentCategory` e `selectedSubCategory`.
   - Ao clicar em uma subcategoria, filtrar os produtos chamando `/api/vtex/catalog-products?categoryId=${subId}`.

3. **Verificação & Testes**:
   - Executar suíte de testes existente (`productContentEngine.test.ts`, `seoHtmlValidator.test.ts`, `metricsEngine.test.ts`).
   - Co-executar `compile_applet` e `lint_applet` para certificar zero erros de compilação TypeScript.
   - Testar navegação nas categorias *Camas Conceito*, *Camas Baú Conceito* e *Colchões Enrolados*.
