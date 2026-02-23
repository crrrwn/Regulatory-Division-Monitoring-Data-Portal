import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import AppSelect from '../../components/AppSelect'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { PROVINCES } from '../../lib/regions'
import 'iconify-icon'

// Type of Application options (adjust as needed)
const TYPE_OF_APPLICATION_OPTIONS = ['New', 'Renewal', 'Amendment', 'Others']

export default function LivestockHandlersForm() {
  const [controlNo, setControlNo] = useState('')
  const [registrationNo, setRegistrationNo] = useState('')
  const [nameOfEstablishment, setNameOfEstablishment] = useState('')
  const [nameOfApplicant, setNameOfApplicant] = useState('')
  const [address, setAddress] = useState('')
  const [province, setProvince] = useState('')
  const [typeOfApplication, setTypeOfApplication] = useState('')
  const [typeOfApplicationOther, setTypeOfApplicationOther] = useState('')
  const [dateOfApplicationReceivedAndEvaluated, setDateOfApplicationReceivedAndEvaluated] = useState('')
  const [orNumber, setOrNumber] = useState('')
  const [orDate, setOrDate] = useState('')
  const [amountOfFeeCollected, setAmountOfFeeCollected] = useState('')
  const [dateOfInspection, setDateOfInspection] = useState('')
  const [validity, setValidity] = useState('')
  const [ratings, setRatings] = useState({ ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '' })
  const [recommendation, setRecommendation] = useState('')

  const { submit, loading, message } = useFormSubmit('livestockHandlers')

  const buildPayload = () => ({
    controlNo,
    registrationNo,
    nameOfEstablishment,
    nameOfApplicant,
    address,
    province,
    typeOfApplication: typeOfApplication === 'Others' ? (typeOfApplicationOther.trim() || 'Others') : typeOfApplication,
    dateOfApplicationReceivedAndEvaluated,
    orNumber,
    orDate,
    amountOfFeeCollected,
    dateOfInspection,
    validity,
    ...ratings,
    recommendation,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submit(buildPayload())
    setControlNo('')
    setRegistrationNo('')
    setNameOfEstablishment('')
    setNameOfApplicant('')
    setAddress('')
    setProvince('')
    setTypeOfApplication('')
    setTypeOfApplicationOther('')
    setDateOfApplicationReceivedAndEvaluated('')
    setOrNumber('')
    setOrDate('')
    setAmountOfFeeCollected('')
    setDateOfInspection('')
    setValidity('')
    setRatings({ ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '' })
    setRecommendation('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sectionTitleClass = "text-sm font-black text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-3 mb-5 flex items-center gap-2.5 transition-colors duration-300"
  const labelClass = "block text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-1.5 transition-colors duration-200"
  const inputClass = "w-full px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c]"

  return (
    <FormLayout title="Livestock & Poultry Handlers">
      <div className="max-w-5xl mx-auto pb-10">

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
                  Application for Livestock, Poultry, and By-Products Handlers License. Fields connected to View Records.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="livestock-handlers-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:file-document-edit-outline" width="18" class="opacity-90"></iconify-icon>
              Application Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>No.</label>
                <input type="text" value={controlNo} onChange={(e) => setControlNo(e.target.value)} className={inputClass} placeholder="Control / Reference No." />
              </div>
              <div>
                <label className={labelClass}>Registration No.</label>
                <input type="text" value={registrationNo} onChange={(e) => setRegistrationNo(e.target.value)} className={inputClass} placeholder="Registration No." />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Name of Establishment</label>
                <input type="text" value={nameOfEstablishment} onChange={(e) => setNameOfEstablishment(e.target.value)} className={inputClass} placeholder="Name of Establishment" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Name of Applicant</label>
                <input type="text" value={nameOfApplicant} onChange={(e) => setNameOfApplicant(e.target.value)} className={inputClass} placeholder="Name of Applicant" />
              </div>
              <div>
                <label className={labelClass}>Province</label>
                <AppSelect value={province} onChange={setProvince} placeholder="Select Province" options={[{ value: '', label: 'Select Province' }, ...PROVINCES.map((p) => ({ value: p, label: p }))]} aria-label="Province" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} placeholder="Complete Address" />
              </div>
              <div>
                <label className={labelClass}>Type of Application</label>
                <AppSelect
                  value={typeOfApplication}
                  onChange={(v) => { setTypeOfApplication(v); if (v !== 'Others') setTypeOfApplicationOther('') }}
                  placeholder="Select Type"
                  options={[{ value: '', label: 'Select Type of Application' }, ...TYPE_OF_APPLICATION_OPTIONS.map((o) => ({ value: o, label: o }))]}
                  aria-label="Type of Application"
                />
                {typeOfApplication === 'Others' && (
                  <input
                    type="text"
                    value={typeOfApplicationOther}
                    onChange={(e) => setTypeOfApplicationOther(e.target.value)}
                    className={`${inputClass} mt-2`}
                    placeholder="Please specify (type here)..."
                  />
                )}
              </div>
              <div>
                <label className={labelClass}>Date of Application Received & Evaluated</label>
                <input type="date" value={dateOfApplicationReceivedAndEvaluated} onChange={(e) => setDateOfApplicationReceivedAndEvaluated(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>OR Number</label>
                <input type="text" value={orNumber} onChange={(e) => setOrNumber(e.target.value)} className={inputClass} placeholder="Official Receipt Number" />
              </div>
              <div>
                <label className={labelClass}>OR Date</label>
                <input type="date" value={orDate} onChange={(e) => setOrDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Amount of Fee Collected</label>
                <input type="text" value={amountOfFeeCollected} onChange={(e) => setAmountOfFeeCollected(e.target.value)} className={inputClass} placeholder="Amount" />
              </div>
              <div>
                <label className={labelClass}>Date of Inspection</label>
                <input type="date" value={dateOfInspection} onChange={(e) => setDateOfInspection(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Validity</label>
                <input type="date" value={validity} onChange={(e) => setValidity(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* --- EVALUATION & REMARKS (connected to View Records Edit) --- */}
          <div className="livestock-handlers-section bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
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
                  rows={3}
                  placeholder="Enter official recommendations..."
                />
              </div>
            </div>
          </div>

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
