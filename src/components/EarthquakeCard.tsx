import { motion } from "framer-motion";
import { MapPin, Activity, Clock, ArrowDownToLine } from "lucide-react";
import { type Quake, severityMeta, severityOf } from "../lib/usgs";

export function EarthquakeCard({
  quake,
  index,
  onSelect,
  active,
}: {
  quake: Quake;
  index: number;
  onSelect?: (q: Quake) => void;
  active?: boolean;
}) {
  const sev = severityOf(quake.mag);
  const meta = severityMeta[sev];
  const date = new Date(quake.time);
  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(quake)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.5), ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={`glass-panel group w-full overflow-hidden p-4 text-left transition-all ${
        active ? "ring-2 ring-primary shadow-[var(--glow-primary)]" : "hover:border-primary/40"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl font-display font-bold"
          style={{
            background: `color-mix(in oklab, ${meta.colorVar} 22%, transparent)`,
            color: meta.colorVar,
            boxShadow: `0 0 20px color-mix(in oklab, ${meta.colorVar} 50%, transparent)`,
          }}
        >
          <span className="text-2xl leading-none">{quake.mag.toFixed(1)}</span>
          <span className="mt-0.5 text-[10px] uppercase tracking-widest opacity-80">MAG</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.tw}`}
            >
              {meta.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {quake.distanceKm.toFixed(0)} km away
            </span>
          </div>
          <h3 className="mt-1 truncate font-display text-sm font-semibold text-foreground">
            {quake.place}
          </h3>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <ArrowDownToLine className="h-3 w-3" /> {quake.depthKm.toFixed(1)} km deep
            </span>
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3" /> {sev}
            </span>
            <span className="col-span-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {date.toLocaleString()} · {date.toISOString().slice(11, 19)} UTC
            </span>
            <span className="col-span-2 flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3" /> {quake.lat.toFixed(3)}, {quake.lng.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}