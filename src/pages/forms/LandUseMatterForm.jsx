import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const PROPOSED_OPTIONS = ['Residential', 'Commercial', 'Industrial']
const STATUS_OPTIONS = ['On-Process', 'Approved', 'Denied']

const initialState = {
  dateReceived: '', landowner: '', lotTitleNo: '', location: '', totalLandArea: '',
  existingCropUsage: '', proposedUsage: '', safdzZone: '', daClearanceNo: '', status: '',
}

export default function LandUseMatterForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('landUseMatter')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }
  return (
    <FormLayout title="Land Use Matter (Reclassification / SAFDZ)">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Date Received</label><input type="date" value={form.dateReceived} onChange={(e) => update('dateReceived', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Landowner</label><input type="text" value={form.landowner} onChange={(e) => update('landowner', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Lot No. / Title No.</label><input type="text" value={form.lotTitleNo} onChange={(e) => update('lotTitleNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Location (Brgy/City)</label><input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Total Land Area (Ha)</label><input type="text" value={form.totalLandArea} onChange={(e) => update('totalLandArea', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Existing Crop/Usage</label><input type="text" value={form.existingCropUsage} onChange={(e) => update('existingCropUsage', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Proposed Usage</label><select value={form.proposedUsage} onChange={(e) => update('proposedUsage', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{PROPOSED_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">SAFDZ Zone?</label><select value={form.safdzZone} onChange={(e) => update('safdzZone', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">DA Clearance No.</label><input type="text" value={form.daClearanceNo} onChange={(e) => update('daClearanceNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Status</label><select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
        </div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
