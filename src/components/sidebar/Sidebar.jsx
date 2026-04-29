import { useState } from 'react'
import { LayoutDashboard, ListTodo, GitBranch, BarChart2, Sun, Moon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import NavItem from './NavItem'
import ProjectList from './ProjectList'
import MilestoneList from './MilestoneList'
import './sidebar.css'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: ListTodo,        label: 'Tasks' },
  { icon: GitBranch,       label: 'Timeline' },
  { icon: BarChart2,       label: 'Reports' },
]

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
  const [activeNav, setActiveNav] = useState('Tasks')

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">MERIDIAN</div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ icon, label }) => (
          <NavItem
            key={label}
            icon={icon}
            label={label}
            active={activeNav === label}
            onClick={() => setActiveNav(label)}
          />
        ))}
      </nav>

      <ProjectList />
      <MilestoneList />

      <div className="sidebar-footer">
        <ThemeToggle />
      </div>
    </aside>
  )
}
