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

  // --- STYLING (app theme: green #1e4d2b, khaki #b8a066) ---
  const sectionTitleClass = "text-sm font-black text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-3 mb-5 flex items-center gap-2.5 transition-colors duration-300"
  const labelClass = "block text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-1.5 transition-colors duration-200"
  const inputClass = "w-full px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c]"
  const selectWrapperClass = "relative"
  const selectArrowClass = "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#5c574f] group-focus-within/select:text-[#1e4d2b] transition-colors duration-300"

  return (
    <FormLayout title="Animal Welfare Registration">
      <div className="max-w-4xl mx-auto pb-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20">
                <iconify-icon icon="mdi:paw" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Welfare Concern Form</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Register and monitor animal facilities for compliance with RA 8485 (Animal Welfare Act).
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- SECTION 1: FACILITY DETAILS --- */}
          <div className="animal-welfare-section animal-welfare-section-1 bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:domain" width="18" class="opacity-90"></iconify-icon>
              Facility Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="sm:col-span-2">
                  <label className={labelClass}>Facility Name (Business Name)</label>
                  <input 
                    type="text" 
                    value={form.facilityName} 
                    onChange={(e) => update('facilityName', e.target.value)} 
                    className={`${inputClass} text-lg font-semibold`} 
                    required 
                    placeholder="e.g. Happy Paws Clinic"
                  />
               </div>
               
               <div>
                  <label className={labelClass}>Owner / Operator Name</label>
                  <div className="relative group">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300">
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
                     <span className="absolute top-2.5 left-3 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300">
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

               <div className="relative group/select">
                  <label className={labelClass}>Facility Type</label>
                  <div className={selectWrapperClass}>
                    <select 
                      value={form.facilityType} 
                      onChange={(e) => update('facilityType', e.target.value)} 
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
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
          <div className="animal-welfare-section animal-welfare-section-2 bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:doctor" width="18" class="opacity-90"></iconify-icon>
              Veterinary Compliance
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
               <div className="bg-[#f0f5ee]/80 p-4 rounded-xl border-2 border-[#1e4d2b]/20 hover:border-[#1e4d2b]/40 transition-all duration-400 ease-[cubic-bezier(0.33,1,0.68,1)]">
                  <label className={labelClass}>Head Veterinarian</label>
                  <input 
                    type="text" 
                    value={form.headVet} 
                    onChange={(e) => update('headVet', e.target.value)} 
                    className={inputClass} 
                    placeholder="Dr. Full Name"
                  />
               </div>
               <div className="bg-[#faf6f0]/80 p-4 rounded-xl border-2 border-[#b8a066]/25 hover:border-[#b8a066]/50 transition-all duration-400 ease-[cubic-bezier(0.33,1,0.68,1)]">
                  <label className={labelClass}>PRC License No.</label>
                  <input 
                    type="text" 
                    value={form.prcLicenseNo} 
                    onChange={(e) => update('prcLicenseNo', e.target.value)} 
                    className={inputClass} 
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
               <div className="relative group/select">
                  <label className={labelClass}>Current Status</label>
                  <div className={selectWrapperClass}>
                     <select 
                       value={form.status} 
                       onChange={(e) => update('status', e.target.value)} 
                       className={`${inputClass} appearance-none cursor-pointer pr-10 ${
                          form.status === 'Registered' ? 'text-[#1e4d2b] bg-[#f0f5ee] border-[#1e4d2b]/30' : 
                          form.status === 'Expired' ? 'text-red-600 bg-red-50 border-red-200' : ''
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
          <div className="animal-welfare-section animal-welfare-section-3 bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
             <h3 className={sectionTitleClass}>
               <iconify-icon icon="mdi:star-circle-outline" width="18" class="opacity-90"></iconify-icon>
               Evaluation & Feedback
             </h3>
             <div className="space-y-6">
                <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
                
                <div>
                   <label className={labelClass}>Recommendation</label>
                   <textarea 
                     value={form.recommendation} 
                     onChange={(e) => update('recommendation', (e.target.value || '').toUpperCase())} 
                     className={`${inputClass} min-h-[100px] uppercase placeholder:normal-case`} 
                     rows="3" 
                     placeholder="Enter findings and recommendations..." 
                   />
                </div>
             </div>
          </div>

          {/* --- ACTION BAR --- */}
          <div className="animal-welfare-section animal-welfare-section-4 pt-2">
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