import { useMemo } from 'react'
import {
  AlertTriangle, CheckCircle2, ListTodo, Flag,
  Calendar, ChevronRight, Clock, Layers,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import './dashboard.css'

function timeAgo(isoDate) {
  if (!isoDate) return null
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function daysUntil(isoDate) {
  if (!isoDate) return null
  const diff = new Date(isoDate).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)
  const days = Math.round(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 0) return `${Math.abs(days)}d overdue`
  return `In ${days}d`
}

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function todayLabel() {
  return new Date().toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

// ── Stat Card ────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className={`db-stat-card${accent ? ` db-stat-card--${accent}` : ''}`}>
      <div className="db-stat-icon">
        <Icon size={16} />
      </div>
      <div className="db-stat-body">
        <span className="db-stat-value">{value}</span>
        <span className="db-stat-label">{label}</span>
        {sub != null && <span className="db-stat-sub">{sub}</span>}
      </div>
    </div>
  )
}

// ── Task Row (shared by Due Soon + Overdue) ───────────────
function TaskRow({ task, milestones, projects, dispatch }) {
  const milestone = milestones.find((m) => m.id === task.milestone_id)
  const project = projects.find((p) => p.id === task.project_id)
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
  const label = daysUntil(task.due_date)

  const open = () => dispatch({ type: 'OPEN_MODAL', modalType: 'task', mode: 'edit', data: task })

  return (
    <div className="db-task-row" onClick={open}>
      <div className="db-task-row-left">
        {project && (
          <span className="db-task-dot" style={{ background: project.color }} title={project.name} />
        )}
        <span className="db-task-title">{task.title}</span>
        {milestone && (
          <span className="db-task-milestone">
            <Flag size={9} />
            {milestone.title}
          </span>
        )}
      </div>
      <div className="db-task-row-right">
        {task.due_date && (
          <span className={`db-task-due${isOverdue ? ' db-task-due--overdue' : ''}`}>
            <Calendar size={10} />
            {label}
          </span>
        )}
        <ChevronRight size={13} className="db-task-chevron" />
      </div>
    </div>
  )
}

// ── Milestone Health Bar ──────────────────────────────────
function MilestoneHealth({ milestone, tasks, projects, dispatch }) {
  const milestoneTasks = tasks.filter((t) => t.milestone_id === milestone.id)
  const done = milestoneTasks.filter((t) => t.status === 'done').length
  const pct = milestoneTasks.length > 0 ? Math.round((done / milestoneTasks.length) * 100) : 0
  const hasOverdue = milestoneTasks.some(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
  )
  const project = projects.find((p) => p.id === milestone.project_id)
  const effectiveStatus = hasOverdue && milestone.status !== 'completed' ? 'at-risk' : milestone.status

  const STATUS_COLOR = {
    upcoming: 'var(--text-muted)',
    active: 'var(--accent)',
    'at-risk': 'var(--tag-amber-text)',
    completed: 'var(--accent)',
  }
  const barColor = effectiveStatus === 'at-risk' ? 'var(--tag-amber-text)'
    : effectiveStatus === 'completed' ? 'var(--accent)'
    : 'var(--accent)'

  const open = () => dispatch({ type: 'OPEN_MODAL', modalType: 'milestone', mode: 'edit', data: milestone })

  return (
    <div className="db-milestone-row" onClick={open}>
      <div className="db-milestone-header">
        <div className="db-milestone-meta">
          <Flag size={11} style={{ color: STATUS_COLOR[effectiveStatus] }} />
          <span className="db-milestone-title">{milestone.title}</span>
          {hasOverdue && milestone.status !== 'completed' && (
            <AlertTriangle size={10} style={{ color: 'var(--tag-amber-text)' }} />
          )}
        </div>
        <div className="db-milestone-right">
          {project && (
            <span className="db-milestone-project" style={{ color: project.color }}>
              {project.name}
            </span>
          )}
          <span className="db-milestone-pct">{pct}%</span>
        </div>
      </div>
      <div className="db-milestone-bar-track">
        <div
          className="db-milestone-bar-fill"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <div className="db-milestone-foot">
        <span>{done}/{milestoneTasks.length} tasks</span>
        {milestone.target_date && (
          <span><Calendar size={9} /> {formatDate(milestone.target_date)}</span>
        )}
      </div>
    </div>
  )
}

