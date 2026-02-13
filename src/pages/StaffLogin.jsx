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
    <div className="w-full max-w-md mx-auto py-8 sm:py-12 px-3 sm:px-4">
      <div className="bg-white rounded-xl shadow-lg border border-border p-4 sm:p-6 md:p-8">
        <div className="text-center mb-6">
          <img src="/DA LOGO.jpg" alt="DA" className="h-16 w-16 rounded-full mx-auto object-cover border-2 border-primary/20 mb-4" />
          <h1 className="text-xl font-bold text-primary">Staff Portal</h1>
          <p className="text-sm text-[#5c574f] mt-1">Sign in or register as Standard User</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="user@agency.gov.ph"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login as User'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#5c574f]">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-primary font-medium hover:underline">
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
        <p className="mt-2 text-center">
          <Link to="/" className="text-sm text-primary hover:underline">← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}
