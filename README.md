# se_portfolio_site

Marco's recruiter-facing portfolio site built with Next.js.

## Local development

```bash
npm install
npm run dev
```

## Blog workflow

The blog is file-based and approval-first.

- Posts live in `content/blog/posts/*.json`
- Drafts stay private by default
- A post becomes public only when it is approved and its `publishAt` time has passed

Useful commands:

```bash
npm run blog:list
npm run blog:approve -- <slug> [publishAt]
npm run blog:unapprove -- <slug>
```

Full workflow notes:

- `content/blog/WORKFLOW.md`
- `content/blog-post-template.md`

## Deploy

```bash
npm run build
npm run start
```

To make scheduled posts appear on time, configure your host to rebuild/redeploy on a schedule. The repo already handles approval gating and time-based visibility; the host just needs to refresh the site after the publish time passes.
