import React, { useEffect } from 'react';
import { useOS } from '../store/osStore';

export const BSOD: React.FC = () => {
  const { state } = useOS();

  useEffect(() => {
    if (!state.isBSOD) return;
    
    const handleKeyDown = () => {
      window.location.reload();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isBSOD]);

  if (!state.isBSOD) return null;

  return (
    <div className="fixed inset-0 bg-[#0000AA] text-[#FFFFFF] font-mono p-8 z-[999999] flex flex-col items-center justify-center text-center cursor-none">
      <div className="bg-[#FFFFFF] text-[#0000AA] px-2 mb-8 font-bold">Windows</div>
      <p className="mb-4">A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
      <p className="mb-8">The current application will be terminated.</p>
      <p>* Press any key to terminate the current application.</p>
      <p>* Press CTRL+ALT+DEL again to restart your computer.</p>
      <p className="mt-8">Press any key to continue _</p>
    </div>
  );
};
