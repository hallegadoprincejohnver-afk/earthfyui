import { motion } from "framer-motion";
import {
  Activity,
  Globe2,
  Radar,
  ShieldCheck,
  Satellite,
  Bell,
  MapPin,
  Gauge,
  Network,
  Zap,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import globeAsset from "../assets/globe.asset.json";
import studioAsset from "../assets/studio.asset.json";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export function WhySection() {
  const items = [
    { icon: Radar, title: "Real-time tracking", body: "Streamed directly from global seismic stations, refreshed every 30 seconds." },
    { icon: Globe2, title: "Global coverage", body: "Every recorded tremor — from micro events to severe quakes — anywhere on Earth." },
    { icon: Activity, title: "Location intelligence", body: "Distance, depth, magnitude, and severity calculated from your exact coordinates." },
    { icon: ShieldCheck, title: "Trusted source", body: "Powered by the United States Geological Survey, the world's reference for seismology." },
  ];
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <motion.div {...fadeUp} className="mb-12 text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Why Winds</p>
        <h2 className="mt-3 text-3xl font-bold sm:text-5xl">A seismic command center</h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
          Built for professionals who need precision, speed, and clarity when the ground starts to move.
        </p>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-panel p-6"
          >
            <div
              className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: "var(--gradient-aurora)", color: "var(--primary-foreground)" }}
            >
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{it.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function DataSourceSection() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <motion.div {...fadeUp} className="glass-panel relative overflow-hidden p-10 sm:p-14">
        <div
          className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-aurora)" }}
        />
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "var(--gradient-aurora)", color: "var(--primary-foreground)" }}
          >
            <Satellite className="h-7 w-7" />
          </div>
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Data Source</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-4xl">USGS Global Seismic Network</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Continuously updated seismic feeds from the United States Geological Survey — the same source trusted by emergency response teams and research institutions worldwide.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <p>© {new Date().getFullYear()} Winds Earthquake Intelligence</p>
        <p className="max-w-md">
          For informational and situational awareness only. Not a substitute for official emergency services.
        </p>
      </div>
    </footer>
  );
}

/* -------- Live dashboard preview -------- */
const sampleQuakes = [
  { mag: 6.4, place: "Off the coast of Honshu, Japan", dist: 312, depth: 24, sev: "severe", time: "2m ago" },
  { mag: 5.1, place: "Northern California, USA", dist: 84, depth: 11, sev: "strong", time: "14m ago" },
  { mag: 4.3, place: "Aegean Sea, Greece", dist: 1280, depth: 8, sev: "light", time: "32m ago" },
  { mag: 3.2, place: "Anchorage, Alaska", dist: 540, depth: 32, sev: "minor", time: "47m ago" },
];
const sevColor: Record<string, string> = {
  minor: "var(--severity-minor)",
  light: "var(--severity-light)",
  strong: "var(--severity-strong)",
  severe: "var(--severity-severe)",
};

