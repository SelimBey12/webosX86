import React, { useState, useEffect } from 'react';
import { Window } from '../components/Window';
import { Download } from 'lucide-react';

export const SystemUpdateApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => window.location.reload(), 1000);
          return 100;
        }
        return p + Math.floor(Math.random() * 5) + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Window id={windowId} title="System Update" icon={<Download size={14} />} defaultWidth={400} defaultHeight={200} resizable={false}>
      <div className="flex flex-col h-full bg-[#c0c0c0] text-black font-sans text-sm p-4">
        <div className="flex items-center gap-4 mb-4">
          <Download size={32} />
          <div>
            <h3 className="font-bold text-lg">Upgrading WebOS x86</h3>
            <p>Please wait while setup updates your system files.</p>
          </div>
        </div>
        
        <div className="mt-auto">
          <p className="mb-1">Copying files... {progress}%</p>
          <div className="w-full h-6 border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] bg-white p-0.5">
            <div 
              className="h-full bg-[#000080]" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Window>
  );
};
