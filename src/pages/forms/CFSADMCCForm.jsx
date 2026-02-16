import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const RATING_OPTIONS = [
  { value: '1', label: 'Poor (1)' },
  { value: '2', label: 'Fair (2)' },
  { value: '3', label: 'Satisfied (3)' },
  { value: '4', label: 'Very Satisfied (4)' },
  { value: '5', label: 'Excellent (5)' },
]

const initialState = {
  clientName: '',
  typeOfDiseaseSurveillance: '',
  purpose: '',
  address: '',
  dateOfRequest: '',
  dateOfSurveillance: '',
  numberOfSamples: '',
  dateSubmittedToLab: '',
  dateOfEndorsementToDA: '',
  remarks: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function CFSADMCCForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('cfsAdmcc')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const updateUpper = (key) => (e) => update(key, (e.target.value || '').toUpperCase())

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) {
      setForm(initialState)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const labelClass = "block text-sm font-medium text-primary mb-1"
  const inputClass = "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted uppercase"

  return (
    <FormLayout title="CFS/ADMCC (Animal Disease Surveillance)">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className={labelClass}>Name of Local Government Unit/Client/Farm</label>
          <input type="text" value={form.clientName} onChange={updateUpper('clientName')} className={inputClass} placeholder="LGU/Client/Farm name" required />
        </div>
        <div>
          <label className={labelClass}>Type of Disease Surveillance</label>
          <input type="text" value={form.typeOfDiseaseSurveillance} onChange={updateUpper('typeOfDiseaseSurveillance')} className={inputClass} placeholder="e.g. Avian Influenza, ASF" />
        </div>
        <div>
          <label className={labelClass}>Purpose</label>
          <input type="text" value={form.purpose} onChange={updateUpper('purpose')} className={inputClass} placeholder="Purpose of surveillance" />
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input type="text" value={form.address} onChange={updateUpper('address')} className={inputClass} placeholder="Complete address" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date of Request</label>
            <input type="date" value={form.dateOfRequest} onChange={(e) => update('dateOfRequest', e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Date of Surveillance (Blood Collection)</label>
            <input type="date" value={form.dateOfSurveillance} onChange={(e) => update('dateOfSurveillance', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Number of Samples Collected & Submitted</label>
          <input type="text" value={form.numberOfSamples} onChange={updateUpper('numberOfSamples')} className={inputClass} placeholder="e.g. 50" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date Submitted to Laboratory</label>
            <input type="date" value={form.dateSubmittedToLab} onChange={(e) => update('dateSubmittedToLab', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date of Endorsement to DA-BAI</label>
            <input type="date" value={form.dateOfEndorsementToDA} onChange={(e) => update('dateOfEndorsementToDA', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Recommendation</label>
          <textarea value={form.remarks} onChange={updateUpper('remarks')} className={`${inputClass} min-h-[80px]`} rows="3" placeholder="Additional notes..." />
        </div>

        {/* --- CUSTOMER SATISFACTION RATINGS --- */}
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
                    <select value={form.ratingQuantity} onChange={(e) => update('ratingQuantity', e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-sm">
                      <option value="">Select rating...</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-2 font-medium text-primary">2. Services Rendered by Personnel</td>
                  <td colSpan="2" className="py-2 px-2">
                    <select value={form.ratingServicesPersonnel} onChange={(e) => update('ratingServicesPersonnel', e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-sm">
                      <option value="">Select rating...</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pl-6 pr-2 text-primary">2.1 For training consider its relevance</td>
                  <td colSpan="2" className="py-2 px-2">
                    <select value={form.ratingTraining} onChange={(e) => update('ratingTraining', e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-sm">
                      <option value="">Select rating...</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pl-6 pr-2 text-primary">2.2 Attitude (i.e. courteousness)</td>
                  <td colSpan="2" className="py-2 px-2">
                    <select value={form.ratingAttitude} onChange={(e) => update('ratingAttitude', e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-sm">
                      <option value="">Select rating...</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pl-6 pr-2 text-primary">2.3 Promptness in attending the request</td>
                  <td colSpan="2" className="py-2 px-2">
                    <select value={form.ratingPromptness} onChange={(e) => update('ratingPromptness', e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-sm">
                      <option value="">Select rating...</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <label className={labelClass}>Recommendation</label>
          <textarea value={form.recommendation} onChange={updateUpper('recommendation')} className={`${inputClass} min-h-[80px]`} rows="3" placeholder="Recommendations..." />
        </div>

        {message && (
          <p className={`p-3 rounded ${message.type === 'success' ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.text}</p>
        )}
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 font-semibold">
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </form>
    </FormLayout>
  )
}
