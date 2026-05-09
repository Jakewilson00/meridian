import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import './reports.css'

const STATUS_ORDER = ['done', 'in-progress', 'review', 'todo', 'backlog', 'blocked']
const STATUS_LABELS = {
  done: 'Done',
  'in-progress': 'In Progress',
  review: 'Review',
  todo: 'To Do',
  backlog: 'Backlog',
  blocked: 'Blocked',
}
const STATUS_COLORS = {
  done:        'var(--accent)',
  'in-progress': 'var(--tag-amber-text)',
  review:      '#a78bfa',
  todo:        'var(--tag-blue-text)',
  backlog:     'var(--text-muted)',
  blocked:     'var(--priority-high)',
}

const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low']
const PRIORITY_COLORS = {
  critical: '#e54d4d',
  high:     'var(--priority-high)',
  medium:   'var(--priority-medium)',
  low:      'var(--priority-low)',
}

function BarRow({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="rp-bar-row">
      <div className="rp-bar-label">{label}</div>
      <div className="rp-bar-track">
        <div
          className="rp-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="rp-bar-count">
        <span>{count}</span>
        <span className="rp-bar-pct">{Math.round(pct)}%</span>
      </div>
    </div>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="rp-section">
      <div className="rp-section-title">{title}</div>
      <div className="rp-section-body">{children}</div>
    </div>
  )
}

export default function ReportsView() {
  const { state } = useApp()
  const { tasks, milestones, projects } = state

  const filtered = useMemo(() => {
    return state.activeProjectId
      ? tasks.filter((t) => t.project_id === state.activeProjectId)
      : tasks
  }, [tasks, state.activeProjectId])

  const byStatus = useMemo(() => {
    const map = {}
    STATUS_ORDER.forEach((s) => { map[s] = 0 })
    filtered.forEach((t) => { if (map[t.status] !== undefined) map[t.status]++ })
    return map
  }, [filtered])

  const byPriority = useMemo(() => {
    const map = {}
    PRIORITY_ORDER.forEach((p) => { map[p] = 0 })
    filtered.forEach((t) => { if (map[t.priority] !== undefined) map[t.priority]++ })
    return map
  }, [filtered])

  const overdueCount = useMemo(
    () => filtered.filter((t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length,
    [filtered]
  )

  const completionRate = filtered.length > 0
    ? Math.round((byStatus.done / filtered.length) * 100)
    : 0

  const unassigned = filtered.filter((t) => !t.assignee).length

  // Per-project breakdown (when not already filtered)
  const projectBreakdown = useMemo(() => {
    if (state.activeProjectId) return []
    return projects.map((p) => {
      const pt = tasks.filter((t) => t.project_id === p.id)
      const done = pt.filter((t) => t.status === 'done').length
      const overdue = pt.filter((t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length
      const pct = pt.length > 0 ? Math.round((done / pt.length) * 100) : 0
      return { project: p, total: pt.length, done, overdue, pct }
    }).filter((x) => x.total > 0)
  }, [projects, tasks, state.activeProjectId])

  // Milestone completion summary
  const milestoneBreakdown = useMemo(() => {
    const ms = state.activeProjectId
      ? milestones.filter((m) => m.project_id === state.activeProjectId)
      : milestones
    return ms.map((m) => {
      const mt = tasks.filter((t) => t.milestone_id === m.id)
      const done = mt.filter((t) => t.status === 'done').length
      const pct = mt.length > 0 ? Math.round((done / mt.length) * 100) : 0
      return { milestone: m, total: mt.length, done, pct }
    })
  }, [milestones, tasks, state.activeProjectId])

  return (
    <div className="reports">
      {/* ── Summary strip ── */}
      <div className="rp-summary-strip">
        <div className="rp-kpi">
          <span className="rp-kpi-value">{filtered.length}</span>
          <span className="rp-kpi-label">Total Tasks</span>
        </div>
        <div className="rp-kpi-divider" />
        <div className="rp-kpi">
          <span className="rp-kpi-value rp-kpi-value--green">{completionRate}%</span>
          <span className="rp-kpi-label">Completion Rate</span>
        </div>
        <div className="rp-kpi-divider" />
        <div className="rp-kpi">
          <span className={`rp-kpi-value${overdueCount > 0 ? ' rp-kpi-value--red' : ''}`}>{overdueCount}</span>
          <span className="rp-kpi-label">Overdue</span>
        </div>
        <div className="rp-kpi-divider" />
        <div className="rp-kpi">
          <span className="rp-kpi-value">{unassigned}</span>
          <span className="rp-kpi-label">Unassigned</span>
        </div>
        <div className="rp-kpi-divider" />
        <div className="rp-kpi">
          <span className="rp-kpi-value">{milestones.length}</span>
          <span className="rp-kpi-label">Milestones</span>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="rp-grid">
        <SectionCard title="Tasks by Status">
          {STATUS_ORDER.map((s) => (
            <BarRow
              key={s}
              label={STATUS_LABELS[s]}
              count={byStatus[s]}
              total={filtered.length}
              color={STATUS_COLORS[s]}
            />
          ))}
        </SectionCard>

        <SectionCard title="Tasks by Priority">
          {PRIORITY_ORDER.map((p) => (
            <BarRow
              key={p}
              label={p.charAt(0).toUpperCase() + p.slice(1)}
              count={byPriority[p]}
              total={filtered.length}
              color={PRIORITY_COLORS[p]}
            />
          ))}
        </SectionCard>

        {milestoneBreakdown.length > 0 && (
          <SectionCard title="Milestone Completion">
            {milestoneBreakdown.map(({ milestone, total, done, pct }) => (
              <div key={milestone.id} className="rp-milestone-row">
                <div className="rp-milestone-meta">
                  <span className="rp-milestone-name">{milestone.title}</span>
                  <span className="rp-milestone-tally">{done}/{total}</span>
                </div>
                <div className="rp-bar-track">
                  <div
                    className="rp-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100 ? 'var(--accent)' : 'var(--accent-light)',
                    }}
                  />
                </div>
                <div className="rp-bar-count">
                  <span>{pct}%</span>
                </div>
              </div>
            ))}
          </SectionCard>
        )}

        {projectBreakdown.length > 0 && (
          <SectionCard title="Project Breakdown">
            <div className="rp-project-table">
              <div className="rp-project-table-head">
                <span>Project</span>
                <span>Tasks</span>
                <span>Done</span>
                <span>Overdue</span>
                <span>Progress</span>
              </div>
              {projectBreakdown.map(({ project, total, done, overdue, pct }) => (
                <div key={project.id} className="rp-project-table-row">
                  <span className="rp-project-name-cell">
                    <span className="rp-project-dot" style={{ background: project.color }} />
                    {project.name}
                  </span>
                  <span>{total}</span>
                  <span style={{ color: 'var(--accent-light)' }}>{done}</span>
                  <span style={{ color: overdue > 0 ? 'var(--priority-high)' : 'var(--text-muted)' }}>{overdue}</span>
                  <span>
                    <div className="rp-inline-bar">
                      <div
                        className="rp-inline-bar-fill"
                        style={{ width: `${pct}%`, background: project.color }}
                      />
                    </div>
                    <span className="rp-inline-pct">{pct}%</span>
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
