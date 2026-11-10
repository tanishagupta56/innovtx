'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface GridVertex {
  ox: number; // original rest X
  oy: number; // original rest Y
  x: number;  // current X
  y: number;  // current Y
  vx: number; // velocity X
  vy: number; // velocity Y
}

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

interface RippleWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  speed: number;
  life: number;
  maxLife: number;
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

    // Palette tokens
    const colorBlue = 'rgba(49, 94, 255,';
    const colorLime = 'rgba(184, 217, 76,';
    const colorOrange = 'rgba(214, 90, 49,';

    // Slightly softer intensity on dense admin/dashboard pages for readability
    const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
    const alphaScale = isDashboard ? 0.45 : 0.85;

    // Mouse coordinates with fluid trailing inertia
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let prevMouseX = width / 2;
    let prevMouseY = height / 2;
    let mouseSpeed = 0;
    let lastMoveTime = performance.now();
    let isDocVisible = !document.hidden;

    // Grid config for physical liquid deformation
    let cols = 0;
    let rows = 0;
    let cellWidth = 0;
    let cellHeight = 0;
    let grid: GridVertex[][] = [];
    let particles: Particle[] = [];
    let ripples: RippleWave[] = [];

    const initSimulation = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      // Adaptive grid density: denser on desktop, lighter on mobile
      const spacing = width < 768 ? 65 : 55;
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
      cellWidth = width / (cols - 1);
      cellHeight = height / (rows - 1);

      // 1. Initialize Spring Lattice Mesh
      grid = [];
      for (let c = 0; c < cols; c++) {
        grid[c] = [];
        for (let r = 0; r < rows; r++) {
          const ox = c * cellWidth;
          const oy = r * cellHeight;
          grid[c][r] = {
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
          };
        }
      }

      // 2. Initialize Floating Quantum Particles
      particles = [];
      const particleDensity = width < 768 ? 45 : 75;
      for (let i = 0; i < particleDensity; i++) {
        const bx = Math.random() * width;
        const by = Math.random() * height;
        const rand = Math.random();
        const type: 'blue' | 'lime' | 'orange' =
          rand > 0.85 ? 'lime' : rand > 0.72 ? 'orange' : 'blue';

        particles.push({
          baseX: bx,
          baseY: by,
          x: bx,
          y: by,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: type === 'lime' ? 2.0 : type === 'orange' ? 1.8 : 1.4,
          color: type === 'lime' ? '#B8D94C' : type === 'orange' ? '#D65A31' : '#315EFF',
          type,
        });
      }

      ripples = [];
    };

    initSimulation();

    // Event listeners
    const handleResize = () => {
      initSimulation();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      lastMoveTime = performance.now();
    };

    const handleClick = (e: MouseEvent) => {
      // Create an energetic ripple burst on click
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: Math.min(width, height) * 0.45,
        strength: 24,
        speed: 5.5,
        life: 1.0,
        maxLife: 1.0,
      });
    };

    const handleVisibility = () => {
      isDocVisible = !document.hidden;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('click', handleClick, { passive: true });
    }
    document.addEventListener('visibilitychange', handleVisibility);

    // Reduced motion: static subtle background
    if (isReduced) {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = `${colorBlue} 0.08)`;
      ctx.lineWidth = 1;
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellWidth, 0);
        ctx.lineTo(c * cellWidth, height);
        ctx.stroke();
      }
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellHeight);
        ctx.lineTo(width, r * cellHeight);
        ctx.stroke();
      }
      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    }

    // Animation loop with delta timing
    let lastFrameTime = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      if (!isDocVisible) return;

      const dt = Math.min(40, now - lastFrameTime);
      lastFrameTime = now;

      // Touch / Idle autonomous harmonic wave generation
      const idleTime = now - lastMoveTime;
      if (isTouch || idleTime > 2800) {
        const driftSpeed = isTouch ? 0.0006 : 0.0004;
        const driftRadiusX = width * 0.32;
        const driftRadiusY = height * 0.22;
        targetMouseX = width / 2 + Math.cos(now * driftSpeed) * driftRadiusX;
        targetMouseY = height / 2 + Math.sin(now * (driftSpeed * 1.3)) * driftRadiusY;
      }

      // Smooth pointer position lerping (liquid inertia)
      const lerpFactor = 0.085;
      mouseX += (targetMouseX - mouseX) * lerpFactor;
      mouseY += (targetMouseY - mouseY) * lerpFactor;

      // Calculate cursor velocity
      const dmx = mouseX - prevMouseX;
      const dmy = mouseY - prevMouseY;
      mouseSpeed = Math.sqrt(dmx * dmx + dmy * dmy);
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      // Emit continuous subtle ripple waves when moving vigorously
      if (mouseSpeed > 3.0 && Math.random() < 0.28) {
        ripples.push({
          x: mouseX,
          y: mouseY,
          radius: 10,
          maxRadius: Math.min(260, mouseSpeed * 14 + 100),
          strength: Math.min(18, mouseSpeed * 0.8),
          speed: 3.2 + Math.min(3, mouseSpeed * 0.15),
          life: 1.0,
          maxLife: 1.0,
        });
      }

      // Clear frame with alpha blending
      ctx.clearRect(0, 0, width, height);

      // 1. UPDATE RIPPLE WAVES
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += rip.speed;
        rip.life -= 0.018;

        if (rip.life <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 2. UPDATE GRID LATTICE WITH PHYSICAL LIQUID DISPLACEMENT & SPRING RESTORATION
      const deformRadius = width < 768 ? 160 : 220;
      const deformRadiusSq = deformRadius * deformRadius;
      const springK = 0.048; // elastic tension
      const damping = 0.84;  // viscous liquid friction

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const v = grid[c][r];

          // Cursor repulsion & liquid displacement
          const dx = v.x - mouseX;
          const dy = v.y - mouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < deformRadiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const factor = (1 - dist / deformRadius);
            // Non-linear push + subtle vortex swirl
            const force = factor * factor * (12 + mouseSpeed * 0.4);
            const angle = Math.atan2(dy, dx);
            const swirlAngle = angle + (dmx * 0.01);

            v.vx += Math.cos(swirlAngle) * force * 0.09;
            v.vy += Math.sin(swirlAngle) * force * 0.09;
          }

          // Propagate ripple wave displacement
          for (let ri = 0; ri < ripples.length; ri++) {
            const rip = ripples[ri];
            const rdx = v.x - rip.x;
            const rdy = v.y - rip.y;
            const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
            const waveDist = Math.abs(rDist - rip.radius);

            if (waveDist < 35 && rDist > 1) {
              const waveFactor = Math.cos((waveDist / 35) * (Math.PI / 2));
              const push = (rip.strength * rip.life * waveFactor) * 0.07;
              v.vx += (rdx / rDist) * push;
              v.vy += (rdy / rDist) * push;
            }
          }

          // Hooke's Law spring back to rest position (ox, oy)
          const fx = (v.ox - v.x) * springK;
          const fy = (v.oy - v.y) * springK;

          v.vx = (v.vx + fx) * damping;
          v.vy = (v.vy + fy) * damping;

          v.x += v.vx;
          v.y += v.vy;
        }
      }

      // 3. DRAW PHYSICAL LIQUID DEFORMED GRID LINES
      // Vertical curved mesh lines
      ctx.lineWidth = 1;
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        ctx.moveTo(grid[c][0].x, grid[c][0].y);

        for (let r = 1; r < rows; r++) {
          const prev = grid[c][r - 1];
          const curr = grid[c][r];
          // Midpoint quadratic curve for buttery liquid curvature
          const mx = (prev.x + curr.x) * 0.5;
          const my = (prev.y + curr.y) * 0.5;
          ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
        }
        ctx.lineTo(grid[c][rows - 1].x, grid[c][rows - 1].y);

        // Calculate dynamic line luminosity based on proximity to cursor
        const sampleV = grid[c][Math.floor(rows / 2)];
        const distToCursor = Math.abs(sampleV.x - mouseX);
        const nearAlpha = Math.max(0.04, Math.min(0.25, 1 - distToCursor / 400)) * alphaScale;
        ctx.strokeStyle = `${colorBlue} ${nearAlpha})`;
        ctx.stroke();
      }

      // Horizontal curved mesh lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        ctx.moveTo(grid[0][r].x, grid[0][r].y);

        for (let c = 1; c < cols; c++) {
          const prev = grid[c - 1][r];
          const curr = grid[c][r];
          const mx = (prev.x + curr.x) * 0.5;
          const my = (prev.y + curr.y) * 0.5;
          ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
        }
        ctx.lineTo(grid[cols - 1][r].x, grid[cols - 1][r].y);

        const sampleV = grid[Math.floor(cols / 2)][r];
        const distToCursor = Math.abs(sampleV.y - mouseY);
        const nearAlpha = Math.max(0.04, Math.min(0.25, 1 - distToCursor / 400)) * alphaScale;
        ctx.strokeStyle = `${colorBlue} ${nearAlpha})`;
        ctx.stroke();
      }

      // 4. DRAW EXPANDING RIPPLE WAVE SHOCKWAVES
      for (let i = 0; i < ripples.length; i++) {
        const rip = ripples[i];
        const ripAlpha = Math.max(0, rip.life * 0.28 * alphaScale);

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${colorBlue} ${ripAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 8]);
        ctx.stroke();

        // Lime-tinted inner echo
        if (rip.radius > 20) {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius * 0.82, 0, Math.PI * 2);
          ctx.strokeStyle = `${colorLime} ${ripAlpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 5. DRAW LUMINOUS LIQUID RADIAL AURA AT CURSOR
      const auraRadius = width < 768 ? 220 : 340;
      const radialGlow = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        auraRadius
      );
      radialGlow.addColorStop(0, `${colorBlue} ${0.20 * alphaScale})`);
      radialGlow.addColorStop(0.35, `${colorBlue} ${0.08 * alphaScale})`);
      radialGlow.addColorStop(0.7, `${colorLime} ${0.02 * alphaScale})`);
      radialGlow.addColorStop(1, 'rgba(8, 11, 18, 0)');

      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // 6. DRAW PARTICLES WITH DYNAMIC FLUID REPULSION
      const particleLensRadius = width < 768 ? 160 : 210;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pdx = mouseX - p.x;
        const pdy = mouseY - p.y;
        const pDist = Math.hypot(pdx, pdy);

        // Fluid repulsion
        if (pDist < particleLensRadius && pDist > 0) {
          const push = (1 - pDist / particleLensRadius) * (14 + mouseSpeed * 0.3);
          const angle = Math.atan2(pdy, pdx);
          p.vx -= Math.cos(angle) * push * 0.12;
          p.vy -= Math.sin(angle) * push * 0.12;
        }

        // Elastic return to base with slight Brownian motion
        const pSpringX = (p.baseX - p.x) * 0.038;
        const pSpringY = (p.baseY - p.y) * 0.038;
        p.vx = (p.vx + pSpringX) * 0.85;
        p.vy = (p.vy + pSpringY) * 0.85;

        p.x += p.vx;
        p.y += p.vy;

        const isNear = pDist < particleLensRadius;
        const pAlpha = (isNear ? 0.9 : 0.22) * alphaScale;
        const currentSize = isNear ? p.size * 1.5 : p.size;

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);

        if (p.type === 'lime') {
          ctx.fillStyle = `${colorLime} ${pAlpha})`;
        } else if (p.type === 'orange') {
          ctx.fillStyle = `${colorOrange} ${pAlpha})`;
        } else {
          ctx.fillStyle = `${colorBlue} ${pAlpha})`;
        }
        ctx.fill();

        // Connect neighboring particles near cursor to create neural web
        if (isNear) {
          for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
            const p2 = particles[j];
            const p2Dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (p2Dist < 55) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `${colorBlue} ${(1 - p2Dist / 55) * 0.25 * alphaScale})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      // 7. GLOWING INTERSECTION NODES NEAR CURSOR
      const nodeGlowRadius = 180;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const v = grid[c][r];
          const dist = Math.hypot(v.x - mouseX, v.y - mouseY);
          if (dist < nodeGlowRadius) {
            const nodeAlpha = (1 - dist / nodeGlowRadius) * 0.55 * alphaScale;
            ctx.beginPath();
            ctx.arc(v.x, v.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `${colorLime} ${nodeAlpha})`;
            ctx.fill();
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
