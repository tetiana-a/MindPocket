'use client';

import { useState, useEffect, useRef } from 'react';
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
  
  // Refs для анимированных элементов фона
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);
  const blob3 = useRef<HTMLDivElement>(null);
  
  // Состояние позиции курсора/касания
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Инициализация начальной позиции в центре
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Анимационный цикл (60fps)
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.005; // Скорость "дыхания"

      // Логика плавного следования за курсором (Easing)
      // Коэффициенты подобраны для гипнотического эффекта
      if (blob1.current && blob2.current && blob3.current) {
        // Blob 1: Следует за курсором с задержкой + органическое движение
        const x1 = Math.sin(time * 1.5) * 100 + (mouse.current.x - window.innerWidth / 2) * 0.05;
        const y1 = Math.cos(time * 1.2) * 100 + (mouse.current.y - window.innerHeight / 2) * 0.05;
        const scale1 = 1 + Math.sin(time * 2) * 0.1;
        
        blob1.current.style.transform = `translate(${x1}px, ${y1}px) scale(${scale1})`;

        // Blob 2: Противоположное движение + реакция на курсор
        const x2 = Math.cos(time * 1.1) * 150 - (mouse.current.x - window.innerWidth / 2) * 0.08;
        const y2 = Math.sin(time * 0.9) * 150 - (mouse.current.y - window.innerHeight / 2) * 0.08;
        const scale2 = 1 + Math.cos(time * 1.5) * 0.15;

        blob2.current.style.transform = `translate(${x2}px, ${y2}px) scale(${scale2})`;

        // Blob 3: Хаотичное спокойное движение + слабая реакция
        const x3 = Math.sin(time * 0.8) * 80 + Math.cos(time * 2) * 40 + (mouse.current.x - window.innerWidth / 2) * 0.03;
        const y3 = Math.cos(time * 1.3) * 80 + Math.sin(time * 1.5) * 40 + (mouse.current.y - window.innerHeight / 2) * 0.03;
        
        blob3.current.style.transform = `translate(${x3}px, ${y3}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const renderSection = () => {
    if (activeTab === 'chat') return <ChatSection />;
    if (activeTab === 'diary') return <DiarySection />;
    if (activeTab === 'breathing') return <BreathingSection />;
    return <CrisisSection />;
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white relative overflow-hidden">
      
      {/* --- ГИПНОТИЧЕСКИЙ ФОН (NEW GEN EFFECT) --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Подложка для глубины */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,10,20,0),rgba(5,6,10,1))]" />

        {/* Blob 1 - Основной фиолетовый */}
        <div 
          ref={blob1}
          className="absolute top-1/4 left-1/3 h-[60vw] w-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-600/30 blur-[80px] transition-transform duration-100 ease-out"
          style={{ mixBlendMode: 'screen', willChange: 'transform' }}
        />

        {/* Blob 2 - Бирюзовый контраст */}
        <div 
          ref={blob2}
          className="absolute bottom-1/4 right-1/4 h-[50vw] w-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-cyan-500/20 blur-[80px] transition-transform duration-100 ease-out"
          style={{ mixBlendMode: 'screen', willChange: 'transform' }}
        />

        {/* Blob 3 - Призрачный розовый */}
        <div 
          ref={blob3}
          className="absolute top-1/2 left-1/2 h-[40vw] w-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-fuchsia-600/20 blur-[80px] transition-transform duration-100 ease-out"
          style={{ mixBlendMode: 'screen', willChange: 'transform' }}
        />

        {/* Зернистость (Noise) для текстуры "Люкс" */}
        <div className="absolute inset-0 opacity-[0.15]" style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat'
          }} 
        />
      </div>

      {/* --- UI LAYER --- */}
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
