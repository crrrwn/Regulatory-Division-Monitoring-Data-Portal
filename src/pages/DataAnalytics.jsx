import { Link } from 'react-router-dom'
import { COLLECTIONS, RATING_LABELS } from '../lib/collections'
import { formatMonthLabel } from '../lib/recordFilters'
import { useAnalytics } from '../context/AnalyticsContext'

const RATING_FIELD_LABELS = {
  ratingQuantity: 'Quantity of Goods/Services',
  ratingServicesPersonnel: 'Services Rendered by Personnel',
  ratingTraining: 'Training Relevance',
  ratingAttitude: 'Attitude (Courteousness)',
  ratingPromptness: 'Promptness',
}

export default function DataAnalytics() {
  const { stats, refresh } = useAnalytics()

  // Helpers
  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  // Sorting
  const monthEntries = Object.entries(stats.byMonth)
    .sort((a, b) => a[0].localeCompare(b[0])); // Sort chronologically (Jan to Dec style roughly, needs stricter ISO check if real dates)
  
  // Re-sort months to be Last 12 months for better view if needed, but simple sort is fine for now
  // Let's stick to simple sort or reverse chron based on key string
  const sortedMonthEntries = monthEntries.sort((a, b) => b[0].localeCompare(a[0])).slice(0, 12).reverse(); // Oldest to Newest for graph

  const provinceEntries = Object.entries(stats.byProvince).sort((a, b) => b[1] - a[1]);
  const unitEntries = Object.entries(stats.byUnit).sort((a, b) => b[1].count - a[1].count);

  // Max values for scaling
  const maxMonthCount = Math.max(...sortedMonthEntries.map(([, c]) => c), 1);
  const maxProvCount = Math.max(...provinceEntries.map(([, c]) => c), 1);
  const maxUnitCount = Math.max(...unitEntries.map(([, v]) => v.count), 1);

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">Analytics Dashboard</h2>
          <div className="flex items-center gap-2 mt-2 text-text-muted text-sm">
             <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/20">
               <iconify-icon icon="mdi:circle-medium"></iconify-icon> Live Data
             </span>
             <span>•</span>
             <span>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={refresh} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary border border-border rounded-lg hover:bg-surface hover:text-primary-dark transition-all shadow-sm font-medium text-sm">
            <iconify-icon icon="mdi:refresh" width="18"></iconify-icon>
            Refresh
          </button>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white border border-primary rounded-lg hover:bg-primary-dark hover:shadow-lg transition-all shadow-md font-medium text-sm"
          >
            <iconify-icon icon="mdi:arrow-left" width="18"></iconify-icon>
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* --- HERO STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Records" 
          value={stats.total} 
          icon="mdi:file-document-multiple" 
          gradient="from-primary to-primary-dark"
          shadowColor="shadow-lg"
        />
        <StatCard 
          title="Active Units" 
          value={COLLECTIONS.length} 
          icon="mdi:domain" 
          gradient="from-primary-light to-primary"
          shadowColor="shadow-lg"
        />
        <StatCard 
          title="Data Points (Months)" 
          value={Object.keys(stats.byMonth).length} 
          icon="mdi:calendar-multiselect" 
          gradient="from-accent to-accent-light"
          shadowColor="shadow-lg"
        />
        <StatCard 
          title="Provinces Reach" 
          value={Object.keys(stats.byProvince).length} 
          icon="mdi:map-marker-radius" 
          gradient="from-muted to-primary-light"
          shadowColor="shadow-lg"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* --- MONTHLY TRENDS (VERTICAL BAR CHART) --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-lg font-bold text-primary">Monthly Trends</h3>
                 <p className="text-sm text-text-muted">Submission volume over time</p>
              </div>
              <div className="p-2 bg-surface rounded-lg border border-border">
                 <iconify-icon icon="mdi:chart-bar" width="20" class="text-primary"></iconify-icon>
              </div>
           </div>

           <div className="flex-1 flex items-end gap-3 sm:gap-6 min-h-[250px] pb-2 border-b border-border overflow-x-auto custom-scrollbar">
              {sortedMonthEntries.length === 0 ? (
                 <div className="w-full text-center text-text-muted py-10">No data available</div>
              ) : (
                 sortedMonthEntries.map(([month, count]) => (
                    <div key={month} className="group flex flex-col items-center flex-1 min-w-[40px]">
                       <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-200 bg-primary-dark text-white text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 pointer-events-none">
                          {count} records
                       </div>
                       <div className="relative w-full bg-surface rounded-t-lg flex items-end overflow-hidden hover:bg-border transition-colors h-[200px]">
                          <div 
                             className="w-full bg-primary rounded-t-lg transition-all duration-1000 ease-out group-hover:bg-primary-light relative overflow-hidden"
                             style={{ height: `${(count / maxMonthCount) * 100}%` }}
                          >
                             <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                          </div>
                       </div>
                       <div className="mt-3 text-[10px] sm:text-xs font-medium text-text-muted rotate-0 sm:-rotate-45 md:rotate-0 truncate w-full text-center">
                          {formatMonthLabel(month)}
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>

        {/* --- RECORDS PER UNIT (RANKING LIST) --- */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col h-full">
           <div className="flex items-center justify-between mb-6">
              <div>
                 <h3 className="text-lg font-bold text-primary">Top Units</h3>
                 <p className="text-sm text-text-muted">Performance ranking</p>
              </div>
              <iconify-icon icon="mdi:trophy-outline" width="20" class="text-accent"></iconify-icon>
           </div>
           
           <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar space-y-4">
              {unitEntries.map(([id, data], index) => (
                 <div key={id} className="relative group">
                    <div className="flex items-center justify-between mb-1.5 z-10 relative">
                       <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                             ${index === 0 ? 'bg-accent/20 text-accent ring-1 ring-accent/40' : 
                               index === 1 ? 'bg-primary-light/20 text-primary ring-1 ring-primary/30' :
                               index === 2 ? 'bg-primary/15 text-primary ring-1 ring-primary/30' :
                               'bg-surface text-text-muted'
                             }`}
                          >
                             {index + 1}
                          </div>
                          <span className="text-sm font-medium text-primary truncate group-hover:text-primary-dark transition-colors" title={data.label}>{data.label}</span>
                       </div>
                       <span className="text-sm font-bold text-primary">{data.count}</span>
                    </div>
                    <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                       <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out
                             ${index === 0 ? 'bg-accent' : index === 1 ? 'bg-primary-light' : index === 2 ? 'bg-primary' : 'bg-muted'}
                          `}
                          style={{ width: `${(data.count / maxUnitCount) * 100}%` }}
                       ></div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* --- CUSTOMER SATISFACTION RATINGS (all units) --- */}
      {stats.unitRatings && Object.entries(stats.unitRatings).map(([unitId, data]) => {
        if (!data || data.totalRecords === 0) return null
        const unitLabel = COLLECTIONS.find((c) => c.id === unitId)?.label || unitId
        return (
          <div key={unitId} className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/20 text-accent rounded-lg">
                <iconify-icon icon="mdi:star" width="24"></iconify-icon>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">{unitLabel} – Customer Satisfaction Ratings</h3>
                <p className="text-sm text-text-muted">{data.ratedCount} of {data.totalRecords} records with ratings</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Overall Average</p>
                  <p className="text-3xl font-extrabold text-primary">
                    {data.overallAvg > 0 ? data.overallAvg.toFixed(2) : '—'} <span className="text-lg text-text-muted font-normal">/ 5</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-bold text-primary uppercase tracking-wide">Average by Particular</p>
                  {Object.entries(data.averages || {}).map(([field, avg]) => (
                    <div key={field} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-primary">{RATING_FIELD_LABELS[field] || field}</span>
                      <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: avg ? `${(parseFloat(avg) / 5) * 100}%` : '0%' }}></div>
                        </div>
                        <span className="text-sm font-bold text-primary w-12">{avg ?? '—'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-primary uppercase tracking-wide mb-4">Rating Distribution</p>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((score) => {
                    const count = (data.byScore && data.byScore[score]) || 0
                    const totalRatings = data.byScore ? Object.values(data.byScore).reduce((a, b) => a + b, 0) : 0
                    const pct = totalRatings > 0 ? (count / totalRatings) * 100 : 0
                    return (
                      <div key={score} className="flex items-center gap-3">
                        <span className="w-24 text-sm text-primary">{RATING_LABELS[String(score)]} ({score})</span>
                        <div className="flex-1 h-6 bg-surface rounded-lg overflow-hidden">
                          <div className="h-full bg-primary rounded-lg transition-all duration-500" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-primary w-12">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* --- PROVINCE DISTRIBUTION --- */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
               <iconify-icon icon="mdi:map-legend" width="20"></iconify-icon>
            </div>
            <div>
               <h3 className="text-lg font-bold text-primary">Geographic Distribution</h3>
               <p className="text-sm text-text-muted">Records by Province</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {provinceEntries.length === 0 ? (
               <div className="col-span-full text-center text-text-muted">No geographic data available</div>
            ) : (
               provinceEntries.map(([prov, count]) => (
                  <div key={prov} className="group relative bg-background hover:bg-white rounded-xl p-4 border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                     <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-primary font-bold text-sm shadow-sm group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                           {prov.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-text-muted bg-white px-2 py-1 rounded-md border border-border group-hover:border-primary/30 group-hover:text-primary">
                           {getPercentage(count, stats.total)}%
                        </span>
                     </div>
                     <div className="mt-4">
                        <h4 className="font-semibold text-primary truncate group-hover:text-primary-dark transition-colors">{prov}</h4>
                        <div className="flex items-end gap-2 mt-1">
                           <span className="text-2xl font-bold text-primary">{count}</span>
                           <span className="text-xs text-text-muted mb-1">records</span>
                        </div>
                     </div>
                     <div className="absolute bottom-0 left-4 right-4 h-1 bg-primary/20 rounded-full overflow-hidden mt-3">
                        <div className="h-full bg-primary transition-all duration-500 group-hover:w-full w-0"></div>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS --- //

function StatCard({ title, value, icon, gradient, shadowColor }) {
  return (
    <div className={`relative bg-white p-5 rounded-2xl border border-border shadow-lg ${shadowColor} hover:-translate-y-1 transition-transform duration-300 overflow-hidden group`}>
       <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-opacity group-hover:opacity-20`}></div>
       <div className="flex justify-between items-start relative z-10">
          <div>
             <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</p>
             <h3 className="text-3xl font-extrabold text-primary mt-2">{value}</h3>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}>
             <iconify-icon icon={icon} width="24"></iconify-icon>
          </div>
       </div>
    </div>
  )
}