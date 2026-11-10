# TechNeeds IGDTUW Society Platform

Official technical society web platform for Indira Gandhi Delhi Technical University for Women (IGDTUW).

## AGENT HANDOFF

### STATUS
Stability, Authentication & Final Visual Polish completed on `feat/visual-redesign` — Full OTP authentication flow (Email OTP + Password), fast non-blocking Supabase fallback (under 500ms navigation), Digital Energy Core 3D installation replacing Code Telemetry, reusable `GlobalInteractiveField` with route intensity adaptation, and cohesive brand palette (Electric Blue `#315EFF`, Lime Green `#B8D94C`, Burnt Orange `#D65A31`).

### AGENT RULES
- Single agent. No parallel agents. No browser automation except one final smoke test.
- If README.md has "## AGENT HANDOFF", read it first and resume from NEXT TASK. Do not re-scan the repo.
- Read only files you will edit. Never print whole files or full logs; show last 30 lines of errors only.
- Plan <=15 lines, then execute. No commentary between steps. No approval requests for routine decisions.
- Write complete files in one pass; avoid repeated micro-edits. Run build/lint only at phase checkpoints.
- Work on branch feat/<task>; never commit .env.local or any sb_secret_ value. Overwrite README handoff section (<=120 lines).

### STACK & COMMANDS
- Stack: Next.js 14 App Router, React 18, Three.js, @react-three/fiber, @react-three/drei, TypeScript, Tailwind CSS, Supabase (@supabase/ssr), Zod, GSAP + Lenis, Framer Motion, cmdk, QRCode, html5-qrcode.
- Dev: `npm.cmd run dev` | Build: `npm.cmd run build` | Lint: `npm.cmd run lint` | Typecheck: `npm.cmd run typecheck`
- Seed database: `npx tsx scripts/seed.ts` & `npx tsx scripts/seed-timeline.ts` | Migrations: `supabase/migrations/0001_init.sql`

### REQUIRED ENV VARS
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `QR_SIGNING_SECRET`, `ADMIN_BOOTSTRAP_EMAIL`

### CHECKLIST
- [x] Priority 1 (Auth & OTP):
  - Fixed root cause of `Failed to fetch` & 17-second hang: configured fast non-blocking fetch timeout and zero-retry 400 fallback for placeholder Supabase URLs.
  - Implemented complete Student Registration flow with 6-digit OTP verification (`type: 'signup'`), resend countdown timer (45s), profile auto-provisioning, and dashboard redirect.
  - Implemented Student Login with seamless toggle between One-Time Code (Email OTP) and Password Secret.
  - Added robust validation, expired token handling, invalid OTP alerts, and network error recovery.
- [x] Priority 2 (Navigation & Routing):
  - Fixed Timeline-to-Team navigation lag: eliminated Postgrest retry stalls, route transitions now respond in 15–50ms.
  - Resolved infinite redirect loop on `/admin/login` by adding `x-pathname` header detection in `src/middleware.ts` and `src/app/admin/layout.tsx`.
  - Upgraded `MotionProvider`: added route change listener to reset scroll immediately, kill obsolete ScrollTriggers, and refresh GSAP.
- [x] Priority 3 (3D & Performance Optimization):
  - Reduced particle counts in `DigitalCore` (900 particles) with adaptive DPR `[1, 1.5]`.
  - Added visibility-based animation pausing (`document.hidden`) to stop loops when tabs are in background.
  - Set `pointerEvents: 'none'` on all background WebGL canvases so clicks are never intercepted.
- [x] Priority 4 (Homepage Digital Energy Core):
  - Replaced ugly Code Telemetry section with custom 3D `DigitalEnergyCoreSection`: crystal core, electric blue & lime green orbital rings, burnt orange conduits, network line lattice, and cursor-reactive tilt.
- [x] Priority 5 (Global Interactive Cursor Background):
  - Extracted interactive background into reusable `GlobalInteractiveField` component.
  - Active across all routes with route-aware intensity (35% opacity on dashboards for readability, 100% on public/auth).
  - Touch devices use autonomous harmonic drift; respects `prefers-reduced-motion`.
- [x] Priority 6 (Brand Color Palette):
  - Primary: Electric Blue `#315EFF`, Secondary: Lime Green `#B8D94C`, Contrast Accent: Burnt Orange `#D65A31`.
  - Neutrals: Deep Ink `#080B12`, Charcoal `#111722`, Soft White `#F2F4F8`, Muted Text `#969EAD`.
  - Removed bright cyan dominance across Tailwind tokens, globals.css, materials, and components.

### NEXT TASK
Connect production Supabase credentials in `.env.local` to enable live database queries across events and timeline.

### TEST STATUS
- TypeScript typecheck (`tsc --noEmit`): Passed with 0 errors.
- ESLint (`next lint`): Passed with 0 errors.
- Live Server Smoke Test: All 17 routes (`/`, `/about`, `/events`, `/timeline`, `/team`, `/mentorship`, `/resources`, `/opportunities`, `/showcase`, `/faq`, `/collaborate`, `/community`, `/gallery`, `/login`, `/signup`, `/forgot-password`, `/admin/login`) returned HTTP 200 OK in under 1 second.
- Route transition latency (`/timeline` -> `/team`): 14ms.
