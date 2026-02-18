import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { PROVINCES } from '../../lib/regions'
import 'iconify-icon'

const NATURE_OPTIONS = ['Mixed Feed', 'Feed Ingredient Manufacturer', 'Toll Manufacturer', 'Importer', 'Indentor', 'Supplier', 'Distributor', 'Retailer']
const ORG_OPTIONS = ['Sole Proprietorship', 'Partnership', 'Corporate', 'Cooperative']
const REMARKS_OPTIONS = ['New', 'Renewal', 'Amendment']

const MAX_ATTACHMENT_SIZE = 700 * 1024 // ~700 KB

const initialState = {
  date: '', province: '', controlNo: '', registrationNo: '', dateOfInspection: '', dateOfMonitoring: '',
  companyName: '', lastName: '', middleName: '', firstName: '', nameExt: '', completeName: '', birthDate: '',
  barangay: '', municipality: '', completeAddress: '', officeAddress: '', plantAddress: '',
  cellphone: '', email: '',
  natureOfBusiness: '', businessOrg: '', productLines: '', type: '',
  orNo: '', orDate: '', fee: '', dateIssued: '',
  dateOfFeedSampling1stSem: '', dateOfFeedSampling2ndSem: '', noOfFeedSamples1stSem: '', noOfFeedSamples2ndSem: '',
  attachmentFileName: '', attachmentData: '', remarks: '',
  ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '',
  recommendation: '',
}

