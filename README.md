# TechNeeds IGDTUW Society Platform

Official technical society web platform for Indira Gandhi Delhi Technical University for Women (IGDTUW).

## AGENT HANDOFF

### STATUS
Awwwards-level visual overhaul complete on feat/visual-redesign — Build & Typecheck passing with 0 errors.

### AGENT RULES
- Single agent. No parallel agents. No browser automation except one final smoke test.
- If README.md has "## AGENT HANDOFF", read it first and resume from NEXT TASK. Do not re-scan the repo.
- Read only files you will edit. Never print whole files or full logs; show last 30 lines of errors only.
- Plan <=15 lines, then execute. No commentary between steps. No approval requests for routine decisions.
- Write complete files in one pass; avoid repeated micro-edits. Run build/lint only at phase checkpoints.
- Work on branch feat/<task>; never commit .env.local or any sb_secret_ value. Overwrite README handoff section (<=120 lines).

### STACK & COMMANDS
- Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase (@supabase/ssr), Zod, GSAP + Lenis, Framer Motion, cmdk, QRCode, html5-qrcode.
- Dev: `npm run dev` (or `npm.cmd run dev` on Windows) | Build: `npm run build` | Lint: `npm run lint` | Typecheck: `npm run typecheck`
- Seed admin: `npx tsx scripts/seed.ts` | Migrations: apply `supabase/migrations/0001_init.sql`

### REQUIRED ENV VARS
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `QR_SIGNING_SECRET`, `ADMIN_BOOTSTRAP_EMAIL`

### FOLDER MAP
- `docs/`: Research dossiers and gap summaries.
- `scripts/`: Operational scripts including admin bootstrap seed (`scripts/seed.ts`).
- `src/app/`: Next.js 14 App Router routes (public, auth, student dashboard, admin console, API).
- `src/components/`: Kinetic UI modules (Navbar, Footer, Hero, HeroVisual, Preloader, MotionProvider, CustomCursor, SplitHeading, MagneticButton, InfiniteMarquee, ScrollReveal, CommandPalette).
- `src/lib/`: Supabase clients (client, server, admin, middleware), crypto QR helpers, Zod schemas, utils.
- `supabase/migrations/`: SQL migration files with zero-trust RLS policies.

### DB TABLES & RLS SUMMARY
- `profiles`: All users; public read, own update, admin manage, trigger on auth.users.
- `events`: Society events; public read published, admin full CRUD.
- `event_registrations`: Pass records; student read/register own, admin view/delete, stores SHA-256 token hash only.
- `attendance`: On-site verification; student view own, admin insert/scan only.
- `tickets`: Helpdesk; student own CRUD, admin status/priority triage & assignment.
- `ticket_messages`: Support threads; student view non-internal, admin view all & post internal notes.
- `opportunities`: Careers/hackathons; public read active published, admin full CRUD.
- `team_members`: Leadership roster; public read published, admin CRUD.
- `timeline_items`: Milestones; public read published, admin CRUD.
- `resources`: TechBoard links; public read published, admin CRUD.
- `faqs`: Common questions; public read published, admin CRUD.
- `certificates`: Verification; public read by verification_id, admin issue.
- `audit_logs`: Governance; admin read & insert audit trail.

### CHECKLIST
- [x] Visual Redesign: Cinematic 3D interactive procedural canvas orb with inertia (`src/components/HeroVisual.tsx`)
- [x] Motion Engine: Lenis + GSAP ScrollTrigger synchronized ticker (`src/components/MotionProvider.tsx`)
- [x] Custom Cursor: Desktop smooth trailing ring + radial spotlight (`src/components/CustomCursor.tsx`)
- [x] Preloader: Scanning laser line, HUD telemetry counter (0-100%), geometric SVG reveal (`src/components/Preloader.tsx`)
- [x] Kinetic Components: MagneticButton, InfiniteMarquee, SplitHeading, ScrollReveal
- [x] Redesigned Pages: Home, About/Manifesto, Events & Passes, Timeline, Team, Resources, Opportunities, FAQ, Verify, Recruitment
- [x] P0/P1/P2 Functionality Preserved: Auth, HMAC pass booking, check-in scanner, ticket threads, command palette intact.

### NEXT TASK
Connect production Supabase credentials in .env.local to link live student/admin database records.

### DECISIONS
- Procedural 3D Canvas visual in place of Three.js: 60 FPS performance, lightweight bundle, zero external 3D dependencies.
- Strict Palette adherence: Midnight Black `#030407`, Electric Cobalt `#1558C9`, Acid Lime `#D4FF24`.
- Replaced all repetitive 3-column card layouts with asymmetric editorial magazine spreads, numbered telemetry blocks, and full-bleed showcases.

### KNOWN ISSUES & NEEDS ADMIN VERIFICATION
- Founding date, complete team roster, and faculty coordinators need admin verification (marked "To be added by admin").
- Official vector SVG logo asset needs admin upload (currently using branded wordmark).
- Production Supabase credentials required in `.env.local` for live DB connectivity.

### TEST STATUS
- TypeScript typecheck (`tsc --noEmit`): Passed with 0 errors.
- ESLint (`next lint`): Passed with 0 errors.
- Production build (`next build`): All 35 routes compiled and prerendered successfully with code 0.
- Live server smoke test: All 11 public and authenticated routes return HTTP 200 OK.
- Headless visual smoke test: Verified at 1440px desktop (`docs/screenshot.png`) and 390px mobile (`docs/screenshot-390.png`).
- Crypto test: Valid token HMAC verification passes; tampered token rejected.
