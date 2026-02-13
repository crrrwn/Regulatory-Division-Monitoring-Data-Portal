import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const STAGE_OPTIONS = ['Vegetative', 'Flowering', 'Harvesting']
const SEVERITY_OPTIONS = ['Low', 'Medium', 'High']

const initialState = {
  dateOfMonitoring: '', location: '', farmerName: '', cropAffected: '', stageOfCrop: '',
  pestDiseaseObserved: '', incidenceRate: '', damageSeverity: '', actionTaken: '', technicianName: '',
}

export default function PlantPestSurveillanceForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('plantPestSurveillance')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }
  return (
    <FormLayout title="Plant Pest and Disease Surveillance">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Date of Monitoring</label><input type="date" value={form.dateOfMonitoring} onChange={(e) => update('dateOfMonitoring', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Location (GPS/Brgy)</label><input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Farmer Name</label><input type="text" value={form.farmerName} onChange={(e) => update('farmerName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Crop Affected</label><input type="text" value={form.cropAffected} onChange={(e) => update('cropAffected', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Stage of Crop</label><select value={form.stageOfCrop} onChange={(e) => update('stageOfCrop', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{STAGE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Pest/Disease Observed</label><input type="text" value={form.pestDiseaseObserved} onChange={(e) => update('pestDiseaseObserved', e.target.value)} placeholder="e.g. Fall Armyworm" className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Incidence Rate (%)</label><input type="text" value={form.incidenceRate} onChange={(e) => update('incidenceRate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Damage Severity</label><select value={form.damageSeverity} onChange={(e) => update('damageSeverity', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{SEVERITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Action Taken</label><input type="text" value={form.actionTaken} onChange={(e) => update('actionTaken', e.target.value)} placeholder="Spraying, Technical Advice" className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div><label className="block text-sm font-medium text-primary mb-1">Technician Name</label><input type="text" value={form.technicianName} onChange={(e) => update('technicianName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
