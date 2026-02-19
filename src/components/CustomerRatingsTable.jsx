const RATING_OPTIONS = [
  { value: '1', label: 'Poor (1)' },
  { value: '2', label: 'Fair (2)' },
  { value: '3', label: 'Satisfied (3)' },
  { value: '4', label: 'Very Satisfied (4)' },
  { value: '5', label: 'Excellent (5)' },
]

const selectClass = "w-full px-3 py-2 border-2 border-[#e8e0d4] rounded-lg text-sm bg-white focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/20 outline-none transition-all duration-300"

export default function CustomerRatingsTable({ ratings = {}, onChange }) {
  const get = (k) => ratings[k] ?? ''
  return (
    <div className="overflow-hidden border-2 border-[#e8e0d4] rounded-xl mb-5 hover:border-[#1e4d2b]/20 transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#f0f5ee] border-b-2 border-[#1e4d2b]/15">
              <th className="text-left py-4 px-4 font-bold text-[#1e4d2b] uppercase text-xs">Rating Criteria</th>
              <th className="text-center py-4 px-2 w-48 font-bold text-[#1e4d2b] uppercase text-xs">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e0d4]">
            <tr className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
              <td className="py-3 px-4 font-medium text-[#1e4d2b]">1. Quantity of Services Provided</td>
              <td className="py-2 px-2">
                <select value={get('ratingQuantity')} onChange={(e) => onChange?.('ratingQuantity', e.target.value)} className={selectClass}>
                  <option value="">Select...</option>
                  {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </td>
            </tr>
            <tr className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
              <td className="py-3 px-4 font-medium text-[#1e4d2b]">2. Personnel Service Quality</td>
              <td className="py-2 px-2">
                <select value={get('ratingServicesPersonnel')} onChange={(e) => onChange?.('ratingServicesPersonnel', e.target.value)} className={selectClass}>
                  <option value="">Select...</option>
                  {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </td>
            </tr>
            <tr className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
              <td className="py-3 px-4 pl-8 text-[#5c574f] italic">2.1 Relevance of training</td>
              <td className="py-2 px-2">
                <select value={get('ratingTraining')} onChange={(e) => onChange?.('ratingTraining', e.target.value)} className={selectClass}>
                  <option value="">Select...</option>
                  {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </td>
            </tr>
            <tr className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
              <td className="py-3 px-4 pl-8 text-[#5c574f] italic">2.2 Attitude (Courteousness)</td>
              <td className="py-2 px-2">
                <select value={get('ratingAttitude')} onChange={(e) => onChange?.('ratingAttitude', e.target.value)} className={selectClass}>
                  <option value="">Select...</option>
                  {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </td>
            </tr>
            <tr className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
              <td className="py-3 px-4 pl-8 text-[#5c574f] italic">2.3 Promptness</td>
              <td className="py-2 px-2">
                <select value={get('ratingPromptness')} onChange={(e) => onChange?.('ratingPromptness', e.target.value)} className={selectClass}>
                  <option value="">Select...</option>
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
