import { useState } from 'react'
import { 
  CalendarDays, 
  Store, 
  Tag, 
  User, 
  MapPin, 
  Search, 
  FileText, 
  Link as LinkIcon, 
  ClipboardList,
  MessageSquare,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const initialState = {
  requestLetterDate: '',
  identifiedMarketOutlet: '',
  dateOfCommunicationLetter: '',
  nameOfProduct: '',
  commodity: '',
  certification: '',
  nameOfOwnerManager: '',
  location: '',
  dateOfSurveillance: '',
  remarks: '',
  linkFile: '',
  ratingQuantity: '',
  ratingServicesPersonnel: '',
  ratingTraining: '',
  ratingAttitude: '',
  ratingPromptness: '',
  recommendation: '',
}

export default function OrganicPostMarketForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message } = useFormSubmit('organicPostMarket')
  
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
  // Special class for URL input (no uppercase)
  const urlInputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-blue-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-gray-400"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y`
  
  return (
    <FormLayout title="Organic Product Post-Market Surveillance">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
        
        {/* --- Section 1: Request & Communication Timeline --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <CalendarDays className="w-5 h-5" /> Communication Timeline
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Date of Request Letter</label>
              <input 
                type="date" 
                value={form.requestLetterDate} 
                onChange={(e) => update('requestLetterDate', e.target.value)} 
                className={inputClass} 
                required 
              />
            </div>
            <div>
              <label className={labelClass}>Date of Communication Letter</label>
              <input 
                type="date" 
                value={form.dateOfCommunicationLetter} 
                onChange={(e) => update('dateOfCommunicationLetter', e.target.value)} 
                className={inputClass} 
              />
            </div>
          </div>
        </div>

        {/* --- Section 2: Market & Product Details --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <Store className="w-5 h-5" /> Market & Product Information
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            {/* Market Outlet - Full Width on Mobile, 8 Cols on Desktop */}
            <div className="sm:col-span-8">
              <label className={labelClass}>Identified Market Outlet / Establishment</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={form.identifiedMarketOutlet} 
                  onChange={updateUpper('identifiedMarketOutlet')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Name of Establishment" 
                  required 
                />
              </div>
            </div>

            {/* Owner - 4 Cols */}
            <div className="sm:col-span-4">
              <label className={labelClass}>Owner / Manager</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={form.nameOfOwnerManager} 
                  onChange={updateUpper('nameOfOwnerManager')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Full Name" 
                />
              </div>
            </div>

            {/* Location - Full Width */}
            <div className="sm:col-span-12">
              <label className={labelClass}>Location Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={form.location} 
                  onChange={updateUpper('location')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Complete Address of Market/Outlet" 
                />
              </div>
            </div>

            {/* Product Name - 6 Cols */}
            <div className="sm:col-span-6">
              <label className={labelClass}>Name of Product</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={form.nameOfProduct} 
                  onChange={updateUpper('nameOfProduct')} 
                  className={`${inputClass} pl-10`} 
                  placeholder="Product Brand/Name" 
                />
              </div>
            </div>

            {/* Commodity - 3 Cols */}
            <div className="sm:col-span-3">
              <label className={labelClass}>Commodity</label>
              <input 
                type="text" 
                value={form.commodity} 
                onChange={updateUpper('commodity')} 
                className={inputClass} 
                placeholder="e.g. Rice" 
              />
            </div>

            {/* Certification - 3 Cols */}
            <div className="sm:col-span-3">
              <label className={labelClass}>Certification</label>
              <input 
                type="text" 
                value={form.certification} 
                onChange={updateUpper('certification')} 
                className={inputClass} 
                placeholder="Cert. Body/No." 
              />
            </div>
          </div>
        </div>

        {/* --- Section 3: Surveillance Findings --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <Search className="w-5 h-5" /> Surveillance Findings
          </h3>

          <div className="grid gap-6">
            <div className="w-full sm:w-1/3">
              <label className={labelClass}>Date of Surveillance</label>
              <input 
                type="date" 
                value={form.dateOfSurveillance} 
                onChange={(e) => update('dateOfSurveillance', e.target.value)} 
                className={inputClass} 
              />
            </div>

            <div>
              <label className={labelClass}>Remarks / Observations</label>
              <textarea 
                value={form.remarks} 
                onChange={updateUpper('remarks')} 
                className={textAreaClass} 
                placeholder="Enter detailed observations during surveillance..." 
              />
            </div>

            <div>
              <label className={labelClass}>Related File Link</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="url" 
                  value={form.linkFile} 
                  onChange={(e) => update('linkFile', e.target.value)} 
                  className={`${urlInputClass} pl-10`} 
                  placeholder="https://drive.google.com/..." 
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 4: Feedback & Recommendation --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className={sectionTitleClass}>
            <ClipboardList className="w-5 h-5" /> Feedback & Recommendations
          </h3>
          
          <div className="space-y-6">
            <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
            
            <div>
              <label className={labelClass}>Final Recommendation</label>
              <div className="relative">
                 <div className="absolute top-3 left-3 pointer-events-none">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                </div>
                <textarea 
                  value={form.recommendation} 
                  onChange={updateUpper('recommendation')} 
                  className={`${textAreaClass} pl-10`} 
                  rows="3" 
                  placeholder="Enter final recommendation regarding the product/market..." 
                />
              </div>
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
                <span>Submit Surveillance Report</span>
              </>
            )}
          </button>
        </div>

      </form>
    </FormLayout>
  )
}