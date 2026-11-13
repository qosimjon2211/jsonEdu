import { delay, ApiResponse } from './client'
import { getStorage, setStorage, STORAGE_KEYS } from '../data/storage'
import { INITIAL_STUDENTS } from '../data/initialData'

export const studentsApi = {
  // Barcha o'quvchilarni qidiruv va filtr bilan olish
  async getAll(params = {}) {
    await delay()
    const { search = '', subject = '', status = '', paymentStatus = '', groupId = '' } = params
    let list = getStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        (s.parent && s.parent.toLowerCase().includes(q))
      )
    }

    if (subject && subject !== 'all') {
      list = list.filter((s) => s.subject === subject)
    }

    if (status && status !== 'all') {
      list = list.filter((s) => s.status === status)
    }

    if (paymentStatus && paymentStatus !== 'all') {
      list = list.filter((s) => s.paymentStatus === paymentStatus)
    }

    if (groupId && groupId !== 'all') {
      list = list.filter((s) => s.groupId === Number(groupId))
    }

    return ApiResponse.ok(list, "O'quvchilar ro'yxati olindi", { total: list.length })
  },

  // ID bo'yicha olish
  async getById(id) {
    await delay()
    const list = getStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
    const item = list.find((s) => s.id === Number(id))
    if (!item) return ApiResponse.error("O'quvchi topilmadi", 404)
    return ApiResponse.ok(item)
  },

  // Yangi o'quvchi qo'shish
  async create(data) {
    await delay()
    if (!data.name || !data.phone) {
      return ApiResponse.error("Ism va telefon raqami majburiy!", 422)
    }

    const list = getStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
    const newStudent = {
      id: Date.now(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      subject: data.subject || 'Frontend Dasturlash',
      group: data.group || '',
      groupId: data.groupId ? Number(data.groupId) : null,
      level: data.level || "Boshlang'ich (A1)",
      parent: data.parent || '',
      status: data.status || 'Faol',
      paymentStatus: data.paymentStatus || 'Kutilmoqda',
      balance: data.balance !== undefined ? Number(data.balance) : 0,
      attendanceRate: 100,
      registeredAt: new Date().toISOString().slice(0, 10),
      notes: data.notes || ''
    }

    const updated = [newStudent, ...list]
    setStorage(STORAGE_KEYS.STUDENTS, updated)

    // Guruhga o'quvchi ID sini biriktirish
    if (newStudent.groupId) {
      syncStudentToGroup(newStudent.groupId, newStudent.id, 'add')
    }

    return ApiResponse.created(newStudent, "O'quvchi muvaffaqiyatli qo'shildi!")
  },

  // O'quvchini yangilash
  async update(id, data) {
    await delay()
    const list = getStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
    const index = list.findIndex((s) => s.id === Number(id))
    if (index === -1) return ApiResponse.error("O'quvchi topilmadi", 404)

    const oldStudent = list[index]
    const updatedStudent = { ...oldStudent, ...data }
    list[index] = updatedStudent
    setStorage(STORAGE_KEYS.STUDENTS, list)

    // Agar guruh o'zgargan bo'lsa, guruhlar tarkibini sinxronlashtirish
    if (oldStudent.groupId !== updatedStudent.groupId) {
      if (oldStudent.groupId) syncStudentToGroup(oldStudent.groupId, oldStudent.id, 'remove')
      if (updatedStudent.groupId) syncStudentToGroup(updatedStudent.groupId, updatedStudent.id, 'add')
    }

    return ApiResponse.ok(updatedStudent, "O'quvchi ma'lumotlari yangilandi")
  },

  // O'chirish
  async delete(id) {
    await delay()
    const numId = Number(id)
    const list = getStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
    const student = list.find((s) => s.id === numId)
    if (!student) return ApiResponse.error("O'quvchi topilmadi", 404)

    const filtered = list.filter((s) => s.id !== numId)
    setStorage(STORAGE_KEYS.STUDENTS, filtered)

    // Guruhdan chiqarish
    if (student.groupId) {
      syncStudentToGroup(student.groupId, numId, 'remove')
    }

    return ApiResponse.ok({ id: numId }, "O'quvchi o'chirildi")
  }
}

function syncStudentToGroup(groupId, studentId, action) {
  try {
    const groups = getStorage(STORAGE_KEYS.GROUPS, [])
    const gIndex = groups.findIndex((g) => g.id === Number(groupId))
    if (gIndex === -1) return

    const g = groups[gIndex]
    const currentStudents = Array.isArray(g.students) ? [...g.students] : []

    if (action === 'add') {
      if (!currentStudents.includes(studentId)) {
        currentStudents.push(studentId)
      }
    } else if (action === 'remove') {
      const idx = currentStudents.indexOf(studentId)
      if (idx !== -1) currentStudents.splice(idx, 1)
    }

    groups[gIndex] = { ...g, students: currentStudents }
    setStorage(STORAGE_KEYS.GROUPS, groups)
  } catch (err) {
    console.error("Guruh bilan sinxronizatsiya xatosi:", err)
  }
}
