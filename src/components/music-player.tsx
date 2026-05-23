'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';

const tracks = [
  { id: 1, name: 'Rain on Glass', artist: 'Ambient', color: '#fff' },
  { id: 2, name: 'Ocean Waves', artist: 'Nature', color: '#fff' },
  { id: 3, name: 'Piano Dreams', artist: 'Classical', color: '#fff' },
  { id: 4, name: 'Forest Morning', artist: 'Nature', color: '#fff' },
  { id: 5, name: 'Deep Focus', artist: 'Lo-Fi', color: '#fff' },
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrack(prev => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            nextTrack();
            return 0;
          }
          return prev + 0.3;
        });
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying]);

  const track = tracks[currentTrack];

  return (
    <div className="animate-slide-up border-b border-white/[0.06]">
      <div className="max-w-lg mx-auto px-5 py-4">
        <div className="glass rounded-2xl p-4">
          {/* Progress bar */}
          <div className="w-full h-[2px] bg-white/[0.06] rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-white/30 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Track info & controls */}
          <div className="flex items-center gap-4">
            {/* Visualizer */}
            <div className="flex items-end gap-[2px] h-5 w-8 flex-shrink-0">
              {isPlaying ? (
                <>
                  <div className="w-[3px] bg-white/40 rounded-full music-bar" style={{ height: '4px' }} />
                  <div className="w-[3px] bg-white/40 rounded-full music-bar" style={{ height: '4px' }} />
                  <div className="w-[3px] bg-white/40 rounded-full music-bar" style={{ height: '4px' }} />
                  <div className="w-[3px] bg-white/40 rounded-full music-bar" style={{ height: '4px' }} />
                  <div className="w-[3px] bg-white/40 rounded-full music-bar" style={{ height: '4px' }} />
                </>
              ) : (
                <Music className="w-5 h-5 text-white/20" />
              )}
            </div>

            {/* Track name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/70 truncate">{track.name}</p>
              <p className="text-[10px] text-white/25">{track.artist}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button onClick={prevTrack} className="text-white/20 hover:text-white/50 transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/[0.15] transition-all duration-300"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-white/60" /> : <Play className="w-4 h-4 text-white/60 ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="text-white/20 hover:text-white/50 transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Track list */}
          <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-1">
            {tracks.map((t, i) => (
              <button
                key={t.id}
                onClick={() => { setCurrentTrack(i); setProgress(0); setIsPlaying(true); }}
                className={`w-full text-left px-2 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  i === currentTrack ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className={`w-1 h-1 rounded-full ${i === currentTrack ? 'bg-white/60' : 'bg-white/15'}`} />
                <span className={`text-xs ${i === currentTrack ? 'text-white/60' : 'text-white/25'}`}>{t.name}</span>
                <span className="text-[9px] text-white/15 ml-auto">{t.artist}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
