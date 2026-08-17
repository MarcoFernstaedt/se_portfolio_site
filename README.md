# Marco Fernstaedt — Software Engineering Portfolio

[Live site](https://se-portfolio-site.vercel.app) | [CI](https://github.com/MarcoFernstaedt/se_portfolio_site/actions)

An accessible Next.js portfolio presenting software, systems, automation, and technical writing through an interactive but screen-reader-operable interface. The project also contains an approval-gated publishing workflow so drafts cannot become public by accident.

## Engineering highlights

- Responsive Next.js 16 application with typed project data
- Accessible interaction modes, navigation, dialogs, and motion controls
- Interactive systems map with semantic alternatives
- Project case studies and technical writeups
- Server-rendered social metadata, sitemap, and robots configuration
- Approval-first, file-based blog publishing workflow
- Deterministic portfolio contract tests, linting, and production-build verification

## Architecture

```text
app/                         routes, metadata, APIs, and writeup pages
components/                  accessible portfolio interface components
content/blog/posts/          reviewed JSON writeups
tests/portfolio-contract.mjs deterministic release contract
scripts/blog-workflow.mjs    draft, approval, and publishing commands
lib/                         typed data, schemas, GitHub activity, and utilities
```

The portfolio keeps public content in version-controlled files. Draft creation and approval are separate operations, and a post is visible only when it is approved and its publication time has arrived.

## Run locally

Requirements:

- Node.js 20 or newer
- npm

```bash
git clone https://github.com/MarcoFernstaedt/se_portfolio_site.git
cd se_portfolio_site
npm ci
npm run dev
```

## Verification

```bash
npm test
npm run lint
npm run build
```

The production build validates application routes, TypeScript, static writeups, metadata, and server-rendered endpoints. GitHub Actions runs the same gates for pushes and pull requests.

## Publishing workflow

```bash
npm run blog:list
npm run blog:create -- <slug>
npm run blog:approve -- <slug> [publishAt]
npm run blog:unapprove -- <slug>
```

Supporting references:

- `content/blog/WORKFLOW.md`
- `content/blog-post-template.md`

Drafts remain private by default. Scheduled visibility still requires the deployment host to rebuild after the publication time.

## Accessibility and privacy

- Screen-reader and keyboard workflows are part of the application contract.
- Motion-heavy presentation has accessible controls and semantic equivalents.
- Public APIs expose portfolio content and aggregated activity, not private operational state.
- Repository secrets and deployment hooks are supplied through GitHub or Vercel configuration, never committed.
- Automated tests support—but do not replace—manual assistive-technology acceptance.

## Deployment

The public deployment runs on Vercel. A scheduled redeploy workflow may invoke a protected deployment hook; when that secret is not configured, the workflow exits safely without creating a false failure.
