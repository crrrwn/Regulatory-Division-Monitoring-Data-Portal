import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  const role = userDoc?.role ?? null
  const userSection = userDoc?.section ?? null
  const userAllowedSections = Array.isArray(userDoc?.allowedSections) && userDoc.allowedSections.length > 0
    ? userDoc.allowedSections
    : userDoc?.section ? [userDoc.section] : []

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser)
        if (!firebaseUser) {
          setUserDoc(null)
          return
        }
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
          setUserDoc(snap.exists() ? snap.data() : null)
        } catch {
          setUserDoc(null)
        }
      } catch (e) {
        console.warn('[Auth] onAuthStateChanged error:', e?.message)
        setUser(null)
        setUserDoc(null)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password)
  const signOut = () => firebaseSignOut(auth)

  const value = {
    user,
    role,
    userSection,
    userAllowedSections,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
