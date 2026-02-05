# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Half Pint Mama is a family lifestyle blog built with **Next.js 16** and **TypeScript**, using **Sanity CMS** for content management. Deployed on Vercel.

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
Sanity CMS (cloud-hosted)
    ↓
Posts Library (src/lib/posts.ts) - async GROQ queries via @sanity/client
    ↓
Page Components (category pages, post pages, homepage)
    ↓
Static Generation (generateStaticParams)
```

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/posts.ts` | Core library — async GROQ queries to Sanity |
| `src/lib/sanitize.ts` | Shared `escapeHtml()` utility for XSS prevention |
| `src/lib/rate-limit.ts` | In-memory rate limiter for API routes |
| `src/sanity/client.ts` | Sanity client + image URL builder |
| `src/sanity/schemas/post.ts` | Post document schema for Sanity Studio |
| `sanity.config.ts` | Sanity Studio configuration |
| `src/app/studio/[[...tool]]/page.tsx` | Embedded Sanity Studio at /studio |
| `src/app/(site)/posts/[slug]/page.tsx` | Dynamic post page with Portable Text rendering |
| `src/components/PortableTextRenderer.tsx` | Maps Portable Text to styled React elements |
| `src/components/PostCard.tsx` | Reusable post card component |
| `src/components/Header.tsx` | Site navigation |
| `src/components/Footer.tsx` | Site footer |
| `src/components/EmailSignup.tsx` | Reusable email signup form (connects to MailerLite) |
| `src/components/EmailPopup.tsx` | Timed email popup with focus trap + a11y |
| `src/components/Comments.tsx` | Comment/review system with Sanity storage |
| `src/components/RecipeSchema.tsx` | JSON-LD structured data for recipes + blog posts |
| `src/components/SearchBar.tsx` | Search input component |

### API Routes

| Route | Purpose | Rate Limit |
|-------|---------|------------|
| `api/contact` | Contact form → Resend email | 5/min |
| `api/comments` | Comment notifications → Resend email | 10/min |
| `api/subscribe` | Newsletter signup → MailerLite | 5/min |
| `api/search` | Server-side post search | — |

### Category Pages

| Route | Category | Description |
|-------|----------|-------------|
| `/cooking` | cooking | Sourdough, recipes, kitchen adventures |
| `/travel` | travel | Family travel guides and tips |
| `/diy` | diy | Crafts, costumes, creative projects |
| `/mama-life` | mama-life | Parenting and motherhood |

### Adding a New Blog Post

Create a new Post document in Sanity Studio at `/studio`:
- **Title** (required)
- **Slug** (auto-generated from title)
- **Date** (required)
- **Category**: `cooking`, `travel`, `diy`, `mama-life`
- **Excerpt**: Short description for cards
- **Image**: Upload or use External Image URL
- **Tags**: Array of strings
- **Recipe**: Optional recipe fields (servings, ingredients, instructions, nutrition)
- **Body**: Portable Text rich editor with inline images

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
- **Domain**: halfpintmama.com

Push to `master` branch triggers automatic deployment.

## Implemented Features

- **Newsletter**: EmailSignup, HomeEmailSignup, PostEmailSignup, EmailPopup → MailerLite API
- **Comments/Reviews**: Star ratings + replies with email notifications via Resend
- **Search**: Full-text search with category/date filters via `/api/search`
- **Contact Form**: Email via Resend with rate limiting + validation
- **Favorites**: Client-side localStorage with FavoriteButton component
- **RSS Feed**: Auto-generated at `/feed.xml`
- **SEO**: Canonical URLs, OG tags, JSON-LD (Recipe, BlogPost, BreadcrumbList) on all pages

## Future Features (Not Yet Implemented)

- **Shop page**: Digital products via Gumroad/Payhip (placeholder exists)

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update 'tasks/lessons.md' with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests -> then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management
1. **Plan First**: Write plan to 'tasks/todo.md' with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review to 'tasks/todo.md'
6. **Capture Lessons**: Update 'tasks/lessons.md' after corrections

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
