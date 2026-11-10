'use client';

import React, { useEffect, useState } from 'react';

export default function HeroVisual() {
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    nodes: 900,
    rotX: '0.00',
    rotY: '0.00',
    coreState: 'STABLE // RESONATING',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        rotX: (Math.sin(Date.now() * 0.001) * 0.4).toFixed(3),
        rotY: (Math.cos(Date.now() * 0.0012) * 0.6).toFixed(3),
        fps: Math.floor(59 + Math.random() * 2),
      }));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] flex items-center justify-center select-none pointer-events-none">
      {/* Reticle Hologram Borders */}
      <div className="absolute inset-4 border border-charcoal-border rounded-2xl pointer-events-none">
        {/* Corner Accents */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-lime-green" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-lime-green" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-lime-green" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-lime-green" />

        {/* Top HUD Telemetry */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[11px] text-muted-text">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-green animate-pulse" />
            <span className="text-soft-white font-bold tracking-wider">CORE TELEMETRY</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lime-green font-mono">NODES: {telemetry.nodes}</span>
            <span className="text-muted-text hidden sm:inline">ENGINE: WEBGL_R3F</span>
          </div>
        </div>

        {/* Center Targeting Reticle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 sm:w-80 sm:h-80 border border-electric-blue/40 rounded-full pointer-events-none" />
          <div className="w-72 h-72 sm:w-96 sm:h-96 border border-dashed border-white/10 rounded-full pointer-events-none" />
          <div className="w-80 h-80 sm:w-[420px] sm:h-[420px] border border-lime-green/20 rounded-full pointer-events-none" />
        </div>

        {/* Bottom Coordinates Readout */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-muted-text border-t border-charcoal-border pt-3">
          <div className="flex items-center gap-3">
            <span>ROT_X: <strong className="text-soft-white">{telemetry.rotX}</strong></span>
            <span>ROT_Y: <strong className="text-soft-white">{telemetry.rotY}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-text">STATE:</span>
            <span className="text-lime-green font-bold">{telemetry.coreState}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
