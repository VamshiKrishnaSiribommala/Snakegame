/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [shouldAutoPlay, setShouldAutoPlay] = React.useState(false);

  const handleGameStart = () => {
    setShouldAutoPlay(true);
  };

  return (
    <div className="min-h-screen bg-dark-void relative overflow-hidden flex flex-col items-center">
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
        <div className="scanline" />
      </div>

      <main className="relative z-10 w-full max-w-6xl px-4 py-8 flex flex-col items-center gap-12">
        {/* Machine Header */}
        <motion.header 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full text-center border-b border-neon-cyan/20 pb-8 screen-tear"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="text-neon-cyan/40 bg-neon-cyan/5 px-2 py-0.5 border border-neon-cyan/20 text-[12px] animate-pulse">
              SIGNAL: STABLE
            </span>
            <span className="text-neon-magenta/40 bg-neon-magenta/5 px-2 py-0.5 border border-neon-magenta/20 text-[12px]">
              ENCRYPTION: ACTIVE
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-[0.2em] text-white selection:bg-neon-magenta selection:text-white uppercase leading-none">
            <span className="text-glitch inline-block">NEON</span>
            <span className="text-neon-magenta glitch-text-alt ml-4">VOID</span>
          </h1>
          
          <div className="mt-4 flex justify-center gap-8 text-[14px] text-neon-cyan/60 font-mono uppercase tracking-[0.5em]">
            <span>[ RHYTHM_CORE ]</span>
            <span>[ DATA_SNAKE ]</span>
          </div>
        </motion.header>

        {/* Tactical Grid Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">
          
          {/* Left Panel: Audio Interface */}
          <motion.section 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/30">
              <h2 className="text-[12px] uppercase tracking-[0.3em] mb-4 text-neon-cyan/50 flex justify-between">
                <span>Audio_Subsystem</span>
                <span>0x001A</span>
              </h2>
              <MusicPlayer forcePlay={shouldAutoPlay} />
            </div>

            <div className="p-4 bg-neon-magenta/5 border border-neon-magenta/30 font-mono text-[11px] leading-tight space-y-2">
              <p className="text-neon-magenta/70 uppercase tracking-widest">[ USER_INTEL ]</p>
              <p className="text-white/40">OPERATOR MUST CONSUME PULSING DATA ORBS TO MAINTAIN SIGNAL SYNC.</p>
              <p className="text-white/40">USE ARROW ARRAYS FOR VECTOR DIRECTIONAL RE-ROUTING.</p>
              <div className="pt-2 flex gap-4">
                <div className="flex-1 h-1 bg-neon-magenta/20 overflow-hidden">
                  <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-1/2 h-full bg-neon-magenta" />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Center Activity: Grid Simulation */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-black/40 border border-white/5 p-6 backdrop-blur-md relative overflow-hidden"
          >
            {/* Simulation Artifacts */}
            <div className="absolute top-0 right-0 p-2 text-[10px] text-neon-cyan/20 pointer-events-none">
              LATENCY: 12ms<br/>
              PACKETS: 100%
            </div>
            
            <SnakeGame onStart={handleGameStart} />
          </motion.section>
        </div>

        {/* Machine Logs (Footer) */}
        <footer className="w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-neon-cyan/10 text-[11px] font-mono uppercase tracking-[0.2em] text-neon-cyan/30">
          <div className="space-y-1">
            <p className="text-white/60">[ SYSTEM_BUILD ]</p>
            <p>Vite_Reactor: 6.2.3</p>
            <p>React_Kernel: 19.0.1</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center gap-2">
            <div className="flex gap-4">
              <span className="hover:text-neon-magenta cursor-glitch transition-colors">[ REBOOT ]</span>
              <span className="hover:text-neon-cyan cursor-glitch transition-colors">[ DUMP_CORE ]</span>
            </div>
            <p className="text-[10px] opacity-50">ERROR_LOG: EMPTY</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-white/60">[ COPYRIGHT_VOID ]</p>
            <p>© 2026_NEON_VOID_LTD</p>
            <p>AUTH: OPERATOR_8843</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

