'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { TIMELINE_MILESTONES, MilestoneItem } from '@/data/timelineData';

interface TimelineBeaconProps {
  milestone: MilestoneItem;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: (m: MilestoneItem) => void;
}

function TimelineBeacon({ milestone, position, isSelected, onSelect }: TimelineBeaconProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const isHackathon = milestone.category === 'hackathon';
  const beaconColor = isHackathon ? '#D4FF24' : '#1558C9';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.5;
      const s = 1 + Math.sin(t * 3 + milestone.year) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.8;
      meshRef.current.rotation.x = t * 0.4;
    }
  });

  return (
    <group position={position}>
      {/* Interactive Beacon Core */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(milestone);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <octahedronGeometry args={[isSelected ? 0.35 : hovered ? 0.3 : 0.22, 0]} />
        <meshStandardMaterial
          color={beaconColor}
          emissive={beaconColor}
          emissiveIntensity={isSelected ? 3.0 : hovered ? 2.2 : 1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Orbiting Sensor Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.38, 0.42, 32]} />
        <meshBasicMaterial
          color={hovered || isSelected ? '#D4FF24' : '#38bdf8'}
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Floating 3D Label: Year & Short Title */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.22}
          color={isSelected || hovered ? '#D4FF24' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#030407"
        >
          {`${milestone.year} · ${milestone.month.substring(0, 3)}`}
        </Text>
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.14}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
        >
          {milestone.title.length > 25 ? milestone.title.substring(0, 22) + '...' : milestone.title}
        </Text>
      </Float>
    </group>
  );
}

function SplineCurve({ points }: { points: THREE.Vector3[] }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.035, 8, false), [curve]);

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial
        color="#1558C9"
        emissive="#1558C9"
        emissiveIntensity={0.8}
        roughness={0.4}
        metalness={0.6}
        wireframe={false}
      />
    </mesh>
  );
}

function CameraRig({ targetPos }: { targetPos: [number, number, number] | null }) {
  useFrame((state) => {
    if (targetPos) {
      const dest = new THREE.Vector3(targetPos[0], targetPos[1] + 0.3, targetPos[2] + 2.5);
      state.camera.position.lerp(dest, 0.05);
      state.camera.lookAt(new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]));
    }
  });
  return null;
}

export function Timeline3DCanvas({
  selectedId,
  onSelectMilestone,
}: {
  selectedId: string | null;
  onSelectMilestone: (m: MilestoneItem) => void;
}) {
  // Compute spatial positions along an undulating 3D spline across years
  const positions: [number, number, number][] = useMemo(() => {
    return TIMELINE_MILESTONES.map((_, i) => {
      const t = i / (TIMELINE_MILESTONES.length - 1);
      const x = (t - 0.5) * 22; // spread along X axis
      const y = Math.sin(t * Math.PI * 3) * 1.5; // wave along Y
      const z = Math.cos(t * Math.PI * 2) * 1.8; // wave along Z
      return [x, y, z];
    });
  }, []);

  const vectorPoints = useMemo(() => {
    return positions.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  }, [positions]);

  const selectedIdx = TIMELINE_MILESTONES.findIndex((m) => m.id === selectedId);
  const targetPos = selectedIdx >= 0 ? positions[selectedIdx] : null;

  return (
    <div className="w-full h-[520px] relative rounded-xl border border-white/10 overflow-hidden bg-midnight-950/80 backdrop-blur-md">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-electric-lime animate-pulse" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-300">
          SPATIAL TIMELINE MATRIX // 14 VERIFIED NODES
        </span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-[11px] font-mono text-slate-500 pointer-events-none">
        INTERACTIVE 3D NODES · CLICK ANY NODE TO INSPECT
      </div>

      <Canvas
        camera={{ position: [0, 1.2, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={15} color="#1558C9" />
        <pointLight position={[-10, -5, -5]} intensity={15} color="#D4FF24" />

        <SplineCurve points={vectorPoints} />

        {TIMELINE_MILESTONES.map((item, idx) => (
          <TimelineBeacon
            key={item.id}
            milestone={item}
            position={positions[idx]}
            isSelected={item.id === selectedId}
            onSelect={onSelectMilestone}
          />
        ))}

        <CameraRig targetPos={targetPos} />
      </Canvas>
    </div>
  );
}
