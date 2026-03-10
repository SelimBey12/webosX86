import React, { useState, useEffect, useRef } from 'react';
import { Window } from '../components/Window';
import { Cpu } from 'lucide-react';

export const QEMUApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [arch, setArch] = useState('arm');
  const [booting, setBooting] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView();
  }, [output]);

  const startBoot = () => {
    setBooting(true);
    setOutput([`QEMU emulator version 8.0.0`, `Booting architecture: ${arch.toUpperCase()}`]);
    
    const bootSequence = [
      `Loading kernel image for ${arch}...`,
      `[    0.000000] Booting Linux on physical CPU 0x0`,
      `[    0.000000] Linux version 5.15.0 (gcc (Ubuntu 11.2.0-19ubuntu1) 11.2.0, GNU ld (GNU Binutils for Ubuntu) 2.38)`,
      `[    0.000000] Machine model: QEMU Virtual Machine`,
      `[    0.000000] Memory policy: Data cache writeback`,
      `[    0.012345] random: get_random_bytes called from start_kernel+0x314/0x4e0 with crng_init=0`,
      `[    0.045678] Mount-cache hash table entries: 4096 (order: 3, 32768 bytes, linear)`,
      `[    0.089012] smp: Bringing up secondary CPUs ...`,
      `[    0.123456] smp: Brought up 1 node, 4 CPUs`,
      `[    0.456789] devtmpfs: initialized`,
      `[    0.789012] clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 19112604462750000 ns`,
      `[    1.234567] NET: Registered PF_INET protocol family`,
      `[    1.567890] VFS: Mounted root (ext4 filesystem) readonly on device 254:0.`,
      `[    2.012345] Freeing unused kernel image (initmem) memory: 2048K`,
      `[    2.123456] Run /sbin/init as init process`,
      `Starting systemd...`,
      `Welcome to QEMU Virtual Linux (${arch})!`,
      `root@qemu-${arch}:~# `
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setOutput(prev => [...prev, bootSequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setBooting(false);
      }
    }, 300);
  };

  return (
    <Window id={windowId} title={`QEMU Emulator`} icon={<Cpu size={14} />} defaultWidth={600} defaultHeight={400}>
      <div className="flex flex-col h-full bg-black text-[#c0c0c0] font-mono text-sm">
        <div className="flex items-center gap-2 p-2 bg-[#c0c0c0] text-black border-b-2 border-[#808080]">
          <span className="font-bold">Arch:</span>
          <select 
            className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] px-1"
            value={arch}
            onChange={e => setArch(e.target.value)}
            disabled={booting}
          >
            <option value="arm">ARM (aarch64)</option>
            <option value="mips">MIPS</option>
            <option value="riscv">RISC-V (rv64)</option>
            <option value="x86_64">x86_64</option>
            <option value="ppc">PowerPC</option>
          </select>
          <button 
            className="px-4 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-b-[#ffffff] active:border-r-[#ffffff] font-bold ml-2"
            onClick={startBoot}
            disabled={booting}
          >
            {booting ? 'Booting...' : 'Boot'}
          </button>
        </div>
        <div className="flex-1 p-2 overflow-auto">
          {output.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </Window>
  );
};
