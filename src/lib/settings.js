import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { ADMIN_REGISTRATION_CODE as DEFAULT_CODE } from '../config'

const SETTINGS_DOC = 'app'
const SETTINGS_COLLECTION = 'settings'

/**
 * Get admin registration code from Firestore; fallback to config default.
 * @returns {Promise<string>}
 */
export async function getAdminRegistrationCode() {
  try {
    const ref = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC)
    const snap = await getDoc(ref)
    if (snap.exists() && snap.data().adminRegistrationCode) {
      return String(snap.data().adminRegistrationCode).trim()
    }
  } catch (e) {
    console.error('Failed to get admin registration code:', e)
  }
  return DEFAULT_CODE
}

/**
 * Save admin registration code to Firestore.
 * @param {string} code
 */
export async function setAdminRegistrationCode(code) {
  const ref = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC)
  await setDoc(ref, { adminRegistrationCode: (code || '').trim(), updatedAt: new Date().toISOString() }, { merge: true })
}
