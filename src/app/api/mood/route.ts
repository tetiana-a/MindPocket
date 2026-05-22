import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - fetch mood entries
export async function GET() {
  try {
    const entries = await db.moodEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Mood GET error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST - create mood entry
export async function POST(request: NextRequest) {
  try {
    const { mood, emotion, note } = await request.json();

    if (!mood || !emotion) {
      return NextResponse.json({ error: 'Настроение и эмоция обязательны' }, { status: 400 });
    }

    if (mood < 1 || mood > 5) {
      return NextResponse.json({ error: 'Настроение должно быть от 1 до 5' }, { status: 400 });
    }

    const entry = await db.moodEntry.create({
      data: { mood, emotion, note: note || null },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Mood POST error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// DELETE - delete mood entry
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID обязателен' }, { status: 400 });
    }

    await db.moodEntry.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mood DELETE error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
