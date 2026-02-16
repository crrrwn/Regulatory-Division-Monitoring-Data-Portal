import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied', 'Expired']

const RATING_OPTIONS = [
  { value: '1', label: 'Poor (1)' },
  { value: '2', label: 'Fair (2)' },
  { value: '3', label: 'Satisfied (3)' },
  { value: '4', label: 'Very Satisfied (4)' },
  { value: '5', label: 'Excellent (5)' },
]

const initialState = {
  applicant: '',
  operator: '',
  location: '',
  cropsVariety: '',
  submissionOfApplicationForm: '',
  evaluationOfDocumentary: '',
  paymentOfApplicationFee: '',
  amountOfFee: '',
  dateOfInspectionAndEvaluation: '',
  approvedValidatedResult: '',
  endorsementToBPI: '',
  dateOfInspection1stSem: '',
  dateOfInspection2ndSem: '',
  status: '',
  validity: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function PlantMaterialForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('plantMaterial')
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
    <FormLayout title="Plant Material / Nursery Accreditation">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Applicant</label>
            <input type="text" value={form.applicant} onChange={updateUpper('applicant')} className={inputClass} placeholder="Applicant name" required />
          </div>
          <div>
            <label className={labelClass}>Operator</label>
            <input type="text" value={form.operator} onChange={updateUpper('operator')} className={inputClass} placeholder="Operator name" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input type="text" value={form.location} onChange={updateUpper('location')} className={inputClass} placeholder="Nursery/farm location" />
        </div>
        <div>
          <label className={labelClass}>Crops/Variety</label>
          <input type="text" value={form.cropsVariety} onChange={updateUpper('cropsVariety')} className={inputClass} placeholder="e.g. Carabao Mango, Cacao UF18" />
        </div>
        <div>
          <label className={labelClass}>Submission of Client's Filled Application Form to DA-Regulatory Division</label>
          <input type="date" value={form.submissionOfApplicationForm} onChange={(e) => update('submissionOfApplicationForm', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Evaluation of Submitted Documentary Requirements</label>
          <input type="date" value={form.evaluationOfDocumentary} onChange={(e) => update('evaluationOfDocumentary', e.target.value)} className={inputClass} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Payment of Application Fee</label>
            <input type="date" value={form.paymentOfApplicationFee} onChange={(e) => update('paymentOfApplicationFee', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Amount of Fee</label>
            <input type="text" value={form.amountOfFee} onChange={updateUpper('amountOfFee')} className={inputClass} placeholder="e.g. ₱1,500" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Date of Inspection and Evaluation of Nursery</label>
          <input type="date" value={form.dateOfInspectionAndEvaluation} onChange={(e) => update('dateOfInspectionAndEvaluation', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Approved Validated Result of Inspection and Validation of Areas</label>
          <input type="text" value={form.approvedValidatedResult} onChange={updateUpper('approvedValidatedResult')} className={inputClass} placeholder="Result/remarks" />
        </div>
        <div>
          <label className={labelClass}>Endorsement of Application to BPI</label>
          <input type="date" value={form.endorsementToBPI} onChange={(e) => update('endorsementToBPI', e.target.value)} className={inputClass} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date of Inspection and Monitoring (1st Semester)</label>
            <input type="date" value={form.dateOfInspection1stSem} onChange={(e) => update('dateOfInspection1stSem', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date of Inspection and Monitoring (2nd Semester)</label>
            <input type="date" value={form.dateOfInspection2ndSem} onChange={(e) => update('dateOfInspection2ndSem', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={updateUpper('status')} className={inputClass}>
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Validity</label>
            <input type="date" value={form.validity} onChange={(e) => update('validity', e.target.value)} className={inputClass} />
          </div>
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
