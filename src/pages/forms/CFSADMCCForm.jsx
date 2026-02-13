import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const SAMPLE_TYPES = ['Feed Ingredient', 'Finished Feed']
const COMPLIANCE_OPTIONS = ['Pass', 'Fail']

const initialState = {
  date: '', establishment: '', sampleType: '', parameterTested: '', sourceOrigin: '',
  resultValue: '', standardLimit: '', compliance: '', referenceReportNo: '',
}

export default function CFSADMCCForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('cfsAdmcc')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }
  return (
    <FormLayout title="CFS/ADMCC (Feed Safety & Standards)">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Date</label><input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Establishment/Feed Mill</label><input type="text" value={form.establishment} onChange={(e) => update('establishment', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Sample Type</label><select value={form.sampleType} onChange={(e) => update('sampleType', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{SAMPLE_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Parameter Tested</label><input type="text" value={form.parameterTested} onChange={(e) => update('parameterTested', e.target.value)} placeholder="Aflatoxin, Antibiotics, Heavy Metals" className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Source Origin</label><select value={form.sourceOrigin} onChange={(e) => update('sourceOrigin', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option><option value="Local">Local</option><option value="Imported">Imported</option></select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Result Value</label><input type="text" value={form.resultValue} onChange={(e) => update('resultValue', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Standard Limit</label><input type="text" value={form.standardLimit} onChange={(e) => update('standardLimit', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Compliance</label><select value={form.compliance} onChange={(e) => update('compliance', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{COMPLIANCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Reference Report No.</label><input type="text" value={form.referenceReportNo} onChange={(e) => update('referenceReportNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