export default function AnimalFeedForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message, setMessage } = useFormSubmit('animalFeed')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      update('attachmentFileName', '')
      update('attachmentData', '')
      return
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      setMessage({ type: 'error', text: `File too large. Max ${Math.round(MAX_ATTACHMENT_SIZE / 1024)} KB.` })
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const data = reader.result
      const base64 = typeof data === 'string' ? data.split(',')[1] || data : ''
      setForm((f) => ({ ...f, attachmentFileName: file.name, attachmentData: base64 }))
      setMessage(null)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) {
      setForm(initialState)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // --- REUSABLE STYLES ---
  const sectionTitleClass = "text-sm font-bold text-emerald-800 uppercase tracking-wide border-b border-emerald-100 pb-3 mb-5 flex items-center gap-2"
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
  const groupBoxClass = "bg-slate-50/50 p-4 rounded-xl border border-slate-100"

  return (
    <FormLayout title="Animal Feeds Registration">
      <div className="max-w-5xl mx-auto pb-10">
        
        {/* --- FORM HEADER --- */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Feeds Regulation Form</h2>
          <p className="text-sm text-slate-500 mt-1">
            Complete the details below for establishment accreditation and monitoring.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* --- SECTION 1: LOGISTICS --- */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:clipboard-clock-outline" width="18"></iconify-icon>
              Registration Logistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Date of Application</label>
                <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Province Scope</label>
                <select value={form.province} onChange={(e) => update('province', e.target.value)} className={inputClass}>
                  <option value="">Select Province</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Control No.</label>
                <input type="text" value={form.controlNo} onChange={(e) => update('controlNo', e.target.value)} className={inputClass} placeholder="--/--" />
              </div>
              <div>
                <label className={labelClass}>Registration No.</label>
                <input type="text" value={form.registrationNo} onChange={(e) => update('registrationNo', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date of Inspection</label>
                <input type="date" value={form.dateOfInspection} onChange={(e) => update('dateOfInspection', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date of Monitoring</label>
                <input type="date" value={form.dateOfMonitoring} onChange={(e) => update('dateOfMonitoring', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* --- SECTION 2: COMPANY & OWNER --- */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:domain" width="18"></iconify-icon>
              Establishment Profile
            </h3>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Name of Establishment</label>
                <input type="text" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} className={`${inputClass} font-semibold text-lg`} required placeholder="Enter Business Name" />
              </div>

              {/* Owner Group */}
              <div className={groupBoxClass}>
                <div className="mb-4 flex items-center gap-2 text-slate-400">
                  <iconify-icon icon="mdi:account-tie" width="16"></iconify-icon>
                  <span className="text-xs font-bold uppercase">Owner / Propreitor Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className={labelClass}>Middle Name</label>
                    <input type="text" value={form.middleName} onChange={(e) => update('middleName', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className={labelClass}>Suffix</label>
                    <input type="text" value={form.nameExt} onChange={(e) => update('nameExt', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:border-emerald-500 outline-none" placeholder="e.g. Jr." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Full Name (Auto/Manual)</label>
                    <input type="text" value={form.completeName} onChange={(e) => update('completeName', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Birth Date</label>
                    <input type="date" value={form.birthDate} onChange={(e) => update('birthDate', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:border-emerald-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- SECTION 3: LOCATION --- */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:map-marker-radius" width="18"></iconify-icon>
              Location & Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
              <div>
                <label className={labelClass}>Province</label>
                <input type="text" value={form.province} readOnly className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed`} />
              </div>
              <div>
                <label className={labelClass}>Municipality</label>
                <input type="text" value={form.municipality} onChange={(e) => update('municipality', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Barangay</label>
                <input type="text" value={form.barangay} onChange={(e) => update('barangay', e.target.value)} className={inputClass} />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>Complete Main Address</label>
                <input type="text" value={form.completeAddress} onChange={(e) => update('completeAddress', e.target.value)} className={inputClass} placeholder="Street / Bldg / Block / Lot" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Office Address</label>
                <input type="text" value={form.officeAddress} onChange={(e) => update('officeAddress', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Plant/Warehouse Address</label>
                <input type="text" value={form.plantAddress} onChange={(e) => update('plantAddress', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mobile / Tel No.</label>
                <input type="text" value={form.cellphone} onChange={(e) => update('cellphone', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* --- SECTION 4: BUSINESS CLASSIFICATION --- */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:briefcase-variant-outline" width="18"></iconify-icon>
              Business Classification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Nature of Business</label>
                <select value={form.natureOfBusiness} onChange={(e) => update('natureOfBusiness', e.target.value)} className={inputClass}>
                  <option value="">Select Nature</option>
                  {NATURE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Business Organization</label>
                <select value={form.businessOrg} onChange={(e) => update('businessOrg', e.target.value)} className={inputClass}>
                  <option value="">Select Organization</option>
                  {ORG_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Product Line(s)</label>
                <input type="text" value={form.productLines} onChange={(e) => update('productLines', e.target.value)} className={inputClass} placeholder="e.g. Swine, Poultry Feeds" />
              </div>
              <div>
                <label className={labelClass}>Establishment Type</label>
                <input type="text" value={form.type} onChange={(e) => update('type', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* --- SECTION 5: LICENSING & FEES --- */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className={sectionTitleClass}>
              <iconify-icon icon="mdi:cash-multiple" width="18"></iconify-icon>
              Licensing & Fees
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>O.R. No.</label>
                <input type="text" value={form.orNo} onChange={(e) => update('orNo', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>O.R. Date</label>
                <input type="date" value={form.orDate} onChange={(e) => update('orDate', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Fees Collected</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-serif">₱</span>
                  <input type="number" value={form.fee} onChange={(e) => update('fee', e.target.value)} className={`${inputClass} pl-7`} placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Date Issued (LTO)</label>
                <input type="date" value={form.dateIssued} onChange={(e) => update('dateIssued', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* --- SECTION 6: SAMPLING DATA --- */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className={sectionTitleClass}>
               <iconify-icon icon="mdi:test-tube" width="18"></iconify-icon>
               Sampling Monitoring
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1st Sem Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                   <div className="flex items-center gap-2 mb-4">
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">1st Semester</span>
                      <div className="h-px bg-slate-200 flex-1"></div>
                   </div>
                   <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Date of Feed Sampling</label>
                        <input type="date" value={form.dateOfFeedSampling1stSem} onChange={(e) => update('dateOfFeedSampling1stSem', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm" />
                      </div>
                      <div>
                        <label className={labelClass}>Samples Collected</label>
                        <input type="number" min="0" value={form.noOfFeedSamples1stSem} onChange={(e) => update('noOfFeedSamples1stSem', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm" placeholder="0" />
                      </div>
                   </div>
                </div>

                {/* 2nd Sem Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                   <div className="flex items-center gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">2nd Semester</span>
                      <div className="h-px bg-slate-200 flex-1"></div>
                   </div>
                   <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Date of Feed Sampling</label>
                        <input type="date" value={form.dateOfFeedSampling2ndSem} onChange={(e) => update('dateOfFeedSampling2ndSem', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm" />
                      </div>
                      <div>
                        <label className={labelClass}>Samples Collected</label>
                        <input type="number" min="0" value={form.noOfFeedSamples2ndSem} onChange={(e) => update('noOfFeedSamples2ndSem', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm" placeholder="0" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* --- SECTION 7: FEEDBACK & RATING --- */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className={sectionTitleClass}>
               <iconify-icon icon="mdi:star-circle-outline" width="18"></iconify-icon>
               Customer Feedback
             </h3>
             <div className="space-y-6">
                <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
                
                <div>
                   <label className={labelClass}>Recommendation / Comments</label>
                   <textarea 
                     value={form.recommendation} 
                     onChange={(e) => update('recommendation', (e.target.value || '').toUpperCase())} 
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all uppercase placeholder:normal-case min-h-[100px]" 
                     rows="3" 
                     placeholder="Enter any additional recommendations or remarks..." 
                   />
                </div>
             </div>
          </div>

          {/* --- SECTION 8: FINALIZATION --- */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className={sectionTitleClass}>
               <iconify-icon icon="mdi:file-check-outline" width="18"></iconify-icon>
               Finalization
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <div>
                   <label className={labelClass}>Attachments</label>
                   <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer group">
                        <span className="sr-only">Choose file</span>
                        <input type="file" onChange={handleAttachmentChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all border border-dashed border-slate-300 rounded-lg group-hover:border-emerald-400" />
                      </label>
                      {form.attachmentFileName && (
                        <button type="button" onClick={() => { update('attachmentFileName', ''); update('attachmentData', '') }} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors" title="Remove File">
                           <iconify-icon icon="mdi:trash-can-outline" width="20"></iconify-icon>
                        </button>
                      )}
                   </div>
                   <p className="mt-2 text-[10px] text-slate-400">
                     {form.attachmentFileName ? <span className="text-emerald-600 font-bold">Selected: {form.attachmentFileName}</span> : 'Max file size: 700KB (Images/PDF)'}
                   </p>
                </div>
                <div>
                   <label className={labelClass}>Status / Remarks</label>
                   <select value={form.remarks} onChange={(e) => update('remarks', e.target.value)} className={inputClass}>
                     <option value="">Select Status</option>
                     {REMARKS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                   </select>
                </div>
             </div>
          </div>

          {/* --- ACTION BAR --- */}
          <div className="sticky bottom-4 z-10">
             {message && (
                <div className={`mb-4 mx-auto max-w-2xl p-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-up ${message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'}`}>
                  <iconify-icon icon={message.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} width="24"></iconify-icon>
                  <p className="font-medium">{message.text}</p>
                </div>
             )}

             <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl hover:-translate-y-0.5 hover:shadow-emerald-500/30 transition-all font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
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