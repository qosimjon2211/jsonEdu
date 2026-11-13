import { useState } from 'react'
import { api } from '../data'
import { SkeletonCard, useLoading } from './Skeleton'
import { showToast } from './Toast'

const emptyCourse = {
  title: '',
  description: '',
  duration: '6 months',
  price: 800000,
  level: 'beginner',
  mentorId: 1
}

export default function Subjects({ courses = [], setCourses, mentors = [], groups = [] }) {
  const loading = useLoading(400)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyCourse)

  const openAdd = () => {
    setForm({ ...emptyCourse, mentorId: mentors[0]?.id || 1 })
    setModal(true)
  }

  const openEdit = (course) => {
    setForm(course)
    setModal(true)
  }

  const save = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        mentorId: Number(form.mentorId)
      }
      const updatedList = await api.courses.save(payload)
      setCourses(updatedList)
      setModal(false)
      showToast(form.id ? "Kurs yangilandi!" : "Yangi kurs muvaffaqiyatli qo‘shildi!", 'success')
    } catch (_err) {
      showToast("Xatolik yuz berdi", 'danger')
    }
  }

  const remove = async (id, title) => {
    if (window.confirm(`"${title}" kursini o‘chirishni tasdiqlaysizmi?`)) {
      try {
        const updatedList = await api.courses.remove(id)
        setCourses(updatedList)
        showToast("Kurs o‘chirildi", 'info')
      } catch (_err) {
        showToast("O‘chirishda xatolik", 'danger')
      }
    }
  }

  const getMentorName = (mentorId) => {
    const m = mentors.find((item) => item.id === mentorId)
    return m ? m.fullName : '—'
  }

  const getCourseGroups = (courseId) => {
    return groups.filter((g) => g.courseId === courseId)
  }

  if (loading) {
    return (
      <div className="page">
        <div className="stats-grid cols-3">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} lines={4} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="page courses-page">
      <div className="table-toolbar">
        <div>
          <span className="toolbar-title">JsonSchool O‘quv Kurslari</span>
        </div>
        <button className="btn btn-primary btn-add" onClick={openAdd}>
          <i className="fas fa-plus" /> Yangi Kurs
        </button>
      </div>

      <div className="stats-grid cols-3">
        {courses.map((c) => {
          const cGroups = getCourseGroups(c.id)
          const totalStudentsInCourse = cGroups.reduce((acc, g) => acc + (g.studentCount || 0), 0)

          return (
            <div className="card subject-card" key={c.id}>
              <div className="subject-icon-box">
                <i className={c.id === 1 ? 'fas fa-code' : c.id === 2 ? 'fas fa-server' : 'fas fa-palette'} />
              </div>
              <div className="subject-level-badge">{c.level}</div>
              
              <h3 className="subject-title">{c.title}</h3>
              <p className="subject-desc">{c.description}</p>

              <div className="course-price-tag">
                <span className="price-num">{Number(c.price).toLocaleString()}</span>
                <span className="price-unit">so'm / oy</span>
              </div>

              <div className="subject-meta-grid">
                <div className="meta-box">
                  <i className="fas fa-clock" />
                  <span>{c.duration}</span>
                </div>
                <div className="meta-box">
                  <i className="fas fa-chalkboard-user" />
                  <span>{getMentorName(c.mentorId)}</span>
                </div>
                <div className="meta-box">
                  <i className="fas fa-users-rectangle" />
                  <span>{cGroups.length} guruh</span>
                </div>
                <div className="meta-box">
                  <i className="fas fa-user-graduate" />
                  <span>{totalStudentsInCourse} talaba</span>
                </div>
              </div>

              <div className="course-card-actions">
                <button className="btn-card-action edit" onClick={() => openEdit(c)}>
                  <i className="fas fa-pen-to-square" /> Tahrirlash
                </button>
                <button className="btn-card-action delete" onClick={() => remove(c.id, c.title)}>
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
                <i className="fas fa-laptop-code" />
                <h3>{form.id ? 'Kursni tahrirlash' : 'Yangi kurs qo‘shish'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setModal(false)}>
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={save} className="modal-body-form">
              <div className="form-group">
                <label>Kurs nomi (title) *</label>
                <input
                  required
                  placeholder="Masalan: Frontend Development"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Tavsif (description) *</label>
                <input
                  required
                  placeholder="HTML, CSS, JavaScript va React..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-row cols-2">
                <div className="form-group">
                  <label>Davomiyligi (duration)</label>
                  <input
                    required
                    placeholder="6 months"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Oylik to‘lov (price) so'm</label>
                  <input
                    type="number"
                    step="10000"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row cols-2">
                <div className="form-group">
                  <label>Daraja (level)</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mas'ul Mentor (mentorId)</label>
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
