import React, { useState } from 'react';
import { Window } from '../components/Window';
import { FileCode2, Play } from 'lucide-react';

export const IDEApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [lang, setLang] = useState('c');
  const [code, setCode] = useState(`#include <stdio.h>\n\nint main() {\n    printf("Hello, Low-Level World!\\n");\n    \n    // Pointer arithmetic example\n    int arr[5] = {10, 20, 30, 40, 50};\n    int *ptr = arr;\n    printf("Third element: %d\\n", *(ptr + 2));\n    \n    return 0;\n}`);
  const [output, setOutput] = useState<string[]>([]);
  const [compiling, setCompiling] = useState(false);

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    if (newLang === 'c') {
      setCode(`#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}`);
    } else if (newLang === 'cpp') {
      setCode(`#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}`);
    } else if (newLang === 'asm') {
      setCode(`section .data\n    msg db 'Hello from x86 Assembly!', 0Ah\n    len equ $ - msg\n\nsection .text\n    global _start\n\n_start:\n    mov edx, len\n    mov ecx, msg\n    mov ebx, 1\n    mov eax, 4\n    int 80h\n\n    mov eax, 1\n    int 80h`);
    }
  };

  const compileAndRun = () => {
    setCompiling(true);
    setOutput([`> Compiling ${lang.toUpperCase()} code...`]);
    
    setTimeout(() => {
      let compilerOutput = '';
      if (lang === 'c') compilerOutput = '> gcc main.c -o main\n> ./main\nHello from C!\nThird element: 30';
      else if (lang === 'cpp') compilerOutput = '> g++ main.cpp -o main\n> ./main\nHello from C++!';
      else if (lang === 'asm') compilerOutput = '> nasm -f elf32 main.asm -o main.o\n> ld -m elf_i386 main.o -o main\n> ./main\nHello from x86 Assembly!';
      
      setOutput(prev => [...prev, ...compilerOutput.split('\n'), `\n> Process exited with code 0.`]);
      setCompiling(false);
    }, 1500);
  };

  return (
    <Window id={windowId} title="Low-Level IDE" icon={<FileCode2 size={14} />} defaultWidth={700} defaultHeight={500}>
      <div className="flex flex-col h-full bg-[#c0c0c0] text-black">
        <div className="flex items-center gap-2 p-1 border-b-2 border-[#808080]">
          <select 
            className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] px-1"
            value={lang}
            onChange={e => handleLangChange(e.target.value)}
          >
            <option value="c">C (gcc)</option>
            <option value="cpp">C++ (g++)</option>
            <option value="asm">x86 Assembly (nasm)</option>
          </select>
          <button 
            className="flex items-center gap-1 px-3 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-b-[#ffffff] active:border-r-[#ffffff] font-bold"
            onClick={compileAndRun}
            disabled={compiling}
          >
            <Play size={14} />
            {compiling ? 'Compiling...' : 'Compile & Run'}
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 border-r-2 border-[#808080] p-1">
            <textarea 
              className="w-full h-full bg-[#000080] text-[#ffff00] font-mono p-2 outline-none resize-none border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff]"
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className="w-1/3 bg-black text-[#c0c0c0] font-mono text-xs p-2 overflow-auto border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] m-1">
            {output.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">{line}</div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
};
