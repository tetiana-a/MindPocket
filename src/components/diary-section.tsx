'use client';

import { useState, useEffect, useCallback } from 'react';
import { Smile, Frown, Meh, Angry, Heart, Plus, Trash2, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MoodEntry {
  id: string;
  mood: number;
  emotion: string;
  note: string | null;
  createdAt: string;
}

const emotions = [
  { label: 'Радость', value: 'joy', mood: 5, icon: Smile, color: 'text-green-500' },
  { label: 'Спокойствие', value: 'calm', mood: 4, icon: Heart, color: 'text-teal-500' },
  { label: 'Нейтрально', value: 'neutral', mood: 3, icon: Meh, color: 'text-yellow-500' },
  { label: 'Грусть', value: 'sadness', mood: 2, icon: Frown, color: 'text-blue-500' },
  { label: 'Гнев', value: 'anger', mood: 1, icon: Angry, color: 'text-red-500' },
] as const;

export function DiarySection() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/mood');
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = async () => {
    if (!selectedEmotion || isSubmitting) return;

    const emotion = emotions.find((e) => e.value === selectedEmotion);
    if (!emotion) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: emotion.mood,
          emotion: emotion.label,
          note: note.trim() || null,
        }),
      });

      if (res.ok) {
        setSelectedEmotion(null);
        setNote('');
        setShowForm(false);
        await fetchEntries();
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/mood', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      await fetchEntries();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  // Calculate mood stats
  const last7Days = entries.filter((e) => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  });
  const avgMood = last7Days.length > 0
    ? (last7Days.reduce((sum, e) => sum + e.mood, 0) / last7Days.length).toFixed(1)
    : '—';

  const moodDistribution = emotions.map((em) => ({
    ...em,
    count: last7Days.filter((e) => e.emotion === em.label).length,
  }));

  const moodEmoji = (mood: number) => {
    if (mood >= 5) return '😊';
    if (mood >= 4) return '😌';
    if (mood >= 3) return '😐';
    if (mood >= 2) return '😢';
    return '😠';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Среднее за 7 дней</p>
              <p className="text-xl font-bold text-foreground">{avgMood} / 5</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Записей за 7 дней</p>
              <p className="text-xl font-bold text-foreground">{last7Days.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Distribution */}
      {last7Days.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Распределение эмоций</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-end gap-2 h-20">
              {moodDistribution.map((em) => (
                <div key={em.value} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary/15 rounded-t-md transition-all duration-500"
                    style={{ height: `${last7Days.length > 0 ? (em.count / last7Days.length) * 60 : 0}px` }}
                  />
                  <span className="text-xs">{moodEmoji(em.mood)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Entry Button */}
      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="w-5 h-5" />
          Записать настроение
        </Button>
      ) : (
        <Card className="border-primary/20">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Как вы сейчас себя чувствуете?</h3>
            <div className="grid grid-cols-5 gap-2">
              {emotions.map((em) => {
                const Icon = em.icon;
                const isSelected = selectedEmotion === em.value;
                return (
                  <button
                    key={em.value}
                    onClick={() => setSelectedEmotion(em.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border hover:border-primary/30 hover:bg-accent'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${em.color}`} />
                    <span className="text-[10px] text-muted-foreground">{em.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedEmotion && (
              <>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Что произошло? Что вы чувствуете? (необязательно)"
                  className="resize-none rounded-xl"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
                  >
                    Сохранить
                  </Button>
                  <Button
                    onClick={() => { setShowForm(false); setSelectedEmotion(null); setNote(''); }}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Отмена
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Entries List */}
      {entries.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>Последние записи</span>
          </div>
          <ScrollArea className="max-h-96">
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="mood-pulse flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-border transition-colors"
                >
                  <span className="text-2xl flex-shrink-0">{moodEmoji(entry.mood)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{entry.emotion}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-muted-foreground mt-0.5 break-words">{entry.note}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Пока нет записей. Начните отслеживать настроение!</p>
        </div>
      )}
    </div>
  );
}
