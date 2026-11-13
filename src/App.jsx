import { useEffect, useState } from 'react'
import { useCollection } from './data'
import Login from './components/Login'
import StudentAuth from './components/StudentAuth'
import StudentDashboard from './components/StudentDashboard'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Students from './components/Students'
import Teachers from './components/Teachers'
import Groups from './components/Groups'
import Subjects from './components/Subjects'
import { ToastContainer } from './components/Toast'
import './App.css'

function App() {
  const [role, setRole] = useState(() => sessionStorage.getItem('jsonschool_role') || null)
  const [student, setStudent] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('jsonschool_student') || 'null')
    } catch {
      return null
    }
  })
  const [page, setPage] = useState('dashboard')

  // API Collections
  const [students, setStudents] = useCollection('students')
  const [mentors, setMentors] = useCollection('mentors')
  const [courses, setCourses] = useCollection('courses')
  const [groups, setGroups] = useCollection('groups')

  const loginAdmin = () => {
    sessionStorage.setItem('jsonschool_role', 'admin')
    setRole('admin')
  }

  const loginStudent = (user) => {
    sessionStorage.setItem('jsonschool_role', 'student')
    sessionStorage.setItem('jsonschool_student', JSON.stringify(user))
    setStudent(user)
    setRole('student')
  }

  const logout = () => {
    sessionStorage.removeItem('jsonschool_role')
    sessionStorage.removeItem('jsonschool_student')
    setRole(null)
    setStudent(null)
  }

  const [authView, setAuthView] = useState('admin')
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('jsonschool_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('jsonschool_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  // Autentifikatsiya qismi
  if (!role) {
    return (
      <>
        <ToastContainer />
        <div className="auth-switch">
          <button
            className={authView === 'admin' ? 'active' : ''}
            onClick={() => setAuthView('admin')}
          >
            <i className="fas fa-user-shield" /> Admin Panel
          </button>
          <button
            className={authView === 'student' ? 'active' : ''}
            onClick={() => setAuthView('student')}
          >
            <i className="fas fa-user-graduate" /> O‘quvchi Kabineti
          </button>
        </div>

        {authView === 'admin' ? (
          <Login onLogin={loginAdmin} />
        ) : (
          <StudentAuth students={students} groups={groups} onLogin={loginStudent} />
        )}
      </>
    )
  }

  // O'quvchi Kabineti
  if (role === 'student') {
    if (!student) {
      logout()
      return null
    }

    const initials = student.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2)

    return (
      <div className="layout">
        <ToastContainer />
        <div className="main" style={{ width: '100%' }}>
          <header className="topbar student-topbar">
            <div className="brand-logo-box small">
              <span className="code-bracket">{`{`}</span>
              <span className="code-core">JS</span>
              <span className="code-bracket">{`}`}</span>
            </div>
            <h2>JsonSchool — O‘quvchi Kabineti</h2>
            <div className="topbar-right">
              <button className="btn-icon theme-btn" onClick={toggleTheme} title="Mavzu">
                <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
              </button>
              <div className="topbar-user">
                <span className="avatar">{initials}</span>
                <span className="user-name">{student.fullName}</span>
                <button className="logout-btn-header" onClick={logout} title="Chiqish">
                  <i className="fas fa-power-off" />
                </button>
              </div>
            </div>
          </header>
          <main className="content">
            <StudentDashboard
              user={student}
              groups={groups}
              courses={courses}
              mentors={mentors}
              students={students}
            />
          </main>
        </div>
      </div>
    )
  }

  // Admin Panel
  const counts = {
    students: students.length,
    mentors: mentors.length,
    courses: courses.length,
    groups: groups.length
  }

  return (
    <>
      <ToastContainer />
      <Layout
        page={page}
        setPage={setPage}
        onLogout={logout}
        theme={theme}
        onToggleTheme={toggleTheme}
        counts={counts}
      >
        {page === 'dashboard' && (
          <Dashboard
            students={students}
            mentors={mentors}
            courses={courses}
            groups={groups}
            setPage={setPage}
          />
        )}
        {page === 'students' && (
          <Students
            students={students}
            setStudents={setStudents}
            groups={groups}
          />
        )}
        {page === 'mentors' && (
          <Teachers
            mentors={mentors}
            setMentors={setMentors}
            courses={courses}
            groups={groups}
          />
        )}
        {page === 'courses' && (
          <Subjects
            courses={courses}
            setCourses={setCourses}
            mentors={mentors}
            groups={groups}
          />
        )}
        {page === 'groups' && (
          <Groups
            groups={groups}
            setGroups={setGroups}
            mentors={mentors}
            courses={courses}
            students={students}
          />
        )}
      </Layout>
    </>
  )
}

export default App
