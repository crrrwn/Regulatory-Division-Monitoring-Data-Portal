import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const RESULT_OPTIONS = ['Positive', 'Negative']

const initialState = {
  dateReported: '', barangay: '', municipality: '', farmOwnerName: '', species: '',
  clinicalSigns: '', totalPopulation: '', mortality: '', laboratoryTest: '', result: '', controlMeasures: '',
}

export default function AnimalDiseaseSurveillanceForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('animalDiseaseSurveillance')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }
  return (
    <FormLayout title="Animal Disease Surveillance">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Date Reported</label><input type="date" value={form.dateReported} onChange={(e) => update('dateReported', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Barangay</label><input type="text" value={form.barangay} onChange={(e) => update('barangay', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Municipality</label><input type="text" value={form.municipality} onChange={(e) => update('municipality', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Farm/Owner Name</label><input type="text" value={form.farmOwnerName} onChange={(e) => update('farmOwnerName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Species</label><input type="text" value={form.species} onChange={(e) => update('species', e.target.value)} placeholder="Swine, Poultry, etc." className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div><label className="block text-sm font-medium text-primary mb-1">Clinical Signs</label><input type="text" value={form.clinicalSigns} onChange={(e) => update('clinicalSigns', e.target.value)} placeholder="e.g. Sudden death, Hemorrhage" className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Total Population</label><input type="text" value={form.totalPopulation} onChange={(e) => update('totalPopulation', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Mortality</label><input type="text" value={form.mortality} onChange={(e) => update('mortality', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Laboratory Test</label><input type="text" value={form.laboratoryTest} onChange={(e) => update('laboratoryTest', e.target.value)} placeholder="RRT-PCR / ELISA" className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Result</label><select value={form.result} onChange={(e) => update('result', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{RESULT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
        </div>
        <div><label className="block text-sm font-medium text-primary mb-1">Control Measures</label><input type="text" value={form.controlMeasures} onChange={(e) => update('controlMeasures', e.target.value)} placeholder="Quarantine, Culling, Vaccination" className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
