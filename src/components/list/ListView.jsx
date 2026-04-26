import { useState } from 'react'
import { Flag, ChevronUp, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import './list.css'

const STATUS_STYLE = {
  backlog:     { bg: 'var(--bg-elevated)',   color: 'var(--text-muted)' },
  todo:        { bg: 'var(--tag-blue-bg)',   color: 'var(--tag-blue-text)' },
  'in-progress':{ bg: 'var(--tag-amber-bg)', color: 'var(--tag-amber-text)' },
  review:      { bg: '#1e1535',              color: '#a78bfa' },
  done:        { bg: 'var(--tag-green-bg)',  color: 'var(--tag-green-text)' },
  blocked:     { bg: 'var(--tag-red-bg)',    color: 'var(--tag-red-text)' },
}

const STATUS_ORDER = ['backlog', 'todo', 'in-progress', 'review', 'done', 'blocked']
const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low']

const PRIORITY_COLOR = {
  low:      'var(--priority-low)',
  medium:   'var(--priority-medium)',
  high:     'var(--priority-high)',
  critical: '#ff4444',
}

function formatDate(str) {
  if (!str) return null
  return new Date(str).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

function sortTasks(tasks, key, dir) {
  return [...tasks].sort((a, b) => {
    let val = 0
    if (key === 'title') {
      val = a.title.localeCompare(b.title)
    } else if (key === 'status') {
      val = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
    } else if (key === 'priority') {
      val = PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
    } else if (key === 'due_date') {
      const da = a.due_date ? new Date(a.due_date) : Infinity
      const db = b.due_date ? new Date(b.due_date) : Infinity
      val = da - db
    }
    return dir === 'asc' ? val : -val
  })
}

function SortIcon({ col, sortKey, sortDir }) {
  if (sortKey !== col) return <span className="list-sort-icon list-sort-icon--idle"><ChevronUp size={11} /></span>
  return sortDir === 'asc'
    ? <span className="list-sort-icon list-sort-icon--active"><ChevronUp size={11} /></span>
    : <span className="list-sort-icon list-sort-icon--active"><ChevronDown size={11} /></span>
}

export default function ListView() {
  const { state, dispatch } = useApp()
  const [sortKey, setSortKey] = useState('due_date')
  const [sortDir, setSortDir] = useState('asc')

  const visible = state.tasks.filter((t) => {
    if (state.activeProjectId && t.project_id !== state.activeProjectId) return false
    if (state.activeMilestoneId && t.milestone_id !== state.activeMilestoneId) return false
    return true
  })

  const sorted = sortTasks(visible, sortKey, sortDir)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const openEdit = (task) =>
    dispatch({ type: 'OPEN_MODAL', modalType: 'task', mode: 'edit', data: task })

  const openAdd = () =>
    dispatch({ type: 'OPEN_MODAL', modalType: 'task', mode: 'add' })

  if (visible.length === 0) {
    return (
      <div className="list-empty">
        <span className="list-empty-label">No tasks here yet</span>
        <button className="btn-primary" onClick={openAdd}>+ Add Task</button>
      </div>
    )
  }

  return (
    <div className="list-view">
      <div className="list-table">
        {/* Header */}
        <div className="list-header">
          <div className="list-col list-col--priority" />
          <button className="list-col list-col--title list-th" onClick={() => handleSort('title')}>
            Title <SortIcon col="title" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button className="list-col list-col--status list-th" onClick={() => handleSort('status')}>
            Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button className="list-col list-col--priority-label list-th" onClick={() => handleSort('priority')}>
            Priority <SortIcon col="priority" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <div className="list-col list-col--milestone list-th-plain">Milestone</div>
          <button className="list-col list-col--date list-th" onClick={() => handleSort('due_date')}>
            Due <SortIcon col="due_date" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <div className="list-col list-col--assignee list-th-plain">Who</div>
        </div>

        {/* Rows */}
        <div className="list-body">
          {sorted.map((task) => {
            const milestone = state.milestones.find((m) => m.id === task.milestone_id)
            const statusStyle = STATUS_STYLE[task.status] ?? STATUS_STYLE.backlog
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

            return (
              <div key={task.id} className="list-row" onClick={() => openEdit(task)}>
                {/* Priority dot */}
                <div className="list-col list-col--priority">
                  <span
                    className="list-priority-dot"
                    style={{ background: PRIORITY_COLOR[task.priority] ?? 'var(--text-muted)' }}
                    title={task.priority}
                  />
                </div>

                {/* Title */}
                <div className="list-col list-col--title">
                  <span className="list-task-title">{task.title}</span>
                  {task.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="list-tag">{tag}</span>
                  ))}
                  {task.tags?.length > 2 && (
                    <span className="list-tag list-tag--more">+{task.tags.length - 2}</span>
                  )}
                </div>

                {/* Status */}
                <div className="list-col list-col--status">
                  <span
                    className="list-status-badge"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                  >
                    {task.status}
                  </span>
                </div>

                {/* Priority label */}
                <div className="list-col list-col--priority-label">
                  <span className="list-priority-label" style={{ color: PRIORITY_COLOR[task.priority] }}>
                    {task.priority}
                  </span>
                </div>

                {/* Milestone */}
                <div className="list-col list-col--milestone">
                  {milestone && (
                    <span className="list-milestone">
                      <Flag size={10} />
                      {milestone.title}
                    </span>
                  )}
                </div>

                {/* Due date */}
                <div className="list-col list-col--date">
                  {task.due_date && (
                    <span className={`list-date${isOverdue ? ' list-date--overdue' : ''}`}>
                      {formatDate(task.due_date)}
                    </span>
                  )}
                </div>

                {/* Assignee */}
                <div className="list-col list-col--assignee">
                  {task.assignee && (
                    <span className="list-avatar" title={task.assignee}>
                      {task.assignee.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
