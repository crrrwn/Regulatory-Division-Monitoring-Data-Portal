import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { handleFileAttachment } from '../../lib/handleFileAttachment'
import { PROVINCES } from '../../lib/regions'
import 'iconify-icon'

const SEMESTER_OPTIONS = [{ value: '', label: 'Select semester...' }, { value: '1st Semester', label: '1st Semester' }, { value: '2nd Semester', label: '2nd Semester' }]

const initialState = {
  province: '',
  semester: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
  attachmentFileName: '',
  attachmentData: '',
  formSubmissionDate: '',
}


export default function GoodAnimalHusbandryForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message, setMessage } = useFormSubmit('goodAnimalHusbandry')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const updateUpper = (key) => (e) => update(key, (e.target.value || '').toUpperCase())

  const [uploading, setUploading] = useState(false)
  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) update('attachmentFileName', file.name)
    handleFileAttachment(file, {
      collectionName: 'goodAnimalHusbandry',
      setUploading,
      setMessage,
      onSuccess: ({ fileName, attachmentData }) => { update('attachmentFileName', fileName); update('attachmentData', attachmentData) },
      onClear: () => { update('attachmentFileName', ''); update('attachmentData', '') },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }

  const labelClass = "block text-sm font-medium text-primary mb-1"
  const inputClass = "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted uppercase"

  return (
    <FormLayout title="Good Animal Husbandry Practices (GAHP) Unit">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className={labelClass}>Semester</label>
          <AppSelect value={form.semester} onChange={(v) => update('semester', v)} placeholder="Select semester..." options={SEMESTER_OPTIONS} aria-label="Semester" />
        </div>
        <div>
          <label className={labelClass}>Province</label>
          <AppSelect value={form.province} onChange={(v) => update('province', v)} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...PROVINCES.map((p) => ({ value: p, label: p }))]} aria-label="Province" />
        </div>
        <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />

        <div>
          <label className={labelClass}>Recommendation</label>
          <textarea value={form.recommendation} onChange={updateUpper('recommendation')} className={`${inputClass} min-h-[80px]`} rows="3" placeholder="Recommendations..." />
        </div>
        <div>
          <label className={labelClass}>Attachments</label>
          <div className="flex items-center gap-3">
            <label className="flex-1 cursor-pointer group">
              <span className="sr-only">Choose file</span>
              <input type="file" onChange={handleAttachmentChange} className="block w-full text-sm text-[#5c574f] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1e4d2b]/10 file:text-[#1e4d2b] hover:file:bg-[#1e4d2b]/20 transition-all duration-300 border-2 border-dashed border-[#e8e0d4] rounded-xl group-hover:border-[#1e4d2b]/50 py-3 px-4" />
            </label>
            {form.attachmentFileName && (
              <button type="button" onClick={() => { update('attachmentFileName', ''); update('attachmentData', '') }} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl" title="Remove File">
                <iconify-icon icon="mdi:trash-can-outline" width="20"></iconify-icon>
              </button>
            )}
          </div>
          <p className="mt-2 text-[10px] text-[#5c574f]">
            {uploading ? (
              <span className="text-[#b8a066] font-bold flex items-center gap-1.5">
                <iconify-icon icon="mdi:loading" class="animate-spin" width="13"></iconify-icon>
                Uploading...
              </span>
            ) : form.attachmentFileName ? (
              <span className="text-[#1e4d2b] font-bold">Selected: {form.attachmentFileName}</span>
            ) : 'Max file size: 25 MB (Images/PDF)'}
          </p>
        </div>
        <div>
          <label className={labelClass}>Form Submission Date (for year count)</label>
          <input type="date" value={form.formSubmissionDate} onChange={(e) => update('formSubmissionDate', e.target.value)} className={inputClass} aria-label="Form Submission Date" />
        </div>

        {message && (
          <p className={`p-3 rounded ${message.type === 'success' ? 'bg-primary/10 text-primary border border-primary/30' : message.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-300' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.text}</p>
        )}
        <button type="submit" disabled={loading || uploading} className="min-h-[44px] px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 font-semibold touch-manipulation">
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </form>
    </FormLayout>
  )
}
