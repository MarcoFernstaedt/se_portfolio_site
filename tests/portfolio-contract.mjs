import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const data = read('lib/data.ts')
const route = read('app/api/hermes/route.ts')
const guide = read('components/SentinelGuide.tsx')
const modal = read('components/ProjectModal.tsx')
const projectsPanel = read('components/ProjectsPanel.tsx')
const founder = read('components/FounderSection.tsx')
const page = read('app/page.tsx')

function fail(message) {
  console.error(message)
  process.exit(1)
}

function requireIncludes(haystack, needle, label = needle) {
  if (!haystack.includes(needle)) fail(`Missing ${label}: ${needle}`)
}

function requireNotIncludes(haystack, needle, label = needle) {
  if (haystack.includes(needle)) fail(`Forbidden ${label}: ${needle}`)
}

for (const marker of [
  "github: 'https://github.com/MarcoFernstaedt/image_accessibility_tool'",
  "demo: 'https://ita-orpin.vercel.app'",
  "repoPath: 'MarcoFernstaedt/image_accessibility_tool'",
  "github: 'https://github.com/MarcoFernstaedt/cynthia-tutoring-platform'",
  "demo: 'https://saguaroblossomslearningservices.com'",
  "repoPath: 'MarcoFernstaedt/cynthia-tutoring-platform'",
  "github: 'https://github.com/MarcoFernstaedt/socketio_chat_app'",
  "repoPath: 'MarcoFernstaedt/socketio_chat_app'",
  "github: 'https://github.com/MarcoFernstaedt/code_live_platform'",
  "repoPath: 'MarcoFernstaedt/code_live_platform'",
  'engineeringSignal:',
  'BEST_PROJECT_LIMIT = 4',
  'featuredProjects',
  "id: 'saguaro-blossoms-client-site'",
  "name: 'Saguaro Blossoms Client Website'",
  "'Resend'",
  "'SEO Metadata'",
  "'Vercel'",
  "'Piston API'",
]) requireIncludes(data, marker)

const projectOrder = [
  "id: 'ai-image-audio'",
  "id: 'saguaro-blossoms-client-site'",
  "id: 'realtime-messaging'",
  "id: 'code-interview'",
]
let lastIndex = -1
for (const marker of projectOrder) {
  const index = data.indexOf(marker)
  if (index === -1) fail(`Missing ordered project marker: ${marker}`)
  if (index < lastIndex) fail(`Project order is wrong around: ${marker}`)
  lastIndex = index
}

for (const marker of [
  'SENTINEL',
  'PROJECT GUIDE',
  'Welcome to Marco',
  'I will guide you through the strongest projects',
  'START TOUR',
  'Continue',
  'Ask about skills, experience, projects, demos, or fit',
  'Sentinel is checking the project record',
  "type GuideState = 'idle' | 'intro' | 'touring' | 'chatting'",
  "event: 'tour_start' | 'tour_step' | 'user_message'",
]) requireIncludes(guide, marker)

for (const forbidden of ['HERMES</span>', 'HERMES — AI GUIDE', 'Ask Hermes anything', 'Hermes is thinking', 'SHOW BEST PROJECT']) {
  requireNotIncludes(guide, forbidden, 'old guide wording')
}

for (const marker of [
  'FALLBACK_TOUR',
  'tour_start',
  'tour_step',
  'Welcome to Marco',
  'AI Image to Audio',
  'Saguaro Blossoms Client Website',
  'Real Time Messaging',
  'Code Interview Platform',
  'github.com/MarcoFernstaedt/image_accessibility_tool',
  'github.com/MarcoFernstaedt/cynthia-tutoring-platform',
  'saguaroblossomslearningservices.com',
  'experienceSummary',
  'skillAnswer',
  'OpenAI multimodal vision and TTS APIs',
  'image sharing via Cloudinary',
  'Piston sandbox API',
]) requireIncludes(route, marker)

const tourBlock = route.slice(route.indexOf('const FALLBACK_TOUR'), route.indexOf('function buildSystemPrompt'))
requireNotIncludes(tourBlock, 'openProjectId', 'tour opening project modals')

for (const forbidden of ['offline mode', 'Configure HERMES_API_URL', 'Hermes is taking a moment', 'recruiter', 'Recruiter', 'visitor', 'Visitor']) {
  for (const [label, text] of [['route', route], ['guide', guide], ['modal', modal], ['projectsPanel', projectsPanel], ['founder', founder]]) {
    requireNotIncludes(text, forbidden, `${label} wording`)
  }
}

for (const marker of [
  'sticky top-0 z-20',
  'Close',
  'Close project details',
  'pt-[env(safe-area-inset-top)]',
]) requireIncludes(modal, marker)

requireIncludes(modal, 'Engineering Signal:', 'project modal engineering signal block')
requireIncludes(modal, 'Live Demo', 'project modal live demo link')
requireIncludes(projectsPanel, 'Featured work selected from 83 public GitHub repositories', 'projects panel intro framing')
requireIncludes(founder, '83', 'public GitHub repo count')
requireIncludes(founder, 'Featured Systems', 'featured systems stat')
requireNotIncludes(page, 'AccessibilityPanel', 'accessibility panel should not render')

for (const skill of ['Tailwind CSS', 'Resend Email', 'SEO / Structured Data', 'Vercel Deployment', 'JWT Auth', 'Monaco Editor', 'Piston API']) {
  requireIncludes(data, `name: '${skill}'`, `skill coverage: ${skill}`)
}

const publicCopyFiles = {
  data,
  route,
  guide,
  modal,
  projectsPanel,
  founder,
  page,
}
for (const [label, text] of Object.entries(publicCopyFiles)) {
  for (const forbidden of [
    '──',
    '—',
    '–',
    'Full-Stack',
    'full-stack',
    'server-side',
    'custom-domain',
    'event-driven',
    'real-time',
    'media-sharing',
    'execution-sandbox',
    'developer-tooling',
    'next-best',
    'highest-signal',
    'client-delivery',
    'data-flow',
    'text-to-speech',
    'screen-reader',
    'low-vision',
    'accessibility-focused',
    'Accessible UX',
    'Accessibility / WCAG',
    'ACCESSIBILITY ENGINE',
  ]) {
    requireNotIncludes(text, forbidden, `${label} visible dash or loud accessibility wording`)
  }
}

console.log('portfolio contract passed')
