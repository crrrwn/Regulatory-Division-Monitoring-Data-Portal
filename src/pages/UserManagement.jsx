import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { getSectionLabel, SECTION_OPTIONS } from '../lib/sections'
import { useNotification } from '../context/NotificationContext'
import { addSystemLog } from '../lib/systemLogs'
import { useAuth } from '../context/AuthContext'
import AppSelect from '../components/AppSelect'

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
]

const EDIT_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
]

export default function UserManagement() {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({ fullName: '', role: 'staff', section: '' })
  const [deleteConfirming, setDeleteConfirming] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    const usersRef = collection(db, 'users')
    getDocs(usersRef)
      .then((snap) => {
        if (!cancelled) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          list.sort((a, b) => {
            const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dbVal = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dbVal - da
          })
          setUsers(list)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load users.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filtered = users.filter((u) => {
    const matchRole = !roleFilter || (u.role || '').toLowerCase() === roleFilter.toLowerCase()
    const q = search.trim().toLowerCase()
    const matchSearch = !q || (u.fullName || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
    return matchRole && matchSearch
  })

  const formatDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('en-PH', { dateStyle: 'medium' })
  }

  const openEdit = (u) => {
    setEditForm({ fullName: u.fullName || '', role: u.role || 'staff', section: u.section || '' })
    setEditing(u)
  }

  const saveEdit = async () => {
    if (!editing) return
    try {
      await updateDoc(doc(db, 'users', editing.id), {
        fullName: (editForm.fullName || '').trim() || null,
        role: editForm.role || 'staff',
        section: editForm.section || null,
        updatedAt: new Date().toISOString(),
      })
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editing.id
            ? { ...u, fullName: editForm.fullName?.trim() || u.fullName, role: editForm.role, section: editForm.section || null }
            : u
        )
      )
      setEditing(null)
      showNotification({ type: 'success', title: 'User updated', message: 'Changes saved successfully.' })
      addSystemLog({ action: 'record_updated', userId: user?.uid, userEmail: user?.email, role: 'admin', details: `User ${editing.email} updated.` }).catch(() => {})
    } catch (err) {
      showNotification({ type: 'error', title: 'Save failed', message: err.message || 'Failed to save changes.' })
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirming) return
    try {
      await deleteDoc(doc(db, 'users', deleteConfirming.id))
      setUsers((prev) => prev.filter((u) => u.id !== deleteConfirming.id))
      setDeleteConfirming(null)
      showNotification({ type: 'success', title: 'User removed', message: 'User has been removed from the system.' })
      addSystemLog({ action: 'record_deleted', userId: user?.uid, userEmail: user?.email, role: 'admin', details: `User ${deleteConfirming.email} removed.` }).catch(() => {})
    } catch (err) {
      showNotification({ type: 'error', title: 'Delete failed', message: err.message || 'Failed to remove user.' })
    }
  }

  return (
    <div className="space-y-6 pb-10 min-w-0 w-full max-w-full overflow-x-hidden">
      {/* --- HEADER --- */}
      <div className="user-mgmt-anim-1 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 shadow-lg">
                <iconify-icon icon="mdi:account-group-outline" width="28" className="text-[#d4c4a0]"></iconify-icon>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">User Management</h1>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-1">View all registered users: name, email, role, and section</p>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] bg-white/15 backdrop-blur-sm text-white border border-white/25 rounded-xl hover:bg-white/25 hover:border-white/40 hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-sm shrink-0 touch-manipulation"
            >
              <iconify-icon icon="mdi:arrow-left" width="18"></iconify-icon>
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* --- FILTERS BAR --- */}
      <div className="user-mgmt-anim-2 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#b8a066]/10 overflow-hidden hover:shadow-xl hover:shadow-[#b8a066]/15 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="px-4 py-3 bg-gradient-to-r from-[#9a7b4f] via-[#b8a066] to-[#8f7a45] relative border-b-2 border-[#b8a066]/25 rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
          <span className="relative z-10 text-[10px] font-black text-white uppercase tracking-widest">Filters & Search</span>
        </div>
        <div className="p-4 sm:p-5 border-l-4 border-[#b8a066]/25 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 lg:items-end bg-gradient-to-b from-[#faf8f5] to-[#f5f0e8]">
          <div className="flex flex-col min-w-0">
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Search by Name or Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5c7355]">
                <iconify-icon icon="mdi:magnify" width="18"></iconify-icon>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type name or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-[#1e4d2b] text-sm font-medium focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b] transition-all duration-300"
              />
            </div>
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
          <div className="flex items-center sm:col-span-2 lg:col-span-1 lg:justify-end">
            <span className="text-sm font-bold text-[#1e4d2b]">
              <span className="tabular-nums">{filtered.length}</span>
              <span className="text-[#5c574f] font-semibold"> of </span>
              <span className="tabular-nums">{users.length}</span>
              <span className="text-[#5c574f] font-semibold"> users</span>
            </span>
          </div>
        </div>
      </div>

      {/* --- USERS TABLE CARD --- */}
      <div className="user-mgmt-anim-3 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden flex flex-col min-h-[280px] sm:min-h-[320px] hover:shadow-xl hover:shadow-[#1e4d2b]/10 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-3 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative z-10 flex items-center">
            <span className="text-sm font-black text-white uppercase tracking-tight">Registered Users</span>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto max-h-[calc(100dvh-320px)] sm:max-h-[calc(100vh-380px)] custom-scrollbar view-records-scroll border-l-4 border-[#1e4d2b]/25">
          {error && (
            <div className="m-4 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-center gap-3">
              <iconify-icon icon="mdi:alert-circle-outline" width="24" className="text-red-600 shrink-0"></iconify-icon>
              <p className="text-sm font-semibold text-red-800">{error}</p>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-300">
              <iconify-icon icon="mdi:loading" width="40" className="animate-spin text-[#1e4d2b] mb-4"></iconify-icon>
              <p className="text-sm font-semibold text-[#5c7355]">Loading users...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-500">
              <div className="p-4 rounded-2xl bg-[#f0f5ee]/80 border-2 border-dashed border-[#1e4d2b]/25 mb-4 transition-transform duration-300 hover:scale-105">
                <iconify-icon icon="mdi:account-off-outline" width="48" className="text-[#5c7355] opacity-70"></iconify-icon>
              </div>
              <p className="text-sm font-bold text-[#1e4d2b]">No users found</p>
              <p className="text-xs text-[#5c574f] mt-1">Try adjusting filters or search.</p>
            </div>
          ) : (
            <>
              {/* Mobile: Card layout */}
              <div className="block md:hidden p-4 sm:p-5 space-y-4">
                {filtered.map((u, idx) => (
                  <div
                    key={u.id}
                    className="user-mgmt-row rounded-xl border-2 border-[#e8e0d4] bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#1e4d2b]/30 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
                    style={{ animationDelay: `${Math.min(idx * 0.04, 0.4)}s` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[#1e4d2b] text-base truncate">{u.fullName || u.email?.split('@')[0] || '—'}</p>
                        <p className="text-sm text-[#5c574f] truncate mt-0.5" title={u.email}>{u.email || '—'}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="inline-flex items-center justify-center w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl bg-[#1e4d2b]/10 border-2 border-[#1e4d2b]/30 text-[#1e4d2b] hover:bg-[#1e4d2b]/20 active:scale-95 transition-all"
                          title="Edit"
                          aria-label="Edit"
                        >
                          <iconify-icon icon="mdi:pencil" width="20"></iconify-icon>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirming({ id: u.id, name: u.fullName || u.email, email: u.email })}
                          className="inline-flex items-center justify-center w-10 h-10 min-w-[44px] min-h-[44px] rounded-xl bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100 active:scale-95 transition-all"
                          title="Delete"
                          aria-label="Delete"
                        >
                          <iconify-icon icon="mdi:delete-outline" width="20"></iconify-icon>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg font-bold uppercase ${
                          (u.role || '').toLowerCase() === 'admin'
                            ? 'bg-[#1e4d2b]/15 text-[#1e4d2b]'
                            : 'bg-[#b8a066]/15 text-[#8f7a45]'
                        }`}
                      >
                        {u.role || 'staff'}
                      </span>
                      {(() => {
                        const sections = Array.isArray(u.allowedSections) && u.allowedSections.length > 0
                          ? u.allowedSections
                          : u.section ? [u.section] : []
                        return sections.length > 0 ? (
                          <span className="px-2.5 py-1 rounded-lg bg-[#e8e0d4]/80 text-[#5c574f] font-medium">
                            {sections.map(getSectionLabel).join(', ')}
                          </span>
                        ) : null
                      })()}
                      <span className="px-2.5 py-1 rounded-lg bg-[#f5f0e8] text-[#5c574f] tabular-nums">
                        {formatDate(u.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden md:block user-management-table-wrap animate-in fade-in duration-300" style={{ animationDelay: '0.1s' }}>
                <table className="w-full min-w-[640px] lg:min-w-[780px] text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] border-b-2 border-[#e8e0d4]">
                  <tr>
                    <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap text-left">Name</th>
                    <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap text-left hidden lg:table-cell">Email</th>
                    <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap text-left">Role</th>
                    <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap text-left hidden lg:table-cell">Section</th>
                    <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap text-left hidden xl:table-cell">Registered</th>
                    <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e0d4] bg-white">
                  {filtered.map((u, idx) => (
                    <tr
                      key={u.id}
                      className="user-mgmt-row group hover:bg-[#f0f5ee]/60 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
                      style={{ animationDelay: `${Math.min(idx * 0.03, 0.35)}s` }}
                    >
                      <td className="px-3 sm:px-5 py-3 font-semibold text-[#1e4d2b]">
                        <span className="block truncate max-w-[120px] lg:max-w-none" title={u.fullName || u.email}>{u.fullName || u.email?.split('@')[0] || '—'}</span>
                        <span className="block text-xs text-[#5c574f] truncate max-w-[120px] lg:hidden mt-0.5" title={u.email}>{u.email || '—'}</span>
                      </td>
                      <td className="px-3 sm:px-5 py-3 text-[#5c574f] font-medium truncate max-w-[180px] hidden lg:table-cell" title={u.email || ''}>{u.email || '—'}</td>
                      <td className="px-3 sm:px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            (u.role || '').toLowerCase() === 'admin'
                              ? 'bg-[#1e4d2b]/15 text-[#1e4d2b] border border-[#1e4d2b]/25'
                              : 'bg-[#b8a066]/15 text-[#8f7a45] border border-[#b8a066]/25'
                          }`}
                        >
                          {u.role || 'staff'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-5 py-3 text-[#5c574f] text-sm hidden lg:table-cell">
                        {(() => {
                          const sections = Array.isArray(u.allowedSections) && u.allowedSections.length > 0
                            ? u.allowedSections
                            : u.section ? [u.section] : []
                          return sections.length ? sections.map(getSectionLabel).join(', ') : '—'
                        })()}
                      </td>
                      <td className="px-3 sm:px-5 py-3 text-[#5c574f] font-medium whitespace-nowrap tabular-nums hidden xl:table-cell">{formatDate(u.createdAt)}</td>
                      <td className="px-3 sm:px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#1e4d2b]/10 border-2 border-[#1e4d2b]/30 text-[#1e4d2b] hover:bg-[#1e4d2b]/20 hover:border-[#1e4d2b]/50 active:scale-[0.98] transition-all duration-300"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <iconify-icon icon="mdi:pencil" width="18"></iconify-icon>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirming({ id: u.id, name: u.fullName || u.email, email: u.email })}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-400 active:scale-[0.98] transition-all duration-300"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <iconify-icon icon="mdi:delete-outline" width="18"></iconify-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div
          className="user-mgmt-overlay-in fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 pb-[max(1rem,env(safe-area-inset-bottom))] overflow-y-auto"
          style={{ backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border-2 border-[#e8e0d4] max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 my-auto shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 py-4">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Edit User</h3>
              <p className="text-[11px] text-white/85 mt-0.5 truncate">{editing.email}</p>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto min-h-0 flex-1">
              <div>
                <label className="block text-sm font-bold text-[#1e4d2b] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border-2 border-[#e8e0d4] text-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b] outline-none transition-all"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e4d2b] mb-1.5">Role</label>
                <AppSelect
                  options={EDIT_ROLE_OPTIONS}
                  value={editForm.role}
                  onChange={(v) => setEditForm((f) => ({ ...f, role: v }))}
                  placeholder="Select role"
                  aria-label="Role"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e4d2b] mb-1.5">Section</label>
                <AppSelect
                  options={[{ value: '', label: '— None —' }, ...SECTION_OPTIONS]}
                  value={editForm.section}
                  onChange={(v) => setEditForm((f) => ({ ...f, section: v }))}
                  placeholder="Select section"
                  aria-label="Section"
                  openUpward
                />
              </div>
            </div>
            <div className="flex border-t-2 border-[#e8e0d4]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex-1 py-3.5 min-h-[44px] text-sm font-semibold text-[#5c574f] hover:bg-[#f5f0e8] active:bg-[#ebe5dc] transition-colors touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="flex-1 py-3.5 min-h-[44px] text-sm font-bold text-white bg-[#1e4d2b] hover:bg-[#1a4526] active:bg-[#153019] transition-colors touch-manipulation"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirming && (
        <div
          className="user-mgmt-overlay-in fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 pb-[max(1rem,env(safe-area-inset-bottom))] overflow-y-auto"
          style={{ backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && setDeleteConfirming(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border-2 border-[#e8e0d4] max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300 my-auto shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <iconify-icon icon="mdi:alert-circle-outline" width="28" className="text-red-600"></iconify-icon>
              </div>
              <h3 className="text-lg font-bold text-[#1e4d2b] mb-2">Remove user?</h3>
              <p className="text-sm text-[#5c574f] mb-1">
                <span className="font-semibold text-[#1e4d2b]">{deleteConfirming.name || deleteConfirming.email}</span>
              </p>
              <p className="text-xs text-[#5c574f]">This will remove the user from the system. They will no longer appear in User Management.</p>
            </div>
            <div className="flex border-t-2 border-[#e8e0d4]">
              <button
                type="button"
                onClick={() => setDeleteConfirming(null)}
                className="flex-1 py-3.5 min-h-[44px] text-sm font-semibold text-[#5c574f] hover:bg-[#f5f0e8] active:bg-[#ebe5dc] transition-colors touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3.5 min-h-[44px] text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors touch-manipulation"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
