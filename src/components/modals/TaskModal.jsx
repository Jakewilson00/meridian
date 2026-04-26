import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useApp } from '../../context/AppContext'
import './modal.css'

const STATUS_OPTIONS = ['backlog', 'todo', 'in-progress', 'review', 'done', 'blocked']
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical']

function TagsInput({ tags, onChange }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const addTag = () => {
    const val = input.trim().toLowerCase()
    if (val && !tags.includes(val)) onChange([...tags, val])
    setInput('')
  }

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag))

  return (
    <div className="tags-input-wrap" onClick={() => inputRef.current?.focus()}>
      {tags.map((tag) => (
        <span key={tag} className="tag-chip">
          {tag}
          <button type="button" onClick={() => removeTag(tag)}>×</button>
        </span>
      ))}
      <input
        ref={inputRef}
        className="tags-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
          if (e.key === 'Backspace' && !input && tags.length) removeTag(tags[tags.length - 1])
        }}
        placeholder={tags.length === 0 ? 'Add tags…' : ''}
      />
    </div>
  )
}

export default function TaskModal() {
  const { state, dispatch } = useApp()
  const { mode, data } = state.modal
  const isEdit = mode === 'edit'

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: data?.status ?? 'todo',
    priority: 'medium',
    due_date: '',
    assignee: '',
    tags: [],
    milestone_id: null,
    project_id: state.activeProjectId ?? '',
  })

  useEffect(() => {
    if (isEdit && data) {
      setForm({
        title: data.title ?? '',
        description: data.description ?? '',
        status: data.status ?? 'todo',
        priority: data.priority ?? 'medium',
        due_date: data.due_date ?? '',
        assignee: data.assignee ?? '',
        tags: data.tags ?? [],
        milestone_id: data.milestone_id ?? null,
        project_id: data.project_id ?? state.activeProjectId ?? '',
      })
    }
  }, [isEdit, data])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const close = () => dispatch({ type: 'CLOSE_MODAL' })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = () => {
    if (!form.title.trim()) return
    const now = new Date().toISOString()
    if (isEdit) {
      dispatch({ type: 'UPDATE_TASK', id: data.id, patch: { ...form, updated_at: now } })
    } else {
      dispatch({
        type: 'CREATE_TASK',
        task: { ...form, id: nanoid(), created_at: now, updated_at: now },
      })
    }
    close()
  }

  const handleDelete = () => {
    if (!window.confirm('Delete this task?')) return
    dispatch({ type: 'DELETE_TASK', id: data.id })
    close()
  }

  const milestones = state.milestones.filter(
    (m) => !form.project_id || m.project_id === form.project_id
  )

  return (
    <>
      <div className="modal-overlay" onClick={close} />
      <div className="task-drawer">
        <div className="drawer-header">
          <span className="drawer-title">{isEdit ? 'Edit Task' : 'New Task'}</span>
          <button className="drawer-close" onClick={close}><X size={18} /></button>
        </div>

        <div className="drawer-body">
          <div className="field">
            <label>Title *</label>
            <input
              autoFocus
              value={form.title}
              onChange={set('title')}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="What needs to get done?"
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Add more context…"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select value={form.priority} onChange={set('priority')}>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Due Date</label>
              <input type="date" value={form.due_date} onChange={set('due_date')} />
            </div>
            <div className="field">
              <label>Assignee</label>
              <input value={form.assignee} onChange={set('assignee')} placeholder="Name…" />
            </div>
          </div>

          {state.projects.length > 0 && (
            <div className="field">
              <label>Project</label>
              <select
                value={form.project_id}
                onChange={(e) => setForm((f) => ({ ...f, project_id: e.target.value, milestone_id: null }))}
              >
                <option value="">No project</option>
                {state.projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {milestones.length > 0 && (
            <div className="field">
              <label>Milestone</label>
              <select
                value={form.milestone_id ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, milestone_id: e.target.value || null }))}
              >
                <option value="">No milestone</option>
                {milestones.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="field">
            <label>Tags</label>
            <TagsInput tags={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} />
          </div>
        </div>

        <div className="drawer-footer">
          {isEdit && (
            <button className="btn-danger" onClick={handleDelete}>Delete task</button>
          )}
          <button className="btn-ghost" onClick={close}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            {isEdit ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </div>
    </>
  )
}
