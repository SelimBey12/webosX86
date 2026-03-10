import React, { useState, useEffect } from 'react';
import { Window } from '../components/Window';
import { Bomb, Flag, Smile, Frown } from 'lucide-react';

export const MinesweeperApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [grid, setGrid] = useState<any[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [minesLeft, setMinesLeft] = useState(10);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const rows = 9;
  const cols = 9;
  const mines = 10;

  const initGrid = () => {
    let newGrid = Array(rows).fill(null).map(() => Array(cols).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0
    })));

    // Place mines
    let placed = 0;
    while (placed < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
                if (newGrid[r + i][c + j].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setMinesLeft(mines);
    setTime(0);
    setTimerActive(false);
  };

  useEffect(() => {
    initGrid();
  }, []);

  useEffect(() => {
    let interval: any;
    if (timerActive && !gameOver && !win) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameOver, win]);

  const reveal = (r: number, c: number) => {
    if (gameOver || win || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    if (!timerActive) setTimerActive(true);

    const newGrid = [...grid];
    
    if (newGrid[r][c].isMine) {
      // Game Over
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (newGrid[i][j].isMine) newGrid[i][j].isRevealed = true;
        }
      }
      setGrid(newGrid);
      setGameOver(true);
      setTimerActive(false);
      return;
    }

    const floodFill = (r: number, c: number) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols || newGrid[r][c].isRevealed || newGrid[r][c].isFlagged) return;
      newGrid[r][c].isRevealed = true;
      if (newGrid[r][c].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            floodFill(r + i, c + j);
          }
        }
      }
    };

    floodFill(r, c);
    setGrid(newGrid);

    // Check win
    let unrevealedSafe = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newGrid[i][j].isRevealed && !newGrid[i][j].isMine) unrevealedSafe++;
      }
    }
    if (unrevealedSafe === 0) {
      setWin(true);
      setTimerActive(false);
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].isRevealed) return;

    const newGrid = [...grid];
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
    setMinesLeft(prev => newGrid[r][c].isFlagged ? prev - 1 : prev + 1);
  };

  const colors = ['text-transparent', 'text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500', 'text-amber-500', 'text-cyan-500', 'text-black', 'text-gray-500'];

  return (
    <Window id={windowId} title="Minesweeper" icon={<Bomb size={14} />} defaultWidth={320} defaultHeight={400} resizable={false}>
      <div className="flex flex-col h-full bg-[#c0c0c0] p-4 select-none">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-500 p-2 mb-4">
          <div className="bg-black text-red-500 font-mono text-2xl px-2 w-16 text-right">
            {minesLeft.toString().padStart(3, '0')}
          </div>
          <button 
            className="w-10 h-10 flex items-center justify-center bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-500 active:border-t-gray-500 active:border-l-gray-500 active:border-b-white active:border-r-white"
            onClick={initGrid}
          >
            {gameOver ? <Frown size={24} className="text-yellow-500 fill-yellow-500" /> : <Smile size={24} className="text-yellow-500 fill-yellow-500" />}
          </button>
          <div className="bg-black text-red-500 font-mono text-2xl px-2 w-16 text-right">
            {time.toString().padStart(3, '0')}
          </div>
        </div>

        {/* Grid */}
        <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-gray-500 border-b-2 border-r-2 border-white flex-1 flex items-center justify-center">
          <div className="grid grid-cols-9 gap-0 border border-gray-400">
            {grid.map((row, r) => row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-7 h-7 flex items-center justify-center font-bold text-lg cursor-default ${
                  cell.isRevealed 
                    ? 'bg-[#c0c0c0] border border-gray-400' 
                    : 'bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-500 hover:bg-[#d0d0d0]'
                } ${cell.isRevealed && cell.isMine ? 'bg-red-500' : ''}`}
                onClick={() => reveal(r, c)}
                onContextMenu={(e) => toggleFlag(e, r, c)}
              >
                {cell.isRevealed ? (
                  cell.isMine ? <Bomb size={16} /> : (cell.neighborMines > 0 ? <span className={colors[cell.neighborMines]}>{cell.neighborMines}</span> : '')
                ) : (
                  cell.isFlagged ? <Flag size={16} className="text-red-500 fill-red-500" /> : ''
                )}
              </div>
            )))}
          </div>
        </div>
      </div>
    </Window>
  );
};
