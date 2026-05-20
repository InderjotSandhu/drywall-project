# Deployment Guide — New Canadian Drywall

## Prerequisites

- Supabase PostgreSQL is already configured and migrated (done)
- The codebase is ready for production

---

## Step 1: Secure Local `.env`

Run these commands to generate secrets, then edit `.env`:

```powershell
# Generate a random AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update these values in `.env`:

- `AUTH_SECRET` — paste the output from above
- `ADMIN_PASSWORD` — change to a strong password
- (Optional) `RESEND_API_KEY` — uncomment and set your Resend API key
- (Optional) `FROM_EMAIL`, `ADMIN_EMAIL` — uncomment and set your business emails
- (Optional) `BLOB_READ_WRITE_TOKEN` — uncomment and set your Vercel Blob token

---

## Step 2: Push to GitHub

```powershell
git add .
git commit -m "Phase 8: production database setup"
git push
```

> Verify `.env` is in `.gitignore` — it should NOT be committed.

---

## Step 3: Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. In **Environment Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://postgres.pjoibrwtvlvgoicoifif:DryWall%401230@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | `postgresql://postgres.pjoibrwtvlvgoicoifif:DryWall%401230@aws-1-ap-south-1.pooler.supabase.com:5432/postgres` |
| `AUTH_SECRET` | (the hex string from Step 1) |
| `ADMIN_PASSWORD` | (the password from Step 1) |
| `RESEND_API_KEY` | (optional — your Resend API key) |
| `FROM_EMAIL` | (optional — e.g. `noreply@yourdomain.com`) |
| `ADMIN_EMAIL` | (optional — e.g. `info@yourdomain.com`) |
| `BLOB_READ_WRITE_TOKEN` | (optional — Vercel Blob token) |

4. Build command — leave as default (Vercel auto-detects Next.js)
5. Click **Deploy**

---

## Step 4: Post-Deploy Verification

- [ ] Visit the live URL — home page loads with all sections
- [ ] Visit `/admin/login` — log in with admin password
- [ ] **Test CRUD:** add/edit/delete a project, testimonial, service, partner
- [ ] **Test submissions:** submit a quote request from the public site, check it appears in `/admin/submissions`
- [ ] **Test notifications:** enable notifications in admin, verify polling works
- [ ] **Test email:** if Resend is configured, check that confirmation and admin notification emails are sent
- [ ] **Test media:** upload a file in `/admin/media`, associate it to a project, verify it shows in the project's gallery
- [ ] **Test security:** visit `/admin/projects` without being logged in — should redirect to `/admin/login`
- [ ] **Test rate limiting:** attempt 6 failed logins — should get a 429 "Too many attempts" response

---

## PostgreSQL Connection Details

| Detail | Value |
|---|---|
| Provider | Supabase (PostgreSQL 15) |
| Pooled (runtime) | `DATABASE_URL` on port **6543** with `?pgbouncer=true` |
| Direct (migrations) | `DIRECT_URL` on port **5432** |
| Project ref | `pjoibrwtvlvgoicoifif` |
| Region | `ap-south-1` (Mumbai) |

To run future migrations after deployment:

```powershell
npx prisma migrate deploy
```

> **Important:** Always use `DIRECT_URL` (port 5432) for migrations, not the pooled connection.

---

## Re-seeding Data (if needed)

```powershell
npx prisma db seed
```

This is idempotent — it checks for existing data and only inserts what's missing.

---

## Rolling Back to Local SQLite (Dev)

If you need to develop locally with SQLite:

1. Change `prisma/schema.prisma` back to:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. In `.env`, set `DATABASE_URL="file:./dev.db"` and remove `DIRECT_URL`
3. Delete `prisma/migrations/` folder
4. Run `npx prisma migrate dev --name init`
5. Run `npx prisma db seed`
