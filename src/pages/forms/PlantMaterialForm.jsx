import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import 'iconify-icon'

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied', 'Expired']

const initialState = {
  applicant: '',
  operator: '',
  location: '',
  cropsVariety: '',
  submissionOfApplicationForm: '',
  evaluationOfDocumentary: '',
  paymentOfApplicationFee: '',
  amountOfFee: '',
  dateOfInspectionAndEvaluation: '',
  approvedValidatedResult: '',
  endorsementToBPI: '',
  dateOfInspection1stSem: '',
  dateOfInspection2ndSem: '',
  status: '',
  validity: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function PlantMaterialForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('plantMaterial')
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
  const inputClassSmall = "w-full px-3 py-2 bg-white border-2 border-[#e8e0d4] rounded-lg text-sm text-[#1e4d2b] focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 placeholder:text-[#8a857c]"

  return (
    <FormLayout title="Nursery Accreditation">
      <div className="max-w-4xl mx-auto pb-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20">
                <iconify-icon icon="mdi:flower-tulip-outline" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Plant Material & Nursery</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Accreditation form for plant nurseries and material distribution.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- SECTION 1: GENERAL INFO --- */}
          <div className="plant-material-section plant-material-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:account-details-outline" width="18" class="opacity-90"></iconify-icon>
              Applicant Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Name of Applicant</label>
                <input type="text" value={form.applicant} onChange={updateUpper('applicant')} className={`${inputClass} font-semibold`} placeholder="FULL NAME" required />
              </div>
              <div>
                <label className={labelClass}>Name of Operator</label>
                <input type="text" value={form.operator} onChange={updateUpper('operator')} className={inputClass} placeholder="OPERATOR NAME" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
               <div>
                 <label className={labelClass}>Location / Address</label>
                 <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300">
                       <iconify-icon icon="mdi:map-marker-outline" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.location} onChange={updateUpper('location')} className={`${inputClass} pl-10`} placeholder="NURSERY LOCATION" />
                 </div>
               </div>
               <div>
                 <label className={labelClass}>Crops / Variety</label>
                 <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300">
                       <iconify-icon icon="mdi:sprout-outline" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.cropsVariety} onChange={updateUpper('cropsVariety')} className={`${inputClass} pl-10`} placeholder="E.G. MANGO, CACAO" />
                 </div>
               </div>
            </div>
          </div>

          {/* --- SECTION 2: PROCESS TIMELINE --- */}
          <div className="plant-material-section plant-material-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
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
            
            <div className="bg-[#f0f5ee]/80 p-4 rounded-xl border-2 border-[#1e4d2b]/20 hover:border-[#1e4d2b]/35 grid sm:grid-cols-2 gap-5 mb-5 transition-all duration-400 ease-[cubic-bezier(0.33,1,0.68,1)]">
               <div>
                 <label className={labelClass}>Payment Date</label>
                 <input type="date" value={form.paymentOfApplicationFee} onChange={(e) => update('paymentOfApplicationFee', e.target.value)} className={inputClassSmall} />
               </div>
               <div>
                 <label className={labelClass}>Amount Paid</label>
                 <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#1e4d2b] font-bold text-sm">₱</span>
                    <input type="text" value={form.amountOfFee} onChange={updateUpper('amountOfFee')} className={`${inputClassSmall} pl-8 font-bold`} placeholder="0.00" />
                 </div>
               </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
               <div>
                 <label className={labelClass}>BPI Endorsement Date</label>
                 <input type="date" value={form.endorsementToBPI} onChange={(e) => update('endorsementToBPI', e.target.value)} className={inputClass} />
               </div>
            </div>
          </div>

          {/* --- SECTION 3: INSPECTION & MONITORING --- */}
          <div className="plant-material-section plant-material-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:eye-check-outline" width="18" class="opacity-90"></iconify-icon>
              Inspection & Monitoring
            </h3>
            <div className="space-y-5">
               <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Initial Inspection Date</label>
                    <input type="date" value={form.dateOfInspectionAndEvaluation} onChange={(e) => update('dateOfInspectionAndEvaluation', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Validated Result / Remarks</label>
                    <input type="text" value={form.approvedValidatedResult} onChange={updateUpper('approvedValidatedResult')} className={inputClass} placeholder="PASSED / FOR COMPLIANCE" />
                  </div>
               </div>

               <div className="grid sm:grid-cols-2 gap-5 pt-2">
                  <div className="bg-[#f0f5ee]/80 p-3 rounded-xl border-2 border-[#1e4d2b]/20 hover:border-[#1e4d2b]/40 transition-all duration-400">
                     <label className={labelClass}>1st Semester Monitoring</label>
                     <input type="date" value={form.dateOfInspection1stSem} onChange={(e) => update('dateOfInspection1stSem', e.target.value)} className={inputClassSmall} />
                  </div>
                  <div className="bg-[#faf6f0]/80 p-3 rounded-xl border-2 border-[#b8a066]/25 hover:border-[#b8a066]/50 transition-all duration-400">
                     <label className={labelClass}>2nd Semester Monitoring</label>
                     <input type="date" value={form.dateOfInspection2ndSem} onChange={(e) => update('dateOfInspection2ndSem', e.target.value)} className={inputClassSmall} />
                  </div>
               </div>
            </div>
          </div>

          {/* --- SECTION 4: STATUS --- */}
          <div className="plant-material-section plant-material-section-4 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
             <div className="grid sm:grid-cols-2 gap-5">
                <div>
                   <label className={labelClass}>Accreditation Status</label>
                   <div className="relative">
                      <select value={form.status} onChange={updateUpper('status')} className={`${inputClass} appearance-none cursor-pointer pr-10 font-bold ${form.status === 'APPROVED' ? 'text-[#1e4d2b] bg-[#f0f5ee] border-[#1e4d2b]/30' : ''}`}>
                        <option value="">Select Status</option>
                        {STATUS_OPTIONS.map((o) => <option key={o} value={o.toUpperCase()}>{o}</option>)}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#5c574f]">
                         <iconify-icon icon="mdi:chevron-down" width="20"></iconify-icon>
                      </div>
                   </div>
                </div>
                <div>
                   <label className={labelClass}>Validity Date</label>
                   <input type="date" value={form.validity} onChange={(e) => update('validity', e.target.value)} className={inputClass} />
                </div>
             </div>
          </div>

          {/* --- SECTION 5: RATINGS TABLE --- */}
          <div className="plant-material-section plant-material-section-5 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:star-face" width="18" class="opacity-90"></iconify-icon>
              Customer Satisfaction Feedback
            </h3>
            
            <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />

            <div className="mt-6">
               <label className={labelClass}>Recommendation / Remarks</label>
               <textarea 
                 value={form.recommendation} 
                 onChange={updateUpper('recommendation')} 
                 className={`${inputClass} min-h-[100px] normal-case placeholder:normal-case`} 
                 rows="3" 
                 placeholder="Enter any feedback or recommendations..." 
               />
            </div>
          </div>

          {/* --- ACTION BAR --- */}
          <div className="plant-material-section plant-material-section-6 pt-2">
             {message && (
                <div className={`animal-feed-message-enter mb-4 mx-auto max-w-2xl p-4 rounded-xl shadow-lg flex items-center gap-3 border-l-4 ${message.type === 'success' ? 'bg-[#1e4d2b] text-white border-[#153019]' : 'bg-red-500 text-white border-red-700'}`}>
                  <iconify-icon icon={message.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} width="24"></iconify-icon>
                  <p className="font-medium">{message.text}</p>
                </div>
             )}

             <div className="flex justify-end">
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
                      SUBMIT RECORD
                    </>
                  )}
                </button>
             </div>
          </div>

        </form>
      </div>
    </FormLayout>
  )
}