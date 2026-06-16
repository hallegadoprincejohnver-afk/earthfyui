let loadingPromise: Promise<typeof google> | null = null;

const TRACKING_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;
const BROWSER_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;

export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if ((window as any).google?.maps) return Promise.resolve((window as any).google);
  if (loadingPromise) return loadingPromise;
  if (!BROWSER_KEY) return Promise.reject(new Error("Google Maps browser key missing"));

  loadingPromise = new Promise((resolve, reject) => {
    const cbName = "__initGoogleMapsWinds";
    (window as any)[cbName] = () => {
      resolve((window as any).google);
    };
    const s = document.createElement("script");
    const params = new URLSearchParams({
      key: BROWSER_KEY,
      v: "weekly",
      libraries: "visualization",
      loading: "async",
      callback: cbName,
    });
    if (TRACKING_ID) params.set("channel", TRACKING_ID);
    s.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return loadingPromise;
}

export const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0b1020" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1020" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b9bbf" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1a2244" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#b8c7f0" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#a0b4e6" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#13193a" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#050816" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3b4a7d" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0e1430" }] },
];