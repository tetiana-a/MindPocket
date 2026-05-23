'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, BookHeart, Wind, Phone, Music, Brain, X, Volume2, VolumeX } from 'lucide-react';
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
  const [contentKey, setContentKey] = useState(0);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setContentKey(prev => prev + 1);
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'chat': return <ChatSection />;
      case 'diary': return <DiarySection />;
      case 'breathing': return <BreathingSection />;
      case 'crisis': return <CrisisSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Subtle dot grid background */}
      <div className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <Brain className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">MindPocket</h1>
              <p className="text-[10px] text-white/30 tracking-widest uppercase">Psycholog v kapse</p>
            </div>
          </div>

          <button
            onClick={() => setShowMusic(!showMusic)}
            className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all duration-300 group"
          >
            {showMusic ? (
              <VolumeX className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
            ) : (
              <Music className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
            )}
          </button>
        </div>
      </header>

      {/* Music Player */}
      {showMusic && <MusicPlayer />}

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-4 pb-28">
        <div key={contentKey} className="animate-fade-in">
          {renderSection()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong safe-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="flex flex-col items-center gap-1 py-2 px-4 transition-all duration-300 group"
              >
                <div className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-50'}`}>
                  <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'stroke-[2px]' : ''}`} />
                </div>
                <span className={`text-[9px] tracking-wider uppercase transition-all duration-300 ${
                  isActive ? 'text-white/90 font-medium' : 'text-white/30'
                }`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-white mt-0.5 animate-fade-in-scale" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
