# Backend Progress Tracker

## Project: New Canadian Drywall — Backend Implementation

---

## All Phases Complete — Ready for Deployment

### Phase 1: Database Setup ✅
- [x] 1.1 Install and configure Prisma ORM
- [x] 1.2 Design database schema (Projects, Testimonials, Services, Contact Submissions, Career Applications, Collaborations, Admin)
- [x] 1.3 Set up SQLite database for local development
- [x] 1.4 Run initial migration
- [x] 1.5 Seed database with content (6 projects, 10 testimonials, 6 services, 3 collaborations)

### Phase 2: Public API Routes ✅
- [x] `POST /api/contact/quote` — Quote request submission
- [x] `POST /api/contact/career` — Career application submission
- [x] `GET /api/projects` — Fetch active projects
- [x] `GET /api/projects/[id]` — Fetch single project
- [x] `GET /api/testimonials` — Fetch active testimonials
- [x] `GET /api/services` — Fetch active services with tags and features
- [x] `GET /api/collaborations` — Fetch active partner data
- [x] `GET /api/stats` — Dashboard stats

### Phase 3: Contact Form Integration ✅
- [x] Replace simulated form submission with real API calls
- [x] Add loading/error states to forms

### Phase 4: Content Migration ✅
- [x] ProjectCarousel fetches from API
- [x] Testimonials marquee fetches from API
- [x] Services section fetches from API
- [x] Collaborations logo strip fetches from API

### Phase 5: Email Notifications ✅
- [x] Set up Resend for transactional emails
- [x] Quote request confirmation email to visitor
- [x] Career application acknowledgment email to applicant
- [x] Admin notification emails (new quote + new application)

### Phase 6: Media Storage ✅
- [x] Set up Vercel Blob (with local filesystem fallback)
- [x] Image/video upload endpoint (`POST /api/upload`)
- [x] File type validation (JPEG, PNG, WebP, AVIF, MP4, MOV, AVI, WebM)
- [x] Configure remotePatterns for Next.js Image optimization

### Phase 7: Admin Panel ✅
**Auth:**
- [x] Password-based authentication with session cookies (expires on browser close)
- [x] Login page (`/admin/login`) + logout API
- [x] Change password page + API

**Navigation:**
- [x] Path-aware nav highlighting (Dashboard, Projects, Testimonials, Services, Partners, Submissions, Media, Change Password)
- [x] Logout button

**Projects CRUD:**
- [x] List all projects (title, category, order, active status)
- [x] Create project (title, category, description, image, location, stats, order, active)
- [x] Edit project (pre-populated form)
- [x] Delete project

**Testimonials CRUD:**
- [x] List all testimonials (name, quote preview, order, active)
- [x] Create testimonial (name, quote, order, active)
- [x] Edit testimonial
- [x] Delete testimonial

**Services CRUD:**
- [x] List all services
- [x] Create service (title, slug, description, detail, tags as chips, features with title+desc, order, active)
- [x] Edit service
- [x] Delete service

**Collaborations/Partners CRUD:**
- [x] List all partners
- [x] Create partner (name, logo URL, description, order, active)
- [x] Edit partner
- [x] Delete partner

**Submissions Management:**
- [x] Tabs for Quote Requests / Career Applications
- [x] Expandable cards with full submission details
- [x] Status pipeline: new → read → wip → completed
- [x] Reject / Archive shortcuts
- [x] Mark All as Read
- [x] Search (name, email, message)
- [x] Filter by status
- [x] Bulk delete by status (rejected, archived)
- [x] Multi-select checkbox delete mode
- [x] Individual delete per submission

**Media Library:**
- [x] Grid view of all uploaded files with thumbnails
- [x] Upload file with optional project association
- [x] Associate existing unused files to a project
- [x] "Used in: Project Name" / "Unused" indicators
- [x] Delete files

**Notifications:**
- [x] Polling-based browser notifications (2s interval for new submissions)
- [x] Permission prompt banner (disappears on grant)

### Phase 8: Environment & Deployment 🔲
- [ ] 8.1 Configure `.env` for all services (Resend API key, Vercel Blob token, production DB URL)
- [ ] 8.2 Production database setup (PostgreSQL)
- [ ] 8.3 Deploy and test

---

## Additional Pages ✅
- [x] Privacy Policy (`/privacy`)
- [x] Terms of Service (`/terms`)
- [x] Footer links updated to point to actual pages

---

## Notes

- **Framework:** Next.js 15.2.4 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (dev) / PostgreSQL (recommended for production)
- **ORM:** Prisma
- **Email:** Resend
- **Storage:** Vercel Blob (with local `public/uploads/` fallback for dev)
- **Session:** Encrypted cookies via `iron-session`

---

*Last updated: 2026-05-19*
