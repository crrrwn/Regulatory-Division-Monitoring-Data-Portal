import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

export default function StaffLogin() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        const cred = await signUp(email, password)
        await setDoc(doc(db, 'users', cred.user.uid), { email: cred.user.email, role: 'staff', createdAt: new Date().toISOString() })
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
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4 sm:p-6" style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))', paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 w-full max-w-md relative overflow-hidden transition-all duration-300">
        
        {/* Subtle Accent Bar on Top */}
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

        <div className="text-center mb-8 mt-2">
          <div className="inline-block p-1 bg-slate-50 rounded-full shadow-sm mb-4">
            <img src="/DALOGO.png" alt="DA" className="h-20 w-20 rounded-full mx-auto object-cover border-4 border-white shadow-sm" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Staff Portal</h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">Sign in or register as Standard User</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 outline-none shadow-sm"
              placeholder="user@agency.gov.ph"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 outline-none shadow-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <iconify-icon icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} width="22" height="22"></iconify-icon>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg shadow-sm">
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] py-3 mt-4 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-dark hover:shadow-lg focus:ring-4 focus:ring-primary/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login as User'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center space-y-4">
          <p className="text-sm text-slate-500 font-medium">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button" 
              onClick={() => { setIsRegister(!isRegister); setError(''); }} 
              className="text-primary font-bold hover:text-primary-dark hover:underline transition-colors ml-1"
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
          
          <Link 
            to="/" 
            className="text-sm font-medium text-slate-400 hover:text-primary transition-colors flex items-center"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}