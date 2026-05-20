# Backend Documentation — New Canadian Drywall

> **Purpose:** A complete reference for the backend of this project. Written for first-time backend developers. Every concept, file, endpoint, and config is explained from scratch.

---

## Table of Contents

1. [What is a "Backend"?](#1-what-is-a-backend)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure (Backend Files)](#3-project-structure-backend-files)
4. [The Database — Prisma + SQLite](#4-the-database--prisma--sqlite)
5. [API Routes — Every Endpoint](#5-api-routes--every-endpoint)
6. [How Frontend Talks to Backend](#6-how-frontend-talks-to-backend)
7. [Email System — Resend](#7-email-system--resend)
8. [Media Storage — Vercel Blob & Local Fallback](#8-media-storage--vercel-blob--local-fallback)
9. [Environment Variables](#9-environment-variables)
10. [Common Commands](#10-common-commands)
11. [How to Test APIs](#11-how-to-test-apis)
12. [Complete Flow Walkthroughs](#12-complete-flow-walkthroughs)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. What is a "Backend"?

A **backend** is code that runs on a **server** (not in your browser). Its jobs are:

| Job | What it does |
|-----|-------------|
| **Store data** | Save projects, testimonials, contact submissions to a database |
| **Serve data** | When the homepage loads, send the project list as JSON |
| **Accept data** | When someone submits a contact form, save it and send an email |
| **Upload files** | Accept images/videos and store them in the cloud or locally |

The frontend (React components you see in the browser) talks to the backend using **HTTP requests** — the same way your browser loads any website. The backend responds with **JSON** (JavaScript Object Notation), which is structured text the frontend can understand.

**Analogy:** The frontend is a restaurant menu display. The backend is the kitchen. You (the customer = browser) look at the menu (frontend), place an order (API request), the kitchen prepares the food (backend logic), and brings it to your table (API response). You never see the kitchen — you just get the food.

---

## 2. Technology Stack

| Layer | Technology | What it does |
|-------|-----------|-------------|
| **Framework** | Next.js 15.2.4 (App Router) | Serves both the frontend pages AND the backend API routes in one project |
| **Language** | TypeScript | JavaScript with types (catches errors before they happen) |
| **Database ORM** | Prisma 5.22 | Lets you talk to the database using TypeScript instead of raw SQL |
| **Database** | SQLite (local dev) / PostgreSQL (production) | Where all data is stored persistently |
| **Email** | Resend | Sends transactional emails (quote confirmations, admin notifications) |
| **Media Storage** | Vercel Blob (production) / Local filesystem (dev) | Stores uploaded images and videos |
| **Path Alias** | `@/` → maps to project root | e.g. `import { prisma } from '@/lib/prisma'` |

---

## 3. Project Structure (Backend Files)

```
drywall-project/
├── prisma/
│   ├── schema.prisma          ← Database schema (defines all tables)
│   ├── seed.ts                ← Script to fill database with sample data
│   ├── dev.db                 ← The actual SQLite database file
│   └── migrations/            ← Auto-generated migration files
│
├── app/api/
│   ├── projects/
│   │   ├── route.ts           ← GET /api/projects (list all)
│   │   └── [id]/
│   │       └── route.ts       ← GET /api/projects/1 (get one)
│   ├── testimonials/
│   │   └── route.ts           ← GET /api/testimonials
│   ├── services/
│   │   └── route.ts           ← GET /api/services
│   ├── collaborations/
│   │   └── route.ts           ← GET /api/collaborations
│   ├── contact/
│   │   ├── quote/
│   │   │   └── route.ts       ← POST /api/contact/quote
│   │   └── career/
│   │       └── route.ts       ← POST /api/contact/career
│   └── upload/
│       └── route.ts           ← POST /api/upload (file upload)
│
├── lib/
│   ├── prisma.ts              ← Database client setup
│   ├── email.ts               ← Email sending functions (Resend)
│   └── media.ts               ← File upload/delete functions
│
├── .env                       ← Environment variables (secrets)
├── next.config.ts             ← Next.js config (image domains, etc.)
└── BACKEND_PROGRESS.md        ← Progress tracker
```

---

## 4. The Database — Prisma + SQLite

### 4.1 What is a Database?

A database stores data in **tables** (like Excel spreadsheets). Each table has **columns** (fields) and **rows** (records). Prisma is an "ORM" — it lets you work with database data using TypeScript instead of writing SQL.

### 4.2 The Schema (`prisma/schema.prisma`)

This file defines **all the tables** in the database. Here is every model explained:

#### `Project`
Stores information about each drywall project shown on the website.

| Field | Type | Notes |
|-------|------|-------|
| `id` | Int (auto-increment) | Unique number, assigned automatically |
| `title` | String | e.g. "Photos Ancaster" |
| `category` | String | e.g. "Residential", "Commercial", "Hospitality" |
| `description` | String | Long paragraph about the project |
| `location` | String? | Optional — e.g. "Ancaster, ON" |
| `image` | String | URL/path to the main cover image |
| `imageAlt` | String? | Optional — alt text for accessibility |
| `order` | Int | Controls display order (1 = first) |
| `isActive` | Boolean | If false, the project is hidden from the site |
| `createdAt` | DateTime | Auto-set when created |
| `updatedAt` | DateTime | Auto-updated when changed |

Relations: has many `ProjectImage`, `ProjectVideo`, `ProjectStat`

#### `ProjectImage`
Extra images for a project (shown in carousel/gallery).

| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Auto-increment |
| `url` | String | Path to the image file |
| `order` | Int | Display order within gallery |
| `projectId` | Int | Links to the parent project |

#### `ProjectVideo`
Videos related to a project.

Same structure as ProjectImage, but for `.mov`/`.mp4` files.

#### `ProjectStat`
Stats/facts displayed on a project card (e.g. "Type: Residential").

| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Auto-increment |
| `label` | String | e.g. "Type", "Finish", "Location" |
| `value` | String | e.g. "Residential", "Level 5" |
| `order` | Int | Display order |
| `projectId` | Int | Links to parent project |

#### `Testimonial`
Customer reviews shown on the homepage.

| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Auto-increment |
| `name` | String | Customer name |
| `quote` | String | The testimonial text |
| `order` | Int | Display order |
| `isActive` | Boolean | If false, hidden |
| `createdAt` | DateTime | Auto-set |

#### `Service`
Drywall services offered (Installation, Framing, Acoustic, etc.).

| Field | Type | Notes |
|-------|------|-------|
| `id` | String | Manually assigned (e.g. "installation", "framing") |
| `title` | String | Display name |
| `description` | String | Short summary |
| `detail` | String | Long description |
| `order` | Int | Display order |
| `isActive` | Boolean | If false, hidden |

Relations: has many `ServiceTag`, `ServiceFeature`

#### `ServiceTag`
Tags/keywords for a service (e.g. "Residential", "Commercial").

| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Auto-increment |
| `label` | String | The tag text |
| `order` | Int | Display order |
| `serviceId` | String | Links to parent service |

#### `ServiceFeature`
Bullet-point features for each service.

| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Auto-increment |
| `title` | String | Feature title |
| `description` | String | Feature explanation |
| `order` | Int | Display order |
| `serviceId` | String | Links to parent service |

#### `Collaboration`
Partner/affiliate companies.

| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Auto-increment |
| `name` | String | Company name |
| `logo` | String | URL/path to logo image |
| `description` | String? | Optional description |
| `order` | Int | Display order |
| `isActive` | Boolean | If false, hidden |
| `createdAt` | DateTime | Auto-set |

#### `QuoteSubmission`
Stores every quote request submitted through the contact form.

| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Auto-increment |
| `name` | String | Required |
| `email` | String | Required |
| `phone` | String? | Optional |
| `projectType` | String | Required |
| `budget` | String? | Optional |
| `message` | String | Required |
| `status` | String | Default: "new" |
| `createdAt` | DateTime | Auto-set |

#### `CareerSubmission`
Stores every job application submitted through the career form.

| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Auto-increment |
| `name` | String | Required |
| `email` | String | Required |
| `phone` | String? | Optional |
| `role` | String | Required — position applying for |
| `experience` | String? | Optional |
| `availability` | String? | Optional |
| `message` | String | Required |
| `resumeUrl` | String? | Optional — link to uploaded resume |
| `status` | String | Default: "new" |
| `createdAt` | DateTime | Auto-set |

### 4.3 Relations (How Tables Connect)

The `?` means "optional", and the arrows show "belongs to":

```
Project ──has many──→ ProjectImage (projectId)
Project ──has many──→ ProjectVideo (projectId)
Project ──has many──→ ProjectStat  (projectId)

Service ──has many──→ ServiceTag    (serviceId)
Service ──has many──→ ServiceFeature (serviceId)
```

When a Project is deleted, all its related images/videos/stats are also deleted (`onDelete: Cascade`).

### 4.4 How to Modify the Database

1. Edit `prisma/schema.prisma` (add/change fields or models)
2. Run: `npx prisma migrate dev --name description_of_change`
3. Prisma generates a migration file and updates the database automatically
4. Run: `npx prisma generate` (regenerates the TypeScript client with your new types)

### 4.5 The Seed Script (`prisma/seed.ts`)

A script that fills the database with sample data so you can see the site working immediately.

Contains:
- 6 projects with images, videos, and stats
- 10 testimonials
- 6 services with tags and features
- 3 partner companies

Run it with: `npm run db:seed`

---

## 5. API Routes — Every Endpoint

### 5.1 How API Routes Work in Next.js

In Next.js App Router, each file inside `app/api/` automatically becomes an API endpoint:

| File location | URL |
|--------------|-----|
| `app/api/projects/route.ts` | `/api/projects` |
| `app/api/projects/[id]/route.ts` | `/api/projects/1` (or any ID) |
| `app/api/contact/quote/route.ts` | `/api/contact/quote` |

The **function name** inside the file determines the HTTP method:
- `export async function GET()` → handles GET requests
- `export async function POST()` → handles POST requests

### 5.2 HTTP Methods Explained

| Method | What it means | Used for |
|--------|--------------|----------|
| `GET` | "Give me data" | Fetching projects, services, testimonials |
| `POST` | "Here is data, save it" | Form submissions, file uploads |
| `PUT` | "Update this data" | Editing existing records (not yet implemented) |
| `DELETE` | "Remove this data" | Deleting records (not yet implemented) |

### 5.3 API Responses (HTTP Status Codes)

Every API response includes a **status code** that tells the frontend if things worked:

| Code | Meaning | When it happens |
|------|---------|-----------------|
| **200** | OK (success) | GET request returns data |
| **201** | Created | POST request successfully saved data |
| **400** | Bad Request | You forgot a required field |
| **404** | Not Found | You asked for a project that doesn't exist |
| **500** | Server Error | Something broke on the backend |

---

### 5.4 GET /api/projects — Fetch All Projects

**What it does:** Returns all active projects with their images, videos, and stats.

**Called by:** The ProjectCarousel component on the homepage.

**Response format:**
```json
[
  {
    "id": 1,
    "image": "/images/Photos Ancaster/IMG_8378.jpeg",
    "imageAlt": "Ancaster residential drywall installation",
    "images": ["/images/Photos Ancaster/IMG_8379.jpeg", "..."],
    "videos": ["/videos/Photos Ancaster/IMG_8376.mov"],
    "category": "Residential",
    "title": "Photos Ancaster",
    "location": "Ancaster, ON",
    "description": "Full residential drywall installation...",
    "stats": [
      { "label": "Type", "value": "Residential" },
      { "label": "Finish", "value": "Level 5" },
      { "label": "Location", "value": "Ancaster, ON" }
    ]
  }
]
```

**How the code works** (`app/api/projects/route.ts`):
1. Defines `export async function GET()`
2. Queries the database: `prisma.project.findMany({ where: { isActive: true }, ... })`
3. The `where` filter ensures only active projects are returned
4. The `orderBy` sorts them by the `order` field (ascending)
5. The `include` loads related images, videos, and stats in a single query
6. The results are "formatted" (mapped) into a cleaner shape for the frontend
7. Returns the array as JSON with `NextResponse.json(formatted)`

### 5.5 GET /api/projects/[id] — Fetch Single Project

**What it does:** Returns one specific project by its ID.

**Called by:** A project detail page (if implemented later).

**Response format:**
```json
{
  "id": 1,
  "image": "/images/Photos Ancaster/IMG_8378.jpeg",
  "imageAlt": "Ancaster residential drywall installation",
  "images": ["/images/Photos Ancaster/IMG_8379.jpeg"],
  "videos": ["/videos/Photos Ancaster/IMG_8376.mov"],
  "category": "Residential",
  "title": "Photos Ancaster",
  "location": "Ancaster, ON",
  "description": "Full residential drywall installation...",
  "stats": [
    { "label": "Type", "value": "Residential" }
  ]
}
```

If the project doesn't exist: `{ "error": "Project not found" }` with status 404.

**How the code works** (`app/api/projects/[id]/route.ts`):
1. The `[id]` in the folder name acts as a **dynamic route parameter**
2. In Next.js 15+, the params are passed as a Promise: `props: { params: Promise<{ id: string }> }`
3. It must be awaited: `const params = await props.params;`
4. The ID is converted from string to integer with `parseInt(params.id)`
5. `prisma.project.findUnique({ where: { id: ... } })` fetches one record
6. If null is returned, the project doesn't exist → returns 404
7. Otherwise, formats and returns the project

### 5.6 GET /api/testimonials — Fetch Testimonials

**What it does:** Returns all active customer testimonials.

**Called by:** The Testimonials component on the homepage.

**Response format:**
```json
[
  {
    "id": 1,
    "name": "Michael Torres",
    "quote": "New Canadian Drywall completely transformed our office space...",
    "order": 1,
    "isActive": true,
    "createdAt": "2026-05-17T..."
  }
]
```

### 5.7 GET /api/services — Fetch Services

**What it does:** Returns all active services with their tags and features.

**Called by:** The Services component on the homepage.

**Response format:**
```json
[
  {
    "id": "installation",
    "title": "Drywall Installation",
    "desc": "Full-scope drywall installation...",
    "detail": "From single rooms to multi-floor commercial towers...",
    "tags": ["Residential", "Commercial", "New Build"],
    "features": [
      { "title": "All board types & thicknesses", "desc": "Standard, moisture-resistant..." }
    ]
  }
]
```

**Note:** Services use string IDs (like "installation") instead of numbers. This makes URLs cleaner if you add admin pages later (`/admin/services/installation`).

### 5.8 GET /api/collaborations — Fetch Partners

**What it does:** Returns all active partner/affiliate companies.

**Called by:** The Collaborations component on the homepage.

**Response format:**
```json
[
  {
    "id": 1,
    "name": "BELFOR",
    "logo": "/collaborations/IMG_8705.jpeg",
    "description": null,
    "order": 1,
    "isActive": true,
    "createdAt": "2026-05-17T..."
  }
]
```

### 5.9 POST /api/contact/quote — Submit Quote Request

**What it does:** Saves a quote request to the database and sends confirmation emails.

**Called by:** The Contact form (Quote section) on the homepage.

**What the frontend sends (request body):**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "905-555-0123",
  "projectType": "Commercial Drywall",
  "budget": "$10,000 - $20,000",
  "message": "We need drywall for our new office space..."
}
```

**Phone** and **budget** are optional. Everything else is required.

**If required fields are missing:**
```json
{ "error": "Missing required fields" }
```
Status: 400

**On success:**
```json
{ "message": "Quote request submitted successfully", "id": 1 }
```
Status: 201

**What happens step-by-step** (`app/api/contact/quote/route.ts`):
1. Parse the JSON body: `const body = await request.json()`
2. Destructure the fields: `const { name, email, phone, projectType, budget, message } = body`
3. Validate required fields: if any of `name`, `email`, `projectType`, `message` are missing → return 400
4. Save to database: `prisma.quoteSubmission.create({ data: { ... } })`
5. Send emails (fire-and-forget, doesn't block the response):
   - Confirmation to the user: `sendQuoteConfirmation(...)`
   - Notification to admin: `sendAdminQuoteNotification(...)`
6. Return success response with 201

### 5.10 POST /api/contact/career — Submit Career Application

**What it does:** Saves a job application to the database and sends acknowledgment emails.

**Called by:** The Contact form (Career section) on the homepage.

**Request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "416-555-0456",
  "role": "Drywall Installer",
  "experience": "5 years",
  "availability": "Full-time",
  "message": "I have extensive experience in commercial drywall..."
}
```

**Required fields:** `name`, `email`, `role`, `message`
**Optional fields:** `phone`, `experience`, `availability`

**On success:**
```json
{ "message": "Application submitted successfully", "id": 1 }
```
Status: 201

### 5.11 POST /api/upload — Upload a File (Image or Video)

**What it does:** Accepts a file upload, saves it (to Vercel Blob or locally), and returns the URL.

**Called by:** Any future admin panel or content management interface.

**How to call it (from frontend code):**
```javascript
const formData = new FormData();
formData.append('file', selectedFile); // the file object from an <input type="file">

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData, // no Content-Type header — browser sets it automatically for FormData
});
const data = await response.json();
```

**On success:**
```json
{
  "url": "/uploads/images/1712345678-abc123.jpg",
  "filename": "1712345678-abc123.jpg"
}
```
Or with Vercel Blob:
```json
{
  "url": "https://public.blob.vercel-storage.com/uploads/images/1712345678-abc123.jpg",
  "filename": "1712345678-abc123.jpg"
}
```

**What happens step-by-step:**
1. Parse the FormData: `request.formData()`
2. Extract the file: `formData.get('file')`
3. Check if a file was actually provided
4. Validate file type (images: JPEG/PNG/WebP/AVIF, videos: MP4/MOV/AVI/WebM)
5. Choose the folder based on type: `uploads/images/` or `uploads/videos/`
6. Call `uploadFile()` from `lib/media.ts` which handles the actual storage
7. Return the URL and filename

**Supported file types:**

| Category | Types |
|----------|-------|
| Images | JPEG, PNG, WebP, AVIF |
| Videos | MP4, MOV, AVI, WebM |

Max file size: **50 MB**.

---

## 6. How Frontend Talks to Backend

### 6.1 The Fetch API

Frontend components use the browser's built-in `fetch()` function to make HTTP requests to the backend.

**Example — fetching data (in a React component):**
```typescript
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('/api/projects')              // ← sends GET request to backend
    .then(res => res.json())          // ← parses the JSON response
    .then(data => {
      setProjects(data);              // ← saves data to component state
      setLoading(false);              // ← turns off loading spinner
    })
    .catch(err => console.error(err));
}, []);
```

**Example — submitting a form:**
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  const response = await fetch('/api/contact/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      phone,
      projectType,
      budget,
      message,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    // Show success message
    alert('Quote submitted!');
  } else {
    // Show error message
    alert(data.error);
  }

  setSubmitting(false);
};
```

### 6.2 The Request-Response Cycle

```
Browser (React)              Backend (Next.js)              Database
     │                             │                          │
     │  1. User visits page        │                          │
     │                             │                          │
     │  2. Component mounts        │                          │
     │                             │                          │
     │  3. fetch('/api/projects')  │                          │
     │ ─────────────────────────► │                          │
     │                             │                          │
     │                             │  4. prisma.project       │
     │                             │     .findMany()          │
     │                             │ ────────────────────────►│
     │                             │                          │
     │                             │  5. Returns project data │
     │                             │ ◄────────────────────────│
     │                             │                          │
     │  6. JSON response           │                          │
     │ ◄────────────────────────── │                          │
     │                             │                          │
     │  7. setProjects(data)       │                          │
     │  8. Component re-renders    │                          │
     │     with project data       │                          │
```

### 6.3 Key Points

- All API URLs are **relative** (`/api/projects`, not `http://localhost:3000/api/projects`) because the frontend and backend run on the same server
- The frontend **never** talks to the database directly — it always goes through an API route
- The `fetch()` function returns a Promise, so you use `await` or `.then()` to handle the response
- Always check `response.ok` or `response.status` to handle errors gracefully

---

## 7. Email System — Resend

### 7.1 What is Resend?

Resend (resend.com) is a service that sends transactional emails. "Transactional" means operational emails (form confirmations, notifications) as opposed to marketing emails (newsletters).

### 7.2 How it's configured (`lib/email.ts`)

```typescript
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const fromEmail = process.env.FROM_EMAIL || 'noreply@newcanadiandrywall.com';
const adminEmail = process.env.ADMIN_EMAIL || 'info@newcanadiandrywall.com';
```

**Key points:**
- If `RESEND_API_KEY` is not set in `.env`, the `resend` client is `null`
- Every email function checks if Resend is configured before sending
- If not configured, emails are silently skipped — the app still works

### 7.3 Email Functions

There are 4 email functions:

| Function | Sent to | When |
|----------|---------|------|
| `sendQuoteConfirmation()` | The person who submitted the quote form | Immediately after submission |
| `sendCareerConfirmation()` | The person who submitted the career form | Immediately after submission |
| `sendAdminQuoteNotification()` | The admin (`ADMIN_EMAIL`) | When a new quote comes in |
| `sendAdminCareerNotification()` | The admin (`ADMIN_EMAIL`) | When a new application comes in |

### 7.4 Fire-and-Forget Pattern

In the API routes, emails are sent using `Promise.allSettled()`:

```typescript
Promise.allSettled([
  sendQuoteConfirmation({ name, email, projectType }),
  sendAdminQuoteNotification({ name, email, phone, projectType, budget, message }),
]);
```

This means:
- Emails are sent **after** the database is saved
- The API response is returned immediately — it doesn't wait for the emails to send
- If an email fails, the form submission is still saved successfully
- The `allSettled` (vs `all`) ensures one failure doesn't cancel the other email

### 7.5 How to Set Up Resend

1. Sign up at https://resend.com
2. Verify your domain (so emails come from your domain, not `@resend.dev`)
3. Create an API key
4. Add to `.env`:
```
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@newcanadiandrywall.com"
ADMIN_EMAIL="info@newcanadiandrywall.com"
```

### 7.6 Email Templates

All emails use inline HTML/CSS (no external stylesheets) so they render correctly in all email clients (Gmail, Outlook, etc.). The HTML is built inside template functions (e.g., `quoteConfirmationHtml()`) that return string templates.

---

## 8. Media Storage — Vercel Blob & Local Fallback

### 8.1 Overview

The upload system supports two storage backends:

| Environment | Storage | How files are stored |
|------------|---------|---------------------|
| **Local development** | Filesystem | Saved to `public/uploads/` folder |
| **Production (Vercel)** | Vercel Blob | Stored in Vercel's cloud storage |

The system **automatically detects** which one to use based on environment variables. You don't need to change any code to switch between them.

### 8.2 How it Detects the Environment

In `lib/media.ts`:

```typescript
export function isBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}
```

- If `BLOB_READ_WRITE_TOKEN` is set → uses Vercel Blob (production)
- If not set → saves to local filesystem (development)

### 8.3 Local Filesystem Storage (Development)

**How it works:**
1. The file's bytes are read as a Buffer
2. A unique filename is generated: `{timestamp}-{random6chars}.{extension}` (e.g., `1712345678-abc123.jpg`)
3. The file is saved to `public/uploads/images/` or `public/uploads/videos/`
4. The URL returned is the relative path: `/uploads/images/1712345678-abc123.jpg`

**Why `public/`?**
Next.js automatically serves files from the `public/` directory at the root URL. So a file at `public/uploads/image.jpg` is accessible at `http://localhost:3000/uploads/image.jpg`.

**Where to find uploaded files:**
Open the `public/uploads/` folder in your file explorer. If no files exist yet, it means no uploads have been made.

### 8.4 Vercel Blob Storage (Production)

**What is Vercel Blob?**
Vercel Blob is a cloud storage service integrated with Vercel. It stores files and makes them accessible via URLs. It's similar to AWS S3 but much simpler.

**How to set it up:**
1. Go to your Vercel project dashboard
2. Navigate to Storage → Blob → Create Store
3. Copy the `BLOB_READ_WRITE_TOKEN`
4. Add it to your Vercel project's environment variables OR your local `.env` for testing

**How it works (under the hood):**
1. The `@vercel/blob` package provides a `put()` function
2. You call `put('folder/filename', buffer, { access: 'public' })`
3. Vercel stores the file and returns a URL like `https://public.blob.vercel-storage.com/uploads/images/filename.jpg`
4. The URL is publicly accessible (no authentication needed to view)

**Viewing files in Vercel Blob:**
- Go to your Vercel dashboard
- Navigate to Storage → Blob
- You'll see all uploaded files listed
- You can upload, download, or delete files from the dashboard

**Important URLs:**
- Blob files are served from: `https://public.blob.vercel-storage.com/`
- No CORS configuration needed — it works out of the box with Next.js

**Pricing (as of 2026):**
- Free tier: 500 MB storage, 1 GB bandwidth per month
- Paid: beyond free tier limits

### 8.5 The Upload Flow (End to End)

```
User selects a file in browser
        │
        ▼
Frontend creates FormData with the file
        │
        ▼
Frontend calls POST /api/upload with FormData
        │
        ▼
API route receives the request
        │
        ├── Is file provided?       No  → 400 "No file provided"
        │
        ├── Is file type allowed?   No  → 400 "Unsupported file type"
        │
        ├── Is file < 50 MB?        No  → 400 "File exceeds maximum size"
        │
        ▼
API route calls uploadFile(file, folder)  in lib/media.ts
        │
        ├── Is BLOB_READ_WRITE_TOKEN set?
        │       │
        │       YES ──► put() to Vercel Blob ──► Returns cloud URL
        │       │
        │       NO  ──► Save to public/uploads/ ──► Returns local URL
        │
        ▼
API route returns { url, filename } with status 201
        │
        ▼
Frontend receives the URL and uses it (e.g., saves it with a project)
```

### 8.6 Deleting Files (`lib/media.ts`)

```typescript
export async function deleteFile(url: string): Promise<void> {
  if (!url) return;

  if (url.startsWith('http')) {
    // It's a cloud URL — delete from Vercel Blob
    if (isBlobConfigured()) {
      await del(url);
    }
    return;
  }

  // It's a local path — delete from filesystem
  const filePath = path.join(process.cwd(), 'public', url);
  await unlink(filePath);
}
```

### 8.7 File Naming Convention

Files are renamed on upload to prevent conflicts:

```
Format: {timestamp}-{random6chars}.{extension}
Example: 1712345678-abc123.jpg
```

This ensures:
- No two files have the same name
- Original filenames (which may contain spaces or special characters) are replaced
- Files can be sorted by upload time

### 8.8 Configuring Next.js Image Component

In `next.config.ts`, we tell Next.js which external domains are allowed for image optimization:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'public.blob.vercel-storage.com',
    },
  ],
},
```

This allows the Next.js `<Image>` component to:
- Optimize images stored on Vercel Blob (resize, convert to WebP, lazy load)
- Serve them from Next.js's built-in image optimization API

Without this, Next.js would refuse to optimize external images for security reasons.

### 8.9 Supported File Types

| Type | MIME Types | Extension |
|------|-----------|-----------|
| Images | `image/jpeg`, `image/png`, `image/webp`, `image/avif` | .jpg, .jpeg, .png, .webp, .avif |
| Videos | `video/mp4`, `video/quicktime`, `video/x-msvideo`, `video/webm` | .mp4, .mov, .avi, .webm |

---

## 9. Environment Variables

The `.env` file stores configuration secrets (never commit this file to Git, which is handled by `.gitignore`).

### Complete `.env` reference

```env
# ─── Database ─────────────────────────────────────────
DATABASE_URL="file:./dev.db"
# SQLite for local dev. For production, use PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:5432/dbname"

# ─── Email (Resend) ──────────────────────────────────
# RESEND_API_KEY="re_..."
# FROM_EMAIL="noreply@newcanadiandrywall.com"
# ADMIN_EMAIL="info@newcanadiandrywall.com"

# ─── Media Storage (Vercel Blob) ─────────────────────
# BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
# When unset, uploads are saved locally to public/uploads/
```

### When each variable is needed

| Variable | Required for | What happens if missing |
|----------|-------------|------------------------|
| `DATABASE_URL` | Always | Prisma won't connect — app breaks |
| `RESEND_API_KEY` | Sending emails | Emails are silently skipped |
| `FROM_EMAIL` | Sending emails | Falls back to `noreply@newcanadiandrywall.com` |
| `ADMIN_EMAIL` | Sending admin notifications | Falls back to `info@newcanadiandrywall.com` |
| `BLOB_READ_WRITE_TOKEN` | Cloud file storage | Files save to local `public/uploads/` instead |

### Where to get each value

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | Local: `file:./dev.db`. Production: your database provider (e.g., Supabase, Neon, AWS RDS) |
| `RESEND_API_KEY` | https://resend.com → API Keys |
| `BLOB_READ_WRITE_TOKEN` | https://vercel.com → Project → Storage → Blob → Create Store |

---

## 10. Common Commands

### Development

```bash
npm run dev          # Start the dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start the production server
npm run lint         # Run ESLint to check for code issues
```

### Database

```bash
npx prisma studio           # Open database GUI in browser (visual editor)
npx prisma generate         # Regenerate Prisma client (after schema changes)
npx prisma migrate dev      # Create a migration from schema changes
npx prisma migrate reset    # Delete database and re-run all migrations
npm run db:seed             # Fill database with sample data (run after migrate/reset)
npm run db:reset            # Reset DB + seed (shortcut for migrate reset + seed)
```

### Testing APIs

```bash
# Test GET /api/projects
curl http://localhost:3000/api/projects

# Test POST /api/contact/quote
curl -X POST http://localhost:3000/api/contact/quote \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","projectType":"Commercial","message":"Hello"}'

# Test file upload
curl -X POST http://localhost:3000/api/upload \
  -F "file=@path/to/image.jpg"
```

---

## 11. How to Test APIs

### 11.1 Using a Browser (for GET requests)

1. Start the dev server: `npm run dev`
2. Open your browser and visit any API URL:
   - http://localhost:3000/api/projects
   - http://localhost:3000/api/testimonials
   - http://localhost:3000/api/services
   - http://localhost:3000/api/collaborations
3. You'll see the raw JSON data

### 11.2 Using curl (command line)

See the examples in [Section 10](#10-common-commands).

### 11.3 Using Postman

A full Postman testing guide is available in `API_TESTING.md`.

### 11.4 Using the DevTools Network Tab

1. Start the dev server
2. Open the site at http://localhost:3000
3. Open DevTools (F12) → Network tab
4. Refresh the page
5. You'll see requests to `/api/projects`, `/api/testimonials`, etc.
6. Click on any request to see the response data

---

## 12. Complete Flow Walkthroughs

### Flow 1: Homepage Loads

```
1. User visits http://localhost:3000
2. Browser loads the HTML page
3. React components mount:
   └── ProjectCarousel calls   fetch('/api/projects')
   └── Testimonials calls      fetch('/api/testimonials')
   └── Services calls          fetch('/api/services')
   └── Collaborations calls    fetch('/api/collaborations')
4. Each API route:
   └── Connects to SQLite via Prisma
   └── Queries the relevant table
   └── Returns JSON
5. Each component:
   └── Receives the JSON
   └── Stores it in state
   └── Renders the data (images, text, etc.)
6. User sees the fully loaded page with all content
```

### Flow 2: Quote Form Submission

```
1. User fills in the quote form on the Contact section
2. User clicks "Submit"
3. Frontend validates required fields (name, email, project type, message)
4. If valid:
   └── Frontend sends POST request to /api/contact/quote
   └── Body: { name, email, phone, projectType, budget, message }
5. API route:
   └── Parses the JSON body
   └── Validates required fields
   └── If missing → returns 400 with error message
   └── Saves to QuoteSubmission table via Prisma
   └── Kicks off emails (fire-and-forget):
       ├── Confirmation to the user's email
       └── Notification to admin email
   └── Returns 201 { message: "Submitted!", id: 1 }
6. Frontend:
   └── Shows success message to user
   └── Resets the form
7. User receives confirmation email (if Resend is configured)
8. Admin receives notification email (if Resend is configured)
```

### Flow 3: File Upload

```
1. User selects a file in an upload form
2. Frontend creates FormData: formData.append('file', selectedFile)
3. Frontend sends POST /api/upload with the FormData
4. API route:
   └── Extracts file from FormData
   └── Validates file type (must be image or video)
   └── Validates file size (must be under 50 MB)
   └── Calls uploadFile(file, 'uploads/images')
       ├── If BLOB_TOKEN set → put() to Vercel Blob
       └── If not → save to public/uploads/images/
   └── Returns 201 { url: "...", filename: "..." }
5. Frontend receives the URL
6. Frontend can now display the uploaded image or use the URL elsewhere
```

---

## 13. Troubleshooting

### Database

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| `PrismaClientInitializationError` | Database file missing or schema outdated | Run `npm run db:reset` |
| `Model "X" not found` | Prisma client out of sync | Run `npx prisma generate` |
| Changes to schema not reflected | Migration not run | Run `npx prisma migrate dev` |

### API Routes

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| GET returns empty array `[]` | No data in database or all records have `isActive: false` | Run `npm run db:seed` |
| POST returns 400 | Required fields missing in the request | Check the field names in the request body |
| POST returns 500 | Server error — check console | Look at the terminal running `npm run dev` for the error |
| Route returning 404 | URL is wrong | Check the URL matches the file path in `app/api/` |

### Email (Resend)

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| Emails not sending | `RESEND_API_KEY` not set | Add it to `.env` |
| Emails going to spam | Domain not verified in Resend | Verify your domain in Resend dashboard |
| "Email not configured" in logs | Resend API key missing | It's OK for local dev — emails are silently skipped |

### File Upload

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| Upload returns 400 "Unsupported file type" | Wrong file type | Use JPEG, PNG, WebP, AVIF, MP4, MOV, AVI, or WebM |
| Upload returns 400 "exceeds maximum size" | File too large | Max 50 MB. Compress the file and try again |
| Upload returns 500 | Server error | Check the terminal for the error message |
| Upload works locally but not on Vercel | `BLOB_READ_WRITE_TOKEN` not set on Vercel | Add it in Vercel project → Settings → Environment Variables |

### Prisma Studio

If `npx prisma studio` shows no data, run `npm run db:seed` first. Studio is a great way to inspect and manually add/edit data while developing.

---

*This document covers everything implemented up to Phase 6. Last updated: 2026-05-18*
