'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

interface Props {
  onSave: (dataUrl: string) => void;
  label?: string;
  required?: boolean;
}

export const SignaturePad: React.FC<Props> = ({
  onSave,
  label = 'Digital Signature Sign-off',
  required = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Dark canvas background with crisp neon cyan/white ink
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas && hasDrawn) {
        onSave(canvas.toDataURL('image/png'));
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onSave('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-slate-300 flex items-center gap-1.5">
          <PenTool className="h-3.5 w-3.5 text-sky-400" />
          <span>{label}</span>
          {required && <span className="text-red-400">*</span>}
        </label>
        <button
          type="button"
          onClick={clearCanvas}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="relative border-2 border-dashed border-slate-700 rounded-lg overflow-hidden bg-slate-800">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-32 cursor-crosshair touch-none"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-500 text-xs font-sans tracking-wide">
            Draw your signature here using finger or mouse
          </div>
        )}
      </div>

      {hasDrawn && (
        <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
          <Check className="h-3 w-3" /> Digital signature recorded
        </p>
      )}
    </div>
  );
};
