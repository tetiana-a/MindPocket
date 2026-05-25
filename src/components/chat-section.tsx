'use client';

import { useEffect, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FREE_LIMIT = 10;

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const premiumStatus = localStorage.getItem('mindpocket_premium') === 'true';
    setIsPremium(premiumStatus);
  }, []);

  const userMessagesCount = messages.filter((m) => m.role === 'user').length;
  const isLimitReached = !isPremium && userMessagesCount >= FREE_LIMIT;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    if (isLimitReached) {
      window.location.href = '/premium';
      return;
    }

    const userText = input;

    const userMessage: Message = {
      role: 'user',
      content: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message || 'Omlouvám se, zkuste to znovu.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Omlouvám se, došlo k chybě.',
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 rounded-2xl bg-white/5 border border-white/10 p-4">
        <p className="text-sm text-white/70">
          {isPremium
            ? 'Premium active: unlimited messages'
            : `Free messages: ${Math.min(userMessagesCount, FREE_LIMIT)} / ${FREE_LIMIT}`}
        </p>
      </div>

      {isLimitReached && (
        <div className="mb-4 rounded-3xl border border-white/10 bg-white/10 p-5 text-center">
          <h3 className="text-lg font-semibold mb-2">Premium required</h3>

          <p className="text-sm text-white/55 mb-4">
            You used 10 free messages. Unlock Premium to continue chatting.
          </p>

          <a
            href="/premium"
            className="block w-full rounded-2xl bg-white text-black py-3 font-semibold"
          >
            Unlock Premium
          </a>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-3xl px-5 py-3 text-sm ${
              msg.role === 'user'
                ? 'ml-auto bg-white text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="bg-white/10 text-white rounded-3xl px-5 py-3 text-sm w-fit">
            MindPocket píše...
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLimitReached || loading}
          placeholder={
            isLimitReached
              ? 'Unlock Premium to continue...'
              : 'Napište, co vás trápí...'
          }
          className="flex-1 rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none disabled:opacity-40"
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          disabled={isLimitReached || loading}
          className="px-5 rounded-2xl bg-white text-black font-medium disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
}
