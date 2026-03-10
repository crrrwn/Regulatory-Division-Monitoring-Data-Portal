import { useState } from 'react'
import { COLLECTIONS } from '../lib/collections'
import { useAnalytics } from '../context/AnalyticsContext'
import {
  FileText,
  MapPin,
  Award,
  LayoutGrid,
  AlertCircle,
} from 'lucide-react'

export default function Dashboard() {
  const { stats, error } = useAnalytics()
  const [lastRefreshedAt] = useState(() => new Date())

  const provinceEntries = Object.entries(stats?.byProvince || {}).sort((a, b) => b[1] - a[1])
  const unitEntries = Object.entries(stats?.byUnit || {}).sort((a, b) => (b[1]?.count ?? 0) - (a[1]?.count ?? 0))
  const maxUnitCount = Math.max(...unitEntries.map(([, v]) => v?.count ?? 0), 1)

  return (
    <>
      <div className="min-w-0 w-full max-w-full overflow-x-hidden px-0 xs:px-2 sm:px-4 md:px-5 lg:px-6 pb-6 xs:pb-8 sm:pb-12">
        <div className="w-full max-w-7xl mx-auto min-w-0 space-y-3 xs:space-y-4 sm:space-y-5 pb-6 xs:pb-8 sm:pb-10 relative font-sans text-[#2d2a26]">
        
        {/* --- DASHBOARD HEADER --- */}
        <div className="analytics-section rounded-xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden" style={{ animationDelay: '0ms' }}>
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-4 sm:px-6 py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Dashboard</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-1">
                  Live system data · Updated: {lastRefreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-amber-500/50 bg-amber-50 text-amber-900">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Hindi ma-load ang records</p>
              <p className="text-xs mt-1 text-amber-800/90">{error}</p>
              <p className="text-xs mt-2">I-check ang browser console (F12) para sa detalye.</p>
            </div>
          </div>
        )}

        {/* --- HERO STATS CARDS --- */}
        <div className="analytics-section grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3" style={{ animationDelay: '80ms' }}>
          <StatCard 
            title="Total Records" 
            value={stats?.total ?? 0} 
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
            title="Provinces" 
            value={Object.keys(stats?.byProvince || {}).length} 
            icon={MapPin} 
            gradient="from-[#9a7b4f] to-[#8f7a45]"
            iconColor="text-white"
          />
        </div>

        {/* --- PROVINCE DISTRIBUTION (Geographic Data) --- */}
        <div className="analytics-section w-full min-w-0 max-w-full rounded-xl border-2 border-[#e8e0d4] shadow-lg shadow-[#b8a066]/12 overflow-hidden bg-white hover:shadow-xl hover:shadow-[#b8a066]/18 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]" style={{ animationDelay: '160ms' }}>
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
           </div>
           </div>
           <div className="p-2 xs:p-3 sm:p-5 bg-[linear-gradient(180deg,#faf8f5_0%,#f5f0e8_50%,#efe9e0_100%)] border-l-4 border-[#b8a066]/25 min-w-0 overflow-x-hidden">
             <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-3 min-w-0">
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
           </div>
        </div>

        {/* --- TOP UNITS --- */}
        <div className="analytics-section grid lg:grid-cols-1 gap-4 h-full" style={{ animationDelay: '240ms' }}>
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
                         <span className="text-[11px] font-bold text-[#1e4d2b] truncate uppercase tracking-tight" title={data?.label}>{data?.label}</span>
                       </div>
                       <span className="text-xs font-black text-[#1e4d2b] shrink-0 ml-1.5">{data?.count ?? 0}</span>
                     </div>
                     <div className="w-full h-1.5 bg-[#e8e0d4]/80 rounded-full overflow-hidden">
                       <div
                         className={`h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${index === 0 ? 'bg-gradient-to-r from-[#b8a066] to-[#9a7b4f]' : index === 1 ? 'bg-gradient-to-r from-[#9a7b4f] to-[#8f7a45]' : 'bg-gradient-to-r from-[#1e4d2b] to-[#153019]'}`}
                         style={{ width: `${((data?.count ?? 0) / maxUnitCount) * 100}%` }}
                       />
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
        </div>
      </div>
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
