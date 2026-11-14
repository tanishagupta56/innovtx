"use client";

import { useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import type { Mentor } from "../../data/mentors";

type Tab = "about" | "skills" | "journey" | "connect";
const TABS: { id: Tab; label: string }[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "connect", label: "Connect" },
];

const KEYFRAMES = `
@keyframes mpcFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes mpcFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes mpcScan { 0% { transform: translateY(-120%); } 100% { transform: translateY(520%); } }
@keyframes mpcSpin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
`;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function avatarUrl(m: Mentor) {
  return m.avatar ?? `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(m.name)}`;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-charcoal-border bg-charcoal/50 p-3.5 sm:p-4 backdrop-blur-md">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-lime-green">
        {"// "}
        {title}
      </p>
      {children}
    </div>
  );
}

function Chips({ items, tone = "blue" }: { items: string[]; tone?: "blue" | "lime" | "muted" }) {
  const styles = {
    blue: "border-electric-blue/40 bg-electric-blue/10 text-blue-100",
    lime: "border-lime-green/40 bg-lime-green/10 text-lime-100",
    muted: "border-charcoal-border bg-charcoal-surface/60 text-slate-300",
  }[tone];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-transform duration-200 hover:-translate-y-0.5 ${styles}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Bullets({ items, icon }: { items: string[]; icon: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-[13px] leading-snug text-slate-200">
          <span className="shrink-0 text-lime-green">
            {icon}
          </span>
          <span className="break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function MentorProfileCard({ mentor, index = 0 }: { mentor: Mentor; index?: number }) {
  const [flipped, setFlipped] = useState(false);
  const [tab, setTab] = useState<Tab>("about");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [photoFailed, setPhotoFailed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const tag = `MENTOR // ${String(index + 1).padStart(2, "0")}`;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 8, y: px * 8 });
  };

  const flip = () => setFlipped((f) => !f);

  const onFrontKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  };

  const faceBase: CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  const preserve3d: CSSProperties = {
    transformStyle: "preserve-3d",
    WebkitTransformStyle: "preserve-3d",
  };

  return (
    <div
      className="group relative h-[600px] w-full max-w-[380px]"
      style={{ perspective: "1400px" }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <style>{KEYFRAMES}</style>

      {/* Tilt layer */}
      <div
        className="relative h-full w-full transition-transform duration-200 ease-out motion-reduce:!transform-none motion-reduce:transition-none"
        style={{
          ...preserve3d,
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Neon glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[2px] rounded-[30px] opacity-40 blur-md transition-opacity duration-500 group-hover:opacity-90 bg-gradient-to-br from-electric-blue via-transparent to-lime-green"
          style={{
            transform: "translateZ(-2px)",
          }}
        />

        {/* Flip layer */}
        <div
          className="relative h-full w-full transition-transform duration-700 motion-reduce:duration-0"
          style={{
            ...preserve3d,
            transform: `rotateY(${flipped ? 180 : 0}deg)`,
            transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {/* ───────────── FRONT: real photo ───────────── */}
          <div
            role="button"
            tabIndex={flipped ? -1 : 0}
            aria-label={`Show avatar and profile of ${mentor.name}`}
            aria-hidden={flipped}
            onClick={flip}
            onKeyDown={onFrontKey}
            className="absolute inset-0 cursor-pointer overflow-hidden rounded-[28px] border border-charcoal-border bg-deep-ink outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
            style={{
              ...faceBase,
              transform: "rotateY(0deg)",
              pointerEvents: flipped ? "none" : "auto",
            }}
          >
            {photoFailed ? (
              <div
                className="flex h-full w-full items-center justify-center font-mono text-7xl font-bold text-soft-white/90 bg-gradient-to-br from-electric-blue/40 via-deep-ink to-lime-green/30"
              >
                {initials(mentor.name)}
              </div>
            ) : (
              <img
                src={mentor.photo}
                alt={`Photo of ${mentor.name}`}
                onError={() => setPhotoFailed(true)}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}

            {/* Scan line */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-b from-transparent via-electric-blue/20 to-transparent"
              style={{
                animation: "mpcScan 2.8s linear infinite",
              }}
            />

            {/* Top row */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <span className="rounded-md border border-charcoal-border bg-deep-ink/70 px-2 py-1 font-mono text-[10px] tracking-[0.18em] text-soft-white backdrop-blur-md">
                {tag}
              </span>
              <span
                className="rounded-full border border-lime-green/50 bg-deep-ink/70 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.15em] text-lime-green backdrop-blur-md"
              >
                ● VERIFIED
              </span>
            </div>

            {/* Bottom info */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep-ink via-deep-ink/85 to-transparent p-4 sm:p-5 pt-20 sm:pt-24">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lime-green font-bold">
                {mentor.role}
              </p>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold text-soft-white">{mentor.name}</h3>
              <p className="text-sm text-slate-300">
                {mentor.branch} · {mentor.year}
              </p>
              <div className="mt-3">
                <Chips items={mentor.techStack.slice(0, 4)} />
              </div>
              <p className="mt-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-muted-text transition-colors group-hover:text-soft-white">
                <span className="inline-block" style={{ animation: "mpcSpin 3s linear infinite" }}>
                  ⟳
                </span>
                TAP TO REVEAL AVATAR + PROFILE
              </p>
            </div>
          </div>

          {/* ───────────── BACK: avatar + profile ───────────── */}
          <div
            aria-hidden={!flipped}
            className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] border border-charcoal-border bg-deep-ink"
            style={{
              ...faceBase,
              transform: "rotateY(180deg)",
              pointerEvents: flipped ? "auto" : "none",
            }}
          >
            {/* Decorative glows behind the glass panels */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full blur-3xl bg-electric-blue/25"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -right-16 h-52 w-52 rounded-full blur-3xl bg-lime-green/20"
            />

            {/* Header */}
            <div className="relative flex items-center gap-3 sm:gap-4 p-4 sm:p-5 pb-3">
              <button
                type="button"
                onClick={flip}
                tabIndex={flipped ? 0 : -1}
                aria-label="Flip back to photo"
                className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl p-[2px] bg-gradient-to-br from-electric-blue to-lime-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                style={{ animation: "mpcFloat 4s ease-in-out infinite" }}
              >
                <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-charcoal">
                  {avatarFailed ? (
                    <span className="font-mono text-xl sm:text-2xl font-bold text-soft-white">{initials(mentor.name)}</span>
                  ) : (
                    <img
                      src={avatarUrl(mentor)}
                      alt={`Avatar of ${mentor.name}`}
                      onError={() => setAvatarFailed(true)}
                      className="h-full w-full object-cover"
                    />
                  )}
                </span>
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] tracking-[0.18em] text-lime-green font-bold">
                  {tag}
                </p>
                <h3 className="truncate text-base sm:text-lg font-bold text-soft-white">{mentor.name}</h3>
                <p className="text-xs text-muted-text">
                  {mentor.branch} · {mentor.year}
                </p>
              </div>
              <button
                type="button"
                onClick={flip}
                tabIndex={flipped ? 0 : -1}
                aria-label="Flip back to photo"
                className="shrink-0 self-start rounded-lg border border-charcoal-border bg-charcoal/60 px-2 py-1 font-mono text-xs text-slate-300 transition hover:border-electric-blue hover:text-soft-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              >
                ⟲
              </button>
            </div>

            {/* Tabs */}
            <div className="relative mx-3 sm:mx-5 flex gap-1 rounded-xl border border-charcoal-border bg-charcoal/50 p-1 backdrop-blur-md">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  tabIndex={flipped ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 rounded-lg px-1.5 sm:px-2 py-1.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    tab === t.id
                      ? "bg-electric-blue text-soft-white shadow-[0_0_14px_rgba(49,94,255,0.6)]"
                      : "text-muted-text hover:text-soft-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div
              key={tab}
              className="relative flex-1 space-y-3 overflow-y-auto p-4 sm:p-5 pt-3 sm:pt-4"
              style={{ animation: "mpcFade 0.35s ease", scrollbarWidth: "thin" }}
            >
              {tab === "about" && (
                <>
                  <p className="text-sm italic leading-relaxed text-slate-300">{mentor.tagline}</p>
                  <Section title="Why learn with me">
                    <Bullets items={mentor.advantages} icon="▸" />
                  </Section>
                  <Section title="Interests">
                    <Chips items={mentor.interests} tone="muted" />
                  </Section>
                </>
              )}

              {tab === "skills" && (
                <>
                  <Section title="Tech stack">
                    <Chips items={mentor.techStack} />
                  </Section>
                  <Section title="Expertise">
                    <div className="space-y-2.5">
                      {mentor.expertise.map((e) => (
                        <div key={e.area}>
                          <div className="mb-1 flex justify-between text-xs text-slate-300">
                            <span>{e.area}</span>
                            <span className="font-mono">{e.level}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-charcoal-border">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-electric-blue to-lime-green shadow-[0_0_8px_rgba(49,94,255,0.8)]"
                              style={{
                                width: `${Math.max(0, Math.min(100, e.level))}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                  <Section title="Strengths">
                    <Bullets items={mentor.strengths} icon="✓" />
                  </Section>
                  <Section title="Currently levelling up">
                    <Chips items={mentor.weaknesses} tone="muted" />
                  </Section>
                </>
              )}

              {tab === "journey" && (
                <>
                  <Section title="Achievements">
                    <Bullets items={mentor.achievements} icon="★" />
                  </Section>
                  <Section title="Hackathons">
                    <Bullets items={mentor.hackathons} icon="⚡" />
                  </Section>
                  <Section title="Projects">
                    <div className="space-y-2">
                      {mentor.projects.map((p) => (
                        <div key={p.name} className="rounded-xl border border-charcoal-border bg-charcoal/40 p-2.5">
                          {p.link ? (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={flipped ? 0 : -1}
                              className="text-sm font-semibold text-soft-white underline-offset-2 hover:underline hover:text-lime-green transition-colors"
                            >
                              {p.name} ↗
                            </a>
                          ) : (
                            <p className="text-sm font-semibold text-soft-white">{p.name}</p>
                          )}
                          <p className="text-xs text-slate-400 break-words">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                  <Section title="Internships">
                    <div className="space-y-2">
                      {mentor.internships.map((i) => (
                        <div key={`${i.company}-${i.role}`} className="border-l-2 border-electric-blue pl-3">
                          <p className="text-sm font-semibold text-soft-white">{i.role}</p>
                          <p className="text-xs text-slate-400">
                            {i.company} · {i.period}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Section>
                </>
              )}

              {tab === "connect" && (
                <>
                  <Section title="I can mentor you in">
                    <Chips items={mentor.mentorsIn} tone="lime" />
                  </Section>
                  <Section title="Coding profiles">
                    <div className="grid grid-cols-2 gap-2">
                      {mentor.links.map((l) => (
                        <a
                          key={l.label}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={flipped ? 0 : -1}
                          className="group/link flex items-center justify-between rounded-xl border border-charcoal-border bg-charcoal/40 px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-electric-blue hover:text-soft-white"
                        >
                          <span className="truncate">{l.label}</span>
                          <span className="shrink-0 transition-transform group-hover/link:translate-x-0.5">↗</span>
                        </a>
                      ))}
                    </div>
                  </Section>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
