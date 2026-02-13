import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const VIOLATION_OPTIONS = ['Mislabeling', 'No Cert', 'Fake Logo', 'Others']
const ACTION_OPTIONS = ['Warning', 'Confiscation', 'Notice of Violation', 'Others']

const initialState = {
  inspectionDate: '', establishmentName: '', address: '', productName: '', brand: '',
  labelClaim: '', certifyingLogoPresent: '', violationFound: '', actionTaken: '', inspectorName: '',
}

export default function OrganicPostMarketForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('organicPostMarket')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }
  return (
    <FormLayout title="Organic Product Post-Market Surveillance">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Inspection Date</label><input type="date" value={form.inspectionDate} onChange={(e) => update('inspectionDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Establishment Name (Store/Supermarket)</label><input type="text" value={form.establishmentName} onChange={(e) => update('establishmentName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div><label className="block text-sm font-medium text-primary mb-1">Address</label><input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Product Name</label><input type="text" value={form.productName} onChange={(e) => update('productName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Brand</label><input type="text" value={form.brand} onChange={(e) => update('brand', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div><label className="block text-sm font-medium text-primary mb-1">Label Claim</label><input type="text" value={form.labelClaim} onChange={(e) => update('labelClaim', e.target.value)} placeholder='e.g. "100% Organic"' className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Certifying Logo Present?</label><select value={form.certifyingLogoPresent} onChange={(e) => update('certifyingLogoPresent', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Violation Found</label><select value={form.violationFound} onChange={(e) => update('violationFound', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{VIOLATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Action Taken</label><select value={form.actionTaken} onChange={(e) => update('actionTaken', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{ACTION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Inspector Name</label><input type="text" value={form.inspectorName} onChange={(e) => update('inspectorName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
