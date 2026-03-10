import React from 'react';
import { Window } from '../components/Window';
import { Code, Play } from 'lucide-react';
import { useOS } from '../store/osStore';

export const VisualStudioApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { dispatch } = useOS();

  const handleBuild = () => {
    // Heavy operation simulation triggers BSOD
    dispatch({ type: 'TRIGGER_BSOD' });
  };

  return (
    <Window id={windowId} title="Visual Studio 97" icon={<Code size={14} />} defaultWidth={800} defaultHeight={600}>
      <div className="flex flex-col h-full bg-[#c0c0c0] text-black font-sans text-sm">
        {/* Menu Bar */}
        <div className="flex gap-4 px-2 py-1 border-b border-[#808080]">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Project</span>
          <span className="font-bold underline cursor-pointer" onClick={handleBuild}>Build</span>
          <span>Debug</span>
          <span>Tools</span>
          <span>Window</span>
          <span>Help</span>
        </div>
        
        {/* Toolbar */}
        <div className="flex gap-2 p-1 border-b-2 border-[#808080] border-b-[#ffffff]">
          <button className="p-1 border-2 border-transparent hover:border-t-[#ffffff] hover:border-l-[#ffffff] hover:border-b-[#808080] hover:border-r-[#808080]">
            <Play size={16} className="text-[#008000]" onClick={handleBuild} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden p-1 gap-1">
          {/* Solution Explorer */}
          <div className="w-48 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] p-1 overflow-auto">
            <div className="font-bold mb-1">Workspace 'MyProject'</div>
            <div className="pl-4">
              <div>[-] MyProject files</div>
              <div className="pl-4">
                <div>main.cpp</div>
                <div>utils.cpp</div>
                <div>utils.h</div>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] p-2 font-mono text-sm overflow-auto">
            <div className="text-[#008000]">// main.cpp</div>
            <div className="text-[#0000ff]">#include</div> <span>&lt;iostream&gt;</span>
            <br/><br/>
            <div className="text-[#0000ff]">int</div> <span>main() {'{'}</span>
            <div className="pl-4">
              <span>std::cout &lt;&lt; </span><span className="text-[#a31515]">"Hello from Visual Studio 97!"</span><span> &lt;&lt; std::endl;</span><br/>
              <span className="text-[#008000]">// Warning: This project is very heavy.</span><br/>
              <span className="text-[#008000]">// Building it might cause system instability.</span><br/>
              <div className="text-[#0000ff]">return</div> <span>0;</span>
            </div>
            <span>{'}'}</span>
          </div>
        </div>
        
        {/* Output */}
        <div className="h-32 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] m-1 p-1 font-mono text-xs overflow-auto">
          <div>Compiling...</div>
          <div>main.cpp</div>
          <div>Linking...</div>
          <div>Ready.</div>
        </div>
      </div>
    </Window>
  );
};
