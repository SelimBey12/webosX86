import React, { useState } from 'react';
import { Window } from '../components/Window';
import { Square } from 'lucide-react';

export const MinecraftApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [inGame, setInGame] = useState(false);

  return (
    <Window id={windowId} title="Minecraft 0.6 beta" icon={<Square size={14} />} defaultWidth={640} defaultHeight={480}>
      <div className="flex flex-col h-full bg-[#808080] text-white font-mono items-center justify-center relative overflow-hidden">
        {/* Dirt Background Pattern */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"32\\" height=\\"32\\" viewBox=\\"0 0 32 32\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cpath d=\\"M0 0h16v16H0V0zm16 16h16v16H16V16z\\" fill=\\"%235c4033\\"/%3E%3Cpath d=\\"M16 0h16v16H16V0zM0 16h16v16H0V16z\\" fill=\\"%234a332a\\"/%3E%3C/svg%3E")',
            imageRendering: 'pixelated'
          }}
        />
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-md">
          <h1 className="text-4xl font-bold mb-12 text-center text-[#c0c0c0] drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
            MINECRAFT
            <div className="text-sm text-yellow-400 mt-2 animate-pulse">0.6 beta</div>
          </h1>

          {!inGame ? (
            <div className="flex flex-col gap-4 w-full px-8">
              <button 
                className="w-full py-3 bg-[#808080] border-4 border-t-[#c0c0c0] border-l-[#c0c0c0] border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-[#c0c0c0] active:border-r-[#c0c0c0] font-bold text-xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)]"
                onClick={() => setInGame(true)}
              >
                Singleplayer
              </button>
              <button 
                className="w-full py-3 bg-[#808080] border-4 border-t-[#c0c0c0] border-l-[#c0c0c0] border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-[#c0c0c0] active:border-r-[#c0c0c0] font-bold text-xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-[#a0a0a0]"
              >
                Multiplayer
              </button>
              <button 
                className="w-full py-3 bg-[#808080] border-4 border-t-[#c0c0c0] border-l-[#c0c0c0] border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-[#c0c0c0] active:border-r-[#c0c0c0] font-bold text-xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)]"
              >
                Options...
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Generating level...</h2>
              <div className="w-64 h-4 border-2 border-[#404040] bg-[#000000] p-0.5">
                <div className="h-full bg-[#00ff00] w-1/3" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};
