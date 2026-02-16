import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied']

const initialState = {
  explorationPermitApplicationNo: '',
  nameOfApplicant: '',
  dateReceived: '',
  location: '',
  area: '',
  dateOfReplyToRequest: '',
  endorsementToBSWM: '',
  endorsementToMGB: '',
  fieldValidation: '',
  remarks: '',
  rescheduledDate: '',
  fieldValidationReport: '',
  issuanceOfCertificateAndEndorsementToMGB: '',
  status: '',
  findings: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function SafdzValidationForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('safdzValidation')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const updateUpper = (key) => (e) => update(key, (e.target.value || '').toUpperCase())

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }

  const labelClass = "block text-sm font-medium text-primary mb-1"
  const inputClass = "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted uppercase"

  return (
    <FormLayout title="SAFDZ Validation">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Exploration Permit Application No.</label>
            <input type="text" value={form.explorationPermitApplicationNo} onChange={updateUpper('explorationPermitApplicationNo')} className={inputClass} placeholder="Application number" required />
          </div>
          <div>
            <label className={labelClass}>Name of Applicant</label>
            <input type="text" value={form.nameOfApplicant} onChange={updateUpper('nameOfApplicant')} className={inputClass} placeholder="Applicant name" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date Received</label>
            <input type="date" value={form.dateReceived} onChange={(e) => update('dateReceived', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input type="text" value={form.location} onChange={updateUpper('location')} className={inputClass} placeholder="Location/address" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Area (ha)</label>
            <input type="text" value={form.area} onChange={updateUpper('area')} className={inputClass} placeholder="e.g. 5.00" />
          </div>
          <div>
            <label className={labelClass}>Date of Reply to the Request</label>
            <input type="date" value={form.dateOfReplyToRequest} onChange={(e) => update('dateOfReplyToRequest', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Endorsement to BSWM</label>
            <input type="date" value={form.endorsementToBSWM} onChange={(e) => update('endorsementToBSWM', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Endorsement to MGB</label>
            <input type="date" value={form.endorsementToMGB} onChange={(e) => update('endorsementToMGB', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Field Validation</label>
          <input type="text" value={form.fieldValidation} onChange={updateUpper('fieldValidation')} className={inputClass} placeholder="Field validation details" />
        </div>
        <div>
          <label className={labelClass}>Remarks</label>
          <textarea value={form.remarks} onChange={updateUpper('remarks')} className={`${inputClass} min-h-[80px]`} rows="3" placeholder="Additional remarks..." />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Rescheduled date</label>
            <input type="date" value={form.rescheduledDate} onChange={(e) => update('rescheduledDate', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Field Validation Report</label>
            <input type="text" value={form.fieldValidationReport} onChange={updateUpper('fieldValidationReport')} className={inputClass} placeholder="Report reference" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Issuance of Certificate and Endorsement to MGB</label>
            <input type="date" value={form.issuanceOfCertificateAndEndorsementToMGB} onChange={(e) => update('issuanceOfCertificateAndEndorsementToMGB', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={updateUpper('status')} className={inputClass}>
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Findings</label>
          <textarea value={form.findings} onChange={updateUpper('findings')} className={`${inputClass} min-h-[80px]`} rows="3" placeholder="Findings..." />
        </div>

        <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />

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
