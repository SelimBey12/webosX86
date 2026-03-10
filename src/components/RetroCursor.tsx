import React, { useEffect, useState } from 'react';

export const RetroCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [type, setType] = useState('default');

  useEffect(() => {
    let lastUpdate = 0;
    const handleMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastUpdate > 1000 / 15) { // 15Hz throttle
        setPos({ x: e.clientX, y: e.clientY });
        lastUpdate = now;
        
        // Determine cursor type
        let currentType = 'default';
        const target = e.target as HTMLElement;
        if (target) {
          const style = window.getComputedStyle(target).cursor;
          if (style === 'pointer' || target.tagName === 'BUTTON') currentType = 'pointer';
          else if (style === 'text' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') currentType = 'text';
          else if (style === 'wait') currentType = 'wait';
        }
        setType(currentType);
      }
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[9999999]"
      style={{ left: pos.x, top: pos.y, transform: type === 'pointer' ? 'translate(-4px, -2px)' : type === 'text' ? 'translate(-12px, -12px)' : 'translate(0, 0)' }}
    >
      {type === 'pointer' ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0h2v2h2v2h2v2h2v2h2v2h-2v2h2v2h-4v2h-2v2h-2v2H8v-2H6v-2H4v-2H2v-2h2V8h2V6h2V4h2V2H8V0z" fill="white"/>
          <path d="M10 2h2v2h2v2h2v2h-2v2h2v2h-4v2h-2v2H8v-2H6v-2H4v-2h2V8h2V6h2V4h2V2z" fill="black"/>
        </svg>
      ) : type === 'text' ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0h4v2h-2v16h2v2h-4v-2h2V2h-2V0z" fill="black"/>
          <path d="M11 1h2v18h-2V1z" fill="white"/>
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h-6v2h2v2h2v2h-2v2h-2v-2h-2v-2h-2v2H8v2H6v-2H8v-2h2v-2H6v2H4v-2H2v-2H0V0z" fill="black"/>
          <path d="M2 2h2v2h2v2h2v2h2v2h2v2h2v2h-4v2h2v2h2v2h-2v-2h-2v-2h-2v2H8v2H6v-2H8v-2h2v-2H4v-2H2V2z" fill="white"/>
        </svg>
      )}
    </div>
  );
};
