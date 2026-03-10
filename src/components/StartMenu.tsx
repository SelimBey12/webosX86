import React, { useState } from 'react';
import { useOS } from '../store/osStore';
import { appIcons, appNames } from './Desktop';
import { AppId } from '../types';
import { Power, RefreshCw } from 'lucide-react';

export const StartMenu: React.FC = () => {
  const { state, dispatch } = useOS();

  if (!state.startMenuOpen) return null;

  const allApps: AppId[] = ['kernel', 'dos', 'emulator', 'qemu', 'visualstudio', 'ide', 'hexeditor', 'blender', 'minecraft', 'terminal', 'explorer', 'editor', 'browser', 'calculator', 'minesweeper', 'monitor', 'settings'];

  return (
    <div className="start-menu absolute bottom-8 left-0 w-64 bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] z-[9999] flex flex-col max-h-[80vh]">
      <div className="flex overflow-hidden">
        <div className="w-8 bg-[#000080] flex items-end justify-center pb-2 flex-shrink-0">
          <span className="text-[#c0c0c0] font-bold tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>WebOS x86</span>
        </div>
        <div className="flex-1 p-1 flex flex-col overflow-y-auto">
          {allApps.map(appId => (
            <button
              key={appId}
              className="flex items-center gap-3 p-2 hover:bg-[#000080] hover:text-white text-black transition-none text-sm font-bold"
              onClick={() => dispatch({ type: 'OPEN_APP', appId })}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {appIcons[appId]}
              </div>
              <span>{appNames[appId]}</span>
            </button>
          ))}
          <div className="h-px bg-[#808080] border-b border-[#ffffff] my-1 mx-1 flex-shrink-0" />
          <button 
            className="flex items-center gap-3 p-2 hover:bg-[#000080] hover:text-white text-black transition-none text-sm font-bold flex-shrink-0"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} />
            <span>Restart...</span>
          </button>
          <button 
            className="flex items-center gap-3 p-2 hover:bg-[#000080] hover:text-white text-black transition-none text-sm font-bold flex-shrink-0"
            onClick={() => window.location.reload()}
          >
            <Power size={16} />
            <span>Shut Down...</span>
          </button>
        </div>
      </div>
    </div>
  );
};
