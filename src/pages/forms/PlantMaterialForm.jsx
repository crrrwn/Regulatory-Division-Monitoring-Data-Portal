import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import StockInventoryTable from '../../components/StockInventoryTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { handleFileAttachment } from '../../lib/handleFileAttachment'
import { PROVINCES } from '../../lib/regions'
import { Plus, Trash2 } from 'lucide-react'
import 'iconify-icon'

const FORM_TYPES = [
  { value: 'accreditation', label: 'Plant Nursery Accreditation Form' },
  { value: 'monitoring', label: 'Monitoring of Accredited Plant Nursery Form' },
  { value: 'stockInventory', label: 'Plant Nursery Stock Inventory' },
]

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied', 'Expired']
const MONITORING_STATUS_OPTIONS = ['Operational', 'Non-Operational']
const SEMESTER_OPTIONS = [{ value: '', label: 'Select semester...' }, { value: '1st Semester', label: '1st Semester' }, { value: '2nd Semester', label: '2nd Semester' }]

const accreditationInitial = {
  formType: 'accreditation',
  applicant: '',
  semester: '',
  nameOfNursery: '',
  province: '',
  location: '',
  cropsVariety: '',
  areaOfNursery: '',
  submissionOfApplicationForm: '',
  evaluationOfDocumentary: '',
  paymentOfApplicationFee: '',
  amountOfFee: '',
  dateOfInspectionOfNursery: '',
  validatedResult: '',
  endorsementOfApplication: '',
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

const monitoringInitial = {
  formType: 'monitoring',
  nameOfNursery: '',
  nameOfOperator: '',
  location: '',
  accreditedCropsVariety: '',
  areaOfNursery: '',
  status: '',
  remarks: '',
  validityDateOfAccreditation: '',
  dateOfMonitoring: '',
  semester: '',
  province: '',
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

const stockInventoryInitial = { formType: 'stockInventory', formSubmissionDate: '' }


export default function PlantMaterialForm() {
  const [formType, setFormType] = useState('')
  const [form, setForm] = useState(() => ({ ...accreditationInitial }))
  const { submit, loading, message, setMessage } = useFormSubmit('plantMaterial')
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const updateUpper = (key) => (e) => update(key, (e.target.value || '').toUpperCase())
  const handleFormTypeChange = (value) => {
    setFormType(value)
    if (value === 'accreditation') setForm({ ...accreditationInitial })
    else if (value === 'monitoring') setForm({ ...monitoringInitial, formType: value })
    else if (value === 'stockInventory') setForm({ ...stockInventoryInitial, formType: value })
  }

  const [uploading, setUploading] = useState(false)
  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) update('attachmentFileName', file.name)
    handleFileAttachment(file, {
      collectionName: 'plantMaterial',
      setUploading,
      setMessage,
      onSuccess: ({ fileName, attachmentData }) => { update('attachmentFileName', fileName); update('attachmentData', attachmentData) },
      onClear: () => { update('attachmentFileName', ''); update('attachmentData', '') },
    })
  }

  const buildPayload = () => {
    const base = { ...form, formType }
    return base
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formType || formType === 'stockInventory') return // Stock Inventory: view/edit only, no submit
    const ok = await submit(buildPayload())
    if (ok) {
      handleFormTypeChange(formType)
      setFormType('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const sectionTitleClass = "text-xs font-bold text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-2 mb-4 flex items-center gap-2 transition-colors duration-300"
  const labelClass = "block text-[9px] font-semibold text-[#5c574f] uppercase tracking-wider mb-1 transition-colors duration-200"
  const inputClass = "w-full min-h-[52px] px-4 py-3.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium leading-relaxed text-left focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c]"
  const inputClassSmall = "w-full min-h-[48px] px-3 py-3 bg-white border-2 border-[#e8e0d4] rounded-lg text-sm text-[#1e4d2b] leading-relaxed text-left focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 placeholder:text-[#8a857c]"

  return (
    <FormLayout title="Plant Nursery">
      <div className="w-full max-w-5xl mx-auto pb-6 xs:pb-10 px-3 xs:px-4 sm:px-5 min-w-0">

        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20">
                <iconify-icon icon="mdi:flower-tulip-outline" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight drop-shadow-sm">Plant Nursery</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Select form type: Accreditation, Monitoring, or Stock Inventory. Connected to View Records.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- FORM TYPE SELECTOR --- */}
          <div className="plant-material-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:form-select" width="18" class="opacity-90"></iconify-icon>
              Select Form Type
            </h3>
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4">
              {FORM_TYPES.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 p-3 xs:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex-1 min-w-0 xs:min-w-[200px] sm:min-w-[260px] ${formType === value ? 'border-[#1e4d2b] bg-[#f0f5ee] text-[#1e4d2b] shadow-md ring-2 ring-[#1e4d2b]/30' : 'border-[#e8e0d4] hover:border-[#1e4d2b]/40 hover:bg-[#faf8f5] text-[#5c574f]'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formType === value ? 'border-[#1e4d2b]' : 'border-[#e8e0d4]'}`}>
                    {formType === value && <div className="w-2.5 h-2.5 bg-[#1e4d2b] rounded-full" />}
                  </div>
                  <input type="radio" name="formType" value={value} checked={formType === value} onChange={() => handleFormTypeChange(value)} className="hidden" />
                  <span className="font-semibold text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {formType && (
            <>
              {/* --- PLANT NURSERY ACCREDITATION FORM --- */}
              {formType === 'accreditation' && (
                <>
                  <div className="plant-material-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                    <h3 className={sectionTitleClass}>
                      <iconify-icon icon="mdi:certificate-outline" width="18" class="opacity-90"></iconify-icon>
                      Plant Nursery Accreditation Form
                    </h3>
                    <div className="space-y-6">
                      <h4 className="text-xs font-bold text-[#1e4d2b] uppercase tracking-wide">Applicant Information</h4>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Name of Applicant</label>
                          <input type="text" value={form.applicant} onChange={updateUpper('applicant')} className={`${inputClass} font-semibold`} placeholder="FULL NAME" required />
                        </div>
                        <div>
                          <label className={labelClass}>Name of Nursery</label>
                          <input type="text" value={form.nameOfNursery} onChange={updateUpper('nameOfNursery')} className={inputClass} placeholder="NURSERY NAME" />
                        </div>
                        <div>
                          <label className={labelClass}>Area of Nursery</label>
                          <input type="text" value={form.areaOfNursery} onChange={updateUpper('areaOfNursery')} className={inputClass} placeholder="E.G. 1.5 HA" />
                        </div>
                        <div>
                          <label className={labelClass}>Semester</label>
                          <AppSelect value={form.semester} onChange={(v) => update('semester', v)} placeholder="Select semester..." options={SEMESTER_OPTIONS} aria-label="Semester" />
                        </div>
                        <div>
                          <label className={labelClass}>Province</label>
                          <AppSelect value={form.province} onChange={(v) => update('province', v)} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...PROVINCES.map((p) => ({ value: p, label: p }))]} aria-label="Province" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Location / Address</label>
                          <input type="text" value={form.location} onChange={updateUpper('location')} className={inputClass} placeholder="NURSERY LOCATION / COMPLETE ADDRESS" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Crops / Variety</label>
                          <input type="text" value={form.cropsVariety} onChange={updateUpper('cropsVariety')} className={inputClass} placeholder="E.G. MANGO, CACAO" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="plant-material-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                    <h3 className={sectionTitleClass}>
                      <iconify-icon icon="mdi:clipboard-text-clock-outline" width="18" class="opacity-90"></iconify-icon>
                      Application Process
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className={labelClass}>Submission of Application</label>
                        <input type="date" value={form.submissionOfApplicationForm} onChange={(e) => update('submissionOfApplicationForm', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Documentary Evaluation</label>
                        <input type="date" value={form.evaluationOfDocumentary} onChange={(e) => update('evaluationOfDocumentary', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <div className="bg-[#f0f5ee]/80 p-4 rounded-xl border-2 border-[#1e4d2b]/20 hover:border-[#1e4d2b]/35 grid sm:grid-cols-2 gap-5 mb-5 transition-all duration-400">
                      <div>
                        <label className={labelClass}>Payment Date</label>
                        <input type="date" value={form.paymentOfApplicationFee} onChange={(e) => update('paymentOfApplicationFee', e.target.value)} className={inputClassSmall} />
                      </div>
                      <div>
                        <label className={labelClass}>Amount Paid</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-[#1e4d2b] font-bold text-sm">₱</span>
                          <input type="text" value={form.amountOfFee} onChange={updateUpper('amountOfFee')} className={`${inputClassSmall} pl-8 font-bold text-right`} placeholder="0.00" />
                        </div>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Inspection of Nursery (Date)</label>
                        <input type="date" value={form.dateOfInspectionOfNursery} onChange={(e) => update('dateOfInspectionOfNursery', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Validated Result (Data)</label>
                        <input type="text" value={form.validatedResult} onChange={updateUpper('validatedResult')} className={inputClass} placeholder="PASSED / FOR COMPLIANCE" />
                      </div>
                      <div>
                        <label className={labelClass}>Endorsement of Application (Date)</label>
                        <input type="date" value={form.endorsementOfApplication} onChange={(e) => update('endorsementOfApplication', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* --- MONITORING OF ACCREDITED PLANT NURSERY FORM --- */}
              {formType === 'monitoring' && (
                <div className="plant-material-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                  <h3 className={sectionTitleClass}>
                    <iconify-icon icon="mdi:clipboard-check-outline" width="18" class="opacity-90"></iconify-icon>
                    Monitoring of Accredited Plant Nursery Form
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className={labelClass}>Semester</label><AppSelect value={form.semester} onChange={(v) => update('semester', v)} placeholder="Select semester..." options={SEMESTER_OPTIONS} aria-label="Semester" /></div>
                    <div><label className={labelClass}>Name of Nursery</label><input type="text" value={form.nameOfNursery} onChange={updateUpper('nameOfNursery')} className={inputClass} placeholder="NURSERY NAME" /></div>
                    <div><label className={labelClass}>Name of Operator</label><input type="text" value={form.nameOfOperator} onChange={updateUpper('nameOfOperator')} className={inputClass} placeholder="OPERATOR NAME" /></div>
                    <div><label className={labelClass}>Province</label><AppSelect value={form.province} onChange={(v) => update('province', v)} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...PROVINCES.map((p) => ({ value: p, label: p }))]} aria-label="Province" /></div>
                    <div className="sm:col-span-2"><label className={labelClass}>Location</label><input type="text" value={form.location} onChange={updateUpper('location')} className={inputClass} placeholder="LOCATION" /></div>
                    <div><label className={labelClass}>Accredited (Crops/Variety)</label><input type="text" value={form.accreditedCropsVariety} onChange={updateUpper('accreditedCropsVariety')} className={inputClass} placeholder="E.G. MANGO, CACAO" /></div>
                    <div><label className={labelClass}>Area of Nursery</label><input type="text" value={form.areaOfNursery} onChange={updateUpper('areaOfNursery')} className={inputClass} placeholder="E.G. 1.5 HA" /></div>
                    <div><label className={labelClass}>Status (Operational/Non-Operational)</label><AppSelect value={form.status} onChange={(v) => update('status', v)} placeholder="Select Status" options={[{ value: '', label: 'Select Status' }, ...MONITORING_STATUS_OPTIONS.map((o) => ({ value: o, label: o }))]} aria-label="Status" /></div>
                    <div><label className={labelClass}>Validity Date of Accreditation</label><input type="date" value={form.validityDateOfAccreditation} onChange={(e) => update('validityDateOfAccreditation', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Date of Monitoring</label><input type="date" value={form.dateOfMonitoring} onChange={(e) => update('dateOfMonitoring', e.target.value)} className={inputClass} /></div>
                    <div className="sm:col-span-2"><label className={labelClass}>Remarks</label><textarea value={form.remarks} onChange={(e) => update('remarks', e.target.value)} className={`${inputClass} min-h-[80px] resize-y normal-case text-left`} rows={2} placeholder="Remarks..." /></div>
                  </div>
                </div>
              )}

              {/* --- PLANT NURSERY STOCK INVENTORY (Table only - view & edit, no submit) --- */}
              {formType === 'stockInventory' && <StockInventoryTable />}

              {/* --- EVALUATION & REMARKS (accreditation & monitoring only) --- */}
              {(formType === 'accreditation' || formType === 'monitoring') && (
                <div className="plant-material-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                  <h3 className={sectionTitleClass}>
                    <iconify-icon icon="mdi:star-face" width="18" class="opacity-90"></iconify-icon>
                    Evaluation & Remarks
                  </h3>
                  <div className="space-y-6">
                    <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
                    <div>
                      <label className={labelClass}>Recommendation</label>
                      <textarea value={form.recommendation} onChange={(e) => update('recommendation', e.target.value)} className={`${inputClass} min-h-[100px] normal-case placeholder:normal-case text-left`} rows={3} placeholder="Enter any feedback or recommendations..." />
                    </div>
                    <div>
                      <label className={labelClass}>Attachments</label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 cursor-pointer group">
                          <span className="sr-only">Choose file</span>
                          <input type="file" onChange={handleAttachmentChange} className="block w-full text-sm text-[#5c574f] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1e4d2b]/10 file:text-[#1e4d2b] hover:file:bg-[#1e4d2b]/20 transition-all duration-300 border-2 border-dashed border-[#e8e0d4] rounded-xl group-hover:border-[#1e4d2b]/50 py-3 px-4" />
                        </label>
                        {form.attachmentFileName && (
                          <button type="button" onClick={() => { update('attachmentFileName', ''); update('attachmentData', '') }} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl hover:scale-110 active:scale-95 transition-all duration-300" title="Remove File">
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
                  </div>
                </div>
              )}
            </>
          )}

          {/* --- Form Submission Date (for year count) --- */}
          {formType && formType !== 'stockInventory' && (
            <div className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8">
              <div className="max-w-xs">
                <label className={labelClass}>Form Submission Date (for year count)</label>
                <input type="date" value={form.formSubmissionDate || ''} onChange={(e) => update('formSubmissionDate', e.target.value)} className={inputClass} aria-label="Form Submission Date" />
              </div>
            </div>
          )}

          {/* --- ACTION BAR (only for Accreditation & Monitoring, not when empty or Stock Inventory) --- */}
          {formType && formType !== 'stockInventory' && (
            <div className="pt-2">
              {message && (
                <div className={`mb-4 mx-auto max-w-2xl p-4 rounded-xl shadow-lg flex items-center gap-3 border-l-4 ${message.type === 'success' ? 'bg-[#1e4d2b] text-white border-[#153019]' : message.type === 'info' ? 'bg-blue-600 text-white border-blue-800' : 'bg-red-500 text-white border-red-700'}`}>
                  <iconify-icon icon={message.type === 'success' ? 'mdi:check-circle' : message.type === 'info' ? 'mdi:information' : 'mdi:alert-circle'} width="24"></iconify-icon>
                  <p className="font-medium">{message.text}</p>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || uploading || !formType}
                  className="w-full sm:w-auto min-h-[44px] px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] text-white rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#1e4d2b]/25 hover:shadow-xl hover:shadow-[#1e4d2b]/35 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] touch-manipulation transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <iconify-icon icon="mdi:loading" width="20" class="animate-spin"></iconify-icon>
                      Processing...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="mdi:content-save-check" width="22"></iconify-icon>
                      SUBMIT RECORD
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </FormLayout>
  )
}
