# Blog workflow

This portfolio blog now uses a simple approval-first workflow.

## How it works

Each post lives in `content/blog/posts/*.json` and has:

- `status`: `draft`, `approved`, or `published`
- `publishAt`: the scheduled publish timestamp in UTC
- `approvedAt`: optional timestamp set when Marco approves the post

## Public visibility rule

A post appears on the public site only when both conditions are true:

1. `status` is `approved` or `published`
2. `publishAt` is in the past

That means Marco can draft posts ahead of time inside the repo without exposing unfinished work.

## Typical flow

### 1. Draft a post

Copy `content/blog-post-template.md` and create a new JSON post in `content/blog/posts/`.

Set:

- `status: "draft"`
- `publishAt` to the intended future publish time
- optional `approvalNotes` for anything still pending

### 2. Review and approve

When Marco is happy with the post, approve it:

```bash
npm run blog:approve -- <slug> 2026-04-15T14:00:00.000Z
```

If the publish time is already correct in the file, the date argument is optional:

```bash
npm run blog:approve -- <slug>
```

### 3. Publish on schedule

The site code already hides approved posts until `publishAt` arrives.

The only remaining step is making sure the deployed site rebuilds or redeploys after the scheduled time.

## Scheduler step to wire up

Because this repo is just a Next.js site, it cannot force your host to rebuild itself at a future moment. One lightweight scheduler is still needed.

Choose one:

- **Vercel cron**: call a deploy hook once or twice a day, or near expected publish windows
- **GitHub Actions schedule**: trigger a workflow that redeploys the site on a schedule
- **Server cron**: run a script that pulls the repo and rebuilds/restarts the app

### Recommended simple option

Use a scheduled GitHub Action or Vercel cron that redeploys the site every hour or every morning. When the rebuild happens, any approved post whose `publishAt` has passed becomes visible automatically.

## Useful commands

```bash
npm run blog:list
npm run blog:approve -- <slug> [publishAt]
npm run blog:unapprove -- <slug>
```

## Why this is good enough

- No CMS overhead
- No admin panel to maintain
- Drafts stay private in the repo
- Approval is explicit
- Scheduled publishing works as soon as the host rebuilds
- Recruiters only see polished, intentional posts
