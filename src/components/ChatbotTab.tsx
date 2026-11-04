import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Search,
  ExternalLink,
  RefreshCw,
  HelpCircle,
  Code,
  ShieldAlert,
} from 'lucide-react';
import { ChatMessage, GroundingSource } from '../types';

interface ChatbotTabProps {
  storeName: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_welcome',
    role: 'model',
    text: `Olá! Sou seu **Especialista em E-commerce VTEX CMS Legacy (Portal)**. 

Estou conectado com **aterramento de Pesquisa Google em tempo real** para buscar documentações atualizadas, tendências de mercado, boas práticas de SEO Técnico, GEO (Generative Engine Optimization para ChatGPT Search, Perplexity e Google AI Overviews) e otimizações de taxa de conversão (CRO).

Como esta loja utiliza **VTEX CMS Legacy**, todas as soluções consideram:
- HTML Templates e Subtemplates no Portal (\`CMS > Layout\`)
- Biblioteca de arquivos estáticos (\`/arquivos/\`)
- Objeto JavaScript nativo \`skuJson\` para Rich Snippets
- Mapeamento 301 no **Gerenciador de URL**
- Customizações de checkout via \`checkout6-custom.js\` com \`vtexjs\`

Em que posso te ajudar agora? Escolha uma das sugestões abaixo ou digite sua dúvida!`,
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  },
];

const SUGGESTED_QUERIES = [
  'Como implementar Schema.org Product com skuJson no subtemplate de PDP?',
  'Como resolver erros de redirecionamento 301 no Gerenciador de URL do Portal?',
  'Como melhorar o LCP diferindo scripts carregados em /arquivos/?',
  'Quais diretivas colocar no robots.txt para liberar ChatGPT Search e Perplexity?',
  'Como capturar eventos de compra do vtexjs no checkout6-custom.js para o GA4?',
];

export const ChatbotTab: React.FC<ChatbotTabProps> = ({ storeName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsgId = `user_${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyPayload }),
      });

      const data = await res.json();

      if (data.success) {
        const botMessage: ChatMessage = {
          id: `bot_${Date.now()}`,
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          groundingSources: data.groundingSources,
          searchQueries: data.searchQueries,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: `bot_err_${Date.now()}`,
          role: 'model',
          text: `Desculpe, ocorreu um erro ao consultar o especialista: ${data.message || 'Tente novamente.'}`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err: unknown) {
      const errorMessage: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        role: 'model',
        text: 'Não foi possível se comunicar com o servidor de IA. Verifique sua conexão e tente novamente.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render markdown-like text with code blocks
  const renderFormattedText = (rawText: string, messageId: string) => {
    const parts = rawText.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].trim().toLowerCase();
        const code = (lang && ['html', 'javascript', 'js', 'json', 'css', 'bash', 'txt'].includes(lang)
          ? lines.slice(1)
          : lines
        ).join('\n');
        const blockId = `${messageId}_code_${index}`;

        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-slate-700 text-slate-300">
              <span className="text-[10px] uppercase font-bold text-pink-400">
                {lang || 'código'}
              </span>
              <button
                onClick={() => handleCopy(code, blockId)}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors"
                title="Copiar código"
              >
                {copiedId === blockId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 overflow-x-auto text-slate-200 leading-relaxed scrollbar-thin">
              {code}
            </pre>
          </div>
        );
      }

      // Format basic paragraphs and bullet lines
      return (
        <div key={index} className="space-y-1.5 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
          {part}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] min-h-[600px] bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Top Banner / Agent Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Especialista VTEX CMS Legacy (Chat com IA)</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/40 rounded-full">
                Portal Legacy
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Consultor de SEO Técnico, GEO (Perplexity/ChatGPT), Search Console, GA4 e CRO para <strong className="text-slate-200">{storeName}</strong>
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-blue-950/40 border border-blue-500/30 text-blue-300 rounded-lg">
            <Search className="w-3 h-3 text-blue-400" />
            <span>Google Search Grounding Ativo</span>
          </div>
          <button
            onClick={() => setMessages(INITIAL_MESSAGES)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Limpar histórico da conversa"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-pink-600/20 text-pink-400 border border-pink-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm text-slate-100 ${
                  isUser
                    ? 'bg-slate-800 border border-slate-700/80 rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {isUser ? 'Você' : 'Especialista VTEX Legacy'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="text-slate-200 font-sans">
                  {renderFormattedText(msg.text, msg.id)}
                </div>

                {/* Grounding Citations */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-400">
                      <Search className="w-3 h-3" />
                      <span>Fontes & Pesquisa Google em Tempo Real:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingSources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-700 text-blue-300 hover:text-white hover:border-blue-500 transition-colors"
                          title={source.uri}
                        >
                          <span className="truncate max-w-[200px]">{source.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-pink-400" />
              <span>Consultando inteligência VTEX Legacy e Pesquisa Google...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/70 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
            <HelpCircle className="w-3 h-3 text-pink-400" />
            Perguntas Frequentes:
          </span>
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full border border-slate-700 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="relative flex-1">
            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida sobre VTEX CMS Legacy, SEO, GEO, GSC, GA4 ou CRO... (Pressione Enter para enviar)"
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="h-11 px-5 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 shadow-md shadow-pink-900/30"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
