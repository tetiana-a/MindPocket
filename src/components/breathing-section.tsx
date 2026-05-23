'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Wind, Play, Pause, RotateCcw, Clock, ArrowLeft } from 'lucide-react';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete';

type Exercise = {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfter?: number;
  cycles: number;
};

const exercises: Exercise[] = [
  {
    id: '4-7-8',
    name: '4-7-8',
    description: 'Nádech 4s, zadržet 7s, výdech 8s. Klasická technika pro uvolnění a usínání.',
    inhale: 4, hold: 7, exhale: 8, cycles: 4,
  },
  {
    id: 'box',
    name: 'Čtvercové',
    description: 'Nádech 4s, zadržet 4s, výdech 4s, zadržet 4s. Pomáhá soustředit se.',
    inhale: 4, hold: 4, exhale: 4, holdAfter: 4, cycles: 6,
  },
  {
    id: 'calm',
    name: 'Klidné',
    description: 'Nádech 5s, výdech 5s. Jednoduchá technika pro každodenní použití.',
    inhale: 5, hold: 0, exhale: 5, cycles: 8,
  },
];

export function BreathingSection() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopExercise = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setPhase('idle'); setCountdown(0); setCycle(0); setTotalTime(0);
  }, []);

  const runExercise = useCallback((exercise: Exercise) => {
    stopExercise();
    setPhase('inhale'); setCountdown(exercise.inhale); setCycle(1); setTotalTime(0);

    let currentPhase: Phase = 'inhale';
    let currentCountdown = exercise.inhale;
    let currentCycle = 1;
    let elapsed = 0;

    intervalRef.current = setInterval(() => {
      elapsed++;
      setTotalTime(elapsed);
      currentCountdown--;
      setCountdown(currentCountdown);

      if (currentCountdown <= 0) {
        if (currentPhase === 'inhale') {
          if (exercise.hold > 0) { currentPhase = 'hold'; currentCountdown = exercise.hold; }
          else { currentPhase = 'exhale'; currentCountdown = exercise.exhale; }
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale'; currentCountdown = exercise.exhale;
        } else if (currentPhase === 'exhale') {
          if (exercise.holdAfter && exercise.holdAfter > 0) {
            currentPhase = 'holdAfter' as Phase; currentCountdown = exercise.holdAfter;
          } else if (currentCycle >= exercise.cycles) { currentPhase = 'complete'; }
          else { currentPhase = 'inhale'; currentCycle++; setCycle(currentCycle); currentCountdown = exercise.inhale; }
        } else if (currentPhase === ('holdAfter' as Phase)) {
          if (currentCycle >= exercise.cycles) { currentPhase = 'complete'; }
          else { currentPhase = 'inhale'; currentCycle++; setCycle(currentCycle); currentCountdown = exercise.inhale; }
        }

        if (currentPhase === 'complete') {
          setPhase('complete');
          if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        } else {
          setPhase(currentPhase); setCountdown(currentCountdown);
        }
      }
    }, 1000);
  }, [stopExercise]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const phaseText: Record<string, string> = {
    idle: 'Vyberte cvičení',
    inhale: 'Nadechněte',
    hold: 'Zadržte',
    exhale: 'Vydechněte',
    complete: 'Skvělé',
    holdAfter: 'Zadržte',
  };

  const getScale = () => {
    if (phase === 'inhale') return 0.5 + (1 - countdown / (selectedExercise?.inhale || 4)) * 0.5;
    if (phase === 'exhale') return 1 - (1 - countdown / (selectedExercise?.exhale || 4)) * 0.5;
    if (phase === 'hold' || phase === 'holdAfter') return 1;
    if (phase === 'complete') return 0.7;
    return 0.5;
  };

  // Selection screen
  if (!selectedExercise) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-light tracking-tight">Dechová cvičení</h2>
          <p className="text-sm text-white/30">Správný dech pomáhá proti stresu</p>
        </div>

        <div className="space-y-3 stagger-children">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedExercise(ex)}
              className="w-full glass rounded-2xl p-5 text-left hover-lift transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-light tracking-tight">{ex.name}</h3>
                <Play className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
              <p className="text-xs text-white/30 leading-relaxed">{ex.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Active exercise
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Back */}
      <div className="w-full flex items-center justify-between">
        <button onClick={() => { stopExercise(); setSelectedExercise(null); }} className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wider uppercase">Zpět</span>
        </button>
        <span className="text-xs text-white/20">
          {cycle} / {selectedExercise.cycles}
        </span>
      </div>

      {/* Circle */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border border-white/[0.06] transition-transform duration-[1500ms] ease-in-out"
          style={{ transform: `scale(${getScale() + 0.15})` }}
        />
        {/* Glow */}
        <div
          className="absolute inset-2 rounded-full bg-white/[0.03] transition-transform duration-[1500ms] ease-in-out"
          style={{ transform: `scale(${getScale() + 0.05})` }}
        />
        {/* Main */}
        <div
          className="relative w-40 h-40 rounded-full border border-white/10 flex flex-col items-center justify-center transition-transform duration-[1500ms] ease-in-out"
          style={{ transform: `scale(${getScale()})` }}
        >
          {phase === 'complete' ? (
            <>
              <div className="w-3 h-3 rounded-full bg-white mb-2 animate-fade-in-scale" />
              <span className="text-sm text-white/50">{phaseText[phase]}</span>
            </>
          ) : phase === 'idle' ? (
            <Wind className="w-8 h-8 text-white/20" />
          ) : (
            <>
              <span className="text-5xl font-extralight tracking-tight">{countdown}</span>
              <span className="text-[10px] text-white/30 tracking-widest uppercase mt-1">{phaseText[phase]}</span>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="text-center space-y-1">
        <h3 className="text-lg font-light">{selectedExercise.name}</h3>
        <p className="text-xs text-white/25">
          {phase === 'idle' ? 'Klepněte pro začátek' : phase === 'complete' ? 'Cvičení dokončeno' : phaseText[phase]}
        </p>
      </div>

      {/* Timer */}
      {totalTime > 0 && (
        <div className="flex items-center gap-2 text-xs text-white/20">
          <Clock className="w-3 h-3" />
          {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {phase === 'idle' || phase === 'complete' ? (
          <button
            onClick={() => runExercise(selectedExercise)}
            className="h-12 px-10 rounded-full bg-white text-black font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4" />
            {phase === 'complete' ? 'Znovu' : 'Začít'}
          </button>
        ) : (
          <>
            <button onClick={stopExercise} className="h-12 px-6 rounded-full glass text-white/60 flex items-center gap-2 transition-all duration-300 hover:bg-white/10">
              <Pause className="w-4 h-4" /> Stop
            </button>
            <button onClick={() => runExercise(selectedExercise)} className="h-12 px-6 rounded-full glass text-white/60 flex items-center gap-2 transition-all duration-300 hover:bg-white/10">
              <RotateCcw className="w-4 h-4" /> Znovu
            </button>
          </>
        )}
      </div>

      {/* Exercise info */}
      <div className="w-full glass rounded-2xl p-4">
        <p className="text-xs text-white/25 leading-relaxed">{selectedExercise.description}</p>
        <div className="flex gap-4 mt-3 text-[10px] text-white/30 tracking-wider uppercase">
          <span>Nádech {selectedExercise.inhale}s</span>
          {selectedExercise.hold > 0 && <span>Zadržet {selectedExercise.hold}s</span>}
          <span>Výdech {selectedExercise.exhale}s</span>
        </div>
      </div>
    </div>
  );
}
