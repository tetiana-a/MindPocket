'use client';

import { useState } from 'react';
import { MessageCircle, BookHeart, Wind, Phone, Music, Brain, VolumeX } from 'lucide-react';
import { ChatSection } from '@/components/chat-section';
import { DiarySection } from '@/components/diary-section';
import { BreathingSection } from '@/components/breathing-section';
import { CrisisSection } from '@/components/crisis-section';
import { MusicPlayer } from '@/components/music-player';

const tabs = [
  { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
  { id: 'diary' as const, label: 'Deník', icon: BookHeart },
  { id: 'breathing' as const, label: 'Dech', icon: Wind },
  { id: 'crisis' as const, label: 'Pomoc', icon: Phone },
];

type TabId = 'chat' | 'diary' | 'breathing' | 'crisis';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [showMusic, setShowMusic] = useState(false);

  const renderSection = () => {
    if (activeTab === 'chat') return <ChatSection />;
    if (activeTab === 'diary') return <DiarySection />;
    if (activeTab === 'breathing') return <BreathingSection />;
    return <CrisisSection />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#07070a] via-[#10101a] to-[#050505] text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.22),transparent_35%),radial-gradient(circle_at_bottom,rgba(45,212,191,0.12),transparent_35%)] pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">MindPocket</h1>
              <p className="text-xs text-white/50 uppercase tracking-[0.2em]">Psycholog v kapse</p>
            </div>
          </div>

          <button
            onClick={() => setShowMusic(!showMusic)}
            className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition"
          >
            {showMusic ? <VolumeX className="w-5 h-5" /> : <Music className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {showMusic && (
        <div className="max-w-xl mx-auto w-full px-5 mt-4 z-10">
          <MusicPlayer />
        </div>
      )}

      <main className="flex-1 max-w-xl mx-auto w-full px-5 py-8 pb-32 relative z-10">
        <section className="text-center mb-8">
          <div className="mx-auto mb-5 w-24 h-24 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-2xl">
            <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
          </div>

          <h2 className="text-4xl font-semibold tracking-tight mb-3">
            Ahoj, jsem tu pro vás
          </h2>

          <p className="text-white/55 text-base leading-relaxed max-w-md mx-auto">
            Vyberte téma nebo napište, co právě cítíte. MindPocket vám pomůže zklidnit myšlenky.
          </p>
        </section>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-2xl p-4">
          {renderSection()}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-xl mx-auto flex items-center justify-around py-3 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition ${
                  isActive ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
