import { useState } from 'react'
import { 
  FileText, 
  Map, 
  User, 
  Calendar, 
  Send, 
  Search, 
  FileCheck, 
  Stamp, 
  ClipboardList, 
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Ruler
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import 'iconify-icon'

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied']

const initialState = {
  explorationPermitApplicationNo: '',
  nameOfApplicant: '',
  dateReceived: '',
  location: '',
  area: '',
  dateOfReplyToRequest: '',
  endorsementToBSWM: '',
  endorsementToMGB: '',
  fieldValidation: '',
  remarks: '',
  rescheduledDate: '',
  fieldValidationReport: '',
  issuanceOfCertificateAndEndorsementToMGB: '',
  status: '',
  findings: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function SafdzValidationForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('safdzValidation')
  
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const updateUpper = (key) => (e) => update(key, (e.target.value || '').toUpperCase())

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) {
      setForm(initialState)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // --- Theme: green #1e4d2b, khaki #b8a066, neutral #5c574f, border #e8e0d4 ---
  const sectionTitleClass = "text-sm font-black text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-3 mb-5 flex items-center gap-2.5 transition-colors duration-300"
  const labelClass = "block text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-1.5 transition-colors duration-200"
  const inputClass = "w-full min-w-0 px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c] uppercase"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y normal-case placeholder:normal-case`

  return (
    <FormLayout title="SAFDZ Validation">
      <div className="max-w-5xl mx-auto pb-10 min-w-0 w-full">
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20 shrink-0">
                <iconify-icon icon="mdi:map-marker-check" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">SAFDZ Validation</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Strategic Agricultural and Fisheries Development Zone validation and endorsement.
                </p>
              </div>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* --- Section 1: Application Details --- */}
        <div className="safdz-validation-section safdz-validation-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <FileText className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Application Overview
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Exploration Permit App. No.</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileCheck className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.explorationPermitApplicationNo} onChange={updateUpper('explorationPermitApplicationNo')} placeholder="Permit Number" required className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Name of Applicant</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.nameOfApplicant} onChange={updateUpper('nameOfApplicant')} placeholder="Applicant Full Name" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.location} onChange={updateUpper('location')} placeholder="Site Location" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Area (Hectares)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.area} onChange={updateUpper('area')} placeholder="e.g. 5.00" className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2: Endorsements & Timeline --- */}
        <div className="safdz-validation-section safdz-validation-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Send className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Timeline & Endorsements
          </h3>
          
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Date Received</label>
              <input type="date" value={form.dateReceived} onChange={(e) => update('dateReceived', e.target.value)} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Date Replied</label>
              <input type="date" value={form.dateOfReplyToRequest} onChange={(e) => update('dateOfReplyToRequest', e.target.value)} className={inputClass} />
            </div>
            
            <div className="sm:col-span-4 h-px bg-[#e8e0d4] my-2"></div>
            
            <div className="sm:col-span-2">
              <label className={labelClass}>Endorsement to BSWM</label>
              <input type="date" value={form.endorsementToBSWM} onChange={(e) => update('endorsementToBSWM', e.target.value)} className={inputClass} />
              <p className="text-[10px] text-[#5c574f]/80 mt-1">Bureau of Soils and Water Management</p>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Endorsement to MGB</label>
              <input type="date" value={form.endorsementToMGB} onChange={(e) => update('endorsementToMGB', e.target.value)} className={inputClass} />
              <p className="text-[10px] text-[#5c574f]/80 mt-1">Mines and Geosciences Bureau</p>
            </div>
          </div>
        </div>

        {/* --- Section 3: Field Validation --- */}
        <div className="safdz-validation-section safdz-validation-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Search className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Field Validation & Findings
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className={labelClass}>Field Validation Activities</label>
              <input 
                type="text" 
                value={form.fieldValidation} 
                onChange={updateUpper('fieldValidation')} 
                className={inputClass} 
                placeholder="Describe validation activities..." 
              />
            </div>

            <div>
               <label className={labelClass}>Rescheduled Date (If any)</label>
               <div className="relative">
                 <input type="date" value={form.rescheduledDate} onChange={(e) => update('rescheduledDate', e.target.value)} className={inputClass} />
               </div>
            </div>
            
             <div>
               <label className={labelClass}>Validation Report Ref.</label>
               <input 
                 type="text" 
                 value={form.fieldValidationReport} 
                 onChange={updateUpper('fieldValidationReport')} 
                 className={inputClass} 
                 placeholder="Report No. / Reference"
               />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Findings</label>
              <textarea 
                value={form.findings} 
                onChange={updateUpper('findings')} 
                className={textAreaClass} 
                placeholder="Enter validation findings here..." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 4: Final Disposition --- */}
        <div className="safdz-validation-section safdz-validation-section-4 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Stamp className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Issuance & Status
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Issuance of Certificate & Endorsement (MGB)</label>
              <input type="date" value={form.issuanceOfCertificateAndEndorsementToMGB} onChange={(e) => update('issuanceOfCertificateAndEndorsementToMGB', e.target.value)} className={inputClass} />
            </div>
            
            <div>
              <label className={labelClass}>Current Status</label>
              <AppSelect value={form.status} onChange={(v) => update('status', v)} placeholder="Select Application Status" options={[{ value: '', label: 'Select Application Status' }, ...STATUS_OPTIONS.map((o) => ({ value: o, label: o }))]} aria-label="Status" />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>General Remarks</label>
              <textarea 
                value={form.remarks} 
                onChange={updateUpper('remarks')} 
                className={`${inputClass} min-h-[80px]`} 
                rows="2" 
                placeholder="Additional remarks..." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 5: Ratings & Recommendation --- */}
        <div className="safdz-validation-section safdz-validation-section-5 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <ClipboardList className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Feedback & Recommendation
          </h3>
          
          <div className="space-y-6">
            <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
            
            <div>
              <label className={labelClass}>Recommendation</label>
              <textarea 
                value={form.recommendation} 
                onChange={updateUpper('recommendation')} 
                className={textAreaClass} 
                placeholder="Final recommendation based on validation..." 
              />
            </div>
          </div>
        </div>

        {/* --- Submit Section --- */}
        <div className="safdz-validation-section safdz-validation-section-6 pt-2 flex flex-col items-end gap-4">
          {message && (
            <div className={`animal-feed-message-enter w-full max-w-2xl p-4 rounded-xl shadow-lg flex items-center gap-3 border-l-4 ${
              message.type === 'success' 
                ? 'bg-[#1e4d2b] text-white border-[#153019]' 
                : 'bg-red-500 text-white border-red-700'
            }`}>
              <iconify-icon icon={message.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} width="24"></iconify-icon>
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] text-white rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#1e4d2b]/25 hover:shadow-xl hover:shadow-[#1e4d2b]/35 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <iconify-icon icon="mdi:loading" width="20" class="animate-spin"></iconify-icon>
                Processing...
              </>
            ) : (
              <>
                <iconify-icon icon="mdi:content-save-check" width="22"></iconify-icon>
                SUBMIT VALIDATION
              </>
            )}
          </button>
        </div>

      </form>
      </div>
    </FormLayout>
  )
}