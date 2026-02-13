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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setRole(null)
        setLoading(false)
        return
      }
      setUser(firebaseUser)
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      setRole(userDoc.exists() ? userDoc.data().role : 'staff')
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password)
  const signOut = () => firebaseSignOut(auth)

  const value = { user, role, loading, signIn, signUp, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
