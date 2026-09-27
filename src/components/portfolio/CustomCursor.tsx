'use client';

import React, { useEffect, useState } from 'react';

interface CustomCursorProps {
  themeColor?: string;
}

export function CustomCursor({ themeColor = '#f59e0b' }: CustomCursorProps) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate custom cursor on devices that support hover (non-touch)
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, select, [data-cursor]');
        if (interactive) {
          setIsHovered(true);
          const customText = interactive.getAttribute('data-cursor');
          setCursorText(customText || '');
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Smooth spring effect for trailing outer aura
  useEffect(() => {
    let animationFrameId: number;
    const followCursor = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animationFrameId = requestAnimationFrame(followCursor);
    };
    animationFrameId = requestAnimationFrame(followCursor);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        className="fixed pointer-events-none z-50 rounded-full transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovered ? '8px' : '6px',
          height: isHovered ? '8px' : '6px',
          backgroundColor: themeColor,
          boxShadow: `0 0 10px ${themeColor}, 0 0 20px ${themeColor}`,
        }}
      />

      {/* Fluid Trailing Aura / Ring */}
      <div
        className="fixed pointer-events-none z-50 rounded-full border transition-all duration-200 ease-out flex items-center justify-center -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] font-bold tracking-widest uppercase text-slate-900"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHovered ? (cursorText ? '64px' : '44px') : '28px',
          height: isHovered ? (cursorText ? '64px' : '44px') : '28px',
          borderColor: isHovered ? themeColor : `${themeColor}60`,
          backgroundColor: isHovered ? `${themeColor}25` : 'transparent',
          backdropFilter: isHovered ? 'blur(4px)' : 'none',
          boxShadow: isHovered ? `0 0 25px ${themeColor}40` : 'none',
        }}
      >
        {cursorText && (
          <span
            className="px-1 py-0.5 rounded shadow-sm text-center"
            style={{ backgroundColor: themeColor, color: '#020617' }}
          >
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
