import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB7wO778OuslNRSHXX6sAU2cUMTduUHFdU',
  authDomain: 'regulatory-division-system.firebaseapp.com',
  projectId: 'regulatory-division-system',
  storageBucket: 'regulatory-division-system.firebasestorage.app',
  messagingSenderId: '446475268158',
  appId: '1:446475268158:web:3f30ad3f42586fdf22216f',
  measurementId: 'G-DGDHPVTJ4F',
}

const app = initializeApp(firebaseConfig)
let analytics = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export { analytics }
export default app
