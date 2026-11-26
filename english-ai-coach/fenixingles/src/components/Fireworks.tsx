// Foguetes de festa em canvas: sobem, explodem em faíscas coloridas e somem (~4 s).
import { useEffect, useRef } from "react";

const COLORS = ["#ffd23f", "#ff6a2b", "#ff6fd0", "#36e0c4", "#9b6bff", "#2f8bff", "#ffffff"];
type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; rocket: boolean };

export function Fireworks({ bursts = 7, className = "" }: { bursts?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const fit = () => { cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    fit();
    const W = () => cv.clientWidth, H = () => cv.clientHeight;
    const ps: P[] = [];
    let launched = 0, frame = 0, raf = 0;
    const launch = () => {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)]!;
      ps.push({ x: W() * (0.15 + Math.random() * 0.7), y: H(), vx: (Math.random() - 0.5) * 1.5, vy: -(H() / 70 + Math.random() * 3), life: 0, max: 45 + Math.random() * 15, c, rocket: true });
      launched++;
    };
    const tick = () => {
      frame++;
      if (launched < bursts && frame % 18 === 1) launch();
      ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.fillRect(0, 0, W(), H());
      ctx.globalCompositeOperation = "lighter";
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]!;
        p.life++; p.x += p.vx; p.y += p.vy; p.vy += p.rocket ? 0.12 : 0.05; p.vx *= p.rocket ? 1 : 0.985;
        if (p.rocket && (p.vy >= -1 || p.life > p.max)) {
          const n = 38 + Math.floor(Math.random() * 20), sp = 2.2 + Math.random() * 1.8;
          for (let k = 0; k < n; k++) {
            const a = (k / n) * Math.PI * 2, s = sp * (0.6 + Math.random() * 0.5);
            ps.push({ x: p.x, y: p.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: 55 + Math.random() * 25, c: Math.random() < 0.25 ? "#ffffff" : p.c, rocket: false });
          }
          ps.splice(i, 1); continue;
        }
        if (!p.rocket && p.life > p.max) { ps.splice(i, 1); continue; }
        const alpha = p.rocket ? 1 : 1 - p.life / p.max;
        ctx.globalAlpha = alpha; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.rocket ? 2.6 : 2.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (launched < bursts || ps.length) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W(), H());
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", fit);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", fit); };
  }, [bursts]);
  return <canvas ref={ref} aria-hidden className={`pointer-events-none fixed inset-0 z-30 h-full w-full ${className}`} />;
}
