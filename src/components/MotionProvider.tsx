'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const desktopCheck = !hasTouch && window.innerWidth >= 1024;
    setIsDesktop(desktopCheck);

    // Initialize Lenis smooth scroll if reduced motion is disabled
    let lenis: Lenis | null = null;
    let reqId: number | null = null;

    if (!isReduced) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        reqId = requestAnimationFrame(raf);
      };
      reqId = requestAnimationFrame(raf);
    }

    // Cursor glow handler
    if (desktopCheck && !isReduced) {
      const handleMouseMove = (e: MouseEvent) => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (reqId) cancelAnimationFrame(reqId);
        lenis?.destroy();
      };
    }

    return () => {
      if (reqId) cancelAnimationFrame(reqId);
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      {isDesktop && (
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 w-[450px] h-[450px] -ml-[225px] -mt-[225px] rounded-full pointer-events-none z-[9998] transition-transform duration-75 ease-out opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(21, 88, 201, 0.25) 0%, rgba(212, 255, 36, 0.05) 35%, transparent 70%)',
          }}
        />
      )}
      {children}
    </>
  );
}
