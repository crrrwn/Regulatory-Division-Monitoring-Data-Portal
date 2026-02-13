import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'

const NATURE_OPTIONS = ['Mixed Feed', 'Feed Ingredient Manufacturer', 'Toll Manufacturer', 'Importer', 'Indentor', 'Supplier', 'Distributor', 'Retailer']
const ORG_OPTIONS = ['Sole Proprietorship', 'Partnership', 'Corporate', 'Cooperative']
const REMARKS_OPTIONS = ['New', 'Renewal', 'Amendment']

const initialState = {
  date: '', companyName: '', officeAddress: '', plantAddress: '', email: '', cellphone: '',
  natureOfBusiness: '', businessOrg: '', productLines: '',
  nutritionistName: '', prcIdNo: '', validity: '',
  certNo: '', dateIssued: '', fee: '', orNo: '', orDate: '', remarks: '',
}

export default function AnimalFeedForm() {
  const [form, setForm] = useState(initialState)
  const { submit, loading, message, setMessage } = useFormSubmit('animalFeed')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

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
            <label className="block text-sm font-medium text-primary mb-1">Date</label>
            <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Name of Company/Establishment</label>
          <input type="text" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" required />
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
            <label className="block text-sm font-medium text-primary mb-1">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Cellphone</label>
            <input type="text" value={form.cellphone} onChange={(e) => update('cellphone', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
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
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Product Lines</label>
          <input type="text" value={form.productLines} onChange={(e) => update('productLines', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Nutritionist/Vet Consultant Name</label>
            <input type="text" value={form.nutritionistName} onChange={(e) => update('nutritionistName', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">PRC ID No.</label>
            <input type="text" value={form.prcIdNo} onChange={(e) => update('prcIdNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Validity</label>
            <input type="text" value={form.validity} onChange={(e) => update('validity', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Cert No.</label>
            <input type="text" value={form.certNo} onChange={(e) => update('certNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Date Issued</label>
            <input type="date" value={form.dateIssued} onChange={(e) => update('dateIssued', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Fee</label>
            <input type="text" value={form.fee} onChange={(e) => update('fee', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">OR No.</label>
            <input type="text" value={form.orNo} onChange={(e) => update('orNo', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">OR Date</label>
            <input type="date" value={form.orDate} onChange={(e) => update('orDate', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Remarks</label>
            <select value={form.remarks} onChange={(e) => update('remarks', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary">
              <option value="">Select</option>
              {REMARKS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
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
