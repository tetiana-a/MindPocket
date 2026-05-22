import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Сообщение обязательно' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const systemPrompt = `Ты — эмпатичный и профессиональный ИИ-психолог. Твоя задача — поддерживать пользователя, помогать ему разобраться в своих чувствах и эмоциях, предлагать конструктивные техники самопомощи.

Правила:
- Отвечай на русском языке
- Будь тёплым, понимающим и поддерживающим
- Используй техники активного слушания — отражай чувства пользователя
- Предлагай конкретные техники: дыхательные упражнения, техники КПТ, майндфулнес
- Никогда не ставь диагнозы и не назначай лекарства
- Если пользователь в кризисной ситуации, настоятельно рекомендуй обратиться к специалисту или горячей линии
- Не будь формальным — общайся как заботливый собеседник
- Отвечай лаконично, но содержательно (2-4 абзаца максимум)
- Используй эмодзи умеренно для выразительности`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const completion = await zai.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || 'Извините, не удалось получить ответ. Попробуйте ещё раз.';

    // Save messages to database
    await db.chatMessage.create({
      data: { role: 'user', content: message },
    });
    await db.chatMessage.create({
      data: { role: 'assistant', content: reply },
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
