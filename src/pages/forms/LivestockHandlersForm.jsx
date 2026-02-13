import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { REGIONS, PROVINCES } from '../../lib/regions'

const OWNERSHIP_OPTIONS = ['Single Proprietorship/Individual', 'Corporation/Coop/Assn']
const BUSINESS_TYPES = ['Partnership', 'Corp', 'Gov', 'Coop', 'Assn', 'Club']
const APPLICANT_TYPES = ['Livestock Dealer', 'Poultry Dealer', 'By-Products Dealer', 'Birds/Pigeon Racers', 'Traders/Rep', 'Hauler', 'Others']
const CATEGORY_OPTIONS = ['Livestock Handler', 'Poultry Handler', 'By-Products Handler', 'Others']

const LIVESTOCK_COLS = ['Cattle', 'Carabao', 'Hogs', 'Goats', 'Horses']
const POULTRY_COLS = ['Chicken', 'DOC', 'Game Fowls']
const BYPRODUCTS_COLS = ['Eggs', 'Balut', 'Hides', 'Skin', 'Milk', 'Manure']

const emptyMatrix = (cols) => Object.fromEntries(cols.map((c) => [c, { volume: '', frequency: '' }]))

export default function LivestockHandlersForm() {
  const [ownershipType, setOwnershipType] = useState('')
  const [singleName, setSingleName] = useState({ last: '', first: '', mi: '' })
  const [companyName, setCompanyName] = useState('')
  const [repName, setRepName] = useState({ last: '', first: '', mi: '' })
  const [address, setAddress] = useState({ barangay: '', cityMuni: '', province: '', region: '' })
  const [businessType, setBusinessType] = useState('')
  const [contact, setContact] = useState({ tin: '', contactNo: '', email: '' })
  const [applicantType, setApplicantType] = useState('')
  const [category, setCategory] = useState('')
  const [livestock, setLivestock] = useState(() => emptyMatrix(LIVESTOCK_COLS))
  const [poultry, setPoultry] = useState(() => emptyMatrix(POULTRY_COLS))
  const [byProducts, setByProducts] = useState(() => emptyMatrix(BYPRODUCTS_COLS))
  const [region, setRegion] = useState('')
  const { submit, loading, message } = useFormSubmit('livestockHandlers')

  const provinces = PROVINCES

  const buildPayload = () => ({
    ownershipType,
    singleName,
    companyName,
    repName,
    address,
    businessType,
    contact,
    applicantType,
    category,
    livestock,
    poultry,
    byProducts,
    region,
    province: address.province,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submit(buildPayload())
    setOwnershipType('')
    setSingleName({ last: '', first: '', mi: '' })
    setCompanyName('')
    setRepName({ last: '', first: '', mi: '' })
    setAddress({ barangay: '', cityMuni: '', province: '', region: '' })
    setBusinessType('')
    setContact({ tin: '', contactNo: '', email: '' })
    setApplicantType('')
    setCategory('')
    setLivestock(emptyMatrix(LIVESTOCK_COLS))
    setPoultry(emptyMatrix(POULTRY_COLS))
    setByProducts(emptyMatrix(BYPRODUCTS_COLS))
    setRegion('')
  }

  const updateMatrix = (setter, key, field, value) => {
    setter((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  return (
    <FormLayout title="Livestock/Poultry/By-Products Handlers Registration">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Type of Ownership</label>
          <div className="flex gap-4">
            {OWNERSHIP_OPTIONS.map((o) => (
              <label key={o} className="flex items-center gap-2">
                <input type="radio" name="ownership" value={o} checked={ownershipType === o} onChange={() => setOwnershipType(o)} className="text-primary" />
                {o}
              </label>
            ))}
          </div>
        </div>

        {ownershipType === 'Single Proprietorship/Individual' && (
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Last Name</label>
              <input type="text" value={singleName.last} onChange={(e) => setSingleName((s) => ({ ...s, last: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">First Name</label>
              <input type="text" value={singleName.first} onChange={(e) => setSingleName((s) => ({ ...s, first: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Middle Initial</label>
              <input type="text" value={singleName.mi} onChange={(e) => setSingleName((s) => ({ ...s, mi: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" maxLength={2} />
            </div>
          </div>
        )}

        {ownershipType === 'Corporation/Coop/Assn' && (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Company Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" required />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-primary mb-1">Representative Last Name</label><input type="text" value={repName.last} onChange={(e) => setRepName((s) => ({ ...s, last: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-primary mb-1">First Name</label><input type="text" value={repName.first} onChange={(e) => setRepName((s) => ({ ...s, first: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-primary mb-1">MI</label><input type="text" value={repName.mi} onChange={(e) => setRepName((s) => ({ ...s, mi: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" maxLength={2} /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Type of Business</label>
              <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg">
                <option value="">Select</option>
                {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">Barangay</label><input type="text" value={address.barangay} onChange={(e) => setAddress((a) => ({ ...a, barangay: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">City/Municipality</label><input type="text" value={address.cityMuni} onChange={(e) => setAddress((a) => ({ ...a, cityMuni: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Region</label>
            <select value={address.region} onChange={(e) => setAddress((a) => ({ ...a, region: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg">
              <option value="">Select</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Province</label>
            <select value={address.province} onChange={(e) => setAddress((a) => ({ ...a, province: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg">
              <option value="">Select</option>
              {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-primary mb-1">TIN</label><input type="text" value={contact.tin} onChange={(e) => setContact((c) => ({ ...c, tin: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Contact No.</label><input type="text" value={contact.contactNo} onChange={(e) => setContact((c) => ({ ...c, contactNo: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-primary mb-1">Email</label><input type="email" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Type of Applicant</label>
            <select value={applicantType} onChange={(e) => setApplicantType(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg">
              <option value="">Select</option>
              {APPLICANT_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg">
              <option value="">Select</option>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <p className="font-medium text-primary mb-2">Livestock (Volume / Frequency)</p>
          <table className="w-full border border-border text-sm">
            <thead><tr className="bg-surface"><th className="border border-border p-2">Item</th><th className="border border-border p-2">Volume</th><th className="border border-border p-2">Frequency</th></tr></thead>
            <tbody>
              {LIVESTOCK_COLS.map((col) => (
                <tr key={col}>
                  <td className="border border-border p-2">{col}</td>
                  <td className="border border-border p-1"><input type="text" value={livestock[col].volume} onChange={(e) => updateMatrix(setLivestock, col, 'volume', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                  <td className="border border-border p-1"><input type="text" value={livestock[col].frequency} onChange={(e) => updateMatrix(setLivestock, col, 'frequency', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-primary mb-2">Poultry (Volume / Frequency)</p>
          <table className="w-full border border-border text-sm">
            <thead><tr className="bg-surface"><th className="border border-border p-2">Item</th><th className="border border-border p-2">Volume</th><th className="border border-border p-2">Frequency</th></tr></thead>
            <tbody>
              {POULTRY_COLS.map((col) => (
                <tr key={col}>
                  <td className="border border-border p-2">{col}</td>
                  <td className="border border-border p-1"><input type="text" value={poultry[col].volume} onChange={(e) => updateMatrix(setPoultry, col, 'volume', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                  <td className="border border-border p-1"><input type="text" value={poultry[col].frequency} onChange={(e) => updateMatrix(setPoultry, col, 'frequency', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-primary mb-2">By-Products (Volume / Frequency)</p>
          <table className="w-full border border-border text-sm">
            <thead><tr className="bg-surface"><th className="border border-border p-2">Item</th><th className="border border-border p-2">Volume</th><th className="border border-border p-2">Frequency</th></tr></thead>
            <tbody>
              {BYPRODUCTS_COLS.map((col) => (
                <tr key={col}>
                  <td className="border border-border p-2">{col}</td>
                  <td className="border border-border p-1"><input type="text" value={byProducts[col].volume} onChange={(e) => updateMatrix(setByProducts, col, 'volume', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                  <td className="border border-border p-1"><input type="text" value={byProducts[col].frequency} onChange={(e) => updateMatrix(setByProducts, col, 'frequency', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Origin (Area Coverage) - Region</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg">
            <option value="">Select Region</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
