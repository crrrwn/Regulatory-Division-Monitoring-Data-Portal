import { useState } from 'react'
import { 
  Activity, 
  User, 
  MapPin, 
  Syringe, 
  Microscope, 
  FileCheck, 
  ClipboardList, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Building2,
  FileText
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const RATING_OPTIONS = [
  { value: '1', label: 'Poor (1)' },
  { value: '2', label: 'Fair (2)' },
  { value: '3', label: 'Satisfied (3)' },
  { value: '4', label: 'Very Satisfied (4)' },
  { value: '5', label: 'Excellent (5)' },
]

const initialState = {
  clientName: '',
  typeOfDiseaseSurveillance: '',
  purpose: '',
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

export default function CFSADMCCForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('cfsAdmcc')
  
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

  // --- Design System ---
  const sectionTitleClass = "text-lg font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-gray-400 uppercase"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y`

  // Helper Component for Inputs with Icons
  const IconInput = ({ icon: Icon, ...props }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <input {...props} className={`${inputClass} pl-10`} />
    </div>
  )

  return (
    <FormLayout title="CFS/ADMCC (Animal Disease Surveillance)">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
        
        {/* --- Section 1: Client & Request Info --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <Building2 className="w-5 h-5" /> Client & Request Details
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-8">
              <label className={labelClass}>Name of LGU / Client / Farm</label>
              <IconInput 
                icon={User}
                type="text" 
                value={form.clientName} 
                onChange={updateUpper('clientName')} 
                placeholder="Name of Client or Farm" 
                required 
              />
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

            <div className="sm:col-span-12">
              <label className={labelClass}>Address</label>
              <IconInput 
                icon={MapPin}
                type="text" 
                value={form.address} 
                onChange={updateUpper('address')} 
                placeholder="Complete Address" 
              />
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Type of Disease Surveillance</label>
              <IconInput 
                icon={Activity}
                type="text" 
                value={form.typeOfDiseaseSurveillance} 
                onChange={updateUpper('typeOfDiseaseSurveillance')} 
                placeholder="e.g. Avian Influenza (AI), ASF" 
              />
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Purpose</label>
              <IconInput 
                icon={FileText}
                type="text" 
                value={form.purpose} 
                onChange={updateUpper('purpose')} 
                placeholder="Reason for surveillance" 
              />
            </div>
          </div>
        </div>

        {/* --- Section 2: Clinical & Laboratory Data --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <Microscope className="w-5 h-5" /> Specimen Collection & Lab Data
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Blood Collection */}
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-3 text-blue-700 font-medium">
                <Syringe className="w-4 h-4" />
                <span>Collection Details</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Date of Blood Collection</label>
                  <input 
                    type="date" 
                    value={form.dateOfSurveillance} 
                    onChange={(e) => update('dateOfSurveillance', e.target.value)} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>No. of Samples Collected</label>
                  <input 
                    type="text" 
                    value={form.numberOfSamples} 
                    onChange={updateUpper('numberOfSamples')} 
                    className={inputClass} 
                    placeholder="e.g. 50 Vials" 
                  />
                </div>
              </div>
            </div>

            {/* Submission */}
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-2 mb-3 text-emerald-700 font-medium">
                <FileCheck className="w-4 h-4" />
                <span>Submission & Endorsement</span>
              </div>
              <div className="space-y-4">
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

            <div className="sm:col-span-2 mt-2">
              <label className={labelClass}>Remarks / Technical Findings</label>
              <textarea 
                value={form.remarks} 
                onChange={updateUpper('remarks')} 
                className={textAreaClass} 
                placeholder="Additional notes on samples or findings..." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 3: Customer Ratings (Enhanced Table) --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <ClipboardList className="w-5 h-5" /> Customer Satisfaction
          </h3>
          
          <div className="overflow-hidden rounded-lg border border-gray-200 mt-2">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6 w-1/2">Evaluation Criteria</th>
                  <th className="py-4 px-2 text-center text-red-500 w-1/4">Not Satisfied</th>
                  <th className="py-4 px-2 text-center text-primary w-1/4">Satisfied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6 font-medium text-gray-700">1. Quantity of Goods/Services Provided</td>
                  <td className="py-3 px-4 text-center" colSpan="2">
                    <select 
                      value={form.ratingQuantity} 
                      onChange={(e) => update('ratingQuantity', e.target.value)} 
                      className="w-full max-w-[200px] mx-auto bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select Rating (1-5)</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6 font-medium text-gray-700">2. Services Rendered by Personnel</td>
                  <td className="py-3 px-4 text-center" colSpan="2">
                     <select 
                      value={form.ratingServicesPersonnel} 
                      onChange={(e) => update('ratingServicesPersonnel', e.target.value)} 
                      className="w-full max-w-[200px] mx-auto bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select Rating (1-5)</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
                 {/* Row 2.1 */}
                 <tr className="hover:bg-gray-50/50 transition-colors bg-gray-50/30">
                  <td className="py-3 pl-10 pr-6 text-gray-600 text-xs uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 
                    Training Relevance
                  </td>
                  <td className="py-3 px-4 text-center" colSpan="2">
                    <select 
                      value={form.ratingTraining} 
                      onChange={(e) => update('ratingTraining', e.target.value)} 
                      className="w-full max-w-[200px] mx-auto bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select Rating (1-5)</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
                {/* Row 2.2 */}
                <tr className="hover:bg-gray-50/50 transition-colors bg-gray-50/30">
                  <td className="py-3 pl-10 pr-6 text-gray-600 text-xs uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 
                    Attitude / Courtesy
                  </td>
                  <td className="py-3 px-4 text-center" colSpan="2">
                    <select 
                      value={form.ratingAttitude} 
                      onChange={(e) => update('ratingAttitude', e.target.value)} 
                      className="w-full max-w-[200px] mx-auto bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select Rating (1-5)</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
                {/* Row 2.3 */}
                <tr className="hover:bg-gray-50/50 transition-colors bg-gray-50/30">
                  <td className="py-3 pl-10 pr-6 text-gray-600 text-xs uppercase tracking-wide flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 
                    Promptness
                  </td>
                  <td className="py-3 px-4 text-center" colSpan="2">
                    <select 
                      value={form.ratingPromptness} 
                      onChange={(e) => update('ratingPromptness', e.target.value)} 
                      className="w-full max-w-[200px] mx-auto bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select Rating (1-5)</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <label className={labelClass}>Recommendation</label>
            <textarea 
              value={form.recommendation} 
              onChange={updateUpper('recommendation')} 
              className={textAreaClass} 
              placeholder="Client recommendations for service improvement..." 
            />
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
                <span>Saving Record...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Submit ADMCC Record</span>
              </>
            )}
          </button>
        </div>

      </form>
    </FormLayout>
  )
}