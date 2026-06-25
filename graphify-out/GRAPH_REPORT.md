# Graph Report - .  (2026-06-25)

## Corpus Check
- Large corpus: 165 files · ~1,460,051 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 583 nodes · 839 edges · 59 communities (37 shown, 22 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin API Routes|Admin API Routes]]
- [[_COMMUNITY_Admin & Lib Core|Admin & Lib Core]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_Public API|Public API]]
- [[_COMMUNITY_Admin Dashboard Pages|Admin Dashboard Pages]]
- [[_COMMUNITY_Auth & Media|Auth & Media]]
- [[_COMMUNITY_Project Management|Project Management]]
- [[_COMMUNITY_Testimonials & Collaborations|Testimonials & Collaborations]]
- [[_COMMUNITY_Services|Services]]
- [[_COMMUNITY_Contact Forms|Contact Forms]]
- [[_COMMUNITY_Configuration|Configuration]]
- [[_COMMUNITY_Migration & Scripts|Migration & Scripts]]
- [[_COMMUNITY_Error Handling|Error Handling]]
- [[_COMMUNITY_Logger|Logger]]
- [[_COMMUNITY_Prisma Database|Prisma Database]]
- [[_COMMUNITY_Email Service|Email Service]]
- [[_COMMUNITY_Rate Limiting|Rate Limiting]]
- [[_COMMUNITY_API Types|API Types]]
- [[_COMMUNITY_Seed Data|Seed Data]]
- [[_COMMUNITY_Media Upload|Media Upload]]
- [[_COMMUNITY_Push Notifications|Push Notifications]]
- [[_COMMUNITY_Admin Nav|Admin Nav]]
- [[_COMMUNITY_Review Form|Review Form]]
- [[_COMMUNITY_Change Password|Change Password]]
- [[_COMMUNITY_Privacy Page|Privacy Page]]
- [[_COMMUNITY_Terms Page|Terms Page]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_About Section|About Section]]
- [[_COMMUNITY_Hero Section|Hero Section]]
- [[_COMMUNITY_Project Dependencies|Project Dependencies]]
- [[_COMMUNITY_Blob Migration|Blob Migration]]
- [[_COMMUNITY_Services CRUD|Services CRUD]]
- [[_COMMUNITY_Testimonials CRUD|Testimonials CRUD]]
- [[_COMMUNITY_Submissions CRUD|Submissions CRUD]]
- [[_COMMUNITY_Health Check|Health Check]]
- [[_COMMUNITY_Stats|Stats]]
- [[_COMMUNITY_Notification Setup|Notification Setup]]
- [[_COMMUNITY_AdminLogin Page|AdminLogin Page]]
- [[_COMMUNITY_Dashboard Page|Dashboard Page]]
- [[_COMMUNITY_ChangePassword Page|ChangePassword Page]]
- [[_COMMUNITY_Collaborations Admin|Collaborations Admin]]
- [[_COMMUNITY_Media Admin|Media Admin]]
- [[_COMMUNITY_Projects Admin|Projects Admin]]
- [[_COMMUNITY_Services Admin|Services Admin]]

