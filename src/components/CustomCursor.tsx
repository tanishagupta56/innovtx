'use client';

import { useEffect, useRef, useState } from 'react';
import GlobalInteractiveBackground from './cursor/GlobalInteractiveBackground';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Touch detection & screen check
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktopMode = !hasTouch && window.innerWidth >= 1024 && !isReduced;
    setIsDesktop(desktopMode);

    if (!desktopMode) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Physics loop for trailing elements
    const render = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Dynamic hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('[data-magnetic]')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Global Interactive Background Field */}
      <GlobalInteractiveBackground />

      {isDesktop && (
        <>
          {/* Subtle Trailing Cursor Ring */}
          <div
            ref={ringRef}
            className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] transition-all duration-150 ease-out ${
              isHovered
                ? 'w-11 h-11 -ml-[22px] -mt-[22px] border border-lime-green bg-lime-green/5'
                : isClicking
                ? 'w-6 h-6 -ml-3 -mt-3 border border-electric-blue scale-90'
                : 'w-8 h-8 -ml-4 -mt-4 border border-electric-blue/40'
            }`}
          />

          {/* Center pinpoint */}
          <div
            ref={dotRef}
            className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full pointer-events-none z-[10000] transition-colors duration-150 ${
              isHovered ? 'bg-lime-green scale-125' : 'bg-electric-blue'
            }`}
          />
        </>
      )}
    </>
  );
}
