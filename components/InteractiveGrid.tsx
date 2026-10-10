"use client";
import { useEffect, useRef } from "react";
import { useSystem, THEMES } from "./SystemProvider";

export default function InteractiveGrid() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { tier, theme } = useSystem();

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    // Smaller grid gap as requested
    const gap = tier === "high" ? 16 : tier === "medium" ? 24 : 36;
    const dpr = Math.min(window.devicePixelRatio || 1, tier === "high" ? 1.5 : 1);
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };
    let intensity = 0;
    let lastMoveTime = 0;
    let lastMouseX = -999, lastMouseY = -999;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now = 0) => {
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;

      // Smooth decay for intensity when mouse stops moving
      intensity *= 0.93;
      if (intensity < 0.005) intensity = 0;

      ctx.clearRect(0, 0, w, h);

      // Sea wave time progression
      const time = now * 0.0016;

      // Compound fluid sea wave calculation (no space/gap hole creation)
      const warp = (x: number, y: number): [number, number] => {
        const w1 = Math.sin(x * 0.007 + y * 0.005 - time) * 5.5;
        const w2 = Math.cos(x * 0.01 - y * 0.007 + time * 0.75) * 3;
        const wx = x + Math.cos(y * 0.007 - time * 0.8) * 3;
        const wy = y + w1 + w2;
        return [wx, wy];
      };

      ctx.beginPath();

      // Horizontal lines with sea wave undulation
      for (let y = 0; y <= h + gap; y += gap) {
        for (let x = 0; x <= w + gap; x += gap / 2.5) {
          const [px, py] = warp(x, y);
          if (x === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }

      // Vertical lines with sea wave undulation
      for (let x = 0; x <= w + gap; x += gap) {
        for (let y = 0; y <= h + gap; y += gap / 2.5) {
          const [px, py] = warp(x, y);
          if (y === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }

      // Right diagonal lines (/) with sea wave undulation
      for (let c = 0; c <= w + h + gap; c += gap) {
        const xMin = Math.max(0, c - (h + gap));
        const xMax = Math.min(w + gap, c);
        if (xMin >= xMax) continue;

        let first = true;
        for (let x = xMin; x <= xMax; x += gap / 2.5) {
          const y = c - x;
          const [px, py] = warp(x, y);
          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        const [lastX, lastY] = warp(xMax, c - xMax);
        ctx.lineTo(lastX, lastY);
      }

      // 1. Base grid stroke (subtle 5% theme color)
      ctx.strokeStyle = THEMES[theme];
      ctx.globalAlpha = 0.05;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Velocity-driven grey-white glow with fade effect (only when moving)
      if (intensity > 0.01 && mouse.x >= -50 && mouse.y >= -50) {
        const R = 200;
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, R);
        // Tasteful grey-white mid tone (not piercing white, perfectly balanced)
        const peakAlpha = Math.min(0.42, intensity * 0.42);
        grad.addColorStop(0, `rgba(225, 230, 238, ${peakAlpha})`);
        grad.addColorStop(0.4, `rgba(195, 202, 212, ${peakAlpha * 0.6})`);
        grad.addColorStop(0.75, `rgba(160, 168, 180, ${peakAlpha * 0.2})`);
        grad.addColorStop(1, "rgba(160, 168, 180, 0)");

        ctx.strokeStyle = grad;
        ctx.globalAlpha = 1;
        ctx.stroke();
      }

      if (tier !== "saver") {
        raf = requestAnimationFrame(draw);
      }
    };

    const move = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastMoveTime);
      lastMoveTime = now;

      if (lastMouseX >= 0 && lastMouseY >= 0) {
        const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
        const speed = dist / dt; // Speed factor
        // Increment intensity according to movement speed
        intensity = Math.min(1.0, intensity + speed * 0.35 + 0.08);
      } else {
        intensity = 0.25;
      }

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    const leave = () => {
      mouse.tx = -999;
      mouse.ty = -999;
      lastMouseX = -999;
      lastMouseY = -999;
      intensity = 0;
    };

    resize();
    draw(performance.now());

    window.addEventListener("resize", resize);
    if (tier !== "saver") {
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerleave", leave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, [tier, theme]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
