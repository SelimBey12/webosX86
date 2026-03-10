import React, { useState, useEffect } from 'react';
import { Window } from '../components/Window';
import { vfs } from '../fs/vfs';
import { Folder, File, ArrowLeft, ArrowUp, RefreshCw, FilePlus, FolderPlus, Trash2 } from 'lucide-react';
import { useOS } from '../store/osStore';

export const FileExplorerApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [cwd, setCwd] = useState('/home/user');
  const [files, setFiles] = useState<any[]>([]);
  const { dispatch } = useOS();

  const loadFiles = () => {
    try {
      const dirFiles = vfs.readDir(cwd);
      setFiles(dirFiles.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'directory' ? -1 : 1;
      }));
    } catch (e) {
      console.error(e);
      setCwd('/');
    }
  };

  useEffect(() => {
    loadFiles();
  }, [cwd]);

  const handleNavigate = (name: string) => {
    setCwd(cwd === '/' ? `/${name}` : `${cwd}/${name}`);
  };

  const handleUp = () => {
    if (cwd === '/') return;
    const parts = cwd.split('/').filter(Boolean);
    parts.pop();
    setCwd('/' + parts.join('/'));
  };

  const handleOpenFile = (name: string) => {
    const path = cwd === '/' ? `/${name}` : `${cwd}/${name}`;
    dispatch({ type: 'OPEN_APP', appId: 'editor', props: { path } });
  };

  const handleDelete = (name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const path = cwd === '/' ? `/${name}` : `${cwd}/${name}`;
      try {
        vfs.remove(path);
        loadFiles();
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const handleNewFolder = () => {
    const name = prompt('Folder name:');
    if (name) {
      const path = cwd === '/' ? `/${name}` : `${cwd}/${name}`;
      try {
        vfs.makeDir(path);
        loadFiles();
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const handleNewFile = () => {
    const name = prompt('File name:');
    if (name) {
      const path = cwd === '/' ? `/${name}` : `${cwd}/${name}`;
      try {
        vfs.writeFile(path, '');
        loadFiles();
        handleOpenFile(name);
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  return (
    <Window id={windowId} title="File Explorer" icon={<Folder size={14} />} defaultWidth={700} defaultHeight={500}>
      <div className="flex flex-col h-full bg-zinc-900 text-zinc-200">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-zinc-800 border-b border-zinc-700">
          <button onClick={handleUp} disabled={cwd === '/'} className="p-1.5 hover:bg-zinc-700 rounded disabled:opacity-50">
            <ArrowUp size={16} />
          </button>
          <button onClick={loadFiles} className="p-1.5 hover:bg-zinc-700 rounded">
            <RefreshCw size={16} />
          </button>
          <div className="flex-1 bg-zinc-950 px-3 py-1 rounded border border-zinc-700 font-mono text-sm truncate">
            {cwd}
          </div>
          <div className="w-px h-6 bg-zinc-700 mx-1" />
          <button onClick={handleNewFile} className="p-1.5 hover:bg-zinc-700 rounded" title="New File">
            <FilePlus size={16} />
          </button>
          <button onClick={handleNewFolder} className="p-1.5 hover:bg-zinc-700 rounded" title="New Folder">
            <FolderPlus size={16} />
          </button>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {files.map((file, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer group relative"
                onDoubleClick={() => file.type === 'directory' ? handleNavigate(file.name) : handleOpenFile(file.name)}
              >
                {file.type === 'directory' ? (
                  <Folder size={48} className="text-yellow-500 drop-shadow-md" fill="currentColor" fillOpacity={0.2} />
                ) : (
                  <File size={48} className="text-blue-400 drop-shadow-md" />
                )}
                <span className="text-xs text-center break-all line-clamp-2">{file.name}</span>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(file.name); }}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {files.length === 0 && (
              <div className="col-span-full text-center text-zinc-500 py-8">This folder is empty</div>
            )}
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="bg-zinc-800 border-t border-zinc-700 px-3 py-1 text-xs text-zinc-400 flex justify-between">
          <span>{files.length} items</span>
        </div>
      </div>
    </Window>
  );
};
