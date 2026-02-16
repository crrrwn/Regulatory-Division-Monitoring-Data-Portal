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
  dateOfRequestAndCollection: '',
  farmerName: '',
  address: '',
  contactNumber: '',
  gpsLocation: '',
  crop: '',
  variety: '',
  datePlanted: '',
  areaPlanted: '',
  areaAffected: '',
  percentInfestation: '',
  pestsDiseases: '',
  remarks: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
}

export default function PlantPestSurveillanceForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('plantPestSurveillance')
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
    <FormLayout title="Plant Pest and Disease Surveillance">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className={labelClass}>Date of Request and Collection</label>
          <input type="date" value={form.dateOfRequestAndCollection} onChange={(e) => update('dateOfRequestAndCollection', e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Name of Farmer</label>
          <input type="text" value={form.farmerName} onChange={updateUpper('farmerName')} className={inputClass} placeholder="Full name of farmer" />
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input type="text" value={form.address} onChange={updateUpper('address')} className={inputClass} placeholder="Complete address" />
        </div>
        <div>
          <label className={labelClass}>Contact Number</label>
          <input type="text" value={form.contactNumber} onChange={updateUpper('contactNumber')} className={inputClass} placeholder="e.g. 09XX XXX XXXX" />
        </div>
        <div>
          <label className={labelClass}>GPS Location</label>
          <input type="text" value={form.gpsLocation} onChange={updateUpper('gpsLocation')} className={inputClass} placeholder="e.g. 13.4124, 121.1801" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Crop</label>
            <input type="text" value={form.crop} onChange={updateUpper('crop')} className={inputClass} placeholder="e.g. Rice, Corn, Tomato" />
          </div>
          <div>
            <label className={labelClass}>Variety</label>
            <input type="text" value={form.variety} onChange={updateUpper('variety')} className={inputClass} placeholder="e.g. IR64, Hybrid" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date Planted</label>
            <input type="date" value={form.datePlanted} onChange={(e) => update('datePlanted', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Area Planted (ha)</label>
            <input type="text" value={form.areaPlanted} onChange={updateUpper('areaPlanted')} className={inputClass} placeholder="e.g. 1.5" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Area Affected</label>
            <input type="text" value={form.areaAffected} onChange={updateUpper('areaAffected')} className={inputClass} placeholder="Area affected (ha)" />
          </div>
          <div>
            <label className={labelClass}>Percent Infestation</label>
            <input type="text" value={form.percentInfestation} onChange={updateUpper('percentInfestation')} className={inputClass} placeholder="e.g. 25%" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Pests/Diseases</label>
          <input type="text" value={form.pestsDiseases} onChange={updateUpper('pestsDiseases')} className={inputClass} placeholder="e.g. Fall Armyworm, Rice Blast" />
        </div>
        <div>
          <label className={labelClass}>Remarks</label>
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
