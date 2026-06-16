# EARTHTFY Earthquake Intelligence System — Build Plan

## Skill install note

The GitHub repo `nextlevelbuilder/ui-ux-pro-max-skill` is an external skill bundle. Lovable skills live under `.workspace/skills/` and are managed via Settings → Skills (or by drafting under `.agents/skills/` and applying). I can't auto-install an arbitrary GitHub repo as a workspace skill from chat — but I'll bake its spirit (premium cinematic UI/UX) directly into the build: glassmorphism, neon accents, parallax galaxy, Framer Motion choreography, gaming-grade polish.

If you want the actual skill activated, paste its SKILL.md contents and I'll draft it into `.agents/skills/ui-ux-pro-max/` and apply it.

## Connectors & APIs

- **USGS Earthquake API** — public, no key. Endpoint: `https://earthquake.usgs.gov/fdsnws/event/1/query` with `latitude`, `longitude`, `maxradiuskm`, `starttime`, `minmagnitude`, `format=geojson`.
- **Google Maps** — use the existing Lovable-managed Google Maps connector (browser key for Maps JS API). Loaded async with `callback=initMap`. Markers use `google.maps.Marker` (not AdvancedMarker — needs mapId).
- **MarkerClusterer** — `@googlemaps/markerclusterer` for zoom-out clustering.
- **Heatmap** — Maps JS `visualization` library.
- Geolocation via `navigator.geolocation`.

## Stack additions

- `framer-motion` (animations)
- `@googlemaps/markerclusterer`
- Fonts: Space Grotesk (display) + Inter (body) via `<link>` in `__root.tsx`

## Routes

- `/` — Hero + sections (Why, Data Source, Footer). Landing experience.
- `/dashboard` — Live split-view: map (left) + earthquake feed (right), top bar with auto-refresh toggle, settings drawer (radius slider, view toggle).

CTA "Detect Earthquake Near Me" requests geolocation then navigates to `/dashboard` with coords in search params (validated via zod).

## Component map

- `GalaxyBackground` — fixed canvas + layered CSS for parallax stars/nebula, GPU transforms only, reduced-motion respected.
- `Hero` — title, subtitle, glowing CTA with ripple + loading state.
- `DetectButton` — handles geolocation, loading copy "Scanning seismic activity…", error toast.
- `EarthquakeMap` — Google Map, dark JSON style, user marker, quake markers with pulse drop animation, magnitude-scaled circles, heatmap toggle, clustering, fly-to on select, info windows.
- `EarthquakeCard` — magnitude (huge), location, distance, depth, time (UTC + local), severity badge with the four-tier color system.
- `EarthquakeFeed` — staggered Framer Motion list, sorted by magnitude desc.
- `TopBar` — auto-refresh toggle (30s interval), last-update timestamp, location status pill.
- `SettingsPanel` — radius slider 100–1000 km, map/list toggle, refresh toggle.
- `WhySection`, `DataSourceSection`, `Footer`.

## Data layer

- `src/lib/usgs.ts` — `fetchNearbyQuakes({lat, lng, radiusKm, minMag})`, returns normalized DTO with computed distance (haversine).
- `useNearbyQuakes` hook — TanStack Query with 30s `refetchInterval` (toggleable), `enabled` gated on coords.
- Severity helper: 0–3.9 minor (green), 4–4.9 light (yellow), 5–6.9 strong (orange), 7+ severe (red).

## Design system (src/styles.css)

Dark futuristic tokens in oklch:

- `--background` deep space navy, `--foreground` near-white
- `--primary` neon cyan-blue, `--accent` neon violet
- `--glass` translucent surface + `--glow-primary/--glow-accent` shadow tokens
- Severity tokens: `--severity-minor/light/strong/severe`
- Gradients: `--gradient-aurora`, `--gradient-glass`
- Utility classes: `.glass-panel`, `.glow-pulse`, `.neon-border`

## Animations

- Framer Motion page transitions, staggered card entry, marker pulse via CSS keyframes, button glow loop, parallax on scroll for galaxy layers.
- Respect `prefers-reduced-motion`.

## Mobile

- Map full-screen with bottom sheet (Drawer) holding the feed.
- Swipeable cards via horizontal scroll snap.
- Reduced star count on small viewports.

## SEO (per route head())

- `/` title "Winds Earthquake Intelligence — Real-Time Seismic Monitoring", matching meta + OG.
- `/dashboard` title "Live Earthquake Dashboard | Winds".
- Root `notFoundComponent` retained; both routes get `errorComponent`.

## Out of scope (call out, not building unless you confirm)

Push notifications, sound alerts for M5+, bookmarks, location search bar, timeline chart. Easy to add after v1 lands — say the word.

## Build order

1. Install deps, add fonts, expand design tokens.
2. Galaxy background + landing hero with detect CTA.
3. USGS client + types + severity helpers.
4. `/dashboard` route, top bar, settings, feed list.
5. Google Maps integration (markers, clusters, heatmap, info windows, fly-to).
6. Mobile bottom-sheet layout + polish pass.
7. SEO heads, error/not-found boundaries, reduced-motion QA.