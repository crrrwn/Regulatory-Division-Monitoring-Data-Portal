import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { auth } from '../lib/firebase'
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { getAdminRegistrationCode, setAdminRegistrationCode } from '../lib/settings'
import { addSystemLog } from '../lib/systemLogs'

export default function Settings() {
  const { user, role } = useAuth()
  const { showNotification } = useNotification()
  const isAdmin = role === 'admin'

  // Change password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)

  // Admin code (admin only) — load from Firestore (fallback: config.js)
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

  return (
    <div className="min-w-0 w-full flex justify-center px-2 sm:px-4">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-white shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <div className="bg-primary px-4 sm:px-6 py-4">
          <h1 className="text-lg font-bold text-white">Settings</h1>
          <p className="text-white/80 text-sm mt-0.5">Manage your account and security.</p>
        </div>
        <div className="p-4 sm:p-6 space-y-8">
          {/* Change Password — all users */}
          <section>
            <h2 className="text-base font-bold text-content flex items-center gap-2 mb-4">
              <iconify-icon icon="mdi:lock-reset" width="22"></iconify-icon>
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-content mb-1">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-surface text-content focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowCurrentPass((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-content p-1">
                    <iconify-icon icon={showCurrentPass ? 'mdi:eye-off' : 'mdi:eye'} width="20"></iconify-icon>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-content mb-1">New password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-surface text-content focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowNewPass((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-content p-1">
                    <iconify-icon icon={showNewPass ? 'mdi:eye-off' : 'mdi:eye'} width="20"></iconify-icon>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-content mb-1">Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-surface text-content focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                />
              </div>
              {passwordMsg.text && (
                <p className={`text-sm ${passwordMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordMsg.text}
                </p>
              )}
              <button type="submit" disabled={passwordLoading} className="px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                {passwordLoading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </section>

          {/* Admin registration code — admin only */}
          {isAdmin && (
            <section className="pt-6 border-t border-border">
              <h2 className="text-base font-bold text-content flex items-center gap-2 mb-1">
                <iconify-icon icon="mdi:key-variant" width="22"></iconify-icon>
                Admin registration code
              </h2>
              <p className="text-text-muted text-sm mb-4">Only admins can register with this code. Keep it secure.</p>
              {/* Show current code (from Firestore or config) */}
              <div className="mb-4 p-4 rounded-xl bg-surface/80 border border-border transition-colors duration-200">
                <label className="block text-sm font-medium text-content mb-1.5">Current admin registration code</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2.5 rounded-lg bg-background border border-border text-content font-mono text-sm min-h-[42px] flex items-center transition-all duration-200">
                    {storedCode ? (showStoredCode ? storedCode : '••••••••••••') : 'Loading...'}
                  </code>
                  <button
                    type="button"
                    onClick={() => setShowStoredCode((s) => !s)}
                    className="shrink-0 p-2.5 rounded-lg border border-border text-text-muted hover:text-content hover:bg-surface hover:border-primary/30 transition-all duration-200"
                    title={showStoredCode ? 'Hide code' : 'Show code'}
                  >
                    <iconify-icon icon={showStoredCode ? 'mdi:eye-off' : 'mdi:eye'} width="20"></iconify-icon>
                  </button>
                </div>
                <p className="text-xs text-text-muted mt-1.5">Stored in Firestore settings, or from config.js if not set.</p>
              </div>
              <form onSubmit={handleChangeAdminCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-content mb-1">Enter current code (to change it)</label>
                  <div className="relative">
                    <input
                      type={showCurrentCode ? 'text' : 'password'}
                      value={currentCode}
                      onChange={(e) => setCurrentCode(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-lg bg-surface text-content focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                      placeholder="Enter current code"
                    />
                    <button type="button" onClick={() => setShowCurrentCode((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-content p-1">
                      <iconify-icon icon={showCurrentCode ? 'mdi:eye-off' : 'mdi:eye'} width="20"></iconify-icon>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content mb-1">New admin code</label>
                  <div className="relative">
                    <input
                      type={showNewCode ? 'text' : 'password'}
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-lg bg-surface text-content focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                      placeholder="Enter new code"
                    />
                    <button type="button" onClick={() => setShowNewCode((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-content p-1">
                      <iconify-icon icon={showNewCode ? 'mdi:eye-off' : 'mdi:eye'} width="20"></iconify-icon>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content mb-1">Confirm new code</label>
                  <input
                    type="password"
                    value={confirmCode}
                    onChange={(e) => setConfirmCode(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-surface text-content focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    placeholder="Re-enter new code"
                  />
                </div>
                {codeMsg.text && (
                  <p className={`text-sm ${codeMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {codeMsg.text}
                  </p>
                )}
                <button type="submit" disabled={codeLoading} className="px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  {codeLoading ? 'Updating...' : 'Update admin code'}
                </button>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
