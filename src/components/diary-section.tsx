'use client';

import { useState, useEffect } from 'react';
import { Plus, X, TrendingUp, Calendar } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface MoodEntry {
  id: string;
  mood: number;
  emotion: string;
  note: string | null;
  createdAt: string;
}

const emotions = [
  { label: 'Radost', value: 'joy', mood: 5, symbol: '○' },
  { label: 'Klid', value: 'calm', mood: 4, symbol: '◎' },
  { label: 'Neutrální', value: 'neutral', mood: 3, symbol: '●' },
  { label: 'Smutek', value: 'sadness', mood: 2, symbol: '◐' },
  { label: 'Hněv', value: 'anger', mood: 1, symbol: '◑' },
] as const;

export function DiarySection() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mindpocket_diary');

    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch {
        setEntries([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mindpocket_diary', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = async () => {
    if (!selectedEmotion || isSubmitting) return;

    const emotion = emotions.find((e) => e.value === selectedEmotion);
    if (!emotion) return;

    setIsSubmitting(true);

    const newEntry: MoodEntry = {
      id: crypto.randomUUID(),
      mood: emotion.mood,
      emotion: emotion.label,
      note: note.trim() || null,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);

    setSelectedEmotion(null);
    setNote('');
    setShowForm(false);
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const last7Days = entries.filter((e) => {
    return Date.now() - new Date(e.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
  });

  const avgMood =
    last7Days.length > 0
      ? (last7Days.reduce((sum, entry) => sum + entry.mood, 0) / last7Days.length).toFixed(1)
      : '—';

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  const moodLine = (mood: number) => {
    if (mood >= 5) return '━━━━━';
    if (mood >= 4) return '━━━━';
    if (mood >= 3) return '━━━';
    if (mood >= 2) return '━━';
    return '━';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-light tracking-tight">Deník nálad</h2>
        <p className="text-sm text-white/30">Sledujte své emoce den za dnem</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[9px] text-white/30 tracking-widest uppercase">
              Průměr 7 dní
            </span>
          </div>

          <p className="text-2xl font-light">
            {avgMood}
            <span className="text-sm text-white/30"> /5</span>
          </p>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[9px] text-white/30 tracking-widest uppercase">
              Záznamy
            </span>
          </div>

          <p className="text-2xl font-light">{last7Days.length}</p>
        </div>
      </div>

      {last7Days.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <p className="text-[9px] text-white/30 tracking-widest uppercase mb-3">
            Rozložení emocí
          </p>

          <div className="space-y-2">
            {emotions.map((emotion) => {
              const count = last7Days.filter(
                (entry) => entry.emotion === emotion.label
              ).length;

              const percentage =
                last7Days.length > 0 ? (count / last7Days.length) * 100 : 0;

              return (
                <div key={emotion.value} className="flex items-center gap-3">
                  <span className="text-white/40 text-xs w-16">
                    {emotion.label}
                  </span>

                  <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/40 rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="text-[10px] text-white/20 w-6 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full h-14 rounded-2xl bg-white text-black font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Zaznamenat náladu
        </button>
      ) : (
        <div className="glass rounded-2xl p-5 space-y-4 animate-fade-in-scale">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Jak se cítíte?</h3>

            <button
              onClick={() => {
                setShowForm(false);
                setSelectedEmotion(null);
                setNote('');
              }}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {emotions.map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                  selectedEmotion === emotion.value
                    ? 'bg-white text-black'
                    : 'bg-white/[0.04] hover:bg-white/[0.08]'
                }`}
              >
                <span className="text-lg">{emotion.symbol}</span>

                <span
                  className={`text-[9px] tracking-wider uppercase ${
                    selectedEmotion === emotion.value
                      ? 'text-black/60'
                      : 'text-white/30'
                  }`}
                >
                  {emotion.label}
                </span>
              </button>
            ))}
          </div>

          {selectedEmotion && (
            <>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Co se stalo? Co cítíte? (volitelné)"
                className="resize-none rounded-xl bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20"
                rows={3}
              />

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-white text-black font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30"
              >
                Uložit
              </button>
            </>
          )}
        </div>
      )}

      {entries.length > 0 && (
        <div className="space-y-2 stagger-children">
          <p className="text-[9px] text-white/30 tracking-widest uppercase">
            Poslední záznamy
          </p>

          {entries.map((entry) => (
            <div
              key={entry.id}
              className="glass rounded-xl p-3 flex items-center gap-3 group hover-lift"
            >
              <span className="text-white/40 font-mono text-sm">
                {moodLine(entry.mood)}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">{entry.emotion}</span>
                  <span className="text-[10px] text-white/20">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>

                {entry.note && (
                  <p className="text-xs text-white/30 mt-0.5 truncate">
                    {entry.note}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDelete(entry.id)}
                className="opacity-0 group-hover:opacity-30 hover:!opacity-70 transition-all duration-200 text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-sm text-white/15">Zatím žádné záznamy</p>
          <p className="text-xs text-white/10 mt-1">
            Začněte sledovat svou náladu
          </p>
        </div>
      )}
    </div>
  );
}
