import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Globe2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GalaxyBackground } from "../components/GalaxyBackground";
import { DetectButton } from "../components/DetectButton";
import windsLogo from "../assets/winds-logo.png.asset.json";
import {
  DashboardPreview,
  DataSourceSection,
  DataVizSection,
  FeaturesSection,
  Footer,
  GlobalNetworkSection,
  GlobeSection,
  WhySection,
} from "../components/Sections";
import heroVideo from "../assets/hero-video.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Winds Earthquake Intelligence — Real-Time Seismic Monitoring" },
      {
        name: "description",
        content:
          "Detect earthquakes near you in real time. Cinematic dashboard powered by the USGS global seismic network.",
      },
      { property: "og:title", content: "Winds Earthquake Intelligence" },
      {
        property: "og:description",
        content:
          "Detect earthquakes near you in real time. Cinematic dashboard powered by the USGS global seismic network.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GalaxyBackground />
      <header className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-6xl items-center justify-between px-6 py-5 backdrop-blur-md">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src={windsLogo.url}
            alt="Winds Earthquake Intelligence"
            className="h-9 w-auto drop-shadow-[0_0_20px_rgba(56,189,248,0.55)]"
          />
        </a>
        <div className="flex items-center gap-4">
          <nav className="hidden gap-7 text-sm text-muted-foreground sm:flex">
            <a href="#dashboard" className="hover:text-foreground">Dashboard</a>
            <a href="#globe" className="hover:text-foreground">Globe</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#why" className="hover:text-foreground">Why</a>
          </nav>
        </div>
      </header>

      <main className="relative">
        {/* CINEMATIC HERO */}
        <section
          ref={heroRef}
          className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideo.url}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.1 0.04 270 / 0.55) 0%, oklch(0.08 0.04 270 / 0.85) 60%, oklch(0.06 0.02 270) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
            style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
          />
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-panel mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Live seismic intelligence
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-balance text-5xl font-bold leading-[1.02] tracking-tight drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)] sm:text-7xl lg:text-8xl"
            >
              <span className="text-aurora">Winds</span> Earthquake
              <br /> Intelligence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
            >
              Real-time global seismic monitoring powered by advanced geological data.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center"
            >
              <DetectButton />
              <Link
                to="/dashboard"
                search={{ lat: 35.6762, lng: 139.6503, radius: 500 }}
                className="glass-panel inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary"
              >
                <Globe2 className="h-4 w-4" />
                Explore Global Activity
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-16 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
            >
              <span className="h-px w-8 bg-border" />
              Scroll to explore
              <span className="h-px w-8 bg-border" />
            </motion.div>
          </motion.div>
        </section>

        {/* Stats strip */}
        <section className="mx-auto -mt-16 w-full max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-3 gap-3 sm:gap-4"
          >
            {[
              { k: "30s", v: "Refresh rate" },
              { k: "1000km", v: "Detection radius" },
              { k: "USGS", v: "Trusted source" },
            ].map((s) => (
              <div key={s.v} className="glass-panel p-4 text-left sm:p-5">
                <div className="font-display text-2xl font-bold text-aurora sm:text-3xl">{s.k}</div>
                <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        <div id="dashboard"><DashboardPreview /></div>
        <div id="globe"><GlobeSection /></div>
        <div id="features"><FeaturesSection /></div>
        <DataVizSection />
        <GlobalNetworkSection />
        <div id="why"><WhySection /></div>
        <DataSourceSection />
      </main>

      <Footer />
    </div>
  );
}
