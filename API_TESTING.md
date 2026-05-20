# API Testing Guide

Postman collection for testing the New Canadian Drywall backend.

**Base URL:** `http://localhost:3000`

---

## Prerequisites

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Confirm the server is running (you should see `▲ Next.js ... Local: http://localhost:3000` in the terminal).
3. Open Postman.

---

## Endpoints

### 1. Get All Projects

Fetches all active projects with their images, videos, and stats.

| Field     | Value                                |
|-----------|--------------------------------------|
| Method    | `GET`                                |
| URL       | `http://localhost:3000/api/projects` |
| Headers   | *(none required)*                    |
| Body      | *(none required)*                    |

**Expected response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Photos Ancaster",
    "category": "Residential",
    "description": "Full residential drywall installation...",
    "location": "Ancaster, ON",
    "image": "/images/Photos Ancaster/IMG_8378.jpeg",
    "imageAlt": "Ancaster residential drywall installation",
    "images": ["/images/Photos Ancaster/IMG_8379.jpeg", ...],
    "videos": ["/videos/Photos Ancaster/IMG_8376.mov", ...],
    "stats": [
      { "label": "Type", "value": "Residential" },
      { "label": "Finish", "value": "Level 5" },
      { "label": "Location", "value": "Ancaster, ON" }
    ]
  }
]
```

---

### 2. Get Single Project

Fetches one project by its ID.

| Field     | Value                                   |
|-----------|-----------------------------------------|
| Method    | `GET`                                   |
| URL       | `http://localhost:3000/api/projects/1`  |
| Params    | Replace `1` with any valid project ID   |
| Headers   | *(none required)*                       |
| Body      | *(none required)*                       |

**Valid project IDs:** `1`, `2`, `3`, `4`, `5`, `6`

**Expected response:** `200 OK` — single project object (same shape as above).

**Test an invalid ID:** `http://localhost:3000/api/projects/999`
- Expected: `404 Not Found`

---

### 3. Get All Testimonials

Fetches all active client testimonials.

| Field     | Value                                    |
|-----------|------------------------------------------|
| Method    | `GET`                                    |
| URL       | `http://localhost:3000/api/testimonials` |
| Headers   | *(none required)*                        |
| Body      | *(none required)*                        |

**Expected response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Michael Torres",
    "quote": "New Canadian Drywall completely transformed our office space...",
    "order": 1,
    "isActive": true,
    "createdAt": "2026-05-17T21:12:18.740Z"
  }
]
```

---

### 4. Get All Services

Fetches all active services with their tags and features.

| Field     | Value                                 |
|-----------|---------------------------------------|
| Method    | `GET`                                 |
| URL       | `http://localhost:3000/api/services`  |
| Headers   | *(none required)*                     |
| Body      | *(none required)*                     |

**Expected response:** `200 OK`
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

**Available service IDs:** `installation`, `framing`, `acoustic`, `fire`, `finishing`, `taping`

---

### 5. Get All Collaborations

Fetches all active partners.

| Field     | Value                                       |
|-----------|---------------------------------------------|
| Method    | `GET`                                       |
| URL       | `http://localhost:3000/api/collaborations`  |
| Headers   | *(none required)*                           |
| Body      | *(none required)*                           |

**Expected response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "BELFOR",
    "logo": "/collaborations/IMG_8705.jpeg",
    "description": null,
    "order": 1,
    "isActive": true,
    "createdAt": "2026-05-17T21:12:18.770Z"
  }
]
```

---

### 6. Submit Quote Request

Submits a new quote request. Saves to the database and sends a confirmation email (if Resend is configured).

| Field     | Value                                      |
|-----------|--------------------------------------------|
| Method    | `POST`                                     |
| URL       | `http://localhost:3000/api/contact/quote`  |
| Headers   | `Content-Type: application/json`           |
| Body      | Raw JSON *(see examples below)*            |

**Required fields:** `name`, `email`, `projectType`, `message`

**Minimal request:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "projectType": "Residential",
  "message": "Looking to drywall a 3-bedroom basement."
}
```

**Full request (with optional fields):**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "416-555-0123",
  "projectType": "Commercial",
  "budget": "25k-50k",
  "message": "We have a 5,000 sq ft commercial space that needs full drywall installation."
}
```

**Expected response:** `201 Created`
```json
{
  "message": "Quote request submitted successfully",
  "id": 3
}
```

**Test error — missing required fields:**
```json
{
  "email": "john@example.com"
}
```
- Expected: `400 Bad Request`
```json
{
  "error": "Missing required fields"
}
```

---

### 7. Submit Career Application

Submits a new career application. Saves to the database and sends an acknowledgment email (if Resend is configured).

| Field     | Value                                       |
|-----------|---------------------------------------------|
| Method    | `POST`                                      |
| URL       | `http://localhost:3000/api/contact/career`  |
| Headers   | `Content-Type: application/json`            |
| Body      | Raw JSON *(see examples below)*             |

**Required fields:** `name`, `email`, `role`, `message`

**Minimal request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "Taper/Finisher",
  "message": "Experienced taper looking to join a quality-driven team."
}
```

**Full request (with optional fields):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "905-555-0456",
  "role": "Drywall Installer",
  "experience": "5 years in residential and commercial",
  "availability": "Full-time",
  "message": "I have extensive experience in steel-stud framing and boarding. Looking for long-term opportunities."
}
```

**Expected response:** `201 Created`
```json
{
  "message": "Application submitted successfully",
  "id": 2
}
```

**Test error — missing required fields:**
```json
{
  "name": "Jane Doe"
}
```
- Expected: `400 Bad Request`
```json
{
  "error": "Missing required fields"
}
```

---

## Quick Test Sequence

Run these in order to verify the entire backend:

| # | Method | URL | Expected |
|---|--------|-----|----------|
| 1 | `GET` | `/api/projects` | `200` — array of 6 projects |
| 2 | `GET` | `/api/projects/1` | `200` — single project |
| 3 | `GET` | `/api/projects/999` | `404` — not found |
| 4 | `GET` | `/api/testimonials` | `200` — array of 10 testimonials |
| 5 | `GET` | `/api/services` | `200` — array of 6 services |
| 6 | `GET` | `/api/collaborations` | `200` — array of 3 partners |
| 7 | `POST` | `/api/contact/quote` | `201` — quote saved |
| 8 | `POST` | `/api/contact/career` | `201` — application saved |

---

## Notes

- The API uses **SQLite** locally — all POST data persists in `prisma/dev.db`.
- Emails are sent via **Resend**. If `RESEND_API_KEY` is not set in `.env`, emails are silently skipped (the API still saves to DB and returns 201).
- All GET endpoints filter for `isActive: true` — inactive records are excluded.
- All responses are JSON. Errors return `{ "error": "..." }` with appropriate status codes.
