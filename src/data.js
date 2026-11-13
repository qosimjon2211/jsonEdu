import { useState, useEffect, useCallback } from 'react'
import { INITIAL_DATA, ADMIN_CREDENTIALS } from './data/initialData'
import {
  STORAGE_KEYS,
  initializeStorage,
  getStorage,
  setStorage,
  resetDatabase,
  exportBackupJSON
} from './data/storage'

// Xotirani ishga tushirish
initializeStorage()

export const ADMIN = ADMIN_CREDENTIALS

// JsonSchool Asinxron API
export const api = {
  // Students API
  students: {
    async getAll() {
      return getStorage(STORAGE_KEYS.STUDENTS, INITIAL_DATA.students)
    },
    async save(item) {
      const list = getStorage(STORAGE_KEYS.STUDENTS, INITIAL_DATA.students)
      let next
      if (item.id) {
        next = list.map((s) => (s.id === item.id ? { ...s, ...item } : s))
      } else {
        const newObj = {
          ...item,
          id: Date.now(),
          age: Number(item.age) || 18,
          groupId: Number(item.groupId) || 1,
          status: item.status || 'active'
        }
        next = [newObj, ...list]
      }
      setStorage(STORAGE_KEYS.STUDENTS, next)
      // Guruhdagi talabalar sonini avtomatik sinxronlash
      syncGroupStudentCounts(next)
      return next
    },
    async remove(id) {
      const list = getStorage(STORAGE_KEYS.STUDENTS, INITIAL_DATA.students)
      const next = list.filter((s) => s.id !== id)
      setStorage(STORAGE_KEYS.STUDENTS, next)
      syncGroupStudentCounts(next)
      return next
    }
  },

  // Mentors (O'qituvchilar) API
  mentors: {
    async getAll() {
      return getStorage(STORAGE_KEYS.MENTORS, INITIAL_DATA.mentors)
    },
    async save(item) {
      const list = getStorage(STORAGE_KEYS.MENTORS, INITIAL_DATA.mentors)
      let next
      if (item.id) {
        next = list.map((m) => (m.id === item.id ? { ...m, ...item } : m))
      } else {
        const newObj = {
          ...item,
          id: Date.now(),
          experience: Number(item.experience) || 1
        }
        next = [newObj, ...list]
      }
      setStorage(STORAGE_KEYS.MENTORS, next)
      return next
    },
    async remove(id) {
      const list = getStorage(STORAGE_KEYS.MENTORS, INITIAL_DATA.mentors)
      const next = list.filter((m) => m.id !== id)
      setStorage(STORAGE_KEYS.MENTORS, next)
      return next
    }
  },

  // Courses (Kurslar) API
  courses: {
    async getAll() {
      return getStorage(STORAGE_KEYS.COURSES, INITIAL_DATA.courses)
    },
    async save(item) {
      const list = getStorage(STORAGE_KEYS.COURSES, INITIAL_DATA.courses)
      let next
      if (item.id) {
        next = list.map((c) => (c.id === item.id ? { ...c, ...item } : c))
      } else {
        const newObj = {
          ...item,
          id: Date.now(),
          price: Number(item.price) || 800000,
          mentorId: Number(item.mentorId) || 1,
          level: item.level || 'beginner'
        }
        next = [newObj, ...list]
      }
      setStorage(STORAGE_KEYS.COURSES, next)
      return next
    },
    async remove(id) {
      const list = getStorage(STORAGE_KEYS.COURSES, INITIAL_DATA.courses)
      const next = list.filter((c) => c.id !== id)
      setStorage(STORAGE_KEYS.COURSES, next)
      return next
    }
  },

  // Groups (Guruhlar) API
  groups: {
    async getAll() {
      return getStorage(STORAGE_KEYS.GROUPS, INITIAL_DATA.groups)
    },
    async save(item) {
      const list = getStorage(STORAGE_KEYS.GROUPS, INITIAL_DATA.groups)
      const students = getStorage(STORAGE_KEYS.STUDENTS, INITIAL_DATA.students)
      let next
      if (item.id) {
        const count = students.filter((s) => s.groupId === item.id).length
        next = list.map((g) => (g.id === item.id ? { ...g, ...item, studentCount: count } : g))
      } else {
        const newObj = {
          ...item,
          id: Date.now(),
          courseId: Number(item.courseId) || 1,
          mentorId: Number(item.mentorId) || 1,
          studentCount: 0,
          status: item.status || 'active'
        }
        next = [newObj, ...list]
      }
      setStorage(STORAGE_KEYS.GROUPS, next)
      return next
    },
    async remove(id) {
      const list = getStorage(STORAGE_KEYS.GROUPS, INITIAL_DATA.groups)
      const next = list.filter((g) => g.id !== id)
      setStorage(STORAGE_KEYS.GROUPS, next)
      return next
    }
  },

  backup: {
    export: exportBackupJSON,
    reset: resetDatabase
  }
}

// Guruhlardagi talabalar sonini yangilash
function syncGroupStudentCounts(studentsList) {
  try {
    const groups = getStorage(STORAGE_KEYS.GROUPS, INITIAL_DATA.groups)
    const updated = groups.map((g) => {
      const count = studentsList.filter((s) => s.groupId === g.id).length
      return { ...g, studentCount: count }
    })
    setStorage(STORAGE_KEYS.GROUPS, updated)
  } catch (err) {
    console.error("Guruh sonini yangilashda xato:", err)
  }
}

// Reaktiv Hook
export function useCollection(key, fallback = []) {
  const mappedKey = {
    'students': STORAGE_KEYS.STUDENTS,
    'mentors': STORAGE_KEYS.MENTORS,
    'courses': STORAGE_KEYS.COURSES,
    'groups': STORAGE_KEYS.GROUPS,
    'tom_students': STORAGE_KEYS.STUDENTS,
    'tom_teachers': STORAGE_KEYS.MENTORS,
    'tom_groups': STORAGE_KEYS.GROUPS
  }[key] || key

  const [items, setItems] = useState(() => getStorage(mappedKey, fallback))

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.key === mappedKey || e.detail?.key === 'all') {
        setItems(getStorage(mappedKey, fallback))
      }
    }
    window.addEventListener('jsonschool_store_updated', handleUpdate)
    return () => window.removeEventListener('jsonschool_store_updated', handleUpdate)
  }, [mappedKey, fallback])

  const update = useCallback((updater) => {
    setItems((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      setStorage(mappedKey, next)
      return next
    })
  }, [mappedKey])

  return [items, update]
}
