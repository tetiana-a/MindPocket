'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Wind, Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete';

const exercises = [
  {
    id: '4-7-8',
    name: 'Расслабление 4-7-8',
    description: 'Вдох 4 секунды, задержка 7 секунд, выдох 8 секунд. Классическая техника для расслабления и засыпания.',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4,
    color: 'from-teal-400 to-emerald-500',
  },
  {
    id: 'box',
    name: 'Квадратное дыхание',
    description: 'Вдох 4 секунды, задержка 4 секунды, выдох 4 секунды, задержка 4 секунды. Помогает сосредоточиться.',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    cycles: 6,
    color: 'from-cyan-400 to-teal-500',
  },
  {
    id: 'calm',
    name: 'Спокойное дыхание',
    description: 'Вдох 5 секунд, выдох 5 секунд. Простая техника для повседневного использования.',
    inhale: 5,
    hold: 0,
    exhale: 5,
    cycles: 8,
    color: 'from-emerald-400 to-green-500',
  },
];

type ExerciseType = {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfter?: number;
  cycles: number;
  color: string;
};

type Exercise = ExerciseType;

export function BreathingSection() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<Phase>('idle');

  const stopExercise = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPhase('idle');
    setCountdown(0);
    setCycle(0);
    setTotalTime(0);
    phaseRef.current = 'idle';
  }, []);

  const runExercise = useCallback((exercise: Exercise) => {
    stopExercise();
    setPhase('inhale');
    phaseRef.current = 'inhale';
    setCountdown(exercise.inhale);
    setCycle(1);
    setTotalTime(0);

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
        // Transition to next phase
        if (currentPhase === 'inhale') {
          if (exercise.hold > 0) {
            currentPhase = 'hold';
            currentCountdown = exercise.hold;
          } else {
            currentPhase = 'exhale';
            currentCountdown = exercise.exhale;
          }
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale';
          currentCountdown = exercise.exhale;
        } else if (currentPhase === 'exhale') {
          if (exercise.holdAfter && exercise.holdAfter > 0) {
            currentPhase = 'holdAfter' as Phase;
            currentCountdown = exercise.holdAfter;
          } else if (currentCycle >= exercise.cycles) {
            currentPhase = 'complete';
          } else {
            currentPhase = 'inhale';
            currentCycle++;
            setCycle(currentCycle);
            currentCountdown = exercise.inhale;
          }
        } else if (currentPhase === ('holdAfter' as Phase)) {
          if (currentCycle >= exercise.cycles) {
            currentPhase = 'complete';
          } else {
            currentPhase = 'inhale';
            currentCycle++;
            setCycle(currentCycle);
            currentCountdown = exercise.inhale;
          }
        }

        if (currentPhase === 'complete') {
          setPhase('complete');
          phaseRef.current = 'complete';
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          setPhase(currentPhase);
          phaseRef.current = currentPhase;
          setCountdown(currentCountdown);
        }
      }
    }, 1000);
  }, [stopExercise]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const phaseText: Record<Phase, string> = {
    idle: 'Выберите упражнение',
    inhale: 'Вдохните',
    hold: 'Задержите дыхание',
    exhale: 'Выдохните',
    complete: 'Отлично!',
    holdAfter: 'Задержите дыхание',
  };

  const getCircleSize = () => {
    if (phase === 'inhale') {
      const progress = selectedExercise
        ? 1 - countdown / selectedExercise.inhale
        : 0;
      return 0.6 + progress * 0.4;
    }
    if (phase === 'exhale') {
      const progress = selectedExercise
        ? 1 - countdown / selectedExercise.exhale
        : 0;
      return 1 - progress * 0.4;
    }
    if (phase === 'hold' || phase === ('holdAfter' as Phase)) {
      return 1;
    }
    if (phase === 'complete') {
      return 0.8;
    }
    return 0.6;
  };

  return (
    <div className="space-y-6">
      {/* Exercise Selection */}
      {!selectedExercise && (
        <div className="space-y-3">
          <div className="text-center space-y-2 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400/20 to-emerald-500/20 flex items-center justify-center mx-auto">
              <Wind className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Дыхательные упражнения</h2>
            <p className="text-sm text-muted-foreground">
              Правильное дыхание помогает снять стресс и тревогу
            </p>
          </div>

          {exercises.map((exercise) => (
            <Card
              key={exercise.id}
              className="border-border/50 cursor-pointer hover:border-primary/30 transition-all duration-200 hover:shadow-md"
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exercise.color} flex items-center justify-center flex-shrink-0`}>
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{exercise.description}</p>
                </div>
                <Play className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Active Exercise */}
      {selectedExercise && (
        <div className="flex flex-col items-center gap-6">
          {/* Back button */}
          <div className="w-full flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={stopExercise}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Назад
            </Button>
            <span className="text-sm text-muted-foreground">
              Цикл {cycle} / {selectedExercise.cycles}
            </span>
          </div>

          {/* Breathing Circle */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-full bg-primary/5 transition-transform duration-1000 ease-in-out"
              style={{ transform: `scale(${getCircleSize() + 0.1})` }}
            />
            {/* Main circle */}
            <div
              className="relative w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out shadow-lg"
              style={{ transform: `scale(${getCircleSize()})` }}
            >
              {phase === 'complete' ? (
                <>
                  <span className="text-4xl mb-1">🎉</span>
                  <span className="text-lg font-bold text-primary">Отлично!</span>
                </>
              ) : phase === 'idle' ? (
                <>
                  <Wind className="w-10 h-10 text-primary/50" />
                </>
              ) : (
                <>
                  <span className="text-4xl font-bold text-primary">{countdown}</span>
                  <span className="text-sm text-primary/70 mt-1">{phaseText[phase]}</span>
                </>
              )}
            </div>
          </div>

          {/* Phase indicator */}
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-foreground">{selectedExercise.name}</h3>
            <p className="text-sm text-muted-foreground">
              {phase === 'idle'
                ? 'Нажмите Start чтобы начать'
                : phase === 'complete'
                ? 'Упражнение завершено! Вы отлично справились.'
                : phaseText[phase]}
            </p>
          </div>

          {/* Timer */}
          {totalTime > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            {phase === 'idle' || phase === 'complete' ? (
              <Button
                onClick={() => runExercise(selectedExercise)}
                className="rounded-xl bg-primary hover:bg-primary/90 gap-2 px-8 h-12"
              >
                <Play className="w-4 h-4" />
                {phase === 'complete' ? 'Повторить' : 'Начать'}
              </Button>
            ) : (
              <>
                <Button
                  onClick={stopExercise}
                  variant="outline"
                  className="rounded-xl gap-2 h-12"
                >
                  <Pause className="w-4 h-4" />
                  Стоп
                </Button>
                <Button
                  onClick={() => runExercise(selectedExercise)}
                  variant="outline"
                  className="rounded-xl gap-2 h-12"
                >
                  <RotateCcw className="w-4 h-4" />
                  Заново
                </Button>
              </>
            )}
          </div>

          {/* Exercise info */}
          <Card className="w-full border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{selectedExercise.description}</p>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-primary">Вдох: {selectedExercise.inhale}с</span>
                {selectedExercise.hold > 0 && (
                  <span className="text-primary">Задержка: {selectedExercise.hold}с</span>
                )}
                <span className="text-primary">Выдох: {selectedExercise.exhale}с</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
