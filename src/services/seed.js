import { nanoid } from 'nanoid'

// Project IDs
const P1 = 'proj-meridian'
const P2 = 'proj-marketing'
const P3 = 'proj-q2launch'

// Milestone IDs
const M1 = 'ms-alpha'
const M2 = 'ms-beta'
const M3 = 'ms-public'
const M4 = 'ms-content-audit'
const M5 = 'ms-new-design'
const M6 = 'ms-gtm'
const M7 = 'ms-launch-day'

export const SEED_PROJECTS = [
  {
    id: P1,
    name: 'Meridian App',
    description: 'Building the PM tool itself — eating our own dog food.',
    color: '#2a8a56',
    created_at: '2026-03-01T09:00:00.000Z',
  },
  {
    id: P2,
    name: 'Marketing Site Redesign',
    description: 'Full overhaul of the marketing website ahead of public launch.',
    color: '#5899d4',
    created_at: '2026-03-15T09:00:00.000Z',
  },
  {
    id: P3,
    name: 'Q2 Product Launch',
    description: 'Coordinating go-to-market for the Q2 release across all teams.',
    color: '#d4941a',
    created_at: '2026-04-01T09:00:00.000Z',
  },
]

export const SEED_MILESTONES = [
  // Meridian App
  { id: M1, project_id: P1, title: 'Alpha Release',  description: 'Core feature set usable internally.', status: 'active',    target_date: '2026-05-15', created_at: '2026-03-01T09:00:00.000Z' },
  { id: M2, project_id: P1, title: 'Beta Launch',    description: 'Invite external testers & gather feedback.', status: 'upcoming',  target_date: '2026-06-30', created_at: '2026-03-01T09:00:00.000Z' },
  { id: M3, project_id: P1, title: 'Public Launch',  description: 'Ship v1.0 to the world.', status: 'upcoming',  target_date: '2026-08-01', created_at: '2026-03-01T09:00:00.000Z' },
  // Marketing Site
  { id: M4, project_id: P2, title: 'Content Audit',  description: 'Audit & archive all outdated copy.', status: 'completed', target_date: '2026-04-10', created_at: '2026-03-15T09:00:00.000Z' },
  { id: M5, project_id: P2, title: 'New Design Live', description: 'Ship the redesigned site to production.', status: 'active',    target_date: '2026-05-20', created_at: '2026-03-15T09:00:00.000Z' },
  // Q2 Launch
  { id: M6, project_id: P3, title: 'GTM Strategy',   description: 'Lock in go-to-market messaging and channels.', status: 'active',    target_date: '2026-05-01', created_at: '2026-04-01T09:00:00.000Z' },
  { id: M7, project_id: P3, title: 'Launch Day',     description: 'Coordinated launch across all channels.', status: 'upcoming',  target_date: '2026-06-15', created_at: '2026-04-01T09:00:00.000Z' },
]

