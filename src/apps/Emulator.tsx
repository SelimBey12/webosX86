import React, { useEffect, useRef, useState } from 'react';
import { Window } from '../components/Window';
import { MonitorPlay, Play, Square, RefreshCw } from 'lucide-react';

// We dynamically load v86 to avoid bundling massive WASM files directly.
const V86_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/v86@0.3/build/libv86.js';
const V86_WASM_URL = 'https://cdn.jsdelivr.net/npm/v86@0.3/build/v86.wasm';
const BIOS_URL = 'https://cdn.jsdelivr.net/npm/v86@0.3/bios/seabios.bin';
const VGA_BIOS_URL = 'https://cdn.jsdelivr.net/npm/v86@0.3/bios/vgabios.bin';
// A very small OS image (KolibriOS or FreeDOS)
const OS_IMAGE_URL = 'https://copy.sh/v86/images/kolibri.img';

export const EmulatorApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const emulatorRef = useRef<any>(null);

  useEffect(() => {
    // Load v86 script dynamically
    if (!(window as any).V86Starter) {
      const script = document.createElement('script');
      script.src = V86_SCRIPT_URL;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }

    return () => {
      if (emulatorRef.current) {
        emulatorRef.current.destroy();
      }
    };
  }, []);

  const startEmulator = () => {
    if (!isLoaded || !screenRef.current || emulatorRef.current) return;

    try {
      emulatorRef.current = new (window as any).V86Starter({
        wasm_path: V86_WASM_URL,
        memory_size: 128 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        screen_container: screenRef.current,
        bios: { url: BIOS_URL },
        vga_bios: { url: VGA_BIOS_URL },
        fda: { url: OS_IMAGE_URL }, // Booting from floppy image
        autostart: true,
      });

      setIsRunning(true);
    } catch (e) {
      console.error("Failed to start v86", e);
      alert("Failed to start emulator. Check console.");
    }
  };

  const stopEmulator = () => {
    if (emulatorRef.current) {
      emulatorRef.current.destroy();
      emulatorRef.current = null;
      setIsRunning(false);
      if (screenRef.current) {
        screenRef.current.innerHTML = ''; // Clear canvas
      }
    }
  };

  const restartEmulator = () => {
    stopEmulator();
    setTimeout(startEmulator, 100);
  };

  return (
    <Window id={windowId} title="x86 Emulator (KolibriOS)" icon={<MonitorPlay size={14} />} defaultWidth={800} defaultHeight={640}>
      <div className="flex flex-col h-full bg-black">
        <div className="flex items-center gap-2 p-2 bg-zinc-900 border-b border-zinc-800">
          {!isRunning ? (
            <button 
              onClick={startEmulator}
              disabled={!isLoaded}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-sm disabled:opacity-50 transition-colors"
            >
              <Play size={16} />
              {isLoaded ? 'Start VM' : 'Loading v86...'}
            </button>
          ) : (
            <>
              <button 
                onClick={stopEmulator}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-sm transition-colors"
              >
                <Square size={16} />
                Stop
              </button>
              <button 
                onClick={restartEmulator}
                className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-sm transition-colors"
              >
                <RefreshCw size={16} />
                Restart
              </button>
              <span className="ml-auto text-xs text-zinc-500">
                Click inside to capture mouse. Press ESC to release.
              </span>
            </>
          )}
        </div>
        
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#000]">
          {!isRunning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
              <MonitorPlay size={64} className="mb-4 opacity-50" />
              <p>Virtual Machine is powered off.</p>
              <p className="text-xs mt-2 max-w-md text-center">
                This will download a real x86 emulator (WASM) and boot KolibriOS. 
                It may take a moment to download the images.
              </p>
            </div>
          )}
          {/* v86 injects canvas and text layers here */}
          <div 
            ref={screenRef} 
            className="v86-screen-container"
            style={{ 
              whiteSpace: 'pre', 
              fontFamily: 'monospace', 
              fontSize: '14px', 
              lineHeight: '14px' 
            }}
          ></div>
        </div>
      </div>
    </Window>
  );
};
