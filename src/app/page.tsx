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
    <div className="min-h-screen bg-[#05060a] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.18),transparent_32%),radial-gradient(circle_at_bottom,rgba(0,212,255,0.12),transparent_38%),linear-gradient(to_bottom,#05060a,#070b14,#040507)]" />

        <div
          className="absolute top-[8%] left-[10%] h-[38rem] w-[38rem] rounded-full bg-violet-500/20 blur-[120px]"
          style={{
            animation: 'auroraFloat1 18s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />

        <div
          className="absolute bottom-[4%] right-[8%] h-[34rem] w-[34rem] rounded-full bg-cyan-400/15 blur-[120px]"
          style={{
            animation: 'auroraFloat2 24s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />

        <div
          className="absolute top-[42%] left-[44%] h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/12 blur-[100px]"
          style={{
            animation: 'auroraFloat3 20s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.08) 45%, transparent 100%)',
            animation: 'beamMove 14s linear infinite',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27 viewBox=%270 0 200 200%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_45%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/65 backdrop-blur-2xl">
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg relative overflow-hidden">
              <Brain className="w-5 h-5 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-transparent opacity-20" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">MindPocket</h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">
                Psycholog v kapse
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMusic((value) => !value)}
            className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
            aria-label="Toggle music player"
          >
            {showMusic ? (
              <VolumeX className="w-5 h-5 text-white/80" />
            ) : (
              <Music className="w-5 h-5 text-white/80" />
            )}
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-xl mx-auto w-full px-5 pt-28 pb-36">
        {showMusic && (
          <div className="mb-5 rounded-[1.5rem] border border-white/10 bg-black/55 backdrop-blur-2xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <MusicPlayer />
          </div>
        )}

        <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-5 min-h-[62vh] max-h-[72vh] overflow-y-auto">
          {renderSection()}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/75 backdrop-blur-2xl safe-bottom">
        <div className="max-w-xl mx-auto flex items-center justify-around py-3 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 active:scale-90 ${
                  isActive
                    ? 'bg-white text-black shadow-lg shadow-white/20'
                    : 'text-white/35 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-wider font-medium">
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
