# Issues Log

A running record of bugs encountered during development and their solutions.

---

### 1. Data-fetching components invisible on page load

**Date:** 2026-05-18  
**Components affected:** `Services`, `Testimonials`, `Collaborations`  
**Root cause:**  
All three components returned `null` when data was empty (`if (data.length === 0) return null`). On initial render, data is always `[]`, so the `<section>` DOM element was never created. Their IntersectionObserver `useEffect` had `[]` deps — it ran once on mount when the ref was `null`, so observers were never set up. When API data arrived and a re-render happened, the observer effect never re-ran, CSS `opacity: 0` was never toggled to `opacity: 1`, and the sections stayed invisible.

**Fix:**  
Instead of returning `null`, always render the `<section>` container so the ref is always valid. Conditionally render the data-dependent content (cards, grids) only after the API responds.

**Files changed:**
- `component/Testimonials/Testimonials.tsx`
- `component/Collaborations/Collaborations.tsx`
- `component/Services/Services.tsx`
