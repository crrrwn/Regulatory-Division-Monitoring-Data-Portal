import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { COLLECTIONS } from '../lib/collections'
import { getMonthFromDoc, getProvinceFromDoc, formatMonthLabel } from '../lib/recordFilters'
import { PROVINCES } from '../lib/regions'

export default function DataAnalytics() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ byUnit: {}, byMonth: {}, byProvince: {}, total: 0 })
  const [allDocs, setAllDocs] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const byUnit = {}
      const byMonth = {}
      const byProvince = {}
      let total = 0
      const docsPerCol = []

      for (const c of COLLECTIONS) {
        const snap = await getDocs(collection(db, c.id))
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        docsPerCol.push({ collectionId: c.id, label: c.label, docs: list })
        byUnit[c.id] = { label: c.label, count: list.length }
        total += list.length
        list.forEach((doc) => {
          const month = getMonthFromDoc(doc)
          if (month) {
            byMonth[month] = (byMonth[month] || 0) + 1
          }
          const prov = getProvinceFromDoc(doc)
          if (prov) {
            byProvince[prov] = (byProvince[prov] || 0) + 1
          }
        })
      }

      if (!cancelled) {
        setStats({ byUnit, byMonth, byProvince, total })
        setAllDocs(docsPerCol)
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const monthEntries = Object.entries(stats.byMonth).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 12)
  const provinceEntries = Object.entries(stats.byProvince).sort((a, b) => b[1] - a[1])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-pulse text-muted">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Data Analytics</h2>
        <Link to="/dashboard" className="text-primary hover:underline font-medium flex items-center gap-1 w-fit">
          <iconify-icon icon="mdi:arrow-left" width="20"></iconify-icon>
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg sm:rounded-xl border border-border p-3 sm:p-5 shadow-sm">
          <p className="text-xs sm:text-sm text-[#5c574f] mb-1">Total Records</p>
          <p className="text-xl sm:text-2xl font-bold text-primary">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-border p-3 sm:p-5 shadow-sm">
          <p className="text-xs sm:text-sm text-[#5c574f] mb-1">Units</p>
          <p className="text-xl sm:text-2xl font-bold text-primary">{COLLECTIONS.length}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-border p-3 sm:p-5 shadow-sm">
          <p className="text-xs sm:text-sm text-[#5c574f] mb-1">Months with data</p>
          <p className="text-xl sm:text-2xl font-bold text-primary">{Object.keys(stats.byMonth).length}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-border p-3 sm:p-5 shadow-sm">
          <p className="text-xs sm:text-sm text-[#5c574f] mb-1">Provinces with data</p>
          <p className="text-xl sm:text-2xl font-bold text-primary">{Object.keys(stats.byProvince).length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg sm:rounded-xl border border-border overflow-hidden min-w-0">
          <div className="px-3 sm:px-5 py-2 sm:py-3 bg-surface font-semibold text-primary border-b border-border text-sm sm:text-base">Records per Unit</div>
          <div className="overflow-x-auto max-h-[300px] sm:max-h-[400px] overflow-y-auto">
            <table className="w-full text-xs sm:text-sm min-w-[200px]">
              <thead className="bg-background sticky top-0">
                <tr>
                  <th className="text-left p-2 sm:p-3 font-medium text-primary">Unit</th>
                  <th className="text-right p-2 sm:p-3 font-medium text-primary">Count</th>
                </tr>
              </thead>
              <tbody>
                {COLLECTIONS.map((c) => (
                  <tr key={c.id} className="border-t border-border">
<td className="p-2 sm:p-3 truncate max-w-[180px] sm:max-w-none" title={c.label}>{c.label}</td>
                  <td className="p-2 sm:p-3 text-right font-medium">{stats.byUnit[c.id]?.count ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-border overflow-hidden min-w-0">
          <div className="px-3 sm:px-5 py-2 sm:py-3 bg-surface font-semibold text-primary border-b border-border text-sm sm:text-base">Records per Month</div>
          <div className="overflow-x-auto max-h-[300px] sm:max-h-[400px] overflow-y-auto">
            <table className="w-full text-xs sm:text-sm min-w-[200px]">
              <thead className="bg-background sticky top-0">
                <tr>
                  <th className="text-left p-2 sm:p-3 font-medium text-primary">Month</th>
                  <th className="text-right p-2 sm:p-3 font-medium text-primary">Count</th>
                </tr>
              </thead>
              <tbody>
                {monthEntries.length === 0 ? (
                  <tr><td colSpan={2} className="p-3 sm:p-4 text-center text-[#5c574f] text-sm">No date data yet</td></tr>
                ) : (
                  monthEntries.map(([month, count]) => (
                    <tr key={month} className="border-t border-border">
                      <td className="p-2 sm:p-3">{formatMonthLabel(month)}</td>
                      <td className="p-2 sm:p-3 text-right font-medium">{count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl border border-border overflow-hidden min-w-0">
        <div className="px-3 sm:px-5 py-2 sm:py-3 bg-surface font-semibold text-primary border-b border-border text-sm sm:text-base">Records per Province</div>
        <div className="overflow-x-auto max-h-[280px] sm:max-h-[300px] overflow-y-auto">
          <table className="w-full text-xs sm:text-sm min-w-[200px]">
            <thead className="bg-background sticky top-0">
              <tr>
                <th className="text-left p-2 sm:p-3 font-medium text-primary">Province</th>
                <th className="text-right p-2 sm:p-3 font-medium text-primary">Count</th>
              </tr>
            </thead>
            <tbody>
              {provinceEntries.length === 0 ? (
                <tr><td colSpan={2} className="p-3 sm:p-4 text-center text-[#5c574f] text-sm">No province data yet</td></tr>
              ) : (
                provinceEntries.map(([prov, count]) => (
                  <tr key={prov} className="border-t border-border">
                    <td className="p-2 sm:p-3">{prov}</td>
                    <td className="p-2 sm:p-3 text-right font-medium">{count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
