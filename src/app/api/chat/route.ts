import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Zpráva je povinná' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const systemPrompt = `Jsi empatický a profesionální AI psycholog. Tvým úkolem je podporovat uživatele, pomáhat mu pochopit jeho pocity a emoce a nabízet konstruktivní techniky sebe pomoci.

Pravidla:
- Odpovídej v češtině
- Buď teplý, chápavý a podporující
- Používej techniky aktivního naslouchání — odrážej pocity uživatele
- Nabízej konkrétní techniky: dechová cvičení, KBT techniky, mindfulness
- Nikdy nestav diagnózy a nepředepisuj léky
- Pokud je uživatel v krizové situaci, důrazně doporuč kontaktovat odborníka nebo krizovou linku
- Nebuď formální — komunikuj jako starostlivý společník
- Odpovídej stručně, ale obsahově (2-4 odstavce maximum)
- Používej emoji střídmě pro expressivitu
- Jsi premium psychologická služba — buď profesionální, ale lidský`;

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

    const reply = completion.choices[0]?.message?.content || 'Omlouvám se, nepodařilo se získat odpověď. Zkuste to prosím znovu.';

    await db.chatMessage.create({ data: { role: 'user', content: message } });
    await db.chatMessage.create({ data: { role: 'assistant', content: reply } });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
