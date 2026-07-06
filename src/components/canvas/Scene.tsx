"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Preload } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import Particles from "./Particles";

// Sub-component to manage interactive, mouse-reactive main shapes
function HologramShapes() {
  const leftShape = useRef<THREE.Mesh>(null);
  const rightShape = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const { x, y } = state.pointer;
    
    // Smoothly ease the rotation of shapes toward the mouse cursor position
    if (leftShape.current) {
      leftShape.current.rotation.y = THREE.MathUtils.lerp(leftShape.current.rotation.y, x * 0.8, 0.1);
      leftShape.current.rotation.x = THREE.MathUtils.lerp(leftShape.current.rotation.x, -y * 0.8, 0.1);
    }
    
    if (rightShape.current) {
      rightShape.current.rotation.y = THREE.MathUtils.lerp(rightShape.current.rotation.y, x * 1.2, 0.1);
      rightShape.current.rotation.x = THREE.MathUtils.lerp(rightShape.current.rotation.x, -y * 1.2, 0.1);
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={1.5}>
      {/* Interactive Right-side Holographic Octahedron */}
      <mesh ref={rightShape} position={[2.5, 0, -2.5]}>
        <octahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial 
          color="#E8751A" 
          wireframe 
          transparent 
          opacity={0.6}
          emissive="#E8751A"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Interactive Left-side Holographic Icosahedron */}
      <mesh ref={leftShape} position={[-2.5, -0.8, -3.5]}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial 
          color="#7FA1BE" 
          wireframe 
          transparent 
          opacity={0.4}
          emissive="#7FA1BE"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#0D0D0D]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          {/* Futuristic volumetric-like spotlight pointing at the interactive center */}
          <spotLight 
            position={[5, 5, 5]} 
            angle={0.25} 
            penumbra={1} 
            intensity={2} 
            color="#E8751A"
          />
          
          <HologramShapes />
          <Particles count={150} />
          
          <Environment preset="city" />
          <Preload all />
        </Suspense>
      </Canvas>
      {/* Soft overlay gradient to blend the WebGL canvas smoothly into the cinematic UI theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0D0D]/40 to-[#0D0D0D] pointer-events-none" />
    </div>
  );
}
