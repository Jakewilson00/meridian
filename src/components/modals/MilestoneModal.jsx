import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useApp } from '../../context/AppContext'
import './modal.css'

const STATUS_OPTIONS = ['upcoming', 'active', 'at-risk', 'completed']

export default function MilestoneModal() {
  const { state, dispatch } = useApp()
  const { mode, data } = state.modal
  const isEdit = mode === 'edit'

  const [form, setForm] = useState({
    title: '',
    description: '',
    target_date: '',
    status: 'upcoming',
    project_id: state.activeProjectId ?? '',
  })

  useEffect(() => {
    if (isEdit && data) {
      setForm({
        title: data.title ?? '',
        description: data.description ?? '',
        target_date: data.target_date ?? '',
        status: data.status ?? 'upcoming',
        project_id: data.project_id ?? state.activeProjectId ?? '',
      })
    }
  }, [isEdit, data])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const close = () => dispatch({ type: 'CLOSE_MODAL' })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  // Compute completion % from tasks
  const milestoneTasks = isEdit && data
    ? state.tasks.filter((t) => t.milestone_id === data.id)
    : []
  const doneTasks = milestoneTasks.filter((t) => t.status === 'done')
  const completionPct = milestoneTasks.length > 0
    ? Math.round((doneTasks.length / milestoneTasks.length) * 100)
    : 0

  const handleSave = () => {
    if (!form.title.trim()) return
    if (isEdit) {
      dispatch({ type: 'UPDATE_MILESTONE', id: data.id, patch: form })
    } else {
      dispatch({
        type: 'CREATE_MILESTONE',
        milestone: { ...form, id: nanoid(), created_at: new Date().toISOString() },
      })
    }
    close()
  }

  const handleDelete = () => {
    if (!window.confirm(`Delete "${data.title}"? Tasks linked to this milestone will become unassigned.`)) return
    dispatch({ type: 'DELETE_MILESTONE', id: data.id })
    close()
  }

  return (
    <>
      <div className="modal-overlay" onClick={close} />
      <div className="milestone-modal">
        <div className="drawer-header">
          <span className="drawer-title">{isEdit ? 'Edit Milestone' : 'New Milestone'}</span>
          <button className="drawer-close" onClick={close}><X size={18} /></button>
        </div>

        <div className="drawer-body">
          {isEdit && (
            <div className="milestone-completion">
              <span>Completion</span>
              <div className="milestone-completion-bar">
                <div className="milestone-completion-fill" style={{ width: `${completionPct}%` }} />
              </div>
              <span className="milestone-completion-pct">{completionPct}%</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {doneTasks.length}/{milestoneTasks.length} tasks
              </span>
            </div>
          )}

          <div className="field">
            <label>Title *</label>
            <input
              autoFocus
              value={form.title}
              onChange={set('title')}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Milestone name…"
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="What does reaching this milestone mean?"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Target Date *</label>
              <input type="date" value={form.target_date} onChange={set('target_date')} />
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {state.projects.length > 0 && (
            <div className="field">
              <label>Project</label>
              <select value={form.project_id} onChange={set('project_id')}>
                <option value="">No project</option>
                {state.projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="drawer-footer">
          {isEdit && (
            <button className="btn-danger" onClick={handleDelete}>Delete milestone</button>
          )}
          <button className="btn-ghost" onClick={close}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            {isEdit ? 'Save changes' : 'Create milestone'}
          </button>
        </div>
      </div>
    </>
  )
}
