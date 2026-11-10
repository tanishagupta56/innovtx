'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EcosystemPillar {
  id: string;
  number: string;
  title: string;
  route: string;
  summary: string;
  color: string;
  accent: string;
}

const PILLARS: EcosystemPillar[] = [
  {
    id: 'events',
    number: '01',
    title: 'Flagship Events',
    route: '/events',
    summary: 'InnoVortex hackathon, technical workshops, and rapid development sprints.',
    color: '#315EFF',
    accent: 'border-electric-blue/40 hover:border-electric-blue',
  },
  {
    id: 'mentorship',
    number: '02',
    title: 'SSSC Mentorship',
    route: '/mentorship',
    summary: 'Peer-to-peer cohorts, DSA technical interview prep, and career guidance.',
    color: '#B8D94C',
    accent: 'border-lime-green/40 hover:border-lime-green',
  },
  {
    id: 'resources',
    number: '03',
    title: 'TechBoard Vault',
    route: '/resources',
    summary: 'Curated engineering roadmaps, system design guides, and interview vaults.',
    color: '#315EFF',
    accent: 'border-electric-blue/40 hover:border-electric-blue',
  },
  {
    id: 'community',
    number: '04',
    title: 'Student Community',
    route: '/community',
    summary: 'Active Discord hubs, collaboration circles, and IGDTUW alumnae network.',
    color: '#D65A31',
    accent: 'border-burnt-orange/40 hover:border-burnt-orange',
  },
];

