import { useQuery } from "@tanstack/react-query";
import { fetchNearbyQuakes, type Quake } from "../lib/usgs";

export function useNearbyQuakes(opts: {
  lat: number;
  lng: number;
  radiusKm: number;
  autoRefresh: boolean;
}) {
  return useQuery<Quake[]>({
    queryKey: ["quakes", opts.lat, opts.lng, opts.radiusKm],
    queryFn: () => fetchNearbyQuakes({ lat: opts.lat, lng: opts.lng, radiusKm: opts.radiusKm }),
    refetchInterval: opts.autoRefresh ? 30_000 : false,
    staleTime: 15_000,
  });
}