export function DashboardPreview() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Live Dashboard</p>
        <h2 className="mt-3 text-balance text-3xl font-bold sm:text-5xl">Mission control for the planet</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Magnitude, depth, distance and severity — distilled into a single, glanceable feed.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="glass-panel relative overflow-hidden p-4 sm:p-6"
        style={{ boxShadow: "0 40px 120px -40px oklch(0.78 0.18 230 / 0.45)" }}
      >
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[80%] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-aurora)" }}
        />
        <div className="relative grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          {/* Stats column */}
          <div className="flex flex-col gap-3">
            {[
              { icon: Activity, k: "247", v: "Events / 24h", trend: "+12%" },
              { icon: Gauge, k: "M 6.4", v: "Peak magnitude", trend: "Honshu" },
              { icon: BarChart3, k: "98.7%", v: "Network uptime", trend: "Stable" },
            ].map((s, i) => (
              <motion.div
                key={s.v}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-panel flex items-center gap-4 p-4"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "var(--gradient-aurora)", color: "var(--primary-foreground)" }}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-2xl font-bold">{s.k}</div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {s.trend}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Feed column */}
          <div className="glass-panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="font-display text-sm font-semibold">Live Feed</span>
              </div>
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">USGS · 30s</span>
            </div>
            <div className="space-y-2.5">
              {sampleQuakes.map((q, i) => (
                <motion.div
                  key={q.place}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.45 }}
                  className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/40 p-3 transition-all hover:border-primary/40"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg font-display font-bold"
                    style={{
                      background: `color-mix(in oklab, ${sevColor[q.sev]} 22%, transparent)`,
                      color: sevColor[q.sev],
                      boxShadow: `0 0 16px color-mix(in oklab, ${sevColor[q.sev]} 50%, transparent)`,
                    }}
                  >
                    <span className="text-lg leading-none">{q.mag.toFixed(1)}</span>
                    <span className="mt-0.5 text-[8px] uppercase tracking-widest opacity-80">MAG</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-sm font-semibold">{q.place}</div>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span>{q.dist} km</span>
                      <span>{q.depth} km deep</span>
                      <span>{q.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* -------- Interactive globe-style section -------- */
export function GlobeSection() {
  const panels = [
    { icon: Activity, title: "Seismic Pulse", body: "1.2M+ events tracked across every tectonic plate." },
    { icon: MapPin, title: "Hotspot Mapping", body: "Pacific Ring of Fire, Anatolian Fault, Mid-Atlantic Ridge." },
    { icon: Network, title: "Sensor Grid", body: "Synchronized with 2,000+ global seismograph stations." },
    { icon: Zap, title: "Sub-second Alerts", body: "Geodetic data normalized within milliseconds of arrival." },
  ];
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Interactive Globe</p>
        <h2 className="mt-3 text-balance text-3xl font-bold sm:text-5xl">The Earth, observed in real time</h2>
      </motion.div>

      <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.2fr_1fr]">
        {/* Left panels */}
        <div className="flex flex-col gap-4 lg:order-1">
          {panels.slice(0, 2).map((p, i) => (
            <GlobePanel key={p.title} {...p} delay={i * 0.1} align="right" />
          ))}
        </div>

        {/* Earth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative order-first mx-auto aspect-square w-full max-w-md lg:order-2"
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-full opacity-60 blur-3xl"
            style={{ background: "var(--gradient-aurora)" }}
          />
          <motion.img
            src={globeAsset.url}
            alt="3D holographic visualization of the Winds Earthquake Intelligence globe with active seismic hotspots"
            loading="lazy"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full rounded-3xl object-cover"
            style={{ boxShadow: "0 40px 120px -20px oklch(0.78 0.18 230 / 0.5)" }}
          />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="pointer-events-none absolute inset-0 rounded-full border border-primary/30"
              style={{ animation: `marker-pulse ${3 + i}s ease-out ${i * 0.6}s infinite` }}
            />
          ))}
        </motion.div>

        {/* Right panels */}
        <div className="flex flex-col gap-4 lg:order-3">
          {panels.slice(2).map((p, i) => (
            <GlobePanel key={p.title} {...p} delay={i * 0.1 + 0.2} align="left" />
          ))}
        </div>
      </div>
    </section>
  );
}

function GlobePanel({
  icon: Icon,
  title,
  body,
  delay,
  align,
}: {
  icon: typeof Activity;
  title: string;
  body: string;
  delay: number;
  align: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay }}
      className="glass-panel p-5"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: "var(--gradient-aurora)", color: "var(--primary-foreground)" }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* -------- Features grid (6 cards) -------- */
export function FeaturesSection() {
  const items = [
    { icon: Radar, title: "Real-Time Monitoring", body: "Track global earthquake activity the moment it's reported." },
    { icon: MapPin, title: "Location Detection", body: "Find tremors near your exact coordinates instantly." },
    { icon: Bell, title: "Fast Alerts", body: "Be the first to know when significant seismic events occur." },
    { icon: ShieldCheck, title: "Scientific Accuracy", body: "Powered by trusted USGS geological data feeds." },
    { icon: Globe2, title: "Global Coverage", body: "Continuous monitoring across every continent and ocean." },
    { icon: Network, title: "Reliable Infrastructure", body: "Engineered for 24/7 uninterrupted observation." },
  ];
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Features</p>
        <h2 className="mt-3 text-balance text-3xl font-bold sm:text-5xl">Engineered for precision</h2>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            whileHover={{ y: -4 }}
            className="glass-panel group relative overflow-hidden p-6"
          >
            <div
              className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
              style={{ background: "var(--gradient-aurora)" }}
            />
            <div
              className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: "var(--gradient-aurora)", color: "var(--primary-foreground)" }}
            >
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{it.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------- Data Visualization section -------- */
export function DataVizSection() {
  const bars = [12, 28, 18, 42, 36, 58, 44, 72, 60, 84, 66, 92, 78, 54, 38];
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Analytics</p>
          <h2 className="mt-3 text-balance text-3xl font-bold sm:text-5xl">Data that tells the story</h2>
          <p className="mt-4 text-muted-foreground">
            Magnitude distributions, regional activity and 7-day trend lines — visualized with the
            clarity professionals need to make fast, informed decisions.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { k: "7d", v: "Window" },
              { k: "M2+", v: "Sensitivity" },
              { k: "200", v: "Per query" },
            ].map((s) => (
              <div key={s.v} className="glass-panel p-3 text-center">
                <div className="font-display text-xl font-bold text-aurora">{s.k}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="glass-panel relative overflow-hidden p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-display text-sm font-semibold">7-Day Activity</span>
            </div>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Magnitude bins</span>
          </div>
          <div className="flex h-48 items-end gap-1.5">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height: `${h}%`, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: i * 0.03, ease: "easeOut" }}
                className="flex-1 rounded-t"
                style={{ background: "var(--gradient-aurora)", boxShadow: "0 0 12px oklch(0.78 0.18 230 / 0.5)" }}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            {(["minor", "light", "strong", "severe"] as const).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: sevColor[s] }} />
                {s}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------- Global Network -------- */
export function GlobalNetworkSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="glass-panel overflow-hidden p-2"
        >
          <img
            src={studioAsset.url}
            alt="Modern operations workstation representing the Winds monitoring environment"
            loading="lazy"
            className="aspect-[16/10] w-full rounded-xl object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Global Network</p>
          <h2 className="mt-3 text-balance text-3xl font-bold sm:text-5xl">Global Seismic Intelligence Network</h2>
          <p className="mt-4 text-muted-foreground">
            Earthquakes are observed by thousands of seismograph stations distributed across the planet.
            Winds aggregates their real-time reports, normalizes the geophysical data, and surfaces
            actionable insight — wherever you are.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "2,000+ contributing seismic stations",
              "USGS-grade event resolution",
              "Sub-minute end-to-end latency",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ background: "var(--gradient-aurora)", color: "var(--primary-foreground)" }}
                >
                  <Zap className="h-3 w-3" />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
