const RATING_OPTIONS = [
  { value: '1', label: 'Poor (1)' },
  { value: '2', label: 'Fair (2)' },
  { value: '3', label: 'Satisfied (3)' },
  { value: '4', label: 'Very Satisfied (4)' },
  { value: '5', label: 'Excellent (5)' },
]

export default function CustomerRatingsTable({ ratings = {}, onChange }) {
  const get = (k) => ratings[k] ?? ''
  return (
    <div className="bg-surface/50 p-6 rounded-xl border border-border">
      <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
        <iconify-icon icon="mdi:star-outline" width="18"></iconify-icon>
        Customer Satisfaction Ratings
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-bold text-primary">Particulars</th>
              <th className="text-center py-2 px-1"><span className="text-[10px] text-red-600 font-bold">NOT SATISFIED</span></th>
              <th className="text-center py-2 px-1"><span className="text-[10px] text-primary font-bold">SATISFIED</span></th>
            </tr>
            <tr className="border-b border-border/50">
              <th className="py-1"></th>
              <th className="text-center py-1 px-1">
                <div className="flex justify-center gap-1">
                  <span className="text-[10px] text-text-muted">Poor (1)</span>
                  <span className="text-[10px] text-text-muted">Fair (2)</span>
                </div>
              </th>
              <th className="text-center py-1 px-1">
                <div className="flex justify-center gap-1 sm:gap-2">
                  <span className="text-[10px] text-text-muted">Sat (3)</span>
                  <span className="text-[10px] text-text-muted">VSat (4)</span>
                  <span className="text-[10px] text-text-muted">Exc (5)</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 px-2 font-medium text-primary">1. Quantity of Goods/Services Provided</td>
              <td colSpan="2" className="py-2 px-2">
                <select value={get('ratingQuantity')} onChange={(e) => onChange?.('ratingQuantity', e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-sm">
                  <option value="">Select rating...</option>
                  {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-2 font-medium text-primary">2. Services Rendered by Personnel</td>
              <td colSpan="2" className="py-2 px-2">
                <select value={get('ratingServicesPersonnel')} onChange={(e) => onChange?.('ratingServicesPersonnel', e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-sm">
                  <option value="">Select rating...</option>
                  {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pl-6 pr-2 text-primary">2.1 For training consider its relevance</td>
              <td colSpan="2" className="py-2 px-2">
                <select value={get('ratingTraining')} onChange={(e) => onChange?.('ratingTraining', e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-sm">
                  <option value="">Select rating...</option>
                  {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pl-6 pr-2 text-primary">2.2 Attitude (i.e. courteousness)</td>
              <td colSpan="2" className="py-2 px-2">
                <select value={get('ratingAttitude')} onChange={(e) => onChange?.('ratingAttitude', e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-sm">
                  <option value="">Select rating...</option>
                  {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pl-6 pr-2 text-primary">2.3 Promptness in attending the request</td>
              <td colSpan="2" className="py-2 px-2">
                <select value={get('ratingPromptness')} onChange={(e) => onChange?.('ratingPromptness', e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-sm">
                  <option value="">Select rating...</option>
                  {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
