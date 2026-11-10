'use client';

import React, { useEffect, useRef } from 'react';

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 550);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 550);

    let mouseX = width * 0.5;
    let mouseY = height * 0.5;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Render loop: Abstract generative parametric wave ribbons
    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      // Lerp mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const time = now * 0.0012;
      const numRibbons = 5;
      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // Cursor influence normalized (-1 to 1)
      const normMouseX = (mouseX / width - 0.5) * 2;
      const normMouseY = (mouseY / height - 0.5) * 2;

      // Soft backdrop ambient glow behind ribbons
      const ambientGlow = ctx.createRadialGradient(
        centerX + normMouseX * 30,
        centerY + normMouseY * 30,
        0,
        centerX,
        centerY,
        width * 0.45
      );
      ambientGlow.addColorStop(0, 'rgba(49, 94, 255, 0.16)');
      ambientGlow.addColorStop(0.5, 'rgba(184, 217, 76, 0.03)');
      ambientGlow.addColorStop(1, 'rgba(8, 11, 18, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Draw elegant flowing parametric spline ribbons
      for (let i = 0; i < numRibbons; i++) {
        const offset = (i / numRibbons) * Math.PI * 2;
        const radius = Math.min(width, height) * (0.24 + i * 0.035);

        ctx.beginPath();
        const steps = 72;

        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2;
          // Harmonic wave distortion
          const wave =
            Math.sin(theta * 3 + time + offset) * 16 +
            Math.cos(theta * 2 - time * 0.8) * 10 +
            Math.sin(theta * 5 + normMouseX * 2) * 8 * (1 - s / steps);

          const r = radius + wave;
          const px = centerX + Math.cos(theta) * r + normMouseX * (i * 6);
          const py = centerY + Math.sin(theta) * (r * 0.75) + normMouseY * (i * 6);

          if (s === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        ctx.closePath();

        // Stroke styling: gradient with Electric Blue and Lime Green subtle accent
        const isAccent = i === 2;
        ctx.strokeStyle = isAccent
          ? 'rgba(184, 217, 76, 0.28)'
          : `rgba(49, 94, 255, ${0.18 + (i / numRibbons) * 0.2})`;
        ctx.lineWidth = isAccent ? 1.4 : 1.0;
        ctx.stroke();
      }

      // Draw subtle orbital particles along the ribbon flow
      for (let p = 0; p < 8; p++) {
        const pAngle = time * 0.6 + (p * Math.PI) / 4;
        const pRadius = Math.min(width, height) * 0.28 + Math.sin(time + p) * 12;
        const px = centerX + Math.cos(pAngle) * pRadius + normMouseX * 14;
        const py = centerY + Math.sin(pAngle) * (pRadius * 0.75) + normMouseY * 14;

        ctx.beginPath();
        ctx.arc(px, py, p % 3 === 0 ? 2 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle = p % 3 === 0 ? '#B8D94C' : '#315EFF';
        ctx.shadowColor = '#315EFF';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] flex items-center justify-center select-none pointer-events-none">
      {/* Abstract Ambient Artwork Canvas */}
      <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-auto" />

      {/* Understated Minimal Studio Badges (Clean Editorial Design) */}
      <div className="absolute top-6 left-6 font-mono text-[11px] text-muted-text flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-lime-green animate-pulse" />
        <span className="text-soft-white font-medium tracking-wider">GENERATIVE SYSTEM</span>
        <span className="text-slate-500">/ 01</span>
      </div>

      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-muted-text text-right hidden sm:block">
        <span className="block text-slate-400">CREATIVE ENGINEERING</span>
        <span className="block text-slate-500">IGDTUW NEW DELHI</span>
      </div>
    </div>
  );
}