export const SEED_TASKS = [
  // ── Meridian App / Alpha ──────────────────────────────────────────────────
  { id: nanoid(), project_id: P1, milestone_id: M1, title: 'Set up project scaffold & Vite config',       status: 'done',        priority: 'high',   due_date: '2026-03-10', assignee: 'Jake',  tags: ['setup', 'devops'],  created_at: '2026-03-02T09:00:00.000Z', updated_at: '2026-03-10T15:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M1, title: 'Build AppContext with reducer & localStorage', status: 'done',        priority: 'high',   due_date: '2026-03-14', assignee: 'Jake',  tags: ['state'],            created_at: '2026-03-10T09:00:00.000Z', updated_at: '2026-03-14T12:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M1, title: 'Design token system & dark theme',            status: 'done',        priority: 'medium', due_date: '2026-03-18', assignee: 'Mia',   tags: ['design', 'css'],    created_at: '2026-03-14T09:00:00.000Z', updated_at: '2026-03-18T14:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M1, title: 'Sidebar — projects & milestone nav',          status: 'done',        priority: 'medium', due_date: '2026-03-25', assignee: 'Jake',  tags: ['ui'],               created_at: '2026-03-18T09:00:00.000Z', updated_at: '2026-03-25T16:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M1, title: 'Task & milestone modals',                     status: 'done',        priority: 'medium', due_date: '2026-04-05', assignee: 'Mia',   tags: ['ui', 'modals'],     created_at: '2026-03-25T09:00:00.000Z', updated_at: '2026-04-05T11:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M1, title: 'Board view with floating cards',              status: 'in-progress', priority: 'high',   due_date: '2026-04-30', assignee: 'Jake',  tags: ['ui', 'board'],      created_at: '2026-04-10T09:00:00.000Z', updated_at: '2026-04-26T09:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M1, title: 'Milestone completion % from task progress',   status: 'in-progress', priority: 'medium', due_date: '2026-04-28', assignee: 'Mia',   tags: ['feature'],          created_at: '2026-04-15T09:00:00.000Z', updated_at: '2026-04-20T09:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M1, title: 'Fix date input rendering on Safari',          status: 'blocked',     priority: 'high',   due_date: '2026-04-20', assignee: 'Jake',  tags: ['bug', 'safari'],    created_at: '2026-04-12T09:00:00.000Z', updated_at: '2026-04-18T09:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M1, title: 'Write AppContext unit tests',                 status: 'todo',        priority: 'low',    due_date: '2026-05-10', assignee: '',      tags: ['testing'],          created_at: '2026-04-20T09:00:00.000Z', updated_at: '2026-04-20T09:00:00.000Z' },

  // ── Meridian App / Beta ───────────────────────────────────────────────────
  { id: nanoid(), project_id: P1, milestone_id: M2, title: 'List view',                                   status: 'backlog',     priority: 'medium', due_date: '2026-06-01', assignee: 'Jake',  tags: ['ui'],               created_at: '2026-04-01T09:00:00.000Z', updated_at: '2026-04-01T09:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M2, title: 'Timeline / Gantt view',                       status: 'backlog',     priority: 'medium', due_date: '2026-06-15', assignee: '',      tags: ['ui', 'timeline'],   created_at: '2026-04-01T09:00:00.000Z', updated_at: '2026-04-01T09:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M2, title: 'Drag-and-drop cards between board columns',   status: 'backlog',     priority: 'medium', due_date: '2026-06-20', assignee: '',      tags: ['feature', 'dnd'],   created_at: '2026-04-01T09:00:00.000Z', updated_at: '2026-04-01T09:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M2, title: 'User onboarding & empty states',              status: 'todo',        priority: 'low',    due_date: '2026-06-25', assignee: 'Mia',   tags: ['ux'],               created_at: '2026-04-05T09:00:00.000Z', updated_at: '2026-04-05T09:00:00.000Z' },
  { id: nanoid(), project_id: P1, milestone_id: M2, title: 'Keyboard shortcuts across the app',           status: 'todo',        priority: 'low',    due_date: '',           assignee: '',      tags: ['a11y', 'ux'],       created_at: '2026-04-05T09:00:00.000Z', updated_at: '2026-04-05T09:00:00.000Z' },

  // ── Marketing Site / Content Audit ────────────────────────────────────────
  { id: nanoid(), project_id: P2, milestone_id: M4, title: 'Inventory all existing pages & assets',       status: 'done',        priority: 'medium', due_date: '2026-03-20', assignee: 'Priya', tags: ['content'],          created_at: '2026-03-16T09:00:00.000Z', updated_at: '2026-03-20T12:00:00.000Z' },
  { id: nanoid(), project_id: P2, milestone_id: M4, title: 'Flag outdated or off-brand copy',             status: 'done',        priority: 'medium', due_date: '2026-04-01', assignee: 'Priya', tags: ['content', 'copy'],  created_at: '2026-03-20T09:00:00.000Z', updated_at: '2026-04-01T09:00:00.000Z' },
  { id: nanoid(), project_id: P2, milestone_id: M4, title: 'Archive deprecated landing pages',            status: 'done',        priority: 'low',    due_date: '2026-04-10', assignee: 'Tom',   tags: ['devops'],           created_at: '2026-04-01T09:00:00.000Z', updated_at: '2026-04-10T15:00:00.000Z' },

  // ── Marketing Site / New Design ───────────────────────────────────────────
  { id: nanoid(), project_id: P2, milestone_id: M5, title: 'Homepage hero redesign',                      status: 'in-progress', priority: 'high',   due_date: '2026-04-30', assignee: 'Mia',   tags: ['design'],           created_at: '2026-04-10T09:00:00.000Z', updated_at: '2026-04-22T10:00:00.000Z' },
  { id: nanoid(), project_id: P2, milestone_id: M5, title: 'Update global brand colours & typography',    status: 'review',      priority: 'medium', due_date: '2026-04-27', assignee: 'Mia',   tags: ['design', 'css'],    created_at: '2026-04-10T09:00:00.000Z', updated_at: '2026-04-24T14:00:00.000Z' },
  { id: nanoid(), project_id: P2, milestone_id: M5, title: 'Mobile responsiveness audit',                 status: 'todo',        priority: 'medium', due_date: '2026-05-05', assignee: 'Tom',   tags: ['mobile', 'qa'],     created_at: '2026-04-15T09:00:00.000Z', updated_at: '2026-04-15T09:00:00.000Z' },
  { id: nanoid(), project_id: P2, milestone_id: M5, title: 'SEO meta tags & sitemap update',              status: 'todo',        priority: 'low',    due_date: '2026-05-12', assignee: 'Priya', tags: ['seo'],              created_at: '2026-04-15T09:00:00.000Z', updated_at: '2026-04-15T09:00:00.000Z' },
  { id: nanoid(), project_id: P2, milestone_id: M5, title: 'Cross-browser QA pass',                       status: 'backlog',     priority: 'medium', due_date: '2026-05-18', assignee: '',      tags: ['qa'],               created_at: '2026-04-20T09:00:00.000Z', updated_at: '2026-04-20T09:00:00.000Z' },

  // ── Q2 Launch / GTM ───────────────────────────────────────────────────────
  { id: nanoid(), project_id: P3, milestone_id: M6, title: 'Define ICP and positioning statement',        status: 'done',        priority: 'high',   due_date: '2026-04-15', assignee: 'Priya', tags: ['strategy'],         created_at: '2026-04-02T09:00:00.000Z', updated_at: '2026-04-15T17:00:00.000Z' },
  { id: nanoid(), project_id: P3, milestone_id: M6, title: 'Draft messaging framework',                   status: 'in-progress', priority: 'high',   due_date: '2026-04-28', assignee: 'Priya', tags: ['copy', 'strategy'], created_at: '2026-04-15T09:00:00.000Z', updated_at: '2026-04-23T09:00:00.000Z' },
  { id: nanoid(), project_id: P3, milestone_id: M6, title: 'Identify launch channels (paid, organic, PR)', status: 'review',     priority: 'medium', due_date: '2026-04-26', assignee: 'Tom',   tags: ['marketing'],        created_at: '2026-04-15T09:00:00.000Z', updated_at: '2026-04-25T09:00:00.000Z' },
  { id: nanoid(), project_id: P3, milestone_id: M6, title: 'Align with sales on launch enablement',       status: 'todo',        priority: 'medium', due_date: '2026-04-30', assignee: 'Jake',  tags: ['sales'],            created_at: '2026-04-18T09:00:00.000Z', updated_at: '2026-04-18T09:00:00.000Z' },

  // ── Q2 Launch / Launch Day ────────────────────────────────────────────────
  { id: nanoid(), project_id: P3, milestone_id: M7, title: 'Draft and schedule press release',            status: 'todo',        priority: 'high',   due_date: '2026-06-01', assignee: 'Priya', tags: ['pr', 'copy'],       created_at: '2026-04-20T09:00:00.000Z', updated_at: '2026-04-20T09:00:00.000Z' },
  { id: nanoid(), project_id: P3, milestone_id: M7, title: 'Set up analytics & conversion tracking',      status: 'in-progress', priority: 'high',   due_date: '2026-05-15', assignee: 'Tom',   tags: ['analytics'],        created_at: '2026-04-20T09:00:00.000Z', updated_at: '2026-04-24T09:00:00.000Z' },
  { id: nanoid(), project_id: P3, milestone_id: M7, title: 'Prepare social launch assets',                status: 'todo',        priority: 'medium', due_date: '2026-06-05', assignee: 'Mia',   tags: ['social', 'design'], created_at: '2026-04-22T09:00:00.000Z', updated_at: '2026-04-22T09:00:00.000Z' },
  { id: nanoid(), project_id: P3, milestone_id: M7, title: 'Create internal launch checklist',            status: 'done',        priority: 'low',    due_date: '2026-04-25', assignee: 'Jake',  tags: ['ops'],              created_at: '2026-04-18T09:00:00.000Z', updated_at: '2026-04-25T11:00:00.000Z' },
  { id: nanoid(), project_id: P3, milestone_id: M7, title: 'War-room comms plan for launch week',         status: 'backlog',     priority: 'medium', due_date: '2026-06-10', assignee: '',      tags: ['ops', 'comms'],     created_at: '2026-04-22T09:00:00.000Z', updated_at: '2026-04-22T09:00:00.000Z' },
]
