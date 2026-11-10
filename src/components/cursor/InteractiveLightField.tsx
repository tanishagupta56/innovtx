'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  isCyan: boolean;
}

interface CircuitNode {
  x: number;
  y: number;
  connections: number[];
}

export default function InteractiveLightField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Eased pointer coordinates
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let mouseSpeed = 0;
    let isMoving = false;
    let lastMoveTime = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initField();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isMoving = true;
      lastMoveTime = performance.now();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initialize particle grid
    let particles: Particle[] = [];
    let circuits: CircuitNode[] = [];

    const initField = () => {
      particles = [];
      circuits = [];
      const cols = Math.floor(width / 60);
      const rows = Math.floor(height / 60);

      // Create lattice particles
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const bx = i * 60 + 30 + (Math.random() - 0.5) * 15;
          const by = j * 60 + 30 + (Math.random() - 0.5) * 15;
          const isCyan = Math.random() > 0.65;
          particles.push({
            baseX: bx,
            baseY: by,
            x: bx,
            y: by,
            vx: 0,
            vy: 0,
            size: isCyan ? 1.8 : 1.2,
            color: isCyan ? '#75E6FF' : '#315EFF',
            isCyan,
          });
        }
      }

      // Create circuit traces
      const nodeCount = Math.floor((width * height) / 35000);
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
          if (dist < 140) {
            circuits[i].connections.push(j);
          }
        }
      }
    };

    initField();

    // Render loop
    const render = (time: number) => {
      // Smooth lerp for liquid inertia
      const dx = targetMouseX - mouseX;
      const dy = targetMouseY - mouseY;
      mouseX += dx * 0.085;
      mouseY += dy * 0.085;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);

      ctx.clearRect(0, 0, width, height);

      const lensRadius = 190;
      const lensRadiusSq = lensRadius * lensRadius;

      // 1. Draw Revealed Hidden Circuit Matrix inside Lens
      ctx.lineWidth = 1;
      for (let i = 0; i < circuits.length; i++) {
        const node = circuits[i];
        const distSqToMouse = (node.x - mouseX) * (node.x - mouseX) + (node.y - mouseY) * (node.y - mouseY);

        if (distSqToMouse < lensRadiusSq * 1.4) {
          const proximity = 1 - Math.sqrt(distSqToMouse) / (lensRadius * 1.2);
          const alpha = Math.max(0, Math.min(1, proximity * 0.8));

          // Draw node
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(117, 230, 255, ${alpha})`;
          ctx.fill();

          // Draw connections
          for (const targetIdx of node.connections) {
            const target = circuits[targetIdx];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(49, 94, 255, ${alpha * 0.45})`;
            ctx.stroke();
          }
        }
      }

      // 2. Liquid Grid Distortion & Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pdx = mouseX - p.x;
        const pdy = mouseY - p.y;
        const pDist = Math.sqrt(pdx * pdx + pdy * pdy);

        // Fluid displacement repulsion
        if (pDist < lensRadius && pDist > 0) {
          const force = (1 - pDist / lensRadius) * 22;
          const angle = Math.atan2(pdy, pdx);
          p.vx -= Math.cos(angle) * force * 0.15;
          p.vy -= Math.sin(angle) * force * 0.15;
        }

        // Return spring to base
        const springX = (p.baseX - p.x) * 0.045;
        const springY = (p.baseY - p.y) * 0.045;
        p.vx = (p.vx + springX) * 0.82;
        p.vy = (p.vy + springY) * 0.82;

        p.x += p.vx;
        p.y += p.vy;

        // Proximity illumination
        const insideLens = pDist < lensRadius;
        const alpha = insideLens ? 0.85 : 0.18;

        ctx.beginPath();
        ctx.arc(p.x, p.y, insideLens ? p.size * 1.5 : p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isCyan
          ? `rgba(117, 230, 255, ${alpha})`
          : `rgba(49, 94, 255, ${alpha})`;
        ctx.fill();

        // Connect nearby displaced particles inside lens
        if (insideLens) {
          for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
            const p2 = particles[j];
            const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist2 < 45) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(117, 230, 255, 0.25)`;
              ctx.stroke();
            }
          }
        }
      }

      // 3. Fluid Light Field Glow at Cursor Position
      const radialGradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        lensRadius
      );
      radialGradient.addColorStop(0, 'rgba(117, 230, 255, 0.18)');
      radialGradient.addColorStop(0.4, 'rgba(49, 94, 255, 0.10)');
      radialGradient.addColorStop(1, 'rgba(8, 11, 18, 0)');

      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, lensRadius, 0, Math.PI * 2);
      ctx.fill();

      // 4. Subtle Outer Lens Boundary Ring
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, lensRadius * 0.88, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(117, 230, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
