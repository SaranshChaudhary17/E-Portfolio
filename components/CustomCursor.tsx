"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSystem, THEMES } from "./SystemProvider";

interface Point {
  x: number;
  y: number;
}

interface ClickRipple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
}

export default function CustomCursor() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, tier } = useSystem();

  // If on malik route, do not mount custom cursor
  if (pathname?.startsWith("/malik")) {
    return null;
  }

  useEffect(() => {
    // Only enable custom cursor for devices with a fine pointer (mouse/trackpad)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Tail segments: more points in high tier for a smoother ribbon
    const numPoints = tier === "high" ? 22 : tier === "medium" ? 16 : 10;
    const points: Point[] = Array.from({ length: numPoints }, () => ({ x: -999, y: -999 }));

    const mouse = { x: -999, y: -999, visible: false };
    let isHovered = false;
    let isClicking = false;
    const ripples: ClickRipple[] = [];

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.visible = true;

      // Check if hovering clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest("button, a, input, textarea, select, [role='button'], [data-sfx]");
        isHovered = !!interactive;
      }

      // If points were offscreen, initialize them all to current position
      if (points[0].x < -500) {
        for (let i = 0; i < numPoints; i++) {
          points[i].x = mouse.x;
          points[i].y = mouse.y;
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isClicking = true;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 4,
        maxR: 28,
        alpha: 0.8,
      });
    };

    const onPointerUp = () => {
      isClicking = false;
    };

    const onMouseLeave = () => {
      mouse.visible = false;
    };

    const onMouseEnter = () => {
      mouse.visible = true;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    let raf = 0;
    const accentColor = THEMES[theme] || "#E8751A";

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      if (mouse.visible && mouse.x >= 0 && mouse.y >= 0) {
        // Point 0 smoothly tracks mouse
        points[0].x += (mouse.x - points[0].x) * 0.85;
        points[0].y += (mouse.y - points[0].y) * 0.85;

        // Chained tail nodes follow previous node with smooth spring damping
        for (let i = 1; i < numPoints; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const ease = 0.42 - (i / numPoints) * 0.12; // earlier segments follow tighter
          curr.x += (prev.x - curr.x) * ease;
          curr.y += (prev.y - curr.y) * ease;
        }

        // Draw trailing tail ribbon
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = numPoints - 1; i >= 1; i--) {
          const p1 = points[i];
          const p0 = points[i - 1];
          const t = 1 - i / numPoints; // 1 at head, 0 at tail tip

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p0.x, p0.y);

          ctx.strokeStyle = accentColor;
          // Tail thickness tapers from ~4.5px down to ~0.5px
          ctx.lineWidth = Math.max(0.6, (isHovered ? 5.5 : 4) * t);
          // Opacity fades along the tail
          ctx.globalAlpha = Math.max(0.02, 0.75 * Math.pow(t, 1.4));
          ctx.stroke();
        }

        // Click ripples animation
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.r += (rip.maxR - rip.r) * 0.18 + 0.6;
          rip.alpha *= 0.88;

          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = rip.alpha;
          ctx.stroke();

          if (rip.alpha < 0.02 || rip.r >= rip.maxR) {
            ripples.splice(i, 1);
          }
        }

        // Outer hover halo / target ring
        const headX = points[0].x;
        const headY = points[0].y;

        if (isHovered) {
          ctx.beginPath();
          ctx.arc(headX, headY, isClicking ? 13 : 16, 0, Math.PI * 2);
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.45;
          ctx.stroke();

          // Subtle inner ring
          ctx.beginPath();
          ctx.arc(headX, headY, 10, 0, Math.PI * 2);
          ctx.fillStyle = accentColor;
          ctx.globalAlpha = 0.12;
          ctx.fill();
        }

        // Main center dot
        const dotRadius = isClicking ? 2.5 : isHovered ? 4.5 : 3.5;
        ctx.beginPath();
        ctx.arc(headX, headY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? accentColor : "#FFFFFF";
        ctx.globalAlpha = 0.95;
        ctx.fill();

        // High-contrast glow around dot for dark backgrounds
        ctx.beginPath();
        ctx.arc(headX, headY, dotRadius + 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [theme, tier]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
