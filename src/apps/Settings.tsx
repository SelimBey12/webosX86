import React, { useState } from 'react';
import { Window } from '../components/Window';
import { Settings as SettingsIcon } from 'lucide-react';
import { useOS } from '../store/osStore';

export const SettingsApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { state, dispatch } = useOS();
  const [activeTab, setActiveTab] = useState('system');
  const [lang, setLang] = useState('en-US');
  const [kbd, setKbd] = useState('us');

  return (
    <Window id={windowId} title="System Properties" icon={<SettingsIcon size={14} />} defaultWidth={450} defaultHeight={400}>
      <div className="flex flex-col h-full bg-[#c0c0c0] text-black font-sans text-sm p-2">
        <div className="flex gap-1 mb-2">
          {['system', 'regional', 'update'].map(tab => (
            <button 
              key={tab}
              className={`px-3 py-1 border-2 font-bold capitalize ${activeTab === tab ? 'border-t-[#ffffff] border-l-[#ffffff] border-b-[#c0c0c0] border-r-[#c0c0c0] bg-[#c0c0c0] -mb-[2px] z-10' : 'border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] bg-[#c0c0c0]'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex-1 p-4 border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080] border-2 bg-[#c0c0c0]">
          {activeTab === 'system' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#008080] border-2 border-inset border-[#808080] flex items-center justify-center">
                  <MonitorIcon />
                </div>
                <div>
                  <h3 className="font-bold text-lg">WebOS x86</h3>
                  <p>Version 1.0.0 (WASM Build)</p>
                  <p>Copyright (c) 1995-2026</p>
                </div>
              </div>
              <div className="h-px bg-[#808080] border-b border-[#ffffff] w-full" />
              <div>
                <p className="font-bold">Computer:</p>
                <p className="ml-4">x86 Emulation via v86</p>
                <p className="ml-4">128.0 MB RAM</p>
              </div>
            </div>
          )}

          {activeTab === 'regional' && (
            <div className="flex flex-col gap-4">
              <fieldset className="border-2 border-[#808080] border-t-[#ffffff] border-l-[#ffffff] p-2">
                <legend className="px-1 font-bold">Language Settings</legend>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="flex items-center gap-2">
                    <span className="w-24">System Language:</span>
                    <select className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] px-1 py-0.5" value={lang} onChange={e => setLang(e.target.value)}>
                      <option value="en-US">English (United States)</option>
                      <option value="tr-TR">Turkish (Turkey)</option>
                      <option value="de-DE">German (Germany)</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="w-24">Keyboard Layout:</span>
                    <select className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] px-1 py-0.5" value={kbd} onChange={e => setKbd(e.target.value)}>
                      <option value="us">US QWERTY</option>
                      <option value="tr">Turkish QWERTY</option>
                      <option value="tr-f">Turkish F</option>
                      <option value="de">German QWERTZ</option>
                    </select>
                  </label>
                </div>
              </fieldset>
            </div>
          )}

          {activeTab === 'update' && (
            <div className="flex flex-col gap-4 items-center justify-center h-full text-center">
              <div className="w-12 h-12 mb-4">
                <UpdateIcon />
              </div>
              <h3 className="font-bold text-lg mb-2">System Update</h3>
              <p className="mb-4">Check for the latest updates to WebOS x86.</p>
              <button 
                className="px-6 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-b-[#ffffff] active:border-r-[#ffffff] font-bold"
                onClick={() => dispatch({ type: 'OPEN_APP', appId: 'update' })}
              >
                Check for Updates...
              </button>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};

const MonitorIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const UpdateIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
    <path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.1-10.45l5.27 5.27" />
    <path d="M2 12a10 10 0 1 1 10 10" />
  </svg>
);
