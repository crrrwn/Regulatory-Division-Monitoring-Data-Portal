import { useState, useEffect, useMemo } from 'react'
import { getSystemLogs } from '../lib/systemLogs'
import AppSelect from '../components/AppSelect'

const ACTION_LABELS = {
  login: 'Login',
  logout: 'Logout',
  password_change: 'Password change',
  admin_code_change: 'Admin code changed',
  record_submitted: 'Record submitted',
  record_updated: 'Record updated',
  record_deleted: 'Record deleted',
}

const ACTION_OPTIONS = [
  { value: '', label: 'All' },
  ...Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label })),
]

const ROLE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
]

const ACTION_ICONS = {
  login: 'mdi:login',
  logout: 'mdi:logout',
  password_change: 'mdi:lock-reset',
  admin_code_change: 'mdi:key-variant',
  record_submitted: 'mdi:file-document-plus',
  record_updated: 'mdi:file-document-edit',
  record_deleted: 'mdi:file-document-remove',
}

const PAGE_SIZE = 5

export default function SystemLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getSystemLogs(500)
      .then((data) => {
        if (!cancelled) setLogs(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load logs.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const matchAction = !actionFilter || l.action === actionFilter
      const matchRole = !roleFilter || (l.role || '').toLowerCase() === roleFilter.toLowerCase()
      return matchAction && matchRole
    })
  }, [logs, actionFilter, roleFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [actionFilter, roleFilter])

  const formatDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleString('en-PH', {
      dateStyle: 'short',
      timeStyle: 'medium',
    })
  }

  return (
    <div className="min-w-0 w-full flex justify-center px-2 sm:px-4">
      <div className="w-full max-w-5xl rounded-xl border border-border bg-white shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <div className="bg-primary px-3 sm:px-4 py-2.5">
          <h1 className="text-lg font-bold text-white">System Logs</h1>
          <p className="text-white/80 text-sm mt-0.5">All activity is logged: record submit, edit, delete, login, logout, password change, admin code change.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3 sm:gap-4 px-3 sm:px-4 py-3 bg-gradient-to-b from-surface/60 to-surface/40 border-b border-border">
          <div className="system-logs-dropdown-wrap min-w-[180px]">
            <label className="system-logs-dropdown-label whitespace-nowrap">Action</label>
            <AppSelect
              options={ACTION_OPTIONS}
              value={actionFilter}
              onChange={(val) => setActionFilter(val)}
              placeholder="All"
              aria-label="Filter by action"
              className="min-w-[180px]"
            />
          </div>
          <div className="system-logs-dropdown-wrap min-w-[140px]">
            <label className="system-logs-dropdown-label whitespace-nowrap">Role</label>
            <AppSelect
              options={ROLE_OPTIONS}
              value={roleFilter}
              onChange={(val) => setRoleFilter(val)}
              placeholder="All"
              aria-label="Filter by role"
              className="min-w-[140px]"
            />
          </div>
          <div className="ml-auto text-sm text-text-muted pb-0.5">
            <span className="font-semibold text-content">{filtered.length}</span> of <span className="font-semibold text-content">{logs.length}</span> logs · 5 per page
          </div>
        </div>
        <div className="p-3 sm:p-4">
          {error && (
            <p className="text-red-600 text-sm mb-3">{error}</p>
          )}
          {loading ? (
            <p className="text-text-muted text-sm">Loading logs...</p>
          ) : filtered.length === 0 ? (
            <p className="text-text-muted text-sm">No logs found.</p>
          ) : (
            <>
            <div key={currentPage} className="overflow-x-auto -mx-1 system-logs-table-wrap">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-text-muted font-semibold">
                    <th className="pb-2 pr-4 py-2">Time</th>
                    <th className="pb-2 pr-4 py-2">Action</th>
                    <th className="pb-2 pr-4 py-2">User</th>
                    <th className="pb-2 pr-4 py-2">Role</th>
                    <th className="pb-2 py-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((log, index) => (
                    <tr key={log.id} className="system-logs-row border-b border-border/60 hover:bg-surface/50" style={{ animationDelay: `${index * 40}ms` }}>
                      <td className="py-2.5 pr-4 text-text-muted whitespace-nowrap">{formatDate(log.timestamp)}</td>
                      <td className="py-2.5 pr-4">
                        <span className="inline-flex items-center gap-1.5 font-medium text-content">
                          <iconify-icon icon={ACTION_ICONS[log.action] || 'mdi:circle'} width="16"></iconify-icon>
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-content">{log.userEmail || '—'}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${(log.role || '').toLowerCase() === 'admin' ? 'bg-primary/15 text-primary' : 'bg-surface text-text-muted'}`}>
                          {log.role || '—'}
                        </span>
                      </td>
                      <td className="py-2.5 text-text-muted">{log.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 system-logs-pagination">
              <p className="text-sm text-text-muted transition-opacity duration-300">
                Page <span className="font-semibold text-content">{currentPage}</span> of <span className="font-semibold text-content">{totalPages}</span>
                {filtered.length > 0 && (
                  <span className="ml-1">
                    (showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)})
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-white text-content font-medium text-sm hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:active:scale-100"
                >
                  <iconify-icon icon="mdi:chevron-left" width="18"></iconify-icon>
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-white text-content font-medium text-sm hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:active:scale-100"
                >
                  Next
                  <iconify-icon icon="mdi:chevron-right" width="18"></iconify-icon>
                </button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
