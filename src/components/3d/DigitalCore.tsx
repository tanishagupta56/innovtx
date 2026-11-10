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

  // Instanced floating orbital nodes
  const nodes = useMemo(() => {
    const arr = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.7 + (i % 3) * 0.35;
      const y = Math.sin(i * 1.5) * 0.7;
      const nodeType: 'lime' | 'orange' | 'blue' =
        i % 4 === 0 ? 'lime' : (i % 3 === 0 ? 'orange' : 'blue');

      arr.push({
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number],
        scale: 0.08 + (i % 3) * 0.03,
        nodeType,
      });
    }
    return arr;
  }, []);

  // Optimized Particle Swarm (900 particles instead of 1800 for 2x performance)
  const particlePositions = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Color tokens: Electric Blue (#315EFF), Lime Green (#B8D94C), Burnt Orange (#D65A31)
    const colorBlue = new THREE.Color('#315EFF');
    const colorLime = new THREE.Color('#B8D94C');
    const colorOrange = new THREE.Color('#D65A31');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 1.6 + Math.pow(Math.random(), 2) * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const rand = Math.random();
      const mixedColor = rand > 0.85 ? colorLime : (rand > 0.72 ? colorOrange : colorBlue);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle floating and pointer parallax response
      const targetRotX = (pointerPos.y * 0.25) + Math.sin(t * 0.35) * 0.06;
      const targetRotY = (pointerPos.x * 0.35) + t * 0.1;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);

      // Scroll-driven position drift
      const targetPosY = 0.2 - scrollProgress * 1.6;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.05);
    }

    // Core pulsing & rotation
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.x = t * 0.22;
      coreMeshRef.current.rotation.y = t * 0.3;
      const pulse = 1 + Math.sin(t * 1.6) * 0.035;
      coreMeshRef.current.scale.set(pulse, pulse, pulse);
    }

    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x = -t * 0.35;
      innerMeshRef.current.rotation.z = t * 0.25;
    }

    // Orbital rings rotation at distinct speeds and axes
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.16;
      ring1Ref.current.rotation.x = Math.PI * 0.25 + Math.sin(t * 0.2) * 0.08;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.2;
      ring2Ref.current.rotation.y = Math.PI * 0.35 + Math.cos(t * 0.22) * 0.08;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.12;
      ring3Ref.current.rotation.y = t * 0.08;
    }

    // Particle field galaxy swirl
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.04;
    }

    // Orbiting nodes rotation
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y = -t * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Translucent Intelligence Core */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshPhysicalMaterial
          color="#315EFF"
          emissive="#1E44D6"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.25}
          transmission={0.85}
          thickness={1.1}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Outer Wireframe Cage: Editorial Blueprint Aesthetic */}
      <mesh>
        <icosahedronGeometry args={[1.37, 2]} />
        <meshBasicMaterial
          color="#537AFF"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Internal Crystalline Core (Lime-green energy focus) */}
      <mesh ref={innerMeshRef}>
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#B8D94C"
          emissive="#B8D94C"
          emissiveIntensity={1.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Primary Orbital Ring: Electric Blue */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[2.2, 0.02, 16, 80]} />
          <meshStandardMaterial
            color="#315EFF"
            emissive="#315EFF"
            emissiveIntensity={1.6}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Secondary Orbital Ring: Lime Green Filament */}
      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[2.55, 0.015, 16, 90]} />
          <meshStandardMaterial
            color="#B8D94C"
            emissive="#B8D94C"
            emissiveIntensity={2.0}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Tertiary Orbital Ring: Burnt Orange Energy Track */}
      <group ref={ring3Ref}>
        <mesh>
          <torusGeometry args={[3.0, 0.012, 16, 90]} />
          <meshStandardMaterial
            color="#D65A31"
            emissive="#D65A31"
            emissiveIntensity={1.4}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Orbiting Satellite Data Nodes */}
      <group ref={nodesGroupRef}>
        {nodes.map((node, idx) => {
          const color = node.nodeType === 'lime' ? '#B8D94C' : (node.nodeType === 'orange' ? '#D65A31' : '#315EFF');
          return (
            <mesh key={idx} position={node.position}>
              <octahedronGeometry args={[node.scale, 0]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.5}
                roughness={0.25}
              />
            </mesh>
          );
        })}
      </group>

      {/* Galaxy Particle Field */}
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
          opacity={0.75}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
export default DigitalCore;
