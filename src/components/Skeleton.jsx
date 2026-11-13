import { useEffect, useState } from 'react'

export function useLoading(ms = 900) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
  }, [ms])
  return loading
}

export function Skeleton({ width = '100%', height = 14, radius = 8, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card skeleton-card">
      <Skeleton width="40%" height={18} />
      <Skeleton width="70%" height={32} style={{ marginTop: 12 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${85 - i * 15}%`} height={12} style={{ marginTop: 10 }} />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 6, cols = 4 }) {
  return (
    <div className="card">
      <div className="table">
        <div className="table-head">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} width="70%" height={12} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div className="table-row" key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} width={`${55 + ((r + c) % 3) * 15}%`} height={13} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
