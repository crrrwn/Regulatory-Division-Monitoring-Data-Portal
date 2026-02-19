import { useState } from 'react'
import { 
  Calendar, 
  User, 
  MapPin, 
  Ruler, 
  Sprout, 
  FileText, 
  ClipboardCheck, 
  Award,
  MessageSquare
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import 'iconify-icon'

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied', 'Certified']

const initialState = {
  dateOfRequest: '',
  nameOfApplicant: '',
  location: '',
  area: '',
  crop: '',
  dateOfPreAssessment: '',
  remarks: '',
  dateOfEndorsementToBPI: '',
  dateOfFinalInspection: '',
  status: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function GoodAgriPracticesForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('goodAgriPractices')

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
  const inputClass = "w-full px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c] uppercase"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y normal-case placeholder:normal-case`

  return (
    <FormLayout title="Good Agricultural Practices (GAP) Unit">
      <div className="max-w-4xl mx-auto pb-10">
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20 shrink-0">
                <iconify-icon icon="mdi:leaf" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">GAP Certification</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Good Agricultural Practices certification and assessment.
                </p>
              </div>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Section 1: Applicant Information --- */}
        <div className="good-agri-section good-agri-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <User className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Applicant Details
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-4">
              <label className={labelClass}>Date of Request</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={form.dateOfRequest} 
                  onChange={(e) => update('dateOfRequest', e.target.value)} 
                  className={inputClass} 
                  required 
                />
              </div>
            </div>

            <div className="sm:col-span-8">
              <label className={labelClass}>Name of Applicant</label>
              <input 
                type="text" 
                value={form.nameOfApplicant} 
                onChange={updateUpper('nameOfApplicant')} 
                className={inputClass} 
                placeholder="Full Name of Applicant" 
              />
            </div>

            <div className="sm:col-span-12">
              <label className={labelClass}>Farm Location</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input 
                  type="text" 
                  value={form.location} 
                  onChange={updateUpper('location')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Complete Address of the Farm" 
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Area (Hectares)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input 
                  type="text" 
                  value={form.area} 
                  onChange={updateUpper('area')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="e.g. 5.00" 
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Crop / Commodity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sprout className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input 
                  type="text" 
                  value={form.crop} 
                  onChange={updateUpper('crop')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Type of Crop" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2: Assessment Timeline --- */}
        <div className="good-agri-section good-agri-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Calendar className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Inspection Timeline
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Pre-assessment Date</label>
              <input 
                type="date" 
                value={form.dateOfPreAssessment} 
                onChange={(e) => update('dateOfPreAssessment', e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>Endorsement to BPI</label>
              <input 
                type="date" 
                value={form.dateOfEndorsementToBPI} 
                onChange={(e) => update('dateOfEndorsementToBPI', e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>Final Inspection</label>
              <input 
                type="date" 
                value={form.dateOfFinalInspection} 
                onChange={(e) => update('dateOfFinalInspection', e.target.value)} 
                className={inputClass} 
              />
            </div>
          </div>
        </div>

        {/* --- Section 3: Status & Outcome --- */}
        <div className="good-agri-section good-agri-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <ClipboardCheck className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Assessment Outcome
          </h3>
          
          <div className="grid gap-6">
             <div className="w-full sm:max-w-md">
              <label className={labelClass}>Current Status</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Award className={`h-4 w-4 transition-colors duration-300 ${form.status === 'APPROVED' || form.status === 'CERTIFIED' ? 'text-[#1e4d2b]' : form.status === 'DENIED' ? 'text-red-500' : 'text-[#5c574f]'}`} />
                 </div>
                <select 
                  value={form.status} 
                  onChange={updateUpper('status')} 
                  className={`${inputClass} pl-10 appearance-none cursor-pointer pr-10 font-bold ${
                    form.status === 'APPROVED' || form.status === 'CERTIFIED' ? 'text-[#1e4d2b] bg-[#f0f5ee] border-[#1e4d2b]/30' :
                    form.status === 'DENIED' ? 'text-red-600 bg-red-50 border-red-200' : ''
                  }`}
                >
                  <option value="">Select Application Status</option>
                  {STATUS_OPTIONS.map((o) => <option key={o} value={o.toUpperCase()}>{o}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#5c574f]">
                  <iconify-icon icon="mdi:chevron-down" width="20"></iconify-icon>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Remarks</label>
              <textarea 
                value={form.remarks} 
                onChange={updateUpper('remarks')} 
                className={textAreaClass} 
                placeholder="Enter specific remarks or observations..." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 4: Customer Feedback --- */}
        <div className="good-agri-section good-agri-section-4 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <MessageSquare className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Customer Satisfaction
          </h3>
          <div className="mt-2">
            <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
          </div>
          <div className="mt-6">
            <label className={labelClass}>Recommendation / Remarks</label>
            <textarea 
              value={form.recommendation} 
              onChange={updateUpper('recommendation')} 
              className={textAreaClass} 
              placeholder="Enter final recommendation..." 
            />
          </div>
        </div>

        {/* --- Submit Section --- */}
        <div className="good-agri-section good-agri-section-5 pt-2 flex flex-col items-end gap-4">
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
                SUBMIT GAP RECORD
              </>
            )}
          </button>
        </div>

      </form>
      </div>
    </FormLayout>
  )
}