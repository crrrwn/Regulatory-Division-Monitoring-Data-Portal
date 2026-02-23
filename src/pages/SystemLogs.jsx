import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
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
  { value: '', label: 'All actions' },
  ...Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label })),
]

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
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

const PAGE_SIZE = 10

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
    <div className="space-y-6 pb-10 min-w-0 w-full max-w-full overflow-x-hidden">
      {/* --- HEADER (same style as View Records / Settings) --- */}
      <div className="system-logs-anim-1 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 shadow-lg">
                <iconify-icon icon="mdi:clipboard-list-outline" width="28" className="text-[#d4c4a0]"></iconify-icon>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">System Logs</h1>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-1">Activity audit: logins, record changes, password & admin code updates</p>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-sm text-white border border-white/25 rounded-xl hover:bg-white/25 hover:border-white/40 hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-sm shrink-0"
            >
              <iconify-icon icon="mdi:arrow-left" width="18"></iconify-icon>
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* --- FILTERS BAR (khaki/gold accent) --- */}
      <div className="system-logs-anim-2 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#b8a066]/10 overflow-hidden hover:shadow-xl hover:shadow-[#b8a066]/15 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="px-4 py-3 bg-gradient-to-r from-[#9a7b4f] via-[#b8a066] to-[#8f7a45] relative border-b-2 border-[#b8a066]/25 rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
          <span className="relative z-10 text-[10px] font-black text-white uppercase tracking-widest">Filters</span>
        </div>
        <div className="p-4 sm:p-5 border-l-4 border-[#b8a066]/25 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-[auto_auto_1fr] gap-4 lg:gap-6 lg:items-end bg-gradient-to-b from-[#faf8f5] to-[#f5f0e8]">
          <div className="flex flex-col min-w-0">
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Action</label>
            <AppSelect
              options={ACTION_OPTIONS}
              value={actionFilter}
              onChange={(val) => setActionFilter(val)}
              placeholder="All actions"
              aria-label="Filter by action"
              className="min-w-0"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Role</label>
            <AppSelect
              options={ROLE_OPTIONS}
              value={roleFilter}
              onChange={(val) => setRoleFilter(val)}
              placeholder="All roles"
              aria-label="Filter by role"
              className="min-w-0"
            />
          </div>
          <div className="flex items-center justify-end gap-2 lg:pb-0.5">
            <span className="text-sm font-bold text-[#1e4d2b]">
              <span className="tabular-nums">{filtered.length}</span>
              <span className="text-[#5c574f] font-semibold"> of </span>
              <span className="tabular-nums">{logs.length}</span>
              <span className="text-[#5c574f] font-semibold"> logs</span>
            </span>
            <span className="text-[10px] font-semibold text-[#8a857c] uppercase tracking-wider">· {PAGE_SIZE} per page</span>
          </div>
        </div>
      </div>

      {/* --- LOGS TABLE CARD --- */}
      <div className="system-logs-anim-3 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden flex flex-col min-h-[320px] hover:shadow-xl hover:shadow-[#1e4d2b]/10 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-3 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-sm font-black text-white uppercase tracking-tight">Activity log</span>
            <span className="text-[11px] font-semibold text-white/85">Page {currentPage} of {totalPages}</span>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto max-h-[calc(100vh-380px)] custom-scrollbar view-records-scroll border-l-4 border-[#1e4d2b]/25">
          {error && (
            <div className="m-4 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-center gap-3">
              <iconify-icon icon="mdi:alert-circle-outline" width="24" className="text-red-600 shrink-0"></iconify-icon>
              <p className="text-sm font-semibold text-red-800">{error}</p>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <iconify-icon icon="mdi:loading" width="40" className="animate-spin text-[#1e4d2b] mb-4"></iconify-icon>
              <p className="text-sm font-semibold text-[#5c7355]">Loading logs...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 rounded-2xl bg-[#f0f5ee]/80 border-2 border-dashed border-[#1e4d2b]/25 mb-4">
                <iconify-icon icon="mdi:clipboard-text-off-outline" width="48" className="text-[#5c7355] opacity-70"></iconify-icon>
              </div>
              <p className="text-sm font-bold text-[#1e4d2b]">No logs found</p>
              <p className="text-xs text-[#5c574f] mt-1">Try adjusting filters.</p>
            </div>
          ) : (
            <>
              <div key={currentPage} className="system-logs-table-wrap">
                <table className="w-full min-w-[640px] text-sm border-collapse">
                  <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] border-b-2 border-[#e8e0d4]">
                    <tr>
                      <th className="px-5 py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap text-left">Time</th>
                      <th className="px-5 py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap text-left">Action</th>
                      <th className="px-5 py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap text-left">User</th>
                      <th className="px-5 py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap text-left">Role</th>
                      <th className="px-5 py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e0d4] bg-white">
                    {paginated.map((log, index) => (
                      <tr
                        key={log.id}
                        className="system-logs-row group hover:bg-[#f0f5ee]/60 transition-colors duration-200"
                        style={{ animationDelay: `${index * 35}ms` }}
                      >
                        <td className="px-5 py-3 text-[#5c574f] font-medium whitespace-nowrap tabular-nums">{formatDate(log.timestamp)}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-2 font-semibold text-[#1e4d2b]">
                            <span className="p-1.5 rounded-lg bg-[#1e4d2b]/10 text-[#1e4d2b]">
                              <iconify-icon icon={ACTION_ICONS[log.action] || 'mdi:circle'} width="16"></iconify-icon>
                            </span>
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#2d2a26] font-medium truncate max-w-[200px]" title={log.userEmail || ''}>{log.userEmail || '—'}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              (log.role || '').toLowerCase() === 'admin'
                                ? 'bg-[#1e4d2b]/15 text-[#1e4d2b] border border-[#1e4d2b]/25'
                                : 'bg-[#b8a066]/15 text-[#8f7a45] border border-[#b8a066]/25'
                            }`}
                          >
                            {log.role || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#5c574f] text-xs max-w-[240px] truncate" title={log.details || ''}>{log.details || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="shrink-0 px-5 py-4 border-t-2 border-[#e8e0d4] bg-gradient-to-r from-[#faf8f5] to-[#f5f0e8] flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#5c7355]">
                  Showing <span className="text-[#1e4d2b] font-black tabular-nums">{(currentPage - 1) * PAGE_SIZE + 1}</span>
                  –<span className="text-[#1e4d2b] font-black tabular-nums">{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span>
                  <span className="text-[#5c574f]"> of </span>
                  <span className="text-[#1e4d2b] font-black tabular-nums">{filtered.length}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-[#e8e0d4] bg-white text-[#1e4d2b] font-bold text-sm hover:bg-[#faf8f5] hover:border-[#1e4d2b]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                  >
                    <iconify-icon icon="mdi:chevron-left" width="18"></iconify-icon>
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-[#e8e0d4] bg-white text-[#1e4d2b] font-bold text-sm hover:bg-[#faf8f5] hover:border-[#1e4d2b]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
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
