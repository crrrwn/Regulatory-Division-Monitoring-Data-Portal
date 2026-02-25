import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { COLLECTIONS } from '../lib/collections'
import { formatMonthLabel } from '../lib/recordFilters'
import { useAnalytics } from '../context/AnalyticsContext'
import { 
  RefreshCw, 
  ArrowLeft, 
  FileText, 
  MapPin, 
  Calendar, 
  Star, 
  X, 
  ChevronRight, 
  Award, 
  ShieldCheck, 
  Activity,
  TrendingUp,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Package,
  Users,
  BookOpen,
  Smile,
  Clock
} from 'lucide-react'

// --- THEME CONSTANTS ---
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

// Enhanced Styling for Unit Groups: Green (left), Khaki/Brown (middle), Matcha (right)
const UNIT_GROUPS = [
  {
    title: 'Registration & Licensing',
    icon: Award,
    // Theme: Green (#1e4d2b)
    theme: 'primary',
    bgHeader: 'bg-[#1e4d2b]',
    textHeader: 'text-white',
    borderColor: 'border-[#1e4d2b]',
    softBg: 'bg-[#1e4d2b]/5',
    hoverBorder: 'hover:border-[#1e4d2b]',
    accentText: 'text-[#1e4d2b]',
    units: [
      'animalFeed', 'animalWelfare', 'livestockHandlers', 
      'transportCarrier', 'plantMaterial', 'organicAgri'
    ]
  },
  {
    title: 'Quality Control',
    icon: ShieldCheck,
    // Theme: Khaki/Brown (#9a7b4f)
    theme: 'secondary',
    bgHeader: 'bg-[#9a7b4f]',
    textHeader: 'text-white',
    borderColor: 'border-[#9a7b4f]',
    softBg: 'bg-[#9a7b4f]/5',
    hoverBorder: 'hover:border-[#9a7b4f]',
    accentText: 'text-[#9a7b4f]',
    units: [
      'goodAgriPractices', 'goodAnimalHusbandry', 'organicPostMarket', 
      'landUseMatter', 'foodSafety', 'safdzValidation'
    ]
  },
  {
    title: 'Surveillance',
    icon: Activity,
    // Theme: Matcha (#6b8e5a)
    theme: 'accent',
    bgHeader: 'bg-[#6b8e5a]',
    textHeader: 'text-white',
    borderColor: 'border-[#6b8e5a]',
    softBg: 'bg-[#6b8e5a]/10',
    hoverBorder: 'hover:border-[#6b8e5a]',
    accentText: 'text-[#6b8e5a]',
    units: [
      'plantPestSurveillance', 'cfsAdmcc', 'animalDiseaseSurveillance'
    ]
  }
]

