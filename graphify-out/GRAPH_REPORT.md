# Graph Report - drywall-project  (2026-05-23)

## Corpus Check
- 95 files · ~1,392,860 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 510 nodes · 588 edges · 48 communities (39 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5dc9838a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]

## God Nodes (most connected - your core abstractions)
1. `requireAdminAPI()` - 41 edges
2. `compilerOptions` - 17 edges
3. `Backend Documentation — New Canadian Drywall` - 15 edges
4. `4.2 The Schema (`prisma/schema.prisma`)` - 12 edges
5. `5. API Routes — Every Endpoint` - 12 edges
6. `8. Media Storage — Vercel Blob & Local Fallback` - 10 edges
7. `All Phases Complete — Ready for Deployment` - 9 edges
8. `Deployment Guide — New Canadian Drywall` - 9 edges
9. `scripts` - 8 edges
10. `Endpoints` - 8 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `requireAdminAPI()`  [EXTRACTED]
  app/api/admin/change-password/route.ts → lib/auth.ts
- `GET()` --calls--> `requireAdminAPI()`  [EXTRACTED]
  app/api/admin/collaborations/route.ts → lib/auth.ts
- `POST()` --calls--> `requireAdminAPI()`  [EXTRACTED]
  app/api/admin/collaborations/route.ts → lib/auth.ts
- `GET()` --calls--> `requireAdminAPI()`  [EXTRACTED]
  app/api/admin/collaborations/[id]/route.ts → lib/auth.ts
- `PUT()` --calls--> `requireAdminAPI()`  [EXTRACTED]
  app/api/admin/collaborations/[id]/route.ts → lib/auth.ts

## Communities (48 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (27): DELETE(), GET(), PUT(), GET(), DELETE(), GET(), PUT(), GET() (+19 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (42): 10. Common Commands, 11.1 Using a Browser (for GET requests), 11.2 Using curl (command line), 11.3 Using Postman, 11.4 Using the DevTools Network Tab, 11. How to Test APIs, 12. Complete Flow Walkthroughs, 13. Troubleshooting (+34 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (30): dependencies, dotenv, next, prisma, @prisma/client, react, react-dom, resend (+22 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (6): ROWS, Partner, Service, SERVICE_ICONS, ServiceFeature, Testimonial

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (27): 1. Get All Projects, 2. Get Single Project, 3. Get All Testimonials, 4. Get All Services, 5. Get All Collaborations, 6. Submit Quote Request, 7. Submit Career Application, API Testing Guide (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (15): POST(), links, checkEnvironmentVariables(), DashboardLayout(), clearSession(), createSession(), getSecret(), getSession() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (25): 5.10 POST /api/contact/career — Submit Career Application, 5.11 POST /api/upload — Upload a File (Image or Video), 5.1 How API Routes Work in Next.js, 5.2 HTTP Methods Explained, 5.3 API Responses (HTTP Status Codes), 5.4 GET /api/projects — Fetch All Projects, 5.5 GET /api/projects/[id] — Fetch Single Project, 5.6 GET /api/testimonials — Fetch Testimonials (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (8): REVIEW_EMPTY, ReviewErrors, ReviewForm, NAV_LINKS, SERVICES, SOCIALS, PageWrapperProps, NAV_LINKS

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 9 - "Community 9"
Cohesion: 0.20
Nodes (16): ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, deleteFile(), generateFilename(), getFileExtension(), isAllowedFileType(), isBlobConfigured(), isImageType() (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (18): 4.1 What is a Database?, 4.2 The Schema (`prisma/schema.prisma`), 4.3 Relations (How Tables Connect), 4.4 How to Modify the Database, 4.5 The Seed Script (`prisma/seed.ts`), 4. The Database — Prisma + SQLite, `CareerSubmission`, code:block2 (Project ──has many──→ ProjectImage (projectId)) (+10 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (12): AVAILABILITY, BUDGET_RANGES, CAREER_EMPTY, CareerErrors, CareerForm, PROJECT_TYPES, QUOTE_EMPTY, QuoteErrors (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (15): 8.1 Overview, 8.2 How it Detects the Environment, 8.3 Local Filesystem Storage (Development), 8.4 Vercel Blob Storage (Production), 8.5 The Upload Flow (End to End), 8.6 Deleting Files (`lib/media.ts`), 8.7 File Naming Convention, 8.8 Configuring Next.js Image Component (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (14): code:powershell (# Generate a random AUTH_SECRET), code:powershell (git add .), code:powershell (npx prisma migrate deploy), code:powershell (npx prisma db seed), code:prisma (datasource db {), Deployment Guide — New Canadian Drywall, PostgreSQL Connection Details, Prerequisites (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (13): Additional Pages ✅, All Phases Complete — Ready for Deployment, Backend Progress Tracker, Notes, Phase 1: Database Setup ✅, Phase 2: Public API Routes ✅, Phase 3: Contact Form Integration ✅, Phase 4: Content Migration ✅ (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.32
Nodes (11): POST(), adminCareerNotificationHtml(), adminQuoteNotificationHtml(), careerConfirmationHtml(), isConfigured(), quoteConfirmationHtml(), sendAdminCareerNotification(), sendAdminQuoteNotification() (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.27
Nodes (6): angularDelta(), getCarouselParams(), mod(), ProjectCarousel(), STATS, Project

### Community 17 - "Community 17"
Cohesion: 0.20
Nodes (10): 7.1 What is Resend?, 7.2 How it's configured (`lib/email.ts`), 7.3 Email Functions, 7.4 Fire-and-Forget Pattern, 7.5 How to Set Up Resend, 7.6 Email Templates, 7. Email System — Resend, code:typescript (const resendApiKey = process.env.RESEND_API_KEY;) (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.20
Nodes (9): Adding your real project images, code:bash (# 1. Create the Next.js project (run this in your terminal)), code:block2 (drywall-project/), code:tsx ({), code:tsx (export const metadata: Metadata = {), Drywall Project — Setup Guide, File structure after setup, One-time setup (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.31
Nodes (8): collectLocalFiles(), DIR_MAP, LocalFile, main(), MIME_MAP, prisma, uploadToBlob(), walkFiles()

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (5): NEXT_BTN_COLOR, NEXT_STATUS, STATUS_BG, STATUS_COLORS, Submission

### Community 21 - "Community 21"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 22 - "Community 22"
Cohesion: 0.40
Nodes (4): buildCommand, framework, installCommand, outputDirectory

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (3): hashPassword(), main(), prisma

## Knowledge Gaps
- **216 isolated node(s):** `extends`, `nextConfig`, `name`, `version`, `private` (+211 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Backend Documentation — New Canadian Drywall` connect `Community 1` to `Community 17`, `Community 10`, `Community 12`, `Community 6`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `5. API Routes — Every Endpoint` connect `Community 6` to `Community 1`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `4. The Database — Prisma + SQLite` connect `Community 10` to `Community 1`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `extends`, `nextConfig`, `name` to the rest of the system?**
  _216 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05925925925925926 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._