// ── Project Card ─────────────────────────────────────────
function ProjectCard({ project, tasks, milestones, dispatch }) {
  const projectTasks = tasks.filter((t) => t.project_id === project.id)
  const done = projectTasks.filter((t) => t.status === 'done').length
  const overdue = projectTasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
  ).length
  const pct = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0
  const mCount = milestones.filter((m) => m.project_id === project.id).length

  const goToProject = () => dispatch({ type: 'SET_ACTIVE_PROJECT', id: project.id })

  return (
    <div className="db-project-card" onClick={goToProject}>
      <div className="db-project-card-header">
        <span className="db-project-dot" style={{ background: project.color }} />
        <span className="db-project-name">{project.name}</span>
        {overdue > 0 && (
          <span className="db-project-overdue-badge">{overdue} overdue</span>
        )}
      </div>
      <div className="db-project-stats">
        <span><ListTodo size={11} /> {projectTasks.length} tasks</span>
        <span><Flag size={11} /> {mCount} milestones</span>
        <span><CheckCircle2 size={11} /> {pct}%</span>
      </div>
      <div className="db-project-bar-track">
        <div
          className="db-project-bar-fill"
          style={{ width: `${pct}%`, background: project.color }}
        />
      </div>
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────
function Section({ title, icon: Icon, count, children, empty, accent }) {
  return (
    <div className={`db-section${accent ? ` db-section--${accent}` : ''}`}>
      <div className="db-section-header">
        <Icon size={13} />
        <span>{title}</span>
        {count != null && <span className="db-section-count">{count}</span>}
      </div>
      {empty ? (
        <div className="db-section-empty">{empty}</div>
      ) : (
        <div className="db-section-body">{children}</div>
      )}
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────
export default function DashboardView() {
  const { state, dispatch } = useApp()
  const { tasks, milestones, projects } = state

  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 86400000)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - 7)

  const filtered = useMemo(() => {
    return state.activeProjectId
      ? tasks.filter((t) => t.project_id === state.activeProjectId)
      : tasks
  }, [tasks, state.activeProjectId])

  const overdueTasks = useMemo(
    () => filtered.filter((t) => t.due_date && new Date(t.due_date) < now && t.status !== 'done')
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)),
    [filtered]
  )

  const dueSoonTasks = useMemo(
    () => filtered
      .filter((t) => {
        if (t.status === 'done') return false
        const d = t.due_date && new Date(t.due_date)
        return d && d >= now && d <= weekFromNow
      })
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)),
    [filtered]
  )

  const doneThisWeek = useMemo(
    () => filtered.filter((t) => {
      const updated = t.updated_at && new Date(t.updated_at)
      return t.status === 'done' && updated && updated >= startOfWeek
    }).length,
    [filtered]
  )

  const visibleMilestones = useMemo(() => {
    const ms = state.activeProjectId
      ? milestones.filter((m) => m.project_id === state.activeProjectId)
      : milestones
    return ms.filter((m) => m.status !== 'completed')
  }, [milestones, state.activeProjectId])

  const atRiskCount = useMemo(
    () => visibleMilestones.filter((m) => {
      const mt = tasks.filter((t) => t.milestone_id === m.id)
      return mt.some((t) => t.due_date && new Date(t.due_date) < now && t.status !== 'done')
    }).length,
    [visibleMilestones, tasks]
  )

  const visibleProjects = state.activeProjectId
    ? projects.filter((p) => p.id === state.activeProjectId)
    : projects

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <div className="db-header">
        <div>
          <h1 className="db-greeting">{greeting()}</h1>
          <p className="db-date">{todayLabel()}</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="db-stats-row">
        <StatCard
          icon={ListTodo}
          label="Total tasks"
          value={filtered.length}
          sub={`${filtered.filter(t => t.status === 'done').length} done`}
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value={overdueTasks.length}
          sub={overdueTasks.length > 0 ? 'Need attention' : 'All on track'}
          accent={overdueTasks.length > 0 ? 'danger' : null}
        />
        <StatCard
          icon={CheckCircle2}
          label="Done this week"
          value={doneThisWeek}
          sub="tasks completed"
          accent={doneThisWeek > 0 ? 'success' : null}
        />
        <StatCard
          icon={Flag}
          label="At-risk milestones"
          value={atRiskCount}
          sub={atRiskCount > 0 ? 'Has overdue tasks' : 'All healthy'}
          accent={atRiskCount > 0 ? 'warn' : null}
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="db-grid">

        {/* ── Left column ── */}
        <div className="db-col-left">
          <Section
            title="Due Soon"
            icon={Clock}
            count={dueSoonTasks.length}
            empty={dueSoonTasks.length === 0 ? 'Nothing due in the next 7 days' : null}
          >
            {dueSoonTasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                milestones={milestones}
                projects={projects}
                dispatch={dispatch}
              />
            ))}
          </Section>

          <Section
            title="Overdue"
            icon={AlertTriangle}
            count={overdueTasks.length}
            accent={overdueTasks.length > 0 ? 'danger' : null}
            empty={overdueTasks.length === 0 ? 'Nothing overdue — great work!' : null}
          >
            {overdueTasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                milestones={milestones}
                projects={projects}
                dispatch={dispatch}
              />
            ))}
          </Section>
        </div>

        {/* ── Right column ── */}
        <div className="db-col-right">
          <Section
            title="Milestone Health"
            icon={Flag}
            count={visibleMilestones.length}
            empty={visibleMilestones.length === 0 ? 'No active milestones' : null}
          >
            {visibleMilestones.map((m) => (
              <MilestoneHealth
                key={m.id}
                milestone={m}
                tasks={tasks}
                projects={projects}
                dispatch={dispatch}
              />
            ))}
          </Section>

          {visibleProjects.length > 0 && (
            <Section title="Projects" icon={Layers} count={visibleProjects.length}>
              <div className="db-project-grid">
                {visibleProjects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    tasks={tasks}
                    milestones={milestones}
                    dispatch={dispatch}
                  />
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}
