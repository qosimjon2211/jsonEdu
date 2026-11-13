import { useMemo, useState } from 'react'
import { api } from '../data'
import { SkeletonTable, useLoading } from './Skeleton'
import { showToast } from './Toast'

const emptyStudent = {
  fullName: '',
  email: '',
  phone: '',
  age: 18,
  groupId: 1,
  status: 'active'
}

export default function Students({ students = [], setStudents, groups = [] }) {
  const loading = useLoading(400)
  const [q, setQ] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyStudent)

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim()
    return students.filter((x) => {
      const matchSearch =
        !s ||
        x.fullName.toLowerCase().includes(s) ||
        x.email.toLowerCase().includes(s) ||
        x.phone.includes(s)

      const matchGroup = groupFilter === 'all' || x.groupId === Number(groupFilter)
      const matchStatus = statusFilter === 'all' || x.status === statusFilter

      return matchSearch && matchGroup && matchStatus
    })
  }, [students, q, groupFilter, statusFilter])

  const openAdd = () => {
    setForm({ ...emptyStudent, groupId: groups[0]?.id || 1 })
    setModal(true)
  }

  const openEdit = (student) => {
    setForm(student)
    setModal(true)
  }

  const save = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        groupId: Number(form.groupId)
      }
      const updatedList = await api.students.save(payload)
      setStudents(updatedList)
      setModal(false)
      showToast(form.id ? "O‘quvchi yangilandi!" : "Yangi o‘quvchi qo‘shildi!", 'success')
    } catch (err) {
      showToast(err.message || "Xatolik yuz berdi", 'danger')
    }
  }

  const remove = async (id, fullName) => {
    if (window.confirm(`"${fullName}" o‘quvchisini o‘chirishni tasdiqlaysizmi?`)) {
      try {
        const updatedList = await api.students.remove(id)
        setStudents(updatedList)
        showToast("O‘quvchi tizimdan o‘chirildi", 'info')
      } catch (_err) {
        showToast("O‘chirishda xatolik", 'danger')
      }
    }
  }

  const getGroupName = (groupId) => {
    const g = groups.find((grp) => grp.id === groupId)
    return g ? g.name : '—'
  }

  if (loading) return <div className="page"><SkeletonTable rows={6} cols={6} /></div>

  return (
    <div className="page students-page">
      {/* Qidiruv va Filtrlar */}
      <div className="table-toolbar">
        <div className="search-box">
          <i className="fas fa-magnifying-glass search-icon" />
          <input
            className="search-input"
            placeholder="Ism, email yoki telefon orqali qidirish..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button className="clear-search-btn" onClick={() => setQ('')}>
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        <div className="filter-group">
          <select
            className="select-filter"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="all">Barcha guruhlar</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <select
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Barcha holatlar</option>
            <option value="active">Faol (Active)</option>
            <option value="inactive">Nofaol (Inactive)</option>
          </select>

          <button className="btn btn-primary btn-add" onClick={openAdd}>
            <i className="fas fa-plus" /> Yangi O‘quvchi
          </button>
        </div>
      </div>

      <div className="filter-summary-bar">
        <span>Natija: <b>{filtered.length}</b> nafar talaba</span>
        <div className="summary-tags">
          <span className="summary-tag tag-success">
            Faol: {filtered.filter((s) => s.status === 'active').length}
          </span>
          <span className="summary-tag tag-warning">
            Nofaol: {filtered.filter((s) => s.status === 'inactive').length}
          </span>
        </div>
      </div>

      {/* Jadval */}
      <div className="card table-card">
        <div className="modern-table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>O‘quvchi F.I.Sh</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Yoshi</th>
                <th>Biriktirilgan Guruh</th>
                <th>Holat</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const initials = s.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2)
                const isActive = s.status === 'active'

                return (
                  <tr key={s.id}>
                    <td>
                      <div className="table-user-cell">
                        <div className="avatar-sm-circle">{initials}</div>
                        <div>
                          <div className="user-name-cell">{s.fullName}</div>
                          <div className="user-sub-cell">ID: #{s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="email-cell">
                        <i className="fas fa-envelope fa-xs" /> {s.email}
                      </span>
                    </td>
                    <td>
                      <span className="phone-badge">
                        <i className="fas fa-phone-volume" /> {s.phone}
                      </span>
                    </td>
                    <td>
                      <span className="age-pill">{s.age} yosh</span>
                    </td>
                    <td>
                      <span className="chip chip-accent">{getGroupName(s.groupId)}</span>
                    </td>
                    <td>
                      <span className={`status-pill ${isActive ? 'pill-paid' : 'pill-debt'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-cell">
                        <button className="action-btn edit" onClick={() => openEdit(s)} title="Tahrirlash">
                          <i className="fas fa-pen-to-square" />
                        </button>
                        <button className="action-btn delete" onClick={() => remove(s.id, s.fullName)} title="O‘chirish">
                          <i className="fas fa-trash-can" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!filtered.length && (
                <tr>
                  <td colSpan={7} className="table-empty-cell">
                    <i className="fas fa-magnifying-glass fa-2x" />
                    <p>Hech narsa topilmadi</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <i className={form.id ? "fas fa-user-pen" : "fas fa-user-plus"} />
                <h3>{form.id ? 'O‘quvchini tahrirlash' : 'Yangi o‘quvchi qo‘shish'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setModal(false)}>
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={save} className="modal-body-form">
              <div className="form-row cols-2">
                <div className="form-group">
                  <label>F.I.Sh. (fullName) *</label>
                  <input
                    required
                    placeholder="Masalan: Ali Valiyev"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    required
                    type="email"
                    placeholder="ali@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row cols-2">
                <div className="form-group">
                  <label>Telefon raqam *</label>
                  <input
                    required
                    placeholder="+998901112233"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Yoshi (age) *</label>
                  <input
                    required
                    type="number"
                    min="6"
                    max="80"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row cols-2">
                <div className="form-group">
                  <label>Guruh (groupId)</label>
                  <select
                    value={form.groupId}
                    onChange={(e) => setForm({ ...form, groupId: Number(e.target.value) })}
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
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
