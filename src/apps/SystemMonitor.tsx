import React, { useState, useEffect } from 'react';
import { Window } from '../components/Window';
import { Cpu, HardDrive, Activity } from 'lucide-react';

export const SystemMonitorApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [cpuUsage, setCpuUsage] = useState<number[]>(Array(20).fill(0));
  const [ramUsage, setRamUsage] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const next = [...prev.slice(1), Math.random() * 100];
        return next;
      });
      setRamUsage(prev => {
        // Simulate relatively stable RAM usage
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.5) * 10;
        const next = [...prev.slice(1), Math.max(20, Math.min(90, last + change))];
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderGraph = (data: number[], color: string) => {
    const max = 100;
    return (
      <div className="h-32 flex items-end gap-1 p-2 bg-zinc-950 rounded-lg border border-zinc-800">
        {data.map((val, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-t-sm transition-all duration-500 ${color}`}
            style={{ height: `${(val / max) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  return (
    <Window id={windowId} title="System Monitor" icon={<Cpu size={14} />} defaultWidth={500} defaultHeight={400}>
      <div className="flex flex-col h-full bg-zinc-900 text-zinc-200 p-4 gap-6 overflow-auto">
        
        {/* CPU Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <Activity size={18} className="text-blue-400" />
              CPU Usage
            </div>
            <span className="text-blue-400 font-mono">{cpuUsage[cpuUsage.length - 1].toFixed(1)}%</span>
          </div>
          {renderGraph(cpuUsage, 'bg-blue-500/50')}
          <div className="text-xs text-zinc-500 flex justify-between">
            <span>Virtual x86 Processor</span>
            <span>1 Core</span>
          </div>
        </div>

        {/* RAM Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <HardDrive size={18} className="text-purple-400" />
              Memory Usage
            </div>
            <span className="text-purple-400 font-mono">{ramUsage[ramUsage.length - 1].toFixed(1)}%</span>
          </div>
          {renderGraph(ramUsage, 'bg-purple-500/50')}
          <div className="text-xs text-zinc-500 flex justify-between">
            <span>Virtual RAM</span>
            <span>{(ramUsage[ramUsage.length - 1] * 1.28).toFixed(0)} MB / 128 MB</span>
          </div>
        </div>

        {/* Processes */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="font-medium mb-2">Running Processes</div>
          <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-800 text-zinc-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">PID</th>
                  <th className="px-4 py-2">CPU</th>
                  <th className="px-4 py-2">Memory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr className="hover:bg-zinc-800/50">
                  <td className="px-4 py-2">system_idle</td>
                  <td className="px-4 py-2 font-mono">0</td>
                  <td className="px-4 py-2">{(100 - cpuUsage[cpuUsage.length - 1]).toFixed(1)}%</td>
                  <td className="px-4 py-2">0.1 MB</td>
                </tr>
                <tr className="hover:bg-zinc-800/50">
                  <td className="px-4 py-2">v86_emulator</td>
                  <td className="px-4 py-2 font-mono">1</td>
                  <td className="px-4 py-2">{(cpuUsage[cpuUsage.length - 1] * 0.8).toFixed(1)}%</td>
                  <td className="px-4 py-2">128.0 MB</td>
                </tr>
                <tr className="hover:bg-zinc-800/50">
                  <td className="px-4 py-2">ui_manager</td>
                  <td className="px-4 py-2 font-mono">2</td>
                  <td className="px-4 py-2">{(cpuUsage[cpuUsage.length - 1] * 0.2).toFixed(1)}%</td>
                  <td className="px-4 py-2">45.2 MB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Window>
  );
};
