import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

interface SnakeGameProps {
  onStart?: () => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);
  
  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snake.some(segment => segment.x === newFood?.x && segment.y === newFood?.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood());
    onStart?.();
  };

  const resumeGame = () => {
    setIsPaused(false);
    onStart?.();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!gameOver) setIsPaused(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        if (prev.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, Math.max(80, BASE_SPEED - Math.floor(score / 50) * 10));
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, score, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0, 242, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cellSize); ctx.lineTo(canvas.width, i * cellSize); ctx.stroke();
    }

    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#ff00ff' : '#00f2ff';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });

    ctx.fillStyle = '#00f2ff';
    ctx.beginPath();
    ctx.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
    ctx.fill();

  }, [snake, food]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 screen-tear">
      <div className="bg-black border border-neon-cyan/40 p-4 shadow-[0_0_30px_rgba(0,242,255,0.1)]">
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-neon-cyan/40 uppercase tracking-[0.4em]">SYNC_VALUE</span>
            <motion.span 
              key={score}
              className="text-4xl font-bold text-neon-cyan text-glitch"
            >
              {score.toString().padStart(4, '0')}
            </motion.span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-neon-magenta/40 uppercase tracking-[0.4em]">MAX_SIGNAL</span>
            <span className="text-xl text-neon-magenta/60">
              {highScore.toString().padStart(4, '0')}
            </span>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-2 bg-neon-cyan/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="relative z-10 border border-neon-cyan/20 cursor-crosshair"
          />

          <AnimatePresence>
            {(gameOver || isPaused) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 backdrop-blur-sm"
              >
                <div className="text-center p-8 border border-white/20 bg-dark-void">
                  {gameOver ? (
                    <>
                      <h2 className="text-4xl font-bold text-neon-magenta mb-2 tracking-widest text-glitch uppercase">SYSTEM_CRASH</h2>
                      <p className="text-white/40 mb-8 text-[12px] uppercase tracking-widest">DATA_CORRUPTION_DETECTED</p>
                      <button
                        onClick={resetGame}
                        className="flex items-center gap-3 px-8 py-3 bg-neon-magenta text-white font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
                      >
                        <RefreshCcw className="w-5 h-5" />
                        REBOOT
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-4xl font-bold text-neon-cyan mb-8 tracking-widest uppercase text-glitch">SIGNAL_PAUSED</h2>
                      <button
                        onClick={resumeGame}
                        className="flex items-center gap-3 px-8 py-3 bg-neon-cyan text-black font-bold uppercase tracking-[0.2em] hover:bg-white transition-all"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        RESUME
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-6 text-neon-cyan/30 text-[11px] uppercase tracking-[0.4em]">
        <span>[ ARROWS: VECTOR ]</span>
        <span>[ SPACE: INTERRUPT ]</span>
      </div>
    </div>
  );
};
