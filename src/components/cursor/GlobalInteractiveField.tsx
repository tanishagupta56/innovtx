'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: 'blue' | 'lime' | 'orange';
}

interface CircuitNode {
  x: number;
  y: number;
  connections: number[];
}

export default function GlobalInteractiveField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathname = usePathname() || '/';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Adapt intensity based on pathname: reduced for productivity dashboards
    const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
    const globalAlphaScale = isDashboard ? 0.35 : 1.0;

    // Palette tokens: Electric Blue (#315EFF), Lime Green (#B8D94C), Burnt Orange (#D65A31)
    const colorBlue = 'rgba(49, 94, 255,';
    const colorLime = 'rgba(184, 217, 76,';
    const colorOrange = 'rgba(214, 90, 49,';

    // Pointer coordinates with smooth easing
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let isMoving = false;
    let isDocVisible = !document.hidden;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initField();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isMoving = true;
    };

    const handleVisibility = () => {
      isDocVisible = !document.hidden;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    document.addEventListener('visibilitychange', handleVisibility);

    let particles: Particle[] = [];
    let circuits: CircuitNode[] = [];

    const initField = () => {
      particles = [];
      circuits = [];
      
      // Responsive lattice density
      const spacing = width < 768 ? 75 : 60;
      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);

      // Create particle grid
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const bx = i * spacing + spacing / 2 + (Math.random() - 0.5) * 12;
          const by = j * spacing + spacing / 2 + (Math.random() - 0.5) * 12;
          const rand = Math.random();
          const type: 'blue' | 'lime' | 'orange' = rand > 0.88 ? 'lime' : (rand > 0.80 ? 'orange' : 'blue');
          
          particles.push({
            baseX: bx,
            baseY: by,
            x: bx,
            y: by,
            vx: 0,
            vy: 0,
            size: type === 'lime' ? 1.8 : (type === 'orange' ? 1.6 : 1.2),
            color: type === 'lime' ? '#B8D94C' : (type === 'orange' ? '#D65A31' : '#315EFF'),
            type,
          });
        }
      }

      // Create circuit traces
      const nodeCount = Math.floor((width * height) / 45000);
      for (let i = 0; i < nodeCount; i++) {
        circuits.push({
          x: Math.random() * width,
          y: Math.random() * height,
          connections: [],
        });
      }

      for (let i = 0; i < circuits.length; i++) {
        for (let j = i + 1; j < circuits.length; j++) {
          const dx = circuits[i].x - circuits[j].x;
          const dy = circuits[i].y - circuits[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            circuits[i].connections.push(j);
          }
        }
      }
    };

    initField();

    // If reduced motion, render single static frame
    if (isReduced) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${colorBlue} 0.15)`;
        ctx.fill();
      }
      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    }

    // Animation frame loop
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      animId = requestAnimationFrame(render);

      if (!isDocVisible) return;

      const delta = Math.min(50, currentTime - lastTime);
      lastTime = currentTime;

      // On touch devices: autonomous gentle drifting ambient locus
      if (isTouch) {
        targetMouseX = width / 2 + Math.cos(currentTime * 0.0004) * (width * 0.3);
        targetMouseY = height / 2 + Math.sin(currentTime * 0.0006) * (height * 0.25);
      }

      // Smooth lerp for fluid liquid inertia
      const dx = targetMouseX - mouseX;
      const dy = targetMouseY - mouseY;
      mouseX += dx * 0.08;
      mouseY += dy * 0.08;

      ctx.clearRect(0, 0, width, height);

      const lensRadius = width < 768 ? 150 : 200;
      const lensRadiusSq = lensRadius * lensRadius;

      // 1. Draw Revealed Circuit Nodes & Vector Lines within Cursor Lens
      ctx.lineWidth = 1;
      for (let i = 0; i < circuits.length; i++) {
        const node = circuits[i];
        const distSqToMouse = (node.x - mouseX) * (node.x - mouseX) + (node.y - mouseY) * (node.y - mouseY);

        if (distSqToMouse < lensRadiusSq * 1.3) {
          const proximity = 1 - Math.sqrt(distSqToMouse) / (lensRadius * 1.15);
          const alpha = Math.max(0, Math.min(1, proximity * 0.75)) * globalAlphaScale;

          // Draw node
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `${colorLime} ${alpha})`;
          ctx.fill();

          // Draw connecting traces
          for (const targetIdx of node.connections) {
            const target = circuits[targetIdx];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `${colorBlue} ${alpha * 0.45})`;
            ctx.stroke();
          }
        }
      }

      // 2. Liquid Lattice Particles Displacement & Spring Return
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pdx = mouseX - p.x;
        const pdy = mouseY - p.y;
        const pDist = Math.sqrt(pdx * pdx + pdy * pdy);

        // Fluid repulsion force
        if (pDist < lensRadius && pDist > 0) {
          const force = (1 - pDist / lensRadius) * 20;
          const angle = Math.atan2(pdy, pdx);
          p.vx -= Math.cos(angle) * force * 0.14;
          p.vy -= Math.sin(angle) * force * 0.14;
        }

        // Elastic spring back to home position
        const springX = (p.baseX - p.x) * 0.045;
        const springY = (p.baseY - p.y) * 0.045;
        p.vx = (p.vx + springX) * 0.82;
        p.vy = (p.vy + springY) * 0.82;

        p.x += p.vx;
        p.y += p.vy;

        const insideLens = pDist < lensRadius;
        const baseAlpha = insideLens ? 0.85 : 0.18;
        const finalAlpha = baseAlpha * globalAlphaScale;

        ctx.beginPath();
        ctx.arc(p.x, p.y, insideLens ? p.size * 1.4 : p.size, 0, Math.PI * 2);

        if (p.type === 'lime') {
          ctx.fillStyle = `${colorLime} ${finalAlpha})`;
        } else if (p.type === 'orange') {
          ctx.fillStyle = `${colorOrange} ${finalAlpha})`;
        } else {
          ctx.fillStyle = `${colorBlue} ${finalAlpha})`;
        }
        ctx.fill();

        // Connect neighboring displaced particles inside lens
        if (insideLens) {
          for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
            const p2 = particles[j];
            const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist2 < 45) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `${colorBlue} ${0.22 * globalAlphaScale})`;
              ctx.stroke();
            }
          }
        }
      }

      // 3. Fluid Radial Glow at Cursor Position
      const radialGradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        lensRadius
      );
      radialGradient.addColorStop(0, `${colorBlue} ${0.16 * globalAlphaScale})`);
      radialGradient.addColorStop(0.5, `${colorBlue} ${0.05 * globalAlphaScale})`);
      radialGradient.addColorStop(1, 'rgba(8, 11, 18, 0)');

      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, lensRadius, 0, Math.PI * 2);
      ctx.fill();

      // 4. Subtle Outer Reticle Ring
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, lensRadius * 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = `${colorBlue} ${0.10 * globalAlphaScale})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (!isTouch) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
