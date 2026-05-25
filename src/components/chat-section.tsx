import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = body.message;
    const history = body.history || [];

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `
You are MindPocket AI.

You are a calm emotional support assistant and AI psychologist.

Your personality:
- warm
- emotionally intelligent
- calming
- supportive
- human-like

Rules:
- ALWAYS answer in Czech language
- Keep answers short and natural
- Help with anxiety, stress, loneliness and emotions
- Never sound robotic
- Never be cold or aggressive
- Give calming emotional support
- Use simple human language
- Maximum 5 short paragraphs
- Sometimes ask gentle follow-up questions
- Support the user emotionally
`,
      },

      ...history.map((msg: any) => ({
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
      messages,
      temperature: 0.9,
      max_tokens: 400,
    });

    const aiMessage =
      completion.choices?.[0]?.message?.content ||
      'Promiňte, něco se pokazilo.';

    return NextResponse.json({
      message: aiMessage,
    });
  } catch (error: any) {
    console.error('OPENAI ERROR:', error);

    return NextResponse.json(
      {
        error: 'AI server error',
      },
      { status: 500 }
    );
  }
}
