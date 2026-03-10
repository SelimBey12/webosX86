import React, { useState, useEffect } from 'react';
import { useOS } from '../store/osStore';
import { appIcons } from './Desktop';
import { LayoutGrid, Network } from 'lucide-react';

export const Taskbar: React.FC = () => {
  const { state, dispatch } = useOS();
  const [time, setTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#c0c0c0] border-t-2 border-t-[#ffffff] flex items-center px-1 z-[9998] justify-between">
      <div className="flex items-center gap-1 h-full py-1">
        <button 
          className={`start-button px-2 h-full flex items-center justify-center gap-1 font-bold text-black border-2 ${state.startMenuOpen ? 'border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] bg-[#a0a0a0]' : 'border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080] bg-[#c0c0c0] active:border-t-[#808080] active:border-l-[#808080] active:border-b-[#ffffff] active:border-r-[#ffffff]'}`}
          onClick={() => dispatch({ type: 'TOGGLE_START_MENU' })}
        >
          <LayoutGrid size={14} className="text-black" />
          Start
        </button>

        <div className="w-px h-full bg-[#808080] mx-1 border-r border-[#ffffff]" />

        {/* Open Windows */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar h-full">
          {state.windows.map(win => {
            const isFocused = state.focusedWindowId === win.id && !win.isMinimized;
            return (
              <button
                key={win.id}
                className={`flex items-center gap-1 px-2 h-full min-w-[100px] max-w-[160px] border-2 text-black text-xs font-bold truncate ${
                  isFocused 
                    ? 'border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] bg-[#e0e0e0] pattern-dots' 
                    : 'border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080] bg-[#c0c0c0] active:border-t-[#808080] active:border-l-[#808080] active:border-b-[#ffffff] active:border-r-[#ffffff]'
                }`}
                onClick={() => {
                  if (isFocused) {
                    dispatch({ type: 'MINIMIZE_WINDOW', id: win.id });
                  } else {
                    dispatch({ type: 'FOCUS_WINDOW', id: win.id });
                  }
                }}
              >
                <div className="w-3 h-3 flex-shrink-0 flex items-center justify-center">
                  {React.cloneElement(appIcons[win.appId] as React.ReactElement, { size: 12 })}
                </div>
                <span className="truncate">{win.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1 h-6">
        <div className={`flex items-center justify-center px-1 h-full bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] ${isOnline ? 'text-black' : 'text-red-600'}`} title={isOnline ? 'Connected' : 'Disconnected'}>
          <Network size={14} />
        </div>
        <div className="flex items-center px-2 h-full bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] text-black text-xs">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
