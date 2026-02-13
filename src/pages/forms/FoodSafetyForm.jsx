import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const ESTABLISHMENT_TYPES = ['Slaughterhouse', 'Market', 'Cold Storage']
const SENSORY_OPTIONS = ['Passed', 'Failed']
const LAB_RESULT_OPTIONS = ['Negative', 'Positive for Bacteria', 'Positive for Drug Residue']

const initialState = {
  dateOfMonitoring: '', establishmentType: '', nameOfEstablishment: '', address: '',
  productInspected: '', batchLotNo: '', sensoryAnalysis: '', labSampleCollected: '', labResult: '', remarks: '',
}

export default function FoodSafetyForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('foodSafety')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }
  return (
    <FormLayout title="Food Safety Unit">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Date of Monitoring</label><input type="date" value={form.dateOfMonitoring} onChange={(e) => update('dateOfMonitoring', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Establishment Type</label><select value={form.establishmentType} onChange={(e) => update('establishmentType', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{ESTABLISHMENT_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Name of Establishment</label><input type="text" value={form.nameOfEstablishment} onChange={(e) => update('nameOfEstablishment', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Address</label><input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Product Inspected</label><input type="text" value={form.productInspected} onChange={(e) => update('productInspected', e.target.value)} placeholder="Meat, Eggs, Processed" className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Batch/Lot No.</label><input type="text" value={form.batchLotNo} onChange={(e) => update('batchLotNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Sensory Analysis</label><select value={form.sensoryAnalysis} onChange={(e) => update('sensoryAnalysis', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{SENSORY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Laboratory Sample Collected?</label><select value={form.labSampleCollected} onChange={(e) => update('labSampleCollected', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Lab Result</label><select value={form.labResult} onChange={(e) => update('labResult', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{LAB_RESULT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Remarks</label><input type="text" value={form.remarks} onChange={(e) => update('remarks', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
