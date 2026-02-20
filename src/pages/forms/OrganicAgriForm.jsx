import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import 'iconify-icon'

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied', 'Certified']

const RATING_OPTIONS = [
  { value: '1', label: 'Poor (1)' },
  { value: '2', label: 'Fair (2)' },
  { value: '3', label: 'Satisfied (3)' },
  { value: '4', label: 'Very Satisfied (4)' },
  { value: '5', label: 'Excellent (5)' },
]

const initialState = {
  application: '',
  nameOfGroup: '',
  nameOfApplicant: '',
  location: '',
  area: '',
  dateOfEvaluation: '',
  remarks: '',
  dateOfEndorsement: '',
  finalInspection: '',
  status: '',
  issuanceOfCertificate: '',
  finalRemarks: '',
  linkFile: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function OrganicAgriForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('organicAgri')
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

  return (
    <FormLayout title="Organic Agriculture">
      <div className="max-w-4xl mx-auto pb-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20">
                <iconify-icon icon="mdi:sprout-outline" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Organic Agriculture Certification</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Official certification form for organic farming groups and individuals.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- SECTION 1: APPLICANT PROFILE --- */}
          <div className="organic-agri-section organic-agri-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:account-details-outline" width="18" class="opacity-90"></iconify-icon>
              Applicant Profile
            </h3>
            
            <div className="mb-5">
               <label className={labelClass}>Application / Project Name</label>
               <input type="text" value={form.application} onChange={updateUpper('application')} className={`${inputClass} font-semibold`} placeholder="PROJECT TITLE OR REFERENCE" required />
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Name of Group</label>
                <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300">
                       <iconify-icon icon="mdi:account-group-outline" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.nameOfGroup} onChange={updateUpper('nameOfGroup')} className={`${inputClass} pl-10`} placeholder="GROUP / ASSOCIATION" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Name of Applicant</label>
                <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300">
                       <iconify-icon icon="mdi:account-outline" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.nameOfApplicant} onChange={updateUpper('nameOfApplicant')} className={`${inputClass} pl-10`} placeholder="REPRESENTATIVE NAME" />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
               <div>
                 <label className={labelClass}>Location</label>
                 <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300">
                       <iconify-icon icon="mdi:map-marker-outline" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.location} onChange={updateUpper('location')} className={`${inputClass} pl-10`} placeholder="FARM ADDRESS" />
                 </div>
               </div>
               <div>
                 <label className={labelClass}>Total Area</label>
                 <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300">
                       <iconify-icon icon="mdi:texture-box" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.area} onChange={updateUpper('area')} className={`${inputClass} pl-10`} placeholder="E.G. 5 HECTARES" />
                 </div>
               </div>
            </div>
          </div>

          {/* --- SECTION 2: EVALUATION --- */}
          <div className="organic-agri-section organic-agri-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:clipboard-check-outline" width="18" class="opacity-90"></iconify-icon>
              Evaluation Process
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-5 mb-5">
               <div>
                 <label className={labelClass}>Date of Evaluation</label>
                 <input type="date" value={form.dateOfEvaluation} onChange={(e) => update('dateOfEvaluation', e.target.value)} className={inputClass} />
               </div>
               <div>
                 <label className={labelClass}>Date of Endorsement</label>
                 <input type="date" value={form.dateOfEndorsement} onChange={(e) => update('dateOfEndorsement', e.target.value)} className={inputClass} />
               </div>
               <div>
                 <label className={labelClass}>Final Inspection</label>
                 <input type="date" value={form.finalInspection} onChange={(e) => update('finalInspection', e.target.value)} className={inputClass} />
               </div>
            </div>

            <div>
               <label className={labelClass}>Initial Remarks</label>
               <textarea value={form.remarks} onChange={updateUpper('remarks')} className={`${inputClass} min-h-[80px] normal-case placeholder:normal-case`} rows="2" placeholder="Initial findings..." />
            </div>
          </div>

          {/* --- SECTION 3: CERTIFICATION STATUS --- */}
          <div className="organic-agri-section organic-agri-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
             <h3 className={sectionTitleClass}>
                <iconify-icon icon="mdi:certificate-outline" width="18" class="opacity-90"></iconify-icon>
                Certification Details
             </h3>
             
             <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                   <label className={labelClass}>Current Status</label>
                   <div className="relative">
                      <select 
                        value={form.status} 
                        onChange={updateUpper('status')} 
                        className={`${inputClass} appearance-none cursor-pointer pr-10 font-bold ${
                            form.status === 'CERTIFIED' ? 'text-white bg-[#1e4d2b] border-[#1e4d2b]' :
                            form.status === 'DENIED' ? 'text-white bg-red-500 border-red-500' :
                            ''
                        }`}
                      >
                        <option value="">Select Status</option>
                        {STATUS_OPTIONS.map((o) => <option key={o} value={o.toUpperCase()}>{o}</option>)}
                      </select>
                      <div className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${form.status === 'CERTIFIED' || form.status === 'DENIED' ? 'text-white' : 'text-[#5c574f]'}`}>
                         <iconify-icon icon="mdi:chevron-down" width="20"></iconify-icon>
                      </div>
                   </div>
                </div>
                <div>
                   <label className={labelClass}>Date Certificate Issued</label>
                   <input type="date" value={form.issuanceOfCertificate} onChange={(e) => update('issuanceOfCertificate', e.target.value)} className={inputClass} />
                </div>
             </div>

             <div className="grid sm:grid-cols-2 gap-5">
                <div>
                   <label className={labelClass}>Final Remarks</label>
                   <textarea value={form.finalRemarks} onChange={updateUpper('finalRemarks')} className={`${inputClass} min-h-[60px] normal-case placeholder:normal-case`} rows="2" placeholder="Final conclusion..." />
                </div>
                <div>
                   <label className={labelClass}>Digital File Link</label>
                   <div className="relative group">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#1e4d2b] group-focus-within:text-[#153019] transition-colors duration-300">
                         <iconify-icon icon="mdi:link-variant" width="18"></iconify-icon>
                      </span>
                      <input type="url" value={form.linkFile} onChange={(e) => update('linkFile', e.target.value)} className={`${inputClass} pl-10 normal-case placeholder:normal-case`} placeholder="https://..." />
                   </div>
                   <p className="text-[10px] text-[#5c574f] mt-1 ml-1">Link to scanned documents.</p>
                </div>
             </div>
          </div>

          {/* --- SECTION 4: RATINGS --- */}
          <div className="organic-agri-section organic-agri-section-4 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:star-face" width="18" class="opacity-90"></iconify-icon>
              Customer Satisfaction Feedback
            </h3>
            
            <div className="overflow-hidden border-2 border-[#e8e0d4] rounded-xl mb-5 hover:border-[#1e4d2b]/20 transition-colors duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#f0f5ee] border-b-2 border-[#1e4d2b]/15">
                      <th className="text-left py-4 px-4 font-bold text-[#1e4d2b] uppercase text-xs">Rating Criteria</th>
                      <th className="text-center py-4 px-2 w-48 font-bold text-[#1e4d2b] uppercase text-xs">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e0d4]">
                    <tr className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
                      <td className="py-3 px-4 font-medium text-[#1e4d2b]">1. Quantity of Services Provided</td>
                      <td className="py-2 px-2"><select value={form.ratingQuantity} onChange={(e) => update('ratingQuantity', e.target.value)} className="w-full px-3 py-2 border-2 border-[#e8e0d4] rounded-lg text-sm bg-white focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/20 outline-none transition-all duration-300"><option value="">Select...</option>{RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></td>
                    </tr>
                    <tr className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
                      <td className="py-3 px-4 font-medium text-[#1e4d2b]">2. Personnel Service Quality</td>
                      <td className="py-2 px-2"><select value={form.ratingServicesPersonnel} onChange={(e) => update('ratingServicesPersonnel', e.target.value)} className="w-full px-3 py-2 border-2 border-[#e8e0d4] rounded-lg text-sm bg-white focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/20 outline-none transition-all duration-300"><option value="">Select...</option>{RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></td>
                    </tr>
                    <tr className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
                      <td className="py-3 px-4 pl-8 text-[#5c574f] italic">2.1 Relevance of training</td>
                      <td className="py-2 px-2"><select value={form.ratingTraining} onChange={(e) => update('ratingTraining', e.target.value)} className="w-full px-3 py-2 border-2 border-[#e8e0d4] rounded-lg text-sm bg-white focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/20 outline-none transition-all duration-300"><option value="">Select...</option>{RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></td>
                    </tr>
                    <tr className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
                      <td className="py-3 px-4 pl-8 text-[#5c574f] italic">2.2 Attitude (Courteousness)</td>
                      <td className="py-2 px-2"><select value={form.ratingAttitude} onChange={(e) => update('ratingAttitude', e.target.value)} className="w-full px-3 py-2 border-2 border-[#e8e0d4] rounded-lg text-sm bg-white focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/20 outline-none transition-all duration-300"><option value="">Select...</option>{RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></td>
                    </tr>
                    <tr className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
                      <td className="py-3 px-4 pl-8 text-[#5c574f] italic">2.3 Promptness</td>
                      <td className="py-2 px-2"><select value={form.ratingPromptness} onChange={(e) => update('ratingPromptness', e.target.value)} className="w-full px-3 py-2 border-2 border-[#e8e0d4] rounded-lg text-sm bg-white focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/20 outline-none transition-all duration-300"><option value="">Select...</option>{RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
               <label className={labelClass}>Recommendation</label>
               <textarea value={form.recommendation} onChange={updateUpper('recommendation')} className={`${inputClass} min-h-[100px] normal-case placeholder:normal-case`} rows="3" placeholder="Enter recommendation..." />
            </div>
          </div>

          {/* --- ACTION BAR --- */}
          <div className="organic-agri-section organic-agri-section-5 pt-2">
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