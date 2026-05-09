import { useState } from 'react'
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors,
  useDraggable, useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, Flag } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import './board.css'

const COLUMNS = [
  { id: 'backlog',     label: 'Backlog' },
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
  { id: 'blocked',     label: 'Blocked' },
]

const PRIORITY_BORDER = {
  low:      'var(--priority-low)',
  medium:   'var(--priority-medium)',
  high:     'var(--priority-high)',
  critical: '#ff4444',
}

function formatDate(str) {
  if (!str) return null
  return new Date(str).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

// Pure visual card — used both in columns and in the drag overlay
function TaskCard({ task, isOverlay = false }) {
  const { state, dispatch } = useApp()
  const milestone = state.milestones.find((m) => m.id === task.milestone_id)
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  const openEdit = (e) => {
    e.stopPropagation()
    dispatch({ type: 'OPEN_MODAL', modalType: 'task', mode: 'edit', data: task })
  }

  return (
    <div
      className={`board-card${isOverlay ? ' board-card--overlay' : ''}${isOverdue ? ' board-card--overdue' : ''}`}
      style={{ borderLeftColor: isOverdue ? '#e54d4d' : (PRIORITY_BORDER[task.priority] ?? 'var(--border-card)') }}
      onClick={isOverlay ? undefined : openEdit}
    >
      {task.tags?.length > 0 && (
        <div className="board-card-tags">
          {task.tags.map((tag) => (
            <span key={tag} className="board-tag">{tag}</span>
          ))}
        </div>
      )}

      <p className="board-card-title">{task.title}</p>

      {milestone && (
        <div className="board-card-milestone">
          <Flag size={10} />
          <span>{milestone.title}</span>
        </div>
      )}

      <div className="board-card-footer">
        {task.due_date ? (
          <span className={`board-card-date${isOverdue ? ' overdue' : ''}`}>
            <Calendar size={11} />
            {formatDate(task.due_date)}
          </span>
        ) : <span />}

        {task.assignee && (
          <span className="board-card-avatar" title={task.assignee}>
            {task.assignee.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}

// Draggable wrapper around TaskCard
function DraggableCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      {...listeners}
      {...attributes}
    >
      <TaskCard task={task} />
    </div>
  )
}

// Droppable column
function Column({ col, tasks, activeTaskStatus }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id })
  const { dispatch } = useApp()

  const openAdd = () =>
    dispatch({ type: 'OPEN_MODAL', modalType: 'task', mode: 'add', data: { status: col.id } })

  const showDropZone = isOver && activeTaskStatus !== col.id

  return (
    <div className={`board-column${isOver ? ' board-column--over' : ''}`}>
      <div className="board-column-header">
        <span className="board-column-label">{col.label}</span>
        <span className="board-column-count">{tasks.length}</span>
        <button className="board-column-add" onClick={openAdd} title={`Add to ${col.label}`}>+</button>
      </div>

      <div ref={setNodeRef} className="board-column-cards">
        {tasks.map((task) => (
          <DraggableCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && !showDropZone && (
          <div className="board-column-empty">Drop tasks here</div>
        )}

        {showDropZone && (
          <div className="board-drop-zone" />
        )}
      </div>
    </div>
  )
}

export default function BoardView() {
  const { state, dispatch } = useApp()
  const [activeTask, setActiveTask] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const visible = state.tasks.filter((t) => {
    if (state.activeProjectId && t.project_id !== state.activeProjectId) return false
    if (state.activeMilestoneId && t.milestone_id !== state.activeMilestoneId) return false
    return true
  })

  const handleDragStart = ({ active }) => {
    setActiveTask(state.tasks.find((t) => t.id === active.id) ?? null)
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null)
    if (!over) return
    const task = state.tasks.find((t) => t.id === active.id)
    if (!task || task.status === over.id) return
    dispatch({ type: 'UPDATE_TASK', id: task.id, patch: { status: over.id } })
  }

  const handleDragCancel = () => setActiveTask(null)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="board-view">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            col={col}
            tasks={visible.filter((t) => t.status === col.id)}
            activeTaskStatus={activeTask?.status}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
