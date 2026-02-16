import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const initialState = {
  controlNo: '',
  nameOfApplicant: '',
  purposeOfApplication: '',
  sizeOfArea: '',
  location: '',
  dateOfRequest: '',
  dateReceivedAndEvaluated: '',
  dateOfReplyToRequest: '',
  dateReceivedByApplicant: '',
  fieldInvestigation: '',
  dateOfEndorsement: '',
  issuanceOfCertificate: '',
  remarks: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function LandUseMatterForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('landUseMatter')
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
    <FormLayout title="Land Use Matter (Reclassification)">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Control No.</label>
            <input type="text" value={form.controlNo} onChange={updateUpper('controlNo')} className={inputClass} placeholder="Control number" required />
          </div>
          <div>
            <label className={labelClass}>Name of Applicant</label>
            <input type="text" value={form.nameOfApplicant} onChange={updateUpper('nameOfApplicant')} className={inputClass} placeholder="Applicant name" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Purpose of Application</label>
          <input type="text" value={form.purposeOfApplication} onChange={updateUpper('purposeOfApplication')} className={inputClass} placeholder="Purpose of application" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Size of Area (ha)</label>
            <input type="text" value={form.sizeOfArea} onChange={updateUpper('sizeOfArea')} className={inputClass} placeholder="e.g. 5.00" />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input type="text" value={form.location} onChange={updateUpper('location')} className={inputClass} placeholder="Brgy/City/Municipality" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date of Request</label>
            <input type="date" value={form.dateOfRequest} onChange={(e) => update('dateOfRequest', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date Received and Evaluated</label>
            <input type="date" value={form.dateReceivedAndEvaluated} onChange={(e) => update('dateReceivedAndEvaluated', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date of Reply to the Request</label>
            <input type="date" value={form.dateOfReplyToRequest} onChange={(e) => update('dateOfReplyToRequest', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date Received by the Applicant</label>
            <input type="date" value={form.dateReceivedByApplicant} onChange={(e) => update('dateReceivedByApplicant', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Field Investigation</label>
          <input type="text" value={form.fieldInvestigation} onChange={updateUpper('fieldInvestigation')} className={inputClass} placeholder="Field investigation details" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date of Endorsement</label>
            <input type="date" value={form.dateOfEndorsement} onChange={(e) => update('dateOfEndorsement', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Issuance of Certificate</label>
            <input type="date" value={form.issuanceOfCertificate} onChange={(e) => update('issuanceOfCertificate', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Remarks</label>
          <textarea value={form.remarks} onChange={updateUpper('remarks')} className={`${inputClass} min-h-[80px]`} rows="3" placeholder="Additional remarks..." />
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
