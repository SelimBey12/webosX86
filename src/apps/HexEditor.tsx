import React, { useState, useEffect } from 'react';
import { Window } from '../components/Window';
import { Binary } from 'lucide-react';

export const HexEditorApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [data, setData] = useState<Uint8Array>(new Uint8Array(256));

  useEffect(() => {
    // Generate some fake binary data (e.g., an ELF header)
    const fakeElf = [
      0x7f, 0x45, 0x4c, 0x46, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x02, 0x00, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x54, 0x80, 0x04, 0x08, 0x34, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x34, 0x00, 0x20, 0x00, 0x01, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x04, 0x08,
    ];
    const arr = new Uint8Array(256);
    for (let i = 0; i < fakeElf.length; i++) arr[i] = fakeElf[i];
    for (let i = fakeElf.length; i < 256; i++) arr[i] = Math.floor(Math.random() * 256);
    setData(arr);
  }, []);

  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  
  const getAscii = (n: number) => {
    if (n >= 32 && n <= 126) return String.fromCharCode(n);
    return '.';
  };

  const rows = [];
  for (let i = 0; i < data.length; i += 16) {
    const chunk = data.slice(i, i + 16);
    const hexStr = Array.from(chunk).map((b: number) => toHex(b)).join(' ');
    const asciiStr = Array.from(chunk).map((b: number) => getAscii(b)).join('');
    rows.push(
      <div key={i} className="flex gap-4 hover:bg-[#000080] hover:text-white px-1">
        <span className="text-[#808080]">{i.toString(16).padStart(8, '0').toUpperCase()}</span>
        <span className="w-[380px]">{hexStr}</span>
        <span>{asciiStr}</span>
      </div>
    );
  }

  return (
    <Window id={windowId} title="Hex Editor - /bin/kernel.elf" icon={<Binary size={14} />} defaultWidth={600} defaultHeight={400}>
      <div className="h-full bg-white text-black font-mono text-sm p-2 overflow-auto">
        <div className="flex gap-4 border-b-2 border-[#808080] mb-2 pb-1 font-bold text-[#808080]">
          <span>OFFSET  </span>
          <span className="w-[380px]">00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F</span>
          <span>DECODED TEXT</span>
        </div>
        {rows}
      </div>
    </Window>
  );
};
