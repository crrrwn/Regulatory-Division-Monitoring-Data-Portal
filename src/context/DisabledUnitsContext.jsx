import { createContext, useContext, useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

const DisabledUnitsContext = createContext({ disabledUnitIds: [], isReady: false })

export function useDisabledUnits() {
  const ctx = useContext(DisabledUnitsContext)
  if (!ctx) return { disabledUnitIds: [], isReady: false }
  return ctx
}

/** Returns COLLECTIONS filtered to only enabled units. Use in views that should hide disabled units. */
export function useEnabledCollections(collections) {
  const { disabledUnitIds } = useDisabledUnits()
  if (!collections) return []
  return collections.filter((c) => !disabledUnitIds.includes(c.id))
}

export function DisabledUnitsProvider({ children }) {
  const [disabledUnitIds, setDisabledUnitIds] = useState([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const ref = doc(db, 'settings', 'app')
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const list = snap.exists() && Array.isArray(snap.data()?.disabledUnits) ? snap.data().disabledUnits : []
        setDisabledUnitIds(list)
        setIsReady(true)
      },
      (err) => {
        console.error('DisabledUnitsContext snapshot error:', err)
        setIsReady(true)
      }
    )
    return () => unsub()
  }, [])

  return (
    <DisabledUnitsContext.Provider value={{ disabledUnitIds, isReady }}>
      {children}
    </DisabledUnitsContext.Provider>
  )
}
