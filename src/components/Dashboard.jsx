import { useLoading, SkeletonCard } from './Skeleton'
import { api } from '../data'
import { showToast } from './Toast'

export default function Dashboard({ students = [], mentors = [], courses = [], groups = [], setPage }) {
  const loading = useLoading(500)

  if (loading) {
    return (
      <div className="page dashboard-page">
        <div className="stats-grid">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} lines={1} />)}
        </div>
        <div className="stats-grid cols-2">
          <SkeletonCard lines={5} />
          <SkeletonCard lines={5} />
        </div>
      </div>
    )
  }

  const activeStudents = students.filter((s) => s.status === 'active').length
  const inactiveStudents = students.filter((s) => s.status === 'inactive').length

  const stats = [
    {
      id: 'students',
      label: 'O‘quvchilar',
      value: students.length,
      sub: `${activeStudents} ta faol, ${inactiveStudents} ta nofaol`,
      icon: 'fas fa-user-graduate',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      glow: 'rgba(99, 102, 241, 0.25)',
      trend: `${Math.round((activeStudents / (students.length || 1)) * 100)}% faol`
    },
    {
      id: 'mentors',
      label: 'Mentorlar',
      value: mentors.length,
      sub: 'Frontend, Backend, UI/UX',
      icon: 'fas fa-chalkboard-user',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      glow: 'rgba(6, 182, 212, 0.25)',
      trend: 'Top mutaxassislar'
    },
    {
      id: 'courses',
      label: 'Kurslar',
      value: courses.length,
      sub: 'Amaliy dasturlar',
      icon: 'fas fa-laptop-code',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      glow: 'rgba(236, 72, 153, 0.25)',
      trend: 'Talab yuqori'
    },
    {
      id: 'groups',
      label: 'Faol Guruhlar',
      value: groups.length,
      sub: 'Darslar reja asosida',
      icon: 'fas fa-users-rectangle',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      glow: 'rgba(139, 92, 246, 0.25)',
      trend: '100% jadvalda'
    },
  ]

  // Kurslar bo'yicha o'quvchilar sonini aniqlash
  const getCourseStudentCount = (courseId) => {
    const courseGroups = groups.filter((g) => g.courseId === courseId).map((g) => g.id)
    return students.filter((s) => courseGroups.includes(s.groupId)).length
  }

  // Guruh nomini topish
  const getGroupName = (groupId) => {
    const g = groups.find((grp) => grp.id === groupId)
    return g ? g.name : '—'
  }

  return (
    <div className="page dashboard-page">
      {/* Banner */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-sparkles" /> JsonSchool Boshqaruv Paneli
          </div>
          <h1>Xush kelibsiz, Qosim Nematjonov! 👋</h1>
          <p>
            O‘quvchilar, mentorlar, kurslar va guruhlar ma’lumotlari real vaqt rejimida boshqarilmoqda.
          </p>
          <div className="hero-actions">
            {setPage && (
              <>
                <button className="btn btn-hero-primary" onClick={() => setPage('students')}>
                  <i className="fas fa-user-plus" /> O‘quvchi qo‘shish
                </button>
                <button className="btn btn-hero-secondary" onClick={() => setPage('groups')}>
                  <i className="fas fa-layer-group" /> Yangi guruh
                </button>
              </>
            )}
            <button className="btn btn-hero-outline" onClick={() => { api.backup.export(); showToast("Zaxira nusxasi yuklandi!"); }}>
              <i className="fas fa-file-arrow-down" /> JSON Eksport
            </button>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="hero-logo-box">
            <span className="code-bracket">{`{`}</span>
            <span className="code-core">JSON</span>
            <span className="code-bracket">{`}`}</span>
          </div>
        </div>
      </div>

      {/* KPI Kartalari */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="card stat-card" key={s.id} style={{ '--card-glow': s.glow }}>
            <div className="stat-card-top">
              <div className="stat-icon-wrap" style={{ background: s.gradient }}>
                <i className={s.icon} />
              </div>
              <span className="stat-trend">{s.trend}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* 2 Ustunli Tafsilotlar */}
      <div className="stats-grid cols-2">
        {/* Kurslar Ko'rsatkichlari */}
        <div className="card analytics-card">
          <div className="card-header-clean">
            <div>
              <h3>Kurslar & O‘quvchilar Taqsimoti</h3>
              <p className="card-subtitle">Har bir kurs bo‘yicha o‘qiyotgan talabalar</p>
            </div>
            {setPage && (
              <button className="link" onClick={() => setPage('courses')}>
                Barchasi <i className="fas fa-arrow-right" />
              </button>
            )}
          </div>

          <div className="course-progress-list">
            {courses.map((c) => {
              const count = getCourseStudentCount(c.id)
              const pct = students.length ? Math.round((count / students.length) * 100) : 0
              const mentor = mentors.find((m) => m.id === c.mentorId)

              return (
                <div className="course-prog-item" key={c.id}>
                  <div className="prog-header">
                    <div className="prog-title-group">
                      <span className="prog-icon">
                        <i className="fas fa-code" />
                      </span>
                      <div>
                        <span className="prog-name">{c.title}</span>
                        <div className="prog-mentor-sub">Mentor: {mentor?.fullName || '—'}</div>
                      </div>
                    </div>
                    <div className="prog-meta">
                      <span className="prog-students">{count} o‘quvchi</span>
                      <span className="chip chip-accent">{c.price.toLocaleString()} so'm</span>
                    </div>
                  </div>
                  <div className="prog-bar-track">
                    <div
                      className="prog-bar-fill"
                      style={{ width: `${Math.max(pct, 15)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* So'nggi O'quvchilar */}
        <div className="card analytics-card">
          <div className="card-header-clean">
            <div>
              <h3>Ro‘yxatdagi O‘quvchilar</h3>
              <p className="card-subtitle">Oxirgi qo‘shilgan va faol o‘quvchilar</p>
            </div>
            {setPage && (
              <button className="link" onClick={() => setPage('students')}>
                Barchasi <i className="fas fa-arrow-right" />
              </button>
            )}
          </div>

          <ul className="modern-student-list">
            {students.slice(0, 5).map((s) => {
              const initials = s.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2)
              const isActive = s.status === 'active'

              return (
                <li key={s.id} className="student-list-item">
                  <div className="student-avatar-gradient">
                    {initials}
                  </div>
                  <div className="student-details">
                    <div className="student-name-row">
                      <span className="student-fullname">{s.fullName}</span>
                      <span className={`status-pill ${isActive ? 'pill-paid' : 'pill-debt'}`}>
                        {isActive ? 'Faol' : 'Nofaol'}
                      </span>
                    </div>
                    <div className="student-meta-row">
                      <span><i className="fas fa-phone fa-xs" /> {s.phone}</span>
                      <span className="meta-dot">•</span>
                      <span className="student-group-chip">{getGroupName(s.groupId)}</span>
                      <span className="meta-dot">•</span>
                      <span>{s.age} yosh</span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
