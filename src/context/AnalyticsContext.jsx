import { createContext, useContext, useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { COLLECTIONS } from '../lib/collections'
import { getMonthFromDoc, getProvinceFromDoc } from '../lib/recordFilters'

const defaultStats = { byUnit: {}, byMonth: {}, byProvince: {}, total: 0 }

const AnalyticsContext = createContext({
  stats: defaultStats,
  refresh: () => {},
})

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) throw new Error('useAnalytics must be used within AnalyticsProvider')
  return ctx
}

export function AnalyticsProvider({ children }) {
  const [stats, setStats] = useState(defaultStats)

  const load = async () => {
    const byUnit = {}
    const byMonth = {}
    const byProvince = {}
    let total = 0

    for (const c of COLLECTIONS) {
      const snap = await getDocs(collection(db, c.id))
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

      byUnit[c.id] = { label: c.label, count: list.length }
      total += list.length

      list.forEach((doc) => {
        const month = getMonthFromDoc(doc)
        if (month) byMonth[month] = (byMonth[month] || 0) + 1
        const prov = getProvinceFromDoc(doc)
        if (prov) byProvince[prov] = (byProvince[prov] || 0) + 1
      })
    }

    setStats({ byUnit, byMonth, byProvince, total })
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <AnalyticsContext.Provider value={{ stats, refresh: load }}>
      {children}
    </AnalyticsContext.Provider>
  )
}
