import { useState } from 'react'

export default function StudentAuth({ students = [], onLogin }) {
  const [phoneOrEmail, setPhoneOrEmail] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const input = phoneOrEmail.trim().toLowerCase()

    const found = students.find((s) =>
      s.email.toLowerCase() === input ||
      s.phone.replace(/\s+/g, '') === input.replace(/\s+/g, '')
    )

    if (found) {
      onLogin(found)
    } else {
      setError('Bunday email yoki telefon raqamli o‘quvchi topilmadi!')
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
          <p className="login-sub">O‘quvchi Shaxsiy Kabineti</p>
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="login-input-group">
            <label>Telefon raqam yoki Email</label>
            <div className="input-with-icon">
              <i className="fas fa-user-graduate" />
              <input
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="ali@gmail.com yoki +998901112233"
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
            <span>Kabinetga Kirish</span>
            <i className="fas fa-arrow-right" />
          </button>

          <div className="login-hint">
            <p>Mavjud o‘quvchi profillari:</p>
            <code>ali@gmail.com</code> yoki <code>vali@gmail.com</code>
          </div>
        </form>
      </div>
    </div>
  )
}
