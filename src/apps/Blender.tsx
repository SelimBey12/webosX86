import React, { useEffect, useRef } from 'react';
import { Window } from '../components/Window';
import { Box } from 'lucide-react';

export const BlenderApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let lastDraw = 0;

    const draw = (time: number) => {
      requestAnimationFrame(draw);
      
      // Throttle to 15Hz
      if (time - lastDraw < 1000 / 15) return;
      lastDraw = time;

      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const size = 100;

      const nodes = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ];

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      angle += 0.05;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      const projected = nodes.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * cos - z * sin;
        let z1 = z * cos + x * sin;
        // Rotate X
        let y2 = y * cos - z1 * sin;
        let z2 = z1 * cos + y * sin;
        
        // Perspective
        const scale = 200 / (200 + z2 * size);
        return [cx + x1 * size * scale, cy + y2 * size * scale];
      });

      ctx.beginPath();
      edges.forEach(([a, b]) => {
        ctx.moveTo(projected[a][0], projected[a][1]);
        ctx.lineTo(projected[b][0], projected[b][1]);
      });
      ctx.stroke();
    };

    requestAnimationFrame(draw);
  }, []);

  return (
    <Window id={windowId} title="Blender 1.0" icon={<Box size={14} />} defaultWidth={500} defaultHeight={400}>
      <div className="flex flex-col h-full bg-[#c0c0c0] text-black font-sans text-sm p-1">
        <div className="flex gap-2 mb-1 border-b-2 border-[#808080] pb-1">
          <button className="px-2 border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080]">File</button>
          <button className="px-2 border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080]">Edit</button>
          <button className="px-2 border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080]">Render</button>
        </div>
        <div className="flex-1 border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] bg-[#c0c0c0] relative">
          <canvas 
            ref={canvasRef} 
            width={480} 
            height={340} 
            className="w-full h-full"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="absolute top-2 left-2 font-mono text-xs font-bold">Camera 1</div>
        </div>
      </div>
    </Window>
  );
};
