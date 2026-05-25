import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: 'system',
        content: `
You are MindPocket AI.

You are a calm emotional support assistant.
Speak warmly, naturally and shortly.

Rules:
- Answer in Czech language
- Be empathetic
- Keep answers short
- Help calm anxiety and stress
- Never be aggressive
- Sound human and supportive
`,
      },

      ...(history || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),

      {
        role: 'user',
        content: message,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 300,
    });

    const aiMessage =
      completion.choices[0]?.message?.content ||
      'Promiňte, nastala chyba.';

    return NextResponse.json({
      message: aiMessage,
    });
  } catch (error) {
    console.error('CHAT API ERROR:', error);

    return NextResponse.json(
      {
        error: 'AI error',
      },
      { status: 500 }
    );
  }
}
