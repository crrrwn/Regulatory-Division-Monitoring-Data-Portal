import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const FARM_TYPES = ['Piggery', 'Poultry', 'Cattle', 'Goat', 'Others']
const BIOSECURITY_LEVELS = ['Level 1', 'Level 2', 'Level 3']

const initialState = {
  applicationDate: '', farmName: '', owner: '', farmAddress: '', farmType: '',
  population: '', biosecurityLevel: '', eccNo: '', gahpCertNo: '', validity: '', inspectionStatus: '',
}

export default function GoodAnimalHusbandryForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('goodAnimalHusbandry')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }
  return (
    <FormLayout title="Good Animal Husbandry Practices (GAHP) Unit">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Application Date</label><input type="date" value={form.applicationDate} onChange={(e) => update('applicationDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Farm Name</label><input type="text" value={form.farmName} onChange={(e) => update('farmName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Owner</label><input type="text" value={form.owner} onChange={(e) => update('owner', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Farm Address</label><input type="text" value={form.farmAddress} onChange={(e) => update('farmAddress', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Farm Type</label><select value={form.farmType} onChange={(e) => update('farmType', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{FARM_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Population (Heads)</label><input type="text" value={form.population} onChange={(e) => update('population', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Biosecurity Level</label><select value={form.biosecurityLevel} onChange={(e) => update('biosecurityLevel', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{BIOSECURITY_LEVELS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">ECC No.</label><input type="text" value={form.eccNo} onChange={(e) => update('eccNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">GAHP Certificate No.</label><input type="text" value={form.gahpCertNo} onChange={(e) => update('gahpCertNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Validity</label><input type="text" value={form.validity} onChange={(e) => update('validity', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Inspection Status</label><input type="text" value={form.inspectionStatus} onChange={(e) => update('inspectionStatus', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
