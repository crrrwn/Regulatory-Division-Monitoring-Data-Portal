import { useState } from 'react'
import { 
  FileText, 
  Map, 
  User, 
  Calendar, 
  Send, 
  Search, 
  FileCheck, 
  Stamp, 
  ClipboardList, 
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Ruler
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied']

const initialState = {
  explorationPermitApplicationNo: '',
  nameOfApplicant: '',
  dateReceived: '',
  location: '',
  area: '',
  dateOfReplyToRequest: '',
  endorsementToBSWM: '',
  endorsementToMGB: '',
  fieldValidation: '',
  remarks: '',
  rescheduledDate: '',
  fieldValidationReport: '',
  issuanceOfCertificateAndEndorsementToMGB: '',
  status: '',
  findings: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function SafdzValidationForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('safdzValidation')
  
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const updateUpper = (key) => (e) => update(key, (e.target.value || '').toUpperCase())

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }

  // --- UI Constants & Classes ---
  const sectionTitleClass = "text-lg font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-gray-400 uppercase"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y`
  
  // Helper for inputs with icons
  const IconInput = ({ icon: Icon, ...props }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <input {...props} className={`${inputClass} pl-10`} />
    </div>
  )

  return (
    <FormLayout title="SAFDZ Validation">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">

        {/* --- Section 1: Application Details --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <FileText className="w-5 h-5" /> Application Overview
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Exploration Permit App. No.</label>
              <IconInput 
                icon={FileCheck}
                type="text" 
                value={form.explorationPermitApplicationNo} 
                onChange={updateUpper('explorationPermitApplicationNo')} 
                placeholder="Permit Number" 
                required 
              />
            </div>
            <div>
              <label className={labelClass}>Name of Applicant</label>
              <IconInput 
                icon={User}
                type="text" 
                value={form.nameOfApplicant} 
                onChange={updateUpper('nameOfApplicant')} 
                placeholder="Applicant Full Name" 
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <IconInput 
                icon={MapPin}
                type="text" 
                value={form.location} 
                onChange={updateUpper('location')} 
                placeholder="Site Location" 
              />
            </div>
            <div>
              <label className={labelClass}>Area (Hectares)</label>
              <IconInput 
                icon={Ruler}
                type="text" 
                value={form.area} 
                onChange={updateUpper('area')} 
                placeholder="e.g. 5.00" 
              />
            </div>
          </div>
        </div>

        {/* --- Section 2: Endorsements & Timeline --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <Send className="w-5 h-5" /> Timeline & Endorsements
          </h3>
          
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Date Received</label>
              <input type="date" value={form.dateReceived} onChange={(e) => update('dateReceived', e.target.value)} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Date Replied</label>
              <input type="date" value={form.dateOfReplyToRequest} onChange={(e) => update('dateOfReplyToRequest', e.target.value)} className={inputClass} />
            </div>
            
            <div className="sm:col-span-4 h-px bg-gray-100 my-2"></div>
            
            <div className="sm:col-span-2">
              <label className={labelClass}>Endorsement to BSWM</label>
              <input type="date" value={form.endorsementToBSWM} onChange={(e) => update('endorsementToBSWM', e.target.value)} className={inputClass} />
              <p className="text-[10px] text-gray-400 mt-1">Bureau of Soils and Water Management</p>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Endorsement to MGB</label>
              <input type="date" value={form.endorsementToMGB} onChange={(e) => update('endorsementToMGB', e.target.value)} className={inputClass} />
              <p className="text-[10px] text-gray-400 mt-1">Mines and Geosciences Bureau</p>
            </div>
          </div>
        </div>

        {/* --- Section 3: Field Validation --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <Search className="w-5 h-5" /> Field Validation & Findings
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className={labelClass}>Field Validation Activities</label>
              <input 
                type="text" 
                value={form.fieldValidation} 
                onChange={updateUpper('fieldValidation')} 
                className={inputClass} 
                placeholder="Describe validation activities..." 
              />
            </div>

            <div>
               <label className={labelClass}>Rescheduled Date (If any)</label>
               <div className="relative">
                 <input type="date" value={form.rescheduledDate} onChange={(e) => update('rescheduledDate', e.target.value)} className={inputClass} />
               </div>
            </div>
            
             <div>
               <label className={labelClass}>Validation Report Ref.</label>
               <input 
                 type="text" 
                 value={form.fieldValidationReport} 
                 onChange={updateUpper('fieldValidationReport')} 
                 className={inputClass} 
                 placeholder="Report No. / Reference"
               />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Findings</label>
              <textarea 
                value={form.findings} 
                onChange={updateUpper('findings')} 
                className={textAreaClass} 
                placeholder="Enter validation findings here..." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 4: Final Disposition --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <Stamp className="w-5 h-5" /> Issuance & Status
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Issuance of Certificate & Endorsement (MGB)</label>
              <input type="date" value={form.issuanceOfCertificateAndEndorsementToMGB} onChange={(e) => update('issuanceOfCertificateAndEndorsementToMGB', e.target.value)} className={inputClass} />
            </div>
            
            <div>
              <label className={labelClass}>Current Status</label>
              <select value={form.status} onChange={updateUpper('status')} className={inputClass}>
                <option value="">Select Application Status</option>
                {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>General Remarks</label>
              <textarea 
                value={form.remarks} 
                onChange={updateUpper('remarks')} 
                className={`${inputClass} min-h-[80px]`} 
                rows="2" 
                placeholder="Additional remarks..." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 5: Ratings & Recommendation --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <ClipboardList className="w-5 h-5" /> Feedback & Recommendation
          </h3>
          
          <div className="space-y-6">
            <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
            
            <div>
              <label className={labelClass}>Final Recommendation</label>
              <textarea 
                value={form.recommendation} 
                onChange={updateUpper('recommendation')} 
                className={textAreaClass} 
                placeholder="Final recommendation based on validation..." 
              />
            </div>
          </div>
        </div>

        {/* --- Action Buttons --- */}
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Submit Validation</span>
              </>
            )}
          </button>
        </div>

      </form>
    </FormLayout>
  )
}