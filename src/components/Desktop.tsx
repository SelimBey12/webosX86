import React, { useState } from 'react';
import { useOS } from '../store/osStore';
import { Terminal, Folder, FileCode2, Cpu, Calculator, Bomb, Settings, Globe, MonitorPlay, Binary, Code, Box, Square } from 'lucide-react';
import { AppId } from '../types';

export const appIcons: Record<AppId, React.ReactNode> = {
  terminal: <Terminal size={24} className="text-white" />,
  explorer: <Folder size={24} className="text-[#ffff00]" />,
  editor: <FileCode2 size={24} className="text-[#00ffff]" />,
  emulator: <MonitorPlay size={24} className="text-[#ff00ff]" />,
  calculator: <Calculator size={24} className="text-[#00ff00]" />,
  minesweeper: <Bomb size={24} className="text-[#ff0000]" />,
  monitor: <Cpu size={24} className="text-[#00ffff]" />,
  browser: <Globe size={24} className="text-[#0000ff]" />,
  settings: <Settings size={24} className="text-[#c0c0c0]" />,
  kernel: <Cpu size={24} className="text-[#000080]" />,
  dos: <Terminal size={24} className="text-[#ffffff]" />,
  qemu: <MonitorPlay size={24} className="text-[#ff00ff]" />,
  ide: <FileCode2 size={24} className="text-[#00ffff]" />,
  hexeditor: <Binary size={24} className="text-[#ffff00]" />,
  visualstudio: <Code size={24} className="text-[#0000ff]" />,
  blender: <Box size={24} className="text-[#ff8000]" />,
  minecraft: <Square size={24} className="text-[#008000]" />,
  update: <Settings size={24} className="text-[#c0c0c0]" />,
};

export const appNames: Record<AppId, string> = {
  terminal: 'Terminal',
  explorer: 'File Explorer',
  editor: 'Code Editor',
  emulator: 'x86 Emulator',
  calculator: 'Calculator',
  minesweeper: 'Minesweeper',
  monitor: 'System Monitor',
  browser: 'Web Browser',
  settings: 'Settings',
  kernel: 'x86 Kernel',
  dos: 'MS-DOS',
  qemu: 'QEMU Emulator',
  ide: 'C/ASM IDE',
  hexeditor: 'Hex Editor',
  visualstudio: 'Visual Studio',
  blender: 'Blender 1.0',
  minecraft: 'Minecraft 0.6',
  update: 'System Update',
};

export const Desktop: React.FC = () => {
  const { state, dispatch } = useOS();
  const [selection, setSelection] = useState<{startX: number, startY: number, endX: number, endY: number} | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 2) return; // Right click handled by onContextMenu
    if (e.target === e.currentTarget) {
      setIsSelecting(true);
      setSelection({ startX: e.clientX, startY: e.clientY, endX: e.clientX, endY: e.clientY });
      dispatch({ type: 'CLOSE_START_MENU' });
      dispatch({ type: 'CLOSE_CONTEXT_MENU' });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isSelecting && selection) {
      setSelection({ ...selection, endX: e.clientX, endY: e.clientY });
    }
  };

  const handlePointerUp = () => {
    setIsSelecting(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      dispatch({ type: 'OPEN_CONTEXT_MENU', payload: { x: e.clientX, y: e.clientY, type: 'desktop' } });
    }
  };

  const desktopApps: AppId[] = ['kernel', 'dos', 'qemu', 'ide', 'hexeditor', 'visualstudio', 'blender', 'minecraft', 'emulator', 'terminal', 'explorer', 'editor', 'browser', 'minesweeper'];

  const getSelectionBox = () => {
    if (!selection) return null;
    const left = Math.min(selection.startX, selection.endX);
    const top = Math.min(selection.startY, selection.endY);
    const width = Math.abs(selection.startX - selection.endX);
    const height = Math.abs(selection.startY - selection.endY);
    return { left, top, width, height };
  };

  const box = getSelectionBox();

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden bg-[#008080]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
    >
      <div className="relative z-10 p-4 flex flex-col gap-4 flex-wrap h-[calc(100%-32px)] content-start">
        {desktopApps.map(appId => (
          <div 
            key={appId}
            className="flex flex-col items-center gap-1 w-20 p-2 cursor-pointer group"
            onDoubleClick={() => dispatch({ type: 'OPEN_APP', appId })}
          >
            <div className="w-10 h-10 flex items-center justify-center text-white drop-shadow-md">
              {appIcons[appId]}
            </div>
            <span className="text-xs text-white font-bold text-center px-1 bg-[#000080] group-hover:bg-[#0000aa] border border-transparent group-hover:border-white border-dotted">
              {appNames[appId]}
            </span>
          </div>
        ))}
      </div>
      
      {isSelecting && box && (
        <div 
          className="absolute border border-white bg-blue-500/30 pointer-events-none z-20"
          style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
        />
      )}
    </div>
  );
};
