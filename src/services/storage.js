// All data access is isolated here so swapping to Supabase is a single file change.

export const getProjects = () =>
  JSON.parse(localStorage.getItem('meridian_projects') || '[]')
export const saveProjects = (data) =>
  localStorage.setItem('meridian_projects', JSON.stringify(data))

export const getMilestones = () =>
  JSON.parse(localStorage.getItem('meridian_milestones') || '[]')
export const saveMilestones = (data) =>
  localStorage.setItem('meridian_milestones', JSON.stringify(data))

export const getTasks = () =>
  JSON.parse(localStorage.getItem('meridian_tasks') || '[]')
export const saveTasks = (data) =>
  localStorage.setItem('meridian_tasks', JSON.stringify(data))

const SEED_VERSION = '1'

export async function seedIfEmpty() {
  if (localStorage.getItem('meridian_seed_v') === SEED_VERSION) return
  const { SEED_PROJECTS, SEED_MILESTONES, SEED_TASKS } = await import('./seed.js')
  saveProjects(SEED_PROJECTS)
  saveMilestones(SEED_MILESTONES)
  saveTasks(SEED_TASKS)
  localStorage.setItem('meridian_seed_v', SEED_VERSION)
}
