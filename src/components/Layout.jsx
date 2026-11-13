import { useState } from 'react'
import { api } from '../data'
import { showToast } from './Toast'

const NAV = [
  { id: 'dashboard', label: 'Bosh sahifa', icon: 'fas fa-gauge-high' },
  { id: 'students', label: 'O‘quvchilar', icon: 'fas fa-user-graduate' },
  { id: 'mentors', label: 'Mentorlar', icon: 'fas fa-chalkboard-user' },
  { id: 'courses', label: 'Kurslar', icon: 'fas fa-laptop-code' },
  { id: 'groups', label: 'Guruhlar', icon: 'fas fa-users-rectangle' },
]

export default function Layout({ page, setPage, onLogout, theme, onToggleTheme, children, counts = {} }) {
  const [open, setOpen] = useState(false)
  const current = NAV.find((n) => n.id === page)

  const handleExport = () => {
    api.backup.export()
    showToast("JsonSchool API ma'lumotlari zaxiraga yuklab olindi!", 'success')
  }

  const handleReset = () => {
    if (window.confirm("Barcha ma'lumotlarni JsonSchool boshlang'ich API holatiga qaytarishni xohlaysizmi?")) {
      api.backup.reset()
      showToast("Barcha API ma'lumotlari dastlabki holatga qaytarildi!", 'info')
    }
  }

  return (
    <div className="layout">
      {/* Yon panel (Sidebar) */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo-box">
            <span className="code-bracket">{`{`}</span>
            <span className="code-core">JSON</span>
            <span className="code-bracket">{`}`}</span>
          </div>
          <div className="brand-texts">
            <div className="brand-name">JsonSchool</div>
            <div className="brand-sub">O‘quv Markazi Tizimi</div>
          </div>
        </div>

        <div className="sidebar-section-title">Asosiy Menyular</div>
        <nav>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => { setPage(n.id); setOpen(false) }}
            >
              <i className={n.icon} />
              <span className="nav-label">{n.label}</span>
              {counts[n.id] !== undefined && (
                <span className="nav-count">{counts[n.id]}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Xotira va Zaxira qismi */}
        <div className="sidebar-quick-card">
          <div className="quick-card-head">
            <i className="fas fa-database" />
            <span>Xotira & Zaxira</span>
          </div>
          <p className="quick-card-desc">JSON API ma'lumotlari to‘liq xotirada saqlanadi.</p>
          <div className="quick-card-actions">
            <button className="btn-mini" onClick={handleExport} title="Zaxirani yuklab olish">
              <i className="fas fa-download" /> JSON
            </button>
            <button className="btn-mini btn-mini-alt" onClick={handleReset} title="Dastlabki holatga qaytarish">
              <i className="fas fa-rotate" /> Qaytarish
            </button>
          </div>
        </div>

        <button className="nav-item logout" onClick={onLogout}>
          <i className="fas fa-arrow-right-from-bracket" />
          <span>Tizimdan chiqish</span>
        </button>
      </aside>

      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

      {/* Asosiy Ish Maydoni */}
      <div className="main">
        <header className="topbar">
          <button className="burger" onClick={() => setOpen(!open)} title="Menyu">
            <i className="fas fa-bars-staggered" />
          </button>
          
          <div className="topbar-title-block">
            <div className="topbar-breadcrumbs">
              <span>JsonSchool</span>
              <i className="fas fa-angle-right" />
              <span className="crumb-active">{current?.label}</span>
            </div>
            <h2>{current?.label}</h2>
          </div>

          <div className="topbar-right">
            <button className="btn-icon theme-btn" onClick={onToggleTheme} title={theme === 'dark' ? "Yorug' rejim" : "Qorong'i rejim"}>
              <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
            </button>

            <div className="topbar-divider" />

            <div className="topbar-user">
              <div className="avatar">
                <span>QN</span>
              </div>
              <div className="user-info">
                <span className="user-name">Qosim Nematjonov</span>
                <span className="user-role">Administrator</span>
              </div>
              <button className="logout-btn-header" onClick={onLogout} title="Chiqish">
                <i className="fas fa-power-off" />
              </button>
            </div>
          </div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  )
}
