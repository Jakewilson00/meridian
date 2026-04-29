import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import './timeline.css'

// Layout constants
const DAY_W    = 24   // px per day
const LABEL_W  = 228  // label column width
const MONTHS_H = 26   // axis: month names row
const WEEKS_H  = 28   // axis: week ticks row
const AXIS_H   = MONTHS_H + WEEKS_H
const TASK_H   = 34   // each task row height
const GROUP_H  = 38   // milestone group header height
const BAR_H    = 20   // gantt bar height
const MIN_BAR  = 40   // minimum bar width in px

const MS_COLOR = {
  completed: 'var(--accent-light)',
  active:    'var(--accent)',
  upcoming:  'var(--text-muted)',
  'at-risk': 'var(--priority-medium)',
}

const STATUS_COLOR = {
  'done':        'var(--accent-light)',
  'in-progress': 'var(--tag-blue-text)',
  'review':      'var(--tag-amber-text)',
  'todo':        'var(--text-muted)',
  'backlog':     'var(--text-muted)',
  'blocked':     'var(--priority-high)',
}

const PRIORITY_COLOR = {
  high:   'var(--priority-high)',
  medium: 'var(--priority-medium)',
  low:    'var(--priority-low)',
}

function parseDate(s) {
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

function toMonday(d) {
  const r = new Date(d)
  r.setHours(0, 0, 0, 0)
  const day = r.getDay()
  r.setDate(r.getDate() - (day === 0 ? 6 : day - 1))
  return r
}

function fmtShort(s) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TimelineView() {
  const { state } = useApp()
  const { tasks, milestones, activeProjectId } = state

  const filtMs = useMemo(
    () => milestones.filter((m) => !activeProjectId || m.project_id === activeProjectId),
    [milestones, activeProjectId]
  )
  const filtTasks = useMemo(
    () => tasks.filter((t) => !activeProjectId || t.project_id === activeProjectId),
    [tasks, activeProjectId]
  )

  // ── Date range ────────────────────────────────────────────
  const { startDate, totalDays } = useMemo(() => {
    const dates = [
      ...filtMs.map((m) => parseDate(m.target_date)),
      ...filtTasks.map((t) => parseDate(t.due_date)),
      ...filtTasks.map((t) => parseDate(t.created_at)),
      new Date(),
    ].filter(Boolean)

    const min = Math.min(...dates.map((d) => d.getTime()))
    const max = Math.max(...dates.map((d) => d.getTime()))
    const start = toMonday(new Date(min - 7 * 86400000))
    const rawEnd = new Date(max + 21 * 86400000)
    const minEnd = new Date(start.getTime() + 28 * 86400000)
    const end = rawEnd > minEnd ? rawEnd : minEnd
    return { startDate: start, totalDays: Math.ceil((end - start) / 86400000) }
  }, [filtMs, filtTasks])

  // ── x coordinate helpers ──────────────────────────────────
  const xAt = (dateStr) => {
    const d = parseDate(dateStr)
    if (!d) return null
    return Math.floor((d - startDate) / 86400000) * DAY_W
  }

  const todayX = Math.floor((Date.now() - startDate.getTime()) / 86400000) * DAY_W
  const contentW = totalDays * DAY_W

  // ── Axis: month blocks ────────────────────────────────────
  const months = useMemo(() => {
    const result = []
    const d = new Date(startDate)
    d.setDate(1)
    // if startDate is mid-month, back up to 1st
    while (true) {
      const left = Math.max(0, Math.floor((d - startDate) / 86400000) * DAY_W)
      if (left >= contentW) break
      const next = new Date(d)
      next.setMonth(next.getMonth() + 1)
      const right = Math.min(contentW, Math.floor((next - startDate) / 86400000) * DAY_W)
      result.push({
        label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        left,
        width: right - left,
      })
      d.setMonth(d.getMonth() + 1)
    }
    return result
  }, [startDate, contentW])

  // ── Axis: week ticks ──────────────────────────────────────
  const weeks = useMemo(() => {
    const result = []
    const d = new Date(startDate)
    while (true) {
      const offset = Math.floor((d - startDate) / 86400000)
      if (offset >= totalDays) break
      result.push({
        left: offset * DAY_W,
        label: d.toLocaleDateString('en-US', { day: 'numeric' }),
        isFirst: d.getDate() <= 7,
      })
      d.setDate(d.getDate() + 7)
    }
    return result
  }, [startDate, totalDays])

  // ── Groups ────────────────────────────────────────────────
  const groups = useMemo(() => {
    const out = filtMs.map((m) => ({
      id: m.id,
      milestone: m,
      msX: xAt(m.target_date),
      tasks: filtTasks.filter((t) => t.milestone_id === m.id),
    }))
    const unsched = filtTasks.filter((t) => !t.milestone_id)
    if (unsched.length) out.push({ id: '__unsched__', milestone: null, msX: null, tasks: unsched })
    return out
  }, [filtMs, filtTasks, startDate])

  if (!filtMs.length && !filtTasks.length) {
    return <div className="tl-empty">No milestones or tasks to display</div>
  }

  return (
    <div className="tl-root">
      <div className="tl-inner" style={{ minWidth: LABEL_W + contentW }}>

        {/* ── Sticky axis ───────────────────────────── */}
        <div className="tl-axis" style={{ height: AXIS_H }}>
          {/* Corner */}
          <div className="tl-axis-corner" style={{ width: LABEL_W }} />

          {/* Axis content */}
          <div className="tl-axis-content" style={{ width: contentW }}>
            {/* Month names */}
            <div className="tl-months" style={{ height: MONTHS_H }}>
              {months.map((m, i) => (
                <div
                  key={i}
                  className="tl-month-block"
                  style={{ left: m.left, width: m.width }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Week ticks + milestone diamonds + today */}
            <div className="tl-weeks" style={{ height: WEEKS_H }}>
              {weeks.map((w, i) => (
                <div
                  key={i}
                  className={`tl-week-tick${w.isFirst ? ' first' : ''}`}
                  style={{ left: w.left }}
                >
                  {w.label}
                </div>
              ))}

              {/* Milestone diamonds on the axis */}
              {filtMs.map((m) => {
                const mx = xAt(m.target_date)
                if (mx === null) return null
                const color = MS_COLOR[m.status] || 'var(--text-muted)'
                return (
                  <div
                    key={m.id}
                    className="tl-ms-diamond"
                    style={{ left: mx, '--ms-c': color }}
                    title={`${m.title}  ·  ${fmtShort(m.target_date)}`}
                  />
                )
              })}

              {/* Today indicator */}
              {todayX >= 0 && todayX <= contentW && (
                <div className="tl-today-pip" style={{ left: todayX }}>
                  <span>Today</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Milestone groups ──────────────────────── */}
        {groups.map(({ id, milestone, msX, tasks: groupTasks }) => {
          const msColor = milestone ? (MS_COLOR[milestone.status] || 'var(--text-muted)') : null

          return (
            <div key={id} className="tl-group">
              {/* Group header row */}
              <div className="tl-group-hdr" style={{ height: GROUP_H }}>
                <div className="tl-group-hdr-label" style={{ width: LABEL_W }}>
                  {milestone ? (
                    <>
                      <span
                        className="tl-group-dot"
                        style={{ background: msColor }}
                      />
                      <span className="tl-group-title">{milestone.title}</span>
                      {milestone.target_date && (
                        <span className="tl-group-date">{fmtShort(milestone.target_date)}</span>
                      )}
                    </>
                  ) : (
                    <span className="tl-group-title muted">Unscheduled</span>
                  )}
                </div>
                <div className="tl-group-hdr-content" style={{ width: contentW }}>
                  {/* Vertical band at milestone target date */}
                  {msX !== null && (
                    <div
                      className="tl-ms-band"
                      style={{ left: msX, '--ms-c': msColor }}
                    />
                  )}
                  {todayX >= 0 && todayX <= contentW && (
                    <div className="tl-today-line" style={{ left: todayX }} />
                  )}
                </div>
              </div>

              {/* Task rows */}
              {groupTasks.map((task) => {
                const duX  = xAt(task.due_date)
                const crX  = xAt(task.created_at)
                const isDone = task.status === 'done'
                const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isDone

                let barLeft = null
                let barWidth = null
                if (duX !== null) {
                  barLeft  = crX !== null ? Math.min(crX, duX - MIN_BAR) : duX - 5 * DAY_W
                  barWidth = Math.max(duX - barLeft, MIN_BAR)
                }

                const barColor   = PRIORITY_COLOR[task.priority] || 'var(--text-muted)'
                const dotColor   = STATUS_COLOR[task.status]   || 'var(--text-muted)'
                const tooltip    = [task.title, task.due_date && `Due ${fmtShort(task.due_date)}`].filter(Boolean).join(' · ')

                return (
                  <div key={task.id} className="tl-task-row" style={{ height: TASK_H }}>
                    {/* Sticky label */}
                    <div className="tl-task-label" style={{ width: LABEL_W }}>
                      <span className="tl-task-dot" style={{ background: dotColor }} />
                      <span className={`tl-task-name${isDone ? ' done' : ''}${isOverdue ? ' overdue' : ''}`}>
                        {task.title}
                      </span>
                      {task.assignee && (
                        <span className="tl-task-avatar" title={task.assignee}>
                          {task.assignee.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Timeline lane */}
                    <div className="tl-task-content" style={{ width: contentW }}>
                      {/* Milestone deadline line */}
                      {msX !== null && (
                        <div
                          className="tl-ms-line"
                          style={{ left: msX, '--ms-c': msColor }}
                        />
                      )}
                      {/* Today line */}
                      {todayX >= 0 && todayX <= contentW && (
                        <div className="tl-today-line" style={{ left: todayX }} />
                      )}
                      {/* Gantt bar */}
                      {barLeft !== null ? (
                        <div
                          className={`tl-bar${isDone ? ' done' : ''}`}
                          style={{
                            left: barLeft,
                            width: barWidth,
                            top: (TASK_H - BAR_H) / 2,
                            height: BAR_H,
                            '--bar-c': barColor,
                          }}
                          title={tooltip}
                        >
                          <span className="tl-bar-end-dot" />
                        </div>
                      ) : (
                        /* No due date — floating dot at milestone position */
                        <div
                          className="tl-bar-nodate"
                          style={{
                            left: msX !== null ? msX : 16,
                            top: (TASK_H - BAR_H) / 2,
                            '--bar-c': barColor,
                          }}
                          title={task.title}
                        />
                      )}
                    </div>
                  </div>
                )
              })}

              {groupTasks.length === 0 && (
                <div className="tl-task-row" style={{ height: TASK_H }}>
                  <div className="tl-task-label" style={{ width: LABEL_W }} />
                  <div className="tl-task-content" style={{ width: contentW }}>
                    <span className="tl-no-tasks">No tasks in this milestone</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
