import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  const [userSection, setUserSection] = useState(null)
  const [userAllowedSections, setUserAllowedSections] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setRole(null)
        setUserSection(null)
        setUserAllowedSections(null)
        setLoading(false)
        return
      }
      setUser(firebaseUser)
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      const data = userDoc.exists() ? userDoc.data() : {}
      setRole(data.role || 'staff')
      setUserSection(data.section || null)
      const allowed = Array.isArray(data.allowedSections) && data.allowedSections.length > 0
        ? data.allowedSections
        : data.section ? [data.section] : null
      setUserAllowedSections(allowed)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password)
  const signOut = () => firebaseSignOut(auth)

  const value = { user, role, userSection, userAllowedSections, loading, signIn, signUp, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
