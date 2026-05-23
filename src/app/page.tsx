'use client';

import { useState } from 'react';
import {
  MessageCircle,
  BookHeart,
  Wind,
  Phone,
  Music,
  Brain,
  VolumeX,
} from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-[#05060a] text-white relative overflow-hidden">
      
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.16),transparent_35%),radial-gradient(circle_at_bottom,rgba(45,212,191,0.08),transparent_35%)]" />

        <div className="absolute top-32 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />

        <div className="absolute bottom-36 left-20 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl animate-[float_10s_ease-in-out_infinite]" />

        <div className="absolute top-1/3 right-24 h-40 w-40 rounded-full bg-purple-400/10 blur-3xl animate-[float_12s_ease-in-out_infinite]" />

      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                MindPocket
              </h1>

              <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">
                Psycholog v kapse
              </p>
            </div>

          </div>

          <button
            onClick={() => setShowMusic(!showMusic)}
            className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
          >
            {showMusic ? (
              <VolumeX className="w-5 h-5 text-white/70" />
            ) : (
              <Music className="w-5 h-5 text-white/70" />
            )}
          </button>

        </div>
      </header>

      {/* Music */}
      {showMusic && (
        <div className="max-w-xl mx-auto w-full px-5 mt-4 relative z-20">
          <MusicPlayer />
        </div>
      )}

      {/* Main */}
      <main className="flex-1 max-w-xl mx-auto w-full px-5 pt-10 pb-40 relative z-10">

        {/* Hero */}
        <section className="text-center mb-8">

          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.05)]">

            <div className="w-4 h-4 rounded-full bg-white animate-pulse" />

          </div>

          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4">
            Ahoj, jsem tu pro vás
          </h2>

          <p className="text-white/50 text-base leading-relaxed max-w-md mx-auto">
            Vyprávějte mi, co vás trápí, nebo si vyberte téma níže.
          </p>

        </section>

        {/* Card */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-5 max-h-[68vh] overflow-y-auto">

          {renderSection()}

        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/60 backdrop-blur-2xl">

        <div className="max-w-xl mx-auto flex items-center justify-around py-3 px-4">

          {tabs.map((tab) => {

            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/35 hover:text-white'
                }`}
              >

                <Icon className="w-5 h-5" />

                <span className="text-[10px] uppercase tracking-wider">
                  {tab.label}
                </span>

              </button>
            );
          })}

        </div>

      </nav>

    </div>
  );
}
