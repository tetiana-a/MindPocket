'use client';

import { useState } from 'react';
import { MessageCircle, BookHeart, Wind, Phone, Brain, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatSection } from '@/components/chat-section';
import { DiarySection } from '@/components/diary-section';
import { BreathingSection } from '@/components/breathing-section';
import { CrisisSection } from '@/components/crisis-section';

const tabs = [
  { id: 'chat', label: 'Чат', icon: MessageCircle, description: 'Поговори с ИИ-психологом' },
  { id: 'diary', label: 'Дневник', icon: BookHeart, description: 'Записывай эмоции' },
  { id: 'breathing', label: 'Дыхание', icon: Wind, description: 'Упражнения для релаксации' },
  { id: 'crisis', label: 'Помощь', icon: Phone, description: 'Экстренные контакты' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderSection = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatSection />;
      case 'diary':
        return <DiarySection />;
      case 'breathing':
        return <BreathingSection />;
      case 'crisis':
        return <CrisisSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-md">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Психолог</h1>
              <p className="text-xs text-muted-foreground">Твоя поддержка каждый день</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`gap-2 transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border bg-background px-4 py-2 flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`justify-start gap-3 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-xs opacity-70">{tab.description}</div>
                  </div>
                </Button>
              );
            })}
          </nav>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around py-1 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-24 md:pb-6">
        {renderSection()}
      </main>

      {/* Footer */}
      <footer className="hidden md:block border-t border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">
            Это приложение не заменяет профессиональную психологическую помощь. Если вам нужна срочная поддержка — обратитесь на горячую линию.
          </p>
        </div>
      </footer>
    </div>
  );
}
