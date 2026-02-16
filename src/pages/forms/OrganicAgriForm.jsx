import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied', 'Certified']

const RATING_OPTIONS = [
  { value: '1', label: 'Poor (1)' },
  { value: '2', label: 'Fair (2)' },
  { value: '3', label: 'Satisfied (3)' },
  { value: '4', label: 'Very Satisfied (4)' },
  { value: '5', label: 'Excellent (5)' },
]

const initialState = {
  application: '',
  nameOfGroup: '',
  nameOfApplicant: '',
  location: '',
  area: '',
  dateOfEvaluation: '',
  remarks: '',
  dateOfEndorsement: '',
  finalInspection: '',
  status: '',
  issuanceOfCertificate: '',
  finalRemarks: '',
  linkFile: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function OrganicAgriForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('organicAgri')
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
    <FormLayout title="Organic Agriculture Certification">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className={labelClass}>Application</label>
          <input type="text" value={form.application} onChange={updateUpper('application')} className={inputClass} placeholder="Application details" required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name of Group</label>
            <input type="text" value={form.nameOfGroup} onChange={updateUpper('nameOfGroup')} className={inputClass} placeholder="Group/Organization name" />
          </div>
          <div>
            <label className={labelClass}>Name of Applicant</label>
            <input type="text" value={form.nameOfApplicant} onChange={updateUpper('nameOfApplicant')} className={inputClass} placeholder="Applicant name" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Location</label>
            <input type="text" value={form.location} onChange={updateUpper('location')} className={inputClass} placeholder="Farm/location address" />
          </div>
          <div>
            <label className={labelClass}>Area</label>
            <input type="text" value={form.area} onChange={updateUpper('area')} className={inputClass} placeholder="e.g. 5 ha" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Date of Evaluation</label>
          <input type="date" value={form.dateOfEvaluation} onChange={(e) => update('dateOfEvaluation', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Remarks</label>
          <textarea value={form.remarks} onChange={updateUpper('remarks')} className={`${inputClass} min-h-[80px]`} rows="2" placeholder="Evaluation remarks..." />
        </div>
        <div>
          <label className={labelClass}>Date of Endorsement</label>
          <input type="date" value={form.dateOfEndorsement} onChange={(e) => update('dateOfEndorsement', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Final Inspection</label>
          <input type="date" value={form.finalInspection} onChange={(e) => update('finalInspection', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={form.status} onChange={updateUpper('status')} className={inputClass}>
            <option value="">Select Status</option>
            {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Issuance of Certificate</label>
          <input type="date" value={form.issuanceOfCertificate} onChange={(e) => update('issuanceOfCertificate', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Final Remarks</label>
          <textarea value={form.finalRemarks} onChange={updateUpper('finalRemarks')} className={`${inputClass} min-h-[80px]`} rows="2" placeholder="Additional remarks..." />
        </div>
        <div>
          <label className={labelClass}>Link File</label>
          <input type="url" value={form.linkFile} onChange={(e) => update('linkFile', e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted" placeholder="https://..." />
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
