import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crosshair, Loader2 } from "lucide-react";

export function DetectButton({ size = "lg" }: { size?: "lg" | "md" }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function detect() {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        navigate({ to: "/dashboard", search: { lat: latitude, lng: longitude, radius: 500 } });
      },
      (err) => {
        setLoading(false);
        setError(err.message || "Unable to retrieve your location.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }

  const big = size === "lg";

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onClick={detect}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full font-display font-semibold uppercase tracking-wider transition-all ${
          big ? "px-10 py-5 text-base" : "px-6 py-3 text-sm"
        } glow-pulse disabled:opacity-80`}
        style={{
          background: "var(--gradient-aurora)",
          color: "var(--primary-foreground)",
        }}
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        {loading ? (
          <>
            <Loader2 className={big ? "h-5 w-5 animate-spin" : "h-4 w-4 animate-spin"} />
            Scanning seismic activity…
          </>
        ) : (
          <>
            <Crosshair className={big ? "h-5 w-5" : "h-4 w-4"} />
            Detect Earthquake Near Me
          </>
        )}
      </motion.button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}