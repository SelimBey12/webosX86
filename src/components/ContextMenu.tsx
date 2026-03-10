import React, { useEffect } from 'react';
import { useOS } from '../store/osStore';

export const ContextMenu: React.FC = () => {
  const { state, dispatch } = useOS();

  useEffect(() => {
    const handleClick = () => dispatch({ type: 'CLOSE_CONTEXT_MENU' });
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [dispatch]);

  if (!state.contextMenu) return null;

  const { x, y, type } = state.contextMenu;

  const handleAction = (action: () => void) => {
    action();
    dispatch({ type: 'CLOSE_CONTEXT_MENU' });
  };

  return (
    <div 
      className="absolute bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] z-[10000] py-1 shadow-lg"
      style={{ left: x, top: y, minWidth: '150px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {type === 'desktop' && (
        <>
          <button className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white text-sm font-bold" onClick={() => handleAction(() => dispatch({ type: 'OPEN_APP', appId: 'terminal' }))}>Open Terminal</button>
          <button className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white text-sm font-bold" onClick={() => handleAction(() => dispatch({ type: 'OPEN_APP', appId: 'explorer' }))}>Explore Files</button>
          <div className="h-px bg-[#808080] border-b border-[#ffffff] my-1 mx-1" />
          <button className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white text-sm font-bold" onClick={() => handleAction(() => dispatch({ type: 'OPEN_APP', appId: 'settings' }))}>Properties</button>
          <div className="h-px bg-[#808080] border-b border-[#ffffff] my-1 mx-1" />
          <button className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white text-sm font-bold" onClick={() => handleAction(() => window.location.reload())}>Refresh</button>
        </>
      )}
    </div>
  );
};
