# TechNeeds IGDTUW Society Platform

Official technical society web platform for Indira Gandhi Delhi Technical University for Women (IGDTUW).

## AGENT HANDOFF

### STATUS
P0 (7/7 complete), P1 (5/5 complete), P2 (placeholders ready) — Build & Typecheck passing.

### AGENT RULES
- Single agent. No parallel agents. No browser automation except one final smoke test.
- If README.md has "## AGENT HANDOFF", read it first and resume from NEXT TASK. Do not re-scan the repo.
- Read only files you will edit. Never print whole files or full logs; show last 30 lines of errors only.
- Plan <=15 lines, then execute. No commentary between steps. No approval requests for routine decisions.
- Write complete files in one pass; avoid repeated micro-edits. Run build/lint only at phase checkpoints.
- Work on branch feat/<task>; never commit .env.local or any sb_secret_ value. Overwrite README handoff section (<=120 lines).

### STACK & COMMANDS
- Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase (@supabase/ssr), Zod, GSAP + Lenis, Framer Motion, cmdk, QRCode, html5-qrcode.
- Dev: `npm run dev` | Build: `npm run build` | Lint: `npm run lint` | Typecheck: `npm run typecheck`
- Seed admin: `npx tsx scripts/seed.ts` | Migrations: apply `supabase/migrations/0001_init.sql`

### REQUIRED ENV VARS
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `QR_SIGNING_SECRET`, `ADMIN_BOOTSTRAP_EMAIL`

### FOLDER MAP
- `docs/`: Research dossiers and gap summaries.
- `scripts/`: Operational scripts including admin bootstrap seed (`scripts/seed.ts`).
- `src/app/`: Next.js 14 App Router routes (public, auth, student dashboard, admin console, API).
- `src/components/`: UI modules (Navbar, Footer, Hero, Preloader, MotionProvider, CommandPalette).
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
- [x] P0.1 Migration & RLS: `supabase/migrations/0001_init.sql`
- [x] P0.2 Auth & Middleware: `src/app/(auth)/*`, `src/middleware.ts`, `src/lib/supabase/*`, `scripts/seed.ts`
- [x] P0.3 Public Home & Events: `src/app/(public)/page.tsx`, `src/app/(public)/events/*`, `src/app/(public)/faq/*`
- [x] P0.4 Cryptographic QR Passes: `src/lib/qr.ts`, `src/app/api/events/register/route.ts`, `src/app/dashboard/registrations/*`
- [x] P0.5 Admin Event Ops & Scanner: `src/app/admin/events/*`, `src/app/api/admin/events/*`, scanner + CSV export
- [x] P0.6 Support Tickets & Triage: `src/app/dashboard/tickets/*`, `src/app/admin/tickets/*`, `src/app/api/tickets/*`
- [x] P0.7 Opportunities Portal: `src/app/(public)/opportunities/page.tsx`, `src/app/admin/opportunities/*`
- [x] P1 Team, Timeline, TechBoard: `src/app/(public)/team/*`, `src/app/(public)/timeline/*`, `src/app/(public)/resources/*`
- [x] P1 Cert Verify & CmdK: `src/app/(public)/verify/[id]/*`, `src/components/CommandPalette.tsx`, `src/app/admin/audit-logs/*`
- [x] P2 Placeholders: `src/app/(public)/recruitment/*`, `/showcase/*`, `/mentorship/*`, `/dashboard/notifications/*`

### NEXT TASK
Execute migration `0001_init.sql` against production Supabase project and provide real credentials in `.env.local`.

### DECISIONS
- Fixed color tokens: Midnight `#030407`, Cobalt Blue `#1558C9`, Acid Lime `#D4FF24`.
- QR security: Random 24-byte entropy + HMAC-SHA256 signature stored as SHA-256 hash; no PII encoded in QR.
- Rate limiting: In-memory IP sliding window on auth and submission routes.
- Preloader: SVG logo animation runs once per session (<1.4s) with prefers-reduced-motion bypass.

### KNOWN ISSUES & NEEDS ADMIN VERIFICATION
- Founding date, complete team roster, and faculty coordinators need admin verification (marked "To be added by admin").
- Official vector SVG logo asset needs admin upload (currently using branded wordmark).
- Production Supabase credentials required in `.env.local` for live DB connectivity.

### TEST STATUS
- TypeScript typecheck (`tsc --noEmit`): Passed with 0 errors.
- ESLint (`next lint`): Passed with 0 errors.
- Production build (`next build`): All 35 routes compiled and prerendered successfully.
- Crypto test: Valid token HMAC verification passes; tampered token rejected.
