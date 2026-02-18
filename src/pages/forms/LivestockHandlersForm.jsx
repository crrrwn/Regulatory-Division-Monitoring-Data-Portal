import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
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

  // --- STYLING CONSTANTS ---
  const sectionTitleClass = "text-sm font-bold text-emerald-800 uppercase tracking-wide border-b border-emerald-100 pb-3 mb-5 flex items-center gap-2"
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
  const cardClass = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6"

  // Helper for rendering Matrix Tables
  const MatrixTable = ({ title, cols, data, setter, icon }) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mb-6">
      <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
        <iconify-icon icon={icon} class="text-emerald-600 text-lg"></iconify-icon>
        <h4 className="font-bold text-emerald-800 text-sm uppercase tracking-wide">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 w-1/3">Commodity</th>
              <th className="px-4 py-3">Volume / Head Count</th>
              <th className="px-4 py-3">Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cols.map((col) => (
              <tr key={col} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-2 font-medium text-slate-700">{col}</td>
                <td className="px-4 py-2">
                  <input type="text" placeholder="0" value={data[col].volume} onChange={(e) => updateMatrix(setter, col, 'volume', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
                </td>
                <td className="px-4 py-2">
                  <input type="text" placeholder="Daily/Weekly" value={data[col].frequency} onChange={(e) => updateMatrix(setter, col, 'frequency', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <FormLayout title="Livestock & Poultry Handlers">
      <div className="max-w-5xl mx-auto pb-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Handlers Registration</h2>
          <p className="text-sm text-slate-500 mt-1">
            Application for Livestock, Poultry, and By-Products Handlers License.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* --- SECTION 1: OWNERSHIP TYPE --- */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:domain" width="18"></iconify-icon>
              Business Ownership
            </h3>
            <div className="flex flex-wrap gap-4">
              {OWNERSHIP_OPTIONS.map((o) => (
                <label key={o} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all flex-1 min-w-[250px] ${ownershipType === o ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-md ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${ownershipType === o ? 'border-emerald-600' : 'border-slate-300'}`}>
                    {ownershipType === o && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                  </div>
                  <input type="radio" name="ownership" value={o} checked={ownershipType === o} onChange={() => setOwnershipType(o)} className="hidden" />
                  <span className="font-medium text-sm">{o}</span>
                </label>
              ))}
            </div>
          </div>

          {/* --- SECTION 2: IDENTITY DETAILS --- */}
          {(ownershipType === 'Single Proprietorship/Individual' || ownershipType === 'Corporation/Coop/Assn') && (
            <div className={`${cardClass} animate-fade-in-up`}>
              <h3 className={sectionTitleClass}>
                <iconify-icon icon="mdi:card-account-details-outline" width="18"></iconify-icon>
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
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1"><iconify-icon icon="mdi:account-tie"></iconify-icon> Authorized Representative</p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div><label className={labelClass}>Last Name</label><input type="text" value={repName.last} onChange={(e) => setRepName((s) => ({ ...s, last: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm" /></div>
                      <div><label className={labelClass}>First Name</label><input type="text" value={repName.first} onChange={(e) => setRepName((s) => ({ ...s, first: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm" /></div>
                      <div><label className={labelClass}>MI</label><input type="text" value={repName.mi} onChange={(e) => setRepName((s) => ({ ...s, mi: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm" maxLength={2} /></div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Type of Business</label>
                    <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className={inputClass}>
                      <option value="">Select Business Type</option>
                      {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- SECTION 3: LOCATION & CONTACT --- */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:map-marker-radius-outline" width="18"></iconify-icon>
              Location & Contact
            </h3>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div><label className={labelClass}>Region</label><select value={address.region} onChange={(e) => setAddress((a) => ({ ...a, region: e.target.value }))} className={inputClass}><option value="">Select Region</option>{REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
              <div><label className={labelClass}>Province</label><select value={address.province} onChange={(e) => setAddress((a) => ({ ...a, province: e.target.value }))} className={inputClass}><option value="">Select Province</option>{provinces.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
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
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:shape-outline" width="18"></iconify-icon>
              Handler Classification
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Type of Applicant</label>
                <div className="relative">
                  <select value={applicantType} onChange={(e) => setApplicantType(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Select Applicant Type</option>
                    {APPLICANT_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400"><iconify-icon icon="mdi:chevron-down"></iconify-icon></div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Handler Category</label>
                <div className="relative">
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Select Category</option>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400"><iconify-icon icon="mdi:chevron-down"></iconify-icon></div>
                </div>
              </div>
            </div>
          </div>

          {/* --- SECTION 5: INVENTORY MATRICES --- */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:warehouse" width="18"></iconify-icon>
              Inventory Matrix
            </h3>
            
            <div className="space-y-6">
              <MatrixTable title="Livestock Inventory" cols={LIVESTOCK_COLS} data={livestock} setter={setLivestock} icon="mdi:cow" />
              <MatrixTable title="Poultry Inventory" cols={POULTRY_COLS} data={poultry} setter={setPoultry} icon="mdi:duck" />
              <MatrixTable title="By-Products Inventory" cols={BYPRODUCTS_COLS} data={byProducts} setter={setByProducts} icon="mdi:egg-easter" />
            </div>

            <div className="mt-6">
               <label className={labelClass}>Origin / Area Coverage (Region)</label>
               <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass}>
                 <option value="">Select Region Coverage</option>
                 {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
               </select>
            </div>
          </div>

          {/* --- SECTION 6: FEEDBACK --- */}
          <div className={cardClass}>
             <h3 className={sectionTitleClass}>
               <iconify-icon icon="mdi:star-face" width="18"></iconify-icon>
               Evaluation & Remarks
             </h3>
             <div className="space-y-6">
               <CustomerRatingsTable ratings={ratings} onChange={(k, v) => setRatings((r) => ({ ...r, [k]: v }))} />
               
               <div>
                 <label className={labelClass}>Recommendation / Action Taken</label>
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