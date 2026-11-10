'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface SoftRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface AmbientOrb {
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  phase: number;
}

export default function GlobalInteractiveBackground() {
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

    // Soft palette tokens
    const blue = 'rgba(49, 94, 255,';
    const lime = 'rgba(184, 217, 76,';
    const orange = 'rgba(214, 90, 49,';

    // Slightly toned alpha for internal dashboard tools
    const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
    const alphaScale = isDashboard ? 0.6 : 1.0;

    // Cursor coordinates with buttery fluid inertia
    let mouseX = width * 0.5;
    let mouseY = height * 0.4;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let isDocVisible = !document.hidden;

    // 1. Organic Ambient Orbs (Soft Gradient Mesh)
    const orbs: AmbientOrb[] = [
      {
        baseX: width * 0.25,
        baseY: height * 0.3,
        radius: Math.max(width, height) * 0.42,
        color: `${blue} 0.12)`,
        speedX: 0.0004,
        speedY: 0.0003,
        phase: 0,
      },
      {
        baseX: width * 0.75,
        baseY: height * 0.65,
        radius: Math.max(width, height) * 0.38,
        color: `${blue} 0.09)`,
        speedX: 0.0003,
        speedY: 0.0005,
        phase: Math.PI * 0.6,
      },
      {
        baseX: width * 0.85,
        baseY: height * 0.25,
        radius: Math.max(width, height) * 0.26,
        color: `${lime} 0.035)`,
        speedX: 0.0005,
        speedY: 0.0004,
        phase: Math.PI * 1.2,
      },
      {
        baseX: width * 0.15,
        baseY: height * 0.8,
        radius: Math.max(width, height) * 0.24,
        color: `${orange} 0.025)`,
        speedX: 0.0004,
        speedY: 0.0006,
        phase: Math.PI * 1.8,
      },
    ];

    // 2. Fine Micro-Particles
    let particles: Particle[] = [];
    const initParticles = () => {
      particles = [];
      const count = width < 768 ? 32 : 55;
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const rand = Math.random();
        const color = rand > 0.88 ? lime : rand > 0.76 ? orange : blue;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: rand > 0.85 ? 1.4 : 0.9,
          color,
          alpha: (0.15 + Math.random() * 0.25) * alphaScale,
        });
      }
    };

    // 3. Subtle Wave Contour Points (Delicate, Minimal Grid Displacement)
    const waveCols = width < 768 ? 16 : 24;
    const waveRows = width < 768 ? 12 : 16;
    let wavePoints: { x: number; y: number; ox: number; oy: number; vx: number; vy: number }[][] = [];

    const initWaveGrid = () => {
      wavePoints = [];
      const colStep = width / (waveCols - 1);
      const rowStep = height / (waveRows - 1);
      for (let c = 0; c < waveCols; c++) {
        wavePoints[c] = [];
        for (let r = 0; r < waveRows; r++) {
          const ox = c * colStep;
          const oy = r * rowStep;
          wavePoints[c][r] = {
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
          };
        }
      }
    };

    let ripples: SoftRipple[] = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
      initWaveGrid();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      // Gentle, understated ripple
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 8,
        maxRadius: Math.min(width, height) * 0.35,
        opacity: 0.16 * alphaScale,
        speed: 2.8,
      });
    };

    const handleVisibility = () => {
      isDocVisible = !document.hidden;
    };

    handleResize();

    window.addEventListener('resize', handleResize, { passive: true });
    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('click', handleClick, { passive: true });
    }
    document.addEventListener('visibilitychange', handleVisibility);

    // Reduced motion: static subtle atmospheric gradient
    if (isReduced) {
      ctx.clearRect(0, 0, width, height);
      const g = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.4, width * 0.6);
      g.addColorStop(0, `${blue} 0.1)`);
      g.addColorStop(1, 'rgba(8, 11, 18, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    }

    let lastTime = performance.now();

    // Render loop
    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      if (!isDocVisible) return;

      const dt = Math.min(35, now - lastTime);
      lastTime = now;

      // Touch / Ambient gentle drifting
      if (isTouch) {
        targetMouseX = width * 0.5 + Math.cos(now * 0.0005) * (width * 0.25);
        targetMouseY = height * 0.45 + Math.sin(now * 0.0007) * (height * 0.2);
      }

      // Smooth fluid lerp for cursor
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      const mouseDeltaX = mouseX - prevMouseX;
      const mouseDeltaY = mouseY - prevMouseY;
      const mouseSpeed = Math.hypot(mouseDeltaX, mouseDeltaY);
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      // Occasional faint ripple on brisk movement
      if (mouseSpeed > 4.5 && Math.random() < 0.08 && ripples.length < 3) {
        ripples.push({
          x: mouseX,
          y: mouseY,
          radius: 12,
          maxRadius: Math.min(220, mouseSpeed * 12 + 80),
          opacity: 0.11 * alphaScale,
          speed: 2.2,
        });
      }

      ctx.clearRect(0, 0, width, height);

      // 1. ORGANIC FLOWING GRADIENT MESHES (Soft & Atmospheric)
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        const ox = orb.baseX + Math.sin(now * orb.speedX + orb.phase) * (width * 0.12);
        const oy = orb.baseY + Math.cos(now * orb.speedY + orb.phase) * (height * 0.1);

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(0.65, orb.color.replace(/[\d\.]+\)$/, '0.015)'));
        grad.addColorStop(1, 'rgba(8, 11, 18, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. SOFT CURSOR RADIAL LIGHT FIELD (Delicate, Ambient)
      const cursorGlowRadius = width < 768 ? 200 : 300;
      const cursorGrad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        cursorGlowRadius
      );
      cursorGrad.addColorStop(0, `${blue} ${0.11 * alphaScale})`);
      cursorGrad.addColorStop(0.45, `${blue} ${0.035 * alphaScale})`);
      cursorGrad.addColorStop(0.75, `${lime} ${0.01 * alphaScale})`);
      cursorGrad.addColorStop(1, 'rgba(8, 11, 18, 0)');

      ctx.fillStyle = cursorGrad;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, cursorGlowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. SUBTLE SURFACE CONTOUR WOBBLE (Delicate, Soft Organic Lines)
      const deformRadius = 180;
      const deformRadiusSq = deformRadius * deformRadius;
      const springK = 0.04;
      const damping = 0.88;

      for (let c = 0; c < waveCols; c++) {
        for (let r = 0; r < waveRows; r++) {
          const pt = wavePoints[c][r];
          const dx = pt.x - mouseX;
          const dy = pt.y - mouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < deformRadiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            // Low, organic displacement: max ~8-12px
            const factor = 1 - dist / deformRadius;
            const push = factor * factor * (7 + mouseSpeed * 0.2);
            const angle = Math.atan2(dy, dx);
            pt.vx += Math.cos(angle) * push * 0.08;
            pt.vy += Math.sin(angle) * push * 0.08;
          }

          // Spring return to rest
          pt.vx = (pt.vx + (pt.ox - pt.x) * springK) * damping;
          pt.vy = (pt.vy + (pt.oy - pt.y) * springK) * damping;

          pt.x += pt.vx;
          pt.y += pt.vy;
        }
      }

      // Draw very faint horizontal contour ribbons that bend with the liquid surface
      ctx.lineWidth = 0.75;
      for (let r = 1; r < waveRows - 1; r += 2) {
        ctx.beginPath();
        ctx.moveTo(wavePoints[0][r].x, wavePoints[0][r].y);
        for (let c = 1; c < waveCols; c++) {
          const prev = wavePoints[c - 1][r];
          const curr = wavePoints[c][r];
          const mx = (prev.x + curr.x) * 0.5;
          const my = (prev.y + curr.y) * 0.5;
          ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
        }
        ctx.strokeStyle = `${blue} ${0.035 * alphaScale})`;
        ctx.stroke();
      }

      // 4. SOFT RIPPLES (Understated concentric waves)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += rip.speed;
        rip.opacity -= 0.0035;

        if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${blue} ${rip.opacity})`;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      // 5. FINE PARTICLES & DELICATE NETWORK HAILINES
      const particleRadius = 130;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Soft cursor deflection
        const pdx = mouseX - p.x;
        const pdy = mouseY - p.y;
        const pDist = Math.hypot(pdx, pdy);

        if (pDist < particleRadius && pDist > 0) {
          const push = (1 - pDist / particleRadius) * 6;
          const angle = Math.atan2(pdy, pdx);
          p.vx -= Math.cos(angle) * push * 0.06;
          p.vy -= Math.sin(angle) * push * 0.06;
        }

        // Return to drift
        p.vx = (p.vx + (p.baseX - p.x) * 0.02) * 0.88;
        p.vy = (p.vy + (p.baseY - p.y) * 0.02) * 0.88;

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.fill();

        // Connect neighboring particles near cursor with faint hairlines
        if (pDist < particleRadius) {
          for (let j = i + 1; j < Math.min(i + 3, particles.length); j++) {
            const p2 = particles[j];
            const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist2 < 70) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `${blue} ${(1 - dist2 / 70) * 0.12 * alphaScale})`;
              ctx.lineWidth = 0.65;
              ctx.stroke();
            }
          }
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (!isTouch) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('click', handleClick);
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
