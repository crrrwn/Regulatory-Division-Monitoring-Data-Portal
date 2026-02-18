import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import 'iconify-icon'

const FACILITY_TYPES = ['Pet Shop', 'Veterinary Clinic', 'Grooming Center', 'Breeding Kennel', 'Animal Shelter', 'Zoo / Wildlife', 'Research Facility', 'Pound']
const STATUS_OPTIONS = ['Pending Inspection', 'Inspected - Passed', 'Inspected - Failed', 'Registered', 'Expired']

const initialState = {
  dateApplied: '', 
  facilityName: '', 
  ownerName: '', 
  address: '', 
  facilityType: '',
  speciesHandled: '', 
  headVet: '', 
  prcLicenseNo: '', 
  certificateNo: '', 
  validityDate: '', 
  status: '',
  ratingQuantity: '', 
  ratingServicesPersonnel: '', 
  ratingTraining: '', 
  ratingAttitude: '', 
  ratingPromptness: '',
  recommendation: '',
}

export default function AnimalWelfareForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('animalWelfare')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) {
      setForm(initialState)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // --- STYLING CONSTANTS ---
  const sectionTitleClass = "text-sm font-bold text-teal-800 uppercase tracking-wide border-b-2 border-teal-100 pb-2 mb-5 flex items-center gap-2"
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1"
  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 placeholder:text-slate-400 shadow-sm hover:border-teal-300"
  const selectWrapperClass = "relative"
  const selectArrowClass = "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400"

  return (
    <FormLayout title="Animal Welfare Registration">
      <div className="max-w-4xl mx-auto pb-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8 text-center sm:text-left">
           <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3 justify-center sm:justify-start">
              <span className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                 <iconify-icon icon="mdi:paw" width="24"></iconify-icon>
              </span>
              Welfare Concern Form
           </h2>
           <p className="text-slate-500 mt-2 text-sm ml-1">
              Register and monitor animal facilities for compliance with RA 8485 (Animal Welfare Act).
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
          
          {/* --- SECTION 1: FACILITY DETAILS --- */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:domain" width="18"></iconify-icon>
              Facility Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="sm:col-span-2">
                  <label className={labelClass}>Facility Name (Business Name)</label>
                  <input 
                    type="text" 
                    value={form.facilityName} 
                    onChange={(e) => update('facilityName', e.target.value)} 
                    className={`${inputClass} text-lg font-semibold text-slate-800`} 
                    required 
                    placeholder="e.g. Happy Paws Clinic"
                  />
               </div>
               
               <div>
                  <label className={labelClass}>Owner / Operator Name</label>
                  <div className="relative group">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-teal-500 transition-colors">
                        <iconify-icon icon="mdi:account" width="18"></iconify-icon>
                     </span>
                     <input 
                        type="text" 
                        value={form.ownerName} 
                        onChange={(e) => update('ownerName', e.target.value)} 
                        className={`${inputClass} pl-10`} 
                     />
                  </div>
               </div>

               <div>
                  <label className={labelClass}>Date of Application</label>
                  <input 
                    type="date" 
                    value={form.dateApplied} 
                    onChange={(e) => update('dateApplied', e.target.value)} 
                    className={inputClass} 
                    required 
                  />
               </div>

               <div className="sm:col-span-2">
                  <label className={labelClass}>Complete Address</label>
                  <div className="relative group">
                     <span className="absolute top-3.5 left-3 text-slate-400 group-focus-within:text-teal-500 transition-colors">
                        <iconify-icon icon="mdi:map-marker" width="18"></iconify-icon>
                     </span>
                     <input 
                       type="text" 
                       value={form.address} 
                       onChange={(e) => update('address', e.target.value)} 
                       className={`${inputClass} pl-10`} 
                       placeholder="Street, Barangay, Municipality"
                     />
                  </div>
               </div>

               <div>
                  <label className={labelClass}>Facility Type</label>
                  <div className={selectWrapperClass}>
                    <select 
                      value={form.facilityType} 
                      onChange={(e) => update('facilityType', e.target.value)} 
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Select Type...</option>
                      {FACILITY_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className={selectArrowClass}>
                       <iconify-icon icon="mdi:chevron-down" width="20"></iconify-icon>
                    </div>
                  </div>
               </div>

               <div>
                  <label className={labelClass}>Species Handled</label>
                  <input 
                    type="text" 
                    value={form.speciesHandled} 
                    onChange={(e) => update('speciesHandled', e.target.value)} 
                    placeholder="Dogs, Cats, Birds, etc." 
                    className={inputClass} 
                  />
               </div>
            </div>
          </div>

          {/* --- SECTION 2: VETERINARY & COMPLIANCE --- */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:doctor" width="18"></iconify-icon>
              Veterinary Compliance
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
               <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                  <label className={labelClass}>Head Veterinarian</label>
                  <input 
                    type="text" 
                    value={form.headVet} 
                    onChange={(e) => update('headVet', e.target.value)} 
                    className={`${inputClass} bg-white`} 
                    placeholder="Dr. Full Name"
                  />
               </div>
               <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                  <label className={labelClass}>PRC License No.</label>
                  <input 
                    type="text" 
                    value={form.prcLicenseNo} 
                    onChange={(e) => update('prcLicenseNo', e.target.value)} 
                    className={`${inputClass} bg-white`} 
                    placeholder="0000000"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div>
                  <label className={labelClass}>Certificate No. (AWC)</label>
                  <input 
                    type="text" 
                    value={form.certificateNo} 
                    onChange={(e) => update('certificateNo', e.target.value)} 
                    className={inputClass} 
                  />
               </div>
               <div>
                  <label className={labelClass}>Validity Date</label>
                  <input 
                    type="date" 
                    value={form.validityDate} 
                    onChange={(e) => update('validityDate', e.target.value)} 
                    className={inputClass} 
                  />
               </div>
               <div>
                  <label className={labelClass}>Current Status</label>
                  <div className={selectWrapperClass}>
                     <select 
                       value={form.status} 
                       onChange={(e) => update('status', e.target.value)} 
                       className={`${inputClass} appearance-none font-medium cursor-pointer ${
                          form.status === 'Registered' ? 'text-green-600 bg-green-50' : 
                          form.status === 'Expired' ? 'text-red-600 bg-red-50' : ''
                       }`}
                     >
                       <option value="">Select Status...</option>
                       {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                     </select>
                     <div className={selectArrowClass}>
                        <iconify-icon icon="mdi:chevron-down" width="20"></iconify-icon>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* --- SECTION 3: RATING & FEEDBACK --- */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
             <h3 className={sectionTitleClass}>
               <iconify-icon icon="mdi:star-circle-outline" width="18"></iconify-icon>
               Evaluation & Feedback
             </h3>
             <div className="space-y-6">
                <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
                
                <div>
                   <label className={labelClass}>Recommendation / Remarks</label>
                   <textarea 
                     value={form.recommendation} 
                     onChange={(e) => update('recommendation', (e.target.value || '').toUpperCase())} 
                     className={`${inputClass} min-h-[100px]`} 
                     rows="3" 
                     placeholder="Enter findings and recommendations..." 
                   />
                </div>
             </div>
          </div>

          {/* --- ACTION BAR --- */}
          <div className="sticky bottom-4 z-10">
             {message && (
                <div className={`mb-4 mx-auto max-w-2xl p-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up border-l-4 ${message.type === 'success' ? 'bg-teal-50 border-teal-500 text-teal-800' : 'bg-red-50 border-red-500 text-red-700'}`}>
                  <iconify-icon icon={message.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} width="24"></iconify-icon>
                  <p className="font-bold text-sm">{message.text}</p>
                </div>
             )}

             <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 hover:shadow-teal-500/30 transition-all font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-transparent"
                >
                  {loading ? (
                    <>
                      <iconify-icon icon="mdi:loading" width="20" class="animate-spin"></iconify-icon>
                      Processing...
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="mdi:content-save-check" width="22"></iconify-icon>
                      Submit Record
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