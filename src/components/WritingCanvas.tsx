import React, { useRef, useEffect, useState } from 'react';
import { KannadaLetter } from '../types';
import { audioFeedback } from '../data/letters';
import { Eraser } from 'lucide-react';

interface WritingCanvasProps {
  letter: KannadaLetter;
  onStrokeComplete?: (accuracy: number) => void;
  mode: 'learning' | 'practice';
}

export function WritingCanvas({ letter, onStrokeComplete, mode }: WritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.strokeStyle = mode === 'learning' ? '#9333EA' : '#000000';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Draw guide letter if in learning mode
    if (mode === 'learning') {
      ctx.globalAlpha = 0.2;
      ctx.font = '120px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter.unicode, canvas.width / 2, canvas.height / 2);
      
      // Draw stroke order guides
      ctx.strokeStyle = '#E5E7EB';
      letter.strokeOrder.forEach(path => {
        const pathObj = new Path2D(path);
        ctx.stroke(pathObj);
      });
      
      ctx.globalAlpha = 1;
    }
  }, [letter, mode]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);

    // Redraw guide if in learning mode
    if (mode === 'learning') {
      ctx.globalAlpha = 0.2;
      ctx.font = '120px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter.unicode, canvas.width / 2, canvas.height / 2);
      ctx.globalAlpha = 1;
    }
  };

  const calculateAccuracy = (userPoints: Array<{ x: number; y: number }>) => {
    const tolerance = 20; // pixels
    let matchedPoints = 0;

    userPoints.forEach(userPoint => {
      letter.points.forEach(letterPoint => {
        const distance = Math.sqrt(
          Math.pow(userPoint.x - letterPoint.x, 2) + 
          Math.pow(userPoint.y - letterPoint.y, 2)
        );
        if (distance < tolerance) {
          matchedPoints++;
        }
      });
    });

    return (matchedPoints / letter.points.length) * 100;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setPoints([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setPoints(prev => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (points.length > 0) {
      const accuracy = calculateAccuracy(points);
      if (onStrokeComplete) {
        onStrokeComplete(accuracy);
      }
      
      if (accuracy > 80) {
        audioFeedback.success.play();
      } else {
        audioFeedback.error.play();
      }
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="bg-white rounded-xl shadow-lg touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <button
        onClick={clearCanvas}
        className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        <Eraser className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
}