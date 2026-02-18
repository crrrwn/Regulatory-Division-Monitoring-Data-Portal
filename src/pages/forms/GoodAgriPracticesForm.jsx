import { useState } from 'react'
import { 
  Calendar, 
  User, 
  MapPin, 
  Ruler, 
  Sprout, 
  FileText, 
  ClipboardCheck, 
  Award,
  MessageSquare
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const STATUS_OPTIONS = ['Pending', 'On-Process', 'Approved', 'Denied', 'Certified']

const initialState = {
  dateOfRequest: '',
  nameOfApplicant: '',
  location: '',
  area: '',
  crop: '',
  dateOfPreAssessment: '',
  remarks: '',
  dateOfEndorsementToBPI: '',
  dateOfFinalInspection: '',
  status: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function GoodAgriPracticesForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('goodAgriPractices')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const updateUpper = (key) => (e) => update(key, (e.target.value || '').toUpperCase())

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }

  // UI Helper Classes
  const sectionTitleClass = "text-lg font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide"
  const inputContainerClass = "relative group"
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-gray-400 uppercase"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y`

  return (
    <FormLayout title="Good Agricultural Practices (GAP) Unit">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        
        {/* --- Section 1: Applicant Information --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <User className="w-5 h-5" /> Applicant Details
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
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

            <div className="sm:col-span-8">
              <label className={labelClass}>Name of Applicant</label>
              <input 
                type="text" 
                value={form.nameOfApplicant} 
                onChange={updateUpper('nameOfApplicant')} 
                className={inputClass} 
                placeholder="Full Name of Applicant" 
              />
            </div>

            <div className="sm:col-span-12">
              <label className={labelClass}>Farm Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={form.location} 
                  onChange={updateUpper('location')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Complete Address of the Farm" 
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Area (Hectares)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={form.area} 
                  onChange={updateUpper('area')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="e.g. 5.00" 
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Crop / Commodity</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sprout className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={form.crop} 
                  onChange={updateUpper('crop')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Type of Crop" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2: Assessment Timeline --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <Calendar className="w-5 h-5" /> Inspection Timeline
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Pre-assessment Date</label>
              <input 
                type="date" 
                value={form.dateOfPreAssessment} 
                onChange={(e) => update('dateOfPreAssessment', e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>Endorsement to BPI</label>
              <input 
                type="date" 
                value={form.dateOfEndorsementToBPI} 
                onChange={(e) => update('dateOfEndorsementToBPI', e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>Final Inspection</label>
              <input 
                type="date" 
                value={form.dateOfFinalInspection} 
                onChange={(e) => update('dateOfFinalInspection', e.target.value)} 
                className={inputClass} 
              />
            </div>
          </div>
        </div>

        {/* --- Section 3: Status & Outcome --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <ClipboardCheck className="w-5 h-5" /> Assessment Outcome
          </h3>
          
          <div className="grid gap-6">
             <div className="w-full sm:w-1/2">
              <label className={labelClass}>Current Status</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Award className="h-4 w-4 text-gray-400" />
                 </div>
                <select 
                  value={form.status} 
                  onChange={updateUpper('status')} 
                  className={`${inputClass} pl-10 cursor-pointer`}
                >
                  <option value="">Select Application Status</option>
                  {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Remarks</label>
                <textarea 
                  value={form.remarks} 
                  onChange={updateUpper('remarks')} 
                  className={textAreaClass} 
                  placeholder="Enter specific remarks or observations..." 
                />
              </div>
              <div>
                <label className={labelClass}>Recommendation</label>
                <textarea 
                  value={form.recommendation} 
                  onChange={updateUpper('recommendation')} 
                  className={textAreaClass} 
                  placeholder="Enter final recommendation..." 
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 4: Customer Feedback --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <MessageSquare className="w-5 h-5" /> Customer Satisfaction
          </h3>
          <div className="mt-2">
            <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
          </div>
        </div>

        {/* --- Submit Section --- */}
        <div className="pt-4 flex flex-col items-end gap-4">
          {message && (
            <div className={`w-full p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? <ClipboardCheck className="w-5 h-5"/> : <FileText className="w-5 h-5"/>}
              <p className="font-medium">{message.text}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>Saving Record...</>
            ) : (
              <>
                <ClipboardCheck className="w-5 h-5" /> Submit GAP Record
              </>
            )}
          </button>
        </div>

      </form>
    </FormLayout>
  )
}