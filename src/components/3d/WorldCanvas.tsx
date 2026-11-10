'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { DigitalCore } from './DigitalCore';
import { SceneController } from './SceneController';

export function WorldCanvas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    let rafId: number;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          if (total > 0) {
            setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setPointerPos({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  if (!isClient) {
    return <div className="fixed inset-0 pointer-events-none -z-10 bg-deep-ink" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none' }}
        className="w-full h-full pointer-events-none"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />

          {/* Electric Blue Key Lights */}
          <pointLight position={[5, 4, 4]} intensity={25} color="#315EFF" distance={20} />
          <pointLight position={[-5, -3, 3]} intensity={18} color="#1E44D6" distance={18} />

          {/* Lime Green Accent Rim Light */}
          <spotLight
            position={[0, 6, 2]}
            intensity={25}
            color="#B8D94C"
            angle={0.6}
            penumbra={0.8}
            distance={15}
          />

          {/* Burnt Orange Subtle Fill Light from below */}
          <pointLight position={[0, -5, -2]} intensity={10} color="#D65A31" distance={15} />

          {/* Scene Camera Controller */}
          <SceneController scrollProgress={scrollProgress} pointerPos={pointerPos} />

          {/* 3D Digital Intelligence Core */}
          <DigitalCore scrollProgress={scrollProgress} pointerPos={pointerPos} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default WorldCanvas;
