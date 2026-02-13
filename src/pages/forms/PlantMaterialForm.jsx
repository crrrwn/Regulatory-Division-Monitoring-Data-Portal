import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const PLANT_MATERIALS = ['Fruit Trees', 'Vegetables', 'Ornamentals', 'Plantation Crops']

const initialState = {
  dateApplied: '', nurseryName: '', operatorName: '', farmLocation: '', totalArea: '',
  plantMaterials: '', specificVariety: '', propagatorName: '', accreditationNo: '', validityDate: '', remarks: '',
}

export default function PlantMaterialForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('plantMaterial')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }

  return (
    <FormLayout title="Plant Material / Nursery Accreditation">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-primary mb-1">Date Applied</label><input type="date" value={form.dateApplied} onChange={(e) => update('dateApplied', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div><div><label className="block text-sm font-medium text-primary mb-1">Nursery Name</label><input type="text" value={form.nurseryName} onChange={(e) => update('nurseryName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div></div>
        <div className="grid sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-primary mb-1">Operator Name</label><input type="text" value={form.operatorName} onChange={(e) => update('operatorName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div><div><label className="block text-sm font-medium text-primary mb-1">Farm/Nursery Location</label><input type="text" value={form.farmLocation} onChange={(e) => update('farmLocation', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div></div>
        <div><label className="block text-sm font-medium text-primary mb-1">Total Area (sqm/ha)</label><input type="text" value={form.totalArea} onChange={(e) => update('totalArea', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-primary mb-1">Plant Materials</label><select value={form.plantMaterials} onChange={(e) => update('plantMaterials', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{PLANT_MATERIALS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-primary mb-1">Specific Variety</label><input type="text" value={form.specificVariety} onChange={(e) => update('specificVariety', e.target.value)} placeholder="e.g. Carabao Mango, Cacao UF18" className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        <div className="grid sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-primary mb-1">Propagator Name</label><input type="text" value={form.propagatorName} onChange={(e) => update('propagatorName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div><div><label className="block text-sm font-medium text-primary mb-1">Accreditation No.</label><input type="text" value={form.accreditationNo} onChange={(e) => update('accreditationNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div><div><label className="block text-sm font-medium text-primary mb-1">Validity Date</label><input type="date" value={form.validityDate} onChange={(e) => update('validityDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div><div><label className="block text-sm font-medium text-primary mb-1">Remarks</label><input type="text" value={form.remarks} onChange={(e) => update('remarks', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div></div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
