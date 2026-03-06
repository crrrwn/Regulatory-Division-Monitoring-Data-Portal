import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { COLLECTIONS, RATING_FIELD_KEYS } from '../lib/collections'
import { getMonthFromDoc, getProvinceFromDoc, getYearFromDoc } from '../lib/recordFilters'

const defaultStats = {
  total: 0,
  byMonth: {},
  byYear: {},
  byProvince: {},
  byUnit: {},
  unitRatings: {},
}

function parseRatingVal(v) {
  if (v == null || v === '') return null
  const n = parseInt(v, 10)
  return isNaN(n) || n < 1 || n > 5 ? null : n
}

async function fetchAnalytics() {
  const byMonth = {}
  const byYear = {}
  const byProvince = {}
  const byUnit = {}
  const unitRatings = {}
  let total = 0

  for (const { id, label } of COLLECTIONS) {
    const snap = await getDocs(collection(db, id))
    const count = snap.size
    total += count
    byUnit[id] = { count, label }

    const ratingSums = {}
    const ratingCounts = {}
    const byScore = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let ratedCount = 0

    snap.docs.forEach((d) => {
      const data = d.data()
      const month = getMonthFromDoc(data)
      if (month) byMonth[month] = (byMonth[month] || 0) + 1
      let year = getYearFromDoc(data, id)
      if (!year) {
        const month = getMonthFromDoc(data)
        if (month) year = month.slice(0, 4)
      }
      if (year) byYear[year] = (byYear[year] || 0) + 1
      const province = getProvinceFromDoc(data)
      if (province) byProvince[province] = (byProvince[province] || 0) + 1

      let hasAnyRating = false
      const rowScores = []
      RATING_FIELD_KEYS.forEach((key) => {
        const val = parseRatingVal(data[key])
        if (val != null) {
          hasAnyRating = true
          ratingSums[key] = (ratingSums[key] || 0) + val
          ratingCounts[key] = (ratingCounts[key] || 0) + 1
          rowScores.push(val)
        }
      })
      if (hasAnyRating && rowScores.length > 0) {
        ratedCount += 1
        const overall = rowScores.reduce((a, b) => a + b, 0) / rowScores.length
        const score = Math.round(overall)
        if (score >= 1 && score <= 5) byScore[score] = (byScore[score] || 0) + 1
      }
    })

    const averages = {}
    RATING_FIELD_KEYS.forEach((key) => {
      const sum = ratingSums[key]
      const c = ratingCounts[key]
      if (c > 0 && sum != null) averages[key] = (sum / c).toFixed(1)
    })
    const overallSum = Object.values(ratingSums).reduce((a, b) => a + b, 0)
    const overallN = Object.values(ratingCounts).reduce((a, b) => a + b, 0)
    const overallAvg = overallN > 0 ? overallSum / overallN : null

    unitRatings[id] = {
      totalRecords: count,
      ratedCount,
      overallAvg: overallAvg != null ? Number(overallAvg.toFixed(2)) : null,
      averages,
      byScore,
    }
  }

  return { total, byMonth, byYear, byProvince, byUnit, unitRatings }
}

const AnalyticsContext = createContext(null)

export function AnalyticsProvider({ children }) {
  const [stats, setStats] = useState(defaultStats)

  const refresh = useCallback(async () => {
    const next = await fetchAnalytics()
    setStats(next)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = { stats, refresh }
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) throw new Error('useAnalytics must be used within AnalyticsProvider')
  return ctx
}
