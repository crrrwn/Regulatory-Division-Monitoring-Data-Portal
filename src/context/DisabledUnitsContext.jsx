import { createContext, useContext, useEffect, useState } from 'react'
import { getDisabledUnits } from '../lib/settings'

const DisabledUnitsContext = createContext(null)

export function DisabledUnitsProvider({ children }) {
  const [disabledUnitIds, setDisabledUnitIds] = useState([])

  useEffect(() => {
    let cancelled = false
    getDisabledUnits().then((ids) => {
      if (!cancelled) setDisabledUnitIds(Array.isArray(ids) ? ids : [])
    })
    return () => { cancelled = true }
  }, [])

  const value = { disabledUnitIds }
  return (
    <DisabledUnitsContext.Provider value={value}>
      {children}
    </DisabledUnitsContext.Provider>
  )
}

export function useDisabledUnits() {
  const ctx = useContext(DisabledUnitsContext)
  if (!ctx) throw new Error('useDisabledUnits must be used within DisabledUnitsProvider')
  return ctx
}
