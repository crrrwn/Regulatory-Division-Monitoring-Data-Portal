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

  // --- STYLING CLASSES (Matches Plant Material Form) ---
  const sectionTitleClass = "text-sm font-bold text-emerald-800 uppercase tracking-wide border-b border-emerald-100 pb-3 mb-5 flex items-center gap-2"
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1"
  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 uppercase"
  const cardClass = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 hover:shadow-md transition-shadow duration-300"

  return (
    <FormLayout title="Organic Agriculture">
      <div className="max-w-4xl mx-auto pb-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <iconify-icon icon="mdi:sprout-outline" width="24"></iconify-icon>
             </span>
             Organic Agriculture Certification
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-1">
            Official certification form for organic farming groups and individuals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* --- SECTION 1: APPLICANT PROFILE --- */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:account-details-outline" width="18"></iconify-icon>
              Applicant Profile
            </h3>
            
            <div className="mb-5">
               <label className={labelClass}>Application / Project Name</label>
               <input type="text" value={form.application} onChange={updateUpper('application')} className={`${inputClass} font-semibold`} placeholder="PROJECT TITLE OR REFERENCE" required />
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Name of Group</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                       <iconify-icon icon="mdi:account-group-outline" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.nameOfGroup} onChange={updateUpper('nameOfGroup')} className={`${inputClass} pl-10`} placeholder="GROUP / ASSOCIATION" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Name of Applicant</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                       <iconify-icon icon="mdi:account-outline" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.nameOfApplicant} onChange={updateUpper('nameOfApplicant')} className={`${inputClass} pl-10`} placeholder="REPRESENTATIVE NAME" />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
               <div>
                 <label className={labelClass}>Location</label>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                       <iconify-icon icon="mdi:map-marker-outline" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.location} onChange={updateUpper('location')} className={`${inputClass} pl-10`} placeholder="FARM ADDRESS" />
                 </div>
               </div>
               <div>
                 <label className={labelClass}>Total Area</label>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                       <iconify-icon icon="mdi:texture-box" width="18"></iconify-icon>
                    </span>
                    <input type="text" value={form.area} onChange={updateUpper('area')} className={`${inputClass} pl-10`} placeholder="E.G. 5 HECTARES" />
                 </div>
               </div>
            </div>
          </div>

          {/* --- SECTION 2: EVALUATION --- */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:clipboard-check-outline" width="18"></iconify-icon>
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
               <textarea value={form.remarks} onChange={updateUpper('remarks')} className={`${inputClass} min-h-[80px] normal-case`} rows="2" placeholder="Initial findings..." />
            </div>
          </div>

          {/* --- SECTION 3: CERTIFICATION STATUS --- */}
          <div className={cardClass}>
             <h3 className={sectionTitleClass}>
                <iconify-icon icon="mdi:certificate-outline" width="18"></iconify-icon>
                Certification Details
             </h3>
             
             <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                   <label className={labelClass}>Current Status</label>
                   <div className="relative">
                      <select 
                        value={form.status} 
                        onChange={updateUpper('status')} 
                        className={`${inputClass} appearance-none cursor-pointer font-bold ${
                            form.status === 'CERTIFIED' ? 'text-white bg-emerald-600 border-emerald-600' :
                            form.status === 'DENIED' ? 'text-white bg-red-500 border-red-500' :
                            'text-slate-700'
                        }`}
                      >
                        <option value="">Select Status</option>
                        {STATUS_OPTIONS.map((o) => <option key={o} value={o.toUpperCase()}>{o}</option>)}
                      </select>
                      <div className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${form.status === 'CERTIFIED' || form.status === 'DENIED' ? 'text-white' : 'text-slate-400'}`}>
                         <iconify-icon icon="mdi:chevron-down"></iconify-icon>
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
                   <textarea value={form.finalRemarks} onChange={updateUpper('finalRemarks')} className={`${inputClass} min-h-[60px]`} rows="2" placeholder="Final conclusion..." />
                </div>
                <div>
                   <label className={labelClass}>Digital File Link</label>
                   <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                         <iconify-icon icon="mdi:link-variant" width="18"></iconify-icon>
                      </span>
                      <input type="url" value={form.linkFile} onChange={(e) => update('linkFile', e.target.value)} className={`${inputClass} pl-10 text-blue-600 normal-case`} placeholder="https://..." />
                   </div>
                   <p className="text-[10px] text-slate-400 mt-1 ml-1">Link to scanned documents.</p>
                </div>
             </div>
          </div>

          {/* --- SECTION 4: RATINGS --- */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:star-face" width="18"></iconify-icon>
              Customer Satisfaction Feedback
            </h3>
            
            <div className="overflow-hidden border border-slate-200 rounded-xl mb-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 border-b border-emerald-100">
                      <th className="text-left py-4 px-4 font-bold text-emerald-800 uppercase text-xs">Rating Criteria</th>
                      <th className="text-center py-4 px-2 w-48 font-bold text-emerald-800 uppercase text-xs">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">1. Quantity of Services Provided</td>
                      <td className="py-2 px-2"><select value={form.ratingQuantity} onChange={(e) => update('ratingQuantity', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-emerald-500 outline-none"><option value="">Select...</option>{RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">2. Personnel Service Quality</td>
                      <td className="py-2 px-2"><select value={form.ratingServicesPersonnel} onChange={(e) => update('ratingServicesPersonnel', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-emerald-500 outline-none"><option value="">Select...</option>{RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 pl-8 text-slate-600 italic">2.1 Relevance of training</td>
                      <td className="py-2 px-2"><select value={form.ratingTraining} onChange={(e) => update('ratingTraining', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-emerald-500 outline-none"><option value="">Select...</option>{RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 pl-8 text-slate-600 italic">2.2 Attitude (Courteousness)</td>
                      <td className="py-2 px-2"><select value={form.ratingAttitude} onChange={(e) => update('ratingAttitude', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-emerald-500 outline-none"><option value="">Select...</option>{RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 pl-8 text-slate-600 italic">2.3 Promptness</td>
                      <td className="py-2 px-2"><select value={form.ratingPromptness} onChange={(e) => update('ratingPromptness', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-emerald-500 outline-none"><option value="">Select...</option>{RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
               <label className={labelClass}>Recommendation / Remarks</label>
               <textarea value={form.recommendation} onChange={updateUpper('recommendation')} className={`${inputClass} min-h-[100px] normal-case`} rows="3" placeholder="Enter recommendation..." />
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