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

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
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
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  if (!isClient) {
    return <div className="fixed inset-0 pointer-events-none -z-10 bg-midnight-950" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Lighting Environment */}
          <ambientLight intensity={0.4} />
          
          {/* Electric Cobalt Blue Primary Key Light */}
          <pointLight position={[5, 4, 4]} intensity={25} color="#1558C9" distance={20} />
          <pointLight position={[-5, -3, 3]} intensity={18} color="#0d3b8c" distance={18} />

          {/* Acid Lime Accent Rim Light */}
          <spotLight
            position={[0, 6, 2]}
            intensity={35}
            color="#D4FF24"
            angle={0.6}
            penumbra={0.8}
            distance={15}
          />

          {/* Fill Light from below */}
          <pointLight position={[0, -5, -2]} intensity={10} color="#38bdf8" distance={15} />

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
