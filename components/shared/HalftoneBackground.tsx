'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Fixed, full-screen halftone dot field used behind the membership page.
 * Soft patches are anchored down the page, alternating left and right margins, so scrolling keeps
 * revealing new ones beside the content; each only drifts slightly, so the field never goes blank.
 * A faint base layer of dots covers everything. Dots turn red only at a patch's centre.
 * Static for prefers-reduced-motion; paused when the tab is hidden.
 */
const PATCH_SPACING = 760; // px of page between patches
const PARALLAX = 0.6; // patches move at 60% of scroll speed
const BASE = 0.16; // faint dots everywhere

const GAP = 13;
const FRAME_MS = 50; // ~20fps is plenty for a slow drift

type HalftoneBackgroundProps = {
  /** A subtle cluster of dots behind a heading: x as a fraction of the width, y in px from the page top */
  focus?: { x: number; y: number };
};

export default function HalftoneBackground({ focus }: HalftoneBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const field = (x: number, y: number, t: number) => {
      const sy = y + window.scrollY * PARALLAX; // page-space y
      const radius = Math.min(560, Math.max(220, w * 0.42));
      let v = 0;
      // only the patches near this point matter
      const k0 = Math.floor((sy - radius) / PATCH_SPACING) - 1;
      for (let k = k0; k <= k0 + 3; k++) {
        const left = ((k % 2) + 2) % 2 === 0;
        const cx = w * (left ? 0.12 : 0.88) + Math.sin(t * 0.00009 + k * 1.7) * w * 0.05;
        const cy = k * PATCH_SPACING + PATCH_SPACING * 0.35 + Math.cos(t * 0.00007 + k) * 70;
        v = Math.max(v, 1 - Math.hypot(x - cx, sy - cy) / radius);
      }
      if (focus) {
        // gathered behind the heading; stays put (only breathes slightly) so it never leaves
        const fr = Math.min(480, Math.max(200, w * 0.36)) * (1 + Math.sin(t * 0.0006) * 0.04);
        const fy = focus.y - window.scrollY * (1 - PARALLAX); // tracks the heading as the page scrolls
        v = Math.max(v, 1 - Math.hypot((x - w * focus.x) * 0.5, (sy - fy) * 1.15) / fr);
      }
      const ripple =
        (Math.sin(x * 0.012 + t * 0.0004) + Math.sin(sy * 0.014 - t * 0.0003) + Math.sin((x + sy) * 0.006)) / 6 + 0.5;
      return Math.max(BASE, Math.min(1, v * 0.9 + ripple * 0.18 - 0.06));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = (y / GAP) % 2 ? GAP : GAP / 2; x < w; x += GAP) {
          const v = field(x, y, t);
          const r = v * GAP * 0.3;
          if (r < 0.6) continue;
          ctx.fillStyle =
            v > 0.68 ? `rgba(255,42,61,${0.12 + (v - 0.68) * 0.55})` : `rgba(255,255,255,${0.025 + v * 0.06})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (t: number) => {
      if (t - last > FRAME_MS) {
        draw(t);
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) draw(0);
      else raf = requestAnimationFrame(loop);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    const onResize = () => {
      resize();
      draw(performance.now());
    };
    const onScroll = () => draw(reduce ? 0 : performance.now());

    resize();
    start();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [focus?.x, focus?.y]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
