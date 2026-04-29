import { useState } from 'react'
import { 
  CalendarDays, 
  Store, 
  Tag, 
  User, 
  MapPin, 
  Search, 
  FileText, 
  ClipboardList,
  MessageSquare,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { handleFileAttachment } from '../../lib/handleFileAttachment'
import { PROVINCES } from '../../lib/regions'
import 'iconify-icon'

const SEMESTER_OPTIONS = [{ value: '', label: 'Select semester...' }, { value: '1st Semester', label: '1st Semester' }, { value: '2nd Semester', label: '2nd Semester' }]

/** Derive semester from date (Jan–Jun = 1st Semester, Jul–Dec = 2nd Semester). Returns '' if invalid. */
function semesterFromDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return ''
  const dt = new Date(dateStr)
  if (Number.isNaN(dt.getTime())) return ''
  const month = dt.getMonth() + 1
  return month <= 6 ? '1st Semester' : '2nd Semester'
}

const initialState = {
  requestLetterDate: '',
  semester: '',
  identifiedMarketOutlet: '',
  dateOfCommunicationLetter: '',
  nameOfProduct: [''],
  commodity: [''],
  certification: '',
  nameOfOwnerManager: '',
  province: '',
  location: '',
  dateOfSurveillance: '',
  dateOfRelease: '',
  remarks: '',
  attachmentFileName: '',
  attachmentData: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
  formSubmissionDate: '',
}


