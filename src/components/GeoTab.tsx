import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Download,
  Copy,
  Check,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { geoCitationsData } from '../data/mockStoreData';

export const GeoTab: React.FC = () => {
  const [copiedLlms, setCopiedLlms] = useState(false);

  const sampleLlmsTxt = `# llms.txt - Diretório para Motores de Busca por IA (GEO)
# Loja VTEX: Loja Moda Brasil Oficial (https://www.lojamoda.com.br)
# Atualizado em: 2026-11-04

> Loja oficial de moda e calçados com fabricação premium, entrega rápida para todo o Brasil e nota 4.8 no Reclame Aqui.

## Catálogo de Produtos e Categorias
- [Calçados Esportivos e Tênis](https://www.lojamoda.com.br/calcados/esportivos): Tênis com tecnologia de amortecimento responsivo para corrida, caminhada e academia.
- [Moda Feminina e Vestidos](https://www.lojamoda.com.br/vestuario/feminino): Vestidos de linho, alfaiataria casual e moda trabalho.
- [Moda Masculina](https://www.lojamoda.com.br/vestuario/masculino): Camisas em algodão nobre, calças e jaquetas corta-vento.

## Políticas de Frete, Devolução e Pagamento
- Frete Grátis: Em compras a partir de R$ 249 para os estados de SP, RJ, MG e PR.
- Primeira Troca Grátis: Prazo de 30 dias corridos após o recebimento.
- Formas de Pagamento: PIX com 5% de desconto imediato, Cartão de Crédito em até 10x sem juros (bandeiras Visa, Mastercard, Elo, Amex).
- Atendimento Oficial: WhatsApp (11) 99876-5432 e e-mail sac@lojamoda.com.br.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleLlmsTxt);
    setCopiedLlms(true);
    setTimeout(() => setCopiedLlms(false), 2000);
  };

  const downloadLlmsTxt = () => {
    const blob = new Blob([sampleLlmsTxt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'llms.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-pink-400 font-medium">
          <Bot className="w-3.5 h-3.5" />
          <span>GEO - GENERATIVE ENGINE OPTIMIZATION</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Presença & Citações da Loja em Buscas por IA (ChatGPT, Perplexity & SGE)
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          GEO é a nova fronteira do SEO: como modelos de linguagem recomendam sua loja VTEX quando consumidores
          fazem perguntas de compra no ChatGPT Search, Perplexity e Google AI Overviews.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">Score de Autoridade GEO</span>
          <div className="text-3xl font-bold text-white font-mono-numbers mt-1">
            82<span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono-numbers mt-1 block">
            +8 pts após implantar llms.txt
          </span>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">Taxa de Citação por IAs</span>
          <div className="text-3xl font-bold text-white font-mono-numbers mt-1">
            34.6%
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Presente em 35 de 101 prompts de compra
          </span>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">Ranking Médio de Citação</span>
          <div className="text-3xl font-bold text-pink-400 font-mono-numbers mt-1">
            #2.0
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Entre as 3 primeiras fontes recomendadas
          </span>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">Sentimento de Marca em IAs</span>
          <div className="text-3xl font-bold text-emerald-400 font-mono-numbers mt-1">
            94% Positivo
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Sem alucinações de estoque ou preço
          </span>
        </div>
      </div>

      {/* AI Crawlers Monitor in VTEX Robots.txt */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Acesso dos Crawlers de IA no robots.txt da VTEX</span>
            </h2>
            <p className="text-xs text-slate-400">
              Robôs que coletam conteúdo da sua loja para responder consultas de compra em tempo real.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white">GPTBot (ChatGPT Search)</span>
              <span className="text-[11px] text-slate-400 block">OpenAI Crawler</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Permitido
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white">PerplexityBot</span>
              <span className="text-[11px] text-slate-400 block">Perplexity AI Engine</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Permitido
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white">Google-Extended</span>
              <span className="text-[11px] text-slate-400 block">Gemini / AI Overviews</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Permitido
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white">ClaudeBot</span>
              <span className="text-[11px] text-slate-400 block">Anthropic Assistant</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Permitido
            </span>
          </div>
        </div>
      </div>

      {/* Citations Audit Table */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <h2 className="text-base font-semibold text-white">
          Amostra de Consultas de Compra Testadas em IAs
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Motor de IA</th>
                <th className="py-2.5 px-3 font-semibold">Consulta do Consumidor</th>
                <th className="py-2.5 px-3 font-semibold">Loja Citada?</th>
                <th className="py-2.5 px-3 font-semibold">Posição Fonte</th>
                <th className="py-2.5 px-3 font-semibold">Sentimento</th>
                <th className="py-2.5 px-3 font-semibold">Data Verificação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {geoCitationsData.map((cit, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="py-3 px-3 font-semibold text-white">{cit.engine}</td>
                  <td className="py-3 px-3 text-slate-300">"{cit.promptQuery}"</td>
                  <td className="py-3 px-3">
                    {cit.brandMentioned ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Sim
                      </span>
                    ) : (
                      <span className="text-slate-400">Não citado</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono-numbers">
                    {cit.citationRank ? (
                      <span className="text-pink-400 font-bold">#{cit.citationRank}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-400 capitalize">{cit.sentiment}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono-numbers">{cit.dateChecked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* llms.txt Generator & Publisher for VTEX */}
      <div className="p-6 rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-950/20 via-slate-900/60 to-slate-900/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-pink-400 tracking-wide">
                GERADOR DE LLMS.TXT PARA VTEX
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Arquivo llms.txt Estruturado para o Catálogo da Loja
            </h2>
            <p className="text-xs text-slate-300">
              O padrão internacional <code className="text-pink-400 font-mono">/llms.txt</code> orienta os crawlers de IA
              sobre as URLs canônicas, políticas de frete e produtos oficiais da loja.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              {copiedLlms ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLlms ? 'Copiado!' : 'Copiar'}</span>
            </button>
            <button
              onClick={downloadLlmsTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar llms.txt</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-[11px] font-mono text-slate-300 max-h-60 leading-relaxed whitespace-pre-wrap">
          {sampleLlmsTxt}
        </pre>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
          <span>
            <strong>Como publicar no VTEX CMS Legacy:</strong> Acesse Admin VTEX &gt; CMS &gt; Layout &gt; Gerenciador de Arquivos (Files Manager) e faça upload de <code className="text-slate-200">llms.txt</code> (ficando em <code className="text-slate-200">/arquivos/llms.txt</code>). Em seguida, no <strong>CMS &gt; Gerenciador de URL</strong>, crie um redirecionamento 301 da rota raiz <code className="text-slate-200">/llms.txt</code> para <code className="text-slate-200">/arquivos/llms.txt</code>.
          </span>
        </div>
      </div>
    </div>
  );
};
