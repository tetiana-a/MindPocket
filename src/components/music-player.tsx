'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';

const tracks = [
  {
    id: 1,
    name: 'Rain on Glass',
    artist: 'Ambient',
    src: '/music/rain.mp3',
  },
  {
    id: 2,
    name: 'Ocean Waves',
    artist: 'Nature',
    src: '/music/ocean.mp3',
  },
  {
    id: 3,
    name: 'Deep Focus',
    artist: 'Lo-Fi',
    src: '/music/deep.mp3',
  },
];

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const track = tracks[currentTrack];

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

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Audio play blocked:', error);
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = 0.35;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.log('Audio play blocked:', error);
        setIsPlaying(false);
      });
    }
  }, [currentTrack]);

  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
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
            <button
              onClick={prevTrack}
              className="text-white/35 hover:text-white/70 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="text-white/35 hover:text-white/70 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1">
          {tracks.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTrack(index);
                setProgress(0);
                setIsPlaying(true);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                index === currentTrack
                  ? 'bg-white/[0.08]'
                  : 'hover:bg-white/[0.04]'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentTrack ? 'bg-white/70' : 'bg-white/20'
                }`}
              />

              <span
                className={`text-xs ${
                  index === currentTrack ? 'text-white/75' : 'text-white/35'
                }`}
              >
                {item.name}
              </span>

              <span className="text-[9px] text-white/20 ml-auto">
                {item.artist}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
