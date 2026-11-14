"use client";

// Wrapper that adds the 3D globe to the existing "Meet Our Leads" section.
// - Loads the 3D code only in the browser (lazy + Suspense).
// - If WebGL is unavailable or the globe crashes, it renders nothing, so the
//   section's existing lead cards (which stay on the page) are unaffected.

import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { VERIFIED_TEAM_MEMBERS, type TeamMember } from "../../data/teamData";

const LeadsGlobe = lazy(() => import("./LeadsGlobe"));

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      typeof window !== "undefined" &&
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

class GlobeErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function GlobeLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="h-24 w-24 animate-pulse rounded-full border border-[#315EFF]/40 bg-[#315EFF]/10 shadow-[0_0_40px_rgba(49,94,255,0.35)]" />
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">Initialising globe {"//"}</p>
    </div>
  );
}

export default function LeadsGlobeSection({ members }: { members?: TeamMember[] }) {
  // Uses the same data the section already uses. Pass `members` to override.
  const list = members ?? VERIFIED_TEAM_MEMBERS.filter((m) => m.category === "lead");

  const [webgl, setWebgl] = useState<"checking" | "yes" | "no">("checking");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setWebgl(hasWebGL() ? "yes" : "no");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (webgl === "no" || list.length === 0) return null;

  return (
    <div className="relative isolate my-10 h-[450px] w-full sm:h-[600px]">
      {webgl === "checking" ? (
        <GlobeLoading />
      ) : (
        <GlobeErrorBoundary>
          <Suspense fallback={<GlobeLoading />}>
            <LeadsGlobe members={list} reducedMotion={reducedMotion} />
          </Suspense>
        </GlobeErrorBoundary>
      )}
    </div>
  );
}
