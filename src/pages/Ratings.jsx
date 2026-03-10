import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAnalytics } from '../context/AnalyticsContext'
import { COLLECTIONS } from '../lib/collections'
import { getUnitIdsForSections } from '../lib/sections'
import {
  Star,
  ArrowLeft,
  ChevronRight,
  Award,
  ShieldCheck,
  Activity,
  BarChart2,
  CheckCircle2,
  Package,
  Users,
  BookOpen,
  Smile,
  Clock,
} from 'lucide-react'

const RATING_FIELD_LABELS = {
  ratingQuantity: 'Quantity of Goods/Services',
  ratingServicesPersonnel: 'Services Rendered by Personnel',
  ratingTraining: 'Training Relevance',
  ratingAttitude: 'Attitude (Courteousness)',
  ratingPromptness: 'Promptness',
}
const RATING_FIELD_ICONS = {
  ratingQuantity: Package,
  ratingServicesPersonnel: Users,
  ratingTraining: BookOpen,
  ratingAttitude: Smile,
  ratingPromptness: Clock,
}

const UNIT_GROUPS = [
  {
    title: 'Registration & Licensing',
    icon: Award,
    theme: 'primary',
    bgHeader: 'bg-[#1e4d2b]',
    textHeader: 'text-white',
    borderColor: 'border-[#1e4d2b]',
    softBg: 'bg-[#1e4d2b]/5',
    hoverBorder: 'hover:border-[#1e4d2b]',
    accentText: 'text-[#1e4d2b]',
    units: ['animalFeed', 'animalWelfare', 'livestockHandlers', 'transportCarrier', 'plantMaterial', 'organicAgri'],
  },
  {
    title: 'Quality Control',
    icon: ShieldCheck,
    theme: 'secondary',
    bgHeader: 'bg-[#9a7b4f]',
    textHeader: 'text-white',
    borderColor: 'border-[#9a7b4f]',
    softBg: 'bg-[#9a7b4f]/5',
    hoverBorder: 'hover:border-[#9a7b4f]',
    accentText: 'text-[#9a7b4f]',
    units: ['goodAgriPractices', 'goodAnimalHusbandry', 'organicPostMarket', 'landUseMatter', 'foodSafety', 'safdzValidation'],
  },
  {
    title: 'Surveillance',
    icon: Activity,
    theme: 'accent',
    bgHeader: 'bg-[#6b8e5a]',
    textHeader: 'text-white',
    borderColor: 'border-[#6b8e5a]',
    softBg: 'bg-[#6b8e5a]/10',
    hoverBorder: 'hover:border-[#6b8e5a]',
    accentText: 'text-[#6b8e5a]',
    units: ['plantPestSurveillance', 'cfsAdmcc', 'animalDiseaseSurveillance'],
  },
]

const SCORE_LABELS = {
  1: 'Poor (1)',
  2: 'Fair (2)',
  3: 'Satisfied (3)',
  4: 'Very Satisfied (4)',
  5: 'Excellent (5)',
}