export default function OrganicPostMarketForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message, setMessage } = useFormSubmit('organicPostMarket')
  
  const update = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value }
      if (key === 'dateOfCommunicationLetter' && value) {
        const derived = semesterFromDate(value)
        if (derived) next.semester = derived
      }
      return next
    })
  }
  const updateUpper = (key) => (e) => update(key, (e.target.value || '').toUpperCase())

  const [uploading, setUploading] = useState(false)
  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) update('attachmentFileName', file.name)
    handleFileAttachment(file, {
      collectionName: 'organicPostMarket',
      setUploading,
      setMessage,
      onSuccess: ({ fileName, attachmentData }) => { update('attachmentFileName', fileName); update('attachmentData', attachmentData) },
      onClear: () => { update('attachmentFileName', ''); update('attachmentData', '') },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      nameOfProduct: Array.isArray(form.nameOfProduct) ? form.nameOfProduct.filter((s) => s != null && String(s).trim() !== '') : [form.nameOfProduct].filter(Boolean),
      commodity: Array.isArray(form.commodity) ? form.commodity.filter((s) => s != null && String(s).trim() !== '') : [form.commodity].filter(Boolean),
    }
    if (!payload.semester && payload.dateOfCommunicationLetter) {
      payload.semester = semesterFromDate(payload.dateOfCommunicationLetter)
    }
    const ok = await submit(payload)
    if (ok) {
      setForm(initialState)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const setProductItem = (index, val) => setForm((f) => ({ ...f, nameOfProduct: f.nameOfProduct.map((v, i) => (i === index ? val : v)) }))
  const addProduct = () => setForm((f) => ({ ...f, nameOfProduct: [...f.nameOfProduct, ''] }))
  const removeProduct = (index) => setForm((f) => ({ ...f, nameOfProduct: f.nameOfProduct.filter((_, i) => i !== index) }))
  const setCommodityItem = (index, val) => setForm((f) => ({ ...f, commodity: f.commodity.map((v, i) => (i === index ? val : v)) }))
  const addCommodity = () => setForm((f) => ({ ...f, commodity: [...f.commodity, ''] }))
  const removeCommodity = (index) => setForm((f) => ({ ...f, commodity: f.commodity.filter((_, i) => i !== index) }))

  // --- STYLING (app theme: green #1e4d2b, khaki #b8a066) ---
  const sectionTitleClass = "text-sm font-black text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-3 mb-5 flex items-center gap-2.5 transition-colors duration-300"
  const labelClass = "block text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-1.5 transition-colors duration-200"
  const inputClass = "w-full px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c] uppercase"
  const urlInputClass = "w-full px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 placeholder:text-[#8a857c] normal-case"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y normal-case placeholder:normal-case`
  
  return (
    <FormLayout title="Organic Product Post-Market Surveillance">
      <div className="w-full max-w-5xl mx-auto pb-10 px-3 xs:px-4 sm:px-5 min-w-0">
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20 shrink-0">
                <iconify-icon icon="mdi:store-marker-outline" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Post-Market Surveillance</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Organic product surveillance and market outlet monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Section 1: Request & Communication Timeline --- */}
        <div className="organic-post-market-section organic-post-market-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <CalendarDays className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Communication Timeline
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Date of Request Letter</label>
              <input 
                type="date" 
                value={form.requestLetterDate} 
                onChange={(e) => update('requestLetterDate', e.target.value)} 
                className={inputClass} 
                required 
              />
            </div>
            <div>
              <label className={labelClass}>Date of Communication Letter</label>
              <input 
                type="date" 
                value={form.dateOfCommunicationLetter} 
                onChange={(e) => update('dateOfCommunicationLetter', e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>Semester</label>
              <AppSelect value={form.semester} onChange={(v) => update('semester', v)} placeholder="Select semester..." options={SEMESTER_OPTIONS} aria-label="Semester" />
              <p className="text-[10px] text-[#5c7355] mt-1">Auto-filled from Date of Communication Letter (Jan–Jun = 1st Sem, Jul–Dec = 2nd Sem)</p>
            </div>
          </div>
        </div>

        {/* --- Section 2: Market & Product Details --- */}
        <div className="organic-post-market-section organic-post-market-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Store className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Market & Product Information
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-8">
              <label className={labelClass}>Identified Market Outlet / Establishment</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input 
                  type="text" 
                  value={form.identifiedMarketOutlet} 
                  onChange={updateUpper('identifiedMarketOutlet')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Name of Establishment" 
                  required 
                />
              </div>
            </div>

            {/* Owner - 4 Cols */}
            <div className="sm:col-span-4">
              <label className={labelClass}>Owner / Manager</label>
               <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input 
                  type="text" 
                  value={form.nameOfOwnerManager} 
                  onChange={updateUpper('nameOfOwnerManager')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Full Name" 
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Province</label>
              <AppSelect value={form.province} onChange={(v) => update('province', v)} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...PROVINCES.map((p) => ({ value: p, label: p }))]} aria-label="Province" />
            </div>
            <div className="sm:col-span-12">
              <label className={labelClass}>Location Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input 
                  type="text" 
                  value={form.location} 
                  onChange={updateUpper('location')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Complete Address of Market/Outlet" 
                />
              </div>
            </div>

            {/* Product Name - 6 Cols (multiple entries + Add) */}
            <div className="sm:col-span-6">
              <label className={labelClass}>Name of Product</label>
              <div className="space-y-2">
                {(Array.isArray(form.nameOfProduct) ? form.nameOfProduct : [form.nameOfProduct || '']).map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="relative group flex-1 min-w-0">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                      </div>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => setProductItem(i, (e.target.value || '').toUpperCase())}
                        className={`${inputClass} pl-10`}
                        placeholder="Product Brand/Name"
                      />
                    </div>
                    {(Array.isArray(form.nameOfProduct) ? form.nameOfProduct : []).length > 1 && (
                      <button type="button" onClick={() => removeProduct(i)} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl shrink-0" title="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addProduct} className="inline-flex items-center gap-2 px-3 py-2.5 border-2 border-dashed border-[#1e4d2b]/40 text-[#1e4d2b] rounded-xl font-bold text-sm hover:bg-[#1e4d2b]/10 transition-all">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </div>

            {/* Commodity - 3 Cols (multiple entries + Add) */}
            <div className="sm:col-span-3">
              <label className={labelClass}>Commodity</label>
              <div className="space-y-2">
                {(Array.isArray(form.commodity) ? form.commodity : [form.commodity || '']).map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => setCommodityItem(i, (e.target.value || '').toUpperCase())}
                      className={inputClass}
                      placeholder="e.g. Rice"
                    />
                    {(Array.isArray(form.commodity) ? form.commodity : []).length > 1 && (
                      <button type="button" onClick={() => removeCommodity(i)} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl shrink-0" title="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addCommodity} className="inline-flex items-center gap-2 px-3 py-2.5 border-2 border-dashed border-[#1e4d2b]/40 text-[#1e4d2b] rounded-xl font-bold text-sm hover:bg-[#1e4d2b]/10 transition-all">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </div>

            {/* Certification - 3 Cols */}
            <div className="sm:col-span-3">
              <label className={labelClass}>Certification</label>
              <input 
                type="text" 
                value={form.certification} 
                onChange={updateUpper('certification')} 
                className={inputClass} 
                placeholder="Cert. Body/No." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 3: Surveillance Findings --- */}
        <div className="organic-post-market-section organic-post-market-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Search className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Surveillance Findings
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="w-full sm:max-w-xs">
              <label className={labelClass}>Date of Surveillance</label>
              <input 
                type="date" 
                value={form.dateOfSurveillance} 
                onChange={(e) => update('dateOfSurveillance', e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div className="w-full sm:max-w-xs">
              <label className={labelClass}>Date of Release</label>
              <input 
                type="date" 
                value={form.dateOfRelease} 
                onChange={(e) => update('dateOfRelease', e.target.value)} 
                className={inputClass} 
              />
            </div>

            <div>
              <label className={labelClass}>Remarks / Observations</label>
              <textarea 
                value={form.remarks} 
                onChange={updateUpper('remarks')} 
                className={textAreaClass} 
                placeholder="Enter detailed observations during surveillance..." 
              />
            </div>

          </div>
        </div>

        {/* --- Section 4: Feedback & Recommendation --- */}
        <div className="organic-post-market-section organic-post-market-section-4 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <ClipboardList className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Feedback & Recommendations
          </h3>
          
          <div className="space-y-6">
            <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
            
            <div>
              <label className={labelClass}>Recommendation</label>
              <div className="relative group">
                 <div className="absolute top-3 left-3 pointer-events-none">
                  <MessageSquare className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <textarea 
                  value={form.recommendation} 
                  onChange={updateUpper('recommendation')} 
                  className={`${textAreaClass} pl-10`} 
                  rows="3" 
                  placeholder="Enter final recommendation regarding the product/market..." 
                />
              </div>
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
            <div>
              <label className={labelClass}>Form Submission Date (for year count)</label>
              <input type="date" value={form.formSubmissionDate} onChange={(e) => update('formSubmissionDate', e.target.value)} className={inputClass} aria-label="Form Submission Date" />
            </div>
          </div>
        </div>

        {/* --- Submit Section --- */}
        <div className="organic-post-market-section organic-post-market-section-5 pt-2 flex flex-col items-end gap-4">
          {message && (
            <div className={`animal-feed-message-enter w-full max-w-2xl p-4 rounded-xl shadow-lg flex items-center gap-3 border-l-4 ${
              message.type === 'success' 
                ? 'bg-[#1e4d2b] text-white border-[#153019]'
                : message.type === 'info'
                ? 'bg-blue-600 text-white border-blue-800'
                : 'bg-red-500 text-white border-red-700'
            }`}>
              <iconify-icon icon={message.type === 'success' ? 'mdi:check-circle' : message.type === 'info' ? 'mdi:information' : 'mdi:alert-circle'} width="24"></iconify-icon>
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || uploading} 
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
                SUBMIT SURVEILLANCE REPORT
              </>
            )}
          </button>
        </div>

      </form>
      </div>
    </FormLayout>
  )
}