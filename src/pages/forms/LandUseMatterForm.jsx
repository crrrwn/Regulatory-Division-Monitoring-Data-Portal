import { useState } from 'react'
import { 
  Map, 
  User, 
  FileText, 
  Ruler, 
  MapPin, 
  CalendarClock, 
  ClipboardCheck, 
  FileCheck, 
  MessageSquare,
  Save,
  CheckCircle2,
  AlertCircle,
  Hash
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const initialState = {
  controlNo: '',
  nameOfApplicant: '',
  purposeOfApplication: '',
  sizeOfArea: '',
  location: '',
  dateOfRequest: '',
  dateReceivedAndEvaluated: '',
  dateOfReplyToRequest: '',
  dateReceivedByApplicant: '',
  fieldInvestigation: '',
  dateOfEndorsement: '',
  issuanceOfCertificate: '',
  remarks: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function LandUseMatterForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('landUseMatter')
  
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const updateUpper = (key) => (e) => update(key, (e.target.value || '').toUpperCase())

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }

  // --- Design System Classes ---
  const sectionTitleClass = "text-lg font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-gray-400 uppercase"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y`
  
  // Icon wrapper helper for inputs
  const InputWithIcon = ({ icon: Icon, ...props }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <input {...props} className={`${inputClass} pl-10`} />
    </div>
  )

  return (
    <FormLayout title="Land Use Matter (Reclassification)">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
        
        {/* --- Section 1: Application Profile --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <FileText className="w-5 h-5" /> Application Profile
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-4">
              <label className={labelClass}>Control No.</label>
              <InputWithIcon 
                icon={Hash}
                type="text" 
                value={form.controlNo} 
                onChange={updateUpper('controlNo')} 
                placeholder="Ex. 2023-001" 
                required 
              />
            </div>

            <div className="sm:col-span-8">
              <label className={labelClass}>Name of Applicant</label>
              <InputWithIcon 
                icon={User}
                type="text" 
                value={form.nameOfApplicant} 
                onChange={updateUpper('nameOfApplicant')} 
                placeholder="Full Name of Applicant" 
              />
            </div>

            <div className="sm:col-span-12">
              <label className={labelClass}>Purpose of Application</label>
              <InputWithIcon 
                icon={ClipboardCheck}
                type="text" 
                value={form.purposeOfApplication} 
                onChange={updateUpper('purposeOfApplication')} 
                placeholder="State the purpose (e.g., Residential, Commercial)" 
              />
            </div>
          </div>
        </div>

        {/* --- Section 2: Land Specifications --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <Map className="w-5 h-5" /> Land Specifications
          </h3>
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-4">
              <label className={labelClass}>Size of Area (Has.)</label>
              <InputWithIcon 
                icon={Ruler}
                type="text" 
                value={form.sizeOfArea} 
                onChange={updateUpper('sizeOfArea')} 
                placeholder="0.00" 
              />
            </div>
            <div className="sm:col-span-8">
              <label className={labelClass}>Location</label>
              <InputWithIcon 
                icon={MapPin}
                type="text" 
                value={form.location} 
                onChange={updateUpper('location')} 
                placeholder="Barangay, Municipality" 
              />
            </div>
          </div>
        </div>

        {/* --- Section 3: Processing Timeline --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <CalendarClock className="w-5 h-5" /> Processing Timeline
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-primary/80 uppercase tracking-wider border-l-4 border-primary/20 pl-2">Incoming</h4>
              <div>
                <label className={labelClass}>Date of Request</label>
                <input type="date" value={form.dateOfRequest} onChange={(e) => update('dateOfRequest', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date Received & Evaluated</label>
                <input type="date" value={form.dateReceivedAndEvaluated} onChange={(e) => update('dateReceivedAndEvaluated', e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold text-primary/80 uppercase tracking-wider border-l-4 border-primary/20 pl-2">Outgoing / Action</h4>
              <div>
                <label className={labelClass}>Date of Reply to Request</label>
                <input type="date" value={form.dateOfReplyToRequest} onChange={(e) => update('dateOfReplyToRequest', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date Received by Applicant</label>
                <input type="date" value={form.dateReceivedByApplicant} onChange={(e) => update('dateReceivedByApplicant', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 4: Investigation & Final Output --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <FileCheck className="w-5 h-5" /> Investigation & Outcome
          </h3>

          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Field Investigation Details</label>
                <input 
                  type="text" 
                  value={form.fieldInvestigation} 
                  onChange={updateUpper('fieldInvestigation')} 
                  className={inputClass} 
                  placeholder="Findings summary" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date of Endorsement</label>
                  <input type="date" value={form.dateOfEndorsement} onChange={(e) => update('dateOfEndorsement', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cert. Issuance Date</label>
                  <input type="date" value={form.issuanceOfCertificate} onChange={(e) => update('issuanceOfCertificate', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Remarks</label>
              <textarea 
                value={form.remarks} 
                onChange={updateUpper('remarks')} 
                className={textAreaClass} 
                placeholder="Additional notes or remarks..." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 5: Feedback & Recommendation --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <MessageSquare className="w-5 h-5" /> Evaluation & Recommendation
          </h3>
          <div className="space-y-6">
            <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
            
            <div>
              <label className={labelClass}>Recommendation</label>
              <textarea 
                value={form.recommendation} 
                onChange={updateUpper('recommendation')} 
                className={textAreaClass} 
                placeholder="Final recommendations..." 
              />
            </div>
          </div>
        </div>

        {/* --- Submit Section --- */}
        <div className="pt-4 flex flex-col items-end gap-4">
          {message && (
            <div className={`w-full p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' 
                ? <CheckCircle2 className="w-5 h-5 flex-shrink-0"/> 
                : <AlertCircle className="w-5 h-5 flex-shrink-0"/>
              }
              <p className="font-medium text-sm">{message.text}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Record...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Submit Land Use Record</span>
              </>
            )}
          </button>
        </div>

      </form>
    </FormLayout>
  )
}