import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useApp } from '../../context/AppContext'

const PRESET_COLORS = [
  '#2a8a56', '#5899d4', '#d4941a', '#d46060',
  '#9b59b6', '#1abc9c', '#e67e22', '#5dade2',
]

export default function ProjectList() {
  const { state, dispatch } = useApp()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])

  const handleCreate = () => {
    if (!name.trim()) return
    dispatch({
      type: 'CREATE_PROJECT',
      project: { id: nanoid(), name: name.trim(), description: '', color, created_at: new Date().toISOString() },
    })
    setName('')
    setColor(PRESET_COLORS[0])
    setAdding(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') { setAdding(false); setName('') }
  }

  return (
    <div className="project-list">
      <div className="sidebar-section-header">
        <span>Projects</span>
        <button className="sidebar-section-btn" onClick={() => setAdding(true)} title="New project">
          <Plus size={13} />
        </button>
      </div>

      {state.projects.map((p) => (
        <button
          key={p.id}
          className={`project-item${state.activeProjectId === p.id ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_ACTIVE_PROJECT', id: p.id })}
        >
          <span className="project-dot" style={{ background: p.color }} />
          <span>{p.name}</span>
        </button>
      ))}

      {state.projects.length === 0 && !adding && (
        <p className="project-empty">No projects yet</p>
      )}

      {adding && (
        <div className="project-add-form">
          <input
            autoFocus
            className="project-add-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Project name…"
          />
          <div className="color-swatches">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                className={`swatch${color === c ? ' selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div className="project-add-actions">
            <button onClick={handleCreate}><Check size={13} /></button>
            <button onClick={() => { setAdding(false); setName('') }}><X size={13} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
