import { useState } from 'react'
import { api } from '../data'
import { SkeletonTable, useLoading } from './Skeleton'
import { showToast } from './Toast'

const emptyMentor = {
  fullName: '',
  email: '',
  specialty: 'Frontend Developer',
  experience: 3,
  phone: ''
}

export default function Teachers({ mentors = [], setMentors, courses = [], groups = [] }) {
  const loading = useLoading(400)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyMentor)
  const [search, setSearch] = useState('')

  const filtered = mentors.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.specialty.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(emptyMentor)
    setModal(true)
  }

  const openEdit = (mentor) => {
    setForm(mentor)
    setModal(true)
  }

  const save = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        experience: Number(form.experience)
      }
      const updatedList = await api.mentors.save(payload)
      setMentors(updatedList)
      setModal(false)
      showToast(form.id ? "Mentor yangilandi!" : "Yangi mentor muvaffaqiyatli qo‘shildi!", 'success')
    } catch (_err) {
      showToast("Xatolik yuz berdi", 'danger')
    }
  }

  const remove = async (id, fullName) => {
    if (window.confirm(`"${fullName}" mentorni tizimdan o‘chirishni xohlaysizmi?`)) {
      try {
        const updatedList = await api.mentors.remove(id)
        setMentors(updatedList)
        showToast("Mentor o‘chirildi", 'info')
      } catch (_err) {
        showToast("O‘chirishda xatolik", 'danger')
      }
    }
  }

  const getMentorCourses = (mentorId) => {
    return courses.filter((c) => c.mentorId === mentorId)
  }

  const getMentorGroups = (mentorId) => {
    return groups.filter((g) => g.mentorId === mentorId)
  }

  if (loading) return <div className="page"><SkeletonTable rows={4} cols={5} /></div>

  return (
    <div className="page teachers-page">
      <div className="table-toolbar">
        <div className="search-box">
          <i className="fas fa-magnifying-glass search-icon" />
          <input
            className="search-input"
            placeholder="Mentor ismi, mutaxassisligi yoki emaili bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-add" onClick={openAdd}>
          <i className="fas fa-plus" /> Yangi Mentor
        </button>
      </div>

      <div className="filter-summary-bar">
        <span>Jami: <b>{filtered.length}</b> nafar tajribali mentor</span>
      </div>

      <div className="teachers-grid">
        {filtered.map((m) => {
          const initials = m.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2)
          const mCourses = getMentorCourses(m.id)
          const mGroups = getMentorGroups(m.id)

          return (
            <div className="card teacher-card" key={m.id}>
              <div className="teacher-card-head">
                <div className="teacher-avatar">
                  {initials}
                </div>
                <div className="teacher-rating-badge">
                  <i className="fas fa-certificate" /> {m.experience} yil
                </div>
              </div>

              <div className="teacher-body">
                <h3 className="teacher-name">{m.fullName}</h3>
                <span className="chip chip-accent teacher-subject-chip">{m.specialty}</span>

                <div className="teacher-details-list">
                  <div className="t-detail-item">
                    <i className="fas fa-envelope" />
                    <span>{m.email}</span>
                  </div>
                  <div className="t-detail-item">
                    <i className="fas fa-phone" />
                    <span>{m.phone}</span>
                  </div>
                  <div className="t-detail-item">
                    <i className="fas fa-laptop-code" />
                    <span>Kurslar: {mCourses.map((c) => c.title).join(', ') || 'Biriktirilmagan'}</span>
                  </div>
                  <div className="t-detail-item">
                    <i className="fas fa-users-rectangle" />
                    <span>Guruhlar: {mGroups.map((g) => g.name).join(', ') || 'Mavjud emas'}</span>
                  </div>
                </div>
              </div>

              <div className="teacher-card-footer">
                <button className="btn-card-action edit" onClick={() => openEdit(m)}>
                  <i className="fas fa-pen-to-square" /> Tahrirlash
                </button>
                <button className="btn-card-action delete" onClick={() => remove(m.id, m.fullName)}>
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
                <i className="fas fa-chalkboard-user" />
                <h3>{form.id ? 'Mentorni tahrirlash' : 'Yangi mentor qo‘shish'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setModal(false)}>
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={save} className="modal-body-form">
              <div className="form-group">
                <label>F.I.Sh. (fullName) *</label>
                <input
                  required
                  placeholder="Masalan: Akmal Mordayev"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>

              <div className="form-row cols-2">
                <div className="form-group">
                  <label>Mutaxassislik (specialty) *</label>
                  <input
                    required
                    placeholder="Frontend Developer, Backend Developer..."
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tajriba yillari (experience) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row cols-2">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    required
                    type="email"
                    placeholder="mentor@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Telefon raqam *</label>
                  <input
                    required
                    placeholder="+998901234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
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
