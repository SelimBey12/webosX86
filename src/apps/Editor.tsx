import React, { useState, useEffect } from 'react';
import { Window } from '../components/Window';
import { vfs } from '../fs/vfs';
import { FileCode2, Save } from 'lucide-react';

export const EditorApp: React.FC<{ windowId: string; props?: { path?: string } }> = ({ windowId, props }) => {
  const [content, setContent] = useState('');
  const [path, setPath] = useState(props?.path || '');
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (path) {
      try {
        const fileContent = vfs.readFile(path);
        setContent(fileContent);
        setIsModified(false);
      } catch (e) {
        console.error(e);
      }
    }
  }, [path]);

  const handleSave = () => {
    if (!path) {
      const newPath = prompt('Enter file path to save (e.g., /home/user/newfile.txt):');
      if (!newPath) return;
      setPath(newPath);
      try {
        vfs.writeFile(newPath, content);
        setIsModified(false);
      } catch (e: any) {
        alert(e.message);
      }
    } else {
      try {
        vfs.writeFile(path, content);
        setIsModified(false);
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  return (
    <Window 
      id={windowId} 
      title={`Editor - ${path || 'Untitled'}${isModified ? ' *' : ''}`} 
      icon={<FileCode2 size={14} />} 
      defaultWidth={800} 
      defaultHeight={600}
    >
      <div className="flex flex-col h-full bg-[#1e1e1e]">
        <div className="flex items-center p-2 bg-[#2d2d2d] border-b border-[#404040]">
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${isModified ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#3d3d3d] text-zinc-300 hover:bg-[#4d4d4d]'}`}
          >
            <Save size={16} />
            Save
          </button>
          <div className="ml-4 text-xs text-zinc-500 font-mono">
            {path || 'Unsaved file'}
          </div>
        </div>
        <textarea
          className="flex-1 w-full bg-transparent text-[#d4d4d4] p-4 font-mono text-sm outline-none resize-none"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsModified(true);
          }}
          spellCheck={false}
          placeholder="Type your code here..."
        />
      </div>
    </Window>
  );
};
