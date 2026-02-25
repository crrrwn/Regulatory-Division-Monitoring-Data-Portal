import { useState } from 'react'
import { 
  Map, 
  User, 
  FileText, 
  Ruler, 
  MapPin, 
  CalendarClock, 
  ClipboardCheck, 
  FileCheck, 
  MessageSquare,
  Save,
  CheckCircle2,
  AlertCircle,
  Hash
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { PROVINCES } from '../../lib/regions'
import 'iconify-icon'

const initialState = {
  controlNo: '',
  nameOfApplicant: '',
  purposeOfApplication: '',
  sizeOfArea: '',
  province: '',
  location: '',
  dateOfRequest: '',
  dateReceivedAndEvaluated: '',
  dateOfReplyToRequest: '',
  dateReceivedByApplicant: '',
  fieldInvestigation: '',
  dateOfEndorsement: '',
  issuanceOfCertificate: '',
  remarks: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function LandUseMatterForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('landUseMatter')
  
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

  // --- STYLING (app theme: green #1e4d2b, khaki #b8a066) ---
  const sectionTitleClass = "text-sm font-black text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-3 mb-5 flex items-center gap-2.5 transition-colors duration-300"
  const labelClass = "block text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-1.5 transition-colors duration-200"
  const inputClass = "w-full min-w-0 px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c] uppercase"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y normal-case placeholder:normal-case`

  return (
    <FormLayout title="Land Use Matter (Reclassification)">
      <div className="max-w-5xl mx-auto pb-10 min-w-0 w-full">
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20 shrink-0">
                <iconify-icon icon="mdi:terrain" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Land Use Reclassification</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Application and processing for land use matter reclassification.
                </p>
              </div>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Section 1: Application Profile --- */}
        <div className="land-use-matter-section land-use-matter-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <FileText className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Application Profile
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-4">
              <label className={labelClass}>Control No.</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.controlNo} onChange={updateUpper('controlNo')} placeholder="Ex. 2023-001" required className={`${inputClass} pl-10`} />
              </div>
            </div>

            <div className="sm:col-span-8">
              <label className={labelClass}>Name of Applicant</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.nameOfApplicant} onChange={updateUpper('nameOfApplicant')} placeholder="Full Name of Applicant" className={`${inputClass} pl-10`} />
              </div>
            </div>

            <div className="sm:col-span-12">
              <label className={labelClass}>Purpose of Application</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClipboardCheck className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.purposeOfApplication} onChange={updateUpper('purposeOfApplication')} placeholder="State the purpose (e.g., Residential, Commercial)" className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2: Land Specifications --- */}
        <div className="land-use-matter-section land-use-matter-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Map className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Land Specifications
          </h3>
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-4">
              <label className={labelClass}>Size of Area (Has.)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.sizeOfArea} onChange={updateUpper('sizeOfArea')} placeholder="0.00" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div className="sm:col-span-8">
              <label className={labelClass}>Province</label>
              <AppSelect value={form.province} onChange={(v) => update('province', v)} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...PROVINCES.map((p) => ({ value: p, label: p }))]} aria-label="Province" />
            </div>
            <div className="sm:col-span-6">
              <label className={labelClass}>Location</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.location} onChange={updateUpper('location')} placeholder="Barangay, Municipality" className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 3: Processing Timeline --- */}
        <div className="land-use-matter-section land-use-matter-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <CalendarClock className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Processing Timeline
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-[#1e4d2b] uppercase tracking-wider border-l-4 border-[#1e4d2b]/30 pl-2">Incoming</h4>
              <div>
                <label className={labelClass}>Date of Request</label>
                <input type="date" value={form.dateOfRequest} onChange={(e) => update('dateOfRequest', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date Received & Evaluated</label>
                <input type="date" value={form.dateReceivedAndEvaluated} onChange={(e) => update('dateReceivedAndEvaluated', e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold text-[#1e4d2b] uppercase tracking-wider border-l-4 border-[#b8a066]/40 pl-2">Outgoing / Action</h4>
              <div>
                <label className={labelClass}>Date of Reply to Request</label>
                <input type="date" value={form.dateOfReplyToRequest} onChange={(e) => update('dateOfReplyToRequest', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date Received by Applicant</label>
                <input type="date" value={form.dateReceivedByApplicant} onChange={(e) => update('dateReceivedByApplicant', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 4: Investigation & Final Output --- */}
        <div className="land-use-matter-section land-use-matter-section-4 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <FileCheck className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Investigation & Outcome
          </h3>

          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Field Investigation Details</label>
                <input type="text" value={form.fieldInvestigation} onChange={updateUpper('fieldInvestigation')} className={inputClass} placeholder="Findings summary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date of Endorsement</label>
                  <input type="date" value={form.dateOfEndorsement} onChange={(e) => update('dateOfEndorsement', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cert. Issuance Date</label>
                  <input type="date" value={form.issuanceOfCertificate} onChange={(e) => update('issuanceOfCertificate', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Remarks</label>
              <textarea value={form.remarks} onChange={updateUpper('remarks')} className={textAreaClass} placeholder="Additional notes or remarks..." />
            </div>
          </div>
        </div>

        {/* --- Section 5: Feedback & Recommendation --- */}
        <div className="land-use-matter-section land-use-matter-section-5 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <MessageSquare className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Evaluation & Recommendation
          </h3>
          <div className="space-y-6">
            <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
            
            <div>
              <label className={labelClass}>Recommendation</label>
              <textarea value={form.recommendation} onChange={updateUpper('recommendation')} className={textAreaClass} placeholder="Final recommendations..." />
            </div>
          </div>
        </div>

        {/* --- Submit Section --- */}
        <div className="land-use-matter-section land-use-matter-section-6 pt-2 flex flex-col items-end gap-4">
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
                SUBMIT LAND USE RECORD
              </>
            )}
          </button>
        </div>

      </form>
      </div>
    </FormLayout>
  )
}