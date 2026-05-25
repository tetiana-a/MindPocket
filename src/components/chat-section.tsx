'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
        },
      ]);
    } catch (error) {
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
          placeholder="Napište, co vás trápí..."
          className="flex-1 rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none"
        />

        <button
          onClick={sendMessage}
          className="px-5 rounded-2xl bg-white text-black font-medium"
        >
          →
        </button>
      </div>
    </div>
  );
}
