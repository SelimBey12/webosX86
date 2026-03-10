import React, { useState } from 'react';
import { Window } from '../components/Window';
import { Cpu } from 'lucide-react';

const TOTAL_MEMORY = 10485760; // 10MB
const BLOCK_SIZE = 4096;
const TOTAL_BLOCKS = Math.floor(TOTAL_MEMORY / BLOCK_SIZE);

export const KernelApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [activeTab, setActiveTab] = useState('memory');
  
  // Memory State
  const [freeList, setFreeList] = useState([{ start: 0, size: TOTAL_MEMORY }]);
  const [allocations, setAllocations] = useState<{ptr: number, size: number, pid?: number}[]>([]);
  
  // FAT State
  const [fat, setFat] = useState<number[]>(Array(TOTAL_BLOCKS).fill(-1));
  const [directory, setDirectory] = useState<{name: string, startBlock: number, size: number}[]>([]);
  
  // Process State
  const [processes, setProcesses] = useState<{pid: number, state: string, output: string[]}[]>([]);
  const [nextPid, setNextPid] = useState(1);

  const allocateMemory = (size: number, pid?: number) => {
    let allocatedPtr = -1;
    const newFreeList = [...freeList];
    
    for (let i = 0; i < newFreeList.length; i++) {
      const block = newFreeList[i];
      if (block.size >= size) {
        allocatedPtr = block.start;
        if (block.size === size) {
          newFreeList.splice(i, 1);
        } else {
          block.start += size;
          block.size -= size;
        }
        break;
      }
    }
    
    if (allocatedPtr !== -1) {
      setFreeList(newFreeList);
      setAllocations([...allocations, { ptr: allocatedPtr, size, pid }]);
      return allocatedPtr;
    }
    throw new Error("Out of memory");
  };

  const freeMemory = (ptr: number) => {
    const allocIndex = allocations.findIndex(a => a.ptr === ptr);
    if (allocIndex === -1) return;
    
    const alloc = allocations[allocIndex];
    const newAllocations = [...allocations];
    newAllocations.splice(allocIndex, 1);
    
    let newFreeList = [...freeList, { start: alloc.ptr, size: alloc.size }];
    newFreeList.sort((a, b) => a.start - b.start);
    
    for (let i = 0; i < newFreeList.length - 1; i++) {
      if (newFreeList[i].start + newFreeList[i].size === newFreeList[i+1].start) {
        newFreeList[i].size += newFreeList[i+1].size;
        newFreeList.splice(i + 1, 1);
        i--;
      }
    }
    
    setAllocations(newAllocations);
    setFreeList(newFreeList);
  };

  const createFile = (name: string, content: string) => {
    const size = content.length;
    const blocksNeeded = Math.ceil(size / BLOCK_SIZE) || 1;
    
    const freeBlocks: number[] = [];
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      if (fat[i] === -1) freeBlocks.push(i);
      if (freeBlocks.length === blocksNeeded) break;
    }
    
    if (freeBlocks.length < blocksNeeded) {
      alert("Disk full!");
      return;
    }
    
    const newFat = [...fat];
    for (let i = 0; i < freeBlocks.length; i++) {
      newFat[freeBlocks[i]] = i === freeBlocks.length - 1 ? -2 : freeBlocks[i + 1];
    }
    
    setFat(newFat);
    setDirectory([...directory, { name, startBlock: freeBlocks[0], size }]);
  };

  const deleteFile = (name: string) => {
    const fileIndex = directory.findIndex(f => f.name === name);
    if (fileIndex === -1) return;
    
    const file = directory[fileIndex];
    const newFat = [...fat];
    let currentBlock = file.startBlock;
    
    while (currentBlock !== -2 && currentBlock !== -1) {
      const nextBlock = newFat[currentBlock];
      newFat[currentBlock] = -1;
      currentBlock = nextBlock;
    }
    
    const newDir = [...directory];
    newDir.splice(fileIndex, 1);
    
    setFat(newFat);
    setDirectory(newDir);
  };

  const runHelloWorld = () => {
    const pid = nextPid;
    setNextPid(pid + 1);
    
    try {
      const ptr = allocateMemory(65536, pid);
      const newProc = { pid, state: 'RUNNING', output: [] };
      setProcesses([...processes, newProc]);
      
      setTimeout(() => {
        setProcesses(procs => procs.map(p => {
          if (p.pid === pid) {
            return { ...p, output: [...p.output, "SYSCALL: write(stdout, 'Merhaba Dünya\\n')"], state: 'TERMINATED' };
          }
          return p;
        }));
        freeMemory(ptr);
      }, 1000);
      
    } catch (e: any) {
      alert("Failed to run process: " + e.message);
    }
  };

  return (
    <Window id={windowId} title="x86 Kernel Subsystem" icon={<Cpu size={14} />} defaultWidth={600} defaultHeight={500}>
      <div className="flex flex-col h-full bg-[#c0c0c0] text-black font-sans text-sm p-1">
        <div className="flex gap-1 p-1 border-b-2 border-[#808080]">
          {['memory', 'fs', 'usermode'].map(tab => (
            <button 
              key={tab}
              className={`px-4 py-1 border-2 font-bold ${activeTab === tab ? 'border-t-[#ffffff] border-l-[#ffffff] border-b-[#c0c0c0] border-r-[#c0c0c0] bg-[#c0c0c0] -mb-[2px] z-10' : 'border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] bg-[#c0c0c0]'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'memory' ? 'Memory (RAM)' : tab === 'fs' ? 'FAT File System' : 'User Mode'}
            </button>
          ))}
        </div>
        
        <div className="flex-1 p-4 overflow-auto border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080] border-2 bg-white m-1">
          {activeTab === 'memory' && (
            <div>
              <h3 className="font-bold mb-2 text-lg">Memory Allocator (10MB Free List)</h3>
              <div className="mb-4">
                <p>Total Memory: 10,485,760 bytes</p>
                <p>Allocated Blocks: {allocations.length}</p>
                <p>Free Blocks: {freeList.length}</p>
              </div>
              <div className="h-8 w-full bg-[#000080] flex relative border-2 border-inset border-[#808080]">
                {allocations.map((alloc, i) => (
                  <div key={i} className="absolute h-full bg-red-500 border-r border-black" style={{ left: `${(alloc.ptr / TOTAL_MEMORY) * 100}%`, width: `${(alloc.size / TOTAL_MEMORY) * 100}%` }} title={`PID: ${alloc.pid} | Size: ${alloc.size}`} />
                ))}
              </div>
              <div className="mt-4">
                <h4 className="font-bold">Free List:</h4>
                <ul className="list-disc pl-4 text-xs font-mono">
                  {freeList.map((f, i) => <li key={i}>Offset: 0x{f.start.toString(16).toUpperCase()} - Size: {f.size} bytes</li>)}
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'fs' && (
            <div>
              <h3 className="font-bold mb-2 text-lg">FAT File System (RAM Disk)</h3>
              <div className="flex gap-2 mb-4">
                <button className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-b-[#ffffff] active:border-r-[#ffffff] font-bold" onClick={() => createFile(`test_${Date.now()}.txt`, "Hello World".repeat(100))}>Create Test File</button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#c0c0c0] border-2 border-[#ffffff] border-b-[#808080] border-r-[#808080]">
                    <th className="p-1 border-r-2 border-[#808080]">Name</th>
                    <th className="p-1 border-r-2 border-[#808080]">Size</th>
                    <th className="p-1 border-r-2 border-[#808080]">Start Block</th>
                    <th className="p-1">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {directory.map((f, i) => (
                    <tr key={i} className="border-b border-[#c0c0c0]">
                      <td className="p-1">{f.name}</td>
                      <td className="p-1">{f.size} bytes</td>
                      <td className="p-1">{f.startBlock}</td>
                      <td className="p-1">
                        <button className="text-red-600 underline font-bold" onClick={() => deleteFile(f.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-xs text-[#808080] font-bold">
                Total Blocks: {TOTAL_BLOCKS} | Free Blocks: {fat.filter(b => b === -1).length}
              </div>
            </div>
          )}
          
          {activeTab === 'usermode' && (
            <div>
              <h3 className="font-bold mb-2 text-lg">User Mode Process Execution</h3>
              <p className="mb-4 text-sm">Loads a simple executable binary into a separate address space and executes it via system calls.</p>
              <button className="px-4 py-2 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-b-[#ffffff] active:border-r-[#ffffff] font-bold mb-4" onClick={runHelloWorld}>
                Run 'Merhaba Dünya' (User Mode)
              </button>
              
              <div className="space-y-2">
                {processes.map(p => (
                  <div key={p.pid} className="border-2 border-[#808080] p-2 bg-black text-green-400 font-mono text-xs">
                    <div>[Kernel] Process PID {p.pid} created. State: {p.state}</div>
                    {p.output.map((out, i) => <div key={i}>{out}</div>)}
                    {p.state === 'TERMINATED' && <div className="text-yellow-400">[Kernel] Process terminated. Memory freed.</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};
