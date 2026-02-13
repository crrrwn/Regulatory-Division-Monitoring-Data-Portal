import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const SCOPE_OPTIONS = ['Crop Production', 'Livestock', 'Processing', 'Input Manufacturing']
const CERT_STATUS = ['In-Conversion', 'Fully Certified']

const initialState = {
  dateApplied: '', entityName: '', operatorOwner: '', location: '', scope: '',
  certifyingBody: '', commodities: '', conversionStartDate: '', certificationStatus: '', certificateNo: '', validityDate: '',
}

export default function OrganicAgriForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('organicAgri')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }

  return (
    <FormLayout title="Organic Agriculture Certification">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-primary mb-1">Date Applied</label><input type="date" value={form.dateApplied} onChange={(e) => update('dateApplied', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div><div><label className="block text-sm font-medium text-primary mb-1">Entity Name (Farm or Manufacturer)</label><input type="text" value={form.entityName} onChange={(e) => update('entityName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div></div>
        <div className="grid sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-primary mb-1">Operator/Owner</label><input type="text" value={form.operatorOwner} onChange={(e) => update('operatorOwner', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div><div><label className="block text-sm font-medium text-primary mb-1">Location</label><input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div></div>
        <div><label className="block text-sm font-medium text-primary mb-1">Scope</label><select value={form.scope} onChange={(e) => update('scope', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{SCOPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-primary mb-1">Certifying Body</label><input type="text" value={form.certifyingBody} onChange={(e) => update('certifyingBody', e.target.value)} placeholder="e.g. OCCP, NICERT" className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-primary mb-1">Commodities</label><input type="text" value={form.commodities} onChange={(e) => update('commodities', e.target.value)} placeholder="e.g. Organic Rice, Organic Fertilizer" className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        <div className="grid sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-primary mb-1">Conversion Start Date</label><input type="date" value={form.conversionStartDate} onChange={(e) => update('conversionStartDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div><div><label className="block text-sm font-medium text-primary mb-1">Certification Status</label><select value={form.certificationStatus} onChange={(e) => update('certificationStatus', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{CERT_STATUS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div><div><label className="block text-sm font-medium text-primary mb-1">Certificate No.</label><input type="text" value={form.certificateNo} onChange={(e) => update('certificateNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div><div><label className="block text-sm font-medium text-primary mb-1">Validity Date</label><input type="date" value={form.validityDate} onChange={(e) => update('validityDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div></div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
