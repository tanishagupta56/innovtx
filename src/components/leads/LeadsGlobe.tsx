"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import type { TeamMember } from "../../data/teamData";

const LOGO_SRC = "/brand/techneeds-logo.png";
const BLUE = "#315EFF";
const LIME = "#B8D94C";

/* ───────────────────────── helpers ───────────────────────── */

function initials(name: string | undefined) {
  return (name ?? "")
    .replace(/[^A-Za-z ]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type Anchor = {
  member: TeamMember;
  baseAngle: number;
  radius: number;
  direction: 1 | -1;
  rotation: THREE.Euler;
};

/** Splits leads across 1–3 tilted rings so cards never crowd each other. */
function buildAnchors(members: TeamMember[], scale: number): Anchor[] {
  const ringCount = members.length <= 8 ? 1 : members.length <= 16 ? 2 : 3;
  const rings = [
    { radius: 3.3, tiltX: 0.42, tiltZ: 0.12, direction: 1 as const },
    { radius: 4.2, tiltX: -0.3, tiltZ: -0.18, direction: -1 as const },
    { radius: 5.0, tiltX: 0.18, tiltZ: 0.25, direction: 1 as const },
  ].slice(0, ringCount);

  const perRing = Math.ceil(members.length / ringCount);
  return members.map((member, i) => {
    const ringIndex = Math.floor(i / perRing);
    const ring = rings[ringIndex];
    const countOnRing = Math.min(perRing, members.length - ringIndex * perRing);
    const slot = i - ringIndex * perRing;
    return {
      member,
      baseAngle: (slot / countOnRing) * Math.PI * 2 + ringIndex * 0.6,
      radius: ring.radius * scale,
      direction: ring.direction,
      rotation: new THREE.Euler(ring.tiltX, 0, ring.tiltZ),
    };
  });
}

/** Builds a globe texture from the logo; dark strokes are lightened so they show on the dark sphere. */
function useLogoTexture(src: string) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: THREE.CanvasTexture | null = null;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;

      const logo = document.createElement("canvas");
      logo.width = img.naturalWidth;
      logo.height = img.naturalHeight;
      const lctx = logo.getContext("2d");
      if (!lctx) return;
      lctx.drawImage(img, 0, 0);
      const pixels = lctx.getImageData(0, 0, logo.width, logo.height);
      const p = pixels.data;
      for (let i = 0; i < p.length; i += 4) {
        const lum = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
        if (p[i + 3] > 20 && lum < 90) {
          p[i] = 226;
          p[i + 1] = 236;
          p[i + 2] = 255;
        }
      }
      lctx.putImageData(pixels, 0, 0);

      const W = 2048;
      const H = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0E1A3A");
      bg.addColorStop(1, "#070B16");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(49, 94, 255, 0.18)";
      ctx.lineWidth = 2;
      for (let x = 0; x <= W; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += 128) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      const size = 720;
      ctx.drawImage(logo, W * 0.25 - size / 2, H / 2 - size / 2, size, size);
      ctx.drawImage(logo, W * 0.75 - size / 2, H / 2 - size / 2, size, size);

      created = new THREE.CanvasTexture(canvas);
      created.colorSpace = THREE.SRGBColorSpace;
      created.anisotropy = 4;
      setTexture(created);
    };
    img.src = src;
    return () => {
      cancelled = true;
      created?.dispose();
    };
  }, [src]);

  return texture;
}

/* ───────────────────────── 3D parts ───────────────────────── */

function Globe({ radius, reducedMotion }: { radius: number; reducedMotion: boolean }) {
  const globe = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const texture = useLogoTexture(LOGO_SRC);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (globe.current) globe.current.rotation.y += delta * 0.15;
    if (ring.current) ring.current.rotation.z += delta * 0.05;
  });

  return (
    <group>
      <mesh ref={globe}>
        <sphereGeometry args={[radius, 64, 64]} />
        {texture ? (
          <meshStandardMaterial
            key="textured"
            map={texture}
            emissive="#ffffff"
            emissiveMap={texture}
            emissiveIntensity={0.55}
            roughness={0.65}
            metalness={0.1}
          />
        ) : (
          <meshStandardMaterial key="plain" color="#0E1A3A" emissive={BLUE} emissiveIntensity={0.15} />
        )}
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.1}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          color={BLUE}
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.24}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          color={BLUE}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Accent ring */}
      <mesh ref={ring} rotation={[Math.PI / 2 - 0.42, 0, 0.12]}>
        <torusGeometry args={[radius * 1.38, radius * 0.008, 16, 160]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

/** Moves the HTML cards every frame: projects each 3D orbit point to the screen. */
function OrbitDriver({
  anchors,
  cardRefs,
  pausedRef,
  hoveredRef,
  reducedMotion,
}: {
  anchors: Anchor[];
  cardRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  pausedRef: MutableRefObject<boolean>;
  hoveredRef: MutableRefObject<string | null>;
  reducedMotion: boolean;
}) {
  const angle = useRef(0);
  const local = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!reducedMotion && !pausedRef.current) angle.current += delta * 0.22;
    const { camera, size } = state;
    const camDistance = camera.position.length();

    anchors.forEach((a, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const theta = a.baseAngle + angle.current * a.direction;
      local.set(Math.cos(theta) * a.radius, 0, Math.sin(theta) * a.radius).applyEuler(a.rotation);

      // 0 = closest to camera, 1 = furthest (behind the globe)
      const depth = THREE.MathUtils.clamp((local.distanceTo(camera.position) - camDistance + a.radius) / (2 * a.radius), 0, 1);

      projected.copy(local).project(camera);
      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;

      const isHovered = hoveredRef.current === a.member.id;
      const scale = isHovered ? 1.18 : 1 - 0.22 * depth;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      el.style.opacity = String(isHovered ? 1 : 1 - 0.7 * depth);
      el.style.zIndex = String(isHovered ? 1000 : Math.round((1 - depth) * 100));
    });
  });

  return null;
}

