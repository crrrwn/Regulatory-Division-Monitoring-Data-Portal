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
import 'iconify-icon'

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
    if (ok) {
      setForm(initialState)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // --- STYLING (app theme: green #1e4d2b, khaki #b8a066) ---
  const sectionTitleClass = "text-sm font-black text-[#1e4d2b] uppercase tracking-wide border-b-2 border-[#1e4d2b]/15 pb-3 mb-5 flex items-center gap-2.5 transition-colors duration-300"
  const labelClass = "block text-[10px] font-bold text-[#5c574f] uppercase tracking-wider mb-1.5 transition-colors duration-200"
  const inputClass = "w-full px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c] uppercase"
  const urlInputClass = "w-full px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-sm text-[#1e4d2b] font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/30 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 placeholder:text-[#8a857c] normal-case"
  const textAreaClass = `${inputClass} min-h-[100px] resize-y normal-case placeholder:normal-case`
  
  return (
    <FormLayout title="Organic Product Post-Market Surveillance">
      <div className="max-w-5xl mx-auto pb-10">
        {/* --- HEADER --- */}
        <div className="mb-8 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="p-2.5 bg-white/15 rounded-xl border border-white/20 shrink-0">
                <iconify-icon icon="mdi:store-marker-outline" width="24" class="text-white"></iconify-icon>
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Post-Market Surveillance</h2>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-0.5">
                  Organic product surveillance and market outlet monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Section 1: Request & Communication Timeline --- */}
        <div className="organic-post-market-section organic-post-market-section-1 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <CalendarDays className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Communication Timeline
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
        <div className="organic-post-market-section organic-post-market-section-2 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Store className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Market & Product Information
          </h3>
          
          <div className="grid sm:grid-cols-12 gap-6">
            <div className="sm:col-span-8">
              <label className={labelClass}>Identified Market Outlet / Establishment</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
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
               <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
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
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
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
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
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
        <div className="organic-post-market-section organic-post-market-section-3 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <Search className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Surveillance Findings
          </h3>

          <div className="grid gap-6">
            <div className="w-full sm:max-w-xs">
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
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-[#1e4d2b] group-focus-within:text-[#153019] transition-colors duration-300" />
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
        <div className="organic-post-market-section organic-post-market-section-4 bg-white p-6 sm:p-7 rounded-2xl border-2 border-[#e8e0d4] shadow-lg shadow-[#1e4d2b]/8 hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
          <h3 className={sectionTitleClass}>
            <ClipboardList className="w-5 h-5 text-[#1e4d2b] opacity-90" /> Feedback & Recommendations
          </h3>
          
          <div className="space-y-6">
            <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
            
            <div>
              <label className={labelClass}>Final Recommendation</label>
              <div className="relative group">
                 <div className="absolute top-3 left-3 pointer-events-none">
                  <MessageSquare className="h-4 w-4 text-[#5c574f] group-focus-within:text-[#1e4d2b] transition-colors duration-300" />
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
        <div className="organic-post-market-section organic-post-market-section-5 pt-2 flex flex-col items-end gap-4">
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
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] text-white rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#1e4d2b]/25 hover:shadow-xl hover:shadow-[#1e4d2b]/35 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg disabled:hover:scale-100"
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