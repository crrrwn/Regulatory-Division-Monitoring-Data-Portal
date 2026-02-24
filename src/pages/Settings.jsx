import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { auth } from '../lib/firebase'
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { getAdminRegistrationCode, setAdminRegistrationCode, setDisabledUnits } from '../lib/settings'
import { addSystemLog } from '../lib/systemLogs'
import { useDisabledUnits } from '../context/DisabledUnitsContext'
import { COLLECTIONS } from '../lib/collections'

const inputClass =
  'w-full px-4 py-2.5 border-2 border-[#e8e0d4] rounded-xl bg-white text-[#1e4d2b] text-sm font-medium focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-200 placeholder:text-[#8a857c]'
const btnPrimary =
  'px-5 py-2.5 bg-[#1e4d2b] text-white font-bold rounded-xl hover:bg-[#153019] disabled:opacity-60 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg border border-[#1e4d2b]/20'
const btnGold =
  'px-5 py-2.5 bg-[#b8a066] text-[#153019] font-bold rounded-xl hover:bg-[#d4c4a0] disabled:opacity-60 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg border border-[#b8a066]/50'

export default function Settings() {
  const { user, role } = useAuth()
  const { showNotification } = useNotification()
  const { disabledUnitIds } = useDisabledUnits()
  const isAdmin = role === 'admin'
  const [unitsSaving, setUnitsSaving] = useState(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)

  const [currentCode, setCurrentCode] = useState('')
  const [newCode, setNewCode] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [storedCode, setStoredCode] = useState('')
  const [codeMsg, setCodeMsg] = useState({ type: '', text: '' })
  const [codeLoading, setCodeLoading] = useState(false)
  const [showCurrentCode, setShowCurrentCode] = useState(false)
  const [showNewCode, setShowNewCode] = useState(false)
  const [showStoredCode, setShowStoredCode] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      getAdminRegistrationCode().then(setStoredCode)
    }
  }, [isAdmin])

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMsg({ type: '', text: '' })
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPasswordMsg({ type: 'error', text: 'Please fill in all password fields.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' })
      return
    }
    setPasswordLoading(true)
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, cred)
      await updatePassword(auth.currentUser, newPassword)
      await addSystemLog({
        action: 'password_change',
        userId: user.uid,
        userEmail: user.email,
        role: role || 'staff',
        details: 'Password updated successfully.',
      })
      setPasswordMsg({ type: '', text: '' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showNotification({ type: 'success', title: 'Password updated', message: 'Your password has been changed successfully.' })
    } catch (err) {
      const msg = err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
        ? 'Current password is incorrect.'
        : err.message || 'Failed to update password.'
      setPasswordMsg({ type: 'error', text: msg })
      showNotification({ type: 'error', title: 'Update failed', message: msg })
    }
    setPasswordLoading(false)
  }

  const handleChangeAdminCode = async (e) => {
    e.preventDefault()
    setCodeMsg({ type: '', text: '' })
    if (!currentCode.trim() || !newCode.trim() || !confirmCode.trim()) {
      setCodeMsg({ type: 'error', text: 'Please fill in all fields.' })
      return
    }
    if (currentCode.trim() !== storedCode) {
      setCodeMsg({ type: 'error', text: 'Current admin code is incorrect.' })
      return
    }
    if (newCode !== confirmCode) {
      setCodeMsg({ type: 'error', text: 'New code and confirmation do not match.' })
      return
    }
    setCodeLoading(true)
    try {
      await setAdminRegistrationCode(newCode.trim())
      setStoredCode(newCode.trim())
      await addSystemLog({
        action: 'admin_code_change',
        userId: user.uid,
        userEmail: user.email,
        role: 'admin',
        details: 'Admin registration code was updated.',
      })
      setCodeMsg({ type: '', text: '' })
      setCurrentCode('')
      setNewCode('')
      setConfirmCode('')
      showNotification({ type: 'success', title: 'Admin code updated', message: 'Admin registration code has been updated successfully.' })
    } catch (err) {
      const msg = err.message || 'Failed to update code.'
      setCodeMsg({ type: 'error', text: msg })
      showNotification({ type: 'error', title: 'Update failed', message: msg })
    }
    setCodeLoading(false)
  }

  const handleUnitToggle = async (unitId, currentlyDisabled) => {
    if (!isAdmin) return
    setUnitsSaving(unitId)
    try {
      const next = currentlyDisabled ? disabledUnitIds.filter((id) => id !== unitId) : [...disabledUnitIds, unitId]
      await setDisabledUnits(next)
      await addSystemLog({
        action: 'admin_code_change',
        userId: user.uid,
        userEmail: user.email,
        role: 'admin',
        details: currentlyDisabled ? `Unit enabled: ${unitId}` : `Unit disabled: ${unitId}`,
      })
      showNotification({
        type: 'success',
        title: 'Units updated',
        message: currentlyDisabled ? 'Unit is now visible to staff.' : 'Unit is now hidden from staff.',
        toast: true,
      })
    } catch (err) {
      showNotification({ type: 'error', title: 'Update failed', message: err.message || 'Could not update units.', toast: true })
    }
    setUnitsSaving(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-10 sm:pb-12 min-w-0 w-full max-w-full overflow-x-hidden">
      {/* --- HEADER (same style as View Records / Analytics) --- */}
      <div className="settings-anim-1 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Settings</h1>
              <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-1">Manage your account and security</p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 min-h-[44px] bg-white/15 backdrop-blur-sm text-white border border-white/25 rounded-xl hover:bg-white/25 hover:border-white/40 hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-xs sm:text-sm shrink-0 touch-manipulation"
            >
              <iconify-icon icon="mdi:arrow-left" width="18" className="shrink-0"></iconify-icon>
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* --- TWO COLUMNS: Password (left) + Admin Code (right, admin only) --- */}
      <div className={`grid gap-6 ${isAdmin ? 'lg:grid-cols-2' : 'max-w-2xl'}`}>
        {/* Change Password — all users */}
        <div className="settings-anim-2 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/5 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/10 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col">
          <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 py-3.5 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/15 border border-white/25">
                <iconify-icon icon="mdi:lock-reset" width="22" className="text-[#d4c4a0]"></iconify-icon>
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-tight">Change Password</h2>
                <p className="text-[10px] font-semibold text-white/80 tracking-wider mt-0.5">Update your login password</p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-6 flex-1 bg-gradient-to-b from-[#faf8f5] to-[#f5f0e8] border-l-4 border-[#1e4d2b]/25">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputClass}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowCurrentPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c7355] hover:text-[#1e4d2b] p-1">
                    <iconify-icon icon={showCurrentPass ? 'mdi:eye-off' : 'mdi:eye'} width="20"></iconify-icon>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">New password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowNewPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c7355] hover:text-[#1e4d2b] p-1">
                    <iconify-icon icon={showNewPass ? 'mdi:eye-off' : 'mdi:eye'} width="20"></iconify-icon>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                />
              </div>
              {passwordMsg.text && (
                <p className={`text-sm font-semibold ${passwordMsg.type === 'success' ? 'text-[#1e4d2b]' : 'text-red-600'}`}>
                  {passwordMsg.text}
                </p>
              )}
              <button type="submit" disabled={passwordLoading} className={`${btnPrimary} min-h-[44px] touch-manipulation`}>
                {passwordLoading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </div>
        </div>

        {/* Admin registration code — admin only */}
        {isAdmin && (
          <div className="settings-anim-3 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#b8a066]/10 overflow-hidden hover:shadow-xl hover:shadow-[#b8a066]/15 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col">
            <div className="shrink-0 bg-gradient-to-r from-[#9a7b4f] via-[#b8a066] to-[#8f7a45] px-5 py-3.5 relative overflow-hidden border-b-2 border-[#b8a066]/25">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/15 border border-white/25">
                  <iconify-icon icon="mdi:key-variant" width="22" className="text-white"></iconify-icon>
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight">Admin registration code</h2>
                  <p className="text-[10px] font-semibold text-white/85 tracking-wider mt-0.5">Only admins can register with this code</p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-6 flex-1 bg-gradient-to-b from-[#faf8f5] to-[#f2ede6] border-l-4 border-[#b8a066]/25">
              <div className="mb-5 p-4 rounded-xl bg-white/90 border-2 border-[#e8e0d4] shadow-inner">
                <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Current admin registration code</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2.5 rounded-xl bg-[#faf8f5] border-2 border-[#e8e0d4] text-[#1e4d2b] font-mono text-sm min-h-[42px] flex items-center font-semibold">
                    {storedCode ? (showStoredCode ? storedCode : '••••••••••••') : 'Loading...'}
                  </code>
                  <button
                    type="button"
                    onClick={() => setShowStoredCode((s) => !s)}
                    className="shrink-0 p-2.5 rounded-xl border-2 border-[#e8e0d4] text-[#5c7355] hover:text-[#1e4d2b] hover:bg-[#faf8f5] hover:border-[#1e4d2b]/30 transition-all duration-200"
                    title={showStoredCode ? 'Hide code' : 'Show code'}
                  >
                    <iconify-icon icon={showStoredCode ? 'mdi:eye-off' : 'mdi:eye'} width="20"></iconify-icon>
                  </button>
                </div>
                <p className="text-[10px] text-[#5c574f] mt-2 font-medium">Stored in Firestore settings, or from config if not set.</p>
              </div>
              <form onSubmit={handleChangeAdminCode} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Enter current code (to change it)</label>
                  <div className="relative">
                    <input
                      type={showCurrentCode ? 'text' : 'password'}
                      value={currentCode}
                      onChange={(e) => setCurrentCode(e.target.value)}
                      className={inputClass}
                      placeholder="Enter current code"
                    />
                    <button type="button" onClick={() => setShowCurrentCode((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c7355] hover:text-[#1e4d2b] p-1">
                      <iconify-icon icon={showCurrentCode ? 'mdi:eye-off' : 'mdi:eye'} width="20"></iconify-icon>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">New admin code</label>
                  <div className="relative">
                    <input
                      type={showNewCode ? 'text' : 'password'}
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className={inputClass}
                      placeholder="Enter new code"
                    />
                    <button type="button" onClick={() => setShowNewCode((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c7355] hover:text-[#1e4d2b] p-1">
                      <iconify-icon icon={showNewCode ? 'mdi:eye-off' : 'mdi:eye'} width="20"></iconify-icon>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Confirm new code</label>
                  <input
                    type="password"
                    value={confirmCode}
                    onChange={(e) => setConfirmCode(e.target.value)}
                    className={inputClass}
                    placeholder="Re-enter new code"
                  />
                </div>
                {codeMsg.text && (
                  <p className={`text-sm font-semibold ${codeMsg.type === 'success' ? 'text-[#1e4d2b]' : 'text-red-600'}`}>
                    {codeMsg.text}
                  </p>
                )}
                <button type="submit" disabled={codeLoading} className={btnGold}>
                  {codeLoading ? 'Updating...' : 'Update admin code'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Unit Disable / Enable — admin only */}
        {isAdmin && (
          <div className="settings-anim-3 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col">
            <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 py-3.5 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/15 border border-white/25">
                  <iconify-icon icon="mdi:toggle-switch-outline" width="22" className="text-[#d4c4a0]"></iconify-icon>
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight">Disable / Enable units</h2>
                  <p className="text-[10px] font-semibold text-white/80 tracking-wider mt-0.5">Disabled units stay visible but cannot be opened (Dashboard, sidebar, View Records)</p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-6 flex-1 bg-gradient-to-b from-[#faf8f5] to-[#f2ede6] border-l-4 border-[#1e4d2b]/25">
              <p className="text-[11px] text-[#5c574f] font-medium mb-4">Only admins can change this. Use <strong>Disable</strong> / <strong>Enable</strong> per unit below, grouped by section.</p>
              <div className="space-y-5 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                {[
                  { sectionLabel: 'Registration & Licensing', unitIds: ['animalFeed', 'animalWelfare', 'livestockHandlers', 'transportCarrier', 'plantMaterial', 'organicAgri'] },
                  { sectionLabel: 'Quality Control', unitIds: ['goodAgriPractices', 'goodAnimalHusbandry', 'organicPostMarket', 'landUseMatter', 'foodSafety', 'safdzValidation'] },
                  { sectionLabel: 'Surveillance', unitIds: ['plantPestSurveillance', 'cfsAdmcc', 'animalDiseaseSurveillance'] },
                ].map((group) => (
                  <div key={group.sectionLabel} className="space-y-2">
                    <h3 className="text-xs font-black text-[#1e4d2b] uppercase tracking-wider border-b-2 border-[#e8e0d4] pb-1.5 sticky top-0 bg-gradient-to-b from-[#faf8f5] to-[#f2ede6] z-10">
                      {group.sectionLabel}
                    </h3>
                    <div className="space-y-2">
                      {group.unitIds.map((id) => {
                        const c = COLLECTIONS.find((col) => col.id === id)
                        if (!c) return null
                        const isDisabled = disabledUnitIds.includes(c.id)
                        return (
                          <div
                            key={c.id}
                            className={`flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${isDisabled ? 'bg-red-50/80 border-red-200' : 'bg-white border-[#e8e0d4]'}`}
                          >
                            <span className="text-sm font-bold text-[#1e4d2b] flex-1 min-w-0 truncate">{c.label}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[10px] font-bold uppercase ${isDisabled ? 'text-red-600' : 'text-[#5c7355]'}`}>
                                {isDisabled ? 'Disabled' : 'Enabled'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUnitToggle(c.id, isDisabled)}
                                disabled={!!unitsSaving}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-out ${isDisabled ? 'bg-red-500' : 'bg-[#1e4d2b]'} disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/40 focus:ring-offset-2 rounded-full`}
                                aria-label={isDisabled ? `Enable ${c.label}` : `Disable ${c.label}`}
                              >
                                <span
                                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ease-out ${isDisabled ? 'left-1 translate-x-0' : 'left-1 translate-x-5'}`}
                                  style={{ willChange: 'transform' }}
                                />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
