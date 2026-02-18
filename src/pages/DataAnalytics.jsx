import { useState } from 'react'
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
  BarChart2
} from 'lucide-react'

// --- THEME CONSTANTS ---
const RATING_FIELD_LABELS = {
  ratingQuantity: 'Quantity of Goods/Services',
  ratingServicesPersonnel: 'Services Rendered by Personnel',
  ratingTraining: 'Training Relevance',
  ratingAttitude: 'Attitude (Courteousness)',
  ratingPromptness: 'Promptness',
}

// Enhanced Styling for Unit Groups
const UNIT_GROUPS = [
  {
    title: 'Registration & Licensing',
    icon: Award,
    // Theme: Primary Green (#1e4d2b)
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
    // Theme: Muted Green (#5c7355)
    theme: 'secondary',
    bgHeader: 'bg-[#5c7355]',
    textHeader: 'text-white',
    borderColor: 'border-[#5c7355]',
    softBg: 'bg-[#5c7355]/5',
    hoverBorder: 'hover:border-[#5c7355]',
    accentText: 'text-[#5c7355]',
    units: [
      'goodAgriPractices', 'goodAnimalHusbandry', 'organicPostMarket', 
      'landUseMatter', 'foodSafety', 'safdzValidation'
    ]
  },
  {
    title: 'Surveillance',
    icon: Activity,
    // Theme: Gold/Accent (#b8a066)
    theme: 'accent',
    bgHeader: 'bg-[#b8a066]',
    textHeader: 'text-[#153019]', // Dark text for contrast on gold
    borderColor: 'border-[#b8a066]',
    softBg: 'bg-[#b8a066]/10',
    hoverBorder: 'hover:border-[#b8a066]',
    accentText: 'text-[#8f7a45]', // Darker gold for text
    units: [
      'plantPestSurveillance', 'cfsAdmcc', 'animalDiseaseSurveillance'
    ]
  }
]

