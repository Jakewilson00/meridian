import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/sidebar/Sidebar'
import ViewToggle from './components/shared/ViewToggle'
import BoardView from './components/board/BoardView'
import ListView from './components/list/ListView'
import TimelineView from './components/timeline/TimelineView'
import TaskModal from './components/modals/TaskModal'
import MilestoneModal from './components/modals/MilestoneModal'
import './App.css'

function TopBar() {
  const { state, dispatch } = useApp()
  const project = state.projects.find((p) => p.id === state.activeProjectId)

  return (
    <div className="topbar">
      <span className="topbar-title">
        {project ? project.name : 'All Tasks'}
      </span>
      <div className="topbar-actions">
        <ViewToggle />
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: 'OPEN_MODAL', modalType: 'task', mode: 'add' })}
        >
          + Add Task
        </button>
      </div>
    </div>
  )
}

function MainContent() {
  const { state } = useApp()

  return (
    <div className="main-content">
      {state.activeView === 'board' ? (
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