export default function Ratings() {
  const { role, userAllowedSections } = useAuth()
  const { stats } = useAnalytics()
  const allowedUnitIds = userAllowedSections && role === 'staff' ? getUnitIdsForSections(userAllowedSections) : null
  const visibleGroups = allowedUnitIds === null
    ? UNIT_GROUPS
    : UNIT_GROUPS.map((g) => ({ ...g, units: g.units.filter((u) => allowedUnitIds.includes(u)) })).filter((g) => g.units.length > 0)

  const [selectedRatingUnit, setSelectedRatingUnit] = useState(null)

  return (
    <div className="ratings-page min-w-0 w-full max-w-full overflow-x-hidden px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 pb-6 xs:pb-10 sm:pb-12">
      <div className="w-full max-w-5xl mx-auto min-w-0">
        {/* Page Header */}
        <div className="ratings-header rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-6 sm:px-8 py-5 sm:py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
              <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
                <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 shadow-lg shrink-0">
                  <Star size={26} className="text-[#d4c4a0] fill-[#d4c4a0]" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-sm">
                    {selectedRatingUnit ? 'Unit Performance' : 'REGULATORY DIVISION RATINGS'}
                  </h1>
                  {selectedRatingUnit && (
                    <p className="text-[11px] font-semibold text-white/80 tracking-widest uppercase mt-1.5">Detailed feedback analysis</p>
                  )}
                </div>
              </div>
              {!selectedRatingUnit && (
                <div className="flex-shrink-0">
                  {(() => {
                    let totalSum = 0
                    let totalCount = 0
                    visibleGroups.forEach((group) => {
                      group.units.forEach((unitId) => {
                        const u = stats.unitRatings && stats.unitRatings[unitId]
                        if (u && u.ratedCount > 0 && u.overallAvg != null) {
                          totalSum += u.overallAvg * u.ratedCount
                          totalCount += u.ratedCount
                        }
                      })
                    })
                    const overallAvg = totalCount > 0 ? totalSum / totalCount : null
                    const hasOverall = overallAvg != null && totalCount > 0
                    return hasOverall ? (
                      <div className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1.5 px-3 py-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/40 shadow-md ring-1 ring-white/20 max-w-full">
                        <span className="text-[10px] font-black text-white/95 uppercase tracking-widest">Overall</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={14} className={`shrink-0 ${s <= Math.round(overallAvg) ? 'text-amber-300 fill-amber-300' : 'text-white/35'}`} strokeWidth={1.5} />
                          ))}
                        </div>
                        <span className="text-sm font-black text-white tabular-nums">{overallAvg.toFixed(1)}</span>
                        <span className="text-[10px] font-bold text-white/80">/ 5</span>
                        <span className="text-[9px] font-semibold text-white/75">{totalCount} rating{totalCount !== 1 ? 's' : ''}</span>
                      </div>
                    ) : (
                      <p className="text-[11px] font-semibold text-white/70 uppercase tracking-widest">No ratings yet</p>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section score % summary (Poor–Excellent) */}
        {!selectedRatingUnit && (
          <div className="mb-6 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/6 overflow-hidden">
            <div className="px-5 sm:px-6 py-3 bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] border-b border-[#e8e0d4]">
              <p className="text-[10px] font-black text-[#1e4d2b] uppercase tracking-[0.2em]">Customer Feedback Breakdown (Percentage)</p>
              <p className="text-[11px] font-semibold text-[#5c7355] mt-1">Per section across all rating questions (Quantity, Services, Training, Attitude, Promptness).</p>
            </div>
            <div className="p-4 sm:p-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1e4d2b] text-white">
                    <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider">Section</th>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <th key={s} className="text-center px-3 py-3 text-[10px] font-black uppercase tracking-wider">{SCORE_LABELS[s]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e0d4]">
                  {visibleGroups.map((group) => {
                    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                    group.units.forEach((unitId) => {
                      const byScore = stats.unitRatings?.[unitId]?.byScore || {}
                      ;[1, 2, 3, 4, 5].forEach((s) => {
                        const raw = byScore[s] ?? byScore[String(s)]
                        counts[s] += Number(typeof raw === 'number' ? raw : parseInt(raw, 10) || 0)
                      })
                    })
                    const total = counts[1] + counts[2] + counts[3] + counts[4] + counts[5]
                    const pct = (s) => (total > 0 ? (counts[s] / total) * 100 : 0)
                    return (
                      <tr key={group.title} className="hover:bg-[#faf8f5] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${group.bgHeader}`} />
                            <span className="text-[11px] font-black text-[#1e4d2b] uppercase tracking-tight">{group.title}</span>
                            <span className="text-[10px] font-semibold text-[#8a857c]">({total} response{total !== 1 ? 's' : ''})</span>
                          </div>
                        </td>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <td key={s} className="px-3 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-sm font-black text-[#2d2a26] tabular-nums">{total > 0 ? pct(s).toFixed(1) : '0.0'}%</span>
                              <span className="text-[10px] font-semibold text-[#8a857c] tabular-nums">({counts[s]})</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="ratings-content rounded-2xl overflow-hidden bg-[#faf8f5] border-2 border-[#e8e0d4] shadow-lg min-h-[400px]">
          <div className="p-5 sm:p-6 md:p-7 bg-[linear-gradient(180deg,#faf8f5_0%,#f5f0e8_100%)] min-h-0">
            {!selectedRatingUnit ? (
              <div className="grid md:grid-cols-3 gap-6">
                {visibleGroups.map((group, idx) => {
                  const sectionClass = idx === 0 ? 'ratings-section-1' : idx === 1 ? 'ratings-section-2' : 'ratings-section-3'
                  const sectionRatingData = (() => {
                    let totalSum = 0
                    let totalCount = 0
                    group.units.forEach((unitId) => {
                      const u = stats.unitRatings && stats.unitRatings[unitId]
                      if (u && u.ratedCount > 0 && u.overallAvg != null) {
                        totalSum += u.overallAvg * u.ratedCount
                        totalCount += u.ratedCount
                      }
                    })
                    const avg = totalCount > 0 ? totalSum / totalCount : null
                    return { avg, totalRatings: totalCount }
                  })()
                  const hasSectionRating = sectionRatingData.avg != null && sectionRatingData.totalRatings > 0

                  return (
                    <div
                      key={idx}
                      className={`${sectionClass} group/card rounded-2xl border-2 ${group.borderColor} bg-white shadow-lg hover:shadow-xl hover:shadow-[#2d2a26]/10 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] overflow-hidden flex flex-col min-h-[280px]`}
                    >
                      <div className={`px-5 py-4 ${group.bgHeader} flex flex-col items-center text-center gap-2 relative overflow-hidden shrink-0`}>
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(0,0,0,0.08)_100%)] opacity-60" />
                        <h4 className={`font-black text-[11px] uppercase tracking-[0.2em] ${group.textHeader} relative z-10 leading-tight`}>{group.title}</h4>
                        <div className={`relative z-10 w-full mt-2 px-3 py-2.5 rounded-xl border backdrop-blur-sm ${hasSectionRating ? 'bg-white/25 border-white/40 shadow-inner' : 'bg-white/10 border-white/20'}`}>
                          {hasSectionRating ? (
                            <div className="flex flex-col items-center gap-1.5">
                              <span className="text-[8px] font-black text-white/90 uppercase tracking-widest">Section Overall</span>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={12} className={s <= Math.round(sectionRatingData.avg) ? 'text-[#fcd34d] fill-[#fcd34d]' : 'text-white/40'} />
                                  ))}
                                </div>
                                <span className="text-base font-black text-white tabular-nums">{sectionRatingData.avg.toFixed(1)}</span>
                                <span className="text-[10px] font-bold text-white/80">/ 5</span>
                              </div>
                              <p className="text-[8px] font-bold text-white/85">{sectionRatingData.totalRatings} rating{sectionRatingData.totalRatings !== 1 ? 's' : ''} across units</p>
                            </div>
                          ) : (
                            <p className="text-[9px] font-semibold text-white/75 uppercase tracking-wider">No ratings yet</p>
                          )}
                        </div>
                      </div>
                      <div className={`p-3 sm:p-4 space-y-2.5 flex-1 ${group.softBg} flex flex-col`}>
                        {group.units.map((unitId) => {
                          const label = COLLECTIONS.find((c) => c.id === unitId)?.label || unitId
                          const hasData = stats.unitRatings && stats.unitRatings[unitId]?.totalRecords > 0
                          const count = hasData ? stats.unitRatings[unitId].ratedCount : 0
                          return (
                            <button
                              key={unitId}
                              type="button"
                              onClick={() => hasData && setSelectedRatingUnit(unitId)}
                              disabled={!hasData}
                              className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl text-left transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group/item relative overflow-hidden
                                ${hasData ? `bg-white border border-[#e8e0d4] hover:border-[currentColor] ${group.hoverBorder} hover:shadow-md cursor-pointer shadow-sm hover:translate-x-1` : 'bg-[#f5f0e8]/60 border border-transparent opacity-70 cursor-not-allowed'}`}
                            >
                              {hasData && <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${group.bgHeader} opacity-0 group-hover/item:opacity-100 transition-all duration-300 scale-y-0 group-hover/item:scale-y-100 origin-center`} />}
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className={`text-[11px] font-extrabold uppercase tracking-tight truncate ${hasData ? `text-[#2d2a26] group-hover/item:${group.accentText}` : 'text-[#5c574f]'}`}>{label}</span>
                                {hasData ? (
                                  <span className={`inline-flex items-center gap-1.5 mt-1.5 w-fit text-[9px] font-bold ${group.accentText} opacity-90`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${group.bgHeader} shrink-0`} />
                                    {count} rating{count !== 1 ? 's' : ''}
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-[#8a857c] italic mt-1 font-medium">No data</span>
                                )}
                              </div>
                              {hasData && (
                                <div className="p-2 rounded-lg bg-[#faf8f5] border border-[#e8e0d4] text-[#2d2a26] shrink-0 group-hover/item:translate-x-0.5 transition-transform duration-300">
                                  <ChevronRight size={16} strokeWidth={2.5} />
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="ratings-detail-view">
                {(() => {
                  const data = stats.unitRatings?.[selectedRatingUnit] ?? { totalRecords: 0, ratedCount: 0, overallAvg: null, averages: {}, byScore: {} }
                  const unitLabel = COLLECTIONS.find((c) => c.id === selectedRatingUnit)?.label || selectedRatingUnit
                  return (
                    <div className="max-w-5xl mx-auto w-full flex flex-col min-h-0">
                      <button
                        type="button"
                        onClick={() => setSelectedRatingUnit(null)}
                        className="ratings-detail-back group shrink-0 inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-[#5c7355] hover:text-[#1e4d2b] bg-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#e8e0d4] hover:border-[#1e4d2b] w-fit mb-4"
                      >
                        <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2.5} />
                        Back to Units
                      </button>
                      <div className="flex flex-col bg-white rounded-2xl border-2 border-[#e8e0d4] shadow-xl shadow-[#1e4d2b]/8 overflow-hidden">
                        <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-5 text-white relative overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-[0.07]"><Award size={96} /></div>
                          <div className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2">
                            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-sm">{unitLabel}</h2>
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/15 border border-white/25 text-[11px] font-bold backdrop-blur-sm">
                              <BarChart2 size={14} className="text-[#d4c4a0]" /> Metrics
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
                              <CheckCircle2 size={14} className="text-[#b8a066]" /> {data.ratedCount} validated record{data.ratedCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 bg-gradient-to-b from-[#faf8f5] to-[#f2ede6]">
                          <div className="ratings-detail-card-1 flex flex-col justify-center items-center text-center p-5 sm:p-6 bg-white rounded-2xl border-2 border-[#e8e0d4] relative overflow-hidden group hover:border-[#b8a066]/50 hover:shadow-xl hover:shadow-[#b8a066]/10 transition-all duration-300">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#b8a066_0px,transparent_60px)] opacity-[0.06] group-hover:opacity-10 transition-opacity duration-300" />
                            <p className="relative z-10 text-[10px] font-black text-[#5c7355] uppercase tracking-[0.2em] mb-3">Overall Satisfaction</p>
                            <div className="relative z-10 flex items-baseline gap-1.5">
                              <span className="text-5xl sm:text-6xl font-black text-[#1e4d2b] leading-none drop-shadow-sm">{data.overallAvg != null ? data.overallAvg.toFixed(1) : '–'}</span>
                              <span className="text-base font-bold text-[#8a857c]">/ 5</span>
                            </div>
                            <div className="relative z-10 flex gap-1.5 mt-4 px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e8e0d4]">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={18} fill={star <= Math.round(data.overallAvg ?? 0) ? '#b8a066' : '#e5e7eb'} className={`${star <= Math.round(data.overallAvg ?? 0) ? 'text-[#b8a066]' : 'text-gray-200'}`} />
                              ))}
                            </div>
                          </div>
                          <div className="ratings-detail-card-2 bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-[#e8e0d4] p-4 shadow-lg shadow-[#1e4d2b]/5 flex flex-col">
                            <h4 className="text-[10px] font-black text-[#1e4d2b] uppercase tracking-wider mb-3 flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-[#1e4d2b]/10"><Activity size={14} className="text-[#1e4d2b]" /></span>
                              Criteria Breakdown
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(data.averages || {}).map(([field, avg]) => {
                                const numAvg = avg != null ? parseFloat(avg) : 0
                                const pct = (numAvg / 5) * 100
                                const CritIcon = RATING_FIELD_ICONS[field]
                                return (
                                  <div key={field} className="group/crit px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e8e0d4] hover:border-[#1e4d2b]/30 hover:bg-white transition-all duration-200">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <div className="flex items-center gap-2 min-w-0">
                                        {CritIcon && <span className="p-1.5 rounded-lg bg-[#1e4d2b]/10 shrink-0"><CritIcon size={12} className="text-[#1e4d2b]" /></span>}
                                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight text-[#2d2a26] truncate">{RATING_FIELD_LABELS[field] || field}</span>
                                      </div>
                                      <span className="px-2 py-0.5 rounded-lg bg-[#1e4d2b] text-white text-[10px] font-black shrink-0">{avg ?? '–'}</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#e8e0d4] rounded-full overflow-hidden shadow-inner">
                                      <div className="ratings-criteria-bar h-full bg-gradient-to-r from-[#5c7355] to-[#1e4d2b] rounded-full transition-[width] duration-700" style={{ width: `${pct}%` }} />
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <div className="ratings-detail-card-3 bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-[#e8e0d4] p-4 shadow-lg shadow-[#1e4d2b]/5 flex flex-col min-h-0">
                            <h4 className="text-[10px] font-black text-[#1e4d2b] uppercase tracking-wider mb-3 flex items-center gap-2 shrink-0">
                              <span className="p-1.5 rounded-lg bg-[#6b8e5a]/20"><BarChart2 size={14} className="text-[#6b8e5a]" /></span>
                              Response Distribution
                            </h4>
                            <div className="flex items-end gap-2 flex-1 min-h-[88px] h-24">
                              {[1, 2, 3, 4, 5].map((score, barIdx) => {
                                const byScore = data.byScore || {}
                                const count = Number(byScore[score] ?? byScore[String(score)] ?? 0)
                                const totalRatings = Object.keys(byScore).reduce((sum, k) => sum + Number(byScore[k] || 0), 0)
                                const pct = totalRatings > 0 ? (count / totalRatings) * 100 : 0
                                const barHeightPx = totalRatings > 0 ? Math.max((pct / 100) * 88, 6) : 6
                                const isHigh = score >= 4
                                const isMid = score === 3
                                const delayClass = `ratings-histogram-bar-delay-${barIdx}`
                                return (
                                  <div key={score} className="flex-1 flex flex-col justify-end items-center gap-2 group relative h-full">
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#1e4d2b] opacity-0 group-hover:opacity-100 bg-white px-2 py-1 rounded-lg shadow-md border border-[#e8e0d4] whitespace-nowrap z-10 transition-all duration-200">{pct.toFixed(0)}% ({count})</span>
                                    <div
                                      className={`ratings-histogram-bar ${delayClass} w-full rounded-t-lg flex-shrink-0 transition-all duration-500 group-hover:brightness-110 ${isHigh ? 'bg-gradient-to-t from-[#153019] to-[#1e4d2b]' : isMid ? 'bg-gradient-to-t from-[#8f7a45] to-[#b8a066]' : 'bg-gradient-to-t from-[#a04a3a] to-[#c45c4a]'}`}
                                      style={{ height: `${barHeightPx}px`, minHeight: '6px' }}
                                    />
                                    <span className="text-[9px] font-bold text-[#5c7355] flex items-center gap-1 shrink-0"><Star size={10} className="fill-[#b8a066] text-[#b8a066]" />{score}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
