import { useState, useEffect } from 'react'

let toastListener = null

export function showToast(message, type = 'success') {
  if (toastListener) {
    toastListener({ id: Date.now(), message, type })
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastListener = (toast) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 3200)
    }
    return () => { toastListener = null }
  }, [])

  if (!toasts.length) return null

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          <i className={
            t.type === 'success' ? 'fas fa-check-circle' :
            t.type === 'danger' ? 'fas fa-circle-exclamation' :
            'fas fa-info-circle'
          } />
          <span>{t.message}</span>
          <button className="toast-close" onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
            <i className="fas fa-times" />
          </button>
        </div>
      ))}
    </div>
  )
}
