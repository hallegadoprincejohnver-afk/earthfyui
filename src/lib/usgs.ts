export interface Quake {
  id: string;
  mag: number;
  place: string;
  time: number;
  depthKm: number;
  lat: number;
  lng: number;
  url: string;
  distanceKm: number;
}

export type Severity = "minor" | "light" | "strong" | "severe";

export function severityOf(mag: number): Severity {
  if (mag >= 7) return "severe";
  if (mag >= 5) return "strong";
  if (mag >= 4) return "light";
  return "minor";
}

export const severityMeta: Record<Severity, { label: string; colorVar: string; tw: string }> = {
  minor: { label: "Minor", colorVar: "var(--severity-minor)", tw: "bg-severity-minor/20 text-severity-minor border-severity-minor/40" },
  light: { label: "Light", colorVar: "var(--severity-light)", tw: "bg-severity-light/20 text-severity-light border-severity-light/40" },
  strong: { label: "Strong", colorVar: "var(--severity-strong)", tw: "bg-severity-strong/20 text-severity-strong border-severity-strong/40" },
  severe: { label: "Severe", colorVar: "var(--severity-severe)", tw: "bg-severity-severe/20 text-severity-severe border-severity-severe/40" },
};

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export interface FetchOpts {
  lat: number;
  lng: number;
  radiusKm: number;
  minMag?: number;
  hours?: number;
}

export async function fetchNearbyQuakes({ lat, lng, radiusKm, minMag = 0, hours = 24 * 7 }: FetchOpts): Promise<Quake[]> {
  const starttime = new Date(Date.now() - hours * 3600 * 1000).toISOString();
  const url = new URL("https://earthquake.usgs.gov/fdsnws/event/1/query");
  url.searchParams.set("format", "geojson");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set("maxradiuskm", String(radiusKm));
  url.searchParams.set("minmagnitude", String(minMag));
  url.searchParams.set("starttime", starttime);
  url.searchParams.set("orderby", "magnitude");
  url.searchParams.set("limit", "200");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`USGS responded ${res.status}`);
  const data = (await res.json()) as {
    features: Array<{
      id: string;
      properties: { mag: number | null; place: string | null; time: number; url: string };
      geometry: { coordinates: [number, number, number] };
    }>;
  };
  return data.features
    .filter((f) => f.properties.mag != null)
    .map((f) => {
      const [lng2, lat2, depth] = f.geometry.coordinates;
      return {
        id: f.id,
        mag: f.properties.mag as number,
        place: f.properties.place ?? "Unknown location",
        time: f.properties.time,
        depthKm: depth,
        lat: lat2,
        lng: lng2,
        url: f.properties.url,
        distanceKm: haversineKm({ lat, lng }, { lat: lat2, lng: lng2 }),
      } satisfies Quake;
    })
    .sort((a, b) => b.mag - a.mag);
}