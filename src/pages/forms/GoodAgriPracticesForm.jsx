import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const initialState = {
  applicationDate: '', farmName: '', farmOwner: '', farmLocation: '', cropsPlanted: '',
  productionArea: '', harvestEstimate: '', waterSource: '', philgapCertNo: '', dateIssued: '', expiryDate: '',
}

export default function GoodAgriPracticesForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('goodAgriPractices')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }
  return (
    <FormLayout title="Good Agricultural Practices (GAP) Unit">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Application Date</label><input type="date" value={form.applicationDate} onChange={(e) => update('applicationDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Farm Name</label><input type="text" value={form.farmName} onChange={(e) => update('farmName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Farm Owner</label><input type="text" value={form.farmOwner} onChange={(e) => update('farmOwner', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Farm Location</label><input type="text" value={form.farmLocation} onChange={(e) => update('farmLocation', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Crops Planted</label><input type="text" value={form.cropsPlanted} onChange={(e) => update('cropsPlanted', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Production Area (Ha)</label><input type="text" value={form.productionArea} onChange={(e) => update('productionArea', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Harvest Estimate (MT)</label><input type="text" value={form.harvestEstimate} onChange={(e) => update('harvestEstimate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div><label className="block text-sm font-medium text-primary mb-1">Water Source</label><input type="text" value={form.waterSource} onChange={(e) => update('waterSource', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">PhilGAP Certificate No.</label><input type="text" value={form.philgapCertNo} onChange={(e) => update('philgapCertNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Date Issued</label><input type="date" value={form.dateIssued} onChange={(e) => update('dateIssued', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Expiry Date</label><input type="date" value={form.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
