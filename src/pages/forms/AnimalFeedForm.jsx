import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { PROVINCES } from '../../lib/regions'

const NATURE_OPTIONS = ['Mixed Feed', 'Feed Ingredient Manufacturer', 'Toll Manufacturer', 'Importer', 'Indentor', 'Supplier', 'Distributor', 'Retailer']
const ORG_OPTIONS = ['Sole Proprietorship', 'Partnership', 'Corporate', 'Cooperative']
const REMARKS_OPTIONS = ['New', 'Renewal', 'Amendment']

const MAX_ATTACHMENT_SIZE = 700 * 1024 // ~700 KB so Firestore doc stays under 1MB

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
    e.target.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit(form)
    if (ok) setForm(initialState)
  }

  return (
    <FormLayout title="Animal Feeds Unit">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Date of Application/Valuated</label>
            <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Province</label>
            <select value={form.province} onChange={(e) => update('province', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary">
              <option value="">Select Province</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Control No.</label>
            <input type="text" value={form.controlNo} onChange={(e) => update('controlNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Registration No.</label>
            <input type="text" value={form.registrationNo} onChange={(e) => update('registrationNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Date of Inspection</label>
            <input type="date" value={form.dateOfInspection} onChange={(e) => update('dateOfInspection', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Date of Monitoring</label>
            <input type="date" value={form.dateOfMonitoring} onChange={(e) => update('dateOfMonitoring', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Name of Establishment</label>
          <input type="text" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Last Name</label>
            <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Middle Name</label>
            <input type="text" value={form.middleName} onChange={(e) => update('middleName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">First Name</label>
            <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Name Ext.</label>
            <input type="text" value={form.nameExt} onChange={(e) => update('nameExt', e.target.value)} placeholder="Jr., Sr., III" className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-primary mb-1">Complete Name</label>
            <input type="text" value={form.completeName} onChange={(e) => update('completeName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Birth Date</label>
            <input type="date" value={form.birthDate} onChange={(e) => update('birthDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Barangay</label>
            <input type="text" value={form.barangay} onChange={(e) => update('barangay', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Municipality</label>
            <input type="text" value={form.municipality} onChange={(e) => update('municipality', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Province (Address)</label>
            <input type="text" value={form.province} readOnly className="w-full px-3 py-2 border border-border rounded-lg bg-gray-50" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Complete Address</label>
          <input type="text" value={form.completeAddress} onChange={(e) => update('completeAddress', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Office Address</label>
          <input type="text" value={form.officeAddress} onChange={(e) => update('officeAddress', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Plant/Warehouse Address</label>
          <input type="text" value={form.plantAddress} onChange={(e) => update('plantAddress', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Contact No.</label>
            <input type="text" value={form.cellphone} onChange={(e) => update('cellphone', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Nature of Business</label>
            <select value={form.natureOfBusiness} onChange={(e) => update('natureOfBusiness', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary">
              <option value="">Select</option>
              {NATURE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Business Organization</label>
            <select value={form.businessOrg} onChange={(e) => update('businessOrg', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary">
              <option value="">Select</option>
              {ORG_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Product Line</label>
            <input type="text" value={form.productLines} onChange={(e) => update('productLines', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Type</label>
            <input type="text" value={form.type} onChange={(e) => update('type', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Official Receipt No.</label>
            <input type="text" value={form.orNo} onChange={(e) => update('orNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Official Receipt Date</label>
            <input type="date" value={form.orDate} onChange={(e) => update('orDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Fees Collected</label>
            <input type="text" value={form.fee} onChange={(e) => update('fee', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Date of Issuance of LTO</label>
            <input type="date" value={form.dateIssued} onChange={(e) => update('dateIssued', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Date of Feed Sampling (1st Semester)</label>
            <input type="date" value={form.dateOfFeedSampling1stSem} onChange={(e) => update('dateOfFeedSampling1stSem', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Date of Feed Sampling (2nd Semester)</label>
            <input type="date" value={form.dateOfFeedSampling2ndSem} onChange={(e) => update('dateOfFeedSampling2ndSem', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">No. of Feed Samples Collected (1st Semester)</label>
            <input type="number" min="0" value={form.noOfFeedSamples1stSem} onChange={(e) => update('noOfFeedSamples1stSem', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">No. of Feed Samples Collected (2nd Semester)</label>
            <input type="number" min="0" value={form.noOfFeedSamples2ndSem} onChange={(e) => update('noOfFeedSamples2ndSem', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Attachments</label>
          <div className="flex flex-wrap items-center gap-2">
            <input type="file" onChange={handleAttachmentChange} className="flex-1 min-w-0 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary file:text-white file:text-sm" />
            {form.attachmentFileName && (
              <button type="button" onClick={() => { update('attachmentFileName', ''); update('attachmentData', '') }} className="px-3 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium whitespace-nowrap">
                Remove
              </button>
            )}
          </div>
          {form.attachmentFileName && <p className="mt-1 text-sm text-primary">Attached: {form.attachmentFileName}</p>}
          <p className="mt-0.5 text-xs text-gray-500">Max {Math.round(MAX_ATTACHMENT_SIZE / 1024)} KB (saved in record, no cloud storage)</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Remarks</label>
            <select value={form.remarks} onChange={(e) => update('remarks', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary">
              <option value="">Select</option>
              {REMARKS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <CustomerRatingsTable ratings={form} onChange={(k, v) => update(k, v)} />
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Recommendation</label>
          <textarea value={form.recommendation} onChange={(e) => update('recommendation', (e.target.value || '').toUpperCase())} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted uppercase min-h-[80px]" rows="3" placeholder="Recommendations..." />
        </div>
        {message && (
          <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </p>
        )}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </form>
    </FormLayout>
  )
}
