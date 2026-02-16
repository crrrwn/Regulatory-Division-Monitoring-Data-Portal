import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const initialState = {
  requestLetterDate: '',
  identifiedMarketOutlet: '',
  dateOfCommunicationLetter: '',
  nameOfProduct: '',
  commodity: '',
  certification: '',
  nameOfOwnerManager: '',
  location: '',
  dateOfSurveillance: '',
  remarks: '',
  linkFile: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function OrganicPostMarketForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('organicPostMarket')
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
    <FormLayout title="Organic Product Post-Market Surveillance">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className={labelClass}>Request Letter (Date)</label>
          <input type="date" value={form.requestLetterDate} onChange={(e) => update('requestLetterDate', e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Identified Market Outlet/Establishment</label>
          <input type="text" value={form.identifiedMarketOutlet} onChange={updateUpper('identifiedMarketOutlet')} className={inputClass} placeholder="Market outlet or establishment name" required />
        </div>
        <div>
          <label className={labelClass}>Date of Communication Letter</label>
          <input type="date" value={form.dateOfCommunicationLetter} onChange={(e) => update('dateOfCommunicationLetter', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Name of Product</label>
          <input type="text" value={form.nameOfProduct} onChange={updateUpper('nameOfProduct')} className={inputClass} placeholder="Product name" />
        </div>
        <div>
          <label className={labelClass}>Commodity</label>
          <input type="text" value={form.commodity} onChange={updateUpper('commodity')} className={inputClass} placeholder="e.g. Rice, Vegetables" />
        </div>
        <div>
          <label className={labelClass}>Certification</label>
          <input type="text" value={form.certification} onChange={updateUpper('certification')} className={inputClass} placeholder="Organic certification details" />
        </div>
        <div>
          <label className={labelClass}>Name of Owner/Manager</label>
          <input type="text" value={form.nameOfOwnerManager} onChange={updateUpper('nameOfOwnerManager')} className={inputClass} placeholder="Owner or manager name" />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input type="text" value={form.location} onChange={updateUpper('location')} className={inputClass} placeholder="Complete address/location" />
        </div>
        <div>
          <label className={labelClass}>Date of Surveillance</label>
          <input type="date" value={form.dateOfSurveillance} onChange={(e) => update('dateOfSurveillance', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Remarks</label>
          <textarea value={form.remarks} onChange={updateUpper('remarks')} className={`${inputClass} min-h-[80px]`} rows="3" placeholder="Additional notes..." />
        </div>
        <div>
          <label className={labelClass}>Link File</label>
          <input type="url" value={form.linkFile} onChange={(e) => update('linkFile', e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted" placeholder="https://..." />
        </div>
        <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
        <div>
          <label className={labelClass}>Recommendation</label>
          <textarea value={form.recommendation} onChange={updateUpper('recommendation')} className={`${inputClass} min-h-[80px]`} rows="3" placeholder="Recommendations..." />
        </div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 font-semibold">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
