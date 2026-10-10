"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSystem, THEMES } from "./SystemProvider";

// Abstract particle bust (head + shoulders). Apna GLB/face scan baad me yahan swap kar sakte ho.
export default function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const { tier, theme } = useSystem();

  useEffect(() => {
    const el = ref.current!;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === "high" ? 2 : 1));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100);
    cam.position.z = 7;

    const N = tier === "high" ? 16000 : tier === "medium" ? 7000 : 2500;
    const pos = new Float32Array(N * 3);
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    for (let i = 0; i < N; i++) {
      let x = gauss(), y = gauss(), z = gauss();
      const l = Math.hypot(x, y, z) || 1; x /= l; y /= l; z /= l;       // sphere surface
      const head = Math.random() < 0.7;
      const j = 0.04 * Math.random();
      pos[i * 3]     = (head ? x * 1.0 : x * 2.1) + j;
      pos[i * 3 + 1] = (head ? y * 1.3 + 0.7 : y * 0.55 - 1.5) + j;
      pos[i * 3 + 2] = (head ? z * 1.05 : z * 0.9) + j;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.022, color: THEMES[theme], transparent: true, opacity: 0.85, depthWrite: false });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    const m = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => { m.x = (e.clientX / window.innerWidth) * 2 - 1; m.y = (e.clientY / window.innerHeight) * 2 - 1; };
    const onResize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      cam.aspect = el.clientWidth / el.clientHeight; cam.updateProjectionMatrix();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);

    let raf = 0;
    const loop = (t: number) => {
      pts.rotation.y += (m.x * 0.7 - pts.rotation.y) * 0.06;            // pointer follow
      pts.rotation.x += (m.y * 0.35 - pts.rotation.x) * 0.06;
      pts.position.y = Math.sin(t / 1200) * 0.06;                       // idle breathing
      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      geo.dispose(); mat.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, [tier, theme]);

  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />;
}
