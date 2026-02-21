import { useState } from 'react'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { addSystemLog } from '../lib/systemLogs'

export function useFormSubmit(collectionName) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const { user, role } = useAuth()
  const { showNotification } = useNotification()

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
        showNotification({ type: 'success', title: 'Changes saved', message: 'Record updated successfully.' })
        addSystemLog({ action: 'record_updated', userId: user?.uid, userEmail: user?.email, role: role || 'staff', details: `${collectionName} record updated.` }).catch(() => {})
      } else {
        await addDoc(collection(db, collectionName), payload)
        setMessage({ type: 'success', text: 'Record saved successfully.' })
        showNotification({ type: 'success', title: 'Record submitted', message: 'Record saved successfully.' })
        addSystemLog({ action: 'record_submitted', userId: user?.uid, userEmail: user?.email, role: role || 'staff', details: `${collectionName} record submitted.` }).catch(() => {})
      }
      return true
    } catch (err) {
      const text = err.message || 'Failed to save.'
      setMessage({ type: 'error', text })
      showNotification({ type: 'error', title: 'Error', message: text })
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, message, setMessage }
}
