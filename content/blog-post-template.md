# Portfolio blog post template

Use this format for future posts so recruiters and hiring managers can skim quickly.

## File location

Create a new JSON file in `content/blog/posts/<slug>.json`.

## Fields to copy

```json
{
  "slug": "my-new-post",
  "title": "Specific project or lesson title",
  "excerpt": "One-sentence teaser",
  "publishAt": "2026-04-15T14:00:00.000Z",
  "readTime": "4 min read",
  "category": "Accessibility + AI",
  "featured": false,
  "status": "draft",
  "approvalNotes": "Optional review notes before approval.",
  "recruiterSignal": [
    "What this proves about how Marco works",
    "Another recruiter-friendly proof point"
  ],
  "summary": "1-2 sentence overview",
  "sections": [
    {
      "heading": "Problem",
      "content": [
        "What needed to be solved?",
        "Why did it matter?"
      ]
    },
    {
      "heading": "What I built / changed",
      "content": [
        "Stack, architecture, scope"
      ]
    },
    {
      "heading": "Engineering decisions",
      "bullets": [
        "Tradeoff one",
        "Tradeoff two"
      ]
    }
  ]
}
```

## Recommended section outline

1. **Problem**
   - What needed to be solved?
   - Why did it matter?
2. **What I built / changed**
   - Stack, architecture, scope
3. **Engineering decisions**
   - Tradeoffs, constraints, complexity
4. **What was difficult**
   - Bugs, latency, state, deployment, UX, accessibility, etc.
5. **What I learned / what I’d improve next**
   - Shows growth and judgment
6. **Recruiter takeaway**
   - What this says about how you work

## Approval-first rules

- Start every new post as `"status": "draft"`
- Do not make it `approved` until Marco has reviewed it
- Set `publishAt` to the actual target publish time in UTC
- Approved posts stay hidden until `publishAt` arrives

## Writing rules

- Write like an engineer, not an influencer.
- Use specifics: stack, constraints, tradeoffs, outcome.
- Keep posts short enough to skim in 1-3 minutes unless the topic truly earns more.
- Avoid vague claims like “I’m passionate about coding.” Show evidence instead.
- End with a practical takeaway.
