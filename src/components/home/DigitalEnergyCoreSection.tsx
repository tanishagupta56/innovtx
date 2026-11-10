'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { SOCIETY_STATS } from '@/data/societyData';
import Link from 'next/link';

// Inner 3D Interactive Energy Core Model
function EnergyCoreInstallation({ pointer }: { pointer: { x: number; y: number } }) {
  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Nodes floating in orbit: Lime Green & Burnt Orange
  const nodes = useMemo(() => {
    const list = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 2.4 + (i % 3) * 0.4;
      const y = Math.sin(i * 1.8) * 0.8;
      const isOrange = i % 3 === 0;
      list.push({
        position: [Math.cos(angle) * r, y, Math.sin(angle) * r] as [number, number, number],
        isOrange,
        size: isOrange ? 0.12 : 0.09,
      });
    }
    return list;
  }, []);

  // Network connection lines from core to outer nodes
  const { linePositions, lineColors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const cBlue = new THREE.Color('#315EFF');
    const cLime = new THREE.Color('#B8D94C');
    const cOrange = new THREE.Color('#D65A31');

    nodes.forEach((n) => {
      // Line from center [0,0,0] to node position
      pos.push(0, 0, 0);
      pos.push(n.position[0], n.position[1], n.position[2]);

      const targetCol = n.isOrange ? cOrange : cLime;
      col.push(cBlue.r, cBlue.g, cBlue.b);
      col.push(targetCol.r, targetCol.g, targetCol.b);
    });

    return {
      linePositions: new Float32Array(pos),
      lineColors: new Float32Array(col),
    };
  }, [nodes]);

  // Particle swarm around the core
  const particles = useMemo(() => {
    const pCount = 350;
    const pos = new Float32Array(pCount * 3);
    const cols = new Float32Array(pCount * 3);
    const cBlue = new THREE.Color('#315EFF');
    const cLime = new THREE.Color('#B8D94C');

    for (let i = 0; i < pCount; i++) {
      const i3 = i * 3;
      const r = 1.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      const color = Math.random() > 0.7 ? cLime : cBlue;
      cols[i3] = color.r;
      cols[i3 + 1] = color.g;
      cols[i3 + 2] = color.b;
    }
    return { pos, cols };
  }, []);

  useFrame((state) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      // Pointer responsive tilt
      const targetRotX = pointer.y * 0.35 + Math.sin(t * 0.5) * 0.08;
      const targetRotY = pointer.x * 0.45 + t * 0.15;
      coreRef.current.rotation.x = THREE.MathUtils.lerp(coreRef.current.rotation.x, targetRotX, 0.05);
      coreRef.current.rotation.y = THREE.MathUtils.lerp(coreRef.current.rotation.y, targetRotY, 0.05);
    }

    if (crystalRef.current) {
      crystalRef.current.rotation.x = t * 0.3;
      crystalRef.current.rotation.z = t * 0.2;
      const pulse = 1 + Math.sin(t * 2) * 0.05;
      crystalRef.current.scale.set(pulse, pulse, pulse);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.25;
      ring1Ref.current.rotation.x = Math.PI * 0.3 + Math.sin(t * 0.3) * 0.1;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.3;
      ring2Ref.current.rotation.y = Math.PI * 0.25 + Math.cos(t * 0.3) * 0.1;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.2;
    }
  });

  return (
    <group ref={coreRef}>
      {/* Central Crystal Core */}
      <mesh ref={crystalRef}>
        <octahedronGeometry args={[1.0, 0]} />
        <meshPhysicalMaterial
          color="#315EFF"
          emissive="#1E44D6"
          emissiveIntensity={1.2}
          roughness={0.15}
          metalness={0.8}
          transmission={0.7}
          thickness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Blueprint Wireframe Cage */}
      <mesh>
        <octahedronGeometry args={[1.05, 0]} />
        <meshBasicMaterial color="#B8D94C" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Electric Blue Primary Orbital Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.8, 0.02, 16, 80]} />
        <meshStandardMaterial
          color="#315EFF"
          emissive="#315EFF"
          emissiveIntensity={2.5}
          roughness={0.2}
        />
      </mesh>

      {/* Lime Green Secondary Orbital Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.2, 0.016, 16, 80]} />
        <meshStandardMaterial
          color="#B8D94C"
          emissive="#B8D94C"
          emissiveIntensity={3.0}
          roughness={0.2}
        />
      </mesh>

      {/* Burnt Orange Tertiary Energy Conduit Ring */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.6, 0.012, 16, 80]} />
        <meshStandardMaterial
          color="#D65A31"
          emissive="#D65A31"
          emissiveIntensity={2.2}
          roughness={0.3}
        />
      </mesh>

      {/* Network Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lineColors.length / 3}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.4} />
      </lineSegments>

      {/* Floating Orbital Nodes */}
      {nodes.map((n, i) => (
        <Float key={i} speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh position={n.position}>
            <octahedronGeometry args={[n.size, 0]} />
            <meshStandardMaterial
              color={n.isOrange ? '#D65A31' : '#B8D94C'}
              emissive={n.isOrange ? '#D65A31' : '#B8D94C'}
              emissiveIntensity={2.0}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Particle Atmosphere */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.pos.length / 3}
            array={particles.pos}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.cols.length / 3}
            array={particles.cols}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function DigitalEnergyCoreSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointer({ x, y });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-deep-ink overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-electric-blue/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-lime-green/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-green animate-pulse" />
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
                04 // INTERCONNECTED ECOSYSTEM
              </span>
            </div>
            <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white tracking-tight uppercase">
              DIGITAL ENERGY <br />
              <span className="text-electric-blue">CORE INSTALLATION.</span>
            </h2>
          </div>

          <div className="font-mono text-xs text-muted-text max-w-md leading-relaxed">
            A dynamic, real-time visual representation of TechNeeds at IGDTUW. Bridging peer-led technical mentorship cohorts, hackathon builder matrices, and open production engineering.
          </div>
        </div>

        {/* 3D Visual Installation Canvas & Organic Telemetry Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main 3D Canvas Visualizer (8 cols) */}
          <div className="lg:col-span-8 h-[480px] sm:h-[540px] relative rounded-3xl border border-charcoal-border bg-charcoal/70 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(49,94,255,0.12)]">
            {/* Reticle HUD overlay info */}
            <div className="absolute top-6 left-6 z-10 font-mono text-[11px] text-muted-text pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-electric-blue animate-ping" />
              <span>CORE FREQUENCY: 128.4 MHZ // REACTIVE FIELD</span>
            </div>

            <div className="absolute top-6 right-6 z-10 font-mono text-[10px] text-muted-text pointer-events-none hidden sm:block">
              [MOVE POINTER TO DISTORT ENERGY]
            </div>

            {/* Bottom Energy Status */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-4 font-mono text-xs pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-green" />
                <span className="text-soft-white font-semibold">COHORT NODES</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-burnt-orange" />
                <span className="text-soft-white font-semibold">ENERGY CONDUITS</span>
              </div>
            </div>

            <Canvas
              camera={{ position: [0, 0, 5.5], fov: 45 }}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              dpr={[1, 1.5]}
              className="w-full h-full"
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[6, 5, 5]} intensity={25} color="#315EFF" />
                <pointLight position={[-6, -4, -4]} intensity={20} color="#B8D94C" />
                <pointLight position={[0, -5, 2]} intensity={15} color="#D65A31" />

                <EnergyCoreInstallation pointer={pointer} />
              </Suspense>
            </Canvas>
          </div>

          {/* Organic Telemetry Impact Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {SOCIETY_STATS.map((stat, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-charcoal-border bg-charcoal/60 hover:border-electric-blue/50 transition-all duration-300 relative group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-muted-text uppercase tracking-widest">
                      TELEMETRY [{String(idx + 1).padStart(2, '0')}]
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isFirst ? 'bg-lime-green' : (isSecond ? 'bg-burnt-orange' : 'bg-electric-blue')
                      }`}
                    />
                  </div>

                  <div className="text-3xl sm:text-4xl font-display font-extrabold text-soft-white tracking-tight">
                    {stat.number}
                  </div>

                  <div className="text-xs font-mono font-bold text-soft-white uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>

                  <div className="text-xs text-muted-text mt-1 font-sans">
                    {stat.detail}
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Link
                href="/timeline"
                className="w-full py-3.5 px-4 bg-charcoal hover:bg-white/5 border border-charcoal-border hover:border-electric-blue text-soft-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-between group"
              >
                <span>Traverse 3D Historical Spline</span>
                <span className="text-lime-green group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
