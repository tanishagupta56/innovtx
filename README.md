# TechNeeds IGDTUW Society Platform

Official technical society web platform for Indira Gandhi Delhi Technical University for Women (IGDTUW).

## AGENT HANDOFF

### STATUS
Full WebGL 3D Immersive Universe & Complete Society Reconstruction complete on `feat/visual-redesign` — Next.js 14, Three.js, React Three Fiber, 39 routes building with 0 errors.

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

### FOLDER MAP
- `docs/`: Research dossiers, gap summaries, captured desktop & timeline screenshots.
- `scripts/`: Operational scripts (`scripts/seed.ts`, `scripts/seed-timeline.ts`).
- `src/app/`: Next.js App Router routes (public, auth, student dashboard, admin console, API).
- `src/components/3d/`: Persistent WebGL 3D world (`WorldCanvas`, `DigitalCore`, `SceneController`, `Timeline3DCanvas`, `PersistentWorld`).
- `src/components/`: Kinetic UI modules (Navbar, Footer, Hero, HeroVisual, Preloader, MotionProvider, CustomCursor, SplitHeading, MagneticButton, InfiniteMarquee, ScrollReveal).
- `src/data/`: Structured verified society datasets (`timelineData.ts` with 14 milestones, `societyData.ts` with departments, stats, initiatives, FAQs).
- `src/lib/`: Supabase clients, HMAC QR helpers, Zod validation, utils.
- `supabase/migrations/`: SQL migration files with zero-trust RLS policies.

### CHECKLIST
- [x] Persistent 3D WebGL World: R3F shared Canvas across public routes with scroll-driven camera interpolation (`src/components/3d/`).
- [x] 3D Digital Intelligence Core: Translucent cobalt icosahedron, dual orbital rings, orbiting data nodes, galaxy particle field, pointer parallax.
- [x] 3D Spatial Timeline: 14 verified milestones (2023-2026) along an interactive 3D spline curve with beacon nodes and detail inspector (`/timeline`).
- [x] Society Content Reconstruction (AssetMerkle-inspired):
  - Telemetry stats (1,200+ members, 50+ mentors, 10+ cohorts, 100+ events).
  - Department cadres (DEV_CORE, INTELLIGENCE_LAB, SSSC_CADRE, VISUAL_STUDIO, PARTNERSHIP_GRID).
  - Programs & Initiatives (`/initiatives`: InnoVortex, SSSC Mentorship, 21-Day CS Sprint, Open Source Drive).
  - Community Hub (`/community`: Discord, WhatsApp, GitHub, LinkedIn, Charter & Perks).
  - Vibes & Moments Gallery (`/gallery`: Curated event snapshots, hackathon moments).
  - Corporate Portal (`/collaborate`: Sponsorship packages, outreach contact).
- [x] Preserved Core Functionality: HMAC QR generation, check-in scanner, helpdesk ticketing, auth & admin consoles.
- [x] Strict Palette: Midnight Black `#030407`, Electric Cobalt Blue `#1558C9`, Acid Lime `#D4FF24`.

### NEXT TASK
Connect production Supabase credentials in `.env.local` and run `npx tsx scripts/seed-timeline.ts` to sync live database records with the verified timeline dataset.

### TEST STATUS
- TypeScript typecheck (`tsc --noEmit`): Passed with 0 errors.
- ESLint (`next lint`): Passed with 0 errors.
- Production build (`next build`): 39 static and dynamic routes compiled and generated with code 0.
- Live server smoke test: All public routes (`/`, `/timeline`, `/initiatives`, `/community`, `/gallery`, `/collaborate`) return HTTP 200 OK.
- Visual smoke test: Desktop 1440x900 (`docs/screenshot-desktop.png`, 912KB) and Timeline 1440x1100 (`docs/screenshot-timeline.png`, 1.04MB) verified.
