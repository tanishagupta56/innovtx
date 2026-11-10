# TechNeeds IGDTUW Society Platform

Official technical society web platform for Indira Gandhi Delhi Technical University for Women (IGDTUW).

## AGENT HANDOFF

### STATUS
Awwwards-level visual redesign & complete content reconstruction completed on `feat/visual-redesign` — AssetMerkle-inspired creative direction, official TechNeeds logo, WebGL 3D world, interactive light field cursor, and 12 fully fleshed-out public routes. 39 routes building with 0 errors.

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
- `docs/`: Research dossiers, gap summaries, captured full-resolution screenshots (`screenshot-home-new.png`, `screenshot-about.png`, `screenshot-events.png`, `screenshot-team.png`, `screenshot-mentorship.png`, `screenshot-resources.png`, `screenshot-community.png`, `screenshot-timeline.png`).
- `public/brand/`: Official TechNeeds logo assets (`techneeds-logo.png`, `logo.png`).
- `scripts/`: Operational scripts (`scripts/seed.ts`, `scripts/seed-timeline.ts`).
- `src/app/(public)/`: Complete public route suite (`/`, `/about`, `/events`, `/timeline`, `/mentorship`, `/resources`, `/team`, `/showcase`, `/community`, `/gallery`, `/collaborate`, `/faq`, `/opportunities`).
- `src/components/3d/`: Persistent WebGL 3D world (`WorldCanvas`, `DigitalCore`, `SceneController`, `Timeline3DCanvas`, `PersistentWorld`).
- `src/components/cursor/`: Interactive light field cursor system (`InteractiveLightField.tsx`).
- `src/components/`: Kinetic UI modules (Navbar, Footer, Hero, HeroVisual, Preloader, MotionProvider, CustomCursor, SplitHeading, MagneticButton, InfiniteMarquee, ScrollReveal).
- `src/data/`: Verified society datasets (`societyData.ts`, `timelineData.ts`, `teamData.ts`, `resourcesData.ts`).
- `src/lib/`: Supabase clients, HMAC QR helpers, Zod validation, utils.
- `supabase/migrations/`: SQL migration files with zero-trust RLS policies.

### CHECKLIST
- [x] Creative Redesign & Palette: Deep Ink `#080B12`, Charcoal `#111722`, Electric Blue `#315EFF`, Ice Cyan `#75E6FF`, Soft White `#F2F4F8`, Acid Lime `#D4FF24` (accents).
- [x] Official TechNeeds Logo: Integrated in Preloader, Navbar, Hero, and Footer (`public/brand/techneeds-logo.png`).
- [x] Interactive Light Field Cursor: Lens reveal, hidden circuit traces, liquid displacement, particle repulsion/spring reassembly.
- [x] Rebuilt Homepage (14 connected sections): Asymmetric Hero with 3D Core HUD reticle, Narrative Bridge, 4 Editorial Pillars, Live Stats, Featured Programs (InnoVortex, SSSC Mentorship), Live Events discovery, INNOVORTEX Spotlight, 3D Spatial Timeline preview, Community & Knowledge Arsenal callouts, Testimonials, Collaborate & FAQ teasers.
- [x] Public Routes Completed (No generic templates / empty boxes):
  - `/about`: Origin story, Mission/Vision, SSSC Mentorship, InnoVortex, and 5 Department Cadres.
  - `/events`: Filterable Upcoming, Ongoing, and Past Events with verified fallback data & HMAC pass booking.
  - `/team`: Verified leadership, core leads, faculty advisory, alumni (2024-2026), and mentorship faculty.
  - `/mentorship`: Full SSSC Mentorship Cadre page with cohort archive, curriculum, and application CTA.
  - `/resources`: TechBoard Learning Vault with live search, difficulty tags, category filters, and local bookmarks.
  - `/opportunities`: Opportunity Radar with active hackathons, fellowships, internships, and expired badges.
  - `/showcase`: Student project showcase with category filters and interactive project submission modal.
  - `/faq`: 9-category interactive accordion with instant search.
  - `/collaborate`: Sponsor tiers (Title, Track, Community) and working inquiry form connected to `/api/tickets`.
  - `/community` & `/gallery`: Active channels, perks, community charter, and curated event snapshots.
  - `/timeline`: 3D WebGL spline with 14 milestones (2023-2026) and interactive node inspector preserved.
- [x] Preserved Backend: HMAC QR generation, check-in scanner, ticketing API, auth & admin consoles intact.

### NEXT TASK
Connect production Supabase credentials in `.env.local` and run `npx tsx scripts/seed-timeline.ts` to sync live database records with the verified timeline dataset.

### TEST STATUS
- TypeScript typecheck (`tsc --noEmit`): Passed with 0 errors.
- ESLint (`next lint`): Passed with 0 errors.
- Production build (`next build`): 39 static and dynamic routes compiled and generated with code 0.
- Live server smoke test: All 12 public routes return HTTP 200 OK.
- Visual smoke test: High-res screenshots verified in `docs/` for Home, About, Events, Team, Mentorship, Resources, Community, and Timeline.