## God Nodes (most connected - your core abstractions)
1. `handleApiError()` - 61 edges
2. `Logger` - 28 edges
3. `compilerOptions` - 17 edges
4. `Backend Documentation` - 16 edges
5. `withDbRetry()` - 11 edges
6. `PrismaClient Singleton` - 11 edges
7. `scripts` - 8 edges
8. `HomePage` - 8 edges
9. `Contact` - 8 edges
10. `POST()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `POST /api/upload` --calls--> `uploadFile`  [EXTRACTED]
  docs/BACKEND_DOCUMENTATION.md → lib/media.ts
- `deleteFile` --calls--> `Vercel Blob Storage`  [EXTRACTED]
  lib/media.ts → docs/BACKEND_DOCUMENTATION.md
- `POST /api/contact/quote` --references--> `QuoteSubmission model`  [EXTRACTED]
  docs/API_TESTING.md → prisma/seed.ts
- `POST /api/contact/career` --references--> `CareerSubmission model`  [EXTRACTED]
  docs/API_TESTING.md → prisma/seed.ts
- `Next.js 15 App Router` --conceptually_related_to--> `Vercel Deployment`  [INFERRED]
  docs/BACKEND_DOCUMENTATION.md → vercel.json

## Communities (59 total, 22 thin omitted)

### Community 0 - "Admin API Routes"
Cohesion: 0.06
Nodes (52): DELETE(), GET(), PUT(), GET(), DELETE(), GET(), PUT(), GET() (+44 more)

### Community 1 - "Admin & Lib Core"
Cohesion: 0.06
Nodes (53): Admin Change Password POST, Admin Collaborations GET, Admin Collaborations POST, Admin Collaboration By ID DELETE, Admin Collaboration By ID GET, Admin Collaboration By ID PUT, Admin Media DELETE, Admin Media GET (+45 more)

### Community 2 - "UI Components"
Cohesion: 0.05
Nodes (45): API: GET /api/admin/submissions, Auth Login API, API: POST /api/auth/logout, API: GET /api/collaborations, API: POST /api/contact/career, API: POST /api/contact/quote, API: POST /api/contact/testimonial, API: GET /api/projects (+37 more)

### Community 3 - "Public API"
Cohesion: 0.07
Nodes (45): GET /api/collaborations, GET /api/projects/[id], GET /api/projects, GET /api/services, GET /api/testimonials, POST /api/contact/career, POST /api/contact/quote, POST /api/upload (+37 more)

### Community 4 - "Admin Dashboard Pages"
Cohesion: 0.05
Nodes (20): REVIEW_EMPTY, ReviewErrors, ReviewForm, AVAILABILITY, BUDGET_RANGES, CAREER_EMPTY, CareerErrors, CareerForm (+12 more)

### Community 5 - "Auth & Media"
Cohesion: 0.06
Nodes (31): dependencies, dotenv, next, prisma, @prisma/client, react, react-dom, resend (+23 more)

### Community 6 - "Project Management"
Cohesion: 0.07
Nodes (6): ROWS, Partner, Service, SERVICE_ICONS, ServiceFeature, Testimonial

### Community 7 - "Testimonials & Collaborations"
Cohesion: 0.12
Nodes (27): Admin API Routes, File Upload API, ChangePassword, EditCollaboration, NewCollaboration, AdminCollaborations, AdminMedia, AdminDashboard (+19 more)

### Community 8 - "Services"
Cohesion: 0.14
Nodes (16): changePasswordSchema, POST(), links, checkEnvironmentVariables(), DashboardLayout(), clearSession(), createSession(), getSecret() (+8 more)

### Community 9 - "Contact Forms"
Cohesion: 0.18
Nodes (19): careerSchema, POST(), adminCareerNotificationHtml(), adminQuoteNotificationHtml(), careerConfirmationHtml(), isConfigured(), quoteConfirmationHtml(), sendAdminCareerNotification() (+11 more)

### Community 10 - "Configuration"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 11 - "Migration & Scripts"
Cohesion: 0.20
Nodes (16): ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, deleteFile(), generateFilename(), getFileExtension(), isAllowedFileType(), isBlobConfigured(), isImageType() (+8 more)

### Community 12 - "Error Handling"
Cohesion: 0.27
Nodes (6): angularDelta(), getCarouselParams(), mod(), ProjectCarousel(), STATS, Project

### Community 13 - "Logger"
Cohesion: 0.18
Nodes (4): HomePage, PrivacyPolicy, TermsOfService, Public Facing Website

### Community 14 - "Prisma Database"
Cohesion: 0.22
Nodes (9): Authentication System, Rate Limiting System, createSession, getSession, hashPassword, requireAdmin, verifyPassword, checkFormRateLimit (+1 more)

### Community 15 - "Email Service"
Cohesion: 0.31
Nodes (8): collectLocalFiles(), DIR_MAP, LocalFile, main(), MIME_MAP, prisma, uploadToBlob(), walkFiles()

### Community 16 - "Rate Limiting"
Cohesion: 0.29
Nodes (5): NEXT_BTN_COLOR, NEXT_STATUS, STATUS_BG, STATUS_COLORS, Submission

### Community 17 - "API Types"
Cohesion: 0.33
Nodes (5): ApiErrorResponse, ApiResponse, ProjectResponse, ServiceResponse, StatsResponse

### Community 18 - "Seed Data"
Cohesion: 0.40
Nodes (4): buildCommand, framework, installCommand, outputDirectory

### Community 21 - "Admin Nav"
Cohesion: 0.67
Nodes (3): config, isAuthenticated(), middleware()

### Community 22 - "Review Form"
Cohesion: 0.67
Nodes (3): hashPassword(), main(), prisma

### Community 25 - "Terms Page"
Cohesion: 0.67
Nodes (3): Error Handling System, ApiError class, handleApiError

## Knowledge Gaps
- **202 isolated node(s):** `extends`, `config`, `nextConfig`, `name`, `version` (+197 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DashboardLayout` connect `UI Components` to `Admin & Lib Core`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `handleApiError()` connect `Admin API Routes` to `Services`, `Contact Forms`, `Migration & Scripts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `AdminDashboard` connect `Testimonials & Collaborations` to `Admin & Lib Core`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Admin CRUD Operations` (e.g. with `Public API` and `Media Management`) actually correct?**
  _`Admin CRUD Operations` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `extends`, `config`, `nextConfig` to the rest of the system?**
  _202 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.060126582278481014 - nodes in this community are weakly interconnected._
- **Should `Admin & Lib Core` be split into smaller, more focused modules?**
  _Cohesion score 0.055152394775036286 - nodes in this community are weakly interconnected._