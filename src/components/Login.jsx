import { useState } from 'react'
import { ADMIN } from '../data'

export default function Login({ onLogin }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const validLogin = login.trim()
    const validPass = password.trim()

    const isAdmin =
      (validLogin === ADMIN.login && validPass === ADMIN.password) ||
      (validLogin === ADMIN.fallbackLogin && validPass === ADMIN.fallbackPassword)

    if (isAdmin) {
      onLogin()
    } else {
      setError('Login yoki parol noto‘g‘ri kiritildi!')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand-header">
          <div className="login-logo-box">
            <span className="code-bracket">{`{`}</span>
            <span className="code-core">JSON</span>
            <span className="code-bracket">{`}`}</span>
          </div>
          <h1>JsonSchool</h1>
          <p className="login-sub">O‘quv Markazi Admin Paneliga Kirish</p>
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="login-input-group">
            <label>Admin Login</label>
            <div className="input-with-icon">
              <i className="fas fa-user-shield" />
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Login kiriting"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label>Parol</label>
            <div className="input-with-icon">
              <i className="fas fa-lock" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parol kiriting"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="login-error-box">
              <i className="fas fa-circle-exclamation" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block btn-login">
            <span>Tizimga Kirish</span>
            <i className="fas fa-arrow-right" />
          </button>

          <div className="login-hint">
            <p>Admin login ma’lumotlari:</p>
            <code>qosimnematjonov / 123qosim123</code>
          </div>
        </form>
      </div>
    </div>
  )
}
