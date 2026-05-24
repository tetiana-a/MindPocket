'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';

type MusicPlayerProps = {
  onBassChange?: (level: number) => void;
};

const tracks = [
  { id: 1, name: 'Rain on Glass', artist: 'Ambient', src: '/music/rain.mp3' },
  { id: 2, name: 'Ocean Waves', artist: 'Nature', src: '/music/ocean.mp3' },
  { id: 3, name: 'Deep Focus', artist: 'Lo-Fi', src: '/music/deep.mp3' },
];

export function MusicPlayer({ onBassChange }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frameRef = useRef<number | null>(null);

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const track = tracks[currentTrack];

  const setupAudioAnalysis = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;

      const source = audioContext.createMediaElementSource(audio);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }
  };

  const startBassLoop = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);

      const bassBins = dataArray.slice(0, 10);
      const bassAverage =
        bassBins.reduce((sum, value) => sum + value, 0) / bassBins.length;

      const bassLevel = Math.min(bassAverage / 180, 1);

      onBassChange?.(bassLevel);

      frameRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  const stopBassLoop = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    onBassChange?.(0);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      setupAudioAnalysis();

      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        stopBassLoop();
      } else {
        await audio.play();
        setIsPlaying(true);
        startBassLoop();
      }
    } catch (error) {
      console.log('Audio play blocked:', error);
      setIsPlaying(false);
      stopBassLoop();
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        stopBassLoop();
      });
    }
  }, [currentTrack]);

  useEffect(() => {
    return () => stopBassLoop();
  }, []);

  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        crossOrigin="anonymous"
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          if (!audio.duration) return;
          setProgress((audio.currentTime / audio.duration) * 100);
        }}
        onEnded={nextTrack}
      />

      <div className="glass rounded-2xl p-4">
        <div className="w-full h-[3px] bg-white/[0.08] rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-white/60 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-end gap-[2px] h-5 w-8 flex-shrink-0">
            {isPlaying ? (
              <>
                <div className="w-[3px] bg-white/60 rounded-full music-bar" />
                <div className="w-[3px] bg-white/60 rounded-full music-bar" />
                <div className="w-[3px] bg-white/60 rounded-full music-bar" />
                <div className="w-[3px] bg-white/60 rounded-full music-bar" />
                <div className="w-[3px] bg-white/60 rounded-full music-bar" />
              </>
            ) : (
              <Music className="w-5 h-5 text-white/35" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/80 truncate">{track.name}</p>
            <p className="text-[10px] text-white/35">{track.artist}</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={prevTrack} className="text-white/35 hover:text-white/70">
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button onClick={nextTrack} className="text-white/35 hover:text-white/70">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
