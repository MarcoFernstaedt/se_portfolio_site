# Claude Code Instructions — Marco Fernstaedt Portfolio

This file tells Claude Code how to work with this codebase, especially for blog post management.

## Hermes Agent Blog API

The portfolio exposes a protected HTTP endpoint for the Hermes LLM agent to create blog drafts remotely without git access.

**Endpoint:** `POST https://marcofernstaedt.com/api/blog/draft`

**Route file:** `app/api/blog/draft/route.ts`

**Required env vars (add to Vercel):**
- `BLOG_AUTHOR_KEY` — random secret shared only with Hermes
- `GITHUB_TOKEN` — needs `contents:write` scope on this repo

**How it works:** Hermes POSTs post JSON + key → endpoint validates schema → commits file to GitHub via Contents API → Vercel redeploys → post is hidden (draft) until approved.

**Hermes context document:** `hermes-blog-context.md` — the copy-paste file that gives Hermes the API format, schema, and writing guidelines.

---

## Blog System

Posts live at `content/blog/posts/<slug>.json`. The site auto-discovers all `.json` files in that directory — **no other file needs to be edited** when you add a post.

### Creating a New Post

```bash
npm run blog:create -- "post-slug" "Post Title" "Category"
```

This creates a draft JSON at `content/blog/posts/post-slug.json` with the correct schema. Edit it to fill in the real content, then approve it.

**Valid categories used in existing posts:**
- `AI Product`
- `Tooling + Systems Design`
- `Accessibility + Engineering Judgment`
- `Full Stack`
- `System Design`

### Approving and Publishing

```bash
npm run blog:approve -- post-slug
# Optional: override the publish date
npm run blog:approve -- post-slug 2026-06-03T15:15:00.000Z
```

Approved posts go live at `publishAt` after the next deploy. The site rebuilds automatically via GitHub Actions (Tue/Thu 15:20 UTC + Wed 18:50 UTC) — or you can trigger it manually from the Actions tab.

### Listing All Posts

```bash
npm run blog:list
```

Shows every post with status (draft/approved/published) and visibility (LIVE/HIDDEN).

---

## Blog Post Schema

Every post JSON must have these fields:

```json
{
  "slug": "lowercase-with-hyphens",
  "title": "The post title shown in headings and meta",
  "excerpt": "One sentence for preview cards and OG description. Under 160 chars.",
  "publishAt": "2026-05-14T15:15:00.000Z",
  "readTime": "5 min read",
  "category": "AI Product",
  "featured": false,
  "status": "draft",
  "engineeringSignal": [
    "2–3 bullets about what this post signals to a hiring engineer",
    "Each bullet starts with a verb: Ships, Builds, Thinks, Communicates...",
    "Keep each under 60 characters"
  ],
  "summary": "1–2 sentences shown at the top of the post. More detail than excerpt.",
  "sections": [
    {
      "heading": "Section heading",
      "content": ["Paragraph text.", "Second paragraph if needed."]
    },
    {
      "heading": "Section with bullets",
      "bullets": ["Bullet one", "Bullet two", "Bullet three"]
    }
  ]
}
```

**Rules:**
- `slug` must match the filename exactly (without `.json`)
- `status` starts as `"draft"`, becomes `"approved"` via the CLI, or `"published"` if you set it directly
- `featured: true` limits to 2–3 posts max — use sparingly
- Sections can have `content` (paragraphs), `bullets`, or both
- Don't set `approvedAt` manually — the `blog:approve` script sets it

---

## Content Guidelines

Each post should be tied to a real project or engineering decision. Write like you're explaining a tradeoff to a senior engineer who has 90 seconds.

**Structure that works:**
1. **Problem** — what prompted this? One concrete problem.
2. **What I built** — the system or feature, described in terms of behavior.
3. **Key decisions** — 3–5 bullets on the interesting choices and why.
4. **What this shows** — what does this signal about how you work?

**Engineering signal bullets** should communicate:
- What capability the post demonstrates (AI integration, realtime design, delivery discipline)
- Written as capability statements, not descriptions ("Ships useful AI audio product work", not "Talks about audio")

**Avoid:**
- Vague motivational framing ("I was passionate about...")
- Long intros without substance
- Restating the title in the first line

---

## Project Data

Featured projects live in `lib/data.ts`. Each project has:
- `id`, `name`, `status`, `stack`, `description`, `function`, `challenges[]`, `engineeringSignal`
- `github`, `demo`, `category`, `repoPath`

To add a project to the portfolio, edit `lib/data.ts` and add to the `projects` array. The first `BEST_PROJECT_LIMIT` (4) entries become `featuredProjects`.

---

## Sentinel AI Guide

The Sentinel chatbot at `app/api/hermes/route.ts` handles questions about the portfolio. When you add a new project or significant new content, update:
- `buildSystemPrompt()` — the portfolio context JSON
- `answerFromPortfolio()` — add keyword patterns for common questions about the new content

---

## Do Not

- Edit `lib/blog-data.ts` to add new posts — it auto-discovers all JSON files
- Add blog post imports anywhere — not needed
- Set `status: "published"` directly in the JSON before approval (use the CLI)
- Delete `content/blog/posts/` files that are just drafts — mark them `status: "draft"` instead

---

## Build and Deploy

```bash
npm run build   # verify before pushing
npm run lint    # ESLint check
npm run test    # contract tests
```

Push to `main` triggers a Vercel production deploy automatically.