/* ───────────────────────── card ───────────────────────── */

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function LeadCard({
  member,
  compact,
  hovered,
  setRef,
  onEnter,
  onLeave,
}: {
  member: TeamMember;
  compact: boolean;
  hovered: boolean;
  setRef: (el: HTMLDivElement | null) => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      ref={setRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="pointer-events-auto absolute left-0 top-0 will-change-transform"
      style={{ opacity: 0 }}
    >
      <div
        className={`flex items-center gap-2.5 rounded-xl border bg-[#0B0F1A]/70 px-2.5 backdrop-blur-md transition-colors duration-200 ${
          compact ? "h-[68px] w-[136px]" : "h-[80px] w-[160px]"
        } ${hovered ? "border-[#315EFF]" : "border-white/15"}`}
        style={{ boxShadow: hovered ? `0 0 22px ${BLUE}88` : "0 4px 18px rgba(0,0,0,0.35)" }}
      >
        <div
          className={`flex shrink-0 items-center justify-center rounded-full font-mono font-bold text-white ${
            compact ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs"
          }`}
          style={{ background: `linear-gradient(135deg, ${BLUE}, ${LIME})` }}
          aria-hidden
        >
          {initials(member.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`truncate font-semibold leading-tight text-white ${compact ? "text-[10px]" : "text-[11px]"}`}>
            {member.name}
          </p>
          <p className="truncate font-mono text-[9px] leading-tight" style={{ color: LIME }}>
            {member.role}
          </p>
          <p className="truncate text-[9px] leading-tight text-slate-400">
            {[member.department, member.year].filter(Boolean).join(" · ")}
          </p>
        </div>
        {member.linkedin_url && (
          <a
            href={member.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="self-start mt-2 shrink-0 rounded-md border border-white/15 p-1 text-slate-300 transition-colors hover:border-[#315EFF] hover:text-white"
          >
            <LinkedInIcon />
          </a>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── main ───────────────────────── */

export default function LeadsGlobe({ members, reducedMotion }: { members: TeamMember[]; reducedMotion: boolean }) {
  const [compact, setCompact] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pausedRef = useRef(false);
  const hoveredRef = useRef<string | null>(null);

  useEffect(() => {
    const update = () => setCompact(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scale = compact ? 0.62 : 1;
  const anchors = useMemo(() => buildAnchors(members, scale), [members, scale]);

  const setHover = (id: string | null) => {
    hoveredRef.current = id;
    setHoveredId(id);
  };

  return (
    <div
      className="relative h-full w-full"
      onPointerEnter={() => {
        pausedRef.current = true;
      }}
      onPointerLeave={() => {
        pausedRef.current = false;
        setHover(null);
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.6, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 4, 8]} intensity={40} color={BLUE} />
        <pointLight position={[-6, -3, -6]} intensity={20} color={LIME} />
        <Globe radius={1.65 * scale} reducedMotion={reducedMotion} />
        <OrbitDriver
          anchors={anchors}
          cardRefs={cardRefs}
          pausedRef={pausedRef}
          hoveredRef={hoveredRef}
          reducedMotion={reducedMotion}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 2 - 0.45}
          maxPolarAngle={Math.PI / 2 + 0.45}
        />
      </Canvas>

      {/* HTML cards layered over the canvas */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {anchors.map((a, i) => (
          <LeadCard
            key={a.member.id}
            member={a.member}
            compact={compact}
            hovered={hoveredId === a.member.id}
            setRef={(el) => {
              cardRefs.current[i] = el;
            }}
            onEnter={() => setHover(a.member.id)}
            onLeave={() => setHover(null)}
          />
        ))}
      </div>
    </div>
  );
}
