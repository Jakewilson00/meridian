import { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/sidebar/Sidebar'
import ViewToggle from './components/shared/ViewToggle'
import BoardView from './components/board/BoardView'
import ListView from './components/list/ListView'
import TimelineView from './components/timeline/TimelineView'
import DashboardView from './components/dashboard/DashboardView'
import ReportsView from './components/reports/ReportsView'
import TaskModal from './components/modals/TaskModal'
import MilestoneModal from './components/modals/MilestoneModal'
import './App.css'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  reports: 'Reports',
}

function useKeyboardShortcuts() {
  const { state, dispatch } = useApp()

  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (state.modal.type) return

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        dispatch({ type: 'SET_PAGE', page: 'tasks' })
        dispatch({ type: 'OPEN_MODAL', modalType: 'task', mode: 'add' })
      } else if ((e.key === 'm' || e.key === 'M') && state.activeProjectId) {
        e.preventDefault()
        dispatch({ type: 'OPEN_MODAL', modalType: 'milestone', mode: 'add' })
      } else if (e.key === '1') {
        dispatch({ type: 'SET_PAGE', page: 'tasks' })
        dispatch({ type: 'SET_VIEW', view: 'board' })
      } else if (e.key === '2') {
        dispatch({ type: 'SET_PAGE', page: 'tasks' })
        dispatch({ type: 'SET_VIEW', view: 'list' })
      } else if (e.key === '3') {
        dispatch({ type: 'SET_PAGE', page: 'tasks' })
        dispatch({ type: 'SET_VIEW', view: 'timeline' })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state.modal.type, state.activeProjectId, dispatch])
}

function TopBar() {
  const { state, dispatch } = useApp()
  const isTasksPage = state.activePage === 'tasks'
  const project = state.projects.find((p) => p.id === state.activeProjectId)

  const title = isTasksPage
    ? (project ? project.name : 'All Tasks')
    : PAGE_TITLES[state.activePage] ?? ''

  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions">
        {isTasksPage && <ViewToggle />}
        {(isTasksPage || state.activePage === 'dashboard') && (
          <button
            className="btn-primary"
            onClick={() => dispatch({ type: 'OPEN_MODAL', modalType: 'task', mode: 'add' })}
          >
            + Add Task
          </button>
        )}
      </div>
    </div>
  )
}

function MainContent() {
  const { state } = useApp()

  return (
    <div className="main-content">
      {state.activePage === 'dashboard' ? (
        <DashboardView />
      ) : state.activePage === 'reports' ? (
        <ReportsView />
      ) : state.activeView === 'board' ? (
        <BoardView />
      ) : state.activeView === 'list' ? (
        <ListView />
      ) : (
        <TimelineView />
      )}
    </div>
  )
}

function AppShell() {
  const { state } = useApp()
  useKeyboardShortcuts()

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <MainContent />
      </div>
      {state.modal.type === 'task' && <TaskModal />}
      {state.modal.type === 'milestone' && <MilestoneModal />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
