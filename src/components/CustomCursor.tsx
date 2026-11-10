'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
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
    let auraX = mouseX;
    let auraY = mouseY;
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

    // Smooth physics loop for the trailing ring and ambient light aura
    const render = () => {
      // Lerp for ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      // Slower lerp for ambient glow
      auraX += (mouseX - auraX) * 0.08;
      auraY += (mouseY - auraY) * 0.08;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
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
        target.closest('select')
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

  if (!isDesktop) return null;

  return (
    <>
      {/* Ambient reactive cursor spotlight */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 w-[500px] h-[500px] -ml-[250px] -mt-[250px] rounded-full pointer-events-none z-[9990] opacity-30 mix-blend-screen transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(21, 88, 201, 0.35) 0%, rgba(212, 255, 36, 0.06) 40%, transparent 70%)',
        }}
      />

      {/* Trailing electric ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] -ml-5 -mt-5 transition-all duration-150 ease-out ${
          isHovered
            ? 'w-16 h-16 -ml-8 -mt-8 border-2 border-lime bg-lime/10 shadow-[0_0_20px_rgba(212,255,36,0.3)]'
            : isClicking
            ? 'w-8 h-8 -ml-4 -mt-4 border border-cobalt-bright scale-90'
            : 'w-10 h-10 border border-cobalt/60'
        }`}
      />

      {/* Center pinpoint */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full pointer-events-none z-[10000] transition-colors duration-150 ${
          isHovered ? 'bg-lime scale-150' : 'bg-white'
        }`}
      />
    </>
  );
}
