# Recruiter-facing publishing plan

This is the operating plan for getting Marco's writing in front of recruiters without turning the blog into a second full-time job.

## Recommended cadence

**Default:** 1 post per week for 6-8 weeks.

Why this cadence works:
- enough consistency to make the writing section look alive
- not so frequent that the quality drops or the topics become repetitive
- gives each post room to breathe if Marco also shares it on LinkedIn

If energy is high and drafts are ready, a temporary push of **2 posts per week** is fine for a short burst, but 1 strong post every week is the sustainable baseline.

## Best posting windows

Treat these as starting benchmarks for a US-professional / recruiter audience on LinkedIn and portfolio-driven sharing.

### Primary windows
- **Tuesday at 8:15 AM MST** (`15:15 UTC`)
- **Thursday at 8:15 AM MST** (`15:15 UTC`)

### Secondary test window
- **Wednesday at 11:45 AM MST** (`18:45 UTC`)

Rationale:
- midweek consistently performs best for professional audiences
- morning works well for recruiter scans before the day gets chaotic
- the Wednesday lunch-adjacent slot is worth testing for slightly more reflective posts

## Suggested first sequence

1. `collaborative-code-interview-platform-sandbox-and-sync`
   - **Tuesday, 2026-04-07 8:15 AM MST**
   - best first post because it signals real-time systems thinking and engineering depth fast
2. `real-estate-data-pipeline-for-acquisition-targeting`
   - **Thursday, 2026-04-16 8:15 AM MST**
   - broadens the story beyond frontend and shows business-context thinking
3. `accessibility-first-engineering-is-a-product-decision`
   - **Tuesday, 2026-04-21 8:15 AM MST**
   - reinforces Marco's strongest differentiator: accessibility-informed engineering judgment

## Approval flow

1. Draft the post in `content/blog/posts/`
2. Review title, summary, and recruiter-signal bullets
3. Approve it with:

```bash
npm run blog:approve -- <slug>
```

Or update the schedule while approving:

```bash
npm run blog:approve -- <slug> 2026-04-07T15:15:00.000Z
```

## Publish path

The app already hides drafts and future-approved posts automatically. The only missing operational step is a scheduled rebuild on the host.

### Recommended simple path

**GitHub Actions scheduled deploy hook**

- keep posts as JSON in repo
- approve posts in repo when ready
- GitHub Actions runs on a schedule
- workflow calls the deployment hook
- the new build makes any approved post with a past `publishAt` visible

### Why this is the right level of complexity

- no CMS to maintain
- no manual midnight publishing
- no risk of exposing a half-finished draft
- easy for Marco to reason about under pressure

## Sharing path after publish

For each approved post:
- publish to the site on schedule
- share a short 2-4 sentence LinkedIn post the same morning
- point LinkedIn traffic to the full writeup on the portfolio site

The site is the proof. LinkedIn is the distribution layer.