export default function DataAnalytics() {
  const { stats, refresh } = useAnalytics()
  const [showRatingsModal, setShowRatingsModal] = useState(false)
  const [selectedRatingUnit, setSelectedRatingUnit] = useState(null)

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
      <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-12 relative font-sans text-[#2d2a26]">
        
        {/* --- DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#d4cdc0] pb-6">
          <div>
            <h2 className="text-3xl font-black text-[#1e4d2b] tracking-tight uppercase">Analytics Dashboard</h2>
            <div className="flex items-center gap-2 mt-2 text-sm font-medium text-[#5c7355]">
               <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#d4cdc0] shadow-sm">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4a6b3c] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1e4d2b]"></span>
                  </span> 
                  Live System Data
               </span>
               <span className="text-[#b8a066]">|</span>
               <span>Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* RATINGS BUTTON */}
            <button 
              onClick={() => setShowRatingsModal(true)} 
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-[#b8a066] text-[#153019] rounded-xl hover:bg-[#d4c4a0] shadow-md hover:shadow-lg transition-all font-bold text-sm transform hover:-translate-y-0.5 border border-[#b8a066]"
            >
              <Star size={18} className="fill-[#153019] transition-transform group-hover:scale-110" />
              View Ratings
            </button>

            <button 
              onClick={refresh} 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1e4d2b] border border-[#d4cdc0] rounded-xl hover:bg-[#faf8f5] transition-all shadow-sm font-bold text-sm hover:border-[#1e4d2b]"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
            
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e4d2b] text-white rounded-xl hover:bg-[#153019] shadow-md hover:shadow-xl transition-all font-bold text-sm"
            >
              <ArrowLeft size={18} />
              Dashboard
            </Link>
          </div>
        </div>

        {/* --- HERO STATS CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
            gradient="from-[#4a6b3c] to-[#1e4d2b]"
            iconColor="text-white"
          />
        </div>

        {/* --- MAIN CHARTS --- */}
        <div className="grid lg:grid-cols-3 gap-6 h-full">
          {/* Monthly Trends */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#d4cdc0] shadow-sm p-6 flex flex-col min-h-[400px]">
             <div className="flex items-center justify-between mb-8">
               <div>
                   <h3 className="text-lg font-black text-[#1e4d2b] uppercase tracking-wide">Monthly Trends</h3>
                   <p className="text-sm text-[#5c574f] font-medium">Volume over time</p>
               </div>
               <div className="p-2.5 bg-[#faf8f5] rounded-xl border border-[#d4cdc0] text-[#1e4d2b]">
                   <TrendingUp size={22} />
               </div>
             </div>
             <div className="flex-1 flex items-end gap-2 sm:gap-4 pb-2 border-b border-[#d4cdc0]/50 overflow-x-auto custom-scrollbar">
               {sortedMonthEntries.length === 0 ? (
                  <div className="w-full text-center text-gray-400 py-10">No data available</div>
               ) : (
                  sortedMonthEntries.map(([month, count]) => (
                     <div key={month} className="group flex flex-col items-center flex-1 min-w-[30px]">
                        <div className="mb-2 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0 duration-300 bg-[#1e4d2b] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xl whitespace-nowrap z-10 pointer-events-none">
                           {count} Records
                        </div>
                        <div className="relative w-full bg-[#e8e0d4] rounded-t-sm flex items-end overflow-hidden h-[220px]">
                           <div 
                              className="w-full bg-[#1e4d2b] rounded-t-sm transition-all duration-1000 ease-out group-hover:bg-[#b8a066] relative"
                              style={{ height: `${(count / maxMonthCount) * 100}%` }}
                           />
                        </div>
                        <div className="mt-3 text-[10px] font-bold text-[#5c7355] -rotate-45 sm:rotate-0 truncate w-full text-center group-hover:text-[#1e4d2b] transition-colors">
                           {formatMonthLabel(month)}
                        </div>
                     </div>
                  ))
               )}
             </div>
          </div>

          {/* Top Units */}
          <div className="bg-white rounded-2xl border border-[#d4cdc0] shadow-sm p-6 flex flex-col max-h-[500px]">
             <div className="flex items-center justify-between mb-6">
               <div>
                   <h3 className="text-lg font-black text-[#1e4d2b] uppercase tracking-wide">Top Units</h3>
                   <p className="text-sm text-[#5c574f] font-medium">By submission volume</p>
               </div>
               <div className="p-2.5 bg-[#faf8f5] rounded-xl border border-[#d4cdc0] text-[#b8a066]">
                  <Award size={22} />
               </div>
             </div>
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
               {unitEntries.map(([id, data], index) => (
                  <div key={id} className="relative group">
                     <div className="flex items-center justify-between mb-2 z-10 relative">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black shrink-0 shadow-sm
                              ${index === 0 ? 'bg-[#b8a066] text-[#153019]' : 
                                index === 1 ? 'bg-[#5c7355] text-white' :
                                index === 2 ? 'bg-[#1e4d2b] text-white' :
                                'bg-[#e8e0d4] text-[#5c574f]'
                              }`}
                           >
                              {index + 1}
                           </div>
                           <span className="text-xs font-bold text-[#1e4d2b] truncate uppercase tracking-tight" title={data.label}>{data.label}</span>
                        </div>
                        <span className="text-xs font-black text-[#1e4d2b]">{data.count}</span>
                     </div>
                     <div className="w-full h-1.5 bg-[#faf8f5] rounded-full overflow-hidden border border-[#d4cdc0]/30">
                        <div 
                           className={`h-full rounded-full transition-all duration-1000 ease-out
                              ${index === 0 ? 'bg-[#b8a066]' : index === 1 ? 'bg-[#5c7355]' : 'bg-[#1e4d2b]'}
                           `}
                           style={{ width: `${(data.count / maxUnitCount) * 100}%` }}
                        ></div>
                     </div>
                  </div>
               ))}
             </div>
          </div>
        </div>

        {/* --- PROVINCE DISTRIBUTION --- */}
        <div className="bg-white rounded-2xl border border-[#d4cdc0] shadow-sm p-6">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#1e4d2b] text-white rounded-lg shadow-md">
                 <MapPin size={20} />
              </div>
              <div>
                 <h3 className="text-lg font-black text-[#1e4d2b] uppercase tracking-wide">Geographic Data</h3>
                 <p className="text-sm text-[#5c574f] font-medium">Records by Province</p>
              </div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {provinceEntries.map(([prov, count]) => (
                 <div key={prov} className="bg-[#faf8f5] rounded-xl p-4 border border-[#d4cdc0]/50 flex flex-col items-center text-center hover:border-[#1e4d2b] hover:bg-white hover:shadow-lg transition-all group duration-300">
                    <span className="text-3xl font-black text-[#1e4d2b] group-hover:scale-110 transition-transform">{count}</span>
                    <span className="text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mt-2 truncate w-full border-t border-[#d4cdc0] pt-2">{prov}</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* ================= RATINGS MODAL SYSTEM (FULL SCREEN FIXED) ================= */}
      {showRatingsModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 w-full h-full overflow-hidden isolate">
          
          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-[#153019]/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => {
              setShowRatingsModal(false)
              setSelectedRatingUnit(null)
            }}
          />

          {/* MODAL CONTENT: Narrower & Centered */}
          <div className="relative bg-[#faf8f5] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-white z-50">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#d4cdc0] flex justify-between items-center bg-[#1e4d2b] shrink-0 z-10 shadow-md">
               <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl shadow-lg bg-white/10 border border-white/20`}>
                    <Star size={24} className="text-[#b8a066] fill-[#b8a066]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight leading-none text-white">
                      {selectedRatingUnit ? 'Unit Performance' : 'Satisfaction Ratings'}
                    </h3>
                    <p className="text-[10px] font-bold text-[#d4c4a0] tracking-[0.15em] uppercase mt-1 opacity-90">
                      {selectedRatingUnit ? 'Detailed feedback analysis' : 'Select a unit to view metrics'}
                    </p>
                  </div>
               </div>
               <button 
                 onClick={() => {
                   setShowRatingsModal(false)
                   setSelectedRatingUnit(null)
                 }}
                 className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all shadow-sm hover:rotate-90 duration-300"
               >
                  <X size={24} />
               </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto bg-[#faf8f5] custom-scrollbar p-5 sm:p-6 relative">
              
              {/* === VIEW 1: MENU (ENHANCED SECTIONS) === */}
              {!selectedRatingUnit && (
                <div className="grid md:grid-cols-3 gap-5 h-full items-start">
                  {UNIT_GROUPS.map((group, idx) => (
                    <div 
                      key={idx} 
                      className={`group/card rounded-2xl border-2 ${group.borderColor} bg-white shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full animate-in slide-in-from-bottom-8 fade-in`}
                      style={{ animationDelay: `${idx * 150}ms` }}
                    >
                      {/* Section Header */}
                      <div className={`px-5 py-6 ${group.bgHeader} border-b ${group.borderColor} flex flex-col items-center text-center gap-2 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <group.icon className={`absolute -right-6 -top-6 w-24 h-24 opacity-10 ${group.textHeader} rotate-12`} />
                        
                        <div className={`p-3 rounded-full bg-white/20 backdrop-blur-md shadow-inner border border-white/30 text-white`}>
                           <group.icon size={28} strokeWidth={2} />
                        </div>
                        <h4 className={`font-black text-xs uppercase tracking-[0.2em] ${group.textHeader} relative z-10 mt-1`}>{group.title}</h4>
                      </div>
                      
                      {/* Units List */}
                      <div className={`p-3 space-y-2 flex-1 ${group.softBg}`}>
                        {group.units.map((unitId) => {
                          const label = COLLECTIONS.find(c => c.id === unitId)?.label || unitId;
                          const hasData = stats.unitRatings && stats.unitRatings[unitId]?.totalRecords > 0;

                          return (
                            <button
                              key={unitId}
                              onClick={() => setSelectedRatingUnit(unitId)}
                              disabled={!hasData}
                              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all border group/item relative overflow-hidden
                                ${hasData 
                                  ? `bg-white border-white hover:border-current ${group.hoverBorder} hover:shadow-md cursor-pointer translate-x-0 hover:translate-x-1 shadow-sm` 
                                  : 'bg-white/40 border-transparent opacity-60 cursor-not-allowed grayscale'
                                }
                              `}
                            >
                              <div className="flex flex-col z-10">
                                <span className={`text-[11px] font-extrabold uppercase tracking-tight transition-colors ${
                                  hasData ? `text-[#2d2a26] group-hover/item:${group.accentText}` : 'text-gray-400'
                                }`}>
                                  {label}
                                </span>
                                {hasData ? (
                                  <div className="flex items-center gap-1.5 mt-1">
                                     <div className={`w-1.5 h-1.5 rounded-full ${group.bgHeader}`}></div>
                                     <span className={`text-[9px] font-bold ${group.accentText} opacity-80`}>
                                       {stats.unitRatings[unitId].ratedCount} ratings
                                     </span>
                                  </div>
                                ) : (
                                  <span className="text-[9px] text-gray-400 italic mt-1 font-medium">
                                    No data
                                  </span>
                                )}
                              </div>
                              
                              {hasData && (
                                <div className={`p-1.5 rounded-full bg-[#faf8f5] shadow-sm border border-[#d4cdc0] ${group.accentText} group-hover/item:bg-current group-hover/item:text-white transition-all z-10`}>
                                   <ChevronRight size={14} />
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* === VIEW 2: DETAILS (Drill Down) === */}
              {selectedRatingUnit && (
                <div className="animate-in slide-in-from-right-10 fade-in duration-500 h-full flex flex-col relative z-10">
                  {(() => {
                    const data = stats.unitRatings[selectedRatingUnit];
                    const unitLabel = COLLECTIONS.find((c) => c.id === selectedRatingUnit)?.label || selectedRatingUnit;
                    
                    return (
                      <div className="max-w-5xl mx-auto w-full">
                        <button 
                          onClick={() => setSelectedRatingUnit(null)}
                          className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#5c7355] hover:text-[#1e4d2b] bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all mb-6 w-fit border border-[#d4cdc0] hover:pl-3 hover:border-[#1e4d2b]"
                        >
                          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Units
                        </button>

                        <div className="bg-white rounded-[2rem] border border-[#d4cdc0] shadow-xl overflow-hidden">
                           
                           {/* Unit Header */}
                           <div className="bg-gradient-to-r from-[#1e4d2b] to-[#153019] p-8 text-white relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Award size={150} />
                              </div>
                              <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-sm">
                                  <BarChart2 size={12} className="text-[#b8a066]" /> Performance Metrics
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none text-white">{unitLabel}</h2>
                                <p className="text-[#d4c4a0] font-medium mt-2 relative z-10 flex items-center gap-2 text-xs">
                                  <CheckCircle2 size={14} className="text-[#b8a066]" /> 
                                  Based on <strong className="text-white">{data.ratedCount} validated</strong> records.
                                </p>
                              </div>
                           </div>

                           <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                              
                              {/* Left: Overall Score Card */}
                              <div className="flex flex-col justify-center items-center text-center p-8 bg-[#faf8f5] rounded-3xl border border-[#d4cdc0] relative overflow-hidden group hover:border-[#b8a066] transition-colors duration-500">
                                 <div className="absolute inset-0 bg-[radial-gradient(#b8a066_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                                 <p className="relative z-10 text-[10px] font-black text-[#5c7355] uppercase tracking-[0.25em] mb-4">Overall Satisfaction</p>
                                 <div className="relative z-10 transition-transform duration-500 group-hover:scale-105">
                                    <div className="text-6xl sm:text-8xl font-black text-[#1e4d2b] tracking-tighter drop-shadow-sm leading-none">
                                       {data.overallAvg.toFixed(1)}
                                    </div>
                                    <div className="absolute -top-3 -right-6 bg-[#b8a066] text-[#153019] text-sm font-black px-2 py-0.5 rounded-md shadow-md rotate-12 border border-[#153019]/10">
                                       / 5.0
                                    </div>
                                 </div>
                                 <div className="relative z-10 flex gap-1 mt-4 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#d4cdc0]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star 
                                        key={star} 
                                        size={20} 
                                        fill={star <= Math.round(data.overallAvg) ? "#b8a066" : "#e5e7eb"} 
                                        className={star <= Math.round(data.overallAvg) ? "text-[#b8a066] drop-shadow-sm" : "text-gray-200"} 
                                      />
                                    ))}
                                 </div>
                              </div>

                              {/* Right: Breakdown & Charts */}
                              <div className="space-y-8">
                                 {/* Criteria Bars */}
                                 <div>
                                    <h4 className="text-xs font-black text-[#1e4d2b] uppercase tracking-wide mb-4 flex items-center gap-2 border-b border-[#d4cdc0] pb-2">Criteria Breakdown</h4>
                                    <div className="space-y-4">
                                       {Object.entries(data.averages || {}).map(([field, avg], i) => (
                                          <div key={field} className="group" style={{ animationDelay: `${i * 100}ms` }}>
                                             <div className="flex justify-between text-[11px] font-bold text-[#5c574f] mb-1.5 group-hover:text-[#1e4d2b] transition-colors">
                                                <span className="uppercase tracking-tight">{RATING_FIELD_LABELS[field] || field}</span>
                                                <span className="bg-[#1e4d2b] text-white px-2 py-0.5 rounded text-[9px] shadow-sm">{avg ?? '-'}</span>
                                             </div>
                                             <div className="w-full h-2.5 bg-[#e8e0d4] rounded-full overflow-hidden shadow-inner">
                                                <div 
                                                  className="h-full bg-gradient-to-r from-[#5c7355] to-[#1e4d2b] rounded-full transition-all duration-1000 ease-out relative" 
                                                  style={{ width: avg ? `${(parseFloat(avg) / 5) * 100}%` : '0%' }}
                                                >
                                                   <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                                                </div>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>

                                 {/* Histogram */}
                                 <div>
                                    <h4 className="text-xs font-black text-[#1e4d2b] uppercase tracking-wide mb-4 border-b border-[#d4cdc0] pb-2">Response Distribution</h4>
                                    <div className="flex items-end gap-3 h-24 pl-2">
                                      {[1, 2, 3, 4, 5].map((score) => {
                                        const count = (data.byScore && data.byScore[score]) || 0
                                        const totalRatings = data.byScore ? Object.values(data.byScore).reduce((a, b) => a + b, 0) : 0
                                        const pct = totalRatings > 0 ? (count / totalRatings) * 100 : 0
                                        return (
                                          <div key={score} className="flex-1 flex flex-col justify-end items-center gap-1.5 h-full group relative">
                                             <div className="absolute -top-7 text-[9px] font-bold text-[#1e4d2b] opacity-0 group-hover:opacity-100 transition-all bg-white px-1.5 py-0.5 rounded shadow-md border border-[#d4cdc0]">{pct.toFixed(0)}%</div>
                                             <div 
                                                className={`w-full rounded-t-lg transition-all duration-1000 ease-out relative group-hover:brightness-110 shadow-sm ${
                                                  score >= 4 ? 'bg-[#1e4d2b]' : score === 3 ? 'bg-[#b8a066]' : 'bg-red-400'
                                                }`}
                                                style={{ height: `${pct || 2}%`, minHeight: '4px' }}
                                             />
                                             <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#5c7355]">
                                               {score}<Star size={8} className="fill-current" />
                                             </div>
                                          </div>
                                        )
                                      })}
                                    </div>
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
        </div>,
        document.body
      )}
    </>
  )
}

// --- SUB COMPONENTS ---
function StatCard({ title, value, icon: Icon, gradient, iconColor }) {
  return (
    <div className={`relative bg-white p-6 rounded-2xl border border-[#d4cdc0] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group`}>
       <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.08] rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
       <div className="flex justify-between items-start relative z-10">
          <div>
             <p className="text-[11px] font-black text-[#5c574f] uppercase tracking-[0.15em]">{title}</p>
             <h3 className="text-4xl font-black mt-2 tracking-tighter text-[#1e4d2b]">{value}</h3>
          </div>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-12 transition-transform`}>
             <Icon size={24} className={iconColor} />
          </div>
       </div>
    </div>
  )
}