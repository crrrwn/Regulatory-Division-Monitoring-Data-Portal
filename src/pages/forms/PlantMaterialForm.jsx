import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import 'iconify-icon'

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied', 'Expired']

const RATING_OPTIONS = [
  { value: '1', label: 'Poor (1)' },
  { value: '2', label: 'Fair (2)' },
  { value: '3', label: 'Satisfied (3)' },
  { value: '4', label: 'Very Satisfied (4)' },
  { value: '5', label: 'Excellent (5)' },
]

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

  // --- STYLING CLASSES ---
  const sectionTitleClass = "text-sm font-bold text-emerald-800 uppercase tracking-wide border-b border-emerald-100 pb-3 mb-5 flex items-center gap-2"
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1"
  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 uppercase"
  const cardClass = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 hover:shadow-md transition-shadow duration-300"

  return (
    <FormLayout title="Nursery Accreditation">
      <div className="max-w-4xl mx-auto pb-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <iconify-icon icon="mdi:flower-tulip-outline" width="24"></iconify-icon>
             </span>
             Plant Material & Nursery
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-1">
            Accreditation form for plant nurseries and material distribution.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* --- SECTION 1: GENERAL INFO --- */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:account-details-outline" width="18"></iconify-icon>
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
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                       <iconify-icon icon="mdi:map-marker-outline" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.location} onChange={updateUpper('location')} className={`${inputClass} pl-10`} placeholder="NURSERY LOCATION" />
                 </div>
               </div>
               <div>
                 <label className={labelClass}>Crops / Variety</label>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                       <iconify-icon icon="mdi:sprout-outline" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.cropsVariety} onChange={updateUpper('cropsVariety')} className={`${inputClass} pl-10`} placeholder="E.G. MANGO, CACAO" />
                 </div>
               </div>
            </div>
          </div>

          {/* --- SECTION 2: PROCESS TIMELINE --- */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:clipboard-text-clock-outline" width="18"></iconify-icon>
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
            
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 grid sm:grid-cols-2 gap-5 mb-5">
               <div>
                 <label className={labelClass}>Payment Date</label>
                 <input type="date" value={form.paymentOfApplicationFee} onChange={(e) => update('paymentOfApplicationFee', e.target.value)} className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
               </div>
               <div>
                 <label className={labelClass}>Amount Paid</label>
                 <div className="relative">
                    <span className="absolute left-3 top-2.5 text-emerald-700 font-bold">₱</span>
                    <input type="text" value={form.amountOfFee} onChange={updateUpper('amountOfFee')} className="w-full pl-8 pr-4 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-emerald-800" placeholder="0.00" />
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
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:eye-check-outline" width="18"></iconify-icon>
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
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <label className={labelClass}>1st Semester Monitoring</label>
                     <input type="date" value={form.dateOfInspection1stSem} onChange={(e) => update('dateOfInspection1stSem', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <label className={labelClass}>2nd Semester Monitoring</label>
                     <input type="date" value={form.dateOfInspection2ndSem} onChange={(e) => update('dateOfInspection2ndSem', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm" />
                  </div>
               </div>
            </div>
          </div>

          {/* --- SECTION 4: STATUS --- */}
          <div className={cardClass}>
             <div className="grid sm:grid-cols-2 gap-5">
                <div>
                   <label className={labelClass}>Accreditation Status</label>
                   <div className="relative">
                      <select value={form.status} onChange={updateUpper('status')} className={`${inputClass} appearance-none cursor-pointer font-bold ${form.status === 'APPROVED' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'}`}>
                        <option value="">Select Status</option>
                        {STATUS_OPTIONS.map((o) => <option key={o} value={o.toUpperCase()}>{o}</option>)}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                         <iconify-icon icon="mdi:chevron-down"></iconify-icon>
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
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:star-face" width="18"></iconify-icon>
              Customer Satisfaction Feedback
            </h3>
            
            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 border-b border-emerald-100">
                      <th className="text-left py-4 px-4 font-bold text-emerald-800 uppercase text-xs">Particulars</th>
                      <th className="text-center py-4 px-2 w-48 font-bold text-emerald-800 uppercase text-xs">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    
                    {/* Row 1 */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">1. Quantity of Goods/Services Provided</td>
                      <td className="py-2 px-2">
                        <select value={form.ratingQuantity} onChange={(e) => update('ratingQuantity', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-emerald-500 outline-none">
                          <option value="">Select...</option>
                          {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">2. Services Rendered by Personnel</td>
                      <td className="py-2 px-2">
                        <select value={form.ratingServicesPersonnel} onChange={(e) => update('ratingServicesPersonnel', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-emerald-500 outline-none">
                          <option value="">Select...</option>
                          {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                    </tr>

                    {/* Row 2.1 */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 pl-8 text-slate-600 italic">2.1 Relevance of training</td>
                      <td className="py-2 px-2">
                        <select value={form.ratingTraining} onChange={(e) => update('ratingTraining', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-emerald-500 outline-none">
                          <option value="">Select...</option>
                          {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                    </tr>

                    {/* Row 2.2 */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 pl-8 text-slate-600 italic">2.2 Attitude (Courteousness)</td>
                      <td className="py-2 px-2">
                        <select value={form.ratingAttitude} onChange={(e) => update('ratingAttitude', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-emerald-500 outline-none">
                          <option value="">Select...</option>
                          {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                    </tr>

                    {/* Row 2.3 */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 pl-8 text-slate-600 italic">2.3 Promptness of Service</td>
                      <td className="py-2 px-2">
                        <select value={form.ratingPromptness} onChange={(e) => update('ratingPromptness', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-emerald-500 outline-none">
                          <option value="">Select...</option>
                          {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
               <label className={labelClass}>Recommendation / Remarks</label>
               <textarea 
                 value={form.recommendation} 
                 onChange={updateUpper('recommendation')} 
                 className={`${inputClass} min-h-[100px] normal-case`} 
                 rows="3" 
                 placeholder="Enter any feedback or recommendations..." 
               />
            </div>
          </div>

          {/* --- ACTION BAR --- */}
          <div className="sticky bottom-4 z-10">
             {message && (
                <div className={`mb-4 mx-auto max-w-2xl p-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up border-l-4 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-700'}`}>
                  <iconify-icon icon={message.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} width="24"></iconify-icon>
                  <p className="font-bold text-sm">{message.text}</p>
                </div>
             )}

             <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 hover:shadow-emerald-500/30 transition-all font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-transparent"
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