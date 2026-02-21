import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { REGIONS, PROVINCES } from '../../lib/regions'
import 'iconify-icon'

const ORG_OPTIONS = ['Single Prop', 'Corporation', 'Cooperative', 'Association', 'Club', "Gov't"]
const APPLICANT_OPTIONS = ['Owner', 'Company Rep', 'Driver', 'Others']
const SERVICE_OPTIONS = ['Private Owned', 'Hauling Services', 'Company/Coop Owned', 'Others']
const SPECIES_BIRDS = ['Broiler', 'Ducks', 'Pigeons', 'Gamefowl', 'Others']
const VEHICLE_OPTIONS = ['Truck', 'PUJ', 'Multi-Cab', 'Rebuilt/AUV', 'Pick-Up', 'Fiera/XLT', 'Others']
const BODY_OPTIONS = ['Wire mesh/crates', 'Build-in cages', 'Non-permanent/movable', 'Others']

export default function TransportCarrierForm() {
  const [ownerName, setOwnerName] = useState({ last: '', first: '', mi: '' })
  const [businessAddress, setBusinessAddress] = useState({ barangay: '', cityMuni: '', province: '', region: '' })
  const [businessOrg, setBusinessOrg] = useState([])
  const [typeOfApplicant, setTypeOfApplicant] = useState([])
  const [contactNo, setContactNo] = useState('')
  const [email, setEmail] = useState('')
  const [applicantTin, setApplicantTin] = useState('')
  const [companyTin, setCompanyTin] = useState('')
  const [typeOfServices, setTypeOfServices] = useState([])
  const [applicationType, setApplicationType] = useState('')
  const [speciesCargoBirds, setSpeciesCargoBirds] = useState([])
  const [speciesAnimals, setSpeciesAnimals] = useState('')
  const [byProducts, setByProducts] = useState('')
  const [typeOfVehicle, setTypeOfVehicle] = useState([])
  const [bodyType, setBodyType] = useState([])
  const [fleet, setFleet] = useState([{ accreditationNo: '', makeSeries: '', plateNo: '', bodyType: '', noOfWheels: '' }])
  const [ratings, setRatings] = useState({ ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '' })
  const [recommendation, setRecommendation] = useState('')
  const { submit, loading, message } = useFormSubmit('transportCarrier')

  const toggleCheckbox = (setter, value) => setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]))

  const addFleetRow = () => setFleet((f) => [...f, { accreditationNo: '', makeSeries: '', plateNo: '', bodyType: '', noOfWheels: '' }])
  const updateFleet = (idx, key, val) => setFleet((f) => f.map((row, i) => (i === idx ? { ...row, [key]: val } : row)))
  const removeFleetRow = (idx) => {
    if (fleet.length > 1) setFleet((f) => f.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submit({
      ownerName,
      businessAddress,
      businessOrg,
      typeOfApplicant,
      contactNo,
      email,
      applicantTin,
      companyTin,
      typeOfServices,
      applicationType,
      speciesCargoBirds,
      speciesAnimals,
      byProducts,
      typeOfVehicle,
      bodyType,
      fleet,
      ...ratings,
      recommendation,
    })
    // Form Reset Logic (Optional: Separate function for cleaner code)
    setOwnerName({ last: '', first: '', mi: '' })
    setBusinessAddress({ barangay: '', cityMuni: '', province: '', region: '' })
    setBusinessOrg([])
    setTypeOfApplicant([])
    setContactNo('')
    setEmail('')
    setApplicantTin('')
    setCompanyTin('')
    setTypeOfServices([])
    setApplicationType('')
    setSpeciesCargoBirds([])
    setSpeciesAnimals('')
    setByProducts('')
    setTypeOfVehicle([])
    setBodyType([])
    setFleet([{ accreditationNo: '', makeSeries: '', plateNo: '', bodyType: '', noOfWheels: '' }])
    setRatings({ ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '' })
    setRecommendation('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- STYLING (app theme: green #1e4d2b, khaki #b8a066) ---
  const sectionTitleClass = "text-sm font-black text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-3 mb-5 flex items-center gap-2.5 transition-colors duration-300"
  const labelClass = "block text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-1.5 transition-colors duration-200"
  const inputClass = "w-full px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c]"
  
  // Custom Checkbox "Pill" Component
  const TogglePill = ({ label, isSelected, onToggle }) => (
    <div 
      onClick={onToggle}
      className={`cursor-pointer select-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border-2 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] flex items-center gap-2
        ${isSelected 
          ? 'bg-[#1e4d2b] text-white border-[#1e4d2b] shadow-md shadow-[#1e4d2b]/25' 
          : 'bg-white text-[#5c574f] border-[#e8e0d4] hover:border-[#1e4d2b]/40 hover:bg-[#faf8f5]'
        }`}
    >
      <iconify-icon icon={isSelected ? "mdi:check-circle" : "mdi:circle-outline"} width="14"></iconify-icon>
      {label}
    </div>
  )

  return (
    <FormLayout title="Transport Carrier Accreditation">
      <div className="max-w-5xl mx-auto pb-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20">
                <iconify-icon icon="mdi:truck-outline" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Land Transport Carrier</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Registration form for livestock, poultry, and by-products transport vehicles.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- SECTION 1: APPLICANT DETAILS --- */}
          <div className="transport-carrier-section transport-carrier-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:account-box-outline" width="18" class="opacity-90"></iconify-icon>
              Applicant Information
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-5 mb-5">
              <div><label className={labelClass}>Owner Last Name</label><input type="text" value={ownerName.last} onChange={(e) => setOwnerName((o) => ({ ...o, last: e.target.value }))} className={inputClass} required /></div>
              <div><label className={labelClass}>First Name</label><input type="text" value={ownerName.first} onChange={(e) => setOwnerName((o) => ({ ...o, first: e.target.value }))} className={inputClass} required /></div>
              <div><label className={labelClass}>M.I.</label><input type="text" value={ownerName.mi} onChange={(e) => setOwnerName((o) => ({ ...o, mi: e.target.value }))} className={inputClass} maxLength={2} /></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div><label className={labelClass}>Contact Number</label><input type="text" value={contactNo} onChange={(e) => setContactNo(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Applicant TIN</label><input type="text" value={applicantTin} onChange={(e) => setApplicantTin(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Company TIN</label><input type="text" value={companyTin} onChange={(e) => setCompanyTin(e.target.value)} className={inputClass} /></div>
            </div>

            <div className="mb-5">
               <label className={labelClass}>Business Organization</label>
               <div className="flex flex-wrap gap-2">
                  {ORG_OPTIONS.map((o) => (
                    <TogglePill key={o} label={o} isSelected={businessOrg.includes(o)} onToggle={() => toggleCheckbox(setBusinessOrg, o)} />
                  ))}
               </div>
            </div>

            <div>
               <label className={labelClass}>Type of Applicant</label>
               <div className="flex flex-wrap gap-2">
                  {APPLICANT_OPTIONS.map((o) => (
                    <TogglePill key={o} label={o} isSelected={typeOfApplicant.includes(o)} onToggle={() => toggleCheckbox(setTypeOfApplicant, o)} />
                  ))}
               </div>
            </div>
          </div>

          {/* --- SECTION 2: ADDRESS --- */}
          <div className="transport-carrier-section transport-carrier-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:map-marker-radius-outline" width="18" class="opacity-90"></iconify-icon>
              Business Address
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
               <div><label className={labelClass}>Region</label><AppSelect value={businessAddress.region} onChange={(v) => setBusinessAddress((a) => ({ ...a, region: v }))} placeholder="Select Region" options={[{ value: '', label: 'Select Region' }, ...REGIONS.map((r) => ({ value: r, label: r }))]} aria-label="Region" /></div>
               <div><label className={labelClass}>Province</label><AppSelect value={businessAddress.province} onChange={(v) => setBusinessAddress((a) => ({ ...a, province: v }))} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...PROVINCES.map((p) => ({ value: p, label: p }))]} aria-label="Province" /></div>
               <div><label className={labelClass}>City / Municipality</label><input type="text" value={businessAddress.cityMuni} onChange={(e) => setBusinessAddress((a) => ({ ...a, cityMuni: e.target.value }))} className={inputClass} /></div>
               <div><label className={labelClass}>Barangay</label><input type="text" value={businessAddress.barangay} onChange={(e) => setBusinessAddress((a) => ({ ...a, barangay: e.target.value }))} className={inputClass} /></div>
            </div>
          </div>

          {/* --- SECTION 3: CARRIER DETAILS --- */}
          <div className="transport-carrier-section transport-carrier-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:truck-outline" width="18" class="opacity-90"></iconify-icon>
              Carrier & Services
            </h3>
            
            <div className="bg-[#f0f5ee]/80 p-4 rounded-xl border-2 border-[#1e4d2b]/20 hover:border-[#1e4d2b]/35 mb-5 transition-all duration-400 ease-[cubic-bezier(0.33,1,0.68,1)]">
               <label className={labelClass}>Application Type</label>
               <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${applicationType === 'New Applicant' ? 'border-[#1e4d2b]' : 'border-[#e8e0d4]'}`}>
                        {applicationType === 'New Applicant' && <div className="w-2.5 h-2.5 bg-[#1e4d2b] rounded-full" />}
                     </div>
                     <input type="radio" className="hidden" checked={applicationType === 'New Applicant'} onChange={() => setApplicationType('New Applicant')} />
                     <span className={`text-sm font-semibold group-hover:text-[#1e4d2b] transition-colors duration-200 ${applicationType === 'New Applicant' ? 'text-[#1e4d2b]' : 'text-[#5c574f]'}`}>New Applicant</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${applicationType === 'Renewal' ? 'border-[#1e4d2b]' : 'border-[#e8e0d4]'}`}>
                        {applicationType === 'Renewal' && <div className="w-2.5 h-2.5 bg-[#1e4d2b] rounded-full" />}
                     </div>
                     <input type="radio" className="hidden" checked={applicationType === 'Renewal'} onChange={() => setApplicationType('Renewal')} />
                     <span className={`text-sm font-semibold group-hover:text-[#1e4d2b] transition-colors duration-200 ${applicationType === 'Renewal' ? 'text-[#1e4d2b]' : 'text-[#5c574f]'}`}>Renewal</span>
                  </label>
               </div>
            </div>

            <div className="space-y-5">
               <div>
                  <label className={labelClass}>Type of Services</label>
                  <div className="flex flex-wrap gap-2">
                     {SERVICE_OPTIONS.map((o) => (
                       <TogglePill key={o} label={o} isSelected={typeOfServices.includes(o)} onToggle={() => toggleCheckbox(setTypeOfServices, o)} />
                     ))}
                  </div>
               </div>

               <div>
                  <label className={labelClass}>Species / Cargo Handled (Birds)</label>
                  <div className="flex flex-wrap gap-2">
                     {SPECIES_BIRDS.map((o) => (
                       <TogglePill key={o} label={o} isSelected={speciesCargoBirds.includes(o)} onToggle={() => toggleCheckbox(setSpeciesCargoBirds, o)} />
                     ))}
                  </div>
               </div>

               <div className="grid sm:grid-cols-2 gap-5">
                  <div><label className={labelClass}>Species Handled (Animals)</label><input type="text" value={speciesAnimals} onChange={(e) => setSpeciesAnimals(e.target.value)} className={inputClass} placeholder="e.g. Swine, Cattle" /></div>
                  <div><label className={labelClass}>By-Products Handled</label><input type="text" value={byProducts} onChange={(e) => setByProducts(e.target.value)} className={inputClass} placeholder="e.g. Eggs, Manure" /></div>
               </div>

               <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                     <label className={labelClass}>Type of Vehicle</label>
                     <div className="flex flex-wrap gap-2">
                        {VEHICLE_OPTIONS.map((o) => (
                          <TogglePill key={o} label={o} isSelected={typeOfVehicle.includes(o)} onToggle={() => toggleCheckbox(setTypeOfVehicle, o)} />
                        ))}
                     </div>
                  </div>
                  <div>
                     <label className={labelClass}>Body Type</label>
                     <div className="flex flex-wrap gap-2">
                        {BODY_OPTIONS.map((o) => (
                          <TogglePill key={o} label={o} isSelected={bodyType.includes(o)} onToggle={() => toggleCheckbox(setBodyType, o)} />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* --- SECTION 4: FLEET TABLE --- */}
          <div className="transport-carrier-section transport-carrier-section-4 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
             <div className="flex justify-between items-center mb-4 border-b-2 border-[#1e4d2b]/15 pb-3">
                <h3 className="text-sm font-black text-[#1e4d2b] uppercase tracking-wide flex items-center gap-2.5">
                  <iconify-icon icon="mdi:fleet" width="18" class="opacity-90"></iconify-icon>
                  Vehicle Fleet
                </h3>
                <button 
                  type="button" 
                  onClick={addFleetRow} 
                  className="px-4 py-2 bg-[#1e4d2b]/10 text-[#1e4d2b] text-xs font-bold rounded-xl border-2 border-[#1e4d2b]/30 hover:bg-[#1e4d2b]/20 hover:border-[#1e4d2b]/50 transition-all duration-300 flex items-center gap-1.5"
                >
                  <iconify-icon icon="mdi:plus-circle" width="16"></iconify-icon> Add Vehicle
                </button>
             </div>
             
             <div className="overflow-x-auto rounded-xl border-2 border-[#e8e0d4] hover:border-[#1e4d2b]/20 transition-colors duration-300">
                <table className="w-full text-sm text-left">
                   <thead className="bg-[#faf8f5] text-[#5c574f] font-semibold border-b-2 border-[#e8e0d4]">
                      <tr>
                         <th className="px-4 py-3 min-w-[150px]">Accreditation No.</th>
                         <th className="px-4 py-3 min-w-[150px]">Make/Series</th>
                         <th className="px-4 py-3 min-w-[150px]">Plate / Conduction</th>
                         <th className="px-4 py-3 min-w-[150px]">Body Type</th>
                         <th className="px-4 py-3 w-32">No. of Wheels</th>
                         <th className="px-4 py-3 w-16">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#e8e0d4]">
                      {fleet.map((row, idx) => (
                         <tr key={idx} className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
                            <td className="px-4 py-2"><input type="text" value={row.accreditationNo} onChange={(e) => updateFleet(idx, 'accreditationNo', e.target.value)} className="w-full bg-transparent border-b-2 border-transparent focus:border-[#1e4d2b] outline-none text-[#1e4d2b] py-1.5 transition-colors duration-200 placeholder:text-[#8a857c]" placeholder="Type here..." /></td>
                            <td className="px-4 py-2"><input type="text" value={row.makeSeries} onChange={(e) => updateFleet(idx, 'makeSeries', e.target.value)} className="w-full bg-transparent border-b-2 border-transparent focus:border-[#1e4d2b] outline-none text-[#1e4d2b] py-1.5 transition-colors duration-200 placeholder:text-[#8a857c]" placeholder="Type here..." /></td>
                            <td className="px-4 py-2"><input type="text" value={row.plateNo} onChange={(e) => updateFleet(idx, 'plateNo', e.target.value)} className="w-full bg-transparent border-b-2 border-transparent focus:border-[#1e4d2b] outline-none text-[#1e4d2b] font-mono py-1.5 transition-colors duration-200 placeholder:text-[#8a857c]" placeholder="ABC-123" /></td>
                            <td className="px-4 py-2"><input type="text" value={row.bodyType} onChange={(e) => updateFleet(idx, 'bodyType', e.target.value)} className="w-full bg-transparent border-b-2 border-transparent focus:border-[#1e4d2b] outline-none text-[#1e4d2b] py-1.5 transition-colors duration-200 placeholder:text-[#8a857c]" placeholder="Type here..." /></td>
                            <td className="px-4 py-2"><input type="text" value={row.noOfWheels} onChange={(e) => updateFleet(idx, 'noOfWheels', e.target.value)} className="w-full bg-transparent border-b-2 border-transparent focus:border-[#1e4d2b] outline-none text-[#1e4d2b] py-1.5 transition-colors duration-200 placeholder:text-[#8a857c]" placeholder="4" /></td>
                            <td className="px-4 py-2 text-center">
                               {fleet.length > 1 && (
                                 <button type="button" onClick={() => removeFleetRow(idx)} className="text-red-500 hover:text-red-600 hover:scale-110 active:scale-95 transition-all duration-200 p-1 rounded-lg hover:bg-red-50">
                                    <iconify-icon icon="mdi:trash-can-outline" width="18"></iconify-icon>
                                 </button>
                               )}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* --- SECTION 5: FEEDBACK --- */}
          <div className="transport-carrier-section transport-carrier-section-5 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
             <h3 className={sectionTitleClass}>
               <iconify-icon icon="mdi:star-face" width="18" class="opacity-90"></iconify-icon>
               Feedback & Remarks
             </h3>
             <div className="space-y-6">
                <CustomerRatingsTable ratings={ratings} onChange={(k, v) => setRatings((r) => ({ ...r, [k]: v }))} />
                <div>
                   <label className={labelClass}>Recommendation</label>
                   <textarea 
                     value={recommendation} 
                     onChange={(e) => setRecommendation((e.target.value || '').toUpperCase())} 
                     className={`${inputClass} min-h-[100px] uppercase placeholder:normal-case`} 
                     rows="3" 
                     placeholder="Enter official recommendations..." 
                   />
                </div>
             </div>
          </div>

          {/* --- ACTION BAR --- */}
          <div className="transport-carrier-section transport-carrier-section-6 pt-2">
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