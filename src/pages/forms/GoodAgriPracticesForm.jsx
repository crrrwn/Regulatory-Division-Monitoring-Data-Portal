import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { PROVINCES } from '../../lib/regions'
import 'iconify-icon'

const FORM_TYPES = [
  { value: 'gapCertification', label: 'GAP Certification Form' },
  { value: 'monitoring', label: 'Monitoring of GAP Certified Farmer' },
]

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied', 'Certified']

export default function GoodAgriPracticesForm() {
  const [formType, setFormType] = useState('')
  const [controlNo, setControlNo] = useState('')
  // GAP Certification fields
  const [dateOfRequest, setDateOfRequest] = useState('')
  const [nameOfApplicant, setNameOfApplicant] = useState('')
  const [location, setLocation] = useState('')
  const [province, setProvince] = useState('')
  const [area, setArea] = useState('')
  const [crop, setCrop] = useState('')
  const [dateOfPreAssessment, setDateOfPreAssessment] = useState('')
  const [remarks, setRemarks] = useState('')
  const [dateOfEndorsementToBPI, setDateOfEndorsementToBPI] = useState('')
  const [dateOfFinalInspection, setDateOfFinalInspection] = useState('')
  const [status, setStatus] = useState('')
  // Monitoring fields
  const [dateOfMonitoring, setDateOfMonitoring] = useState('')
  const [nameOfFarmer, setNameOfFarmer] = useState('')
  const [certificateNumber, setCertificateNumber] = useState('')
  const [certificateValidity, setCertificateValidity] = useState('')
  // Shared
  const [ratings, setRatings] = useState({ ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '' })
  const [recommendation, setRecommendation] = useState('')

  const { submit, loading, message } = useFormSubmit('goodAgriPractices')

  const buildPayload = () => {
    const base = { formType, controlNo, location, province, area, remarks, ...ratings, recommendation }
    if (formType === 'gapCertification') {
      return {
        ...base,
        dateOfRequest,
        nameOfApplicant,
        crop,
        dateOfPreAssessment,
        dateOfEndorsementToBPI,
        dateOfFinalInspection,
        status,
      }
    }
    if (formType === 'monitoring') {
      return {
        ...base,
        dateOfMonitoring,
        nameOfFarmer,
        certificateNumber,
        certificateValidity,
      }
    }
    return base
  }

  const resetForm = () => {
    setControlNo('')
    setDateOfRequest('')
    setNameOfApplicant('')
    setLocation('')
    setProvince('')
    setArea('')
    setCrop('')
    setDateOfPreAssessment('')
    setRemarks('')
    setDateOfEndorsementToBPI('')
    setDateOfFinalInspection('')
    setStatus('')
    setDateOfMonitoring('')
    setNameOfFarmer('')
    setCertificateNumber('')
    setCertificateValidity('')
    setRatings({ ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '' })
    setRecommendation('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formType) return
    await submit(buildPayload())
    resetForm()
    setFormType('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sectionTitleClass = "text-sm font-black text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-3 mb-5 flex items-center gap-2.5 transition-colors duration-300"
  const labelClass = "block text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-1.5 transition-colors duration-200"
  const inputClass = "w-full px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c]"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y`

  return (
    <FormLayout title="Good Agricultural Practices (GAP) Unit">
      <div className="max-w-5xl mx-auto pb-10">

        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20 shrink-0">
                <iconify-icon icon="mdi:leaf" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Good Agricultural Practices</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Select form type: GAP Certification or Monitoring of GAP Certified Farmer. Connected to View Records.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- FORM TYPE SELECTOR (Admin selects which form) --- */}
          <div className="good-agri-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:form-select" width="18" class="opacity-90"></iconify-icon>
              Select Form Type
            </h3>
            <div className="flex flex-wrap gap-4">
              {FORM_TYPES.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex-1 min-w-[260px] ${formType === value ? 'border-[#1e4d2b] bg-[#f0f5ee] text-[#1e4d2b] shadow-md ring-2 ring-[#1e4d2b]/30' : 'border-[#e8e0d4] hover:border-[#1e4d2b]/40 hover:bg-[#faf8f5] text-[#5c574f]'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formType === value ? 'border-[#1e4d2b]' : 'border-[#e8e0d4]'}`}>
                    {formType === value && <div className="w-2.5 h-2.5 bg-[#1e4d2b] rounded-full" />}
                  </div>
                  <input type="radio" name="formType" value={value} checked={formType === value} onChange={() => setFormType(value)} className="hidden" />
                  <span className="font-semibold text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {formType && (
            <>
              {/* --- GAP CERTIFICATION FORM FIELDS --- */}
              {formType === 'gapCertification' && (
                <div className="good-agri-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                  <h3 className={sectionTitleClass}>
                    <iconify-icon icon="mdi:certificate-outline" width="18" class="opacity-90"></iconify-icon>
                    GAP Certification Form
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className={labelClass}>No.</label><input type="text" value={controlNo} onChange={(e) => setControlNo(e.target.value)} className={inputClass} placeholder="Control / Reference No." /></div>
                    <div><label className={labelClass}>Date of Request</label><input type="date" value={dateOfRequest} onChange={(e) => setDateOfRequest(e.target.value)} className={inputClass} /></div>
                    <div className="sm:col-span-2"><label className={labelClass}>Name of Applicant</label><input type="text" value={nameOfApplicant} onChange={(e) => setNameOfApplicant(e.target.value)} className={inputClass} placeholder="Full Name" /></div>
                    <div><label className={labelClass}>Province</label><AppSelect value={province} onChange={setProvince} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...PROVINCES.map((p) => ({ value: p, label: p }))]} aria-label="Province" /></div>
                    <div className="sm:col-span-2"><label className={labelClass}>Location</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="Farm / Address" /></div>
                    <div><label className={labelClass}>Area (ha)</label><input type="text" value={area} onChange={(e) => setArea(e.target.value)} className={inputClass} placeholder="e.g. 5.00" /></div>
                    <div><label className={labelClass}>Crop</label><input type="text" value={crop} onChange={(e) => setCrop(e.target.value)} className={inputClass} placeholder="Crop / Commodity" /></div>
                    <div><label className={labelClass}>Date of Pre-assessment</label><input type="date" value={dateOfPreAssessment} onChange={(e) => setDateOfPreAssessment(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Date of Endorsement to BPI</label><input type="date" value={dateOfEndorsementToBPI} onChange={(e) => setDateOfEndorsementToBPI(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Date of Final Inspection</label><input type="date" value={dateOfFinalInspection} onChange={(e) => setDateOfFinalInspection(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Status</label><AppSelect value={status} onChange={setStatus} placeholder="Select Status" options={[{ value: '', label: 'Select Status' }, ...STATUS_OPTIONS.map((o) => ({ value: o, label: o }))]} aria-label="Status" /></div>
                    <div className="sm:col-span-2"><label className={labelClass}>Remarks</label><textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className={`${inputClass} min-h-[80px] resize-y`} rows={2} placeholder="Remarks..." /></div>
                  </div>
                </div>
              )}

              {/* --- MONITORING OF GAP CERTIFIED FARMER FIELDS --- */}
              {formType === 'monitoring' && (
                <div className="good-agri-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                  <h3 className={sectionTitleClass}>
                    <iconify-icon icon="mdi:clipboard-check-outline" width="18" class="opacity-90"></iconify-icon>
                    Monitoring of GAP Certified Farmer
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className={labelClass}>No.</label><input type="text" value={controlNo} onChange={(e) => setControlNo(e.target.value)} className={inputClass} placeholder="Control / Reference No." /></div>
                    <div><label className={labelClass}>Date of Monitoring</label><input type="date" value={dateOfMonitoring} onChange={(e) => setDateOfMonitoring(e.target.value)} className={inputClass} /></div>
                    <div className="sm:col-span-2"><label className={labelClass}>Name of Farmer</label><input type="text" value={nameOfFarmer} onChange={(e) => setNameOfFarmer(e.target.value)} className={inputClass} placeholder="Name of Farmer" /></div>
                    <div><label className={labelClass}>Province</label><AppSelect value={province} onChange={setProvince} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...PROVINCES.map((p) => ({ value: p, label: p }))]} aria-label="Province" /></div>
                    <div className="sm:col-span-2"><label className={labelClass}>Location</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="Location" /></div>
                    <div><label className={labelClass}>Area (ha)</label><input type="text" value={area} onChange={(e) => setArea(e.target.value)} className={inputClass} placeholder="e.g. 5.00" /></div>
                    <div><label className={labelClass}>Certificate Number</label><input type="text" value={certificateNumber} onChange={(e) => setCertificateNumber(e.target.value)} className={inputClass} placeholder="Certificate No." /></div>
                    <div><label className={labelClass}>Certificate Validity</label><input type="text" value={certificateValidity} onChange={(e) => setCertificateValidity(e.target.value)} className={inputClass} placeholder="Validity date or period" /></div>
                    <div className="sm:col-span-2"><label className={labelClass}>Remarks</label><textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className={`${inputClass} min-h-[80px] resize-y`} rows={2} placeholder="Remarks..." /></div>
                  </div>
                </div>
              )}

              {/* --- EVALUATION & REMARKS (both forms) --- */}
              <div className="good-agri-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                <h3 className={sectionTitleClass}>
                  <iconify-icon icon="mdi:star-face" width="18" class="opacity-90"></iconify-icon>
                  Evaluation & Remarks
                </h3>
                <div className="space-y-6">
                  <CustomerRatingsTable ratings={ratings} onChange={(k, v) => setRatings((r) => ({ ...r, [k]: v }))} />
                  <div>
                    <label className={labelClass}>Recommendation</label>
                    <textarea value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className={`${inputClass} min-h-[100px]`} rows={3} placeholder="Enter recommendation..." />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            {message && (
              <div className={`mb-4 mx-auto max-w-2xl p-4 rounded-xl shadow-lg flex items-center gap-3 border-l-4 ${message.type === 'success' ? 'bg-[#1e4d2b] text-white border-[#153019]' : 'bg-red-500 text-white border-red-700'}`}>
                <iconify-icon icon={message.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} width="24"></iconify-icon>
                <p className="font-medium">{message.text}</p>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !formType}
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
