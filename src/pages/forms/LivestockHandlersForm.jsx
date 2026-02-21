import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { REGIONS, PROVINCES } from '../../lib/regions'
import 'iconify-icon'

const OWNERSHIP_OPTIONS = ['Single Proprietorship/Individual', 'Corporation/Coop/Assn']
const BUSINESS_TYPES = ['Partnership', 'Corp', 'Gov', 'Coop', 'Assn', 'Club']
const APPLICANT_TYPES = ['Livestock Dealer', 'Poultry Dealer', 'By-Products Dealer', 'Birds/Pigeon Racers', 'Traders/Rep', 'Hauler', 'Others']
const CATEGORY_OPTIONS = ['Livestock Handler', 'Poultry Handler', 'By-Products Handler', 'Others']

const LIVESTOCK_COLS = ['Cattle', 'Carabao', 'Hogs', 'Goats', 'Horses']
const POULTRY_COLS = ['Chicken', 'DOC', 'Game Fowls']
const BYPRODUCTS_COLS = ['Eggs', 'Balut', 'Hides', 'Skin', 'Milk', 'Manure']

const emptyMatrix = (cols) => Object.fromEntries(cols.map((c) => [c, { volume: '', frequency: '' }]))

// Defined outside component so inputs are not remounted on every keystroke (typing stays smooth)
function MatrixTable({ title, cols, data, updateMatrix, setter, icon }) {
  return (
    <div className="rounded-xl overflow-hidden border-2 border-[#e8e0d4] bg-white shadow-sm mb-6 hover:shadow-md hover:border-[#1e4d2b]/20 transition-all duration-400 ease-[cubic-bezier(0.33,1,0.68,1)]">
      <div className="bg-gradient-to-r from-[#1e4d2b]/10 to-[#b8a066]/10 px-4 py-3 border-b-2 border-[#1e4d2b]/15 flex items-center gap-2">
        <iconify-icon icon={icon} class="text-[#1e4d2b] text-lg opacity-90"></iconify-icon>
        <h4 className="font-bold text-[#1e4d2b] text-sm uppercase tracking-wide">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#faf8f5] text-[#5c574f] font-semibold border-b border-[#e8e0d4]">
            <tr>
              <th className="px-4 py-3 w-1/3">Commodity</th>
              <th className="px-4 py-3">Volume / Head Count</th>
              <th className="px-4 py-3">Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e0d4]">
            {cols.map((col) => (
              <tr key={col} className="hover:bg-[#faf8f5]/80 transition-colors duration-200">
                <td className="px-4 py-2 font-medium text-[#1e4d2b]">{col}</td>
                <td className="px-4 py-2">
                  <input type="text" placeholder="0" value={data[col].volume} onChange={(e) => updateMatrix(setter, col, 'volume', e.target.value)} className="w-full bg-white border-2 border-[#e8e0d4] rounded-lg px-3 py-1.5 text-sm focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/20 outline-none transition-all duration-300" />
                </td>
                <td className="px-4 py-2">
                  <input type="text" placeholder="Daily/Weekly" value={data[col].frequency} onChange={(e) => updateMatrix(setter, col, 'frequency', e.target.value)} className="w-full bg-white border-2 border-[#e8e0d4] rounded-lg px-3 py-1.5 text-sm focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/20 outline-none transition-all duration-300" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function LivestockHandlersForm() {
  const [ownershipType, setOwnershipType] = useState('')
  const [singleName, setSingleName] = useState({ last: '', first: '', mi: '' })
  const [companyName, setCompanyName] = useState('')
  const [repName, setRepName] = useState({ last: '', first: '', mi: '' })
  const [address, setAddress] = useState({ barangay: '', cityMuni: '', province: '', region: '' })
  const [businessType, setBusinessType] = useState('')
  const [contact, setContact] = useState({ tin: '', contactNo: '', email: '' })
  const [applicantType, setApplicantType] = useState('')
  const [category, setCategory] = useState('')
  const [livestock, setLivestock] = useState(() => emptyMatrix(LIVESTOCK_COLS))
  const [poultry, setPoultry] = useState(() => emptyMatrix(POULTRY_COLS))
  const [byProducts, setByProducts] = useState(() => emptyMatrix(BYPRODUCTS_COLS))
  const [region, setRegion] = useState('')
  const [ratings, setRatings] = useState({ ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '' })
  const [recommendation, setRecommendation] = useState('')
  const { submit, loading, message } = useFormSubmit('livestockHandlers')

  const provinces = PROVINCES

  const buildPayload = () => ({
    ownershipType,
    singleName,
    companyName,
    repName,
    address,
    businessType,
    contact,
    applicantType,
    category,
    livestock,
    poultry,
    byProducts,
    region,
    province: address.province,
    ...ratings,
    recommendation,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submit(buildPayload())
    // Reset logic could be improved with a helper, but keeping as is for now
    setOwnershipType('')
    setSingleName({ last: '', first: '', mi: '' })
    setCompanyName('')
    setRepName({ last: '', first: '', mi: '' })
    setAddress({ barangay: '', cityMuni: '', province: '', region: '' })
    setBusinessType('')
    setContact({ tin: '', contactNo: '', email: '' })
    setApplicantType('')
    setCategory('')
    setLivestock(emptyMatrix(LIVESTOCK_COLS))
    setPoultry(emptyMatrix(POULTRY_COLS))
    setByProducts(emptyMatrix(BYPRODUCTS_COLS))
    setRegion('')
    setRatings({ ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '' })
    setRecommendation('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateMatrix = (setter, key, field, value) => {
    setter((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  // --- STYLING (app theme: green #1e4d2b, khaki #b8a066) ---
  const sectionTitleClass = "text-sm font-black text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-3 mb-5 flex items-center gap-2.5 transition-colors duration-300"
  const labelClass = "block text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-1.5 transition-colors duration-200"
  const inputClass = "w-full px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c]"
  const inputClassSmall = "w-full px-3 py-2 bg-white border-2 border-[#e8e0d4] rounded-lg text-sm text-[#1e4d2b] focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 placeholder:text-[#8a857c]"

  return (
    <FormLayout title="Livestock & Poultry Handlers">
      <div className="max-w-5xl mx-auto pb-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20 shrink-0">
                <iconify-icon icon="mdi:cow" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Handlers Registration</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Application for Livestock, Poultry, and By-Products Handlers License.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- SECTION 1: OWNERSHIP TYPE --- */}
          <div className="livestock-handlers-section livestock-handlers-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:domain" width="18" class="opacity-90"></iconify-icon>
              Business Ownership
            </h3>
            <div className="flex flex-wrap gap-4">
              {OWNERSHIP_OPTIONS.map((o) => (
                <label key={o} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] flex-1 min-w-[250px] ${ownershipType === o ? 'border-[#1e4d2b] bg-[#f0f5ee] text-[#1e4d2b] shadow-md ring-2 ring-[#1e4d2b]/30' : 'border-[#e8e0d4] hover:border-[#1e4d2b]/40 hover:bg-[#faf8f5] text-[#5c574f]'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${ownershipType === o ? 'border-[#1e4d2b]' : 'border-[#e8e0d4]'}`}>
                    {ownershipType === o && <div className="w-2.5 h-2.5 bg-[#1e4d2b] rounded-full" />}
                  </div>
                  <input type="radio" name="ownership" value={o} checked={ownershipType === o} onChange={() => setOwnershipType(o)} className="hidden" />
                  <span className="font-semibold text-sm">{o}</span>
                </label>
              ))}
            </div>
          </div>

          {/* --- SECTION 2: IDENTITY DETAILS --- */}
          {(ownershipType === 'Single Proprietorship/Individual' || ownershipType === 'Corporation/Coop/Assn') && (
            <div className="livestock-handlers-section livestock-handlers-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
              <h3 className={sectionTitleClass}>
                <iconify-icon icon="mdi:card-account-details-outline" width="18" class="opacity-90"></iconify-icon>
                Identity Information
              </h3>
              
              {ownershipType === 'Single Proprietorship/Individual' && (
                <div className="grid sm:grid-cols-3 gap-5">
                  <div><label className={labelClass}>Last Name</label><input type="text" value={singleName.last} onChange={(e) => setSingleName((s) => ({ ...s, last: e.target.value }))} className={inputClass} required /></div>
                  <div><label className={labelClass}>First Name</label><input type="text" value={singleName.first} onChange={(e) => setSingleName((s) => ({ ...s, first: e.target.value }))} className={inputClass} required /></div>
                  <div><label className={labelClass}>Middle Initial</label><input type="text" value={singleName.mi} onChange={(e) => setSingleName((s) => ({ ...s, mi: e.target.value }))} className={inputClass} maxLength={2} /></div>
                </div>
              )}

              {ownershipType === 'Corporation/Coop/Assn' && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Registered Company Name</label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={`${inputClass} font-semibold`} required placeholder="Enter full company name" />
                  </div>
                  
                  <div className="bg-[#faf8f5]/80 p-4 rounded-xl border-2 border-[#e8e0d4] hover:border-[#b8a066]/30 transition-all duration-400 ease-[cubic-bezier(0.33,1,0.68,1)]">
                    <p className="text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-3 flex items-center gap-1.5"><iconify-icon icon="mdi:account-tie" width="14"></iconify-icon> Authorized Representative</p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div><label className={labelClass}>Last Name</label><input type="text" value={repName.last} onChange={(e) => setRepName((s) => ({ ...s, last: e.target.value }))} className={inputClassSmall} /></div>
                      <div><label className={labelClass}>First Name</label><input type="text" value={repName.first} onChange={(e) => setRepName((s) => ({ ...s, first: e.target.value }))} className={inputClassSmall} /></div>
                      <div><label className={labelClass}>MI</label><input type="text" value={repName.mi} onChange={(e) => setRepName((s) => ({ ...s, mi: e.target.value }))} className={inputClassSmall} maxLength={2} /></div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Type of Business</label>
                    <AppSelect value={businessType} onChange={setBusinessType} placeholder="Select Business Type" options={[{ value: '', label: 'Select Business Type' }, ...BUSINESS_TYPES.map((b) => ({ value: b, label: b }))]} aria-label="Business Type" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- SECTION 3: LOCATION & CONTACT --- */}
          <div className="livestock-handlers-section livestock-handlers-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:map-marker-radius-outline" width="18" class="opacity-90"></iconify-icon>
              Location & Contact
            </h3>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div><label className={labelClass}>Region</label><AppSelect value={address.region} onChange={(v) => setAddress((a) => ({ ...a, region: v }))} placeholder="Select Region" options={[{ value: '', label: 'Select Region' }, ...REGIONS.map((r) => ({ value: r, label: r }))]} aria-label="Region" /></div>
              <div><label className={labelClass}>Province</label><AppSelect value={address.province} onChange={(v) => setAddress((a) => ({ ...a, province: v }))} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...provinces.map((p) => ({ value: p, label: p }))]} aria-label="Province" /></div>
              <div><label className={labelClass}>City / Municipality</label><input type="text" value={address.cityMuni} onChange={(e) => setAddress((a) => ({ ...a, cityMuni: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Barangay</label><input type="text" value={address.barangay} onChange={(e) => setAddress((a) => ({ ...a, barangay: e.target.value }))} className={inputClass} /></div>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-5">
              <div><label className={labelClass}>Tax Identification No. (TIN)</label><input type="text" value={contact.tin} onChange={(e) => setContact((c) => ({ ...c, tin: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Contact Number</label><input type="text" value={contact.contactNo} onChange={(e) => setContact((c) => ({ ...c, contactNo: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Email Address</label><input type="email" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} className={inputClass} /></div>
            </div>
          </div>

          {/* --- SECTION 4: CLASSIFICATION --- */}
          <div className="livestock-handlers-section livestock-handlers-section-4 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:shape-outline" width="18" class="opacity-90"></iconify-icon>
              Handler Classification
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Type of Applicant</label>
                <AppSelect value={applicantType} onChange={setApplicantType} placeholder="Select Applicant Type" options={[{ value: '', label: 'Select Applicant Type' }, ...APPLICANT_TYPES.map((a) => ({ value: a, label: a }))]} aria-label="Applicant Type" />
              </div>
              <div>
                <label className={labelClass}>Handler Category</label>
                <AppSelect value={category} onChange={setCategory} placeholder="Select Category" options={[{ value: '', label: 'Select Category' }, ...CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))]} aria-label="Category" />
              </div>
            </div>
          </div>

          {/* --- SECTION 5: INVENTORY MATRICES --- */}
          <div className="livestock-handlers-section livestock-handlers-section-5 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:warehouse" width="18" class="opacity-90"></iconify-icon>
              Inventory Matrix
            </h3>
            
            <div className="space-y-6">
              <MatrixTable title="Livestock Inventory" cols={LIVESTOCK_COLS} data={livestock} setter={setLivestock} updateMatrix={updateMatrix} icon="mdi:cow" />
              <MatrixTable title="Poultry Inventory" cols={POULTRY_COLS} data={poultry} setter={setPoultry} updateMatrix={updateMatrix} icon="mdi:duck" />
              <MatrixTable title="By-Products Inventory" cols={BYPRODUCTS_COLS} data={byProducts} setter={setByProducts} updateMatrix={updateMatrix} icon="mdi:egg-easter" />
            </div>

            <div className="mt-6">
               <label className={labelClass}>Origin / Area Coverage (Region)</label>
               <AppSelect value={region} onChange={setRegion} placeholder="Select Region Coverage" options={[{ value: '', label: 'Select Region Coverage' }, ...REGIONS.map((r) => ({ value: r, label: r }))]} aria-label="Region Coverage" />
            </div>
          </div>

          {/* --- SECTION 6: FEEDBACK --- */}
          <div className="livestock-handlers-section livestock-handlers-section-6 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
             <h3 className={sectionTitleClass}>
               <iconify-icon icon="mdi:star-face" width="18" class="opacity-90"></iconify-icon>
               Evaluation & Remarks
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
          <div className="livestock-handlers-section livestock-handlers-section-7 pt-2">
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