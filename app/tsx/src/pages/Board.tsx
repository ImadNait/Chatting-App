import React, { useRef, useState, useEffect } from 'react';
import { Paintbrush, Eraser, RotateCcw, PaintBucket } from 'lucide-react';
import '../styles/partials/_draw.scss';

const DrawingApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'bucket'>('brush');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);

  const colors = [
    '#000000', 
    '#FFFFFF', 
    '#FF0000',
    '#00FF00',
    '#0000FF', 
    '#FFFF00',
    '#FF00FF', 
    '#00FFFF', 
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set initial canvas background to white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Get the color we're trying to replace
    const startPos = (startY * canvas.width + startX) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];
    const startA = pixels[startPos + 3];

    // Convert fill color from hex to RGB
    const fillColorEl = document.createElement('div');
    fillColorEl.style.color = fillColor;
    document.body.appendChild(fillColorEl);
    const computedColor = window.getComputedStyle(fillColorEl).color;
    document.body.removeChild(fillColorEl);
    const [r, g, b] = computedColor.match(/\d+/g)!.map(Number);

    // Queue for flood fill
    const queue: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();

    const matchesStart = (x: number, y: number) => {
      const pos = (y * canvas.width + x) * 4;
      return (
        pixels[pos] === startR &&
        pixels[pos + 1] === startG &&
        pixels[pos + 2] === startB &&
        pixels[pos + 3] === startA
      );
    };

    const setPixel = (x: number, y: number) => {
      const pos = (y * canvas.width + x) * 4;
      pixels[pos] = r;
      pixels[pos + 1] = g;
      pixels[pos + 2] = b;
      pixels[pos + 3] = 255;
    };

    while (queue.length > 0) {
      const [x, y] = queue.pop()!;
      const key = `${x},${y}`;

      if (
        x < 0 || x >= canvas.width ||
        y < 0 || y >= canvas.height ||
        visited.has(key) ||
        !matchesStart(x, y)
      ) {
        continue;
      }

      visited.add(key);
      setPixel(x, y);

      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'bucket') {
      floodFill(Math.round(x), Math.round(y), color);
      return;
    }
    
    setIsDrawing(true);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = size;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'bucket') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="drawing-app">
      <div className="drawing-app-container">
        <canvas
          ref={canvasRef}
          className="drawing-app-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="drawing-app-tools">
          <div className="drawing-app-colors">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`drawing-app-colors-btn ${
                  color === c ? 'active' : ''
                } ${c === '#FFFFFF' ? 'white' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <div className="drawing-app-colors-custom">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <div className="drawing-app-colors-custom-preview" />
            </div>
          </div>

          <div className="drawing-app-controls">
            <div className="drawing-app-controls-slider">
              <input
                type="range"
                min="1"
                max="20"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
              />
            </div>
            <span className="drawing-app-controls-size">{size}px</span>

            <div className="drawing-app-controls-tools">
              <button
                onClick={() => setTool('brush')}
                className={tool === 'brush' ? 'active' : ''}
              >
                <Paintbrush />
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={tool === 'eraser' ? 'active' : ''}
              >
                <Eraser />
              </button>
              <button
                onClick={() => setTool('bucket')}
                className={tool === 'bucket' ? 'active' : ''}
              >
                <PaintBucket />
              </button>
              <button onClick={clearCanvas}>
                <RotateCcw />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingApp;