'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EcosystemNode {
  id: string;
  title: string;
  route: string;
  category: string;
  description: string;
  color: string;
  accentColor: string;
  angle: number;
  radius: number;
  heightOffset: number;
  orbitSpeed: number;
  geometryType: 'dodecahedron' | 'octahedron' | 'box' | 'sphere' | 'icosahedron' | 'tetrahedron';
}

const ECOSYSTEM_NODES: EcosystemNode[] = [
  {
    id: 'events',
    title: 'Flagship Events',
    route: '/events',
    category: 'ARENA // HACKATHONS',
    description: 'InnoVortex Hackathon, Azure Labs, innerve technical tracks and live development sprints.',
    color: '#315EFF',
    accentColor: '#75E6FF',
    angle: 0,
    radius: 3.2,
    heightOffset: 0.6,
    orbitSpeed: 0.25,
    geometryType: 'dodecahedron',
  },
  {
    id: 'mentorship',
    title: 'SSSC Mentorship',
    route: '/mentorship',
    category: 'CADRE // SENIOR GUIDES',
    description: '1-on-1 peer mentoring, DSA mock interview gauntlets, and tech career roadmap cohorts.',
    color: '#B8D94C',
    accentColor: '#D4FF24',
    angle: (Math.PI / 3) * 1,
    radius: 3.6,
    heightOffset: -0.5,
    orbitSpeed: 0.22,
    geometryType: 'octahedron',
  },
  {
    id: 'resources',
    title: 'TechBoard Vault',
    route: '/resources',
    category: 'KNOWLEDGE // ROADMAPS',
    description: 'Curated technical interview archives, system design blueprints, and engineering guides.',
    color: '#315EFF',
    accentColor: '#B8D94C',
    angle: (Math.PI / 3) * 2,
    radius: 3.0,
    heightOffset: 0.7,
    orbitSpeed: 0.28,
    geometryType: 'box',
  },
  {
    id: 'community',
    title: 'Student Community',
    route: '/community',
    category: 'NETWORK // DISCORD & ALUMNI',
    description: 'Active discussion forums, collaborative study groups, and direct links to IGDTUW alumnae.',
    color: '#D65A31',
    accentColor: '#FF8A65',
    angle: (Math.PI / 3) * 3,
    radius: 3.5,
    heightOffset: -0.6,
    orbitSpeed: 0.20,
    geometryType: 'sphere',
  },
  {
    id: 'showcase',
    title: 'Project Showcase',
    route: '/showcase',
    category: 'INNOVATION // DEPLOYED CODE',
    description: 'Production systems, open-source AI repos, and winning hackathon solutions built by students.',
    color: '#B8D94C',
    accentColor: '#75E6FF',
    angle: (Math.PI / 3) * 4,
    radius: 3.3,
    heightOffset: 0.5,
    orbitSpeed: 0.24,
    geometryType: 'icosahedron',
  },
  {
    id: 'opportunities',
    title: 'Opportunities',
    route: '/opportunities',
    category: 'DISCOVERY // GRANTS & INTERNS',
    description: 'National hackathon grants, Google/Microsoft fellowships, open internships and tech contests.',
    color: '#D65A31',
    accentColor: '#D4FF24',
    angle: (Math.PI / 3) * 5,
    radius: 3.7,
    heightOffset: -0.4,
    orbitSpeed: 0.26,
    geometryType: 'tetrahedron',
  },
];

// Single 3D Interactive Spatial Node
function SpatialNode({
  node,
  activeId,
  setActiveId,
  onNodeClick,
  coreTime,
}: {
  node: EcosystemNode;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onNodeClick: (route: string) => void;
  coreTime: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const isHovered = activeId === node.id;

  // Calculate current orbit angle
  const currentAngle = node.angle + coreTime * node.orbitSpeed * 0.4;
  const x = Math.cos(currentAngle) * node.radius;
  const z = Math.sin(currentAngle) * node.radius;
  const y = node.heightOffset + Math.sin(coreTime * 1.2 + node.angle) * 0.25;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
      meshRef.current.rotation.x += delta * (isHovered ? 1.8 : 0.6);
      meshRef.current.rotation.y += delta * (isHovered ? 2.2 : 0.8);
      const targetScale = isHovered ? 1.45 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
    if (ringRef.current) {
      ringRef.current.position.set(x, y, z);
      ringRef.current.rotation.z += delta * (isHovered ? 2.5 : 0.8);
    }
  });

  const renderGeometry = () => {
    switch (node.geometryType) {
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.34, 0]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.38, 0]} />;
      case 'box':
        return <boxGeometry args={[0.42, 0.42, 0.42]} />;
      case 'sphere':
        return <sphereGeometry args={[0.32, 16, 16]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.35, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.4, 0]} />;
      default:
        return <sphereGeometry args={[0.3, 16, 16]} />;
    }
  };

  return (
    <group>
      {/* Outer subtle halo ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.48, 0.54, 32]} />
        <meshBasicMaterial
          color={node.color}
          side={THREE.DoubleSide}
          transparent
          opacity={isHovered ? 0.9 : 0.35}
        />
      </mesh>

      {/* Main 3D Node Solid Mesh */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setActiveId(node.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setActiveId(null);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onNodeClick(node.route);
        }}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={node.color}
          emissive={node.accentColor}
          emissiveIntensity={isHovered ? 0.95 : 0.45}
          roughness={0.2}
          metalness={0.8}
          wireframe={!isHovered}
        />
      </mesh>
    </group>
  );
}

// Interconnecting Network Lines in 3D
function EcosystemNetworkLines({
  nodes,
  coreTime,
  activeId,
}: {
  nodes: EcosystemNode[];
  coreTime: number;
  activeId: string | null;
}) {
  const linePositions = useMemo(() => {
    // 6 lines from center to nodes + 6 lines connecting adjacent nodes
    return new Float32Array((6 + 6) * 2 * 3);
  }, []);

  const lineColors = useMemo(() => {
    return new Float32Array((6 + 6) * 2 * 3);
  }, []);

  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    if (!linesRef.current) return;

    const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
    const colors = linesRef.current.geometry.attributes.color.array as Float32Array;

    const nodeCoords: [number, number, number][] = [];

    // Compute live positions
    nodes.forEach((n) => {
      const angle = n.angle + coreTime * n.orbitSpeed * 0.4;
      const x = Math.cos(angle) * n.radius;
      const z = Math.sin(angle) * n.radius;
      const y = n.heightOffset + Math.sin(coreTime * 1.2 + n.angle) * 0.25;
      nodeCoords.push([x, y, z]);
    });

    let pIdx = 0;
    let cIdx = 0;

    // 1. Spoke lines from Center [0, 0, 0] to each node
    for (let i = 0; i < nodes.length; i++) {
      const coord = nodeCoords[i];
      const node = nodes[i];
      const isTargetActive = activeId === node.id;

      // From Center
      positions[pIdx++] = 0;
      positions[pIdx++] = 0;
      positions[pIdx++] = 0;

      // To Node
      positions[pIdx++] = coord[0];
      positions[pIdx++] = coord[1];
      positions[pIdx++] = coord[2];

      const cBase = new THREE.Color('#315EFF');
      const cNode = new THREE.Color(node.color);

      colors[cIdx++] = cBase.r;
      colors[cIdx++] = cBase.g;
      colors[cIdx++] = cBase.b;

      colors[cIdx++] = isTargetActive ? 1.0 : cNode.r;
      colors[cIdx++] = isTargetActive ? 1.0 : cNode.g;
      colors[cIdx++] = isTargetActive ? 1.0 : cNode.b;
    }

    // 2. Ring perimeter lines connecting adjacent nodes
    for (let i = 0; i < nodes.length; i++) {
      const nextIdx = (i + 1) % nodes.length;
      const c1 = nodeCoords[i];
      const c2 = nodeCoords[nextIdx];

      positions[pIdx++] = c1[0];
      positions[pIdx++] = c1[1];
      positions[pIdx++] = c1[2];

      positions[pIdx++] = c2[0];
      positions[pIdx++] = c2[1];
      positions[pIdx++] = c2[2];

      const col = new THREE.Color(nodes[i].color);
      colors[cIdx++] = col.r * 0.5;
      colors[cIdx++] = col.g * 0.5;
      colors[cIdx++] = col.b * 0.5;

      colors[cIdx++] = col.r * 0.5;
      colors[cIdx++] = col.g * 0.5;
      colors[cIdx++] = col.b * 0.5;
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={24}
          array={linePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={24}
          array={lineColors}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.65} linewidth={1.5} />
    </lineSegments>
  );
}

// 3D Spatial Scene Container
function Ecosystem3DScene({
  activeId,
  setActiveId,
  onNodeClick,
  pointer,
}: {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onNodeClick: (route: string) => void;
  pointer: { x: number; y: number };
}) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreRingsRef = useRef<THREE.Group>(null);
  const [coreTime, setCoreTime] = useState(0);

  // Background ambient quantum particles
  const particles = useMemo(() => {
    const count = 280;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cBlue = new THREE.Color('#315EFF');
    const cLime = new THREE.Color('#B8D94C');
    const cOrange = new THREE.Color('#D65A31');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 1.4 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      const rand = Math.random();
      const col = rand > 0.8 ? cLime : rand > 0.65 ? cOrange : cBlue;
      cols[i3] = col.r;
      cols[i3 + 1] = col.g;
      cols[i3 + 2] = col.b;
    }
    return { pos, cols };
  }, []);

  useFrame((state, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const t = state.clock.getElapsedTime();
    setCoreTime(t);

    if (rootGroupRef.current) {
      // Cursor responsive tilt & smooth parallax
      const targetRotX = pointer.y * 0.4 + Math.sin(t * 0.4) * 0.08;
      const targetRotY = pointer.x * 0.5 + t * 0.08;
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.x,
        targetRotX,
        0.06
      );
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        targetRotY,
        0.06
      );
    }

    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.6;
      coreRef.current.rotation.y += delta * 0.9;
    }

    if (coreRingsRef.current) {
      coreRingsRef.current.rotation.z -= delta * 0.4;
      coreRingsRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* Central TechNeeds Nucleus */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial
            color="#315EFF"
            emissive="#315EFF"
            emissiveIntensity={0.85}
            roughness={0.15}
            metalness={0.9}
            wireframe
          />
        </mesh>

        {/* Inner Glowing Crystal */}
        <mesh>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color="#B8D94C"
            emissive="#B8D94C"
            emissiveIntensity={1.0}
            roughness={0.2}
          />
        </mesh>

        {/* Central Orbital Rings */}
        <group ref={coreRingsRef}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.2, 0.015, 16, 64]} />
            <meshBasicMaterial color="#315EFF" transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
            <torusGeometry args={[1.4, 0.012, 16, 64]} />
            <meshBasicMaterial color="#B8D94C" transparent opacity={0.4} />
          </mesh>
        </group>
      </Float>

      {/* Network Connection Lines */}
      <EcosystemNetworkLines nodes={ECOSYSTEM_NODES} coreTime={coreTime} activeId={activeId} />

      {/* 6 Spatial Domain Nodes */}
      {ECOSYSTEM_NODES.map((node) => (
        <SpatialNode
          key={node.id}
          node={node}
          activeId={activeId}
          setActiveId={setActiveId}
          onNodeClick={onNodeClick}
          coreTime={coreTime}
        />
      ))}

      {/* Particle Cloud */}
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
        <pointsMaterial size={0.035} vertexColors transparent opacity={0.7} sizeAttenuation />
      </points>
    </group>
  );
}

