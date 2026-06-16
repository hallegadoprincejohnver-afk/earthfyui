import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { ArrowLeft, Flame, List, Map as MapIcon, RefreshCw, Settings2 } from "lucide-react";
import { GalaxyBackground } from "../components/GalaxyBackground";
import { EarthquakeCard } from "../components/EarthquakeCard";
import { EarthquakeMap } from "../components/EarthquakeMap";
import { useNearbyQuakes } from "../hooks/useNearbyQuakes";
import { severityOf, type Quake } from "../lib/usgs";

const searchSchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radius: z.coerce.number().min(100).max(1000).default(500),
});

export const Route = createFileRoute("/dashboard")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Live Earthquake Dashboard | Winds" },
      { name: "description", content: "Real-time map and feed of earthquakes near your location, updated every 30 seconds." },
      { property: "og:title", content: "Live Earthquake Dashboard | Winds" },
      { property: "og:description", content: "Real-time map and feed of earthquakes near your location, updated every 30 seconds." },
    ],
  }),
  component: Dashboard,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center text-sm text-destructive">
      {error.message}
    </div>
  ),
});

type ViewMode = "split" | "map" | "list";

function Dashboard() {
  const { lat, lng, radius } = Route.useSearch();
  const [radiusKm, setRadiusKm] = useState(radius);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [view, setView] = useState<ViewMode>("split");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data, isLoading, isFetching, dataUpdatedAt, refetch, error } = useNearbyQuakes({
    lat,
    lng,
    radiusKm,
    autoRefresh,
  });
  const quakes = data ?? [];
  const strongest = useMemo(() => quakes[0], [quakes]);
  const counts = useMemo(() => {
    const c = { minor: 0, light: 0, strong: 0, severe: 0 };
    for (const q of quakes) c[severityOf(q.mag)]++;
    return c;
  }, [quakes]);

  const onSelect = (q: Quake) => setSelectedId(q.id);

  return (
    <div className="relative min-h-screen">
      <GalaxyBackground />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="hidden h-5 w-px bg-border sm:block" />
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 animate-pulse rounded-full"
              style={{ background: autoRefresh ? "var(--severity-minor)" : "var(--muted-foreground)" }}
            />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {autoRefresh ? "Live" : "Paused"}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {lat.toFixed(3)}°, {lng.toFixed(3)}°
          </div>
          <div className="text-xs text-muted-foreground">
            {dataUpdatedAt ? `Updated ${new Date(dataUpdatedAt).toLocaleTimeString()}` : "—"}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden rounded-full border border-border bg-card/60 p-1 sm:flex">
              {(["split", "map", "list"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider transition ${
                    view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowHeatmap((s) => !s)}
              className={`hidden h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition sm:inline-flex ${
                showHeatmap ? "border-accent/60 bg-accent/20 text-accent" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Flame className="h-3.5 w-3.5" /> Heatmap
            </button>
            <button
              onClick={() => setAutoRefresh((s) => !s)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition ${
                autoRefresh ? "border-primary/60 bg-primary/20 text-primary" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Auto · 30s
            </button>
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
              aria-label="Settings"
            >
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Settings drawer */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/40"
            >
              <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
                <label className="flex flex-1 items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
                  Radius
                  <input
                    type="range"
                    min={100}
                    max={1000}
                    step={50}
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="w-16 text-right font-mono text-sm text-foreground">{radiusKm} km</span>
                </label>
                <button
                  onClick={() => refetch()}
                  className="rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium text-foreground hover:bg-card"
                >
                  Refresh now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Stats strip */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-3 px-4 pt-4 sm:grid-cols-5 sm:px-6">
        <Stat label="Total" value={quakes.length} />
        <Stat label="Strongest" value={strongest ? `M${strongest.mag.toFixed(1)}` : "—"} accent />
        <Stat label="Severe 7+" value={counts.severe} color="var(--severity-severe)" />
        <Stat label="Strong 5–6.9" value={counts.strong} color="var(--severity-strong)" />
        <Stat label="Light 4–4.9" value={counts.light} color="var(--severity-light)" />
      </div>

      {/* Main grid */}
      <div className="mx-auto grid max-w-[1600px] gap-4 px-4 pt-4 pb-8 sm:px-6 lg:h-[calc(100vh-12rem)] lg:grid-cols-[1.4fr_1fr]">
        {(view === "split" || view === "map") && (
          <div className={`h-[55vh] lg:h-full ${view === "map" ? "lg:col-span-2" : ""}`}>
            <EarthquakeMap
              user={{ lat, lng }}
              quakes={quakes}
              selectedId={selectedId}
              onSelect={onSelect}
              showHeatmap={showHeatmap}
            />
          </div>
        )}
        {(view === "split" || view === "list") && (
          <div
            className={`glass-panel flex h-[60vh] flex-col lg:h-full ${
              view === "list" ? "lg:col-span-2 lg:h-full" : ""
            }`}
          >
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-primary" />
                <h2 className="font-display text-sm font-semibold uppercase tracking-widest">Live Feed</h2>
              </div>
              <span className="text-xs text-muted-foreground">{quakes.length} events</span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  Failed to load data: {(error as Error).message}
                </div>
              )}
              {isLoading && (
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-card/40" />
                  ))}
                </div>
              )}
              {!isLoading && quakes.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
                  <MapIcon className="h-8 w-8 opacity-50" />
                  No earthquakes detected within {radiusKm} km in the past week.
                  Try increasing the radius.
                </div>
              )}
              {quakes.map((q, i) => (
                <EarthquakeCard
                  key={q.id}
                  quake={q}
                  index={i}
                  active={selectedId === q.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  color,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  color?: string;
}) {
  return (
    <div className="glass-panel p-3 sm:p-4">
      <div
        className={`font-display text-xl font-bold sm:text-2xl ${accent ? "text-aurora" : ""}`}
        style={color && !accent ? { color } : undefined}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
