import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
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

  // --- REUSABLE STYLES ---
  const sectionTitleClass = "text-sm font-bold text-emerald-800 uppercase tracking-wide border-b border-emerald-100 pb-3 mb-5 flex items-center gap-2"
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
  const cardClass = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6"
  
  // Custom Checkbox "Pill" Component
  const TogglePill = ({ label, isSelected, onToggle }) => (
    <div 
      onClick={onToggle}
      className={`cursor-pointer select-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all duration-200 flex items-center gap-2
        ${isSelected 
          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200' 
          : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Land Transport Carrier</h2>
          <p className="text-sm text-slate-500 mt-1">
            Registration form for livestock, poultry, and by-products transport vehicles.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* --- SECTION 1: APPLICANT DETAILS --- */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:account-box-outline" width="18"></iconify-icon>
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
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:map-marker-radius-outline" width="18"></iconify-icon>
              Business Address
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
               <div><label className={labelClass}>Region</label><select value={businessAddress.region} onChange={(e) => setBusinessAddress((a) => ({ ...a, region: e.target.value }))} className={inputClass}><option value="">Select Region</option>{REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
               <div><label className={labelClass}>Province</label><select value={businessAddress.province} onChange={(e) => setBusinessAddress((a) => ({ ...a, province: e.target.value }))} className={inputClass}><option value="">Select Province</option>{PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
               <div><label className={labelClass}>City / Municipality</label><input type="text" value={businessAddress.cityMuni} onChange={(e) => setBusinessAddress((a) => ({ ...a, cityMuni: e.target.value }))} className={inputClass} /></div>
               <div><label className={labelClass}>Barangay</label><input type="text" value={businessAddress.barangay} onChange={(e) => setBusinessAddress((a) => ({ ...a, barangay: e.target.value }))} className={inputClass} /></div>
            </div>
          </div>

          {/* --- SECTION 3: CARRIER DETAILS --- */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:truck-outline" width="18"></iconify-icon>
              Carrier & Services
            </h3>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5">
               <label className={labelClass}>Application Type</label>
               <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${applicationType === 'New Applicant' ? 'border-emerald-500' : 'border-slate-300'}`}>
                        {applicationType === 'New Applicant' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                     </div>
                     <input type="radio" className="hidden" checked={applicationType === 'New Applicant'} onChange={() => setApplicationType('New Applicant')} />
                     <span className={`text-sm font-medium group-hover:text-emerald-600 ${applicationType === 'New Applicant' ? 'text-emerald-700' : 'text-slate-600'}`}>New Applicant</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${applicationType === 'Renewal' ? 'border-emerald-500' : 'border-slate-300'}`}>
                        {applicationType === 'Renewal' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                     </div>
                     <input type="radio" className="hidden" checked={applicationType === 'Renewal'} onChange={() => setApplicationType('Renewal')} />
                     <span className={`text-sm font-medium group-hover:text-emerald-600 ${applicationType === 'Renewal' ? 'text-emerald-700' : 'text-slate-600'}`}>Renewal</span>
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
          <div className={cardClass}>
             <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-2">
                  <iconify-icon icon="mdi:fleet" width="18"></iconify-icon>
                  Vehicle Fleet
                </h3>
                <button 
                  type="button" 
                  onClick={addFleetRow} 
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-1"
                >
                  <iconify-icon icon="mdi:plus-circle" width="16"></iconify-icon> Add Vehicle
                </button>
             </div>
             
             <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                         <th className="px-4 py-3 min-w-[150px]">Accreditation No.</th>
                         <th className="px-4 py-3 min-w-[150px]">Make/Series</th>
                         <th className="px-4 py-3 min-w-[150px]">Plate / Conduction</th>
                         <th className="px-4 py-3 min-w-[150px]">Body Type</th>
                         <th className="px-4 py-3 w-32">No. of Wheels</th>
                         <th className="px-4 py-3 w-16">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {fleet.map((row, idx) => (
                         <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-2"><input type="text" value={row.accreditationNo} onChange={(e) => updateFleet(idx, 'accreditationNo', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-slate-700" placeholder="Type here..." /></td>
                            <td className="px-4 py-2"><input type="text" value={row.makeSeries} onChange={(e) => updateFleet(idx, 'makeSeries', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-slate-700" placeholder="Type here..." /></td>
                            <td className="px-4 py-2"><input type="text" value={row.plateNo} onChange={(e) => updateFleet(idx, 'plateNo', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-slate-700 font-mono" placeholder="ABC-123" /></td>
                            <td className="px-4 py-2"><input type="text" value={row.bodyType} onChange={(e) => updateFleet(idx, 'bodyType', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-slate-700" placeholder="Type here..." /></td>
                            <td className="px-4 py-2"><input type="text" value={row.noOfWheels} onChange={(e) => updateFleet(idx, 'noOfWheels', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-slate-700" placeholder="4" /></td>
                            <td className="px-4 py-2 text-center">
                               {fleet.length > 1 && (
                                 <button type="button" onClick={() => removeFleetRow(idx)} className="text-red-400 hover:text-red-600 transition-colors">
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
          <div className={cardClass}>
             <h3 className={sectionTitleClass}>
               <iconify-icon icon="mdi:star-face" width="18"></iconify-icon>
               Feedback & Remarks
             </h3>
             <div className="space-y-6">
                <CustomerRatingsTable ratings={ratings} onChange={(k, v) => setRatings((r) => ({ ...r, [k]: v }))} />
                <div>
                   <label className={labelClass}>Recommendation</label>
                   <textarea 
                     value={recommendation} 
                     onChange={(e) => setRecommendation((e.target.value || '').toUpperCase())} 
                     className={`${inputClass} min-h-[100px] uppercase`} 
                     rows="3" 
                     placeholder="Enter official recommendations..." 
                   />
                </div>
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
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl hover:-translate-y-0.5 hover:shadow-emerald-500/30 transition-all font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-transparent"
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