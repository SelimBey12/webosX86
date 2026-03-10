import React, { useState, useRef, useEffect } from 'react';
import { Window } from '../components/Window';
import { Terminal } from 'lucide-react';

export const DOSApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [history, setHistory] = useState<string[]>([
    'MS-DOS Version 6.22',
    '(C)Copyright Microsoft Corp 1981-1994.',
    '',
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    setHistory(prev => [...prev, `C:\\>${trimmed}`]);
    
    if (!trimmed) return;
    
    const args = trimmed.toUpperCase().split(' ');
    const command = args[0];

    switch (command) {
      case 'DIR':
        setHistory(prev => [...prev, 
          ' Volume in drive C is MS-DOS_6',
          ' Volume Serial Number is 1A2B-3C4D',
          ' Directory of C:\\',
          '',
          'DOS          <DIR>         03-09-26  7:13p',
          'WINDOWS      <DIR>         03-09-26  7:13p',
          'COMMAND  COM        54,619 05-31-94  6:22a',
          'AUTOEXEC BAT           128 03-09-26  7:13p',
          'CONFIG   SYS           256 03-09-26  7:13p',
          '       3 file(s)         54,993 bytes',
          '       2 dir(s)     214,748,364 bytes free'
        ]);
        break;
      case 'VER':
        setHistory(prev => [...prev, 'MS-DOS Version 6.22']);
        break;
      case 'CLS':
        setHistory([]);
        break;
      case 'ECHO':
        setHistory(prev => [...prev, args.slice(1).join(' ')]);
        break;
      case 'MEM':
        setHistory(prev => [...prev, 
          'Memory Type        Total  =   Used  +   Free',
          '----------------  -------   -------   -------',
          'Conventional         640K       45K      595K',
          'Upper                  0K        0K        0K',
          'Reserved             384K      384K        0K',
          'Extended (XMS)    15,360K    2,048K   13,312K',
          '----------------  -------   -------   -------',
          'Total memory      16,384K    2,477K   13,907K'
        ]);
        break;
      case 'HELP':
        setHistory(prev => [...prev, 'Supported commands: DIR, VER, CLS, ECHO, MEM, HELP']);
        break;
      default:
        setHistory(prev => [...prev, `Bad command or file name`]);
    }
  };

  return (
    <Window id={windowId} title="MS-DOS Prompt" icon={<Terminal size={14} />} defaultWidth={640} defaultHeight={400}>
      <div className="h-full bg-black text-[#c0c0c0] font-mono text-base p-2 overflow-auto cursor-text" onClick={() => document.getElementById(`dos-input-${windowId}`)?.focus()}>
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
        <div className="flex items-center">
          <span className="mr-2">C:\&gt;</span>
          <input
            id={`dos-input-${windowId}`}
            type="text"
            className="flex-1 bg-transparent outline-none text-[#c0c0c0] border-none p-0 m-0 focus:ring-0 uppercase"
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCommand(input);
                setInput('');
              }
            }}
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </Window>
  );
};
