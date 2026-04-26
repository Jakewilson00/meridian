import { useState } from 'react'
import { LayoutDashboard, ListTodo, GitBranch, BarChart2 } from 'lucide-react'
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
    </aside>
  )
}
