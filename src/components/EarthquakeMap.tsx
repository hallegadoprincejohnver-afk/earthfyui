import { useEffect, useRef, useState } from "react";
import * as MarkerClustererPkg from "@googlemaps/markerclusterer";
const MarkerClusterer =
  (MarkerClustererPkg as any).MarkerClusterer ??
  (MarkerClustererPkg as any).default?.MarkerClusterer;
type MarkerClustererInstance = InstanceType<typeof MarkerClusterer>;
import { DARK_MAP_STYLE, loadGoogleMaps } from "../lib/google-maps-loader";
import { severityMeta, severityOf, type Quake } from "../lib/usgs";

interface Props {
  user: { lat: number; lng: number };
  quakes: Quake[];
  selectedId: string | null;
  onSelect: (q: Quake) => void;
  showHeatmap: boolean;
}

export function EarthquakeMap({ user, quakes, selectedId, onSelect, showHeatmap }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const clustererRef = useRef<MarkerClustererInstance | null>(null);
  const heatmapRef = useRef<any>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // init map
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((g) => {
        if (cancelled || !ref.current) return;
        const map = new g.maps.Map(ref.current, {
          center: user,
          zoom: 6,
          styles: DARK_MAP_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
          backgroundColor: "#050816",
          gestureHandling: "greedy",
        });
        mapRef.current = map;
        infoRef.current = new g.maps.InfoWindow();
        // user marker
        userMarkerRef.current = new g.maps.Marker({
          position: user,
          map,
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#7dd3fc",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
          title: "You are here",
          zIndex: 9999,
        });
        setReady(true);
      })
      .catch((e) => setError(e?.message ?? "Map failed to load"));
    return () => {
      cancelled = true;
    };
  }, []);

  // recenter when user changes
  useEffect(() => {
    if (!mapRef.current || !userMarkerRef.current) return;
    userMarkerRef.current.setPosition(user);
    mapRef.current.panTo(user);
  }, [user.lat, user.lng]);

  // markers
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const g = window.google;
    const map = mapRef.current;

    // clear existing
    clustererRef.current?.clearMarkers();
    for (const m of markersRef.current.values()) m.setMap(null);
    markersRef.current.clear();
    for (const c of circlesRef.current) c.setMap(null);
    circlesRef.current = [];

    const newMarkers: google.maps.Marker[] = [];
    for (const q of quakes) {
      const sev = severityOf(q.mag);
      const color =
        sev === "severe" ? "#ef4444" : sev === "strong" ? "#f97316" : sev === "light" ? "#eab308" : "#22d3a8";
      const marker = new g.maps.Marker({
        position: { lat: q.lat, lng: q.lng },
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: Math.max(6, q.mag * 2.2),
          fillColor: color,
          fillOpacity: 0.85,
          strokeColor: "#ffffff",
          strokeWeight: 1,
        },
        animation: g.maps.Animation.DROP,
        title: `M${q.mag.toFixed(1)} · ${q.place}`,
      });
      marker.addListener("click", () => {
        if (infoRef.current) {
          infoRef.current.setContent(
            `<div style="font-family:Inter,system-ui;color:#0b1020;min-width:200px">
              <div style="font-weight:700;font-size:14px;margin-bottom:4px">M${q.mag.toFixed(
                1,
              )} — ${severityMeta[sev].label}</div>
              <div style="font-size:12px;margin-bottom:6px">${q.place}</div>
              <div style="font-size:11px;color:#475569">Depth ${q.depthKm.toFixed(
                1,
              )} km · ${q.distanceKm.toFixed(0)} km away</div>
              <div style="font-size:11px;color:#475569">${new Date(q.time).toLocaleString()}</div>
            </div>`,
          );
          infoRef.current.open({ map, anchor: marker });
        }
        onSelect(q);
      });
      markersRef.current.set(q.id, marker);
      newMarkers.push(marker);

      // magnitude radius
      const circle = new g.maps.Circle({
        center: { lat: q.lat, lng: q.lng },
        radius: Math.pow(2, q.mag) * 1500,
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: color,
        fillOpacity: 0.08,
        map,
      });
      circlesRef.current.push(circle);
    }

    clustererRef.current = new MarkerClusterer({ map, markers: newMarkers });

    return () => {
      clustererRef.current?.clearMarkers();
      clustererRef.current = null;
    };
  }, [ready, quakes, onSelect]);

  // heatmap
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const g = window.google as any;
    if (heatmapRef.current) heatmapRef.current.setMap(null);
    if (!showHeatmap || !g.maps.visualization) return;
    heatmapRef.current = new g.maps.visualization.HeatmapLayer({
      data: quakes.map((q) => ({
        location: new g.maps.LatLng(q.lat, q.lng),
        weight: Math.max(1, q.mag),
      })),
      radius: 40,
      opacity: 0.7,
      map: mapRef.current,
    });
  }, [ready, quakes, showHeatmap]);

  // fly-to selected
  useEffect(() => {
    if (!ready || !mapRef.current || !selectedId) return;
    const q = quakes.find((x) => x.id === selectedId);
    const marker = markersRef.current.get(selectedId);
    if (!q || !marker) return;
    mapRef.current.panTo({ lat: q.lat, lng: q.lng });
    if (mapRef.current.getZoom()! < 7) mapRef.current.setZoom(7);
    google.maps.event.trigger(marker, "click");
  }, [selectedId, ready, quakes]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl glass-panel">
      <div ref={ref} className="absolute inset-0" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      )}
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          Loading map…
        </div>
      )}
    </div>
  );
}