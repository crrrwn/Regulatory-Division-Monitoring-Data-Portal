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
import { useFormSubmit } from '../../hooks/useFormSubmit'

const RATING_OPTIONS = [
  { value: '1', label: 'Poor (1)' },
  { value: '2', label: 'Fair (2)' },
  { value: '3', label: 'Satisfied (3)' },
  { value: '4', label: 'Very Satisfied (4)' },
  { value: '5', label: 'Excellent (5)' },
]

const initialState = {
  dateOfRequestAndCollection: '',
  farmerName: '',
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

  // --- UI Styling Classes ---
  const sectionTitleClass = "text-lg font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-gray-100"
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-gray-400 uppercase"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y`

  // Helper for Input with Icon
  const IconInput = ({ icon: Icon, ...props }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <input {...props} className={`${inputClass} pl-10`} />
    </div>
  )

  return (
    <FormLayout title="Plant Pest and Disease Surveillance">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
        
        {/* --- Section 1: Farmer & Location Profile --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <User className="w-5 h-5" /> Farmer & Location Profile
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
              <IconInput 
                icon={User}
                type="text" 
                value={form.farmerName} 
                onChange={updateUpper('farmerName')} 
                placeholder="Full Name" 
              />
            </div>

            <div className="sm:col-span-12">
              <label className={labelClass}>Address</label>
              <IconInput 
                icon={MapPin}
                type="text" 
                value={form.address} 
                onChange={updateUpper('address')} 
                placeholder="Complete Farm Address" 
              />
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>Contact Number</label>
              <IconInput 
                icon={Phone}
                type="text" 
                value={form.contactNumber} 
                onChange={updateUpper('contactNumber')} 
                placeholder="09XX-XXX-XXXX" 
              />
            </div>

            <div className="sm:col-span-6">
              <label className={labelClass}>GPS Location</label>
              <IconInput 
                icon={Scan}
                type="text" 
                value={form.gpsLocation} 
                onChange={updateUpper('gpsLocation')} 
                placeholder="Lat, Long (e.g., 13.41, 121.18)" 
              />
            </div>
          </div>
        </div>

        {/* --- Section 2: Crop Information --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <Sprout className="w-5 h-5" /> Crop Information
          </h3>
          <div className="grid sm:grid-cols-4 gap-6">
            <div className="sm:col-span-2">
              <label className={labelClass}>Crop</label>
              <IconInput 
                icon={Sprout}
                type="text" 
                value={form.crop} 
                onChange={updateUpper('crop')} 
                placeholder="e.g. Rice" 
              />
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-amber-400">
          <h3 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <Bug className="w-5 h-5" /> Surveillance Findings
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-12">
              <label className={labelClass}>Observed Pests / Diseases</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                <input 
                  type="text" 
                  value={form.pestsDiseases} 
                  onChange={updateUpper('pestsDiseases')} 
                  className={`${inputClass} pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20`} 
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <ClipboardList className="w-5 h-5" /> Feedback & Satisfaction
          </h3>
          
          <div className="overflow-hidden rounded-lg border border-gray-200 mt-2">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6 w-1/2">Evaluation Criteria</th>
                  <th className="py-4 px-4 text-center">Rating (1-5)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6 font-medium text-gray-700">1. Quantity of Goods/Services Provided</td>
                  <td className="py-3 px-4">
                    <select 
                      value={form.ratingQuantity} 
                      onChange={(e) => update('ratingQuantity', e.target.value)} 
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select...</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6 font-medium text-gray-700">2. Services Rendered by Personnel</td>
                  <td className="py-3 px-4">
                    <select 
                      value={form.ratingServicesPersonnel} 
                      onChange={(e) => update('ratingServicesPersonnel', e.target.value)} 
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select...</option>
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
                  <td className="py-3 px-4">
                    <select 
                      value={form.ratingTraining} 
                      onChange={(e) => update('ratingTraining', e.target.value)} 
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select...</option>
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
                  <td className="py-3 px-4">
                    <select 
                      value={form.ratingAttitude} 
                      onChange={(e) => update('ratingAttitude', e.target.value)} 
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select...</option>
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
                  <td className="py-3 px-4">
                    <select 
                      value={form.ratingPromptness} 
                      onChange={(e) => update('ratingPromptness', e.target.value)} 
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="">Select...</option>
                      {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <label className={labelClass}>Final Recommendation</label>
            <textarea 
              value={form.recommendation} 
              onChange={updateUpper('recommendation')} 
              className={textAreaClass} 
              placeholder="Enter final recommendation here..." 
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
                <span>Saving Data...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Submit Surveillance Report</span>
              </>
            )}
          </button>
        </div>

      </form>
    </FormLayout>
  )
}