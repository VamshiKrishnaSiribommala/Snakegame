import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Zap, Activity } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

interface MusicPlayerProps {
  forcePlay?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ forcePlay }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (forcePlay && !isPlaying) {
      setIsPlaying(true);
    }
  }, [forcePlay]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Signal Interrupted:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 p-4 border border-neon-cyan/20 bg-black/40 backdrop-blur-md">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />
      
      <div className="relative aspect-video bg-black border border-neon-cyan/10 overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.6, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover filter grayscale sepia hue-rotate-[180deg] brightness-125"
          />
        </AnimatePresence>
        
        {/* Signal Visualizer */}
        <div className="absolute inset-x-0 bottom-0 h-16 flex items-end justify-between gap-px px-2">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: isPlaying ? [10, Math.random() * 50 + 10, 10] : 4,
                backgroundColor: isPlaying ? (i % 2 === 0 ? '#00f2ff' : '#ff00ff') : '#333'
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                delay: i * 0.05
              }}
              className="flex-1"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-white tracking-widest uppercase text-glitch">
              {currentTrack.title}
            </h3>
            <p className="text-neon-cyan/60 text-[12px] uppercase tracking-widest">
              [ ARTIST: {currentTrack.artist} ]
            </p>
          </div>
          <Activity className="text-neon-cyan/40 w-5 h-5 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <div className="h-1 w-full bg-white/5 relative overflow-hidden">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-neon-magenta shadow-[0_0_10px_#ff00ff]"
            />
          </div>
          <div className="flex justify-between text-[11px] text-white/30 uppercase tracking-[0.2em]">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-12 pt-2">
        <button onClick={handlePrev} className="text-neon-cyan/40 hover:text-white transition-colors">
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 flex items-center justify-center border border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,255,0.2)]"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>
        <button onClick={handleNext} className="text-neon-cyan/40 hover:text-white transition-colors">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex justify-center gap-4 text-[10px] text-neon-cyan/20">
        <div className="flex items-center gap-1"><Zap className="w-3 h-3" /> PWR: 100%</div>
        <div className="flex items-center gap-1"><Activity className="w-3 h-3" /> FRQ: 44.1kHz</div>
      </div>
    </div>
  );
};
