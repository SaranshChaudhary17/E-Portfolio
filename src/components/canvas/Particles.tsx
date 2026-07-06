"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles({ count = 250 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate localized particles in a tighter, highly visible cluster around the center
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const speed = 0.05 + Math.random() * 0.1;
      // Tight coordinates so they stay visible on screen
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10 - 2;
      const scale = 0.05 + Math.random() * 0.15;
      temp.push({ t, speed, x, y, z, scale });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    // Get normalized mouse pointer (-1 to 1)
    const { x: targetX, y: targetY } = state.pointer;

    particles.forEach((particle, i) => {
      let { t } = particle;
      const { speed, x, y, z, scale } = particle;
      t = particle.t += speed * 0.1;

      // Make particles float gently in 3D space, and add mouse lag/parallax
      const currentX = x + Math.sin(t) * 0.5 + targetX * 1.5;
      const currentY = y + Math.cos(t) * 0.5 + targetY * 1.5;
      const currentZ = z + Math.sin(t * 2) * 0.2;

      dummy.position.set(currentX, currentY, currentZ);
      dummy.scale.setScalar(scale * (1 + Math.sin(t) * 0.2));
      dummy.rotation.set(t * 0.5, t * 0.5, t * 0.5);
      dummy.updateMatrix();

      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });

    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      {/* Sleek semi-transparent particles with high depth write to look like clean sci-fi dust */}
      <meshBasicMaterial 
        color="#E7DDD2" 
        transparent 
        opacity={0.25} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
