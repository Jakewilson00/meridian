import { Pencil, Plus, Flag } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const STATUS_COLORS = {
  upcoming:  'var(--text-muted)',
  active:    'var(--accent-light)',
  'at-risk': 'var(--tag-amber-text)',
  completed: 'var(--accent)',
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
        <p className="project-empty">No milestones yet</p>
      )}

      {milestones.map((m) => (
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
          <Flag size={11} style={{ color: STATUS_COLORS[m.status], flexShrink: 0 }} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {m.title}
          </span>
          <button
            className="milestone-edit-btn sidebar-section-btn"
            onClick={(e) => openEdit(e, m)}
            title="Edit milestone"
          >
            <Pencil size={11} />
          </button>
        </button>
      ))}
    </div>
  )
}
