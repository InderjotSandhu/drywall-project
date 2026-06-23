# Performance Audit Log

**Date:** 2026-06-23  
**Auditor:** opencode  
**Project:** New Canadian Drywall  

---

## 🔴 High Impact

| # | Issue | Location | Status | Fix |
|---|-------|----------|--------|-----|
| 1 | No ISR/caching on API routes | `app/api/*/route.ts` (projects, services, testimonials, stats, collaborations) | ❌ Pending | Add `export const revalidate = 300` or use `next: { revalidate }` in fetch calls |
| 2 | Video preload downloads full file on every visit | `component/Hero/Hero.tsx:43` | ❌ Pending | Change `preload="auto"` → `preload="metadata"` |
| 3 | No DB connection pooling config | `lib/prisma.ts` | ❌ Pending | Add connection pooling limits (already using Neon pooler URL, but Prisma side config missing) |
| 4 | Waterfall requests on homepage load | `app/(site)/page.tsx` → Services, Projects, Testimonials each fetch separately | ❌ Pending | Combine into single `/api/homepage` route or use RSC with `Promise.all` |
| 5 | Large video served from `/public` (no CDN) | `Hero.tsx:38` → `/videos/intro.mp4` | ❌ Pending | Move to Vercel Blob/CDN with caching headers |

---

## 🟡 Medium Impact

| # | Issue | Location | Status | Fix |
|---|-------|----------|--------|-----|
| 6 | Client-side `fetch` in every section component | `Services.tsx`, `Testimonials.tsx`, `ProjectCarousel.tsx`, parts of `Contact.tsx` | ❌ Pending | Move data fetching to server components / RSC |
| 7 | Multiple IntersectionObserver instances | Hero, Services, Testimonials, Contact, ProjectCarousel (each creates own observer) | ❌ Pending | Create shared `useInView` hook |
| 8 | ProjectCarousel loads all images simultaneously | `ProjectCarousel.tsx:391` → `<img>` with no lazy loading | ❌ Pending | Add `loading="lazy"`; consider virtualizing |
| 9 | Admin submissions refetch on every keystroke | `app/admin/(dashboard)/submissions/page.tsx:56` | ❌ Pending | Debounce search input (300ms) |
| 10 | No image optimization (missing `next/image`) | All `<img>` tags site-wide | ❌ Pending | Replace with `<Image />` + `sizes` + `priority` |
| 11 | Large client bundles (ProjectCarousel: 440 lines, Contact: 637 lines) | `ProjectCarousel.tsx`, `Contact.tsx` | ❌ Pending | Code-split modals with `next/dynamic` |
| 12 | Compression not explicitly enabled | `next.config.ts` | ❌ Pending | Add `compress: true` |

---

## 🟢 Low Impact / Code Quality

| # | Issue | Location | Status | Fix |
|---|-------|----------|--------|-----|
| 13 | Inline styles causing re-renders | Admin pages, `ReviewForm.tsx` | ❌ Pending | Convert to CSS modules |
| 14 | Missing error boundaries per section | Site-wide | ❌ Pending | Add React error boundaries |
| 15 | TypeScript `any` usage in API routes | `app/api/services/route.ts:20`, `app/api/projects/route.ts:16`, etc. | ❌ Pending | Add proper type annotations |
| 16 | Missing `robots.txt` / `sitemap.xml` | `app/` root | ❌ Pending | Add SEO files |
| 17 | `useCallback` missing deps | `ProjectCarousel.tsx`, `Contact.tsx` | ❌ Pending | Audit and fix dependency arrays |

---

## ✅ Completed

| # | Change | Commit | Date |
|---|-------|--------|------|
| A | Fix logout redirect to use request URL | `b691391` | 2026-06-23 |
| B | Fix login 401 error spam after logout | `a9b95f5` | 2026-06-23 |
| C | Fix mobile menu positioning (fixed → absolute) | `4dff51d` | 2026-06-23 |
| D | Fix Services panel tap on mobile (touch-action + overflow) | `2bd9501` | 2026-06-23 |
| E | Fix native form POST to /admin/login on logout | `f755443` | 2026-06-23 |
| F | Refactor logout to use fetch instead of form submit | `fa43145` | 2026-06-23 |
| G | Fix unawaited email promises (Resend mails not sending) | — | 2026-06-23 |
| H | Fix admin email fallback from .com to .ca | — | 2026-06-23 |
| I | Fix Services dropdown position on mobile (flat grid, no row grouping) | — | 2026-06-23 |
| J | Add pause-on-hover for Testimonials marquee | — | 2026-06-23 |

---

## Implementation Plan

### Sprint 1 — Quick Wins (< 30 min each)
1. [ ] `compress: true` in `next.config.ts`
2. [ ] `preload="metadata"` on hero video
3. [ ] Add `loading="lazy"` to all `<img>` in ProjectCarousel
4. [ ] Debounce search on admin submissions page

### Sprint 2 — Caching & ISR
1. [ ] Add `revalidate` to public GET APIs
2. [ ] Move hero video to Vercel Blob
3. [ ] Add `next/image` for above-fold images

### Sprint 3 — Architecture
1. [ ] Convert homepage sections to RSC
2. [ ] Add error boundaries
3. [ ] Code-split modals with `next/dynamic`
4. [ ] Add React Query / SWR for admin panel

---

## Measurement Baseline

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| LCP | — | — | < 2.5s |
| TBT | — | — | < 200ms |
| CLS | — | — | < 0.1 |
| Bundle size | — | — | < 200KB JS |

> Run `npx next build` then check `.next/analyze` or use Lighthouse in Chrome DevTools to measure.
