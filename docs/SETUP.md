# Drywall Project — Setup Guide

## One-time setup

```bash
# 1. Create the Next.js project (run this in your terminal)
npx create-next-app@latest drywall-project --typescript --eslint --app --no-src-dir --no-tailwind

# 2. Move into the project
cd drywall-project

# 3. Copy all the files from this folder into the newly created project,
#    replacing any files that already exist (layout.tsx, page.tsx, globals.css etc.)

# 4. Install dependencies
npm install

# 5. Start the dev server
npm run dev
```

## File structure after setup

```
drywall-project/
├── app/
│   ├── globals.css          ← global reset + background
│   ├── layout.tsx           ← Poppins font + SEO metadata
│   └── page.tsx             ← homepage with carousel + your project data
├── components/
│   └── ProjectCarousel/
│       ├── index.ts
│       ├── ProjectCarousel.tsx
│       ├── ProjectCarousel.module.css
│       └── ProjectCarousel.types.ts
├── public/
│   └── images/
│       ├── project-1.jpg    ← add your real project photos here
│       ├── project-2.jpg
│       └── ...
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Adding your real project images

1. Put your landscape photos (recommended: 1280×720px or 1920×1080px) into `public/images/`
2. Update the `PROJECTS` array in `app/page.tsx`:

```tsx
{
  id: 1,
  image: '/images/your-photo.jpg',   // matches filename in public/images/
  category: 'Commercial',
  title: 'Your Project Name',
  description: 'Describe the project work done...',
  stats: [
    { label: 'Area',     value: '5,000 sq ft' },
    { label: 'Duration', value: '8 weeks'     },
    { label: 'Type',     value: 'Commercial'  },
  ],
}
```

## SEO

The `metadata` object in `app/layout.tsx` controls your page title and 
description — update these to reflect your actual business name and services.

```tsx
export const metadata: Metadata = {
  title: 'Your Business Name — Drywall Services',
  description: 'Your SEO description here...',
};
```
