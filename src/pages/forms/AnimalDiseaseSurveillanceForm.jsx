import { useState } from 'react'
import { 
  Activity, 
  Building2, 
  MapPin, 
  Calendar, 
  Syringe, 
  TestTube2, 
  FileOutput, 
  ClipboardList, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { PROVINCES } from '../../lib/regions'
import 'iconify-icon'

const initialState = {
  clientName: '',
  typeOfDiseaseSurveillance: '',
  purpose: '',
  province: '',
  address: '',
  dateOfRequest: '',
  dateOfSurveillance: '',
  numberOfSamples: '',
  dateSubmittedToLab: '',
  dateOfEndorsementToDA: '',
  remarks: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function AnimalDiseaseSurveillanceForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('animalDiseaseSurveillance')
  
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
    <FormLayout title="Animal Disease Surveillance">
      <div className="max-w-5xl mx-auto pb-10 min-w-0 w-full">
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20 shrink-0">
                <iconify-icon icon="mdi:stethoscope" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Animal Disease Surveillance</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Client details, specimen collection, and lab endorsement tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* --- Section 1: Client & Purpose --- */}
        <div className="animal-disease-surveillance-section animal-disease-surveillance-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Building2 className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Client & Surveillance Details
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-8">
              <label className={labelClass}>Name of LGU / Client / Farm</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.clientName} onChange={updateUpper('clientName')} placeholder="Name of LGU, Client or Farm" required className={`${inputClass} pl-10`} />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className={labelClass}>Date of Request</label>
              <div className="relative">
                 <input 
                  type="date" 
                  value={form.dateOfRequest} 
                  onChange={(e) => update('dateOfRequest', e.target.value)} 
                  className={inputClass} 
                  required 
                />
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
                <input type="text" value={form.address} onChange={updateUpper('address')} placeholder="Complete Address" className={`${inputClass} pl-10`} />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Type of Disease Surveillance</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Activity className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.typeOfDiseaseSurveillance} onChange={updateUpper('typeOfDiseaseSurveillance')} placeholder="e.g. Avian Influenza, ASF, Rabies" className={`${inputClass} pl-10`} />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Purpose</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                </div>
                <input type="text" value={form.purpose} onChange={updateUpper('purpose')} placeholder="Reason for surveillance" className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2: Operation Timeline (Field vs Lab) --- */}
        <div className="animal-disease-surveillance-section animal-disease-surveillance-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Syringe className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Operation & Sample Data
          </h3>

          <div className="grid sm:grid-cols-2 gap-8">
            {/* Field Activities */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#1e4d2b] font-bold text-sm uppercase tracking-wider mb-2">
                <Syringe className="w-4 h-4" /> Field Activities
              </div>
              <div className="bg-[#1e4d2b]/5 p-5 rounded-xl border-2 border-[#1e4d2b]/20 space-y-4">
                <div>
                  <label className={labelClass}>Date of Surveillance (Blood Coll.)</label>
                  <input 
                    type="date" 
                    value={form.dateOfSurveillance} 
                    onChange={(e) => update('dateOfSurveillance', e.target.value)} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>No. of Samples Collected</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <TestTube2 className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
                    </div>
                    <input type="text" value={form.numberOfSamples} onChange={updateUpper('numberOfSamples')} placeholder="e.g. 50 Vials" className={`${inputClass} pl-10`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Lab & Admin */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#1e4d2b] font-bold text-sm uppercase tracking-wider mb-2">
                <FileOutput className="w-4 h-4" /> Lab & Admin
              </div>
              <div className="bg-[#1e4d2b]/5 p-5 rounded-xl border-2 border-[#b8a066]/30 space-y-4">
                <div>
                  <label className={labelClass}>Date Submitted to Lab</label>
                  <input 
                    type="date" 
                    value={form.dateSubmittedToLab} 
                    onChange={(e) => update('dateSubmittedToLab', e.target.value)} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Date Endorsed to DA-BAI</label>
                  <input 
                    type="date" 
                    value={form.dateOfEndorsementToDA} 
                    onChange={(e) => update('dateOfEndorsementToDA', e.target.value)} 
                    className={inputClass} 
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Remarks / Observations</label>
              <textarea 
                value={form.remarks} 
                onChange={updateUpper('remarks')} 
                className={textAreaClass} 
                placeholder="Additional notes, clinical signs observed, etc..." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 3: Feedback (Table) --- */}
        <div className="animal-disease-surveillance-section animal-disease-surveillance-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <ClipboardList className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Customer Feedback
          </h3>
          
          <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />

          <div className="mt-6">
            <label className={labelClass}>Recommendation</label>
            <textarea 
              value={form.recommendation} 
              onChange={updateUpper('recommendation')} 
              className={textAreaClass} 
              placeholder="Final recommendations..." 
            />
          </div>
        </div>

        {/* --- Submit Section --- */}
        <div className="animal-disease-surveillance-section animal-disease-surveillance-section-4 pt-2 flex flex-col items-end gap-4">
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
                SUBMIT SURVEILLANCE DATA
              </>
            )}
          </button>
        </div>

      </form>
      </div>
    </FormLayout>
  )
}