import { INITIAL_DATA } from './initialData'

export const STORAGE_KEYS = {
  STUDENTS: 'jsonschool_students',
  MENTORS: 'jsonschool_mentors',
  COURSES: 'jsonschool_courses',
  GROUPS: 'jsonschool_groups',
  THEME: 'jsonschool_theme',
  SESSION_ROLE: 'jsonschool_role',
  SESSION_USER: 'jsonschool_current_user',
  INITIALIZED_V3: 'jsonschool_initialized_v3'
}

export function initializeStorage(force = false) {
  const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED_V3) === 'true'

  if (force || !isInit) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_DATA.students))
    localStorage.setItem(STORAGE_KEYS.MENTORS, JSON.stringify(INITIAL_DATA.mentors))
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_DATA.courses))
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_DATA.groups))
    localStorage.setItem(STORAGE_KEYS.INITIALIZED_V3, 'true')
    notifyStoreUpdate('all')
  }
}

export function getStorage(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.error(`Storage error [${key}]:`, err)
    return fallback
  }
}

export function setStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    notifyStoreUpdate(key, data)
    return true
  } catch (err) {
    console.error(`Storage save error [${key}]:`, err)
    return false
  }
}

export function notifyStoreUpdate(key, data = null) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jsonschool_store_updated', {
      detail: { key, data, timestamp: Date.now() }
    }))
  }
}

export function resetDatabase() {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_DATA.students))
  localStorage.setItem(STORAGE_KEYS.MENTORS, JSON.stringify(INITIAL_DATA.mentors))
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_DATA.courses))
  localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_DATA.groups))
  localStorage.setItem(STORAGE_KEYS.INITIALIZED_V3, 'true')
  notifyStoreUpdate('all')
}

export function exportBackupJSON() {
  const backup = {
    schoolName: "JsonSchool",
    version: "2.0.0",
    exportedAt: new Date().toISOString(),
    students: getStorage(STORAGE_KEYS.STUDENTS, INITIAL_DATA.students),
    mentors: getStorage(STORAGE_KEYS.MENTORS, INITIAL_DATA.mentors),
    courses: getStorage(STORAGE_KEYS.COURSES, INITIAL_DATA.courses),
    groups: getStorage(STORAGE_KEYS.GROUPS, INITIAL_DATA.groups)
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `jsonschool_api_backup_${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
