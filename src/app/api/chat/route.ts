import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { message: 'Zpráva je povinná.' },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: 'system',
        content: `
You are MindPocket AI.

You are a calm emotional support assistant.

Rules:
- Speak Czech
- Be warm
- Keep answers short
- Help reduce stress
- Never give medical diagnosis
- If user is in danger, advise contacting emergency help
`,
      },

      ...(history || []),

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

    return NextResponse.json({
      message:
        completion.choices[0]?.message?.content ||
        'Omlouvám se, zkuste to prosím znovu.',
    });
  } catch (error) {
    console.error('CHAT API ERROR:', error);

    return NextResponse.json(
      {
        message: 'Omlouvám se, došlo k chybě. Zkuste to znovu.',
      },
      { status: 500 }
    );
  }
}
