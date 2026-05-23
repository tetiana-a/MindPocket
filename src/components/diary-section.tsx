'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/mood');
      const data = await res.json();
      setEntries(data.entries || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleSubmit = async () => {
    if (!selectedEmotion || isSubmitting) return;
    const emotion = emotions.find((e) => e.value === selectedEmotion);
    if (!emotion) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: emotion.mood, emotion: emotion.label, note: note.trim() || null }),
      });
      if (res.ok) {
        setSelectedEmotion(null);
        setNote('');
        setShowForm(false);
        await fetchEntries();
      }
    } catch { /* silent */ } finally {
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
    } catch { /* silent */ }
  };

  const last7Days = entries.filter((e) => {
    return Date.now() - new Date(e.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
  });

  const avgMood = last7Days.length > 0
    ? (last7Days.reduce((s, e) => s + e.mood, 0) / last7Days.length).toFixed(1)
    : '—';

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const moodLine = (m: number) => {
    if (m >= 5) return '━━━━━';
    if (m >= 4) return '━━━━';
    if (m >= 3) return '━━━';
    if (m >= 2) return '━━';
    return '━';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-light tracking-tight">Deník nálad</h2>
        <p className="text-sm text-white/30">Sledujte své emoce den za dnem</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[9px] text-white/30 tracking-widest uppercase">Průměr 7 dní</span>
          </div>
          <p className="text-2xl font-light">{avgMood}<span className="text-sm text-white/30"> /5</span></p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[9px] text-white/30 tracking-widest uppercase">Záznamy</span>
          </div>
          <p className="text-2xl font-light">{last7Days.length}</p>
        </div>
      </div>

      {/* Mood distribution */}
      {last7Days.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <p className="text-[9px] text-white/30 tracking-widest uppercase mb-3">Rozložení emocí</p>
          <div className="space-y-2">
            {emotions.map((em) => {
              const count = last7Days.filter(e => e.emotion === em.label).length;
              const pct = last7Days.length > 0 ? (count / last7Days.length) * 100 : 0;
              return (
                <div key={em.value} className="flex items-center gap-3">
                  <span className="text-white/40 text-xs w-16">{em.label}</span>
                  <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/40 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/20 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Entry */}
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
            <button onClick={() => { setShowForm(false); setSelectedEmotion(null); setNote(''); }} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {emotions.map((em) => (
              <button
                key={em.value}
                onClick={() => setSelectedEmotion(em.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                  selectedEmotion === em.value
                    ? 'bg-white text-black'
                    : 'bg-white/[0.04] hover:bg-white/[0.08]'
                }`}
              >
                <span className="text-lg">{em.symbol}</span>
                <span className={`text-[9px] tracking-wider uppercase ${selectedEmotion === em.value ? 'text-black/60' : 'text-white/30'}`}>
                  {em.label}
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
                rows={2}
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

      {/* Entries */}
      {entries.length > 0 && (
        <div className="space-y-2 stagger-children">
          <p className="text-[9px] text-white/30 tracking-widest uppercase">Poslední záznamy</p>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="glass rounded-xl p-3 flex items-center gap-3 group hover-lift"
            >
              <span className="text-white/40 font-mono text-sm">{moodLine(entry.mood)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">{entry.emotion}</span>
                  <span className="text-[10px] text-white/20">{formatDate(entry.createdAt)}</span>
                </div>
                {entry.note && <p className="text-xs text-white/30 mt-0.5 truncate">{entry.note}</p>}
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
          <p className="text-xs text-white/10 mt-1">Začněte sledovat svou náladu</p>
        </div>
      )}
    </div>
  );
}
