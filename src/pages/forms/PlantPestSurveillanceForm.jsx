import { useState } from 'react'
import { 
  Bug, 
  Sprout, 
  User, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  ClipboardList, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Scan
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { PROVINCES } from '../../lib/regions'
import 'iconify-icon'

const initialState = {
  dateOfRequestAndCollection: '',
  farmerName: '',
  province: '',
  address: '',
  contactNumber: '',
  gpsLocation: '',
  crop: '',
  variety: '',
  datePlanted: '',
  areaPlanted: '',
  areaAffected: '',
  percentInfestation: '',
  pestsDiseases: '',
  remarks: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function PlantPestSurveillanceForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('plantPestSurveillance')
  
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

  // --- Theme: green #1e4d2b, neutral #5c574f, border #e8e0d4 ---
  const sectionTitleClass = "text-sm font-black text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-3 mb-5 flex items-center gap-2.5 transition-colors duration-300"
  const labelClass = "block text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-1.5 transition-colors duration-200"
  const inputClass = "w-full min-w-0 px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c] uppercase"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y normal-case placeholder:normal-case`

  return (
    <FormLayout title="Plant Pest and Disease Surveillance">
      <div className="max-w-5xl mx-auto pb-10 min-w-0 w-full">
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20 shrink-0">
                <iconify-icon icon="mdi:bug-outline" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Plant Pest & Disease Surveillance</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Farmer and crop surveillance for pests and diseases.
                </p>
              </div>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* --- Section 1: Farmer & Location Profile --- */}
        <div className="plant-pest-surveillance-section plant-pest-surveillance-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <User className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Farmer & Location Profile
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-4">
              <label className={labelClass}>Date of Request / Collection</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={form.dateOfRequestAndCollection} 
                  onChange={(e) => update('dateOfRequestAndCollection', e.target.value)} 
                  className={inputClass} 
                  required 
                />
              </div>
            </div>

            <div className="sm:col-span-8">
              <label className={labelClass}>Name of Farmer</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.farmerName} onChange={updateUpper('farmerName')} placeholder="Full Name" className={`${inputClass} pl-10`} />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Province</label>
              <AppSelect value={form.province} onChange={(v) => update('province', v)} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...PROVINCES.map((p) => ({ value: p, label: p }))]} aria-label="Province" />
            </div>
            <div className="sm:col-span-12">
              <label className={labelClass}>Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.address} onChange={updateUpper('address')} placeholder="Complete Farm Address" className={`${inputClass} pl-10`} />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Contact Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.contactNumber} onChange={updateUpper('contactNumber')} placeholder="09XX-XXX-XXXX" className={`${inputClass} pl-10`} />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>GPS Location</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Scan className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.gpsLocation} onChange={updateUpper('gpsLocation')} placeholder="Lat, Long (e.g., 13.41, 121.18)" className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2: Crop Information --- */}
        <div className="plant-pest-surveillance-section plant-pest-surveillance-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Sprout className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Crop Information
          </h3>
          <div className="grid sm:grid-cols-4 gap-6">
            <div className="sm:col-span-2">
              <label className={labelClass}>Crop</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sprout className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.crop} onChange={updateUpper('crop')} placeholder="e.g. Rice" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Variety</label>
              <input 
                type="text" 
                value={form.variety} 
                onChange={updateUpper('variety')} 
                className={inputClass} 
                placeholder="e.g. NSIC Rc 222" 
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Date Planted</label>
              <input 
                type="date" 
                value={form.datePlanted} 
                onChange={(e) => update('datePlanted', e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Area Planted (Ha)</label>
              <input 
                type="text" 
                value={form.areaPlanted} 
                onChange={updateUpper('areaPlanted')} 
                className={inputClass} 
                placeholder="Total Hectares" 
              />
            </div>
          </div>
        </div>

        {/* --- Section 3: Pest & Disease Findings --- */}
        <div className="plant-pest-surveillance-section plant-pest-surveillance-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Bug className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Surveillance Findings
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-12">
              <label className={labelClass}>Observed Pests / Diseases</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AlertTriangle className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input 
                  type="text" 
                  value={form.pestsDiseases} 
                  onChange={updateUpper('pestsDiseases')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="e.g. Fall Armyworm, Rice Blast, Stem Borer" 
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Area Affected (Ha)</label>
              <input 
                type="text" 
                value={form.areaAffected} 
                onChange={updateUpper('areaAffected')} 
                className={inputClass} 
                placeholder="Size of damage" 
              />
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Percent Infestation (%)</label>
              <input 
                type="text" 
                value={form.percentInfestation} 
                onChange={updateUpper('percentInfestation')} 
                className={inputClass} 
                placeholder="e.g. 15%" 
              />
            </div>

            <div className="sm:col-span-12">
              <label className={labelClass}>Remarks / Observations</label>
              <textarea 
                value={form.remarks} 
                onChange={updateUpper('remarks')} 
                className={textAreaClass} 
                placeholder="Additional notes on severity or control measures needed..." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 4: Customer Ratings (Styled Table) --- */}
        <div className="plant-pest-surveillance-section plant-pest-surveillance-section-4 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <ClipboardList className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Feedback & Satisfaction
          </h3>
          
          <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />

          <div className="mt-6">
            <label className={labelClass}>Recommendation</label>
            <textarea 
              value={form.recommendation} 
              onChange={updateUpper('recommendation')} 
              className={textAreaClass} 
              placeholder="Enter final recommendation here..." 
            />
          </div>
        </div>

        {/* --- Submit Section --- */}
        <div className="plant-pest-surveillance-section plant-pest-surveillance-section-5 pt-2 flex flex-col items-end gap-4">
          {message && (
            <div className={`animal-feed-message-enter w-full max-w-2xl p-4 rounded-xl shadow-lg flex items-center gap-3 border-l-4 ${
              message.type === 'success' 
                ? 'bg-[#1e4d2b] text-white border-[#153019]' 
                : 'bg-red-500 text-white border-red-700'
            }`}>
              <iconify-icon icon={message.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} width="24"></iconify-icon>
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto min-h-[44px] px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] text-white rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#1e4d2b]/25 hover:shadow-xl hover:shadow-[#1e4d2b]/35 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] touch-manipulation transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <iconify-icon icon="mdi:loading" width="20" class="animate-spin"></iconify-icon>
                Processing...
              </>
            ) : (
              <>
                <iconify-icon icon="mdi:content-save-check" width="22"></iconify-icon>
                SUBMIT SURVEILLANCE REPORT
              </>
            )}
          </button>
        </div>

      </form>
      </div>
    </FormLayout>
  )
}