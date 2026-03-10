import React, { useState, useRef, useEffect } from 'react';
import { Window } from '../components/Window';
import { vfs } from '../fs/vfs';
import { Terminal as TerminalIcon } from 'lucide-react';

export const TerminalApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [history, setHistory] = useState<{ text: string; type: 'input' | 'output' | 'error' }[]>([
    { text: 'WebOS x86 Terminal v1.0.0', type: 'output' },
    { text: 'Type "help" for a list of commands.', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/home/user');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, { text: `user@webos:${cwd}$ ${trimmed}`, type: 'input' }]);
    
    const args = trimmed.split(' ');
    const command = args[0].toLowerCase();

    try {
      switch (command) {
        case 'help':
          setHistory(prev => [...prev, { text: 'Available commands: help, clear, ls, cd, pwd, cat, echo, mkdir, rm, date, whoami', type: 'output' }]);
          break;
        case 'clear':
          setHistory([]);
          break;
        case 'pwd':
          setHistory(prev => [...prev, { text: cwd, type: 'output' }]);
          break;
        case 'ls': {
          const target = args[1] ? resolvePath(args[1]) : cwd;
          const files = vfs.readDir(target);
          const output = files.map(f => f.type === 'directory' ? `<dir> ${f.name}` : `      ${f.name}`).join('\n');
          setHistory(prev => [...prev, { text: output || '(empty)', type: 'output' }]);
          break;
        }
        case 'cd': {
          const target = args[1] || '/home/user';
          const resolved = resolvePath(target);
          if (vfs.exists(resolved)) {
            setCwd(resolved);
          } else {
            throw new Error(`cd: ${target}: No such file or directory`);
          }
          break;
        }
        case 'cat': {
          if (!args[1]) throw new Error('cat: missing operand');
          const target = resolvePath(args[1]);
          const content = vfs.readFile(target);
          setHistory(prev => [...prev, { text: content, type: 'output' }]);
          break;
        }
        case 'echo': {
          const text = args.slice(1).join(' ');
          setHistory(prev => [...prev, { text, type: 'output' }]);
          break;
        }
        case 'mkdir': {
          if (!args[1]) throw new Error('mkdir: missing operand');
          const target = resolvePath(args[1]);
          vfs.makeDir(target);
          break;
        }
        case 'rm': {
          if (!args[1]) throw new Error('rm: missing operand');
          const target = resolvePath(args[1]);
          vfs.remove(target);
          break;
        }
        case 'date':
          setHistory(prev => [...prev, { text: new Date().toString(), type: 'output' }]);
          break;
        case 'whoami':
          setHistory(prev => [...prev, { text: 'user', type: 'output' }]);
          break;
        default:
          setHistory(prev => [...prev, { text: `Command not found: ${command}`, type: 'error' }]);
      }
    } catch (e: any) {
      setHistory(prev => [...prev, { text: e.message, type: 'error' }]);
    }
  };

  const resolvePath = (p: string) => {
    if (p.startsWith('/')) return p;
    if (p === '.') return cwd;
    if (p === '..') {
      const parts = cwd.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/');
    }
    return cwd === '/' ? `/${p}` : `${cwd}/${p}`;
  };

  return (
    <Window id={windowId} title="Terminal" icon={<TerminalIcon size={14} />} defaultWidth={600} defaultHeight={400}>
      <div 
        className="h-full bg-black text-green-500 font-mono text-sm p-2 overflow-auto cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap ${line.type === 'error' ? 'text-red-400' : line.type === 'input' ? 'text-white' : ''}`}>
            {line.text}
          </div>
        ))}
        <div className="flex items-center mt-1">
          <span className="text-blue-400 mr-2">user@webos:{cwd}$</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-white border-none p-0 m-0 focus:ring-0"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCommand(input);
                setInput('');
              }
            }}
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </Window>
  );
};
