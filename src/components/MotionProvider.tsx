'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const lenis = new Lenis({
      duration: 0.9, // Snappy & responsive
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenisRef.current = null;
    };
  }, []);

  // On route change: reset scroll immediately & refresh ScrollTrigger
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    // Give DOM a frame to update, then clean up obsolete triggers and refresh
    const timeout = setTimeout(() => {
      ScrollTrigger.getAll().forEach((t) => {
        // Kill triggers that lost their DOM targets
        if (!t.trigger || !document.contains(t.trigger as Node)) {
          t.kill();
        }
      });
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
