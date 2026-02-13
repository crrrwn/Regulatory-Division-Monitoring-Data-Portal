import { useState } from 'react'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'

export function useFormSubmit(collectionName) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const { user } = useAuth()

  const submit = async (data, docId = null) => {
    setLoading(true)
    setMessage(null)
    try {
      const payload = {
        ...data,
        createdBy: user?.uid || null,
        createdAt: new Date().toISOString(),
      }
      if (docId) {
        await updateDoc(doc(db, collectionName, docId), { ...data, updatedAt: new Date().toISOString() })
        setMessage({ type: 'success', text: 'Record updated successfully.' })
      } else {
        await addDoc(collection(db, collectionName), payload)
        setMessage({ type: 'success', text: 'Record saved successfully.' })
      }
      return true
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save.' })
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, message, setMessage }
}
