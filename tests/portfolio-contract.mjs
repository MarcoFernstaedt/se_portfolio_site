import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const data = read('lib/data.ts')
const route = read('app/api/hermes/route.ts')
const tour = read('components/HermesTour.tsx')
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
  "github: 'https://github.com/MarcoFernstaedt/socketio_chat_app'",
  "repoPath: 'MarcoFernstaedt/socketio_chat_app'",
  "github: 'https://github.com/MarcoFernstaedt/code_live_platform'",
  "repoPath: 'MarcoFernstaedt/code_live_platform'",
  "github: 'https://github.com/MarcoFernstaedt/dominion_edge_holdings'",
  "repoPath: 'MarcoFernstaedt/dominion_edge_holdings'",
  'recruiterSignal:',
]) requireIncludes(data, marker)

for (const marker of [
  'SENTINEL',
  'PORTFOLIO GUIDE',
  'Ask about projects, demos, stack, or fit',
  'Sentinel is scanning the project record',
]) requireIncludes(tour, marker)

for (const forbidden of ['HERMES</span>', 'HERMES — AI GUIDE', 'Ask Hermes anything', 'Hermes is thinking']) {
  if (tour.includes(forbidden)) fail(`Visible old Hermes guide wording remains: ${forbidden}`)
}

for (const marker of [
  'answerFromPortfolio',
  'projectSummary',
  'Marco has 83 public GitHub repos',
  'category filters',
  'github.com/MarcoFernstaedt/image_accessibility_tool',
  'AI Image to Audio',
  'Sentinel, the portfolio guide',
]) requireIncludes(route, marker)

for (const forbidden of ['offline mode', 'Configure HERMES_API_URL', 'Hermes is taking a moment']) {
  if (route.includes(forbidden)) fail(`Recruiter-facing fallback still has backend/config wording: ${forbidden}`)
}

requireIncludes(modal, 'Recruiter Signal:', 'project modal recruiter signal block')
requireIncludes(modal, 'Live Demo', 'project modal live demo link')
requireIncludes(projectsPanel, 'Four recruiter-facing systems selected from 83 public GitHub repositories', 'projects panel recruiter framing')
requireIncludes(founder, '83', 'public GitHub repo count')
requireIncludes(founder, 'Featured Systems', 'featured systems stat')

console.log('portfolio contract passed')
