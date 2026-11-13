import { delay, ApiResponse } from './client'
import { getStorage, setStorage, STORAGE_KEYS } from '../data/storage'
import { INITIAL_TEACHERS } from '../data/initialData'

export const teachersApi = {
  async getAll(params = {}) {
    await delay()
    const { search = '', subject = '' } = params
    let list = getStorage(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS)

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        (t.email && t.email.toLowerCase().includes(q))
      )
    }

    if (subject && subject !== 'all') {
      list = list.filter((t) => t.subject === subject)
    }

    return ApiResponse.ok(list, "O'qituvchilar ro'yxati olindi")
  },

  async getById(id) {
    await delay()
    const list = getStorage(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS)
    const item = list.find((t) => t.id === Number(id))
    if (!item) return ApiResponse.error("O'qituvchi topilmadi", 404)
    return ApiResponse.ok(item)
  },

  async create(data) {
    await delay()
    if (!data.name || !data.phone) {
      return ApiResponse.error("Ism va telefon raqami talab etiladi", 422)
    }

    const list = getStorage(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS)
    const newTeacher = {
      id: Date.now(),
      name: data.name.trim(),
      subject: data.subject || 'Frontend Dasturlash',
      experience: Number(data.experience) || 1,
      phone: data.phone.trim(),
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@jsonschool.uz`,
      rating: Number(data.rating) || 5.0,
      status: data.status || 'Faol',
      salary: Number(data.salary) || 8000000,
      bio: data.bio || 'JsonSchool yetakchi ustozi'
    }

    const updated = [newTeacher, ...list]
    setStorage(STORAGE_KEYS.TEACHERS, updated)
    return ApiResponse.created(newTeacher, "Yangi o'qituvchi muvaffaqiyatli qo'shildi")
  },

  async update(id, data) {
    await delay()
    const list = getStorage(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS)
    const index = list.findIndex((t) => t.id === Number(id))
    if (index === -1) return ApiResponse.error("O'qituvchi topilmadi", 404)

    list[index] = { ...list[index], ...data }
    setStorage(STORAGE_KEYS.TEACHERS, list)
    return ApiResponse.ok(list[index], "O'qituvchi yangilandi")
  },

  async delete(id) {
    await delay()
    const numId = Number(id)
    const list = getStorage(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS)
    const filtered = list.filter((t) => t.id !== numId)
    setStorage(STORAGE_KEYS.TEACHERS, filtered)
    return ApiResponse.ok({ id: numId }, "O'qituvchi o'chirildi")
  }
}