// MAIN EXPORTED COMPONENT: THE TECHNEEDS ECOSYSTEM
export default function TechNeedsEcosystemSection() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const activeNode = useMemo(
    () => ECOSYSTEM_NODES.find((n) => n.id === activeId) || null,
    [activeId]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointer({ x, y });
  };

  const handleNodeNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-green animate-pulse" />
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
                04 // SPATIAL ARCHITECTURE
              </span>
            </div>
            <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white tracking-tight uppercase">
              THE TECHNEEDS <span className="text-electric-blue">ECOSYSTEM</span>
              <span className="text-lime-green">.</span>
            </h2>
          </div>

          <p className="font-mono text-xs text-muted-text max-w-md leading-relaxed">
            An interconnected spatial constellation of our society pillars. Hover to inspect domain telemetry; click any node to enter the corridor.
          </p>
        </div>

        {/* 3D Spatial Canvas Visualizer */}
        <div
          className="relative h-[520px] sm:h-[620px] w-full rounded-3xl border border-charcoal-border bg-charcoal/60 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(49,94,255,0.12)]"
          onMouseMove={handleMouseMove}
        >
          {/* Top HUD Telemetry */}
          <div className="absolute top-6 left-6 z-20 font-mono text-[11px] text-muted-text pointer-events-none flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-electric-blue animate-ping" />
            <span className="text-soft-white font-bold">SPATIAL CONSTELLATION:</span>
            <span>6 ACTIVE NODES // DUAL-PHASE HARMONIC</span>
          </div>

          <div className="absolute top-6 right-6 z-20 font-mono text-[10px] text-muted-text pointer-events-none hidden sm:block">
            [HOVER TO INSPECT • CLICK TO ENTER NODE]
          </div>

          {/* Interactive Inspection HUD Tooltip Card (Overlaid when node is hovered) */}
          {activeNode ? (
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-30 p-6 rounded-2xl border border-electric-blue/50 bg-[#080B12]/95 backdrop-blur-2xl shadow-[0_10px_40px_rgba(49,94,255,0.3)] transition-all animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-lime-green font-bold tracking-widest uppercase">
                  {activeNode.category}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: activeNode.color }}
                />
              </div>

              <h3 className="text-2xl font-bold text-soft-white tracking-tight">
                {activeNode.title}
              </h3>

              <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                {activeNode.description}
              </p>

              <div className="mt-4 pt-3 border-t border-charcoal-border flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted-text">
                  TARGET: {activeNode.route}
                </span>
                <button
                  onClick={() => handleNodeNavigation(activeNode.route)}
                  className="px-4 py-1.5 bg-lime-green hover:bg-lime-green/90 text-deep-ink font-mono text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1 shadow-[0_0_12px_rgba(184,217,76,0.4)]"
                >
                  Enter Corridor →
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-6 left-6 z-20 font-mono text-xs text-muted-text pointer-events-none hidden sm:flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-lime-green" />
              <span>HOVER OVER ANY 3D NODE TO REVEAL DOMAIN TELEMETRY</span>
            </div>
          )}

          {/* 3D WebGL Canvas */}
          <Canvas
            camera={{ position: [0, 0, 7.2], fov: 45 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <pointLight position={[8, 6, 6]} intensity={30} color="#315EFF" />
              <pointLight position={[-8, -5, -4]} intensity={25} color="#B8D94C" />
              <pointLight position={[0, -6, 4]} intensity={18} color="#D65A31" />

              <Ecosystem3DScene
                activeId={activeId}
                setActiveId={setActiveId}
                onNodeClick={handleNodeNavigation}
                pointer={pointer}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Quick Corridor Gateway Matrix (1-click direct node access for all devices) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {ECOSYSTEM_NODES.map((node) => {
            const isHovered = activeId === node.id;
            return (
              <Link
                key={node.id}
                href={node.route}
                onMouseEnter={() => setActiveId(node.id)}
                onMouseLeave={() => setActiveId(null)}
                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between group ${
                  isHovered
                    ? 'border-lime-green bg-charcoal/90 shadow-[0_0_25px_rgba(184,217,76,0.15)] -translate-y-1'
                    : 'border-charcoal-border bg-charcoal/50 hover:border-electric-blue/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                    <span className="font-mono text-[9px] text-muted-text">
                      [0{ECOSYSTEM_NODES.indexOf(node) + 1}]
                    </span>
                  </div>
                  <div className="font-bold text-sm text-soft-white group-hover:text-lime-green transition-colors">
                    {node.title}
                  </div>
                  <div className="font-mono text-[10px] text-muted-text truncate mt-0.5">
                    {node.route}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-charcoal-border flex items-center justify-between font-mono text-[11px] text-lime-green font-bold">
                  <span>Enter</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
