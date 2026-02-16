import { createContext, useContext, useState, useEffect } from 'react'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { COLLECTIONS } from '../lib/collections'
import { getMonthFromDoc, getProvinceFromDoc } from '../lib/recordFilters'
import { RATING_FIELD_KEYS } from '../lib/collections'

const RATING_COLLECTION_IDS = ['animalFeed', 'animalWelfare', 'livestockHandlers', 'transportCarrier', 'plantMaterial', 'organicAgri', 'goodAgriPractices', 'goodAnimalHusbandry', 'organicPostMarket', 'landUseMatter', 'foodSafety', 'plantPestSurveillance', 'cfsAdmcc', 'animalDiseaseSurveillance', 'safdzValidation']

const defaultStats = { byUnit: {}, byMonth: {}, byProvince: {}, total: 0, unitRatings: {} }

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
    const unitRatings = {}
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

      // Aggregate ratings for collections that have them
      if (RATING_COLLECTION_IDS.includes(c.id) && list.length > 0) {
        const byField = {}
        const byScore = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        let ratedCount = 0
        RATING_FIELD_KEYS.forEach((field) => { byField[field] = { sum: 0, count: 0 } })
        list.forEach((doc) => {
          let hasAny = false
          RATING_FIELD_KEYS.forEach((field) => {
            const v = doc[field]
            if (v !== '' && v != null) {
              const n = parseInt(v, 10)
              if (!isNaN(n) && n >= 1 && n <= 5) {
                byField[field].sum += n
                byField[field].count += 1
                byScore[n] = (byScore[n] || 0) + 1
                hasAny = true
              }
            }
          })
          if (hasAny) ratedCount++
        })
        unitRatings[c.id] = {
          byField, byScore, ratedCount, totalRecords: list.length,
          averages: Object.fromEntries(RATING_FIELD_KEYS.map((f) => [f, byField[f].count > 0 ? (byField[f].sum / byField[f].count).toFixed(2) : null])),
          overallAvg: (() => {
            const totalSum = RATING_FIELD_KEYS.reduce((acc, f) => acc + byField[f].sum, 0)
            const totalCount = RATING_FIELD_KEYS.reduce((acc, f) => acc + byField[f].count, 0)
            return totalCount > 0 ? totalSum / totalCount : 0
          })(),
        }
      }
    }

    setStats({ byUnit, byMonth, byProvince, total, unitRatings })
  }

  useEffect(() => {
    load()
  }, [])

  // Real-time listener for Plant Pest Surveillance and CFS/ADMCC (ratings update live)
  useEffect(() => {
    const cols = COLLECTIONS.filter((c) => RATING_COLLECTION_IDS.includes(c.id))
    if (cols.length === 0) return
    const unsubs = cols.map((col) => onSnapshot(collection(db, col.id), () => load()))
    return () => unsubs.forEach((u) => u())
  }, [])

  return (
    <AnalyticsContext.Provider value={{ stats, refresh: load }}>
      {children}
    </AnalyticsContext.Provider>
  )
}
