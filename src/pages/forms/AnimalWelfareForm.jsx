import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const FACILITY_TYPES = ['Pet Shop', 'Vet Clinic', 'Grooming', 'Breeding Kennel', 'Shelter', 'Zoo', 'Research Facility']
const STATUS_OPTIONS = ['Pending', 'Inspected', 'Registered', 'Expired']

const initialState = {
  dateApplied: '', facilityName: '', ownerName: '', address: '', facilityType: '',
  speciesHandled: '', headVet: '', prcLicenseNo: '', certificateNo: '', validityDate: '', status: '',
}

export default function AnimalWelfareForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('animalWelfare')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }

  return (
    <FormLayout title="Animal Welfare Concern Unit">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Date Applied</label>
          <input type="date" value={form.dateApplied} onChange={(e) => update('dateApplied', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Facility Name (Business Name)</label>
          <input type="text" value={form.facilityName} onChange={(e) => update('facilityName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Owner Name</label>
          <input type="text" value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Address (Complete)</label>
          <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Facility Type</label>
          <select value={form.facilityType} onChange={(e) => update('facilityType', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg">
            <option value="">Select</option>
            {FACILITY_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Species Handled</label>
          <input type="text" value={form.speciesHandled} onChange={(e) => update('speciesHandled', e.target.value)} placeholder="Dogs, Cats, Exotics, etc." className="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Head Veterinarian</label>
            <input type="text" value={form.headVet} onChange={(e) => update('headVet', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">PRC License No.</label>
            <input type="text" value={form.prcLicenseNo} onChange={(e) => update('prcLicenseNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Certificate No.</label>
            <input type="text" value={form.certificateNo} onChange={(e) => update('certificateNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Validity Date</label>
            <input type="date" value={form.validityDate} onChange={(e) => update('validityDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg">
              <option value="">Select</option>
              {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
