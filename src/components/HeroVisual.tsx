'use client';

import { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  isAccent: boolean;
}

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', onResize);

    // Generate 3D point lattice on multiple rings (Hyper-Sphere/Torus structure)
    const points: Point3D[] = [];
    const numRings = 16;
    const pointsPerRing = 26;
    const radius = Math.min(width, height) * 0.38;

    for (let i = 0; i < numRings; i++) {
      const phi = (Math.PI * (i + 1)) / (numRings + 1);
      const ringRadius = radius * Math.sin(phi);
      const y = radius * Math.cos(phi);

      for (let j = 0; j < pointsPerRing; j++) {
        const theta = (2 * Math.PI * j) / pointsPerRing;
        const x = ringRadius * Math.cos(theta);
        const z = ringRadius * Math.sin(theta);
        const isAccent = (i * pointsPerRing + j) % 11 === 0;

        points.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          isAccent,
        });
      }
    }

    // Outer orbital rings
    const orbitalPoints: Point3D[] = [];
    for (let k = 0; k < 60; k++) {
      const angle = (2 * Math.PI * k) / 60;
      const r = radius * 1.35;
      orbitalPoints.push({
        x: r * Math.cos(angle),
        y: r * Math.sin(angle) * 0.35,
        z: r * Math.sin(angle),
        baseX: r * Math.cos(angle),
        baseY: r * Math.sin(angle) * 0.35,
        baseZ: r * Math.sin(angle),
        isAccent: k % 15 === 0,
      });
    }

    // Interactive mouse rotation with damping
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let autoAngle = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 1.8;
      targetRotX = -ny * 1.8;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth inertia rotation
      autoAngle += 0.007;
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      const rotY = currentRotY + autoAngle;
      const rotX = currentRotX + Math.sin(autoAngle * 0.5) * 0.2;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const fov = 420;
      const centerX = width / 2;
      const centerY = height / 2;

      // Project vertices to 2D
      const projected = points.map((p) => {
        // Y-axis rotation
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        // X-axis rotation
        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        // Perspective projection
        const scale = fov / (fov + z2 + radius * 1.5);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        return { px, py, scale, z: z2, isAccent: p.isAccent };
      });

      // Sort by depth for correct visual occlusion
      projected.sort((a, b) => a.z - b.z);

      // Draw connecting mesh lines between neighbors
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        // Connect to next ring node
        if ((i + 1) % pointsPerRing !== 0 && i + 1 < projected.length) {
          const p2 = projected[i + 1];
          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          if (dist < 60) {
            const alpha = Math.max(0.04, Math.min(0.35, (p1.scale - 0.4) * 0.6));
            ctx.strokeStyle = `rgba(21, 88, 201, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Draw glowing vertices
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const dotSize = Math.max(1, p.scale * (p.isAccent ? 3.5 : 2.2));

        if (p.isAccent) {
          // Acid lime accent node
          ctx.fillStyle = '#D4FF24';
          ctx.shadowColor = '#D4FF24';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(p.px, p.py, dotSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Electric cobalt node
          const alpha = Math.max(0.2, Math.min(0.9, (p.scale - 0.3) * 1.2));
          ctx.fillStyle = `rgba(45, 116, 255, ${alpha})`;
          ctx.shadowColor = '#1558C9';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.px, p.py, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw dynamic outer orbital halo
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(21, 88, 201, 0.25)';
      ctx.beginPath();
      for (let k = 0; k < orbitalPoints.length; k++) {
        const op = orbitalPoints[k];
        const x1 = op.baseX * Math.cos(-autoAngle * 0.8) - op.baseZ * Math.sin(-autoAngle * 0.8);
        const z1 = op.baseZ * Math.cos(-autoAngle * 0.8) + op.baseX * Math.sin(-autoAngle * 0.8);
        const y2 = op.baseY * Math.cos(0.4) - z1 * Math.sin(0.4);
        const z2 = z1 * Math.cos(0.4) + op.baseY * Math.sin(0.4);

        const scale = fov / (fov + z2 + radius * 1.5);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);

        if (op.isAccent) {
          ctx.fillStyle = '#D4FF24';
          ctx.fillRect(px - 2, py - 2, 4, 4);
        }
      }
      ctx.closePath();
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[580px] lg:min-h-[700px] flex items-center justify-center select-none pointer-events-none">
      {/* Radial backlight glow behind 3D object */}
      <div className="absolute w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full bg-cobalt/25 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute w-[180px] h-[180px] rounded-full bg-lime/10 blur-[80px] pointer-events-none -z-10" />

      {/* Procedural Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain pointer-events-auto"
      />

      {/* Futuristic Floating Telemetry HUD brackets */}
      <div className="absolute top-6 left-6 font-mono text-[10px] text-gray-500 uppercase flex flex-col gap-1 border-l border-t border-cobalt/40 pl-2 pt-2">
        <span className="text-lime font-bold">{'// ORBITAL DYNAMICS'}</span>
        <span>NODE LATENCY: 0.14ms</span>
        <span>RENDER: DUAL-PHASE HARMONIC</span>
      </div>

      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-gray-500 uppercase flex flex-col gap-1 border-r border-b border-cobalt/40 pr-2 pb-2 text-right">
        <span className="text-cobalt-300 font-bold">28.6652° N, 77.2324° E</span>
        <span>{'IGDTUW CAMPUS // NEW DELHI'}</span>
      </div>
    </div>
  );
}
