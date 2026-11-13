import { useState } from 'react'
import { api } from '../data'
import { SkeletonTable, useLoading } from './Skeleton'
import { showToast } from './Toast'

const emptyGroup = {
  name: '',
  courseId: 1,
  mentorId: 1,
  schedule: 'Monday-Wednesday-Friday',
  time: '14:00',
  startDate: '2026-10-01',
  status: 'active'
}

export default function Groups({ groups = [], setGroups, mentors = [], courses = [], students = [] }) {
  const loading = useLoading(400)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyGroup)
  const [search, setSearch] = useState('')

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.schedule.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm({
      ...emptyGroup,
      courseId: courses[0]?.id || 1,
      mentorId: mentors[0]?.id || 1,
      startDate: new Date().toISOString().slice(0, 10)
    })
    setModal(true)
  }

  const openEdit = (group) => {
    setForm(group)
    setModal(true)
  }

  const save = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        courseId: Number(form.courseId),
        mentorId: Number(form.mentorId)
      }
      const updatedList = await api.groups.save(payload)
      setGroups(updatedList)
      setModal(false)
      showToast(form.id ? "Guruh yangilandi!" : "Yangi guruh ochildi!", 'success')
    } catch (_err) {
      showToast("Xatolik yuz berdi", 'danger')
    }
  }

  const remove = async (id, name) => {
    if (window.confirm(`"${name}" guruhini o‘chirishni tasdiqlaysizmi?`)) {
      try {
        const updatedList = await api.groups.remove(id)
        setGroups(updatedList)
        showToast("Guruh o‘chirildi", 'info')
      } catch (_err) {
        showToast("O‘chirishda xatolik", 'danger')
      }
    }
  }

  const getCourseTitle = (courseId) => {
    const c = courses.find((item) => item.id === courseId)
    return c ? c.title : '—'
  }

  const getMentorName = (mentorId) => {
    const m = mentors.find((item) => item.id === mentorId)
    return m ? m.fullName : '—'
  }

  // Haqiqiy o'quvchilar soni
  const getActualCount = (groupId) => {
    return students.filter((s) => s.groupId === groupId).length
  }

  if (loading) return <div className="page"><SkeletonTable rows={5} cols={5} /></div>

  return (
    <div className="page groups-page">
      <div className="table-toolbar">
        <div className="search-box">
          <i className="fas fa-magnifying-glass search-icon" />
          <input
            className="search-input"
            placeholder="Guruh nomi yoki dars jadvali bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-add" onClick={openAdd}>
          <i className="fas fa-plus" /> Yangi Guruh
        </button>
      </div>

      <div className="filter-summary-bar">
        <span>Jami: <b>{filtered.length}</b> ta guruh mavjud</span>
      </div>

      <div className="cards-grid">
        {filtered.map((g) => {
          const studentCount = getActualCount(g.id)
          const isActive = g.status === 'active'

          return (
            <div className="card group-card" key={g.id}>
              <div className="group-head">
                <span className="chip chip-accent">{getCourseTitle(g.courseId)}</span>
                <span className={`status-pill ${isActive ? 'pill-paid' : 'pill-debt'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="group-title">{g.name}</h3>

              <div className="group-info-stack">
                <div className="group-line">
                  <i className="fas fa-chalkboard-user text-primary" />
                  <span>Mentor: <b>{getMentorName(g.mentorId)}</b></span>
                </div>
                <div className="group-line">
                  <i className="fas fa-calendar-days text-primary" />
                  <span>{g.schedule}</span>
                </div>
                <div className="group-line">
                  <i className="fas fa-clock text-primary" />
                  <span>Vaqti: {g.time}</span>
                </div>
                <div className="group-line">
                  <i className="fas fa-calendar-check text-primary" />
                  <span>Boshlanishi: {g.startDate}</span>
                </div>
                <div className="group-line">
                  <i className="fas fa-user-graduate text-primary" />
                  <span>Talabalar soni: <b>{studentCount} nafar</b></span>
                </div>
              </div>

              <div className="group-actions-footer">
                <button className="btn-card-action edit" onClick={() => openEdit(g)}>
                  <i className="fas fa-pen-to-square" /> Tahrirlash
                </button>
                <button className="btn-card-action delete" onClick={() => remove(g.id, g.name)}>
                  <i className="fas fa-trash-can" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <i className="fas fa-users-rectangle" />
                <h3>{form.id ? 'Guruhni tahrirlash' : 'Yangi guruh ochish'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setModal(false)}>
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={save} className="modal-body-form">
              <div className="form-group">
                <label>Guruh nomi (name) *</label>
                <input
                  required
                  placeholder="Masalan: Frontend-101"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-row cols-2">
                <div className="form-group">
                  <label>Kurs (courseId)</label>
                  <select
                    value={form.courseId}
                    onChange={(e) => setForm({ ...form, courseId: Number(e.target.value) })}
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Mentor (mentorId)</label>
                  <select
                    value={form.mentorId}
                    onChange={(e) => setForm({ ...form, mentorId: Number(e.target.value) })}
                  >
                    {mentors.map((m) => (
                      <option key={m.id} value={m.id}>{m.fullName} ({m.specialty})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row cols-2">
                <div className="form-group">
                  <label>Kunlar jadvali (schedule)</label>
                  <input
                    required
                    placeholder="Monday-Wednesday-Friday"
                    value={form.schedule}
                    onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Dars vaqti (time)</label>
                  <input
                    required
                    placeholder="14:00"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row cols-2">
                <div className="form-group">
                  <label>Boshlanish sanasi (startDate)</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Holati (status)</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="active">Active (Faol)</option>
                    <option value="inactive">Inactive (Nofaol)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-check" /> Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
