import { LayoutDashboard, ListTodo, GitBranch, BarChart2, Sun, Moon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import NavItem from './NavItem'
import ProjectList from './ProjectList'
import MilestoneList from './MilestoneList'
import './sidebar.css'

function ThemeToggle() {
  const { state, dispatch } = useApp()
  const isDark = state.theme !== 'light'
  return (
    <button
      className="theme-toggle"
      onClick={() => dispatch({ type: 'SET_THEME', theme: isDark ? 'light' : 'dark' })}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  )
}

export default function Sidebar() {
  const { state, dispatch } = useApp()

  const goTo = (page, view) => {
    dispatch({ type: 'SET_PAGE', page })
    if (view) dispatch({ type: 'SET_VIEW', view })
  }

  const isTasksActive = state.activePage === 'tasks' && state.activeView !== 'timeline'
  const isTimelineActive = state.activePage === 'tasks' && state.activeView === 'timeline'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">MERIDIAN</div>

      <nav className="sidebar-nav">
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={state.activePage === 'dashboard'}
          onClick={() => goTo('dashboard')}
        />
        <NavItem
          icon={ListTodo}
          label="Tasks"
          active={isTasksActive}
          onClick={() => goTo('tasks', 'board')}
        />
        <NavItem
          icon={GitBranch}
          label="Timeline"
          active={isTimelineActive}
          onClick={() => goTo('tasks', 'timeline')}
        />
        <NavItem
          icon={BarChart2}
          label="Reports"
          active={state.activePage === 'reports'}
          onClick={() => goTo('reports')}
        />
      </nav>

      <ProjectList />
      <MilestoneList />

      <div className="sidebar-footer">
        <ThemeToggle />
      </div>
    </aside>
  )
}
