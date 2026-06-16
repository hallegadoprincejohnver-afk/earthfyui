import { useEffect, useRef } from "react";

/** GPU-friendly multi-layer galaxy: canvas stars + CSS nebula gradients with slow drift. */
export function GalaxyBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = canvas;
    const g = ctx;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let raf = 0;

    type Star = { x: number; y: number; z: number; r: number; tw: number };
    let stars: Star[] = [];

    function resize() {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(280, Math.floor((w * h) / (window.innerWidth < 640 ? 9000 : 5000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 1.2 + 0.2,
        tw: Math.random() * Math.PI * 2,
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    function frame() {
      t += 0.008;
      g.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.y += s.z * 0.18;
        if (s.y > h) s.y = 0;
        const alpha = 0.5 + Math.sin(t * 2 + s.tw) * 0.4;
        g.beginPath();
        g.fillStyle = `rgba(${200 + s.z * 55}, ${220 + s.z * 35}, 255, ${alpha * s.z})`;
        g.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        g.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    if (!reduce) frame();
    else {
      g.clearRect(0, 0, w, h);
      for (const s of stars) {
        g.fillStyle = `rgba(220,230,255,${s.z * 0.8})`;
        g.beginPath();
        g.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        g.fill();
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* nebula clouds */}
      <div
        className="absolute -top-40 -left-40 h-[60vh] w-[60vh] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.25 305 / 0.7), transparent 60%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[70vh] w-[70vh] rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 230 / 0.7), transparent 60%)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[50vh] w-[50vh] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.6 0.2 200 / 0.6), transparent 60%)" }}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      {/* subtle grain via radial */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}