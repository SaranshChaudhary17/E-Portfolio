"use client";

import { Float, MeshDistortMaterial, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function HologramCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
  });

  return (
    <group position={[2.05, 0.05, -0.8]} scale={0.62}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7}>
        <mesh ref={ref}>
          <icosahedronGeometry args={[1.55, 2]} />
          <MeshDistortMaterial
            color="#E8751A"
            emissive="#B85A12"
            emissiveIntensity={0.55}
            roughness={0.18}
            metalness={0.65}
            distort={0.22}
            speed={1.2}
            transparent
            opacity={0.42}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.25, 0.012, 16, 120]} />
          <meshBasicMaterial color="#A9C4DA" transparent opacity={0.38} />
        </mesh>
        <mesh rotation={[0.4, 0.2, 0.1]}>
          <torusGeometry args={[2.75, 0.01, 16, 120]} />
          <meshBasicMaterial color="#E8751A" transparent opacity={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

export function AmbientScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-45 mix-blend-screen">
      <Canvas camera={{ position: [0, 0.6, 7], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <pointLight position={[3, 3, 3]} color="#E8751A" intensity={15} />
          <pointLight position={[-4, -1, 2]} color="#A9C4DA" intensity={7} />
          <Stars radius={52} depth={18} count={850} factor={2.5} saturation={0} fade speed={0.25} />
          <HologramCore />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
        </Suspense>
      </Canvas>
    </div>
  );
}
