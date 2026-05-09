import { createContext, useContext, useReducer, useEffect } from 'react'
import {
  getProjects, saveProjects,
  getMilestones, saveMilestones,
  getTasks, saveTasks,
  seedIfEmpty,
} from '../services/storage'

const AppContext = createContext(null)

const initialState = {
  projects: [],
  milestones: [],
  tasks: [],
  activeProjectId: null,
  activeMilestoneId: null,
  activePage: 'dashboard',
  activeView: 'board',
  modal: { type: null, mode: 'add', data: null },
  theme: localStorage.getItem('meridian-theme') || 'dark',
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload }

    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProjectId: action.id, activeMilestoneId: null }

    case 'SET_ACTIVE_MILESTONE':
      return { ...state, activeMilestoneId: action.id }

    case 'SET_PAGE':
      return { ...state, activePage: action.page }

    case 'SET_VIEW':
      return { ...state, activeView: action.view }

    case 'OPEN_MODAL':
      return { ...state, modal: { type: action.modalType, mode: action.mode, data: action.data ?? null } }

    case 'CLOSE_MODAL':
      return { ...state, modal: { type: null, mode: 'add', data: null } }

    case 'SET_THEME': {
      localStorage.setItem('meridian-theme', action.theme)
      return { ...state, theme: action.theme }
    }

    // Task actions
    case 'CREATE_TASK': {
      const tasks = [...state.tasks, action.task]
      saveTasks(tasks)
      return { ...state, tasks }
    }
    case 'UPDATE_TASK': {
      const tasks = state.tasks.map((t) =>
        t.id === action.id ? { ...t, ...action.patch, updated_at: new Date().toISOString() } : t
      )
      saveTasks(tasks)
      return { ...state, tasks }
    }
    case 'DELETE_TASK': {
      const tasks = state.tasks.filter((t) => t.id !== action.id)
      saveTasks(tasks)
      return { ...state, tasks }
    }

    // Milestone actions
    case 'CREATE_MILESTONE': {
      const milestones = [...state.milestones, action.milestone]
      saveMilestones(milestones)
      return { ...state, milestones }
    }
    case 'UPDATE_MILESTONE': {
      const milestones = state.milestones.map((m) =>
        m.id === action.id ? { ...m, ...action.patch } : m
      )
      saveMilestones(milestones)
      return { ...state, milestones }
    }
    case 'DELETE_MILESTONE': {
      const milestones = state.milestones.filter((m) => m.id !== action.id)
      const tasks = state.tasks.map((t) =>
        t.milestone_id === action.id ? { ...t, milestone_id: null } : t
      )
      saveMilestones(milestones)
      saveTasks(tasks)
      return { ...state, milestones, tasks }
    }

    // Project actions
    case 'CREATE_PROJECT': {
      const projects = [...state.projects, action.project]
      saveProjects(projects)
      return { ...state, projects }
    }
    case 'UPDATE_PROJECT': {
      const projects = state.projects.map((p) =>
        p.id === action.id ? { ...p, ...action.patch } : p
      )
      saveProjects(projects)
      return { ...state, projects }
    }
    case 'DELETE_PROJECT': {
      const projects = state.projects.filter((p) => p.id !== action.id)
      const milestones = state.milestones.filter((m) => m.project_id !== action.id)
      const tasks = state.tasks.filter((t) => t.project_id !== action.id)
      saveProjects(projects)
      saveMilestones(milestones)
      saveTasks(tasks)
      return { ...state, projects, milestones, tasks, activeProjectId: null, activeMilestoneId: null }
    }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Apply theme to <html> on every change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  useEffect(() => {
    seedIfEmpty().then(() => {
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          projects: getProjects(),
          milestones: getMilestones(),
          tasks: getTasks(),
        },
      })
    })
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
