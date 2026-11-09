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

async function fetchRecords() {
  const snaps = await Promise.all(
    COLLECTIONS.map(({ id }) => getDocs(collection(db, id)))
  )
  const currentYear = new Date().getFullYear()

  return COLLECTIONS.flatMap(({ id }, idx) => snaps[idx].docs.map((d) => {
    const data = d.data()
    const month = getMonthFromDoc(data)
    let year = getYearFromDoc(data, id)
    if (!year) {
      if (month) year = month.slice(0, 4)
    }
    if (year && Number(year) > currentYear) year = 'Unknown'
    if (!year) year = 'Unknown'
    return {
      collectionId: id,
      year,
      month,
      province: getProvinceFromDoc(data),
      semester: data.semester || '',
      ratings: RATING_FIELD_KEYS.map((key) => data[key]),
    }
  }))
}

function buildAnalytics(records, filters) {
  const byMonth = {}
  const byYear = {}
  const byProvince = {}
  const byUnit = {}
  const unitRatings = {}
  let total = 0

  const filteredRecords = records.filter(({ year, semester }) => (
    (!filters.year || year === filters.year) &&
    (!filters.semester || semester === filters.semester)
  ))
  const recordsByUnit = Object.fromEntries(COLLECTIONS.map(({ id }) => [id, []]))
  filteredRecords.forEach((record) => recordsByUnit[record.collectionId].push(record))

  COLLECTIONS.forEach(({ id, label }) => {
    const unitRecords = recordsByUnit[id]
    const count = unitRecords.length
    total += count
    byUnit[id] = { count, label, byProvince: {} }
    const ratingSums = {}
    const ratingCounts = {}
    const byScore = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let ratedCount = 0

    unitRecords.forEach(({ month, year, province, ratings }) => {
      if (month) byMonth[month] = (byMonth[month] || 0) + 1
      byYear[year] = (byYear[year] || 0) + 1
      if (province) {
        byProvince[province] = (byProvince[province] || 0) + 1
      }
      const unitProvince = province || 'Unspecified'
      byUnit[id].byProvince[unitProvince] = (byUnit[id].byProvince[unitProvince] || 0) + 1

      let hasAnyRating = false
      const rowScores = []
      RATING_FIELD_KEYS.forEach((key, idx) => {
        const val = parseRatingVal(ratings[idx])
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
  })

  return { total, byMonth, byYear, byProvince, byUnit, unitRatings }
}

const AnalyticsContext = createContext(null)

export function AnalyticsProvider({ children }) {
  const [stats, setStats] = useState(defaultStats)
  const [filteredStats, setFilteredStats] = useState(defaultStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [records, setRecords] = useState([])
  const [filters, setFilters] = useState({ semester: '', year: '' })

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const nextRecords = await fetchRecords()
      setRecords(nextRecords)
      setStats(buildAnalytics(nextRecords, { semester: '', year: '' }))
    } catch (err) {
      console.error('[Analytics] Failed to fetch:', err)
      setError(err?.message || 'Failed to load records')
      setStats(defaultStats)
      setFilteredStats(defaultStats)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    setFilteredStats(buildAnalytics(records, filters))
  }, [records, filters])

  const filterOptions = {
    years: [...new Set(records.map(({ year }) => year))].sort((a, b) => {
      if (a === 'Unknown') return 1
      if (b === 'Unknown') return -1
      return Number(b) - Number(a)
    }),
  }
  const value = { stats, filteredStats, refresh, loading, error, filters, setFilters, filterOptions }
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) {
    console.warn('useAnalytics used outside AnalyticsProvider — using default stats')
    return {
      stats: defaultStats,
      filteredStats: defaultStats,
      refresh: () => Promise.resolve(),
      loading: false,
      error: null,
      filters: { semester: '', year: '' },
      setFilters: () => {},
      filterOptions: { years: [] },
    }
  }
  return ctx
}
