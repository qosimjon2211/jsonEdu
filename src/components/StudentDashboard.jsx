import { useLoading, SkeletonCard } from './Skeleton'

export default function StudentDashboard({ user, groups = [], courses = [], mentors = [], students = [] }) {
  const loading = useLoading(400)
  const group = groups.find((g) => g.id === user.groupId)
  const course = courses.find((c) => c.id === group?.courseId)
  const mentor = mentors.find((m) => m.id === group?.mentorId)
  const classmates = students.filter((s) => s.groupId === user.groupId && s.id !== user.id)

  if (loading) {
    return (
      <div className="page">
        <div className="stats-grid cols-2">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </div>
        <SkeletonCard lines={5} />
      </div>
    )
  }

  const initials = user.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2)

  return (
    <div className="page student-portal-page">
      {/* O'quvchi xush kelibsiz banneri */}
      <div className="dashboard-hero student-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-sparkles" /> JsonSchool Talaba Portali
          </div>
          <h1>Salom, {user.fullName}! 👋</h1>
          <p>
            Siz <b>{course?.title || 'Dasturlash'}</b> yo‘nalishida tahsil olmoqdasiz. Dars jadvalingiz va guruhingiz ma’lumotlari quyida keltirilgan.
          </p>
        </div>
        <div className="student-profile-badge">
          <div className="avatar-lg-circle">{initials}</div>
          <div className="badge-details">
            <span className="badge-name">{user.fullName}</span>
            <span className="badge-group">{group?.name || 'Guruh'}</span>
          </div>
        </div>
      </div>

      <div className="stats-grid cols-2">
        {/* Guruh ma'lumotlari */}
        <div className="card">
          <div className="card-header-clean">
            <h3>Sizning Guruhingiz</h3>
            <span className="chip chip-accent">{group?.status === 'active' ? 'Faol Guruh' : 'Nofaol'}</span>
          </div>

          <div className="portal-info-box">
            <div className="portal-info-title">{group?.name || '—'}</div>
            <div className="portal-course-title">{course?.title}</div>
            <p className="portal-course-desc">{course?.description}</p>
          </div>

          <div className="group-info-stack">
            <div className="group-line">
              <i className="fas fa-chalkboard-user text-primary" />
              <span>Mentor: <b>{mentor?.fullName || '—'}</b> ({mentor?.specialty})</span>
            </div>
            <div className="group-line">
              <i className="fas fa-phone text-primary" />
              <span>Aloqa: {mentor?.phone}</span>
            </div>
            <div className="group-line">
              <i className="fas fa-envelope text-primary" />
              <span>Email: {mentor?.email}</span>
            </div>
          </div>
        </div>

        {/* Dars Jadvali */}
        <div className="card">
          <div className="card-header-clean">
            <h3>Dars Jadvali va Vaqti</h3>
            <span className="chip chip-accent">{course?.duration}</span>
          </div>

          <div className="schedule-highlight-box">
            <div className="schedule-icon-wrap">
              <i className="fas fa-calendar-check" />
            </div>
            <div>
              <div className="schedule-day-text">{group?.schedule || 'Belgilanmagan'}</div>
              <div className="schedule-time-text"><i className="fas fa-clock" /> Soat: {group?.time}</div>
            </div>
          </div>

          <div className="group-info-stack" style={{ marginTop: 20 }}>
            <div className="group-line">
              <i className="fas fa-layer-group text-primary" />
              <span>Daraja: <b>{course?.level?.toUpperCase()}</b></span>
            </div>
            <div className="group-line">
              <i className="fas fa-wallet text-primary" />
              <span>Kurs narxi: <b>{course?.price?.toLocaleString()} so'm / oy</b></span>
            </div>
            <div className="group-line">
              <i className="fas fa-hourglass-start text-primary" />
              <span>Boshlangan sana: {group?.startDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guruhdoshlar */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header-clean">
          <h3>Guruhdoshlar ({classmates.length + 1} nafar)</h3>
          <span className="card-badge">{group?.name}</span>
        </div>

        <ul className="mini-list modern-classmate-list">
          <li className="classmate-item active-user">
            <div className="avatar sm">{initials}</div>
            <div className="mini-name">
              <b>{user.fullName}</b>
              <span className="chip chip-accent" style={{ marginLeft: 8 }}>Siz</span>
            </div>
            <span className="classmate-meta">{user.phone}</span>
          </li>
          {classmates.map((s) => {
            const cInitials = s.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2)
            return (
              <li key={s.id} className="classmate-item">
                <div className="avatar sm">{cInitials}</div>
                <div className="mini-name">{s.fullName}</div>
                <span className="classmate-meta">{s.phone}</span>
                <span className="status-pill pill-paid">Faol</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