// Abstract Minimal Generative Artwork with Fine Particle Trails
function AbstractEcosystemCanvas({
  activeId,
  onNodeHover,
}: {
  activeId: string | null;
  onNodeHover: (id: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

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

    // Fine floating particles for trails
    const particles: { x: number; y: number; baseX: number; baseY: number; speed: number; angle: number; radius: number; color: string }[] = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 90 + (i % 4) * 25;
      particles.push({
        x: width * 0.5 + Math.cos(angle) * radius,
        y: height * 0.5 + Math.sin(angle) * (radius * 0.7),
        baseX: width * 0.5 + Math.cos(angle) * radius,
        baseY: height * 0.5 + Math.sin(angle) * (radius * 0.7),
        speed: 0.0008 + (i % 3) * 0.0003,
        angle,
        radius,
        color: i % 4 === 0 ? '#B8D94C' : i % 5 === 0 ? '#D65A31' : '#315EFF',
      });
    }

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const time = now * 0.001;
      const centerX = width * 0.5;
      const centerY = height * 0.5;

      const normX = (mouseX / width - 0.5) * 2;
      const normY = (mouseY / height - 0.5) * 2;

      // Soft central luminous gradient
      const aura = ctx.createRadialGradient(
        centerX + normX * 25,
        centerY + normY * 25,
        0,
        centerX,
        centerY,
        width * 0.42
      );
      aura.addColorStop(0, 'rgba(49, 94, 255, 0.12)');
      aura.addColorStop(0.5, 'rgba(184, 217, 76, 0.03)');
      aura.addColorStop(1, 'rgba(8, 11, 18, 0)');

      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.42, 0, Math.PI * 2);
      ctx.fill();

      // Delicate organic ribbons
      const ribbonCount = 4;
      for (let r = 0; r < ribbonCount; r++) {
        const baseRadius = Math.min(width, height) * (0.22 + r * 0.06);
        ctx.beginPath();
        const steps = 60;
        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2;
          const wave =
            Math.sin(theta * 2 + time * 0.9 + r) * 12 +
            Math.cos(theta * 3 - time * 0.7) * 8;
          const rad = baseRadius + wave;
          const px = centerX + Math.cos(theta) * rad + normX * (r * 6);
          const py = centerY + Math.sin(theta) * (rad * 0.72) + normY * (r * 6);

          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.strokeStyle =
          r === 1
            ? 'rgba(184, 217, 76, 0.22)'
            : `rgba(49, 94, 255, ${0.12 + (r / ribbonCount) * 0.15})`;
        ctx.lineWidth = r === 1 ? 1.2 : 0.85;
        ctx.stroke();
      }

      // Fine particle trails orbiting with harmonic drift
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed * 8;
        const px = centerX + Math.cos(p.angle) * p.radius + normX * 12;
        const py = centerY + Math.sin(p.angle) * (p.radius * 0.72) + normY * 12;

        ctx.beginPath();
        ctx.arc(px, py, i % 4 === 0 ? 1.8 : 1.1, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.65;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Faint connecting hair-trails
        if (i > 0 && i % 3 === 0) {
          const prevP = particles[i - 1];
          const prevPx = centerX + Math.cos(prevP.angle) * prevP.radius + normX * 12;
          const prevPy = centerY + Math.sin(prevP.angle) * (prevP.radius * 0.72) + normY * 12;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(prevPx, prevPy);
          ctx.strokeStyle = 'rgba(49, 94, 255, 0.08)';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
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
    <div className="relative w-full h-full min-h-[420px] lg:min-h-[520px] flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-auto" />

      {/* Floating Minimal Studio Info Pills (Refined Interactive Parallax Elements) */}
      <div className="absolute top-8 right-8 px-3.5 py-1.5 rounded-full bg-charcoal/80 border border-charcoal-border backdrop-blur-md font-mono text-[11px] text-muted-text flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-lime-green animate-pulse" />
        <span className="text-soft-white font-medium">2,400+ Community</span>
      </div>

      <div className="absolute bottom-8 left-8 px-3.5 py-1.5 rounded-full bg-charcoal/80 border border-charcoal-border backdrop-blur-md font-mono text-[11px] text-muted-text flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
        <span className="text-soft-white font-medium">36-Hr InnoVortex</span>
      </div>

      <div className="absolute bottom-16 right-10 px-3.5 py-1.5 rounded-full bg-charcoal/80 border border-charcoal-border backdrop-blur-md font-mono text-[11px] text-muted-text flex items-center gap-2 pointer-events-none hidden sm:flex">
        <span className="w-1.5 h-1.5 rounded-full bg-burnt-orange" />
        <span className="text-soft-white font-medium">Peer-Led Architecture</span>
      </div>
    </div>
  );
}

// MAIN COMPONENT: ASYMMETRICAL EDITORIAL & ABSTRACT ARTWORK
export default function TechNeedsEcosystemSection() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Strong Editorial Typography & 4 Interactive Pillars */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-green" />
                <span className="px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
                  04 // ARCHITECTURE
                </span>
              </div>

              <h2 className="editorial-title text-3xl sm:text-5xl text-soft-white tracking-tight leading-[1.08] uppercase">
                A LIVING ECOSYSTEM <br />
                <span className="text-electric-blue">FOR STUDENT BUILDERS</span>
                <span className="text-lime-green">.</span>
              </h2>

              <p className="text-slate-300 font-sans text-base leading-relaxed max-w-xl">
                TechNeeds connects students across software engineering, open production repositories, competitive hackathons, and structured mentorship. Built by students, for students.
              </p>
            </div>

            {/* 4 Interactive Domain Nodes (Clean Editorial Layout) */}
            <div className="space-y-3 pt-2">
              {PILLARS.map((pillar) => {
                const isHovered = activeId === pillar.id;
                return (
                  <Link
                    key={pillar.id}
                    href={pillar.route}
                    onMouseEnter={() => setActiveId(pillar.id)}
                    onMouseLeave={() => setActiveId(null)}
                    className={`block p-4 sm:p-5 rounded-xl border transition-all duration-300 group ${
                      isHovered
                        ? 'border-electric-blue bg-charcoal/90 translate-x-1.5'
                        : 'border-charcoal-border bg-charcoal/40 hover:bg-charcoal/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-muted-text font-bold">
                            {pillar.number}
                          </span>
                          <h3 className="font-bold text-base sm:text-lg text-soft-white group-hover:text-lime-green transition-colors">
                            {pillar.title}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 font-sans pl-7 leading-relaxed">
                          {pillar.summary}
                        </p>
                      </div>

                      <span className="font-mono text-xs text-lime-green group-hover:translate-x-1 transition-transform pt-1">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Secondary Cross-Links */}
            <div className="flex items-center gap-6 pt-2 font-mono text-xs text-muted-text">
              <Link href="/showcase" className="hover:text-lime-green transition-colors">
                [ Projects Showcase → ]
              </Link>
              <Link href="/opportunities" className="hover:text-lime-green transition-colors">
                [ Opportunities &amp; Grants → ]
              </Link>
            </div>
          </div>

          {/* Right Column: Abstract Digital Artwork Visualizer */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-charcoal-border bg-charcoal/50 backdrop-blur-xl p-4 sm:p-6 shadow-[0_0_60px_rgba(49,94,255,0.06)] relative overflow-hidden">
              <AbstractEcosystemCanvas activeId={activeId} onNodeHover={setActiveId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
