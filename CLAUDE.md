# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Half Pint Mama is a family lifestyle blog built with **Next.js 16** and **TypeScript**, using markdown files for content management. Deployed on Vercel.

The site covers:
- Cooking & Baking (sourdough, recipes)
- Family Travel
- DIY Projects (crafts, costumes)
- Mama Life (parenting, motherhood)

## Build & Development Commands

```bash
npm run dev      # Local dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # TypeScript/ESLint validation
```

## Architecture

### Content Flow
```
Markdown Files (src/app/posts/*.md)
    ↓
Posts Library (src/lib/posts.ts) - reads & parses frontmatter
    ↓
Page Components (category pages, post pages, homepage)
    ↓
Static Generation (generateStaticParams)
```

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/posts.ts` | Core library for reading/parsing markdown posts |
| `src/app/posts/[slug]/page.tsx` | Dynamic post page with markdown rendering |
| `src/app/posts/page.tsx` | All posts listing |
| `src/components/PostCard.tsx` | Reusable post card component |
| `src/components/Header.tsx` | Site navigation |
| `src/components/Footer.tsx` | Site footer |

### Category Pages

| Route | Category | Description |
|-------|----------|-------------|
| `/cooking` | cooking | Sourdough, recipes, kitchen adventures |
| `/travel` | travel | Family travel guides and tips |
| `/diy` | diy | Crafts, costumes, creative projects |
| `/mama-life` | mama-life | Parenting and motherhood |

### Adding a New Blog Post

Create a markdown file in `src/app/posts/` with this frontmatter:

```markdown
---
title: "Post Title"
date: "2026-01-25"
category: "cooking"
excerpt: "Short description for cards"
image: ""
---

Your content here...
```

Valid categories: `cooking`, `travel`, `diy`, `mama-life`

## Design System

CSS variables in `globals.css`:

```css
--cream: #FAF7F2;        /* Background */
--warm-beige: #E8DDD0;   /* Secondary background */
--sage: #9CAF88;         /* Primary accent */
--deep-sage: #6B7F5F;    /* Dark accent */
--terracotta: #C17B68;   /* Warm accent */
--soft-pink: #E8B4A8;    /* Soft accent */
--charcoal: #3D3D3D;     /* Text */
--light-sage: #D4E0CC;   /* Light accent */
```

### Typography
- Headings: Crimson Text (serif)
- Body: System fonts

### Key Classes
- `.gradient-cta` - Terracotta to soft pink gradient for buttons
- `.bg-cream` - Main background color
- Category hover colors match their theme (terracotta, sage, pink)

## TypeScript Path Alias

`@/*` maps to `./src/*`

## Deployment

- **Hosting**: Vercel
- **Repo**: https://github.com/ebadon16/halfpintmama
- **Domain**: halfpintmama.com (DNS at WordPress.com)

Push to `main` branch triggers automatic deployment.

## Future Features (Not Yet Implemented)

- **Shop page**: Digital products via Gumroad/Payhip (placeholder exists)
- **Newsletter**: Email signup (UI exists, needs backend integration)
- **Comments**: Not implemented
- **Search**: Not implemented

## Workflow Guidelines

1. Keep changes simple and focused
2. Test locally with `npm run dev` before pushing
3. All posts are statically generated at build time
4. Images should be added to `public/` folder and referenced in frontmatter
