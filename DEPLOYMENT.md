# TechNeeds IGDTUW — Production Deployment Guide

This document defines the production deployment pipeline, environment variable requirements, database migration steps, and post-deployment verification procedures for the **TechNeeds IGDTUW** platform on **Vercel** with **Supabase**.

---

## 1. System Architecture & Deployment Stack

- **Framework**: Next.js 14.2.21 (App Router)
- **Runtime**: Node.js `>=20.0.0` (Recommended: Node 22.x LTS on Vercel)
- **Package Manager**: npm with lockfile (`npm ci`)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & SSR Cookie Handling
- **Email Delivery**: Resend (Transactional 6-Digit OTP with in-app developer autofill fallback)
- **Hosting**: Vercel (Production & Preview environments)
- **Repository**: GitHub (Private Repository: `techneeds-igdtuw`)

---

## 2. Pre-Deployment Verification (Verified Locally)

All quality gates have been executed and verified locally with **0 errors**:

| Quality Gate | Command | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Dependencies** | `npm ci` | Passed | 529 packages installed cleanly from `package-lock.json` |
| **Linting** | `npm run lint` | Passed | 0 errors |
| **Typecheck** | `npm run typecheck` | Passed | TypeScript compiler passed (`tsc --noEmit`) |
| **Production Build** | `npm run build` | Passed | All 39 static and dynamic routes compiled successfully |

---

## 3. GitHub Repository Setup

The local repository is prepared on branch `main` with all changes committed. Because no remote exists yet and GitHub CLI requires user authentication, follow these steps to connect and push:

### Option A: Using GitHub Web Interface (Recommended)
1. Go to [github.com/new](https://github.com/new).
2. Repository name: **`techneeds-igdtuw`**.
3. Visibility: Select **Private**.
4. Leave **"Add a README file"**, **".gitignore"**, and **"license"** **UNCHECKED** (we already have them).
5. Click **Create repository**.
6. In your local terminal, link the remote and push `main`:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/techneeds-igdtuw.git
   git push -u origin main
   ```

### Option B: Using GitHub CLI (`gh`)
If you have `gh` installed and authenticated:
```bash
gh repo create techneeds-igdtuw --private --source=. --remote=origin --push
```

> [!IMPORTANT]
> **Secret Safety Audit**: All `.env` and `.env*.local` files are strictly excluded via `.gitignore`. No secret keys, credentials, or private keys are tracked by Git.

---

## 4. Vercel Deployment Setup

### Step 1: Import Project into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select **Continue with GitHub** and import the **`techneeds-igdtuw`** repository.

### Step 2: Configure Project Settings
- **Framework Preset**: `Next.js`
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm ci` (default)
- **Node.js Version**: In Vercel Project Settings -> General -> Node.js Version, select **`22.x`**.

---

## 5. Environment Variables Configuration

Enter these environment variables in the Vercel Dashboard under **Project Settings** -> **Environment Variables**.

| Variable Name | Exposure | Required In | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Public** (Client & Server) | Production, Preview, Dev | Supabase project endpoint (e.g., `https://xyzcompany.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **Public** (Client & Server) | Production, Preview, Dev | Supabase Anon / Publishable API key |
| `SUPABASE_SECRET_KEY` | **Secret** (Server-only) | Production, Preview, Dev | Supabase Service Role secret key for admin APIs and migrations |
| `QR_SIGNING_SECRET` | **Secret** (Server-only) | Production, Preview, Dev | Random string (min 32 chars) for cryptographic QR ticket signatures & session cookies |
| `ADMIN_BOOTSTRAP_EMAIL` | **Config** (Server-only) | Production, Preview, Dev | Default email address of the society super-admin |
| `ADMIN_BOOTSTRAP_PASSWORD` | **Secret** (Server-only) | Production, Preview, Dev | Default password for initial admin bootstrapping |
| `RESEND_API_KEY` | **Secret** (Server-only) | Production, Preview, Dev | Resend API key (`re_...`) for sending live email OTPs to student inboxes |
| `RESEND_FROM_EMAIL` | **Config** (Server-only) | Production, Preview, Dev | Sender name & verified email (e.g., `TechNeeds IGDTUW <onboarding@resend.dev>`) |

> [!TIP]
> Generate a strong 32-character string for `QR_SIGNING_SECRET` using Node.js:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## 6. Supabase Production Readiness

### Step 1: Apply Initial Schema & RLS Policies
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **SQL Editor** -> **New Query**.
3. Copy the full contents of [`supabase/migrations/0001_init.sql`](file:///c:/Users/parvb/Downloads/innovtx/supabase/migrations/0001_init.sql).
4. Run the query. This sets up:
   - `profiles`, `events`, `event_registrations`, `attendance`, `tickets`, `opportunities`, `timeline_items`, `certificates`, `audit_logs`
   - Strict Row Level Security (RLS) policies
   - Automated user trigger `on_auth_user_created`

### Step 2: Configure Supabase Auth URLs
Navigate to **Authentication** -> **URL Configuration**:
- **Site URL**: `https://<your-vercel-domain>.vercel.app` (or custom domain)
- **Redirect URLs**:
  - `https://<your-vercel-domain>.vercel.app/**`
  - `https://*-<your-team>.vercel.app/**` (allows preview branch deployments)
  - `http://localhost:3000/**` (for local development)

### Step 3: Configure Email OTP Settings
Navigate to **Authentication** -> **Providers** -> **Email**:
- **Enable Email Provider**: `ON`
- **Confirm email**: `ON`
- **OTP Expire in**: `300` seconds (5 minutes)

### Step 4: Admin Role Bootstrapping
1. Sign up on the production site using the `ADMIN_BOOTSTRAP_EMAIL` address.
2. In your local terminal (pointing to the production database via `.env.local`), run:
   ```bash
   npx tsx scripts/seed.ts
   ```
3. This promotes the account from `student` to `super_admin`.

---

## 7. Post-Deployment Verification Checklist

Once Vercel completes the build:

- [ ] **Public Pages**: Verify `/`, `/about`, `/events`, `/timeline`, `/team`, `/faq`, `/opportunities`.
- [ ] **3D World & Background**: Confirm Three.js / Canvas loads without WebGL errors or frame drops.
- [ ] **Student Authentication**: Test OTP login at `/login` and registration at `/signup`.
- [ ] **Student Dashboard**: Verify `/dashboard`, `/dashboard/registrations`, and `/dashboard/tickets` load without redirect loops.
- [ ] **Admin Console**: Log in at `/admin/login` and verify access to `/admin/events`, `/admin/tickets`, and `/admin/opportunities`.
- [ ] **Edge Middleware**: Confirm unauthorized access to `/dashboard` or `/admin` correctly redirects to `/login` or `/admin/login`.

---

## 8. Continuous Deployment Workflow

With GitHub and Vercel linked:
1. Pushing to branch `main` automatically triggers a **Production Deployment**.
2. Opening a Pull Request or pushing to feature branches automatically triggers an isolated **Preview Deployment**.
