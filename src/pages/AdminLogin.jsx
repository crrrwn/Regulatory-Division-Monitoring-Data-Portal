import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { ADMIN_REGISTRATION_CODE } from '../config'

export default function AdminLogin() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminCode, setShowAdminCode] = useState(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        if (adminCode.trim() !== ADMIN_REGISTRATION_CODE) {
          setError('Invalid Admin Code. Only authorized personnel can register as Admin.')
          setLoading(false)
          return
        }
        const cred = await signUp(email, password)
        await setDoc(doc(db, 'users', cred.user.uid), { email: cred.user.email, role: 'admin', createdAt: new Date().toISOString() })
        navigate('/dashboard')
      } else {
        await signIn(email, password)
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        const role = userDoc.exists() ? userDoc.data().role : 'staff'
        if (role !== 'admin') {
          setError('This portal is for Administrators only. Use Staff Portal for standard access.')
          setLoading(false)
          return
        }
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full relative">
      <div className="fixed inset-0 z-0" aria-hidden="true" style={{ transform: 'translateZ(0)' }}>
        <img
          src="/ABOUTPAGE.png"
          alt=""
          className="w-full h-full object-cover object-center"
          role="presentation"
        />
      </div>
      <div className="admin-login-page relative z-10 min-h-[80vh] pt-14 pb-10 px-4 sm:px-6 flex flex-col items-center justify-center">
        {/* Frosted glass — styles in index.css so same look on refresh */}
        <div className="admin-login-card relative w-full max-w-[420px] rounded-3xl overflow-hidden p-0 transition-all duration-500 ease-out">
          <Link
            to="/"
            aria-label="Back to Home"
            className="absolute left-3 top-3 z-10 inline-flex items-center justify-center w-10 h-10 rounded-xl text-black border border-white/60 hover:border-slate-300 transition-all duration-300 ease-out active:scale-95"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset' }}
          >
            <iconify-icon icon="mdi:arrow-left" width="22" height="22"></iconify-icon>
          </Link>
          <div className="p-5 sm:p-6">
            <div className="text-center mb-6 pb-5 border-b border-slate-200">
              <div
                className="admin-login-stagger-1 inline-flex items-center justify-center p-2.5 rounded-2xl mb-3.5 transition-all duration-500 ease-out hover:scale-105"
                style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset' }}
              >
                <img src="/DALOGO.png" alt="DA Logo" className="h-11 w-11 sm:h-12 sm:w-12 rounded-lg object-contain" />
              </div>
              <h1 className="admin-login-stagger-2 text-xl font-extrabold text-black tracking-tight">Admin Portal</h1>
              <p className="admin-login-stagger-3 text-sm text-black/80 mt-2 font-medium">Sign in or register as Administrator</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl text-black placeholder-slate-500 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-300 ease-out outline-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.7)' }}
                placeholder="admin@agency.gov.ph"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1.5">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 pr-12 text-sm rounded-xl text-black placeholder-slate-500 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-300 ease-out outline-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.7)' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center rounded-r-xl text-slate-600 hover:text-black hover:bg-white/50 transition-all duration-300 ease-out"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <iconify-icon icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} width="20" height="20"></iconify-icon>
                </button>
              </div>
            </div>

            {showForgotPassword && (
              <div
                className="admin-login-forgot-in p-4 rounded-2xl border border-slate-200 space-y-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
              >
                <p className="text-sm font-bold text-black">Reset password</p>
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl text-black placeholder-slate-500 focus:ring-2 focus:ring-primary/40 outline-none transition-all duration-300 ease-out"
                    style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.7)' }}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setShowForgotPassword(false); setForgotEmail(''); setForgotSuccess(''); setError(''); }}
                      className="flex-1 py-2 text-sm font-semibold text-black rounded-xl border border-slate-300 hover:bg-white/70 transition-all duration-300 ease-out"
                      style={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-2 text-sm font-bold text-white rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-60 transition-all duration-300 ease-out"
                    >
                      {forgotLoading ? (
                        <span className="inline-flex items-center justify-center gap-1.5">
                          <iconify-icon icon="mdi:loading" className="animate-spin" width="18" height="18"></iconify-icon>
                          Sending...
                        </span>
                      ) : (
                        'Send reset link'
                      )}
                    </button>
                  </div>
                </form>
                {forgotSuccess && (
                  <p className="admin-login-success-in text-sm text-black font-semibold flex items-center gap-1.5">
                    <iconify-icon icon="mdi:check-circle-outline" width="18" height="18"></iconify-icon>
                    {forgotSuccess}
                  </p>
                )}
              </div>
            )}

            {isRegister && (
              <div className="admin-login-admin-code">
                <label className="block text-sm font-bold text-black mb-1.5">Admin Code</label>
                <div className="relative flex items-center">
                  <input
                    type={showAdminCode ? 'text' : 'password'}
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 pr-12 text-sm rounded-xl text-black placeholder-slate-500 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-300 ease-out outline-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.7)' }}
                    placeholder="Enter admin registration code"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminCode((p) => !p)}
                    className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center rounded-r-xl text-slate-600 hover:text-black hover:bg-white/50 transition-all duration-300 ease-out"
                    aria-label={showAdminCode ? 'Hide admin code' : 'Show admin code'}
                  >
                    <iconify-icon icon={showAdminCode ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} width="20" height="20"></iconify-icon>
                  </button>
                </div>
                <p className="text-xs text-black/80 mt-2 font-medium">Only users with the correct Admin Code can register as Admin.</p>
              </div>
            )}

            {error && (
              <div
                className="admin-login-error-in flex items-start gap-2 p-3 rounded-xl border border-red-300/80"
                style={{ backgroundColor: 'rgba(254,226,226,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(248,113,113,0.5)' }}
              >
                <iconify-icon icon="mdi:alert-circle-outline" className="text-red-600 shrink-0 mt-0.5" width="18" height="18"></iconify-icon>
                <p className="text-sm text-red-800 font-semibold leading-snug">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] py-3 text-sm mt-4 bg-gradient-to-b from-primary to-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 focus:ring-4 focus:ring-primary/40 transition-all duration-300 ease-out disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transform active:scale-[0.98] ring-2 ring-primary/20"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <iconify-icon icon="mdi:loading" className="animate-spin" width="20" height="20"></iconify-icon>
                  Please wait...
                </span>
              ) : isRegister ? 'Register as Admin' : 'Login'}
            </button>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-200 flex flex-col items-center">
            {isRegister ? (
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(''); }}
                className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold text-black border border-slate-300 hover:border-slate-400 transition-all duration-300 ease-out active:scale-[0.98]"
                style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              >
                Login
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(''); }}
                  className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold text-black border border-slate-300 hover:border-slate-400 transition-all duration-300 ease-out active:scale-[0.98]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(true); setError(''); setForgotSuccess(''); }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-sm font-bold text-black border border-slate-300 hover:border-slate-400 transition-all duration-300 ease-out active:scale-[0.98]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
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
