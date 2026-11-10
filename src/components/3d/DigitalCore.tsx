'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DigitalCoreProps {
  scrollProgress?: number;
  pointerPos?: { x: number; y: number };
}

export function DigitalCore({ scrollProgress = 0, pointerPos = { x: 0, y: 0 } }: DigitalCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);

  // Instanced or floating orbital nodes
  const nodes = useMemo(() => {
    const arr = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.8 + (i % 3) * 0.4;
      const y = (Math.sin(i * 1.5) * 0.8);
      arr.push({
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number],
        scale: 0.08 + (i % 4) * 0.03,
        rotationSpeed: 0.5 + Math.random() * 0.5,
      });
    }
    return arr;
  }, []);

  // Particle swarm forming digital intelligence field
  const particlePositions = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Electric blue (#315EFF) & Ice cyan (#75E6FF) & subtle Lime (#D4FF24)
    const colorBlue = new THREE.Color('#315EFF');
    const colorCyan = new THREE.Color('#75E6FF');
    const colorLime = new THREE.Color('#D4FF24');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spherical distribution with radius variance
      const radius = 1.6 + Math.pow(Math.random(), 2) * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const mixedColor = Math.random() > 0.90 
        ? colorLime 
        : (Math.random() > 0.4 ? colorCyan : colorBlue);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle floating and pointer parallax response
      const targetRotX = (pointerPos.y * 0.3) + Math.sin(t * 0.4) * 0.08;
      const targetRotY = (pointerPos.x * 0.4) + t * 0.12;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);

      // Scroll-driven position drift
      const targetPosY = 0.2 - scrollProgress * 1.8;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.05);
    }

    // Core pulsing & rotation
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.x = t * 0.25;
      coreMeshRef.current.rotation.y = t * 0.35;
      const pulse = 1 + Math.sin(t * 1.8) * 0.04;
      coreMeshRef.current.scale.set(pulse, pulse, pulse);
    }

    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x = -t * 0.4;
      innerMeshRef.current.rotation.z = t * 0.3;
    }

    // Orbital rings rotation at distinct speeds and axes
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.18;
      ring1Ref.current.rotation.x = Math.PI * 0.25 + Math.sin(t * 0.2) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.22;
      ring2Ref.current.rotation.y = Math.PI * 0.35 + Math.cos(t * 0.25) * 0.1;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.15;
      ring3Ref.current.rotation.y = t * 0.1;
    }

    // Particle field slow galaxy swirl
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05;
      particlesRef.current.rotation.z = Math.sin(t * 0.1) * 0.05;
    }

    // Orbiting nodes rotation
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y = -t * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Translucent Intelligence Core: Outer Icosahedron */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[1.4, 2]} />
        <meshPhysicalMaterial
          color="#315EFF"
          emissive="#1E44D6"
          emissiveIntensity={0.65}
          roughness={0.15}
          metalness={0.2}
          transmission={0.88}
          thickness={1.2}
          transparent
          opacity={0.9}
          wireframe={false}
        />
      </mesh>

      {/* Outer Wireframe Cage for Editorial Blueprint Vibe */}
      <mesh>
        <icosahedronGeometry args={[1.42, 2]} />
        <meshBasicMaterial
          color="#75E6FF"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Internal High-Energy Crystalline Core */}
      <mesh ref={innerMeshRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#75E6FF"
          emissive="#75E6FF"
          emissiveIntensity={2.0}
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>

      {/* Primary Orbital Ring 1 - Electric Blue */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[2.2, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#315EFF"
            emissive="#315EFF"
            emissiveIntensity={1.8}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Secondary Orbital Ring 2 - Ice Cyan Filament */}
      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[2.6, 0.015, 16, 120]} />
          <meshStandardMaterial
            color="#75E6FF"
            emissive="#75E6FF"
            emissiveIntensity={2.2}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Tertiary Orbital Ring 3 - Outer Technical Track */}
      <group ref={ring3Ref}>
        <mesh>
          <torusGeometry args={[3.1, 0.012, 16, 120]} />
          <meshBasicMaterial
            color="#75E6FF"
            transparent
            opacity={0.35}
            wireframe
          />
        </mesh>
      </group>

      {/* Orbiting Satellite Data Nodes */}
      <group ref={nodesGroupRef}>
        {nodes.map((node, idx) => (
          <mesh key={idx} position={node.position}>
            <octahedronGeometry args={[node.scale, 0]} />
            <meshStandardMaterial
              color={idx % 4 === 0 ? '#D4FF24' : (idx % 2 === 0 ? '#75E6FF' : '#315EFF')}
              emissive={idx % 4 === 0 ? '#D4FF24' : (idx % 2 === 0 ? '#75E6FF' : '#315EFF')}
              emissiveIntensity={idx % 4 === 0 ? 1.5 : 1.2}
              roughness={0.25}
            />
          </mesh>
        ))}
      </group>

      {/* Galaxy Particle Ecosystem */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.positions.length / 3}
            array={particlePositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particlePositions.colors.length / 3}
            array={particlePositions.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
