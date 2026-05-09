import { Pencil, Plus, Flag, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const STATUS_COLORS = {
  upcoming:  'var(--text-muted)',
  active:    'var(--accent-light)',
  'at-risk': 'var(--tag-amber-text)',
  completed: 'var(--accent)',
}

function isTaskOverdue(task) {
  return task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
}

export default function MilestoneList() {
  const { state, dispatch } = useApp()

  if (!state.activeProjectId) return null

  const milestones = state.milestones.filter(
    (m) => m.project_id === state.activeProjectId
  )

  const openAdd = () =>
    dispatch({ type: 'OPEN_MODAL', modalType: 'milestone', mode: 'add' })

  const openEdit = (e, milestone) => {
    e.stopPropagation()
    dispatch({ type: 'OPEN_MODAL', modalType: 'milestone', mode: 'edit', data: milestone })
  }

  return (
    <div className="project-list" style={{ marginTop: 8 }}>
      <div className="sidebar-section-header">
        <span>Milestones</span>
        <button className="sidebar-section-btn" onClick={openAdd} title="New milestone">
          <Plus size={13} />
        </button>
      </div>

      {milestones.length === 0 && (
        <div className="milestone-empty">
          <p className="project-empty">No milestones yet</p>
          <button className="milestone-empty-cta" onClick={openAdd}>+ Add milestone</button>
        </div>
      )}

      {milestones.map((m) => {
        const milestoneTasks = state.tasks.filter((t) => t.milestone_id === m.id)
        const hasOverdue = milestoneTasks.some(isTaskOverdue)
        const effectiveStatus = hasOverdue && m.status !== 'completed' ? 'at-risk' : m.status
        const flagColor = STATUS_COLORS[effectiveStatus] ?? STATUS_COLORS.upcoming

        return (
          <button
            key={m.id}
            className={`project-item milestone-item${state.activeMilestoneId === m.id ? ' active' : ''}`}
            onClick={() =>
              dispatch({
                type: 'SET_ACTIVE_MILESTONE',
                id: state.activeMilestoneId === m.id ? null : m.id,
              })
            }
          >
            <Flag size={11} style={{ color: flagColor, flexShrink: 0 }} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {m.title}
            </span>
            {hasOverdue && m.status !== 'completed' && (
              <AlertTriangle size={10} style={{ color: 'var(--tag-amber-text)', flexShrink: 0 }} title="Has overdue tasks" />
            )}
            <button
              className="milestone-edit-btn sidebar-section-btn"
              onClick={(e) => openEdit(e, m)}
              title="Edit milestone"
            >
              <Pencil size={11} />
            </button>
          </button>
        )
      })}
    </div>
  )
}