export default function DataAnalytics() {
  const { stats, refresh } = useAnalytics()
  const [showRatingsModal, setShowRatingsModal] = useState(false)
  const [selectedRatingUnit, setSelectedRatingUnit] = useState(null)
  const [geoViewMode, setGeoViewMode] = useState('card')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date())
  const [showReloadedSign, setShowReloadedSign] = useState(false)

  const handleRefresh = () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setShowReloadedSign(false)
    refresh()
      .then(() => {
        setLastRefreshedAt(new Date())
        setShowReloadedSign(true)
      })
      .finally(() => setIsRefreshing(false))
  }

  useEffect(() => {
    if (!showReloadedSign) return
    const t = setTimeout(() => setShowReloadedSign(false), 3500)
    return () => clearTimeout(t)
  }, [showReloadedSign])

  // Helpers
  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  // Sorting Logic
  const sortedMonthEntries = Object.entries(stats.byMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12);

  const provinceEntries = Object.entries(stats.byProvince).sort((a, b) => b[1] - a[1]);
  const unitEntries = Object.entries(stats.byUnit).sort((a, b) => b[1].count - a[1].count);

  const maxMonthCount = Math.max(...sortedMonthEntries.map(([, c]) => c), 1);
  const maxUnitCount = Math.max(...unitEntries.map(([, v]) => v.count), 1);

  return (
    <>
      <div className="space-y-4 sm:space-y-5 pb-8 sm:pb-10 relative font-sans text-[#2d2a26]">
        
        {/* --- DASHBOARD HEADER (same style as Dashboard Overview & Master Records) --- */}
        <div className="analytics-section rounded-xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden" style={{ animationDelay: '0ms' }}>
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-4 sm:px-6 py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Analytics Dashboard</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <p className="text-[11px] font-semibold text-white/85 tracking-wider">
                    Live system data · Updated: {lastRefreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                  {showReloadedSign && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40 text-white text-[11px] font-bold animate-in fade-in zoom-in-95 duration-300">
                      <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
                      Data reloaded
                    </span>
                  )}
                </div>
              </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => setShowRatingsModal(true)}
                  className="group inline-flex items-center gap-1.5 px-3 py-2.5 sm:px-4 min-h-[44px] bg-[#b8a066] text-[#153019] rounded-xl hover:bg-[#d4c4a0] hover:scale-105 active:scale-[0.98] shadow-md hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-xs border border-[#b8a066]/50 touch-manipulation"
                >
                  <Star size={16} className="fill-[#153019] transition-transform duration-300 group-hover:scale-110 shrink-0" />
                  View Ratings
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="group/ref inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 min-h-[44px] bg-white text-[#1e4d2b] rounded-xl hover:bg-[#faf8f5] hover:scale-105 active:scale-[0.98] shadow-md hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-xs sm:text-sm border-2 border-white/40 disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100 touch-manipulation"
                >
                  <RefreshCw
                    size={18}
                    className={`shrink-0 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover/ref:rotate-[-360deg]'}`}
                  />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 sm:px-4 min-h-[44px] bg-white/15 backdrop-blur-sm text-white border border-white/25 rounded-xl hover:bg-white/25 hover:border-white/40 hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-xs touch-manipulation"
                >
                  <ArrowLeft size={16} className="shrink-0" />
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --- HERO STATS CARDS --- */}
        <div className="analytics-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" style={{ animationDelay: '80ms' }}>
          <StatCard 
            title="Total Records" 
            value={stats.total} 
            icon={FileText} 
            gradient="from-[#1e4d2b] to-[#153019]"
            iconColor="text-white"
          />
          <StatCard 
            title="Active Units" 
            value={COLLECTIONS.length} 
            icon={LayoutGrid} 
            gradient="from-[#5c7355] to-[#4a6b3c]"
            iconColor="text-white"
          />
          <StatCard 
            title="Data Points" 
            value={Object.keys(stats.byMonth).length} 
            icon={Calendar} 
            gradient="from-[#b8a066] to-[#d4c4a0]"
            iconColor="text-[#153019]"
          />
          <StatCard 
            title="Provinces" 
            value={Object.keys(stats.byProvince).length} 
            icon={MapPin} 
            gradient="from-[#9a7b4f] to-[#8f7a45]"
            iconColor="text-white"
          />
        </div>

        {/* --- MAIN CHARTS --- */}
        <div className="analytics-section grid lg:grid-cols-3 gap-4 h-full" style={{ animationDelay: '160ms' }}>
          {/* Monthly Trends */}
          <div className="lg:col-span-2 rounded-xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 overflow-hidden flex flex-col min-h-[320px] bg-white group/card hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
             <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-4 sm:px-5 py-3 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
               <div className="relative z-10 flex items-center justify-between">
                 <div>
                   <h3 className="text-base font-black text-white uppercase tracking-tight drop-shadow-sm">Monthly Trends</h3>
                   <p className="text-[10px] font-semibold text-white/80 tracking-wider mt-0.5">Volume over time</p>
                 </div>
                 <div className="p-2 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 text-[#d4c4a0]">
                   <TrendingUp size={18} />
                 </div>
               </div>
             </div>
             <div className="flex-1 p-4 sm:p-5 flex flex-col min-h-0 bg-[linear-gradient(180deg,#faf8f5_0%,#f5f0e8_50%,#efe9e0_100%)] border-l-4 border-[#1e4d2b]/25">
               <div className="flex-1 flex items-end gap-1.5 sm:gap-2 pb-1 overflow-x-auto custom-scrollbar view-records-scroll min-h-[200px] relative">
                 {/* Subtle horizontal grid lines */}
                 <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-0 pb-8 px-2" aria-hidden>
                   {[0, 1, 2, 3, 4].map((i) => (
                     <div key={i} className="w-full h-px bg-[#d4cdc0]/40" />
                   ))}
                 </div>
                 {sortedMonthEntries.length === 0 ? (
                   <div className="w-full flex items-center justify-center text-[#5c574f] py-8 rounded-lg border-2 border-dashed border-[#1e4d2b]/25 bg-[#f0f5ee]/80">
                     <span className="text-xs font-medium">No data available</span>
                   </div>
                 ) : (
                   sortedMonthEntries.map(([month, count]) => {
                     const pct = maxMonthCount > 0 ? (count / maxMonthCount) * 100 : 0
                     const isPeak = count === maxMonthCount && maxMonthCount > 0
                     return (
                       <div key={month} className="group flex flex-col items-center flex-1 min-w-[32px] sm:min-w-[40px] relative z-10">
                         <div className="mb-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] -translate-y-1 group-hover:translate-y-0 bg-[#1e4d2b] text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-xl whitespace-nowrap z-20 pointer-events-none border border-white/30 backdrop-blur-sm">
                           {count} <span className="opacity-90">records</span>
                         </div>
                         <div className="relative w-full rounded-t-lg flex items-end overflow-hidden h-[165px] bg-white/50 border border-[#e8e0d4] shadow-inner">
                           <div
                             className={`w-full rounded-t-lg transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:brightness-110 relative overflow-hidden ${isPeak ? 'bg-gradient-to-t from-[#0d1f14] via-[#153019] to-[#1e4d2b] shadow-inner' : 'bg-gradient-to-t from-[#153019] via-[#1e4d2b] to-[#5c7355]'}`}
                             style={{ height: `${Math.max(pct, 4)}%` }}
                           >
                             <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/25 to-transparent rounded-t-lg" />
                           </div>
                         </div>
                         <div className="mt-2 text-[9px] font-bold text-[#5c574f] truncate w-full text-center group-hover:text-[#1e4d2b] transition-colors duration-300">
                           {formatMonthLabel(month)}
                         </div>
                       </div>
                     )
                   })
                 )}
               </div>
             </div>
          </div>

          {/* Top Units — khaki/gold accent (Quality Control style) */}
          <div className="rounded-xl border-2 border-[#e8e0d4] shadow-lg shadow-[#b8a066]/15 overflow-hidden flex flex-col max-h-[380px] bg-white hover:shadow-xl hover:shadow-[#b8a066]/20 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
             <div className="shrink-0 bg-gradient-to-r from-[#9a7b4f] via-[#b8a066] to-[#8f7a45] px-4 sm:px-5 py-3 relative overflow-hidden border-b-2 border-[#b8a066]/25">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
               <div className="relative z-10 flex items-center justify-between">
                 <div>
                   <h3 className="text-base font-black text-white uppercase tracking-tight drop-shadow-sm">Top Units</h3>
                   <p className="text-[10px] font-semibold text-white/80 tracking-wider mt-0.5">By submission volume</p>
                 </div>
                 <div className="p-2 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 text-white">
                   <Award size={18} />
                 </div>
               </div>
             </div>
             <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar view-records-scroll bg-gradient-to-b from-[#faf8f5] to-[#f2ede6] min-h-0 border-l-4 border-[#b8a066]/25">
               <div className="space-y-2.5">
                 {unitEntries.map(([id, data], index) => (
                   <div key={id} className="group relative bg-white/80 backdrop-blur-sm rounded-lg border border-[#e8e0d4] p-2.5 hover:border-[#b8a066]/40 hover:shadow-md hover:bg-white transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]">
                     <div className="flex items-center justify-between mb-1.5">
                       <div className="flex items-center gap-2 overflow-hidden min-w-0">
                         <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 shadow-md ring-1 ring-black/5
                            ${index === 0 ? 'bg-gradient-to-br from-[#b8a066] to-[#9a7b4f] text-[#153019]' :
                              index === 1 ? 'bg-gradient-to-br from-[#9a7b4f] to-[#8f7a45] text-white' :
                              index === 2 ? 'bg-gradient-to-br from-[#1e4d2b] to-[#153019] text-white' :
                              'bg-[#e8e0d4] text-[#5c574f]'
                            }`}
                         >
                           {index + 1}
                         </div>
                         <span className="text-[11px] font-bold text-[#1e4d2b] truncate uppercase tracking-tight" title={data.label}>{data.label}</span>
                       </div>
                       <span className="text-xs font-black text-[#1e4d2b] shrink-0 ml-1.5">{data.count}</span>
                     </div>
                     <div className="w-full h-1.5 bg-[#e8e0d4]/80 rounded-full overflow-hidden">
                       <div
                         className={`h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${index === 0 ? 'bg-gradient-to-r from-[#b8a066] to-[#9a7b4f]' : index === 1 ? 'bg-gradient-to-r from-[#9a7b4f] to-[#8f7a45]' : 'bg-gradient-to-r from-[#1e4d2b] to-[#153019]'}`}
                         style={{ width: `${(data.count / maxUnitCount) * 100}%` }}
                       />
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* --- PROVINCE DISTRIBUTION (Geographic Data) — khaki/gold (Pest & Disease style) --- */}
        <div className="analytics-section w-full min-w-0 max-w-full rounded-xl border-2 border-[#e8e0d4] shadow-lg shadow-[#b8a066]/12 overflow-hidden bg-white hover:shadow-xl hover:shadow-[#b8a066]/18 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]" style={{ animationDelay: '240ms' }}>
           <div className="shrink-0 bg-gradient-to-r from-[#9a7b4f] via-[#b8a066] to-[#8f7a45] px-3 sm:px-5 py-3 relative overflow-hidden border-b-2 border-[#b8a066]/25">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
             <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 min-w-0">
               <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                 <div className="p-1.5 sm:p-2 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 text-white shrink-0">
                   <MapPin size={16} className="sm:w-[18px] sm:h-[18px]" />
                 </div>
                 <div className="min-w-0">
                   <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight drop-shadow-sm truncate">Geographic Data</h3>
                   <p className="text-[9px] sm:text-[10px] font-semibold text-white/85 tracking-wider mt-0.5 truncate">Records by Province</p>
                 </div>
               </div>
               <div className="flex rounded-lg overflow-hidden border border-white/25 bg-white/10 p-0.5 shrink-0 w-full sm:w-auto">
                 <button type="button" onClick={() => setGeoViewMode('card')} className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-1.5 text-[9px] sm:text-[10px] font-bold rounded-md transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] min-h-[44px] sm:min-h-0 touch-manipulation ${geoViewMode === 'card' ? 'bg-white text-[#153019] shadow-sm' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                   <span aria-hidden>📊</span> Card View
                 </button>
                 <button type="button" onClick={() => setGeoViewMode('analytics')} className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-1.5 text-[9px] sm:text-[10px] font-bold rounded-md transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] min-h-[44px] sm:min-h-0 touch-manipulation ${geoViewMode === 'analytics' ? 'bg-white text-[#153019] shadow-sm' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                   <span aria-hidden>📈</span> Analytics View
                 </button>
               </div>
             </div>
           </div>
           <div className="p-3 sm:p-5 bg-[linear-gradient(180deg,#faf8f5_0%,#f5f0e8_50%,#efe9e0_100%)] border-l-4 border-[#b8a066]/25 min-w-0 overflow-x-hidden">
             {geoViewMode === 'card' ? (
             <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 min-w-0">
               {provinceEntries.map(([prov, count], index) => {
                 const maxProv = provinceEntries.length > 0 ? Math.max(...provinceEntries.map(([, c]) => c)) : 1
                 const barPct = maxProv > 0 ? (count / maxProv) * 100 : 0
                 const isTop = index < 3
                 return (
                   <div
                     key={prov}
                     className="group relative bg-white rounded-lg border-2 border-[#e8e0d4] p-2.5 sm:p-3 shadow-md hover:shadow-xl hover:shadow-[#b8a066]/15 hover:border-[#b8a066]/50 hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] overflow-hidden animate-in fade-in min-w-0"
                     style={{ animationDelay: `${index * 40}ms`, animationDuration: '700ms', animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', animationFillMode: 'both' }}
                   >
                     <div className="absolute top-1.5 left-1.5 p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-[#faf8f5] border border-[#e8e0d4] text-[#9a7b4f] group-hover:bg-[#b8a066]/15 group-hover:border-[#b8a066]/30 group-hover:text-[#8f7a45] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] z-10 shrink-0">
                       <MapPin size={12} className="sm:w-[14px] sm:h-[14px]" />
                     </div>
                     <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#b8a066]/15 to-transparent rounded-bl-full pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
                     {isTop && (
                       <div className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shadow-md ring-1 ring-black/10 transition-transform duration-500 group-hover:scale-110 ${index === 0 ? 'bg-gradient-to-br from-[#b8a066] to-[#9a7b4f] text-[#153019]' : index === 1 ? 'bg-gradient-to-br from-[#5c7355] to-[#4a6b3c] text-white' : 'bg-gradient-to-br from-[#1e4d2b] to-[#153019] text-white'}`}>
                         {index + 1}
                       </div>
                     )}
                     <div className="flex flex-col items-center text-center relative z-10 pt-5 sm:pt-6 min-w-0">
                       <span className="text-lg sm:text-xl md:text-2xl font-black tabular-nums text-[#1e4d2b] group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">{count}</span>
                       <span className="text-[8px] sm:text-[9px] font-bold text-[#5c7355] uppercase tracking-wider mt-0.5 sm:mt-1 truncate w-full max-w-full px-0.5">{prov}</span>
                       <div className="w-full h-1.5 mt-2 bg-[#e8e0d4]/80 rounded-full overflow-hidden shadow-inner">
                         <div
                           className="h-full bg-gradient-to-r from-[#9a7b4f] to-[#b8a066] rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                           style={{ width: `${Math.max(barPct, 8)}%` }}
                         />
                       </div>
                     </div>
                   </div>
                 )
               })}
             </div>
             ) : (
             <div className="space-y-2 sm:space-y-2.5 max-h-[360px] sm:max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar view-records-scroll pr-1 min-w-0">
               {provinceEntries.length === 0 ? (
                 <div className="flex items-center justify-center py-12 text-[#5c574f] rounded-xl border-2 border-dashed border-[#b8a066]/30 bg-white/60 animate-in fade-in duration-500">
                   <span className="text-sm font-medium">No province data available</span>
                 </div>
               ) : (
                 provinceEntries.map(([prov, count], index) => {
                   const maxProv = provinceEntries.length > 0 ? Math.max(...provinceEntries.map(([, c]) => c)) : 1
                   const barPct = maxProv > 0 ? (count / maxProv) * 100 : 0
                   return (
                     <div
                       key={prov}
                       className="group flex items-center gap-2 sm:gap-3 min-w-0 animate-in fade-in"
                       style={{ animationDelay: `${index * 60}ms`, animationDuration: '700ms', animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', animationFillMode: 'both' }}
                     >
                       <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-110 flex-shrink-0 ${index === 0 ? 'bg-gradient-to-br from-[#b8a066] to-[#9a7b4f] text-[#153019]' : index === 1 ? 'bg-gradient-to-br from-[#5c7355] to-[#4a6b3c] text-white' : index === 2 ? 'bg-gradient-to-br from-[#1e4d2b] to-[#153019] text-white' : 'bg-[#e8e0d4] text-[#5c574f]'}`}>
                         {index + 1}
                       </div>
                       <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 overflow-hidden">
                         <span className="text-[11px] sm:text-sm font-bold text-[#1e4d2b] truncate min-w-0 sm:min-w-[80px] md:min-w-[120px] transition-colors duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:text-[#153019]">{prov}</span>
                         <div className="flex-1 min-w-0 h-6 sm:h-7 md:h-8 bg-[#e8e0d4]/80 rounded-lg overflow-hidden relative group/bar">
                           <div
                             className="h-full bg-gradient-to-r from-[#9a7b4f] to-[#b8a066] rounded-lg flex items-center justify-end pr-1.5 min-w-[2rem] transition-[width,filter] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/bar:brightness-110"
                             style={{ width: `${Math.max(barPct, 4)}%` }}
                           >
                             {barPct >= 25 && <span className="text-[8px] sm:text-[9px] font-black text-white drop-shadow-sm animate-in fade-in duration-500">{count}</span>}
                           </div>
                         </div>
                         <span className="text-[11px] sm:text-xs font-black text-[#1e4d2b] w-7 sm:w-8 md:w-10 text-right shrink-0 flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-110 tabular-nums">{count}</span>
                       </div>
                     </div>
                   )
                 })
               )}
             </div>
             )}
           </div>
        </div>
      </div>

      {/* ================= RATINGS MODAL SYSTEM (FULL SCREEN FIXED) ================= */}
      {showRatingsModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 w-full h-full overflow-hidden isolate">
          
          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-[#153019]/95 via-[#1e4d2b]/90 to-[#0d1f14]/95 backdrop-blur-lg animate-in fade-in duration-500 ease-out"
            style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            onClick={() => {
              setShowRatingsModal(false)
              setSelectedRatingUnit(null)
            }}
          />

          {/* MODAL CONTENT */}
          <div 
            className="relative w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 z-50 rounded-[1.75rem] shadow-[0_25px_80px_-12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)_inset] ring-2 ring-white/20"
            style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="rounded-[1.75rem] overflow-hidden bg-[#faf8f5] flex flex-col h-full min-h-0">
            
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 sm:py-6 flex justify-between items-start sm:items-center shrink-0 z-10 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 relative z-10 flex-1 min-w-0 pr-14 sm:pr-12">
                <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
                  <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 shadow-lg shrink-0">
                    <Star size={26} className="text-[#d4c4a0] fill-[#d4c4a0]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-sm">
                      {selectedRatingUnit ? 'Unit Performance' : 'Satisfaction Ratings'}
                    </h3>
                    {selectedRatingUnit && (
                      <p className="text-[11px] font-semibold text-white/80 tracking-widest uppercase mt-1.5">
                        Detailed feedback analysis
                      </p>
                    )}
                  </div>
                </div>
                {!selectedRatingUnit && (
                  <div className="flex-shrink-0">
                    {(() => {
                      let totalSum = 0
                      let totalCount = 0
                      UNIT_GROUPS.forEach((group) => {
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
              <button 
                onClick={() => {
                  setShowRatingsModal(false)
                  setSelectedRatingUnit(null)
                }}
                className="absolute top-5 right-6 sm:top-6 sm:right-8 z-20 shrink-0 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/25 text-white/90 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] border border-white/20 hover:border-white/40 hover:scale-105 active:scale-95 touch-manipulation"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* Scrollable Body — super smooth scroll */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ratings-modal-scroll p-5 sm:p-6 md:p-7 relative bg-[linear-gradient(180deg,#faf8f5_0%,#f5f0e8_100%)] min-h-0">
              
              {/* === VIEW 1: MENU (UNIT SELECTION) === */}
              {!selectedRatingUnit && (
                <div className="grid md:grid-cols-3 gap-6 h-full items-stretch">
                  {UNIT_GROUPS.map((group, idx) => {
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
                      className={`group/card rounded-2xl border-2 ${group.borderColor} bg-white shadow-lg hover:shadow-xl hover:shadow-[#2d2a26]/10 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] overflow-hidden flex flex-col min-h-[280px] animate-in slide-in-from-bottom-4 fade-in`}
                      style={{ animationDelay: `${idx * 120}ms`, animationDuration: '0.6s', animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                      {/* Section Header */}
                      <div className={`px-5 py-4 ${group.bgHeader} flex flex-col items-center text-center gap-2 relative overflow-hidden shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/card:scale-[1.02]`}>
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(0,0,0,0.08)_100%)] opacity-60 transition-opacity duration-500" />
                        <group.icon className="absolute -right-4 -top-4 w-20 h-20 text-white/10 rotate-12 transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/card:rotate-6 group-hover/card:scale-110" size={80} strokeWidth={1.5} />
                        <div className="relative z-10 p-3 rounded-2xl bg-white/25 backdrop-blur-sm border border-white/40 shadow-inner">
                          <group.icon size={24} strokeWidth={2} className="text-white" />
                        </div>
                        <h4 className={`font-black text-[11px] uppercase tracking-[0.2em] ${group.textHeader} relative z-10 leading-tight`}>{group.title}</h4>
                        {/* Overall rating per section */}
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
                      
                      {/* Units List */}
                      <div className={`p-3 sm:p-4 space-y-2.5 flex-1 ${group.softBg} flex flex-col`}>
                        {group.units.map((unitId, unitIdx) => {
                          const label = COLLECTIONS.find(c => c.id === unitId)?.label || unitId;
                          const hasData = stats.unitRatings && stats.unitRatings[unitId]?.totalRecords > 0;
                          const count = hasData ? stats.unitRatings[unitId].ratedCount : 0;

                          return (
                            <button
                              key={unitId}
                              onClick={() => setSelectedRatingUnit(unitId)}
                              disabled={!hasData}
                              className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl text-left transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group/item relative overflow-hidden
                                ${hasData 
                                  ? `bg-white border border-[#e8e0d4] hover:border-[currentColor] ${group.hoverBorder} hover:shadow-md cursor-pointer shadow-sm hover:bg-white hover:translate-x-1` 
                                  : 'bg-[#f5f0e8]/60 border border-transparent opacity-70 cursor-not-allowed'
                                }
                              `}
                            >
                              {hasData && <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${group.bgHeader} opacity-0 group-hover/item:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] scale-y-0 group-hover/item:scale-y-100 origin-center`} />}
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className={`text-[11px] font-extrabold uppercase tracking-tight truncate transition-colors duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] ${hasData ? `text-[#2d2a26] group-hover/item:${group.accentText}` : 'text-[#5c574f]'}`}>
                                  {label}
                                </span>
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
                                <div className="p-2 rounded-lg bg-[#faf8f5] border border-[#e8e0d4] text-[#2d2a26] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/item:translate-x-0.5">
                                  <ChevronRight size={16} strokeWidth={2.5} className="opacity-100" />
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}

              {/* === VIEW 2: DETAILS (Unit performance) === */}
              {selectedRatingUnit && (
                <div 
                  className="animate-in slide-in-from-right-6 fade-in h-full flex flex-col relative z-10"
                  style={{ animationDuration: '0.5s', animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  {(() => {
                    const data = stats.unitRatings[selectedRatingUnit];
                    const unitLabel = COLLECTIONS.find((c) => c.id === selectedRatingUnit)?.label || selectedRatingUnit;
                    
                    return (
                      <div className="max-w-5xl mx-auto w-full h-full flex flex-col min-h-0">
                        {/* Back */}
                        <button 
                          onClick={() => setSelectedRatingUnit(null)}
                          className="group shrink-0 inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-[#5c7355] hover:text-[#1e4d2b] bg-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] border-2 border-[#e8e0d4] hover:border-[#1e4d2b] w-fit mb-4"
                        >
                          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2.5} />
                          Back to Units
                        </button>

                        {/* Card */}
                        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl border-2 border-[#e8e0d4] shadow-xl shadow-[#1e4d2b]/8 overflow-hidden">
                           {/* Header */}
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

                           {/* Body */}
                           <div className="flex-1 min-h-0 p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 bg-gradient-to-b from-[#faf8f5] to-[#f2ede6]">
                              
                              {/* Score */}
                              <div className="flex flex-col justify-center items-center text-center p-5 sm:p-6 bg-white rounded-2xl border-2 border-[#e8e0d4] relative overflow-hidden group hover:border-[#b8a066]/50 hover:shadow-xl hover:shadow-[#b8a066]/10 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]">
                                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#b8a066_0px,transparent_60px)] opacity-[0.06] group-hover:opacity-10 transition-opacity duration-300" />
                                 <p className="relative z-10 text-[10px] font-black text-[#5c7355] uppercase tracking-[0.2em] mb-3">Overall Satisfaction</p>
                                 <div className="relative z-10 flex items-baseline gap-1.5">
                                    <span className="text-5xl sm:text-6xl font-black text-[#1e4d2b] leading-none drop-shadow-sm">{data.overallAvg.toFixed(1)}</span>
                                    <span className="text-base font-bold text-[#8a857c]">/ 5</span>
                                 </div>
                                 <div className="relative z-10 flex gap-1.5 mt-4 px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e8e0d4]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} size={18} fill={star <= Math.round(data.overallAvg) ? "#b8a066" : "#e5e7eb"} className={`transition-transform duration-200 group-hover:scale-105 ${star <= Math.round(data.overallAvg) ? "text-[#b8a066]" : "text-gray-200"}`} />
                                    ))}
                                 </div>
                              </div>

                              {/* Criteria */}
                              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-[#e8e0d4] p-4 shadow-lg shadow-[#1e4d2b]/5 flex flex-col">
                                 <h4 className="text-[10px] font-black text-[#1e4d2b] uppercase tracking-wider mb-3 flex items-center gap-2">
                                   <span className="p-1.5 rounded-lg bg-[#1e4d2b]/10"><Activity size={14} className="text-[#1e4d2b]" /></span>
                                   Criteria Breakdown
                                 </h4>
                                 <div className="space-y-2">
                                   {Object.entries(data.averages || {}).map(([field, avg]) => {
                                     const numAvg = avg != null ? parseFloat(avg) : 0;
                                     const pct = (numAvg / 5) * 100;
                                     const CritIcon = RATING_FIELD_ICONS[field];
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
                                           <div className="h-full bg-gradient-to-r from-[#5c7355] to-[#1e4d2b] rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ width: `${pct}%` }} />
                                         </div>
                                       </div>
                                     );
                                   })}
                                 </div>
                              </div>

                              {/* Histogram */}
                              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-[#e8e0d4] p-4 shadow-lg shadow-[#1e4d2b]/5 flex flex-col min-h-0">
                                 <h4 className="text-[10px] font-black text-[#1e4d2b] uppercase tracking-wider mb-3 flex items-center gap-2 shrink-0">
                                   <span className="p-1.5 rounded-lg bg-[#6b8e5a]/20"><BarChart2 size={14} className="text-[#6b8e5a]" /></span>
                                   Response Distribution
                                 </h4>
                                 <div className="flex items-end gap-2 flex-1 min-h-[88px] h-24">
                                   {[1, 2, 3, 4, 5].map((score) => {
                                     const byScore = data.byScore || {};
                                     const count = Number(byScore[score] ?? byScore[String(score)] ?? 0);
                                     const totalRatings = Object.keys(byScore).reduce((sum, k) => sum + Number(byScore[k] || 0), 0);
                                     const pct = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                                     const barHeightPx = totalRatings > 0 ? Math.max((pct / 100) * 88, 6) : 6;
                                     const isHigh = score >= 4;
                                     const isMid = score === 3;
                                     return (
                                       <div key={score} className="flex-1 flex flex-col justify-end items-center gap-2 group relative h-full">
                                         <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#1e4d2b] opacity-0 group-hover:opacity-100 bg-white px-2 py-1 rounded-lg shadow-md border border-[#e8e0d4] whitespace-nowrap z-10 transition-all duration-200">{pct.toFixed(0)}% ({count})</span>
                                         <div 
                                           className={`w-full rounded-t-lg flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:brightness-110 ${isHigh ? 'bg-gradient-to-t from-[#153019] to-[#1e4d2b]' : isMid ? 'bg-gradient-to-t from-[#8f7a45] to-[#b8a066]' : 'bg-gradient-to-t from-[#a04a3a] to-[#c45c4a]'}`}
                                           style={{ height: `${barHeightPx}px`, minHeight: '6px' }}
                                         />
                                         <span className="text-[9px] font-bold text-[#5c7355] flex items-center gap-1 shrink-0"><Star size={10} className="fill-[#b8a066] text-[#b8a066]" />{score}</span>
                                       </div>
                                     );
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
        </div>,
        document.body
      )}
    </>
  )
}

// --- SUB COMPONENTS ---
function StatCard({ title, value, icon: Icon, gradient, iconColor }) {
  return (
    <div className="relative bg-white p-4 rounded-xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/5 hover:shadow-xl hover:shadow-[#1e4d2b]/10 hover:-translate-y-0.5 hover:border-[#1e4d2b]/30 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1e4d2b]/40 via-[#5c7355]/30 to-[#b8a066]/20 rounded-t-xl" />
      <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${gradient} opacity-[0.06] rounded-bl-full -mr-8 -mt-8 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:opacity-10 group-hover:scale-110`} />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[9px] font-black text-[#5c574f] uppercase tracking-[0.18em] transition-colors duration-300 group-hover:text-[#1e4d2b]">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black mt-1.5 tracking-tighter text-[#1e4d2b] transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-105">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ring-2 ring-white/50 transform rotate-3 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:rotate-6 group-hover:scale-110`}>
          <Icon size={18} className={`${iconColor} transition-transform duration-300 group-hover:scale-110`} />
        </div>
      </div>
    </div>
  )
}