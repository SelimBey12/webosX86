import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../store/osStore';
import { motion } from 'motion/react';
import { X, Minus, Square, Copy } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  resizable?: boolean;
}

export const Window: React.FC<WindowProps> = ({ 
  id, 
  title, 
  icon, 
  children, 
  defaultWidth = 600, 
  defaultHeight = 400,
  resizable = true
}) => {
  const { state, dispatch } = useOS();
  const windowState = state.windows.find(w => w.id === id);
  const isFocused = state.focusedWindowId === id;
  
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (windowState && windowState.width === 800 && windowState.height === 600) {
      dispatch({
        type: 'UPDATE_WINDOW',
        id,
        updates: { width: defaultWidth, height: defaultHeight, title }
      });
    }
  }, [id, defaultWidth, defaultHeight, title, dispatch, windowState]);

  if (!windowState || windowState.isMinimized) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    dispatch({ type: 'FOCUS_WINDOW', id });
  };

  const handleTitleBarPointerDown = (e: React.PointerEvent) => {
    if (windowState.isMaximized) return;
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleTitleBarPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || windowState.isMaximized) return;
    dispatch({
      type: 'UPDATE_WINDOW',
      id,
      updates: {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      }
    });
  };

  const handleTitleBarPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const toggleMaximize = () => {
    if (windowState.isMaximized) {
      dispatch({ type: 'RESTORE_WINDOW', id });
    } else {
      dispatch({ type: 'MAXIMIZE_WINDOW', id });
    }
  };

  const style: React.CSSProperties = windowState.isMaximized ? {
    top: 0,
    left: 0,
    width: '100%',
    height: 'calc(100% - 32px)',
    zIndex: windowState.zIndex,
  } : {
    top: windowState.y,
    left: windowState.x,
    width: windowState.width,
    height: windowState.height,
    zIndex: windowState.zIndex,
  };

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={`absolute flex flex-col bg-[#c0c0c0] border-2 ${isFocused ? 'border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000]' : 'border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080]'} shadow-none`}
      style={style}
      onPointerDown={handlePointerDown}
    >
      {/* Title Bar */}
      <div 
        className={`flex items-center justify-between px-1 py-0.5 m-0.5 select-none ${isFocused ? 'bg-[#000080] text-white' : 'bg-[#808080] text-[#c0c0c0]'} touch-none`}
        onPointerDown={handleTitleBarPointerDown}
        onPointerMove={handleTitleBarPointerMove}
        onPointerUp={handleTitleBarPointerUp}
        onDoubleClick={toggleMaximize}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          {icon && <div className="w-4 h-4 flex-shrink-0">{icon}</div>}
          <span className="text-xs font-bold truncate">{title}</span>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); dispatch({ type: 'MINIMIZE_WINDOW', id }); }}
            className="w-4 h-4 flex items-center justify-center bg-[#c0c0c0] border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] border-2 active:border-t-[#000000] active:border-l-[#000000] active:border-b-[#ffffff] active:border-r-[#ffffff] text-black"
          >
            <Minus size={10} strokeWidth={3} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
            className="w-4 h-4 flex items-center justify-center bg-[#c0c0c0] border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] border-2 active:border-t-[#000000] active:border-l-[#000000] active:border-b-[#ffffff] active:border-r-[#ffffff] text-black"
          >
            {windowState.isMaximized ? <Copy size={10} strokeWidth={3} /> : <Square size={10} strokeWidth={3} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); dispatch({ type: 'CLOSE_WINDOW', id }); }}
            className="w-4 h-4 flex items-center justify-center bg-[#c0c0c0] border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] border-2 active:border-t-[#000000] active:border-l-[#000000] active:border-b-[#ffffff] active:border-r-[#ffffff] text-black font-bold text-xs"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-[#ffffff] border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] border-2 m-0.5 relative">
        {children}
      </div>

      {/* Resize Handle */}
      {!windowState.isMaximized && resizable && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onPointerDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startW = windowState.width;
            const startH = windowState.height;
            
            const onMove = (moveEvent: PointerEvent) => {
              dispatch({
                type: 'UPDATE_WINDOW',
                id,
                updates: {
                  width: Math.max(200, startW + (moveEvent.clientX - startX)),
                  height: Math.max(100, startH + (moveEvent.clientY - startY))
                }
              });
            };
            
            const onUp = () => {
              window.removeEventListener('pointermove', onMove);
              window.removeEventListener('pointerup', onUp);
            };
            
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
          }}
        />
      )}
    </motion.div>
  );
};
