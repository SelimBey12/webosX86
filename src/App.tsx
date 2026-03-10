import React from 'react';
import { OSProvider, useOS } from './store/osStore';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { ContextMenu } from './components/ContextMenu';
import { BSOD } from './components/BSOD';
import { RetroCursor } from './components/RetroCursor';
import { TerminalApp } from './apps/Terminal';
import { FileExplorerApp } from './apps/FileExplorer';
import { EditorApp } from './apps/Editor';
import { EmulatorApp } from './apps/Emulator';
import { CalculatorApp } from './apps/Calculator';
import { MinesweeperApp } from './apps/Minesweeper';
import { SystemMonitorApp } from './apps/SystemMonitor';
import { BrowserApp } from './apps/Browser';
import { SettingsApp } from './apps/Settings';
import { KernelApp } from './apps/Kernel';
import { DOSApp } from './apps/DOS';
import { QEMUApp } from './apps/QEMU';
import { IDEApp } from './apps/IDE';
import { HexEditorApp } from './apps/HexEditor';
import { VisualStudioApp } from './apps/VisualStudio';
import { BlenderApp } from './apps/Blender';
import { MinecraftApp } from './apps/Minecraft';
import { SystemUpdateApp } from './apps/SystemUpdate';
import { AppId } from './types';

const AppRenderer: React.FC<{ windowId: string; appId: AppId; props?: any }> = ({ windowId, appId, props }) => {
  switch (appId) {
    case 'terminal': return <TerminalApp windowId={windowId} />;
    case 'explorer': return <FileExplorerApp windowId={windowId} />;
    case 'editor': return <EditorApp windowId={windowId} props={props} />;
    case 'emulator': return <EmulatorApp windowId={windowId} />;
    case 'calculator': return <CalculatorApp windowId={windowId} />;
    case 'minesweeper': return <MinesweeperApp windowId={windowId} />;
    case 'monitor': return <SystemMonitorApp windowId={windowId} />;
    case 'browser': return <BrowserApp windowId={windowId} />;
    case 'settings': return <SettingsApp windowId={windowId} />;
    case 'kernel': return <KernelApp windowId={windowId} />;
    case 'dos': return <DOSApp windowId={windowId} />;
    case 'qemu': return <QEMUApp windowId={windowId} />;
    case 'ide': return <IDEApp windowId={windowId} />;
    case 'hexeditor': return <HexEditorApp windowId={windowId} />;
    case 'visualstudio': return <VisualStudioApp windowId={windowId} />;
    case 'blender': return <BlenderApp windowId={windowId} />;
    case 'minecraft': return <MinecraftApp windowId={windowId} />;
    case 'update': return <SystemUpdateApp windowId={windowId} />;
    default: return null;
  }
};

const OS: React.FC = () => {
  const { state } = useOS();

  return (
    <div className="w-full h-screen overflow-hidden relative bg-[#008080] text-black font-sans select-none cursor-none" style={{ filter: 'url(#retro-16)' }}>
      <style>{`
        * { cursor: none !important; }
      `}</style>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="retro-16">
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 0.5 1" />
            <feFuncG type="discrete" tableValues="0 0.5 1" />
            <feFuncB type="discrete" tableValues="0 0.5 1" />
          </feComponentTransfer>
        </filter>
      </svg>
      <Desktop />
      
      {/* Render Windows */}
      {state.windows.map(win => (
        <AppRenderer key={win.id} windowId={win.id} appId={win.appId} props={win.props} />
      ))}

      <StartMenu />
      <Taskbar />
      <ContextMenu />
      <BSOD />
      <RetroCursor />
    </div>
  );
};

export default function App() {
  return (
    <OSProvider>
      <OS />
    </OSProvider>
  );
}
