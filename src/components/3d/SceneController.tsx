'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneControllerProps {
  scrollProgress: number;
  pointerPos: { x: number; y: number };
}

export function SceneController({ scrollProgress, pointerPos }: SceneControllerProps) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0, 6.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // Determine target camera position based on scrollProgress
    // 0.0 - 0.2: Hero Section (wide establishing shot of Core)
    // 0.2 - 0.45: About / Mission (fly slightly to right, closer focus)
    // 0.45 - 0.7: Initiatives / Timeline Preview (dramatic angled perspective)
    // 0.7 - 1.0: Community / Footer (elevated overview with expansive field)
    let targetX = 0;
    let targetY = 0;
    let targetZ = 6.5;

    let lookTargetX = 0;
    let lookTargetY = 0;
    let lookTargetZ = 0;

    if (scrollProgress <= 0.25) {
      // Hero: centered, reacting smoothly to pointer
      const p = scrollProgress / 0.25;
      targetX = THREE.MathUtils.lerp(0, 1.2, p);
      targetY = THREE.MathUtils.lerp(0, 0.4, p);
      targetZ = THREE.MathUtils.lerp(6.5, 5.2, p);
    } else if (scrollProgress <= 0.55) {
      // About / Stats: offset right, closer
      const p = (scrollProgress - 0.25) / 0.3;
      targetX = THREE.MathUtils.lerp(1.2, -1.6, p);
      targetY = THREE.MathUtils.lerp(0.4, -0.6, p);
      targetZ = THREE.MathUtils.lerp(5.2, 4.8, p);
      lookTargetX = THREE.MathUtils.lerp(0, 0.4, p);
    } else if (scrollProgress <= 0.8) {
      // Initiatives / Timeline: angled cinematic dynamic view
      const p = (scrollProgress - 0.55) / 0.25;
      targetX = THREE.MathUtils.lerp(-1.6, 1.8, p);
      targetY = THREE.MathUtils.lerp(-0.6, 0.8, p);
      targetZ = THREE.MathUtils.lerp(4.8, 5.8, p);
      lookTargetX = THREE.MathUtils.lerp(0.4, -0.3, p);
    } else {
      // Community / End: broad overhead vista
      const p = (scrollProgress - 0.8) / 0.2;
      targetX = THREE.MathUtils.lerp(1.8, 0, p);
      targetY = THREE.MathUtils.lerp(0.8, 1.4, p);
      targetZ = THREE.MathUtils.lerp(5.8, 7.2, p);
      lookTargetY = THREE.MathUtils.lerp(0, -0.5, p);
    }

    // Add pointer parallax
    targetX += pointerPos.x * 0.4;
    targetY += pointerPos.y * 0.3;

    // Smooth dampening
    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetX, 2.5, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetY, 2.5, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetZ, 2.5, delta);

    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, lookTargetX, 2.5, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, lookTargetY, 2.5, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, lookTargetZ, 2.5, delta);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
