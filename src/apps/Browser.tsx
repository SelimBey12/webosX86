import React, { useState } from 'react';
import { Window } from '../components/Window';
import { Globe, ArrowLeft, ArrowRight, RotateCw, Home } from 'lucide-react';

export const BrowserApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [url, setUrl] = useState('https://en.wikipedia.org/wiki/WebAssembly');
  const [inputUrl, setInputUrl] = useState(url);
  const [iframeKey, setIframeKey] = useState(0);

  const handleGo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
    setInputUrl(finalUrl);
  };

  return (
    <Window id={windowId} title="Web Browser" icon={<Globe size={14} />} defaultWidth={800} defaultHeight={600}>
      <div className="flex flex-col h-full bg-white">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-zinc-200 border-b border-zinc-300">
          <button className="p-1.5 hover:bg-zinc-300 rounded text-zinc-600 disabled:opacity-50" disabled>
            <ArrowLeft size={16} />
          </button>
          <button className="p-1.5 hover:bg-zinc-300 rounded text-zinc-600 disabled:opacity-50" disabled>
            <ArrowRight size={16} />
          </button>
          <button className="p-1.5 hover:bg-zinc-300 rounded text-zinc-600" onClick={() => setIframeKey(k => k + 1)}>
            <RotateCw size={16} />
          </button>
          <button className="p-1.5 hover:bg-zinc-300 rounded text-zinc-600" onClick={() => { setUrl('https://en.wikipedia.org/wiki/WebAssembly'); setInputUrl('https://en.wikipedia.org/wiki/WebAssembly'); }}>
            <Home size={16} />
          </button>
          
          <form onSubmit={handleGo} className="flex-1 flex">
            <input 
              type="text" 
              className="flex-1 bg-white border border-zinc-300 rounded-full px-4 py-1 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="Enter URL..."
            />
          </form>
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-zinc-100 relative">
          <iframe 
            key={iframeKey}
            src={url} 
            className="absolute inset-0 w-full h-full border-none"
            title="Browser"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </Window>
  );
};
