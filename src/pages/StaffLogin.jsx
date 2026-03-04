import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { addSystemLog } from '../lib/systemLogs'
import { getPublicImageUrl } from '../utils/publicAssets'
import { SECTION_OPTIONS } from '../lib/sections'

export default function StaffLogin() {
  const [isRegister, setIsRegister] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail.trim()) {
      setError('Please enter your email address.')
      return
    }
    setError('')
    setForgotSuccess('')
    setForgotLoading(true)
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim())
      setForgotSuccess('Check your email for the password reset link.')
      setForgotEmail('')
    } catch (err) {
      setError(err.message || 'Failed to send reset email.')
    }
    setForgotLoading(false)
  }

  const onFormSubmit = (e) => {
    e.preventDefault()
    if (showForgotPassword) {
      handleForgotPassword(e)
      return
    }
    handleSubmit(e)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (isRegister && !fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (isRegister && !selectedSection) {
      setError('Please select a section.')
      return
    }
    setLoading(true)
    try {
      if (isRegister) {
        const cred = await signUp(email, password)
        await setDoc(doc(db, 'users', cred.user.uid), { fullName: fullName.trim(), email: cred.user.email, role: 'staff', section: selectedSection, allowedSections: [selectedSection], createdAt: new Date().toISOString() })
        await addSystemLog({ action: 'login', userId: cred.user.uid, userEmail: cred.user.email, role: 'staff', details: 'Staff registered and signed in.' })
        navigate('/dashboard')
      } else {
        await signIn(email, password)
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        const role = userDoc.exists() ? userDoc.data().role : 'staff'
        if (role === 'admin') {
          setError('Admins should use the Admin Portal to sign in.')
          setLoading(false)
          return
        }
        await addSystemLog({ action: 'login', userId: auth.currentUser.uid, userEmail: auth.currentUser.email, role: 'staff', details: 'Staff signed in.' })
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.')
    }
    setLoading(false)
  }

  const theme = {
    darkGreen: '#1a3d24',
    mutedGreen: '#5c7355',
    lightKhaki: '#c4b896',
    paleCream: '#f5f0e6',
  }

  return (
    <div
      className="min-h-screen w-full relative flex flex-col items-center justify-center py-12 px-4 sm:px-6"
      style={{
        background: `linear-gradient(180deg, ${theme.darkGreen} 0%, ${theme.mutedGreen} 28%, ${theme.lightKhaki} 55%, ${theme.paleCream} 100%)`,
      }}
    >
      <div className="admin-login-page w-full max-w-[420px]">
        <div className="admin-login-card relative w-full rounded-3xl overflow-hidden transition-all duration-500 ease-out shadow-xl border-2 border-white/20" style={{ backgroundColor: theme.paleCream }}>
          <Link
            to="/"
            aria-label="Back to Home"
            className="absolute left-3 top-3 z-10 inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ease-out active:scale-95 text-[#1a3d24] hover:bg-white/60 border border-[#5c7355]/30"
            style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
          >
            <iconify-icon icon="mdi:arrow-left" width="22" height="22"></iconify-icon>
          </Link>
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6 pb-5 border-b" style={{ borderColor: theme.lightKhaki }}>
              <div className="admin-login-stagger-1 inline-flex items-center justify-center p-3 rounded-2xl mb-3.5 transition-all duration-500 ease-out hover:scale-105 bg-white/80 border border-[#5c7355]/20 shadow-sm">
                <img src={getPublicImageUrl('DALOGO.png')} alt="DA Logo" className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-contain" />
              </div>
              <h1 className="admin-login-stagger-2 text-xl font-extrabold tracking-tight" style={{ color: theme.darkGreen }}>Staff Portal</h1>
              <p className="admin-login-stagger-3 text-sm mt-2 font-medium" style={{ color: theme.mutedGreen }}>Sign in or register as Standard User</p>
            </div>

            <form onSubmit={onFormSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: theme.darkGreen }}>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isRegister}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl placeholder-[#5c7355]/60 focus:ring-2 focus:ring-[#1a3d24]/30 transition-all duration-300 ease-out outline-none bg-white border border-[#c4b896]"
                    placeholder="Juan dela Cruz"
                  />
                  <p className="text-xs mt-1 font-medium" style={{ color: theme.mutedGreen }}>This name will be visible to administrators in User Management.</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: theme.darkGreen }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl placeholder-[#5c7355]/60 focus:ring-2 focus:ring-[#1a3d24]/30 transition-all duration-300 ease-out outline-none bg-white border border-[#c4b896]"
                  placeholder="user@agency.gov.ph"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: theme.darkGreen }}>Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 pr-12 text-sm rounded-xl placeholder-[#5c7355]/60 focus:ring-2 focus:ring-[#1a3d24]/30 transition-all duration-300 ease-out outline-none bg-white border border-[#c4b896]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center rounded-r-xl transition-all duration-300 ease-out"
                    style={{ color: theme.mutedGreen }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <iconify-icon icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} width="20" height="20"></iconify-icon>
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: theme.darkGreen }}>Section (required)</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    required={isRegister}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl focus:ring-2 focus:ring-[#1a3d24]/30 outline-none transition-all duration-300 ease-out bg-white border border-[#c4b896]"
                    style={{ color: theme.darkGreen }}
                  >
                    <option value="">Select your section</option>
                    {SECTION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <p className="text-xs mt-1 font-medium" style={{ color: theme.mutedGreen }}>You will only have access to this section after registration.</p>
                </div>
              )}

              {showForgotPassword && (
                <div className="admin-login-forgot-in p-4 rounded-2xl space-y-3 bg-white/90 border border-[#c4b896]">
                  <p className="text-sm font-bold" style={{ color: theme.darkGreen }}>Reset password</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl placeholder-[#5c7355]/60 focus:ring-2 focus:ring-[#1a3d24]/30 outline-none transition-all duration-300 ease-out border border-[#c4b896] bg-white"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setShowForgotPassword(false); setForgotEmail(''); setForgotSuccess(''); setError(''); }}
                        className="flex-1 py-2 text-sm font-semibold rounded-xl border border-[#c4b896] bg-white hover:bg-[#f5f0e6] transition-all duration-300 ease-out"
                        style={{ color: theme.darkGreen }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-2 text-sm font-bold text-white rounded-xl disabled:opacity-60 transition-all duration-300 ease-out hover:opacity-95"
                        style={{ backgroundColor: theme.darkGreen }}
                      >
                        {forgotLoading ? (
                          <span className="inline-flex items-center justify-center gap-1.5">
                            <span className="inline-flex login-spinner"><iconify-icon icon="mdi:loading" width="18" height="18"></iconify-icon></span>
                            Sending...
                          </span>
                        ) : (
                          'Send reset link'
                        )}
                      </button>
                    </div>
                  </div>
                  {forgotSuccess && (
                    <p className="admin-login-success-in text-sm font-semibold flex items-center gap-1.5" style={{ color: theme.darkGreen }}>
                      <iconify-icon icon="mdi:check-circle-outline" width="18" height="18"></iconify-icon>
                      {forgotSuccess}
                    </p>
                  )}
                </div>
              )}

              {error && (
                <div className="admin-login-error-in flex items-start gap-2 p-3 rounded-xl bg-red-50/90 border border-red-300">
                  <iconify-icon icon="mdi:alert-circle-outline" className="text-red-600 shrink-0 mt-0.5" width="18" height="18"></iconify-icon>
                  <p className="text-sm text-red-800 font-semibold leading-snug">{error}</p>
                </div>
              )}

              {!showForgotPassword && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[44px] flex items-center justify-center py-0 text-sm mt-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-[#1a3d24]/30 transition-all duration-300 ease-out disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0 transform active:scale-[0.98]"
                  style={{ backgroundColor: theme.darkGreen }}
                >
                  {loading ? (
                    <span className="login-loading-inner">
                      <span className="inline-flex login-spinner shrink-0">
                        <iconify-icon icon="mdi:loading" width="18" height="18"></iconify-icon>
                      </span>
                      <span className="login-loading-text">Please wait...</span>
                    </span>
                  ) : isRegister ? 'Register as User' : 'Login'}
                </button>
              )}
            </form>

            <div className="mt-5 pt-5 flex flex-col items-center border-t" style={{ borderColor: theme.lightKhaki }}>
              {isRegister ? (
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); setFullName(''); setSelectedSection(''); }}
                  className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold border border-[#c4b896] bg-white hover:bg-[#f5f0e6] transition-all duration-300 ease-out active:scale-[0.98]"
                  style={{ color: theme.darkGreen }}
                >
                  Login
                </button>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsRegister(true); setError(''); setFullName(''); setSelectedSection(''); }}
                    className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold border border-[#c4b896] bg-white hover:bg-[#f5f0e6] transition-all duration-300 ease-out active:scale-[0.98]"
                    style={{ color: theme.darkGreen }}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(true); setError(''); setForgotSuccess(''); }}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-sm font-bold border border-[#c4b896] bg-white hover:bg-[#f5f0e6] transition-all duration-300 ease-out active:scale-[0.98]"
                    style={{ color: theme.darkGreen }}
                  >
                    <iconify-icon icon="mdi:lock-reset" width="18" height="18"></iconify-icon>
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
