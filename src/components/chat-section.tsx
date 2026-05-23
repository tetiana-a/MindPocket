'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ArrowUp } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  'Cítím se úzkostně, pomozte mi se uklidnit',
  'Nevím, jak zvládnout stres v práci',
  'Mám problémy v partnerském vztahu',
  'Cítím se osaměle, co mám dělat?',
  'Jak zvládnout nespavost?',
  'Chci se naučit ovládat hněv',
];

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, history: messages.slice(-10) }),
      });

      const data = await response.json();
      const reply = data.reply || 'Omlouvám se, došlo k chybě. Zkuste to znovu.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Nepodařilo se připojit k serveru.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Welcome */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse-soft" />
            </div>
            <div className="absolute -inset-4 rounded-full bg-white/[0.02] blur-xl" />
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-light tracking-tight">Ahoj, jsem tu pro vás</h2>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              Vyprávějte mi, co vás trápí, nebo si vyberte téma níže.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 w-full max-w-sm stagger-children">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="text-left text-sm px-4 py-3 rounded-2xl glass hover-lift text-white/50 hover:text-white/80 transition-all duration-300"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`animate-fade-in flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-white text-black rounded-2xl rounded-br-lg'
                    : 'glass rounded-2xl rounded-bl-lg text-white/80'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="glass px-5 py-4 rounded-2xl rounded-bl-lg">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/30 typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-white/30 typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-white/30 typing-dot" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="mt-4 relative">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Napište, co vás trápí..."
              className="resize-none min-h-[48px] max-h-[120px] rounded-2xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20 focus-visible:border-white/15 pr-12"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 disabled:opacity-10 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[9px] text-white/15 text-center mt-3 tracking-wider uppercase">
          AI psycholog nenahrazuje odbornou pomoc
        </p>
      </div>
    </div>
  );
}
