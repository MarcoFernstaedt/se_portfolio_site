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

function fail(message) {
  console.error(message)
  process.exit(1)
}

function requireIncludes(haystack, needle, label = needle) {
  if (!haystack.includes(needle)) fail(`Missing ${label}: ${needle}`)
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
  'Ask about skills, experience, projects, demos, or fit',
  'Sentinel is checking the project record',
]) requireIncludes(guide, marker)

for (const forbidden of ['HERMES</span>', 'HERMES — AI GUIDE', 'Ask Hermes anything', 'Hermes is thinking', 'START GUIDED TOUR', 'guided tour', 'touring', 'Tour']) {
  if (guide.includes(forbidden)) fail(`Visible or component-level old guide wording remains: ${forbidden}`)
}

for (const marker of [
  'answerFromPortfolio',
  'projectSummary',
  'Marco has 83 public GitHub repos',
  'Use filters',
  'github.com/MarcoFernstaedt/image_accessibility_tool',
  'github.com/MarcoFernstaedt/cynthia-tutoring-platform',
  'saguaroblossomslearningservices.com',
  'AI Image to Audio',
  'Saguaro Blossoms Client Website',
  'Sentinel, a project guide',
  'experienceSummary',
  'skillAnswer',
  'experience',
  'frontend',
  'backend',
  'deployment',
  'AI API integration',
  'SEO metadata',
  'client delivery',
  'all repos',
  'only the best four systems',
]) requireIncludes(route, marker)

for (const forbidden of ['offline mode', 'Configure HERMES_API_URL', 'Hermes is taking a moment', 'recruiter', 'Recruiter', 'visitor', 'Visitor', 'tour', 'Tour', 'guided']) {
  for (const [label, text] of [['route', route], ['guide', guide], ['modal', modal], ['projectsPanel', projectsPanel]]) {
    if (text.includes(forbidden)) fail(`${label} still has forbidden wording: ${forbidden}`)
  }
}

requireIncludes(modal, 'Engineering Signal:', 'project modal engineering signal block')
requireIncludes(modal, 'Live Demo', 'project modal live demo link')
requireIncludes(projectsPanel, 'Four best systems selected from 83 public GitHub repositories', 'projects panel best systems framing')
requireIncludes(founder, '83', 'public GitHub repo count')
requireIncludes(founder, 'Featured Systems', 'featured systems stat')

for (const skill of ['Tailwind CSS', 'Resend Email', 'SEO / Structured Data', 'Vercel Deployment', 'JWT Auth', 'Monaco Editor']) {
  requireIncludes(data, `name: '${skill}'`, `skill coverage: ${skill}`)
}

console.log('portfolio contract passed')
